import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Smartphone, Clock, Mail, Lock, Globe } from "lucide-react";
import RoleBadge from "@/components/dashboard/shared/RoleBadge";

const ProfilPage = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><User className="w-5 h-5" />Mon profil</h2>

            {/* Profile Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className="w-20 h-20 bg-gradient-to-br from-cnom-gold to-cnom-gold-dark rounded-full flex items-center justify-center text-3xl">🏛️</div>
                        <div>
                            <h3 className="text-xl font-bold">Dr Emmanuel OGANDAGA</h3>
                            <p className="text-muted-foreground">Président du Conseil National de l'Ordre des Médecins</p>
                            <div className="flex items-center gap-2 mt-2">
                                <RoleBadge role="president" />
                                <Badge variant="outline" className="text-xs">Mandat 2024-2028</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">president@cnom-gabon.ga</p></div>
                        <div><p className="text-muted-foreground text-xs">Téléphone</p><p className="font-medium">+241 01 44 00 00</p></div>
                        <div><p className="text-muted-foreground text-xs">Spécialité</p><p className="font-medium">Neurochirurgie</p></div>
                        <div><p className="text-muted-foreground text-xs">N° Ordre</p><p className="font-medium">0042</p></div>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4" />Sécurité</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3"><Smartphone className="w-5 h-5 text-emerald-600" /><div><p className="text-sm font-medium">Authentification MFA</p><p className="text-xs text-muted-foreground">Activée — Application TOTP</p></div></div>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Actif</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-blue-600" /><div><p className="text-sm font-medium">IP Whitelist (RA-01)</p><p className="text-xs text-muted-foreground">10.0.1.0/24 · Réseau CNOM Libreville</p></div></div>
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Actif</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3"><Lock className="w-5 h-5 text-muted-foreground" /><div><p className="text-sm font-medium">Mot de passe</p><p className="text-xs text-muted-foreground">Dernière modification : 15/01/2026</p></div></div>
                        <Button variant="outline" size="sm">Modifier</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-amber-600" /><div><p className="text-sm font-medium">Timeout de session</p><p className="text-xs text-muted-foreground">Déconnexion automatique après 30 minutes d'inactivité</p></div></div>
                        <Badge variant="outline" className="text-xs">30 min</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Mail className="w-4 h-4" />Préférences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { label: "Notifications par email", desc: "Recevoir les alertes critiques par email", default: true },
                        { label: "Notifications push", desc: "Alertes en temps réel dans le navigateur", default: true },
                        { label: "Rapport hebdomadaire", desc: "Synthèse automatique chaque lundi à 08h", default: false },
                    ].map((p, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div><p className="text-sm font-medium">{p.label}</p><p className="text-xs text-muted-foreground">{p.desc}</p></div>
                            <Switch defaultChecked={p.default} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilPage;
