import { easAttestUrl } from 'features/eas/eas';
import { anonClient } from 'lib/anongql/anonClient';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { order_by } from '../../lib/anongql/__generated__/zeus';
import { ActivityRow } from '../activities/ActivityRow';
import { Activity } from '../activities/useInfiniteActivities';
import { webAppURL } from 'config/webAppURL';
import { ExternalLink } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Flex, Link, Text } from 'ui';

const QUERY_KEY_RECENT_GIVES = 'recentGives';

export const RecentGives = ({ skill }: { skill: string }) => {
  const fetchCastActivities = async (hashes: string[]) => {
    const res = await fetch('/api/farcaster/casts/hashes', {
      method: 'POST',
      body: JSON.stringify({ cast_hashes: hashes }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
            limit: 10,
          },
          {
            attestation_uid: true,
            created_at: true,
            id: true,
            cast_hash: true,
            giver_profile_public: { address: true },
            target_profile_public: { address: true },
          },
        ],
      },
      {
        operationName: 'coLinks_recent_gives @cached(ttl: 30)',
      }
    );

    // await fetchCasts(
    //   colinks_gives.map((give): string | undefined => give.cast_hash)
    // );
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
    <Flex column css={{ gap: '$md', my: '$lg' }}>
      <Text h2>Recent Gives</Text>
      <Flex css={{ flexWrap: 'wrap', columnGap: '2.5%' }}>
        {data?.map(give => (
          <Flex column key={give.id}>
            {give.activity?.cast && (
              <Flex column>
                <h1>HELLOOOOOO</h1>
                <ActivityRow activity={give.activity} />
              </Flex>
            )}
            <Flex
              css={{
                position: 'relative',
                width: '48.75%',
              }}
            >
              <Flex
                css={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                }}
              >
                <Link
                  as={NavLink}
                  to={coLinksPaths.profileGive(
                    give.giver_profile_public?.address ?? ''
                  )}
                  css={{ width: '50%' }}
                >
                  &nbsp;
                </Link>
                <Link
                  as={NavLink}
                  to={coLinksPaths.profileGive(
                    give.target_profile_public?.address ?? ''
                  )}
                  css={{ width: '50%' }}
                >
                  &nbsp;
                </Link>
              </Flex>
              <Flex
                column
                css={{
                  img: {
                    width: '100%',
                    height: '100%',
                  },
                }}
              >
                <img
                  src={`${webAppURL('colinks')}/api/frames/router/img/give/${give.id}`}
                  alt="test"
                />
                <Flex
                  css={{
                    justifyContent: 'space-between',
                    width: '100%',
                    p: '$xs 0',
                    zIndex: 2,
                  }}
                >
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
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
