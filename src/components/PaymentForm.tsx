import { useState } from "react";
import { CreditCard, Phone, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentFormProps {
  profileId: string;
  amount: number;
  paymentType: "inscription" | "cotisation_semestrielle";
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm = ({
  profileId,
  amount,
  paymentType,
  onSuccess,
  onCancel,
}: PaymentFormProps) => {
  const [phone, setPhone] = useState("");
  const [provider, setProvider] = useState<"airtel_money" | "moov_money">("airtel_money");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const { toast } = useToast();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || phone.length < 8) {
      toast({
        title: "Numéro invalide",
        description: "Veuillez entrer un numéro de téléphone valide.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPaymentStatus("pending");

    try {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.access_token) {
        throw new Error("Non authentifié");
      }

      const { data, error } = await supabase.functions.invoke("mobile-payment", {
        body: {
          phone: phone,
          amount: amount,
          payment_type: paymentType,
          provider: provider,
          profile_id: profileId,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setPaymentStatus("success");
        toast({
          title: data.demo_mode ? "Paiement simulé" : "Paiement initié",
          description: data.message,
        });

        // Wait a moment then call onSuccess
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        throw new Error(data?.message || "Échec du paiement");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur s'est produite lors du paiement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentStatus === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-teal-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Paiement réussi !
        </h3>
        <p className="text-muted-foreground">
          Votre paiement de {formatAmount(amount)} a été traité avec succès.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Montant à payer</span>
          <span className="font-bold text-lg text-primary">{formatAmount(amount)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {paymentType === "inscription"
            ? "Frais d'inscription au Tableau de l'Ordre"
            : "Cotisation semestrielle"}
        </p>
      </div>

      <div className="space-y-4">
        <Label>Mode de paiement</Label>
        <RadioGroup
          value={provider}
          onValueChange={(value) => setProvider(value as "airtel_money" | "moov_money")}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem
              value="airtel_money"
              id="airtel"
              className="peer sr-only"
            />
            <Label
              htmlFor="airtel"
              className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                <Phone className="w-6 h-6 text-red-600" />
              </div>
              <span className="font-semibold">Airtel Money</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="moov_money"
              id="moov"
              className="peer sr-only"
            />
            <Label
              htmlFor="moov"
              className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <span className="font-semibold">Moov Money</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            +241
          </span>
          <Input
            id="phone"
            type="tel"
            placeholder="XX XX XX XX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            className="pl-14"
            maxLength={9}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Vous recevrez une demande de confirmation sur ce numéro.
        </p>
      </div>

      {paymentStatus === "pending" && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Loader2 className="w-5 h-5 text-amber-600 animate-spin flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Paiement en cours...</p>
              <p>Veuillez confirmer le paiement sur votre téléphone.</p>
            </div>
          </div>
        </div>
      )}

      {paymentStatus === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">Échec du paiement</p>
              <p>Veuillez réessayer ou utiliser un autre mode de paiement.</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !phone}
          className="flex-1 gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Payer {formatAmount(amount)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
