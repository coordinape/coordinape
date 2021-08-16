import { useContext, useEffect } from 'react';

import fromPairs from 'lodash/fromPairs';
import isEqual from 'lodash/isEqual';
import { useRecoilState, useRecoilCallback, CallbackInterface } from 'recoil';

import { usePrevious } from 'hooks';

import { FormContext } from './formContext';

import { IFormField } from 'types';

//

// useFormController
// Responsible for resetting the form when it's underlying source changes.
//
// For example, for the epoch form:
// 1. User edits epoch 9
// 2. The controller has source=epoch9 and a key is created 'epoch-form-9'
// 3. The user updates the values of epoch9, the underlying data doesn't change
// 4. The user submits and it succeeds the the handleSubmit sets the recoil val
// 5. Now the underlying data has changed, so the form gets 'reset' to match
// 6. Although the form is likely autoclosed, it has the values matching the DB
export const useFormController = <T>(
  fields: IFormField[],
  getKey: (s: T) => string,
  source: T
) => {
  const previousEpoch = usePrevious(source);

  const resetFields = useRecoilCallback(
    ({ set, reset }: CallbackInterface) => (s: T) => {
      const k = getKey(s);
      if (s) {
        fields.forEach(({ rFieldValue, load }) => set(rFieldValue(k), load(s)));
      } else {
        fields.forEach(({ rFieldValue }) => reset(rFieldValue(k)));
      }
    }
  );

  useEffect(() => {
    if (!isEqual(source, previousEpoch)) {
      resetFields(source);
    }
  }, [source]);

  return getKey(source);
};

// useForm
// Prepares the fields and runs validation.
// This can be called multiple times to get different views of the underlying
// form. It should share keys with one useFormController.
export const useForm = (
  formKey: string,
  fields: IFormField[],
  submit: (props: any) => Promise<any>
): {
  changed: boolean;
  errors: any[];
  handleSubmit: () => Promise<any>;
  formKey: string;
} => {
  const submitFields = useRecoilCallback(
    ({ snapshot }: CallbackInterface) => async () => {
      // Create an object like this: { [name]: get(rFieldValue(formKey)), ...}
      const obj = fromPairs(
        await Promise.all(
          fields.map(async ({ name, rFieldValue }) => [
            name,
            await snapshot.getPromise(rFieldValue(formKey)),
          ])
        )
      );
      return submit(obj);
    }
  );

  return {
    changed: false,
    errors: [],
    handleSubmit: submitFields,
    formKey,
  };
};

// useFormWithController
// wraps the functionality of useForm and useFormController.
// Simple way to use a form.
export const useFormWithController = <T>(
  submit: (props: any) => Promise<any>,
  fields: IFormField[],
  getKey: (s: T) => string,
  source: T
): {
  changed: boolean;
  errors: any[];
  handleSubmit: () => Promise<any>;
  formKey: string;
} => {
  const k = useFormController(fields, getKey, source);
  return useForm(k, fields, submit);
};

// useFormField
// Gets formKey from the context, giving access to the data for this field.
export const useFormField = <T>({
  rFieldValue,
}: IFormField): {
  value: T;
  updateValue: (newValue: T) => void;
  errorText: string | undefined;
} => {
  const formKey = useContext(FormContext);
  const [value, updateValue] = useRecoilState<T>(rFieldValue(formKey));

  return {
    value,
    updateValue,
    errorText: undefined,
  };
};
