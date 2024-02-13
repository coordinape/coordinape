import { useState } from 'react';

import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { OgPostImage } from '../../../_api/og/postimage/OgPostImage';
import CopyCodeTextField from 'components/CopyCodeTextField';
import { webAppURL } from 'config/webAppURL';
import { coLinksPaths } from 'routes/paths';
import { Flex, Modal, Text } from 'ui';

import { Contribution } from './useInfiniteActivities';

export const SharePostModal = ({
  children,
  activityId,
  activity,
}: {
  children: React.ReactNode;
  activityId: number;
  activity: Contribution;
}) => {
  const genShareLink = async (activityId: number) => {
    return await client.mutate(
      {
        share: [
          {
            payload: { activity_id: activityId },
          },
          {
            token: true,
          },
        ],
      },
      { operationName: 'genShareLink__sharePostModal' }
    );
  };

  const { data, isLoading } = useQuery(
    ['post_share_token', activityId],
    () => genShareLink(activityId),
    {
      onError: error => {
        console.error(error);
      },
    }
  );

  const [editEmail, setEditEmail] = useState(false);
  return (
    <>
      <Flex color="primary" onClick={() => setEditEmail(true)}>
        {children}
      </Flex>
      {editEmail && (
        <Modal onOpenChange={() => setEditEmail(false)} open={true}>
          <Flex column css={{ gap: '$sm' }}>
            <Text h2>Share your post</Text>
            <Text p>
              Use this unique link to share a preview of your post outside of
              CoLinks.
            </Text>
            <Flex css={{ mt: '$sm', mb: '$md' }}>
              {isLoading ? (
                'loading ...'
              ) : (
                <CopyCodeTextField
                  value={`${webAppURL('colinks')}${coLinksPaths.post(activityId.toString())}?${data?.share?.token}`}
                />
              )}
            </Flex>
            <Text variant="label">Example display</Text>
            <Flex css={{ borderRadius: '$3', overflow: 'clip' }}>
              <OgPostImage
                description={activity.contribution.description}
                name={activity.actor_profile_public.name}
                avatar={activity.actor_profile_public.avatar}
                links={99}
                rep={99}
                scale={1}
              />
            </Flex>
          </Flex>
        </Modal>
      )}
    </>
  );
};
