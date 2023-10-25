import assert from 'assert';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getLocalPGIVE } from '../../cosoul/api/pgive';

import { getEmailScore } from './getEmailScore';
import { getKeysScore } from './getKeysScore';
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

  // total score
  return {
    pgive: localPGIVE,
    twitter: twitterScore,
    email: emailScore,
    keys: keysScore,
    total: localPGIVE + twitterScore + emailScore + keysScore,
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
