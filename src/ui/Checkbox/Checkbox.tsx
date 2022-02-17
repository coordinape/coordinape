import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { styled, CSS } from '../../stitches.config';
import { Box, Text } from '../index';

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange(checked: boolean): void;
  label?: string;
  css?: CSS;
}

// Controlled Checkbox
export const Checkbox: React.FC<CheckboxProps> = (props): JSX.Element => {
  return (
    <Box css={{ display: 'flex', gap: '$sm', alignItems: 'center' }}>
      <StyledCheckbox
        data-testid="radix-checkbox"
        checked={props.checked}
        onCheckedChange={props.onCheckedChange}
        css={{ ...props.css }}
      >
        <StyledCheckboxPrimitiveIndicator forceMount>
          {/* TODO: replace the icon for svg icons when that change is merged on main */}
          {props.checked === true && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.4588 1.32445C15.9953 1.75891 16.078 2.54603 15.6436 3.08253L6.74362 14.073C6.30916 14.6095 5.52204 14.6923 4.98553 14.2578L0.589333 10.6978C0.0528259 10.2634 -0.0299038 9.47627 0.404551 8.93976C0.839006 8.40326 1.62613 8.32053 2.16263 8.75498L5.5874 11.5283L13.7007 1.50923C14.1351 0.972725 14.9223 0.889995 15.4588 1.32445Z"
                fill="#58B72B"
              />
            </svg>
          )}
        </StyledCheckboxPrimitiveIndicator>
      </StyledCheckbox>
      <Text css={{ fontSize: '$3' }}>{props.label || 'No Label'}</Text>
    </Box>
  );
};

// StyledCheckbox just CheckboxPrimitive.Root from radix
export const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  backgroundColor: '$lightBackground',
  width: '$lg',
  height: '$lg',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '$1',
});

const StyledCheckboxPrimitiveIndicator = styled(CheckboxPrimitive.Indicator, {
  display: 'grid',
  placeItems: 'center',
});
