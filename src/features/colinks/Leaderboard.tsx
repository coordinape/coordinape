import { LoadingIndicator } from '../../components/LoadingIndicator';
import { CoLinksMember } from '../../pages/colinks/explore/CoLinksMember';
import { ProfileForCard } from '../../pages/colinks/explore/fetchPeopleWithSkills';
import { Flex } from '../../ui';

export const Leaderboard = ({
  leaders,
  small,
}: {
  leaders?: ProfileForCard[];
  small?: boolean;
}) => {
  if (leaders === undefined) return <LoadingIndicator />;
  return (
    <Flex column css={{ gap: '$md', width: '100%' }}>
      {leaders.map((leader, idx) => {
        return (
          <CoLinksMember
            key={leader.id}
            profile={leader}
            rankNumber={idx + 1}
            small={small}
          />
        );
      })}
    </Flex>
  );
};
