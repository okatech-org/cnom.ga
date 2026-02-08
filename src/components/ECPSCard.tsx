import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, RotateCcw, Download, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ECPSCardProps {
  doctorName: string;
  firstName?: string;
  specialty: string;
  orderNumber: string;
  nip?: string;
  province: string;
  city?: string;
  status: "active" | "suspended" | "pending";
  validUntil?: string;
  photoUrl?: string;
  fonction?: string;
}

const ECPSCard = ({
  doctorName,
  firstName,
  specialty,
  orderNumber,
  nip,
  province,
  city,
  status,
  validUntil,
  photoUrl,
  fonction = "MEMBRE",
}: ECPSCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Generate QR data
  const qrData = JSON.stringify({
    n: orderNumber,
    name: doctorName,
    spec: specialty,
    status: status,
    ts: Date.now(),
  });

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="perspective-1000">
      <div
        className={cn(
          "relative w-full max-w-[420px] aspect-[1.586/1] cursor-pointer transition-transform duration-700 transform-style-3d mx-auto"
        )}
        onClick={handleFlip}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* RECTO - Front of card (Institutional) */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Gradient background with Gabonese colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#009639] via-[#009639] to-[#0055A4]">
            {/* Decorative waves with national colors */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 420 265"
              preserveAspectRatio="none"
            >
              {/* Yellow wave */}
              <path
                d="M0 120 Q80 80 160 100 Q240 120 320 90 Q400 60 420 80 L420 180 Q340 150 260 170 Q180 190 100 160 Q20 130 0 160 Z"
                fill="#FCD116"
                opacity="0.95"
              />
              {/* Blue wave */}
              <path
                d="M0 180 Q100 150 200 170 Q300 190 420 160 L420 265 L0 265 Z"
                fill="#0055A4"
                opacity="0.9"
              />
              {/* Accent curve top right */}
              <path
                d="M350 0 Q380 20 400 0 L420 0 L420 50 Q390 40 360 50 Q330 60 320 40 Z"
                fill="#FCD116"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Card content */}
          <div className="relative z-10 h-full p-5 flex flex-col">
            {/* Header */}
            <div className="text-center mb-3">
              <h3 className="text-white font-bold text-sm tracking-wide">
                RÉPUBLIQUE GABONAISE
              </h3>
              <p className="text-white/80 text-[10px] italic">
                Union - Travail - Justice
              </p>
            </div>

            {/* Emblem area */}
            <div className="flex-1 flex flex-col items-center justify-center">
              {/* Simplified emblem representation */}
              <div className="w-20 h-20 mb-3 flex items-center justify-center">
                <div className="relative">
                  {/* Shield with flag colors */}
                  <div className="w-14 h-16 rounded-b-full overflow-hidden border-2 border-[#FCD116] shadow-lg">
                    <div className="h-1/3 bg-[#009639]"></div>
                    <div className="h-1/3 bg-[#FCD116]"></div>
                    <div className="h-1/3 bg-[#0055A4]"></div>
                  </div>
                  {/* Caduceus symbol */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl drop-shadow-md">⚕️</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center">
                <h2 className="text-white font-bold text-lg tracking-wide leading-tight">
                  CONSEIL NATIONAL
                </h2>
                <h2 className="text-white font-bold text-lg tracking-wide leading-tight">
                  DE L'ORDRE DES MÉDECINS
                </h2>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-auto">
              <p className="text-white/80 text-[10px]">
                B.P : 12 075 Libreville
              </p>
              <p className="text-white/90 text-xs font-medium">
                www.cnom.ga
              </p>
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-2 right-2 text-white/50 text-[9px] flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Retourner
            </div>
          </div>
        </div>

        {/* VERSO - Back of card (Professional ID) */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Background with decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white">
            {/* Decorative waves on right side */}
            <svg
              className="absolute right-0 top-0 h-full w-1/3"
              viewBox="0 0 140 265"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="cardWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#009639" />
                  <stop offset="50%" stopColor="#FCD116" />
                  <stop offset="100%" stopColor="#0055A4" />
                </linearGradient>
              </defs>
              <path
                d="M60 0 Q100 40 80 80 Q60 120 100 160 Q140 200 100 240 Q80 260 140 265 L140 0 Z"
                fill="url(#cardWaveGrad)"
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Header bar */}
          <div className="absolute top-0 left-0 right-0 bg-[#009639] py-2 px-4">
            <h3 className="text-white font-bold text-xs text-center tracking-wider">
              CARTE DE PROFESSIONNEL DE SANTÉ
            </h3>
          </div>

          {/* Card content */}
          <div className="relative z-10 h-full pt-10 pb-4 px-4 flex">
            {/* Left section - Photo and info */}
            <div className="flex-1 flex gap-3">
              {/* Photo */}
              <div className="w-20 h-24 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300 overflow-hidden flex-shrink-0 shadow-sm">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-400">
                    <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.6"/>
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor" opacity="0.4"/>
                  </svg>
                )}
              </div>

              {/* Info labels */}
              <div className="flex-1 space-y-1.5 text-[11px]">
                <div>
                  <span className="text-[#009639] font-semibold">NOM</span>
                  <p className="font-bold text-gray-900 text-sm uppercase">{doctorName}</p>
                </div>
                <div>
                  <span className="text-[#009639] font-semibold">PRÉNOMS</span>
                  <p className="font-medium text-gray-800">{firstName || "—"}</p>
                </div>
                <div>
                  <span className="text-[#009639] font-semibold">SPÉCIALITÉ</span>
                  <p className="font-bold text-gray-900 uppercase">{specialty}</p>
                </div>
              </div>
            </div>

            {/* Right section - QR and numbers */}
            <div className="w-28 flex flex-col items-end justify-between">
              {/* NIP */}
              <div className="text-right mb-1">
                <span className="text-[#009639] font-semibold text-[10px]">NIP</span>
                <p className="font-bold text-[#0055A4] text-sm">{nip || "—"}</p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-1.5 rounded shadow-sm border">
                <QRCodeSVG
                  value={qrData}
                  size={60}
                  level="H"
                  includeMargin={false}
                  bgColor="white"
                  fgColor="#1a1a1a"
                />
              </div>
            </div>
          </div>

          {/* Bottom info bar */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <div className="flex items-end justify-between">
              {/* Order number */}
              <div className="text-center">
                <span className="text-[#009639] font-semibold text-[9px] block">N° ORDRE</span>
                <p className="font-bold text-[#0055A4] text-lg">{orderNumber}</p>
              </div>

              {/* Status badge */}
              {status === "active" && (
                <div className="flex items-center gap-1 text-[#009639]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-semibold">EN RÈGLE</span>
                </div>
              )}

              {/* Function */}
              <div className="text-center">
                <span className="text-[#009639] font-semibold text-[9px] block">FONCTION</span>
                <p className="font-bold text-[#009639] text-sm">{fonction}</p>
              </div>
            </div>

            {/* Validity */}
            {validUntil && (
              <p className="text-gray-400 text-[8px] text-center mt-1">
                Valide jusqu'au {validUntil}
              </p>
            )}
          </div>

          {/* Flip hint */}
          <div className="absolute bottom-2 right-2 text-gray-400 text-[9px] flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Retourner
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
