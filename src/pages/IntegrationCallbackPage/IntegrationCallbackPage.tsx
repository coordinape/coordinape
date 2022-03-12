import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useApi } from 'lib/gql';
import { useLocation, useNavigate } from 'react-router-dom';

import { Typography } from '@material-ui/core';

import { LoadingModal } from 'components';
import { useSelectedCircle } from 'recoilState';
import { paths } from 'routes/paths';
import { Button } from 'ui';

interface ConnectIntegrationConfig {
  name: string;
  test(params: URLSearchParams): boolean;
  create(params: URLSearchParams): {
    integrationName: string;
    integrationConfig: unknown;
  };
}

const integrationConfigs: ConnectIntegrationConfig[] = [
  {
    name: 'dework',
    test: params =>
      params.has('dework_organization_id') &&
      params.has('dework_organization_name'),
    create(params) {
      const organizationId = params.get('dework_organization_id');
      const organizationName = params.get('dework_organization_name');
      return {
        integrationName: `${organizationName} on Dework`,
        integrationConfig: { organizationId },
      };
    },
  },
];

export const IntegrationCallbackPage: FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const [status, setStatus] = useState<'loading' | 'created' | 'failed'>(
    'loading'
  );
  const { circleId } = useSelectedCircle();

  const { createCircleIntegration } = useApi();

  const connectIntegration = useCallback(async () => {
    const integration = integrationConfigs.find(i => i.test(params));
    if (integration) {
      const data = integration.create(params);
      try {
        await createCircleIntegration(
          circleId,
          integration.name,
          data.integrationName,
          data.integrationConfig
        );
        setStatus('created');
      } catch {
        setStatus('failed');
      }
    } else {
      setStatus('failed');
    }
  }, [createCircleIntegration]);
  useEffect(() => {
    connectIntegration();
  }, []);

  switch (status) {
    case 'loading':
      return <LoadingModal text="Connecting..." visible />;
    case 'failed':
    case 'created':
      return (
        <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
          <div>
            <Typography variant="h4" align="center">
              {status === 'created'
                ? 'Integration Connected!'
                : 'Failed to connect integration!'}
            </Typography>
            <Button
              css={{ width: '100%', marginTop: '$lg' }}
              color="red"
              size="large"
              onClick={() => navigate(paths.adminCircles)}
            >
              Back to Circle Overview
            </Button>
          </div>
        </div>
      );
  }
};
