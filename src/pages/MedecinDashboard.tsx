import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  User,
  CreditCard,
  QrCode,
  Shield,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDemo } from "@/contexts/DemoContext";
import ECPSCard from "@/components/ECPSCard";
import type { Database } from "@/integrations/supabase/types";

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

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    color: string;
    icon: typeof CheckCircle;
    progress: number;
    description: string;
  }
> = {
  draft: {
    label: "Brouillon",
    color: "bg-muted text-muted-foreground",
    icon: FileText,
    progress: 20,
    description:
      "Votre dossier est en cours de préparation. Complétez toutes les étapes pour le soumettre.",
  },
  submitted: {
    label: "Soumis",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
    progress: 40,
    description:
      "Votre dossier a été reçu et est en attente de traitement par nos services.",
  },
  under_review: {
    label: "En cours d'examen",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
    progress: 60,
    description:
      "Votre dossier est actuellement examiné par la Commission d'inscription.",
  },
  validated: {
    label: "Validé",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    progress: 100,
    description:
      "Félicitations ! Votre dossier a été approuvé. Votre carte e-CPS est disponible.",
  },
  rejected: {
    label: "Rejeté",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    progress: 0,
    description:
      "Votre dossier a été rejeté. Consultez les raisons ci-dessous et soumettez un nouveau dossier.",
  },
};

// Demo data for demo mode
const DEMO_PROFILE: ProfileData = {
  id: "demo-1",
  nom: "NZOGHE",
  prenom: "Jean",
  email: "medecin@cnom-gabon.ga",
  telephone: "+241 77 00 00 00",
  specialite: "Médecine Générale",
  province: "Estuaire",
  ville: "Libreville",
  numero_ordre: "1842",
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
    payment_status: "completed",
    created_at: "2025-02-01T09:00:00Z",
    paid_at: "2025-02-01T09:05:00Z",
  },
];

