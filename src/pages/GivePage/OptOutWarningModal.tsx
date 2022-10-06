import React from 'react';

import { Button, Flex, Modal, Text } from '../../ui';

type OptOutWarningModalProps = {
  optOutOpen: boolean;
  setOptOutOpen(open: boolean): void;
  updateNonReceiver(nonReceiver: boolean): void;
  tokenName: string;
  give_token_received: number;
};

export const OptOutWarningModal = ({
  optOutOpen,
  setOptOutOpen,
  tokenName,
  give_token_received,
  updateNonReceiver,
}: OptOutWarningModalProps) => {
  return (
    <Modal
      onClose={() => setOptOutOpen(false)}
      open={optOutOpen}
      // onOpenChange={setModal}
      title={`${tokenName} Loss Alert`}
    >
      <Flex column alignItems="start" css={{ gap: '$md' }}>
        <Text p bold>
          {`If you Opt Out you will lose your ${give_token_received} ${tokenName}`}
        </Text>
        <Text p>
          Opting out during an in-progress epoch will result in any {tokenName}{' '}
          you have received being returned to senders. Are you sure you wish to
          proceed? This cannot be undone.
        </Text>
        <Flex css={{ gap: '$lg', flexWrap: 'wrap' }}>
          <Button
            size="large"
            color="primary"
            outlined
            // css={{ width: '204px' }}
            onClick={() => setOptOutOpen(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateNonReceiver(true);
              setOptOutOpen(false);
            }}
            size="large"
            // css={{ width: '204px' }}
            color="destructive"
          >
            Proceed to Opt Out
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
