import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons';

import { styled } from '../../stitches.config';
import { Flex, Tooltip } from 'ui';
import Text from 'ui/Text/Text';

const CheckboxRoot = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  backgroundColor: 'transparent',
  boxSizing: 'border-box',
  width: 20,
  height: 20,
  borderRadius: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': { borderColor: '$focusedBorder' },
  '&:focus': { borderColor: '$focusedBorder' },
  variants: {
    border: {
      default: {
        border: '2px solid $border',
      },
      error: {
        border: '2px solid $alert',
      },
    },
  },
  defaultVariants: {
    border: 'default',
  },
});

const CheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
  width: '100%',
  height: '100%',
  color: '$white',
  backgroundColor: '$secondaryText',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Label = styled('label', {
  flexGrow: 1,
  color: '$text',
  fontSize: '$4',
  userSelect: 'none',
  lineHeight: '$base',
  fontWeight: '$bold',
  p: '$sm',
});

type CheckBoxProps = {
  value: boolean;
  label: string;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  onChange: (isChecked: boolean) => void;
  infoTooltip?: React.ReactNode;
};

export const CheckBox = React.forwardRef<HTMLButtonElement, CheckBoxProps>(
  (
    { value, label, error, errorText, disabled, onChange, infoTooltip },
    ref
  ) => (
    <>
      <Flex
        css={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CheckboxRoot
          border={error ? 'error' : 'default'}
          checked={value}
          onCheckedChange={onChange}
          disabled={disabled}
          ref={ref}
          id={label}
        >
          <CheckboxIndicator>
            <CheckIcon />
          </CheckboxIndicator>
        </CheckboxRoot>
        <Label htmlFor={label}>{label}</Label>
        <Tooltip content={infoTooltip}>
          <InfoCircledIcon />
        </Tooltip>
      </Flex>
      {error && errorText && (
        <Text color="alert" css={{ px: '$xl', fontSize: '$3' }}>
          {errorText}
        </Text>
      )}
    </>
  )
);

CheckBox.displayName = 'CheckBox';

export default CheckBox;
