import React from 'react';

export const PartyText = ({ text }: { text: string }) => {
  return (
    <span
      tw="inline-flex relative whitespace-norwap "
      style={{
        fontSize: 90,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        tw="absolute"
        style={{
          color: '#7647FF',
          opacity: 0.75,
          left: -14,
          top: 0,
        }}
      >
        {text}
      </span>
      <span
        tw="absolute"
        style={{
          color: '#FF1FFF',
          opacity: 0.75,
          left: -10,
          top: 8,
        }}
      >
        {text}
      </span>
      <span
        tw="absolute"
        style={{
          color: '#FF5FFF',
          opacity: 0.75,
          left: -6,
          top: 4,
        }}
      >
        {text}
      </span>
      <span
        tw="absolute"
        style={{
          color: '#FFF',
        }}
      >
        {text}
      </span>
      <span style={{ opacity: 0 }}>{text}</span>
    </span>
  );
};
