import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { IconProps } from 'types';

export const CheckIcon = styled(
  React.forwardRef<SVGSVGElement, IconProps>(function CheckIcon(
    { color = 'currentColor', ...props },
    forwardedRef
  ) {
    return (
      <svg
        width="13"
        height="11"
        viewBox="0 0 13 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          d="M12.3099 0.993597C12.7123 1.31944 12.7743 1.90978 12.4485 2.31216L5.77353 10.555C5.44769 10.9574 4.85735 11.0195 4.45497 10.6936L1.15782 8.02364C0.75544 7.6978 0.693392 7.10746 1.01923 6.70508C1.34508 6.3027 1.93542 6.24065 2.3378 6.56649L4.90637 8.64649L10.9913 1.13218C11.3172 0.729803 11.9075 0.667756 12.3099 0.993597Z"
          fill={color}
        />
      </svg>
    );
  }),
  SvgIconConfig
);
CheckIcon.displayName = 'CheckIcon';
export default CheckIcon;
