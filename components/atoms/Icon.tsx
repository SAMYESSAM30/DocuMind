/**
 * Atom: Icon Component
 * Basic icon wrapper component
 */
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps {
  icon: LucideIcon;
  size?: number | string;
  className?: string;
}

export function Icon({ icon: IconComponent, size = 16, className }: IconProps) {
  return (
    <IconComponent 
      className={cn(className)} 
      size={size}
    />
  );
}

