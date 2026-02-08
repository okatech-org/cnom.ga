import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactInfo = [
    {
        icon: MapPin,
        title: "Adresse",
        content: "Quartier Nombakélé, Libreville",
        color: "text-primary",
        bgColor: "bg-primary/10",
    },
    {
        icon: Phone,
        title: "Téléphone",
        content: "+241 01 00 00 00",
        href: "tel:+24101000000",
        color: "text-cnom-gold",
        bgColor: "bg-cnom-gold/10",
    },
    {
        icon: Mail,
        title: "Email",
        content: "contact@cnom-gabon.ga",
        href: "mailto:contact@cnom-gabon.ga",
        color: "text-cnom-sky",
        bgColor: "bg-cnom-sky/10",
    },
    {
        icon: Clock,
        title: "Horaires",
        content: "Lun - Ven : 8h00 - 16h00",
        color: "text-cnom-rose",
        bgColor: "bg-cnom-rose/10",
    },
];

const ContactSection = () => {
    return (
        <section id="contact" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                        Contact
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Contactez-nous
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Une question ? L'équipe du CNOM est à votre disposition.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
                    {/* Contact Info Cards - Left */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        {contactInfo.map((info) => (
                            <div
                                key={info.title}
                                className="bg-card border border-border rounded-xl p-5 hover:shadow-cnom transition-all duration-300 group"
                            >
                                <div className={`w-10 h-10 ${info.bgColor} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                    <info.icon className={`w-5 h-5 ${info.color}`} />
                                </div>
                                <h3 className="font-semibold text-foreground text-sm mb-1">{info.title}</h3>
                                {info.href ? (
                                    <a href={info.href} className="text-sm text-primary hover:underline">
                                        {info.content}
                                    </a>
                                ) : (
                                    <p className="text-sm text-muted-foreground">{info.content}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mini Contact Form - Right */}
                    <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6 shadow-cnom">
                        <h3 className="font-display text-xl font-bold text-foreground mb-5">
                            Envoyez-nous un message
                        </h3>
                        <form className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input placeholder="Votre nom" />
                                <Input placeholder="Votre email" type="email" />
                            </div>
                            <Input placeholder="Objet du message" />
                            <Textarea
                                placeholder="Décrivez votre demande..."
                                className="min-h-[100px] resize-none"
                            />
                            <Button type="submit" className="w-full gap-2">
                                <Send className="w-4 h-4" />
                                Envoyer le message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
