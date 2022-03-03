import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useApi } from 'lib/gql';
import { useLocation, useNavigate } from 'react-router-dom';

import { Typography } from '@material-ui/core';

import { LoadingModal } from 'components';
import { useSelectedCircle } from 'recoilState';
import { getCirclesPath } from 'routes/paths';
import { Button } from 'ui';

export const DeworkCallbackPage: FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const [integrationCreated, setIntegrationCreated] = useState(false);
  const { circleId } = useSelectedCircle();

  const { createCircleIntegration } = useApi();
  const updateDeworkOrganizationId = useCallback(async () => {
    const organizationId = params.get('dework_organization_id');
    const organizationName = params.get('dework_organization_name');
    await createCircleIntegration(
      circleId,
      'dework',
      `${organizationName} on Dework`,
      { organizationId }
    );

    setIntegrationCreated(true);
  }, [params, createCircleIntegration, navigate]);
  useEffect(() => {
    updateDeworkOrganizationId();
  }, []);

  if (!integrationCreated) {
    return <LoadingModal text="Connecting to Dework" visible />;
  }

  return (
    <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
      <div>
        <Typography variant="h4" align="center">
          Dework connected!
        </Typography>
        <Button
          css={{ width: '100%', marginTop: '$lg' }}
          color="red"
          size="large"
          onClick={() => navigate(getCirclesPath())}
        >
          Back to Circle Overview
        </Button>
      </div>
    </div>
  );
};
