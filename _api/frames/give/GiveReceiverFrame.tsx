import React from 'react';

import { OGAvatar } from '../../og/OGAvatar';
import { Frame } from '../router';

import { getGiveFromParams, giveResourceIdentifier } from './getGiveFromParams';

const imageNode = async (params: Record<string, string>) => {
  const give = await getGiveFromParams(params);

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
      <div>YOU</div>
    </div>
  );
};

export const GiveReceiverFrame: Frame = {
  id: 'give/giver',
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
