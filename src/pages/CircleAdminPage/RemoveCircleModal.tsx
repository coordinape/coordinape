import { useState } from 'react';

import { deleteCircle } from 'lib/gql/mutations';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';

import { LoadingModal } from 'components';
import { useApeSnackbar } from 'hooks';
import { paths } from 'routes/paths';
import { Button, Flex, Modal, Text } from 'ui';
import { normalizeError } from 'utils/reporting';

export const RemoveCircleModal = ({
  onClose,
  visible,
  circleId,
}: {
  onClose: () => void;
  visible: boolean;
  circleId: number;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { showError } = useApeSnackbar();

  const deleteCircleMutation = useMutation(deleteCircle, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('myOrgs');
      queryClient.invalidateQueries('OverviewMenu');
      navigate(paths.circles);
    },
    onError: err => {
      setIsLoading(false);
      showError(normalizeError(err));
      onClose();
    },
  });

  const deleteCircleHandler = async () => {
    await deleteCircleMutation.mutate(circleId);
  };

  if (isLoading) return <LoadingModal visible />;

  return (
    <Modal onClose={onClose} open={visible}>
      <Flex column css={{ gap: '$xl' }}>
        <Text h2 bold>
          Remove Circle?
        </Text>
        <Text size="medium">Are you sure to remove the circle</Text>
        <Flex css={{ gap: '$lg', flexWrap: 'wrap' }}>
          <Button
            size="large"
            color="primary"
            outlined
            css={{ width: '204px' }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={deleteCircleHandler}
            size="large"
            css={{ width: '204px' }}
            color="destructive"
          >
            Remove
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
