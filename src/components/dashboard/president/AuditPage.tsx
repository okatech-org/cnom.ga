import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { DEMO_AUDIT_LOGS } from "@/lib/demo-president-data";

const ITEMS_PER_PAGE = 20;

const AuditPage = () => {
    const [search, setSearch] = useState("");
    const [module, setModule] = useState("all");
    const [role, setRole] = useState("all");
    const [page, setPage] = useState(1);

    const filtered = DEMO_AUDIT_LOGS.filter(l => {
        if (search && !`${l.action} ${l.detail} ${l.user_name}`.toLowerCase().includes(search.toLowerCase())) return false;
        if (module !== "all" && l.module !== module) return false;
        if (role !== "all" && l.user_role !== role) return false;
        return true;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><FileText className="w-5 h-5" />Journal d'audit</h2>
                    <p className="text-sm text-muted-foreground">Traçabilité complète de toutes les actions — RA-04</p>
                </div>
                <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
            </div>

            <Card>
                <CardContent className="p-4 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Rechercher dans le journal..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
                    </div>
                    <div className="flex gap-3">
                        <Select value={module} onValueChange={v => { setModule(v); setPage(1); }}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Module" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Tous modules</SelectItem>{['M1', 'M2', 'M3', 'M4', 'M5', 'AUTH', 'SYSTEM'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={role} onValueChange={v => { setRole(v); setPage(1); }}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Rôle" /></SelectTrigger>
                            <SelectContent><SelectItem value="all">Tous rôles</SelectItem>{['president', 'sg', 'agent', 'tresorier', 'commission'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <p className="text-sm text-muted-foreground">{filtered.length} entrées</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead className="w-40">Date & heure</TableHead><TableHead>Utilisateur</TableHead><TableHead>Rôle</TableHead><TableHead>Module</TableHead><TableHead>Action</TableHead><TableHead>Détail</TableHead>
                        </TableRow></TableHeader>
                        <TableBody>{paged.map(l => (
                            <TableRow key={l.id}>
                                <TableCell className="text-xs font-mono">{new Date(l.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</TableCell>
                                <TableCell className="text-sm">{l.user_name || '—'}</TableCell>
                                <TableCell>{l.user_role ? <Badge variant="outline" className="text-xs">{l.user_role}</Badge> : '—'}</TableCell>
                                <TableCell>{l.module ? <Badge variant="secondary" className="text-xs">{l.module}</Badge> : '—'}</TableCell>
                                <TableCell className="text-sm font-medium">{l.action}</TableCell>
                                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{l.detail}</TableCell>
                            </TableRow>
                        ))}</TableBody>
                    </Table>
                </CardContent>
            </Card>

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Page {page}/{totalPages}</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditPage;
