import React from 'react';

import { Frame } from '../../../_api/frames/router.tsx';
import { NotFoundError } from '../../HttpError.ts';
import { FramePostInfo } from '../_getFramePostInfo.tsx';
import { FrameBgImage } from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PersonaFourFrame } from '../personas/PersonaFourFrame.tsx';
import { PersonaOneFrame } from '../personas/PersonaOneFrame.tsx';
import { PersonaThreeFrame } from '../personas/PersonaThreeFrame.tsx';
import { PersonaTwoFrame } from '../personas/PersonaTwoFrame.tsx';
import { PersonaZeroFrame } from '../personas/PersonaZeroFrame.tsx';

import { fetchProfileInfo } from './fetchProfileInfo.tsx';
import { getContextFromParams } from './getContextFromParams.ts';
import { getLevelForViewer, getLevelFromInfo } from './getLevelForViewer.tsx';
import { giveResourceIdentifier } from './giveResourceIdentifier.ts';

const homeFrameImageNode = async (params: Record<string, string>) => {
  // eslint-disable-next-line no-console
  console.log('homeFrameImageNode.start');
  const { give } = await getContextFromParams(params);
  const giverInfo = await fetchProfileInfo(give.giver_profile_public.id);

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { numGiveSent: giverTotalGiven } = giverInfo;

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { numGiveReceived: receiverTotalReceived } = await fetchProfileInfo(
    give.target_profile_public.id
  );
  const giverLevel = getLevelFromInfo(giverInfo);
  const randomArtNumber = (give.id % 5) + 1;

  // eslint-disable-next-line no-console
  console.log('homeFrameImageNode.return frame');
  return (
    <FrameWrapper>
      <FrameBgImage src={`frontdoor-${giverLevel}-${randomArtNumber}.jpg`} />
      <FrameBody>
        <div>lol</div>
      </FrameBody>
    </FrameWrapper>
  );
};

const onPost = async (info: FramePostInfo, params: Record<string, string>) => {
  // who are you? which frame to return
  const { give } = await getContextFromParams(params);
  if (!give || !give.target_profile_public || !give.giver_profile_public) {
    throw new NotFoundError('give not found');
  }

  // Enter the Levels persona app
  const level = await getLevelForViewer(info.profile.id);

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

export const GiveHomeFrame2: Frame = {
  id: 'give2',
  homeFrame: true,
  resourceIdentifier: giveResourceIdentifier,
  imageNode: homeFrameImageNode,
  buttons: [
    {
      title: 'Get GIVE',
      action: 'post',
      onPost: onPost,
    },
  ],
};
