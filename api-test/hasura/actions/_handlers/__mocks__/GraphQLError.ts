import { GraphQLError }  from '../../../../../api-lib/gql/__generated__/zeus';

// to silent graphql error logs during testing
jest.mock('../../../../api-lib/gql/__generated__/zeus', () => {
  const original = jest.requireActual('../../../../api-lib/gql/__generated__/zeus');
  return {
    ...original,
    GraphQLError: jest.fn()
  }
});