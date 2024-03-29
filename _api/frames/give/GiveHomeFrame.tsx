import React from 'react';

import { NotFoundError } from '../../../api-lib/HttpError.ts';
import { OGAvatar } from '../../og/OGAvatar.tsx';
import { FramePostInfo } from '../getFramePostInfo.tsx';
import {
  FrameBgImage,
  IMAGE_URL_BASE,
} from '../layoutFragments/FrameBgImage.tsx';
import { FrameBody } from '../layoutFragments/FrameBody.tsx';
import { FrameBodyGradient } from '../layoutFragments/FrameBodyGradient.tsx';
import { FrameDebugger } from '../layoutFragments/FrameDebugger.tsx';
import { FrameFooter } from '../layoutFragments/FrameFooter.tsx';
import { FrameHeadline } from '../layoutFragments/FrameHeadline.tsx';
import { FrameWrapper } from '../layoutFragments/FrameWrapper.tsx';
import { PersonaFourFrame } from '../personas/PersonaFourFrame.tsx';
import { PersonaOneFrame } from '../personas/PersonaOneFrame.tsx';
import { PersonaThreeFrame } from '../personas/PersonaThreeFrame.tsx';
import { PersonaTwoFrame } from '../personas/PersonaTwoFrame.tsx';
import { PersonaZeroFrame } from '../personas/PersonaZeroFrame.tsx';
import { Frame } from '../router.ts';

import { getContextFromParams } from './getContextFromParams.ts';
import { getLevelForViewer } from './getLevelForViewer.tsx';
import { giveResourceIdentifier } from './giveResourceIdentifier.ts';

const homeFrameImageNode = async (params: Record<string, string>) => {
  const { give } = await getContextFromParams(params);

  return (
    <FrameWrapper>
      <FrameBgImage src="frontdoor-2-1.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 25% 10%, #4992E7 0%, #5508D2 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <OGAvatar avatar={give.giver_profile_public.avatar} />
          <div tw="flex items-center grow justify-center">
            +1
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'GemWhite.png'}
              style={{ width: 70, height: 70, margin: '0 20px' }}
            />
            <span>GIVE</span>
          </div>
          <OGAvatar avatar={give.target_profile_public.avatar} />
        </FrameHeadline>
        <FrameFooter>
          <div
            tw="flex items-center justify-between"
            style={{
              height: 230,
              padding: '20px 32px',
              fontSize: 46,
              fontWeight: 400,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600 }}>
                {give.giver_profile_public.name}
              </span>
              <span>
                Total Given{' '}
                <span style={{ fontWeight: 600, paddingLeft: '.5rem' }}>
                  XX
                </span>
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <span style={{ fontWeight: 600 }}>
                {give.target_profile_public.name}
              </span>
              <span>
                Total Received{' '}
                <span style={{ fontWeight: 600, paddingLeft: '.5rem' }}>
                  XX
                </span>
              </span>
            </div>
          </div>
        </FrameFooter>
      </FrameBody>
      <FrameDebugger profile={give.giver_profile_public} />
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

export const GiveHomeFrame: Frame = {
  id: 'give',
  homeFrame: true,
  resourceIdentifier: giveResourceIdentifier,
  imageNode: homeFrameImageNode,
  buttons: [
    {
      title: 'Enter the Arena',
      action: 'post',
      onPost: onPost,
    },
  ],
};
