import { useState } from 'react';

import { deleteCircle } from 'lib/gql/mutations';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';

import { InvalidateSideNav } from '../../features/nav';
import { LoadingModal } from 'components';
import { QUERY_KEY_MAIN_HEADER } from 'components/MainLayout/getMainHeaderData';
import { useToast, useApiBase } from 'hooks';
import { QUERY_KEY_MY_ORGS } from 'pages/CirclesPage/getOrgData';
import { paths } from 'routes/paths';
import { Button, Flex, Modal, Text } from 'ui';

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
  const { showError } = useToast();
  const { fetchManifest, unselectCircle } = useApiBase();

  const deleteCircleMutation = useMutation(deleteCircle, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries(QUERY_KEY_MY_ORGS);
      queryClient.invalidateQueries(QUERY_KEY_MAIN_HEADER);
      InvalidateSideNav(queryClient);
      await navigate(paths.circles);
      await unselectCircle();
      await fetchManifest();
    },
    onError: err => {
      setIsLoading(false);
      showError(err);
      onClose();
    },
  });

  const deleteCircleHandler = async () => {
    await deleteCircleMutation.mutate(circleId);
  };

  if (isLoading) return <LoadingModal visible />;

  return (
    <Modal onOpenChange={onClose} open={visible}>
      <Flex column css={{ gap: '$xl' }}>
        <Text h2 bold>
          Remove Circle?
        </Text>
        <Text size="medium">Are you sure to remove the circle</Text>
        <Flex css={{ gap: '$lg', flexWrap: 'wrap' }}>
          <Button
            size="large"
            color="secondary"
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
