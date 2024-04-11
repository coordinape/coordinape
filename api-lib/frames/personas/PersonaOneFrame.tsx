import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { minted } from '../../../_api/hasura/actions/_handlers/syncCoSoul.ts';
import { OGAvatar } from '../../../_api/og/OGAvatar.tsx';
import {
  getMintInfoFromReceipt,
  mintCoSoulForAddress,
} from '../../../src/features/cosoul/api/cosoul.ts';
import { insertInteractionEvents } from '../../gql/mutations.ts';
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
import { MintWaitingFrame } from '../MintWaitingFrame.tsx';

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
            style={{ width: 80, height: 80 }}
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
    // hey maybe its already minted

    console.error('Error minting CoSoul', e);
    return false;
  }
  return true;
};

const onPost = async (info: FramePostInfo) => {
  // lets try to mint for 2 seconds then return a waiting frame
  const timeout = new Promise(resolve =>
    setTimeout(() => resolve('timeout'), 2000)
  );

  // Attempt to mint CoSoul, racing against the timeout
  const result = await Promise.race([
    mintCoSoul(info.profile.address, info.profile.id),
    timeout,
  ]);

  await insertInteractionEvents({
    event_type: 'frame_cosoul_mint',
    profile_id: info.profile.id,
    data: {
      give_bot: true,
      frame: 'persona1',
    },
  });

  if (result === 'timeout') {
    // If the mintCoSoul function takes longer than 2 seconds
    // eslint-disable-next-line no-console
    console.log('CoSoul Frame Mint timeout occurred');
    return MintWaitingFrame;
  } else if (!result) {
    // If mintCoSoul completes but returns a falsy value indicating failure
    // eslint-disable-next-line no-console
    console.log('CoSoul Frame Mint error occurred');
    return ErrorFrame('Error minting CoSoul');
  }

  // If mintCoSoul succeeds before the timeout
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
