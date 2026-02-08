import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RefreshCw, Timer, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { generateQRCodeURL, getQRRefreshInterval } from "@/lib/qrcode-utils";
import { cn } from "@/lib/utils";

interface QRCodeDynamicProps {
    doctorId: string;
    status: "active" | "retard" | "suspendu" | "radie";
}

const QRCodeDynamic = ({ doctorId, status }: QRCodeDynamicProps) => {
    const [qrUrl, setQrUrl] = useState(() => generateQRCodeURL(doctorId));
    const [secondsLeft, setSecondsLeft] = useState(getQRRefreshInterval());
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [lastSync, setLastSync] = useState(new Date());

    const refreshQR = useCallback(() => {
        setQrUrl(generateQRCodeURL(doctorId));
        setSecondsLeft(getQRRefreshInterval());
        if (navigator.onLine) setLastSync(new Date());
    }, [doctorId]);

    // Auto-refresh countdown
    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    refreshQR();
                    return getQRRefreshInterval();
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [refreshQR]);

    // Online/offline listener
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const progress = (secondsLeft / getQRRefreshInterval()) * 100;
    const isSuspended = status === "suspendu" || status === "radie";

    const qrBgColor = {
        active: "#ffffff",
        retard: "#FFF7ED",
        suspendu: "#FEF2F2",
        radie: "#450a0a",
    }[status];

    const qrFgColor = isSuspended ? "#991B1B" : "#000000";

    return (
        <div className="relative">
            {/* Offline warning */}
            {!isOnline && (
                <div className="mb-3 flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200">
                    <WifiOff className="w-4 h-4 flex-shrink-0" />
                    <span>Vérification hors-ligne — dernière synchronisation : {lastSync.toLocaleTimeString("fr-FR")}</span>
                </div>
            )}

            {/* QR Code */}
            <div className="flex flex-col items-center">
                <div className={cn(
                    "relative p-4 rounded-xl border-2",
                    status === "active" && "border-emerald-200 dark:border-emerald-800",
                    status === "retard" && "border-amber-200 dark:border-amber-800",
                    isSuspended && "border-red-300 dark:border-red-800"
                )}>
                    <QRCodeSVG
                        value={qrUrl}
                        size={160}
                        bgColor={qrBgColor}
                        fgColor={qrFgColor}
                        level="M"
                        includeMargin={false}
                    />

                    {/* Diagonal bar for suspended/radié */}
                    {isSuspended && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-1 bg-red-600 rotate-45 origin-center" />
                        </div>
                    )}
                </div>

                {/* Timer & refresh */}
                <div className="mt-3 w-full max-w-[200px] space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Timer className="w-3 h-3" />
                            Renouvellement
                        </span>
                        <span className="font-mono tabular-nums">{secondsLeft}s</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={refreshQR}
                        className="w-full text-xs gap-1.5"
                    >
                        <RefreshCw className="w-3 h-3" />
                        Rafraîchir
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QRCodeDynamic;
