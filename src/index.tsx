import React from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getAuthToken } from 'features/auth';
import { createClient } from 'graphql-ws';
import ReactDOM from 'react-dom';

import { initSentry } from 'utils/reporting';

import App from './App';
import { REACT_APP_HASURA_URL } from './config/env';

const wsLink = new GraphQLWsLink(
  createClient({
    url: REACT_APP_HASURA_URL.replace('http', 'ws'),
    connectionParams: async () => {
      const token = getAuthToken(false);
      if (token) {
        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      }
      return {};
    },
  })
);

const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache(),
});

initSentry();

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
