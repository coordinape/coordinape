import React, { useState } from 'react';

import { useMutation, useQueryClient } from 'react-query';

import { ExternalLink } from '../../../icons/__generated';
import { useSelectedCircleId } from '../../../recoilState';
import { getConsoleUrl } from '../../../utils/apiKeyHelper';
import { LoadingModal } from 'components';
import { Button, Flex, Modal, Text } from 'ui';

import { ApiKeyDisplay } from './ApiKeyDisplay';
import { ApiKeyForm } from './ApiKeyForm';
import { ApiKeyRow } from './ApiKeyRow';
import { deleteCircleApiKey } from './mutations';
import { useCircleApiKeys } from './useCircleApiKeys';

export const CircleApiKeys: React.FC = () => {
  const [modal, setModal] = useState<'' | 'create' | 'display'>('');
  const [keyToDelete, setKeyToDelete] = useState('');
  const [displayedKey, setDisplayedKey] = useState('');
  const circleId = useSelectedCircleId();

  const queryClient = useQueryClient();

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

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      setModal('');
      setDisplayedKey('');
    }
  };

  const closeDeleteDialog = () => {
    setKeyToDelete('');
  };

  const consoleUrl = getConsoleUrl();
  const hasApiKeys = apiKeys && apiKeys.length > 0;

  if (isLoading) return <LoadingModal visible />;

  return (
    <div>
      <Flex css={{ flexDirection: 'column' }}>
        {hasApiKeys ? (
          apiKeys?.map(apiKey => (
            <ApiKeyRow
              key={apiKey.hash}
              apiKey={apiKey}
              onDelete={setKeyToDelete}
            />
          ))
        ) : (
          <Text color={'neutral'} css={{ mb: '$lg', mt: '$sm' }}>
            There are no API keys for your circle yet.
          </Text>
        )}
      </Flex>

      <Flex css={{ gap: '$md' }}>
        <Button
          color="primary"
          outlined
          onClick={e => {
            e.preventDefault();
            setModal('create');
          }}
        >
          Create API Key
        </Button>
        {hasApiKeys ? (
          <Button
            color="neutral"
            as={'a'}
            outlined
            href={consoleUrl}
            rel="noreferrer"
            target="_blank"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink />
            GraphQL Explorer
          </Button>
        ) : null}
      </Flex>

      <Modal
        onOpenChange={handleModalOpenChange}
        open={modal === 'create'}
        title="Create a Circle API Key"
      >
        <ApiKeyForm circleId={circleId} onSuccess={displayApiKey} />
      </Modal>
      <Modal
        onOpenChange={handleModalOpenChange}
        open={Boolean(modal === 'display' && displayedKey)}
        title="API Key Created"
      >
        <ApiKeyDisplay apiKey={displayedKey} />
      </Modal>
      <Modal
        open={!!keyToDelete}
        title={`Delete API Key?`}
        onOpenChange={closeDeleteDialog}
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
    </div>
  );
};
