import { Badge } from "@/components/ui/badge";
import type { DoctorStatus } from "@/types/medecin";
import { doctorStatusConfig } from "@/lib/status-utils";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: DoctorStatus;
    size?: "sm" | "md" | "lg";
    showIcon?: boolean;
    className?: string;
}

const StatusBadge = ({ status, size = "md", showIcon = true, className }: StatusBadgeProps) => {
    const config = doctorStatusConfig[status];
    if (!config) return null;

    const Icon = config.icon;
    const sizeClasses = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-1.5",
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                "inline-flex items-center gap-1.5 font-medium border-0",
                config.bgColor,
                config.color,
                sizeClasses[size],
                className
            )}
        >
            {showIcon && <Icon className={cn("flex-shrink-0", size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4")} />}
            {config.label}
        </Badge>
    );
};

export default StatusBadge;
