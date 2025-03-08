// FIXME: we need to make this dynamic ideally
export const UNLIMITED_GIVE_PROFILES = [
  4064783, // magicvest
  4064757, // paddington
  4064836, // furry-wif-fedora
  4065247, // co-creator
  4065508, // indigo-purple
  4065511, // thedogbot
  4065377, // shazaam420
];
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
