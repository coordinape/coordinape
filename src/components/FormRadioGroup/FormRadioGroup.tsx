import React from 'react';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  useController,
  UseControllerProps,
  FieldValues,
  Control,
} from 'react-hook-form';

import {
  Flex,
  FormLabel,
  RadioGroupRoot,
  RadioGroupIndicator,
  RadioGroupRadio,
  Tooltip,
} from 'ui';

type TFormRadioGroup<TFieldValues extends FieldValues> = {
  label?: string;
  options: { value: any; label: string }[];
  infoTooltip?: React.ReactNode;
  disabled?: boolean;
  control: Control<TFieldValues>;
} & UseControllerProps<TFieldValues>;

export const FormRadioGroup = <TFieldValues extends FieldValues>(
  props: TFormRadioGroup<TFieldValues>
) => {
  const { name, control, defaultValue, disabled, label, infoTooltip, options } =
    props;

  const { field } = useController({
    control,
    name,
    defaultValue,
  });

  return (
    <Flex
      column
      css={{
        gap: '$md',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <FormLabel type="label" css={{ fontWeight: '$bold' }}>
        {label}{' '}
        {infoTooltip && (
          <Tooltip content={infoTooltip}>
            <InfoCircledIcon />
          </Tooltip>
        )}
      </FormLabel>

      <RadioGroupRoot
        css={{
          display: 'flex',
          flexDirection: 'row',
          gap: '$md',
          flexWrap: 'wrap',
        }}
        name={field.name}
        defaultValue={defaultValue}
        onValueChange={val => field.onChange(val)}
        value={field.value}
        aria-label="View density"
        required
      >
        {options?.map(option => (
          <Flex
            key={option.value.toString()}
            css={{ margin: 'md 0', alignItems: 'center', gap: '$xs' }}
          >
            <RadioGroupRadio value={option.value.toString()} id="r1">
              <RadioGroupIndicator />
            </RadioGroupRadio>
            <FormLabel type="radioLabel" htmlFor="r1">
              {option.label}
            </FormLabel>
          </Flex>
        ))}
      </RadioGroupRoot>
    </Flex>
  );
};
