import { REACT_APP_HASURA_URL } from 'config/env';

import { Gql } from './Gql';
export * from './Gql';

let gql: Gql;
export const getGql = () => (gql ? gql : new Gql(REACT_APP_HASURA_URL, ''));
