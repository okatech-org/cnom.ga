import { QrCode, Smartphone, Shield, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

          {/* Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Decorative Elements */}
            <div className="absolute -z-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -z-10 w-60 h-60 bg-secondary/20 rounded-full blur-2xl translate-x-20 translate-y-20" />

            {/* Phone */}
            <div className="relative w-72 md:w-80">
              <div className="bg-foreground rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-card rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-primary h-8 flex items-center justify-center">
                    <div className="w-20 h-5 bg-foreground/20 rounded-full" />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 bg-gradient-to-b from-primary via-primary to-cnom-green-dark min-h-[450px]">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                        République Gabonaise
                      </div>
                      <div className="text-white font-bold text-lg">
                        ORDRE DES MÉDECINS
                      </div>
                    </div>

                    {/* Photo */}
                    <div className="w-24 h-28 bg-white/10 rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-white/20">
                      <span className="text-white/60 text-4xl">👤</span>
                    </div>

                    {/* Name */}
                    <div className="text-center mb-6">
                      <div className="text-white font-bold text-xl mb-1">
                        Dr. Marie-Claire MBOUROU
                      </div>
                      <div className="text-cnom-gold font-medium">
                        Cardiologie
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-center mb-6">
                      <div className="text-white/80 text-sm">
                        N° Ordre: <span className="font-bold text-white">1842</span>
                      </div>
                      <div className="text-white/80 text-sm">
                        Libreville, Estuaire
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center mb-6">
                      <div className="flex items-center gap-2 bg-status-active/20 text-white px-4 py-2 rounded-full">
                        <CheckCircle className="w-4 h-4 text-status-active" />
                        <span className="font-semibold text-sm">INSCRIT ET EN RÈGLE</span>
                      </div>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="bg-white rounded-xl p-4 mx-auto w-32 h-32 flex items-center justify-center">
                      <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: 25 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 rounded-sm ${
                              Math.random() > 0.5 ? "bg-foreground" : "bg-transparent"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="text-center mt-4 text-white/60 text-xs">
                      Scannez pour vérifier
                    </div>
                  </div>
                </div>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcpsSection;
