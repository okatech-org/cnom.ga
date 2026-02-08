import { createContext, useContext, useState, ReactNode } from "react";

export type DemoRole = "admin" | "president" | "sg" | "tresorier" | "agent" | "commission" | "regional" | "medecin" | null;

interface DemoUser {
  email: string;
  role: DemoRole;
  name: string;
  title: string;
}

interface DemoContextType {
  isDemoMode: boolean;
  demoUser: DemoUser | null;
  enterDemoMode: (role: DemoRole) => void;
  exitDemoMode: () => void;
}

const DEMO_USERS: Record<NonNullable<DemoRole>, DemoUser> = {
  admin: {
    email: "admin@cnom-gabon.ga",
    role: "admin",
    name: "Admin Système",
    title: "Super Administrateur",
  },
  president: {
    email: "president@cnom-gabon.ga",
    role: "president",
    name: "Dr Emmanuel OGANDAGA",
    title: "Président CNOM",
  },
  sg: {
    email: "sg@cnom-gabon.ga",
    role: "sg",
    name: "Dr Georgette NDONG",
    title: "Secrétaire Général(e)",
  },
  tresorier: {
    email: "tresorier@cnom-gabon.ga",
    role: "tresorier",
    name: "Dr Madeleine MELLA-MBOUMBA",
    title: "Trésorier(e)",
  },
  agent: {
    email: "agent@cnom-gabon.ga",
    role: "agent",
    name: "Agent CNOM",
    title: "Agent Administratif",
  },
  commission: {
    email: "commission@cnom-gabon.ga",
    role: "commission",
    name: "Membre Commission",
    title: "Commission d'Inscription",
  },
  regional: {
    email: "regional@cnom-gabon.ga",
    role: "regional",
    name: "Président Provincial",
    title: "Conseil Régional",
  },
  medecin: {
    email: "medecin@cnom-gabon.ga",
    role: "medecin",
    name: "Dr Jean NZOGHE",
    title: "Médecin Inscrit",
  },
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const stored = sessionStorage.getItem("demo_mode");
    return stored === "true";
  });
  
  const [demoUser, setDemoUser] = useState<DemoUser | null>(() => {
    const storedRole = sessionStorage.getItem("demo_role") as DemoRole;
    return storedRole && DEMO_USERS[storedRole] ? DEMO_USERS[storedRole] : null;
  });

  const enterDemoMode = (role: DemoRole) => {
    if (role && DEMO_USERS[role]) {
      setIsDemoMode(true);
      setDemoUser(DEMO_USERS[role]);
      sessionStorage.setItem("demo_mode", "true");
      sessionStorage.setItem("demo_role", role);
    }
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    setDemoUser(null);
    sessionStorage.removeItem("demo_mode");
    sessionStorage.removeItem("demo_role");
  };

  return (
    <DemoContext.Provider value={{ isDemoMode, demoUser, enterDemoMode, exitDemoMode }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider");
  }
  return context;
};

export { DEMO_USERS };
