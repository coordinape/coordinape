export const mockVault = {
  created_at: new Date(),
  created_by: 21,
  decimals: 18,
  id: 2,
  org_id: 2,
  simple_token_address: '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521',
  symbol: 'DAI',
  token_address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  updated_at: new Date(),
  vault_address: '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521',
};

export const mockEpoch = {
  id: 5,
  ended: true,
  number: 4,
  circle_id: 2,
  circle: {
    id: 2,
    name: 'Mock Circle',
    users: [
      {
        address: '0x63c389CB2C573dd3c9239A13a3eb65935Ddb5e2e',
        id: 21,
        name: 'Mock User 1',
        circle_id: 2,
        received_gifts: [{ tokens: 100 }, { tokens: 100 }],
        received_gifts_aggregate: [
          {
            aggregate: {
              count: 2,
            },
          },
        ],
      },
      {
        address: '0x63c389CB2C573dd8A9239A16a3eb65935Ddb5e2f',
        id: 22,
        name: 'Mock User 2',
        circle_id: 2,
        received_gifts: [{ tokens: 70 }, { tokens: 120 }, { tokens: 110 }],
        received_gifts_aggregate: [
          {
            aggregate: {
              count: 3,
            },
          },
        ],
      },
    ],
  },
};
