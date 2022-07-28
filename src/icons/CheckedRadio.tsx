import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { IconProps } from 'types';

export const CheckedRadio = styled(
  React.forwardRef<SVGSVGElement, IconProps>(function CheckedRadio(
    { color = 'currentColor', ...props },
    forwardedRef
  ) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <circle cx="12" cy="12" r="12" fill="#EEF1F4" />
        <circle cx="12" cy="12" r="7.5" fill={color} />
      </svg>
    );
  }),
  SvgIconConfig
);
CheckedRadio.displayName = 'CheckedRadio';
export default CheckedRadio;
