import { AddressZero } from '@ethersproject/constants';
import faker from 'faker';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { createOrganization, createProfile } from '../../helpers';

const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

describe('pricePerShare', () => {
  // we set up one vault record and then change its values to simulate different
  // conditions for different tests
  const vault_address = '0x112dcc3a7caa40c7e4d1a5d3b579ee1a1e499a45';

  beforeAll(async () => {
    const org = await createOrganization(adminClient);
    const profile = await createProfile(adminClient);
    await adminClient.mutate({
      insert_vaults_one: [
        {
          object: {
            symbol: 'DAI',
            chain_id: 1,
            vault_address,
            token_address: AddressZero,
            simple_token_address: AddressZero,
            org_id: org.id,
            decimals: 18,
            created_by: profile.id,
          },
        },
        { id: true },
      ],
    });
  });

  afterAll(async () => {
    await adminClient.mutate({
      delete_vaults: [
        { where: { vault_address: { _eq: vault_address } } },
        { affected_rows: true },
      ],
    });
  });

  const setTokens = (token_address, simple_token_address) =>
    adminClient.mutate({
      update_vaults: [
        {
          where: { vault_address: { _eq: vault_address } },
          _set: { token_address, simple_token_address },
        },
        { affected_rows: true },
      ],
    });

  const getPrice = async () => {
    try {
      return await adminClient
        .query({
          vaults: [
            { where: { vault_address: { _eq: vault_address } } },
            { price_per_share: true },
          ],
        })
        .then(res => res.vaults?.[0]?.price_per_share);
    } catch (err: any) {
      if (!err.message) err.message = err.response?.errors.map(e => e.message);
      console.error(err);
    }
  };

  test('invalid token address', async () => {
    await setTokens(faker.finance.ethereumAddress(), AddressZero);
    expect(await getPrice()).toBe(1);
  });

  test('simple vault', async () => {
    await setTokens(AddressZero, daiAddress);
    expect(await getPrice()).toBe(1);
  });

  test('Yearn vault', async () => {
    await setTokens(daiAddress, AddressZero);
    expect(await getPrice()).toBeGreaterThan(1);
  });
});
