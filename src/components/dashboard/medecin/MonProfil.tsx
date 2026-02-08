import { useState } from "react";
import { User, Mail, Phone, MapPin, Award, Calendar, Edit3, Save, Shield, Lock, Eye, EyeOff, Download, Key, Smartphone, Monitor, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/dashboard/shared/StatusBadge";
import type { Doctor } from "@/types/medecin";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MonProfilProps {
    doctor: Doctor;
    photoUrl?: string;
}

const MonProfil = ({ doctor, photoUrl }: MonProfilProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        telephone_pro: doctor.telephone_pro,
        email: doctor.email,
        adresse_cabinet: doctor.adresse_cabinet || "",
    });
    const [showSecurity, setShowSecurity] = useState(false);
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: "Modifications enregistrées",
            description: "Vos coordonnées ont été mises à jour.",
        });
        setIsEditing(false);
    };

    // Demo sessions
    const recentSessions = [
        { device: "Chrome / macOS", ip: "41.158.XX.XX", date: "08/02/2026 21:00", current: true },
        { device: "Safari / iPhone", ip: "41.158.XX.XX", date: "07/02/2026 09:15", current: false },
        { device: "Firefox / Windows", ip: "41.158.XX.XX", date: "05/02/2026 14:30", current: false },
    ];

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Photo */}
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg relative group">
                                {photoUrl ? (
                                    <img src={photoUrl} alt={`Dr. ${doctor.prenoms} ${doctor.nom}`} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-12 h-12 text-primary" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Edit3 className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-primary">N° {doctor.numero_ordre}</p>
                            <StatusBadge status={doctor.statut} size="sm" className="mt-1" />
                        </div>

                        {/* Name and basic info */}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold">Dr. {doctor.prenoms} {doctor.nom}</h2>
                            <p className="text-muted-foreground">{doctor.specialite_principale}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <Badge variant="outline" className="text-xs">{doctor.secteur_exercice}</Badge>
                                <Badge variant="outline" className="text-xs">{doctor.province}</Badge>
                                {doctor.etablissement && (
                                    <Badge variant="outline" className="text-xs">{doctor.etablissement}</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Read-only Identity */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        Identité <span className="text-xs font-normal text-muted-foreground">(lecture seule)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Nom", value: doctor.nom, icon: User },
                            { label: "Prénoms", value: doctor.prenoms, icon: User },
                            { label: "N° d'Ordre", value: String(doctor.numero_ordre), icon: Award },
                            { label: "Genre", value: doctor.genre === "M" ? "Masculin" : "Féminin", icon: User },
                            { label: "Date d'inscription", value: new Date(doctor.date_inscription).toLocaleDateString("fr-FR"), icon: Calendar },
                            { label: "Diplôme", value: `${doctor.diplome_principal} — ${doctor.universite_obtention} (${doctor.annee_obtention})`, icon: Award },
                        ].map((field) => (
                            <div key={field.label} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <field.icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-muted-foreground">{field.label}</p>
                                    <p className="text-sm font-medium">{field.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Editable Coordinates */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Coordonnées <span className="text-xs font-normal text-muted-foreground">(modifiable)</span>
                    </CardTitle>
                    <Button
                        variant={isEditing ? "default" : "outline"}
                        size="sm"
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="gap-1.5"
                    >
                        {isEditing ? <><Save className="w-3.5 h-3.5" /> Enregistrer</> : <><Edit3 className="w-3.5 h-3.5" /> Modifier</>}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="telephone" className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" /> Téléphone professionnel
                            </Label>
                            {isEditing ? (
                                <Input
                                    id="telephone"
                                    value={editData.telephone_pro}
                                    onChange={(e) => setEditData(d => ({ ...d, telephone_pro: e.target.value }))}
                                />
                            ) : (
                                <p className="text-sm font-medium p-2">{editData.telephone_pro}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" /> Email
                            </Label>
                            {isEditing ? (
                                <Input
                                    id="email"
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData(d => ({ ...d, email: e.target.value }))}
                                />
                            ) : (
                                <p className="text-sm font-medium p-2">{editData.email}</p>
                            )}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="adresse" className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" /> Adresse du cabinet
                            </Label>
                            {isEditing ? (
                                <Input
                                    id="adresse"
                                    value={editData.adresse_cabinet}
                                    onChange={(e) => setEditData(d => ({ ...d, adresse_cabinet: e.target.value }))}
                                />
                            ) : (
                                <p className="text-sm font-medium p-2">{editData.adresse_cabinet || "Non renseignée"}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Exercice (validation required) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-600" />
                        Exercice professionnel <span className="text-xs font-normal text-muted-foreground">(validation requise)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: "Spécialité", value: doctor.specialite_principale },
                            { label: "Ville d'exercice", value: doctor.ville_exercice },
                            { label: "Établissement", value: doctor.etablissement || "—" },
                            { label: "Secteur", value: doctor.secteur_exercice },
                        ].map((field) => (
                            <div key={field.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                    <p className="text-xs text-muted-foreground">{field.label}</p>
                                    <p className="text-sm font-medium">{field.value}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title={`Modifier ${field.label}`}>
                                    <Edit3 className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Les modifications de ces champs nécessitent une validation du Back-Office.
                    </p>
                </CardContent>
            </Card>

            {/* Security Section */}
            <Card>
                <CardHeader className="cursor-pointer" onClick={() => setShowSecurity(!showSecurity)}>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Sécurité du compte
                        <span className="text-xs font-normal text-muted-foreground ml-auto">{showSecurity ? "▾" : "▸"}</span>
                    </CardTitle>
                </CardHeader>
                {showSecurity && (
                    <CardContent className="space-y-4">
                        {/* Password */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Mot de passe</p>
                                    <p className="text-xs text-muted-foreground">Minimum 12 caractères</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Modifier</Button>
                        </div>

                        {/* MFA */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Smartphone className="w-4 h-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Authentification MFA</p>
                                    <p className="text-xs text-muted-foreground">OTP SMS activé</p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <Separator />

                        {/* Active Sessions */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                Sessions actives
                            </h4>
                            <div className="space-y-2">
                                {recentSessions.map((session, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium flex items-center gap-1.5">
                                                    {session.device}
                                                    {session.current && <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700">Actuelle</Badge>}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{session.ip} · {session.date}</p>
                                            </div>
                                        </div>
                                        {!session.current && (
                                            <Button variant="ghost" size="sm" className="text-xs text-destructive">Révoquer</Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Consent */}
                        <div>
                            <h4 className="text-sm font-semibold mb-3">Gestion du consentement (APDPVP)</h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between py-2">
                                    <Label className="text-sm">Visibilité dans l'annuaire public</Label>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <Label className="text-sm">Consentement au traitement des données</Label>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1.5 mt-3">
                                <Download className="w-3.5 h-3.5" />
                                Exporter mes données
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

export default MonProfil;
