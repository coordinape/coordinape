import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

export const updateContributionMutation = async (
  payload: ValueTypes['UpdateContributionInput']
) =>
  client.mutate({
    updateContribution: [{ payload }, { __typename: true }],
  });
