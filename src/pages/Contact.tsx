import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import contactMap from "@/assets/contact-map.png";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-cnom-gold/5">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Contact
              </span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Contactez-nous
              </h1>
              <p className="text-muted-foreground text-lg">
                Une question ? Une demande d'information ? L'équipe du CNOM est à votre disposition
                pour répondre à toutes vos interrogations.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-card border border-border rounded-2xl p-8 shadow-cnom">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Envoyez-nous un message
                </h2>
                <form className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nom">Nom</Label>
                      <Input id="nom" placeholder="Votre nom" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prenom">Prénom</Label>
                      <Input id="prenom" placeholder="Votre prénom" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="votre@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input id="telephone" type="tel" placeholder="+241 XX XX XX XX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sujet">Sujet</Label>
                    <Input id="sujet" placeholder="Objet de votre message" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Décrivez votre demande..."
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Envoyer le message
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Informations de contact
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Vous pouvez nous contacter par téléphone, email ou en vous rendant
                    directement au siège de l'Ordre.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Adresse</h3>
                      <p className="text-muted-foreground text-sm">
                        Quartier Nombakélé<br />
                        Libreville, République Gabonaise
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Téléphone</h3>
                      <a href="tel:+24101000000" className="text-primary hover:underline">
                        +241 01 00 00 00
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a href="mailto:contact@cnom-gabon.ga" className="text-primary hover:underline">
                        contact@cnom-gabon.ga
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Horaires d'ouverture</h3>
                      <p className="text-muted-foreground text-sm">
                        Lundi - Vendredi : 8h00 - 16h00<br />
                        Samedi - Dimanche : Fermé
                      </p>
                    </div>
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="aspect-video bg-muted rounded-xl overflow-hidden border border-border shadow-sm">
                  <img
                    src={contactMap}
                    alt="Carte de localisation du CNOM à Libreville"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
