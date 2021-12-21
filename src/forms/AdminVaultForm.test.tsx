import { schema } from './AdminVaultForm';

test('accept blank token address', async () => {
  const data = {
    asset: 'DAI',
    token: 0,
    custom_asset: '',
    repeat_monthly: false,
  };
  const result = await schema.parseAsync(data);
  expect(result).toEqual(data);
});

test('accept valid token address', async () => {
  const data = {
    asset: 'DAI',
    token: 0,
    custom_asset: '0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503',
    repeat_monthly: false,
  };

  const result = await schema.parseAsync(data);
  expect(result).toEqual(data);
});

test('reject invalid token address', async () => {
  const data = {
    asset: 'DAI',
    token: 0,
    custom_asset: '0xg7ac0fb4f2d84898e4d9e7b4dab3c24507a6d503',
    repeat_monthly: false,
  };

  await expect(async () => schema.parseAsync(data)).rejects.toThrow();
});
