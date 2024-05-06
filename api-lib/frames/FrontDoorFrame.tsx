import React from 'react';

import { insertInteractionEvents } from '../gql/mutations';

import { FramePostInfo } from './_getFramePostInfo';
import { staticResourceIdentifier } from './_staticResourceIdentifier';
import { Frame } from './frames.ts';
import { getLevelForViewer } from './give/getLevelForViewer';
import { FrameBgImage, IMAGE_URL_BASE } from './layoutFragments/FrameBgImage';
import { FrameBody } from './layoutFragments/FrameBody';
import { FrameBodyGradient } from './layoutFragments/FrameBodyGradient';
import { FrameFooter } from './layoutFragments/FrameFooter';
import { FrameHeadline } from './layoutFragments/FrameHeadline';
import { FrameWrapper } from './layoutFragments/FrameWrapper';
import { PersonaFourFrame } from './personas/PersonaFourFrame';
import { PersonaOneFrame } from './personas/PersonaOneFrame';
import { PersonaThreeFrame } from './personas/PersonaThreeFrame';
import { PersonaTwoFrame } from './personas/PersonaTwoFrame';
import { PersonaZeroFrame } from './personas/PersonaZeroFrame';

const imageNode = async () => {
  const randomArtNumber = Math.floor(Math.random() * 5) + 1;
  return (
    <FrameWrapper>
      <FrameBgImage src={`frontdoor-generic-${randomArtNumber}.jpg`} />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 0%, #0A8F57 0%, #303030 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <div tw="flex items-center grow justify-center">
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'GemWhite.png'}
              style={{ width: 70, height: 70, marginRight: 20 }}
            />
            GIVE
          </div>
        </FrameHeadline>
        <FrameFooter>
          Giving is free.
          <br />
          Let others know you appreciate them.
        </FrameFooter>
      </FrameBody>
    </FrameWrapper>
  );
};

const onPost = async (info: FramePostInfo) => {
  // Enter the Levels persona app
  const level = await getLevelForViewer(info.profile.id);

  await insertInteractionEvents({
    event_type: 'home_frame_click',
    profile_id: info.profile.id,
    data: {
      give_bot: true,
      frame: 'front_door',
      profile_level: level,
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

export const FrontDoor: Frame = {
  id: 'front_door',
  homeFrame: true,
  resourceIdentifier: staticResourceIdentifier,
  imageNode: imageNode,
  buttons: [
    {
      title: 'Get GIVE',
      action: 'post',
      onPost: onPost,
    },
  ],
};
