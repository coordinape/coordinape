import React from 'react';

import { FieldValues } from 'react-hook-form';

import { FormInputField, TFormInputField } from 'components/index';

export const FormDatePicker = <TFieldValues extends FieldValues>(
  props: Pick<
    TFormInputField<TFieldValues>,
    'defaultValue' | 'id' | 'control' | 'name' | 'disabled' | 'css'
  >
) => {
  const { defaultValue, id, control, name, disabled } = props;

  return (
    <FormInputField
      defaultValue={defaultValue}
      id={id}
      control={control}
      name={name}
      inputProps={{ type: 'date' }}
      disabled={disabled}
    />
  );
};
