"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AtsScoreGauge } from "@/components/dashboard/ats-score-gauge";
import { KeywordTable } from "@/components/dashboard/keyword-table";
import type { AnalysisSession } from "@/lib/schema/analysis";

type OverviewTabProps = {
  session: AnalysisSession;
};

export function OverviewTab({ session }: OverviewTabProps) {
  const { originalScore, optimizedScore, result } = session;
  const missingKeywords = result.ats.keywords.filter((k) => k.status === "missing");
  const addedKeywords = result.ats.keywords.filter((k) => k.status === "added");
  const scoreDelta = optimizedScore.overall - originalScore.overall;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>ATS score</CardTitle>
            <CardDescription>
              Keyword coverage and structure match — not a Workday/Greenhouse
              vendor guarantee.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <AtsScoreGauge label="Before" score={originalScore} />
              <AtsScoreGauge label="After" score={optimizedScore} />
            </div>
            {scoreDelta !== 0 && (
              <p className="text-sm text-muted-foreground">
                Score change:{" "}
                <span
                  className={
                    scoreDelta > 0 ? "text-emerald-400" : "text-red-400"
                  }
                >
                  {scoreDelta > 0 ? "+" : ""}
                  {scoreDelta} points
                </span>
              </p>
            )}
            <Separator />
            <div className="space-y-3">
              <p className="text-sm font-medium">Score breakdown (optimized)</p>
              {optimizedScore.breakdown.map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">
                      {item.score}/{item.max}
                    </span>
                  </div>
                  <Progress value={item.score} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What changed</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {result.changes.map((change, i) => (
                <li key={i} className="flex gap-2">
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs uppercase">
                    {change.type.replace("_", " ")}
                  </span>
                  <span className="text-muted-foreground">{change.summary}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company & role intel</CardTitle>
            <CardDescription>Inferred from the job description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {result.company.name && (
              <p>
                <span className="font-medium">Company:</span> {result.company.name}
              </p>
            )}
            {result.company.role && (
              <p>
                <span className="font-medium">Role:</span> {result.company.role}
              </p>
            )}
            {result.company.product && (
              <p>
                <span className="font-medium">Product:</span> {result.company.product}
              </p>
            )}
            {result.company.cultureSignals.length > 0 && (
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {result.company.cultureSignals.map((signal, i) => (
                  <li key={i}>{signal}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top keyword gaps</CardTitle>
            <CardDescription>
              {missingKeywords.length} missing · {addedKeywords.length} added to
              skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KeywordTable
              keywords={[
                ...missingKeywords,
                ...addedKeywords,
                ...result.ats.keywords.filter((k) => k.status === "present"),
              ]}
              limit={12}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
