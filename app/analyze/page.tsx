/**
 * Page: Analyze Page
 * Uses Atomic Design Pattern with Templates, Organisms, Molecules, and Atoms
 */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/organisms/FileUpload";
import { ResultsDisplay } from "@/components/results-display";
import { ProcessingStatus as ProcessingStatusComponent } from "@/components/organisms/ProcessingStatus";
import { AppHeader } from "@/components/organisms/AppHeader";
import { AnalyzePageTemplate } from "@/components/templates/AnalyzePageTemplate";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BRDRequirements, ProcessingStatus as ProcessingStatusType } from "@/lib/types";
import { downloadJSON } from "@/lib/utils";
import { downloadPDF } from "@/lib/pdf-generator";
import { parseDocumentFrontend } from "@/lib/frontend-parser";
import { analyzeBRDFrontend } from "@/lib/frontend-llm";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logoutUser, updateUser } from "@/lib/slices/authSlice";
import { setLoadingMessage } from "@/lib/slices/uiSlice";
import { FileText, Loader2 } from "lucide-react";
import { Spinner } from "@/components/atoms/Spinner";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [requirements, setRequirements] = useState<BRDRequirements | null>(null);
  const [status, setStatus] = useState<ProcessingStatusType>({ status: "idle" });
  const { toast } = useToast();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleFileSelect = async (selectedFile: File) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to analyze documents",
        variant: "destructive",
      });
      return;
    }

    // Check AI calls limit
    if (user.aiCallsUsed >= user.aiCallsLimit) {
      toast({
        title: "Limit Reached",
        description: `You've reached your monthly limit of ${user.aiCallsLimit} analyses. Please upgrade your plan.`,
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setRequirements(null);
    setStatus({ status: "uploading", message: t("translation:main.processing"), progress: 10 });

    try {
      // Parse document in the browser (frontend-only)
      setStatus({ status: "parsing", message: t("translation:main.processing"), progress: 30 });

      const text = await parseDocumentFrontend(selectedFile);

      if (!text || text.trim().length === 0) {
        throw new Error(t("translation:errors.emptyFile"));
      }

      setStatus({ status: "analyzing", message: t("translation:main.analyzing"), progress: 60 });

      // Analyze using Groq API (English only)
      const data: BRDRequirements = await analyzeBRDFrontend(text, selectedFile.name, "en");

      dispatch(setLoadingMessage("Saving analysis..."));
      setRequirements(data);
      setStatus({ status: "complete", message: t("translation:main.complete"), progress: 100 });

      // Save to database
      try {
        const response = await fetch("/api/analyses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies
          body: JSON.stringify({
            documentName: selectedFile.name,
            documentText: text,
            requirements: data,
          }),
        });

        if (response.ok) {
          // Refresh user to get updated AI calls count
          const userResponse = await fetch("/api/auth/me", {
            credentials: "include",
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            dispatch(updateUser(userData.user));
          }
        }
      } catch (error) {
        console.error("Failed to save analysis:", error);
        // Don't fail the whole operation if save fails
      } finally {
        dispatch(setLoadingMessage(null));
      }

      toast({
        title: t("common:success"),
        description: t("translation:main.complete"),
      });
    } catch (error) {
      console.error("Error processing file:", error);
      dispatch(setLoadingMessage(null));
      const errorMessage = error instanceof Error ? error.message : t("translation:errors.analysisError");
      setStatus({
        status: "error",
        message: errorMessage,
      });
      toast({
        title: t("common:error"),
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDownloadJSON = () => {
    if (requirements) {
      const filename = requirements.metadata?.documentName
        ? `${requirements.metadata.documentName.replace(/\.[^/.]+$/, "")}_requirements.json`
        : "brd_requirements.json";
      downloadJSON(requirements, filename);
    }
  };

  const handleDownloadPDF = () => {
    if (requirements) {
      downloadPDF(requirements);
    }
  };

  const handleReset = () => {
    setFile(null);
    setRequirements(null);
    setStatus({ status: "idle" });
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  const title = (
    <div className="flex items-center justify-center gap-3 mb-4">
      <FileText className="h-10 w-10 text-primary" />
      <h1 className="text-4xl font-bold">
        {t("translation:main.title")}
      </h1>
    </div>
  );

  const subtitle = (
    <p className="text-muted-foreground text-lg max-w-3xl mx-auto px-1 break-words">
      {t("translation:main.subtitle")}
    </p>
  );

  const content = !requirements ? (
    <div className="space-y-6">
      <FileUpload onFileSelect={handleFileSelect} isProcessing={status.status !== "idle"} />
      <ProcessingStatusComponent status={status} onReset={handleReset} />
    </div>
  ) : (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleReset}>
          {t("translation:main.analyzeAnother")}
        </Button>
      </div>
      <ResultsDisplay
        requirements={requirements}
        onDownloadJSON={handleDownloadJSON}
        onDownloadPDF={handleDownloadPDF}
      />
    </div>
  );

  return (
    <AnalyzePageTemplate
      header={<AppHeader user={user} onLogout={handleLogout} />}
      title={title}
      subtitle={subtitle}
      content={content}
    />
  );
}

