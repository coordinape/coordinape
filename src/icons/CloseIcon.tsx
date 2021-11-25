import React from 'react';

import { SvgIcon } from '@material-ui/core';

export const CloseIcon = (props: any) => (
  <SvgIcon width="28" height="26" viewBox="0 0 28 26" {...props}>
    <path
      d="M2 24L26 2M2 2L26 24"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </SvgIcon>
);
