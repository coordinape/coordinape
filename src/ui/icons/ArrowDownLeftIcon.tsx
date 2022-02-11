import type * as Stitches from '@stitches/react';

import { CSS } from '../../stitches.config';
import { SvgIcon } from '../SgvIcon/SvgIcon';

export const ArrowDownLeftIcon = (
  props: { css?: CSS } & Stitches.VariantProps<typeof SvgIcon>
) => (
  <SvgIcon fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M8.74997 1.25L1.25 8.74997M1.25 8.74997L8.75 8.75M1.25 8.74997L1.25003 1.25003"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
);
