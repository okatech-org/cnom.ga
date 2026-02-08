import { QrCode, Smartphone, Shield, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ecpsVerification from "@/assets/ecps-verification.jpg";

const EcpsSection = () => {
  return (
    <section id="ecps" className="py-20 md:py-28 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/20 rounded-full text-secondary-foreground text-sm font-medium mb-6">
              <QrCode className="w-4 h-4 text-secondary" />
              Carte Professionnelle Virtuelle
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Votre identité médicale,{" "}
              <span className="text-primary">sécurisée</span> et{" "}
              <span className="text-secondary">vérifiable</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              La carte e-CPS remplace la carte plastique traditionnelle par une version 
              numérique sécurisée, accessible depuis votre smartphone. Un QR code dynamique 
              permet à quiconque de vérifier instantanément votre statut d'inscription.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {[
                { icon: Shield, text: "Signature cryptographique infalsifiable" },
                { icon: Clock, text: "Mise à jour du statut en temps réel" },
                { icon: Smartphone, text: "Accessible hors-ligne sur mobile" },
                { icon: CheckCircle, text: "Vérification instantanée par scan" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg">
                Activer ma carte e-CPS
              </Button>
              <Button variant="outline" size="lg">
                Scanner un QR code
              </Button>
            </div>
          </div>

          {/* Phone Mockup with Real Image */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Decorative Elements */}
            <div className="absolute -z-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 w-60 h-60 bg-secondary/20 rounded-full blur-2xl translate-x-20 translate-y-20" />

            {/* Featured Image */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img 
                  src={ecpsVerification} 
                  alt="Médecin gabonaise vérifiant sa carte e-CPS sur smartphone" 
                  className="w-80 h-auto object-cover"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -right-4 top-1/3 bg-white rounded-2xl shadow-cnom-elevated p-4 animate-bounce">
                <div className="flex items-center gap-2 text-status-active">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <div className="font-bold text-sm">Vérifié</div>
                    <div className="text-xs text-muted-foreground">En temps réel</div>
                  </div>
                </div>
              </div>

              {/* QR Code Badge */}
              <div className="absolute -left-4 bottom-1/4 bg-white rounded-2xl shadow-cnom-elevated p-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-bold text-sm text-foreground">e-CPS</div>
                    <div className="text-xs text-muted-foreground">Carte numérique</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcpsSection;
