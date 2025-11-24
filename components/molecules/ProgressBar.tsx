/**
 * Molecule: ProgressBar Component
 * Progress bar with label and percentage
 */
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "../atoms/Spinner";

interface ProgressBarProps {
  message: string;
  progress: number;
  showSpinner?: boolean;
}

export function ProgressBar({ message, progress, showSpinner = true }: ProgressBarProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showSpinner && <Spinner size="md" className="text-primary" />}
              <span className="font-medium">{message}</span>
            </div>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </CardContent>
    </Card>
  );
}

