import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    User, Shield, Smartphone, Monitor, Clock, Lock, Bell,
    Mail, Key, Globe, Save
} from "lucide-react";

const ProfilPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-500" />
                    Mon profil
                </h2>
                <p className="text-sm text-muted-foreground">
                    Paramètres du compte et sécurité
                </p>
            </div>

            {/* Profile header */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white text-xl font-bold">
                            MM
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-foreground">Dr Madeleine MELLA-MBOUMBA</h3>
                            <p className="text-sm text-muted-foreground">Trésorière du CNOM — Membre du Bureau</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">Trésorier(e)</Badge>
                                <Badge variant="outline" className="text-xs">Depuis 2024</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Contact info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            Informations de contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Email professionnel</Label>
                            <Input defaultValue="tresorier@cnom-gabon.ga" disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Téléphone</Label>
                            <Input defaultValue="+241 74 XX XX XX" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email de récupération</Label>
                            <Input defaultValue="m.mella@gmail.com" />
                        </div>
                        <Button variant="outline" size="sm">
                            <Save className="w-4 h-4 mr-1" />
                            Sauvegarder
                        </Button>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            Sécurité
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Key className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Mot de passe</p>
                                    <p className="text-xs text-muted-foreground">Modifié le 15/01/2026</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Modifier</Button>
                        </div>

                        <Separator />

                        {/* MFA */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Authentification 2FA</p>
                                    <p className="text-xs text-emerald-600">✓ Activé (TOTP)</p>
                                </div>
                            </div>
                            <Switch checked={true} />
                        </div>

                        <Separator />

                        {/* IP Whitelist */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Restriction IP</p>
                                    <p className="text-xs text-muted-foreground">2 adresses autorisées</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Configurer</Button>
                        </div>

                        <Separator />

                        {/* Active sessions */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium flex items-center gap-2">
                                <Monitor className="w-4 h-4 text-muted-foreground" />
                                Sessions actives
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between bg-muted/50 rounded-lg p-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <div>
                                            <p className="text-xs font-medium">MacBook Pro — Safari</p>
                                            <p className="text-[10px] text-muted-foreground">Libreville • Active maintenant</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-[10px]">Actuelle</Badge>
                                </div>
                                <div className="flex items-center justify-between bg-muted/50 rounded-lg p-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-400" />
                                        <div>
                                            <p className="text-xs font-medium">iPhone 15 — App mobile</p>
                                            <p className="text-[10px] text-muted-foreground">Libreville • Il y a 2h</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px] text-red-500">
                                        Révoquer
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Notification preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Bell className="w-4 h-4 text-muted-foreground" />
                        Préférences de notification financière
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            { label: "Paiements reçus", desc: "Chaque nouveau paiement", enabled: true },
                            { label: "Paiements échoués", desc: "En temps réel", enabled: true },
                            { label: "Impayés critiques > 12 mois", desc: "Alertes immédiates", enabled: true },
                            { label: "Seuils de recouvrement", desc: "Franchissement de paliers", enabled: true },
                            { label: "Moratoires expirants", desc: "30 jours avant expiration", enabled: true },
                            { label: "Rapports hebdomadaires", desc: "Résumé financier", enabled: false },
                        ].map((pref, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-foreground">{pref.label}</p>
                                    <p className="text-[10px] text-muted-foreground">{pref.desc}</p>
                                </div>
                                <Switch checked={pref.enabled} />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilPage;
