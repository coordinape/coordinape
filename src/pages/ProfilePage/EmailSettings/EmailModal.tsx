import { useState } from 'react';

import isFeatureEnabled from 'config/features';
import { Flex, Modal, Text } from 'ui';

import { EditEmailForm } from './EditEmailForm';

export const EmailModal = ({ children }: { children: React.ReactNode }) => {
  const [editEmail, setEditEmail] = useState(false);
  return (
    <>
      {isFeatureEnabled('email') && (
        <>
          <Flex color="primary" onClick={() => setEditEmail(true)}>
            {children}
          </Flex>
          {editEmail && (
            <Modal onOpenChange={() => setEditEmail(false)} open={true}>
              <Text h2 css={{ mb: '$sm' }}>
                Email Addresses
              </Text>
              <EditEmailForm />
            </Modal>
          )}
        </>
      )}
    </>
  );
};
