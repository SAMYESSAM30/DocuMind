/**
 * Atom: FileIcon Component
 * File icon with background
 */
import { File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileIconProps {
  className?: string;
  iconClassName?: string;
}

export function FileIcon({ className, iconClassName }: FileIconProps) {
  return (
    <div className={cn("p-3 bg-primary/10 rounded-lg", className)}>
      <File className={cn("h-6 w-6 text-primary", iconClassName)} />
    </div>
  );
}

