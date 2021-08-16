import React from 'react';

import { DateType } from '@date-io/type';

import { DatePicker, DatePickerProps } from '@material-ui/pickers';

import { ApeTextField } from 'components';
import { useFormField } from 'forms';

import { IFormField } from 'types';

export const ControlledDatePicker = ({
  field,
  ...props
}: Partial<DatePickerProps> & {
  field: IFormField;
}) => {
  const { value, updateValue, errorText } = useFormField<string>(field);

  const handleChange = (date: DateType | null, newValue?: string | null) => {
    console.log('ControlledDatePicker.handleChange', date, newValue);
    updateValue(newValue ?? '');
  };

  return (
    <DatePicker
      {...props}
      value={value}
      onChange={handleChange}
      TextFieldComponent={ApeTextField}
      {...field.fieldProps}
    />
  );
};
