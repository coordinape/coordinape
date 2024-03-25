import React from 'react';

import { NotFoundError } from '../../../../../api-lib/HttpError.ts';
import { OGAvatar } from '../../../../og/OGAvatar.tsx';
import { FramePostInfo } from '../../../getFramePostInfo.tsx';
import { Frame } from '../../router.ts';

import {
  getGiveFromParams,
  giveResourceIdentifier,
} from './getGiveFromParams.ts';
import { GiveGiverFrame } from './GiveGiverFrame.tsx';

const homeFrameImageNode = async (params: Record<string, string>) => {
  const give = await getGiveFromParams(params);
  if (!give || !give.target_profile_public || !give.giver_profile_public) {
    throw new NotFoundError('give not found');
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        fontSize: 64,
        padding: 16,
      }}
    >
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
  const give = await getGiveFromParams(params);
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
  }

  // TODO: hey @singer fix this
  // } else if (role === 'target') {
  //     // const s = <TargetFrame give={give} />;
  //     // const sString = ReactDOM.renderToString(s);
  //     // return res.status(200).send(sString);
  // } else if (role === 'rando') {
  //     const s = <RandoFrame give={give} />;
  //     const sString = ReactDOM.renderToString(s);
  //     return res.status(200).send(sString);

  return GiveHomeFrame;
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
