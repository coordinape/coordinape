import React from 'react';

import { staticResourceIdentifier } from './_staticResourceIdentifier';
import { FrameBgImage, IMAGE_URL_BASE } from './layoutFragments/FrameBgImage';
import { FrameBody } from './layoutFragments/FrameBody';
import { FrameBodyGradient } from './layoutFragments/FrameBodyGradient';
import { FrameFooter } from './layoutFragments/FrameFooter';
import { FrameHeadline } from './layoutFragments/FrameHeadline';
import { FrameWrapper } from './layoutFragments/FrameWrapper';
import { Frame } from './router';

const imageNode = async () => {
  const randomArtNumber = Math.floor(Math.random() * 5) + 1;
  return (
    <FrameWrapper>
      <FrameBgImage src={`frontdoor-generic-${randomArtNumber}.jpg`} />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #0A8F57 0%, #303030 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <div tw="flex items-center grow justify-center">
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'GemWhite.png'}
              style={{ width: 70, height: 70, marginRight: 20 }}
            />
            GIVE
          </div>
        </FrameHeadline>
        <FrameFooter>
          Giving is free.
          <br />
          Let others know you appreciate them.
        </FrameFooter>
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
      title: 'Get GIVE',
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
};
