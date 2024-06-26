import React from 'react';

interface GradientStyles {
  [key: string]: string | number;
}

export const FrameBodyGradient = ({
  gradientStyles,
}: {
  gradientStyles: GradientStyles;
}) => {
  return (
    <div tw="absolute bottom-0 w-full flex h-full" style={gradientStyles}></div>
  );
};
