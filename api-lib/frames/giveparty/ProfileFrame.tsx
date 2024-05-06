/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

import { webAppURL } from '../../../src/config/webAppURL.ts';
import { Frame, ResourceIdentifierWithParams } from '../frames.ts';
import { IMAGE_URL_BASE } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PartyText } from '../layoutFragments/PartyText.tsx';

import { addressResourceIdentifier } from './addressResourceIdentifier.ts';

const ImageNode = async (params: Record<string, string>) => {
  const { address } = params;
  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #5507E7 20%, #E7A607 100%)',
        }}
      />
      <div tw="flex items-center h-full">
        <div
          tw="w-full flex flex-col"
          style={{
            padding: '20px 32px',
            fontSize: 55,
            fontWeight: 600,
            gap: 5,
          }}
        >
          <div
            tw="flex flex-col justify-center items-center text-center"
            style={{ gap: 2 }}
          >
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'GemWhite.png'}
              style={{ width: 70, height: 70 }}
            />
            <span
              style={{
                fontSize: 70,
                lineHeight: 1,
                fontWeight: 400,
                marginBottom: 20,
              }}
            >
              give.party
            </span>
            <PartyText text={`${address}`} fontSize={48} />
          </div>
          <div tw="flex flex-col" style={{ gap: 30, marginTop: 40 }}>
            {address}
          </div>
        </div>
      </div>
    </FrameWrapper>
  );
};

export const ProfileFrame = (address?: string): Frame => {
  return {
    id: 'giveparty.profile',
    homeFrame: true,
    imageNode: ImageNode,
    noCache: true,
    resourceIdentifier: ResourceIdentifierWithParams(
      addressResourceIdentifier,
      address ? { address } : {}
    ),
    buttons: [
      {
        title: 'View Profile',
        action: 'link',
        target: params =>
          webAppURL('colinks') +
          '/giveparty/' +
          encodeURIComponent(params.address),
      },
    ],
  };
};
