import { useEffect } from 'react';

import { client } from 'lib/gql/client';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';

import { usePathContext } from '../../routes/usePathInfo';
import { Flex, MarkdownPreview, Text } from '../../ui';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { CircleLogoWithName } from './CircleLogoWithName';
import { ReactionBar } from './reactions/ReactionBar';
import { Contribution } from './useInfiniteActivities';

const QUERY_KEY_CONTRIBUTION_ROW_EPOCH_DATA = 'getContributionRowEpochData';

export const ContributionRow = ({
  activity,
  drawer,
}: {
  activity: Contribution;
  drawer?: boolean;
}) => {
  const { inCircle } = usePathContext();
  const circleId: number = activity.circle.id;
  const { data, isLoading } = useQuery(
    [QUERY_KEY_CONTRIBUTION_ROW_EPOCH_DATA, circleId],
    () => {
      return client.query(
        {
          epochs: [
            {
              where: {
                circle_id: { _eq: circleId },
                end_date: { _gt: 'now()' },
                start_date: { _lt: 'now()' },
              },
            },
            { id: true, start_date: true },
          ],
        },
        {
          operationName: 'getContributionRowCurrentEpoch',
        }
      );
    },
    {
      enabled: !!circleId,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log({ data });
    // eslint-disable-next-line no-console
    console.log({ isLoading });
  }, [data]);

  return (
    <Flex css={{ overflowX: 'clip' }}>
      <Flex
        className="contributionRow"
        alignItems="start"
        css={{
          background: drawer ? '$dim' : '$surface',
          p: drawer ? '$sm 0 $md 0' : '$md',
          borderRadius: '$2',
          flexGrow: 1,
        }}
      >
        {!drawer && <ActivityAvatar profile={activity.actor_profile} />}
        <Flex column css={{ flexGrow: 1, ml: '$md' }}>
          <Flex
            css={{
              gap: '$sm',
              justifyContent: 'space-between',
            }}
          >
            {!drawer && (
              <Flex>
                <ActivityProfileName profile={activity.actor_profile} />
                <Text size="small" css={{ color: '$neutral', ml: '$md' }}>
                  {DateTime.fromISO(activity.created_at).toRelative()}
                </Text>
              </Flex>
            )}
            {!inCircle && (
              <CircleLogoWithName
                circle={activity.circle}
                reverse={drawer ? false : true}
              />
            )}
          </Flex>
          <MarkdownPreview
            render
            source={activity.contribution.description}
            css={{ cursor: 'auto', mt: '$sm' }}
          />
          <ReactionBar
            activityId={activity.id}
            reactions={activity.reactions}
            drawer={drawer}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
