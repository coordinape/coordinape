import React from 'react';

import { REACT_APP_HASURA_URL } from '../../config/env';
import { useCurrentUserAuthToken } from '../../hooks/useAuthToken';
import { Box, Panel, Button } from '../../ui';

const getConsoleUrl = (authToken: string) => {
  return `https://cloud.hasura.io/public/graphiql?endpoint=${REACT_APP_HASURA_URL}&header=Authorization:${encodeURIComponent(
    `Bearer ${authToken}`
  )}`;
};

/**
 * Links the user to a GraphQL explorer for the Hasura API preconfigured with their API credentials
 * @returns JSX.Element
 */
export const DevPortalPage: React.FC = () => {
  const authToken = useCurrentUserAuthToken();

  const consoleUrl = authToken ? getConsoleUrl(authToken) : '';

  return (
    <Box
      css={{
        margin: '$lg auto',
        maxWidth: '$smallScreen',
      }}
    >
      <Panel css={{ mx: '$lg' }}>
        <Box
          css={{
            textTransform: 'capitalize',
            fontSize: '$9',
            lineHeight: '$shorter',
            fontWeight: '$bold',
            color: '$text',
          }}
        >
          Developer Portal
        </Box>
        <Box css={{ pt: '$md', color: '$text', maxWidth: '70ch' }}>
          If you would like to access your circle data programmatically, you can
          use Coordinape&#39;s GraphQL API. Click the button below to visit our
          API Explorer where you will find the GraphQL API endpoint, the
          token/headers you can use to authenticate your request, and a live
          console to construct queries.
        </Box>
        <Box
          css={{
            pt: '$md',
          }}
        >
          <a
            href={consoleUrl}
            rel="noreferrer"
            target="_blank"
            style={{ textDecoration: 'none' }}
          >
            <Button size="large" color={'red'}>
              Open API Explorer
            </Button>
          </a>
        </Box>
      </Panel>
    </Box>
  );
};
