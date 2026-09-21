import type { AnalysisResult } from "@/lib/schema/analysis";

const MOCK_COMPANY = "Acme Cloud Systems";
const MOCK_ROLE = "Senior Full Stack Engineer";

export function buildMockAnalysis(
  resumeText: string,
  jobDescription: string,
  company?: string,
  role?: string,
): AnalysisResult {
  const companyName = company || MOCK_COMPANY;
  const roleName = role || MOCK_ROLE;

  return {
    resume: {
      contact: {
        name: "Alex Chen",
        email: "alex.chen@email.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/alexchen",
      },
      sections: [
        {
          heading: "Summary",
          bullets: [
            `Full stack engineer with 6+ years building scalable web applications using React, TypeScript, and Node.js. Seeking ${roleName} role to deliver cloud-native products with measurable impact.`,
          ],
        },
        {
          heading: "Experience",
          bullets: [
            "Senior Software Engineer | TechFlow Inc. | Jan 2021 – Present",
            "Led migration of monolith to microservices on AWS, reducing deployment time by 40% and improving system reliability to 99.9% uptime.",
            "Built React and TypeScript dashboard used by 50K+ monthly active users; integrated REST and GraphQL APIs with PostgreSQL backend.",
            "Implemented CI/CD pipelines with Docker and Kubernetes, cutting release cycles from weekly to daily.",
            "Software Engineer | DataPulse | Jun 2018 – Dec 2020",
            "Developed Node.js services processing 2M+ events/day; optimized SQL queries reducing latency by 35%.",
            "Collaborated in Agile/Scrum team of 8; mentored 2 junior engineers on testing with Jest and code review practices.",
          ],
        },
        {
          heading: "Education",
          bullets: [
            "B.S. Computer Science | State University | 2014 – 2018",
          ],
        },
        {
          heading: "Skills",
          bullets: [
            "React, TypeScript, JavaScript, Node.js, AWS, Docker, Kubernetes, PostgreSQL, GraphQL, REST, CI/CD, Git, Agile, Jest",
          ],
        },
      ],
      skills: {
        original: [
          "React",
          "TypeScript",
          "JavaScript",
          "Node.js",
          "AWS",
          "Docker",
          "Kubernetes",
          "PostgreSQL",
          "GraphQL",
          "REST",
          "CI/CD",
          "Git",
          "Agile",
          "Jest",
        ],
        added: [
          {
            id: "skill-nextjs",
            name: "Next.js",
            learnBeforeInterview: true,
          },
          {
            id: "skill-terraform",
            name: "Terraform",
            learnBeforeInterview: true,
          },
          {
            id: "skill-redis",
            name: "Redis",
            learnBeforeInterview: true,
          },
        ],
      },
    },
    changes: [
      {
        type: "rephrase",
        summary:
          "Rewrote summary and experience bullets to mirror JD phrasing for cloud-native full stack delivery.",
      },
      {
        type: "keyword",
        summary:
          "Wove React, TypeScript, AWS, Kubernetes, and CI/CD keywords into existing experience bullets.",
      },
      {
        type: "skill_added",
        summary:
          "Added Next.js, Terraform, and Redis to Skills — flagged for learn-before-interview.",
      },
    ],
    ats: {
      keywords: [
        { term: "React", priority: "must", status: "present", location: "Experience" },
        { term: "TypeScript", priority: "must", status: "present", location: "Experience" },
        { term: "Node.js", priority: "must", status: "present", location: "Experience" },
        { term: "AWS", priority: "must", status: "present", location: "Experience" },
        { term: "Kubernetes", priority: "must", status: "present", location: "Experience" },
        { term: "PostgreSQL", priority: "must", status: "present", location: "Skills" },
        { term: "CI/CD", priority: "must", status: "present", location: "Experience" },
        { term: "Next.js", priority: "must", status: "added", location: "Skills (added)" },
        { term: "Terraform", priority: "nice", status: "added", location: "Skills (added)" },
        { term: "Redis", priority: "nice", status: "added", location: "Skills (added)" },
        { term: "GraphQL", priority: "nice", status: "present", location: "Skills" },
        { term: "Agile", priority: "nice", status: "present", location: "Experience" },
      ],
    },
    learning: [
      {
        skill: "Next.js",
        whyItMatters: `${companyName} lists Next.js for SSR, routing, and deployment on Vercel/AWS.`,
        effort: "medium",
        studyTopics: [
          "App Router vs Pages Router",
          "Server Components",
          "API routes and data fetching",
          "Deployment patterns",
        ],
        starterProject: "Rebuild a personal portfolio with App Router, dynamic routes, and one API route.",
      },
      {
        skill: "Terraform",
        whyItMatters: "JD mentions infrastructure-as-code for AWS provisioning.",
        effort: "high",
        studyTopics: [
          "HCL basics",
          "AWS provider resources",
          "State management",
          "Modules and workspaces",
        ],
        starterProject: "Terraform module for S3 + Lambda + API Gateway stack.",
      },
      {
        skill: "Redis",
        whyItMatters: "Caching layer mentioned for high-traffic API performance.",
        effort: "low",
        studyTopics: [
          "Data structures",
          "TTL and eviction",
          "Session caching",
          "Node.js ioredis client",
        ],
        starterProject: "Add Redis cache to an Express API with cache-aside pattern.",
      },
    ],
    company: {
      name: companyName,
      role: roleName,
      product: "Cloud-native SaaS platform for enterprise workflow automation",
      cultureSignals: [
        "Emphasis on ownership and end-to-end delivery",
        "Remote-friendly with async collaboration",
        "Metrics-driven engineering culture",
        "Strong focus on system reliability and customer impact",
      ],
    },
    interview: {
      rounds: [
        { name: "Recruiter Screen", focus: "Background, motivation, compensation alignment" },
        { name: "Technical Phone Screen", focus: "React/TypeScript fundamentals, API design, debugging" },
        { name: "Virtual Onsite", focus: "System design, coding, behavioral panel" },
        { name: "Hiring Manager", focus: "Team fit, project depth, leadership examples" },
      ],
      technicalTopics: [
        "React component architecture and performance",
        "TypeScript generics and type narrowing",
        "REST vs GraphQL tradeoffs",
        "AWS services (Lambda, ECS, RDS)",
        "Database indexing and query optimization",
        "CI/CD and deployment strategies",
      ],
      behavioral: [
        {
          question: "Tell me about a time you led a technical migration.",
          starPrompt: {
            situation: "Monolith causing slow releases at TechFlow.",
            task: "Lead migration to microservices without downtime.",
            action: "Phased extraction, feature flags, automated tests, weekly stakeholder updates.",
            result: "40% faster deployments, 99.9% uptime maintained.",
          },
        },
        {
          question: "Describe a conflict with a teammate and how you resolved it.",
          starPrompt: {
            situation: "Disagreement on API schema design in sprint planning.",
            task: "Align team on approach before deadline.",
            action: "Facilitated spike, documented tradeoffs, ran team vote with manager input.",
            result: "Shipped on time; adopted RFC process for future decisions.",
          },
        },
        {
          question: "Give an example of improving system performance.",
          starPrompt: {
            situation: "Dashboard load times exceeded 3s for power users.",
            task: "Reduce perceived latency without full rewrite.",
            action: "Profiled queries, added indexes, introduced pagination and lazy loading.",
            result: "P95 load time dropped to 800ms; support tickets down 25%.",
          },
        },
        {
          question: "How do you mentor junior engineers?",
          starPrompt: {
            situation: "Two juniors joined mid-quarter with limited test coverage skills.",
            task: "Ramp them to independent contributors in 6 weeks.",
            action: "Pair programming, Jest workshops, structured code review feedback.",
            result: "Both shipped features independently by sprint 4.",
          },
        },
        {
          question: "Tell me about a production incident you handled.",
          starPrompt: {
            situation: "API outage during peak traffic after deployment.",
            task: "Restore service and prevent recurrence.",
            action: "Rolled back, identified bad migration, added canary deploy and alerts.",
            result: "MTTR under 20 minutes; zero repeat incidents in 6 months.",
          },
        },
      ],
      systemDesign: [
        "Design a URL shortener with analytics",
        "Design a real-time notification system",
        "Design a multi-tenant SaaS API with rate limiting",
      ],
      prepPlan: [
        {
          day: 1,
          title: "JD deep dive & gap audit",
          tasks: [
            "Highlight must-have vs nice-to-have keywords",
            "Map each requirement to resume evidence",
            "List honest gaps (Next.js, Terraform, Redis)",
          ],
        },
        {
          day: 2,
          title: "Next.js crash course",
          tasks: [
            "Complete App Router tutorial",
            "Build one page with server + client components",
            "Review SSR/SSG/ISR differences",
          ],
        },
        {
          day: 3,
          title: "System design fundamentals",
          tasks: [
            "Practice URL shortener on whiteboard",
            "Review AWS building blocks from JD",
            "Study caching patterns with Redis",
          ],
        },
        {
          day: 4,
          title: "Coding practice",
          tasks: [
            "2 LeetCode medium arrays/hashmaps",
            "1 React debugging exercise",
            "Review TypeScript utility types",
          ],
        },
        {
          day: 5,
          title: "Behavioral STAR prep",
          tasks: [
            "Write 5 STAR stories from resume bullets",
            "Record 2-minute answers aloud",
            "Prepare questions for hiring manager",
          ],
        },
        {
          day: 6,
          title: "Mock interview",
          tasks: [
            "45-min technical mock with peer or AI",
            "Review feedback and refine weak areas",
            "Re-read optimized resume aloud",
          ],
        },
        {
          day: 7,
          title: "Final review & logistics",
          tasks: [
            "Confirm interview schedule and platform",
            "Prepare workspace for virtual onsite",
            "Rest, light review of top 10 JD keywords",
          ],
        },
      ],
    },
  };
}

export function getMockOriginalResume(): string {
  return `Alex Chen
alex.chen@email.com | (555) 123-4567 | San Francisco, CA | linkedin.com/in/alexchen

SUMMARY
Full stack engineer with 6 years building web apps with React and Node.js.

EXPERIENCE
Senior Software Engineer | TechFlow Inc. | Jan 2021 – Present
- Led migration to microservices on AWS
- Built React dashboard for 50K users
- Set up CI/CD with Docker

Software Engineer | DataPulse | Jun 2018 – Dec 2020
- Built Node.js services for event processing
- Worked in Agile team, mentored juniors

EDUCATION
B.S. Computer Science | State University | 2014 – 2018

SKILLS
React, JavaScript, Node.js, AWS, Docker, PostgreSQL, Git`;
}
