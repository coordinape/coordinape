import { useState } from 'react';

import { DateTime } from 'luxon';

import { Avatar, Button, Flex, MarkdownPreview, Modal, Text } from '../../ui';

import { ContributionActivity } from './Contribution';
import { EpochActivity } from './Epoch';
import { UserActivity } from './User';

export interface Activity {
  id: number;
  created_at: string;
  updated_at: string;
  action: string;
  actor_profile?: {
    name?: string;
    avatar?: string;
  };
  target_profile?: {
    name?: string;
    avatar?: string;
  };
  circle?: {
    id?: number;
    name?: string;
  };
  organization: {
    id?: number;
    name?: string;
  };
}

export const ActivityItem = ({ activity }: { activity: Activity }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const closeDrawer = () => {
    setModalOpen(false);
  };

  const propsMarkdown = `\`\`\`json
  ${JSON.stringify(activity, null, '\t')}
  \`\`\``;

  return (
    <Flex column>
      <Flex alignItems="center">
        <Avatar
          css={{ flexShrink: 0 }}
          name={activity.actor_profile?.name}
          path={activity.actor_profile?.avatar}
        />
        <Flex column css={{ flexGrow: 1, ml: '$md' }}>
          <Flex css={{ gap: '$sm' }}>
            <Text variant="label">{activity.actor_profile?.name}</Text>
            <Text semibold color="cta" size="small">
              Action: {activity.action}
            </Text>
            <Text size="small" css={{ color: '$neutral' }}>
              {DateTime.fromISO(activity.created_at).toRelative()}
            </Text>

            <Button
              color="surface"
              size="xs"
              inline
              pill
              onClick={() => setModalOpen(true)}
            >
              show json
            </Button>
            <Modal
              drawer
              showClose={false}
              open={modalOpen}
              onOpenChange={closeDrawer}
            >
              <MarkdownPreview
                render
                css={{
                  p: 0,
                }}
                source={propsMarkdown}
              />
            </Modal>
          </Flex>
        </Flex>
      </Flex>
      <span>
        <Flex row>
          {
            {
              contributions_insert: (
                <ContributionActivity activity={activity} />
              ),
              epochs_insert: <EpochActivity activity={activity} />,
              users_insert: <UserActivity activity={activity} />,
            }[activity.action]
          }
        </Flex>
      </span>
    </Flex>
  );
};
