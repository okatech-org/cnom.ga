import { useState } from "react";
import { MapPin, Users, TrendingUp } from "lucide-react";

// Province data with approximate SVG path positions
const provinces = [
  { 
    id: "estuaire", 
    name: "Estuaire", 
    capital: "Libreville",
    medecins: 1452, 
    population: 1200000,
    ratio: 12.1,
    path: "M 180 80 L 220 60 L 260 80 L 270 120 L 250 150 L 200 160 L 170 130 Z",
    labelX: 210,
    labelY: 110
  },
  { 
    id: "woleu-ntem", 
    name: "Woleu-Ntem", 
    capital: "Oyem",
    medecins: 89, 
    population: 155000,
    ratio: 5.7,
    path: "M 100 20 L 180 20 L 220 60 L 180 80 L 140 100 L 80 80 L 60 40 Z",
    labelX: 140,
    labelY: 55
  },
  { 
    id: "ogooue-ivindo", 
    name: "Ogooué-Ivindo", 
    capital: "Makokou",
    medecins: 42, 
    population: 64000,
    ratio: 6.6,
    path: "M 220 60 L 320 40 L 360 80 L 340 140 L 280 160 L 260 120 L 260 80 Z",
    labelX: 290,
    labelY: 100
  },
  { 
    id: "haut-ogooue", 
    name: "Haut-Ogooué", 
    capital: "Franceville",
    medecins: 186, 
    population: 252000,
    ratio: 7.4,
    path: "M 280 160 L 340 140 L 380 180 L 380 260 L 320 300 L 260 280 L 240 220 Z",
    labelX: 310,
    labelY: 220
  },
  { 
    id: "ogooue-lolo", 
    name: "Ogooué-Lolo", 
    capital: "Koulamoutou",
    medecins: 40, 
    population: 65000,
    ratio: 6.2,
    path: "M 200 200 L 240 220 L 260 280 L 220 320 L 160 300 L 160 240 Z",
    labelX: 200,
    labelY: 260
  },
  { 
    id: "ngounie", 
    name: "Ngounié", 
    capital: "Mouila",
    medecins: 78, 
    population: 100000,
    ratio: 7.8,
    path: "M 100 200 L 160 200 L 160 300 L 120 340 L 60 320 L 40 260 Z",
    labelX: 100,
    labelY: 270
  },
  { 
    id: "moyen-ogooue", 
    name: "Moyen-Ogooué", 
    capital: "Lambaréné",
    medecins: 67, 
    population: 70000,
    ratio: 9.6,
    path: "M 140 100 L 180 80 L 200 160 L 160 200 L 100 200 L 100 140 Z",
    labelX: 145,
    labelY: 150
  },
  { 
    id: "ogooue-maritime", 
    name: "Ogooué-Maritime", 
    capital: "Port-Gentil",
    medecins: 198, 
    population: 180000,
    ratio: 11.0,
    path: "M 20 100 L 100 100 L 100 200 L 40 260 L 20 200 Z",
    labelX: 60,
    labelY: 170
  },
  { 
    id: "nyanga", 
    name: "Nyanga", 
    capital: "Tchibanga",
    medecins: 45, 
    population: 56000,
    ratio: 8.0,
    path: "M 40 260 L 60 320 L 120 340 L 100 380 L 40 380 L 20 320 Z",
    labelX: 70,
    labelY: 340
  },
];

const getColorByRatio = (ratio: number) => {
  if (ratio >= 10) return "#0D6E3F"; // Vert foncé - bon ratio
  if (ratio >= 8) return "#22C55E"; // Vert clair
  if (ratio >= 6) return "#F5A623"; // Orange - attention
  return "#EF4444"; // Rouge - désert médical
};

