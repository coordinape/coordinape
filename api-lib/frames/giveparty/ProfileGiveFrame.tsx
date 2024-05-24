import React from 'react';

import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { Frame } from '../frames.ts';
import { IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { prefetchFrame } from '../prefetchFrame.ts';

import { validateAndCleanSkill } from './checkAndInsertGive.ts';
import { PartyStartFrame } from './PartyStartFrame.tsx';

const imageNode = async (params: Record<string, string>) => {
  const { error_message } = params;
  const { username } = params;
  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #5507E7 20%, #E7A607 100%)',
        }}
      />
      <div
        tw="flex flex-col h-full justify-between"
        style={{ fontSize: 85, fontWeight: 600, padding: '50px 40px' }}
      >
        <div
          tw="flex flex-col overflow-x-auto"
          style={{ marginTop: 40, gap: 20, lineHeight: 1 }}
        >
          <div tw="flex" style={{ marginBottom: 10 }}>
            Send a GIVE!
          </div>
          <div
            tw="flex"
            style={{ fontSize: 46, fontWeight: 400, opacity: 0.85 }}
          >
            Show your appreciation for {username} NAME
          </div>
          <div
            tw="flex"
            style={{ fontSize: 46, fontWeight: 400, opacity: 0.85 }}
          >
            by sending GIVE for a skill.
          </div>
          {error_message && (
            <div
              tw="flex w-full text-center justify-center"
              style={{
                background: 'rgba(0,0,0,0.4)',
                color: '#FF5FFF',
                padding: 10,
                fontSize: 40,
              }}
            >
              {error_message}
            </div>
          )}
        </div>
        <div tw="flex justify-between">
          <div
            tw="flex"
            style={{ fontWeight: 400, fontSize: 40, maxWidth: '50%' }}
          >
            <div tw="flex flex-col">
              <span>Enter a skill below,</span>
              <span>we&apos;ll send your GIVE.</span>
            </div>
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

const prepareParty = async (
  info: FramePostInfo,
  params: Record<string, string>
) => {
  let skill = info.message.inputText;
  if (!skill) {
    return ProfileGiveFrame('No skill provided');
  }
  try {
    skill = validateAndCleanSkill(skill);
  } catch (e: any) {
    return ProfileGiveFrame(e.message);
  }
  params['skill'] = skill;

  const f = PartyStartFrame(skill);
  await prefetchFrame(f, skill);
  return f;
};

export const ProfileGiveFrame = (error_message?: string): Frame => {
  return {
    id: 'profile.give',
    aspectRatio: '1.91:1',
    homeFrame: true,
    imageNode: imageNode,
    resourceIdentifier: staticResourceIdentifier,
    errorMessage: error_message,
    clickURL: 'https://give.party',
    inputText: () => {
      return `Enter a skill to celebrate`;
    },
    buttons: [
      {
        title: 'Start the Party',
        action: 'post',
        onPost: prepareParty,
      },
      {
        title: 'Learn More',
        action: 'link',
        target: 'https://give.party',
      },
    ],
  };
};
