import {
  extractKeywords,
  getMissingKeywords,
  keywordMatchesText,
  type ExtractedKeyword,
} from "@/lib/ats/keyword-extractor";
import {
  hasRequiredSections,
  parseResumeSections,
} from "@/lib/ats/section-parser";
import type { AtsScore, KeywordStatus } from "@/lib/schema/analysis";

function hitRate(keywords: ExtractedKeyword[], text: string): number {
  if (keywords.length === 0) return 100;
  const hits = keywords.filter((kw) => keywordMatchesText(kw, text)).length;
  return Math.round((hits / keywords.length) * 100);
}

function scoreSections(parsed: ReturnType<typeof parseResumeSections>): number {
  const required = hasRequiredSections(parsed);
  const checks = [
    required.contact,
    required.experience,
    required.education,
    required.skills,
  ];
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}

function scoreContact(parsed: ReturnType<typeof parseResumeSections>): number {
  const { contact } = parsed;
  let score = 0;
  if (contact.name) score += 25;
  if (contact.email) score += 35;
  if (contact.phone) score += 20;
  if (contact.linkedin) score += 20;
  return Math.min(100, score);
}

function scoreDates(parsed: ReturnType<typeof parseResumeSections>): number {
  return parsed.hasDateRanges ? 100 : 0;
}

function scoreMetrics(parsed: ReturnType<typeof parseResumeSections>): number {
  if (parsed.measurableBulletCount >= 2) return 100;
  if (parsed.measurableBulletCount === 1) return 50;
  return 0;
}

export function scoreResume(
  resumeText: string,
  keywords: ExtractedKeyword[],
): AtsScore {
  const parsed = parseResumeSections(resumeText);
  const lower = resumeText.toLowerCase();

  const mustKeywords = keywords.filter((k) => k.priority === "must");
  const niceKeywords = keywords.filter((k) => k.priority === "nice");

  const mustHaveHitRate = hitRate(mustKeywords, lower);
  const niceToHaveHitRate = hitRate(niceKeywords, lower);
  const keywordHitRate = hitRate(keywords, lower);
  const sectionsScore = scoreSections(parsed);
  const contactScore = scoreContact(parsed);
  const datesScore = scoreDates(parsed);
  const metricsScore = scoreMetrics(parsed);

  const mustWeight = mustKeywords.length > 0 ? 0.45 : 0;
  const niceWeight = niceKeywords.length > 0 ? 0.15 : 0;
  const redistributed =
    mustWeight + niceWeight < 0.6
      ? (0.6 - mustWeight - niceWeight) / 4
      : 0;

  const overall = Math.round(
    mustHaveHitRate * (mustWeight || 0.45) +
      niceToHaveHitRate * (niceWeight || 0.15) +
      sectionsScore * (0.15 + redistributed) +
      contactScore * (0.1 + redistributed) +
      datesScore * (0.1 + redistributed) +
      metricsScore * (0.05 + redistributed),
  );

  return {
    overall: Math.min(100, Math.max(0, overall)),
    keywordHitRate,
    mustHaveHitRate,
    niceToHaveHitRate,
    sectionsScore,
    contactScore,
    datesScore,
    metricsScore,
    breakdown: [
      {
        label: "Must-have keywords",
        score: mustHaveHitRate,
        max: 100,
        detail: `${mustKeywords.filter((k) => keywordMatchesText(k, lower)).length}/${mustKeywords.length || 0} matched`,
      },
      {
        label: "Nice-to-have keywords",
        score: niceToHaveHitRate,
        max: 100,
        detail: `${niceKeywords.filter((k) => keywordMatchesText(k, lower)).length}/${niceKeywords.length || 0} matched`,
      },
      {
        label: "Required sections",
        score: sectionsScore,
        max: 100,
        detail: "Contact, experience, education, skills",
      },
      {
        label: "Contact completeness",
        score: contactScore,
        max: 100,
        detail: "Name, email, phone/LinkedIn",
      },
      {
        label: "Date ranges",
        score: datesScore,
        max: 100,
        detail: parsed.hasDateRanges ? "Dates detected" : "No date ranges found",
      },
      {
        label: "Measurable bullets",
        score: metricsScore,
        max: 100,
        detail: `${parsed.measurableBulletCount} quantified bullets`,
      },
    ],
  };
}

export function buildKeywordStatuses(
  resumeText: string,
  keywords: ExtractedKeyword[],
  addedSkillNames: string[] = [],
): KeywordStatus[] {
  const lower = resumeText.toLowerCase();
  const addedLower = addedSkillNames.map((s) => s.toLowerCase());

  return keywords.map((kw) => {
    const inResume = keywordMatchesText(kw, lower);
    const inAdded = addedLower.some(
      (s) => s.includes(kw.normalized) || kw.normalized.includes(s),
    );

    let status: KeywordStatus["status"] = "missing";
    if (inResume) status = "present";
    else if (inAdded) status = "added";

    return {
      term: kw.term,
      priority: kw.priority,
      status,
      location: inResume ? "resume body" : inAdded ? "skills (added)" : undefined,
    };
  });
}

export { extractKeywords, getMissingKeywords, type ExtractedKeyword };
