import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useDemo, DemoRole } from "@/contexts/DemoContext";
import { supabase } from "@/integrations/supabase/client";

type RoleType = DemoRole | "public";

interface UseRoleAccessOptions {
  allowedRoles: RoleType[];
  redirectTo?: string;
}

export const useRoleAccess = ({ allowedRoles, redirectTo = "/demo" }: UseRoleAccessOptions) => {
  const { user, loading: authLoading } = useAuth();
  const { isDemoMode, demoUser } = useDemo();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<RoleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      // Demo mode: use demo role directly
      if (isDemoMode && demoUser) {
        const role = demoUser.role;
        setUserRole(role);
        const access = allowedRoles.includes(role as RoleType);
        setHasAccess(access);
        setLoading(false);
        
        if (!access) {
          navigate(redirectTo);
        }
        return;
      }

      // Real auth mode
      if (authLoading) return;

      if (!user) {
        setUserRole(null);
        setHasAccess(allowedRoles.includes("public"));
        setLoading(false);
        
        if (!allowedRoles.includes("public")) {
          navigate(redirectTo);
        }
        return;
      }

      // Check user role from database
      try {
        const { data: roleData, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error || !roleData) {
          // No role found - treat as regular user/medecin
          setUserRole("medecin");
          const access = allowedRoles.includes("medecin");
          setHasAccess(access);
          
          if (!access) {
            navigate(redirectTo);
          }
        } else {
          // Map database role to app role
          const dbRole = roleData.role;
          const mappedRole: RoleType = 
            dbRole === "super_admin" ? "admin" :
            dbRole === "approver" ? "commission" :
            dbRole === "treasurer" ? "tresorier" :
            "medecin";
          
          setUserRole(mappedRole);
          const access = allowedRoles.includes(mappedRole);
          setHasAccess(access);
          
          if (!access) {
            navigate(redirectTo);
          }
        }
      } catch {
        setUserRole("medecin");
        setHasAccess(allowedRoles.includes("medecin"));
        
        if (!allowedRoles.includes("medecin")) {
          navigate(redirectTo);
        }
      }
      
      setLoading(false);
    };

    checkAccess();
  }, [user, authLoading, isDemoMode, demoUser, allowedRoles, navigate, redirectTo]);

  return { userRole, loading, hasAccess, isDemoMode, demoUser };
};
