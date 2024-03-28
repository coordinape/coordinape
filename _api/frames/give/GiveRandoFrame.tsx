import React from 'react';

import { OGAvatar } from '../../og/OGAvatar';
import { Frame } from '../router';

import { getContextFromParams } from './getContextFromParams';
import { IMAGE_URL_BASE } from './GiveHomeFrame';
import { giveResourceIdentifier } from './giveResourceIdentifier';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getContextFromParams(params);

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
        lineHeight: 1.5,
        position: 'relative',
        fontFamily: 'Denim',
      }}
    >
      <img
        alt="avatar"
        src={IMAGE_URL_BASE + 'persona-0.jpg'}
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
          tw="flex items-center space-around"
          style={{
            padding: '20px 30px',
            fontSize: 60,
            fontWeight: 600,
            background: `linear-gradient(55deg, #0B2131 0%, #0F3244 100%)`,
          }}
        >
          <div
            tw="w-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <OGAvatar avatar={viewerProfile?.avatar} />
            Level 0
            <img
              alt="gem"
              src={IMAGE_URL_BASE + 'GemWhite.png'}
              style={{ width: 70, height: 70 }}
            />
          </div>
        </div>
        <div
          tw="w-full flex flex-col text-center justify-center items-center"
          style={{
            height: 200,
            padding: '20px 30px',
            fontSize: 44,
          }}
        >
          Welcome, {viewerProfile?.name}!
          <br />
          Get started by Sending GIVE
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
          <span>{viewerProfile?.name} has given GIVE</span>
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
          <span>{viewerProfile?.name} has a cosoul</span>
          <span>{viewerProfile?.cosoul?.id ? 'TRUE' : 'FALSE'}</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <span>{viewerProfile?.name} has received GIVE</span>
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
          <span>{viewerProfile?.name} has purchased their own colink</span>
          <span>
            {viewerProfile?.links_held && viewerProfile?.links_held > 0
              ? 'TRUE'
              : 'FALSE'}
          </span>
        </div>
      </div>
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
      title: 'Try @givebot',
      action: 'link',
      target: 'https://colinks.coordinape.com',
    },
  ],
};
