import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useDemo } from "@/contexts/DemoContext";

interface DashboardPageWrapperProps {
  children: ReactNode;
}

// Map route prefixes to role configurations
const getRoleFromPath = (pathname: string) => {
  if (pathname.startsWith("/admin")) {
    return { role: "admin", title: "Super Administrateur", icon: "⚙️", color: "bg-red-600" };
  }
  if (pathname.startsWith("/dashboard/president")) {
    return { role: "president", title: "Président CNOM", icon: "🏛️", color: "bg-primary" };
  }
  if (pathname.startsWith("/dashboard/sg")) {
    return { role: "sg", title: "Secrétaire Général", icon: "📋", color: "bg-violet-600" };
  }
  if (pathname.startsWith("/dashboard/tresorier")) {
    return { role: "tresorier", title: "Trésorier", icon: "💰", color: "bg-amber-600" };
  }
  if (pathname.startsWith("/dashboard/agent")) {
    return { role: "agent", title: "Agent Administratif", icon: "👤", color: "bg-sky-600" };
  }
  if (pathname.startsWith("/dashboard/commission")) {
    return { role: "commission", title: "Commission d'Inscription", icon: "✅", color: "bg-emerald-600" };
  }
  if (pathname.startsWith("/dashboard/regional")) {
    return { role: "regional", title: "Conseil Régional", icon: "🗺️", color: "bg-pink-600" };
  }
  return { role: "admin", title: "Dashboard", icon: "📊", color: "bg-primary" };
};

export const DashboardPageWrapper = ({ children }: DashboardPageWrapperProps) => {
  const location = useLocation();
  const { isDemoMode, demoUser } = useDemo();
  
  // Get role config from path or from demo user
  const pathRole = getRoleFromPath(location.pathname);
  const roleConfig = isDemoMode && demoUser ? {
    role: demoUser.role || pathRole.role,
    title: demoUser.title || pathRole.title,
    icon: pathRole.icon,
    color: pathRole.color,
  } : pathRole;

  return (
    <DashboardLayout
      role={roleConfig.role}
      roleTitle={roleConfig.title}
      roleIcon={roleConfig.icon}
      roleColor={roleConfig.color}
    >
      {children}
    </DashboardLayout>
  );
};

export default DashboardPageWrapper;
