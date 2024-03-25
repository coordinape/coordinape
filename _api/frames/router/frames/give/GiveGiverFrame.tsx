import React from 'react';

import { NotFoundError } from '../../../../../api-lib/HttpError.ts';
import { OGAvatar } from '../../../../og/OGAvatar.tsx';
import { CoolFrame } from '../../router.ts';

import {
  getGiveFromParams,
  giveResourceIdentifier,
} from './getGiveFromParams.ts';

const giverImageNode = async (params: Record<string, string>) => {
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
      <div>YOU</div>
      <div>GAVE TO</div>
      <OGAvatar avatar={give.target_profile_public.avatar} />
      <div>{give.target_profile_public.name}</div>
    </div>
  );
};

export const GiveGiverFrame: CoolFrame = {
  id: 'give/giver',
  homeFrame: false,
  imageNode: giverImageNode,
  resourceIdentifier: giveResourceIdentifier,
  buttons: [
    {
      title: "OK it's me i did the give",
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
};
