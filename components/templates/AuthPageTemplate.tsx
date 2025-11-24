/**
 * Template: AuthPageTemplate
 * Layout template for authentication pages
 */
import { ReactNode } from "react";

interface AuthPageTemplateProps {
  children: ReactNode;
}

export function AuthPageTemplate({ children }: AuthPageTemplateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      {children}
    </div>
  );
}

