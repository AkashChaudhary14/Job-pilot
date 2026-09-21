import { z } from "zod";

export const ResumeSectionSchema = z.object({
  heading: z.string(),
  bullets: z.array(z.string()),
  isAddedSkills: z.boolean().optional(),
});

export const AddedSkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  learnBeforeInterview: z.literal(true),
});

export const ResumeSchema = z.object({
  sections: z.array(ResumeSectionSchema),
  skills: z.object({
    original: z.array(z.string()),
    added: z.array(AddedSkillSchema),
  }),
  contact: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
  }),
});

export const ChangeSchema = z.object({
  type: z.enum(["rephrase", "keyword", "skill_added"]),
  summary: z.string(),
});

export const KeywordStatusSchema = z.object({
  term: z.string(),
  priority: z.enum(["must", "nice"]),
  status: z.enum(["present", "added", "missing"]),
  location: z.string().optional(),
});

export const LearningItemSchema = z.object({
  skill: z.string(),
  whyItMatters: z.string(),
  effort: z.enum(["low", "medium", "high"]),
  studyTopics: z.array(z.string()),
  starterProject: z.string().optional(),
});

export const CompanySchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  product: z.string().optional(),
  cultureSignals: z.array(z.string()),
});

export const InterviewRoundSchema = z.object({
  name: z.string(),
  focus: z.string(),
});

export const StarPromptSchema = z.object({
  situation: z.string(),
  task: z.string(),
  action: z.string(),
  result: z.string(),
});

export const BehavioralQuestionSchema = z.object({
  question: z.string(),
  starPrompt: StarPromptSchema,
});

export const PrepDaySchema = z.object({
  day: z.number(),
  title: z.string(),
  tasks: z.array(z.string()),
});

export const InterviewSchema = z.object({
  rounds: z.array(InterviewRoundSchema),
  technicalTopics: z.array(z.string()),
  behavioral: z.array(BehavioralQuestionSchema),
  systemDesign: z.array(z.string()).optional(),
  prepPlan: z.array(PrepDaySchema),
});

export const AnalysisResultSchema = z.object({
  resume: ResumeSchema,
  changes: z.array(ChangeSchema),
  ats: z.object({
    keywords: z.array(KeywordStatusSchema),
  }),
  learning: z.array(LearningItemSchema),
  company: CompanySchema,
  interview: InterviewSchema,
});

export const ScoreBreakdownSchema = z.object({
  label: z.string(),
  score: z.number(),
  max: z.number(),
  detail: z.string(),
});

export const AtsScoreSchema = z.object({
  overall: z.number(),
  keywordHitRate: z.number(),
  mustHaveHitRate: z.number(),
  niceToHaveHitRate: z.number(),
  sectionsScore: z.number(),
  contactScore: z.number(),
  datesScore: z.number(),
  metricsScore: z.number(),
  breakdown: z.array(ScoreBreakdownSchema),
});

export const AnalyzeRequestSchema = z.object({
  resumeText: z.string().min(50, "Resume text is too short"),
  jobDescription: z.string().min(50, "Job description is too short"),
  company: z.string().optional(),
  role: z.string().optional(),
});

export const AnalyzeResponseSchema = z.object({
  originalScore: AtsScoreSchema,
  optimizedScore: AtsScoreSchema,
  result: AnalysisResultSchema,
  isMock: z.boolean(),
});

export type ResumeSection = z.infer<typeof ResumeSectionSchema>;
export type AddedSkill = z.infer<typeof AddedSkillSchema>;
export type Resume = z.infer<typeof ResumeSchema>;
export type Change = z.infer<typeof ChangeSchema>;
export type KeywordStatus = z.infer<typeof KeywordStatusSchema>;
export type LearningItem = z.infer<typeof LearningItemSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type Interview = z.infer<typeof InterviewSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
export type AtsScore = z.infer<typeof AtsScoreSchema>;
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;

export type AnalysisSession = {
  input: AnalyzeRequest;
  originalScore: AtsScore;
  optimizedScore: AtsScore;
  result: AnalysisResult;
  removedAddedSkillIds: string[];
  isMock: boolean;
};
