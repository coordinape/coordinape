import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import { SelectProps } from '@radix-ui/react-select';
import type * as Stitches from '@stitches/react';
import { styled } from '@stitches/react';
import type { CSS } from 'stitches.config';

import { modifyVariantsForStory } from '../type-utils';
import { Flex, FormLabel, Tooltip } from 'ui';

const StyledTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  flex: 1,
  justifyContent: 'space-between',
  borderRadius: '$3',
  padding: '$sm',
  lineHeight: '$short',
  fontSize: '$medium',
  border: '1px solid transparent',
  width: 'calc(100% - $sm - $sm)',
  backgroundColor: '$surface',
  color: '$text',
  '&:hover': { cursor: 'pointer' },
});

const StyledContent = styled(SelectPrimitive.Content, {
  overflow: 'hidden',
  backgroundColor: '$white',
  boxShadow: '$heavy',
  borderRadius: '$3',
});

const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: 5,
});

const StyledItem = styled(SelectPrimitive.Item, {
  all: 'unset',
  lineHeight: 1,
  color: '$text',
  borderRadius: '$1',
  display: 'flex',
  alignItems: 'center',
  padding: '$sm $lg',
  position: 'relative',
  userSelect: 'none',
  '&:focus': {
    backgroundColor: '$text',
    color: '$white',
  },
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  left: 0,
  width: 25,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const scrollButtonStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 25,
  backgroundColor: 'white',
  color: '$grey10',
  cursor: 'default',
};

const StyledScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles
);

const StyledScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles
);

// Exports
export const RadixSelect = SelectPrimitive.Root;
export const SelectTrigger = StyledTrigger;
export const SelectValue = SelectPrimitive.Value;
export const SelectIcon = SelectPrimitive.Icon;
export const SelectContent = StyledContent;
export const SelectViewport = StyledViewport;
export const SelectGroup = SelectPrimitive.Group;
export const SelectItem = StyledItem;
export const SelectItemText = SelectPrimitive.ItemText;
export const SelectItemIndicator = StyledItemIndicator;
export const SelectScrollUpButton = StyledScrollUpButton;
export const SelectScrollDownButton = StyledScrollDownButton;

export type SelectOption = {
  value: React.ReactText;
  label: React.ReactText;
};

export const Select = (
  props: SelectProps & {
    id?: string;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    css?: CSS;
    label?: React.ReactNode;
    infoTooltip?: React.ReactNode;
  }
) => {
  const {
    id,
    css,
    defaultValue,
    options,
    placeholder,
    disabled,
    label,
    infoTooltip,
  } = props;

  return (
    <Flex
      column
      css={{
        gap: '$xs',
        ...css,
      }}
      disabled={disabled}
    >
      {(label || infoTooltip) && (
        <FormLabel type="label" css={{ fontWeight: '$bold' }} htmlFor={id}>
          {label}{' '}
          {infoTooltip && (
            <Tooltip content={<div>{infoTooltip}</div>}>
              <InfoCircledIcon />
            </Tooltip>
          )}
        </FormLabel>
      )}
      <RadixSelect defaultValue={defaultValue} {...props}>
        <SelectTrigger disabled={disabled}>
          <SelectValue placeholder={placeholder} />
          <SelectIcon>
            <ChevronDownIcon color="#b8bdbf" />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent>
          <SelectScrollUpButton>
            <ChevronUpIcon color="#b8bdbf" />
          </SelectScrollUpButton>
          <SelectViewport>
            <SelectGroup id={id}>
              {options.map(({ value, label }) => (
                <SelectItem value={String(value)} key={value}>
                  <SelectItemText>{label}</SelectItemText>
                  <SelectItemIndicator>
                    <CheckIcon />
                  </SelectItemIndicator>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectViewport>
          <SelectScrollDownButton>
            <ChevronDownIcon />
          </SelectScrollDownButton>
        </SelectContent>
      </RadixSelect>
    </Flex>
  );
};

/* Storybook utility for stitches variant props

NOTE: this can't live in the stories file because the storybook navigator will take a story and will crash
      I can't figure out why it can't be defined without being exported.
*/

type ComponentVariants = Stitches.VariantProps<typeof Select>;
type ComponentProps = ComponentVariants;

export const SelectStory = modifyVariantsForStory<
  ComponentVariants,
  ComponentProps,
  typeof Select
>(Select);
