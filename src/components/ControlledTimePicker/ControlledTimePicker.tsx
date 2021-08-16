import React from 'react';

import { DateType } from '@date-io/type';

import { TimePicker, TimePickerProps } from '@material-ui/pickers';

import { ApeTextField } from 'components';
import { useFormField } from 'forms';

import { IFormField } from 'types';

export const ControlledTimePicker = ({
  field,
  ...props
}: Partial<TimePickerProps> & {
  field: IFormField;
}) => {
  const { value, updateValue, errorText } = useFormField<string>(field);

  const handleChange = (date: DateType | null, newValue?: string | null) => {
    console.log('ControlledTimePicker.handleChange', date, newValue);
    updateValue(newValue ?? '');
  };

  return (
    <TimePicker
      {...props}
      value={value}
      onChange={handleChange}
      TextFieldComponent={ApeTextField}
      {...field.fieldProps}
    />
  );
};
