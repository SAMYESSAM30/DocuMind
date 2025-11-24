/**
 * Template: AnalyzePageTemplate
 * Layout template for the analyze page
 */
import { ReactNode } from "react";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AnalyzePageTemplateProps {
  header: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  content: ReactNode;
}

export function AnalyzePageTemplate({
  header,
  title,
  subtitle,
  content,
}: AnalyzePageTemplateProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {header}
      <div className="w-full px-40 py-8">
        <div className="text-center mb-8">
          {title}
          {subtitle}
        </div>
        {content}
      </div>
    </main>
  );
}

