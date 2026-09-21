import { generateText, NoObjectGeneratedError, Output } from "ai";
import { NextResponse } from "next/server";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { getModel, hasAiProvider } from "@/lib/ai/provider";
import {
  buildKeywordStatuses,
  extractKeywords,
  getMissingKeywords,
  scoreResume,
} from "@/lib/ats/scorer";
import { buildMockAnalysis } from "@/lib/mock/analysis-fixture";
import { sectionsToPlainText } from "@/lib/resume/to-plain-text";
import {
  AnalysisResultSchema,
  AnalyzeRequestSchema,
} from "@/lib/schema/analysis";

export const runtime = "nodejs";

function mergeKeywordStatuses(
  result: ReturnType<typeof buildMockAnalysis>,
  optimizedText: string,
  keywords: ReturnType<typeof extractKeywords>,
) {
  const addedNames = result.resume.skills.added.map((s) => s.name);
  result.ats.keywords = buildKeywordStatuses(optimizedText, keywords, addedNames);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = AnalyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const { resumeText, jobDescription, company, role } = parsed.data;
    const keywords = extractKeywords(jobDescription);
    const originalScore = scoreResume(resumeText, keywords);
    const missingKeywords = getMissingKeywords(resumeText, keywords);

    let result;
    const isMock = !hasAiProvider();

    if (isMock) {
      result = buildMockAnalysis(resumeText, jobDescription, company, role);
    } else {
      const model = getModel();
      if (!model) {
        result = buildMockAnalysis(resumeText, jobDescription, company, role);
      } else {
        try {
          const { output } = await generateText({
            model,
            output: Output.object({ schema: AnalysisResultSchema }),
            system: SYSTEM_PROMPT,
            prompt: buildUserPrompt({
              resumeText,
              jobDescription,
              company,
              role,
              missingKeywords,
              originalScore,
            }),
          });

          if (!output) {
            throw new Error("No structured output returned");
          }
          result = output;
        } catch (error) {
          if (NoObjectGeneratedError.isInstance(error)) {
            return NextResponse.json(
              {
                error:
                  "AI could not produce a valid analysis. Please try again or shorten inputs.",
              },
              { status: 502 },
            );
          }
          throw error;
        }
      }
    }

    const optimizedText = sectionsToPlainText(result.resume, []);
    mergeKeywordStatuses(result, optimizedText, keywords);
    const optimizedScore = scoreResume(optimizedText, keywords);

    return NextResponse.json({
      originalScore,
      optimizedScore,
      result,
      isMock: isMock || !hasAiProvider(),
    });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 500 },
    );
  }
}
