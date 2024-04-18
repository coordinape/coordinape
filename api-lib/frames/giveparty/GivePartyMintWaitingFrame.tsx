import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { OGAvatar } from '../../../_api/og/OGAvatar.tsx';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import {
  FrameBgImage,
  IMAGE_URL_BASE,
} from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from '../layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from '../layoutFragments/FrameHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { isMintingDone } from '../MintWaitingFrame.tsx';

import { GivePartyHomeFrame } from './GivePartyHomeFrame.tsx';
import { skillResourceIdentifier } from './skillResourceIdentifier.ts';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);

  return (
    <FrameWrapper>
      <FrameBgImage src="minting.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #0DE78B 0%, #7908D2 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <OGAvatar avatar={viewerProfile?.avatar} />
          <div tw="flex items-center grow justify-center">Minting</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 80, height: 80 }}
          />
        </FrameHeadline>
        <FrameFooter>
          Your CoSoul is still minting.
          <br />
          Tap below to Check Progress.
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

const onPost = async (info: FramePostInfo) => {
  // check for mint status
  if (await isMintingDone(info.profile.address)) {
    return GivePartyHomeFrame('CoSoul Minted - you have more GIVE');
  }
  return GivePartyMintWaitingFrame;
};

export const GivePartyMintWaitingFrame: Frame = {
  id: 'party.mint.cosoul.waiting',
  homeFrame: false,
  imageNode: imageNode,
  clickURL: 'https://give.party',
  resourceIdentifier: skillResourceIdentifier,
  buttons: [
    {
      title: 'Refresh Mint Progress',
      action: 'post',
      onPost,
    },
  ],
};
