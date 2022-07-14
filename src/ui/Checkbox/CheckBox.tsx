import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons';

import { styled } from '../../stitches.config';
import { Flex, Tooltip } from 'ui';
import Text from 'ui/Text/Text';

const CheckboxRoot = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  backgroundColor: '$surface',
  boxSizing: 'border-box',
  borderRadius: '$1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '$lg',
  height: '$lg',
  '&:hover': { borderColor: '$borderMedium' },
  '&:focus': { borderColor: '$borderMedium' },
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$complete',
  backgroundColor: '$transparent',
  transform: 'scale(1.5)',
});

const Label = styled('label', {
  flexGrow: 1,
  color: '$text',
  fontSize: '$4',
  userSelect: 'none',
  lineHeight: '$base',
  fontWeight: '$normal',
  p: '$sm',
});

type CheckBoxProps = {
  value: boolean;
  label?: string;
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
        {label && <Label htmlFor={label}>{label}</Label>}
        {infoTooltip && (
          <Tooltip content={infoTooltip}>
            <InfoCircledIcon />
          </Tooltip>
        )}
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
