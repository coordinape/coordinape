import React from 'react';

import { useCurrentUserAuthToken } from '../../hooks/useAuthToken';
import { Box, Button, Panel, Text } from '../../ui';
import { getConsoleUrl } from '../../utils/apiKeyHelper';

/**
 * Links the user to a GraphQL explorer for the Hasura API preconfigured with their API credentials
 * @returns JSX.Element
 */
export const DevPortalPage: React.FC = () => {
  const authToken = useCurrentUserAuthToken();

  const consoleUrl = authToken ? getConsoleUrl(authToken, true) : '';

  return (
    <Box
      css={{
        margin: '$lg auto',
        maxWidth: '$smallScreen',
      }}
    >
      <Panel css={{ mx: '$lg' }}>
        <Text h1 semibold>
          Developer Portal
        </Text>
        <Box css={{ pt: '$md', color: '$text' }}>
          If you would like to access your circle data programmatically, you can
          use Coordinape&#39;s GraphQL API. Click the button below to visit our
          API Explorer where you will find the GraphQL API endpoint, the
          token/headers you can use to authenticate your request, and a live
          console to construct queries. Note that your auth token will be
          invalidated upon logout from the Coordinape website.
        </Box>
        <Box css={{ pt: '$md', color: '$text', fontStyle: 'italic' }}>
          This API is subject to change as we improve our data model.
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
            <Button size="large" color="primary" outlined>
              Open API Explorer
            </Button>
          </a>
        </Box>
      </Panel>
    </Box>
  );
};
