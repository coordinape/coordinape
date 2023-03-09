import assert from 'assert';

import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

export const createReactionMutation = async (
  object: ValueTypes['reactions_insert_input']
) => {
  const { insert_reactions_one } = await client.mutate(
    {
      insert_reactions_one: [
        { object },
        {
          id: true,
          reaction: true,
          profile: {
            name: true,
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'createReaction',
    }
  );
  assert(insert_reactions_one);
  return insert_reactions_one;
};

export const deleteReactionMutation = async (id: number) => {
  await client.mutate(
    {
      delete_reactions: [
        { where: { id: { _eq: id } } },
        {
          affected_rows: true,
        },
      ],
    },
    {
      operationName: 'deleteReaction',
    }
  );
  return id;
};
