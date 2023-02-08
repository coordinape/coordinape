import { useState } from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { useToast } from 'hooks';
import { Button, Flex, Modal, Text } from 'ui';
import { normalizeError } from 'utils/reporting';

import { QUERY_KEY_ACTIVE_HISTORY } from './getHistoryData';
import { endEpochMutation } from './mutations';

export const EndEpochDialog = ({
  circleId,
  epochId,
  endEpochDialog,
  setEndEpochDialog,
  onClose,
}: {
  circleId: number;
  epochId: number;
  endEpochDialog: boolean;
  setEndEpochDialog: (open: boolean) => void;
  onClose: () => void;
}) => {
  const [submitting, setSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const { showError } = useToast();

  const endEpoch = useMutation(endEpochMutation, {
    onMutate: () => {
      setSubmitting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY_ACTIVE_HISTORY);
      onClose();
    },
    onError: err => {
      setSubmitting(false);
      const error = normalizeError(err);
      showError(error.message);
    },
    onSettled: () => {
      setSubmitting(false);
    },
  });

  return (
    <Modal
      open={!!endEpochDialog}
      title={`End current epoch?`}
      onOpenChange={() => {
        setEndEpochDialog(false);
      }}
    >
      <Flex column alignItems="start" css={{ gap: '$md' }}>
        <Text p>
          Are you sure you wish to end the current epoch? This cannot be undone.
        </Text>
        <Flex css={{ width: '100%', gap: '$lg', mt: '$md' }}>
          <Button
            onClick={() => {
              setEndEpochDialog(false);
            }}
            color="secondary"
            size="large"
            css={{ width: '50%' }}
          >
            Cancel
          </Button>
          <Button
            color="destructive"
            size="large"
            css={{ width: '50%' }}
            onClick={async () => {
              await endEpoch.mutate({
                id: epochId,
                circle_id: circleId,
              });
            }}
          >
            {submitting ? 'Saving...' : 'End Epoch'}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
