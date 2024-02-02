import { GraphQLTypes } from '../../gql/__generated__/zeus';
import { adminClient } from '../../gql/adminClient';

export const insertActivity = async (
  activity: GraphQLTypes['activities_insert_input']
) => {
  await adminClient.mutate(
    {
      insert_activities_one: [{ object: activity }, { __typename: true }],
    },
    { operationName: 'insertActivity' }
  );
  return;
};
