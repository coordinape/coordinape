import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { OGAvatar } from '../../../_api/og/OGAvatar.tsx';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import {
  FrameBgImage,
  IMAGE_URL_BASE,
} from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from '../layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from '../layoutFragments/FrameHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);

  return (
    <FrameWrapper>
      <FrameBgImage src="persona-4.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #E31A1A 0%, #790066 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <OGAvatar avatar={viewerProfile?.avatar} />
          <div tw="flex items-center grow justify-center">Level 4</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 70, height: 70 }}
          />
        </FrameHeadline>
        <FrameFooter>TODO: STATS</FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

export const PersonaFourFrame: Frame = {
  id: 'persona4',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'View Leaderboard',
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
};