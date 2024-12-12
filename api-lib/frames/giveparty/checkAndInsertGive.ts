import { z, ZodError } from 'zod';

import { fetchPoints } from '../../../_api/hasura/actions/_handlers/createCoLinksGive.ts';
import { insertInteractionEvents } from '../../gql/mutations.ts';
import { insertCoLinksGive } from '../../insertCoLinksGive.ts';
import { findOrCreateProfileByUsername } from '../../neynar/findOrCreate.ts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { fetchProfileInfo } from '../give/fetchProfileInfo.tsx';

import { GivePartyMintCoSoulFrame } from './GivePartyMintCoSoulFrame.tsx';

const skillTrim = z
  .string()
  .trim()
  .transform(v => v.replace(/^#/g, ''));

export const skillSchema = z
  .string()
  .trim()
  .min(1, { message: 'Skill must not be empty' })
  .max(32, { message: 'Skill is max 32 characters' })
  .regex(/^[^\s]*$/, {
    message: 'Skill must not contain any spaces.',
  });

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

export const validateAndCleanUsername = (username?: string): string => {
  try {
    return usernameSchema.parse(usernameTrim.parse(username));
  } catch (e: any) {
    const message = e instanceof ZodError ? e.issues[0]?.message : e.message;
    throw new Error(message);
  }
};

export const validateAndCleanSkill = (skill: string): string => {
  try {
    return skillSchema.parse(skillTrim.parse(skill));
  } catch (e: any) {
    const message = e instanceof ZodError ? e.issues[0]?.message : e.message;
    throw new Error(message);
  }
};

export const checkAndInsertGive = async (
  info: FramePostInfo,
  cast_hash: string,
  frameId: string,
  target_username?: string,
  skill?: string
) => {
  try {
    target_username = validateAndCleanUsername(target_username);
  } catch (e: any) {
    throw new Error('Invalid username: ' + e.message);
  }

  if (!skill) {
    throw new Error('Provide a skill to GIVE for');
  }

  try {
    skill = validateAndCleanSkill(skill);
  } catch (e: any) {
    throw new Error('Invalid skill: ' + e.message);
  }

  // lookup/create the target user
  let target_profile: Awaited<ReturnType<typeof findOrCreateProfileByUsername>>;
  try {
    target_profile = await findOrCreateProfileByUsername(target_username);
  } catch (e: any) {
    console.error(
      `error in checkAndInsertGive.findOrCreateProfileByUsername for ${target_username}`,
      e
    );
    throw new Error(`Can't find user: ${target_username}`);
  }

  if (target_profile.id === info.profile.id) {
    throw new Error(`You can't GIVE to yourself!`);
  }

  const { canGive } = await fetchPoints(info.profile.id);
  if (!canGive) {
    const { hasCoSoul } = await fetchProfileInfo(info.profile.id);
    if (!hasCoSoul) {
      throw GivePartyMintCoSoulFrame;
    } else {
      throw new Error(`You're out of GIVE! Wait until it recharges.`);
    }
  }
  let giveId;
  try {
    const { giveId: gid } = await insertCoLinksGive(
      info.profile,
      target_profile,
      cast_hash,
      skill
    );
    giveId = gid;
  } catch (e: any) {
    throw new Error('Failed to give: ' + e.message);
  }

  await insertInteractionEvents({
    event_type: 'give_party_give',
    profile_id: info.profile.id,
    data: {
      give_party: true,
      frame: frameId,
      give_id: giveId,
      giver_id: info.profile.id,
      giver_name: info.profile.name,
      cast_hash: cast_hash,
      receiver_id: target_profile.id,
      receiver_name: target_profile.name,
      skill,
    },
  });

  return giveId;
};
