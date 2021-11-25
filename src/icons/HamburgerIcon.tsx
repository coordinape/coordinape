import React from 'react';

import { SvgIcon } from '@material-ui/core';

export const HamburgerIcon = (props: any) => (
  <SvgIcon width="28" height="26" viewBox="0 0 28 26" {...props}>
    <path
      d="M2 2H26M2 13H26M2 24H26"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </SvgIcon>
);
