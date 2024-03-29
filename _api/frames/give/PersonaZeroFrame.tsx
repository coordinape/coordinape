import React from 'react';

import { FrameBgImage, IMAGE_URL_BASE } from '../../og/FrameBgImage';
import { FrameBody } from '../../og/FrameBody';
import { FrameBodyGradient } from '../../og/FrameBodyGradient';
import { FrameDebugger } from '../../og/FrameDebugger';
import { FrameFooter } from '../../og/FrameFooter';
import { FrameHeadline } from '../../og/FrameHeadline';
import { FrameWrapper } from '../../og/FrameWrapper';
import { OGAvatar } from '../../og/OGAvatar';
import { Frame } from '../router';

import { getContextFromParams } from './getContextFromParams';
import { giveResourceIdentifier } from './giveResourceIdentifier';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getContextFromParams(params);

  return (
    <FrameWrapper>
      <FrameBgImage src="persona-0.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 20% 10%, #135A95 0%, #092031 80%)',
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
            Get started by Sending GIVE
          </div>
        </FrameFooter>
      </FrameBody>
      <FrameDebugger profile={viewerProfile} />
    </FrameWrapper>
  );
};

export const PersonaZeroFrame: Frame = {
  id: 'give/rando',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: giveResourceIdentifier,
  buttons: [
    {
      title: 'Try @givebot',
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
};
