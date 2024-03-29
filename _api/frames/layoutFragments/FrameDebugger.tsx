import React from 'react';

import { IN_DEVELOPMENT } from '../../../src/config/env';

export const FrameDebugger = ({ profile }: { profile: any }) => {
  if (!IN_DEVELOPMENT) {
    return <></>;
  }
  return (
    <div
      tw="flex flex-col absolute"
      style={{
        top: 30,
        left: 30,
        padding: 16,
        background: 'rgba(0,0,0, 0.7)',
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
        <span>{profile?.name} has given GIVE</span>
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
        <span>{profile?.name} has a cosoul</span>
        <span>{profile?.cosoul?.id ? 'TRUE' : 'FALSE'}</span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <span>{profile?.name} has received GIVE</span>
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
        <span>{profile?.name} has purchased their own colink</span>
        <span>
          {profile?.links_held && profile?.links_held > 0 ? 'TRUE' : 'FALSE'}
        </span>
      </div>
    </div>
  );
};
