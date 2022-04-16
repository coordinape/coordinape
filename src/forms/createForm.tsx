/**
 *
 * DEPRECATED -- please use react-hook-form directly instead.
 *
 */

import React, { Suspense, useEffect, useRef } from 'react';

import isEqual from 'lodash/isEqual';
import mapValues from 'lodash/mapValues';
import {
  atomFamily,
  useRecoilCallback,
  CallbackInterface,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { z } from 'zod';

import { neverEndingPromise } from 'utils/tools';

import { IRecoilGetParams } from 'types';

type ZodParsedType<Z extends z.ZodTypeAny> =
  | {
      success: true;
      data: Z['_output'];
    }
  | {
      success: false;
      error: z.ZodError<Z['_input']>;
    };

// Merge properties
// from https://stackoverflow.com/a/49683575/3304125
type OptionalPropertyNames<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]-?: {} extends { [P in K]: T[K] } ? K : never;
}[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> = {
  [P in K]: L[P] | Exclude<R[P], undefined>;
};

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type SpreadTwo<L, R> = Id<
  Pick<L, Exclude<keyof L, keyof R>> &
    Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
    Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
    SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

type Merge<A, B> = {
  [K in keyof (A & B)]: K extends keyof (A | B)
    ? SpreadTwo<A[K], B[K]>
    : K extends keyof A
    ? A[K]
    : K extends keyof B
    ? B[K]
    : undefined;
};

/**
 * creates a react component and hooks to encapsulate form functionality:
 *  - Validation
 *  - Change detection
 *  - Converting from form values to submit props
 *
 *  It infers types from the zod objects used.
 *
 *
 *  Note: Form suspends consumers until initialized, see FormController
 *
 * @param name - Needs to be unique for recoil state
 * @param getInstanceKey - Return a unique id when the form modifies underlying data
 * @param getZodParser - A function so that Zod can access state if needed to validate
 *   The base of the schema needs to be a {@link z.ZodObject}.
 * @param load - How the source initializes the form
 * @param fieldKeys - The fields from the base ZodObject.
 * @param fieldProps - Props that make sense to include as data rather than style
 *
 *  See simple example like {@link AdminUserForm}
 */
export const createForm = <
  Source,
  Input extends { [v: string]: any },
  FProps extends { [k: string]: Record<string, any> },
  Output extends unknown
>({
  name,
  getInstanceKey,
  getZodParser,
  load,
  fieldKeys,
  fieldProps,
}: {
  name: string;
  getInstanceKey: (s: Source) => string;
  getZodParser: (s: Source) => z.ZodType<Output, any, Input>;
  load: (s: Source) => Input;
  fieldKeys: string[];
  fieldProps: FProps;
}) => {
  type Effect = ReturnType<typeof getZodParser>;
  type Fields = Merge<
    {
      [P in keyof Input]: {
        value: Input[P];
        onChange: (newValue: Input[P]) => void;
        onBlur: () => void;
        error: boolean;
        errorText?: string;
      };
    },
    FProps
  >;

  interface FormProps {
    submit: (v: Output) => any;
    hideFieldErrors?: boolean;
    instanceKey: string;
  }

  interface ControllerProps {
    source: Source;
    submit: (v: Output) => any;
    hideFieldErrors?: boolean;
  }

  // neverEndingPromise is used to cause a suspense when uninitialized
  // see FormController and InnerFormController
  const rSource = atomFamily<Source, string>({
    key: `${name}-Source`,
    default: neverEndingPromise(),
  });
  const rBaseValue = selectorFamily<Input, string>({
    key: `${name}-BaseValue`,
    get:
      (instanceKey: string) =>
      ({ get }: IRecoilGetParams) =>
        load(get(rSource(instanceKey))),
  });
  const rValue = atomFamily<Input, string>({
    key: `${name}-Value`,
    default: neverEndingPromise(),
  });
  const untouchedFields = new Map(fieldKeys.map(k => [k, false]));
  const rTouched = atomFamily<Map<string, boolean>, string>({
    key: `${name}-Touched`,
    default: untouchedFields,
  });
  const rParsed = selectorFamily<ZodParsedType<Effect>, string>({
    key: `${name}-Parsed`,
    get:
      (instanceKey: string) =>
      ({ get }: IRecoilGetParams) => {
        const value = get(rValue(instanceKey));
        const source = get(rSource(instanceKey));
        return getZodParser(source).safeParseAsync(value);
      },
  });
  const rChangedOutput = selectorFamily<boolean, string>({
    key: `${name}-ChangedOutput`,
    get:
      (instanceKey: string) =>
      async ({ get }: IRecoilGetParams) => {
        const source = get(rSource(instanceKey));
        const baseOutput = await getZodParser(source).safeParseAsync(
          get(rBaseValue(instanceKey))
        );
        const output = get(rParsed(instanceKey));
        if (!baseOutput.success) {
          return output.success;
        }
        return !output.success ? false : !isEqual(baseOutput.data, output.data);
      },
  });

  const useFormReset = (instanceKey: string) =>
    useRecoilCallback(({ set, snapshot }: CallbackInterface) => async () => {
      const baseValue = await snapshot.getPromise(rBaseValue(instanceKey));
      await set(rValue(instanceKey), baseValue);
      await set(rTouched(instanceKey), untouchedFields);
    });

  const useResetIfSourceChanged = () =>
    useRecoilCallback(
      ({ set, snapshot }: CallbackInterface) =>
        async (s: Source) => {
          const k = getInstanceKey(s);
          const stored = await snapshot.getPromise(rSource(k));
          if (!isEqual(s, stored)) {
            set(rSource(k), s);
            await set(rValue(k), load(s));
            await set(rTouched(k), untouchedFields);
          }
        }
    );

  const useFormController = (source: Source) => {
    const instanceKey = getInstanceKey(source);
    const initializedKey = useRef<string>('not' + instanceKey);

    const setSource = useSetRecoilState(rSource(instanceKey));
    const setValue = useSetRecoilState(rValue(instanceKey));

    const resetIfSourceChanged = useResetIfSourceChanged();
    const reset = useFormReset(instanceKey);

    useEffect(() => {
      setSource(source);
      setValue(load(source));
      return () => {
        // Reset on dismount
        reset();
      };
    }, []);

    useEffect(() => {
      if (initializedKey.current === instanceKey) {
        resetIfSourceChanged(source);
      } else {
        initializedKey.current = instanceKey;
        setSource(source);
        setValue(load(source));
      }
    }, [source]);

    return instanceKey;
  };

  const useForm = ({ instanceKey, submit, hideFieldErrors }: FormProps) => {
    const [value, updateValue] = useRecoilState(rValue(instanceKey));
    const [touched, updateTouched] = useRecoilState(rTouched(instanceKey));
    const parsed = useRecoilValueLoadable(rParsed(instanceKey)).valueMaybe();
    const changedOutput = useRecoilValueLoadable(
      rChangedOutput(instanceKey)
    ).valueMaybe();

    const reset = useFormReset(instanceKey);

    const handleSubmit = useRecoilCallback(
      ({ snapshot }: CallbackInterface) =>
        async () => {
          const value = await snapshot.getPromise(rValue(instanceKey));
          const source = await snapshot.getPromise(rSource(instanceKey));
          const output = (await getZodParser(source).parseAsync(
            value
          )) as Output;
          return submit(output);
        }
    );

    const fieldErrors = parsed?.success
      ? {}
      : ({
          ...parsed?.error.flatten().fieldErrors,
          formErrors: parsed?.error.flatten().formErrors,
        } as Record<string, string[]>);

    const fields = fieldKeys.reduce<Record<string, any>>((acc, field) => {
      acc[field] = {
        value: (value as Record<string, any>)[field],
        onChange: (newValue: any) =>
          updateValue(
            oldValue => ({ ...oldValue, [field]: newValue } as Input)
          ),
        onBlur: () =>
          updateTouched(
            (oldValue: Map<string, boolean>) =>
              new Map(oldValue.set(field, true))
          ),
        error: field in fieldErrors && touched.get(field),
        errorText:
          !hideFieldErrors && field in fieldErrors && touched.get(field)
            ? fieldErrors[field].join(', ')
            : undefined,
        ...(fieldProps[field] ?? {}),
      };
      return acc;
    }, {}) as unknown as Fields;

    return {
      instanceKey,
      handleSubmit,
      reset,
      fields,
      value,
      changedOutput,
      errors: mapValues(fieldErrors, (es: string[]) => es?.join(', ')),
      ready: parsed?.success,
    };
  };

  // Inner and Outer so the suspense stops children from rendering before init.
  const InnerFormController = ({
    children,
    ...props
  }: {
    children: (formProps: ReturnType<typeof useForm>) => React.ReactNode;
  } & FormProps) => {
    const formProps = useForm(props);

    return <>{children(formProps)}</>;
  };

  const FormController = ({
    children,
    source,
    ...props
  }: {
    children: (formProps: ReturnType<typeof useForm>) => React.ReactNode;
  } & ControllerProps) => {
    const instanceKey = useFormController(source);

    return (
      <Suspense fallback={null}>
        <InnerFormController {...props} instanceKey={instanceKey}>
          {children}
        </InnerFormController>
      </Suspense>
    );
  };

  return {
    FormController,
  };
};
