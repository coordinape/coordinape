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
  borderRadius: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
    size: {
      small: {
        width: 20,
        height: 20,
      },
      medium: {
        width: 30,
        height: 30,
      },
    },
  },
  defaultVariants: {
    border: 'default',
    size: 'small',
  },
});

const CheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  variants: {
    color: {
      default: { color: '$white' },
      complete: { color: '$complete' },
    },
    backgroundColor: {
      default: { backgroundColor: '$secondaryText' },
      surface: { backgroundColor: '$surface' },
    },
  },
  defaultVariants: {
    color: 'default',
  },
});

const Label = styled('label', {
  flexGrow: 1,
  color: '$text',
  fontSize: '$4',
  userSelect: 'none',
  lineHeight: '$base',
  fontWeight: '$bold',
  p: '$sm',

  variants: {
    fontWeight: {
      default: { fontWeight: '$bold' },
      normal: { fontWeight: '$normal' },
    },
  },
  defaultVariants: { fontWeight: 'default' },
});

type CheckBoxProps = {
  value: boolean;
  label?: string;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  onChange: (isChecked: boolean) => void;
  infoTooltip?: React.ReactNode;
  circleAdmin?: boolean;
};

export const CheckBox = React.forwardRef<HTMLButtonElement, CheckBoxProps>(
  (
    {
      value,
      label,
      error,
      errorText,
      disabled,
      onChange,
      infoTooltip,
      circleAdmin,
    },
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
          size={circleAdmin ? 'medium' : 'small'}
        >
          <CheckboxIndicator
            color={circleAdmin ? 'complete' : 'default'}
            backgroundColor={circleAdmin ? 'surface' : 'default'}
          >
            <CheckIcon />
          </CheckboxIndicator>
        </CheckboxRoot>
        {label && (
          <Label
            fontWeight={circleAdmin ? 'normal' : 'default'}
            htmlFor={label}
          >
            {label}
          </Label>
        )}
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
