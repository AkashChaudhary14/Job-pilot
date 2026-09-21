"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeywordTable } from "@/components/dashboard/keyword-table";
import type { AnalysisSession } from "@/lib/schema/analysis";

type SkillsTabProps = {
  session: AnalysisSession;
};

function effortVariant(effort: "low" | "medium" | "high") {
  switch (effort) {
    case "low":
      return "secondary";
    case "medium":
      return "default";
    case "high":
      return "destructive";
  }
}

export function SkillsTab({ session }: SkillsTabProps) {
  const { result } = session;
  const missing = result.ats.keywords.filter((k) => k.status === "missing");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Skills to learn</CardTitle>
          <CardDescription>
            Injected JD skills flagged for honest prep — remove any you cannot
            discuss from the Resume tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result.learning.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No new skills to learn — your resume covers the JD keywords.
            </p>
          ) : (
            <Accordion type="multiple" className="w-full">
              {result.learning.map((item) => (
                <AccordionItem key={item.skill} value={item.skill}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 text-left">
                      <span>{item.skill}</span>
                      <Badge variant={effortVariant(item.effort)}>
                        {item.effort} effort
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm text-muted-foreground">
                    <p>{item.whyItMatters}</p>
                    <div>
                      <p className="font-medium text-foreground">Study topics</p>
                      <ul className="mt-1 list-disc pl-5">
                        {item.studyTopics.map((topic) => (
                          <li key={topic}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                    {item.starterProject && (
                      <div>
                        <p className="font-medium text-foreground">
                          Starter project
                        </p>
                        <p>{item.starterProject}</p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {missing.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Still missing from resume</CardTitle>
            <CardDescription>
              Keywords not yet covered — consider honest skill development or
              experience mapping.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KeywordTable keywords={missing} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
