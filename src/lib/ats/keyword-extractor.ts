export type KeywordCategory =
  | "skill"
  | "tool"
  | "certification"
  | "degree"
  | "experience";

export type ExtractedKeyword = {
  term: string;
  normalized: string;
  priority: "must" | "nice";
  category: KeywordCategory;
};

const KNOWN_SKILLS = [
  "react",
  "next.js",
  "nextjs",
  "typescript",
  "javascript",
  "node.js",
  "nodejs",
  "python",
  "java",
  "go",
  "golang",
  "rust",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "k8s",
  "terraform",
  "postgresql",
  "postgres",
  "mysql",
  "mongodb",
  "redis",
  "graphql",
  "rest",
  "api",
  "sql",
  "nosql",
  "ci/cd",
  "cicd",
  "git",
  "linux",
  "agile",
  "scrum",
  "tailwind",
  "css",
  "html",
  "vue",
  "angular",
  "spring",
  "django",
  "flask",
  "fastapi",
  "express",
  "microservices",
  "system design",
  "machine learning",
  "ml",
  "ai",
  "llm",
  "openai",
  "vercel",
  "serverless",
  "jest",
  "cypress",
  "playwright",
  "figma",
  "jira",
  "kafka",
  "rabbitmq",
  "elasticsearch",
  "dynamodb",
  "lambda",
  "s3",
  "ec2",
  "iam",
  "oauth",
  "jwt",
  "grpc",
  "protobuf",
  "webpack",
  "vite",
  "redux",
  "zustand",
  "prisma",
  "drizzle",
  "supabase",
  "firebase",
  "stripe",
  "twilio",
  "snowflake",
  "dbt",
  "airflow",
  "spark",
  "hadoop",
  "tableau",
  "power bi",
  "excel",
  "salesforce",
  "sap",
  "pmp",
  "cpa",
  "cfa",
];

const CERT_PATTERNS = [
  /\baws\s+(?:certified\s+)?(?:solutions?\s+architect|developer|sysops)\b/gi,
  /\b(?:pmp|cpa|cfa|cissp|comptia\s+\w+)\b/gi,
];

