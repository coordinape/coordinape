/* eslint-disable no-console */
import assert from 'assert';

import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';

import { usePathContext } from '../../routes/usePathInfo';
import { Flex, MarkdownPreview, Text } from '../../ui';
import { paths } from 'routes/paths';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { ReactionBar } from './ReactionBar';
import { Contribution } from './useInfiniteActivities';

export const createReactionMutation = async (
  object: ValueTypes['reactions_insert_input']
) => {
  const { insert_reactions_one } = await client.mutate(
    {
      insert_reactions_one: [
        { object },
        {
          id: true,
          reaction: true,
          profile: {
            name: true,
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'createReaction',
    }
  );
  assert(insert_reactions_one);
  return insert_reactions_one;
};

export const deleteReactionMutation = async (id: number) => {
  await client.mutate(
    {
      delete_reactions: [
        { where: { id: { _eq: id } } },
        {
          affected_rows: true,
        },
      ],
    },
    {
      operationName: 'deleteReaction',
    }
  );
  return id;
};

export const ContributionRow = ({ activity }: { activity: Contribution }) => {
  const { inCircle } = usePathContext();

  return (
    <Flex alignItems="start">
      <ActivityAvatar profile={activity.actor_profile} />
      <Flex column css={{ flexGrow: 1, ml: '$md' }}>
        <Flex css={{ gap: '$sm' }}>
          <ActivityProfileName profile={activity.actor_profile} />
          <Text color="secondary" size="small">
            Contribution
            {!inCircle && ' to'}
          </Text>
          {!inCircle && (
            <Text
              semibold
              inline
              color="cta"
              size="small"
              as={NavLink}
              to={paths.history(activity.circle.id)}
              css={{ textDecoration: 'none' }}
            >
              {activity.circle.name}
            </Text>
          )}
          <Text size="small" css={{ color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>

        <MarkdownPreview
          render
          source={activity.contribution.description}
          css={{ cursor: 'auto' }}
        />
        <ReactionBar activityId={activity.id} reactions={activity.reactions} />
      </Flex>
    </Flex>
  );
};
