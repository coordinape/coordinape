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
  const { error_message } = params;

  return (
    <FrameWrapper>
      <FrameBgImage src="error.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #12FAA6 0%, #E71392 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <OGAvatar avatar={viewerProfile?.avatar} />
          <div tw="flex items-center grow justify-center">Hrmmm...</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 70, height: 70 }}
          />
        </FrameHeadline>
        <FrameFooter>
          You got an error
          <br />
          {error_message && `: ${error_message}`}
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

export const ErrorFrame = (message?: string): Frame => ({
  id: 'error_frame',
  homeFrame: false,
  imageNode: imageNode,
  errorMessage: message,
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
});
