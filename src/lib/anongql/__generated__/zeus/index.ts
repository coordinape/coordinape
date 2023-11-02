/* eslint-disable */
import { DebugLogger } from 'common-lib/log';
const logger = new DebugLogger('zeus');

import { AllTypesProps, ReturnTypes, Ops } from './const';
export const HOST = 'http://localhost:8080/v1/graphql';

const handleFetchResponse = (response: Response): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response
        .text()
        .then(text => {
          try {
            reject(JSON.parse(text));
          } catch (err) {
            reject(text);
          }
        })
        .catch(reject);
    });
  }
  return response.json();
};

export const apiFetch =
  (options: fetchOptions) =>
  (query: string, variables: Record<string, unknown> = {}) => {
    const fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      return fetch(
        `${options[0]}?query=${encodeURIComponent(query)}`,
        fetchOptions
      )
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    return fetch(`${options[0]}`, {
      body: JSON.stringify({ query, variables }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      ...fetchOptions,
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };

export const apiSubscription = (options: chainOptions) => (query: string) => {
  try {
    const queryString = options[0] + '?query=' + encodeURIComponent(query);
    const wsString = queryString.replace('http', 'ws');
    const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
    const webSocketOptions = options[1]?.websocket || [host];
    const ws = new WebSocket(...webSocketOptions);
    return {
      ws,
      on: (e: (args: any) => void) => {
        ws.onmessage = (event: any) => {
          if (event.data) {
            const parsed = JSON.parse(event.data);
            const data = parsed.data;
            return e(data);
          }
        };
      },
      off: (e: (args: any) => void) => {
        ws.onclose = e;
      },
      error: (e: (args: any) => void) => {
        ws.onerror = e;
      },
      open: (e: () => void) => {
        ws.onopen = e;
      },
    };
  } catch {
    throw new Error('No websockets implemented');
  }
};

export const InternalsBuildQuery = (
  props: AllTypesPropsType,
  returns: ReturnTypesType,
  ops: Operations,
  options?: OperationOptions
) => {
  const ibb = (
    k: string,
    o: InputValueType | VType,
    p = '',
    root = true
  ): string => {
    const keyForPath = purifyGraphQLKey(k);
    const newPath = [p, keyForPath].join(SEPARATOR);
    if (!o) {
      return '';
    }
    if (typeof o === 'boolean' || typeof o === 'number') {
      return k;
    }
    if (typeof o === 'string') {
      return `${k} ${o}`;
    }
    if (Array.isArray(o)) {
      const args = InternalArgsBuilt(
        props,
        returns,
        ops,
        options?.variables?.values
      )(o[0], newPath);
      return `${ibb(args ? `${k}(${args})` : k, o[1], p, false)}`;
    }
    if (k === '__alias') {
      return Object.entries(o)
        .map(([alias, objectUnderAlias]) => {
          if (
            typeof objectUnderAlias !== 'object' ||
            Array.isArray(objectUnderAlias)
          ) {
            throw new Error(
              'Invalid alias it should be __alias:{ YOUR_ALIAS_NAME: { OPERATION_NAME: { ...selectors }}}'
            );
          }
          const operationName = Object.keys(objectUnderAlias)[0];
          const operation = objectUnderAlias[operationName];
          return ibb(`${alias}:${operationName}`, operation, p, false);
        })
        .join('\n');
    }
    const hasOperationName =
      root && options?.operationName ? ' ' + options.operationName : '';
    const hasVariables =
      root && options?.variables?.$params
        ? `(${options.variables?.$params})`
        : '';
    const keyForDirectives = o.__directives ?? '';
    return `${k} ${keyForDirectives}${hasOperationName}${hasVariables}{${Object.entries(
      o
    )
      .filter(([k]) => k !== '__directives')
      .map(e => ibb(...e, [p, `field<>${keyForPath}`].join(SEPARATOR), false))
      .join('\n')}}`;
  };
  return ibb;
};

export const Thunder =
  (fn: FetchFunction) =>
  <
    O extends keyof typeof Ops,
    R extends keyof ValueTypes = GenericOperation<O>
  >(
    operation: O
  ) =>
  <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions) =>
    fullChainConstruct(fn)(operation)(o as any, ops) as Promise<
      InputType<GraphQLTypes[R], Z>
    >;

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));

export const SubscriptionThunder =
  (fn: SubscriptionFunction) =>
  <
    O extends keyof typeof Ops,
    R extends keyof ValueTypes = GenericOperation<O>
  >(
    operation: O
  ) =>
  <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions) =>
    fullSubscriptionConstruct(fn)(operation)(
      o as any,
      ops
    ) as SubscriptionToGraphQL<Z, GraphQLTypes[R]>;

export const Subscription = (...options: chainOptions) =>
  SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends keyof typeof Ops,
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
  o: Z | ValueTypes[R],
  ops?: OperationOptions
) =>
  InternalsBuildQuery(
    AllTypesProps,
    ReturnTypes,
    Ops,
    ops
  )(operation, o as any);
export const Selector = <T extends keyof ValueTypes>(key: T) =>
  ZeusSelect<ValueTypes[T]>();

export const Gql = Chain(HOST);

export const fullChainConstruct =
  (fn: FetchFunction) =>
  (t: 'query' | 'mutation' | 'subscription') =>
  (o: Record<any, any>, options?: OperationOptions) => {
    const builder = InternalsBuildQuery(
      AllTypesProps,
      ReturnTypes,
      Ops,
      options
    );
    return fn(builder(t, o), options?.variables?.values);
  };

export const fullSubscriptionConstruct =
  (fn: SubscriptionFunction) =>
  (t: 'query' | 'mutation' | 'subscription') =>
  (o: Record<any, any>, options?: OperationOptions) => {
    const builder = InternalsBuildQuery(
      AllTypesProps,
      ReturnTypes,
      Ops,
      options
    );
    return fn(builder(t, o));
  };

export type AllTypesPropsType = {
  [x: string]:
    | undefined
    | boolean
    | {
        [x: string]:
          | undefined
          | string
          | {
              [x: string]: string | undefined;
            };
      };
};

export type ReturnTypesType = {
  [x: string]:
    | {
        [x: string]: string | undefined;
      }
    | undefined;
};
export type InputValueType = {
  [x: string]:
    | undefined
    | boolean
    | string
    | number
    | [any, undefined | boolean | InputValueType]
    | InputValueType;
};
export type VType =
  | undefined
  | boolean
  | string
  | number
  | [any, undefined | boolean | InputValueType]
  | InputValueType;

export type PlainType = boolean | number | string | null | undefined;
export type ZeusArgsType =
  | PlainType
  | {
      [x: string]: ZeusArgsType;
    }
  | Array<ZeusArgsType>;

export type Operations = Record<string, string | undefined>;

export type VariableDefinition = {
  [x: string]: unknown;
};

export const SEPARATOR = '|';

export type fetchOptions = Parameters<typeof fetch>;
type websocketOptions = typeof WebSocket extends new (
  ...args: infer R
) => WebSocket
  ? R
  : never;
export type chainOptions =
  | [fetchOptions[0], fetchOptions[1] & { websocket?: websocketOptions }]
  | [fetchOptions[0]];
export type FetchFunction = (
  query: string,
  variables?: Record<string, any>
) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<
  F extends [infer ARGS, any] ? ARGS : undefined
>;

export type OperationOptions<
  Z extends Record<string, unknown> = Record<string, unknown>
> = {
  variables?: VariableInput<Z>;
  operationName?: string;
};

export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
export class GraphQLError extends Error {
  constructor(public response: GraphQLResponse) {
    super(response.errors?.map(e => e.message).join('. '));
    logger.log(JSON.stringify(response, null, 2));
  }
  toString() {
    return 'GraphQL Response Error';
  }
}
export type GenericOperation<O> = O extends keyof typeof Ops
  ? typeof Ops[O]
  : never;

export const purifyGraphQLKey = (k: string) =>
  k.replace(/\([^)]*\)/g, '').replace(/^[^:]*\:/g, '');

const mapPart = (p: string) => {
  const [isArg, isField] = p.split('<>');
  if (isField) {
    return {
      v: isField,
      __type: 'field',
    } as const;
  }
  return {
    v: isArg,
    __type: 'arg',
  } as const;
};

type Part = ReturnType<typeof mapPart>;

export const ResolveFromPath = (
  props: AllTypesPropsType,
  returns: ReturnTypesType,
  ops: Operations
) => {
  const ResolvePropsType = (mappedParts: Part[]) => {
    const oKey = ops[mappedParts[0].v];
    const propsP1 = oKey ? props[oKey] : props[mappedParts[0].v];
    if (typeof propsP1 === 'boolean' && mappedParts.length === 1) {
      return 'enum';
    }
    if (typeof propsP1 === 'object') {
      const propsP2 = propsP1[mappedParts[1].v];
      if (typeof propsP2 === 'string') {
        return rpp(
          `${propsP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map(mp => mp.v)
            .join(SEPARATOR)}`
        );
      }
      if (typeof propsP2 === 'object') {
        const propsP3 = propsP2[mappedParts[2].v];
        if (propsP3 && mappedParts[2].__type === 'arg') {
          return rpp(
            `${propsP3}${SEPARATOR}${mappedParts
              .slice(3)
              .map(mp => mp.v)
              .join(SEPARATOR)}`
          );
        }
      }
    }
  };
  const ResolveReturnType = (mappedParts: Part[]) => {
    const oKey = ops[mappedParts[0].v];
    const returnP1 = oKey ? returns[oKey] : returns[mappedParts[0].v];
    if (typeof returnP1 === 'object') {
      const returnP2 = returnP1[mappedParts[1].v];
      if (returnP2) {
        return rpp(
          `${returnP2}${SEPARATOR}${mappedParts
            .slice(2)
            .map(mp => mp.v)
            .join(SEPARATOR)}`
        );
      }
    }
  };
  const rpp = (path: string): 'enum' | 'not' => {
    const parts = path.split(SEPARATOR).filter(l => l.length > 0);
    const mappedParts = parts.map(mapPart);
    const propsP1 = ResolvePropsType(mappedParts);
    if (propsP1) {
      return propsP1;
    }
    const returnP1 = ResolveReturnType(mappedParts);
    if (returnP1) {
      return returnP1;
    }
    return 'not';
  };
  return rpp;
};

export const InternalArgsBuilt = (
  props: AllTypesPropsType,
  returns: ReturnTypesType,
  ops: Operations,
  variables?: Record<string, unknown>
) => {
  const arb = (a: ZeusArgsType, p = '', root = true): string => {
    if (Array.isArray(a)) {
      return `[${a.map(arr => arb(arr, p, false)).join(', ')}]`;
    }
    if (typeof a === 'string') {
      if (a.startsWith('$') && variables?.[a.slice(1)]) {
        return a;
      }
      const checkType = ResolveFromPath(props, returns, ops)(p);
      if (checkType === 'enum') {
        return a;
      }
      return `${JSON.stringify(a)}`;
    }
    if (typeof a === 'object') {
      if (a === null) {
        return `null`;
      }
      const returnedObjectString = Object.entries(a)
        .filter(([, v]) => typeof v !== 'undefined')
        .map(([k, v]) => `${k}: ${arb(v, [p, k].join(SEPARATOR), false)}`)
        .join(',\n');
      if (!root) {
        return `{${returnedObjectString}}`;
      }
      return returnedObjectString;
    }
    return `${a}`;
  };
  return arb;
};

export const resolverFor = <
  X,
  T extends keyof ValueTypes,
  Z extends keyof ValueTypes[T]
>(
  type: T,
  field: Z,
  fn: (
    args: Required<ValueTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any
  ) => Z extends keyof ModelTypes[T]
    ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X
    : any
) => fn as (args?: any, source?: any) => any;

export type SelectionFunction<V> = <T>(t: T | V) => T;
export const ZeusSelect = <T>() => ((t: unknown) => t) as SelectionFunction<T>;

export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
export type ZeusState<T extends (...args: any[]) => Promise<any>> = NonNullable<
  UnwrapPromise<ReturnType<T>>
>;
export type ZeusHook<
  T extends (
    ...args: any[]
  ) => Record<string, (...args: any[]) => Promise<any>>,
  N extends keyof ReturnType<T>
> = ZeusState<ReturnType<T>[N]>;

export type WithTypeNameValue<T> = T & {
  __typename?: boolean;
  __directives?: string;
};
export type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
type IsArray<T, U> = T extends Array<infer R>
  ? InputType<R, U>[]
  : InputType<T, U>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string;

type IsInterfaced<SRC extends DeepAnify<DST>, DST> = FlattenArray<SRC> extends
  | ZEUS_INTERFACES
  | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<
              R,
              '__typename' extends keyof DST
                ? DST[P] & { __typename: true }
                : DST[P]
            >
          : Record<string, unknown>
        : never;
    }[keyof DST] & {
      [P in keyof Omit<
        Pick<
          SRC,
          {
            [P in keyof DST]: SRC[P] extends '__union' & infer R ? never : P;
          }[keyof DST]
        >,
        '__typename'
      >]: IsPayLoad<DST[P]> extends BaseZeusResolver
        ? SRC[P]
        : IsArray<SRC[P], DST[P]>;
    }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<
        DST[P]
      > extends BaseZeusResolver
        ? SRC[P]
        : IsArray<SRC[P], DST[P]>;
    };

