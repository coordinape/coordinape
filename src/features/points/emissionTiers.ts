export interface EmissionTier {
  minTokens: number;
  maxTokens: number | null;
  multiplier: number;
  giveCap: number;
}

export const EMISSION_TIERS: EmissionTier[] = [
  { minTokens: 0, maxTokens: 1000, multiplier: 1, giveCap: 20 }, // 1x = 1/day
  { minTokens: 1000, maxTokens: 10000, multiplier: 4, giveCap: 20 }, // 4x = 4/day
  { minTokens: 10000, maxTokens: 33000, multiplier: 10, giveCap: 30 }, // 10x = 10/day
  { minTokens: 33000, maxTokens: 100000, multiplier: 20, giveCap: 69 }, // 20x = 20/day
  { minTokens: 100000, maxTokens: null, multiplier: 100, giveCap: 200 }, // 100x = 100/day
];

export const getEmissionTier = (tokenBalance: number): EmissionTier => {
  return (
    EMISSION_TIERS.find(
      tier =>
        tokenBalance >= tier.minTokens &&
        (tier.maxTokens === null || tokenBalance < tier.maxTokens)
    ) || EMISSION_TIERS[0]
  );
};

export const getGiveCap = (tokenBalance: number = 0) => {
  const tier = getEmissionTier(tokenBalance);
  return tier.giveCap;
};