const MedecinDashboard = () => {
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("ecps");
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isDemoMode, demoUser, exitDemoMode } = useDemo();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (isDemoMode) {
      // Use demo data
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

      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("profile_id", profileData.id)
        .single();

      if (!appError && appData) {
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
    } catch (error) {
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

  const handleExitDemo = () => {
    exitDemoMode();
    navigate("/demo");
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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-secondary text-secondary-foreground py-2 px-4 text-center text-sm">
          <span className="font-medium">🔬 Mode Démonstration</span>
          <span className="mx-2">—</span>
          <span>Connecté en tant que Dr. {demoUser?.name}</span>
          <Button
            variant="link"
            size="sm"
            className="ml-2 text-secondary-foreground underline h-auto p-0"
            onClick={handleExitDemo}
          >
            Quitter la démo
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-hero-gradient rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚕</span>
              </div>
              <div>
                <span className="font-display font-bold text-primary text-lg block">
                  CNOM Gabon
                </span>
                <span className="text-xs text-muted-foreground">
                  Mon Espace Médecin
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
              </Button>
              <Link to="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Retour</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Bienvenue, Dr. {profile?.prenom} {profile?.nom}
            </h1>
            <p className="text-muted-foreground">
              Gérez votre inscription, consultez votre carte e-CPS et suivez vos
              paiements
            </p>
          </div>

          {/* Status Overview */}
          <Card className="mb-8 border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isValidated
                        ? "bg-green-100 text-green-600"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <StatusIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Statut du dossier
                    </p>
                    <p className="font-bold text-lg">{statusInfo.label}</p>
                    {application?.numero_dossier && (
                      <p className="text-sm text-muted-foreground">
                        N° {application.numero_dossier}
                      </p>
                    )}
                  </div>
                </div>
                {profile?.numero_ordre && (
                  <div className="flex items-center gap-3 bg-primary/5 rounded-lg px-4 py-3">
                    <Award className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Numéro d'Ordre
                      </p>
                      <p className="font-bold text-xl text-primary">
                        {profile.numero_ordre}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="ecps" className="gap-2">
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">Carte e-CPS</span>
              </TabsTrigger>
              <TabsTrigger value="dossier" className="gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Dossier</span>
              </TabsTrigger>
              <TabsTrigger value="profil" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="paiements" className="gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Paiements</span>
              </TabsTrigger>
            </TabsList>

            {/* e-CPS Tab */}
            <TabsContent value="ecps">
              {isValidated && profile?.numero_ordre ? (
                <div className="space-y-8">
                  <Card>
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Votre Carte Professionnelle Virtuelle
                      </CardTitle>
                      <CardDescription>
                        Cliquez sur la carte pour afficher le QR code de
                        vérification
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ECPSCard
                        doctorName={`Dr. ${profile.prenom} ${profile.nom}`}
                        specialty={profile.specialite}
                        orderNumber={profile.numero_ordre}
                        province={profile.province}
                        city={profile.ville}
                        status="active"
                        validUntil="31 décembre 2025"
                      />
                    </CardContent>
                  </Card>

                  {/* Card Features */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-1">Infalsifiable</h4>
                        <p className="text-sm text-muted-foreground">
                          Signature cryptographique unique
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Activity className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <h4 className="font-semibold mb-1">Temps réel</h4>
                        <p className="text-sm text-muted-foreground">
                          Statut mis à jour instantanément
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
                          <QrCode className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-1">Vérifiable</h4>
                        <p className="text-sm text-muted-foreground">
                          Scan QR pour authentification
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <QrCode className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Carte e-CPS non disponible
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Votre carte professionnelle virtuelle sera disponible une
                      fois votre dossier validé et votre numéro d'Ordre
                      attribué.
                    </p>
                    <Badge className={`${statusInfo.color} mt-4`}>
                      {statusInfo.label}
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Dossier Tab */}
            <TabsContent value="dossier">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <StatusIcon
                          className={`w-6 h-6 ${
                            currentStatus === "validated"
                              ? "text-green-600"
                              : currentStatus === "rejected"
                              ? "text-red-600"
                              : currentStatus === "under_review"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                        />
                        {statusInfo.label}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {application?.numero_dossier && (
                          <span className="font-medium text-foreground">
                            N° Dossier: {application.numero_dossier}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge className={`${statusInfo.color} text-sm px-4 py-2`}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {currentStatus !== "rejected" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Progression
                        </span>
                        <span className="font-medium">
                          {statusInfo.progress}%
                        </span>
                      </div>
                      <Progress value={statusInfo.progress} className="h-2" />
                    </div>
                  )}

                  <p className="text-muted-foreground">
                    {statusInfo.description}
                  </p>

                  {currentStatus === "rejected" &&
                    application?.rejection_reason && (
                      <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                          Raison du rejet:
                        </h4>
                        <p className="text-red-700 dark:text-red-300">
                          {application.rejection_reason}
                        </p>
                      </div>
                    )}

                  {/* Timeline */}
                  <div className="space-y-4 pt-4">
                    <h4 className="font-semibold text-foreground">
                      Historique
                    </h4>
                    <div className="space-y-3">
                      {application?.created_at && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-primary rounded-full" />
                          <span className="text-sm text-muted-foreground">
                            Dossier créé le{" "}
                            {new Date(application.created_at).toLocaleDateString(
                              "fr-FR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                      {application?.submission_date && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="text-sm text-muted-foreground">
                            Dossier soumis le{" "}
                            {new Date(
                              application.submission_date
                            ).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                      {application?.validation_date && (
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              currentStatus === "validated"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm text-muted-foreground">
                            Dossier{" "}
                            {currentStatus === "validated"
                              ? "validé"
                              : "traité"}{" "}
                            le{" "}
                            {new Date(
                              application.validation_date
                            ).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profil Tab */}
            <TabsContent value="profil">
              {profile && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Nom complet
                          </p>
                          <p className="font-medium">
                            Dr. {profile.prenom} {profile.nom}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Téléphone
                          </p>
                          <p className="font-medium">{profile.telephone}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Activity className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Spécialité
                          </p>
                          <p className="font-medium">{profile.specialite}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Localisation
                          </p>
                          <p className="font-medium">
                            {profile.ville}, {profile.province}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Diplôme obtenu
                          </p>
                          <p className="font-medium">
                            {profile.universite} ({profile.annee_obtention})
                          </p>
                        </div>
                      </div>
                      {profile.numero_ordre && (
                        <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-3">
                          <Award className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Numéro d'Ordre
                            </p>
                            <p className="font-bold text-primary text-xl">
                              {profile.numero_ordre}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Paiements Tab */}
            <TabsContent value="paiements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Historique des paiements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        Aucun paiement enregistré
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium capitalize">
                              {payment.payment_type.replace("_", " ")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payment.paid_at
                                ? new Date(payment.paid_at).toLocaleDateString(
                                    "fr-FR"
                                  )
                                : new Date(
                                    payment.created_at
                                  ).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {Number(payment.amount).toLocaleString()} FCFA
                            </p>
                            <Badge
                              className={
                                payment.payment_status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : payment.payment_status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {payment.payment_status === "completed"
                                ? "Payé"
                                : payment.payment_status === "pending"
                                ? "En attente"
                                : "Échoué"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {currentStatus === "draft" && (
              <Button asChild>
                <Link to="/inscription">Compléter mon dossier</Link>
              </Button>
            )}
            {currentStatus === "rejected" && (
              <Button asChild>
                <Link to="/inscription">Soumettre un nouveau dossier</Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MedecinDashboard;
