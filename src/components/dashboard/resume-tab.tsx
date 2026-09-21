"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { DownloadResumePdf } from "@/components/dashboard/download-resume-pdf";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sectionsToPlainText } from "@/lib/resume/to-plain-text";
import type { AnalysisSession } from "@/lib/schema/analysis";

type ResumeTabProps = {
  session: AnalysisSession;
  onToggleSkill: (skillId: string, removed: boolean) => void;
};

function ResumePreview({ text }: { text: string }) {
  return (
    <ScrollArea className="h-[480px] rounded-md border bg-muted/20 p-4">
      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
        {text}
      </pre>
    </ScrollArea>
  );
}

function OptimizedResumeContent({
  session,
  onToggleSkill,
}: {
  session: AnalysisSession;
  onToggleSkill: (skillId: string, removed: boolean) => void;
}) {
  const { result, removedAddedSkillIds } = session;

  return (
    <div className="space-y-4">
      {result.resume.sections.map((section) => (
        <div key={section.heading}>
          <h4 className="text-xs font-semibold uppercase tracking-wide">
            {section.heading}
          </h4>
          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
            {section.bullets.map((bullet, i) => (
              <li key={i}>• {bullet}</li>
            ))}
          </ul>
        </div>
      ))}

      {result.resume.skills.added.length > 0 && (
        <div className="space-y-2 rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
          <p className="text-xs font-medium text-amber-300">
            Added skills — learn before interview
          </p>
          {result.resume.skills.added.map((skill) => {
            const isRemoved = removedAddedSkillIds.includes(skill.id);
            return (
              <div key={skill.id} className="flex items-center gap-2">
                <Checkbox
                  id={skill.id}
                  checked={!isRemoved}
                  onCheckedChange={(checked) => {
                    onToggleSkill(skill.id, checked !== true);
                  }}
                />
                <Label
                  htmlFor={skill.id}
                  className={isRemoved ? "line-through opacity-50" : ""}
                >
                  {skill.name}
                </Label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ResumeTab({ session, onToggleSkill }: ResumeTabProps) {
  const optimizedText = sectionsToPlainText(
    session.result.resume,
    session.removedAddedSkillIds,
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(optimizedText);
    toast.success("Optimized resume copied to clipboard");
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          Single-column ATS-safe layout. Uncheck any injected skill you cannot
          discuss — it will be excluded from copy and PDF download.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="size-4" />
          Copy optimized
        </Button>
        <DownloadResumePdf
          resume={session.result.resume}
          removedAddedSkillIds={session.removedAddedSkillIds}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Original</CardTitle>
            <CardDescription>Your input resume text</CardDescription>
          </CardHeader>
          <CardContent>
            <ResumePreview text={session.input.resumeText} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimized</CardTitle>
            <CardDescription>ATS-safe rewrite</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[480px] rounded-md border bg-muted/20 p-4">
              <OptimizedResumeContent
                session={session}
                onToggleSkill={onToggleSkill}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
