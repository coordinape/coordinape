/* eslint-disable react/display-name */
import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { IconProps } from 'types';

export const SaveIcon = styled(
  React.forwardRef<SVGSVGElement, IconProps>(
    ({ color = 'currentColor', ...props }, forwardedRef) => {
      return (
        <svg {...props} ref={forwardedRef}>
          <path
            d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z"
            stroke={color}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 21V12H7V21"
            stroke={color}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 3V9H15"
            stroke={color}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }
  ),
  SvgIconConfig
);

export default SaveIcon;
