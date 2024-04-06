import React from 'react';

import { Frame } from '../../_api/frames/router.tsx';
import { OGAvatar } from '../../_api/og/OGAvatar.tsx';
import { webAppURL } from '../../src/config/webAppURL.ts';
import { coLinksPaths } from '../../src/routes/paths.ts';

import { getViewerFromParams } from './_getViewerFromParams.ts';
import { staticResourceIdentifier } from './_staticResourceIdentifier.ts';
import {
  FrameBgImage,
  IMAGE_URL_BASE,
} from './layoutFragments/FrameBgImage.tsx';
import { FrameBody } from './layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from './layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from './layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from './layoutFragments/FrameHeadline.tsx';
import { FrameWrapper } from './layoutFragments/FrameWrapper.tsx';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);

  return (
    <FrameWrapper>
      <FrameBgImage src="mint-success.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #1AE322 0%, #6C07D1 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <OGAvatar avatar={viewerProfile?.avatar} />
          <div tw="flex items-center grow justify-center">CoSoul Minted</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 70, height: 70 }}
          />
        </FrameHeadline>
        <FrameFooter>
          Level up more
          <br />
          by joining CoLinks and giving GIVE
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
      title: 'Join CoLinks',
      action: 'link',
      target: webAppURL('colinks') + coLinksPaths.wizardStart,
    },
    {
      title: 'Try @givebot',
      action: 'link',
      target:
        'https://warpcast.com/~/compose?text=@givebot @receiverName %23skillTag',
    },
  ],
};
