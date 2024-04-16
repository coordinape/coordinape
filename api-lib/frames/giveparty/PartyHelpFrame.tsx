import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { FrameBgImage } from '../layoutFragments/FrameBgImage.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { TRY_GIVEBOT_INTENT } from '../routingUrls.ts';

const imageNode = async () => {
  return (
    <FrameWrapper>
      <FrameBgImage src="help.jpg" />
      <div
        tw="w-full grow flex flex-col text-center justify-center items-center"
        style={{
          fontSize: 40,
          fontWeight: 600,
          gap: 20,
          background:
            'radial-gradient(circle at 25% 0%, #ABC3C3 0%, #939393 80%)',
        }}
      >
        <div tw="flex flex-col items-center">
          <span>Reply to any cast with</span>
          <div tw="flex items-center">
            <span
              style={{
                background: '#111111',
                padding: '8px 25px',
                borderRadius: 8,
                marginTop: 8,
                color: 'white',
              }}
            >
              @givebot
            </span>
            <span style={{ margin: '0 20px', fontWeight: 400, fontSize: 32 }}>
              OR
            </span>
            <span
              style={{
                background: '#111111',
                padding: '8px 25px',
                borderRadius: 8,
                marginTop: 8,
                color: 'white',
              }}
            >
              @givebot #skillTag
            </span>
          </div>
        </div>
        <div tw="flex flex-col items-center">
          <span>Or Cast with</span>
          <span
            style={{
              background: '#111111',
              padding: '8px 25px',
              borderRadius: 8,
              marginTop: 8,
              color: 'white',
            }}
          >
            @givebot @receiverName #skillTag
          </span>
        </div>
        <div tw="flex flex-col items-center">
          <span>{`GIVE Matters! Recognize friends' skills and build onchain reputation.`}</span>
          <span
            style={{
              background: 'white',
              padding: '8px 25px',
              borderRadius: 8,
              marginTop: 8,
              color: '#111111',
            }}
          >
            @givebot help
          </span>
        </div>
      </div>
    </FrameWrapper>
  );
};

export const PartyHelpFrame: Frame = {
  id: 'party.help',
  aspectRatio: '1.91:1',
  homeFrame: true,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  // TODO: change this
  buttons: [
    {
      title: 'Learn More',
      action: 'link',
      target: 'https://docs.coordinape.com/colinks/give',
    },
    {
      title: 'Try @givebot',
      action: 'link',
      target: TRY_GIVEBOT_INTENT,
    },
  ],
};
