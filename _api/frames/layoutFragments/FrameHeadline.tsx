/* eslint-disable react/no-unknown-property */
import React from 'react';

export const FrameHeadline = ({ children }: { children: React.ReactNode }) => {
  return (
    <div tw="flex grow w-full flex-col items-center justify-around relative">
      <div
        tw="flex w-full items-center justify-between"
        style={{
          padding: '20px 30px',
        }}
      >
        {children}
      </div>
    </div>
  );
};
