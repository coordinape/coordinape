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
  const { error_message } = params;

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
          <div tw="flex items-center grow justify-center">Help Frame</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 70, height: 70 }}
          />
        </FrameHeadline>
        <FrameFooter>
          You got an error
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
      title: `Visit CoLinks for more fun`,
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
});
