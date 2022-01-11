import { styled, SvgIconConfig } from 'stitches.config';

import { SvgIcon } from './SvgIcon';

import { IconProps } from 'types';

export const AwardIcon = styled(
  ({ color = 'currentColor', ...props }: IconProps) => {
    return (
      <SvgIcon {...props}>
        <path
          d="M12 15.4291C15.7871 15.4291 18.8571 12.3591 18.8571 8.57199C18.8571 4.78489 15.7871 1.71484 12 1.71484C8.21287 1.71484 5.14282 4.78489 5.14282 8.57199C5.14282 12.3591 8.21287 15.4291 12 15.4291Z"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.10175 14.5807L6.85718 22.2866L12 19.749L17.1429 22.2866L15.8983 14.5723"
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

export default AwardIcon;
