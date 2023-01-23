import {
  apiFetch,
  FetchFunction,
  fullChainConstruct,
  GenericOperation,
  GraphQLTypes,
  InputType,
  OperationOptions,
  ValueTypes,
} from './__generated__/zeus';
import { Ops } from './__generated__/zeus/const';

type ThunderOptions = {
  url: string;
  headers: Record<string, string>;
  timeout?: number;
};

/* A bit verbose TS, but this allows us to enforce OperationName as a required */
export const ThunderRequireOperationName =
  (fn: FetchFunction) =>
  <
    O extends keyof typeof Ops,
    R extends keyof ValueTypes = GenericOperation<O>
  >(
    operation: O
  ) =>
  <Z extends ValueTypes[R]>(
    o: Z | ValueTypes[R],
    ops: Omit<OperationOptions, 'operationName'> & { operationName: string }
  ) =>
    fullChainConstruct(fn)(operation)(o as any, ops) as Promise<
      InputType<GraphQLTypes[R], Z>
    >;

export const makeThunder = ({ url, headers, timeout = 0 }: ThunderOptions) =>
  ThunderRequireOperationName(async (...params) =>
    apiFetch([url, { method: 'POST', headers, timeout: timeout }])(...params)
  );
