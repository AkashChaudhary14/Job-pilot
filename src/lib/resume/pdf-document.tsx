import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Resume } from "@/lib/schema/analysis";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    color: "#111111",
  },
  name: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  contact: {
    fontSize: 9,
    marginBottom: 12,
    color: "#333333",
  },
  sectionHeading: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  bullet: {
    marginBottom: 3,
    paddingLeft: 8,
  },
  skills: {
    marginTop: 2,
  },
});

type ResumePdfDocumentProps = {
  resume: Resume;
  removedAddedSkillIds?: string[];
};

export function ResumePdfDocument({
  resume,
  removedAddedSkillIds = [],
}: ResumePdfDocumentProps) {
  const contact = resume.contact;
  const contactLine = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
  ]
    .filter(Boolean)
    .join(" | ");

  const activeAdded = resume.skills.added.filter(
    (s) => !removedAddedSkillIds.includes(s.id),
  );

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {contact.name && <Text style={styles.name}>{contact.name}</Text>}
        {contactLine && <Text style={styles.contact}>{contactLine}</Text>}

        {resume.sections.map((section) => {
          const isSkillsSection = section.heading.toLowerCase().includes("skill");
          let bullets = section.bullets;

          if (isSkillsSection) {
            const allSkills = [
              ...resume.skills.original,
              ...activeAdded.map((s) => s.name),
            ];
            bullets = [allSkills.join(", ")];
          }

          return (
            <View key={section.heading} wrap={false}>
              <Text style={styles.sectionHeading}>{section.heading}</Text>
              {bullets.map((bullet, i) => (
                <Text key={`${section.heading}-${i}`} style={styles.bullet}>
                  - {bullet}
                </Text>
              ))}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
