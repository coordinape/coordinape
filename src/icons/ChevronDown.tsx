/* eslint-disable react/display-name */
import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { IconProps } from 'types';

export const ChevronDown = styled(
  React.forwardRef<SVGSVGElement, IconProps>(
    ({ color = 'currentColor', ...props }, forwardedRef) => {
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
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.2004 4.20864C1.4676 3.93045 1.90082 3.93045 2.16802 4.20864L8 10.2803L13.832 4.20864C14.0992 3.93045 14.5324 3.93045 14.7996 4.20864C15.0668 4.48682 15.0668 4.93784 14.7996 5.21602L8.48381 11.7914C8.21661 12.0695 7.78339 12.0695 7.51619 11.7914L1.2004 5.21602C0.9332 4.93784 0.9332 4.48682 1.2004 4.20864Z"
            fill={color}
          />
        </svg>
      );
    }
  ),
  SvgIconConfig
);

export default ChevronDown;
