// TODO move this to pages/CircleAdminPage or features/integrations

import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { LoadingModal } from 'components';
import { createCircleIntegration } from 'pages/CircleAdminPage/mutations';
import { useCircleIdParam } from 'routes/hooks';
import { givePaths } from 'routes/paths';
import { Button, Text } from 'ui';

interface ConnectIntegrationConfig {
  name: string;
  test(params: URLSearchParams): boolean;
  create(params: URLSearchParams): {
    integrationName: string;
    integrationConfig: unknown;
  };
}

export const DEWORK = 'dework';
export const WONDER = 'wonder';

const integrationConfigs: ConnectIntegrationConfig[] = [
  {
    name: DEWORK,
    test: params =>
      params.has('dework_organization_id') &&
      params.has('dework_organization_name'),
    create(params) {
      const organizationId = params.get('dework_organization_id');
      const organizationName = params.get('dework_organization_name');
      const workspaceIdsString = params.get('dework_workspace_ids');
      const workspaceIds = workspaceIdsString
        ? workspaceIdsString.split(',')
        : undefined;
      return {
        integrationName:
          `${organizationName} on Dework` +
          (workspaceIds?.length ? ` (${workspaceIds.length} spaces)` : ''),
        integrationConfig: { organizationId, workspaceIds },
      };
    },
  },
  {
    name: WONDER,
    test: params =>
      params.has('wonder_organization_id') &&
      params.has('wonder_organization_name'),
    create(params) {
      const organizationId = params.get('wonder_organization_id');
      const organizationName = params.get('wonder_organization_name');
      const podIdsString = params.get('wonder_pod_ids');
      const podIds = podIdsString ? podIdsString.split(',') : undefined;
      return {
        integrationName:
          `${organizationName} on Wonder` +
          (podIds?.length ? ` (${podIds.length} spaces)` : ''),
        integrationConfig: { organizationId, podIds },
      };
    },
  },
];

export const IntegrationCallbackPage: FC = () => {
  const circleId = useCircleIdParam();
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const [status, setStatus] = useState<'loading' | 'created' | 'failed'>(
    'loading'
  );

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
  }, []);

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
            <Text h2>
              {status === 'created'
                ? 'Integration Connected!'
                : 'Failed to connect integration!'}
            </Text>
            <Button
              css={{ width: '100%', marginTop: '$lg' }}
              color="secondary"
              onClick={() => navigate(givePaths.circleAdmin(circleId))}
            >
              Back to Circle Overview
            </Button>
          </div>
        </div>
      );
  }
};
