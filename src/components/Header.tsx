import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-hero-gradient rounded-xl flex items-center justify-center shadow-cnom group-hover:shadow-cnom-elevated transition-shadow">
              <span className="text-white font-bold text-lg lg:text-xl">⚕</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-primary text-lg lg:text-xl leading-tight">
                CNOM
              </span>
              <span className="text-xs text-muted-foreground leading-tight hidden sm:block">
                Ordre des Médecins du Gabon
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <a href="#annuaire" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent">
              Annuaire Public
            </a>
            <div className="relative group">
              <button className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent flex items-center gap-1">
                Modules
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white rounded-xl shadow-cnom-elevated border border-border p-2 min-w-[200px]">
                  <a href="#inscription" className="block px-4 py-2 text-sm hover:bg-accent rounded-lg transition-colors">
                    Inscription en ligne
                  </a>
                  <a href="#ecps" className="block px-4 py-2 text-sm hover:bg-accent rounded-lg transition-colors">
                    Carte e-CPS
                  </a>
                  <a href="#cotisations" className="block px-4 py-2 text-sm hover:bg-accent rounded-lg transition-colors">
                    Cotisations
                  </a>
                </div>
              </div>
            </div>
            <a href="#statistiques" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent">
              Statistiques
            </a>
            <a href="#contact" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent">
              Contact
            </a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" size="sm">
              Espace Médecin
            </Button>
            <Button size="sm">
              Vérifier un médecin
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-1">
              <a href="#annuaire" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Annuaire Public
              </a>
              <a href="#inscription" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Inscription en ligne
              </a>
              <a href="#ecps" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Carte e-CPS
              </a>
              <a href="#cotisations" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Cotisations
              </a>
              <a href="#statistiques" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Statistiques
              </a>
              <a href="#contact" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Contact
              </a>
            </nav>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="outline" className="w-full">
                Espace Médecin
              </Button>
              <Button className="w-full">
                Vérifier un médecin
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
