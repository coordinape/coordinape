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
      <div>give receiver frame</div>
      <OGAvatar avatar={give.giver_profile_public.avatar} />
      <div>{give.giver_profile_public.name}</div>
      <div>GAVE TO</div>
      <OGAvatar avatar={give.target_profile_public.avatar} />
      <div tw="flex">YOU {viewerProfile?.name}</div>
    </div>
  );
};

export const GiveReceiverFrame: Frame = {
  id: 'give/receiver',
  homeFrame: false,
  imageNode: imageNode,
  resourceIdentifier: giveResourceIdentifier,
  buttons: [
    {
      title: 'i received the give',
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
};
