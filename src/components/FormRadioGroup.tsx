import React from 'react';

import {
  useController,
  UseControllerProps,
  FieldValues,
  Control,
} from 'react-hook-form';

import { Info } from 'icons/__generated';
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
        gap: '$sm',
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <FormLabel
        type="label"
        css={{
          fontWeight: '$bold',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {label}{' '}
        {infoTooltip && (
          <Tooltip content={infoTooltip}>
            <Info size="sm" />
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
            alignItems="center"
            key={option.value.toString()}
            css={{ margin: 'md 0', gap: '$xs' }}
          >
            <RadioGroupRadio
              value={option.value.toString()}
              id={field.name.toString() + option.value.toString()}
            >
              <RadioGroupIndicator />
            </RadioGroupRadio>
            <FormLabel
              type="radioLabel"
              htmlFor={field.name.toString() + option.value.toString()}
            >
              {option.label}
            </FormLabel>
          </Flex>
        ))}
      </RadioGroupRoot>
    </Flex>
  );
};
