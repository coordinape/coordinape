import React from 'react';

import { z, ZodError } from 'zod';

import { Frame } from '../../../_api/frames/router.tsx';
import { getFrameUrl } from '../../../_api/webhooks/neynar_mention.ts';
import { IS_LOCAL_ENV } from '../../config.ts';
import { insertInteractionEvents } from '../../gql/mutations.ts';
import { insertCoLinksGive } from '../../insertCoLinksGive.ts';
import { findOrCreateProfileByUsername } from '../../neynar/findOrCreateProfileByFid.ts';
import { publishCast } from '../../neynar.ts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { ErrorFrameImage } from '../ErrorFrame.tsx';
import { IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';

import { getContextFromParams } from './getContextFromParams.ts';
import { JoinedPartyFrame } from './JoinedPartyFrame.tsx';
import { skillResourceIdentifier } from './skillResourceIdentifier.ts';

const usernameTrim = z
  .string()
  .trim()
  .transform(v => v.replace(/^@/g, ''));
const skillTrim = z
  .string()
  .trim()
  .transform(v => v.replace(/^#/g, ''));

const usernameSchema = z
  .string()
  .trim()
  .regex(/^[^\s]*$/, {
    message: 'Username must not contain any spaces.',
  })
  .min(1, { message: 'Username must not be empty' })
  .max(17, { message: 'Username is max 17 characters' });

const skillSchema = z
  .string()
  .trim()
  .min(1, { message: 'Skill must not be empty' })
  .max(32, { message: 'Skill is max 32 characters' })
  .regex(/^[^\s]*$/, {
    message: 'Skill must not contain any spaces.',
  });

const givePartyImageNode = async (params: Record<string, string>) => {
  let { skill } = await getContextFromParams(params);
  const { error_message } = params;

  try {
    skill = validateAndCleanSkill(skill);
  } catch (e: any) {
    return ErrorFrameImage({ error_message: 'Invalid Skill: ' + e.message });
  }

  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #7516BF 0%, #00AEF9 80%)',
        }}
      />
      <div
        tw="flex flex-col h-full justify-between"
        style={{ fontSize: 80, fontWeight: 600, padding: '50px 40px' }}
      >
        <div
          tw="flex flex-col overflow-x-auto"
          style={{ gap: 20, lineHeight: 1 }}
        >
          <div tw="flex">Who is great at</div>
          <div
            tw="flex relative whitespace-norwap "
            style={{ marginBottom: 10, fontSize: 90 }}
          >
            <span
              tw="absolute"
              style={{
                color: '#7647FF',
                opacity: 0.75,
                left: -16,
                top: 0,
              }}
            >
              #{skill}
            </span>
            <span
              tw="absolute"
              style={{
                color: '#FF1FFF',
                opacity: 0.75,
                left: -10,
                top: 8,
              }}
            >
              #{skill}
            </span>
            <span
              tw="absolute"
              style={{
                color: '#FF5FFF',
                opacity: 0.75,
                left: -6,
                top: 4,
              }}
            >
              #{skill}
            </span>
            <span
              tw="absolute"
              style={{
                color: '#FFF',
              }}
            >
              #{skill}
            </span>
            <span style={{ opacity: 0 }}>.</span>
          </div>
          <div tw="flex">on Farcaster?</div>
        </div>

        {error_message && (
          <div
            tw="flex w-full text-center justify-center"
            style={{
              background: '#FF5FFF',
              color: 'black',
              padding: 10,
              fontSize: 40,
            }}
          >
            {error_message}
          </div>
        )}
        <div tw="flex justify-between">
          <div
            tw="flex"
            style={{ fontWeight: 400, fontSize: 40, maxWidth: '50%' }}
          >
            Enter a name below, we&apos;ll send them a GIVE on your behalf
          </div>
          <div
            tw="flex items-center"
            style={{ fontSize: 70, fontWeight: 400, gap: 20 }}
          >
            <span>give.party</span>
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'GemWhite.png'}
              style={{ width: 90, height: 90 }}
            />
          </div>
        </div>
      </div>
    </FrameWrapper>
  );
};

const validateAndCleanSkill = (skill: string): string => {
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

const onPost = async (info: FramePostInfo, params: Record<string, string>) => {
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
    username = validateAndCleanUsername(username);
  } catch (e: any) {
    return GivePartyHomeFrame('Invalid Username: ' + e.message);
  }

  // lookup/create the target user
  let target_profile: Awaited<ReturnType<typeof findOrCreateProfileByUsername>>;
  try {
    target_profile = await findOrCreateProfileByUsername(username);
  } catch (e: any) {
    return GivePartyHomeFrame(`Can't find user: ${inputText}`);
  }

  let giveId;
  try {
    // TODO: canhazgive?
    // TODO: there is points validation that needs to happen here, the mention webhook does it
    // TODO: handle failure of this
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
      receiver_id: target_profile.id,
      receiver_name: target_profile.name,
      skill,
    },
  });

  // TODO: pre-cache give frames? make a helper for all this ?
  if (!IS_LOCAL_ENV) {
    await publishCast(`GIVE Delivered to @${username} for #${skill}`, {
      replyTo: cast_hash,
      embeds: [{ url: getFrameUrl('give', giveId) }],
    });
  }

  return JoinedPartyFrame;
};

export const GivePartyHomeFrame = (errorMessage?: string): Frame => ({
  id: 'give.party',
  aspectRatio: '1.91:1',
  homeFrame: true,
  resourceIdentifier: skillResourceIdentifier,
  errorMessage: errorMessage,
  imageNode: givePartyImageNode,
  inputText: () => {
    return `Enter a Farcaster @username`;
  },
  buttons: [
    {
      title: 'Send Give',
      action: 'post',
      onPost: onPost,
    },
  ],
});
