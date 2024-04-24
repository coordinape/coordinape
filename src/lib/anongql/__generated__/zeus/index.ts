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
    R extends keyof ValueTypes = GenericOperation<O>,
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
    R extends keyof ValueTypes = GenericOperation<O>,
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
  R extends keyof ValueTypes = GenericOperation<O>,
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
  Z extends Record<string, unknown> = Record<string, unknown>,
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
  ? (typeof Ops)[O]
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
  Z extends keyof ValueTypes[T],
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
  N extends keyof ReturnType<T>,
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
type IsArray<T, U> =
  T extends Array<infer R> ? InputType<R, U>[] : InputType<T, U>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;
type BaseZeusResolver = boolean | 1 | string;

type IsInterfaced<SRC extends DeepAnify<DST>, DST> =
  FlattenArray<SRC> extends ZEUS_INTERFACES | ZEUS_UNIONS
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

export type MapType<SRC, DST> =
  SRC extends DeepAnify<DST> ? IsInterfaced<SRC, DST> : never;
export type InputType<SRC, DST> =
  IsPayLoad<DST> extends { __alias: infer R }
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
  <T extends {}>(variables: T) =>
  <
    Z extends {
      [P in keyof T]: unknown;
    },
  >(
    values: Z
  ) => {
    return {
      $params: Object.keys(variables)
        .map(k => `$${k}: ${variables[k as keyof T]}`)
        .join(', '),
      $: <U extends keyof Z>(variable: U) => {
        return `$${String(variable)}` as unknown as Z[U];
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
  /** columns and relationships of "colinks_give_count" */
  ['colinks_give_count']: AliasType<{
    gives?: boolean | `@${string}`;
    gives_last_24_hours?: boolean | `@${string}`;
    gives_last_30_days?: boolean | `@${string}`;
    gives_last_7_days?: boolean | `@${string}`;
    skill?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "colinks_give_count". All fields are combined with a logical 'AND'. */
  ['colinks_give_count_bool_exp']: {
    _and?: Array<ValueTypes['colinks_give_count_bool_exp']> | undefined | null;
    _not?: ValueTypes['colinks_give_count_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['colinks_give_count_bool_exp']> | undefined | null;
    gives?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    gives_last_24_hours?:
      | ValueTypes['bigint_comparison_exp']
      | undefined
      | null;
    gives_last_30_days?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    gives_last_7_days?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    skill?: ValueTypes['citext_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "colinks_give_count". */
  ['colinks_give_count_order_by']: {
    gives?: ValueTypes['order_by'] | undefined | null;
    gives_last_24_hours?: ValueTypes['order_by'] | undefined | null;
    gives_last_30_days?: ValueTypes['order_by'] | undefined | null;
    gives_last_7_days?: ValueTypes['order_by'] | undefined | null;
    skill?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "colinks_give_count" */
  ['colinks_give_count_select_column']: colinks_give_count_select_column;
  /** Streaming cursor of the table "colinks_give_count" */
  ['colinks_give_count_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['colinks_give_count_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['colinks_give_count_stream_cursor_value_input']: {
    gives?: ValueTypes['bigint'] | undefined | null;
    gives_last_24_hours?: ValueTypes['bigint'] | undefined | null;
    gives_last_30_days?: ValueTypes['bigint'] | undefined | null;
    gives_last_7_days?: ValueTypes['bigint'] | undefined | null;
    skill?: ValueTypes['citext'] | undefined | null;
  };
  /** columns and relationships of "colinks_gives" */
  ['colinks_gives']: AliasType<{
    activity_id?: boolean | `@${string}`;
    cast_hash?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    /** An object relationship */
    giver_profile_public?: ValueTypes['profiles_public'];
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    skill?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    /** An object relationship */
    target_profile_public?: ValueTypes['profiles_public'];
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregated selection of "colinks_gives" */
  ['colinks_gives_aggregate']: AliasType<{
    aggregate?: ValueTypes['colinks_gives_aggregate_fields'];
    nodes?: ValueTypes['colinks_gives'];
    __typename?: boolean | `@${string}`;
  }>;
  ['colinks_gives_aggregate_bool_exp']: {
    count?:
      | ValueTypes['colinks_gives_aggregate_bool_exp_count']
      | undefined
      | null;
  };
  ['colinks_gives_aggregate_bool_exp_count']: {
    arguments?:
      | Array<ValueTypes['colinks_gives_select_column']>
      | undefined
      | null;
    distinct?: boolean | undefined | null;
    filter?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
    predicate: ValueTypes['Int_comparison_exp'];
  };
  /** aggregate fields of "colinks_gives" */
  ['colinks_gives_aggregate_fields']: AliasType<{
    avg?: ValueTypes['colinks_gives_avg_fields'];
    count?: [
      {
        columns?:
          | Array<ValueTypes['colinks_gives_select_column']>
          | undefined
          | null;
        distinct?: boolean | undefined | null;
      },
      boolean | `@${string}`,
    ];
    max?: ValueTypes['colinks_gives_max_fields'];
    min?: ValueTypes['colinks_gives_min_fields'];
    stddev?: ValueTypes['colinks_gives_stddev_fields'];
    stddev_pop?: ValueTypes['colinks_gives_stddev_pop_fields'];
    stddev_samp?: ValueTypes['colinks_gives_stddev_samp_fields'];
    sum?: ValueTypes['colinks_gives_sum_fields'];
    var_pop?: ValueTypes['colinks_gives_var_pop_fields'];
    var_samp?: ValueTypes['colinks_gives_var_samp_fields'];
    variance?: ValueTypes['colinks_gives_variance_fields'];
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "colinks_gives" */
  ['colinks_gives_aggregate_order_by']: {
    avg?: ValueTypes['colinks_gives_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['colinks_gives_max_order_by'] | undefined | null;
    min?: ValueTypes['colinks_gives_min_order_by'] | undefined | null;
    stddev?: ValueTypes['colinks_gives_stddev_order_by'] | undefined | null;
    stddev_pop?:
      | ValueTypes['colinks_gives_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['colinks_gives_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['colinks_gives_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['colinks_gives_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['colinks_gives_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['colinks_gives_variance_order_by'] | undefined | null;
  };
  /** aggregate avg on columns */
  ['colinks_gives_avg_fields']: AliasType<{
    activity_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by avg() on columns of table "colinks_gives" */
  ['colinks_gives_avg_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "colinks_gives". All fields are combined with a logical 'AND'. */
  ['colinks_gives_bool_exp']: {
    _and?: Array<ValueTypes['colinks_gives_bool_exp']> | undefined | null;
    _not?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['colinks_gives_bool_exp']> | undefined | null;
    activity_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    cast_hash?: ValueTypes['String_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    giver_profile_public?:
      | ValueTypes['profiles_public_bool_exp']
      | undefined
      | null;
    id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    profile_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    skill?: ValueTypes['citext_comparison_exp'] | undefined | null;
    target_profile_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    target_profile_public?:
      | ValueTypes['profiles_public_bool_exp']
      | undefined
      | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
  };
  /** aggregate max on columns */
  ['colinks_gives_max_fields']: AliasType<{
    activity_id?: boolean | `@${string}`;
    cast_hash?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    skill?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by max() on columns of table "colinks_gives" */
  ['colinks_gives_max_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    cast_hash?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    skill?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate min on columns */
  ['colinks_gives_min_fields']: AliasType<{
    activity_id?: boolean | `@${string}`;
    cast_hash?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    skill?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by min() on columns of table "colinks_gives" */
  ['colinks_gives_min_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    cast_hash?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    skill?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "colinks_gives". */
  ['colinks_gives_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    cast_hash?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    giver_profile_public?:
      | ValueTypes['profiles_public_order_by']
      | undefined
      | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    skill?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_public?:
      | ValueTypes['profiles_public_order_by']
      | undefined
      | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "colinks_gives" */
  ['colinks_gives_select_column']: colinks_gives_select_column;
  /** columns and relationships of "colinks_gives_skill_count" */
  ['colinks_gives_skill_count']: AliasType<{
    gives?: boolean | `@${string}`;
    gives_last_24_hours?: boolean | `@${string}`;
    gives_last_30_days?: boolean | `@${string}`;
    gives_last_7_days?: boolean | `@${string}`;
    skill?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    /** An object relationship */
    target_profile_public?: ValueTypes['profiles_public'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "colinks_gives_skill_count". All fields are combined with a logical 'AND'. */
  ['colinks_gives_skill_count_bool_exp']: {
    _and?:
      | Array<ValueTypes['colinks_gives_skill_count_bool_exp']>
      | undefined
      | null;
    _not?: ValueTypes['colinks_gives_skill_count_bool_exp'] | undefined | null;
    _or?:
      | Array<ValueTypes['colinks_gives_skill_count_bool_exp']>
      | undefined
      | null;
    gives?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    gives_last_24_hours?:
      | ValueTypes['bigint_comparison_exp']
      | undefined
      | null;
    gives_last_30_days?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    gives_last_7_days?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    skill?: ValueTypes['citext_comparison_exp'] | undefined | null;
    target_profile_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    target_profile_public?:
      | ValueTypes['profiles_public_bool_exp']
      | undefined
      | null;
  };
  /** Ordering options when selecting data from "colinks_gives_skill_count". */
  ['colinks_gives_skill_count_order_by']: {
    gives?: ValueTypes['order_by'] | undefined | null;
    gives_last_24_hours?: ValueTypes['order_by'] | undefined | null;
    gives_last_30_days?: ValueTypes['order_by'] | undefined | null;
    gives_last_7_days?: ValueTypes['order_by'] | undefined | null;
    skill?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_public?:
      | ValueTypes['profiles_public_order_by']
      | undefined
      | null;
  };
  /** select columns of table "colinks_gives_skill_count" */
  ['colinks_gives_skill_count_select_column']: colinks_gives_skill_count_select_column;
  /** Streaming cursor of the table "colinks_gives_skill_count" */
  ['colinks_gives_skill_count_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['colinks_gives_skill_count_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['colinks_gives_skill_count_stream_cursor_value_input']: {
    gives?: ValueTypes['bigint'] | undefined | null;
    gives_last_24_hours?: ValueTypes['bigint'] | undefined | null;
    gives_last_30_days?: ValueTypes['bigint'] | undefined | null;
    gives_last_7_days?: ValueTypes['bigint'] | undefined | null;
    skill?: ValueTypes['citext'] | undefined | null;
    target_profile_id?: ValueTypes['bigint'] | undefined | null;
  };
  /** aggregate stddev on columns */
  ['colinks_gives_stddev_fields']: AliasType<{
    activity_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev() on columns of table "colinks_gives" */
  ['colinks_gives_stddev_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_pop on columns */
  ['colinks_gives_stddev_pop_fields']: AliasType<{
    activity_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_pop() on columns of table "colinks_gives" */
  ['colinks_gives_stddev_pop_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_samp on columns */
  ['colinks_gives_stddev_samp_fields']: AliasType<{
    activity_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_samp() on columns of table "colinks_gives" */
  ['colinks_gives_stddev_samp_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Streaming cursor of the table "colinks_gives" */
  ['colinks_gives_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['colinks_gives_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['colinks_gives_stream_cursor_value_input']: {
    activity_id?: ValueTypes['bigint'] | undefined | null;
    cast_hash?: string | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    id?: number | undefined | null;
    profile_id?: ValueTypes['bigint'] | undefined | null;
    skill?: ValueTypes['citext'] | undefined | null;
    target_profile_id?: ValueTypes['bigint'] | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
  };
  /** aggregate sum on columns */
  ['colinks_gives_sum_fields']: AliasType<{
    activity_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by sum() on columns of table "colinks_gives" */
  ['colinks_gives_sum_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_pop on columns */
  ['colinks_gives_var_pop_fields']: AliasType<{
    activity_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_pop() on columns of table "colinks_gives" */
  ['colinks_gives_var_pop_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_samp on columns */
  ['colinks_gives_var_samp_fields']: AliasType<{
    activity_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_samp() on columns of table "colinks_gives" */
  ['colinks_gives_var_samp_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate variance on columns */
  ['colinks_gives_variance_fields']: AliasType<{
    activity_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by variance() on columns of table "colinks_gives" */
  ['colinks_gives_variance_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** ordering argument of a cursor */
  ['cursor_ordering']: cursor_ordering;
  /** column ordering options */
  ['order_by']: order_by;
  /** columns and relationships of "profiles_public" */
  ['profiles_public']: AliasType<{
    address?: boolean | `@${string}`;
    avatar?: boolean | `@${string}`;
    colinks_given?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_gives_select_column']>
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
          | Array<ValueTypes['colinks_gives_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_gives'],
    ];
    colinks_given_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_gives_select_column']>
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
          | Array<ValueTypes['colinks_gives_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_gives_aggregate'],
    ];
    colinks_gives?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_gives_select_column']>
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
          | Array<ValueTypes['colinks_gives_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_gives'],
    ];
    colinks_gives_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_gives_select_column']>
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
          | Array<ValueTypes['colinks_gives_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_gives_aggregate'],
    ];
    created_at?: boolean | `@${string}`;
    description?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    joined_colinks_at?: boolean | `@${string}`;
    links?: boolean | `@${string}`;
    links_held?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    post_count?: boolean | `@${string}`;
    post_count_last_30_days?: boolean | `@${string}`;
    website?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "profiles_public". All fields are combined with a logical 'AND'. */
  ['profiles_public_bool_exp']: {
    _and?: Array<ValueTypes['profiles_public_bool_exp']> | undefined | null;
    _not?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['profiles_public_bool_exp']> | undefined | null;
    address?: ValueTypes['String_comparison_exp'] | undefined | null;
    avatar?: ValueTypes['String_comparison_exp'] | undefined | null;
    colinks_given?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
    colinks_given_aggregate?:
      | ValueTypes['colinks_gives_aggregate_bool_exp']
      | undefined
      | null;
    colinks_gives?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
    colinks_gives_aggregate?:
      | ValueTypes['colinks_gives_aggregate_bool_exp']
      | undefined
      | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    description?: ValueTypes['String_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    joined_colinks_at?:
      | ValueTypes['timestamptz_comparison_exp']
      | undefined
      | null;
    links?: ValueTypes['Int_comparison_exp'] | undefined | null;
    links_held?: ValueTypes['Int_comparison_exp'] | undefined | null;
    name?: ValueTypes['citext_comparison_exp'] | undefined | null;
    post_count?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    post_count_last_30_days?:
      | ValueTypes['bigint_comparison_exp']
      | undefined
      | null;
    website?: ValueTypes['String_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "profiles_public". */
  ['profiles_public_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    avatar?: ValueTypes['order_by'] | undefined | null;
    colinks_given_aggregate?:
      | ValueTypes['colinks_gives_aggregate_order_by']
      | undefined
      | null;
    colinks_gives_aggregate?:
      | ValueTypes['colinks_gives_aggregate_order_by']
      | undefined
      | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    joined_colinks_at?: ValueTypes['order_by'] | undefined | null;
    links?: ValueTypes['order_by'] | undefined | null;
    links_held?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    post_count?: ValueTypes['order_by'] | undefined | null;
    post_count_last_30_days?: ValueTypes['order_by'] | undefined | null;
    website?: ValueTypes['order_by'] | undefined | null;
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
    created_at?: ValueTypes['timestamp'] | undefined | null;
    description?: string | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    joined_colinks_at?: ValueTypes['timestamptz'] | undefined | null;
    links?: number | undefined | null;
    links_held?: number | undefined | null;
    name?: ValueTypes['citext'] | undefined | null;
    post_count?: ValueTypes['bigint'] | undefined | null;
    post_count_last_30_days?: ValueTypes['bigint'] | undefined | null;
    website?: string | undefined | null;
  };
  ['query_root']: AliasType<{
    colinks_give_count?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_give_count_select_column']>
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
          | Array<ValueTypes['colinks_give_count_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['colinks_give_count_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_give_count'],
    ];
    colinks_gives?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_gives_select_column']>
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
          | Array<ValueTypes['colinks_gives_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_gives'],
    ];
    colinks_gives_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_gives_select_column']>
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
          | Array<ValueTypes['colinks_gives_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_gives_aggregate'],
    ];
    colinks_gives_by_pk?: [{ id: number }, ValueTypes['colinks_gives']];
    colinks_gives_skill_count?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_gives_skill_count_select_column']>
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
          | Array<ValueTypes['colinks_gives_skill_count_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?:
          | ValueTypes['colinks_gives_skill_count_bool_exp']
          | undefined
          | null;
      },
      ValueTypes['colinks_gives_skill_count'],
    ];
    price_per_share?: [
      { chain_id: number; token_address?: string | undefined | null },
      boolean | `@${string}`,
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
      ValueTypes['profiles_public'],
    ];
    __typename?: boolean | `@${string}`;
  }>;
  ['subscription_root']: AliasType<{
    colinks_give_count?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_give_count_select_column']>
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
          | Array<ValueTypes['colinks_give_count_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['colinks_give_count_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_give_count'],
    ];
    colinks_give_count_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          | ValueTypes['colinks_give_count_stream_cursor_input']
          | undefined
          | null
        > /** filter the rows returned */;
        where?: ValueTypes['colinks_give_count_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_give_count'],
    ];
    colinks_gives?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_gives_select_column']>
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
          | Array<ValueTypes['colinks_gives_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_gives'],
    ];
    colinks_gives_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_gives_select_column']>
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
          | Array<ValueTypes['colinks_gives_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_gives_aggregate'],
    ];
    colinks_gives_by_pk?: [{ id: number }, ValueTypes['colinks_gives']];
    colinks_gives_skill_count?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['colinks_gives_skill_count_select_column']>
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
          | Array<ValueTypes['colinks_gives_skill_count_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?:
          | ValueTypes['colinks_gives_skill_count_bool_exp']
          | undefined
          | null;
      },
      ValueTypes['colinks_gives_skill_count'],
    ];
    colinks_gives_skill_count_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          | ValueTypes['colinks_gives_skill_count_stream_cursor_input']
          | undefined
          | null
        > /** filter the rows returned */;
        where?:
          | ValueTypes['colinks_gives_skill_count_bool_exp']
          | undefined
          | null;
      },
      ValueTypes['colinks_gives_skill_count'],
    ];
    colinks_gives_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['colinks_gives_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
      },
      ValueTypes['colinks_gives'],
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
      ValueTypes['profiles_public'],
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
      ValueTypes['profiles_public'],
    ];
    __typename?: boolean | `@${string}`;
  }>;
  ['timestamp']: unknown;
  /** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
  ['timestamp_comparison_exp']: {
    _eq?: ValueTypes['timestamp'] | undefined | null;
    _gt?: ValueTypes['timestamp'] | undefined | null;
    _gte?: ValueTypes['timestamp'] | undefined | null;
    _in?: Array<ValueTypes['timestamp']> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: ValueTypes['timestamp'] | undefined | null;
    _lte?: ValueTypes['timestamp'] | undefined | null;
    _neq?: ValueTypes['timestamp'] | undefined | null;
    _nin?: Array<ValueTypes['timestamp']> | undefined | null;
  };
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
  /** columns and relationships of "colinks_give_count" */
  ['colinks_give_count']: {
    gives?: GraphQLTypes['bigint'] | undefined;
    gives_last_24_hours?: GraphQLTypes['bigint'] | undefined;
    gives_last_30_days?: GraphQLTypes['bigint'] | undefined;
    gives_last_7_days?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
  };
  /** Boolean expression to filter rows from the table "colinks_give_count". All fields are combined with a logical 'AND'. */
  ['colinks_give_count_bool_exp']: GraphQLTypes['colinks_give_count_bool_exp'];
  /** Ordering options when selecting data from "colinks_give_count". */
  ['colinks_give_count_order_by']: GraphQLTypes['colinks_give_count_order_by'];
  /** select columns of table "colinks_give_count" */
  ['colinks_give_count_select_column']: GraphQLTypes['colinks_give_count_select_column'];
  /** Streaming cursor of the table "colinks_give_count" */
  ['colinks_give_count_stream_cursor_input']: GraphQLTypes['colinks_give_count_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['colinks_give_count_stream_cursor_value_input']: GraphQLTypes['colinks_give_count_stream_cursor_value_input'];
  /** columns and relationships of "colinks_gives" */
  ['colinks_gives']: {
    activity_id?: GraphQLTypes['bigint'] | undefined;
    cast_hash?: string | undefined;
    created_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    giver_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    id: number;
    profile_id: GraphQLTypes['bigint'];
    skill?: GraphQLTypes['citext'] | undefined;
    target_profile_id: GraphQLTypes['bigint'];
    /** An object relationship */
    target_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** aggregated selection of "colinks_gives" */
  ['colinks_gives_aggregate']: {
    aggregate?: GraphQLTypes['colinks_gives_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['colinks_gives']>;
  };
  ['colinks_gives_aggregate_bool_exp']: GraphQLTypes['colinks_gives_aggregate_bool_exp'];
  ['colinks_gives_aggregate_bool_exp_count']: GraphQLTypes['colinks_gives_aggregate_bool_exp_count'];
  /** aggregate fields of "colinks_gives" */
  ['colinks_gives_aggregate_fields']: {
    avg?: GraphQLTypes['colinks_gives_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['colinks_gives_max_fields'] | undefined;
    min?: GraphQLTypes['colinks_gives_min_fields'] | undefined;
    stddev?: GraphQLTypes['colinks_gives_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['colinks_gives_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['colinks_gives_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['colinks_gives_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['colinks_gives_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['colinks_gives_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['colinks_gives_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "colinks_gives" */
  ['colinks_gives_aggregate_order_by']: GraphQLTypes['colinks_gives_aggregate_order_by'];
  /** aggregate avg on columns */
  ['colinks_gives_avg_fields']: {
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by avg() on columns of table "colinks_gives" */
  ['colinks_gives_avg_order_by']: GraphQLTypes['colinks_gives_avg_order_by'];
  /** Boolean expression to filter rows from the table "colinks_gives". All fields are combined with a logical 'AND'. */
  ['colinks_gives_bool_exp']: GraphQLTypes['colinks_gives_bool_exp'];
  /** aggregate max on columns */
  ['colinks_gives_max_fields']: {
    activity_id?: GraphQLTypes['bigint'] | undefined;
    cast_hash?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    id?: number | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by max() on columns of table "colinks_gives" */
  ['colinks_gives_max_order_by']: GraphQLTypes['colinks_gives_max_order_by'];
  /** aggregate min on columns */
  ['colinks_gives_min_fields']: {
    activity_id?: GraphQLTypes['bigint'] | undefined;
    cast_hash?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    id?: number | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by min() on columns of table "colinks_gives" */
  ['colinks_gives_min_order_by']: GraphQLTypes['colinks_gives_min_order_by'];
  /** Ordering options when selecting data from "colinks_gives". */
  ['colinks_gives_order_by']: GraphQLTypes['colinks_gives_order_by'];
  /** select columns of table "colinks_gives" */
  ['colinks_gives_select_column']: GraphQLTypes['colinks_gives_select_column'];
  /** columns and relationships of "colinks_gives_skill_count" */
  ['colinks_gives_skill_count']: {
    gives?: GraphQLTypes['bigint'] | undefined;
    gives_last_24_hours?: GraphQLTypes['bigint'] | undefined;
    gives_last_30_days?: GraphQLTypes['bigint'] | undefined;
    gives_last_7_days?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    target_profile_public?: GraphQLTypes['profiles_public'] | undefined;
  };
  /** Boolean expression to filter rows from the table "colinks_gives_skill_count". All fields are combined with a logical 'AND'. */
  ['colinks_gives_skill_count_bool_exp']: GraphQLTypes['colinks_gives_skill_count_bool_exp'];
  /** Ordering options when selecting data from "colinks_gives_skill_count". */
  ['colinks_gives_skill_count_order_by']: GraphQLTypes['colinks_gives_skill_count_order_by'];
  /** select columns of table "colinks_gives_skill_count" */
  ['colinks_gives_skill_count_select_column']: GraphQLTypes['colinks_gives_skill_count_select_column'];
  /** Streaming cursor of the table "colinks_gives_skill_count" */
  ['colinks_gives_skill_count_stream_cursor_input']: GraphQLTypes['colinks_gives_skill_count_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['colinks_gives_skill_count_stream_cursor_value_input']: GraphQLTypes['colinks_gives_skill_count_stream_cursor_value_input'];
  /** aggregate stddev on columns */
  ['colinks_gives_stddev_fields']: {
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by stddev() on columns of table "colinks_gives" */
  ['colinks_gives_stddev_order_by']: GraphQLTypes['colinks_gives_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['colinks_gives_stddev_pop_fields']: {
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "colinks_gives" */
  ['colinks_gives_stddev_pop_order_by']: GraphQLTypes['colinks_gives_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['colinks_gives_stddev_samp_fields']: {
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "colinks_gives" */
  ['colinks_gives_stddev_samp_order_by']: GraphQLTypes['colinks_gives_stddev_samp_order_by'];
  /** Streaming cursor of the table "colinks_gives" */
  ['colinks_gives_stream_cursor_input']: GraphQLTypes['colinks_gives_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['colinks_gives_stream_cursor_value_input']: GraphQLTypes['colinks_gives_stream_cursor_value_input'];
  /** aggregate sum on columns */
  ['colinks_gives_sum_fields']: {
    activity_id?: GraphQLTypes['bigint'] | undefined;
    id?: number | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by sum() on columns of table "colinks_gives" */
  ['colinks_gives_sum_order_by']: GraphQLTypes['colinks_gives_sum_order_by'];
  /** aggregate var_pop on columns */
  ['colinks_gives_var_pop_fields']: {
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by var_pop() on columns of table "colinks_gives" */
  ['colinks_gives_var_pop_order_by']: GraphQLTypes['colinks_gives_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['colinks_gives_var_samp_fields']: {
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by var_samp() on columns of table "colinks_gives" */
  ['colinks_gives_var_samp_order_by']: GraphQLTypes['colinks_gives_var_samp_order_by'];
  /** aggregate variance on columns */
  ['colinks_gives_variance_fields']: {
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by variance() on columns of table "colinks_gives" */
  ['colinks_gives_variance_order_by']: GraphQLTypes['colinks_gives_variance_order_by'];
  /** ordering argument of a cursor */
  ['cursor_ordering']: GraphQLTypes['cursor_ordering'];
  /** column ordering options */
  ['order_by']: GraphQLTypes['order_by'];
  /** columns and relationships of "profiles_public" */
  ['profiles_public']: {
    address?: string | undefined;
    avatar?: string | undefined;
    /** An array relationship */
    colinks_given: Array<GraphQLTypes['colinks_gives']>;
    /** An aggregate relationship */
    colinks_given_aggregate: GraphQLTypes['colinks_gives_aggregate'];
    /** An array relationship */
    colinks_gives: Array<GraphQLTypes['colinks_gives']>;
    /** An aggregate relationship */
    colinks_gives_aggregate: GraphQLTypes['colinks_gives_aggregate'];
    created_at?: GraphQLTypes['timestamp'] | undefined;
    description?: string | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    joined_colinks_at?: GraphQLTypes['timestamptz'] | undefined;
    links?: number | undefined;
    links_held?: number | undefined;
    name?: GraphQLTypes['citext'] | undefined;
    post_count?: GraphQLTypes['bigint'] | undefined;
    post_count_last_30_days?: GraphQLTypes['bigint'] | undefined;
    website?: string | undefined;
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
    /** fetch data from the table: "colinks_give_count" */
    colinks_give_count: Array<GraphQLTypes['colinks_give_count']>;
    /** An array relationship */
    colinks_gives: Array<GraphQLTypes['colinks_gives']>;
    /** An aggregate relationship */
    colinks_gives_aggregate: GraphQLTypes['colinks_gives_aggregate'];
    /** fetch data from the table: "colinks_gives" using primary key columns */
    colinks_gives_by_pk?: GraphQLTypes['colinks_gives'] | undefined;
    /** fetch data from the table: "colinks_gives_skill_count" */
    colinks_gives_skill_count: Array<GraphQLTypes['colinks_gives_skill_count']>;
    price_per_share: number;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
  };
  ['subscription_root']: {
    /** fetch data from the table: "colinks_give_count" */
    colinks_give_count: Array<GraphQLTypes['colinks_give_count']>;
    /** fetch data from the table in a streaming manner: "colinks_give_count" */
    colinks_give_count_stream: Array<GraphQLTypes['colinks_give_count']>;
    /** An array relationship */
    colinks_gives: Array<GraphQLTypes['colinks_gives']>;
    /** An aggregate relationship */
    colinks_gives_aggregate: GraphQLTypes['colinks_gives_aggregate'];
    /** fetch data from the table: "colinks_gives" using primary key columns */
    colinks_gives_by_pk?: GraphQLTypes['colinks_gives'] | undefined;
    /** fetch data from the table: "colinks_gives_skill_count" */
    colinks_gives_skill_count: Array<GraphQLTypes['colinks_gives_skill_count']>;
    /** fetch data from the table in a streaming manner: "colinks_gives_skill_count" */
    colinks_gives_skill_count_stream: Array<
      GraphQLTypes['colinks_gives_skill_count']
    >;
    /** fetch data from the table in a streaming manner: "colinks_gives" */
    colinks_gives_stream: Array<GraphQLTypes['colinks_gives']>;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
    /** fetch data from the table in a streaming manner: "profiles_public" */
    profiles_public_stream: Array<GraphQLTypes['profiles_public']>;
  };
  ['timestamp']: any;
  /** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
  ['timestamp_comparison_exp']: GraphQLTypes['timestamp_comparison_exp'];
  ['timestamptz']: any;
  /** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
  ['timestamptz_comparison_exp']: GraphQLTypes['timestamptz_comparison_exp'];
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
  /** columns and relationships of "colinks_give_count" */
  ['colinks_give_count']: {
    __typename: 'colinks_give_count';
    gives?: GraphQLTypes['bigint'] | undefined;
    gives_last_24_hours?: GraphQLTypes['bigint'] | undefined;
    gives_last_30_days?: GraphQLTypes['bigint'] | undefined;
    gives_last_7_days?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
  };
  /** Boolean expression to filter rows from the table "colinks_give_count". All fields are combined with a logical 'AND'. */
  ['colinks_give_count_bool_exp']: {
    _and?: Array<GraphQLTypes['colinks_give_count_bool_exp']> | undefined;
    _not?: GraphQLTypes['colinks_give_count_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['colinks_give_count_bool_exp']> | undefined;
    gives?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    gives_last_24_hours?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    gives_last_30_days?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    gives_last_7_days?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    skill?: GraphQLTypes['citext_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "colinks_give_count". */
  ['colinks_give_count_order_by']: {
    gives?: GraphQLTypes['order_by'] | undefined;
    gives_last_24_hours?: GraphQLTypes['order_by'] | undefined;
    gives_last_30_days?: GraphQLTypes['order_by'] | undefined;
    gives_last_7_days?: GraphQLTypes['order_by'] | undefined;
    skill?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "colinks_give_count" */
  ['colinks_give_count_select_column']: colinks_give_count_select_column;
  /** Streaming cursor of the table "colinks_give_count" */
  ['colinks_give_count_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['colinks_give_count_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['colinks_give_count_stream_cursor_value_input']: {
    gives?: GraphQLTypes['bigint'] | undefined;
    gives_last_24_hours?: GraphQLTypes['bigint'] | undefined;
    gives_last_30_days?: GraphQLTypes['bigint'] | undefined;
    gives_last_7_days?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
  };
  /** columns and relationships of "colinks_gives" */
  ['colinks_gives']: {
    __typename: 'colinks_gives';
    activity_id?: GraphQLTypes['bigint'] | undefined;
    cast_hash?: string | undefined;
    created_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    giver_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    id: number;
    profile_id: GraphQLTypes['bigint'];
    skill?: GraphQLTypes['citext'] | undefined;
    target_profile_id: GraphQLTypes['bigint'];
    /** An object relationship */
    target_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** aggregated selection of "colinks_gives" */
  ['colinks_gives_aggregate']: {
    __typename: 'colinks_gives_aggregate';
    aggregate?: GraphQLTypes['colinks_gives_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['colinks_gives']>;
  };
  ['colinks_gives_aggregate_bool_exp']: {
    count?: GraphQLTypes['colinks_gives_aggregate_bool_exp_count'] | undefined;
  };
  ['colinks_gives_aggregate_bool_exp_count']: {
    arguments?: Array<GraphQLTypes['colinks_gives_select_column']> | undefined;
    distinct?: boolean | undefined;
    filter?: GraphQLTypes['colinks_gives_bool_exp'] | undefined;
    predicate: GraphQLTypes['Int_comparison_exp'];
  };
  /** aggregate fields of "colinks_gives" */
  ['colinks_gives_aggregate_fields']: {
    __typename: 'colinks_gives_aggregate_fields';
    avg?: GraphQLTypes['colinks_gives_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['colinks_gives_max_fields'] | undefined;
    min?: GraphQLTypes['colinks_gives_min_fields'] | undefined;
    stddev?: GraphQLTypes['colinks_gives_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['colinks_gives_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['colinks_gives_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['colinks_gives_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['colinks_gives_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['colinks_gives_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['colinks_gives_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "colinks_gives" */
  ['colinks_gives_aggregate_order_by']: {
    avg?: GraphQLTypes['colinks_gives_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['colinks_gives_max_order_by'] | undefined;
    min?: GraphQLTypes['colinks_gives_min_order_by'] | undefined;
    stddev?: GraphQLTypes['colinks_gives_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['colinks_gives_stddev_pop_order_by'] | undefined;
    stddev_samp?:
      | GraphQLTypes['colinks_gives_stddev_samp_order_by']
      | undefined;
    sum?: GraphQLTypes['colinks_gives_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['colinks_gives_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['colinks_gives_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['colinks_gives_variance_order_by'] | undefined;
  };
  /** aggregate avg on columns */
  ['colinks_gives_avg_fields']: {
    __typename: 'colinks_gives_avg_fields';
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by avg() on columns of table "colinks_gives" */
  ['colinks_gives_avg_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "colinks_gives". All fields are combined with a logical 'AND'. */
  ['colinks_gives_bool_exp']: {
    _and?: Array<GraphQLTypes['colinks_gives_bool_exp']> | undefined;
    _not?: GraphQLTypes['colinks_gives_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['colinks_gives_bool_exp']> | undefined;
    activity_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    cast_hash?: GraphQLTypes['String_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    giver_profile_public?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    profile_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    skill?: GraphQLTypes['citext_comparison_exp'] | undefined;
    target_profile_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    target_profile_public?:
      | GraphQLTypes['profiles_public_bool_exp']
      | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
  };
  /** aggregate max on columns */
  ['colinks_gives_max_fields']: {
    __typename: 'colinks_gives_max_fields';
    activity_id?: GraphQLTypes['bigint'] | undefined;
    cast_hash?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    id?: number | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by max() on columns of table "colinks_gives" */
  ['colinks_gives_max_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    cast_hash?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    skill?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate min on columns */
  ['colinks_gives_min_fields']: {
    __typename: 'colinks_gives_min_fields';
    activity_id?: GraphQLTypes['bigint'] | undefined;
    cast_hash?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    id?: number | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by min() on columns of table "colinks_gives" */
  ['colinks_gives_min_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    cast_hash?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    skill?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "colinks_gives". */
  ['colinks_gives_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    cast_hash?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    giver_profile_public?: GraphQLTypes['profiles_public_order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    skill?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_public?:
      | GraphQLTypes['profiles_public_order_by']
      | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "colinks_gives" */
  ['colinks_gives_select_column']: colinks_gives_select_column;
  /** columns and relationships of "colinks_gives_skill_count" */
  ['colinks_gives_skill_count']: {
    __typename: 'colinks_gives_skill_count';
    gives?: GraphQLTypes['bigint'] | undefined;
    gives_last_24_hours?: GraphQLTypes['bigint'] | undefined;
    gives_last_30_days?: GraphQLTypes['bigint'] | undefined;
    gives_last_7_days?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    target_profile_public?: GraphQLTypes['profiles_public'] | undefined;
  };
  /** Boolean expression to filter rows from the table "colinks_gives_skill_count". All fields are combined with a logical 'AND'. */
  ['colinks_gives_skill_count_bool_exp']: {
    _and?:
      | Array<GraphQLTypes['colinks_gives_skill_count_bool_exp']>
      | undefined;
    _not?: GraphQLTypes['colinks_gives_skill_count_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['colinks_gives_skill_count_bool_exp']> | undefined;
    gives?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    gives_last_24_hours?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    gives_last_30_days?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    gives_last_7_days?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    skill?: GraphQLTypes['citext_comparison_exp'] | undefined;
    target_profile_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    target_profile_public?:
      | GraphQLTypes['profiles_public_bool_exp']
      | undefined;
  };
  /** Ordering options when selecting data from "colinks_gives_skill_count". */
  ['colinks_gives_skill_count_order_by']: {
    gives?: GraphQLTypes['order_by'] | undefined;
    gives_last_24_hours?: GraphQLTypes['order_by'] | undefined;
    gives_last_30_days?: GraphQLTypes['order_by'] | undefined;
    gives_last_7_days?: GraphQLTypes['order_by'] | undefined;
    skill?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_public?:
      | GraphQLTypes['profiles_public_order_by']
      | undefined;
  };
  /** select columns of table "colinks_gives_skill_count" */
  ['colinks_gives_skill_count_select_column']: colinks_gives_skill_count_select_column;
  /** Streaming cursor of the table "colinks_gives_skill_count" */
  ['colinks_gives_skill_count_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['colinks_gives_skill_count_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['colinks_gives_skill_count_stream_cursor_value_input']: {
    gives?: GraphQLTypes['bigint'] | undefined;
    gives_last_24_hours?: GraphQLTypes['bigint'] | undefined;
    gives_last_30_days?: GraphQLTypes['bigint'] | undefined;
    gives_last_7_days?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** aggregate stddev on columns */
  ['colinks_gives_stddev_fields']: {
    __typename: 'colinks_gives_stddev_fields';
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by stddev() on columns of table "colinks_gives" */
  ['colinks_gives_stddev_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_pop on columns */
  ['colinks_gives_stddev_pop_fields']: {
    __typename: 'colinks_gives_stddev_pop_fields';
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "colinks_gives" */
  ['colinks_gives_stddev_pop_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_samp on columns */
  ['colinks_gives_stddev_samp_fields']: {
    __typename: 'colinks_gives_stddev_samp_fields';
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "colinks_gives" */
  ['colinks_gives_stddev_samp_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Streaming cursor of the table "colinks_gives" */
  ['colinks_gives_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['colinks_gives_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['colinks_gives_stream_cursor_value_input']: {
    activity_id?: GraphQLTypes['bigint'] | undefined;
    cast_hash?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    id?: number | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    skill?: GraphQLTypes['citext'] | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** aggregate sum on columns */
  ['colinks_gives_sum_fields']: {
    __typename: 'colinks_gives_sum_fields';
    activity_id?: GraphQLTypes['bigint'] | undefined;
    id?: number | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by sum() on columns of table "colinks_gives" */
  ['colinks_gives_sum_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_pop on columns */
  ['colinks_gives_var_pop_fields']: {
    __typename: 'colinks_gives_var_pop_fields';
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by var_pop() on columns of table "colinks_gives" */
  ['colinks_gives_var_pop_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_samp on columns */
  ['colinks_gives_var_samp_fields']: {
    __typename: 'colinks_gives_var_samp_fields';
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by var_samp() on columns of table "colinks_gives" */
  ['colinks_gives_var_samp_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate variance on columns */
  ['colinks_gives_variance_fields']: {
    __typename: 'colinks_gives_variance_fields';
    activity_id?: number | undefined;
    id?: number | undefined;
    profile_id?: number | undefined;
    target_profile_id?: number | undefined;
  };
  /** order by variance() on columns of table "colinks_gives" */
  ['colinks_gives_variance_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** ordering argument of a cursor */
  ['cursor_ordering']: cursor_ordering;
  /** column ordering options */
  ['order_by']: order_by;
  /** columns and relationships of "profiles_public" */
  ['profiles_public']: {
    __typename: 'profiles_public';
    address?: string | undefined;
    avatar?: string | undefined;
    /** An array relationship */
    colinks_given: Array<GraphQLTypes['colinks_gives']>;
    /** An aggregate relationship */
    colinks_given_aggregate: GraphQLTypes['colinks_gives_aggregate'];
    /** An array relationship */
    colinks_gives: Array<GraphQLTypes['colinks_gives']>;
    /** An aggregate relationship */
    colinks_gives_aggregate: GraphQLTypes['colinks_gives_aggregate'];
    created_at?: GraphQLTypes['timestamp'] | undefined;
    description?: string | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    joined_colinks_at?: GraphQLTypes['timestamptz'] | undefined;
    links?: number | undefined;
    links_held?: number | undefined;
    name?: GraphQLTypes['citext'] | undefined;
    post_count?: GraphQLTypes['bigint'] | undefined;
    post_count_last_30_days?: GraphQLTypes['bigint'] | undefined;
    website?: string | undefined;
  };
  /** Boolean expression to filter rows from the table "profiles_public". All fields are combined with a logical 'AND'. */
  ['profiles_public_bool_exp']: {
    _and?: Array<GraphQLTypes['profiles_public_bool_exp']> | undefined;
    _not?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['profiles_public_bool_exp']> | undefined;
    address?: GraphQLTypes['String_comparison_exp'] | undefined;
    avatar?: GraphQLTypes['String_comparison_exp'] | undefined;
    colinks_given?: GraphQLTypes['colinks_gives_bool_exp'] | undefined;
    colinks_given_aggregate?:
      | GraphQLTypes['colinks_gives_aggregate_bool_exp']
      | undefined;
    colinks_gives?: GraphQLTypes['colinks_gives_bool_exp'] | undefined;
    colinks_gives_aggregate?:
      | GraphQLTypes['colinks_gives_aggregate_bool_exp']
      | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    description?: GraphQLTypes['String_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    joined_colinks_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    links?: GraphQLTypes['Int_comparison_exp'] | undefined;
    links_held?: GraphQLTypes['Int_comparison_exp'] | undefined;
    name?: GraphQLTypes['citext_comparison_exp'] | undefined;
    post_count?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    post_count_last_30_days?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    website?: GraphQLTypes['String_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "profiles_public". */
  ['profiles_public_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    avatar?: GraphQLTypes['order_by'] | undefined;
    colinks_given_aggregate?:
      | GraphQLTypes['colinks_gives_aggregate_order_by']
      | undefined;
    colinks_gives_aggregate?:
      | GraphQLTypes['colinks_gives_aggregate_order_by']
      | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    joined_colinks_at?: GraphQLTypes['order_by'] | undefined;
    links?: GraphQLTypes['order_by'] | undefined;
    links_held?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    post_count?: GraphQLTypes['order_by'] | undefined;
    post_count_last_30_days?: GraphQLTypes['order_by'] | undefined;
    website?: GraphQLTypes['order_by'] | undefined;
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
    created_at?: GraphQLTypes['timestamp'] | undefined;
    description?: string | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    joined_colinks_at?: GraphQLTypes['timestamptz'] | undefined;
    links?: number | undefined;
    links_held?: number | undefined;
    name?: GraphQLTypes['citext'] | undefined;
    post_count?: GraphQLTypes['bigint'] | undefined;
    post_count_last_30_days?: GraphQLTypes['bigint'] | undefined;
    website?: string | undefined;
  };
  ['query_root']: {
    __typename: 'query_root';
    /** fetch data from the table: "colinks_give_count" */
    colinks_give_count: Array<GraphQLTypes['colinks_give_count']>;
    /** An array relationship */
    colinks_gives: Array<GraphQLTypes['colinks_gives']>;
    /** An aggregate relationship */
    colinks_gives_aggregate: GraphQLTypes['colinks_gives_aggregate'];
    /** fetch data from the table: "colinks_gives" using primary key columns */
    colinks_gives_by_pk?: GraphQLTypes['colinks_gives'] | undefined;
    /** fetch data from the table: "colinks_gives_skill_count" */
    colinks_gives_skill_count: Array<GraphQLTypes['colinks_gives_skill_count']>;
    price_per_share: number;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
  };
  ['subscription_root']: {
    __typename: 'subscription_root';
    /** fetch data from the table: "colinks_give_count" */
    colinks_give_count: Array<GraphQLTypes['colinks_give_count']>;
    /** fetch data from the table in a streaming manner: "colinks_give_count" */
    colinks_give_count_stream: Array<GraphQLTypes['colinks_give_count']>;
    /** An array relationship */
    colinks_gives: Array<GraphQLTypes['colinks_gives']>;
    /** An aggregate relationship */
    colinks_gives_aggregate: GraphQLTypes['colinks_gives_aggregate'];
    /** fetch data from the table: "colinks_gives" using primary key columns */
    colinks_gives_by_pk?: GraphQLTypes['colinks_gives'] | undefined;
    /** fetch data from the table: "colinks_gives_skill_count" */
    colinks_gives_skill_count: Array<GraphQLTypes['colinks_gives_skill_count']>;
    /** fetch data from the table in a streaming manner: "colinks_gives_skill_count" */
    colinks_gives_skill_count_stream: Array<
      GraphQLTypes['colinks_gives_skill_count']
    >;
    /** fetch data from the table in a streaming manner: "colinks_gives" */
    colinks_gives_stream: Array<GraphQLTypes['colinks_gives']>;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
    /** fetch data from the table in a streaming manner: "profiles_public" */
    profiles_public_stream: Array<GraphQLTypes['profiles_public']>;
  };
  ['timestamp']: any;
  /** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
  ['timestamp_comparison_exp']: {
    _eq?: GraphQLTypes['timestamp'] | undefined;
    _gt?: GraphQLTypes['timestamp'] | undefined;
    _gte?: GraphQLTypes['timestamp'] | undefined;
    _in?: Array<GraphQLTypes['timestamp']> | undefined;
    _is_null?: boolean | undefined;
    _lt?: GraphQLTypes['timestamp'] | undefined;
    _lte?: GraphQLTypes['timestamp'] | undefined;
    _neq?: GraphQLTypes['timestamp'] | undefined;
    _nin?: Array<GraphQLTypes['timestamp']> | undefined;
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
};
/** select columns of table "colinks_give_count" */
export const enum colinks_give_count_select_column {
  gives = 'gives',
  gives_last_24_hours = 'gives_last_24_hours',
  gives_last_30_days = 'gives_last_30_days',
  gives_last_7_days = 'gives_last_7_days',
  skill = 'skill',
}
/** select columns of table "colinks_gives" */
export const enum colinks_gives_select_column {
  activity_id = 'activity_id',
  cast_hash = 'cast_hash',
  created_at = 'created_at',
  id = 'id',
  profile_id = 'profile_id',
  skill = 'skill',
  target_profile_id = 'target_profile_id',
  updated_at = 'updated_at',
}
/** select columns of table "colinks_gives_skill_count" */
export const enum colinks_gives_skill_count_select_column {
  gives = 'gives',
  gives_last_24_hours = 'gives_last_24_hours',
  gives_last_30_days = 'gives_last_30_days',
  gives_last_7_days = 'gives_last_7_days',
  skill = 'skill',
  target_profile_id = 'target_profile_id',
}
/** ordering argument of a cursor */
export const enum cursor_ordering {
  ASC = 'ASC',
  DESC = 'DESC',
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
/** select columns of table "profiles_public" */
export const enum profiles_public_select_column {
  address = 'address',
  avatar = 'avatar',
  created_at = 'created_at',
  description = 'description',
  id = 'id',
  joined_colinks_at = 'joined_colinks_at',
  links = 'links',
  links_held = 'links_held',
  name = 'name',
  post_count = 'post_count',
  post_count_last_30_days = 'post_count_last_30_days',
  website = 'website',
}
