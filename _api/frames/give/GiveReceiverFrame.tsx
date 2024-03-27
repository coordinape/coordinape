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
        width: '100%',
        fontSize: 36,
        padding: 16,
      }}
    >
      <div>give receiver frame</div>
      <OGAvatar avatar={give.giver_profile_public.avatar} />
      <div>{give.giver_profile_public.name}</div>
      <div>GAVE TO</div>
      <OGAvatar avatar={give.target_profile_public.avatar} />
      <div>YOU</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <td>have you ever given GIVE</td>
          <td>eee</td>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <td>do you have your cosoul</td>
          <td>xxx</td>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <td>have you ever received GIVE</td>
          <td>rrr</td>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <td>have you purhcased your own colink</td>
          <td>aaa</td>
        </div>
      </div>
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
