import { ComponentProps } from 'react';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { CoLinksMember } from '../../pages/colinks/explore/CoLinksMember';
import { ProfileForCard } from '../../pages/colinks/explore/fetchPeopleWithSkills';
import { Flex } from '../../ui';

export const Leaderboard = ({
  leaders,
  size = 'large',
  hideRank = false,
}: {
  leaders?: ProfileForCard[];
  hideRank?: boolean;
  size?: ComponentProps<typeof CoLinksMember>['size'];
}) => {
  if (leaders === undefined) return <LoadingIndicator />;
  return (
    <Flex column css={{ gap: '$md', width: '100%' }}>
      {leaders.map((leader, idx) => {
        return (
          <CoLinksMember
            key={leader.id}
            profile={leader}
            rankNumber={hideRank ? undefined : idx + 1}
            size={size}
          />
        );
      })}
    </Flex>
  );
};
