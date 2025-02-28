export const UNLIMITED_GIVE_PROFILES = [4064783, 4064757, 4064836, 4065247];

export const getGiveWeight = ({
  profileId,
  total_score,
}: {
  profileId: number;
  total_score: number | undefined;
}) => {
  const isBot = isBotOrAgent(profileId);
  const botWeight = 69;
  const give_weight = isBot ? botWeight : total_score || 1;
  return give_weight;
};

export const isBotOrAgent = (profileId: number) =>
  UNLIMITED_GIVE_PROFILES.includes(profileId);
