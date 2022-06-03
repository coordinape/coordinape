import { SvgIcon, SvgIconProps } from '../SvgIcon/SvgIcon';

export const ArrowIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox={'0 0 16 16'}>
    <path
      d="M1 8L15 8M15 8L8 15M15 8L8 0.999999"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </SvgIcon>
);
