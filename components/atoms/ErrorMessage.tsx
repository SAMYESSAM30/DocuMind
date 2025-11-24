/**
 * Atom: ErrorMessage Component
 * Displays error messages
 */
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div className={cn("text-sm text-destructive mt-1", className)}>
      {message}
    </div>
  );
}

