import { GraphQLTypes } from '../../api-lib/gql/__generated__/zeus';

import type { GQLClientType } from './common';

export async function createTokenGift(
  client: GQLClientType,
  object: Partial<GraphQLTypes['token_gifts_insert_input']>
): Promise<{ id: number }> {
  const { insert_token_gifts_one } = await client.mutate(
    {
      insert_token_gifts_one: [
        {
          object,
        },
        {
          id: true,
        },
      ],
    },
    { operationName: 'interTokenGiftsMutation' }
  );
  if (!insert_token_gifts_one) {
    throw new Error('Epoch not created');
  }

  return insert_token_gifts_one;
}
