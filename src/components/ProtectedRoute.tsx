import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useDemo, DemoRole } from "@/contexts/DemoContext";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: (DemoRole | "public")[];
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = "/demo" 
}: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isDemoMode, demoUser } = useDemo();

  // Show loading state while checking auth
  if (authLoading && !isDemoMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Demo mode: check if demo user role is allowed
  if (isDemoMode && demoUser) {
    const hasAccess = allowedRoles.includes(demoUser.role);
    if (!hasAccess) {
      return <Navigate to={redirectTo} replace />;
    }
    return <>{children}</>;
  }

  // Real auth mode: if public is allowed, let anyone through
  if (allowedRoles.includes("public")) {
    return <>{children}</>;
  }

  // Real auth mode: require authentication
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // For now, allow authenticated users through
  // In production, you would check the user's role from the database
  return <>{children}</>;
};

export default ProtectedRoute;
