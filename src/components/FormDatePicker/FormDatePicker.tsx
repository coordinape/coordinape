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
  const handleChange = (date: DateType | null) => {
    onChange(date?.toISOString() ?? '');
  };

  return (
    <DatePicker
      {...props}
      onChange={handleChange}
      TextFieldComponent={ApeTextField}
    />
  );
};
