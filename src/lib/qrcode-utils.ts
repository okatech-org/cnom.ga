// QR Code utilities for Carte e-CPS
// RG-M3-04: QR code must never contain sensitive personal data

const QR_REFRESH_INTERVAL = 60; // seconds

/**
 * Generate the verification URL for the QR code.
 * Format: https://verify.cnom-gabon.ga/v/{ID_MEDECIN}/{TIMESTAMP}/{SIGNATURE}
 * The signature is a simulated HMAC-SHA256 for demo purposes.
 */
export const generateQRCodeURL = (doctorId: string): string => {
    const timestamp = Math.floor(Date.now() / 1000);
    // In production, this would be an HMAC-SHA256 computed server-side
    const signature = generateDemoSignature(doctorId, timestamp);
    return `https://verify.cnom-gabon.ga/v/${doctorId}/${timestamp}/${signature}`;
};

/**
 * Generate a demo HMAC signature (not cryptographically secure — demo only).
 */
const generateDemoSignature = (doctorId: string, timestamp: number): string => {
    const data = `${doctorId}:${timestamp}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(12, '0').substring(0, 12);
};

/**
 * Get the QR refresh interval in seconds.
 */
export const getQRRefreshInterval = (): number => QR_REFRESH_INTERVAL;

/**
 * Calculate remaining seconds until next QR refresh.
 */
export const getSecondsUntilRefresh = (lastRefreshTime: number): number => {
    const elapsed = Math.floor((Date.now() - lastRefreshTime) / 1000);
    return Math.max(0, QR_REFRESH_INTERVAL - elapsed);
};
