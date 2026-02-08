import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, FileText, User, GraduationCap, CreditCard, CheckCircle2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

// Validation schemas for each step
const step1Schema = z.object({
  nom: z.string().trim().min(2, "Minimum 2 caractères").max(100),
  prenom: z.string().trim().min(2, "Minimum 2 caractères").max(100),
  nomNaissance: z.string().trim().max(100).optional(),
  dateNaissance: z.string().min(1, "Date requise"),
  lieuNaissance: z.string().trim().min(2, "Lieu requis").max(100),
  nationalite: z.string().min(1, "Nationalité requise"),
  genre: z.enum(["M", "F"], { required_error: "Genre requis" }),
});

const step2Schema = z.object({
  email: z.string().trim().email("Email invalide").max(255),
  telephone: z.string().trim().min(8, "Numéro invalide").max(20),
  adresse: z.string().trim().min(5, "Adresse requise").max(300),
  ville: z.string().min(1, "Ville requise"),
  province: z.string().min(1, "Province requise"),
});

const step3Schema = z.object({
  diplome: z.string().trim().min(5, "Diplôme requis").max(200),
  universite: z.string().trim().min(5, "Université requise").max(200),
  anneeObtention: z.string().min(1, "Année requise"),
  paysObtention: z.string().min(1, "Pays requis"),
  specialite: z.string().min(1, "Spécialité requise"),
  sousSpecialite: z.string().trim().max(100).optional(),
});

const step4Schema = z.object({
  secteur: z.enum(["public", "prive", "mixte", "militaire"], { required_error: "Secteur requis" }),
  etablissement: z.string().trim().max(200).optional(),
  adresseCabinet: z.string().trim().max(300).optional(),
  villeCabinet: z.string().min(1, "Ville requise"),
});

// Combined schema
const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema);
type InscriptionFormData = z.infer<typeof fullSchema>;

const steps = [
  { id: 1, title: "Identité", icon: User, description: "Informations personnelles" },
  { id: 2, title: "Coordonnées", icon: FileText, description: "Contact et adresse" },
  { id: 3, title: "Diplômes", icon: GraduationCap, description: "Formation et qualifications" },
  { id: 4, title: "Exercice", icon: CreditCard, description: "Lieu d'exercice" },
  { id: 5, title: "Documents", icon: Upload, description: "Pièces justificatives" },
];

const provinces = [
  "Estuaire", "Haut-Ogooué", "Moyen-Ogooué", "Ngounié", 
  "Nyanga", "Ogooué-Ivindo", "Ogooué-Lolo", "Ogooué-Maritime", "Woleu-Ntem"
];

