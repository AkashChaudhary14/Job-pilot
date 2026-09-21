"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ResumeDropzone } from "@/components/resume-dropzone";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSession } from "@/lib/session";
import type { AnalyzeResponse } from "@/lib/schema/analysis";

export default function HomePage() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerate = async () => {
    if (resumeText.trim().length < 50) {
      toast.error("Please provide resume text (at least 50 characters)");
      return;
    }
    if (jobDescription.trim().length < 50) {
      toast.error("Please provide a job description (at least 50 characters)");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          company: company || undefined,
          role: role || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      const result = data as AnalyzeResponse;
      saveSession({
        input: {
          resumeText,
          jobDescription,
          company: company || undefined,
          role: role || undefined,
        },
        originalScore: result.originalScore,
        optimizedScore: result.optimizedScore,
        result: result.result,
        removedAddedSkillIds: [],
        isMock: result.isMock,
      });

      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 lg:px-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-4" />
          ATS Resume Optimizer + Interview Dashboard
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Tailor your resume to the job — honestly
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Upload a PDF or paste text, add a job description, and get an ATS-safe
          rewrite, keyword score, and 7-day interview prep plan. We never invent
          employers, titles, dates, or metrics.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>
                Upload a PDF or paste plain text. Two-column graphic PDFs are
                converted to ATS-readable text.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ResumeDropzone
                onTextExtracted={setResumeText}
                disabled={isAnalyzing}
              />
              <div className="space-y-2">
                <Label htmlFor="resume-text">Or paste resume text</Label>
                <Textarea
                  id="resume-text"
                  placeholder="Paste your resume text here…"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={12}
                  disabled={isAnalyzing}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job description</CardTitle>
              <CardDescription>
                Required. Keywords are extracted deterministically for scoring.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company (optional)</Label>
                  <Input
                    id="company"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    disabled={isAnalyzing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role (optional)</Label>
                  <Input
                    id="role"
                    placeholder="Senior Software Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isAnalyzing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jd">Job description</Label>
                <Textarea
                  id="jd"
                  placeholder="Paste the full job description…"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={10}
                  disabled={isAnalyzing}
                />
              </div>
              <Button
                className="w-full sm:w-auto"
                size="lg"
                onClick={handleGenerate}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  "Generate optimized resume"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">1. Parse</strong> — Extract
                text and preserve section order from your resume.
              </p>
              <p>
                <strong className="text-foreground">2. Score</strong> — Match
                JD keywords, sections, contact, dates, and metrics
                deterministically.
              </p>
              <p>
                <strong className="text-foreground">3. Rewrite</strong> — AI
                rephrases bullets with JD language where your experience
                supports it. Missing skills are added with a learn-before-interview
                flag.
              </p>
              <p>
                <strong className="text-foreground">4. Prep</strong> — Get
                company intel, interview questions, STAR prompts, and a 7-day
                plan.
              </p>
            </CardContent>
          </Card>

          <Alert>
            <AlertTitle>Honest rewrite rules</AlertTitle>
            <AlertDescription>
              We do not invent employers, titles, dates, or metrics. New JD
              skills you cannot discuss yet are flagged — remove them with one
              click before download.
            </AlertDescription>
          </Alert>

          <Alert variant="default">
            <AlertTitle>No API key?</AlertTitle>
            <AlertDescription>
              Demo mode uses a realistic fixture so you can explore every
              dashboard tab. Add <code className="text-xs">OPENAI_API_KEY</code> or{" "}
              <code className="text-xs">ANTHROPIC_API_KEY</code> to{" "}
              <code className="text-xs">.env.local</code> for live analysis.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </main>
  );
}
