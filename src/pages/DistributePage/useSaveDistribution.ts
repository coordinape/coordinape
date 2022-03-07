import { useTypedMutation } from '../../hooks/gql';

export function useGetAllocations() {
  return useTypedMutation(`save-dist`, {
    createUser: [
      {
        object: {
          address: 'true',
          circle_id: 1212,
          fixed_non_receiver: true,
          give_token_remaining: 12,
          name: 'Someone',
          non_receiver: true,
          non_giver: true,
          role: 1,
          starting_tokens: 100,
        },
      },
      {
        id: true,
        address: true,
      },
    ],
  });
}

export function useSaveDistribution() {
  return useTypedMutation(`save-dist`, {
    insert_distributions_one: [{ object: {} }, {}],
  });
}
