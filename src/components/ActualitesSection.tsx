import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import newsBureau from "@/assets/news-bureau.png";
import newsEcps from "@/assets/news-ecps.png";
import newsFormation from "@/assets/news-formation.png";

const actualites = [
  {
    id: 1,
    title: "Renouvellement du Bureau National du CNOM",
    excerpt: "Élection des nouveaux membres du bureau pour le mandat 2026-2029. Le Dr Emmanuel OGANDAGA reconduit à la présidence.",
    date: "05 Fév 2026",
    category: "Institutionnel",
    image: newsBureau
  },
  {
    id: 2,
    title: "Lancement de la carte e-CPS",
    excerpt: "La nouvelle carte professionnelle virtuelle est désormais disponible pour tous les médecins inscrits au Tableau.",
    date: "28 Jan 2026",
    category: "Digitalisation",
    image: newsEcps
  },
  {
    id: 3,
    title: "Journée de formation continue",
    excerpt: "Prochaine session de formation sur les nouvelles recommandations en matière de prescription antibiotique.",
    date: "20 Jan 2026",
    category: "Formation",
    image: newsFormation
  }
];

const ActualitesSection = () => {
  return (
    <section id="actualites" className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Actualités
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Les dernières nouvelles de l'Ordre
          </h2>
          <p className="text-muted-foreground text-lg">
            Restez informé des décisions, événements et actualités du Conseil National de l'Ordre des Médecins du Gabon.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actualites.map((news) => (
            <article
              key={news.id}
              className="bg-background rounded-2xl overflow-hidden shadow-cnom hover:shadow-cnom-elevated transition-all duration-300 group"
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

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/actualites">
            <Button variant="outline" size="lg" className="gap-2">
              Voir toutes les actualités
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ActualitesSection;
