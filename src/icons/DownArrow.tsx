import * as React from 'react';

import { styled, SvgIconConfig } from '../stitches.config';

import { IconProps } from 'types';

export const DownArrowIcon = styled(
  React.forwardRef<SVGSVGElement, IconProps>(function DownArrowIcon(
    { color = 'currentColor', ...props },
    forwardedRef
  ) {
    return (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M14 6L8 12L2 6"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }),
  SvgIconConfig
);
DownArrowIcon.displayName = 'DownArrowIcon';
export default DownArrowIcon;
