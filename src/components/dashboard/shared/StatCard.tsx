import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = "text-primary",
    iconBg = "bg-primary/10",
    action,
    className,
}: StatCardProps) => {
    return (
        <Card className={cn("hover:shadow-md transition-shadow duration-200", className)}>
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground font-medium">{title}</p>
                        <p className="text-xl font-bold text-foreground mt-1 truncate">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
                        <Icon className={cn("w-5 h-5", iconColor)} />
                    </div>
                </div>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="mt-3 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                        {action.label} →
                    </button>
                )}
            </CardContent>
        </Card>
    );
};

export default StatCard;
