import React from 'react';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useController } from 'react-hook-form';

import {
  Flex,
  FormLabel,
  RadioGroupRoot,
  RadioGroupIndicator,
  RadioGroupRadio,
  Tooltip,
} from 'ui';

export const FormRadioGroup = ({
  name,
  control,
  label,
  options,
  infoTooltip,
  defaultValue,
}: {
  name: string;
  control: any;
  label?: string;
  options: { value: any; label: string }[];
  infoTooltip?: React.ReactNode;
  defaultValue: string;
}) => {
  const { field } = useController({
    control,
    name,
  });

  return (
    <Flex column css={{ gap: '$md' }}>
      <FormLabel label>
        {label}{' '}
        {infoTooltip && (
          <Tooltip content={infoTooltip}>
            <InfoCircledIcon />
          </Tooltip>
        )}
      </FormLabel>

      <RadioGroupRoot
        css={{ display: 'flex', flexDirection: 'row', gap: '$md' }}
        name={field.name}
        defaultValue={defaultValue}
        onValueChange={val => field.onChange(val)}
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
            <FormLabel htmlFor="r1">{option.label}</FormLabel>
          </Flex>
        ))}
      </RadioGroupRoot>
    </Flex>
  );
};
