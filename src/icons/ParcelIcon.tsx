/* eslint-disable react/display-name */
import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { IconProps } from 'types';

export const ParcelIcon = styled(
  React.forwardRef<SVGSVGElement, IconProps>(
    ({ color = 'currentColor', ...props }, forwardedRef) => {
      return (
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
          ref={forwardedRef}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.454 5.71722V12.8443L14.2266 17.8534V0L22.454 5.71722Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.2274 17.853V27.9999L6 22.8601L14.2274 17.853Z"
            fill={color}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.2274 0V17.8534L6 22.8583V5.71511L14.2274 0Z"
            fill={color}
          />
        </svg>
      );
    }
  ),
  SvgIconConfig
);

export default ParcelIcon;
