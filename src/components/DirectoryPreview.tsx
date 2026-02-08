import { Search, MapPin, Phone, CheckCircle, AlertCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sampleDoctors = [
  {
    id: 1,
    name: "Dr. Marie-Claire MBOUROU",
    specialty: "Cardiologie",
    city: "Libreville",
    orderNumber: "1842",
    status: "active",
    gender: "F",
  },
  {
    id: 2,
    name: "Dr. Jean-Pierre ONDO",
    specialty: "Chirurgie Générale",
    city: "Port-Gentil",
    orderNumber: "956",
    status: "active",
    gender: "M",
  },
  {
    id: 3,
    name: "Dr. Pauline NGUEMA",
    specialty: "Pédiatrie",
    city: "Franceville",
    orderNumber: "2103",
    status: "active",
    gender: "F",
  },
  {
    id: 4,
    name: "Dr. François OBAME",
    specialty: "Médecine Générale",
    city: "Oyem",
    orderNumber: "1567",
    status: "pending",
    gender: "M",
  },
];

const DirectoryPreview = () => {
  return (
    <section id="annuaire" className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-primary text-sm font-medium mb-4">
              <Search className="w-4 h-4" />
              Annuaire public
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Trouvez un médecin{" "}
              <span className="text-primary">vérifié</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Consultez le Tableau de l'Ordre et vérifiez le statut d'inscription 
              de n'importe quel praticien en temps réel.
            </p>
          </div>
          <Button variant="outline" size="lg" className="self-start lg:self-auto">
            <Filter className="w-4 h-4 mr-2" />
            Recherche avancée
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par nom, spécialité ou ville..."
              className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-cnom"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {sampleDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-card border border-border rounded-xl p-5 hover:shadow-cnom-elevated hover:border-primary/20 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-primary">
                    {doctor.name.split(" ")[1]?.[0] || doctor.name[0]}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {doctor.name}
                    </h3>
                    {doctor.status === "active" ? (
                      <CheckCircle className="w-4 h-4 text-status-active flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-status-pending flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-primary font-medium mb-2">
                    {doctor.specialty}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {doctor.city}
                    </span>
                    <span className="text-border">•</span>
                    <span>N° {doctor.orderNumber}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <Badge
                  variant={doctor.status === "active" ? "default" : "secondary"}
                  className={`flex-shrink-0 ${
                    doctor.status === "active"
                      ? "bg-status-active/10 text-status-active hover:bg-status-active/20"
                      : "bg-status-pending/10 text-status-pending hover:bg-status-pending/20"
                  }`}
                >
                  {doctor.status === "active" ? "Inscrit" : "En cours"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Button size="lg">
            Voir tous les médecins
            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-sm">
              2 197
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DirectoryPreview;
