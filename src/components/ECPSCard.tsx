import { useState, useRef, useEffect, useCallback } from "react";
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

// The card is designed at a fixed 420×265 "virtual" canvas.
// We use transform:scale() to make it fit any container width.
// This guarantees pixel-perfect layout at every size.
const W = 420;
const H = 265;

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
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const qrData = JSON.stringify({
    n: orderNumber,
    name: doctorName,
    spec: specialty,
    status,
    ts: Date.now(),
  });

  // Measure the wrapper and compute scale so the 420px card fits inside it
  const measure = useCallback(() => {
    if (!wrapRef.current) return;
    const available = wrapRef.current.offsetWidth;
    setScale(Math.min(available / W, 1));
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="w-full">
      {/*
        Outer wrapper: fills full width.
        Its height is set dynamically to scale * H so the surrounding
        layout reflows correctly (no collapsed height).
      */}
      <div
        ref={wrapRef}
        className="w-full mx-auto relative"
        style={{
          maxWidth: W,
          height: scale * H,
        }}
      >
        {/*
          Inner card at fixed 420×265, scaled from top-left.
          Because the parent's height = scale*H, nothing overflows.
        */}
        <div
          style={{
            width: W,
            height: H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* ── Flip container ── */}
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={handleFlip}
            style={{
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transition: "transform 0.7s",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            } as React.CSSProperties}
          >
            {/* ═══════════ RECTO ═══════════ */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "translate3d(0, 0, 0)",
              } as React.CSSProperties}
            >
              <img
                src={carteRectoBackground}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
              <div className="relative z-10 h-full p-3 flex flex-col items-center justify-between">
                {/* Header */}
                <div className="text-center">
                  <h3 className="text-white font-bold text-[11px] tracking-wide">
                    RÉPUBLIQUE GABONAISE
                  </h3>
                  <p className="text-white text-[9px] italic">
                    Union - Travail - Justice
                  </p>
                </div>

                {/* Logo */}
                <div className="flex-1 flex items-center justify-center min-h-0 py-1">
                  <img
                    src={logoCnom}
                    alt="Logo CNOM"
                    className="w-[115px] h-[115px] object-contain drop-shadow-lg"
                    draggable={false}
                  />
                </div>

                {/* Title block */}
                <div className="text-center">
                  <h2 className="text-white font-bold text-[13px] tracking-wide leading-tight">
                    CONSEIL NATIONAL DE L'ORDRE DES MÉDECINS
                  </h2>
                  <p className="text-white text-[10px] mt-0.5">
                    CARTE DE PROFESSIONNEL DE SANTÉ
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center mt-1">
                  <p className="text-white text-[8px]">B.P : 12 075 Libreville</p>
                  <p className="text-white text-[10px] font-medium">www.cnom.ga</p>
                </div>

                {/* Flip hint */}
                <div className="absolute bottom-1 right-1 text-white/80 text-[8px] flex items-center gap-0.5">
                  <RotateCcw className="w-2.5 h-2.5" />
                  Retourner
                </div>
              </div>
            </div>

            {/* ═══════════ VERSO ═══════════ */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg) translate3d(0, 0, 0)",
              } as React.CSSProperties}
            >
              <img
                src={carteVersoBackground}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />

              <div className="relative z-10 h-full p-4 flex flex-col">
                {/* Header */}
                <h3 className="text-[#0D7377] font-bold text-[13px] tracking-wide leading-tight text-center pr-16 mb-3">
                  CARTE DE PROFESSIONNEL DE SANTÉ
                </h3>

                {/* Body: photo column + info column */}
                <div className="flex-1 flex gap-3 min-h-0">
                  {/* Left: photo + N° + function */}
                  <div className="w-[100px] flex flex-col items-center flex-shrink-0">
                    {/* Photo — circle */}
                    <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt="Photo"
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      ) : (
                        <svg viewBox="0 0 24 24" className="w-10 h-10 text-gray-400">
                          <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.5" />
                          <path d="M4 22c0-5 4-8 8-8s8 3 8 8" fill="currentColor" opacity="0.4" />
                        </svg>
                      )}
                    </div>
                    <p className="font-bold text-gray-900 text-[12px] mt-1 text-center whitespace-nowrap">
                      N° {orderNumber}
                    </p>
                    <span className="text-gray-500 font-medium italic text-[9px] mt-0.5">
                      FONCTION
                    </span>
                    <p className="font-bold text-[#0D7377] text-[10px] uppercase">
                      {fonction}
                    </p>
                  </div>

                  {/* Right: info fields + QR */}
                  <div className="flex-1 flex flex-col justify-between min-w-0 ml-2">
                    {/* Fields */}
                    <div className="space-y-1">
                      <div>
                        <span className="text-gray-500 font-medium italic text-[9px]">NOM</span>
                        <p className="font-bold text-gray-900 text-[12px] uppercase leading-tight truncate">
                          {doctorName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium italic text-[9px]">PRÉNOMS</span>
                        <p className="font-bold text-gray-900 text-[12px] leading-tight truncate">
                          {firstName || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium italic text-[9px]">SPÉCIALITÉ</span>
                        <p className="font-bold text-[#0D7377] text-[12px] uppercase leading-tight truncate">
                          {specialty}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-medium italic text-[9px]">NIP</span>
                        <p className="font-bold text-gray-900 text-[12px]">{nip || "—"}</p>
                      </div>
                      {/* QR Code below NIP */}
                      <div className="pt-0.5 flex justify-end">
                        <div className="bg-white p-0.5 rounded shadow-sm inline-block">
                          <QRCodeSVG
                            value={qrData}
                            size={40}
                            level="H"
                            includeMargin={false}
                            bgColor="white"
                            fgColor="#1a1a1a"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Flip hint */}
                <div className="absolute bottom-1.5 left-1.5 text-gray-400 text-[8px] flex items-center gap-0.5">
                  <RotateCcw className="w-2.5 h-2.5" />
                  Retourner
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-3 mt-4">
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
