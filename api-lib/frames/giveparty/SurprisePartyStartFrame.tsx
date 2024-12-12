import React from 'react';

import { Frame } from '../frames.ts';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PartyText } from '../layoutFragments/PartyText.tsx';
import { START_A_SURPRISE_PARTY_INTENT } from '../routingUrls.ts';

import { getRandomColor, gradientArray } from './JoinedPartyFrame.tsx';
import { usernameResourceIdentifier } from './usernameResourceIdentifier.ts';

const imageNode = async (params: Record<string, string>) => {
  const { username } = params;
  const randomGradient = getRandomColor(gradientArray);
  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background: randomGradient,
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
            <PartyText text={`@${username}`} />
            <div tw="flex flex-row items-center" style={{ gap: 64 }}>
              <div tw="flex flex-col">
                <div tw="flex" style={{ marginTop: 10 }}>
                  GIVE party
                </div>
                <div tw="flex" style={{ marginTop: 10 }}>
                  is ready to go!
                </div>
              </div>
              <div tw="flex" style={{ marginTop: 20, fontSize: 128 }}>
                🥳
              </div>
            </div>
          </div>
        </div>
      </div>
    </FrameWrapper>
  );
};

export const SurprisePartyStartFrame = (username: string): Frame => {
  return {
    id: 'surprise.party.start',
    aspectRatio: '1.91:1',
    homeFrame: true,
    imageNode: imageNode,
    resourceIdentifier: usernameResourceIdentifier,
    buttons: [
      {
        title: '🔊 Cast your Party',
        action: 'link',
        target: START_A_SURPRISE_PARTY_INTENT(username),
      },
    ],
  };
};
