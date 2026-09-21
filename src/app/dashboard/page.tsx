"use client";

import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { InterviewTab } from "@/components/dashboard/interview-tab";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { ResumeTab } from "@/components/dashboard/resume-tab";
import { SkillsTab } from "@/components/dashboard/skills-tab";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadSession, updateSession } from "@/lib/session";
import type { AnalysisSession } from "@/lib/schema/analysis";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMockAlert, setShowMockAlert] = useState(true);

  useEffect(() => {
    const stored = loadSession();
    if (!stored) {
      toast.error("No analysis session found. Start a new analysis.");
      router.replace("/");
      return;
    }
    setSession(stored);
    setIsLoading(false);
  }, [router]);

  const handleToggleSkill = useCallback(
    (skillId: string, removed: boolean) => {
      const updated = updateSession((current) => {
        const ids = new Set(current.removedAddedSkillIds);
        if (removed) ids.add(skillId);
        else ids.delete(skillId);
        return { ...current, removedAddedSkillIds: Array.from(ids) };
      });
      if (updated) setSession(updated);
    },
    [],
  );

  if (isLoading || !session) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-10 lg:px-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </main>
    );
  }

  const companyName =
    session.result.company.name || session.input.company || "Company";
  const roleName =
    session.result.company.role || session.input.role || "Role";

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-10 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
            <Link href="/">
              <ArrowLeft className="size-4" />
              New analysis
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <Badge variant="secondary">{companyName}</Badge>
            <Badge variant="outline">{roleName}</Badge>
          </div>
        </div>
      </header>

      {session.isMock && showMockAlert && (
        <Alert>
          <AlertTitle>Demo mode</AlertTitle>
          <AlertDescription className="flex items-start justify-between gap-4">
            <span>
              Add OPENAI_API_KEY or ANTHROPIC_API_KEY to .env.local for live
              analysis. Currently showing a realistic software-role fixture.
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setShowMockAlert(false)}
            >
              <X className="size-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="skills">Skills to learn</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab session={session} />
        </TabsContent>
        <TabsContent value="resume">
          <ResumeTab session={session} onToggleSkill={handleToggleSkill} />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsTab session={session} />
        </TabsContent>
        <TabsContent value="interview">
          <InterviewTab session={session} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
