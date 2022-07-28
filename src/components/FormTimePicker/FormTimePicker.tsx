import React from 'react';

import { DateType } from '@date-io/type';

import { TimePicker } from '@material-ui/pickers';

import { DeprecatedApeTextField } from 'components';

export const FormTimePicker = ({
  onChange,
  errorText,
  error,
  ...props
}: Omit<React.ComponentProps<typeof TimePicker>, 'onChange'> & {
  onChange: (newValue: string) => void;
  errorText?: string;
}) => {
  const handleChange = (date: DateType | null) => {
    onChange(date?.toISO() ?? '');
  };

  const labelFunc = (date: DateType | null, invalidLabel: string) =>
    date?.toFormat('hh:mm a') ?? invalidLabel;

  return (
    <TimePicker
      {...props}
      error={error}
      labelFunc={labelFunc}
      helperText={errorText}
      onChange={handleChange}
      TextFieldComponent={DeprecatedApeTextField}
    />
  );
};
