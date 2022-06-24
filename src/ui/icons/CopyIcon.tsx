import { SvgIcon, SvgIconProps } from '../SvgIcon/SvgIcon';

export const CopyIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.5 0C5.67157 0 5 0.671573 5 1.5V4H2.5C1.67157 4 1 4.67157 1 5.5V14.5C1 15.3284 1.67157 16 2.5 16H9.5C10.3284 16 11 15.3284 11 14.5V12H13.5C14.3284 12 15 11.3284 15 10.5V1.5C15 0.671573 14.3284 0 13.5 0H6.5ZM9 12H6.5C5.67157 12 5 11.3284 5 10.5V6H3V14H9V12ZM13 10H7V2H13V10Z"
      fill="black"
    />
  </SvgIcon>
);
