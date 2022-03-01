import { z } from 'zod';

// this is currently the single source of truth about what vault types the app
// should support. it should probably live somewhere else
export const zAssetEnum = z.enum([
  'DAI',
  'USDC',
  'YFI',
  'SUSHI',
  'ALUSD',
  'USDT',
  'WETH',
  'OTHER',
]);
export type TAssetEnum = z.infer<typeof zAssetEnum>;
