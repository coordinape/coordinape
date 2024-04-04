import React from 'react';

export const FrameFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div tw="flex grow w-full flex-col items-center justify-around relative">
      <div tw="flex w-full flex-col">
        <div
          tw="w-full flex flex-col text-center justify-center items-center"
          style={{
            height: 230,
            padding: '20px 32px',
            fontSize: 46,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
