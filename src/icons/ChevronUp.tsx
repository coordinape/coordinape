/* eslint-disable react/display-name */
import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { IconProps } from 'types';

export const ChevronUp = styled(
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
            d="M14.7996 11.7914C14.5324 12.0695 14.0992 12.0695 13.832 11.7914L8 5.71971L2.16802 11.7914C1.90082 12.0695 1.4676 12.0695 1.2004 11.7914C0.9332 11.5132 0.9332 11.0622 1.2004 10.784L7.51619 4.20864C7.78339 3.93045 8.21661 3.93045 8.48381 4.20864L14.7996 10.784C15.0668 11.0622 15.0668 11.5132 14.7996 11.7914Z"
            fill={color}
          />
        </svg>
      );
    }
  ),
  SvgIconConfig
);

export default ChevronUp;
