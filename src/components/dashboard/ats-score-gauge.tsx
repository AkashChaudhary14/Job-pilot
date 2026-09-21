"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AtsScore } from "@/lib/schema/analysis";

type AtsScoreGaugeProps = {
  label: string;
  score: AtsScore;
  className?: string;
};

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

export function AtsScoreGauge({ label, score, className }: AtsScoreGaugeProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-end justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className={cn("text-3xl font-semibold tabular-nums", scoreColor(score.overall))}>
          {score.overall}
          <span className="text-base font-normal text-muted-foreground">/100</span>
        </p>
      </div>
      <Progress value={score.overall} className="h-2" />
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <span>Keywords: {score.keywordHitRate}%</span>
        <span>Must-have: {score.mustHaveHitRate}%</span>
        <span>Sections: {score.sectionsScore}%</span>
        <span>Contact: {score.contactScore}%</span>
      </div>
    </div>
  );
}
