import React from 'react';

import { IconProps } from 'types';

// eslint-disable-next-line react/display-name
export const SvgIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ children, ...props }, forwardedRef) => {
    const { viewBox = '0 0 24 24' } = props;
    return (
      <svg viewBox={viewBox} {...props} ref={forwardedRef}>
        {children}
      </svg>
    );
  }
);
