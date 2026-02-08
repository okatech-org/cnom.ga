import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Copy, ChevronDown, Shield, Users, AlertTriangle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ROLES = [
  {
    id: "admin",
    title: "Super Administrateur",
    subtitle: "Administration technique de la plateforme",
    icon: "⚙️",
    email: "admin@cnom-gabon.ga",
    password: "Demo@Admin2026!",
    colorClass: "bg-red-600",
    accentClass: "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800",
    textClass: "text-red-600",
    modules: ["M1 Répertoire", "M2 Inscription", "M3 e-CPS", "M4 Paiement", "M5 BI"],
    permissions: "Accès total : Lecture / Écriture / Suppression sur tous les modules",
    description: "Gestion complète de la plateforme, configuration système, gestion des rôles, monitoring et procédures de sauvegarde."
  },
  {
    id: "president",
    title: "Président CNOM",
    subtitle: "Dr Emmanuel OGANDAGA",
    icon: "🏛️",
    email: "president@cnom-gabon.ga",
    password: "Demo@Pres2026!",
    colorClass: "bg-primary",
    accentClass: "bg-primary/5 border-primary/20",
    textClass: "text-primary",
    modules: ["M1 Répertoire", "M2 Inscription", "M5 BI"],
    permissions: "Lecture complète + Validation finale des inscriptions + Tableau de bord exécutif",
    description: "Validation stratégique, décisions d'arbitrage, supervision du Tableau de l'Ordre et accès au reporting analytique complet."
  },
  {
    id: "sg",
    title: "Secrétaire Général(e)",
    subtitle: "Dr Georgette NDONG",
    icon: "📋",
    email: "sg@cnom-gabon.ga",
    password: "Demo@SG2026!",
    colorClass: "bg-violet-600",
    accentClass: "bg-violet-50 border-violet-200 dark:bg-violet-950/30 dark:border-violet-800",
    textClass: "text-violet-600",
    modules: ["M1 Répertoire", "M2 Inscription", "M4 Paiement", "M5 BI"],
    permissions: "Lecture / Écriture sur fiches + Validation intermédiaire + Lecture financière",
    description: "Gestion administrative quotidienne, validation intermédiaire des dossiers d'inscription, suivi des activités de l'Ordre."
  },
  {
    id: "tresorier",
    title: "Trésorier(e)",
    subtitle: "Dr Madeleine MELLA-MBOUMBA",
    icon: "💰",
    email: "tresorier@cnom-gabon.ga",
    password: "Demo@Tres2026!",
    colorClass: "bg-amber-600",
    accentClass: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800",
    textClass: "text-amber-600",
    modules: ["M1 Répertoire (finances)", "M4 Paiement", "M5 BI (finances)"],
    permissions: "Lecture / Écriture sur paiements + Tableau de bord financier + Reporting",
    description: "Suivi des cotisations en temps réel, taux de recouvrement, gestion des impayés, projections financières et attestations fiscales."
  },
  {
    id: "agent",
    title: "Agent Administratif",
    subtitle: "Personnel de saisie CNOM",
    icon: "👤",
    email: "agent@cnom-gabon.ga",
    password: "Demo@Agent2026!",
    colorClass: "bg-sky-600",
    accentClass: "bg-sky-50 border-sky-200 dark:bg-sky-950/30 dark:border-sky-800",
    textClass: "text-sky-600",
    modules: ["M1 Répertoire", "M2 Inscription", "M4 Paiement"],
    permissions: "Lecture / Écriture fiches + Saisie / Vérification dossiers + Lecture limitée BI",
    description: "Saisie et mise à jour des fiches médecins, vérification des pièces justificatives, traitement des dossiers d'inscription."
  },
  {
    id: "commission",
    title: "Commission d'Inscription",
    subtitle: "Membre validateur",
    icon: "✅",
    email: "commission@cnom-gabon.ga",
    password: "Demo@Comm2026!",
    colorClass: "bg-emerald-600",
    accentClass: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800",
    textClass: "text-emerald-600",
    modules: ["M1 Répertoire (lecture)", "M2 Inscription (validation)"],
    permissions: "Lecture des fiches + Validation des dossiers d'inscription + Attribution N° Ordre",
    description: "Examen et validation des dossiers complets, décision d'acceptation ou de rejet, attribution automatique du numéro d'Ordre."
  },
  {
    id: "regional",
    title: "Président Conseil Régional",
    subtitle: "Responsable provincial",
    icon: "🗺️",
    email: "regional@cnom-gabon.ga",
    password: "Demo@Reg2026!",
    colorClass: "bg-pink-600",
    accentClass: "bg-pink-50 border-pink-200 dark:bg-pink-950/30 dark:border-pink-800",
    textClass: "text-pink-600",
    modules: ["M1 (sa région)", "M4 (sa région)", "M5 (sa région)"],
    permissions: "Lecture restreinte à sa province : fiches, paiements et indicateurs régionaux",
    description: "Consultation des médecins de sa zone géographique, suivi des cotisations régionales et tableau de bord provincial."
  },
  {
    id: "medecin",
    title: "Médecin Inscrit",
    subtitle: "Espace personnel médecin",
    icon: "🩺",
    email: "medecin@cnom-gabon.ga",
    password: "Demo@Med2026!",
    colorClass: "bg-primary",
    accentClass: "bg-primary/5 border-primary/20",
    textClass: "text-primary",
    modules: ["M1 (sa fiche)", "M3 Carte e-CPS", "M4 Paiement"],
    permissions: "Lecture / Modification données personnelles + Carte virtuelle + Paiement cotisation",
    description: "Consultation et mise à jour de sa fiche, affichage de la carte e-CPS avec QR code dynamique, paiement mobile des cotisations, téléchargement de reçus."
  },
  {
    id: "public",
    title: "Public / Patient",
    subtitle: "Portail de vérification",
    icon: "🔍",
    email: null,
    password: null,
    colorClass: "bg-slate-500",
    accentClass: "bg-slate-50 border-slate-200 dark:bg-slate-950/30 dark:border-slate-800",
    textClass: "text-slate-600",
    modules: ["Annuaire public", "Vérification QR"],
    permissions: "Recherche annuaire (données publiques) + Scan QR code de vérification",
    description: "Recherche d'un médecin par nom, spécialité ou ville. Vérification instantanée du statut d'un praticien via scan QR code. Aucun compte requis."
  }
];

