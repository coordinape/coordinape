import React from 'react';

import { DateType } from '@date-io/type';

import { DatePicker } from '@material-ui/pickers';

import { ApeTextField } from 'components';

export const FormDatePicker = ({
  onChange,
  errorText,
  error,
  ...props
}: Omit<React.ComponentProps<typeof DatePicker>, 'onChange'> & {
  onChange: (newValue: string) => void;
  errorText?: string;
}) => {
  const handleChange = (date: DateType | null) => {
    onChange(date?.toISO() ?? '');
  };

  return (
    <DatePicker
      {...props}
      error={error}
      helperText={errorText}
      onChange={handleChange}
      TextFieldComponent={ApeTextField}
    />
  );
};
