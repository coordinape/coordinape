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
          <div
            tw="flex flex-col overflow-x-auto"
            style={{ gap: 20, lineHeight: 1, fontWeight: 600 }}
          >
            <div tw="flex">Your</div>
            <PartyText text={`#${skill}`} />
            <div tw="flex" style={{ marginTop: 10 }}>
              party is ready to go!
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
        title: 'Cast your Party',
        action: 'link',
        target: START_A_PARTY_INTENT(skill),
      },
    ],
  };
};
