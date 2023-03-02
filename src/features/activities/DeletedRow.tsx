import { DateTime } from 'luxon';

import { Flex, MarkdownPreview, Text } from '../../ui';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { Activity } from './useInfiniteActivities';

export const DeletedRow = ({ activity }: { activity: Activity }) => {
  const propsMarkdown = `\`\`\`json
    ${JSON.stringify(activity, null, '\t')}`;
  return (
    <Flex alignItems="center">
      {activity.actor_profile && (
        <ActivityAvatar profile={activity.actor_profile} />
      )}
      <Flex column css={{ flexGrow: 1, ml: '$md' }}>
        <Flex css={{ gap: '$sm' }}>
          {activity.actor_profile && (
            <ActivityProfileName profile={activity.actor_profile} />
          )}
          <Text color="secondary" size="small">
            Deleted Actiivy
          </Text>
          <Text size="small" css={{ color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>

        <MarkdownPreview
          render
          source={propsMarkdown}
          css={{ cursor: 'auto' }}
        />
      </Flex>
    </Flex>
  );
};
