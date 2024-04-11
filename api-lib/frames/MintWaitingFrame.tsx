import React from 'react';

import { Frame } from '../../_api/frames/router.tsx';
import { OGAvatar } from '../../_api/og/OGAvatar.tsx';
import { adminClient } from '../gql/adminClient.ts';

import { FramePostInfo } from './_getFramePostInfo.tsx';
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
import { MintSuccessFrame } from './MintSuccessFrame.tsx';

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
          <div tw="flex items-center grow justify-center">Minting...</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 80, height: 80 }}
          />
        </FrameHeadline>
        <FrameFooter>
          Your CoSoul is still minting.
          <br />
          Tap `&apos;Check Mint Progress`&apos; to re-check.
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

const onPost = async (info: FramePostInfo) => {
  // check for mint status
  // TODO: is there any way to handle errors here? IDK!!!!!!!
  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          where: {
            address: { _ilike: info.profile.address },
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'mintWaitingFrame__getMintStatus',
    }
  );
  if (cosouls.length > 0) {
    return MintSuccessFrame;
  }
  return MintWaitingFrame;
};

export const MintWaitingFrame: Frame = {
  id: 'cosoul_mint_waiting',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'Check Mint Progress',
      action: 'post',
      onPost,
    },
  ],
};
