import assert from 'assert';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getLocalPGIVE } from '../../cosoul/api/pgive';

import { getCoLinksScore } from './getCoLinksScore';
import { getEmailScore } from './getEmailScore';
import { getGitHubScore } from './getGitHubScore';
import { getInviteScore } from './getInviteScore';
import { getLinkedInScore } from './getLinkedInScore';
import { getPoapScore } from './getPoapScore';
import { getTwitterScore } from './getTwitterScore';
import { PGIVE_MAX_SCORE } from './scoring';

export const getRepScore = async (profileId: number) => {
  const { address, currentScore } = await getAddressAndCurrentScore(profileId);

  const scores: Record<string, number> = {
    ...(await getCoLinksScore(address, profileId)),
    pgive_score: Math.min(await getLocalPGIVE(address), PGIVE_MAX_SCORE),
    twitter_score: await getTwitterScore(profileId),
    email_score: await getEmailScore(profileId),
    poap_score: await getPoapScore(address),
    github_score: await getGitHubScore(profileId),
    invite_score: await getInviteScore(profileId),
    linkedin_score: await getLinkedInScore(profileId),
    colinks_engagement_score: 0,
  };

  const total_score = Object.values(scores).reduce((a, b) => a + b, 0);
  return {
    ...scores,
    total_score,
    changed: total_score !== currentScore,
    previousTotal: currentScore,
  };
  // stackoverflow
  // medium
  // dev.to
  // youtube
  // twitch
  // facebook
  // reddit
  // hackernews
  // dribbble
  // behance
  // producthunt
  // angellist
  // codepen
  // slideshare
  // discord
  // slack
  // keybase
  // telegram
  // whatsapp
  // skype
  // phone
  // sms
  // website
  // blog
  // podcast
  // instagram
};

const getAddressAndCurrentScore = async (profileId: number) => {
  const { profiles_by_pk } = await adminClient.query(
    {
      profiles_by_pk: [
        {
          id: profileId,
        },
        {
          address: true,
          reputation_score: {
            total_score: true,
          },
        },
      ],
    },
    {
      operationName: 'getAddressFor_repScore',
    }
  );

  assert(profiles_by_pk);
  const address = profiles_by_pk.address;
  return {
    address,
    currentScore: profiles_by_pk.reputation_score?.total_score ?? 0,
  };
};
