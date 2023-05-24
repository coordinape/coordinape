import { ValueTypes } from '../../../lib/gql/__generated__/zeus';
import { client } from '../../../lib/gql/client';

export async function mintCosoulTx(input: ValueTypes['cosouls_insert_input']) {
  client.mutate(
    {
      insert_cosouls_one: [{ object: { ...input } }, { __typename: true }],
    },
    { operationName: 'createCosoul' }
  );
}

export async function deleteCosoul(tokenId: number) {
  client.mutate(
    {
      delete_cosouls: [
        { where: { token_id: { _eq: tokenId } } },
        { __typename: true, affected_rows: true },
      ],
    },
    { operationName: 'deleteCosoul' }
  );
}
