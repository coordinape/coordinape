import { useState } from 'react';

import { QUERY_KEY_LOGIN_DATA } from 'features/auth/useLoginData';
import { client } from 'lib/gql/client';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';

import { QUERY_KEY_NAV } from '../../features/nav';
import { LoadingModal } from 'components';
import { QUERY_KEY_MAIN_HEADER } from 'components/MainLayout/getMainHeaderData';
import { useToast } from 'hooks';
import { useFetchManifest } from 'hooks/legacyApi';
import { QUERY_KEY_MY_ORGS } from 'pages/CirclesPage/getOrgData';
import { givePaths } from 'routes/paths';
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
  const fetchManifest = useFetchManifest();

  const deleteCircleMutation = useMutation(
    (circle_id: number) =>
      client.mutate(
        { deleteCircle: [{ payload: { circle_id } }, { success: true }] },
        { operationName: 'deleteCircle' }
      ),
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSuccess: async () => {
        queryClient.invalidateQueries(QUERY_KEY_MY_ORGS);
        queryClient.invalidateQueries(QUERY_KEY_MAIN_HEADER);
        queryClient.invalidateQueries(QUERY_KEY_NAV);
        queryClient.invalidateQueries(QUERY_KEY_LOGIN_DATA);
        await navigate(givePaths.home);
        await fetchManifest();
      },
      onError: err => {
        setIsLoading(false);
        showError(err);
        onClose();
      },
    }
  );

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
            onClick={() => deleteCircleMutation.mutate(circleId)}
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
