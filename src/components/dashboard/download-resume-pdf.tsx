"use client";

import { Download, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ResumePdfDocument } from "@/lib/resume/pdf-document";
import type { Resume } from "@/lib/schema/analysis";

type DownloadResumePdfProps = {
  resume: Resume;
  removedAddedSkillIds: string[];
};

export function DownloadResumePdf({
  resume,
  removedAddedSkillIds,
}: DownloadResumePdfProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const blob = await pdf(
        <ResumePdfDocument
          resume={resume}
          removedAddedSkillIds={removedAddedSkillIds}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "optimized-resume.pdf";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Resume PDF downloaded");
    } catch {
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button variant="secondary" onClick={handleDownload} disabled={isGenerating}>
      {isGenerating ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      Download PDF
    </Button>
  );
}
