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
        fontSize: 64,
        padding: 16,
        // fontFamily: 'Roboto',
      }}
    >
      <div tw="text-8xl uppercase" style={{ display: 'flex' }}>
        give home frame
      </div>
      <OGAvatar avatar={give.giver_profile_public.avatar} />
      <div>{give.giver_profile_public.name}</div>
      <div>GAVE TO</div>
      <OGAvatar avatar={give.target_profile_public.avatar} />
      <div>{give.target_profile_public.name}</div>
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
    return GiveReceiverFrame;
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
