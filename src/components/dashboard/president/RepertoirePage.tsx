import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Eye, Download, ChevronLeft, ChevronRight, FileText, Shield } from "lucide-react";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import { DEMO_DOCTORS } from "@/lib/demo-president-data";
import type { Doctor, DoctorStatus } from "@/types/medecin";

const ITEMS_PER_PAGE = 20;

const RepertoirePage = () => {
    const [search, setSearch] = useState("");
    const [specialite, setSpecialite] = useState("all");
    const [province, setProvince] = useState("all");
    const [statut, setStatut] = useState("all");
    const [secteur, setSecteur] = useState("all");
    const [page, setPage] = useState(1);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [showEncrypted, setShowEncrypted] = useState(false);
    const [showDisciplinary, setShowDisciplinary] = useState(false);

    const filtered = DEMO_DOCTORS.filter(d => {
        if (search && !`${d.nom} ${d.prenoms} ${d.numero_ordre}`.toLowerCase().includes(search.toLowerCase())) return false;
        if (specialite !== "all" && d.specialite_principale !== specialite) return false;
        if (province !== "all" && d.province !== province) return false;
        if (statut !== "all" && d.statut !== statut) return false;
        if (secteur !== "all" && d.secteur_exercice !== secteur) return false;
        return true;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    const specs = [...new Set(DEMO_DOCTORS.map(d => d.specialite_principale))].sort();
    const provs = [...new Set(DEMO_DOCTORS.map(d => d.province))].sort();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Répertoire des Médecins</h2>
                    <p className="text-sm text-muted-foreground">Lecture complète du Tableau de l'Ordre — Module M1</p>
                </div>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
            </div>

            {/* Search & Filters */}
            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Rechercher un médecin (nom, prénom, N° Ordre)..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Select value={specialite} onValueChange={v => { setSpecialite(v); setPage(1); }}>
                            <SelectTrigger><SelectValue placeholder="Spécialité" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Toutes spécialités</SelectItem>{specs.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={province} onValueChange={v => { setProvince(v); setPage(1); }}>
                            <SelectTrigger><SelectValue placeholder="Province" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Toutes provinces</SelectItem>{provs.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={statut} onValueChange={v => { setStatut(v); setPage(1); }}>
                            <SelectTrigger><SelectValue placeholder="Statut" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Tous statuts</SelectItem><SelectItem value="Inscrit">Inscrit</SelectItem><SelectItem value="Suspendu">Suspendu</SelectItem><SelectItem value="Retraité">Retraité</SelectItem><SelectItem value="Radié">Radié</SelectItem></SelectContent>
                        </Select>
                        <Select value={secteur} onValueChange={v => { setSecteur(v); setPage(1); }}>
                            <SelectTrigger><SelectValue placeholder="Secteur" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Tous secteurs</SelectItem><SelectItem value="Public">Public</SelectItem><SelectItem value="Privé">Privé</SelectItem><SelectItem value="Mixte">Mixte</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showEncrypted} onChange={e => setShowEncrypted(e.target.checked)} className="rounded" /><Shield className="w-3 h-3" />Données chiffrées (RA-03)</label>
                        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={showDisciplinary} onChange={e => setShowDisciplinary(e.target.checked)} className="rounded" />Historique disciplinaire (RA-02)</label>
                    </div>
                    <p className="text-sm text-muted-foreground">{filtered.length} médecins trouvés</p>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead className="w-20">N° Ordre</TableHead><TableHead>Nom & Prénoms</TableHead><TableHead>Spécialité</TableHead><TableHead>Province</TableHead><TableHead>Ville</TableHead><TableHead>Statut</TableHead><TableHead>Secteur</TableHead><TableHead className="w-20">Inscrit</TableHead><TableHead className="w-12" />
                        </TableRow></TableHeader>
                        <TableBody>{paged.map(d => (
                            <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedDoctor(d)}>
                                <TableCell className="font-mono text-xs">{String(d.numero_ordre).padStart(4, '0')}</TableCell>
                                <TableCell className="font-medium">Dr. {d.nom} {d.prenoms?.charAt(0)}.</TableCell>
                                <TableCell className="text-sm">{d.specialite_principale}</TableCell>
                                <TableCell className="text-sm">{d.province}</TableCell>
                                <TableCell className="text-sm">{d.ville_exercice}</TableCell>
                                <TableCell><StatusBadge status={d.statut as DoctorStatus} size="sm" /></TableCell>
                                <TableCell className="text-sm">{d.secteur_exercice}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{d.date_inscription?.slice(0, 4)}</TableCell>
                                <TableCell><Button variant="ghost" size="icon" className="w-8 h-8"><Eye className="w-4 h-4" /></Button></TableCell>
                            </TableRow>
                        ))}</TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Page {page}/{totalPages}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                </div>
            )}

            {/* Doctor Detail Sheet */}
            <Sheet open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
                <SheetContent className="sm:max-w-lg overflow-y-auto">
                    {selectedDoctor && (
                        <>
                            <SheetHeader>
                                <SheetTitle>Dr. {selectedDoctor.nom} {selectedDoctor.prenoms}</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                                <section>
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Identité</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><p className="text-muted-foreground text-xs">N° Ordre</p><p className="font-medium">{String(selectedDoctor.numero_ordre).padStart(4, '0')}</p></div>
                                        <div><p className="text-muted-foreground text-xs">Genre</p><p className="font-medium">{selectedDoctor.genre === 'F' ? 'Féminin' : 'Masculin'}</p></div>
                                        {showEncrypted && <><div><p className="text-muted-foreground text-xs">Date de naissance 🔓</p><p className="font-medium">15/06/1975</p></div><div><p className="text-muted-foreground text-xs">Nationalité 🔓</p><p className="font-medium">Gabonaise</p></div></>}
                                    </div>
                                </section>
                                <section>
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Professionnel</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div><p className="text-muted-foreground text-xs">Spécialité</p><p className="font-medium">{selectedDoctor.specialite_principale}</p></div>
                                        <div><p className="text-muted-foreground text-xs">Secteur</p><p className="font-medium">{selectedDoctor.secteur_exercice}</p></div>
                                        <div><p className="text-muted-foreground text-xs">Établissement</p><p className="font-medium">{selectedDoctor.etablissement}</p></div>
                                        <div><p className="text-muted-foreground text-xs">Ville</p><p className="font-medium">{selectedDoctor.ville_exercice}</p></div>
                                        <div><p className="text-muted-foreground text-xs">Diplôme</p><p className="font-medium">{selectedDoctor.diplome_principal}</p></div>
                                        <div><p className="text-muted-foreground text-xs">Université</p><p className="font-medium">{selectedDoctor.universite_obtention}</p></div>
                                    </div>
                                </section>
                                <section>
                                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Statut & Inscription</h4>
                                    <StatusBadge status={selectedDoctor.statut as DoctorStatus} />
                                    <p className="text-sm mt-2 text-muted-foreground">Inscrit le {selectedDoctor.date_inscription}</p>
                                </section>
                                {showDisciplinary && (
                                    <section>
                                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Historique disciplinaire 🔒</h4>
                                        <p className="text-sm text-muted-foreground italic">Aucun antécédent disciplinaire enregistré.</p>
                                    </section>
                                )}
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm"><FileText className="w-4 h-4 mr-2" />Exporter PDF</Button>
                                </div>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default RepertoirePage;
