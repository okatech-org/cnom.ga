import { Menu, Bell, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useDemo } from "@/contexts/DemoContext";
import { useAuth } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  title: string;
  roleTitle: string;
  roleIcon: string;
  onMenuClick: () => void;
}

export const DashboardHeader = ({ 
  title, 
  roleTitle, 
  roleIcon, 
  onMenuClick 
}: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isDemoMode, demoUser, exitDemoMode } = useDemo();

  const handleSignOut = async () => {
    if (isDemoMode) {
      exitDemoMode();
      navigate("/demo");
    } else {
      await signOut();
      navigate("/");
    }
  };

  const displayName = isDemoMode ? demoUser?.name : user?.email?.split("@")[0];
  const displayEmail = isDemoMode ? demoUser?.email : user?.email;

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          <Button variant="ghost" size="icon" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{roleIcon}</span>
            <span className="font-semibold text-foreground text-sm">{roleTitle}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{displayEmail || "Utilisateur"}</DropdownMenuLabel>
              {isDemoMode && (
                <DropdownMenuLabel className="font-normal text-xs text-amber-600">
                  Mode démo
                </DropdownMenuLabel>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                {isDemoMode ? "Quitter la démo" : "Déconnexion"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:flex items-center justify-between h-16 px-6 bg-background border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{displayName || "Demo"}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              {isDemoMode && (
                <DropdownMenuLabel className="font-normal text-xs text-amber-600">
                  Mode démo actif
                </DropdownMenuLabel>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/demo")}>
                Retour à la démo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                {isDemoMode ? "Quitter la démo" : "Déconnexion"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
