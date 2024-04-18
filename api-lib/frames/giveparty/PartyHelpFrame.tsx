import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { webAppURL } from '../../../src/config/webAppURL.ts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
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
            'radial-gradient(circle at 25% 0%, #A0B907 30%, #F5A408 100%)',
        }}
      />
      <div tw="flex h-full w-full items-center" style={{ padding: 30 }}>
        <div
          tw="flex flex-col w-full items-center justify-center text-center"
          style={{
            padding: '20px 32px',
            fontSize: 80,
            gap: 40,
            lineHeight: 1,
          }}
        >
          <div
            tw="flex flex-col items-center"
            style={{ gap: 16, fontSize: 80 }}
          >
            <span style={{ fontWeight: 600 }}>Kick off a GIVE Party!</span>
            <span style={{ fontSize: 48 }}>
              Celebrate people for a skill you care about.
            </span>
            <span style={{ fontSize: 48 }}>
              Party Starters get Rep Points, too.
            </span>
            {/*<span style={{ fontSize: 40 }}>Cast with</span>*/}
            {/*<span*/}
            {/*  style={{*/}
            {/*    background: '#111111',*/}
            {/*    padding: '10px 25px 15px',*/}
            {/*    borderRadius: 8,*/}
            {/*    marginTop: 8,*/}
            {/*    color: 'white',*/}
            {/*    fontSize: 52,*/}
            {/*  }}*/}
            {/*>*/}
            {/*  https://give.party/a-skill-to-celebrate*/}
            {/*</span>*/}
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
