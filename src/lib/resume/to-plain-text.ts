import type { Resume } from "@/lib/schema/analysis";

export function sectionsToPlainText(
  resume: Resume,
  removedAddedSkillIds: string[] = [],
): string {
  const lines: string[] = [];

  const contact = resume.contact;
  if (contact.name) lines.push(contact.name);
  const contactParts = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
  ].filter(Boolean);
  if (contactParts.length) lines.push(contactParts.join(" | "));
  lines.push("");

  for (const section of resume.sections) {
    lines.push(section.heading.toUpperCase());
    for (const bullet of section.bullets) {
      lines.push(`• ${bullet}`);
    }
    lines.push("");
  }

  const activeAdded = resume.skills.added.filter(
    (s) => !removedAddedSkillIds.includes(s.id),
  );
  const allSkills = [...resume.skills.original, ...activeAdded.map((s) => s.name)];

  if (allSkills.length > 0) {
    const hasSkillsSection = resume.sections.some((s) =>
      s.heading.toLowerCase().includes("skill"),
    );
    if (!hasSkillsSection) {
      lines.push("SKILLS");
      lines.push(allSkills.join(", "));
    }
  }

  return lines.join("\n").trim();
}
