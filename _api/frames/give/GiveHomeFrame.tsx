import React from 'react';

import { NotFoundError } from '../../../api-lib/HttpError.ts';
import { webAppURL } from '../../../src/config/webAppURL.ts';
import { FrameBody } from '../../og/FrameBody.tsx';
import { FrameFooter } from '../../og/FrameFooter.tsx';
import { FrameHeadline } from '../../og/FrameHeadline.tsx';
import { FrameWrapper } from '../../og/FrameWrapper.tsx';
import { OGAvatar } from '../../og/OGAvatar.tsx';
import { FramePostInfo } from '../getFramePostInfo.tsx';
import { Frame } from '../router.ts';

import { getContextFromParams } from './getContextFromParams.ts';
import { GiveGiverFrame } from './GiveGiverFrame.tsx';
import { GiveRandoFrame } from './GiveRandoFrame.tsx';
import { GiveReceiverFrame } from './GiveReceiverFrame.tsx';
import { giveResourceIdentifier } from './giveResourceIdentifier.ts';

export const IMAGE_URL_BASE = `${webAppURL('colinks')}/public/imgs/frames/`;

const homeFrameImageNode = async (params: Record<string, string>) => {
  const { give } = await getContextFromParams(params);

  return (
    <FrameWrapper>
      <img
        tw="w-full"
        alt="avatar"
        src={IMAGE_URL_BASE + 'frontdoor-2-1.jpg'}
      />
      <FrameBody>
        <div
          tw="absolute bottom-0 w-full flex h-full z-0"
          style={{
            background:
              'radial-gradient(circle at 25% 10%, #4992E7 0%, #5508D2 80%)',
            opacity: 0.7,
          }}
        ></div>
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
      {/* frame stats */}
      {/* <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: 30,
          left: 30,
          padding: 16,
          background: 'rgba(0,0,0, 0.5)',
          color: 'white',
          fontSize: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <span>Giver has given GIVE</span>
          <span>???</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <span>Giver has a cosoul</span>
          <span>{give.giver_profile_public.cosoul?.id ? 'TRUE' : 'FALSE'}</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <span>Giver has received GIVE</span>
          <span>???</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <span>Giver has purchased their own colink</span>
          <span>
            {give.giver_profile_public.links_held &&
            give.giver_profile_public.links_held > 0
              ? 'TRUE'
              : 'FALSE'}
          </span>
        </div>
      </div> */}
    </FrameWrapper>
  );
};

const onPost = async (info: FramePostInfo, params: Record<string, string>) => {
  // who are you? which frame to return
  const { give } = await getContextFromParams(params);
  if (!give || !give.target_profile_public || !give.giver_profile_public) {
    throw new NotFoundError('give not found');
  }

  type role = 'rando' | 'giver' | 'target';

  let role: role = 'rando';
  if (info.profile.id === give.giver_profile_public.id) {
    role = 'giver';
  } else if (info.profile.id === give.target_profile_public.id) {
    role = 'target';
  }

  if (role === 'giver') {
    return GiveGiverFrame;
  } else if (role === 'target') {
    return await GiveReceiverFrame;
  } else {
    return GiveRandoFrame;
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
