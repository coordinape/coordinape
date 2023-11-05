import assert from 'assert';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getLocalPGIVE } from '../../cosoul/api/pgive';

import { getEmailScore } from './getEmailScore';
import { getGitHubScore } from './getGitHubScore';
import { getInviteScore } from './getInviteScore';
import { getKeysScore } from './getKeysScore';
import { getLinkedInScore } from './getLinkedInScore';
import { getPoapScore } from './getPoapScore';
import { getTwitterScore } from './getTwitterScore';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getRepScore = async (profileId: number) => {
  const address = await getAddress(profileId);

  // pgive
  const localPGIVE = await getLocalPGIVE(address);

  // twitter
  const twitterScore = await getTwitterScore(profileId);

  // email score
  const emailScore = await getEmailScore(profileId);

  // keys score
  const keysScore = await getKeysScore(address);

  // Poap score
  const poapScore = await getPoapScore(address);

  // GitHub score
  const gitHubScore = await getGitHubScore(profileId);

  // Invite Score
  const inviteScore = await getInviteScore(profileId);

  // LinkedIn score
  const linkedInScore = await getLinkedInScore(profileId);

  // total score
  const scores = {
    pgive: localPGIVE,
    twitter: twitterScore,
    email: emailScore,
    keys: keysScore,
    poap: poapScore,
    gitHub: gitHubScore,
    invites: inviteScore,
    linkedIn: linkedInScore,
  };

  return {
    ...scores,
    total: Object.values(scores).reduce((a, b) => a + b, 0),
  };
  // github
  // linkedin
  // stackoverflow
  // medium
  // dev.to
  // youtube
  // twitch
  // instagram
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
  // email
  // phone
  // sms
  // website
  // blog
  // podcast
  // twitch
  // instagram
  // facebook
};

const getAddress = async (profileId: number) => {
  const { profiles_by_pk } = await adminClient.query(
    {
      profiles_by_pk: [
        {
          id: profileId,
        },
        {
          address: true,
        },
      ],
    },
    {
      operationName: 'getAddressFor_repScore',
    }
  );

  assert(profiles_by_pk);
  const address = profiles_by_pk.address;
  return address;
};
