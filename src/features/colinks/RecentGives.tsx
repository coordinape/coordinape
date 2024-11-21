import { easAttestUrl } from 'features/eas/eas';
import { anonClient } from 'lib/anongql/anonClient';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { order_by } from '../../lib/anongql/__generated__/zeus';
import { ActivityRow } from '../activities/ActivityRow';
import { Activity } from '../activities/useInfiniteActivities';
import { webAppURL } from 'config/webAppURL';
import { ArrowRight, ExternalLink, GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Flex, Link, Text } from 'ui';
import { LightboxImage } from 'ui/MarkdownPreview/LightboxImage';

const QUERY_KEY_RECENT_GIVES = 'recentGives';

export const RecentGives = ({
  skill,
  limit = 10,
}: {
  skill: string;
  limit?: number;
}) => {
  const fetchCastActivities = async (hashes: string[]) => {
    const res = await fetch(
      `/api/farcaster/casts/hashes?hashes=${encodeURIComponent(JSON.stringify(hashes))}`
    );
    const data: { activities: Activity[] } = await res.json();
    return data.activities;
  };

  const { data } = useQuery([QUERY_KEY_RECENT_GIVES, skill], async () => {
    const { colinks_gives } = await anonClient.query(
      {
        colinks_gives: [
          {
            where: { skill: { _eq: skill } },
            order_by: [{ created_at: order_by.desc_nulls_last }],
            limit: limit,
          },
          {
            attestation_uid: true,
            created_at: true,
            id: true,
            cast_hash: true,
            skill: true,
            giver_profile_public: { address: true, name: true },
            target_profile_public: { address: true, name: true },
          },
        ],
      },
      {
        operationName: 'coLinks_recent_gives @cached(ttl: 30)',
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
  });

  return (
    <Flex column css={{ gap: '$md', mb: '$lg' }}>
      <Flex css={{ flexWrap: 'wrap', columnGap: '2.5%' }}>
        {data?.map(give => (
          <Flex column key={give.id} css={{ width: '100%', mb: '$md' }}>
            <Flex
              css={{
                background: '$surface',
                width: '100%',
                borderRadius: '$3',
                p: '$sm',
                ...(give.activity?.cast && {
                  background: '$surfaceNestedFarcaster',
                  mb: -3,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  zIndex: 2,
                }),
              }}
            >
              <Flex
                css={{
                  gap: '$md',
                }}
              >
                <Flex>
                  <LightboxImage
                    key={`${webAppURL('colinks')}/api/frames/router/img/give/${give.id}`}
                    alt={
                      `${webAppURL('colinks')}/api/frames/router/img/give/${give.id}` ||
                      ''
                    }
                    src={
                      `${webAppURL('colinks')}/api/frames/router/img/give/${give.id}` ||
                      ''
                    }
                    css={{
                      width: 64,
                      height: 64,
                      borderRadius: '$1',
                    }}
                  />
                </Flex>
                <Flex
                  column
                  css={{
                    justifyContent: 'center',
                    width: '100%',
                    gap: '$xs',
                    zIndex: 2,
                  }}
                >
                  <Flex
                    css={{ gap: '$xs', alignItems: 'center', flexWrap: 'wrap' }}
                  >
                    <Link
                      inlineLink
                      as={NavLink}
                      css={{ fontWeight: '$semibold', color: '$text' }}
                      to={coLinksPaths.profileGive(
                        give.giver_profile_public?.address ?? ''
                      )}
                    >
                      {give.giver_profile_public?.name ?? ''}
                    </Link>
                    <Link
                      as={NavLink}
                      to={coLinksPaths.exploreSkill(give.skill)}
                    >
                      <Text
                        tag
                        color="complete"
                        size="small"
                        css={{ gap: '$xs', ml: '$xs' }}
                      >
                        <Text size="small" css={{ fontWeight: 'normal' }}>
                          +1
                        </Text>
                        <GemCoOutline fa size={'md'} />
                        <Text css={skillTextStyle}>{give.skill}</Text>
                      </Text>
                    </Link>
                    <ArrowRight color="neutral" />
                    <Link
                      inlineLink
                      as={NavLink}
                      css={{ fontWeight: '$semibold', color: '$text' }}
                      to={coLinksPaths.profileGive(
                        give.target_profile_public?.address ?? ''
                      )}
                    >
                      {give.target_profile_public?.name ?? ''}
                    </Link>
                  </Flex>
                  <Text size="xs" color="neutral">
                    {DateTime.fromISO(give.created_at).toLocal().toRelative()}
                  </Text>
                  {give.attestation_uid && (
                    <>
                      <Text size="xs">
                        <Link
                          inlineLink
                          href={easAttestUrl(give.attestation_uid as string)}
                          css={{
                            display: 'flex',
                            alignItems: 'center',
                            color: '$neutral',
                          }}
                          target="_blank"
                          rel="noreferrer"
                        >
                          onchain
                          <ExternalLink size="sm" css={{ ml: '$xs' }} />
                        </Link>
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
            </Flex>
            {give.activity?.cast && <ActivityRow activity={give.activity} />}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