const GabonMap = () => {
  const [selectedProvince, setSelectedProvince] = useState<typeof provinces[0] | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  return (
    <section id="carte" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Carte sanitaire
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Répartition géographique des médecins
          </h2>
          <p className="text-muted-foreground text-lg">
            Visualisez la densité médicale par province et identifiez les déserts médicaux.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-muted/30 rounded-2xl p-6 border border-border">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-auto"
                style={{ maxHeight: "500px" }}
              >
                {/* Background */}
                <rect x="0" y="0" width="400" height="400" fill="hsl(var(--muted) / 0.3)" />
                
                {/* Ocean indicator */}
                <rect x="0" y="80" width="40" height="320" fill="hsl(210, 100%, 95%)" rx="4" />
                <text x="20" y="240" fill="hsl(210, 50%, 60%)" fontSize="10" textAnchor="middle" transform="rotate(-90, 20, 240)">
                  Océan Atlantique
                </text>

                {/* Provinces */}
                {provinces.map((province) => (
                  <g key={province.id}>
                    <path
                      d={province.path}
                      fill={getColorByRatio(province.ratio)}
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-200"
                      style={{
                        opacity: hoveredProvince === province.id ? 1 : 0.85,
                        filter: hoveredProvince === province.id ? "brightness(1.1)" : "none",
                        transform: selectedProvince?.id === province.id ? "scale(1.02)" : "scale(1)",
                        transformOrigin: `${province.labelX}px ${province.labelY}px`
                      }}
                      onMouseEnter={() => setHoveredProvince(province.id)}
                      onMouseLeave={() => setHoveredProvince(null)}
                      onClick={() => setSelectedProvince(province)}
                    />
                    <text
                      x={province.labelX}
                      y={province.labelY}
                      fill="white"
                      fontSize="9"
                      fontWeight="600"
                      textAnchor="middle"
                      className="pointer-events-none"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {province.name.split("-")[0]}
                    </text>
                    <text
                      x={province.labelX}
                      y={province.labelY + 12}
                      fill="white"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none"
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                    >
                      {province.medecins}
                    </text>
                  </g>
                ))}

                {/* Capitals markers */}
                {provinces.map((province) => (
                  <circle
                    key={`capital-${province.id}`}
                    cx={province.labelX}
                    cy={province.labelY - 20}
                    r="3"
                    fill="white"
                    stroke="hsl(var(--foreground))"
                    strokeWidth="1"
                    className="pointer-events-none"
                  />
                ))}
              </svg>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">Ratio médecins / 10 000 hab. :</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#0D6E3F" }} />
                  <span className="text-xs text-muted-foreground">≥ 10 (bon)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#22C55E" }} />
                  <span className="text-xs text-muted-foreground">8-10</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#F5A623" }} />
                  <span className="text-xs text-muted-foreground">6-8</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: "#EF4444" }} />
                  <span className="text-xs text-muted-foreground">&lt; 6 (désert)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Province Details */}
          <div className="space-y-4">
            <div className="bg-background rounded-xl border border-border p-5 shadow-cnom">
              <h3 className="font-semibold text-foreground mb-4">
                {selectedProvince ? selectedProvince.name : "Sélectionnez une province"}
              </h3>
              
              {selectedProvince ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Capitale</p>
                      <p className="font-medium text-foreground">{selectedProvince.capital}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cnom-gold/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-cnom-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Médecins inscrits</p>
                      <p className="font-medium text-foreground">{selectedProvince.medecins}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ratio / 10 000 hab.</p>
                      <p className="font-medium text-foreground">{selectedProvince.ratio}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">Population</p>
                    <p className="font-medium text-foreground">{selectedProvince.population.toLocaleString()} habitants</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Cliquez sur une province pour voir les détails de la densité médicale.
                </p>
              )}
            </div>

            {/* Quick stats */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <h4 className="font-semibold text-amber-800 mb-2">⚠️ Déserts médicaux</h4>
              <p className="text-sm text-amber-700 mb-3">
                3 provinces présentent un ratio inférieur à 6 médecins / 10 000 habitants :
              </p>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Woleu-Ntem (5.7)</li>
                <li>• Ogooué-Lolo (6.2)</li>
                <li>• Ogooué-Ivindo (6.6)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GabonMap;
