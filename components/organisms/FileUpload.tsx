/**
 * Organism: FileUpload Component
 * Complete file upload functionality with validation
 */
"use client";

import { useState, useCallback } from "react";
import { Dropzone } from "../molecules/Dropzone";
import { FileCard } from "../molecules/FileCard";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import { validateFileType, validateFileSize } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

export function FileUpload({ onFileSelect, isProcessing = false }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleDrop = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;

      const file = files[0];

      if (!validateFileType(file)) {
        toast({
          title: t("common:error"),
          description: t("translation:errors.invalidFileType"),
          variant: "destructive",
        });
        return;
      }

      if (!validateFileSize(file)) {
        toast({
          title: t("common:error"),
          description: t("translation:errors.fileTooLarge"),
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect, toast, t]
  );

  const handleRemove = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full space-y-4">
      {!selectedFile ? (
        <Dropzone
          onDrop={handleDrop}
          disabled={isProcessing}
        />
      ) : (
        <FileCard
          fileName={selectedFile.name}
          fileSize={selectedFile.size}
          onRemove={handleRemove}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}

