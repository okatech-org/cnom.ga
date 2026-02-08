import { useState } from "react";
import { Search, Filter, Eye, Check, X, Clock, FileText, MoreHorizontal } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const MOCK_DOSSIERS = [
  { id: 1, numeroDossier: "INS-2026-00045", nom: "MOUSSAVOU", prenom: "Patrick", dateDepot: "2026-02-05", statut: "submitted", completude: 100, specialite: "Médecine Générale" },
  { id: 2, numeroDossier: "INS-2026-00044", nom: "EKANG", prenom: "Sylvie", dateDepot: "2026-02-04", statut: "under_review", completude: 100, specialite: "Pédiatrie" },
  { id: 3, numeroDossier: "INS-2026-00043", nom: "BITEGHE", prenom: "André", dateDepot: "2026-02-03", statut: "submitted", completude: 85, specialite: "Chirurgie" },
  { id: 4, numeroDossier: "INS-2026-00042", nom: "ANGUILE", prenom: "Marie-Claire", dateDepot: "2026-02-02", statut: "validated", completude: 100, specialite: "Gynécologie" },
  { id: 5, numeroDossier: "INS-2026-00041", nom: "OBIANG", prenom: "Simon", dateDepot: "2026-02-01", statut: "rejected", completude: 100, specialite: "Cardiologie", motifRejet: "Documents incomplets" },
  { id: 6, numeroDossier: "INS-2026-00040", nom: "NTOUTOUME", prenom: "Hélène", dateDepot: "2026-01-30", statut: "draft", completude: 60, specialite: "Dermatologie" },
  { id: 7, numeroDossier: "INS-2026-00039", nom: "MBOUMBA", prenom: "Léon", dateDepot: "2026-01-28", statut: "under_review", completude: 100, specialite: "Ophtalmologie" },
  { id: 8, numeroDossier: "INS-2026-00038", nom: "MEZUI", prenom: "Jeanne", dateDepot: "2026-01-25", statut: "validated", completude: 100, specialite: "Neurologie" },
];

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

  const filteredDossiers = MOCK_DOSSIERS.filter((d) => {
    const matchSearch = 
      d.nom.toLowerCase().includes(search.toLowerCase()) ||
      d.prenom.toLowerCase().includes(search.toLowerCase()) ||
      d.numeroDossier.toLowerCase().includes(search.toLowerCase());
    const matchStatut = statutFilter === "all" || d.statut === statutFilter;
    return matchSearch && matchStatut;
  });

  const countByStatut = (statut: string) => MOCK_DOSSIERS.filter(d => d.statut === statut).length;

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
                    <TableHead>Complétude</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDossiers.map((dossier) => (
                    <TableRow key={dossier.id}>
                      <TableCell className="font-mono text-sm">{dossier.numeroDossier}</TableCell>
                      <TableCell className="font-medium">
                        Dr {dossier.prenom} {dossier.nom}
                      </TableCell>
                      <TableCell>{dossier.specialite}</TableCell>
                      <TableCell>{new Date(dossier.dateDepot).toLocaleDateString("fr-FR")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${dossier.completude === 100 ? 'bg-green-500' : 'bg-amber-500'}`}
                              style={{ width: `${dossier.completude}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{dossier.completude}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatutBadge(dossier.statut)}</TableCell>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-green-600">
                              <Check className="w-4 h-4 mr-2" />
                              Valider
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <X className="w-4 h-4 mr-2" />
                              Rejeter
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
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Dossiers à traiter</CardTitle>
              <CardDescription>Dossiers soumis ou en cours d'examen nécessitant une action</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {MOCK_DOSSIERS.filter(d => ["submitted", "under_review"].includes(d.statut)).length} dossier(s) en attente
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
                {MOCK_DOSSIERS.filter(d => ["validated", "rejected"].includes(d.statut)).length} dossier(s) traités
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InscriptionsPage;
