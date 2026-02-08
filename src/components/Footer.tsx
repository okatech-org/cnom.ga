import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import logoCnom from "@/assets/logo-cnom.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-white/90">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logoCnom} 
                alt="CNOM Gabon" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <span className="font-display font-bold text-xl text-white">
                  CNOM
                </span>
                <span className="block text-xs text-white/60">
                  Gabon
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              L'Ordre National des Médecins du Gabon garantit la qualité et 
              l'éthique de l'exercice médical sur le territoire national.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-6">Liens rapides</h4>
            <ul className="space-y-3">
              {[
                { label: "Annuaire des médecins", href: "#annuaire" },
                { label: "Vérifier un médecin", href: "#verification" },
                { label: "S'inscrire au Tableau", href: "#inscription" },
                { label: "Espace médecin", href: "#espace" },
                { label: "Payer ma cotisation", href: "#cotisation" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-cnom-gold transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional */}
          <div>
            <h4 className="font-semibold text-white mb-6">Institutionnel</h4>
            <ul className="space-y-3">
              {[
                { label: "À propos du CNOM", href: "#" },
                { label: "Le Bureau National", href: "#" },
                { label: "Conseils Régionaux", href: "#" },
                { label: "Code de déontologie", href: "#" },
                { label: "Textes juridiques", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/60 hover:text-cnom-gold transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cnom-gold flex-shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">
                  Quartier Nombakélé, Libreville<br />
                  République Gabonaise
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cnom-gold flex-shrink-0" />
                <a href="tel:+24101000000" className="text-white/60 hover:text-white text-sm transition-colors">
                  +241 01 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cnom-gold flex-shrink-0" />
                <a href="mailto:contact@cnom-gabon.ga" className="text-white/60 hover:text-white text-sm transition-colors">
                  contact@cnom-gabon.ga
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <div>
              © 2026 Ordre National des Médecins du Gabon. Tous droits réservés.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white/80 transition-colors">
                Mentions légales
              </a>
              <a href="#" className="hover:text-white/80 transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="hover:text-white/80 transition-colors">
                Conditions d'utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
