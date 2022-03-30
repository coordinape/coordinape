import { ValueTypes } from '../__generated__/zeus';
import { adminClient } from '../adminClient';

export default async function (users: ValueTypes['users_insert_input'][]) {
  return adminClient.mutate({
    insert_users: [
      {
        objects: users,
      },
      {
        returning: {
          id: true,
          address: true,
          circle_id: true,
          starting_tokens: true,
          non_giver: true,
          non_receiver: true,
          fixed_non_receiver: true,
        },
      },
    ],
  });
}
