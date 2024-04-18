import React from 'react';

type FrameButtonProps = {
  idx: number;
  title: string;
  action: 'link' | 'post';
  params: Record<string, string>;
  target?: string | ((params: Record<string, string>) => string);
};

export const FrameButton = ({
  idx,
  action,
  target,
  title,
  params,
}: FrameButtonProps) => {
  return (
    <>
      <meta name={`fc:frame:button:${idx}`} content={title} />
      <meta name={`fc:frame:button:${idx}:action`} content={action} />
      {action === 'link' && target !== undefined && (
        <meta
          name={`fc:frame:button:${idx}:target`}
          content={typeof target === 'string' ? target : target(params)}
        />
      )}
    </>
  );
};
