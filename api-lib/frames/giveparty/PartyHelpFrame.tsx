import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { START_A_PARTY_INTENT } from '../routingUrls.ts';

const imageNode = async () => {
  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #27A2AA 30%, #068522 100%)',
        }}
      />
      <div tw="flex h-full w-full items-center" style={{ padding: 30 }}>
        <div
          tw="flex flex-col w-full items-center justify-center text-center"
          style={{
            padding: '20px 32px',
            fontSize: 80,
            gap: 40,
            lineHeight: 1,
          }}
        >
          <span>Starting a GIVE Party</span>
          <div tw="flex flex-col items-center" style={{ gap: 10 }}>
            <span style={{ fontSize: 40 }}>Cast with</span>
            <span
              style={{
                background: '#111111',
                padding: '10px 25px 15px',
                borderRadius: 8,
                marginTop: 8,
                color: 'white',
                fontSize: 52,
              }}
            >
              https://give.party/a-skill-to-celebrate
            </span>
          </div>
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
      title: 'Start a Party',
      action: 'link',
      target: START_A_PARTY_INTENT,
    },
  ],
};
