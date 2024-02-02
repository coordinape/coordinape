import { useState } from 'react';

import CopyCodeTextField from 'components/CopyCodeTextField';
import { Flex, Modal, Text } from 'ui';

export const SharePostModal = ({
  children,
  activityId,
}: {
  children: React.ReactNode;
  activityId: number;
}) => {
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
              <CopyCodeTextField
                value={`https://colinks.xyz/post/${activityId}/zzzspecialcodezzz`}
              />
            </Flex>
          </Flex>
        </Modal>
      )}
    </>
  );
};
