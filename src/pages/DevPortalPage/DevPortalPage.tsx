import React from 'react';

import { REACT_APP_HASURA_URL } from '../../config/env';
import { useCurrentUserAuthToken } from '../../hooks/useAuthToken';
import { Box, Panel, Button, Text } from '../../ui';

const EXAMPLE_QUERY =
  'query+MyCircles+%7B%0A++circles%28limit%3A+3%29+%7B%0A++++name%0A++++organization+%7B%0A++++++name%0A++++%7D%0A++++epochs%28limit%3A+3%2C+where%3A+%7Bended%3A+%7B_eq%3A+true%7D%7D%29+%7B%0A++++++id%0A++++++end_date%0A++++++start_date%0A++++%7D%0A++++users%28limit%3A+5%2C+order_by%3A+%7Bcreated_at%3A+asc%7D%29+%7B%0A++++++id%0A++++++name%0A++++++give_token_received%0A++++++give_token_remaining%0A++++++profile+%7B%0A++++++++twitter_username%0A++++++%7D%0A++++%7D%0A++%7D%0A%7D%0A';

const getConsoleUrl = (authToken: string) => {
  return `https://cloud.hasura.io/public/graphiql?endpoint=${REACT_APP_HASURA_URL}&header=Authorization:${encodeURIComponent(
    `Bearer ${authToken}`
  )}&query=${EXAMPLE_QUERY}`;
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
