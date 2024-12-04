import React from 'react';

import { ErrorFrameImage } from '../ErrorFrame.tsx';
import { Frame, ResourceIdentifierWithParams } from '../frames.ts';
import { IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PartyText } from '../layoutFragments/PartyText.tsx';

import { validateAndCleanSkill } from './checkAndInsertGive.ts';
import { getContextFromParams } from './getContextFromParams.ts';
import { getRandomColor, gradientArray } from './JoinedPartyFrame.tsx';
import { onSendGIVEPost } from './onSendGIVEPost.tsx';
import { skillResourceIdentifier } from './skillResourceIdentifier.ts';

const givePartyImageNode = async (params: Record<string, string>) => {
  let { skill } = await getContextFromParams(params);
  const { error_message } = params;

  const randomGradient = getRandomColor(gradientArray);

  try {
    skill = validateAndCleanSkill(skill);
  } catch (e: any) {
    return ErrorFrameImage({ error_message: 'Invalid Skill: ' + e.message });
  }
  const workedWith = skill === 'worked-with';

  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background: workedWith
            ? 'radial-gradient(circle at 25% 0%, #0F2A37 20%, #101010 100%)'
            : randomGradient,
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
          <div tw="flex">
            {skill === 'based'
              ? 'Who is'
              : workedWith
                ? 'Who have you'
                : 'Who is great at'}
          </div>
          <div tw="flex">
            <PartyText text={`#${skill}`} icebreaker />
            {workedWith && (
              <div tw="flex" style={{ marginTop: 9 }}>
                ?
              </div>
            )}
          </div>
          {!workedWith && (
            <div tw="flex" style={{ marginTop: 10 }}>
              on Farcaster?
            </div>
          )}
        </div>

        {error_message && (
          <div
            tw="flex w-full text-center justify-center"
            style={{
              background: '#FF5FFF',
              color: 'black',
              padding: 5,
              fontSize: 40,
            }}
          >
            {error_message}
          </div>
        )}
        <div tw="flex justify-between items-end">
          <div
            tw="flex flex-col"
            style={{ fontWeight: 400, fontSize: 40, maxWidth: '55%', gap: 20 }}
          >
            Enter a name below, we&apos;ll send them a GIVE on your behalf
            {workedWith && ', creating an onchain attestation'}
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'coordinape-x-icebreaker.png'}
              style={{ width: 549, height: 50 }}
            />
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

export const GivePartyHomeFrame = (
  errorMessage?: string,
  skill?: string
): Frame => ({
  id: 'give.party',
  aspectRatio: '1.91:1',
  homeFrame: true,
  resourceIdentifier: ResourceIdentifierWithParams(
    skillResourceIdentifier,
    skill
      ? {
          skill,
        }
      : {}
  ),
  errorMessage: errorMessage,
  clickURL: 'https://give.party',
  imageNode: givePartyImageNode,
  inputText: async () => {
    return `Enter a Farcaster @username`;
  },
  buttons: [
    {
      title: 'Send GIVE 🎁',
      action: 'post',
      onPost: onSendGIVEPost,
    },
  ],
});
