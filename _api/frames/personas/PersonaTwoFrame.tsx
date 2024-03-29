import React from 'react';

import { OGAvatar } from '../../og/OGAvatar';
import { getViewerFromParams } from '../getViewerFromParams';
import { FrameBgImage, IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage';
import { FrameBody } from '../layoutFragments/FrameBody';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient';
import { FrameFooter } from '../layoutFragments/FrameFooter';
import { FrameHeadline } from '../layoutFragments/FrameHeadline';
import { FrameWrapper } from '../layoutFragments/FrameWrapper';
import { Frame } from '../router';

import { personaResourceIdentifier } from './personaResourceIdentifier';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);

  return (
    <FrameWrapper>
      <FrameBgImage src="persona-2.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #0DC0E7 0%, #7908D2 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <OGAvatar avatar={viewerProfile?.avatar} />
          <div tw="flex items-center grow justify-center">Level 2</div>
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
            Send 5 GIVE
            <br />
            to level up more, bruhv
          </div>
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

export const PersonaTwoFrame: Frame = {
  id: 'persona2',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: personaResourceIdentifier,
  buttons: [
    {
      title: 'Try @givebot',
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
};
