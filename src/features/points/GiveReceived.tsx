import { ActivityAvatar } from 'features/activities/ActivityAvatar';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { Flex, Popover, PopoverContent, PopoverTrigger, Text } from '../../ui';
import { GemCoFillSm } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';

import { groupAndSortGive } from './PostGives';
export const GiveReceived = ({ profile_id }: { profile_id: number }) => {
  const { data } = useQuery(['give_received', profile_id], async () => {
    const { colinks_gives } = await client.query(
      {
        colinks_gives: [
          {
            where: {
              target_profile_id: {
                _eq: profile_id,
              },
            },
          },
          {
            id: true,
            skill: true,
            profile_id: true,
            activity_id: true,
            giver_profile_public: {
              id: true,
              address: true,
              name: true,
              avatar: true,
            },
          },
        ],
      },
      {
        operationName: 'getGiveReceived',
      }
    );

    return colinks_gives;
  });
  if (!data) return null;
  const sortedGives = groupAndSortGive(data);
  return (
    <>
      <Text>total give received: {data.length}</Text>
      <Text>skills: {data.length}</Text>
      {sortedGives.map(g => (
        <Flex key={`give_${g.skill}`} css={{ gap: '$md' }}>
          <Popover>
            <PopoverTrigger css={{ cursor: 'pointer' }}>
              <Text tag size="medium" color="complete">
                {g.skill ? (
                  <>
                    {' '}
                    {`+${g.count}`}
                    <GemCoFillSm fa size={'md'} /> {g.skill}
                  </>
                ) : (
                  <>
                    {`+${g.count}`}
                    <GemCoFillSm fa size={'md'} />
                  </>
                )}
              </Text>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              css={{
                background: '$dim',
                mt: '$sm',
                p: '$sm $sm',
              }}
            >
              <Text
                variant="label"
                css={{
                  color: '$complete',
                  borderBottom: '0.5px solid $border',
                  pb: '$xs',
                  mb: '$sm',
                }}
              >
                {g.skill}
              </Text>
              <Flex column css={{ gap: '$sm' }}>
                {g.gives
                  .filter(give => give.giver_profile_public?.name)
                  .map((give, index) => (
                    <>
                      {give.giver_profile_public && (
                        <Flex css={{ alignItems: 'center', gap: '$sm' }}>
                          <ActivityAvatar
                            size="xs"
                            profile={give.giver_profile_public}
                          />
                          <Text
                            size="small"
                            semibold
                            css={{ textDecoration: 'none' }}
                            as={NavLink}
                            to={coLinksPaths.profile(
                              give.giver_profile_public.address || ''
                            )}
                            key={index}
                          >
                            {give.giver_profile_public?.name}
                          </Text>
                        </Flex>
                      )}
                    </>
                  ))}
              </Flex>
            </PopoverContent>
          </Popover>
        </Flex>
      ))}
    </>
  );
};
