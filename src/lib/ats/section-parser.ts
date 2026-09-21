export type ParsedSection = {
  heading: string;
  content: string[];
};

export type ParsedResume = {
  sections: ParsedSection[];
  contact: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  hasDateRanges: boolean;
  measurableBulletCount: number;
};

const SECTION_HEADINGS = [
  "summary",
  "professional summary",
  "objective",
  "experience",
  "work experience",
  "professional experience",
  "employment",
  "education",
  "skills",
  "technical skills",
  "core competencies",
  "certifications",
  "projects",
  "achievements",
  "contact",
];

const DATE_PATTERN =
  /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(?:present|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4})/i;

const YEAR_RANGE_PATTERN = /\b\d{4}\s*[-–—]\s*(?:\d{4}|present)\b/i;

const METRIC_PATTERN =
  /\b\d+(?:\.\d+)?%|\$\d+|\d+\+|\b(?:increased|decreased|reduced|improved|grew|saved|delivered|achieved|boosted|lowered)\b[^.\n]{0,40}\b\d+/i;

function isHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 60) return false;

  if (trimmed.endsWith(":")) {
    const label = trimmed.slice(0, -1).toLowerCase();
    return SECTION_HEADINGS.some((h) => label.includes(h)) || label.length < 30;
  }

  if (trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed) && trimmed.length < 40) {
    return true;
  }

  const lower = trimmed.toLowerCase();
  return SECTION_HEADINGS.some((h) => lower === h || lower.startsWith(`${h} `));
}

function extractContact(lines: string[]): ParsedResume["contact"] {
  const contactBlock = lines.slice(0, 15).join("\n");
  const email = contactBlock.match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0];
  const phone = contactBlock.match(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  )?.[0];
  const linkedin = contactBlock.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i,
  )?.[0];
  const location = contactBlock.match(
    /\b[A-Z][a-z]+(?:,\s*[A-Z]{2})?\b(?:\s*\|\s*[A-Z][a-z]+)?/,
  )?.[0];

  const nameLine = lines.find(
    (l) =>
      l.trim().length > 0 &&
      l.trim().length < 50 &&
      !l.includes("@") &&
      !/\d{3}/.test(l) &&
      !/linkedin/i.test(l),
  );

  return {
    name: nameLine?.trim(),
    email,
    phone,
    location,
    linkedin,
  };
}

export function parseResumeSections(resumeText: string): ParsedResume {
  const lines = resumeText.split(/\r?\n/);
  const sections: ParsedSection[] = [];
  let current: ParsedSection | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (isHeading(trimmed)) {
      if (current) sections.push(current);
      current = {
        heading: trimmed.replace(/:$/, ""),
        content: [],
      };
    } else if (current) {
      current.content.push(trimmed);
    } else {
      current = { heading: "Contact", content: [trimmed] };
    }
  }
  if (current) sections.push(current);

  const fullText = resumeText.toLowerCase();
  const hasDateRanges =
    DATE_PATTERN.test(resumeText) || YEAR_RANGE_PATTERN.test(resumeText);

  let measurableBulletCount = 0;
  for (const line of lines) {
    if (METRIC_PATTERN.test(line)) measurableBulletCount++;
  }

  const sectionHeadingsLower = sections.map((s) => s.heading.toLowerCase());
  const hasExperienceSection =
    sectionHeadingsLower.some((h) => h.includes("experience")) ||
    fullText.includes("experience");
  const hasEducationSection =
    sectionHeadingsLower.some((h) => h.includes("education")) ||
    fullText.includes("education");
  const hasSkillsSection =
    sectionHeadingsLower.some((h) => h.includes("skill")) ||
    fullText.includes("skills");

  if (!hasExperienceSection && fullText.includes("engineer")) {
    sections.push({ heading: "Experience", content: [] });
  }
  if (!hasEducationSection && /\b(university|college|b\.?s\.?|bachelor)\b/i.test(resumeText)) {
    sections.push({ heading: "Education", content: [] });
  }
  if (!hasSkillsSection) {
    sections.push({ heading: "Skills", content: [] });
  }

  return {
    sections,
    contact: extractContact(lines),
    hasDateRanges,
    measurableBulletCount,
  };
}

export function hasRequiredSections(parsed: ParsedResume): {
  contact: boolean;
  experience: boolean;
  education: boolean;
  skills: boolean;
} {
  const headings = parsed.sections.map((s) => s.heading.toLowerCase());
  const allText = headings.join(" ");

  return {
    contact:
      Boolean(parsed.contact.email) ||
      headings.some((h) => h.includes("contact")) ||
      parsed.sections.some((s) => s.heading.toLowerCase() === "contact"),
    experience: allText.includes("experience") || allText.includes("employment"),
    education: allText.includes("education"),
    skills: allText.includes("skill") || allText.includes("competenc"),
  };
}
