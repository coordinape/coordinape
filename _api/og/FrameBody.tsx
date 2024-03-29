/* eslint-disable react/no-unknown-property */
import React from 'react';

export const FrameBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      tw="absolute bottom-0 w-full flex items-center space-around flex-col"
      style={{
        fontSize: 60,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
};
