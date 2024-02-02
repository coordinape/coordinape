import * as React from 'react';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { styled } from '../../stitches.config';
import { Check, Info } from 'icons/__generated';
import { Flex, Tooltip } from 'ui';
import Text from 'ui/Text/Text';

const CheckboxRoot = styled(CheckboxPrimitive.Root, {
  button: {
    cursor: 'pointer',
    pointerEvents: 'visible',
  },
  all: 'unset',
  backgroundColor: '$formRadioBackground',
  boxSizing: 'border-box',
  borderRadius: '$1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '$lg',
  height: '$lg',
  cursor: 'pointer',
  border: '2px solid',
  '&:hover': {
    borderColor: '$formRadioBorderSelected',
  },
  "&[data-state='checked']": {
    borderColor: 'transparent',
    backgroundColor: '$formRadioBorderSelected',
    svg: {
      color: '$surface',
    },
  },
  variants: {
    border: {
      default: {
        borderColor: '$formRadioBorderUnselected',
      },
      error: {
        borderColor: '$alert',
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
  color: '$formRadioBorderSelected',
  transform: 'scale(1.2)',
});

const Label = styled('label', {
  cursor: 'pointer',
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
        alignItems="center"
        css={{
          display: 'inline-flex',
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
            <Check />
          </CheckboxIndicator>
        </CheckboxRoot>
        {label && <Label htmlFor={label}>{label}</Label>}
        {infoTooltip && (
          <Tooltip content={infoTooltip}>
            <Info color="neutral" />
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
