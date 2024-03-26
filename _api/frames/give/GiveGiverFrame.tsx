import React from 'react';

import { OGAvatar } from '../../og/OGAvatar';
import { Frame } from '../router';

import { getGiveFromParams, giveResourceIdentifier } from './getGiveFromParams';

const giverImageNode = async (params: Record<string, string>) => {
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
      <div>give giver frame</div>
      <OGAvatar avatar={give.giver_profile_public.avatar} />
      <div>YOUx</div>
      <div>GAVE TO</div>
      <OGAvatar avatar={give.target_profile_public.avatar} />
      <div>{give.target_profile_public.name}</div>
    </div>
  );
};

export const GiveGiverFrame: Frame = {
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
