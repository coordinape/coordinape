import { styled, SvgIconConfig } from 'stitches.config';

import { SvgIcon } from './SvgIcon';

import { IconProps } from 'types';

export const HamburgerIcon = styled(
  ({ color = 'currentColor', ...props }: IconProps) => {
    return (
      <SvgIcon viewBox="0 0 28 26" {...props}>
        <path
          d="M2 2H26M2 13H26M2 24H26"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </SvgIcon>
    );
  },
  SvgIconConfig
);

export default HamburgerIcon;