const specialites = [
  "Médecine Générale", "Anesthésie-Réanimation", "Cardiologie", "Chirurgie Générale",
  "Dermatologie", "Gastro-entérologie", "Gynécologie-Obstétrique", "Médecine Interne",
  "Néphrologie", "Neurologie", "Ophtalmologie", "ORL", "Pédiatrie", "Pneumologie",
  "Psychiatrie", "Radiologie", "Rhumatologie", "Urologie", "Autre"
];

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const Inscription = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile | null>>({
    diplome: null,
    casierJudiciaire: null,
    pieceIdentite: null,
    photo1: null,
    photo2: null,
    cv: null,
    homologation: null,
  });
  const { toast } = useToast();

  const form = useForm<InscriptionFormData>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: {
      nom: "",
      prenom: "",
      nomNaissance: "",
      dateNaissance: "",
      lieuNaissance: "",
      nationalite: "",
      email: "",
      telephone: "",
      adresse: "",
      ville: "",
      province: "",
      diplome: "",
      universite: "",
      anneeObtention: "",
      paysObtention: "",
      specialite: "",
      sousSpecialite: "",
      secteur: undefined,
      etablissement: "",
      adresseCabinet: "",
      villeCabinet: "",
    },
  });

  const handleFileUpload = (fileKey: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximale est de 10 Mo.",
          variant: "destructive",
        });
        return;
      }
      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Format non supporté",
          description: "Seuls les fichiers PDF, JPG et PNG sont acceptés.",
          variant: "destructive",
        });
        return;
      }
      setUploadedFiles(prev => ({
        ...prev,
        [fileKey]: { name: file.name, size: file.size, type: file.type }
      }));
    }
  };

  const removeFile = (fileKey: string) => {
    setUploadedFiles(prev => ({ ...prev, [fileKey]: null }));
  };

  const canProceedToNext = (): boolean => {
    if (currentStep === 5) {
      // Check required documents
      return !!(uploadedFiles.diplome && uploadedFiles.casierJudiciaire && 
             uploadedFiles.pieceIdentite && uploadedFiles.photo1 && uploadedFiles.photo2);
    }
    return true;
  };

  const handleNext = async () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = await form.trigger(["nom", "prenom", "dateNaissance", "lieuNaissance", "nationalite", "genre"]);
        break;
      case 2:
        isValid = await form.trigger(["email", "telephone", "adresse", "ville", "province"]);
        break;
      case 3:
        isValid = await form.trigger(["diplome", "universite", "anneeObtention", "paysObtention", "specialite"]);
        break;
      case 4:
        isValid = await form.trigger(["secteur", "villeCabinet"]);
        break;
      case 5:
        isValid = canProceedToNext();
        if (!isValid) {
          toast({
            title: "Documents manquants",
            description: "Veuillez téléverser tous les documents obligatoires.",
            variant: "destructive",
          });
        }
        break;
    }
    
    if (isValid && currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else if (isValid && currentStep === 5) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsComplete(true);
    
    toast({
      title: "Dossier soumis avec succès",
      description: "Vous recevrez un email de confirmation sous 24h.",
    });
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Dossier soumis avec succès !
          </h1>
          <p className="text-muted-foreground mb-8">
            Votre demande d'inscription au Tableau de l'Ordre a été transmise. 
            Vous recevrez un email de confirmation avec votre numéro de dossier sous 24h.
          </p>
          <div className="bg-background rounded-xl p-6 border border-border mb-8 text-left">
            <h3 className="font-semibold text-foreground mb-4">Prochaines étapes :</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Vérification des pièces justificatives (3-5 jours)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Validation par la Commission d'inscription</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Attribution de votre Numéro d'Ordre</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Activation de votre carte e-CPS</span>
              </li>
            </ul>
          </div>
          <div className="flex justify-center gap-4">
            <Link to="/">
              <Button variant="outline">Retour à l'accueil</Button>
            </Link>
            <Button disabled>Suivre mon dossier</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-hero-gradient rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚕</span>
              </div>
              <span className="font-display font-bold text-primary text-lg">
                CNOM Gabon
              </span>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Annuler
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Inscription au Tableau de l'Ordre
            </h1>
            <p className="text-muted-foreground">
              Complétez votre dossier en 5 étapes simples
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors
                      ${currentStep === step.id 
                        ? 'bg-primary text-white' 
                        : currentStep > step.id 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-12 lg:w-24 h-1 mx-2 rounded ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">{steps[currentStep - 1].title}</p>
              <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="mt-4" />
          </div>

          {/* Form */}
          <Form {...form}>
            <form className="bg-background rounded-2xl p-6 lg:p-8 shadow-cnom border border-border">
              {/* Step 1: Identity */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom *</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom de famille" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="prenom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom(s) *</FormLabel>
                          <FormControl>
                            <Input placeholder="Vos prénoms" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nomNaissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de naissance</FormLabel>
                          <FormControl>
                            <Input placeholder="Si différent" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="genre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genre *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="M">Masculin</SelectItem>
                              <SelectItem value="F">Féminin</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateNaissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lieuNaissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lieu de naissance *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ville, Pays" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nationalite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationalité *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gabonaise">Gabonaise</SelectItem>
                              <SelectItem value="camerounaise">Camerounaise</SelectItem>
                              <SelectItem value="congolaise">Congolaise</SelectItem>
                              <SelectItem value="francaise">Française</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Contact */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+241 XX XX XX XX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="adresse"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse personnelle *</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Quartier, rue, numéro..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="ville"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="libreville">Libreville</SelectItem>
                              <SelectItem value="port-gentil">Port-Gentil</SelectItem>
                              <SelectItem value="franceville">Franceville</SelectItem>
                              <SelectItem value="oyem">Oyem</SelectItem>
                              <SelectItem value="moanda">Moanda</SelectItem>
                              <SelectItem value="mouila">Mouila</SelectItem>
                              <SelectItem value="lambarene">Lambaréné</SelectItem>
                              <SelectItem value="tchibanga">Tchibanga</SelectItem>
                              <SelectItem value="koulamoutou">Koulamoutou</SelectItem>
                              <SelectItem value="makokou">Makokou</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map(p => (
                                <SelectItem key={p} value={p.toLowerCase()}>{p}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Education */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="diplome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Diplôme de Docteur en Médecine *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Doctorat en Médecine" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="universite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Université d'obtention *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom de l'université" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paysObtention"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pays d'obtention *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="gabon">Gabon</SelectItem>
                              <SelectItem value="france">France</SelectItem>
                              <SelectItem value="maroc">Maroc</SelectItem>
                              <SelectItem value="senegal">Sénégal</SelectItem>
                              <SelectItem value="cameroun">Cameroun</SelectItem>
                              <SelectItem value="cote-ivoire">Côte d'Ivoire</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="anneeObtention"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Année d'obtention *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 40 }, (_, i) => 2026 - i).map(year => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spécialité principale *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {specialites.map(s => (
                                <SelectItem key={s} value={s.toLowerCase().replace(/ /g, "-")}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sousSpecialite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sous-spécialité</FormLabel>
                          <FormControl>
                            <Input placeholder="Si applicable" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Practice */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="secteur"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secteur d'exercice *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="prive">Privé</SelectItem>
                              <SelectItem value="mixte">Mixte</SelectItem>
                              <SelectItem value="militaire">Militaire</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="etablissement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Établissement principal</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom de l'hôpital ou clinique" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="adresseCabinet"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse du cabinet / lieu d'exercice</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Adresse complète" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="villeCabinet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville d'exercice *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="libreville">Libreville</SelectItem>
                              <SelectItem value="port-gentil">Port-Gentil</SelectItem>
                              <SelectItem value="franceville">Franceville</SelectItem>
                              <SelectItem value="oyem">Oyem</SelectItem>
                              <SelectItem value="moanda">Moanda</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Documents */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-semibold mb-1">Formats acceptés</p>
                        <p>PDF, JPG ou PNG • Taille max : 10 Mo par fichier</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Diplôme */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Diplôme de Docteur en Médecine *
                      </label>
                      {uploadedFiles.diplome ? (
                        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground truncate max-w-[180px]">
                              {uploadedFiles.diplome.name}
                            </span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("diplome")}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Téléverser</span>
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload("diplome")} />
                        </label>
                      )}
                    </div>

                    {/* Casier judiciaire */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Casier judiciaire N°3 *
                        <span className="text-muted-foreground font-normal"> (moins de 3 mois)</span>
                      </label>
                      {uploadedFiles.casierJudiciaire ? (
                        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground truncate max-w-[180px]">
                              {uploadedFiles.casierJudiciaire.name}
                            </span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("casierJudiciaire")}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Téléverser</span>
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload("casierJudiciaire")} />
                        </label>
                      )}
                    </div>

                    {/* Pièce d'identité */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Pièce d'identité *
                        <span className="text-muted-foreground font-normal"> (CNI ou passeport)</span>
                      </label>
                      {uploadedFiles.pieceIdentite ? (
                        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground truncate max-w-[180px]">
                              {uploadedFiles.pieceIdentite.name}
                            </span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("pieceIdentite")}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Téléverser</span>
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload("pieceIdentite")} />
                        </label>
                      )}
                    </div>

                    {/* Photo 1 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Photo d'identité 1 *
                      </label>
                      {uploadedFiles.photo1 ? (
                        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground truncate max-w-[180px]">
                              {uploadedFiles.photo1.name}
                            </span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("photo1")}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Téléverser</span>
                          <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={handleFileUpload("photo1")} />
                        </label>
                      )}
                    </div>

                    {/* Photo 2 */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Photo d'identité 2 *
                      </label>
                      {uploadedFiles.photo2 ? (
                        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground truncate max-w-[180px]">
                              {uploadedFiles.photo2.name}
                            </span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("photo2")}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Téléverser</span>
                          <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={handleFileUpload("photo2")} />
                        </label>
                      )}
                    </div>

                    {/* CV (optional) */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Curriculum Vitae
                        <span className="text-muted-foreground font-normal"> (optionnel)</span>
                      </label>
                      {uploadedFiles.cv ? (
                        <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm text-foreground truncate max-w-[180px]">
                              {uploadedFiles.cv.name}
                            </span>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeFile("cv")}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Téléverser</span>
                          <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload("cv")} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Payment info */}
                  <div className="bg-muted/50 rounded-xl p-5 mt-6">
                    <h4 className="font-semibold text-foreground mb-3">Frais d'inscription</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Droits d'inscription au Tableau</span>
                      <span className="font-bold text-lg text-foreground">50 000 FCFA</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Le paiement sera effectué par mobile money (Airtel/Moov) après validation de votre dossier.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Précédent
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : currentStep === 5 ? (
                    <>
                      Soumettre le dossier
                      <Check className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default Inscription;
