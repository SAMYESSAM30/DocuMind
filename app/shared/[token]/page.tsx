/**
 * Shared Analysis Page
 * View shared analysis via token
 */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BRDRequirements } from "@/lib/types";
import { ResultsDisplay } from "@/components/results-display";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/atoms/Spinner";

export default function SharedAnalysisPage() {
  const params = useParams();
  const token = params.token as string;
  const [requirements, setRequirements] = useState<BRDRequirements | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedAnalysis = async () => {
      try {
        const response = await fetch(`/api/shared/${token}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Analysis not found or link has expired");
          } else if (response.status === 403) {
            setError("This analysis is private");
          } else {
            setError("Failed to load analysis");
          }
          return;
        }

        const data = await response.json();
        setRequirements(data.analysis.requirements);
      } catch (err) {
        setError("Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSharedAnalysis();
    }
  }, [token]);

  const handleDownloadJSON = () => {
    if (requirements) {
      const filename = requirements.metadata?.documentName
        ? `${requirements.metadata.documentName.replace(/\.[^/.]+$/, "")}_requirements.json`
        : "brd_requirements.json";
      const dataStr = JSON.stringify(requirements, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadPDF = () => {
    // PDF download would need to be implemented
    console.log("PDF download not implemented for shared view");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!requirements) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shared Analysis</h1>
            <p className="text-muted-foreground mt-1">
              {requirements.metadata?.documentName || "Document Analysis"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">View Only</span>
          </div>
        </div>
        <ResultsDisplay
          requirements={requirements}
          onDownloadJSON={handleDownloadJSON}
          onDownloadPDF={handleDownloadPDF}
        />
      </div>
    </div>
  );
}

