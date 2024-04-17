import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { getFrameUrl } from '../../../_api/webhooks/neynar_mention.ts';
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

const givePartyImageNode = async (params: Record<string, string>) => {
  const { skill } = await getContextFromParams(params);
  const { error_message } = params;
  if (!validSkill(skill)) {
    return ErrorFrameImage({
      ...params,
      error_message: 'Invalid Skill: ' + skill,
    });
  }
  // const { numGiveSent: giverTotalGiven } = await fetchProfileInfo(
  //   give.giver_profile_public.id
  // );
  // const { numGiveReceived: receiverTotalReceived } = await fetchProfileInfo(
  //   give.target_profile_public.id
  // );
  // const giverLevel = await getLevelForViewer(give.giver_profile_public.id);
  // const randomArtNumber = (give.id % 5) + 1;

  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #E31A1A 0%, #790066 80%)',
        }}
      />
      <div
        tw="flex h-full items-center text-center"
        style={{ fontSize: 60, fontWeight: 600 }}
      >
        <div tw="flex flex-col" style={{ gap: 60 }}>
          its a give party yall big up the people who are good at stuff
          <div tw="flex items-center justify-center">
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'GemWhite.png'}
              style={{ width: 70, height: 70, margin: '0 20px' }}
            />
            <span>#{skill}</span>
          </div>
        </div>
        {error_message && (
          <div
            tw="flex w-full text-center justify-center"
            style={{
              background: 'black',
              padding: 20,
              position: 'absolute',
              bottom: 0,
              fontSize: 40,
            }}
          >
            {error_message}
          </div>
        )}
      </div>
    </FrameWrapper>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validSkill = (_skill: string) => {
  // TODO: check if skill is valid , trim it, etc, eliminate # .. zod?
  return true;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validUsername = (_username: string | undefined): boolean => {
  // TODO: validate and sanitize/trim the username
  return true;
};

const onPost = async (info: FramePostInfo, params: Record<string, string>) => {
  // who are you? which frame to return
  const { skill } = await getContextFromParams(params);
  // TODO: render failure
  // TODO: zod validation
  if (!validSkill(skill)) {
    return GivePartyHomeFrame('Invalid Skill: ' + skill);
  }

  const {
    inputText,
    castId: { hash: cast_hash },
  } = info.message;

  // look up the user
  // TODO: validate the inputText w/ Zod?
  // TODO: render failure
  if (!inputText || !validUsername(inputText)) {
    return GivePartyHomeFrame('Invalid Username: ' + inputText);
  }

  const cleanedUsername = cleanUsernameText(inputText);

  // lookup/create the target user
  // TODO: handle this not working
  let target_profile: Awaited<ReturnType<typeof findOrCreateProfileByUsername>>;
  try {
    target_profile = await findOrCreateProfileByUsername(cleanedUsername);
  } catch (e: any) {
    return GivePartyHomeFrame(`Can't find user: ${inputText}`);
  }

  let giveId;
  try {
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
  // TODO: Uncomment when testing with real casts
  // await publishCast(`GIVE Delivered`, {
  //   replyTo: cast_hash,
  //   embeds: [{ url: getFrameUrl('give', giveId) }],
  // });

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

const cleanUsernameText = (input: string): string => {
  return input.trim().replace(/^@/g, '');
};
