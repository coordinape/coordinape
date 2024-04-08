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
        position: 'relative',
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          width: '480px',
          height: '90px',
          background: 'linear-gradient(90deg, #fff 0%, #fafafa 100%)',
          color: 'black',
          fontWeight: 600,
          transform: 'rotate(-47deg)',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          left: '-110px',
          top: '90px',
          fontSize: 30,
        }}
      >
        Testing Purposes Only
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            width: '510px',
            height: '10px',
            background:
              'linear-gradient(90deg, rgba(0,255,0,1) 0%, rgba(139,0,255,1) 100%)',
            opacity: 0.9,
            bottom: -10,
            left: -15,
          }}
        ></div>
      </div>
    </div>
  );
};
