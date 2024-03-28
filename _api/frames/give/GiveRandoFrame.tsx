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
        background: 'black',
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
        tw="absolute bottom-0 w-full flex items-center space-around flex-col"
        style={{
          fontSize: 60,
          fontWeight: 600,
          background:
            'radial-gradient(circle at 20% 10%, #135A9588 0%, #09203188 80%)',
        }}
      >
        <div
          tw="w-full"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 30px',
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            // background: 'rgba(0,0,0,0.1)',
          }}
        >
          <div
            tw="w-full flex flex-col text-center justify-center items-center"
            style={{
              height: 230,
              padding: '20px 32px',
              fontSize: 46,
            }}
          >
            Welcome, {viewerProfile?.name}!
            <br />
            Get started by Sending GIVE
          </div>
        </div>
      </div>

      {/* frame stats */}
      {/* <div
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
      </div> */}
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
