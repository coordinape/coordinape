import { SVGProps } from 'react';

export const ArrowDownLeftIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={props.color || '#29D07E'}
      {...props}
    >
      <path
        d="M8.74997 1.25L1.25 8.74997M1.25 8.74997L8.75 8.75M1.25 8.74997L1.25003 1.25003"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
