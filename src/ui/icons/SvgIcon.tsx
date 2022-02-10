/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';

import { styled, SvgIconConfig } from '../../stitches.config';

type BaseSvgIconProps = {
  viewBox?: string;
  color?: string;
};

export const SvgIcon = styled(
  ({
    children,
    color,
    viewBox,
    ...props
  }: BaseSvgIconProps & {
    children: (color: string) => React.ReactNode;
  }) => {
    // eslint-disable-next-line react/display-name
    const R = React.forwardRef<SVGSVGElement, {}>((noProps, forwardedRef) => (
      <svg viewBox={viewBox || '0 0 24 24'} {...props} ref={forwardedRef}>
        {children(color ?? 'currentColor')}
      </svg>
    ));
    return <R />;
  },
  SvgIconConfig
);
