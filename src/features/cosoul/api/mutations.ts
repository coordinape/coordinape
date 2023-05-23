import { ValueTypes } from '../../../lib/gql/__generated__/zeus';
import { client } from '../../../lib/gql/client';

export async function mintCosoulTx(input: ValueTypes['cosouls_insert_input']) {
  client.mutate(
    {
      insert_cosouls_one: [{ object: { ...input } }, { __typename: true }],
    },
    { operationName: 'mintCosoulTx' }
  );
}
