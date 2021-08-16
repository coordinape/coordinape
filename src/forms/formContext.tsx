import React, { createContext } from 'react';

export const FormContext = createContext<string>('');

export const FormProvider = ({
  formKey,
  children,
}: {
  formKey: string;
  children: React.ReactNode;
}) => <FormContext.Provider value={formKey}>{children}</FormContext.Provider>;
