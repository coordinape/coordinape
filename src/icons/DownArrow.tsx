import { SvgIcon } from '@material-ui/core';

export const DownArrow = (props: any) => (
  <SvgIcon {...props}>
    <path
      d="M1 1L7 7L13 1"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
);
