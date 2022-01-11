/* eslint-disable react/display-name */
import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { SvgIcon } from './SvgIcon';

import { IconProps } from 'types';

export const UploadIcon = styled(
  ({ color = 'currentColor', ...props }: IconProps) => {
    return (
      <SvgIcon {...props}>
        <path
          d="M21 15V19.0001C21 19.5305 20.7892 20.0391 20.4142 20.4142C20.0391 20.7892 19.5305 21 19.0001 21H4.99999C4.46956 21 3.96086 20.7892 3.58578 20.4142C3.21072 20.0391 3 19.5305 3 19.0001V15"
          stroke={color}
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.9998 8L11.9998 3L6.99976 8"
          stroke={color}
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 3V15"
          stroke={color}
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </SvgIcon>
    );
  },
  SvgIconConfig
);

export default UploadIcon;
