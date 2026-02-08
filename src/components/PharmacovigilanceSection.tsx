import { AlertTriangle, FileText, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PharmacovigilanceSection = () => {
  return (
    <section id="pharmacovigilance" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-4">
              Pharmacovigilance
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Signaler un effet indésirable médicamenteux
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              La pharmacovigilance est essentielle pour garantir la sécurité des patients. 
              En tant que professionnel de santé, vous êtes tenu de déclarer tout effet 
              indésirable suspecté lié à l'utilisation d'un médicament.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Déclaration obligatoire</h4>
                  <p className="text-muted-foreground text-sm">
                    Les médecins doivent signaler tout effet indésirable grave ou inattendu.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Formulaire simplifié</h4>
                  <p className="text-muted-foreground text-sm">
                    Notre formulaire en ligne permet une déclaration rapide et sécurisée.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Confidentialité garantie</h4>
                  <p className="text-muted-foreground text-sm">
                    Les données sont protégées conformément à la Loi 001/2011.
                  </p>
                </div>
              </div>
            </div>

            <Link to="/pharmacovigilance">
              <Button size="lg" className="gap-2">
                Faire une déclaration
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-8 lg:p-12">
              <div className="bg-background rounded-2xl shadow-cnom p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Centre de Pharmacovigilance</h4>
                    <p className="text-sm text-muted-foreground">CNOM Gabon</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground text-sm">Déclarations ce mois</span>
                    <span className="font-semibold text-foreground">47</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground text-sm">En cours d'analyse</span>
                    <span className="font-semibold text-amber-600">12</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground text-sm">Traitées</span>
                    <span className="font-semibold text-primary">35</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-cnom-gold/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PharmacovigilanceSection;
