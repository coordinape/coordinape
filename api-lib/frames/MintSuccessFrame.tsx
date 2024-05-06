import React from 'react';

import { OGAvatar } from '../../_api/og/OGAvatar.tsx';
import { insertInteractionEvents } from '../gql/mutations.ts';

import { FramePostInfo } from './_getFramePostInfo.tsx';
import { getViewerFromParams } from './_getViewerFromParams.ts';
import { staticResourceIdentifier } from './_staticResourceIdentifier.ts';
import { Frame } from './frames.ts';
import { getLevelForViewer } from './give/getLevelForViewer.tsx';
import {
  FrameBgImage,
  IMAGE_URL_BASE,
} from './layoutFragments/FrameBgImage.tsx';
import { FrameBody } from './layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from './layoutFragments/FrameBodyGradient.tsx';
import { FrameFooter } from './layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from './layoutFragments/FrameHeadline.tsx';
import { FrameWrapper } from './layoutFragments/FrameWrapper.tsx';
import { PersonaFourFrame } from './personas/PersonaFourFrame.tsx';
import { PersonaOneFrame } from './personas/PersonaOneFrame.tsx';
import { PersonaThreeFrame } from './personas/PersonaThreeFrame.tsx';
import { PersonaTwoFrame } from './personas/PersonaTwoFrame.tsx';
import { PersonaZeroFrame } from './personas/PersonaZeroFrame.tsx';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getViewerFromParams(params);

  // TODO: calculate the number of GIVE left to level up

  return (
    <FrameWrapper>
      <FrameBgImage src="mint-success.jpg" />
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
          <div tw="flex items-center grow justify-center">CoSoul Minted</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 80, height: 80 }}
          />
        </FrameHeadline>
        <FrameFooter>
          Level up
          <br />
          by giving more GIVE
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

const onPost = async (info: FramePostInfo) => {
  // Enter the Levels persona app
  const level = await getLevelForViewer(info.profile.id);

  await insertInteractionEvents({
    event_type: 'post_mint_click',
    profile_id: info.profile.id,
    data: {
      give_bot: true,
      frame: 'give',
      profile_level: level,
      clicker_name: info.profile.name,
    },
  });

  // route each level to its respective Persona
  if (level === 1) {
    return PersonaOneFrame;
  } else if (level === 2) {
    return PersonaTwoFrame;
  } else if (level === 3) {
    return PersonaThreeFrame;
  } else if (level === 4) {
    return PersonaFourFrame;
  } else {
    return PersonaZeroFrame;
  }
};

export const MintSuccessFrame: Frame = {
  id: 'cosoul_mint_success',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: staticResourceIdentifier,
  buttons: [
    {
      title: 'Level Up',
      action: 'post',
      onPost,
    },
  ],
};
