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
  '&:hover': { borderColor: '$text' },
  variants: {
    border: {
      default: {
        border: '2px solid $lightText',
      },
      error: {
        border: '2px solid $red',
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
  backgroundColor: '$lightText',
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

export const CheckBox = ({
  value,
  label,
  error,
  errorText,
  disabled,
  onChange,
  infoTooltip,
}: {
  value: boolean;
  label: string;
  error?: boolean;
  errorText?: string;
  disabled?: boolean;
  onChange: (isChecked: boolean) => void;
  infoTooltip?: React.ReactNode;
}) => (
  <form>
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
        id={label}
      >
        <CheckboxIndicator>
          <CheckIcon />
        </CheckboxIndicator>
      </CheckboxRoot>
      <Label htmlFor={label}>{label}</Label>
      <Tooltip title="Create Epoch" content={infoTooltip}>
        <InfoCircledIcon />
      </Tooltip>
    </Flex>
    {error && errorText && (
      <Text color="red" css={{ px: '$xl', fontSize: '$3' }}>
        This is an error.
      </Text>
    )}
  </form>
);

export default CheckBox;
