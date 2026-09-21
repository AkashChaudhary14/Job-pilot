"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { AnalysisSession } from "@/lib/schema/analysis";

type InterviewTabProps = {
  session: AnalysisSession;
};

export function InterviewTab({ session }: InterviewTabProps) {
  const { interview } = session.result;
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  const toggleTask = (key: string) => {
    setCheckedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Interview rounds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {interview.rounds.map((round) => (
              <div key={round.name} className="rounded-md border p-3">
                <p className="font-medium">{round.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{round.focus}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical topics</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {interview.technicalTopics.map((topic) => (
            <Badge key={topic} variant="secondary">
              {topic}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {interview.systemDesign && interview.systemDesign.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>System design prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {interview.systemDesign.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Behavioral questions</CardTitle>
          <CardDescription>STAR outline prompts from your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {interview.behavioral.map((item, i) => (
              <AccordionItem key={i} value={`behavioral-${i}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <p className="font-medium">Situation</p>
                    <p className="text-muted-foreground">
                      {item.starPrompt.situation}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Task</p>
                    <p className="text-muted-foreground">{item.starPrompt.task}</p>
                  </div>
                  <div>
                    <p className="font-medium">Action</p>
                    <p className="text-muted-foreground">
                      {item.starPrompt.action}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Result</p>
                    <p className="text-muted-foreground">
                      {item.starPrompt.result}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7-day prep plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {interview.prepPlan.map((day) => (
            <div key={day.day} className="rounded-md border p-4">
              <p className="font-medium">
                Day {day.day}: {day.title}
              </p>
              <ul className="mt-3 space-y-2">
                {day.tasks.map((task, i) => {
                  const key = `day-${day.day}-task-${i}`;
                  return (
                    <li key={key} className="flex items-start gap-2">
                      <Checkbox
                        id={key}
                        checked={Boolean(checkedTasks[key])}
                        onCheckedChange={() => toggleTask(key)}
                      />
                      <Label htmlFor={key} className="text-sm font-normal leading-snug">
                        {task}
                      </Label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
