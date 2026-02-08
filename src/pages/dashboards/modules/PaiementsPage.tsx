import { useState } from "react";
import { Search, Download, CreditCard, TrendingUp, TrendingDown, DollarSign, MoreHorizontal, Eye, RefreshCw } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock data
const MOCK_PAIEMENTS = [
  { id: 1, transactionId: "TRX-2026-00892", medecin: "Dr Jean NZOGHE", type: "cotisation_semestrielle", montant: 150000, methode: "Airtel Money", statut: "completed", date: "2026-02-08" },
  { id: 2, transactionId: "TRX-2026-00891", medecin: "Dr Marie MBOUMBA", type: "inscription", montant: 300000, methode: "Moov Money", statut: "completed", date: "2026-02-07" },
  { id: 3, transactionId: "TRX-2026-00890", medecin: "Dr Paul OBAME", type: "cotisation_semestrielle", montant: 150000, methode: "Airtel Money", statut: "pending", date: "2026-02-07" },
  { id: 4, transactionId: "TRX-2026-00889", medecin: "Dr Georgette NDONG", type: "cotisation_semestrielle", montant: 150000, methode: "Moov Money", statut: "completed", date: "2026-02-06" },
  { id: 5, transactionId: "TRX-2026-00888", medecin: "Dr François ELLA", type: "cotisation_semestrielle", montant: 150000, methode: "Airtel Money", statut: "failed", date: "2026-02-05" },
  { id: 6, transactionId: "TRX-2026-00887", medecin: "Dr Claire MESSI", type: "inscription", montant: 300000, methode: "Virement", statut: "completed", date: "2026-02-04" },
  { id: 7, transactionId: "TRX-2026-00886", medecin: "Dr Martin ONDO", type: "cotisation_semestrielle", montant: 150000, methode: "Airtel Money", statut: "pending", date: "2026-02-03" },
  { id: 8, transactionId: "TRX-2026-00885", medecin: "Dr Sophie MBADINGA", type: "autre", montant: 50000, methode: "Espèces", statut: "completed", date: "2026-02-02" },
];

const getStatutBadge = (statut: string) => {
  const configs: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    completed: { variant: "default", label: "Réussi" },
    pending: { variant: "secondary", label: "En attente" },
    failed: { variant: "destructive", label: "Échoué" },
    refunded: { variant: "outline", label: "Remboursé" },
  };
  const config = configs[statut] || { variant: "outline", label: statut };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getTypeBadge = (type: string) => {
  const labels: Record<string, string> = {
    inscription: "Inscription",
    cotisation_semestrielle: "Cotisation",
    autre: "Autre",
  };
  return <Badge variant="outline">{labels[type] || type}</Badge>;
};

const formatMontant = (montant: number) => {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF" }).format(montant);
};

export const PaiementsPage = () => {
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredPaiements = MOCK_PAIEMENTS.filter((p) => {
    const matchSearch = 
      p.medecin.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statutFilter === "all" || p.statut === statutFilter;
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchStatut && matchType;
  });

  const totalCompleted = MOCK_PAIEMENTS
    .filter(p => p.statut === "completed")
    .reduce((sum, p) => sum + p.montant, 0);

  const totalPending = MOCK_PAIEMENTS
    .filter(p => p.statut === "pending")
    .reduce((sum, p) => sum + p.montant, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Paiements & Cotisations</h1>
          <p className="text-muted-foreground">Suivi des transactions et du recouvrement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total encaissé (mois)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatMontant(totalCompleted)}</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              +12% vs mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{formatMontant(totalPending)}</p>
            <p className="text-sm text-muted-foreground">{MOCK_PAIEMENTS.filter(p => p.statut === "pending").length} transaction(s)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de recouvrement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">78.4%</p>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3 text-red-500" />
              -2% vs mois dernier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Médecins à jour</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">892 / 1,247</p>
            <p className="text-sm text-muted-foreground">71.5% du tableau</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par médecin ou N° transaction..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="inscription">Inscription</SelectItem>
            <SelectItem value="cotisation_semestrielle">Cotisation</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statutFilter} onValueChange={setStatutFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="completed">Réussi</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="failed">Échoué</SelectItem>
            <SelectItem value="refunded">Remboursé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Médecin</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaiements.map((paiement) => (
                <TableRow key={paiement.id}>
                  <TableCell className="font-mono text-sm">{paiement.transactionId}</TableCell>
                  <TableCell className="font-medium">{paiement.medecin}</TableCell>
                  <TableCell>{getTypeBadge(paiement.type)}</TableCell>
                  <TableCell>{paiement.methode}</TableCell>
                  <TableCell className="text-right font-medium">{formatMontant(paiement.montant)}</TableCell>
                  <TableCell>{new Date(paiement.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{getStatutBadge(paiement.statut)}</TableCell>
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
                          Voir les détails
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger le reçu
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaiementsPage;
