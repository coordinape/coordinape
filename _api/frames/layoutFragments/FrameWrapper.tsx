import React from 'react';

export const FrameWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      tw="flex flex-col w-full h-full relative"
      style={{
        background: 'black',
        color: 'white',
        fontSize: 36,
        lineHeight: 1.5,
        fontFamily: 'Denim',
      }}
    >
      {children}
    </div>
  );
};
