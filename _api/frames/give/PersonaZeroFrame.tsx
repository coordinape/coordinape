import React from 'react';

import { FrameBgImage, IMAGE_URL_BASE } from '../../og/FrameBgImage';
import { FrameBody } from '../../og/FrameBody';
import { FrameBodyGradient } from '../../og/FrameBodyGradient';
import { FrameFooter } from '../../og/FrameFooter';
import { FrameHeadline } from '../../og/FrameHeadline';
import { FrameWrapper } from '../../og/FrameWrapper';
import { OGAvatar } from '../../og/OGAvatar';
import { Frame } from '../router';

import { getContextFromParams } from './getContextFromParams';
import { giveResourceIdentifier } from './giveResourceIdentifier';

const imageNode = async (params: Record<string, string>) => {
  const { viewerProfile } = await getContextFromParams(params);

  return (
    <FrameWrapper>
      <FrameBgImage src="persona-0.jpg" />
      <FrameBody>
        <FrameBodyGradient
          gradientStyles={{
            background:
              'radial-gradient(circle at 20% 10%, #135A95 0%, #092031 80%)',
            opacity: 0.7,
          }}
        />
        <FrameHeadline>
          <OGAvatar avatar={viewerProfile?.avatar} />
          <div tw="flex items-center grow justify-center">Level 0</div>
          <img
            alt="gem"
            src={IMAGE_URL_BASE + 'GemWhite.png'}
            style={{ width: 70, height: 70 }}
          />
        </FrameHeadline>
        <FrameFooter>
          {' '}
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
        </FrameFooter>
      </FrameBody>
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
    </FrameWrapper>
  );
};

export const PersonaZeroFrame: Frame = {
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
