import { LoadingIndicator } from '../../components/LoadingIndicator';
import { AvatarWithLinks } from '../../pages/colinks/explore/AvatarWithLinks';
import { CoLinksMember } from '../../pages/colinks/explore/CoLinksMember';
import { ProfileForCard } from '../../pages/colinks/explore/fetchPeopleWithSkills';
import { coLinksPaths } from '../../routes/paths';
import { AppLink, Flex, Text } from '../../ui';

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
        if (small) {
          return (
            <Flex
              as={AppLink}
              to={coLinksPaths.profile(leader.address ?? '')}
              key={leader.id}
              css={{ alignItems: 'center', gap: '$md' }}
            >
              <AvatarWithLinks profile={leader} size={'medium'} />
              <Text semibold>{leader.name}</Text>
            </Flex>
          );
        }
        return (
          <CoLinksMember
            key={leader.id}
            profile={leader}
            rankNumber={idx + 1}
          />
        );
      })}
    </Flex>
  );
};
