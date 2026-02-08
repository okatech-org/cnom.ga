import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { FileCheck, Search, Download, Send, Printer, Eye } from "lucide-react";
import { formatDateTimeFR } from "@/lib/finance-utils";
import { demoDocumentRequests } from "@/lib/demo-tresorier-data";
import { useState } from "react";

const RecusAttestations = () => {
    const [search, setSearch] = useState("");

    const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
        en_attente: { label: "En attente", color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
        genere: { label: "Généré", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
        envoye: { label: "Envoyé", color: "text-emerald-600", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
    };

    const filtered = demoDocumentRequests.filter(d =>
        d.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
        d.document_type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <FileCheck className="w-5 h-5 text-blue-500" />
                        Reçus & Attestations
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Gestion des documents financiers et attestations de cotisation
                    </p>
                </div>
                <Button variant="outline" size="sm">
                    <Printer className="w-4 h-4 mr-1" />
                    Génération en lot
                </Button>
            </div>

            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-amber-600">
                            {demoDocumentRequests.filter(d => d.status === 'en_attente').length}
                        </p>
                        <p className="text-xs text-muted-foreground">En attente</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            {demoDocumentRequests.filter(d => d.status === 'genere').length}
                        </p>
                        <p className="text-xs text-muted-foreground">Générés</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-emerald-600">
                            {demoDocumentRequests.filter(d => d.status === 'envoye').length}
                        </p>
                        <p className="text-xs text-muted-foreground">Envoyés</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher un médecin ou document..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Référence</TableHead>
                                <TableHead>Médecin</TableHead>
                                <TableHead>Document</TableHead>
                                <TableHead>Demandé le</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((doc) => {
                                const sConf = statusConfig[doc.status];
                                return (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-mono text-xs">{doc.id}</TableCell>
                                        <TableCell className="font-medium text-sm">{doc.doctor_name}</TableCell>
                                        <TableCell className="text-sm">{doc.document_type}</TableCell>
                                        <TableCell className="text-xs">{formatDateTimeFR(doc.requested_at)}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sConf.bgColor} ${sConf.color}`}>
                                                {sConf.label}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1">
                                                {doc.status === 'en_attente' && (
                                                    <Button variant="default" size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700">
                                                        Générer
                                                    </Button>
                                                )}
                                                {doc.status === 'genere' && (
                                                    <>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7">
                                                            <Send className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </>
                                                )}
                                                {doc.status === 'envoye' && (
                                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                                        <Download className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default RecusAttestations;
