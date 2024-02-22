import useProfileId from '../../hooks/useProfileId';
import { Flex, IconButton, Text } from '../../ui';
import { BoltFill, X } from 'icons/__generated';

export const PostGives = ({
  gives,
  clearSkill,
}: {
  clearSkill: () => void;
  gives: {
    id: number;
    skill?: string;
    giver_profile_public?: {
      name?: string;
      id?: number;
    };
  }[];
}) => {
  const profileId = useProfileId(true);

  const groupedGives = gives.reduce(
    (acc, give) => {
      if (give.skill) {
        if (!acc[give.skill]) {
          acc[give.skill] = [];
        }
        acc[give.skill].push(give);
      } else {
        if (!acc['']) {
          acc[''] = [];
        }
        acc[''].push(give);
      }
      return acc;
    },
    {} as Record<string, typeof gives>
  );

  const sortedGives = Object.entries(groupedGives)
    .map(([skill, gives]) => ({
      count: gives.length,
      gives: gives,
      skill: skill,
    }))
    .sort((a, b) => {
      const diff = b.count - a.count;
      if (diff == 0) {
        return a.skill.localeCompare(b.skill);
      }
      return diff;
    });

  return (
    <>
      <Flex css={{ gap: '$sm' }}>
        {sortedGives.map(g => (
          <Flex key={`give_${g.skill}`} css={{ gap: '$md' }}>
            <Text tag size="medium" color="complete">
              {g.skill ? (
                <>
                  {' '}
                  {`+${g.count}`}
                  <BoltFill
                    css={{
                      path: {
                        fill: '$complete',
                      },
                    }}
                    nostroke
                    size={'md'}
                  />{' '}
                  {g.skill}
                </>
              ) : (
                <>
                  {`+${g.count}`}
                  <BoltFill
                    css={{
                      path: {
                        fill: '$complete',
                      },
                    }}
                    nostroke
                    size={'md'}
                  />
                </>
              )}
              {g.gives.some(
                give => give.giver_profile_public?.id === profileId
              ) && (
                <IconButton
                  onClick={() => clearSkill()}
                  css={{ pr: '$sm', width: 'auto' }}
                >
                  <X size={'xs'} />
                </IconButton>
              )}
            </Text>
            {/* <Text size="xs" semibold key={g.id}>
              from{' '}
              {g.giver_profile_public?.id === profileId
                ? 'You'
                : g.giver_profile_public?.name}
            </Text> */}
          </Flex>
        ))}
      </Flex>
    </>
  );
};
