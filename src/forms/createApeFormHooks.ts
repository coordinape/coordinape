import { useEffect } from 'react';

import isEqual from 'lodash/isEqual';
import {
  atomFamily,
  useRecoilCallback,
  CallbackInterface,
  selectorFamily,
  useRecoilValue,
  useRecoilState,
} from 'recoil';
import { z } from 'zod';

import { assertDef } from 'utils/tools';

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

export default <
  Shape extends z.ZodRawShape,
  Z extends z.ZodObject<Shape, 'strict'>
>(
  schema: Z
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
}) => {
  const rSource = atomFamily<Source | undefined, string>({
    key: `ApeFormSource-${name}`,
    default: undefined,
  });
  const rBaseValue = selectorFamily<Z['_input'] | undefined, string>({
    key: `ApeFormBaseValue-${name}`,
    get: (instanceKey: string) => ({ get }: IRecoilGetParams) => {
      const source = get(rSource(instanceKey));
      return source === undefined ? undefined : load(source);
    },
  });
  const rValue = atomFamily<Z['_input'] | undefined, string>({
    key: `ApeFormValue-${name}`,
    default: undefined,
  });
  const rParsed = selectorFamily<ZodParsedType<Z>, string>({
    key: `ApeFormParsed-${name}`,
    get: (instanceKey: string) => ({ get }: IRecoilGetParams) => {
      const value = get(rValue(instanceKey));
      return schema.safeParse(value);
    },
  });
  const rChangedOutput = selectorFamily<boolean, string>({
    key: `ApeFormChangedOutput-${name}`,
    get: (instanceKey: string) => ({ get }: IRecoilGetParams) => {
      const baseOutput = schema.safeParse(get(rBaseValue(instanceKey)));
      const output = get(rParsed(instanceKey));
      if (!baseOutput.success) {
        return output.success;
      }
      return !output.success ? false : !isEqual(baseOutput.data, output.data);
    },
  });

  const resetWithInterface = async (
    instanceKey: string,
    { snapshot, set }: CallbackInterface
  ) => {
    const baseValue = assertDef(
      await snapshot.getPromise(rBaseValue(instanceKey)),
      `resetting ${name} rBaseValue(${instanceKey}) to be set`
    );
    await set(rValue(instanceKey), baseValue);
  };

  const useForm = <R>({
    source,
    submit,
  }: {
    source: Source;
    submit: (v: Z['_output']) => R;
  }) => {
    const instanceKey = getInstanceKey(source);
    const [value, updateValue] = useRecoilState(rValue(instanceKey));
    const parsed = useRecoilValue(rParsed(instanceKey));

    const reset = useRecoilCallback((recoil: CallbackInterface) => async () =>
      resetWithInterface(instanceKey, recoil)
    );

    const resetSourceIfChanged = useRecoilCallback(
      ({ set, snapshot }: CallbackInterface) => async (s: Source) => {
        const k = getInstanceKey(s);
        const stored = await snapshot.getPromise(rSource(k));
        const value = await snapshot.getPromise(rValue(k));
        if (value === undefined || !isEqual(s, stored)) {
          set(rSource(k), s);
          set(rValue(k), load(s));
        }
      }
    );

    useEffect(() => {
      resetSourceIfChanged(source);
    }, [source]);

    useEffect(() => {
      return () => {
        // Reset on dismount
        reset();
      };
    }, []);

    const handleSubmit = useRecoilCallback(
      ({ snapshot }: CallbackInterface) => async () => {
        const value = await snapshot.getPromise(rValue(instanceKey));
        const output = await schema.parseAsync(value);
        return submit(output);
      }
    );

    const rawFields = {} as Record<string, any>;
    if (value !== undefined) {
      const fieldErrors = parsed.success
        ? {}
        : parsed.error.flatten().fieldErrors;
      Object.keys(schema.shape).forEach((field) => {
        rawFields[field] = {
          value: (value as Record<string, any>)[field],
          onChange: (newValue: any) =>
            updateValue(
              (oldValue) => ({ ...oldValue, [field]: newValue } as Z['_input'])
            ),
          errorText:
            field in fieldErrors ? fieldErrors[field].join(', ') : undefined,
          ...(fieldProps[field] ?? {}),
        };
      });
    }

    const fields =
      value === undefined
        ? undefined
        : (rawFields as Merge<
            {
              [P in keyof Z['_input']]: {
                value: Z['_input'][P];
                onChange: (newValue: Z['_input'][P]) => void;
                errorText?: string;
              };
            },
            FProps
          >);

    return {
      instanceKey,
      handleSubmit,
      reset,
      fields,
    };
  };

  const useFormValues = (instanceKey: string) => {
    const value = useRecoilValue(rValue(instanceKey));
    const changedOutput = useRecoilValue(rChangedOutput(instanceKey));

    return {
      value,
      changedOutput,
    };
  };

  return {
    useForm,
    useFormValues,
    schema,
  };
};
