import * as React from 'react';

import { styled, SvgIconConfig } from 'stitches.config';

import { IconProps } from 'types';

export const Torso = styled(
  React.forwardRef<SVGSVGElement, IconProps>(function Torso(
    { color = 'currentColor', ...props },
    forwardedRef
  ) {
    return (
      <svg
        width="12"
        height="13"
        viewBox="0 0 12 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={forwardedRef}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.902096 8.82544C1.47595 8.29453 2.24949 8 3.05147 8H8.94853C9.75051 8 10.5241 8.29453 11.0979 8.82544C11.6725 9.35709 12 10.0831 12 10.8452V12.0357C12 12.2921 11.786 12.5 11.5221 12.5C11.2581 12.5 11.0441 12.2921 11.0441 12.0357V10.8452C11.0441 10.3444 10.8293 9.85925 10.4387 9.49786C10.0473 9.13574 9.51163 8.92857 8.94853 8.92857H3.05147C2.48837 8.92857 1.95273 9.13574 1.56132 9.49786C1.17071 9.85925 0.955882 10.3444 0.955882 10.8452V12.0357C0.955882 12.2921 0.741901 12.5 0.477941 12.5C0.213982 12.5 0 12.2921 0 12.0357V10.8452C0 10.0831 0.327452 9.35709 0.902096 8.82544Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 1.56849C4.93326 1.56849 4.06849 2.43326 4.06849 3.5C4.06849 4.56674 4.93326 5.43151 6 5.43151C7.06674 5.43151 7.93151 4.56674 7.93151 3.5C7.93151 2.43326 7.06674 1.56849 6 1.56849ZM3 3.5C3 1.84315 4.34315 0.5 6 0.5C7.65685 0.5 9 1.84315 9 3.5C9 5.15685 7.65685 6.5 6 6.5C4.34315 6.5 3 5.15685 3 3.5Z"
          fill={color}
        />
      </svg>
    );
  }),
  SvgIconConfig
);
Torso.displayName = 'Torso';
export default Torso;
