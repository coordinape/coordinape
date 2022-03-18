import { client } from './client';

export const getCurrentEpoch = async (
  circle_id: number
): Promise<typeof currentEpoch | undefined> => {
  const {
    epochs: [currentEpoch],
  } = await client.query({
    epochs: [
      {
        where: {
          circle_id: { _eq: circle_id },
          end_date: { _gt: 'now()' },
          start_date: { _lt: 'now()' },
        },
      },
      { id: true },
    ],
  });
  return currentEpoch;
};

export async function getVaults(orgId: number) {
  return await client.query({
    vaults: [
      {
        where: { org_id: { _eq: orgId } },
      },
      {
        id: true,
        vault_address: true,
        token_address: true,
        simple_token_address: true,
        symbol: true,
        created_by: true,
      },
    ],
  });
}
