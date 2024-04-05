import { fetchProfileInfo } from './fetchProfileInfo.tsx';

export const getLevelForViewer = async (viewerProfileId: number) => {
  const { hasSentGive, hasReceivedGive, hasCoSoul, linksHeld, numGiveSent } =
    await fetchProfileInfo(viewerProfileId);

  // These are the rules for the general levels
  // if (giveReceived == false && giveSent == false) {
  //   // you are at least level 0
  // }
  // if (giveReceived == true || giveSent == true) {
  //   // you are at least level 1
  // }
  // if (level1 && hasCosoul == true) {
  //   // you are at least level 2
  // }
  // if (level2 && giveSent ≥ 5) {
  //   // you are at least level 3
  // }
  // if (level3 && coLinksMember == true) {
  //   // you are level 4
  // }
  const level1 = hasSentGive || hasReceivedGive;
  const level2 = level1 && hasCoSoul;
  const level3 = level2 && numGiveSent >= 5;
  const level4 = level3 && linksHeld > 0;

  return level4 ? 4 : level3 ? 3 : level2 ? 2 : level1 ? 1 : 0;
};
