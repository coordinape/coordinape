import { LoadingIndicator } from '../../components/LoadingIndicator';
import { CoLinksMember } from '../../pages/colinks/explore/CoLinksMember';
import { ProfileForCard } from '../../pages/colinks/explore/fetchPeopleWithSkills';
import { Flex } from '../../ui';

export const Leaderboard = ({ leaders }: { leaders?: ProfileForCard[] }) => {
  if (leaders === undefined) return <LoadingIndicator />;
  return (
    <Flex column css={{ gap: '$md', width: '100%' }}>
      {leaders.map((leader, idx) => (
        <CoLinksMember key={leader.id} profile={leader} rankNumber={idx + 1} />
      ))}
    </Flex>
  );
};
