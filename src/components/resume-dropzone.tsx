"use client";

import { FileUp, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ResumeDropzoneProps = {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
};

export function ResumeDropzone({ onTextExtracted, disabled }: ResumeDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const parseFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Please upload a PDF file");
        return;
      }

      setIsParsing(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to parse PDF");
        }

        onTextExtracted(data.text);
        toast.success("Resume text extracted from PDF");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to parse PDF",
        );
      } finally {
        setIsParsing(false);
      }
    },
    [onTextExtracted],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      if (disabled || isParsing) return;

      const file = event.dataTransfer.files[0];
      if (file) void parseFile(file);
    },
    [disabled, isParsing, parseFile],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void parseFile(file);
    event.target.value = "";
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled && !isParsing) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/20",
        (disabled || isParsing) && "pointer-events-none opacity-60",
      )}
    >
      {isParsing ? (
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      ) : (
        <FileUp className="size-8 text-muted-foreground" />
      )}
      <div>
        <p className="text-sm font-medium">
          {isParsing ? "Extracting text from PDF…" : "Drop your resume PDF here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          ATS parsers read single-column text — we convert your PDF to editable text
        </p>
      </div>
      <Button variant="secondary" size="sm" asChild disabled={disabled || isParsing}>
        <label className="cursor-pointer">
          Browse PDF
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={handleFileChange}
            disabled={disabled || isParsing}
          />
        </label>
      </Button>
    </div>
  );
}
