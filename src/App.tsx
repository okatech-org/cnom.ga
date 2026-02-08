import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pharmacovigilance from "./pages/Pharmacovigilance";
import Inscription from "./pages/Inscription";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import SuiviDossier from "./pages/SuiviDossier";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          <Route path="/suivi" element={<SuiviDossier />} />
          
          {/* Role-based dashboards */}
          <Route path="/dashboard/president" element={<PresidentDashboard />} />
          <Route path="/dashboard/sg" element={<SGDashboard />} />
          <Route path="/dashboard/tresorier" element={<TresorierDashboard />} />
          <Route path="/dashboard/agent" element={<AgentDashboard />} />
          <Route path="/dashboard/commission" element={<CommissionDashboard />} />
          <Route path="/dashboard/regional" element={<RegionalDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
