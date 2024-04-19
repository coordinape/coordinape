import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { webAppURL } from '../../../src/config/webAppURL.ts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';

import { validateAndCleanSkill } from './onSendGIVEPost.tsx';
import { PartyStartFrame } from './PartyStartFrame.tsx';

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
            Kick off a GIVE Party!
          </div>
          <div
            tw="flex"
            style={{ fontSize: 46, fontWeight: 400, opacity: 0.85 }}
          >
            Celebrate people for a skill you care about.
          </div>
          <div
            tw="flex"
            style={{ fontSize: 46, fontWeight: 400, opacity: 0.85 }}
          >
            Party Starters get Rep Points, too
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
  let skill = info.message.inputText;
  if (!skill) {
    return PartyHelpFrame('No skill provided');
  }
  try {
    skill = validateAndCleanSkill(skill);
  } catch (e: any) {
    return PartyHelpFrame(e.message);
  }
  params['skill'] = skill;

  const timeout = new Promise(resolve =>
    setTimeout(() => resolve('timeout'), 100)
  );

  await Promise.race([
    fetch(getFrameUrl('give.party', skill)),
    fetch(getFrameImgUrl('give.party', skill)),
    timeout,
  ]);

  return PartyStartFrame(skill);
};

const FRAME_ROUTER_URL_BASE = `${webAppURL('colinks')}/api/frames/router`;
const getFrameUrl = (frameId: string, resourceId?: string) => {
  let url = `${FRAME_ROUTER_URL_BASE}/meta/${frameId}`;

  if (resourceId) {
    url += `/${resourceId}`;
  }
  return url;
};

const getFrameImgUrl = (frameId: string, resourceId?: string) => {
  let url = `${FRAME_ROUTER_URL_BASE}/img/${frameId}`;

  if (resourceId) {
    url += `/${resourceId}`;
  }
  return url;
};

export const PartyHelpFrame = (error_message?: string): Frame => {
  return {
    id: 'party.help',
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
