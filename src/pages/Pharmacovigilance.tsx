import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Validation schema
const pharmacovigilanceSchema = z.object({
  // Déclarant
  declarantNom: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Le nom ne peut pas dépasser 100 caractères"),
  declarantPrenom: z.string().trim().min(2, "Le prénom doit contenir au moins 2 caractères").max(100, "Le prénom ne peut pas dépasser 100 caractères"),
  declarantNumeroOrdre: z.string().trim().min(1, "Numéro d'Ordre requis").max(20, "Numéro d'Ordre invalide"),
  declarantEmail: z.string().trim().email("Email invalide").max(255, "Email trop long"),
  declarantTelephone: z.string().trim().min(8, "Numéro de téléphone invalide").max(20, "Numéro de téléphone trop long"),
  declarantEtablissement: z.string().trim().max(200, "Nom d'établissement trop long").optional(),
  
  // Patient
  patientInitiales: z.string().trim().min(2, "Initiales requises (ex: A.B.)").max(10, "Initiales trop longues"),
  patientAge: z.string().trim().min(1, "Âge requis").max(3, "Âge invalide"),
  patientSexe: z.enum(["M", "F"], { required_error: "Sexe requis" }),
  patientPoids: z.string().trim().max(5, "Poids invalide").optional(),
  
  // Médicament suspect
  medicamentNom: z.string().trim().min(2, "Nom du médicament requis").max(200, "Nom trop long"),
  medicamentDCI: z.string().trim().max(200, "DCI trop longue").optional(),
  medicamentDosage: z.string().trim().max(100, "Dosage trop long").optional(),
  medicamentVoie: z.string().max(50, "Voie d'administration trop longue").optional(),
  medicamentDateDebut: z.string().trim().min(1, "Date de début requise"),
  medicamentDateFin: z.string().trim().optional(),
  medicamentIndication: z.string().trim().max(300, "Indication trop longue").optional(),
  
  // Effet indésirable
  effetDescription: z.string().trim().min(10, "Description trop courte (min. 10 caractères)").max(2000, "Description trop longue (max. 2000 caractères)"),
  effetDateSurvenue: z.string().trim().min(1, "Date de survenue requise"),
  effetGravite: z.enum(["non_grave", "grave_hospitalisation", "grave_vital", "grave_deces", "grave_sequelles"], { required_error: "Gravité requise" }),
  effetEvolution: z.enum(["guerison", "amelioration", "en_cours", "sequelles", "deces", "inconnue"], { required_error: "Évolution requise" }),
  effetReintroduction: z.enum(["oui_recidive", "oui_pas_recidive", "non", "non_applicable"], { required_error: "Information requise" }),
});

type PharmacovigilanceFormData = z.infer<typeof pharmacovigilanceSchema>;

