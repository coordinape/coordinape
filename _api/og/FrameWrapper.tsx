/* eslint-disable react/no-unknown-property */
import React from 'react';

export const FrameWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: 'black',
        color: 'white',
        fontSize: 36,
        lineHeight: 1.5,
        position: 'relative',
        fontFamily: 'Denim',
      }}
    >
      {children}
    </div>
  );
};
