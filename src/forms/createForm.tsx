import React, { useEffect, useRef } from 'react';

import isEqual from 'lodash/isEqual';
import mapValues from 'lodash/mapValues';
import {
  atomFamily,
  useRecoilCallback,
  CallbackInterface,
  selectorFamily,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';
import { z } from 'zod';

import { BackdropSuspense } from 'components';
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

export const createForm = <
  Shape extends z.ZodRawShape,
  Z extends z.ZodObject<Shape, 'strict'>,
  Output extends unknown,
  ValidationCtx = undefined
>(
  schema: (v: ValidationCtx) => Z,
  transform: (s: Z, v: ValidationCtx) => z.ZodEffects<any, Output>
) => <Source, FProps extends { [k: string]: Record<string, any> }>({
  name,
  getInstanceKey,
  load,
  fieldProps,
}: {
  name: string;
  getInstanceKey: (s: Source) => string;
  load: (s: Source) => Z['_input'];
  fieldProps: FProps;
  hideErrorText?: boolean;
}) => {
  type Effect = ReturnType<typeof transform>;
  type Fields = Merge<
    {
      [P in keyof Z['_input']]: {
        value: Z['_input'][P];
        onChange: (newValue: Z['_input'][P]) => void;
        error: boolean;
        errorText?: string;
      };
    },
    FProps
  >;

  interface FormControllerProps {
    source: Source;
    validationCtx: ValidationCtx;
  }

  interface FormProps {
    submit: (v: Output) => any;
    hideFieldErrors?: boolean;
    instanceKey: string;
  }

  interface ControllerProps {
    source: Source;
    validationCtx: ValidationCtx;
    submit: (v: Output) => any;
    hideFieldErrors?: boolean;
  }

  const rSource = atomFamily<Source, string>({
    key: `ApeFormSource-${name}`,
    default: neverEndingPromise(),
  });
  const rValidationCtx = atomFamily<ValidationCtx, string>({
    key: `ApeFormValidationCtx-${name}`,
    default: neverEndingPromise(),
  });
  const rBaseValue = selectorFamily<Z['_input'], string>({
    key: `ApeFormBaseValue-${name}`,
    get: (instanceKey: string) => ({ get }: IRecoilGetParams) =>
      load(get(rSource(instanceKey))),
  });
  const rValue = atomFamily<Z['_input'], string>({
    key: `ApeFormValue-${name}`,
    default: neverEndingPromise(),
  });
  const rParsed = selectorFamily<ZodParsedType<Effect>, string>({
    key: `ApeFormParsed-${name}`,
    get: (instanceKey: string) => ({ get }: IRecoilGetParams) => {
      const value = get(rValue(instanceKey));
      const validationCtx = get(rValidationCtx(instanceKey));
      return transform(schema(validationCtx), validationCtx).safeParse(value);
    },
  });
  const rChangedOutput = selectorFamily<boolean, string>({
    key: `ApeFormChangedOutput-${name}`,
    get: (instanceKey: string) => ({ get }: IRecoilGetParams) => {
      const validationCtx = get(rValidationCtx(instanceKey));
      const baseOutput = transform(
        schema(validationCtx),
        validationCtx
      ).safeParse(get(rBaseValue(instanceKey)));
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
    });

  const useResetIfSourceChanged = () =>
    useRecoilCallback(
      ({ set, snapshot }: CallbackInterface) => async (s: Source) => {
        const k = getInstanceKey(s);
        const stored = await snapshot.getPromise(rSource(k));
        if (!isEqual(s, stored)) {
          set(rSource(k), s);
          console.log(`${name}.useResetIfSourceChanged load`);
          await set(rValue(k), load(s));
        }
      }
    );

  const useFormController = ({
    source,
    validationCtx,
  }: FormControllerProps) => {
    const instanceKey = getInstanceKey(source);
    const initializedKey = useRef<string>('not' + instanceKey);

    const setValidationCtx = useSetRecoilState(rValidationCtx(instanceKey));
    const setSource = useSetRecoilState(rSource(instanceKey));
    const setValue = useSetRecoilState(rValue(instanceKey));

    const resetIfSourceChanged = useResetIfSourceChanged();
    const reset = useFormReset(instanceKey);

    useEffect(() => {
      setValidationCtx(validationCtx);
      setSource(source);
      console.log(`${name}.useEffect[] load`, source);
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
        console.log(`${name}.useEffect[source] load`, source);
        setValue(load(source));
      }
    }, [source]);

    useEffect(() => {
      console.log(`${name}.useEffect[validationCtx] load`, validationCtx);
      setValidationCtx(validationCtx);
    }, [validationCtx]);

    return instanceKey;
  };

  const useForm = ({ instanceKey, submit, hideFieldErrors }: FormProps) => {
    const [value, updateValue] = useRecoilState(rValue(instanceKey));
    const parsed = useRecoilValue(rParsed(instanceKey));
    const validationCtx = useRecoilValue(rValidationCtx(instanceKey));
    const changedOutput = useRecoilValue(rChangedOutput(instanceKey));

    const reset = useFormReset(instanceKey);

    const handleSubmit = useRecoilCallback(
      ({ snapshot }: CallbackInterface) => async () => {
        const value = await snapshot.getPromise(rValue(instanceKey));
        const validationCtx = await snapshot.getPromise(
          rValidationCtx(instanceKey)
        );
        const output = (await transform(
          schema(validationCtx),
          validationCtx
        ).parseAsync(value)) as Output;
        return submit(output);
      }
    );

    const fieldErrors = parsed.success
      ? {}
      : ({
          ...parsed.error.flatten().fieldErrors,
          formErrors: parsed.error.flatten().formErrors,
        } as Record<string, string[]>);

    const fields = (Object.keys(schema(validationCtx).shape).reduce<
      Record<string, any>
    >((acc, field) => {
      acc[field] = {
        value: (value as Record<string, any>)[field],
        onChange: (newValue: any) =>
          updateValue(
            (oldValue) => ({ ...oldValue, [field]: newValue } as Z['_input'])
          ),
        error: field in fieldErrors,
        errorText:
          !hideFieldErrors && field in fieldErrors
            ? fieldErrors[field].join(', ')
            : undefined,
        ...(fieldProps[field] ?? {}),
      };
      return acc;
    }, {}) as unknown) as Fields;

    return {
      instanceKey,
      handleSubmit,
      reset,
      fields,
      value,
      changedOutput,
      errors: mapValues(fieldErrors, (es: string[]) => es.join(', ')),
    };
  };

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
    validationCtx,
    ...props
  }: {
    children: (formProps: ReturnType<typeof useForm>) => React.ReactNode;
  } & ControllerProps) => {
    const instanceKey = useFormController({ source, validationCtx });

    return (
      <BackdropSuspense>
        <InnerFormController {...props} instanceKey={instanceKey}>
          {children}
        </InnerFormController>
      </BackdropSuspense>
    );
  };

  return {
    useFormController,
    useForm,
    schema,
    FormController,
    nothing: ({} as unknown) as ValidationCtx,
  };
};
