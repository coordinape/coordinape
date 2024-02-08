import { useState } from 'react';

import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import CopyCodeTextField from 'components/CopyCodeTextField';
import { webAppURL } from 'config/webAppURL';
import { coLinksPaths } from 'routes/paths';
import { Flex, Modal, Text } from 'ui';

export const SharePostModal = ({
  children,
  activityId,
}: {
  children: React.ReactNode;
  activityId: number;
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
              Use this unique link to share your post publicly with anyone.
            </Text>
            <Flex css={{ mt: '$sm' }}>
              {isLoading ? (
                'loading ...'
              ) : (
                <CopyCodeTextField
                  value={`${webAppURL('colinks')}${coLinksPaths.post(activityId.toString())}?${data?.share?.token}`}
                />
              )}
            </Flex>
          </Flex>
        </Modal>
      )}
    </>
  );
};