export type MapType<SRC, DST> = SRC extends DeepAnify<DST>
  ? IsInterfaced<SRC, DST>
  : never;
export type InputType<SRC, DST> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P]>[keyof MapType<SRC, R[P]>];
    } & MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>>
  : MapType<SRC, IsPayLoad<DST>>;
export type SubscriptionToGraphQL<Z, T> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z>) => void) => void;
  off: (
    fn: (e: {
      data?: InputType<T, Z>;
      code?: number;
      reason?: string;
      message?: string;
    }) => void
  ) => void;
  error: (
    fn: (e: { data?: InputType<T, Z>; errors?: string[] }) => void
  ) => void;
  open: () => void;
};

export const useZeusVariables =
  <T>(variables: T) =>
  <
    Z extends {
      [P in keyof T]: unknown;
    }
  >(
    values: Z
  ) => {
    return {
      $params: Object.keys(variables)
        .map(k => `$${k}: ${variables[k as keyof T]}`)
        .join(', '),
      $: <U extends keyof Z>(variable: U) => {
        return `$${variable}` as unknown as Z[U];
      },
      values,
    };
  };

export type VariableInput<Z extends Record<string, unknown>> = {
  $params: ReturnType<ReturnType<typeof useZeusVariables>>['$params'];
  values: Z;
};

type ZEUS_INTERFACES = never;
type ZEUS_UNIONS = never;

