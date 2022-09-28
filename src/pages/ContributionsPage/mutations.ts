import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

export const updateContributionMutation = async (
  payload: ValueTypes['UpdateContributionInput']
) =>
  client.mutate({
    updateContribution: [{ payload }, { __typename: true }],
  });

export const deleteContributionMutation = async (
  payload: ValueTypes['DeleteContributionInput']
) =>
  client.mutate({
    deleteContribution: [{ payload }, { __typename: true }],
  });

export const createContributionMutation = async (
  object: ValueTypes['contributions_insert_input']
) => {
  return client.mutate({
    insert_contributions_one: [
      { object },
      { id: true, description: true, datetime_created: true, user_id: true },
    ],
  });
};
