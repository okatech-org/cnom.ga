import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AirtelCallback {
  transaction: {
    id: string;
    status_code: string;
    message: string;
    airtel_money_id: string;
  };
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

    const body: AirtelCallback = await req.json();
    console.log('Payment webhook received:', JSON.stringify(body));

    const { transaction } = body;

    if (!transaction?.id) {
      return new Response(
        JSON.stringify({ error: 'Invalid callback data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the payment by transaction reference
    const { data: payment, error: findError } = await supabaseClient
      .from('payments')
      .select('*')
      .eq('transaction_id', transaction.id)
      .single();

    if (findError || !payment) {
      console.error('Payment not found:', transaction.id);
      return new Response(
        JSON.stringify({ error: 'Payment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine payment status based on Airtel response
    let newStatus: 'completed' | 'failed' = 'failed';
    if (transaction.status_code === 'TS' || transaction.status_code === '200') {
      newStatus = 'completed';
    }

    // Update payment status
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        payment_status: newStatus,
        paid_at: newStatus === 'completed' ? new Date().toISOString() : null,
      })
      .eq('id', payment.id);

    if (updateError) {
      console.error('Failed to update payment:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update payment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If inscription fee is paid, update the application status
    if (newStatus === 'completed' && payment.payment_type === 'inscription') {
      const { data: application } = await supabaseClient
        .from('applications')
        .select('id, status')
        .eq('profile_id', payment.profile_id)
        .single();

      if (application && application.status === 'submitted') {
        await supabaseClient
          .from('applications')
          .update({ status: 'under_review' })
          .eq('id', application.id);
      }
    }

    console.log(`Payment ${payment.id} updated to ${newStatus}`);

    return new Response(
      JSON.stringify({ success: true, status: newStatus }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
