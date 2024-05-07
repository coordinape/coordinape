import React from 'react';

import { findOrCreateProfileByUsername } from '../../neynar/findOrCreateProfileByFid.ts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { Frame } from '../frames.ts';
import { IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { prefetchFrame } from '../prefetchFrame.ts';

import { validateAndCleanUsername } from './checkAndInsertGive.ts';
import { SurprisePartyStartFrame } from './SurprisePartyStartFrame.tsx';

const imageNode = async (params: Record<string, string>) => {
  const { error_message } = params;
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
            Celebrate a Friend!
          </div>
          <div
            tw="flex"
            style={{
              fontSize: 46,
              fontWeight: 400,
              lineHeight: 1.5,
              gap: '0.3em',
            }}
          >
            <span style={{ opacity: 0.85 }}>Let people send them</span>
            <span style={{ fontWeight: 600 }}>GIVE</span>
            <span style={{ opacity: 0.85 }}>for skills they appreciate.</span>
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
              <span>Enter a username below,</span>
              <span>we&apos;ll start your party.</span>
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
  let username = info.message.inputText;
  if (!username) {
    return SurprisePartyHelpFrame('No skill provided');
  }
  try {
    username = validateAndCleanUsername(username);
  } catch (e: any) {
    return SurprisePartyHelpFrame(e.message);
  }
  params['username'] = username;

  // make sure real farcaster user
  try {
    await findOrCreateProfileByUsername(username);
  } catch (e: any) {
    return SurprisePartyHelpFrame(`Can't find user: ${username}`);
  }

  const f = SurprisePartyStartFrame(username);
  await prefetchFrame(f, username);
  return f;
};

export const SurprisePartyHelpFrame = (error_message?: string): Frame => {
  return {
    id: 'surprise.party.help',
    aspectRatio: '1.91:1',
    homeFrame: true,
    imageNode: imageNode,
    resourceIdentifier: staticResourceIdentifier,
    errorMessage: error_message,
    clickURL: 'https://give.party',
    inputText: () => {
      return `Enter a username to celebrate`;
    },
    buttons: [
      {
        title: 'Start the Party 🚀',
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
