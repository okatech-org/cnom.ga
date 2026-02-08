import { useState } from "react";
import { Search, Filter, Download, Eye, Edit, MoreHorizontal, UserPlus } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data
const MOCK_MEDECINS = [
  { id: 1, numeroOrdre: "GA-2024-00123", nom: "NZOGHE", prenom: "Jean-Pierre", specialite: "Médecine Générale", province: "Estuaire", ville: "Libreville", statut: "actif", cotisation: "à_jour" },
  { id: 2, numeroOrdre: "GA-2024-00124", nom: "MBOUMBA", prenom: "Marie", specialite: "Cardiologie", province: "Estuaire", ville: "Libreville", statut: "actif", cotisation: "à_jour" },
  { id: 3, numeroOrdre: "GA-2023-00089", nom: "OBAME", prenom: "Paul", specialite: "Pédiatrie", province: "Ogooué-Maritime", ville: "Port-Gentil", statut: "actif", cotisation: "en_retard" },
  { id: 4, numeroOrdre: "GA-2023-00045", nom: "NDONG", prenom: "Georgette", specialite: "Gynécologie", province: "Estuaire", ville: "Libreville", statut: "actif", cotisation: "à_jour" },
  { id: 5, numeroOrdre: "GA-2022-00201", nom: "ELLA", prenom: "François", specialite: "Chirurgie", province: "Haut-Ogooué", ville: "Franceville", statut: "suspendu", cotisation: "impayé" },
  { id: 6, numeroOrdre: "GA-2024-00156", nom: "MESSI", prenom: "Claire", specialite: "Dermatologie", province: "Estuaire", ville: "Libreville", statut: "actif", cotisation: "à_jour" },
  { id: 7, numeroOrdre: "GA-2021-00078", nom: "ONDO", prenom: "Martin", specialite: "Ophtalmologie", province: "Woleu-Ntem", ville: "Oyem", statut: "actif", cotisation: "en_retard" },
  { id: 8, numeroOrdre: "GA-2020-00034", nom: "MBADINGA", prenom: "Sophie", specialite: "Neurologie", province: "Moyen-Ogooué", ville: "Lambaréné", statut: "retraité", cotisation: "exonéré" },
];

const PROVINCES = ["Toutes", "Estuaire", "Ogooué-Maritime", "Haut-Ogooué", "Woleu-Ntem", "Moyen-Ogooué", "Ngounié", "Nyanga", "Ogooué-Ivindo", "Ogooué-Lolo"];
const SPECIALITES = ["Toutes", "Médecine Générale", "Cardiologie", "Pédiatrie", "Gynécologie", "Chirurgie", "Dermatologie", "Ophtalmologie", "Neurologie"];

const getStatutBadge = (statut: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    actif: { variant: "default", label: "Actif" },
    suspendu: { variant: "destructive", label: "Suspendu" },
    retraité: { variant: "secondary", label: "Retraité" },
  };
  const config = variants[statut] || { variant: "outline", label: statut };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getCotisationBadge = (cotisation: string) => {
  const variants: Record<string, { className: string; label: string }> = {
    "à_jour": { className: "bg-green-100 text-green-800", label: "À jour" },
    "en_retard": { className: "bg-amber-100 text-amber-800", label: "En retard" },
    "impayé": { className: "bg-red-100 text-red-800", label: "Impayé" },
    "exonéré": { className: "bg-gray-100 text-gray-800", label: "Exonéré" },
  };
  const config = variants[cotisation] || { className: "bg-gray-100 text-gray-800", label: cotisation };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
};

export const RepertoirePage = () => {
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("Toutes");
  const [specialite, setSpecialite] = useState("Toutes");

  const filteredMedecins = MOCK_MEDECINS.filter((m) => {
    const matchSearch = 
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.prenom.toLowerCase().includes(search.toLowerCase()) ||
      m.numeroOrdre.toLowerCase().includes(search.toLowerCase());
    const matchProvince = province === "Toutes" || m.province === province;
    const matchSpecialite = specialite === "Toutes" || m.specialite === specialite;
    return matchSearch && matchProvince && matchSpecialite;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Répertoire des Médecins</h1>
          <p className="text-muted-foreground">Gérez le tableau de l'Ordre National des Médecins</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Nouveau médecin
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total inscrits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,247</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">1,189</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Suspendus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">23</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Retraités</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-600">35</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, prénom ou N° d'ordre..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Province" />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={specialite} onValueChange={setSpecialite}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Spécialité" />
          </SelectTrigger>
          <SelectContent>
            {SPECIALITES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Ordre</TableHead>
                <TableHead>Nom complet</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Province</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Cotisation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedecins.map((medecin) => (
                <TableRow key={medecin.id}>
                  <TableCell className="font-mono text-sm">{medecin.numeroOrdre}</TableCell>
                  <TableCell className="font-medium">
                    Dr {medecin.prenom} {medecin.nom}
                  </TableCell>
                  <TableCell>{medecin.specialite}</TableCell>
                  <TableCell>{medecin.province}</TableCell>
                  <TableCell>{getStatutBadge(medecin.statut)}</TableCell>
                  <TableCell>{getCotisationBadge(medecin.cotisation)}</TableCell>
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
                          Voir la fiche
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
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

export default RepertoirePage;
