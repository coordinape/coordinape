/* eslint-disable react/display-name */
import * as React from 'react';

import { styled, SvgIconConfig } from '../stitches.config';

import { IconProps } from 'types';

export const HamburgerIcon = styled(
  React.forwardRef<SVGSVGElement, IconProps>(
    ({ color = 'currentColor', ...props }, forwardedRef) => {
      return (
        <svg
          width="28"
          height="26"
          viewBox="0 0 28 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
          ref={forwardedRef}
        >
          <path
            d="M2 2H26M2 13H26M2 24H26"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    }
  ),
  SvgIconConfig
);

export default HamburgerIcon;
