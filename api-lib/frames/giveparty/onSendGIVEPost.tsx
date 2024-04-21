import { z, ZodError } from 'zod';

import { fetchPoints } from '../../../_api/hasura/actions/_handlers/createCoLinksGive.ts';
import { getFrameUrl } from '../../../_api/webhooks/neynar_mention.ts';
import { IS_LOCAL_ENV } from '../../config.ts';
import { adminClient } from '../../gql/adminClient.ts';
import { insertInteractionEvents } from '../../gql/mutations.ts';
import { insertCoLinksGive } from '../../insertCoLinksGive.ts';
import { findOrCreateProfileByUsername } from '../../neynar/findOrCreateProfileByFid.ts';
import { generateWarpCastUrl, publishCast } from '../../neynar.ts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { fetchProfileInfo } from '../give/fetchProfileInfo.tsx';

import { getContextFromParams } from './getContextFromParams.ts';
import { GivePartyHomeFrame } from './GivePartyHomeFrame.tsx';
import { GivePartyMintCoSoulFrame } from './GivePartyMintCoSoulFrame.tsx';
import { JoinedPartyFrame } from './JoinedPartyFrame.tsx';

const usernameTrim = z
  .string()
  .trim()
  .toLowerCase()
  .transform(v => v.replace(/^@/g, ''));

const usernameSchema = z
  .string()
  .trim()
  .regex(/^[^\s]*$/, {
    message: 'Username must not contain any spaces.',
  })
  .min(1, { message: 'Username must not be empty' })
  .max(24, { message: 'Username is max 24 characters' });

const skillTrim = z
  .string()
  .trim()
  .transform(v => v.replace(/^#/g, ''));

const skillSchema = z
  .string()
  .trim()
  .min(1, { message: 'Skill must not be empty' })
  .max(32, { message: 'Skill is max 32 characters' })
  .regex(/^[^\s]*$/, {
    message: 'Skill must not contain any spaces.',
  });

export const validateAndCleanSkill = (skill: string): string => {
  try {
    return skillSchema.parse(skillTrim.parse(skill));
  } catch (e: any) {
    const message = e instanceof ZodError ? e.issues[0]?.message : e.message;
    throw new Error(message);
  }
};
const validateAndCleanUsername = (username: string): string => {
  try {
    return usernameSchema.parse(usernameTrim.parse(username));
  } catch (e: any) {
    const message = e instanceof ZodError ? e.issues[0]?.message : e.message;
    throw new Error(message);
  }
};
export const onSendGIVEPost = async (
  info: FramePostInfo,
  params: Record<string, string>
) => {
  // who are you? which frame to return
  let { skill } = await getContextFromParams(params);

  try {
    skill = validateAndCleanSkill(skill);
  } catch (e: any) {
    return GivePartyHomeFrame('Invalid Skill: ' + e.message);
  }

  const {
    inputText,
    castId: { hash: cast_hash },
  } = info.message;

  let username = inputText;

  if (!username) {
    return GivePartyHomeFrame('Provider a username to GIVE to');
  }

  try {
    validateAndCleanUsername(username);
  } catch (e: any) {
    return GivePartyHomeFrame('Invalid Username: ' + e.message);
  }

  // lookup/create the target user
  let target_profile: Awaited<ReturnType<typeof findOrCreateProfileByUsername>>;
  try {
    target_profile = await findOrCreateProfileByUsername(username);
    username = target_profile.fc_username;
  } catch (e: any) {
    return GivePartyHomeFrame(`Can't find user: ${inputText}`);
  }

  if (target_profile.id === info.profile.id) {
    return GivePartyHomeFrame(`You can't GIVE to yourself!`);
  }

  const { canGive } = await fetchPoints(info.profile.id);
  if (!canGive) {
    const { hasCoSoul } = await fetchProfileInfo(info.profile.id);
    if (!hasCoSoul) {
      return GivePartyMintCoSoulFrame;
      // return GivePartyHomeFrame(`Mint CoSoul!`);
    } /* else if (linksHeld === 0) {
      return GivePartyHomeFrame(`Join CoLinks!`);
    } */ else {
      return GivePartyHomeFrame(`You're out of GIVE! Wait until it recharges.`);
    }
  }
  let giveId;
  try {
    giveId = await insertCoLinksGive(
      info.profile,
      target_profile,
      cast_hash,
      skill
    );
  } catch (e: any) {
    return GivePartyHomeFrame('Failed to give: ' + e.message);
  }

  await insertInteractionEvents({
    event_type: 'give_party_give',
    profile_id: info.profile.id,
    data: {
      give_party: true,
      frame: 'give.party',
      give_id: giveId,
      giver_id: info.profile.id,
      giver_name: info.profile.name,
      cast_hash: cast_hash,
      receiver_id: target_profile.id,
      receiver_name: target_profile.name,
      skill,
    },
  });

  // TODO: pre-cache give frames? make a helper for all this ?
  if (!IS_LOCAL_ENV) {
    const resp = await publishCast(
      `GIVE Delivered to @${username} for #${skill}`,
      {
        replyTo: cast_hash,
        embeds: [{ url: getFrameUrl('give', giveId) }],
      }
    );

    // update warpcast_url on give with bot response hash
    const warpcastUrl = await generateWarpCastUrl(resp.hash);

    await adminClient.mutate(
      {
        update_colinks_gives_by_pk: [
          {
            pk_columns: { id: giveId },
            _set: {
              warpcast_url: warpcastUrl,
            },
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'updateGives_with_warpcast_url',
      }
    );
  }

  return JoinedPartyFrame;
};
