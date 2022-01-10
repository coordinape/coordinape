/* eslint-disable react/display-name */
import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { IconProps } from 'types';

export const DocsIcon = styled(
  React.forwardRef<SVGSVGElement, IconProps>((props, forwardedRef) => {
    return (
      <svg {...props} ref={forwardedRef}>
        <path d="M16.5 21V22.875C16.5 23.4963 15.9963 24 15.375 24H2.625C2.00367 24 1.5 23.4963 1.5 22.875V5.625C1.5 5.00367 2.00367 4.5 2.625 4.5H6V18.375C6 19.8225 7.17755 21 8.625 21H16.5ZM16.5 4.875V0H8.625C8.00367 0 7.5 0.503672 7.5 1.125V18.375C7.5 18.9963 8.00367 19.5 8.625 19.5H21.375C21.9963 19.5 22.5 18.9963 22.5 18.375V6H17.625C17.0063 6 16.5 5.49375 16.5 4.875ZM22.1705 3.42052L19.0795 0.329484C18.8685 0.11852 18.5824 1.55998e-06 18.284 0L18 0V4.5H22.5V4.21598C22.5 3.91763 22.3815 3.63149 22.1705 3.42052V3.42052Z" />
      </svg>
    );
  }),
  SvgIconConfig
);

export default DocsIcon;
