import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/president";

const roleConfig: Record<UserRole, { label: string; className: string }> = {
    president: { label: "PRÉSIDENT", className: "bg-cnom-gold/20 text-cnom-gold-dark border-cnom-gold/40 font-bold" },
    admin: { label: "ADMIN", className: "bg-red-100 text-red-700 border-red-200" },
    sg: { label: "SG", className: "bg-violet-100 text-violet-700 border-violet-200" },
    tresorier: { label: "TRÉSORIER", className: "bg-amber-100 text-amber-700 border-amber-200" },
    agent: { label: "AGENT", className: "bg-sky-100 text-sky-700 border-sky-200" },
    commission: { label: "COMMISSION", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    regional: { label: "RÉGIONAL", className: "bg-pink-100 text-pink-700 border-pink-200" },
    medecin: { label: "MÉDECIN", className: "bg-primary/10 text-primary border-primary/20" },
};

interface RoleBadgeProps {
    role: UserRole;
    className?: string;
}

const RoleBadge = ({ role, className }: RoleBadgeProps) => {
    const config = roleConfig[role];
    return (
        <Badge variant="outline" className={cn("text-[10px] tracking-wide", config.className, className)}>
            {config.label}
        </Badge>
    );
};

export default RoleBadge;
