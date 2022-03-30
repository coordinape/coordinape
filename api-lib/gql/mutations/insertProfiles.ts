import { ValueTypes } from '../__generated__/zeus';
import { adminClient } from '../adminClient';

export default async function (
  profiles: ValueTypes['profiles_insert_input'][]
) {
  return adminClient.mutate({
    insert_profiles: [
      {
        objects: profiles,
      },
      {
        returning: {
          address: true,
        },
      },
    ],
  });
}