export type ValueTypes = {
  /** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
  ['Int_comparison_exp']: {
    _eq?: number | undefined | null;
    _gt?: number | undefined | null;
    _gte?: number | undefined | null;
    _in?: Array<number> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: number | undefined | null;
    _lte?: number | undefined | null;
    _neq?: number | undefined | null;
    _nin?: Array<number> | undefined | null;
  };
  /** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
  ['String_comparison_exp']: {
    _eq?: string | undefined | null;
    _gt?: string | undefined | null;
    _gte?: string | undefined | null;
    /** does the column match the given case-insensitive pattern */
    _ilike?: string | undefined | null;
    _in?: Array<string> | undefined | null;
    /** does the column match the given POSIX regular expression, case insensitive */
    _iregex?: string | undefined | null;
    _is_null?: boolean | undefined | null;
    /** does the column match the given pattern */
    _like?: string | undefined | null;
    _lt?: string | undefined | null;
    _lte?: string | undefined | null;
    _neq?: string | undefined | null;
    /** does the column NOT match the given case-insensitive pattern */
    _nilike?: string | undefined | null;
    _nin?: Array<string> | undefined | null;
    /** does the column NOT match the given POSIX regular expression, case insensitive */
    _niregex?: string | undefined | null;
    /** does the column NOT match the given pattern */
    _nlike?: string | undefined | null;
    /** does the column NOT match the given POSIX regular expression, case sensitive */
    _nregex?: string | undefined | null;
    /** does the column NOT match the given SQL regular expression */
    _nsimilar?: string | undefined | null;
    /** does the column match the given POSIX regular expression, case sensitive */
    _regex?: string | undefined | null;
    /** does the column match the given SQL regular expression */
    _similar?: string | undefined | null;
  };
  ['bigint']: number;
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_comparison_exp']: {
    _eq?: ValueTypes['bigint'] | undefined | null;
    _gt?: ValueTypes['bigint'] | undefined | null;
    _gte?: ValueTypes['bigint'] | undefined | null;
    _in?: Array<ValueTypes['bigint']> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: ValueTypes['bigint'] | undefined | null;
    _lte?: ValueTypes['bigint'] | undefined | null;
    _neq?: ValueTypes['bigint'] | undefined | null;
    _nin?: Array<ValueTypes['bigint']> | undefined | null;
  };
  ['citext']: unknown;
  /** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
  ['citext_comparison_exp']: {
    _eq?: ValueTypes['citext'] | undefined | null;
    _gt?: ValueTypes['citext'] | undefined | null;
    _gte?: ValueTypes['citext'] | undefined | null;
    /** does the column match the given case-insensitive pattern */
    _ilike?: ValueTypes['citext'] | undefined | null;
    _in?: Array<ValueTypes['citext']> | undefined | null;
    /** does the column match the given POSIX regular expression, case insensitive */
    _iregex?: ValueTypes['citext'] | undefined | null;
    _is_null?: boolean | undefined | null;
    /** does the column match the given pattern */
    _like?: ValueTypes['citext'] | undefined | null;
    _lt?: ValueTypes['citext'] | undefined | null;
    _lte?: ValueTypes['citext'] | undefined | null;
    _neq?: ValueTypes['citext'] | undefined | null;
    /** does the column NOT match the given case-insensitive pattern */
    _nilike?: ValueTypes['citext'] | undefined | null;
    _nin?: Array<ValueTypes['citext']> | undefined | null;
    /** does the column NOT match the given POSIX regular expression, case insensitive */
    _niregex?: ValueTypes['citext'] | undefined | null;
    /** does the column NOT match the given pattern */
    _nlike?: ValueTypes['citext'] | undefined | null;
    /** does the column NOT match the given POSIX regular expression, case sensitive */
    _nregex?: ValueTypes['citext'] | undefined | null;
    /** does the column NOT match the given SQL regular expression */
    _nsimilar?: ValueTypes['citext'] | undefined | null;
    /** does the column match the given POSIX regular expression, case sensitive */
    _regex?: ValueTypes['citext'] | undefined | null;
    /** does the column match the given SQL regular expression */
    _similar?: ValueTypes['citext'] | undefined | null;
  };
  /** local db copy of last synced on-chain cosoul data */
  ['cosouls']: AliasType<{
    address?: boolean | `@${string}`;
    held_keys?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['key_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['key_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['key_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['key_holders']
    ];
    held_keys_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['key_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['key_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['key_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['key_holders_aggregate']
    ];
    id?: boolean | `@${string}`;
    key_holders?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['key_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['key_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['key_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['key_holders']
    ];
    key_holders_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['key_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['key_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['key_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['key_holders_aggregate']
    ];
    pgive?: boolean | `@${string}`;
    poaps?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders']
    ];
    poaps_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders_aggregate']
    ];
    /** An object relationship */
    profile_public?: ValueTypes['profiles_public'];
    token_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "cosouls". All fields are combined with a logical 'AND'. */
  ['cosouls_bool_exp']: {
    _and?: Array<ValueTypes['cosouls_bool_exp']> | undefined | null;
    _not?: ValueTypes['cosouls_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['cosouls_bool_exp']> | undefined | null;
    address?: ValueTypes['citext_comparison_exp'] | undefined | null;
    held_keys?: ValueTypes['key_holders_bool_exp'] | undefined | null;
    held_keys_aggregate?:
      | ValueTypes['key_holders_aggregate_bool_exp']
      | undefined
      | null;
    id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    key_holders?: ValueTypes['key_holders_bool_exp'] | undefined | null;
    key_holders_aggregate?:
      | ValueTypes['key_holders_aggregate_bool_exp']
      | undefined
      | null;
    pgive?: ValueTypes['Int_comparison_exp'] | undefined | null;
    poaps?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
    poaps_aggregate?:
      | ValueTypes['poap_holders_aggregate_bool_exp']
      | undefined
      | null;
    profile_public?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    token_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "cosouls". */
  ['cosouls_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    held_keys_aggregate?:
      | ValueTypes['key_holders_aggregate_order_by']
      | undefined
      | null;
    id?: ValueTypes['order_by'] | undefined | null;
    key_holders_aggregate?:
      | ValueTypes['key_holders_aggregate_order_by']
      | undefined
      | null;
    pgive?: ValueTypes['order_by'] | undefined | null;
    poaps_aggregate?:
      | ValueTypes['poap_holders_aggregate_order_by']
      | undefined
      | null;
    profile_public?: ValueTypes['profiles_public_order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "cosouls" */
  ['cosouls_select_column']: cosouls_select_column;
  /** Streaming cursor of the table "cosouls" */
  ['cosouls_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['cosouls_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['cosouls_stream_cursor_value_input']: {
    address?: ValueTypes['citext'] | undefined | null;
    id?: number | undefined | null;
    pgive?: number | undefined | null;
    token_id?: number | undefined | null;
  };
  /** ordering argument of a cursor */
  ['cursor_ordering']: cursor_ordering;
  ['date']: unknown;
  /** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
  ['date_comparison_exp']: {
    _eq?: ValueTypes['date'] | undefined | null;
    _gt?: ValueTypes['date'] | undefined | null;
    _gte?: ValueTypes['date'] | undefined | null;
    _in?: Array<ValueTypes['date']> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: ValueTypes['date'] | undefined | null;
    _lte?: ValueTypes['date'] | undefined | null;
    _neq?: ValueTypes['date'] | undefined | null;
    _nin?: Array<ValueTypes['date']> | undefined | null;
  };
  ['float8']: unknown;
  /** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
  ['float8_comparison_exp']: {
    _eq?: ValueTypes['float8'] | undefined | null;
    _gt?: ValueTypes['float8'] | undefined | null;
    _gte?: ValueTypes['float8'] | undefined | null;
    _in?: Array<ValueTypes['float8']> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: ValueTypes['float8'] | undefined | null;
    _lte?: ValueTypes['float8'] | undefined | null;
    _neq?: ValueTypes['float8'] | undefined | null;
    _nin?: Array<ValueTypes['float8']> | undefined | null;
  };
  /** tracks the amount of keys an address holds in a given subject. updated with data from the key_tx table */
  ['key_holders']: AliasType<{
    address?: boolean | `@${string}`;
    /** An object relationship */
    address_cosoul?: ValueTypes['cosouls'];
    amount?: boolean | `@${string}`;
    subject?: boolean | `@${string}`;
    /** An object relationship */
    subject_cosoul?: ValueTypes['cosouls'];
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregated selection of "key_holders" */
  ['key_holders_aggregate']: AliasType<{
    aggregate?: ValueTypes['key_holders_aggregate_fields'];
    nodes?: ValueTypes['key_holders'];
    __typename?: boolean | `@${string}`;
  }>;
  ['key_holders_aggregate_bool_exp']: {
    count?:
      | ValueTypes['key_holders_aggregate_bool_exp_count']
      | undefined
      | null;
  };
  ['key_holders_aggregate_bool_exp_count']: {
    arguments?:
      | Array<ValueTypes['key_holders_select_column']>
      | undefined
      | null;
    distinct?: boolean | undefined | null;
    filter?: ValueTypes['key_holders_bool_exp'] | undefined | null;
    predicate: ValueTypes['Int_comparison_exp'];
  };
  /** aggregate fields of "key_holders" */
  ['key_holders_aggregate_fields']: AliasType<{
    avg?: ValueTypes['key_holders_avg_fields'];
    count?: [
      {
        columns?:
          | Array<ValueTypes['key_holders_select_column']>
          | undefined
          | null;
        distinct?: boolean | undefined | null;
      },
      boolean | `@${string}`
    ];
    max?: ValueTypes['key_holders_max_fields'];
    min?: ValueTypes['key_holders_min_fields'];
    stddev?: ValueTypes['key_holders_stddev_fields'];
    stddev_pop?: ValueTypes['key_holders_stddev_pop_fields'];
    stddev_samp?: ValueTypes['key_holders_stddev_samp_fields'];
    sum?: ValueTypes['key_holders_sum_fields'];
    var_pop?: ValueTypes['key_holders_var_pop_fields'];
    var_samp?: ValueTypes['key_holders_var_samp_fields'];
    variance?: ValueTypes['key_holders_variance_fields'];
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "key_holders" */
  ['key_holders_aggregate_order_by']: {
    avg?: ValueTypes['key_holders_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['key_holders_max_order_by'] | undefined | null;
    min?: ValueTypes['key_holders_min_order_by'] | undefined | null;
    stddev?: ValueTypes['key_holders_stddev_order_by'] | undefined | null;
    stddev_pop?:
      | ValueTypes['key_holders_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['key_holders_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['key_holders_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['key_holders_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['key_holders_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['key_holders_variance_order_by'] | undefined | null;
  };
  /** aggregate avg on columns */
  ['key_holders_avg_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by avg() on columns of table "key_holders" */
  ['key_holders_avg_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "key_holders". All fields are combined with a logical 'AND'. */
  ['key_holders_bool_exp']: {
    _and?: Array<ValueTypes['key_holders_bool_exp']> | undefined | null;
    _not?: ValueTypes['key_holders_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['key_holders_bool_exp']> | undefined | null;
    address?: ValueTypes['citext_comparison_exp'] | undefined | null;
    address_cosoul?: ValueTypes['cosouls_bool_exp'] | undefined | null;
    amount?: ValueTypes['Int_comparison_exp'] | undefined | null;
    subject?: ValueTypes['citext_comparison_exp'] | undefined | null;
    subject_cosoul?: ValueTypes['cosouls_bool_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
  };
  /** aggregate max on columns */
  ['key_holders_max_fields']: AliasType<{
    address?: boolean | `@${string}`;
    amount?: boolean | `@${string}`;
    subject?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by max() on columns of table "key_holders" */
  ['key_holders_max_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    amount?: ValueTypes['order_by'] | undefined | null;
    subject?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate min on columns */
  ['key_holders_min_fields']: AliasType<{
    address?: boolean | `@${string}`;
    amount?: boolean | `@${string}`;
    subject?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by min() on columns of table "key_holders" */
  ['key_holders_min_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    amount?: ValueTypes['order_by'] | undefined | null;
    subject?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "key_holders". */
  ['key_holders_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    address_cosoul?: ValueTypes['cosouls_order_by'] | undefined | null;
    amount?: ValueTypes['order_by'] | undefined | null;
    subject?: ValueTypes['order_by'] | undefined | null;
    subject_cosoul?: ValueTypes['cosouls_order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "key_holders" */
  ['key_holders_select_column']: key_holders_select_column;
  /** aggregate stddev on columns */
  ['key_holders_stddev_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev() on columns of table "key_holders" */
  ['key_holders_stddev_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_pop on columns */
  ['key_holders_stddev_pop_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_pop() on columns of table "key_holders" */
  ['key_holders_stddev_pop_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_samp on columns */
  ['key_holders_stddev_samp_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_samp() on columns of table "key_holders" */
  ['key_holders_stddev_samp_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** Streaming cursor of the table "key_holders" */
  ['key_holders_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['key_holders_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['key_holders_stream_cursor_value_input']: {
    address?: ValueTypes['citext'] | undefined | null;
    amount?: number | undefined | null;
    subject?: ValueTypes['citext'] | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
  };
  /** aggregate sum on columns */
  ['key_holders_sum_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by sum() on columns of table "key_holders" */
  ['key_holders_sum_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_pop on columns */
  ['key_holders_var_pop_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_pop() on columns of table "key_holders" */
  ['key_holders_var_pop_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_samp on columns */
  ['key_holders_var_samp_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_samp() on columns of table "key_holders" */
  ['key_holders_var_samp_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate variance on columns */
  ['key_holders_variance_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by variance() on columns of table "key_holders" */
  ['key_holders_variance_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** column ordering options */
  ['order_by']: order_by;
  /** Poap event info */
  ['poap_events']: AliasType<{
    city?: boolean | `@${string}`;
    country?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    description?: boolean | `@${string}`;
    embedding?: boolean | `@${string}`;
    end_date?: boolean | `@${string}`;
    event_url?: boolean | `@${string}`;
    expiry_date?: boolean | `@${string}`;
    fancy_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    image_url?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    start_date?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregated selection of "poap_events" */
  ['poap_events_aggregate']: AliasType<{
    aggregate?: ValueTypes['poap_events_aggregate_fields'];
    nodes?: ValueTypes['poap_events'];
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate fields of "poap_events" */
  ['poap_events_aggregate_fields']: AliasType<{
    avg?: ValueTypes['poap_events_avg_fields'];
    count?: [
      {
        columns?:
          | Array<ValueTypes['poap_events_select_column']>
          | undefined
          | null;
        distinct?: boolean | undefined | null;
      },
      boolean | `@${string}`
    ];
    max?: ValueTypes['poap_events_max_fields'];
    min?: ValueTypes['poap_events_min_fields'];
    stddev?: ValueTypes['poap_events_stddev_fields'];
    stddev_pop?: ValueTypes['poap_events_stddev_pop_fields'];
    stddev_samp?: ValueTypes['poap_events_stddev_samp_fields'];
    sum?: ValueTypes['poap_events_sum_fields'];
    var_pop?: ValueTypes['poap_events_var_pop_fields'];
    var_samp?: ValueTypes['poap_events_var_samp_fields'];
    variance?: ValueTypes['poap_events_variance_fields'];
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate avg on columns */
  ['poap_events_avg_fields']: AliasType<{
    id?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "poap_events". All fields are combined with a logical 'AND'. */
  ['poap_events_bool_exp']: {
    _and?: Array<ValueTypes['poap_events_bool_exp']> | undefined | null;
    _not?: ValueTypes['poap_events_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['poap_events_bool_exp']> | undefined | null;
    city?: ValueTypes['String_comparison_exp'] | undefined | null;
    country?: ValueTypes['String_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    description?: ValueTypes['String_comparison_exp'] | undefined | null;
    embedding?: ValueTypes['vector_comparison_exp'] | undefined | null;
    end_date?: ValueTypes['date_comparison_exp'] | undefined | null;
    event_url?: ValueTypes['String_comparison_exp'] | undefined | null;
    expiry_date?: ValueTypes['date_comparison_exp'] | undefined | null;
    fancy_id?: ValueTypes['String_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    image_url?: ValueTypes['String_comparison_exp'] | undefined | null;
    name?: ValueTypes['String_comparison_exp'] | undefined | null;
    poap_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    similarity?: ValueTypes['float8_comparison_exp'] | undefined | null;
    start_date?: ValueTypes['date_comparison_exp'] | undefined | null;
    supply?: ValueTypes['Int_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    year?: ValueTypes['Int_comparison_exp'] | undefined | null;
  };
  /** aggregate max on columns */
  ['poap_events_max_fields']: AliasType<{
    city?: boolean | `@${string}`;
    country?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    description?: boolean | `@${string}`;
    end_date?: boolean | `@${string}`;
    event_url?: boolean | `@${string}`;
    expiry_date?: boolean | `@${string}`;
    fancy_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    image_url?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    start_date?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate min on columns */
  ['poap_events_min_fields']: AliasType<{
    city?: boolean | `@${string}`;
    country?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    description?: boolean | `@${string}`;
    end_date?: boolean | `@${string}`;
    event_url?: boolean | `@${string}`;
    expiry_date?: boolean | `@${string}`;
    fancy_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    image_url?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    start_date?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Ordering options when selecting data from "poap_events". */
  ['poap_events_order_by']: {
    city?: ValueTypes['order_by'] | undefined | null;
    country?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
    embedding?: ValueTypes['order_by'] | undefined | null;
    end_date?: ValueTypes['order_by'] | undefined | null;
    event_url?: ValueTypes['order_by'] | undefined | null;
    expiry_date?: ValueTypes['order_by'] | undefined | null;
    fancy_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    image_url?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    poap_id?: ValueTypes['order_by'] | undefined | null;
    similarity?: ValueTypes['order_by'] | undefined | null;
    start_date?: ValueTypes['order_by'] | undefined | null;
    supply?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    year?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "poap_events" */
  ['poap_events_select_column']: poap_events_select_column;
  /** aggregate stddev on columns */
  ['poap_events_stddev_fields']: AliasType<{
    id?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate stddev_pop on columns */
  ['poap_events_stddev_pop_fields']: AliasType<{
    id?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate stddev_samp on columns */
  ['poap_events_stddev_samp_fields']: AliasType<{
    id?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Streaming cursor of the table "poap_events" */
  ['poap_events_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['poap_events_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['poap_events_stream_cursor_value_input']: {
    city?: string | undefined | null;
    country?: string | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    description?: string | undefined | null;
    embedding?: ValueTypes['vector'] | undefined | null;
    end_date?: ValueTypes['date'] | undefined | null;
    event_url?: string | undefined | null;
    expiry_date?: ValueTypes['date'] | undefined | null;
    fancy_id?: string | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    image_url?: string | undefined | null;
    name?: string | undefined | null;
    poap_id?: number | undefined | null;
    similarity?: ValueTypes['float8'] | undefined | null;
    start_date?: ValueTypes['date'] | undefined | null;
    supply?: number | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
    year?: number | undefined | null;
  };
  /** aggregate sum on columns */
  ['poap_events_sum_fields']: AliasType<{
    id?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate var_pop on columns */
  ['poap_events_var_pop_fields']: AliasType<{
    id?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate var_samp on columns */
  ['poap_events_var_samp_fields']: AliasType<{
    id?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate variance on columns */
  ['poap_events_variance_fields']: AliasType<{
    id?: boolean | `@${string}`;
    poap_id?: boolean | `@${string}`;
    similarity?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    year?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** columns and relationships of "poap_holders" */
  ['poap_holders']: AliasType<{
    address?: boolean | `@${string}`;
    chain?: boolean | `@${string}`;
    /** An object relationship */
    cosoul?: ValueTypes['cosouls'];
    created_at?: boolean | `@${string}`;
    /** An object relationship */
    event?: ValueTypes['poap_events'];
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    poap_created?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregated selection of "poap_holders" */
  ['poap_holders_aggregate']: AliasType<{
    aggregate?: ValueTypes['poap_holders_aggregate_fields'];
    nodes?: ValueTypes['poap_holders'];
    __typename?: boolean | `@${string}`;
  }>;
  ['poap_holders_aggregate_bool_exp']: {
    count?:
      | ValueTypes['poap_holders_aggregate_bool_exp_count']
      | undefined
      | null;
  };
  ['poap_holders_aggregate_bool_exp_count']: {
    arguments?:
      | Array<ValueTypes['poap_holders_select_column']>
      | undefined
      | null;
    distinct?: boolean | undefined | null;
    filter?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
    predicate: ValueTypes['Int_comparison_exp'];
  };
  /** aggregate fields of "poap_holders" */
  ['poap_holders_aggregate_fields']: AliasType<{
    avg?: ValueTypes['poap_holders_avg_fields'];
    count?: [
      {
        columns?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null;
        distinct?: boolean | undefined | null;
      },
      boolean | `@${string}`
    ];
    max?: ValueTypes['poap_holders_max_fields'];
    min?: ValueTypes['poap_holders_min_fields'];
    stddev?: ValueTypes['poap_holders_stddev_fields'];
    stddev_pop?: ValueTypes['poap_holders_stddev_pop_fields'];
    stddev_samp?: ValueTypes['poap_holders_stddev_samp_fields'];
    sum?: ValueTypes['poap_holders_sum_fields'];
    var_pop?: ValueTypes['poap_holders_var_pop_fields'];
    var_samp?: ValueTypes['poap_holders_var_samp_fields'];
    variance?: ValueTypes['poap_holders_variance_fields'];
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "poap_holders" */
  ['poap_holders_aggregate_order_by']: {
    avg?: ValueTypes['poap_holders_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['poap_holders_max_order_by'] | undefined | null;
    min?: ValueTypes['poap_holders_min_order_by'] | undefined | null;
    stddev?: ValueTypes['poap_holders_stddev_order_by'] | undefined | null;
    stddev_pop?:
      | ValueTypes['poap_holders_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['poap_holders_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['poap_holders_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['poap_holders_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['poap_holders_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['poap_holders_variance_order_by'] | undefined | null;
  };
  /** aggregate avg on columns */
  ['poap_holders_avg_fields']: AliasType<{
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by avg() on columns of table "poap_holders" */
  ['poap_holders_avg_order_by']: {
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "poap_holders". All fields are combined with a logical 'AND'. */
  ['poap_holders_bool_exp']: {
    _and?: Array<ValueTypes['poap_holders_bool_exp']> | undefined | null;
    _not?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['poap_holders_bool_exp']> | undefined | null;
    address?: ValueTypes['citext_comparison_exp'] | undefined | null;
    chain?: ValueTypes['String_comparison_exp'] | undefined | null;
    cosoul?: ValueTypes['cosouls_bool_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    event?: ValueTypes['poap_events_bool_exp'] | undefined | null;
    event_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    poap_created?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    token_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
  };
  /** aggregate max on columns */
  ['poap_holders_max_fields']: AliasType<{
    address?: boolean | `@${string}`;
    chain?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    poap_created?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by max() on columns of table "poap_holders" */
  ['poap_holders_max_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    chain?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    poap_created?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate min on columns */
  ['poap_holders_min_fields']: AliasType<{
    address?: boolean | `@${string}`;
    chain?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    poap_created?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by min() on columns of table "poap_holders" */
  ['poap_holders_min_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    chain?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    poap_created?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "poap_holders". */
  ['poap_holders_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    chain?: ValueTypes['order_by'] | undefined | null;
    cosoul?: ValueTypes['cosouls_order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    event?: ValueTypes['poap_events_order_by'] | undefined | null;
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    poap_created?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "poap_holders" */
  ['poap_holders_select_column']: poap_holders_select_column;
  /** aggregate stddev on columns */
  ['poap_holders_stddev_fields']: AliasType<{
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev() on columns of table "poap_holders" */
  ['poap_holders_stddev_order_by']: {
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_pop on columns */
  ['poap_holders_stddev_pop_fields']: AliasType<{
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_pop() on columns of table "poap_holders" */
  ['poap_holders_stddev_pop_order_by']: {
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_samp on columns */
  ['poap_holders_stddev_samp_fields']: AliasType<{
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_samp() on columns of table "poap_holders" */
  ['poap_holders_stddev_samp_order_by']: {
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Streaming cursor of the table "poap_holders" */
  ['poap_holders_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['poap_holders_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['poap_holders_stream_cursor_value_input']: {
    address?: ValueTypes['citext'] | undefined | null;
    chain?: string | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    event_id?: ValueTypes['bigint'] | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    poap_created?: ValueTypes['timestamptz'] | undefined | null;
    token_id?: ValueTypes['bigint'] | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
  };
  /** aggregate sum on columns */
  ['poap_holders_sum_fields']: AliasType<{
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by sum() on columns of table "poap_holders" */
  ['poap_holders_sum_order_by']: {
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_pop on columns */
  ['poap_holders_var_pop_fields']: AliasType<{
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_pop() on columns of table "poap_holders" */
  ['poap_holders_var_pop_order_by']: {
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_samp on columns */
  ['poap_holders_var_samp_fields']: AliasType<{
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_samp() on columns of table "poap_holders" */
  ['poap_holders_var_samp_order_by']: {
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate variance on columns */
  ['poap_holders_variance_fields']: AliasType<{
    event_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by variance() on columns of table "poap_holders" */
  ['poap_holders_variance_order_by']: {
    event_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "profiles_public" */
  ['profiles_public']: AliasType<{
    address?: boolean | `@${string}`;
    avatar?: boolean | `@${string}`;
    /** An object relationship */
    cosoul?: ValueTypes['cosouls'];
    id?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "profiles_public". All fields are combined with a logical 'AND'. */
  ['profiles_public_bool_exp']: {
    _and?: Array<ValueTypes['profiles_public_bool_exp']> | undefined | null;
    _not?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['profiles_public_bool_exp']> | undefined | null;
    address?: ValueTypes['String_comparison_exp'] | undefined | null;
    avatar?: ValueTypes['String_comparison_exp'] | undefined | null;
    cosoul?: ValueTypes['cosouls_bool_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    name?: ValueTypes['citext_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "profiles_public". */
  ['profiles_public_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    avatar?: ValueTypes['order_by'] | undefined | null;
    cosoul?: ValueTypes['cosouls_order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "profiles_public" */
  ['profiles_public_select_column']: profiles_public_select_column;
  /** Streaming cursor of the table "profiles_public" */
  ['profiles_public_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['profiles_public_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['profiles_public_stream_cursor_value_input']: {
    address?: string | undefined | null;
    avatar?: string | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    name?: ValueTypes['citext'] | undefined | null;
  };
  ['query_root']: AliasType<{
    cosouls?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['cosouls_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['cosouls_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['cosouls_bool_exp'] | undefined | null;
      },
      ValueTypes['cosouls']
    ];
    cosouls_by_pk?: [{ id: number }, ValueTypes['cosouls']];
    key_holders?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['key_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['key_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['key_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['key_holders']
    ];
    key_holders_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['key_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['key_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['key_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['key_holders_aggregate']
    ];
    key_holders_by_pk?: [
      { address: ValueTypes['citext']; subject: ValueTypes['citext'] },
      ValueTypes['key_holders']
    ];
    poap_events?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['poap_events_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_events_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_events_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_events']
    ];
    poap_events_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['poap_events_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_events_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_events_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_events_aggregate']
    ];
    poap_events_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['poap_events']
    ];
    poap_holders?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders']
    ];
    poap_holders_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders_aggregate']
    ];
    poap_holders_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['poap_holders']
    ];
    price_per_share?: [
      { chain_id: number; token_address?: string | undefined | null },
      boolean | `@${string}`
    ];
    profiles_public?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['profiles_public_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['profiles_public_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
      },
      ValueTypes['profiles_public']
    ];
    vector_search_poap_events?: [
      {
        /** input parameters for function "vector_search_poap_events" */
        args: ValueTypes['vector_search_poap_events_args'] /** distinct select on columns */;
        distinct_on?:
          | Array<ValueTypes['poap_events_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_events_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_events_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_events']
    ];
    vector_search_poap_events_aggregate?: [
      {
        /** input parameters for function "vector_search_poap_events_aggregate" */
        args: ValueTypes['vector_search_poap_events_args'] /** distinct select on columns */;
        distinct_on?:
          | Array<ValueTypes['poap_events_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_events_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_events_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_events_aggregate']
    ];
    vector_search_poap_holders?: [
      {
        /** input parameters for function "vector_search_poap_holders" */
        args: ValueTypes['vector_search_poap_holders_args'] /** distinct select on columns */;
        distinct_on?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders']
    ];
    vector_search_poap_holders_aggregate?: [
      {
        /** input parameters for function "vector_search_poap_holders_aggregate" */
        args: ValueTypes['vector_search_poap_holders_args'] /** distinct select on columns */;
        distinct_on?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders_aggregate']
    ];
    __typename?: boolean | `@${string}`;
  }>;
  ['subscription_root']: AliasType<{
    cosouls?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['cosouls_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['cosouls_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['cosouls_bool_exp'] | undefined | null;
      },
      ValueTypes['cosouls']
    ];
    cosouls_by_pk?: [{ id: number }, ValueTypes['cosouls']];
    cosouls_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['cosouls_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['cosouls_bool_exp'] | undefined | null;
      },
      ValueTypes['cosouls']
    ];
    key_holders?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['key_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['key_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['key_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['key_holders']
    ];
    key_holders_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['key_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['key_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['key_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['key_holders_aggregate']
    ];
    key_holders_by_pk?: [
      { address: ValueTypes['citext']; subject: ValueTypes['citext'] },
      ValueTypes['key_holders']
    ];
    key_holders_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['key_holders_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['key_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['key_holders']
    ];
    poap_events?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['poap_events_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_events_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_events_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_events']
    ];
    poap_events_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['poap_events_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_events_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_events_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_events_aggregate']
    ];
    poap_events_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['poap_events']
    ];
    poap_events_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['poap_events_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['poap_events_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_events']
    ];
    poap_holders?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders']
    ];
    poap_holders_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders_aggregate']
    ];
    poap_holders_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['poap_holders']
    ];
    poap_holders_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['poap_holders_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders']
    ];
    profiles_public?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['profiles_public_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['profiles_public_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
      },
      ValueTypes['profiles_public']
    ];
    profiles_public_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['profiles_public_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
      },
      ValueTypes['profiles_public']
    ];
    vector_search_poap_events?: [
      {
        /** input parameters for function "vector_search_poap_events" */
        args: ValueTypes['vector_search_poap_events_args'] /** distinct select on columns */;
        distinct_on?:
          | Array<ValueTypes['poap_events_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_events_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_events_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_events']
    ];
    vector_search_poap_events_aggregate?: [
      {
        /** input parameters for function "vector_search_poap_events_aggregate" */
        args: ValueTypes['vector_search_poap_events_args'] /** distinct select on columns */;
        distinct_on?:
          | Array<ValueTypes['poap_events_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_events_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_events_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_events_aggregate']
    ];
    vector_search_poap_holders?: [
      {
        /** input parameters for function "vector_search_poap_holders" */
        args: ValueTypes['vector_search_poap_holders_args'] /** distinct select on columns */;
        distinct_on?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders']
    ];
    vector_search_poap_holders_aggregate?: [
      {
        /** input parameters for function "vector_search_poap_holders_aggregate" */
        args: ValueTypes['vector_search_poap_holders_args'] /** distinct select on columns */;
        distinct_on?:
          | Array<ValueTypes['poap_holders_select_column']>
          | undefined
          | null /** limit the number of rows returned */;
        limit?:
          | number
          | undefined
          | null /** skip the first n rows. Use only with order_by */;
        offset?:
          | number
          | undefined
          | null /** sort the rows by one or more columns */;
        order_by?:
          | Array<ValueTypes['poap_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['poap_holders_aggregate']
    ];
    __typename?: boolean | `@${string}`;
  }>;
  ['timestamptz']: unknown;
  /** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
  ['timestamptz_comparison_exp']: {
    _eq?: ValueTypes['timestamptz'] | undefined | null;
    _gt?: ValueTypes['timestamptz'] | undefined | null;
    _gte?: ValueTypes['timestamptz'] | undefined | null;
    _in?: Array<ValueTypes['timestamptz']> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: ValueTypes['timestamptz'] | undefined | null;
    _lte?: ValueTypes['timestamptz'] | undefined | null;
    _neq?: ValueTypes['timestamptz'] | undefined | null;
    _nin?: Array<ValueTypes['timestamptz']> | undefined | null;
  };
  ['vector']: unknown;
  /** Boolean expression to compare columns of type "vector". All fields are combined with logical 'AND'. */
  ['vector_comparison_exp']: {
    _eq?: ValueTypes['vector'] | undefined | null;
    _gt?: ValueTypes['vector'] | undefined | null;
    _gte?: ValueTypes['vector'] | undefined | null;
    _in?: Array<ValueTypes['vector']> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: ValueTypes['vector'] | undefined | null;
    _lte?: ValueTypes['vector'] | undefined | null;
    _neq?: ValueTypes['vector'] | undefined | null;
    _nin?: Array<ValueTypes['vector']> | undefined | null;
  };
  ['vector_search_poap_events_args']: {
    limit_count?: number | undefined | null;
    match_threshold?: ValueTypes['float8'] | undefined | null;
    target_vector?: ValueTypes['vector'] | undefined | null;
  };
  ['vector_search_poap_holders_args']: {
    limit_count?: number | undefined | null;
    match_threshold?: ValueTypes['float8'] | undefined | null;
    target_vector?: ValueTypes['vector'] | undefined | null;
  };
};

export type ModelTypes = {
  /** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
  ['Int_comparison_exp']: GraphQLTypes['Int_comparison_exp'];
  /** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
  ['String_comparison_exp']: GraphQLTypes['String_comparison_exp'];
  ['bigint']: number;
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_comparison_exp']: GraphQLTypes['bigint_comparison_exp'];
  ['citext']: any;
  /** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
  ['citext_comparison_exp']: GraphQLTypes['citext_comparison_exp'];
  /** local db copy of last synced on-chain cosoul data */
  ['cosouls']: {
    address: GraphQLTypes['citext'];
    /** An array relationship */
    held_keys: Array<GraphQLTypes['key_holders']>;
    /** An aggregate relationship */
    held_keys_aggregate: GraphQLTypes['key_holders_aggregate'];
    id: number;
    /** An array relationship */
    key_holders: Array<GraphQLTypes['key_holders']>;
    /** An aggregate relationship */
    key_holders_aggregate: GraphQLTypes['key_holders_aggregate'];
    pgive?: number | undefined;
    /** An array relationship */
    poaps: Array<GraphQLTypes['poap_holders']>;
    /** An aggregate relationship */
    poaps_aggregate: GraphQLTypes['poap_holders_aggregate'];
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    token_id: number;
  };
  /** Boolean expression to filter rows from the table "cosouls". All fields are combined with a logical 'AND'. */
  ['cosouls_bool_exp']: GraphQLTypes['cosouls_bool_exp'];
  /** Ordering options when selecting data from "cosouls". */
  ['cosouls_order_by']: GraphQLTypes['cosouls_order_by'];
  /** select columns of table "cosouls" */
  ['cosouls_select_column']: GraphQLTypes['cosouls_select_column'];
  /** Streaming cursor of the table "cosouls" */
  ['cosouls_stream_cursor_input']: GraphQLTypes['cosouls_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['cosouls_stream_cursor_value_input']: GraphQLTypes['cosouls_stream_cursor_value_input'];
  /** ordering argument of a cursor */
  ['cursor_ordering']: GraphQLTypes['cursor_ordering'];
  ['date']: any;
  /** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
  ['date_comparison_exp']: GraphQLTypes['date_comparison_exp'];
  ['float8']: any;
  /** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
  ['float8_comparison_exp']: GraphQLTypes['float8_comparison_exp'];
  /** tracks the amount of keys an address holds in a given subject. updated with data from the key_tx table */
  ['key_holders']: {
    address: GraphQLTypes['citext'];
    /** An object relationship */
    address_cosoul?: GraphQLTypes['cosouls'] | undefined;
    amount: number;
    subject: GraphQLTypes['citext'];
    /** An object relationship */
    subject_cosoul?: GraphQLTypes['cosouls'] | undefined;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** aggregated selection of "key_holders" */
  ['key_holders_aggregate']: {
    aggregate?: GraphQLTypes['key_holders_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['key_holders']>;
  };
  ['key_holders_aggregate_bool_exp']: GraphQLTypes['key_holders_aggregate_bool_exp'];
  ['key_holders_aggregate_bool_exp_count']: GraphQLTypes['key_holders_aggregate_bool_exp_count'];
  /** aggregate fields of "key_holders" */
  ['key_holders_aggregate_fields']: {
    avg?: GraphQLTypes['key_holders_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['key_holders_max_fields'] | undefined;
    min?: GraphQLTypes['key_holders_min_fields'] | undefined;
    stddev?: GraphQLTypes['key_holders_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['key_holders_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['key_holders_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['key_holders_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['key_holders_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['key_holders_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['key_holders_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "key_holders" */
  ['key_holders_aggregate_order_by']: GraphQLTypes['key_holders_aggregate_order_by'];
  /** aggregate avg on columns */
  ['key_holders_avg_fields']: {
    amount?: number | undefined;
  };
  /** order by avg() on columns of table "key_holders" */
  ['key_holders_avg_order_by']: GraphQLTypes['key_holders_avg_order_by'];
  /** Boolean expression to filter rows from the table "key_holders". All fields are combined with a logical 'AND'. */
  ['key_holders_bool_exp']: GraphQLTypes['key_holders_bool_exp'];
  /** aggregate max on columns */
  ['key_holders_max_fields']: {
    address?: GraphQLTypes['citext'] | undefined;
    amount?: number | undefined;
    subject?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by max() on columns of table "key_holders" */
  ['key_holders_max_order_by']: GraphQLTypes['key_holders_max_order_by'];
  /** aggregate min on columns */
  ['key_holders_min_fields']: {
    address?: GraphQLTypes['citext'] | undefined;
    amount?: number | undefined;
    subject?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by min() on columns of table "key_holders" */
  ['key_holders_min_order_by']: GraphQLTypes['key_holders_min_order_by'];
  /** Ordering options when selecting data from "key_holders". */
  ['key_holders_order_by']: GraphQLTypes['key_holders_order_by'];
  /** select columns of table "key_holders" */
  ['key_holders_select_column']: GraphQLTypes['key_holders_select_column'];
  /** aggregate stddev on columns */
  ['key_holders_stddev_fields']: {
    amount?: number | undefined;
  };
  /** order by stddev() on columns of table "key_holders" */
  ['key_holders_stddev_order_by']: GraphQLTypes['key_holders_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['key_holders_stddev_pop_fields']: {
    amount?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "key_holders" */
  ['key_holders_stddev_pop_order_by']: GraphQLTypes['key_holders_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['key_holders_stddev_samp_fields']: {
    amount?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "key_holders" */
  ['key_holders_stddev_samp_order_by']: GraphQLTypes['key_holders_stddev_samp_order_by'];
  /** Streaming cursor of the table "key_holders" */
  ['key_holders_stream_cursor_input']: GraphQLTypes['key_holders_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['key_holders_stream_cursor_value_input']: GraphQLTypes['key_holders_stream_cursor_value_input'];
  /** aggregate sum on columns */
  ['key_holders_sum_fields']: {
    amount?: number | undefined;
  };
  /** order by sum() on columns of table "key_holders" */
  ['key_holders_sum_order_by']: GraphQLTypes['key_holders_sum_order_by'];
  /** aggregate var_pop on columns */
  ['key_holders_var_pop_fields']: {
    amount?: number | undefined;
  };
  /** order by var_pop() on columns of table "key_holders" */
  ['key_holders_var_pop_order_by']: GraphQLTypes['key_holders_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['key_holders_var_samp_fields']: {
    amount?: number | undefined;
  };
  /** order by var_samp() on columns of table "key_holders" */
  ['key_holders_var_samp_order_by']: GraphQLTypes['key_holders_var_samp_order_by'];
  /** aggregate variance on columns */
  ['key_holders_variance_fields']: {
    amount?: number | undefined;
  };
  /** order by variance() on columns of table "key_holders" */
  ['key_holders_variance_order_by']: GraphQLTypes['key_holders_variance_order_by'];
  /** column ordering options */
  ['order_by']: GraphQLTypes['order_by'];
  /** Poap event info */
  ['poap_events']: {
    city: string;
    country: string;
    created_at: GraphQLTypes['timestamptz'];
    description: string;
    embedding?: GraphQLTypes['vector'] | undefined;
    end_date: GraphQLTypes['date'];
    event_url: string;
    expiry_date: GraphQLTypes['date'];
    fancy_id: string;
    id: GraphQLTypes['bigint'];
    image_url: string;
    name: string;
    poap_id: number;
    similarity?: GraphQLTypes['float8'] | undefined;
    start_date: GraphQLTypes['date'];
    supply: number;
    updated_at: GraphQLTypes['timestamptz'];
    year: number;
  };
  /** aggregated selection of "poap_events" */
  ['poap_events_aggregate']: {
    aggregate?: GraphQLTypes['poap_events_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['poap_events']>;
  };
  /** aggregate fields of "poap_events" */
  ['poap_events_aggregate_fields']: {
    avg?: GraphQLTypes['poap_events_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['poap_events_max_fields'] | undefined;
    min?: GraphQLTypes['poap_events_min_fields'] | undefined;
    stddev?: GraphQLTypes['poap_events_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['poap_events_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['poap_events_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['poap_events_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['poap_events_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['poap_events_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['poap_events_variance_fields'] | undefined;
  };
  /** aggregate avg on columns */
  ['poap_events_avg_fields']: {
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** Boolean expression to filter rows from the table "poap_events". All fields are combined with a logical 'AND'. */
  ['poap_events_bool_exp']: GraphQLTypes['poap_events_bool_exp'];
  /** aggregate max on columns */
  ['poap_events_max_fields']: {
    city?: string | undefined;
    country?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    description?: string | undefined;
    end_date?: GraphQLTypes['date'] | undefined;
    event_url?: string | undefined;
    expiry_date?: GraphQLTypes['date'] | undefined;
    fancy_id?: string | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    image_url?: string | undefined;
    name?: string | undefined;
    poap_id?: number | undefined;
    similarity?: GraphQLTypes['float8'] | undefined;
    start_date?: GraphQLTypes['date'] | undefined;
    supply?: number | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    year?: number | undefined;
  };
  /** aggregate min on columns */
  ['poap_events_min_fields']: {
    city?: string | undefined;
    country?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    description?: string | undefined;
    end_date?: GraphQLTypes['date'] | undefined;
    event_url?: string | undefined;
    expiry_date?: GraphQLTypes['date'] | undefined;
    fancy_id?: string | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    image_url?: string | undefined;
    name?: string | undefined;
    poap_id?: number | undefined;
    similarity?: GraphQLTypes['float8'] | undefined;
    start_date?: GraphQLTypes['date'] | undefined;
    supply?: number | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    year?: number | undefined;
  };
  /** Ordering options when selecting data from "poap_events". */
  ['poap_events_order_by']: GraphQLTypes['poap_events_order_by'];
  /** select columns of table "poap_events" */
  ['poap_events_select_column']: GraphQLTypes['poap_events_select_column'];
  /** aggregate stddev on columns */
  ['poap_events_stddev_fields']: {
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** aggregate stddev_pop on columns */
  ['poap_events_stddev_pop_fields']: {
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** aggregate stddev_samp on columns */
  ['poap_events_stddev_samp_fields']: {
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** Streaming cursor of the table "poap_events" */
  ['poap_events_stream_cursor_input']: GraphQLTypes['poap_events_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['poap_events_stream_cursor_value_input']: GraphQLTypes['poap_events_stream_cursor_value_input'];
  /** aggregate sum on columns */
  ['poap_events_sum_fields']: {
    id?: GraphQLTypes['bigint'] | undefined;
    poap_id?: number | undefined;
    similarity?: GraphQLTypes['float8'] | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** aggregate var_pop on columns */
  ['poap_events_var_pop_fields']: {
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** aggregate var_samp on columns */
  ['poap_events_var_samp_fields']: {
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** aggregate variance on columns */
  ['poap_events_variance_fields']: {
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** columns and relationships of "poap_holders" */
  ['poap_holders']: {
    address: GraphQLTypes['citext'];
    chain: string;
    /** An object relationship */
    cosoul?: GraphQLTypes['cosouls'] | undefined;
    created_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    event: GraphQLTypes['poap_events'];
    event_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    poap_created: GraphQLTypes['timestamptz'];
    token_id: GraphQLTypes['bigint'];
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** aggregated selection of "poap_holders" */
  ['poap_holders_aggregate']: {
    aggregate?: GraphQLTypes['poap_holders_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['poap_holders']>;
  };
  ['poap_holders_aggregate_bool_exp']: GraphQLTypes['poap_holders_aggregate_bool_exp'];
  ['poap_holders_aggregate_bool_exp_count']: GraphQLTypes['poap_holders_aggregate_bool_exp_count'];
  /** aggregate fields of "poap_holders" */
  ['poap_holders_aggregate_fields']: {
    avg?: GraphQLTypes['poap_holders_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['poap_holders_max_fields'] | undefined;
    min?: GraphQLTypes['poap_holders_min_fields'] | undefined;
    stddev?: GraphQLTypes['poap_holders_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['poap_holders_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['poap_holders_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['poap_holders_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['poap_holders_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['poap_holders_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['poap_holders_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "poap_holders" */
  ['poap_holders_aggregate_order_by']: GraphQLTypes['poap_holders_aggregate_order_by'];
  /** aggregate avg on columns */
  ['poap_holders_avg_fields']: {
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by avg() on columns of table "poap_holders" */
  ['poap_holders_avg_order_by']: GraphQLTypes['poap_holders_avg_order_by'];
  /** Boolean expression to filter rows from the table "poap_holders". All fields are combined with a logical 'AND'. */
  ['poap_holders_bool_exp']: GraphQLTypes['poap_holders_bool_exp'];
  /** aggregate max on columns */
  ['poap_holders_max_fields']: {
    address?: GraphQLTypes['citext'] | undefined;
    chain?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    event_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    poap_created?: GraphQLTypes['timestamptz'] | undefined;
    token_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by max() on columns of table "poap_holders" */
  ['poap_holders_max_order_by']: GraphQLTypes['poap_holders_max_order_by'];
  /** aggregate min on columns */
  ['poap_holders_min_fields']: {
    address?: GraphQLTypes['citext'] | undefined;
    chain?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    event_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    poap_created?: GraphQLTypes['timestamptz'] | undefined;
    token_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by min() on columns of table "poap_holders" */
  ['poap_holders_min_order_by']: GraphQLTypes['poap_holders_min_order_by'];
  /** Ordering options when selecting data from "poap_holders". */
  ['poap_holders_order_by']: GraphQLTypes['poap_holders_order_by'];
  /** select columns of table "poap_holders" */
  ['poap_holders_select_column']: GraphQLTypes['poap_holders_select_column'];
  /** aggregate stddev on columns */
  ['poap_holders_stddev_fields']: {
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by stddev() on columns of table "poap_holders" */
  ['poap_holders_stddev_order_by']: GraphQLTypes['poap_holders_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['poap_holders_stddev_pop_fields']: {
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "poap_holders" */
  ['poap_holders_stddev_pop_order_by']: GraphQLTypes['poap_holders_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['poap_holders_stddev_samp_fields']: {
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "poap_holders" */
  ['poap_holders_stddev_samp_order_by']: GraphQLTypes['poap_holders_stddev_samp_order_by'];
  /** Streaming cursor of the table "poap_holders" */
  ['poap_holders_stream_cursor_input']: GraphQLTypes['poap_holders_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['poap_holders_stream_cursor_value_input']: GraphQLTypes['poap_holders_stream_cursor_value_input'];
  /** aggregate sum on columns */
  ['poap_holders_sum_fields']: {
    event_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    token_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by sum() on columns of table "poap_holders" */
  ['poap_holders_sum_order_by']: GraphQLTypes['poap_holders_sum_order_by'];
  /** aggregate var_pop on columns */
  ['poap_holders_var_pop_fields']: {
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by var_pop() on columns of table "poap_holders" */
  ['poap_holders_var_pop_order_by']: GraphQLTypes['poap_holders_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['poap_holders_var_samp_fields']: {
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by var_samp() on columns of table "poap_holders" */
  ['poap_holders_var_samp_order_by']: GraphQLTypes['poap_holders_var_samp_order_by'];
  /** aggregate variance on columns */
  ['poap_holders_variance_fields']: {
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by variance() on columns of table "poap_holders" */
  ['poap_holders_variance_order_by']: GraphQLTypes['poap_holders_variance_order_by'];
  /** columns and relationships of "profiles_public" */
  ['profiles_public']: {
    address?: string | undefined;
    avatar?: string | undefined;
    /** An object relationship */
    cosoul?: GraphQLTypes['cosouls'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    name?: GraphQLTypes['citext'] | undefined;
  };
  /** Boolean expression to filter rows from the table "profiles_public". All fields are combined with a logical 'AND'. */
  ['profiles_public_bool_exp']: GraphQLTypes['profiles_public_bool_exp'];
  /** Ordering options when selecting data from "profiles_public". */
  ['profiles_public_order_by']: GraphQLTypes['profiles_public_order_by'];
  /** select columns of table "profiles_public" */
  ['profiles_public_select_column']: GraphQLTypes['profiles_public_select_column'];
  /** Streaming cursor of the table "profiles_public" */
  ['profiles_public_stream_cursor_input']: GraphQLTypes['profiles_public_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['profiles_public_stream_cursor_value_input']: GraphQLTypes['profiles_public_stream_cursor_value_input'];
  ['query_root']: {
    /** fetch data from the table: "cosouls" */
    cosouls: Array<GraphQLTypes['cosouls']>;
    /** fetch data from the table: "cosouls" using primary key columns */
    cosouls_by_pk?: GraphQLTypes['cosouls'] | undefined;
    /** An array relationship */
    key_holders: Array<GraphQLTypes['key_holders']>;
    /** An aggregate relationship */
    key_holders_aggregate: GraphQLTypes['key_holders_aggregate'];
    /** fetch data from the table: "key_holders" using primary key columns */
    key_holders_by_pk?: GraphQLTypes['key_holders'] | undefined;
    /** fetch data from the table: "poap_events" */
    poap_events: Array<GraphQLTypes['poap_events']>;
    /** fetch aggregated fields from the table: "poap_events" */
    poap_events_aggregate: GraphQLTypes['poap_events_aggregate'];
    /** fetch data from the table: "poap_events" using primary key columns */
    poap_events_by_pk?: GraphQLTypes['poap_events'] | undefined;
    /** fetch data from the table: "poap_holders" */
    poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** fetch aggregated fields from the table: "poap_holders" */
    poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
    /** fetch data from the table: "poap_holders" using primary key columns */
    poap_holders_by_pk?: GraphQLTypes['poap_holders'] | undefined;
    price_per_share: number;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
    /** execute function "vector_search_poap_events" which returns "poap_events" */
    vector_search_poap_events: Array<GraphQLTypes['poap_events']>;
    /** execute function "vector_search_poap_events" and query aggregates on result of table type "poap_events" */
    vector_search_poap_events_aggregate: GraphQLTypes['poap_events_aggregate'];
    /** execute function "vector_search_poap_holders" which returns "poap_holders" */
    vector_search_poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** execute function "vector_search_poap_holders" and query aggregates on result of table type "poap_holders" */
    vector_search_poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
  };
  ['subscription_root']: {
    /** fetch data from the table: "cosouls" */
    cosouls: Array<GraphQLTypes['cosouls']>;
    /** fetch data from the table: "cosouls" using primary key columns */
    cosouls_by_pk?: GraphQLTypes['cosouls'] | undefined;
    /** fetch data from the table in a streaming manner: "cosouls" */
    cosouls_stream: Array<GraphQLTypes['cosouls']>;
    /** An array relationship */
    key_holders: Array<GraphQLTypes['key_holders']>;
    /** An aggregate relationship */
    key_holders_aggregate: GraphQLTypes['key_holders_aggregate'];
    /** fetch data from the table: "key_holders" using primary key columns */
    key_holders_by_pk?: GraphQLTypes['key_holders'] | undefined;
    /** fetch data from the table in a streaming manner: "key_holders" */
    key_holders_stream: Array<GraphQLTypes['key_holders']>;
    /** fetch data from the table: "poap_events" */
    poap_events: Array<GraphQLTypes['poap_events']>;
    /** fetch aggregated fields from the table: "poap_events" */
    poap_events_aggregate: GraphQLTypes['poap_events_aggregate'];
    /** fetch data from the table: "poap_events" using primary key columns */
    poap_events_by_pk?: GraphQLTypes['poap_events'] | undefined;
    /** fetch data from the table in a streaming manner: "poap_events" */
    poap_events_stream: Array<GraphQLTypes['poap_events']>;
    /** fetch data from the table: "poap_holders" */
    poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** fetch aggregated fields from the table: "poap_holders" */
    poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
    /** fetch data from the table: "poap_holders" using primary key columns */
    poap_holders_by_pk?: GraphQLTypes['poap_holders'] | undefined;
    /** fetch data from the table in a streaming manner: "poap_holders" */
    poap_holders_stream: Array<GraphQLTypes['poap_holders']>;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
    /** fetch data from the table in a streaming manner: "profiles_public" */
    profiles_public_stream: Array<GraphQLTypes['profiles_public']>;
    /** execute function "vector_search_poap_events" which returns "poap_events" */
    vector_search_poap_events: Array<GraphQLTypes['poap_events']>;
    /** execute function "vector_search_poap_events" and query aggregates on result of table type "poap_events" */
    vector_search_poap_events_aggregate: GraphQLTypes['poap_events_aggregate'];
    /** execute function "vector_search_poap_holders" which returns "poap_holders" */
    vector_search_poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** execute function "vector_search_poap_holders" and query aggregates on result of table type "poap_holders" */
    vector_search_poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
  };
  ['timestamptz']: any;
  /** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
  ['timestamptz_comparison_exp']: GraphQLTypes['timestamptz_comparison_exp'];
  ['vector']: any;
  /** Boolean expression to compare columns of type "vector". All fields are combined with logical 'AND'. */
  ['vector_comparison_exp']: GraphQLTypes['vector_comparison_exp'];
  ['vector_search_poap_events_args']: GraphQLTypes['vector_search_poap_events_args'];
  ['vector_search_poap_holders_args']: GraphQLTypes['vector_search_poap_holders_args'];
};

export type GraphQLTypes = {
  /** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
  ['Int_comparison_exp']: {
    _eq?: number | undefined;
    _gt?: number | undefined;
    _gte?: number | undefined;
    _in?: Array<number> | undefined;
    _is_null?: boolean | undefined;
    _lt?: number | undefined;
    _lte?: number | undefined;
    _neq?: number | undefined;
    _nin?: Array<number> | undefined;
  };
  /** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
  ['String_comparison_exp']: {
    _eq?: string | undefined;
    _gt?: string | undefined;
    _gte?: string | undefined;
    /** does the column match the given case-insensitive pattern */
    _ilike?: string | undefined;
    _in?: Array<string> | undefined;
    /** does the column match the given POSIX regular expression, case insensitive */
    _iregex?: string | undefined;
    _is_null?: boolean | undefined;
    /** does the column match the given pattern */
    _like?: string | undefined;
    _lt?: string | undefined;
    _lte?: string | undefined;
    _neq?: string | undefined;
    /** does the column NOT match the given case-insensitive pattern */
    _nilike?: string | undefined;
    _nin?: Array<string> | undefined;
    /** does the column NOT match the given POSIX regular expression, case insensitive */
    _niregex?: string | undefined;
    /** does the column NOT match the given pattern */
    _nlike?: string | undefined;
    /** does the column NOT match the given POSIX regular expression, case sensitive */
    _nregex?: string | undefined;
    /** does the column NOT match the given SQL regular expression */
    _nsimilar?: string | undefined;
    /** does the column match the given POSIX regular expression, case sensitive */
    _regex?: string | undefined;
    /** does the column match the given SQL regular expression */
    _similar?: string | undefined;
  };
  ['bigint']: any;
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_comparison_exp']: {
    _eq?: GraphQLTypes['bigint'] | undefined;
    _gt?: GraphQLTypes['bigint'] | undefined;
    _gte?: GraphQLTypes['bigint'] | undefined;
    _in?: Array<GraphQLTypes['bigint']> | undefined;
    _is_null?: boolean | undefined;
    _lt?: GraphQLTypes['bigint'] | undefined;
    _lte?: GraphQLTypes['bigint'] | undefined;
    _neq?: GraphQLTypes['bigint'] | undefined;
    _nin?: Array<GraphQLTypes['bigint']> | undefined;
  };
  ['citext']: any;
  /** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
  ['citext_comparison_exp']: {
    _eq?: GraphQLTypes['citext'] | undefined;
    _gt?: GraphQLTypes['citext'] | undefined;
    _gte?: GraphQLTypes['citext'] | undefined;
    /** does the column match the given case-insensitive pattern */
    _ilike?: GraphQLTypes['citext'] | undefined;
    _in?: Array<GraphQLTypes['citext']> | undefined;
    /** does the column match the given POSIX regular expression, case insensitive */
    _iregex?: GraphQLTypes['citext'] | undefined;
    _is_null?: boolean | undefined;
    /** does the column match the given pattern */
    _like?: GraphQLTypes['citext'] | undefined;
    _lt?: GraphQLTypes['citext'] | undefined;
    _lte?: GraphQLTypes['citext'] | undefined;
    _neq?: GraphQLTypes['citext'] | undefined;
    /** does the column NOT match the given case-insensitive pattern */
    _nilike?: GraphQLTypes['citext'] | undefined;
    _nin?: Array<GraphQLTypes['citext']> | undefined;
    /** does the column NOT match the given POSIX regular expression, case insensitive */
    _niregex?: GraphQLTypes['citext'] | undefined;
    /** does the column NOT match the given pattern */
    _nlike?: GraphQLTypes['citext'] | undefined;
    /** does the column NOT match the given POSIX regular expression, case sensitive */
    _nregex?: GraphQLTypes['citext'] | undefined;
    /** does the column NOT match the given SQL regular expression */
    _nsimilar?: GraphQLTypes['citext'] | undefined;
    /** does the column match the given POSIX regular expression, case sensitive */
    _regex?: GraphQLTypes['citext'] | undefined;
    /** does the column match the given SQL regular expression */
    _similar?: GraphQLTypes['citext'] | undefined;
  };
  /** local db copy of last synced on-chain cosoul data */
  ['cosouls']: {
    __typename: 'cosouls';
    address: GraphQLTypes['citext'];
    /** An array relationship */
    held_keys: Array<GraphQLTypes['key_holders']>;
    /** An aggregate relationship */
    held_keys_aggregate: GraphQLTypes['key_holders_aggregate'];
    id: number;
    /** An array relationship */
    key_holders: Array<GraphQLTypes['key_holders']>;
    /** An aggregate relationship */
    key_holders_aggregate: GraphQLTypes['key_holders_aggregate'];
    pgive?: number | undefined;
    /** An array relationship */
    poaps: Array<GraphQLTypes['poap_holders']>;
    /** An aggregate relationship */
    poaps_aggregate: GraphQLTypes['poap_holders_aggregate'];
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    token_id: number;
  };
  /** Boolean expression to filter rows from the table "cosouls". All fields are combined with a logical 'AND'. */
  ['cosouls_bool_exp']: {
    _and?: Array<GraphQLTypes['cosouls_bool_exp']> | undefined;
    _not?: GraphQLTypes['cosouls_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['cosouls_bool_exp']> | undefined;
    address?: GraphQLTypes['citext_comparison_exp'] | undefined;
    held_keys?: GraphQLTypes['key_holders_bool_exp'] | undefined;
    held_keys_aggregate?:
      | GraphQLTypes['key_holders_aggregate_bool_exp']
      | undefined;
    id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    key_holders?: GraphQLTypes['key_holders_bool_exp'] | undefined;
    key_holders_aggregate?:
      | GraphQLTypes['key_holders_aggregate_bool_exp']
      | undefined;
    pgive?: GraphQLTypes['Int_comparison_exp'] | undefined;
    poaps?: GraphQLTypes['poap_holders_bool_exp'] | undefined;
    poaps_aggregate?:
      | GraphQLTypes['poap_holders_aggregate_bool_exp']
      | undefined;
    profile_public?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    token_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "cosouls". */
  ['cosouls_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    held_keys_aggregate?:
      | GraphQLTypes['key_holders_aggregate_order_by']
      | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    key_holders_aggregate?:
      | GraphQLTypes['key_holders_aggregate_order_by']
      | undefined;
    pgive?: GraphQLTypes['order_by'] | undefined;
    poaps_aggregate?:
      | GraphQLTypes['poap_holders_aggregate_order_by']
      | undefined;
    profile_public?: GraphQLTypes['profiles_public_order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "cosouls" */
  ['cosouls_select_column']: cosouls_select_column;
  /** Streaming cursor of the table "cosouls" */
  ['cosouls_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['cosouls_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['cosouls_stream_cursor_value_input']: {
    address?: GraphQLTypes['citext'] | undefined;
    id?: number | undefined;
    pgive?: number | undefined;
    token_id?: number | undefined;
  };
  /** ordering argument of a cursor */
  ['cursor_ordering']: cursor_ordering;
  ['date']: any;
  /** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
  ['date_comparison_exp']: {
    _eq?: GraphQLTypes['date'] | undefined;
    _gt?: GraphQLTypes['date'] | undefined;
    _gte?: GraphQLTypes['date'] | undefined;
    _in?: Array<GraphQLTypes['date']> | undefined;
    _is_null?: boolean | undefined;
    _lt?: GraphQLTypes['date'] | undefined;
    _lte?: GraphQLTypes['date'] | undefined;
    _neq?: GraphQLTypes['date'] | undefined;
    _nin?: Array<GraphQLTypes['date']> | undefined;
  };
  ['float8']: any;
  /** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
  ['float8_comparison_exp']: {
    _eq?: GraphQLTypes['float8'] | undefined;
    _gt?: GraphQLTypes['float8'] | undefined;
    _gte?: GraphQLTypes['float8'] | undefined;
    _in?: Array<GraphQLTypes['float8']> | undefined;
    _is_null?: boolean | undefined;
    _lt?: GraphQLTypes['float8'] | undefined;
    _lte?: GraphQLTypes['float8'] | undefined;
    _neq?: GraphQLTypes['float8'] | undefined;
    _nin?: Array<GraphQLTypes['float8']> | undefined;
  };
  /** tracks the amount of keys an address holds in a given subject. updated with data from the key_tx table */
  ['key_holders']: {
    __typename: 'key_holders';
    address: GraphQLTypes['citext'];
    /** An object relationship */
    address_cosoul?: GraphQLTypes['cosouls'] | undefined;
    amount: number;
    subject: GraphQLTypes['citext'];
    /** An object relationship */
    subject_cosoul?: GraphQLTypes['cosouls'] | undefined;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** aggregated selection of "key_holders" */
  ['key_holders_aggregate']: {
    __typename: 'key_holders_aggregate';
    aggregate?: GraphQLTypes['key_holders_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['key_holders']>;
  };
  ['key_holders_aggregate_bool_exp']: {
    count?: GraphQLTypes['key_holders_aggregate_bool_exp_count'] | undefined;
  };
  ['key_holders_aggregate_bool_exp_count']: {
    arguments?: Array<GraphQLTypes['key_holders_select_column']> | undefined;
    distinct?: boolean | undefined;
    filter?: GraphQLTypes['key_holders_bool_exp'] | undefined;
    predicate: GraphQLTypes['Int_comparison_exp'];
  };
  /** aggregate fields of "key_holders" */
  ['key_holders_aggregate_fields']: {
    __typename: 'key_holders_aggregate_fields';
    avg?: GraphQLTypes['key_holders_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['key_holders_max_fields'] | undefined;
    min?: GraphQLTypes['key_holders_min_fields'] | undefined;
    stddev?: GraphQLTypes['key_holders_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['key_holders_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['key_holders_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['key_holders_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['key_holders_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['key_holders_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['key_holders_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "key_holders" */
  ['key_holders_aggregate_order_by']: {
    avg?: GraphQLTypes['key_holders_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['key_holders_max_order_by'] | undefined;
    min?: GraphQLTypes['key_holders_min_order_by'] | undefined;
    stddev?: GraphQLTypes['key_holders_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['key_holders_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['key_holders_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['key_holders_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['key_holders_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['key_holders_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['key_holders_variance_order_by'] | undefined;
  };
  /** aggregate avg on columns */
  ['key_holders_avg_fields']: {
    __typename: 'key_holders_avg_fields';
    amount?: number | undefined;
  };
  /** order by avg() on columns of table "key_holders" */
  ['key_holders_avg_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "key_holders". All fields are combined with a logical 'AND'. */
  ['key_holders_bool_exp']: {
    _and?: Array<GraphQLTypes['key_holders_bool_exp']> | undefined;
    _not?: GraphQLTypes['key_holders_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['key_holders_bool_exp']> | undefined;
    address?: GraphQLTypes['citext_comparison_exp'] | undefined;
    address_cosoul?: GraphQLTypes['cosouls_bool_exp'] | undefined;
    amount?: GraphQLTypes['Int_comparison_exp'] | undefined;
    subject?: GraphQLTypes['citext_comparison_exp'] | undefined;
    subject_cosoul?: GraphQLTypes['cosouls_bool_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
  };
  /** aggregate max on columns */
  ['key_holders_max_fields']: {
    __typename: 'key_holders_max_fields';
    address?: GraphQLTypes['citext'] | undefined;
    amount?: number | undefined;
    subject?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by max() on columns of table "key_holders" */
  ['key_holders_max_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    amount?: GraphQLTypes['order_by'] | undefined;
    subject?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate min on columns */
  ['key_holders_min_fields']: {
    __typename: 'key_holders_min_fields';
    address?: GraphQLTypes['citext'] | undefined;
    amount?: number | undefined;
    subject?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by min() on columns of table "key_holders" */
  ['key_holders_min_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    amount?: GraphQLTypes['order_by'] | undefined;
    subject?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "key_holders". */
  ['key_holders_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    address_cosoul?: GraphQLTypes['cosouls_order_by'] | undefined;
    amount?: GraphQLTypes['order_by'] | undefined;
    subject?: GraphQLTypes['order_by'] | undefined;
    subject_cosoul?: GraphQLTypes['cosouls_order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "key_holders" */
  ['key_holders_select_column']: key_holders_select_column;
  /** aggregate stddev on columns */
  ['key_holders_stddev_fields']: {
    __typename: 'key_holders_stddev_fields';
    amount?: number | undefined;
  };
  /** order by stddev() on columns of table "key_holders" */
  ['key_holders_stddev_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_pop on columns */
  ['key_holders_stddev_pop_fields']: {
    __typename: 'key_holders_stddev_pop_fields';
    amount?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "key_holders" */
  ['key_holders_stddev_pop_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_samp on columns */
  ['key_holders_stddev_samp_fields']: {
    __typename: 'key_holders_stddev_samp_fields';
    amount?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "key_holders" */
  ['key_holders_stddev_samp_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** Streaming cursor of the table "key_holders" */
  ['key_holders_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['key_holders_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['key_holders_stream_cursor_value_input']: {
    address?: GraphQLTypes['citext'] | undefined;
    amount?: number | undefined;
    subject?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** aggregate sum on columns */
  ['key_holders_sum_fields']: {
    __typename: 'key_holders_sum_fields';
    amount?: number | undefined;
  };
  /** order by sum() on columns of table "key_holders" */
  ['key_holders_sum_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_pop on columns */
  ['key_holders_var_pop_fields']: {
    __typename: 'key_holders_var_pop_fields';
    amount?: number | undefined;
  };
  /** order by var_pop() on columns of table "key_holders" */
  ['key_holders_var_pop_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_samp on columns */
  ['key_holders_var_samp_fields']: {
    __typename: 'key_holders_var_samp_fields';
    amount?: number | undefined;
  };
  /** order by var_samp() on columns of table "key_holders" */
  ['key_holders_var_samp_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate variance on columns */
  ['key_holders_variance_fields']: {
    __typename: 'key_holders_variance_fields';
    amount?: number | undefined;
  };
  /** order by variance() on columns of table "key_holders" */
  ['key_holders_variance_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** column ordering options */
  ['order_by']: order_by;
  /** Poap event info */
  ['poap_events']: {
    __typename: 'poap_events';
    city: string;
    country: string;
    created_at: GraphQLTypes['timestamptz'];
    description: string;
    embedding?: GraphQLTypes['vector'] | undefined;
    end_date: GraphQLTypes['date'];
    event_url: string;
    expiry_date: GraphQLTypes['date'];
    fancy_id: string;
    id: GraphQLTypes['bigint'];
    image_url: string;
    name: string;
    poap_id: number;
    similarity?: GraphQLTypes['float8'] | undefined;
    start_date: GraphQLTypes['date'];
    supply: number;
    updated_at: GraphQLTypes['timestamptz'];
    year: number;
  };
  /** aggregated selection of "poap_events" */
  ['poap_events_aggregate']: {
    __typename: 'poap_events_aggregate';
    aggregate?: GraphQLTypes['poap_events_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['poap_events']>;
  };
  /** aggregate fields of "poap_events" */
  ['poap_events_aggregate_fields']: {
    __typename: 'poap_events_aggregate_fields';
    avg?: GraphQLTypes['poap_events_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['poap_events_max_fields'] | undefined;
    min?: GraphQLTypes['poap_events_min_fields'] | undefined;
    stddev?: GraphQLTypes['poap_events_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['poap_events_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['poap_events_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['poap_events_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['poap_events_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['poap_events_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['poap_events_variance_fields'] | undefined;
  };
  /** aggregate avg on columns */
  ['poap_events_avg_fields']: {
    __typename: 'poap_events_avg_fields';
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** Boolean expression to filter rows from the table "poap_events". All fields are combined with a logical 'AND'. */
  ['poap_events_bool_exp']: {
    _and?: Array<GraphQLTypes['poap_events_bool_exp']> | undefined;
    _not?: GraphQLTypes['poap_events_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['poap_events_bool_exp']> | undefined;
    city?: GraphQLTypes['String_comparison_exp'] | undefined;
    country?: GraphQLTypes['String_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    description?: GraphQLTypes['String_comparison_exp'] | undefined;
    embedding?: GraphQLTypes['vector_comparison_exp'] | undefined;
    end_date?: GraphQLTypes['date_comparison_exp'] | undefined;
    event_url?: GraphQLTypes['String_comparison_exp'] | undefined;
    expiry_date?: GraphQLTypes['date_comparison_exp'] | undefined;
    fancy_id?: GraphQLTypes['String_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    image_url?: GraphQLTypes['String_comparison_exp'] | undefined;
    name?: GraphQLTypes['String_comparison_exp'] | undefined;
    poap_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    similarity?: GraphQLTypes['float8_comparison_exp'] | undefined;
    start_date?: GraphQLTypes['date_comparison_exp'] | undefined;
    supply?: GraphQLTypes['Int_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    year?: GraphQLTypes['Int_comparison_exp'] | undefined;
  };
  /** aggregate max on columns */
  ['poap_events_max_fields']: {
    __typename: 'poap_events_max_fields';
    city?: string | undefined;
    country?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    description?: string | undefined;
    end_date?: GraphQLTypes['date'] | undefined;
    event_url?: string | undefined;
    expiry_date?: GraphQLTypes['date'] | undefined;
    fancy_id?: string | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    image_url?: string | undefined;
    name?: string | undefined;
    poap_id?: number | undefined;
    similarity?: GraphQLTypes['float8'] | undefined;
    start_date?: GraphQLTypes['date'] | undefined;
    supply?: number | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    year?: number | undefined;
  };
  /** aggregate min on columns */
  ['poap_events_min_fields']: {
    __typename: 'poap_events_min_fields';
    city?: string | undefined;
    country?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    description?: string | undefined;
    end_date?: GraphQLTypes['date'] | undefined;
    event_url?: string | undefined;
    expiry_date?: GraphQLTypes['date'] | undefined;
    fancy_id?: string | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    image_url?: string | undefined;
    name?: string | undefined;
    poap_id?: number | undefined;
    similarity?: GraphQLTypes['float8'] | undefined;
    start_date?: GraphQLTypes['date'] | undefined;
    supply?: number | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    year?: number | undefined;
  };
  /** Ordering options when selecting data from "poap_events". */
  ['poap_events_order_by']: {
    city?: GraphQLTypes['order_by'] | undefined;
    country?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
    embedding?: GraphQLTypes['order_by'] | undefined;
    end_date?: GraphQLTypes['order_by'] | undefined;
    event_url?: GraphQLTypes['order_by'] | undefined;
    expiry_date?: GraphQLTypes['order_by'] | undefined;
    fancy_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    image_url?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    poap_id?: GraphQLTypes['order_by'] | undefined;
    similarity?: GraphQLTypes['order_by'] | undefined;
    start_date?: GraphQLTypes['order_by'] | undefined;
    supply?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    year?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "poap_events" */
  ['poap_events_select_column']: poap_events_select_column;
  /** aggregate stddev on columns */
  ['poap_events_stddev_fields']: {
    __typename: 'poap_events_stddev_fields';
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** aggregate stddev_pop on columns */
  ['poap_events_stddev_pop_fields']: {
    __typename: 'poap_events_stddev_pop_fields';
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** aggregate stddev_samp on columns */
  ['poap_events_stddev_samp_fields']: {
    __typename: 'poap_events_stddev_samp_fields';
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** Streaming cursor of the table "poap_events" */
  ['poap_events_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['poap_events_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['poap_events_stream_cursor_value_input']: {
    city?: string | undefined;
    country?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    description?: string | undefined;
    embedding?: GraphQLTypes['vector'] | undefined;
    end_date?: GraphQLTypes['date'] | undefined;
    event_url?: string | undefined;
    expiry_date?: GraphQLTypes['date'] | undefined;
    fancy_id?: string | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    image_url?: string | undefined;
    name?: string | undefined;
    poap_id?: number | undefined;
    similarity?: GraphQLTypes['float8'] | undefined;
    start_date?: GraphQLTypes['date'] | undefined;
    supply?: number | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    year?: number | undefined;
  };
  /** aggregate sum on columns */
  ['poap_events_sum_fields']: {
    __typename: 'poap_events_sum_fields';
    id?: GraphQLTypes['bigint'] | undefined;
    poap_id?: number | undefined;
    similarity?: GraphQLTypes['float8'] | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** aggregate var_pop on columns */
  ['poap_events_var_pop_fields']: {
    __typename: 'poap_events_var_pop_fields';
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** aggregate var_samp on columns */
  ['poap_events_var_samp_fields']: {
    __typename: 'poap_events_var_samp_fields';
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** aggregate variance on columns */
  ['poap_events_variance_fields']: {
    __typename: 'poap_events_variance_fields';
    id?: number | undefined;
    poap_id?: number | undefined;
    similarity?: number | undefined;
    supply?: number | undefined;
    year?: number | undefined;
  };
  /** columns and relationships of "poap_holders" */
  ['poap_holders']: {
    __typename: 'poap_holders';
    address: GraphQLTypes['citext'];
    chain: string;
    /** An object relationship */
    cosoul?: GraphQLTypes['cosouls'] | undefined;
    created_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    event: GraphQLTypes['poap_events'];
    event_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    poap_created: GraphQLTypes['timestamptz'];
    token_id: GraphQLTypes['bigint'];
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** aggregated selection of "poap_holders" */
  ['poap_holders_aggregate']: {
    __typename: 'poap_holders_aggregate';
    aggregate?: GraphQLTypes['poap_holders_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['poap_holders']>;
  };
  ['poap_holders_aggregate_bool_exp']: {
    count?: GraphQLTypes['poap_holders_aggregate_bool_exp_count'] | undefined;
  };
  ['poap_holders_aggregate_bool_exp_count']: {
    arguments?: Array<GraphQLTypes['poap_holders_select_column']> | undefined;
    distinct?: boolean | undefined;
    filter?: GraphQLTypes['poap_holders_bool_exp'] | undefined;
    predicate: GraphQLTypes['Int_comparison_exp'];
  };
  /** aggregate fields of "poap_holders" */
  ['poap_holders_aggregate_fields']: {
    __typename: 'poap_holders_aggregate_fields';
    avg?: GraphQLTypes['poap_holders_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['poap_holders_max_fields'] | undefined;
    min?: GraphQLTypes['poap_holders_min_fields'] | undefined;
    stddev?: GraphQLTypes['poap_holders_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['poap_holders_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['poap_holders_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['poap_holders_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['poap_holders_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['poap_holders_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['poap_holders_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "poap_holders" */
  ['poap_holders_aggregate_order_by']: {
    avg?: GraphQLTypes['poap_holders_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['poap_holders_max_order_by'] | undefined;
    min?: GraphQLTypes['poap_holders_min_order_by'] | undefined;
    stddev?: GraphQLTypes['poap_holders_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['poap_holders_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['poap_holders_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['poap_holders_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['poap_holders_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['poap_holders_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['poap_holders_variance_order_by'] | undefined;
  };
  /** aggregate avg on columns */
  ['poap_holders_avg_fields']: {
    __typename: 'poap_holders_avg_fields';
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by avg() on columns of table "poap_holders" */
  ['poap_holders_avg_order_by']: {
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "poap_holders". All fields are combined with a logical 'AND'. */
  ['poap_holders_bool_exp']: {
    _and?: Array<GraphQLTypes['poap_holders_bool_exp']> | undefined;
    _not?: GraphQLTypes['poap_holders_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['poap_holders_bool_exp']> | undefined;
    address?: GraphQLTypes['citext_comparison_exp'] | undefined;
    chain?: GraphQLTypes['String_comparison_exp'] | undefined;
    cosoul?: GraphQLTypes['cosouls_bool_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    event?: GraphQLTypes['poap_events_bool_exp'] | undefined;
    event_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    poap_created?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    token_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
  };
  /** aggregate max on columns */
  ['poap_holders_max_fields']: {
    __typename: 'poap_holders_max_fields';
    address?: GraphQLTypes['citext'] | undefined;
    chain?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    event_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    poap_created?: GraphQLTypes['timestamptz'] | undefined;
    token_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by max() on columns of table "poap_holders" */
  ['poap_holders_max_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    chain?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    poap_created?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate min on columns */
  ['poap_holders_min_fields']: {
    __typename: 'poap_holders_min_fields';
    address?: GraphQLTypes['citext'] | undefined;
    chain?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    event_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    poap_created?: GraphQLTypes['timestamptz'] | undefined;
    token_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by min() on columns of table "poap_holders" */
  ['poap_holders_min_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    chain?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    poap_created?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "poap_holders". */
  ['poap_holders_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    chain?: GraphQLTypes['order_by'] | undefined;
    cosoul?: GraphQLTypes['cosouls_order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    event?: GraphQLTypes['poap_events_order_by'] | undefined;
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    poap_created?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "poap_holders" */
  ['poap_holders_select_column']: poap_holders_select_column;
  /** aggregate stddev on columns */
  ['poap_holders_stddev_fields']: {
    __typename: 'poap_holders_stddev_fields';
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by stddev() on columns of table "poap_holders" */
  ['poap_holders_stddev_order_by']: {
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_pop on columns */
  ['poap_holders_stddev_pop_fields']: {
    __typename: 'poap_holders_stddev_pop_fields';
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "poap_holders" */
  ['poap_holders_stddev_pop_order_by']: {
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_samp on columns */
  ['poap_holders_stddev_samp_fields']: {
    __typename: 'poap_holders_stddev_samp_fields';
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "poap_holders" */
  ['poap_holders_stddev_samp_order_by']: {
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Streaming cursor of the table "poap_holders" */
  ['poap_holders_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['poap_holders_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['poap_holders_stream_cursor_value_input']: {
    address?: GraphQLTypes['citext'] | undefined;
    chain?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    event_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    poap_created?: GraphQLTypes['timestamptz'] | undefined;
    token_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** aggregate sum on columns */
  ['poap_holders_sum_fields']: {
    __typename: 'poap_holders_sum_fields';
    event_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    token_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by sum() on columns of table "poap_holders" */
  ['poap_holders_sum_order_by']: {
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_pop on columns */
  ['poap_holders_var_pop_fields']: {
    __typename: 'poap_holders_var_pop_fields';
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by var_pop() on columns of table "poap_holders" */
  ['poap_holders_var_pop_order_by']: {
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_samp on columns */
  ['poap_holders_var_samp_fields']: {
    __typename: 'poap_holders_var_samp_fields';
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by var_samp() on columns of table "poap_holders" */
  ['poap_holders_var_samp_order_by']: {
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate variance on columns */
  ['poap_holders_variance_fields']: {
    __typename: 'poap_holders_variance_fields';
    event_id?: number | undefined;
    id?: number | undefined;
    token_id?: number | undefined;
  };
  /** order by variance() on columns of table "poap_holders" */
  ['poap_holders_variance_order_by']: {
    event_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "profiles_public" */
  ['profiles_public']: {
    __typename: 'profiles_public';
    address?: string | undefined;
    avatar?: string | undefined;
    /** An object relationship */
    cosoul?: GraphQLTypes['cosouls'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    name?: GraphQLTypes['citext'] | undefined;
  };
  /** Boolean expression to filter rows from the table "profiles_public". All fields are combined with a logical 'AND'. */
  ['profiles_public_bool_exp']: {
    _and?: Array<GraphQLTypes['profiles_public_bool_exp']> | undefined;
    _not?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['profiles_public_bool_exp']> | undefined;
    address?: GraphQLTypes['String_comparison_exp'] | undefined;
    avatar?: GraphQLTypes['String_comparison_exp'] | undefined;
    cosoul?: GraphQLTypes['cosouls_bool_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    name?: GraphQLTypes['citext_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "profiles_public". */
  ['profiles_public_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    avatar?: GraphQLTypes['order_by'] | undefined;
    cosoul?: GraphQLTypes['cosouls_order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "profiles_public" */
  ['profiles_public_select_column']: profiles_public_select_column;
  /** Streaming cursor of the table "profiles_public" */
  ['profiles_public_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['profiles_public_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['profiles_public_stream_cursor_value_input']: {
    address?: string | undefined;
    avatar?: string | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    name?: GraphQLTypes['citext'] | undefined;
  };
  ['query_root']: {
    __typename: 'query_root';
    /** fetch data from the table: "cosouls" */
    cosouls: Array<GraphQLTypes['cosouls']>;
    /** fetch data from the table: "cosouls" using primary key columns */
    cosouls_by_pk?: GraphQLTypes['cosouls'] | undefined;
    /** An array relationship */
    key_holders: Array<GraphQLTypes['key_holders']>;
    /** An aggregate relationship */
    key_holders_aggregate: GraphQLTypes['key_holders_aggregate'];
    /** fetch data from the table: "key_holders" using primary key columns */
    key_holders_by_pk?: GraphQLTypes['key_holders'] | undefined;
    /** fetch data from the table: "poap_events" */
    poap_events: Array<GraphQLTypes['poap_events']>;
    /** fetch aggregated fields from the table: "poap_events" */
    poap_events_aggregate: GraphQLTypes['poap_events_aggregate'];
    /** fetch data from the table: "poap_events" using primary key columns */
    poap_events_by_pk?: GraphQLTypes['poap_events'] | undefined;
    /** fetch data from the table: "poap_holders" */
    poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** fetch aggregated fields from the table: "poap_holders" */
    poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
    /** fetch data from the table: "poap_holders" using primary key columns */
    poap_holders_by_pk?: GraphQLTypes['poap_holders'] | undefined;
    price_per_share: number;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
    /** execute function "vector_search_poap_events" which returns "poap_events" */
    vector_search_poap_events: Array<GraphQLTypes['poap_events']>;
    /** execute function "vector_search_poap_events" and query aggregates on result of table type "poap_events" */
    vector_search_poap_events_aggregate: GraphQLTypes['poap_events_aggregate'];
    /** execute function "vector_search_poap_holders" which returns "poap_holders" */
    vector_search_poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** execute function "vector_search_poap_holders" and query aggregates on result of table type "poap_holders" */
    vector_search_poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
  };
  ['subscription_root']: {
    __typename: 'subscription_root';
    /** fetch data from the table: "cosouls" */
    cosouls: Array<GraphQLTypes['cosouls']>;
    /** fetch data from the table: "cosouls" using primary key columns */
    cosouls_by_pk?: GraphQLTypes['cosouls'] | undefined;
    /** fetch data from the table in a streaming manner: "cosouls" */
    cosouls_stream: Array<GraphQLTypes['cosouls']>;
    /** An array relationship */
    key_holders: Array<GraphQLTypes['key_holders']>;
    /** An aggregate relationship */
    key_holders_aggregate: GraphQLTypes['key_holders_aggregate'];
    /** fetch data from the table: "key_holders" using primary key columns */
    key_holders_by_pk?: GraphQLTypes['key_holders'] | undefined;
    /** fetch data from the table in a streaming manner: "key_holders" */
    key_holders_stream: Array<GraphQLTypes['key_holders']>;
    /** fetch data from the table: "poap_events" */
    poap_events: Array<GraphQLTypes['poap_events']>;
    /** fetch aggregated fields from the table: "poap_events" */
    poap_events_aggregate: GraphQLTypes['poap_events_aggregate'];
    /** fetch data from the table: "poap_events" using primary key columns */
    poap_events_by_pk?: GraphQLTypes['poap_events'] | undefined;
    /** fetch data from the table in a streaming manner: "poap_events" */
    poap_events_stream: Array<GraphQLTypes['poap_events']>;
    /** fetch data from the table: "poap_holders" */
    poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** fetch aggregated fields from the table: "poap_holders" */
    poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
    /** fetch data from the table: "poap_holders" using primary key columns */
    poap_holders_by_pk?: GraphQLTypes['poap_holders'] | undefined;
    /** fetch data from the table in a streaming manner: "poap_holders" */
    poap_holders_stream: Array<GraphQLTypes['poap_holders']>;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
    /** fetch data from the table in a streaming manner: "profiles_public" */
    profiles_public_stream: Array<GraphQLTypes['profiles_public']>;
    /** execute function "vector_search_poap_events" which returns "poap_events" */
    vector_search_poap_events: Array<GraphQLTypes['poap_events']>;
    /** execute function "vector_search_poap_events" and query aggregates on result of table type "poap_events" */
    vector_search_poap_events_aggregate: GraphQLTypes['poap_events_aggregate'];
    /** execute function "vector_search_poap_holders" which returns "poap_holders" */
    vector_search_poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** execute function "vector_search_poap_holders" and query aggregates on result of table type "poap_holders" */
    vector_search_poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
  };
  ['timestamptz']: any;
  /** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
  ['timestamptz_comparison_exp']: {
    _eq?: GraphQLTypes['timestamptz'] | undefined;
    _gt?: GraphQLTypes['timestamptz'] | undefined;
    _gte?: GraphQLTypes['timestamptz'] | undefined;
    _in?: Array<GraphQLTypes['timestamptz']> | undefined;
    _is_null?: boolean | undefined;
    _lt?: GraphQLTypes['timestamptz'] | undefined;
    _lte?: GraphQLTypes['timestamptz'] | undefined;
    _neq?: GraphQLTypes['timestamptz'] | undefined;
    _nin?: Array<GraphQLTypes['timestamptz']> | undefined;
  };
  ['vector']: any;
  /** Boolean expression to compare columns of type "vector". All fields are combined with logical 'AND'. */
  ['vector_comparison_exp']: {
    _eq?: GraphQLTypes['vector'] | undefined;
    _gt?: GraphQLTypes['vector'] | undefined;
    _gte?: GraphQLTypes['vector'] | undefined;
    _in?: Array<GraphQLTypes['vector']> | undefined;
    _is_null?: boolean | undefined;
    _lt?: GraphQLTypes['vector'] | undefined;
    _lte?: GraphQLTypes['vector'] | undefined;
    _neq?: GraphQLTypes['vector'] | undefined;
    _nin?: Array<GraphQLTypes['vector']> | undefined;
  };
  ['vector_search_poap_events_args']: {
    limit_count?: number | undefined;
    match_threshold?: GraphQLTypes['float8'] | undefined;
    target_vector?: GraphQLTypes['vector'] | undefined;
  };
  ['vector_search_poap_holders_args']: {
    limit_count?: number | undefined;
    match_threshold?: GraphQLTypes['float8'] | undefined;
    target_vector?: GraphQLTypes['vector'] | undefined;
  };
};
/** select columns of table "cosouls" */
export const enum cosouls_select_column {
  address = 'address',
  id = 'id',
  pgive = 'pgive',
  token_id = 'token_id',
}
/** ordering argument of a cursor */
export const enum cursor_ordering {
  ASC = 'ASC',
  DESC = 'DESC',
}
/** select columns of table "key_holders" */
export const enum key_holders_select_column {
  address = 'address',
  amount = 'amount',
  subject = 'subject',
  updated_at = 'updated_at',
}
/** column ordering options */
export const enum order_by {
  asc = 'asc',
  asc_nulls_first = 'asc_nulls_first',
  asc_nulls_last = 'asc_nulls_last',
  desc = 'desc',
  desc_nulls_first = 'desc_nulls_first',
  desc_nulls_last = 'desc_nulls_last',
}
/** select columns of table "poap_events" */
export const enum poap_events_select_column {
  city = 'city',
  country = 'country',
  created_at = 'created_at',
  description = 'description',
  embedding = 'embedding',
  end_date = 'end_date',
  event_url = 'event_url',
  expiry_date = 'expiry_date',
  fancy_id = 'fancy_id',
  id = 'id',
  image_url = 'image_url',
  name = 'name',
  poap_id = 'poap_id',
  similarity = 'similarity',
  start_date = 'start_date',
  supply = 'supply',
  updated_at = 'updated_at',
  year = 'year',
}
/** select columns of table "poap_holders" */
export const enum poap_holders_select_column {
  address = 'address',
  chain = 'chain',
  created_at = 'created_at',
  event_id = 'event_id',
  id = 'id',
  poap_created = 'poap_created',
  token_id = 'token_id',
  updated_at = 'updated_at',
}
/** select columns of table "profiles_public" */
export const enum profiles_public_select_column {
  address = 'address',
  avatar = 'avatar',
  id = 'id',
  name = 'name',
}
