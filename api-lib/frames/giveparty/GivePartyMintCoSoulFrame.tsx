import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { insertInteractionEvents } from '../../gql/mutations.ts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { ErrorFrame } from '../ErrorFrame.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { mintCoSoul } from '../personas/PersonaOneFrame.tsx';

import { GivePartyHomeFrame } from './GivePartyHomeFrame.tsx';
import { GivePartyMintWaitingFrame } from './GivePartyMintWaitingFrame.tsx';
import { skillResourceIdentifier } from './skillResourceIdentifier.ts';

const imageNode = async (/*_params: Record<string, string>*/) => {
  return (
    <FrameWrapper>
      <FrameBodyGradient
        gradientStyles={{
          background:
            'radial-gradient(circle at 25% 0%, #7516BF 0%, #00AEF9 80%)',
        }}
      />
      <div
        tw="flex flex-col h-full justify-between"
        style={{ fontSize: 80, fontWeight: 600, padding: '50px 40px' }}
      >
        <div
          tw="flex flex-col overflow-x-auto"
          style={{ gap: 20, lineHeight: 1 }}
        >
          <div tw="flex">{`You're out of GIVE!`}</div>
          <div tw="flex">Want more GIVE?</div>
          <div tw="flex">{`We'll send you a CoSoul NFT`}</div>
        </div>
      </div>
    </FrameWrapper>
  );
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
      give_bot: false,
      frame: 'give.party_cosoul_mint',
    },
  });

  if (result === 'timeout') {
    // If the mintCoSoul function takes longer than 2 seconds
    // eslint-disable-next-line no-console
    console.log('CoSoul Frame Mint timeout occurred');
    return GivePartyMintWaitingFrame;
  } else if (!result) {
    // If mintCoSoul completes but returns a falsy value indicating failure
    // eslint-disable-next-line no-console
    console.log('CoSoul Frame Mint error occurred');
    return ErrorFrame('Error minting CoSoul');
  }

  // If mintCoSoul succeeds before the timeout
  // TODO: success message instead of error message would be nice
  return GivePartyHomeFrame('CoSoul Minted - you have more GIVE');
};

export const GivePartyMintCoSoulFrame: Frame = {
  id: 'party.mint.cosoul',
  aspectRatio: '1.91:1',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: skillResourceIdentifier,
  buttons: [
    {
      title: 'Send me a CoSoul NFT',
      action: 'post',
      onPost: onPost,
    },
  ],
};
