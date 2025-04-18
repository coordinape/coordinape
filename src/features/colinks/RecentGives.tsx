import { anonClient } from 'lib/anongql/anonClient';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { order_by } from '../../lib/anongql/__generated__/zeus';
import { ActivityRow } from '../activities/ActivityRow';
import { Activity } from '../activities/useInfiniteActivities';
import { webAppURL } from 'config/webAppURL';
import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Avatar, Flex, Link, Text } from 'ui';
import { LightboxImage } from 'ui/MarkdownPreview/LightboxImage';

const QUERY_KEY_RECENT_GIVES = 'recentGives';

type GivesProps = {
  address?: string;
  skill?: string;
  receivedGives?: boolean;
  limit?: number;
};

export const RecentGives = ({
  address,
  skill,
  receivedGives = false,
  limit = 10,
}: GivesProps) => {
  const fetchCastActivities = async (hashes: string[]) => {
    const res = await fetch(
      `/api/farcaster/casts/hashes?hashes=${encodeURIComponent(JSON.stringify(hashes))}`
    );
    const data: { activities: Activity[] } = await res.json();
    return data.activities;
  };

  const { data } = useQuery(
    [QUERY_KEY_RECENT_GIVES, address, skill, receivedGives],
    async () => {
      const whereClause = {
        ...(address
          ? {
              [receivedGives
                ? 'target_profile_public'
                : 'giver_profile_public']: {
                address: { _eq: address },
              },
            }
          : {}),
        ...(skill ? { skill: { _eq: skill } } : {}),
      };

      const { colinks_gives } = await anonClient.query(
        {
          colinks_gives: [
            {
              where: whereClause,
              order_by: [{ created_at: order_by.desc_nulls_last }],
              limit: limit,
            },
            {
              attestation_uid: true,
              created_at: true,
              id: true,
              cast_hash: true,
              skill: true,
              updated_at: true,
              giver_profile_public: { address: true, name: true, avatar: true },
              target_profile_public: {
                address: true,
                name: true,
                avatar: true,
              },
            },
          ],
        },
        {
          operationName: 'coLinks_gives @cached(ttl: 30)',
        }
      );

      const hashes: string[] = colinks_gives
        .filter(give => give.cast_hash)
        .map((give): string => give.cast_hash ?? '');

      const castActivities = await fetchCastActivities(hashes);
      const givesWithCastActivities: ((typeof colinks_gives)[number] & {
        activity: Activity | undefined;
      })[] = [];

      for (const give of colinks_gives) {
        const g = {
          ...give,
          activity: castActivities.find(
            a => a?.cast && a.cast?.hash === give.cast_hash
          ),
        };
        givesWithCastActivities.push(g);
      }
      return givesWithCastActivities;
    }
  );

  return (
    <Flex column css={{ gap: '$md', maxWidth: '$maxMobile' }}>
      <Flex css={{ flexWrap: 'wrap', columnGap: '2.5%' }}>
        {data?.map(give => (
          <Flex column key={give.id} css={{ width: '100%', mb: '$md' }}>
            <Flex
              css={{
                background: '$surface',
                width: '100%',
                alignItems: 'center',
                p: '$sm',
                flex: 1,
                borderRadius: '$2',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                position: 'relative',
                ...(give.activity?.cast && {
                  background: '$surfaceNestedFarcaster',
                  zIndex: 2,
                }),
              }}
            >
              <Link
                as={NavLink}
                css={{
                  fontWeight: '$semibold',
                  color: '$text',
                  display: 'flex',
                  flexGrow: 1,
                  flex: 1,
                  justifyContent: 'flex-start',
                  overflow: 'hidden',
                }}
                to={coLinksPaths.profileGive(
                  give.giver_profile_public?.address ?? ''
                )}
              >
                <Avatar
                  path={give.giver_profile_public?.avatar}
                  name={give.giver_profile_public?.name}
                  size="xxs"
                  css={{ mr: '$xs' }}
                />
                <Flex
                  css={{
                    flexGrow: 1,
                    flex: 1,
                    justifyContent: 'flex-start',
                    overflow: 'hidden',
                  }}
                >
                  <Text
                    semibold
                    size="small"
                    css={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      maxWidth: '4rem',
                      overflow: 'hidden',
                      display: 'inline',
                    }}
                  >
                    {give.giver_profile_public?.name ?? ''}
                  </Text>
                </Flex>
              </Link>
              <Link
                as={NavLink}
                to={coLinksPaths.giveSkill(give.skill)}
                css={{
                  display: 'flex',
                  flexGrow: 1,
                  flex: 1,
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flex
                  row
                  css={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text
                    tag
                    size="small"
                    css={{
                      gap: '$xs',
                      color: '$lightText',
                    }}
                  >
                    <Text semibold size="small">
                      +1
                    </Text>
                    <GemCoOutline fa size={'md'} />
                    <Text
                      semibold
                      css={{ ...skillTextStyle, maxWidth: '6rem' }}
                    >
                      {give.skill}
                    </Text>
                  </Text>
                </Flex>
                <Text css={{ fontSize: '$xs', color: '$lightText' }}>
                  {DateTime.fromISO(give.created_at).toRelative()}
                </Text>
              </Link>
              <Link
                as={NavLink}
                css={{
                  fontWeight: '$semibold',
                  color: '$text',
                  display: 'flex',
                  flexGrow: 1,
                  flex: 1,
                  justifyContent: 'flex-end',
                  overflow: 'hidden',
                }}
                to={coLinksPaths.profileGive(
                  give.target_profile_public?.address ?? ''
                )}
              >
                <Flex
                  css={{
                    flexGrow: 1,
                    flex: 1,
                    justifyContent: 'flex-end',
                    overflow: 'hidden',
                  }}
                >
                  <Text
                    semibold
                    size="small"
                    css={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      maxWidth: '4rem',
                      overflow: 'hidden',
                      display: 'inline',
                    }}
                  >
                    {give.target_profile_public?.name ?? ''}
                  </Text>
                </Flex>
                <Avatar
                  path={give.target_profile_public?.avatar}
                  name={give.target_profile_public?.name}
                  size="xxs"
                  css={{ ml: '$xs' }}
                />
              </Link>
            </Flex>
            <Flex
              css={{
                background: 'linear-gradient(90deg, $complete 25%, $cta 80%)',
                ...(!give.activity?.cast && {
                  borderBottomLeftRadius: '$2',
                  borderBottomRightRadius: '$2',
                  overflow: 'clip',
                }),
              }}
            >
              <LightboxImage
                key={give.id}
                alt={`Image for give ID: ${give.id}`}
                src={`${webAppURL('colinks')}/api/frames/router/img/give/${give.id}?ts=${DateTime.fromISO(give.updated_at).toMillis()}`}
                css={{
                  width: '100%',
                  aspectRatio: '3/1.9',
                }}
              />
            </Flex>

            <Flex
              css={{
                '.lightboxImageWrapper': { maxWidth: 100 },
                '.contributionRow': {
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                },
              }}
            >
              {give.activity?.cast && <ActivityRow activity={give.activity} />}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
