import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, FileText, CheckCircle, Clock, XCircle,
  AlertCircle, Download, RefreshCw, User, CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  numero_ordre: string | null;
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
    description: "Votre dossier est en cours de préparation. Complétez toutes les étapes pour le soumettre."
  },
  submitted: {
    label: "Soumis",
    color: "bg-blue-100 text-blue-800",
    icon: Clock,
    progress: 40,
    description: "Votre dossier a été reçu et est en attente de traitement par nos services."
  },
  under_review: {
    label: "En cours d'examen",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
    progress: 60,
    description: "Votre dossier est actuellement examiné par la Commission d'inscription."
  },
  validated: {
    label: "Validé",
    color: "bg-teal-100 text-teal-800",
    icon: CheckCircle,
    progress: 100,
    description: "Félicitations ! Votre dossier a été approuvé. Votre numéro d'Ordre sera bientôt disponible."
  },
  rejected: {
    label: "Rejeté",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    progress: 0,
    description: "Votre dossier a été rejeté. Consultez les raisons ci-dessous et soumettez un nouveau dossier."
  },
};

const SuiviDossier = () => {
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profileData) {
        // No profile found, redirect to inscription
        navigate("/inscription");
        return;
      }

      setProfile(profileData);

      // Fetch application
      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("profile_id", profileData.id)
        .single();

      if (!appError && appData) {
        setApplication(appData);
      }

      // Fetch payments
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
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement de votre dossier...</p>
        </div>
      </div>
    );
  }

  const currentStatus = application?.status || "draft";
  const statusInfo = statusConfig[currentStatus];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-hero-gradient rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚕</span>
              </div>
              <span className="font-display font-bold text-primary text-lg">
                CNOM Gabon
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
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
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Suivi de mon dossier
            </h1>
            <p className="text-muted-foreground">
              Consultez l'état d'avancement de votre demande d'inscription au Tableau de l'Ordre
            </p>
          </div>

          {/* Status Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <StatusIcon className={`w-6 h-6 ${currentStatus === "validated" ? "text-teal-600" :
                        currentStatus === "rejected" ? "text-red-600" :
                          currentStatus === "under_review" ? "text-yellow-600" :
                            "text-blue-600"
                      }`} />
                    Statut: {statusInfo.label}
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
              {/* Progress Bar */}
              {currentStatus !== "rejected" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">{statusInfo.progress}%</span>
                  </div>
                  <Progress value={statusInfo.progress} className="h-2" />
                </div>
              )}

              {/* Status Description */}
              <p className="text-muted-foreground">{statusInfo.description}</p>

              {/* Rejection Reason */}
              {currentStatus === "rejected" && application?.rejection_reason && (
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
                <h4 className="font-semibold text-foreground">Historique</h4>
                <div className="space-y-3">
                  {application?.created_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <span className="text-sm text-muted-foreground">
                        Dossier créé le {new Date(application.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  )}
                  {application?.submission_date && (
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-sm text-muted-foreground">
                        Dossier soumis le {new Date(application.submission_date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  )}
                  {application?.validation_date && (
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${currentStatus === "validated" ? "bg-teal-500" : "bg-red-500"
                        }`} />
                      <span className="text-sm text-muted-foreground">
                        Dossier {currentStatus === "validated" ? "validé" : "traité"} le{" "}
                        {new Date(application.validation_date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Summary */}
          {profile && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations du dossier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-medium">Dr. {profile.prenom} {profile.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{profile.telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Spécialité</p>
                    <p className="font-medium">{profile.specialite}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Province</p>
                    <p className="font-medium">{profile.province}</p>
                  </div>
                  {profile.numero_ordre && (
                    <div>
                      <p className="text-sm text-muted-foreground">Numéro d'Ordre</p>
                      <p className="font-medium text-primary">{profile.numero_ordre}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Historique des paiements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucun paiement enregistré
                </p>
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
                            ? new Date(payment.paid_at).toLocaleDateString("fr-FR")
                            : new Date(payment.created_at).toLocaleDateString("fr-FR")
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{Number(payment.amount).toLocaleString()} FCFA</p>
                        <Badge className={
                          payment.payment_status === "completed"
                            ? "bg-teal-100 text-teal-800"
                            : payment.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }>
                          {payment.payment_status === "completed" ? "Payé" :
                            payment.payment_status === "pending" ? "En attente" : "Échoué"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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

export default SuiviDossier;
