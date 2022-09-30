import { useState } from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { useSelectedCircleId } from '../../recoilState';
import { LoadingModal } from 'components';
import { Box, Button, Flex, Modal, Panel, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { ApiKeyDisplay } from './ApiKeyDisplay';
import { ApiKeyForm } from './ApiKeyForm';
import { ApiKeyRow } from './ApiKeyRow';
import { deleteCircleApiKey } from './mutations';
import { useCircleApiKeys } from './useCircleApiKeys';

const AdminCircleApiPage = () => {
  const [modal, setModal] = useState<'' | 'create' | 'display'>('');
  const [keyToDelete, setKeyToDelete] = useState('');
  const [displayedKey, setDisplayedKey] = useState('');

  const queryClient = useQueryClient();

  const circleId = useSelectedCircleId();
  const { refetch, isLoading, data: apiKeys } = useCircleApiKeys(circleId);

  const deleteKeyMutation = useMutation(deleteCircleApiKey, {
    onSuccess: res => {
      // immediately remove key from UI without needing to refetch
      if (res) {
        queryClient.setQueryData<typeof apiKeys>(
          ['circle-api-keys', circleId],
          oldKeys => {
            return oldKeys?.filter(k => k.hash !== res.hash);
          }
        );
      }
    },
    onSettled: () => {
      setKeyToDelete('');
      refetch();
    },
  });

  const displayApiKey = (apiKey: string) => {
    setDisplayedKey(apiKey);
    setModal('display');
  };

  const handleDelete = async () => {
    await deleteKeyMutation.mutate(keyToDelete);
  };

  const closeModal = () => {
    setModal('');
    setDisplayedKey('');
  };

  const closeDeleteDialog = () => {
    setKeyToDelete('');
  };

  if (isLoading) return <LoadingModal visible />;

  return (
    <SingleColumnLayout css={{ maxWidth: '$smallScreen' }}>
      <Box css={{ display: 'flex' }}>
        <Text h2 css={{ flexGrow: 1 }}>
          Circle API Keys
        </Text>
        <Button color="primary" outlined onClick={() => setModal('create')}>
          Create API Key
        </Button>
      </Box>
      {apiKeys && apiKeys?.length > 0 ? (
        apiKeys?.map(apiKey => (
          <ApiKeyRow
            key={apiKey.hash}
            apiKey={apiKey}
            onDelete={setKeyToDelete}
          />
        ))
      ) : (
        <Panel>
          <Text color={'neutral'}>
            There are no API keys for your circle yet.
          </Text>
        </Panel>
      )}
      {modal === 'create' && (
        <Modal onClose={closeModal} title="Create a Circle API Key">
          <ApiKeyForm onSuccess={displayApiKey} />
        </Modal>
      )}
      {modal === 'display' && displayedKey && (
        <Modal onClose={closeModal} title="API Key Created">
          <ApiKeyDisplay apiKey={displayedKey} />
        </Modal>
      )}
      <Modal
        open={!!keyToDelete}
        title={`Delete API Key?`}
        onClose={closeDeleteDialog}
      >
        <Flex column alignItems="start" css={{ gap: '$md' }}>
          <Text p bold>
            Any services using this API key will no longer have access to your
            circle.
          </Text>
          <Button color="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </Flex>
      </Modal>
      <LoadingModal visible={deleteKeyMutation.isLoading} />
    </SingleColumnLayout>
  );
};

export default AdminCircleApiPage;
