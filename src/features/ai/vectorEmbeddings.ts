export const MATCH_THRESHOLD = 0.7;

export const displayScorePct = (score: number) => {
  const normalized = Math.floor(
    Math.max(0, Math.min((score - 0.55) / 0.3, 0.97)) * 100
  );
  return normalized.toString();
};
