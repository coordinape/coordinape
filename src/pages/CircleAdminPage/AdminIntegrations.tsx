import React, { useCallback, useState } from 'react';

import * as mutations from 'lib/gql/mutations';

import { ActionDialog } from 'components';
import { useCurrentCircleIntegrations } from 'hooks/gql/useCurrentCircleIntegrations';
import {
  DeprecatedDeleteIcon,
  DeworkIcon,
  DeworkLogo,
  ParcelIcon,
} from 'icons';
import { paths } from 'routes/paths';
import { Flex, Box, Button, Text } from 'ui';

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
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Text h3 semibold css={{ mb: '$sm' }}>
        Connected Integrations
      </Text>
      <Box>
        {integrations.data?.map((integration, index) => (
          <Flex
            key={index}
            css={{ alignItems: 'center', gap: '$sm', mb: '$md' }}
          >
            <DeworkLogo size="md" css={{ color: '$text' }} />
            <Text css={{ flex: '1' }}>{integration.name}</Text>
            <Button
              onClick={() => setDeleteIntegration(integration)}
              css={{
                color: '$alert',
                backgroundColor: '$transparent',
                height: '$md',
                width: '$md',
                ml: '$1xl',
              }}
              size="small"
            >
              <DeprecatedDeleteIcon />
            </Button>
          </Flex>
        ))}
      </Box>
      <Flex
        column
        css={{
          mr: '$sm',
          gap: '$sm',
        }}
      >
        <Button
          as="a"
          color="neutral"
          size="medium"
          outlined
          href={`https://app.dework.xyz/apps/install/coordinape?redirect=${redirectUri()}`}
        >
          <Flex css={{ mr: '$sm' }}>
            <DeworkIcon size="md" />
          </Flex>
          Connect Dework
        </Button>
        <Button
          as="a"
          color="neutral"
          size="medium"
          outlined
          href={
            'https://docs.coordinape.com/get-started/compensation/paying-your-team/parcel'
          }
        >
          <Flex css={{ mr: '$sm' }}>
            <ParcelIcon size="md" />
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
    </Box>
  );
};
