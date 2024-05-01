/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import { groupAndSortGive } from 'features/points/PostGives';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';

import { Flex, Text } from '../../ui';
import {
  GiveLeaderboardColumn,
  GiveLeaderboardRow,
} from 'pages/GiveLeaderboard';

type sortBy = 'gives' | 'rank' | 'name';

export const PartyProfileGives = ({ profileId }: { profileId: number }) => {
  const [sort, setSortRaw] = useState<sortBy>('gives');
  const [desc, setDesc] = useState<boolean>(true);
  const setSort = (newSort: sortBy) => {
    if (newSort === sort) {
      setDesc(prev => !prev);
    } else {
      setDesc(true);
      setSortRaw(newSort);
    }
  };

  const { data } = useQuery(
    ['skill_counts', profileId],
    async () => {
      const { colinks_gives } = await anonClient.query(
        {
          colinks_gives: [
            {
              where: {
                target_profile_id: {
                  _eq: profileId,
                },
              },
            },
            {
              id: true,
              skill: true,
              profile_id: true,
              activity_id: true,
            },
          ],
        },
        {
          operationName: 'getGiveReceived',
        }
      );

      return groupAndSortGive(colinks_gives);
    },
    {
      enabled: !!profileId,
    }
  );

  return (
    <>
      {/*Table*/}
      <Flex
        css={{
          width: '100%',
          flexFlow: 'column',
          alignItems: 'flex-start',
          color: 'white',
        }}
      >
        <GiveLeaderboardRow header={true}>
          <GiveLeaderboardColumn
            onClick={() => setSort('name')}
            css={{
              minWidth: '15rem',
              '@md': {
                minWidth: '10rem',
              },
            }}
          >
            Skill
          </GiveLeaderboardColumn>
          <GiveLeaderboardColumn onClick={() => setSort('gives')}>
            GIVE
          </GiveLeaderboardColumn>
        </GiveLeaderboardRow>
        {data !== undefined &&
          data.map(skill => (
            <GiveLeaderboardRow key={skill.skill}>
              <GiveLeaderboardColumn
                css={{
                  minWidth: '15rem',
                  '@md': {
                    minWidth: '10rem',
                  },
                }}
              >
                <Flex
                  // as={NavLink}
                  // to={coLinksPaths.profile(member.profile?.address ?? '')}
                  row
                  css={{
                    alignItems: 'center',
                    gap: '$sm',
                    textDecoration: 'none',
                  }}
                >
                  <Flex column>
                    <Text size="medium">{skill.skill}</Text>
                  </Flex>
                </Flex>
              </GiveLeaderboardColumn>
              <GiveLeaderboardColumn>
                {skill.gives.length}
              </GiveLeaderboardColumn>
            </GiveLeaderboardRow>
          ))}
      </Flex>
    </>
  );
};
