import { useState } from "react";
import { Search, Eye, Check, X, Clock, FileText, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardData, useApplicationActions, DashboardApplication } from "@/hooks/useDashboardData";
import { useToast } from "@/hooks/use-toast";

const getStatutConfig = (statut: string) => {
  const configs: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon: React.ReactNode }> = {
    draft: { variant: "secondary", label: "Brouillon", icon: <FileText className="w-3 h-3" /> },
    submitted: { variant: "outline", label: "Soumis", icon: <Clock className="w-3 h-3" /> },
    under_review: { variant: "default", label: "En cours d'examen", icon: <Eye className="w-3 h-3" /> },
    validated: { variant: "default", label: "Validé", icon: <Check className="w-3 h-3" /> },
    rejected: { variant: "destructive", label: "Rejeté", icon: <X className="w-3 h-3" /> },
  };
  return configs[statut] || { variant: "outline", label: statut, icon: null };
};

const getStatutBadge = (statut: string) => {
  const config = getStatutConfig(statut);
  return (
    <Badge variant={config.variant} className="gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
};

export const InscriptionsPage = () => {
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<DashboardApplication | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [validateDialogOpen, setValidateDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const { applications, stats, loading, refetch } = useDashboardData();
  const { validateApplication, rejectApplication, startReview } = useApplicationActions();
  const { toast } = useToast();

  const filteredDossiers = applications.filter((d) => {
    const matchSearch =
      d.profile?.nom?.toLowerCase().includes(search.toLowerCase()) ||
      d.profile?.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      d.numero_dossier?.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statutFilter === "all" || d.status === statutFilter;
    return matchSearch && matchStatut;
  });

  const countByStatut = (statut: string) => applications.filter((d) => d.status === statut).length;

  const handleValidate = async () => {
    if (!selectedApp || !orderNumber.trim()) return;
    setActionLoading(true);
    const result = await validateApplication(selectedApp.id, orderNumber);
    setActionLoading(false);
    
    toast({
      title: result.success ? "Succès" : "Erreur",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });

    if (result.success) {
      setValidateDialogOpen(false);
      setSelectedApp(null);
      setOrderNumber("");
      refetch();
    }
  };

  const handleReject = async () => {
    if (!selectedApp || !rejectReason.trim()) return;
    setActionLoading(true);
    const result = await rejectApplication(selectedApp.id, rejectReason);
    setActionLoading(false);
    
    toast({
      title: result.success ? "Dossier rejeté" : "Erreur",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });

    if (result.success) {
      setRejectDialogOpen(false);
      setSelectedApp(null);
      setRejectReason("");
      refetch();
    }
  };

  const handleStartReview = async (app: DashboardApplication) => {
    const result = await startReview(app.id);
    toast({
      title: result.success ? "Examen démarré" : "Erreur",
      description: result.message,
    });
    if (result.success) refetch();
  };

  const openValidateDialog = (app: DashboardApplication) => {
    setSelectedApp(app);
    setOrderNumber("");
    setValidateDialogOpen(true);
  };

  const openRejectDialog = (app: DashboardApplication) => {
    setSelectedApp(app);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dossiers d'Inscription</h1>
        <p className="text-muted-foreground">Gérez les demandes d'inscription au tableau de l'Ordre</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-gray-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Brouillons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{countByStatut("draft")}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Soumis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{countByStatut("submitted")}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En examen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{countByStatut("under_review")}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Validés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{countByStatut("validated")}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejetés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{countByStatut("rejected")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="pending">À traiter</TabsTrigger>
            <TabsTrigger value="completed">Traités</TabsTrigger>
          </TabsList>
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un dossier..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="submitted">Soumis</SelectItem>
                <SelectItem value="under_review">En examen</SelectItem>
                <SelectItem value="validated">Validé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Dossier</TableHead>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead>Date dépôt</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDossiers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Aucun dossier trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDossiers.map((dossier) => (
                      <TableRow key={dossier.id}>
                        <TableCell className="font-mono text-sm">
                          {dossier.numero_dossier || "—"}
                        </TableCell>
                        <TableCell className="font-medium">
                          Dr {dossier.profile?.prenom} {dossier.profile?.nom}
                        </TableCell>
                        <TableCell>{dossier.profile?.specialite || "—"}</TableCell>
                        <TableCell>
                          {dossier.submission_date
                            ? new Date(dossier.submission_date).toLocaleDateString("fr-FR")
                            : "—"}
                        </TableCell>
                        <TableCell>{getStatutBadge(dossier.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Examiner le dossier
                              </DropdownMenuItem>
                              {dossier.status === "submitted" && (
                                <DropdownMenuItem onClick={() => handleStartReview(dossier)}>
                                  <Clock className="w-4 h-4 mr-2" />
                                  Démarrer l'examen
                                </DropdownMenuItem>
                              )}
                              {["submitted", "under_review"].includes(dossier.status) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() => openValidateDialog(dossier)}
                                  >
                                    <Check className="w-4 h-4 mr-2" />
                                    Valider
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => openRejectDialog(dossier)}
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Rejeter
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Dossiers à traiter</CardTitle>
              <CardDescription>
                Dossiers soumis ou en cours d'examen nécessitant une action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {stats.pendingApplications} dossier(s) en attente
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Dossiers traités</CardTitle>
              <CardDescription>Dossiers validés ou rejetés</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {stats.validatedApplications + stats.rejectedApplications} dossier(s) traités
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Validate Dialog */}
      <Dialog open={validateDialogOpen} onOpenChange={setValidateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Valider le dossier</DialogTitle>
            <DialogDescription>
              Attribuer un numéro d'Ordre et valider l'inscription de{" "}
              {selectedApp?.profile?.prenom} {selectedApp?.profile?.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Numéro d'Ordre</label>
              <Input
                placeholder="Ex: 1842"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Ce numéro sera définitif et apparaîtra sur la carte e-CPS
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setValidateDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleValidate} disabled={actionLoading || !orderNumber.trim()}>
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Valider l'inscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter le dossier</DialogTitle>
            <DialogDescription>
              Indiquer le motif de rejet pour le dossier de{" "}
              {selectedApp?.profile?.prenom} {selectedApp?.profile?.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Motif du rejet</label>
              <Textarea
                placeholder="Décrivez les raisons du rejet..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={actionLoading || !rejectReason.trim()}
            >
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Rejeter le dossier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InscriptionsPage;
