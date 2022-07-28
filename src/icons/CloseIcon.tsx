import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { IconProps } from 'types';

export const CloseIcon = styled(
  React.forwardRef<SVGSVGElement, IconProps>(function CloseIcon(
    { color = 'currentColor', ...props },
    forwardedRef
  ) {
    return (
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M0.301932 0.587576C0.668048 0.221459 1.26164 0.221459 1.62776 0.587576L9.12776 8.08758C9.49387 8.45369 9.49387 9.04728 9.12776 9.4134C8.76164 9.77952 8.16805 9.77952 7.80193 9.4134L0.301932 1.9134C-0.064185 1.54728 -0.064185 0.953692 0.301932 0.587576Z"
          fill={color}
        />
        <path
          d="M9.12776 0.587576C9.49387 0.953692 9.49387 1.54728 9.12776 1.9134L1.62776 9.4134C1.26164 9.77952 0.668048 9.77952 0.301931 9.4134C-0.0641854 9.04728 -0.0641854 8.45369 0.301931 8.08758L7.80193 0.587576C8.16805 0.221459 8.76164 0.221459 9.12776 0.587576Z"
          fill={color}
        />
      </svg>
    );
  }),
  SvgIconConfig
);
CloseIcon.displayName = 'CloseIcon';
export default CloseIcon;