const Pharmacovigilance = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<PharmacovigilanceFormData>({
    resolver: zodResolver(pharmacovigilanceSchema),
    defaultValues: {
      declarantNom: "",
      declarantPrenom: "",
      declarantNumeroOrdre: "",
      declarantEmail: "",
      declarantTelephone: "",
      declarantEtablissement: "",
      patientInitiales: "",
      patientAge: "",
      patientPoids: "",
      medicamentNom: "",
      medicamentDCI: "",
      medicamentDosage: "",
      medicamentVoie: "",
      medicamentDateDebut: "",
      medicamentDateFin: "",
      medicamentIndication: "",
      effetDescription: "",
      effetDateSurvenue: "",
    },
  });

  const onSubmit = async (data: PharmacovigilanceFormData) => {
    // In a real app, this would send data to a backend
    console.log("Form submitted with validated data");
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    toast({
      title: "Déclaration envoyée",
      description: "Votre déclaration a été transmise au Centre de Pharmacovigilance.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Déclaration envoyée avec succès
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Votre déclaration d'effet indésirable a été transmise au Centre National de Pharmacovigilance. 
              Vous recevrez un accusé de réception par email.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setIsSubmitted(false)} variant="outline">
                Nouvelle déclaration
              </Button>
              <Link to="/">
                <Button>Retour à l'accueil</Button>
              </Link>
            </div>
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
            <Link to="/" className="flex items-center gap-3 group">
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
                Retour
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Pharmacovigilance</span>
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Déclaration d'effet indésirable
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Signalez tout effet indésirable suspecté lié à l'utilisation d'un médicament. 
              Cette déclaration est confidentielle et obligatoire pour les effets graves.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Section: Déclarant */}
              <div className="bg-background rounded-2xl p-6 lg:p-8 shadow-cnom">
                <h2 className="font-semibold text-lg text-foreground mb-6 pb-4 border-b border-border">
                  1. Informations du déclarant
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="declarantNom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom *</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="declarantPrenom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom *</FormLabel>
                        <FormControl>
                          <Input placeholder="Votre prénom" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="declarantNumeroOrdre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro d'Ordre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="declarantEmail"
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
                    name="declarantTelephone"
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
                  <FormField
                    control={form.control}
                    name="declarantEtablissement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Établissement</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom de l'établissement" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section: Patient */}
              <div className="bg-background rounded-2xl p-6 lg:p-8 shadow-cnom">
                <h2 className="font-semibold text-lg text-foreground mb-6 pb-4 border-b border-border">
                  2. Informations du patient
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    control={form.control}
                    name="patientInitiales"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initiales *</FormLabel>
                        <FormControl>
                          <Input placeholder="A.B." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="patientAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Âge (années) *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="45" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="patientSexe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sexe *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    name="patientPoids"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poids (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section: Médicament */}
              <div className="bg-background rounded-2xl p-6 lg:p-8 shadow-cnom">
                <h2 className="font-semibold text-lg text-foreground mb-6 pb-4 border-b border-border">
                  3. Médicament suspecté
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="medicamentNom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom commercial *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom du médicament" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicamentDCI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DCI (principe actif)</FormLabel>
                        <FormControl>
                          <Input placeholder="Dénomination Commune Internationale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicamentDosage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage / Posologie</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 500mg, 2x/jour" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicamentVoie"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voie d'administration</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="orale">Orale</SelectItem>
                            <SelectItem value="iv">Intraveineuse</SelectItem>
                            <SelectItem value="im">Intramusculaire</SelectItem>
                            <SelectItem value="sc">Sous-cutanée</SelectItem>
                            <SelectItem value="topique">Topique</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicamentDateDebut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de début *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="medicamentDateFin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date d'arrêt</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="medicamentIndication"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indication thérapeutique</FormLabel>
                          <FormControl>
                            <Input placeholder="Raison de la prescription" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Section: Effet indésirable */}
              <div className="bg-background rounded-2xl p-6 lg:p-8 shadow-cnom">
                <h2 className="font-semibold text-lg text-foreground mb-6 pb-4 border-b border-border">
                  4. Description de l'effet indésirable
                </h2>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="effetDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description détaillée *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez l'effet indésirable observé : nature, localisation, intensité, chronologie par rapport à la prise du médicament..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="effetDateSurvenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de survenue *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="effetGravite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gravité *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="non_grave">Non grave</SelectItem>
                              <SelectItem value="grave_hospitalisation">Grave - Hospitalisation</SelectItem>
                              <SelectItem value="grave_vital">Grave - Pronostic vital engagé</SelectItem>
                              <SelectItem value="grave_deces">Grave - Décès</SelectItem>
                              <SelectItem value="grave_sequelles">Grave - Séquelles</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="effetEvolution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Évolution *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="guerison">Guérison sans séquelle</SelectItem>
                              <SelectItem value="amelioration">Amélioration</SelectItem>
                              <SelectItem value="en_cours">En cours</SelectItem>
                              <SelectItem value="sequelles">Guérison avec séquelles</SelectItem>
                              <SelectItem value="deces">Décès</SelectItem>
                              <SelectItem value="inconnue">Inconnue</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="effetReintroduction"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Réintroduction du médicament *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="oui_recidive">Oui, avec récidive</SelectItem>
                              <SelectItem value="oui_pas_recidive">Oui, sans récidive</SelectItem>
                              <SelectItem value="non">Non réintroduit</SelectItem>
                              <SelectItem value="non_applicable">Non applicable</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Effacer le formulaire
                </Button>
                <Button type="submit" size="lg" className="gap-2" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Soumettre la déclaration
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Info box */}
          <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Confidentialité</h4>
                <p className="text-amber-700 text-sm">
                  Les informations recueillies font l'objet d'un traitement informatique destiné au Centre National de Pharmacovigilance. 
                  Conformément à la Loi n°001/2011, vous disposez d'un droit d'accès et de rectification des données vous concernant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pharmacovigilance;
