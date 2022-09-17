import React, { useCallback, useState } from 'react';

import * as mutations from 'lib/gql/mutations';

import { ActionDialog } from 'components';
import { useCurrentCircleIntegrations } from 'hooks/gql/useCurrentCircleIntegrations';
import { Dework, DeworkColor, Parcel, Trash2 } from 'icons/__generated';
import { paths } from 'routes/paths';
import { Flex, Button, Text, HR } from 'ui';

export const AdminIntegrations = ({ circleId }: { circleId: number }) => {
  const integrations = useCurrentCircleIntegrations();
  const [deleteIntegration, setDeleteIntegration] =
    useState<Exclude<typeof integrations['data'], undefined>[number]>();

  const handleDeleteIntegration = useCallback(async () => {
    if (deleteIntegration) {
      await mutations.deleteCircleIntegration(deleteIntegration.id);
      await integrations.refetch();
      setDeleteIntegration(undefined);
    }
  }, [integrations.refetch, deleteIntegration]);

  const redirectUri = (): string => {
    if (typeof window !== `undefined`) {
      // this case will always be true until we move to nextjs
      return `${window.location.origin}${paths.connectIntegration(circleId)}`;
    }
    // TODONEXT: this needs to useRouter
    return `fix-me-later-${paths.connectIntegration(circleId)}`;
  };
  return (
    <div>
      <Flex css={{ mb: '$lg', flexDirection: 'column', alignItems: 'start' }}>
        <Text h3 semibold css={{ mb: '$md' }}>
          Dework Integration
        </Text>
        <Flex
          css={{
            mb: integrations.data?.length ? '$md' : 0,
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {integrations.data?.map((integration, index) => (
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
          color="primary"
          outlined
          href={`https://app.dework.xyz/apps/install/coordinape?redirect=${redirectUri()}`}
        >
          <Flex css={{ mr: '$sm' }}>
            <Dework nostroke />
          </Flex>
          Add Dework Connection
        </Button>
      </Flex>
      <HR />
      <Flex css={{ flexDirection: 'column', alignItems: 'start' }}>
        <Text h3 semibold css={{ mb: '$md' }}>
          Parcel
        </Text>
        <Button
          as="a"
          color="primary"
          outlined
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

      <ActionDialog
        open={!!deleteIntegration}
        title={`Remove ${deleteIntegration?.name} from circle`}
        onClose={() => setDeleteIntegration(undefined)}
        primaryText="Remove Integration"
        onPrimary={deleteIntegration ? handleDeleteIntegration : undefined}
      />
    </div>
  );
};
