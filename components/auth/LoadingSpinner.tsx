/**
 * Loading Spinner Component - Reusability
 * Reusable loading spinner component
 */
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const sizeClasses: Record<number, string> = {
  4: "h-4 w-4",
  6: "h-6 w-6",
  8: "h-8 w-8",
  12: "h-12 w-12",
};

export function LoadingSpinner({ size = 8, className = "" }: LoadingSpinnerProps) {
  const sizeClass = sizeClasses[size] || sizeClasses[8];
  
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClass} animate-spin`} />
    </div>
  );
}

