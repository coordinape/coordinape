export interface EmissionTier {
  minTokens: bigint;
  maxTokens: bigint | null;
  multiplier: number;
  giveCap: number;
}

// Assuming tokens have 18 decimals, we handle that here
export const EMISSION_TIERS: EmissionTier[] = [
  {
    minTokens: 0n * 10n ** 18n,
    maxTokens: 1000n * 10n ** 18n,
    multiplier: 1,
    giveCap: 20,
  }, // 1x = 1/day
  {
    minTokens: 1000n * 10n ** 18n,
    maxTokens: 10000n * 10n ** 18n,
    multiplier: 4,
    giveCap: 20,
  }, // 4x = 4/day
  {
    minTokens: 10000n * 10n ** 18n,
    maxTokens: 33000n * 10n ** 18n,
    multiplier: 10,
    giveCap: 30,
  }, // 10x = 10/day
  {
    minTokens: 33000n * 10n ** 18n,
    maxTokens: 100000n * 10n ** 18n,
    multiplier: 20,
    giveCap: 69,
  }, // 20x = 20/day
  {
    minTokens: 100000n * 10n ** 18n,
    maxTokens: null,
    multiplier: 100,
    giveCap: 200,
  }, // 100x = 100/day
];

export const getEmissionTier = (tokenBalance: bigint): EmissionTier => {
  return (
    EMISSION_TIERS.find(
      tier =>
        tokenBalance >= tier.minTokens &&
        (tier.maxTokens === null || tokenBalance < tier.maxTokens)
    ) || EMISSION_TIERS[0]
  );
};

export const getGiveCap = (tokenBalance: bigint = 0n) => {
  const tier = getEmissionTier(tokenBalance);
  return tier.giveCap;
};
