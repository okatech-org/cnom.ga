import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, RotateCcw, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import carteRectoBackground from "@/assets/cnom-carte-recto.png";
import carteVersoBackground from "@/assets/cnom-carte-verso.png";
import logoCnom from "@/assets/logo-cnom.png";

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
          {/* Background image */}
          <img
            src={carteRectoBackground}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Card content */}
          <div className="relative z-10 h-full p-3 flex flex-col overflow-hidden">
            <div className="text-center mb-1">
              <h3 className="text-white font-bold text-[11px] tracking-wide">
                RÉPUBLIQUE GABONAISE
              </h3>
              <p className="text-white text-[9px] italic">
                Union - Travail - Justice
              </p>
            </div>

            {/* Emblem area */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0">
              {/* Logo */}
              <div className="w-32 h-32 flex items-center justify-center flex-shrink-0">
                <img 
                  src={logoCnom} 
                  alt="Logo CNOM" 
                  className="w-[115px] h-[115px] object-contain drop-shadow-lg"
                />
              </div>

              {/* Title */}
              <div className="text-center mt-1">
                <h2 className="text-white font-bold text-sm tracking-wide leading-tight">
                  CONSEIL NATIONAL DE L'ORDRE DES MÉDECINS
                </h2>
                <p className="text-white text-[10px] mt-1">
                  CARTE DE PROFESSIONNEL DE SANTÉ
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-1 flex-shrink-0">
              <p className="text-white text-[8px]">
                B.P : 12 075 Libreville
              </p>
              <p className="text-white text-[10px] font-medium">
                www.cnom.ga
              </p>
            </div>

            {/* Flip hint */}
            <div className="absolute bottom-1 right-1 text-white text-[8px] flex items-center gap-1">
              <RotateCcw className="w-2.5 h-2.5" />
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
          {/* Background image */}
          <img
            src={carteVersoBackground}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Card content */}
          <div className="relative z-10 h-full p-5 flex flex-col">
            {/* Header title */}
            <div className="mb-4 pr-20">
              <h3 className="text-[#009639] font-bold text-sm tracking-wide leading-tight text-center">
                CARTE DE PROFESSIONNEL DE SANTÉ
              </h3>
            </div>

            {/* Main content - Photo left, Info right */}
            <div className="flex-1 flex gap-4">
              {/* Left column: Photo, N° ORDRE, FONCTION */}
              <div className="w-24 flex-shrink-0 flex flex-col items-center">
                {/* Photo circle */}
                <div className="w-[125px] h-[125px] bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-1">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-12 h-12 text-gray-400">
                      <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.5"/>
                      <path d="M4 22c0-5 4-8 8-8s8 3 8 8" fill="currentColor" opacity="0.4"/>
                    </svg>
                  )}
                </div>

                {/* Order number below photo */}
                <div className="text-center">
                  <span className="text-gray-500 font-medium italic text-[10px] block">N° ORDRE</span>
                  <p className="font-bold text-gray-900 text-sm">{orderNumber}</p>
                </div>
                
                {/* Function below N° ORDRE */}
                <div className="text-center">
                  <span className="text-gray-500 font-medium italic text-[10px] block">FONCTION</span>
                  <p className="font-bold text-[#009639] text-[11px] uppercase">{fonction}</p>
                </div>
              </div>

              {/* Info labels */}
              <div className="flex-1 space-y-1 text-[11px] ml-8">
                <div>
                  <span className="text-gray-500 font-medium italic text-[10px]">NOM</span>
                  <p className="font-bold text-gray-900 text-sm uppercase">{doctorName}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium italic text-[10px]">PRÉNOMS</span>
                  <p className="font-bold text-gray-900 text-sm">{firstName || "—"}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium italic text-[10px]">SPÉCIALITÉ</span>
                  <p className="font-bold text-[#009639] text-sm uppercase">{specialty}</p>
                </div>
                <div className="pt-1">
                  <span className="text-gray-500 font-medium italic text-[10px]">NIP</span>
                  <p className="font-bold text-gray-900 text-sm">{nip || "—"}</p>
                </div>
              </div>
            </div>

            {/* Bottom row - QR Code only */}
            <div className="flex items-end justify-end mt-2">
              {/* QR Code */}
              <div className="bg-white p-1 rounded shadow-sm">
                <QRCodeSVG
                  value={qrData}
                  size={56}
                  level="H"
                  includeMargin={false}
                  bgColor="white"
                  fgColor="#1a1a1a"
                />
              </div>
            </div>
          </div>

          {/* Flip hint */}
          <div className="absolute bottom-2 left-2 text-gray-400 text-[9px] flex items-center gap-1">
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
