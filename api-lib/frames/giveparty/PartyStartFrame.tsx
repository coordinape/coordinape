import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PartyText } from '../layoutFragments/PartyText.tsx';
import { START_A_PARTY_INTENT } from '../routingUrls.ts';

import { skillResourceIdentifier } from './skillResourceIdentifier.ts';

const imageNode = async (params: Record<string, string>) => {
  const { skill } = params;
  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #A007B9 30%, #F5A408 100%)',
        }}
      />
      <div tw="flex h-full w-full items-center">
        <div
          tw="flex flex-col w-full items-center justify-center text-center"
          style={{
            fontSize: 80,
            lineHeight: 1,
          }}
        >
          <div
            tw="flex flex-col overflow-x-auto"
            style={{ gap: 10, lineHeight: 1, fontWeight: 600, marginTop: -30 }}
          >
            <div tw="flex">Your</div>
            <PartyText text={`#${skill}`} />
            <div tw="flex" style={{ marginTop: 10 }}>
              party is ready to go!
            </div>
            <div tw="flex" style={{ marginTop: 20 }}>
              🥳
            </div>
          </div>
        </div>
      </div>
    </FrameWrapper>
  );
};

export const PartyStartFrame = (skill: string): Frame => {
  return {
    id: 'party.start',
    aspectRatio: '1.91:1',
    homeFrame: true,
    imageNode: imageNode,
    resourceIdentifier: skillResourceIdentifier,
    clickURL: 'https://give.party',
    buttons: [
      {
        title: 'Cast the Party',
        action: 'link',
        target: START_A_PARTY_INTENT(skill),
      },
    ],
  };
};
