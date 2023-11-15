import assert from 'assert';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getLocalPGIVE } from '../../cosoul/api/pgive';

import { getEmailScore } from './getEmailScore';
import { getGitHubScore } from './getGitHubScore';
import { getInviteScore } from './getInviteScore';
import { getLinkedInScore } from './getLinkedInScore';
import { getLinksScore } from './getLinksScore';
import { getPoapScore } from './getPoapScore';
import { getTwitterScore } from './getTwitterScore';

export const getRepScore = async (profileId: number) => {
  const { address, currentScore } = await getAddressAndCurrentScore(profileId);

  // twitter
  const twitterScore = await getTwitterScore(profileId);

  // email score
  const emailScore = await getEmailScore(profileId);

  // GitHub score
  const gitHubScore = await getGitHubScore(profileId);

  // Invite Score
  const inviteScore = await getInviteScore(profileId);

  // LinkedIn score
  const linkedInScore = await getLinkedInScore(profileId);

  // links score
  const linksScore = await getLinksScore(address);

  // Poap score
  const poapScore = await getPoapScore(address);

  // pgive
  const localPGIVE = await getLocalPGIVE(address);

  // total score
  const scores = {
    pgive: localPGIVE,
    twitter: twitterScore,
    email: emailScore,
    links: linksScore,
    poap: poapScore,
    gitHub: gitHubScore,
    invites: inviteScore,
    linkedIn: linkedInScore,
  };

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  return {
    ...scores,
    total,
    changed: total !== currentScore,
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
