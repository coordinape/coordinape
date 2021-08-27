import React from 'react';

import { DateType } from '@date-io/type';

import { DatePicker } from '@material-ui/pickers';

import { ApeTextField } from 'components';

export const FormDatePicker = ({
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof DatePicker>, 'onChange'> & {
  onChange: (newValue: string) => void;
  errorText?: string;
}) => {
  const handleChange = (date: DateType | null, newValue?: string | null) => {
    console.log('FormDatePicker.handleChange', date, newValue);
    onChange(newValue ?? '');
  };

  return (
    <DatePicker
      {...props}
      onChange={handleChange}
      TextFieldComponent={ApeTextField}
    />
  );
};
