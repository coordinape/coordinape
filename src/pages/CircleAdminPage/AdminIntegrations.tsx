import { useCallback, useState } from 'react';

import { useCircleIntegrations } from 'hooks/gql/useCircleIntegrations';
import {
  Dework,
  DeworkColor,
  Parcel,
  Trash2,
  Wonder,
  WonderColor,
} from 'icons/__generated';
import { givePaths } from 'routes/paths';
import { Flex, Button, Text, HR, Modal } from 'ui';

import { deleteCircleIntegration } from './mutations';

export const AdminIntegrations = ({ circleId }: { circleId: number }) => {
  const integrations = useCircleIntegrations(circleId);
  const [deleteIntegration, setDeleteIntegration] =
    useState<Exclude<(typeof integrations)['data'], undefined>[number]>();

  const handleDeleteIntegration = useCallback(async () => {
    if (deleteIntegration) {
      await deleteCircleIntegration(deleteIntegration.id);
      await integrations.refetch();
      setDeleteIntegration(undefined);
    }
  }, [integrations.refetch, deleteIntegration]);

  const redirectUri = (): string => {
    if (typeof window !== `undefined`) {
      // this case will always be true until we move to nextjs
      return `${window.location.origin}${givePaths.connectIntegration(
        circleId
      )}`;
    }
    // TODONEXT: this needs to useRouter
    return `fix-me-later-${givePaths.connectIntegration(circleId)}`;
  };
  const deworkIntegrations = integrations?.data?.filter(integration => {
    return integration.type === 'dework';
  });
  const wonderIntegrations = integrations?.data?.filter(integration => {
    return integration.type === 'wonder';
  });

  return (
    <div>
      <Flex column alignItems="start" css={{ mb: '$lg' }}>
        <Text large semibold css={{ mb: '$md' }}>
          Dework Integration
        </Text>
        <Flex
          column
          css={{
            mb: deworkIntegrations?.length ? '$md' : 0,
            width: '100%',
          }}
        >
          {deworkIntegrations?.map((integration, index) => (
            <Flex
              key={index}
              css={{
                justifyContent: 'space-between',
                pl: '$xs',
                mb: '$xs',
                '&:hover': {
                  backgroundColor: '$surface',
                },
              }}
            >
              <Text>
                <DeworkColor css={{ mr: '$xs' }} />
                <Text>{integration.name}</Text>
              </Text>
              <Button
                type="button"
                onClick={() => setDeleteIntegration(integration)}
                size="small"
                color="textOnly"
              >
                <Trash2 size="md" color="inherit" />
              </Button>
            </Flex>
          ))}
        </Flex>
        <Button
          as="a"
          color="secondary"
          href={`https://app.dework.xyz/apps/install/coordinape?redirect=${redirectUri()}`}
        >
          <Flex css={{ mr: '$sm' }}>
            <Dework nostroke />
          </Flex>
          Add Dework Connection
        </Button>
      </Flex>
      <HR />
      <Flex column alignItems="start" css={{ mb: '$lg' }}>
        <Text large semibold css={{ mb: '$md' }}>
          Wonderverse Integration
        </Text>
        <Flex
          column
          css={{
            mb: wonderIntegrations?.length ? '$md' : 0,
            width: '100%',
          }}
        >
          {wonderIntegrations?.map((integration, index) => (
            <Flex
              key={index}
              css={{
                justifyContent: 'space-between',
                pl: '$xs',
                mb: '$xs',
                '&:hover': {
                  backgroundColor: '$surface',
                },
              }}
            >
              <Text>
                <WonderColor css={{ mr: '$xs', height: 24, width: 24 }} />
                <Text>{integration.name}</Text>
              </Text>
              <Button
                type="button"
                onClick={() => setDeleteIntegration(integration)}
                size="small"
                color="textOnly"
              >
                <Trash2 size="md" color="inherit" />
              </Button>
            </Flex>
          ))}
        </Flex>
        <Button
          as="a"
          color="secondary"
          href={`https://app.wonderverse.xyz/apps/install/coordinape?circleId=${circleId}&redirect=${redirectUri()}`}
        >
          <Flex css={{ mr: '$sm' }}>
            <Wonder />
          </Flex>
          Add Wonderverse Connection
        </Button>
      </Flex>
      <HR />
      <Flex column alignItems="start">
        <Text large semibold css={{ mb: '$md' }}>
          Parcel
        </Text>
        <Button
          as="a"
          color="secondary"
          href={
            'https://docs.coordinape.com/get-started/compensation/paying-your-team/parcel'
          }
        >
          <Flex css={{ mr: '$sm' }}>
            <Parcel />
          </Flex>
          Pay with Parcel
        </Button>
      </Flex>
      <Modal
        open={!!deleteIntegration}
        title={`Remove ${deleteIntegration?.name} from circle`}
        onOpenChange={() => setDeleteIntegration(undefined)}
      >
        <Flex column alignItems="start" css={{ gap: '$md' }}>
          <Button
            color="destructive"
            onClick={deleteIntegration ? handleDeleteIntegration : undefined}
          >
            Remove Integration
          </Button>
        </Flex>
      </Modal>
      <HR />
    </div>
  );
};
