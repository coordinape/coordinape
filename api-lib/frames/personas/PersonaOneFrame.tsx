import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { minted } from '../../../_api/hasura/actions/_handlers/syncCoSoul.ts';
import { OGAvatar } from '../../../_api/og/OGAvatar.tsx';
import {
  getMintInfoFromReceipt,
  mintCoSoulForAddress,
} from '../../../src/features/cosoul/api/cosoul.ts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { ErrorFrame } from '../ErrorFrame.tsx';
import {
  FrameBgImage,
  IMAGE_URL_BASE,
} from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from '../layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from '../layoutFragments/FrameHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { MintSuccessFrame } from '../MintSuccessFrame.tsx';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);

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
          <div tw="flex items-center grow justify-center">Level 1</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 70, height: 70 }}
          />
        </FrameHeadline>
        <FrameFooter>
          Level up more!
          <br />
          Bring your GIVE onchain.
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

const mintCoSoul = async (mintToAddr: string, profileId: number) => {
  try {
    const tx = await mintCoSoulForAddress(mintToAddr);
    const txReceipt = await tx.wait();
    const { tokenId } = await getMintInfoFromReceipt(txReceipt);

    await minted(mintToAddr, tx.hash, tokenId, profileId, false);
  } catch (e) {
    console.error('Error minting CoSoul', e);
    return false;
  }
  return true;
};

const onPost = async (info: FramePostInfo) => {
  const success = await mintCoSoul(info.profile.address, info.profile.id);
  if (!success) {
    return ErrorFrame('Error minting CoSoul');
  }

  return MintSuccessFrame;
};

export const PersonaOneFrame: Frame = {
  id: 'persona1',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'Send me a CoSoul',
      action: 'post',
      onPost: onPost,
    },
  ],
};