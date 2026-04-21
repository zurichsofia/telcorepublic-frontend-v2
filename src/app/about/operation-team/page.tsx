import type { Metadata } from "next";

import { Footer } from "@/components/common/footer";
import { PageHero } from "@/components/common/page-hero";
import { TeamMemberBlock } from "@/components/common/team-member-block";
import { Navigation } from "@/components/common/navigation";
import { operationTeamMembers } from "@/data/operation-team";

export const metadata: Metadata = {
  title: "Operation Team | Telcorepublic Research",
  description:
    "Our core team consists of renowned OSS and BSS market analysts, uniquely qualified to cover next-generation telecoms operations and business management systems.",
};

export default function OperationTeamPage() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-white">
      <Navigation />
      <main className="flex-1">
        <PageHero
          variant="centered"
          title="Operation Team"
          subtitle="Our Core Team Consists of Renowned OSS and BSS Market Analysts."
          description="Our background makes us uniquely qualified to cover the new market for next generation telecoms operations and business management systems."
        />
        {operationTeamMembers.map((member, index) => (
          <TeamMemberBlock
            key={member.id}
            id={member.id}
            role={member.role}
            name={member.name}
            previewParagraphs={member.previewParagraphs}
            moreParagraphs={member.moreParagraphs}
            reverse={index % 2 === 1}
          />
        ))}
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}
