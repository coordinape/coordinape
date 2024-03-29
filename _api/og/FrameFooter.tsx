/* eslint-disable react/no-unknown-property */
import React from 'react';

export const FrameFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div tw="flex grow w-full flex-col items-center justify-around relative">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};
