import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';
import { fetchFollowers } from '../../../../api-lib/neynar.ts';

import { errorMessage } from './addFarcaster.ts';

const networkInputSchema = z
  .object({
    profile_id: z.number().optional(),
    farcaster_id: z.number().optional(),
  })
  .refine(data => data.profile_id || data.farcaster_id, {
    message: 'profile_id or farcaster_id is required',
  });

type NetworkNode = {
  username: string;
  avatar: string;
  profile_id?: number;
  farcaster_id: number;
  tier: number;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload, session } = await getInput(req, networkInputSchema);

  // eslint-disable-next-line no-console
  console.log({ viewer: session.hasuraProfileId });

  // eslint-disable-next-line no-console
  console.log('payload', payload);

  let { profile_id: targetProfileId, farcaster_id: fid } = payload;

  if (!targetProfileId && fid) {
    // lets try to figure out the user based on fid
    const { targetProfiles } = await adminClient.query(
      {
        __alias: {
          targetProfiles: {
            profiles: [
              {
                where: {
                  farcaster_account: {
                    fid: { _eq: fid },
                  },
                },
              },
              {
                id: true,
              },
            ],
          },
        },
      },
      {
        operationName: 'getNetwork__getTargetProfileByFid',
      }
    );
    const targetProfile = targetProfiles.pop();
    targetProfileId = targetProfile?.id;
  }

  if (!fid && targetProfileId) {
    // lets try to figure out their fid
    const { targetProfile } = await adminClient.query(
      {
        __alias: {
          targetProfile: {
            profiles_by_pk: [
              {
                id: session.hasuraProfileId,
              },
              {
                farcaster_account: {
                  fid: true,
                },
              },
            ],
          },
        },
      },
      {
        operationName: 'getNetwork__getFid',
      }
    );

    fid = targetProfile?.farcaster_account?.fid;
  }

  // now we have our best hope at a profileId and a fid, what do??
  // lets just handle the fid for now
  if (!fid) {
    // TODO: later we will do some colinks-side style instead of just FC?
    return errorMessage(res, 'no farcaster account found for this user');
  }

  if (targetProfileId) {
    // TODO: hook this up
    await getCoSoulStuff(targetProfileId);
  }

  // TODO: mash all the data together
  const nodes: NetworkNode[] = await getFollowerNodes(fid);

  try {
    return res.status(200).json({ nodes });
  } catch (e) {
    throw new InternalServerError('Unable to fetch info from guild', e);
  }
}

const getFollowerNodes = async (fid: number) => {
  const ff = await fetchFollowers(fid);
  const followers = ff.users.map(user => {
    const nn: NetworkNode = {
      username: user.username,
      avatar: user.pfp.url,
      // TODO: fill this in later i guess
      // profile_id: user.id,
      farcaster_id: user.fid,
      tier: 1,
    };
    return nn;
  });
  return followers;
};

// TODO: this doesn't really do anything yet
const getCoSoulStuff = async (targetProfileId: number) => {
  // get all their links!
  await adminClient.query(
    {
      profiles_public: [
        {
          where: {
            id: { _eq: targetProfileId },
          },
        },
        {
          address: true,
          link_holder: [
            {},
            {
              holder: true,
              target: true,
              amount: true,
              target_cosoul: {
                address: true,
              },
            },
          ],
          link_target: [
            {},
            {
              holder: true,
              target: true,
              amount: true,
            },
          ],
        },
      ],
    },
    {
      operationName: 'getNetwork__getColinks',
    }
  );
};
