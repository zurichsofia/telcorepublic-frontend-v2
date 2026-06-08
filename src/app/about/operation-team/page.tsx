import { PageHero } from "@/components/common/page-hero";
import { TeamMemberBlock } from "@/components/common/team-member-block";
import { operationTeamMembers } from "@/data/operation-team";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata.operationTeam;

export default function OperationTeamPage() {
  return (
    <div className="pb-8 sm:pb-12">
      <PageHero
        className="mb-28 sm:mb-40"
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
          linkedinUrl={member.linkedinUrl}
          previewParagraphs={member.previewParagraphs}
          moreParagraphs={member.moreParagraphs}
          reverse={index % 2 === 1}
        />
      ))}
    </div>
  );
}
