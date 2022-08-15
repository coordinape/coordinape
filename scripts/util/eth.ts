function swapDashSpace(s?: string) {
  return s?.replace(/-/g, ' ');
}

export const SEED_PHRASE =
  swapDashSpace(process.env.DEV_SEED_PHRASE) ||
  'test test test test test test test test test test test junk';
export function getAccountPath(index: number): string {
  return `m/44'/60'/0'/0/${index}`;
}
