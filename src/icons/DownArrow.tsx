import { styled, SvgIconConfig } from 'stitches.config';

import { SvgIcon } from './SvgIcon';

import { IconProps } from 'types';

export const DownArrowIcon = styled(
  ({ color = 'currentColor', ...props }: IconProps) => {
    return (
      <SvgIcon
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M14 6L8 12L2 6"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </SvgIcon>
    );
  },
  SvgIconConfig
);

export default DownArrowIcon;
