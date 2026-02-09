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
    <div className="w-full">
      {/* Card container — uses aspect-ratio for proper scaling on all devices */}
      <div className="w-full max-w-[420px] mx-auto">
        <div
          className="relative w-full cursor-pointer"
          style={{ aspectRatio: "420 / 265" }}
          onClick={handleFlip}
        >
          {/* 3D flip wrapper */}
          <div
            className="absolute inset-0 transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* ============ RECTO (Front — Institutional) ============ */}
            <div
              className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
              style={{ backfaceVisibility: "hidden" }}
            >
              {/* Background image */}
              <img
                src={carteRectoBackground}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />

              {/* Overlay content — fully percentage-based */}
              <div className="relative z-10 h-full flex flex-col items-center justify-between p-[6%]">
                {/* Top header */}
                <div className="text-center w-full">
                  <h3 className="text-white font-bold text-[clamp(8px,2.8vw,11px)] tracking-wide leading-tight">
                    RÉPUBLIQUE GABONAISE
                  </h3>
                  <p className="text-white text-[clamp(6px,2.2vw,9px)] italic">
                    Union - Travail - Justice
                  </p>
                </div>

                {/* Emblem */}
                <div className="flex-1 flex items-center justify-center min-h-0 py-[2%]">
                  <img
                    src={logoCnom}
                    alt="Logo CNOM"
                    className="w-[28%] aspect-square object-contain drop-shadow-lg"
                    draggable={false}
                  />
                </div>

                {/* Title */}
                <div className="text-center w-full">
                  <h2 className="text-white font-bold text-[clamp(9px,3vw,14px)] tracking-wide leading-tight">
                    CONSEIL NATIONAL DE L'ORDRE DES MÉDECINS
                  </h2>
                  <p className="text-white text-[clamp(7px,2.4vw,10px)] mt-[2%]">
                    CARTE DE PROFESSIONNEL DE SANTÉ
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center w-full mt-[2%]">
                  <p className="text-white text-[clamp(5px,1.8vw,8px)]">
                    B.P : 12 075 Libreville
                  </p>
                  <p className="text-white text-[clamp(7px,2.4vw,10px)] font-medium">
                    www.cnom.ga
                  </p>
                </div>

                {/* Flip hint */}
                <div className="absolute bottom-[3%] right-[3%] text-white text-[clamp(5px,1.8vw,8px)] flex items-center gap-0.5 opacity-80">
                  <RotateCcw className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px]" />
                  <span>Retourner</span>
                </div>
              </div>
            </div>

            {/* ============ VERSO (Back — Professional ID) ============ */}
            <div
              className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
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
                draggable={false}
              />

              {/* Content overlay */}
              <div className="relative z-10 h-full p-[4%] flex flex-col">
                {/* Header */}
                <div className="text-center mb-[3%] pr-[20%]">
                  <h3 className="text-[#0D7377] font-bold text-[clamp(8px,2.8vw,14px)] tracking-wide leading-tight">
                    CARTE DE PROFESSIONNEL DE SANTÉ
                  </h3>
                </div>

                {/* Main content area: Photo + Info */}
                <div className="flex-1 flex gap-[4%] min-h-0">
                  {/* Left column: Photo + N° + Fonction */}
                  <div className="w-[30%] flex flex-col items-center flex-shrink-0">
                    {/* Photo */}
                    <div
                      className="w-full aspect-square rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0"
                      style={{ maxWidth: "100px" }}
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Photo"
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-[40%] h-[40%] text-gray-400">
                          <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.5" />
                          <path d="M4 22c0-5 4-8 8-8s8 3 8 8" fill="currentColor" opacity="0.4" />
                        </svg>
                      )}
                    </div>

                    {/* N° */}
                    <p className="font-bold text-gray-900 text-[clamp(8px,2.6vw,13px)] mt-[6%] text-center">
                      N° {orderNumber}
                    </p>

                    {/* Fonction */}
                    <div className="text-center mt-[2%]">
                      <span className="text-gray-500 font-medium italic text-[clamp(6px,1.8vw,10px)] block">
                        FONCTION
                      </span>
                      <p className="font-bold text-[#0D7377] text-[clamp(7px,2vw,11px)] uppercase">
                        {fonction}
                      </p>
                    </div>
                  </div>

                  {/* Right column: NOM, PRÉNOMS, SPÉCIALITÉ, NIP + QR */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    {/* Info fields */}
                    <div className="space-y-[4%]">
                      <div>
                        <span className="text-gray-500 font-medium italic text-[clamp(6px,1.8vw,10px)] block">
                          NOM
                        </span>
                        <p className="font-bold text-gray-900 text-[clamp(8px,2.6vw,13px)] uppercase truncate">
                          {doctorName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium italic text-[clamp(6px,1.8vw,10px)] block">
                          PRÉNOMS
                        </span>
                        <p className="font-bold text-gray-900 text-[clamp(8px,2.6vw,13px)] truncate">
                          {firstName || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium italic text-[clamp(6px,1.8vw,10px)] block">
                          SPÉCIALITÉ
                        </span>
                        <p className="font-bold text-[#0D7377] text-[clamp(8px,2.6vw,13px)] uppercase truncate">
                          {specialty}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium italic text-[clamp(6px,1.8vw,10px)] block">
                          NIP
                        </span>
                        <p className="font-bold text-gray-900 text-[clamp(8px,2.6vw,13px)]">
                          {nip || "—"}
                        </p>
                      </div>
                    </div>

                    {/* QR Code — bottom right */}
                    <div className="flex justify-end mt-auto">
                      <div className="bg-white p-[2px] rounded shadow-sm">
                        <QRCodeSVG
                          value={qrData}
                          size={40}
                          level="H"
                          includeMargin={false}
                          bgColor="white"
                          fgColor="#1a1a1a"
                          className="w-[clamp(28px,10vw,56px)] h-[clamp(28px,10vw,56px)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flip hint */}
                <div className="absolute bottom-[3%] left-[3%] text-gray-400 text-[clamp(5px,1.8vw,9px)] flex items-center gap-0.5">
                  <RotateCcw className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px]" />
                  <span>Retourner</span>
                </div>
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
