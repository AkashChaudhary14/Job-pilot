import type { AtsScore } from "@/lib/schema/analysis";
import type { ExtractedKeyword } from "@/lib/ats/keyword-extractor";

export const SYSTEM_PROMPT = `You are an ATS resume optimizer and interview prep coach.

HONEST REWRITE RULES (strictly enforced):
1. NEVER invent employers, job titles, dates, or metrics. Only use facts present in the original resume.
2. Preserve the original section order and section headings exactly.
3. Rephrase existing bullets using job-description language ONLY where the candidate's experience supports it.
4. Do not create a two-column or graphic layout — output is a single-column ATS-safe resume.
5. For JD keywords the candidate lacks: add them to the Skills section with learnBeforeInterview: true and a unique id. Flag these in changes as skill_added.
6. Weave missing must-have keywords into existing bullets when honestly supported before adding new skills.
7. Company intel must be inferred from the JD — do not fabricate specific company facts not implied by the JD.
8. Target 100% must-have keyword coverage in the optimized resume text while staying truthful.

Return structured JSON matching the schema exactly.`;

type UserPromptInput = {
  resumeText: string;
  jobDescription: string;
  company?: string;
  role?: string;
  missingKeywords: ExtractedKeyword[];
  originalScore: AtsScore;
};

export function buildUserPrompt(input: UserPromptInput): string {
  const missingList = input.missingKeywords
    .map((k) => `- ${k.term} (${k.priority}, ${k.category})`)
    .join("\n");

  const breakdown = input.originalScore.breakdown
    .map((b) => `- ${b.label}: ${b.score}/${b.max} — ${b.detail}`)
    .join("\n");

  return `Optimize this resume for the job description below.

${input.company ? `Company (user provided): ${input.company}` : ""}
${input.role ? `Role (user provided): ${input.role}` : ""}

ORIGINAL RESUME:
"""
${input.resumeText}
"""

JOB DESCRIPTION:
"""
${input.jobDescription}
"""

MISSING KEYWORDS TO ADDRESS:
${missingList || "(none — maintain coverage)"}

ORIGINAL ATS SCORE BREAKDOWN:
${breakdown}

Requirements:
- Keep contact info from the original resume in resume.contact
- resume.sections must preserve original section order and headings
- skills.original = skills already demonstrated in the resume
- skills.added = JD skills not honestly demonstrated; each needs id, name, learnBeforeInterview: true
- changes = concise list of what changed (rephrase, keyword, skill_added)
- ats.keywords = table with term, priority (must|nice), status (present|added|missing), optional location
- learning = study plan for added/missing skills with effort, studyTopics, starterProject
- company = inferred from JD (name, role, product, cultureSignals)
- interview = rounds, technicalTopics, behavioral with STAR prompts, systemDesign if relevant, prepPlan for 7 days`;
}
