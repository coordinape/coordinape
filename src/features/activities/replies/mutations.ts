import assert from 'assert';

import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { client } from 'lib/gql/client';

export const createReplyMutation = async (
  object: ValueTypes['replies_insert_input']
) => {
  const { insert_replies_one } = await client.mutate(
    {
      insert_replies_one: [
        { object },
        {
          id: true,
          reply: true,
          profile: {
            name: true,
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'createReply',
    }
  );
  assert(insert_replies_one);
  return insert_replies_one;
};
