import React from 'react';

import { OGAvatar } from '../../og/OGAvatar';
import { getViewerFromParams } from '../getViewerFromParams';
import { FrameBgImage, IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage';
import { FrameBody } from '../layoutFragments/FrameBody';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient';
import { FrameDebugger } from '../layoutFragments/FrameDebugger';
import { FrameFooter } from '../layoutFragments/FrameFooter';
import { FrameHeadline } from '../layoutFragments/FrameHeadline';
import { FrameWrapper } from '../layoutFragments/FrameWrapper';
import { Frame } from '../router';
import { staticResourceIdentifier } from '../staticResourceIdentifier';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);

  return (
    <FrameWrapper>
      <FrameBgImage src="persona-0.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #135A95 0%, #092031 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <OGAvatar avatar={viewerProfile?.avatar} />
          <div tw="flex items-center grow justify-center">Level 0</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 70, height: 70 }}
          />
        </FrameHeadline>
        <FrameFooter>
          {' '}
          <div
            tw="w-full flex flex-col text-center justify-center items-center"
            style={{
              height: 230,
              padding: '20px 32px',
              fontSize: 46,
            }}
          >
            Welcome, {viewerProfile?.name}!
            <br />
            Get started by Sending GIVE.
          </div>
        </FrameFooter>
      </FrameBody>
      <FrameDebugger profile={viewerProfile} />
    </FrameWrapper>
  );
};

export const PersonaZeroFrame: Frame = {
  id: 'persona0',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'Try @givebot',
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
};
