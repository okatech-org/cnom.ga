import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DirectoryPreview from "@/components/DirectoryPreview";
import QRScanner from "@/components/QRScanner";
import GabonMap from "@/components/GabonMap";
import { Users, Map as MapIcon, Search, Activity, Building2, Stethoscope } from "lucide-react";

const tabs = [
  { id: "annuaire", label: "Annuaire", icon: Search, description: "Rechercher un médecin" },
  { id: "carte", label: "Carte sanitaire", icon: MapIcon, description: "Répartition géographique" },
] as const;

type TabId = typeof tabs[number]["id"];

const summaryStats = [
  { label: "Médecins inscrits", value: "2 197", icon: Stethoscope, color: "from-[hsl(174,72%,30%)] to-[hsl(200,85%,58%)]", iconBg: "bg-primary/10", iconColor: "text-primary" },
  { label: "Provinces couvertes", value: "9 / 9", icon: Building2, color: "from-[hsl(38,92%,55%)] to-[hsl(38,85%,45%)]", iconBg: "bg-cnom-gold/10", iconColor: "text-cnom-gold" },
  { label: "Spécialités", value: "47", icon: Activity, color: "from-[hsl(200,85%,58%)] to-[hsl(190,75%,48%)]", iconBg: "bg-cnom-sky/10", iconColor: "text-cnom-sky" },
  { label: "Ratio national", value: "10.2", sublabel: "/ 10 000 hab.", icon: Users, color: "from-[hsl(340,68%,62%)] to-[hsl(345,55%,48%)]", iconBg: "bg-cnom-rose/10", iconColor: "text-cnom-rose" },
];

const Annuaire = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId) || "annuaire";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabId;
    if (tabParam && (tabParam === "annuaire" || tabParam === "carte")) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-hero-gradient py-16 md:py-20">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cnom-sky/20 rounded-full blur-3xl" />
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  Annuaire Public
                </h1>
                <p className="text-white/80 text-lg max-w-xl">
                  Consultez le Tableau de l'Ordre des Médecins du Gabon.
                  Vérifiez le statut d'un praticien ou explorez la carte sanitaire.
                </p>
              </div>
              <div className="flex-shrink-0">
                <QRScanner />
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-10">
              {summaryStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-md border border-white/15 rounded-xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="text-white/70 text-sm font-medium truncate">{stat.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                    {stat.sublabel && (
                      <span className="text-white/50 text-sm">{stat.sublabel}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4">
            <nav className="flex gap-1 py-2" role="tablist">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300
                      ${isActive
                        ? "bg-primary text-primary-foreground shadow-cnom"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }
                    `}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={`hidden md:inline text-xs ${isActive ? "text-primary-foreground/70" : "text-muted-foreground/60"}`}>
                      — {tab.description}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in" key={activeTab}>
          {activeTab === "annuaire" && <DirectoryPreview />}
          {activeTab === "carte" && <GabonMap />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Annuaire;
