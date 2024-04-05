import React from 'react';

type FrameButtonProps = {
  idx: number;
  title: string;
  action: 'link' | 'post';
  target?: string;
};

export const FrameButton = ({
  idx,
  action,
  target,
  title,
}: FrameButtonProps) => {
  return (
    <>
      <meta name={`fc:frame:button:${idx}`} content={title} />
      <meta name={`fc:frame:button:${idx}:action`} content={action} />
      {action === 'link' && (
        <meta name={`fc:frame:button:${idx}:target`} content={target} />
      )}
    </>
  );
};
