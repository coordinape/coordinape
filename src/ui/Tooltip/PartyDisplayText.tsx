import React from 'react';

export const PartyDisplayText = ({ text }: { text: string }) => {
  return (
    <span
      style={{
        position: 'relative',
        fontSize: '1.3em',
        fontWeight: 600,
      }}
    >
      <span
        style={{
          position: 'absolute',
          color: '#7647FF',
          opacity: 0.75,
          left: '-.12em',
          top: 0,
        }}
      >
        {text}
      </span>
      <span
        style={{
          position: 'absolute',
          color: '#FF1FFF',
          opacity: 0.75,
          left: '-.09em',
          top: '.07em',
        }}
      >
        {text}
      </span>
      <span
        style={{
          position: 'absolute',
          color: '#FF5FFF',
          opacity: 0.75,
          left: '-.06em',
          top: '.04em',
        }}
      >
        {text}
      </span>
      <span
        style={{
          position: 'absolute',
          color: '#FFF',
        }}
      >
        {text}
      </span>
      <span style={{ opacity: 0 }}>{text}</span>
    </span>
  );
};
