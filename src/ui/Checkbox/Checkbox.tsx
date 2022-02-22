import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { styled, CSS } from '../../stitches.config';
import { Box, Text, CheckIcon } from '../index';

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
          {props.checked === true && (
            <CheckIcon size="md" color="green12" fill />
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
