/* eslint-disable react/no-unknown-property */
import React from 'react';

export const FrameFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div tw="flex grow w-full flex-col items-center space-around relative">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          zIndex: 10,
        }}
      >
        {children}
      </div>
    </div>
  );
};
