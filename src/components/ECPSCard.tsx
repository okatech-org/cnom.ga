import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RotateCcw, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="w-[115%] max-w-md mx-auto sm:w-full -ml-[7.5%] sm:ml-0">
      {/* Card container with fixed aspect ratio */}
      <div 
        className="relative w-full cursor-pointer"
        style={{ 
          aspectRatio: "85.6 / 53.98", // Standard credit card ratio
          perspective: "1000px",
        }}
        onClick={handleFlip}
      >
        {/* Flip container */}
        <div
          className="relative w-full h-full transition-transform duration-700"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* RECTO - Front of card */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Background image - stretched to fill */}
            <img
              src={carteRectoBackground}
              alt=""
              className="absolute inset-0 w-full h-full object-fill"
            />

            {/* Card content - using percentage-based sizing */}
            <div className="relative z-10 h-full flex flex-col" style={{ padding: "3%" }}>
              <div className="text-center" style={{ marginBottom: "1%" }}>
                <h3 className="text-white font-bold tracking-wide" style={{ fontSize: "clamp(8px, 2.5vw, 11px)" }}>
                  RÉPUBLIQUE GABONAISE
                </h3>
                <p className="text-white italic" style={{ fontSize: "clamp(6px, 2vw, 9px)" }}>
                  Union - Travail - Justice
                </p>
              </div>

              {/* Emblem area */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                {/* Logo - percentage based */}
                <div className="flex items-center justify-center" style={{ width: "40%", aspectRatio: "1" }}>
                  <img 
                    src={logoCnom} 
                    alt="Logo CNOM" 
                    className="w-full h-full object-contain drop-shadow-lg"
                  />
                </div>

                {/* Title */}
                <div className="text-center" style={{ marginTop: "2%" }}>
                  <h2 className="text-white font-bold tracking-wide leading-tight" style={{ fontSize: "clamp(9px, 3vw, 14px)" }}>
                    CONSEIL NATIONAL DE L'ORDRE DES MÉDECINS
                  </h2>
                  <p className="text-white" style={{ fontSize: "clamp(7px, 2.2vw, 10px)", marginTop: "1%" }}>
                    CARTE DE PROFESSIONNEL DE SANTÉ
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center flex-shrink-0" style={{ marginTop: "1%" }}>
                <p className="text-white" style={{ fontSize: "clamp(5px, 1.8vw, 8px)" }}>
                  B.P : 12 075 Libreville
                </p>
                <p className="text-white font-medium" style={{ fontSize: "clamp(7px, 2.2vw, 10px)" }}>
                  www.cnom.ga
                </p>
              </div>

              {/* Flip hint */}
              <div className="absolute bottom-1 right-1 text-white flex items-center gap-1" style={{ fontSize: "clamp(5px, 1.8vw, 8px)" }}>
                <RotateCcw style={{ width: "clamp(8px, 2vw, 10px)", height: "clamp(8px, 2vw, 10px)" }} />
                Retourner
              </div>
            </div>
          </div>

          {/* VERSO - Back of card */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Background image */}
            <img
              src={carteVersoBackground}
              alt=""
              className="absolute inset-0 w-full h-full object-fill"
            />

            {/* Card content */}
            <div className="relative z-10 h-full flex flex-col" style={{ padding: "4%" }}>
              {/* Header title */}
              <div style={{ marginBottom: "3%", paddingRight: "20%" }}>
                <h3 className="text-[#009639] font-bold tracking-wide leading-tight text-center" style={{ fontSize: "clamp(9px, 3vw, 14px)" }}>
                  CARTE DE PROFESSIONNEL DE SANTÉ
                </h3>
              </div>

              {/* Main content - Photo left, Info right */}
              <div className="flex-1 flex" style={{ gap: "4%" }}>
                {/* Left column: Photo, N° ORDRE, FONCTION */}
                <div className="flex flex-col items-center" style={{ width: "35%", marginLeft: "2%" }}>
                  {/* Photo circle */}
                  <div 
                    className="bg-gray-200 rounded-full flex items-center justify-center overflow-hidden"
                    style={{ width: "90%", aspectRatio: "1", marginBottom: "2%" }}
                  >
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 text-gray-400">
                        <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.5"/>
                        <path d="M4 22c0-5 4-8 8-8s8 3 8 8" fill="currentColor" opacity="0.4"/>
                      </svg>
                    )}
                  </div>

                  {/* Order number below photo */}
                  <div className="text-center">
                    <p className="font-bold text-gray-900" style={{ fontSize: "clamp(9px, 3vw, 14px)" }}>N° {orderNumber}</p>
                  </div>
                  
                  {/* Function below N° ORDRE */}
                  <div className="text-center">
                    <span className="text-gray-500 font-medium italic block" style={{ fontSize: "clamp(6px, 2vw, 10px)" }}>FONCTION</span>
                    <p className="font-bold text-[#009639] uppercase" style={{ fontSize: "clamp(7px, 2.2vw, 11px)" }}>{fonction}</p>
                  </div>
                </div>

                {/* Info labels */}
                <div className="flex-1 flex flex-col justify-start" style={{ gap: "2%", marginLeft: "5%" }}>
                  <div>
                    <span className="text-gray-500 font-medium italic" style={{ fontSize: "clamp(6px, 2vw, 10px)" }}>NOM</span>
                    <p className="font-bold text-gray-900 uppercase" style={{ fontSize: "clamp(9px, 3vw, 14px)" }}>{doctorName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium italic" style={{ fontSize: "clamp(6px, 2vw, 10px)" }}>PRÉNOMS</span>
                    <p className="font-bold text-gray-900" style={{ fontSize: "clamp(9px, 3vw, 14px)" }}>{firstName || "—"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium italic" style={{ fontSize: "clamp(6px, 2vw, 10px)" }}>SPÉCIALITÉ</span>
                    <p className="font-bold text-[#009639] uppercase" style={{ fontSize: "clamp(9px, 3vw, 14px)" }}>{specialty}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium italic" style={{ fontSize: "clamp(6px, 2vw, 10px)" }}>NIP</span>
                    <p className="font-bold text-gray-900" style={{ fontSize: "clamp(9px, 3vw, 14px)" }}>{nip || "—"}</p>
                  </div>
                </div>
              </div>

              {/* QR Code - positioned absolutely */}
              <div className="absolute bg-white rounded shadow-sm" style={{ top: "8%", right: "4%", padding: "1%" }}>
                <QRCodeSVG
                  value={qrData}
                  size={48}
                  level="H"
                  includeMargin={false}
                  bgColor="white"
                  fgColor="#1a1a1a"
                  className="w-full h-full"
                  style={{ width: "clamp(32px, 12vw, 56px)", height: "clamp(32px, 12vw, 56px)" }}
                />
              </div>

              {/* Flip hint */}
              <div className="absolute bottom-2 left-2 text-gray-400 flex items-center gap-1" style={{ fontSize: "clamp(6px, 2vw, 9px)" }}>
                <RotateCcw style={{ width: "clamp(8px, 2vw, 12px)", height: "clamp(8px, 2vw, 12px)" }} />
                Retourner
              </div>
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
