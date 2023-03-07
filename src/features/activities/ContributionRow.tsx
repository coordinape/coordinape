/* eslint-disable no-console */
import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';
import { DateTime } from 'luxon';
import { useMutation } from 'react-query';
import { NavLink } from 'react-router-dom';

import { Button } from '@material-ui/core';

import { usePathContext } from '../../routes/usePathInfo';
import { Flex, MarkdownPreview, Text } from '../../ui';
import { paths } from 'routes/paths';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { Contribution, Reactions } from './useInfiniteActivities';

export const createReactionMutation = async (
  object: ValueTypes['reactions_insert_input']
) => {
  return client.mutate(
    {
      insert_reactions_one: [
        { object },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'createReaction',
    }
  );
};

export const ContributionRow = ({ activity }: { activity: Contribution }) => {
  const { inCircle } = usePathContext();

  const { mutate: createReaction } = useMutation(createReactionMutation, {
    onSuccess: newReaction => {
      console.log('success', newReaction);
    },
  });

  const toggleReaction = () => {
    createReaction({ activity_id: activity.id, reaction: '🌂' });
  };

  return (
    <Flex alignItems="center">
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
      </Flex>
      <Flex>
        <ReactionsWidget reactions={activity.reactions} />

        {activity.reactions.length == 0 && (
          <Button onClick={toggleReaction}>
            <span role="img" aria-label="point-up">
              ☝
            </span>
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export const ReactionsWidget = ({ reactions }: { reactions: Reactions }) => {
  return (
    <Flex>
      {reactions.map(r => (
        <Text key={r.id}>Reaction {r.reaction}</Text>
      ))}
    </Flex>
  );
};
