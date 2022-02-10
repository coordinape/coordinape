import { SvgIcon } from './SvgIcon';

export type SvgIconProps = Omit<
  React.ComponentProps<typeof SvgIcon>,
  'children'
>;

export const ArrowDiagonalIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    {(color: string) => (
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color={color}
      >
        <path
          d="M8.74997 1.25L1.25 8.74997M1.25 8.74997L8.75 8.75M1.25 8.74997L1.25003 1.25003"
          stroke="#29D07E"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </SvgIcon>
);
