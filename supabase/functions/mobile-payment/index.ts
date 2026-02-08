import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  phone: string;
  amount: number;
  payment_type: 'inscription' | 'cotisation_semestrielle';
  provider: 'airtel_money' | 'moov_money';
  profile_id: string;
}

interface AirtelTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface AirtelPaymentResponse {
  status: {
    code: string;
    message: string;
    result_code: string;
    success: boolean;
  };
  data: {
    transaction: {
      id: string;
      status: string;
    };
  };
}

// Airtel Money API Configuration
const AIRTEL_BASE_URL = Deno.env.get('AIRTEL_API_URL') || 'https://openapiuat.airtel.africa';
const AIRTEL_CLIENT_ID = Deno.env.get('AIRTEL_CLIENT_ID');
const AIRTEL_CLIENT_SECRET = Deno.env.get('AIRTEL_CLIENT_SECRET');
const AIRTEL_COUNTRY = 'GA'; // Gabon
const AIRTEL_CURRENCY = 'XAF';

async function getAirtelToken(): Promise<string> {
  const response = await fetch(`${AIRTEL_BASE_URL}/auth/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: AIRTEL_CLIENT_ID,
      client_secret: AIRTEL_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    console.error('Failed to get Airtel token:', await response.text());
    throw new Error('Failed to authenticate with Airtel');
  }

  const data: AirtelTokenResponse = await response.json();
  return data.access_token;
}

async function initiateAirtelPayment(
  token: string,
  phone: string,
  amount: number,
  reference: string
): Promise<AirtelPaymentResponse> {
  const response = await fetch(`${AIRTEL_BASE_URL}/merchant/v1/payments/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-Country': AIRTEL_COUNTRY,
      'X-Currency': AIRTEL_CURRENCY,
    },
    body: JSON.stringify({
      reference: reference,
      subscriber: {
        country: AIRTEL_COUNTRY,
        currency: AIRTEL_CURRENCY,
        msisdn: phone.replace(/\D/g, '').slice(-9), // Last 9 digits
      },
      transaction: {
        amount: amount,
        country: AIRTEL_COUNTRY,
        currency: AIRTEL_CURRENCY,
        id: reference,
      },
    }),
  });

  if (!response.ok) {
    console.error('Airtel payment failed:', await response.text());
    throw new Error('Payment initiation failed');
  }

  return await response.json();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify JWT and get user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: PaymentRequest = await req.json();
    const { phone, amount, payment_type, provider, profile_id } = body;

    // Validate required fields
    if (!phone || !amount || !payment_type || !provider || !profile_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the profile belongs to the user
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('id, user_id')
      .eq('id', profile_id)
      .single();

    if (profileError || !profile || profile.user_id !== user.id) {
      return new Response(
        JSON.stringify({ error: 'Profile not found or unauthorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique reference
    const reference = `CNOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create pending payment record
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        profile_id: profile_id,
        amount: amount,
        payment_type: payment_type,
        payment_status: 'pending',
        payment_method: provider,
        transaction_id: reference,
        description: payment_type === 'inscription' 
          ? 'Frais d\'inscription au Tableau de l\'Ordre'
          : 'Cotisation semestrielle',
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment record error:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Failed to create payment record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if API keys are configured
    if (!AIRTEL_CLIENT_ID || !AIRTEL_CLIENT_SECRET) {
      // Development mode - simulate payment
      console.log('Development mode: Simulating payment');
      
      // Update payment to completed (for demo)
      await supabaseClient
        .from('payments')
        .update({ 
          payment_status: 'completed',
          paid_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Paiement simulé (mode développement)',
          payment_id: payment.id,
          reference: reference,
          demo_mode: true,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Production mode - initiate real payment
    if (provider === 'airtel_money') {
      try {
        const token = await getAirtelToken();
        const paymentResult = await initiateAirtelPayment(token, phone, amount, reference);

        if (paymentResult.status.success) {
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Veuillez confirmer le paiement sur votre téléphone',
              payment_id: payment.id,
              reference: reference,
              transaction_id: paymentResult.data.transaction.id,
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          // Update payment to failed
          await supabaseClient
            .from('payments')
            .update({ payment_status: 'failed' })
            .eq('id', payment.id);

          return new Response(
            JSON.stringify({
              success: false,
              message: paymentResult.status.message,
            }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (error) {
        console.error('Airtel payment error:', error);
        
        // Update payment to failed
        await supabaseClient
          .from('payments')
          .update({ payment_status: 'failed' })
          .eq('id', payment.id);

        return new Response(
          JSON.stringify({ error: 'Payment processing failed' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Moov Money - similar integration would go here
      return new Response(
        JSON.stringify({ 
          error: 'Moov Money integration pending',
          message: 'Veuillez utiliser Airtel Money pour le moment'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
