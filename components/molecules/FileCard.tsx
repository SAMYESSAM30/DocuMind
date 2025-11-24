/**
 * Molecule: FileCard Component
 * Displays file information in a card
 */
import { FileIcon } from "../atoms/FileIcon";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { Spinner } from "../atoms/Spinner";
import { Card, CardContent } from "@/components/ui/card";

interface FileCardProps {
  fileName: string;
  fileSize: number;
  onRemove?: () => void;
  isProcessing?: boolean;
}

export function FileCard({ fileName, fileSize, onRemove, isProcessing }: FileCardProps) {
  const sizeInMB = (fileSize / 1024 / 1024).toFixed(2);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileIcon />
            <div>
              <p className="font-medium">{fileName}</p>
              <p className="text-sm text-muted-foreground">{sizeInMB} MB</p>
            </div>
          </div>
          {!isProcessing && onRemove && (
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
          {isProcessing && <Spinner size="md" className="text-primary" />}
        </div>
      </CardContent>
    </Card>
  );
}

