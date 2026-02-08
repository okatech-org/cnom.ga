import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users, FileText, CreditCard, CheckCircle, XCircle, Clock,
  Eye, Check, X, Search, ArrowLeft, LogOut, BarChart3, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];
type PaymentStatus = Database["public"]["Enums"]["payment_status"];

interface ApplicationWithProfile {
  id: string;
  numero_dossier: string | null;
  status: ApplicationStatus;
  submission_date: string | null;
  created_at: string;
  rejection_reason: string | null;
  profile: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    specialite: string;
    province: string;
  } | null;
}

interface Payment {
  id: string;
  amount: number;
  payment_type: string;
  payment_status: PaymentStatus;
  created_at: string;
  paid_at: string | null;
  payment_method: string | null;
  profile: {
    nom: string;
    prenom: string;
    email: string;
  } | null;
}

const statusLabels: Record<ApplicationStatus, string> = {
  draft: "Brouillon",
  submitted: "Soumis",
  under_review: "En révision",
  validated: "Validé",
  rejected: "Rejeté",
};

const statusColors: Record<ApplicationStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  under_review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  validated: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "En attente",
  completed: "Payé",
  failed: "Échoué",
  refunded: "Remboursé",
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-teal-100 text-teal-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

const AdminDashboard = () => {
  const [applications, setApplications] = useState<ApplicationWithProfile[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Check admin access
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error || !roleData) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
    };

    checkAdminAccess();
  }, [user, navigate, toast]);

  // Fetch applications and payments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch applications with profiles
      const { data: appData, error: appError } = await supabase
        .from("applications")
        .select(`
          id,
          numero_dossier,
          status,
          submission_date,
          created_at,
          rejection_reason,
          profile_id
        `)
        .order("created_at", { ascending: false });

      if (!appError && appData) {
        // Fetch profiles for each application
        const profileIds = appData.map(app => app.profile_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, nom, prenom, email, telephone, specialite, province")
          .in("id", profileIds);

        const appsWithProfiles = appData.map(app => ({
          ...app,
          profile: profilesData?.find(p => p.id === app.profile_id) || null,
        }));

        setApplications(appsWithProfiles);
      }

      // Fetch payments
      const { data: payData, error: payError } = await supabase
        .from("payments")
        .select(`
          id,
          amount,
          payment_type,
          payment_status,
          created_at,
          paid_at,
          payment_method,
          profile_id
        `)
        .order("created_at", { ascending: false });

      if (!payError && payData) {
        // Fetch profiles for payments
        const profileIds = payData.map(p => p.profile_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, nom, prenom, email")
          .in("id", profileIds);

        const paymentsWithProfiles = payData.map(pay => ({
          ...pay,
          profile: profilesData?.find(p => p.id === pay.profile_id) || null,
        }));

        setPayments(paymentsWithProfiles);
      }

      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleApprove = async (application: ApplicationWithProfile) => {
    setProcessingId(application.id);

    const { error } = await supabase
      .from("applications")
      .update({
        status: "validated" as ApplicationStatus,
        validation_date: new Date().toISOString(),
        validated_by: user?.id,
      })
      .eq("id", application.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de valider le dossier.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Dossier validé",
        description: `Le dossier ${application.numero_dossier || application.id.slice(0, 8)} a été validé.`,
      });
      setApplications(apps =>
        apps.map(app =>
          app.id === application.id
            ? { ...app, status: "validated" as ApplicationStatus }
            : app
        )
      );
    }

    setProcessingId(null);
  };

  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason.trim()) {
      toast({
        title: "Raison requise",
        description: "Veuillez indiquer la raison du rejet.",
        variant: "destructive",
      });
      return;
    }

    setProcessingId(selectedApplication.id);

    const { error } = await supabase
      .from("applications")
      .update({
        status: "rejected" as ApplicationStatus,
        rejection_reason: rejectionReason,
        validation_date: new Date().toISOString(),
        validated_by: user?.id,
      })
      .eq("id", selectedApplication.id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter le dossier.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Dossier rejeté",
        description: `Le dossier a été rejeté.`,
      });
      setApplications(apps =>
        apps.map(app =>
          app.id === selectedApplication.id
            ? { ...app, status: "rejected" as ApplicationStatus, rejection_reason: rejectionReason }
            : app
        )
      );
    }

    setProcessingId(null);
    setShowRejectDialog(false);
    setSelectedApplication(null);
    setRejectionReason("");
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch =
      app.profile?.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.profile?.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.profile?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.numero_dossier?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "submitted" || a.status === "under_review").length,
    validated: applications.filter(a => a.status === "validated").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    totalPayments: payments.reduce((acc, p) => p.payment_status === "completed" ? acc + Number(p.amount) : acc, 0),
  };

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
              <div>
                <span className="font-display font-bold text-primary text-lg">CNOM Gabon</span>
                <span className="ml-2 text-sm text-muted-foreground">Administration</span>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-background rounded-xl p-5 border border-border shadow-cnom">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total dossiers</p>
          </div>
          <div className="bg-background rounded-xl p-5 border border-border shadow-cnom">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </div>
          <div className="bg-background rounded-xl p-5 border border-border shadow-cnom">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.validated}</p>
            <p className="text-sm text-muted-foreground">Validés</p>
          </div>
          <div className="bg-background rounded-xl p-5 border border-border shadow-cnom">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
            <p className="text-sm text-muted-foreground">Rejetés</p>
          </div>
          <div className="bg-background rounded-xl p-5 border border-border shadow-cnom col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-cnom-gold/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-cnom-gold" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.totalPayments.toLocaleString()} FCFA</p>
            <p className="text-sm text-muted-foreground">Paiements reçus</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="w-4 h-4" />
              Dossiers
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Paiements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email ou numéro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="submitted">Soumis</SelectItem>
                  <SelectItem value="under_review">En révision</SelectItem>
                  <SelectItem value="validated">Validés</SelectItem>
                  <SelectItem value="rejected">Rejetés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applications Table */}
            <div className="bg-background rounded-xl border border-border shadow-cnom overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Dossier</TableHead>
                    <TableHead>Médecin</TableHead>
                    <TableHead className="hidden md:table-cell">Spécialité</TableHead>
                    <TableHead className="hidden lg:table-cell">Province</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun dossier trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          {app.numero_dossier || app.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              Dr. {app.profile?.prenom} {app.profile?.nom}
                            </p>
                            <p className="text-sm text-muted-foreground">{app.profile?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {app.profile?.specialite}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {app.profile?.province}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[app.status]}>
                            {statusLabels[app.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {app.submission_date
                            ? new Date(app.submission_date).toLocaleDateString("fr-FR")
                            : new Date(app.created_at).toLocaleDateString("fr-FR")
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {(app.status === "submitted" || app.status === "under_review") && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                                  onClick={() => handleApprove(app)}
                                  disabled={processingId === app.id}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setSelectedApplication(app);
                                    setShowRejectDialog(true);
                                  }}
                                  disabled={processingId === app.id}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/admin/dossier/${app.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            {/* Payments Table */}
            <div className="bg-background rounded-xl border border-border shadow-cnom overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden sm:table-cell">Méthode</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucun paiement trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              Dr. {payment.profile?.prenom} {payment.profile?.nom}
                            </p>
                            <p className="text-sm text-muted-foreground">{payment.profile?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">
                          {payment.payment_type.replace("_", " ")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {Number(payment.amount).toLocaleString()} FCFA
                        </TableCell>
                        <TableCell>
                          <Badge className={paymentStatusColors[payment.payment_status]}>
                            {paymentStatusLabels[payment.payment_status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell capitalize">
                          {payment.payment_method || "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {payment.paid_at
                            ? new Date(payment.paid_at).toLocaleDateString("fr-FR")
                            : new Date(payment.created_at).toLocaleDateString("fr-FR")
                          }
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter le dossier</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du rejet. Cette information sera communiquée au médecin.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Raison du rejet..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
