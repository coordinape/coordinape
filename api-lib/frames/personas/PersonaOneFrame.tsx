import React from 'react';

import { fetchPoints } from '../../../_api/hasura/actions/_handlers/createCoLinksGive.ts';
import { minted } from '../../../_api/hasura/actions/_handlers/syncCoSoul.ts';
import { insertInteractionEvents } from '../../gql/mutations.ts';
import {
  getMintInfoFromReceipt,
  mintCoSoulForAddress,
} from '../../viem/contracts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { getViewerFromParams } from '../_getViewerFromParams.ts';
import { staticResourceIdentifier } from '../_staticResourceIdentifier.ts';
import { ErrorFrame } from '../ErrorFrame.tsx';
import { Frame } from '../frames.ts';
import { fetchProfileInfo } from '../give/fetchProfileInfo.tsx';
import { FrameBgImage } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from '../layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from '../layoutFragments/FrameHeadline.tsx';
import { FramePersonaHeadline } from '../layoutFragments/FramePersonaHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { MintSuccessFrame } from '../MintSuccessFrame.tsx';
import { MintWaitingFrame } from '../MintWaitingFrame.tsx';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);
  const {
    numGiveSent: giverTotalGiven,
    numGiveReceived: receiverTotalReceived,
  } = await fetchProfileInfo(viewerProfile?.id);
  const { give } = await fetchPoints(viewerProfile?.id);

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
          <FramePersonaHeadline
            avatar={viewerProfile?.avatar}
            giverTotalGiven={giverTotalGiven}
            receiverTotalReceived={receiverTotalReceived}
            giveAvailable={give}
            level="1"
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

export const mintCoSoul = async (mintToAddr: string, profileId: number) => {
  try {
    const txReceipt = await mintCoSoulForAddress(mintToAddr);
    const { tokenId } = await getMintInfoFromReceipt(txReceipt);

    await minted(
      mintToAddr,
      txReceipt.transactionHash,
      Number(tokenId),
      profileId,
      false
    );
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
  noCache: true,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'Send me a CoSoul NFT',
      action: 'post',
      onPost: onPost,
    },
  ],
};