const BACK_OFFICE_ROLES = ROLES.filter(r => ["admin", "president", "sg", "tresorier", "agent", "commission", "regional"].includes(r.id));
const FRONT_ROLES = ROLES.filter(r => ["medecin", "public"].includes(r.id));

interface CopyButtonProps {
  text: string;
}

function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({ title: "Copié !", description: "Le texte a été copié dans le presse-papiers." });
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-7 px-2 text-xs"
    >
      {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
      {copied ? "Copié" : "Copier"}
    </Button>
  );
}

interface RoleCardProps {
  role: typeof ROLES[0];
  expanded: string | null;
  onToggle: () => void;
}

function RoleCard({ role, expanded, onToggle }: RoleCardProps) {
  const isOpen = expanded === role.id;
  const navigate = useNavigate();

  const handleAccessClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (role.email && role.password) {
      // Navigate to auth with pre-filled credentials
      const params = new URLSearchParams({
        email: role.email,
        password: role.password,
        role: role.id
      });
      navigate(`/auth?${params.toString()}`);
    } else {
      // Public access - go to annuaire
      navigate("/annuaire");
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 cursor-pointer border-2 ${
        isOpen ? role.accentClass : 'border-border hover:border-primary/30'
      }`}
      onClick={onToggle}
    >
      <CardHeader className="p-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${role.colorClass} flex items-center justify-center text-2xl shadow-md`}>
            {role.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{role.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{role.subtitle}</p>
          </div>
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {role.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {role.modules.map((m, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {m}
                </Badge>
              ))}
            </div>

            <div className={`p-3 rounded-lg ${role.accentClass} border`}>
              <p className="text-xs font-medium flex items-center gap-2">
                <Shield className="w-3 h-3 flex-shrink-0" />
                <span>{role.permissions}</span>
              </p>
            </div>

            {role.email ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Identifiants de démonstration
                </p>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs text-muted-foreground flex-shrink-0">Email :</span>
                      <code className="text-xs font-mono bg-background px-2 py-1 rounded truncate">{role.email}</code>
                    </div>
                    <CopyButton text={role.email} />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs text-muted-foreground flex-shrink-0">Mot de passe :</span>
                      <code className="text-xs font-mono bg-background px-2 py-1 rounded truncate">{role.password}</code>
                    </div>
                    <CopyButton text={role.password!} />
                  </div>
                </div>
                <Button 
                  className={`w-full ${role.colorClass} hover:opacity-90`}
                  onClick={handleAccessClick}
                >
                  Accéder à l'espace {role.title}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  🌐 Accès libre — Aucun compte requis
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleAccessClick}
                >
                  Accéder au Portail Public
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

const Demo = () => {
  const [expanded, setExpanded] = useState<string | null>("president");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Header */}
        <section className="relative bg-gradient-to-br from-primary via-primary to-cnom-green-dark text-white overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container mx-auto px-4 py-12 lg:py-16 relative z-10">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚕️</span>
                <div>
                  <p className="font-display font-bold text-lg">e-CNOM Gabon</p>
                  <p className="text-white/70 text-sm">Portail Numérique Unifié</p>
                </div>
              </div>
              <Badge className="bg-secondary text-secondary-foreground font-bold animate-pulse">
                DÉMO
              </Badge>
            </div>

            {/* Title section */}
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">
                Environnement de
                <span className="block text-secondary">Démonstration</span>
              </h1>
              <p className="text-white/80 text-lg leading-relaxed">
                Explorez la plateforme de digitalisation de l'Ordre National des Médecins du Gabon. 
                Sélectionnez un profil ci-dessous pour accéder à l'espace correspondant.
              </p>
            </div>
          </div>
        </section>

        {/* Warning Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Environnement de démonstration</strong> — Les données affichées sont fictives. 
                Les paiements ne sont pas débités. Les actions sont simulées et réinitialisées quotidiennement. 
                <span className="text-amber-600 dark:text-amber-400 ml-1">Référence projet : PRJ-ECNOM-2026-001</span>
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Back-Office Section */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Back-Office CNOM</h2>
              <Badge variant="outline">7 PROFILS</Badge>
            </div>
            <p className="text-muted-foreground mb-6">
              Accès réservé au personnel administratif du CNOM. Authentification MFA requise en production.
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {BACK_OFFICE_ROLES.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  expanded={expanded}
                  onToggle={() => setExpanded(expanded === role.id ? null : role.id)}
                />
              ))}
            </div>
          </section>

          {/* Front-Office Section */}
          <section>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-secondary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Espaces Utilisateurs</h2>
              <Badge variant="outline">2 PROFILS</Badge>
            </div>
            <p className="text-muted-foreground mb-6">
              Espace médecin (inscription, carte e-CPS, paiement) et portail public (annuaire, vérification QR).
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {FRONT_ROLES.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  expanded={expanded}
                  onToggle={() => setExpanded(expanded === role.id ? null : role.id)}
                />
              ))}
            </div>
          </section>

          {/* Quick Reference Table */}
          <section>
            <Card>
              <CardHeader>
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  📑 Récapitulatif des accès
                </h2>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Profil</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Mot de passe</TableHead>
                        <TableHead>Espace</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ROLES.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{role.icon}</span>
                              <span className="font-medium">{role.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {role.email || "Accès libre"}
                            </code>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                              {role.password || "—"}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge variant={role.id === "public" ? "secondary" : role.id === "medecin" ? "default" : "outline"}>
                              {role.id === "public" ? "Public" : role.id === "medecin" ? "Médecin" : "Back-Office"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Footer info */}
          <div className="text-center space-y-2 py-8 border-t">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              🔒 Hébergement souverain gabonais · Conformité APDPVP (Loi 025/2023) · Privacy by Design
            </p>
            <p className="text-xs text-muted-foreground">
              e-CNOM Gabon · Version 1.0 · Février 2026 · PRJ-ECNOM-2026-001
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;
