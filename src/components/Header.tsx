import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import logoCnom from "@/assets/logo-cnom.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check if user is admin
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();
          setIsAdmin(!!data);
        } else {
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        setIsAdmin(!!data);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Oversized with overflow effect */}
          <Link to="/" className="flex items-center gap-3 group relative">
            <div className="absolute -top-4 md:top-2 lg:-top-2">
              <img 
                src={logoCnom} 
                alt="Logo CNOM Gabon" 
                className="w-24 h-24 lg:w-32 lg:h-32 object-contain group-hover:scale-105 transition-transform drop-shadow-lg"
              />
            </div>
            <div className="flex flex-col ml-28 lg:ml-36">
              <span className="font-display font-bold text-primary text-lg lg:text-xl leading-tight">
                CNOM
              </span>
              <span className="text-xs text-muted-foreground leading-tight hidden sm:block">
                Ordre des Médecins du Gabon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent">
              Accueil
            </Link>
            <Link to="/annuaire" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent">
              Annuaire Public
            </Link>
            <Link to="/pharmacovigilance" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent">
              Pharmacovigilance
            </Link>
            <Link to="/actualites" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent">
              Actualités
            </Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent">
              Contact
            </Link>
            <Link to="/demo" className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-accent">
              Démo
            </Link>
            {isAdmin && (
              <Link to="/admin" className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-accent">
                Administration
              </Link>
            )}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/suivi">
                    <User className="w-4 h-4 mr-2" />
                    Mon espace
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">Espace Médecin</Link>
                </Button>
                <Button size="sm">
                  Vérifier un médecin
                </Button>
              </>
            )}
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
              <Link to="/" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Accueil
              </Link>
              <Link to="/annuaire" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Annuaire Public
              </Link>
              <Link to="/pharmacovigilance" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Pharmacovigilance
              </Link>
              <Link to="/actualites" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Actualités
              </Link>
              <Link to="/contact" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Contact
              </Link>
              <Link to="/demo" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                Démo
              </Link>
              {user && (
                <Link to="/suivi" className="px-4 py-3 text-sm font-medium hover:bg-accent rounded-lg transition-colors">
                  Suivi de dossier
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="px-4 py-3 text-sm font-medium text-primary hover:bg-accent rounded-lg transition-colors">
                  Administration
                </Link>
              )}
            </nav>
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              {user ? (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/suivi">Mon espace</Link>
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/auth">Espace Médecin</Link>
                  </Button>
                  <Button className="w-full">
                    Vérifier un médecin
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
