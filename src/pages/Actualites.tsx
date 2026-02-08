import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const actualites = [
  {
    id: 1,
    title: "Renouvellement du Bureau National du CNOM",
    excerpt: "Élection des nouveaux membres du bureau pour le mandat 2026-2029. Le Dr Emmanuel OGANDAGA reconduit à la présidence.",
    date: "05 Fév 2026",
    category: "Institutionnel",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Lancement de la carte e-CPS",
    excerpt: "La nouvelle carte professionnelle virtuelle est désormais disponible pour tous les médecins inscrits au Tableau.",
    date: "28 Jan 2026",
    category: "Digitalisation",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Journée de formation continue",
    excerpt: "Prochaine session de formation sur les nouvelles recommandations en matière de prescription antibiotique.",
    date: "20 Jan 2026",
    category: "Formation",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    title: "Partenariat avec le Ministère de la Santé",
    excerpt: "Signature d'une convention cadre pour améliorer la coordination des soins sur le territoire national.",
    date: "15 Jan 2026",
    category: "Partenariat",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    title: "Mise à jour du Code de Déontologie",
    excerpt: "Nouvelles dispositions relatives à la télémédecine et aux consultations à distance.",
    date: "10 Jan 2026",
    category: "Réglementation",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    title: "Assemblée Générale Annuelle 2026",
    excerpt: "Convocation de tous les membres pour l'Assemblée Générale qui se tiendra le 15 mars 2026.",
    date: "05 Jan 2026",
    category: "Institutionnel",
    image: "/placeholder.svg"
  }
];

const categories = ["Tous", "Institutionnel", "Digitalisation", "Formation", "Partenariat", "Réglementation"];

const Actualites = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-cnom-gold/5">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Actualités
              </span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Les dernières nouvelles de l'Ordre
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Restez informé des décisions, événements et actualités du Conseil National de l'Ordre des Médecins du Gabon.
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher une actualité..."
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-cnom"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-3">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={category === "Tous" ? "default" : "outline"}
                  className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {actualites.map((news) => (
                <article 
                  key={news.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-cnom hover:shadow-cnom-elevated transition-all duration-300 group border border-border"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-cnom-gold/20 relative overflow-hidden">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      {news.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <time>{news.date}</time>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {news.excerpt}
                    </p>
                    <a 
                      href="#" 
                      className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                    >
                      Lire la suite
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Charger plus d'actualités
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Actualites;
