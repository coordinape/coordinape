import React from 'react';

import {
  useController,
  UseControllerProps,
  FieldValues,
  Control,
} from 'react-hook-form';
import type { CSS } from 'stitches.config';

import { Info } from 'icons/__generated';
import { Flex, FormLabel, Text, TextArea, TextField, Tooltip } from 'ui';

type TextFieldProps = React.ComponentProps<typeof TextField>;
type TextAreaProps = React.ComponentProps<typeof TextArea>;

type TFormInputField<TFieldValues extends FieldValues> = {
  id: string;
  label?: string;
  textArea?: boolean;
  infoTooltip?: React.ReactNode;
  description?: string;
  placeholder?: string;
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
    placeholder,
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
    >
      {(label || infoTooltip) && (
        <FormLabel
          type="label"
          css={{
            fontWeight: '$bold',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          htmlFor={id}
        >
          {label}{' '}
          {infoTooltip && (
            <Tooltip content={<div>{infoTooltip}</div>}>
              <Info size="sm" />
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
          disabled={disabled}
          placeholder={placeholder}
        ></TextField>
      )}
      {textArea && (
        <TextArea
          {...field}
          autoSize
          css={{
            width: '100%',
            fontWeight: '$normal',
            fontSize: '$4',
            lineHeight: 'none',
          }}
          id={id}
          {...areaProps}
          error={!!fieldState.error}
          disabled={disabled}
          placeholder={placeholder}
        />
      )}
      {showFieldErrors && fieldState.error && (
        <Text color="alert" css={{ fontSize: '$small' }}>
          {fieldState.error.message}
        </Text>
      )}
    </Flex>
  );
};
