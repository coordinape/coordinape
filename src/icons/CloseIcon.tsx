/* eslint-disable react/display-name */
import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { SvgIcon } from './SvgIcon';

import { IconProps } from 'types';

export const CloseIcon = styled(
  ({ color = 'currentColor', ...props }: IconProps) => {
    return (
      <SvgIcon
        width="28"
        height="26"
        viewBox="0 0 28 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M2 24L26 2M2 2L26 24"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </SvgIcon>
    );
  },
  SvgIconConfig
);

export default CloseIcon;
