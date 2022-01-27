import { zEthAddress } from './formHelpers';

test('validate address', async () => {
  await zEthAddress.parseAsync('0x1234567890123456789012345678901234567890');
});

test('reject invalid address', async () => {
  expect(() => zEthAddress.parseAsync('0xNope')).rejects.toThrow();
});

test('validate ENS name', async () => {
  const parsed = await zEthAddress.parseAsync('vitalik.eth');
  expect(parsed).toEqual('0xd8da6bf26964af9d7eed9e03e53415d37aa96045');
});
