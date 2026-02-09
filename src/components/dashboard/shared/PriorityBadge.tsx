import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AlertPriority, ValidationPriorite } from "@/types/president";

type PriorityType = AlertPriority | ValidationPriorite;

const priorityConfig: Record<PriorityType, { label: string; className: string }> = {
    critique: { label: "Critique", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800" },
    haute: { label: "Haute", className: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800" },
    moyenne: { label: "Moyenne", className: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800" },
    basse: { label: "Basse", className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800" },
    info: { label: "Info", className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800" },
};

interface PriorityBadgeProps {
    priority: PriorityType;
    className?: string;
}

const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
    const config = priorityConfig[priority];
    return (
        <Badge variant="outline" className={cn("text-xs font-medium", config.className, className)}>
            {priority === "critique" ? "🔴" : priority === "haute" ? "🟠" : priority === "moyenne" ? "🟡" : priority === "basse" ? "🟢" : "🔵"} {config.label}
        </Badge>
    );
};

export default PriorityBadge;
