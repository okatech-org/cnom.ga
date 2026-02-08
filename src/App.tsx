import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoProvider } from "@/contexts/DemoContext";
import Index from "./pages/Index";
import Pharmacovigilance from "./pages/Pharmacovigilance";
import Inscription from "./pages/Inscription";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import SuiviDossier from "./pages/SuiviDossier";
import MedecinDashboard from "./pages/MedecinDashboard";
import Annuaire from "./pages/Annuaire";
import Actualites from "./pages/Actualites";
import Contact from "./pages/Contact";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

// Role-based dashboards
import PresidentDashboard from "./pages/dashboards/PresidentDashboard";
import SGDashboard from "./pages/dashboards/SGDashboard";
import TresorierDashboard from "./pages/dashboards/TresorierDashboard";
import AgentDashboard from "./pages/dashboards/AgentDashboard";
import CommissionDashboard from "./pages/dashboards/CommissionDashboard";
import RegionalDashboard from "./pages/dashboards/RegionalDashboard";

// Dashboard sub-pages
import RepertoirePageRaw from "./pages/dashboards/modules/RepertoirePage";
import InscriptionsPageRaw from "./pages/dashboards/modules/InscriptionsPage";
import PaiementsPageRaw from "./pages/dashboards/modules/PaiementsPage";
import AnalyticsPageRaw from "./pages/dashboards/modules/AnalyticsPage";
import DashboardPageWrapper from "./components/DashboardPageWrapper";

// Wrapped sub-pages with dashboard layout
const RepertoirePage = () => <DashboardPageWrapper><RepertoirePageRaw /></DashboardPageWrapper>;
const InscriptionsPage = () => <DashboardPageWrapper><InscriptionsPageRaw /></DashboardPageWrapper>;
const PaiementsPage = () => <DashboardPageWrapper><PaiementsPageRaw /></DashboardPageWrapper>;
const AnalyticsPage = () => <DashboardPageWrapper><AnalyticsPageRaw /></DashboardPageWrapper>;

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/annuaire" element={<Annuaire />} />
            <Route path="/pharmacovigilance" element={<Pharmacovigilance />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/suivi" element={<MedecinDashboard />} />
            <Route path="/medecin" element={<MedecinDashboard />} />
            
            {/* Role-based dashboards */}
            <Route path="/dashboard/president" element={<PresidentDashboard />} />
            <Route path="/dashboard/sg" element={<SGDashboard />} />
            <Route path="/dashboard/tresorier" element={<TresorierDashboard />} />
            <Route path="/dashboard/agent" element={<AgentDashboard />} />
            <Route path="/dashboard/commission" element={<CommissionDashboard />} />
            <Route path="/dashboard/regional" element={<RegionalDashboard />} />

            {/* Dashboard sub-pages - President */}
            <Route path="/dashboard/president/repertoire" element={<RepertoirePage />} />
            <Route path="/dashboard/president/bi" element={<AnalyticsPage />} />

            {/* Dashboard sub-pages - SG */}
            <Route path="/dashboard/sg/repertoire" element={<RepertoirePage />} />
            <Route path="/dashboard/sg/inscriptions" element={<InscriptionsPage />} />
            <Route path="/dashboard/sg/finances" element={<PaiementsPage />} />
            <Route path="/dashboard/sg/bi" element={<AnalyticsPage />} />

            {/* Dashboard sub-pages - Tresorier */}
            <Route path="/dashboard/tresorier/cotisations" element={<PaiementsPage />} />
            <Route path="/dashboard/tresorier/rapport" element={<AnalyticsPage />} />

            {/* Dashboard sub-pages - Agent */}
            <Route path="/dashboard/agent/fiches" element={<RepertoirePage />} />
            <Route path="/dashboard/agent/verification" element={<InscriptionsPage />} />
            <Route path="/dashboard/agent/paiements" element={<PaiementsPage />} />

            {/* Dashboard sub-pages - Commission */}
            <Route path="/dashboard/commission/validation" element={<InscriptionsPage />} />

            {/* Dashboard sub-pages - Regional */}
            <Route path="/dashboard/regional/medecins" element={<RepertoirePage />} />
            <Route path="/dashboard/regional/cotisations" element={<PaiementsPage />} />
            <Route path="/dashboard/regional/indicateurs" element={<AnalyticsPage />} />

            {/* Admin sub-pages */}
            <Route path="/admin/repertoire" element={<RepertoirePage />} />
            <Route path="/admin/inscriptions" element={<InscriptionsPage />} />
            <Route path="/admin/paiements" element={<PaiementsPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DemoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
