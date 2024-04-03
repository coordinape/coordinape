import React from 'react';

import { OGAvatar } from '../og/OGAvatar';

import { getViewerFromParams } from './_getViewerFromParams.ts';
import { staticResourceIdentifier } from './_staticResourceIdentifier.ts';
import { FrameBgImage, IMAGE_URL_BASE } from './layoutFragments/FrameBgImage';
import { FrameBody } from './layoutFragments/FrameBody';
import { FrameBodyGradient } from './layoutFragments/FrameBodyGradient';
import { FrameFooter } from './layoutFragments/FrameFooter';
import { FrameHeadline } from './layoutFragments/FrameHeadline';
import { FrameWrapper } from './layoutFragments/FrameWrapper';
import { Frame } from './router';

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
          <div tw="flex items-center grow justify-center">Mint Success</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 70, height: 70 }}
          />
        </FrameHeadline>
        <FrameFooter>
          You Minted A CoSoul!
          <br />
          Nice Work!!!!
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

export const MintSuccessFrame: Frame = {
  id: 'cosoul_mint_success',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'Visit CoLinks for more fun',
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
};
