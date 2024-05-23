import assert from 'assert';

import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

export const createReplyReactionMutation = async (
  object: ValueTypes['replies_reactions_insert_input']
) => {
  const { insert_replies_reactions_one } = await client.mutate(
    {
      insert_replies_reactions_one: [
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
      operationName: 'createReplyReaction',
    }
  );
  assert(insert_replies_reactions_one);
  return insert_replies_reactions_one;
};

export const deleteReplyReactionMutation = async (id: number) => {
  await client.mutate(
    {
      delete_replies_reactions: [
        { where: { id: { _eq: id } } },
        {
          affected_rows: true,
        },
      ],
    },
    {
      operationName: 'deleteReplyReaction',
    }
  );
  return id;
};
