import React from 'react';

import { NotFoundError } from '../../../api-lib/HttpError.ts';
import { OGAvatar } from '../../og/OGAvatar.tsx';
import { FramePostInfo } from '../getFramePostInfo.tsx';
import { Frame } from '../router.ts';

import { getContextFromParams } from './getContextFromParams.ts';
import { GiveGiverFrame } from './GiveGiverFrame.tsx';
import { GiveRandoFrame } from './GiveRandoFrame.tsx';
import { GiveReceiverFrame } from './GiveReceiverFrame.tsx';
import { giveResourceIdentifier } from './giveResourceIdentifier.ts';

const homeFrameImageNode = async (params: Record<string, string>) => {
  const { give } = await getContextFromParams(params);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: '#222',
        color: 'white',
        fontSize: 36,
        position: 'relative',
      }}
    >
      <img
        alt="avatar"
        src={'http://colinks.co.local:3000/imgs/frames/frontdoor-1-1.jpg'}
        style={{ width: '100%' }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <div
          style={{
            padding: 20,
            fontSize: 56,
            background: `linear-gradient(55deg, #0B2131 0%, #0F3244 100%)`,
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <OGAvatar avatar={give.giver_profile_public.avatar} />
            +1 GIVE
            <OGAvatar avatar={give.target_profile_public.avatar} />
          </div>
        </div>
        <div
          style={{
            padding: 30,
            fontSize: 40,
            color: '#ccc',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600 }}>
              {give.giver_profile_public.name}
            </span>
            <span>Total Given XX</span>
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
            <span>Total Received YY</span>
          </div>
        </div>
      </div>
      <div
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
      </div>
    </div>
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
