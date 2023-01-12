import React from 'react';

import { FieldValues } from 'react-hook-form';

import { FormInputField, TFormInputField } from 'components/index';

export const FormDateTimePicker = <TFieldValues extends FieldValues>(
  props: Pick<
    TFormInputField<TFieldValues>,
    'defaultValue' | 'id' | 'control' | 'name' | 'disabled' | 'css'
  >
) => {
  return <FormInputField {...props} inputProps={{ type: 'datetime-local' }} />;
};
