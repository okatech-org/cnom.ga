import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Megaphone, Mail, MessageSquare, Bell, Zap, CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import { formatCFA, formatCompactCFA, formatDateFR } from "@/lib/finance-utils";
import { demoCampaigns, demoReminderConfig } from "@/lib/demo-tresorier-data";

const RelancesPage = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-indigo-500" />
                        Relances automatiques
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Configuration et suivi des campagnes de relance
                    </p>
                </div>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    <Zap className="w-4 h-4 mr-1" />
                    Nouvelle campagne
                </Button>
            </div>

            {/* Escalation pipeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Pipeline d'escalade</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {demoReminderConfig.map((config, i) => (
                            <div key={config.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${i === 0 ? 'bg-green-500' : i === 1 ? 'bg-yellow-500' : i === 2 ? 'bg-orange-500' : 'bg-red-500'
                                    }`}>
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground">{config.label}</p>
                                    <p className="text-xs text-muted-foreground">{config.delai}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <div className="flex items-center gap-1.5">
                                        {config.channels.email && (
                                            <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center" title="Email">
                                                <Mail className="w-3 h-3 text-blue-600" />
                                            </div>
                                        )}
                                        {config.channels.sms && (
                                            <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center" title="SMS">
                                                <MessageSquare className="w-3 h-3 text-emerald-600" />
                                            </div>
                                        )}
                                        {config.channels.push && (
                                            <div className="w-6 h-6 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center" title="Push">
                                                <Bell className="w-3 h-3 text-purple-600" />
                                            </div>
                                        )}
                                    </div>
                                    <Switch checked={true} />
                                </div>
                                {i < demoReminderConfig.length - 1 && (
                                    <ArrowRight className="w-4 h-4 text-muted-foreground absolute right-0 hidden" />
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Campaign history */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Historique des campagnes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campagne</TableHead>
                                <TableHead className="text-center">Ciblés</TableHead>
                                <TableHead className="text-center">Envoyés</TableHead>
                                <TableHead className="text-center">Ouverts</TableHead>
                                <TableHead className="text-center">Paiements</TableHead>
                                <TableHead className="text-right">Revenus</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {demoCampaigns.map((c) => {
                                const roi = c.total_revenue_generated > 0
                                    ? ((c.total_resulted_payment / c.total_targeted) * 100).toFixed(0)
                                    : '0';
                                return (
                                    <TableRow key={c.id}>
                                        <TableCell>
                                            <p className="font-medium text-sm">{c.titre}</p>
                                            <p className="text-[10px] text-muted-foreground">{formatDateFR(c.created_at)}</p>
                                        </TableCell>
                                        <TableCell className="text-center">{c.total_targeted}</TableCell>
                                        <TableCell className="text-center">{c.total_sent}</TableCell>
                                        <TableCell className="text-center">{c.total_opened}</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <span className="font-semibold text-emerald-600">{c.total_resulted_payment}</span>
                                                <span className="text-[10px] text-muted-foreground">({roi}%)</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-emerald-600">
                                            {formatCompactCFA(c.total_revenue_generated)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={c.status === 'completed' ? 'default' : 'secondary'}
                                                className={`text-[10px] ${c.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : ''}`}
                                            >
                                                {c.status === 'completed' ? '✓ Terminée' : c.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* ROI summary */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4 text-center">
                        <TrendingUp className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                        <p className="text-2xl font-bold text-foreground">
                            {demoCampaigns.reduce((s, c) => s + c.total_resulted_payment, 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">Paiements générés</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <CheckCircle2 className="w-6 h-6 mx-auto text-blue-500 mb-1" />
                        <p className="text-2xl font-bold text-foreground">
                            {formatCompactCFA(demoCampaigns.reduce((s, c) => s + c.total_revenue_generated, 0))}
                        </p>
                        <p className="text-xs text-muted-foreground">Revenus récupérés</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <Megaphone className="w-6 h-6 mx-auto text-indigo-500 mb-1" />
                        <p className="text-2xl font-bold text-foreground">{demoCampaigns.length}</p>
                        <p className="text-xs text-muted-foreground">Campagnes lancées</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RelancesPage;
