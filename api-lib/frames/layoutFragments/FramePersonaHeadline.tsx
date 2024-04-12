import React from 'react';

import { OGAvatar } from '../../../_api/og/OGAvatar';

import { IMAGE_URL_BASE } from './FrameBgImage';

export const FramePersonaHeadline = ({
  avatar,
  giverTotalGiven,
  receiverTotalReceived,
  level,
}: {
  avatar?: string;
  giverTotalGiven: number;
  receiverTotalReceived: number;
  level: string;
}) => {
  return (
    <div tw="flex w-full justify-between">
      <div tw="flex items-center" style={{ gap: 20 }}>
        <div tw="flex items-center">
          <OGAvatar avatar={avatar} />
        </div>
        <div tw="flex items-center" style={{ fontSize: 55 }}>
          Level {level}
        </div>
      </div>
      <div tw="flex items-center" style={{ gap: 20 }}>
        <div
          tw="flex flex-col items-end"
          style={{ fontSize: 38, lineHeight: 1, gap: 5 }}
        >
          <div tw="flex">
            <span style={{ fontWeight: 400 }}>Given</span>
            <span style={{ fontWeight: 600, marginLeft: 12 }}>
              {giverTotalGiven}
            </span>
          </div>
          <div tw="flex leading-none">
            <span style={{ fontWeight: 400 }}>Received</span>
            <span style={{ fontWeight: 600, marginLeft: 12 }}>
              {receiverTotalReceived}
            </span>
          </div>
        </div>
        <img
          alt="gem"
          src={IMAGE_URL_BASE + 'GemWhite.png'}
          style={{ width: 80, height: 80 }}
        />
      </div>
    </div>
  );
};
