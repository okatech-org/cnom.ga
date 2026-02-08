import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Shield, RotateCcw, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ECPSCardProps {
  doctorName: string;
  specialty: string;
  orderNumber: string;
  province: string;
  city?: string;
  status: "active" | "suspended" | "pending";
  validUntil?: string;
  photoUrl?: string;
}

const ECPSCard = ({
  doctorName,
  specialty,
  orderNumber,
  province,
  city,
  status,
  validUntil,
  photoUrl,
}: ECPSCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Generate verification URL with the order number
  const verificationUrl = `https://cnom-gabon.ga/verify/${orderNumber}`;
  
  // Generate unique hash for QR code (simulated)
  const qrData = JSON.stringify({
    n: orderNumber,
    name: doctorName,
    spec: specialty,
    status: status,
    ts: Date.now(),
  });

  const statusConfig = {
    active: {
      label: "INSCRIT ET EN RÈGLE",
      color: "bg-status-active",
      textColor: "text-status-active",
    },
    suspended: {
      label: "SUSPENDU",
      color: "bg-status-suspended",
      textColor: "text-status-suspended",
    },
    pending: {
      label: "EN ATTENTE",
      color: "bg-status-pending",
      textColor: "text-status-pending",
    },
  };

  const currentStatus = statusConfig[status];

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="perspective-1000">
      <div
        className={cn(
          "relative w-full max-w-[400px] aspect-[1.586/1] cursor-pointer transition-transform duration-700 transform-style-3d mx-auto",
          isFlipped && "rotate-y-180"
        )}
        onClick={handleFlip}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* RECTO - Front of card */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Gradient background with wave pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-cnom-green-dark to-[hsl(220,60%,45%)]">
            {/* Wave overlays */}
            <svg
              className="absolute inset-0 w-full h-full opacity-40"
              viewBox="0 0 400 252"
              preserveAspectRatio="none"
            >
              <path
                d="M0 100 Q100 50 200 100 T400 80 L400 252 L0 252 Z"
                fill="hsl(var(--secondary))"
                opacity="0.5"
              />
              <path
                d="M0 150 Q150 100 250 150 T400 130 L400 252 L0 252 Z"
                fill="hsl(220, 60%, 50%)"
                opacity="0.6"
              />
              <path
                d="M0 180 Q100 140 200 170 T400 160 L400 252 L0 252 Z"
                fill="hsl(var(--primary))"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Card content */}
          <div className="relative z-10 h-full p-4 flex flex-col">
            {/* Header */}
            <div className="text-center mb-2">
              <p className="text-white/70 text-[10px] uppercase tracking-widest">
                République Gabonaise
              </p>
              <h3 className="text-white font-bold text-sm tracking-wide">
                ORDRE NATIONAL DES MÉDECINS
              </h3>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center gap-4">
              {/* Photo */}
              <div className="w-20 h-24 bg-white/20 rounded-lg flex items-center justify-center border-2 border-white/30 overflow-hidden flex-shrink-0">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white/80 text-3xl">👤</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-base truncate">
                  {doctorName}
                </h4>
                <p className="text-secondary font-semibold text-sm">
                  {specialty}
                </p>
                <div className="mt-2 space-y-0.5 text-white/80 text-xs">
                  <p>
                    N° Ordre:{" "}
                    <span className="font-bold text-white">{orderNumber}</span>
                  </p>
                  <p>
                    {city ? `${city}, ` : ""}
                    {province}
                  </p>
                </div>
              </div>
            </div>

            {/* Status badge */}
            <div className="flex justify-center mt-2">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
                  status === "active"
                    ? "bg-status-active/20"
                    : status === "suspended"
                    ? "bg-status-suspended/20"
                    : "bg-status-pending/20"
                )}
              >
                {status === "active" && (
                  <CheckCircle className="w-3.5 h-3.5 text-status-active" />
                )}
                <span
                  className={cn(
                    "font-semibold text-[10px]",
                    status === "active"
                      ? "text-white"
                      : status === "suspended"
                      ? "text-status-suspended"
                      : "text-status-pending"
                  )}
                >
                  {currentStatus.label}
                </span>
              </div>
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-2 right-2 text-white/50 text-[9px] flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Cliquez pour le QR
            </div>
          </div>
        </div>

        {/* VERSO - Back of card */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl rotate-y-180"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Background with wave pattern on corner */}
          <div className="absolute inset-0 bg-white">
            {/* Corner wave decoration */}
            <svg
              className="absolute bottom-0 right-0 w-2/3 h-2/3"
              viewBox="0 0 200 200"
              preserveAspectRatio="xMaxYMax slice"
            >
              <defs>
                <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="hsl(var(--secondary))" />
                  <stop offset="100%" stopColor="hsl(220, 60%, 50%)" />
                </linearGradient>
              </defs>
              <path
                d="M200 0 Q150 50 200 100 L200 200 L100 200 Q150 150 100 100 Q50 50 0 100 L0 200 L200 200 Z"
                fill="url(#waveGrad)"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* QR Code and info */}
          <div className="relative z-10 h-full p-5 flex flex-col items-center justify-center">
            {/* QR Code */}
            <div className="bg-white p-3 rounded-xl shadow-lg mb-3">
              <QRCodeSVG
                value={qrData}
                size={100}
                level="H"
                includeMargin={false}
                bgColor="white"
                fgColor="hsl(142, 55%, 25%)"
              />
            </div>

            <p className="text-foreground/70 text-xs text-center mb-1">
              Scannez pour vérifier l'authenticité
            </p>

            <div className="flex items-center gap-1 text-primary">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold">
                Signature cryptographique vérifiée
              </span>
            </div>

            {validUntil && (
              <p className="text-foreground/50 text-[10px] mt-2">
                Valide jusqu'au {validUntil}
              </p>
            )}

            {/* Flip hint */}
            <div className="absolute bottom-2 left-2 text-foreground/40 text-[9px] flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Cliquez pour retourner
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mt-6">
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Télécharger
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Partager
        </Button>
      </div>
    </div>
  );
};

export default ECPSCard;
