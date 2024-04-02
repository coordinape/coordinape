import React from 'react';

import { OGAvatar } from '../og/OGAvatar';

import { getViewerFromParams } from './getViewerFromParams';
import { FrameBgImage, IMAGE_URL_BASE } from './layoutFragments/FrameBgImage';
import { FrameBody } from './layoutFragments/FrameBody';
import { FrameBodyGradient } from './layoutFragments/FrameBodyGradient';
import { FrameFooter } from './layoutFragments/FrameFooter';
import { FrameHeadline } from './layoutFragments/FrameHeadline';
import { FrameWrapper } from './layoutFragments/FrameWrapper';
import { Frame } from './router';
import { staticResourceIdentifier } from './staticResourceIdentifier';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);

  return (
    <FrameWrapper>
      <FrameBgImage src="persona-1.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #04AFF9 0%, #FFB800 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <OGAvatar avatar={viewerProfile?.avatar} />
          <div tw="flex items-center grow justify-center">
            Generic Front Door Frame
          </div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 70, height: 70 }}
          />
        </FrameHeadline>
        <FrameFooter>Heres how you use GiveBot</FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

export const FrontDoor: Frame = {
  id: 'front_door',
  homeFrame: true,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'Use on Farcaster',
      action: 'link',
      target:
        'https://warpcast.com/~/compose?text=@givebot @singer did some nice work today&embeds[]=https://farcaster.xyz',
    },
  ],
};