const DEGREE_PATTERNS = [
  /\b(?:b\.?s\.?|bachelor(?:'?s)?)\s+(?:in\s+)?(?:computer science|cs|engineering|software engineering|information technology|it|data science|mathematics|math)\b/gi,
  /\b(?:m\.?s\.?|master(?:'?s)?)\s+(?:in\s+)?(?:computer science|cs|engineering|software engineering|data science)\b/gi,
  /\b(?:ph\.?d\.?|doctorate)\b/gi,
];

const EXPERIENCE_PATTERNS = [
  /\b(\d+)\+?\s*(?:\+)?\s*years?\s+(?:of\s+)?(?:experience|exp)\b/gi,
  /\b(?:minimum|at least)\s+(\d+)\s+years?\b/gi,
];

const MUST_SIGNALS =
  /\b(required|must have|must|minimum|mandatory|essential|need to have)\b/i;
const NICE_SIGNALS =
  /\b(preferred|nice to have|bonus|plus|ideally|desired|optional)\b/i;

const SECTION_MUST =
  /\b(requirements?|qualifications?|must have|what you(?:'ll)? need|minimum qualifications?)\b/i;
const SECTION_NICE =
  /\b(nice to have|preferred qualifications?|bonus points?|pluses?)\b/i;

function normalizeTerm(term: string): string {
  return term.toLowerCase().trim().replace(/\s+/g, " ");
}

function addKeyword(
  map: Map<string, ExtractedKeyword>,
  term: string,
  priority: "must" | "nice",
  category: KeywordCategory,
) {
  const normalized = normalizeTerm(term);
  if (normalized.length < 2) return;
  const existing = map.get(normalized);
  if (!existing || (existing.priority === "nice" && priority === "must")) {
    map.set(normalized, {
      term: term.trim(),
      normalized,
      priority,
      category,
    });
  }
}

function detectLinePriority(line: string, sectionPriority: "must" | "nice"): "must" | "nice" {
  if (MUST_SIGNALS.test(line)) return "must";
  if (NICE_SIGNALS.test(line)) return "nice";
  return sectionPriority;
}

function extractFromKnownSkills(text: string, priority: "must" | "nice"): ExtractedKeyword[] {
  const found: ExtractedKeyword[] = [];
  const lower = text.toLowerCase();
  for (const skill of KNOWN_SKILLS) {
    const pattern = skill.includes("/")
      ? skill.replace("/", "\\/")
      : skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${pattern}\\b`, "i");
    if (regex.test(lower)) {
      found.push({
        term: skill,
        normalized: normalizeTerm(skill),
        priority,
        category: "skill",
      });
    }
  }
  return found;
}

export function extractKeywords(jobDescription: string): ExtractedKeyword[] {
  const map = new Map<string, ExtractedKeyword>();
  const lines = jobDescription.split(/\r?\n/);
  let sectionPriority: "must" | "nice" = "must";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (SECTION_NICE.test(trimmed)) {
      sectionPriority = "nice";
      continue;
    }
    if (SECTION_MUST.test(trimmed)) {
      sectionPriority = "must";
      continue;
    }

    const linePriority = detectLinePriority(trimmed, sectionPriority);

    for (const kw of extractFromKnownSkills(trimmed, linePriority)) {
      addKeyword(map, kw.term, kw.priority, kw.category);
    }

    for (const pattern of CERT_PATTERNS) {
      const matches = trimmed.matchAll(pattern);
      for (const match of matches) {
        addKeyword(map, match[0], linePriority, "certification");
      }
    }

    for (const pattern of DEGREE_PATTERNS) {
      const matches = trimmed.matchAll(pattern);
      for (const match of matches) {
        addKeyword(map, match[0], linePriority, "degree");
      }
    }

    for (const pattern of EXPERIENCE_PATTERNS) {
      const matches = trimmed.matchAll(pattern);
      for (const match of matches) {
        addKeyword(map, match[0], linePriority, "experience");
      }
    }

    const bulletMatch = trimmed.match(/^[-•*]\s+(.+)/);
    if (bulletMatch) {
      const bullet = bulletMatch[1];
      const capitalizedTerms = bullet.match(
        /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}\b/g,
      );
      if (capitalizedTerms) {
        for (const term of capitalizedTerms) {
          if (term.length > 2 && term.length < 40) {
            addKeyword(map, term, linePriority, "tool");
          }
        }
      }
    }
  }

  if (map.size === 0) {
    for (const kw of extractFromKnownSkills(jobDescription, "must")) {
      addKeyword(map, kw.term, kw.priority, kw.category);
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === "must" ? -1 : 1;
    return a.term.localeCompare(b.term);
  });
}

export function getMissingKeywords(
  resumeText: string,
  keywords: ExtractedKeyword[],
): ExtractedKeyword[] {
  const lower = resumeText.toLowerCase();
  return keywords.filter((kw) => !keywordMatchesText(kw, lower));
}

export function keywordMatchesText(
  keyword: ExtractedKeyword | { term: string; normalized?: string },
  text: string,
): boolean {
  const normalized = keyword.normalized ?? normalizeTerm(keyword.term);
  const lower = text.toLowerCase();

  const aliases: Record<string, string[]> = {
    "next.js": ["nextjs", "next js"],
    nextjs: ["next.js", "next js"],
    "node.js": ["nodejs", "node js"],
    nodejs: ["node.js", "node js"],
    "ci/cd": ["cicd", "ci cd"],
    cicd: ["ci/cd", "ci cd"],
    k8s: ["kubernetes"],
    kubernetes: ["k8s"],
    postgres: ["postgresql"],
    postgresql: ["postgres"],
    ml: ["machine learning"],
    "machine learning": ["ml"],
  };

  const terms = [normalized, ...(aliases[normalized] ?? [])];
  return terms.some((term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(lower);
  });
}
