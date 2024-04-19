import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { ErrorFrameImage } from '../ErrorFrame.tsx';
import { IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PartyText } from '../layoutFragments/PartyText.tsx';

import { getContextFromParams } from './getContextFromParams.ts';
import { getRandomColor, gradientArray } from './JoinedPartyFrame.tsx';
import { onSendGIVEPost, validateAndCleanSkill } from './onSendGIVEPost.tsx';
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

  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background: randomGradient,
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
          <div tw="flex">Who is{skill === 'based' ? '' : ' great at'}</div>
          <PartyText text={`#${skill}`} />
          <div tw="flex" style={{ marginTop: 10 }}>
            on Farcaster?
          </div>
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

export const GivePartyHomeFrame = (errorMessage?: string): Frame => ({
  id: 'give.party',
  aspectRatio: '1.91:1',
  homeFrame: true,
  resourceIdentifier: skillResourceIdentifier,
  errorMessage: errorMessage,
  clickURL: 'https://give.party',
  imageNode: givePartyImageNode,
  inputText: () => {
    return `Enter a Farcaster @username`;
  },
  buttons: [
    {
      title: 'Send Give',
      action: 'post',
      onPost: onSendGIVEPost,
    },
  ],
});
