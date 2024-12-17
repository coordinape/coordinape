import { useState } from 'react';

import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { order_by } from '../lib/anongql/__generated__/zeus';
import { anonClient } from '../lib/anongql/anonClient';
import { coLinksPaths } from 'routes/paths';
import { Avatar, Flex, Panel, Text } from 'ui';

import { GiveLeaderboardColumn, GiveLeaderboardRow } from './GiveLeaderboard';
import { rankColumnStyle } from './GiveSkillLeaderboard';

export const GiveSendersLeaderboard = () => {
  const [desc, setDesc] = useState<boolean>(true);

  const toggleSort = () => {
    setDesc(prev => !prev);
  };

  const { data } = useQuery(
    ['give_leaderboard', 'top_senders', desc],
    async () => {
      const ascDesc = desc ? order_by.desc_nulls_last : order_by.asc_nulls_last;

      const { most_give } = await anonClient.query(
        {
          __alias: {
            most_give: {
              profiles_public: [
                {
                  order_by: [
                    {
                      colinks_given_aggregate: {
                        count: ascDesc,
                      },
                    },
                    { name: order_by.asc },
                  ],
                  limit: 100,
                },
                {
                  id: true,
                  name: true,
                  address: true,
                  avatar: true,
                  colinks_given_aggregate: [
                    {},
                    { aggregate: { count: [{}, true] } },
                  ],
                },
              ],
            },
          },
        },
        {
          operationName: 'coLinks_giveLeaderboard_topSenders',
        }
      );

      return most_give.map((profile, index) => ({
        rank: desc ? index + 1 : most_give.length - index,
        profile: profile,
        gives: profile.colinks_given_aggregate?.aggregate?.count ?? 0,
      }));
    }
  );

  return (
    <>
      <Panel noBorder>
        <Flex
          css={{
            width: '100%',
            flexFlow: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Flex
            column
            css={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              mb: '$md',
              borderRadius: '$3',
              background: 'linear-gradient(90deg, $complete 25%, $cta 80%)',
              p: '$md',
              color: '$textOnCta',
              gap: '$xs',
            }}
          >
            <Flex
              css={{
                alignItems: 'center',
                gap: '$xs',
                pb: '$sm',
                borderBottom: '1px solid $black20',
              }}
            >
              <Text
                h2
                display
                css={{
                  color: '$textOnCta',
                }}
              >
                Senders
              </Text>
            </Flex>
            <Text
              size="small"
              css={{
                mt: '$xs',
                height: 'auto',
                color: '$textOnCta',
              }}
            >
              Leaderboard
            </Text>
          </Flex>
          <GiveLeaderboardRow rotateHeader header={true}>
            <GiveLeaderboardColumn onClick={toggleSort} css={rankColumnStyle}>
              Rank
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn
              onClick={toggleSort}
              css={{
                minWidth: '15rem',
                '@md': {
                  minWidth: '12rem',
                },
              }}
            >
              Member
            </GiveLeaderboardColumn>
            <GiveLeaderboardColumn onClick={toggleSort}>
              Total GIVE Sent
            </GiveLeaderboardColumn>
          </GiveLeaderboardRow>
          {data?.map(
            member =>
              member && (
                <GiveLeaderboardRow key={member.rank}>
                  <GiveLeaderboardColumn css={rankColumnStyle}>
                    #{member.rank}
                  </GiveLeaderboardColumn>
                  <GiveLeaderboardColumn
                    css={{
                      minWidth: '15rem',
                      '@md': {
                        minWidth: '12rem',
                      },
                    }}
                  >
                    <Flex
                      as={NavLink}
                      to={coLinksPaths.profileGive(
                        member.profile.address ?? ''
                      )}
                      css={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '$sm',
                        textDecoration: 'none',
                        color: '$text',
                      }}
                    >
                      <Avatar
                        size={'xs'}
                        name={member.profile.name}
                        path={member.profile.avatar}
                      />
                      <Flex column>
                        <Text
                          semibold
                          size="medium"
                          css={{
                            maxWidth: '10rem',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            display: 'inline',
                          }}
                        >
                          {member.profile.name}
                        </Text>
                      </Flex>
                    </Flex>
                  </GiveLeaderboardColumn>
                  <GiveLeaderboardColumn>{member.gives}</GiveLeaderboardColumn>
                </GiveLeaderboardRow>
              )
          )}
        </Flex>
      </Panel>
    </>
  );
};
