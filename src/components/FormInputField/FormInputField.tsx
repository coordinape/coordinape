import React from 'react';

import { InfoCircledIcon } from '@radix-ui/react-icons';
import {
  useController,
  UseControllerProps,
  FieldValues,
  Control,
} from 'react-hook-form';
import type { CSS } from 'stitches.config';

import { Flex, FormLabel, Text, TextArea, TextField, Tooltip } from 'ui';

type TextFieldProps = React.ComponentProps<typeof TextField>;
type TextAreaProps = React.ComponentProps<typeof TextArea>;

type TFormInputField<TFieldValues extends FieldValues> = {
  id: string;
  label?: string;
  textArea?: boolean;
  infoTooltip?: string;
  description?: string;
  inputProps?: TextFieldProps;
  areaProps?: TextAreaProps;
  control: Control<TFieldValues>;
  disabled?: boolean;
  css?: CSS;
  number?: boolean;
  showFieldErrors?: boolean;
} & UseControllerProps<TFieldValues>;

export const FormInputField = <TFieldValues extends FieldValues>(
  props: TFormInputField<TFieldValues>
) => {
  const {
    id,
    label,
    textArea,
    description,
    inputProps,
    areaProps,
    control,
    name,
    defaultValue,
    infoTooltip,
    disabled,
    css,
    number,
    showFieldErrors,
  } = props;

  const { field, fieldState } = useController({
    control,
    name,
    defaultValue,
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!number) {
      field.onChange(e.target.value);
    } else {
      //convert string to number for input numbers to be parsed by ZOD
      field.onChange(
        !Number.isNaN(parseInt(e.target.value)) ? parseInt(e.target.value) : 0
      );
    }
  };
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
      {description && <Text size="small">{description}</Text>}
      {!textArea && (
        <TextField
          css={{ width: '100%' }}
          onChange={changeHandler}
          name={field.name}
          onBlur={field.onBlur}
          value={field.value}
          {...inputProps}
          ref={field.ref}
          id={id}
          error={!!fieldState.error}
        ></TextField>
      )}
      {textArea && (
        <TextArea
          {...field}
          css={{
            width: '100%',
            fontWeight: '$light',
            fontSize: '$4',
            lineHeight: 'none',
          }}
          id={id}
          {...areaProps}
          error={!!fieldState.error}
        />
      )}
      {showFieldErrors && fieldState.error && (
        <Text color="alert" css={{ fontSize: '$3' }}>
          {fieldState.error.message}
        </Text>
      )}
    </Flex>
  );
};
