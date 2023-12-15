import { AiLight } from '../../icons/__generated';
import { Avatar, Flex, Text } from '../../ui';
import { displayScorePct } from '../ai/vectorEmbeddings';
import { CoLinksStats } from '../colinks/CoLinksStats';

export const PeopleResult = ({
  profile,
  score,
}: {
  profile: {
    name?: string;
    avatar?: string;
    links?: number;
    reputation_score?: { total_score: number };
  };
  score?: number;
}) => {
  return (
    <Flex
      css={{
        width: '100%',
        alignItems: 'center',
        gap: '$md',
        justifyContent: 'space-between',
      }}
    >
      <Flex
        css={{
          alignItems: 'center',
          gap: '$md',
        }}
      >
        <Avatar size="small" name={profile.name} path={profile.avatar} />
        <Text semibold>{profile.name}</Text>
      </Flex>
      <Flex css={{ gap: '$md' }}>
        <CoLinksStats
          links={profile.links ?? 0}
          score={profile.reputation_score?.total_score ?? 0}
          holdingCount={0}
        />
        {score && (
          <Text size={'xs'} color={'secondary'}>
            <AiLight
              nostroke
              css={{ mr: '$xs', '*': { fill: '$secondaryText' } }}
            />
            {displayScorePct(score)}%
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
