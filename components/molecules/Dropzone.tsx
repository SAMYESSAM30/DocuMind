/**
 * Molecule: Dropzone Component
 * File dropzone area
 */
"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  disabled?: boolean;
}

export function Dropzone({
  onDrop,
  accept,
  maxFiles = 1,
  disabled = false,
}: DropzoneProps) {
  const { t } = useTranslation();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: accept || {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles,
    disabled,
  });

  return (
    <Card>
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-semibold mb-2">
            {isDragActive
              ? t("translation:main.dragDrop")
              : t("translation:main.uploadFile")}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {t("translation:main.clickToSelect")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("translation:main.supportedFormats")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

