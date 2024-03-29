/* eslint-disable react/no-unknown-property */
import React from 'react';

export const FrameHeadline = ({ children }: { children: React.ReactNode }) => {
  return (
    <div tw="flex grow w-full flex-col items-center space-around relative z-10">
      <div
        tw="flex w-full items-center space-between"
        style={{
          padding: '20px 30px',
        }}
      >
        {children}
      </div>
    </div>
  );
};
