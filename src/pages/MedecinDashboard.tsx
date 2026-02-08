import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  RefreshCw, QrCode, FileText, CreditCard, User, 
  Award, Shield, Activity, CheckCircle, Clock, 
  XCircle, AlertCircle, Calendar, MapPin, Phone, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDemo } from "@/contexts/DemoContext";
import { MedecinSidebar } from "@/components/dashboard/MedecinSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import ECPSCard from "@/components/ECPSCard";
import type { Database } from "@/integrations/supabase/types";
import drDansouPhoto from "@/assets/dr-dansou-photo.jpeg";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];
type PaymentStatus = Database["public"]["Enums"]["payment_status"];

interface ApplicationData {
  id: string;
  numero_dossier: string | null;
  status: ApplicationStatus;
  submission_date: string | null;
  validation_date: string | null;
  rejection_reason: string | null;
  created_at: string;
}

interface ProfileData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  specialite: string;
  province: string;
  ville: string;
  numero_ordre: string | null;
  secteur: string;
  universite: string;
  annee_obtention: number;
}

interface PaymentData {
  id: string;
  amount: number;
  payment_type: string;
  payment_status: PaymentStatus;
  created_at: string;
  paid_at: string | null;
}

const statusConfig: Record<ApplicationStatus, {
  label: string;
  color: string;
  icon: typeof CheckCircle;
  progress: number;
  description: string;
}> = {
  draft: {
    label: "Brouillon",
    color: "bg-muted text-muted-foreground",
    icon: FileText,
    progress: 20,
    description: "Votre dossier est en cours de préparation.",
  },
  submitted: {
    label: "Soumis",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
    progress: 40,
    description: "Votre dossier a été reçu et est en attente.",
  },
  under_review: {
    label: "En examen",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
    progress: 60,
    description: "Votre dossier est examiné par la Commission.",
  },
  validated: {
    label: "Validé",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    progress: 100,
    description: "Votre carte e-CPS est disponible.",
  },
  rejected: {
    label: "Rejeté",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    progress: 0,
    description: "Votre dossier a été rejeté.",
  },
};

// Demo data
const DEMO_PROFILE: ProfileData = {
  id: "demo-1",
  nom: "DANSOU OGANDAGA",
  prenom: "Jean Davy",
  email: "jd.dansou@cnom-gabon.ga",
  telephone: "+241 77 00 00 00",
  specialite: "Médecine Générale",
  province: "Estuaire",
  ville: "Libreville",
  numero_ordre: "0815",
  secteur: "prive",
  universite: "Université des Sciences de la Santé",
  annee_obtention: 2015,
};

const DEMO_APPLICATION: ApplicationData = {
  id: "demo-app-1",
  numero_dossier: "INS-2025-00042",
  status: "validated",
  submission_date: "2025-01-15T10:00:00Z",
  validation_date: "2025-02-01T14:30:00Z",
  rejection_reason: null,
  created_at: "2025-01-10T08:00:00Z",
};

const DEMO_PAYMENTS: PaymentData[] = [
  {
    id: "pay-1",
    amount: 150000,
    payment_type: "inscription",
    payment_status: "completed",
    created_at: "2025-01-15T10:30:00Z",
    paid_at: "2025-01-15T10:35:00Z",
  },
  {
    id: "pay-2",
    amount: 75000,
    payment_type: "cotisation_semestrielle",
    payment_status: "pending",
    created_at: "2025-02-01T09:00:00Z",
    paid_at: null,
  },
];

const MedecinDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ecps");
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isDemoMode, demoUser } = useDemo();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (isDemoMode) {
      setProfile(DEMO_PROFILE);
      setApplication(DEMO_APPLICATION);
      setPayments(DEMO_PAYMENTS);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (!user) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profileData) {
        navigate("/inscription");
        return;
      }

      setProfile(profileData as ProfileData);

      const { data: appData } = await supabase
        .from("applications")
        .select("*")
        .eq("profile_id", profileData.id)
        .single();

      if (appData) {
        setApplication(appData);
      }

      const { data: payData } = await supabase
        .from("payments")
        .select("*")
        .eq("profile_id", profileData.id)
        .order("created_at", { ascending: false });

      if (payData) {
        setPayments(payData);
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      fetchData();
      return;
    }

    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, isDemoMode, navigate]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  const currentStatus = application?.status || "draft";
  const statusInfo = statusConfig[currentStatus];
  const StatusIcon = statusInfo.icon;
  const isValidated = currentStatus === "validated";

  const tabTitles: Record<string, string> = {
    ecps: "Carte e-CPS",
    dossier: "Mon dossier",
    paiements: "Mes paiements",
    profil: "Mon profil",
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <MedecinSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Mode démonstration</strong> — Connecté en tant que <strong>Dr. {demoUser?.name}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Header */}
        <DashboardHeader
          title={tabTitles[activeTab] || "Tableau de bord"}
          roleTitle="Médecin inscrit"
          roleIcon="🩺"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="p-6 pt-20 lg:pt-6">
          {/* Status Overview */}
          <Card className="mb-6 border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isValidated ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
                  }`}>
                    <StatusIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Statut du dossier</p>
                    <p className="font-bold text-lg">{statusInfo.label}</p>
                    {application?.numero_dossier && (
                      <p className="text-sm text-muted-foreground">N° {application.numero_dossier}</p>
                    )}
                  </div>
                </div>
                {profile?.numero_ordre && (
                  <div className="flex items-center gap-3 bg-primary/5 rounded-lg px-4 py-3">
                    <Award className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Numéro d'Ordre</p>
                      <p className="font-bold text-xl text-primary">{profile.numero_ordre}</p>
                    </div>
                  </div>
                )}
                <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          {activeTab === "ecps" && (
            <ECPSTabContent 
              profile={profile} 
              isValidated={isValidated} 
              statusInfo={statusInfo}
            />
          )}

          {activeTab === "dossier" && (
            <DossierTabContent 
              application={application} 
              statusInfo={statusInfo}
            />
          )}

          {activeTab === "paiements" && (
            <PaiementsTabContent payments={payments} />
          )}

          {activeTab === "profil" && (
            <ProfilTabContent profile={profile} />
          )}
        </main>
      </div>
    </div>
  );
};

// Tab Components
interface ECPSTabContentProps {
  profile: ProfileData | null;
  isValidated: boolean;
  statusInfo: typeof statusConfig["draft"];
}

const ECPSTabContent = ({ profile, isValidated, statusInfo }: ECPSTabContentProps) => {
  if (!isValidated || !profile?.numero_ordre) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Carte e-CPS non disponible</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Votre carte professionnelle virtuelle sera disponible une fois votre dossier validé.
          </p>
          <Badge className={`${statusInfo.color} mt-4`}>{statusInfo.label}</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Votre Carte Professionnelle Virtuelle
          </CardTitle>
          <CardDescription>Cliquez sur la carte pour afficher le QR code</CardDescription>
        </CardHeader>
        <CardContent>
          <ECPSCard
            doctorName={profile.nom}
            firstName={profile.prenom}
            specialty={profile.specialite}
            orderNumber={profile.numero_ordre || "0000"}
            nip="198505051234"
            province={profile.province}
            city={profile.ville}
            status="active"
            validUntil="31 décembre 2025"
            fonction="MEMBRE"
            photoUrl={drDansouPhoto}
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">Infalsifiable</h4>
            <p className="text-sm text-muted-foreground">Signature cryptographique</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h4 className="font-semibold mb-1">Temps réel</h4>
            <p className="text-sm text-muted-foreground">Statut mis à jour</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold mb-1">Vérifiable</h4>
            <p className="text-sm text-muted-foreground">Scan QR code</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface DossierTabContentProps {
  application: ApplicationData | null;
  statusInfo: typeof statusConfig["draft"];
}

const DossierTabContent = ({ application, statusInfo }: DossierTabContentProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progression du dossier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avancement</span>
              <span className="font-medium">{statusInfo.progress}%</span>
            </div>
            <Progress value={statusInfo.progress} className="h-3" />
            <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations du dossier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Numéro de dossier</p>
              <p className="font-semibold">{application?.numero_dossier || "Non attribué"}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Statut actuel</p>
              <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Date de soumission</p>
              <p className="font-semibold">
                {application?.submission_date 
                  ? new Date(application.submission_date).toLocaleDateString("fr-FR")
                  : "Non soumis"}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Date de validation</p>
              <p className="font-semibold">
                {application?.validation_date 
                  ? new Date(application.validation_date).toLocaleDateString("fr-FR")
                  : "En attente"}
              </p>
            </div>
          </div>

          {application?.rejection_reason && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Motif du rejet</p>
              <p className="text-sm text-red-600 dark:text-red-300">{application.rejection_reason}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface PaiementsTabContentProps {
  payments: PaymentData[];
}

const PaiementsTabContent = ({ payments }: PaiementsTabContentProps) => {
  const paymentTypeLabels: Record<string, string> = {
    inscription: "Frais d'inscription",
    cotisation_semestrielle: "Cotisation semestrielle",
    autre: "Autre",
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total payé</p>
                <p className="text-2xl font-bold text-foreground">
                  {payments
                    .filter(p => p.payment_status === "completed")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()} FCFA
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-foreground">
                  {payments
                    .filter(p => p.payment_status === "pending")
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()} FCFA
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold text-foreground">{payments.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun paiement enregistré</p>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.payment_status === "completed" ? "bg-green-100" : "bg-amber-100"
                    }`}>
                      {payment.payment_status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{paymentTypeLabels[payment.payment_type] || payment.payment_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{payment.amount.toLocaleString()} FCFA</p>
                    <Badge variant={payment.payment_status === "completed" ? "default" : "secondary"}>
                      {payment.payment_status === "completed" ? "Payé" : "En attente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface ProfilTabContentProps {
  profile: ProfileData | null;
}

const ProfilTabContent = ({ profile }: ProfilTabContentProps) => {
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo de profil */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                <img 
                  src={drDansouPhoto} 
                  alt={`Dr. ${profile.prenom} ${profile.nom}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 font-semibold text-primary">N° {profile.numero_ordre || "—"}</p>
            </div>
            
            {/* Informations */}
            <div className="flex-1 grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">Dr. {profile.prenom} {profile.nom}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{profile.telephone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Localisation</p>
                    <p className="font-medium">{profile.ville}, {profile.province}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Spécialité</p>
                    <p className="font-medium">{profile.specialite}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Diplôme obtenu</p>
                    <p className="font-medium">{profile.universite} ({profile.annee_obtention})</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations professionnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Secteur d'exercice</p>
              <p className="font-semibold capitalize">{profile.secteur}</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Numéro d'Ordre</p>
              <p className="font-semibold text-primary">{profile.numero_ordre || "En attente"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline">Modifier mes informations</Button>
      </div>
    </div>
  );
};

export default MedecinDashboard;
