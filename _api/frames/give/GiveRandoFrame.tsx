import React from 'react';

import { OGAvatar } from '../../og/OGAvatar';
import { Frame } from '../router';

import { getContextFromParams } from './getContextFromParams';
import { giveResourceIdentifier } from './giveResourceIdentifier';

const imageNode = async (params: Record<string, string>) => {
  const { give, viewerProfile } = await getContextFromParams(params);

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
      <div>You, {viewerProfile?.name} are neither of them</div>
    </div>
  );
};

export const GiveRandoFrame: Frame = {
  id: 'give/rando',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: giveResourceIdentifier,
  buttons: [
    {
      title: 'i wanna start giving give, but not sure how',
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
    {
      title: 'halp',
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
};
