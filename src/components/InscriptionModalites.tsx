import { Info, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface InscriptionModalitesProps {
  variant?: "full" | "compact";
}

export const InscriptionModalites = ({ variant = "full" }: InscriptionModalitesProps) => {
  const documents = [
    "2 photos d'identité couleurs",
    "1 lettre manuscrite de demande d'inscription adressée au Président du CNOM",
    "1 photocopie certifiée (soit à la faculté soit au rectorat) conforme du ou des diplômes",
    "1 extrait n°3 de casier judiciaire",
    "1 curriculum vitae pour les non-gabonais",
    "Attestation d'homologation",
  ];

  const cotisationsInfo = [
    "10 000 FCFA par mois",
    "Encaissable par semestre",
    "Le 1er semestre est payable avant le 31 Mars",
    "Le second semestre avant le 30 Juin de l'année en cours",
    "Un virement permanent est vivement conseillé",
    "Un moratoire d'exemption de cotisation de 6 mois est accordé à partir de la date de soutenance",
  ];

  if (variant === "compact") {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <CardTitle className="text-base">Dossier à constituer</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {documents.slice(0, 4).map((doc, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{doc}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-secondary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <CardTitle className="text-base">Frais d'inscription</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">Ils s'élèvent à <strong className="text-foreground">50 000 FCFA</strong> en numéraire</span>
            </div>
            <Separator />
            <div className="flex items-start gap-2 text-sm">
              <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Les titulaires de l'ancienne carte sont exonérés</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <CardTitle className="text-base">Les cotisations</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {cotisationsInfo.slice(0, 4).map((info, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{info}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Modalités d'inscription
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto">
            <strong>NB:</strong> Les Inscriptions se font uniquement dans nos locaux sis à NOMBAKELE
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Étape 1: Documents */}
          <Card className="relative overflow-hidden">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-full flex items-end justify-end pr-4 pb-4">
              <span className="text-primary font-bold text-sm transform -rotate-45">ÉTAPE</span>
            </div>
            <CardHeader className="pt-8">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-primary">1.</span>
              </div>
              <CardTitle className="text-center text-lg uppercase tracking-wide">
                Dossier à constituer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{doc}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Étape 2: Frais */}
          <Card className="relative overflow-hidden border-secondary/50">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-secondary/20 rounded-full flex items-end justify-end pr-4 pb-4">
              <span className="text-secondary-foreground font-bold text-sm transform -rotate-45">ÉTAPE</span>
            </div>
            <CardHeader className="pt-8">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-secondary-foreground">2.</span>
              </div>
              <CardTitle className="text-center text-lg uppercase tracking-wide">
                Les frais d'inscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Ils s'élèvent à <strong className="text-foreground">50 000 FCFA</strong> en numéraire
                </span>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 text-red-500 flex-shrink-0">✗</span>
                <span className="text-sm text-muted-foreground">
                  Les titulaires de l'ancienne carte sont exonérés
                </span>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Prière de présenter l'ancienne carte lors de l'inscription
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Étape 3: Cotisations */}
          <Card className="relative overflow-hidden">
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-full flex items-end justify-end pr-4 pb-4">
              <span className="text-primary font-bold text-sm transform -rotate-45">ÉTAPE</span>
            </div>
            <CardHeader className="pt-8">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-primary">3.</span>
              </div>
              <CardTitle className="text-center text-lg uppercase tracking-wide">
                Les cotisations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cotisationsInfo.map((info, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{info}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InscriptionModalites;
