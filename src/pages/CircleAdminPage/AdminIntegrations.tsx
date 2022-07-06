import React, { useCallback, useState } from 'react';

import * as mutations from 'lib/gql/mutations';

import { makeStyles, IconButton } from '@material-ui/core';

import { ActionDialog } from 'components';
import { useCurrentCircleIntegrations } from 'hooks/gql/useCurrentCircleIntegrations';
import {
  DeprecatedDeleteIcon,
  DeworkIcon,
  DeworkLogo,
  ParcelIcon,
} from 'icons';
import { paths } from 'routes/paths';
import { Flex, Button, Text } from 'ui';

const useStyles = makeStyles(theme => ({
  errorColor: {
    color: theme.palette.error.main,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.text,
    textAlign: 'center',
  },
  integrationContainer: {
    marginBottom: theme.spacing(2),
  },
  integrationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  integrationText: {
    color: theme.colors.text,
    margin: 0,
    flex: 1,
  },
  integrationIcon: {
    color: theme.colors.text,
  },
}));

export const AdminIntegrations = ({ circleId }: { circleId: number }) => {
  const classes = useStyles();

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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Text className={classes.subTitle}>DeWork Integration</Text>
      <div className={classes.integrationContainer}>
        {integrations.data?.map((integration, index) => (
          <div key={index} className={classes.integrationRow}>
            <DeworkLogo size="md" className={classes.integrationIcon} />
            <p className={classes.integrationText}>{integration.name}</p>
            <IconButton
              onClick={() => setDeleteIntegration(integration)}
              className={classes.errorColor}
              size="small"
            >
              <DeprecatedDeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>
      <Flex
        column
        css={{
          mr: '$sm',
        }}
        className={classes.integrationRow}
      >
        <Button
          as="a"
          color="neutral"
          size="medium"
          outlined
          href={`https://app.dework.xyz/apps/install/coordinape?redirect=${
            window.location.origin
          }${paths.connectIntegration(circleId)}`}
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
    </div>
  );
};
