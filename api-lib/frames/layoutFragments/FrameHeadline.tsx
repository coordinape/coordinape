import React from 'react';

export const FrameHeadline = ({ children }: { children: React.ReactNode }) => {
  return (
    <div tw="flex grow w-full flex-col items-center justify-around relative">
      <div
        tw="flex w-full items-center justify-between"
        style={{
          fontSize: 60,
          fontWeight: 600,
          padding: '15px 30px',
        }}
      >
        {children}
      </div>
    </div>
  );
};
