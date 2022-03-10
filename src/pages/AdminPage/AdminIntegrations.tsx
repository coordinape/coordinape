import React, { useCallback, useState } from 'react';

import { useApi } from 'lib/gql';

import { makeStyles, Button, IconButton } from '@material-ui/core';

import { ActionDialog } from 'components';
import { useCurrentCircleIntegrations } from 'hooks/gql';
import { DeleteIcon, DeworkIcon, DeworkLogo } from 'icons';
import { getIntegrationCallbackPath } from 'routes/paths';

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

export const AdminIntegrations = () => {
  const classes = useStyles();

  const { integrations, refetch: refetchIntegrations } =
    useCurrentCircleIntegrations();
  const [deleteIntegration, setDeleteIntegration] =
    useState<typeof integrations[number]>();
  const { deleteCircleIntegration } = useApi();
  const handleDeleteIntegration = useCallback(async () => {
    if (deleteIntegration) {
      await deleteCircleIntegration(deleteIntegration.id);
      await refetchIntegrations();
      setDeleteIntegration(undefined);
    }
  }, [deleteCircleIntegration, refetchIntegrations, deleteIntegration]);

  return (
    <div style={{ display: 'grid' }}>
      <p className={classes.subTitle}>Integrations</p>
      <div className={classes.integrationContainer}>
        {integrations.map((integration, index) => (
          <div key={index} className={classes.integrationRow}>
            <DeworkLogo size="md" className={classes.integrationIcon} />
            <p className={classes.integrationText}>{integration.name}</p>
            <IconButton
              onClick={() => setDeleteIntegration(integration)}
              className={classes.errorColor}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>
      <Button
        variant="contained"
        size="small"
        startIcon={<DeworkIcon size="md" />}
        href={`https://app.dework.xyz/apps/install/coordinape?redirect=${
          window.location.origin
        }${getIntegrationCallbackPath()}`}
      >
        Connect Dework
      </Button>

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
