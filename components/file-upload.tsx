"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { validateFileType, validateFileSize } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

export function FileUpload({ onFileSelect, isProcessing = false }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="w-full space-y-4">
      {!selectedFile ? (
        <Card>
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">
                {isDragActive ? t("translation:main.dragDrop") : t("translation:main.uploadFile")}
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
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <File className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isProcessing && (
                <Button variant="ghost" size="icon" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              )}
              {isProcessing && (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

