/**
 * Organism: ProcessingStatus Component
 * Displays processing status with progress and error handling
 */
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "../molecules/ProgressBar";
import { Skeleton } from "@/components/ui/skeleton";
import { ProcessingStatus as ProcessingStatusType } from "@/lib/types";
import { useTranslation } from "react-i18next";

interface ProcessingStatusProps {
  status: ProcessingStatusType;
  onReset?: () => void;
}

export function ProcessingStatus({ status, onReset }: ProcessingStatusProps) {
  const { t } = useTranslation();

  const getProgressValue = () => {
    if (status.status === "idle") return 0;
    if (status.status === "complete") return 100;
    if (status.status === "error") return 0;
    return status.progress || 0;
  };

  if (status.status === "idle" || status.status === "complete") {
    return null;
  }

  if (status.status === "error") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-destructive font-medium">{status.message}</p>
            {onReset && (
              <Button onClick={onReset} variant="outline">
                {t("translation:main.tryAgain")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status.status === "analyzing") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ProgressBar
      message={status.message || ""}
      progress={getProgressValue()}
    />
  );
}

