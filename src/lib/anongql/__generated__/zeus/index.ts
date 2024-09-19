/* eslint-disable */
import { DebugLogger } from '../../../../common-lib/log';
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
  /** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
  ['Boolean_comparison_exp']: {
    _eq?: boolean | undefined | null;
    _gt?: boolean | undefined | null;
    _gte?: boolean | undefined | null;
    _in?: Array<boolean> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: boolean | undefined | null;
    _lte?: boolean | undefined | null;
    _neq?: boolean | undefined | null;
    _nin?: Array<boolean> | undefined | null;
  };
  ['Cast']: AliasType<{
    address?: boolean | `@${string}`;
    avatar_url?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    embeds?: ValueTypes['CastEmbed'];
    fid?: boolean | `@${string}`;
    fname?: boolean | `@${string}`;
    hash?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    like_count?: boolean | `@${string}`;
    mentioned_addresses?: ValueTypes['CastMention'];
    recast_count?: boolean | `@${string}`;
    replies_count?: boolean | `@${string}`;
    text?: boolean | `@${string}`;
    text_with_mentions?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['CastEmbed']: AliasType<{
    type?: boolean | `@${string}`;
    url?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['CastMention']: AliasType<{
    address?: boolean | `@${string}`;
    fname?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['GetCastsInput']: {
    cast_ids?: Array<ValueTypes['bigint']> | undefined | null;
    fid?: ValueTypes['bigint'] | undefined | null;
  };
  ['GetCastsOutput']: AliasType<{
    casts?: ValueTypes['Cast'];
    __typename?: boolean | `@${string}`;
  }>;
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
  /** Table containing activity on our platform */
  ['activities']: AliasType<{
    action?: boolean | `@${string}`;
    actor_profile_id?: boolean | `@${string}`;
    /** An object relationship */
    actor_profile_public?: ValueTypes['profiles_public'];
    /** An object relationship */
    big_question?: ValueTypes['big_questions'];
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    /** An object relationship */
    enriched_cast?: ValueTypes['enriched_casts'];
    epoch_id?: boolean | `@${string}`;
    gives?: [
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
    gives_aggregate?: [
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
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    private_stream?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reactions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['reactions_select_column']>
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
          | Array<ValueTypes['reactions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['reactions_bool_exp'] | undefined | null;
      },
      ValueTypes['reactions'],
    ];
    replies?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['replies_select_column']>
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
          | Array<ValueTypes['replies_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['replies_bool_exp'] | undefined | null;
      },
      ValueTypes['replies'],
    ];
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    /** An object relationship */
    target_profile_public?: ValueTypes['profiles_public'];
    updated_at?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregated selection of "activities" */
  ['activities_aggregate']: AliasType<{
    aggregate?: ValueTypes['activities_aggregate_fields'];
    nodes?: ValueTypes['activities'];
    __typename?: boolean | `@${string}`;
  }>;
  ['activities_aggregate_bool_exp']: {
    bool_and?:
      | ValueTypes['activities_aggregate_bool_exp_bool_and']
      | undefined
      | null;
    bool_or?:
      | ValueTypes['activities_aggregate_bool_exp_bool_or']
      | undefined
      | null;
    count?:
      | ValueTypes['activities_aggregate_bool_exp_count']
      | undefined
      | null;
  };
  ['activities_aggregate_bool_exp_bool_and']: {
    arguments: ValueTypes['activities_select_column_activities_aggregate_bool_exp_bool_and_arguments_columns'];
    distinct?: boolean | undefined | null;
    filter?: ValueTypes['activities_bool_exp'] | undefined | null;
    predicate: ValueTypes['Boolean_comparison_exp'];
  };
  ['activities_aggregate_bool_exp_bool_or']: {
    arguments: ValueTypes['activities_select_column_activities_aggregate_bool_exp_bool_or_arguments_columns'];
    distinct?: boolean | undefined | null;
    filter?: ValueTypes['activities_bool_exp'] | undefined | null;
    predicate: ValueTypes['Boolean_comparison_exp'];
  };
  ['activities_aggregate_bool_exp_count']: {
    arguments?:
      | Array<ValueTypes['activities_select_column']>
      | undefined
      | null;
    distinct?: boolean | undefined | null;
    filter?: ValueTypes['activities_bool_exp'] | undefined | null;
    predicate: ValueTypes['Int_comparison_exp'];
  };
  /** aggregate fields of "activities" */
  ['activities_aggregate_fields']: AliasType<{
    avg?: ValueTypes['activities_avg_fields'];
    count?: [
      {
        columns?:
          | Array<ValueTypes['activities_select_column']>
          | undefined
          | null;
        distinct?: boolean | undefined | null;
      },
      boolean | `@${string}`,
    ];
    max?: ValueTypes['activities_max_fields'];
    min?: ValueTypes['activities_min_fields'];
    stddev?: ValueTypes['activities_stddev_fields'];
    stddev_pop?: ValueTypes['activities_stddev_pop_fields'];
    stddev_samp?: ValueTypes['activities_stddev_samp_fields'];
    sum?: ValueTypes['activities_sum_fields'];
    var_pop?: ValueTypes['activities_var_pop_fields'];
    var_samp?: ValueTypes['activities_var_samp_fields'];
    variance?: ValueTypes['activities_variance_fields'];
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "activities" */
  ['activities_aggregate_order_by']: {
    avg?: ValueTypes['activities_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['activities_max_order_by'] | undefined | null;
    min?: ValueTypes['activities_min_order_by'] | undefined | null;
    stddev?: ValueTypes['activities_stddev_order_by'] | undefined | null;
    stddev_pop?:
      | ValueTypes['activities_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['activities_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['activities_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['activities_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['activities_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['activities_variance_order_by'] | undefined | null;
  };
  /** aggregate avg on columns */
  ['activities_avg_fields']: AliasType<{
    actor_profile_id?: boolean | `@${string}`;
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by avg() on columns of table "activities" */
  ['activities_avg_order_by']: {
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "activities". All fields are combined with a logical 'AND'. */
  ['activities_bool_exp']: {
    _and?: Array<ValueTypes['activities_bool_exp']> | undefined | null;
    _not?: ValueTypes['activities_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['activities_bool_exp']> | undefined | null;
    action?: ValueTypes['String_comparison_exp'] | undefined | null;
    actor_profile_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    actor_profile_public?:
      | ValueTypes['profiles_public_bool_exp']
      | undefined
      | null;
    big_question?: ValueTypes['big_questions_bool_exp'] | undefined | null;
    big_question_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    cast_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    contribution_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    enriched_cast?: ValueTypes['enriched_casts_bool_exp'] | undefined | null;
    epoch_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    gives?: ValueTypes['colinks_gives_bool_exp'] | undefined | null;
    gives_aggregate?:
      | ValueTypes['colinks_gives_aggregate_bool_exp']
      | undefined
      | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    organization_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    private_stream?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    reaction_count?: ValueTypes['Int_comparison_exp'] | undefined | null;
    reactions?: ValueTypes['reactions_bool_exp'] | undefined | null;
    replies?: ValueTypes['replies_bool_exp'] | undefined | null;
    reply_count?: ValueTypes['Int_comparison_exp'] | undefined | null;
    target_profile_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    target_profile_public?:
      | ValueTypes['profiles_public_bool_exp']
      | undefined
      | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    user_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
  };
  /** aggregate max on columns */
  ['activities_max_fields']: AliasType<{
    action?: boolean | `@${string}`;
    actor_profile_id?: boolean | `@${string}`;
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by max() on columns of table "activities" */
  ['activities_max_order_by']: {
    action?: ValueTypes['order_by'] | undefined | null;
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate min on columns */
  ['activities_min_fields']: AliasType<{
    action?: boolean | `@${string}`;
    actor_profile_id?: boolean | `@${string}`;
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by min() on columns of table "activities" */
  ['activities_min_order_by']: {
    action?: ValueTypes['order_by'] | undefined | null;
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "activities". */
  ['activities_order_by']: {
    action?: ValueTypes['order_by'] | undefined | null;
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    actor_profile_public?:
      | ValueTypes['profiles_public_order_by']
      | undefined
      | null;
    big_question?: ValueTypes['big_questions_order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    enriched_cast?: ValueTypes['enriched_casts_order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    gives_aggregate?:
      | ValueTypes['colinks_gives_aggregate_order_by']
      | undefined
      | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    private_stream?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reactions_aggregate?:
      | ValueTypes['reactions_aggregate_order_by']
      | undefined
      | null;
    replies_aggregate?:
      | ValueTypes['replies_aggregate_order_by']
      | undefined
      | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    target_profile_public?:
      | ValueTypes['profiles_public_order_by']
      | undefined
      | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "activities" */
  ['activities_select_column']: activities_select_column;
  /** select "activities_aggregate_bool_exp_bool_and_arguments_columns" columns of table "activities" */
  ['activities_select_column_activities_aggregate_bool_exp_bool_and_arguments_columns']: activities_select_column_activities_aggregate_bool_exp_bool_and_arguments_columns;
  /** select "activities_aggregate_bool_exp_bool_or_arguments_columns" columns of table "activities" */
  ['activities_select_column_activities_aggregate_bool_exp_bool_or_arguments_columns']: activities_select_column_activities_aggregate_bool_exp_bool_or_arguments_columns;
  /** aggregate stddev on columns */
  ['activities_stddev_fields']: AliasType<{
    actor_profile_id?: boolean | `@${string}`;
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev() on columns of table "activities" */
  ['activities_stddev_order_by']: {
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_pop on columns */
  ['activities_stddev_pop_fields']: AliasType<{
    actor_profile_id?: boolean | `@${string}`;
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_pop() on columns of table "activities" */
  ['activities_stddev_pop_order_by']: {
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_samp on columns */
  ['activities_stddev_samp_fields']: AliasType<{
    actor_profile_id?: boolean | `@${string}`;
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_samp() on columns of table "activities" */
  ['activities_stddev_samp_order_by']: {
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Streaming cursor of the table "activities" */
  ['activities_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['activities_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['activities_stream_cursor_value_input']: {
    action?: string | undefined | null;
    actor_profile_id?: ValueTypes['bigint'] | undefined | null;
    big_question_id?: ValueTypes['bigint'] | undefined | null;
    cast_id?: ValueTypes['bigint'] | undefined | null;
    circle_id?: ValueTypes['bigint'] | undefined | null;
    contribution_id?: ValueTypes['bigint'] | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    epoch_id?: ValueTypes['bigint'] | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    organization_id?: ValueTypes['bigint'] | undefined | null;
    private_stream?: boolean | undefined | null;
    reaction_count?: number | undefined | null;
    reply_count?: number | undefined | null;
    target_profile_id?: ValueTypes['bigint'] | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
    user_id?: ValueTypes['bigint'] | undefined | null;
  };
  /** aggregate sum on columns */
  ['activities_sum_fields']: AliasType<{
    actor_profile_id?: boolean | `@${string}`;
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by sum() on columns of table "activities" */
  ['activities_sum_order_by']: {
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_pop on columns */
  ['activities_var_pop_fields']: AliasType<{
    actor_profile_id?: boolean | `@${string}`;
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_pop() on columns of table "activities" */
  ['activities_var_pop_order_by']: {
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_samp on columns */
  ['activities_var_samp_fields']: AliasType<{
    actor_profile_id?: boolean | `@${string}`;
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_samp() on columns of table "activities" */
  ['activities_var_samp_order_by']: {
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate variance on columns */
  ['activities_variance_fields']: AliasType<{
    actor_profile_id?: boolean | `@${string}`;
    big_question_id?: boolean | `@${string}`;
    cast_id?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    contribution_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    organization_id?: boolean | `@${string}`;
    reaction_count?: boolean | `@${string}`;
    reply_count?: boolean | `@${string}`;
    target_profile_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by variance() on columns of table "activities" */
  ['activities_variance_order_by']: {
    actor_profile_id?: ValueTypes['order_by'] | undefined | null;
    big_question_id?: ValueTypes['order_by'] | undefined | null;
    cast_id?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    contribution_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    organization_id?: ValueTypes['order_by'] | undefined | null;
    reaction_count?: ValueTypes['order_by'] | undefined | null;
    reply_count?: ValueTypes['order_by'] | undefined | null;
    target_profile_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "big_questions" */
  ['big_questions']: AliasType<{
    activities?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['activities_select_column']>
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
          | Array<ValueTypes['activities_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['activities_bool_exp'] | undefined | null;
      },
      ValueTypes['activities'],
    ];
    activities_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['activities_select_column']>
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
          | Array<ValueTypes['activities_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['activities_bool_exp'] | undefined | null;
      },
      ValueTypes['activities_aggregate'],
    ];
    cover_image_url?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    css_background_position?: boolean | `@${string}`;
    description?: boolean | `@${string}`;
    expire_at?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    prompt?: boolean | `@${string}`;
    publish_at?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "big_questions". All fields are combined with a logical 'AND'. */
  ['big_questions_bool_exp']: {
    _and?: Array<ValueTypes['big_questions_bool_exp']> | undefined | null;
    _not?: ValueTypes['big_questions_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['big_questions_bool_exp']> | undefined | null;
    activities?: ValueTypes['activities_bool_exp'] | undefined | null;
    activities_aggregate?:
      | ValueTypes['activities_aggregate_bool_exp']
      | undefined
      | null;
    cover_image_url?: ValueTypes['String_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    css_background_position?:
      | ValueTypes['String_comparison_exp']
      | undefined
      | null;
    description?: ValueTypes['String_comparison_exp'] | undefined | null;
    expire_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    prompt?: ValueTypes['String_comparison_exp'] | undefined | null;
    publish_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "big_questions". */
  ['big_questions_order_by']: {
    activities_aggregate?:
      | ValueTypes['activities_aggregate_order_by']
      | undefined
      | null;
    cover_image_url?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    css_background_position?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
    expire_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    prompt?: ValueTypes['order_by'] | undefined | null;
    publish_at?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "big_questions" */
  ['big_questions_select_column']: big_questions_select_column;
  /** Streaming cursor of the table "big_questions" */
  ['big_questions_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['big_questions_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['big_questions_stream_cursor_value_input']: {
    cover_image_url?: string | undefined | null;
    created_at?: ValueTypes['timestamp'] | undefined | null;
    css_background_position?: string | undefined | null;
    description?: string | undefined | null;
    expire_at?: ValueTypes['timestamp'] | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    prompt?: string | undefined | null;
    publish_at?: ValueTypes['timestamp'] | undefined | null;
    updated_at?: ValueTypes['timestamp'] | undefined | null;
  };
  ['bigint']: number;
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_array_comparison_exp']: {
    /** is the array contained in the given array value */
    _contained_in?: Array<ValueTypes['bigint']> | undefined | null;
    /** does the array contain the given value */
    _contains?: Array<ValueTypes['bigint']> | undefined | null;
    _eq?: Array<ValueTypes['bigint']> | undefined | null;
    _gt?: Array<ValueTypes['bigint']> | undefined | null;
    _gte?: Array<ValueTypes['bigint']> | undefined | null;
    _in?: Array<Array<ValueTypes['bigint']> | undefined | null>;
    _is_null?: boolean | undefined | null;
    _lt?: Array<ValueTypes['bigint']> | undefined | null;
    _lte?: Array<ValueTypes['bigint']> | undefined | null;
    _neq?: Array<ValueTypes['bigint']> | undefined | null;
    _nin?: Array<Array<ValueTypes['bigint']> | undefined | null>;
  };
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
  ['bytea']: unknown;
  /** Boolean expression to compare columns of type "bytea". All fields are combined with logical 'AND'. */
  ['bytea_comparison_exp']: {
    _eq?: ValueTypes['bytea'] | undefined | null;
    _gt?: ValueTypes['bytea'] | undefined | null;
    _gte?: ValueTypes['bytea'] | undefined | null;
    _in?: Array<ValueTypes['bytea']> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: ValueTypes['bytea'] | undefined | null;
    _lte?: ValueTypes['bytea'] | undefined | null;
    _neq?: ValueTypes['bytea'] | undefined | null;
    _nin?: Array<ValueTypes['bytea']> | undefined | null;
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
    attestation_uid?: boolean | `@${string}`;
    cast_hash?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    /** An object relationship */
    give_skill?: ValueTypes['skills'];
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
    attestation_uid?: ValueTypes['String_comparison_exp'] | undefined | null;
    cast_hash?: ValueTypes['String_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    give_skill?: ValueTypes['skills_bool_exp'] | undefined | null;
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
    attestation_uid?: boolean | `@${string}`;
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
    attestation_uid?: ValueTypes['order_by'] | undefined | null;
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
    attestation_uid?: boolean | `@${string}`;
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
    attestation_uid?: ValueTypes['order_by'] | undefined | null;
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
    attestation_uid?: ValueTypes['order_by'] | undefined | null;
    cast_hash?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    give_skill?: ValueTypes['skills_order_by'] | undefined | null;
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
    /** An object relationship */
    skill_info?: ValueTypes['skills'];
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
    skill_info?: ValueTypes['skills_bool_exp'] | undefined | null;
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
    skill_info?: ValueTypes['skills_order_by'] | undefined | null;
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
    attestation_uid?: string | undefined | null;
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
  /** local db copy of last synced on-chain cosoul data */
  ['cosouls']: AliasType<{
    address?: boolean | `@${string}`;
    checked_at?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    created_tx_hash?: boolean | `@${string}`;
    held_links?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders'],
    ];
    held_links_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders_aggregate'],
    ];
    id?: boolean | `@${string}`;
    link_holders?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders'],
    ];
    link_holders_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders_aggregate'],
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
      ValueTypes['poap_holders'],
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
      ValueTypes['poap_holders_aggregate'],
    ];
    /** An object relationship */
    profile_public?: ValueTypes['profiles_public'];
    synced_at?: boolean | `@${string}`;
    token_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "cosouls". All fields are combined with a logical 'AND'. */
  ['cosouls_bool_exp']: {
    _and?: Array<ValueTypes['cosouls_bool_exp']> | undefined | null;
    _not?: ValueTypes['cosouls_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['cosouls_bool_exp']> | undefined | null;
    address?: ValueTypes['citext_comparison_exp'] | undefined | null;
    checked_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    created_tx_hash?: ValueTypes['String_comparison_exp'] | undefined | null;
    held_links?: ValueTypes['link_holders_bool_exp'] | undefined | null;
    held_links_aggregate?:
      | ValueTypes['link_holders_aggregate_bool_exp']
      | undefined
      | null;
    id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    link_holders?: ValueTypes['link_holders_bool_exp'] | undefined | null;
    link_holders_aggregate?:
      | ValueTypes['link_holders_aggregate_bool_exp']
      | undefined
      | null;
    pgive?: ValueTypes['Int_comparison_exp'] | undefined | null;
    poaps?: ValueTypes['poap_holders_bool_exp'] | undefined | null;
    poaps_aggregate?:
      | ValueTypes['poap_holders_aggregate_bool_exp']
      | undefined
      | null;
    profile_public?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    synced_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    token_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "cosouls". */
  ['cosouls_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    checked_at?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_tx_hash?: ValueTypes['order_by'] | undefined | null;
    held_links_aggregate?:
      | ValueTypes['link_holders_aggregate_order_by']
      | undefined
      | null;
    id?: ValueTypes['order_by'] | undefined | null;
    link_holders_aggregate?:
      | ValueTypes['link_holders_aggregate_order_by']
      | undefined
      | null;
    pgive?: ValueTypes['order_by'] | undefined | null;
    poaps_aggregate?:
      | ValueTypes['poap_holders_aggregate_order_by']
      | undefined
      | null;
    profile_public?: ValueTypes['profiles_public_order_by'] | undefined | null;
    synced_at?: ValueTypes['order_by'] | undefined | null;
    token_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
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
    checked_at?: ValueTypes['timestamptz'] | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    created_tx_hash?: string | undefined | null;
    id?: number | undefined | null;
    pgive?: number | undefined | null;
    synced_at?: ValueTypes['timestamptz'] | undefined | null;
    token_id?: number | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
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
  /** farcaster casts that we actually care about, with some materialized fields */
  ['enriched_casts']: AliasType<{
    created_at?: boolean | `@${string}`;
    deleted_at?: boolean | `@${string}`;
    embeds?: [
      {
        /** JSON select path */ path?: string | undefined | null;
      },
      boolean | `@${string}`,
    ];
    fid?: boolean | `@${string}`;
    hash?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    mentions?: boolean | `@${string}`;
    mentions_positions?: boolean | `@${string}`;
    parent_fid?: boolean | `@${string}`;
    parent_hash?: boolean | `@${string}`;
    parent_url?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    /** An object relationship */
    profile_public?: ValueTypes['profiles_public'];
    root_parent_hash?: boolean | `@${string}`;
    root_parent_url?: boolean | `@${string}`;
    text?: boolean | `@${string}`;
    timestamp?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "enriched_casts". All fields are combined with a logical 'AND'. */
  ['enriched_casts_bool_exp']: {
    _and?: Array<ValueTypes['enriched_casts_bool_exp']> | undefined | null;
    _not?: ValueTypes['enriched_casts_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['enriched_casts_bool_exp']> | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    deleted_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    embeds?: ValueTypes['jsonb_comparison_exp'] | undefined | null;
    fid?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    hash?: ValueTypes['bytea_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    mentions?: ValueTypes['bigint_array_comparison_exp'] | undefined | null;
    mentions_positions?:
      | ValueTypes['smallint_array_comparison_exp']
      | undefined
      | null;
    parent_fid?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    parent_hash?: ValueTypes['bytea_comparison_exp'] | undefined | null;
    parent_url?: ValueTypes['String_comparison_exp'] | undefined | null;
    profile_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    profile_public?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    root_parent_hash?: ValueTypes['bytea_comparison_exp'] | undefined | null;
    root_parent_url?: ValueTypes['String_comparison_exp'] | undefined | null;
    text?: ValueTypes['String_comparison_exp'] | undefined | null;
    timestamp?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "enriched_casts". */
  ['enriched_casts_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    deleted_at?: ValueTypes['order_by'] | undefined | null;
    embeds?: ValueTypes['order_by'] | undefined | null;
    fid?: ValueTypes['order_by'] | undefined | null;
    hash?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    mentions?: ValueTypes['order_by'] | undefined | null;
    mentions_positions?: ValueTypes['order_by'] | undefined | null;
    parent_fid?: ValueTypes['order_by'] | undefined | null;
    parent_hash?: ValueTypes['order_by'] | undefined | null;
    parent_url?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    profile_public?: ValueTypes['profiles_public_order_by'] | undefined | null;
    root_parent_hash?: ValueTypes['order_by'] | undefined | null;
    root_parent_url?: ValueTypes['order_by'] | undefined | null;
    text?: ValueTypes['order_by'] | undefined | null;
    timestamp?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "enriched_casts" */
  ['enriched_casts_select_column']: enriched_casts_select_column;
  /** Streaming cursor of the table "enriched_casts" */
  ['enriched_casts_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['enriched_casts_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['enriched_casts_stream_cursor_value_input']: {
    created_at?: ValueTypes['timestamp'] | undefined | null;
    deleted_at?: ValueTypes['timestamp'] | undefined | null;
    embeds?: ValueTypes['jsonb'] | undefined | null;
    fid?: ValueTypes['bigint'] | undefined | null;
    hash?: ValueTypes['bytea'] | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    mentions?: Array<ValueTypes['bigint']> | undefined | null;
    mentions_positions?: Array<ValueTypes['smallint']> | undefined | null;
    parent_fid?: ValueTypes['bigint'] | undefined | null;
    parent_hash?: ValueTypes['bytea'] | undefined | null;
    parent_url?: string | undefined | null;
    profile_id?: ValueTypes['bigint'] | undefined | null;
    root_parent_hash?: ValueTypes['bytea'] | undefined | null;
    root_parent_url?: string | undefined | null;
    text?: string | undefined | null;
    timestamp?: ValueTypes['timestamp'] | undefined | null;
    updated_at?: ValueTypes['timestamp'] | undefined | null;
  };
  /** columns and relationships of "farcaster_accounts" */
  ['farcaster_accounts']: AliasType<{
    bio_text?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    custody_address?: boolean | `@${string}`;
    fid?: boolean | `@${string}`;
    followers_count?: boolean | `@${string}`;
    following_count?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    pfp_url?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    username?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "farcaster_accounts". All fields are combined with a logical 'AND'. */
  ['farcaster_accounts_bool_exp']: {
    _and?: Array<ValueTypes['farcaster_accounts_bool_exp']> | undefined | null;
    _not?: ValueTypes['farcaster_accounts_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['farcaster_accounts_bool_exp']> | undefined | null;
    bio_text?: ValueTypes['String_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    custody_address?: ValueTypes['String_comparison_exp'] | undefined | null;
    fid?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    followers_count?: ValueTypes['Int_comparison_exp'] | undefined | null;
    following_count?: ValueTypes['Int_comparison_exp'] | undefined | null;
    name?: ValueTypes['String_comparison_exp'] | undefined | null;
    pfp_url?: ValueTypes['String_comparison_exp'] | undefined | null;
    profile_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    username?: ValueTypes['String_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "farcaster_accounts". */
  ['farcaster_accounts_order_by']: {
    bio_text?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    custody_address?: ValueTypes['order_by'] | undefined | null;
    fid?: ValueTypes['order_by'] | undefined | null;
    followers_count?: ValueTypes['order_by'] | undefined | null;
    following_count?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    pfp_url?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    username?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "farcaster_accounts" */
  ['farcaster_accounts_select_column']: farcaster_accounts_select_column;
  /** Streaming cursor of the table "farcaster_accounts" */
  ['farcaster_accounts_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['farcaster_accounts_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['farcaster_accounts_stream_cursor_value_input']: {
    bio_text?: string | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    custody_address?: string | undefined | null;
    fid?: ValueTypes['bigint'] | undefined | null;
    followers_count?: number | undefined | null;
    following_count?: number | undefined | null;
    name?: string | undefined | null;
    pfp_url?: string | undefined | null;
    profile_id?: ValueTypes['bigint'] | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
    username?: string | undefined | null;
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
  /** columns and relationships of "github_accounts" */
  ['github_accounts']: AliasType<{
    profile_id?: boolean | `@${string}`;
    username?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "github_accounts". All fields are combined with a logical 'AND'. */
  ['github_accounts_bool_exp']: {
    _and?: Array<ValueTypes['github_accounts_bool_exp']> | undefined | null;
    _not?: ValueTypes['github_accounts_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['github_accounts_bool_exp']> | undefined | null;
    profile_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    username?: ValueTypes['String_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "github_accounts". */
  ['github_accounts_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
    username?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "github_accounts" */
  ['github_accounts_select_column']: github_accounts_select_column;
  /** Streaming cursor of the table "github_accounts" */
  ['github_accounts_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['github_accounts_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['github_accounts_stream_cursor_value_input']: {
    profile_id?: ValueTypes['bigint'] | undefined | null;
    username?: string | undefined | null;
  };
  ['jsonb']: unknown;
  ['jsonb_cast_exp']: {
    String?: ValueTypes['String_comparison_exp'] | undefined | null;
  };
  /** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
  ['jsonb_comparison_exp']: {
    _cast?: ValueTypes['jsonb_cast_exp'] | undefined | null;
    /** is the column contained in the given json value */
    _contained_in?: ValueTypes['jsonb'] | undefined | null;
    /** does the column contain the given json value at the top level */
    _contains?: ValueTypes['jsonb'] | undefined | null;
    _eq?: ValueTypes['jsonb'] | undefined | null;
    _gt?: ValueTypes['jsonb'] | undefined | null;
    _gte?: ValueTypes['jsonb'] | undefined | null;
    /** does the string exist as a top-level key in the column */
    _has_key?: string | undefined | null;
    /** do all of these strings exist as top-level keys in the column */
    _has_keys_all?: Array<string> | undefined | null;
    /** do any of these strings exist as top-level keys in the column */
    _has_keys_any?: Array<string> | undefined | null;
    _in?: Array<ValueTypes['jsonb']> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: ValueTypes['jsonb'] | undefined | null;
    _lte?: ValueTypes['jsonb'] | undefined | null;
    _neq?: ValueTypes['jsonb'] | undefined | null;
    _nin?: Array<ValueTypes['jsonb']> | undefined | null;
  };
  /** tracks the amount of keys an address holds in a given subject. updated with data from the key_tx table */
  ['link_holders']: AliasType<{
    amount?: boolean | `@${string}`;
    holder?: boolean | `@${string}`;
    /** An object relationship */
    holder_cosoul?: ValueTypes['cosouls'];
    /** An object relationship */
    holder_profile_public?: ValueTypes['profiles_public'];
    target?: boolean | `@${string}`;
    /** An object relationship */
    target_cosoul?: ValueTypes['cosouls'];
    /** An object relationship */
    target_profile_public?: ValueTypes['profiles_public'];
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregated selection of "link_holders" */
  ['link_holders_aggregate']: AliasType<{
    aggregate?: ValueTypes['link_holders_aggregate_fields'];
    nodes?: ValueTypes['link_holders'];
    __typename?: boolean | `@${string}`;
  }>;
  ['link_holders_aggregate_bool_exp']: {
    count?:
      | ValueTypes['link_holders_aggregate_bool_exp_count']
      | undefined
      | null;
  };
  ['link_holders_aggregate_bool_exp_count']: {
    arguments?:
      | Array<ValueTypes['link_holders_select_column']>
      | undefined
      | null;
    distinct?: boolean | undefined | null;
    filter?: ValueTypes['link_holders_bool_exp'] | undefined | null;
    predicate: ValueTypes['Int_comparison_exp'];
  };
  /** aggregate fields of "link_holders" */
  ['link_holders_aggregate_fields']: AliasType<{
    avg?: ValueTypes['link_holders_avg_fields'];
    count?: [
      {
        columns?:
          | Array<ValueTypes['link_holders_select_column']>
          | undefined
          | null;
        distinct?: boolean | undefined | null;
      },
      boolean | `@${string}`,
    ];
    max?: ValueTypes['link_holders_max_fields'];
    min?: ValueTypes['link_holders_min_fields'];
    stddev?: ValueTypes['link_holders_stddev_fields'];
    stddev_pop?: ValueTypes['link_holders_stddev_pop_fields'];
    stddev_samp?: ValueTypes['link_holders_stddev_samp_fields'];
    sum?: ValueTypes['link_holders_sum_fields'];
    var_pop?: ValueTypes['link_holders_var_pop_fields'];
    var_samp?: ValueTypes['link_holders_var_samp_fields'];
    variance?: ValueTypes['link_holders_variance_fields'];
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "link_holders" */
  ['link_holders_aggregate_order_by']: {
    avg?: ValueTypes['link_holders_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['link_holders_max_order_by'] | undefined | null;
    min?: ValueTypes['link_holders_min_order_by'] | undefined | null;
    stddev?: ValueTypes['link_holders_stddev_order_by'] | undefined | null;
    stddev_pop?:
      | ValueTypes['link_holders_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['link_holders_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['link_holders_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['link_holders_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['link_holders_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['link_holders_variance_order_by'] | undefined | null;
  };
  /** aggregate avg on columns */
  ['link_holders_avg_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by avg() on columns of table "link_holders" */
  ['link_holders_avg_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "link_holders". All fields are combined with a logical 'AND'. */
  ['link_holders_bool_exp']: {
    _and?: Array<ValueTypes['link_holders_bool_exp']> | undefined | null;
    _not?: ValueTypes['link_holders_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['link_holders_bool_exp']> | undefined | null;
    amount?: ValueTypes['Int_comparison_exp'] | undefined | null;
    holder?: ValueTypes['citext_comparison_exp'] | undefined | null;
    holder_cosoul?: ValueTypes['cosouls_bool_exp'] | undefined | null;
    holder_profile_public?:
      | ValueTypes['profiles_public_bool_exp']
      | undefined
      | null;
    target?: ValueTypes['citext_comparison_exp'] | undefined | null;
    target_cosoul?: ValueTypes['cosouls_bool_exp'] | undefined | null;
    target_profile_public?:
      | ValueTypes['profiles_public_bool_exp']
      | undefined
      | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
  };
  /** aggregate max on columns */
  ['link_holders_max_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    holder?: boolean | `@${string}`;
    target?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by max() on columns of table "link_holders" */
  ['link_holders_max_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    holder?: ValueTypes['order_by'] | undefined | null;
    target?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate min on columns */
  ['link_holders_min_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    holder?: boolean | `@${string}`;
    target?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by min() on columns of table "link_holders" */
  ['link_holders_min_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    holder?: ValueTypes['order_by'] | undefined | null;
    target?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "link_holders". */
  ['link_holders_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    holder?: ValueTypes['order_by'] | undefined | null;
    holder_cosoul?: ValueTypes['cosouls_order_by'] | undefined | null;
    holder_profile_public?:
      | ValueTypes['profiles_public_order_by']
      | undefined
      | null;
    target?: ValueTypes['order_by'] | undefined | null;
    target_cosoul?: ValueTypes['cosouls_order_by'] | undefined | null;
    target_profile_public?:
      | ValueTypes['profiles_public_order_by']
      | undefined
      | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "link_holders" */
  ['link_holders_select_column']: link_holders_select_column;
  /** aggregate stddev on columns */
  ['link_holders_stddev_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev() on columns of table "link_holders" */
  ['link_holders_stddev_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_pop on columns */
  ['link_holders_stddev_pop_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_pop() on columns of table "link_holders" */
  ['link_holders_stddev_pop_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_samp on columns */
  ['link_holders_stddev_samp_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_samp() on columns of table "link_holders" */
  ['link_holders_stddev_samp_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** Streaming cursor of the table "link_holders" */
  ['link_holders_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['link_holders_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['link_holders_stream_cursor_value_input']: {
    amount?: number | undefined | null;
    holder?: ValueTypes['citext'] | undefined | null;
    target?: ValueTypes['citext'] | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
  };
  /** aggregate sum on columns */
  ['link_holders_sum_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by sum() on columns of table "link_holders" */
  ['link_holders_sum_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_pop on columns */
  ['link_holders_var_pop_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_pop() on columns of table "link_holders" */
  ['link_holders_var_pop_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_samp on columns */
  ['link_holders_var_samp_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_samp() on columns of table "link_holders" */
  ['link_holders_var_samp_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate variance on columns */
  ['link_holders_variance_fields']: AliasType<{
    amount?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by variance() on columns of table "link_holders" */
  ['link_holders_variance_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "link_tx" */
  ['link_tx']: AliasType<{
    buy?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    eth_amount?: boolean | `@${string}`;
    holder?: boolean | `@${string}`;
    /** An object relationship */
    holder_profile?: ValueTypes['profiles_public'];
    link_amount?: boolean | `@${string}`;
    protocol_fee_amount?: boolean | `@${string}`;
    supply?: boolean | `@${string}`;
    target?: boolean | `@${string}`;
    target_fee_amount?: boolean | `@${string}`;
    /** An object relationship */
    target_profile?: ValueTypes['profiles_public'];
    tx_hash?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "link_tx". All fields are combined with a logical 'AND'. */
  ['link_tx_bool_exp']: {
    _and?: Array<ValueTypes['link_tx_bool_exp']> | undefined | null;
    _not?: ValueTypes['link_tx_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['link_tx_bool_exp']> | undefined | null;
    buy?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    eth_amount?: ValueTypes['String_comparison_exp'] | undefined | null;
    holder?: ValueTypes['citext_comparison_exp'] | undefined | null;
    holder_profile?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    link_amount?: ValueTypes['String_comparison_exp'] | undefined | null;
    protocol_fee_amount?:
      | ValueTypes['String_comparison_exp']
      | undefined
      | null;
    supply?: ValueTypes['numeric_comparison_exp'] | undefined | null;
    target?: ValueTypes['citext_comparison_exp'] | undefined | null;
    target_fee_amount?: ValueTypes['String_comparison_exp'] | undefined | null;
    target_profile?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    tx_hash?: ValueTypes['citext_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "link_tx". */
  ['link_tx_order_by']: {
    buy?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    eth_amount?: ValueTypes['order_by'] | undefined | null;
    holder?: ValueTypes['order_by'] | undefined | null;
    holder_profile?: ValueTypes['profiles_public_order_by'] | undefined | null;
    link_amount?: ValueTypes['order_by'] | undefined | null;
    protocol_fee_amount?: ValueTypes['order_by'] | undefined | null;
    supply?: ValueTypes['order_by'] | undefined | null;
    target?: ValueTypes['order_by'] | undefined | null;
    target_fee_amount?: ValueTypes['order_by'] | undefined | null;
    target_profile?: ValueTypes['profiles_public_order_by'] | undefined | null;
    tx_hash?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "link_tx" */
  ['link_tx_select_column']: link_tx_select_column;
  /** Streaming cursor of the table "link_tx" */
  ['link_tx_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['link_tx_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['link_tx_stream_cursor_value_input']: {
    buy?: boolean | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    eth_amount?: string | undefined | null;
    holder?: ValueTypes['citext'] | undefined | null;
    link_amount?: string | undefined | null;
    protocol_fee_amount?: string | undefined | null;
    supply?: ValueTypes['numeric'] | undefined | null;
    target?: ValueTypes['citext'] | undefined | null;
    target_fee_amount?: string | undefined | null;
    tx_hash?: ValueTypes['citext'] | undefined | null;
  };
  ['numeric']: unknown;
  /** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
  ['numeric_comparison_exp']: {
    _eq?: ValueTypes['numeric'] | undefined | null;
    _gt?: ValueTypes['numeric'] | undefined | null;
    _gte?: ValueTypes['numeric'] | undefined | null;
    _in?: Array<ValueTypes['numeric']> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: ValueTypes['numeric'] | undefined | null;
    _lte?: ValueTypes['numeric'] | undefined | null;
    _neq?: ValueTypes['numeric'] | undefined | null;
    _nin?: Array<ValueTypes['numeric']> | undefined | null;
  };
  /** column ordering options */
  ['order_by']: order_by;
  /** Poap event info */
  ['poap_events']: AliasType<{
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
  /** Boolean expression to filter rows from the table "poap_events". All fields are combined with a logical 'AND'. */
  ['poap_events_bool_exp']: {
    _and?: Array<ValueTypes['poap_events_bool_exp']> | undefined | null;
    _not?: ValueTypes['poap_events_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['poap_events_bool_exp']> | undefined | null;
    city?: ValueTypes['String_comparison_exp'] | undefined | null;
    country?: ValueTypes['String_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    description?: ValueTypes['String_comparison_exp'] | undefined | null;
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
  /** Ordering options when selecting data from "poap_events". */
  ['poap_events_order_by']: {
    city?: ValueTypes['order_by'] | undefined | null;
    country?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
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
      boolean | `@${string}`,
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
  /** columns and relationships of "profile_skills" */
  ['profile_skills']: AliasType<{
    profile_id?: boolean | `@${string}`;
    /** An object relationship */
    profile_public?: ValueTypes['profiles_public'];
    /** An object relationship */
    skill?: ValueTypes['skills'];
    skill_name?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "profile_skills" */
  ['profile_skills_aggregate_order_by']: {
    avg?: ValueTypes['profile_skills_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['profile_skills_max_order_by'] | undefined | null;
    min?: ValueTypes['profile_skills_min_order_by'] | undefined | null;
    stddev?: ValueTypes['profile_skills_stddev_order_by'] | undefined | null;
    stddev_pop?:
      | ValueTypes['profile_skills_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['profile_skills_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['profile_skills_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['profile_skills_var_pop_order_by'] | undefined | null;
    var_samp?:
      | ValueTypes['profile_skills_var_samp_order_by']
      | undefined
      | null;
    variance?:
      | ValueTypes['profile_skills_variance_order_by']
      | undefined
      | null;
  };
  /** order by avg() on columns of table "profile_skills" */
  ['profile_skills_avg_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "profile_skills". All fields are combined with a logical 'AND'. */
  ['profile_skills_bool_exp']: {
    _and?: Array<ValueTypes['profile_skills_bool_exp']> | undefined | null;
    _not?: ValueTypes['profile_skills_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['profile_skills_bool_exp']> | undefined | null;
    profile_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    profile_public?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    skill?: ValueTypes['skills_bool_exp'] | undefined | null;
    skill_name?: ValueTypes['citext_comparison_exp'] | undefined | null;
  };
  /** order by max() on columns of table "profile_skills" */
  ['profile_skills_max_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
    skill_name?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "profile_skills" */
  ['profile_skills_min_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
    skill_name?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "profile_skills". */
  ['profile_skills_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
    profile_public?: ValueTypes['profiles_public_order_by'] | undefined | null;
    skill?: ValueTypes['skills_order_by'] | undefined | null;
    skill_name?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "profile_skills" */
  ['profile_skills_select_column']: profile_skills_select_column;
  /** order by stddev() on columns of table "profile_skills" */
  ['profile_skills_stddev_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "profile_skills" */
  ['profile_skills_stddev_pop_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "profile_skills" */
  ['profile_skills_stddev_samp_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Streaming cursor of the table "profile_skills" */
  ['profile_skills_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['profile_skills_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['profile_skills_stream_cursor_value_input']: {
    profile_id?: number | undefined | null;
    skill_name?: ValueTypes['citext'] | undefined | null;
  };
  /** order by sum() on columns of table "profile_skills" */
  ['profile_skills_sum_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "profile_skills" */
  ['profile_skills_var_pop_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "profile_skills" */
  ['profile_skills_var_samp_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "profile_skills" */
  ['profile_skills_variance_order_by']: {
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
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
    /** An object relationship */
    cosoul?: ValueTypes['cosouls'];
    created_at?: boolean | `@${string}`;
    description?: boolean | `@${string}`;
    /** An object relationship */
    farcaster_account?: ValueTypes['farcaster_accounts'];
    id?: boolean | `@${string}`;
    joined_colinks_at?: boolean | `@${string}`;
    link_holder?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders'],
    ];
    link_holder_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders_aggregate'],
    ];
    link_target?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders'],
    ];
    link_target_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders_aggregate'],
    ];
    links?: boolean | `@${string}`;
    links_held?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    post_count?: boolean | `@${string}`;
    post_count_last_30_days?: boolean | `@${string}`;
    profile_skills?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['profile_skills_select_column']>
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
          | Array<ValueTypes['profile_skills_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['profile_skills_bool_exp'] | undefined | null;
      },
      ValueTypes['profile_skills'],
    ];
    /** An object relationship */
    reputation_score?: ValueTypes['reputation_scores'];
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
    cosoul?: ValueTypes['cosouls_bool_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    description?: ValueTypes['String_comparison_exp'] | undefined | null;
    farcaster_account?:
      | ValueTypes['farcaster_accounts_bool_exp']
      | undefined
      | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    joined_colinks_at?:
      | ValueTypes['timestamptz_comparison_exp']
      | undefined
      | null;
    link_holder?: ValueTypes['link_holders_bool_exp'] | undefined | null;
    link_holder_aggregate?:
      | ValueTypes['link_holders_aggregate_bool_exp']
      | undefined
      | null;
    link_target?: ValueTypes['link_holders_bool_exp'] | undefined | null;
    link_target_aggregate?:
      | ValueTypes['link_holders_aggregate_bool_exp']
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
    profile_skills?: ValueTypes['profile_skills_bool_exp'] | undefined | null;
    reputation_score?:
      | ValueTypes['reputation_scores_bool_exp']
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
    cosoul?: ValueTypes['cosouls_order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
    farcaster_account?:
      | ValueTypes['farcaster_accounts_order_by']
      | undefined
      | null;
    id?: ValueTypes['order_by'] | undefined | null;
    joined_colinks_at?: ValueTypes['order_by'] | undefined | null;
    link_holder_aggregate?:
      | ValueTypes['link_holders_aggregate_order_by']
      | undefined
      | null;
    link_target_aggregate?:
      | ValueTypes['link_holders_aggregate_order_by']
      | undefined
      | null;
    links?: ValueTypes['order_by'] | undefined | null;
    links_held?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    post_count?: ValueTypes['order_by'] | undefined | null;
    post_count_last_30_days?: ValueTypes['order_by'] | undefined | null;
    profile_skills_aggregate?:
      | ValueTypes['profile_skills_aggregate_order_by']
      | undefined
      | null;
    reputation_score?:
      | ValueTypes['reputation_scores_order_by']
      | undefined
      | null;
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
    activities?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['activities_select_column']>
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
          | Array<ValueTypes['activities_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['activities_bool_exp'] | undefined | null;
      },
      ValueTypes['activities'],
    ];
    activities_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['activities_select_column']>
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
          | Array<ValueTypes['activities_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['activities_bool_exp'] | undefined | null;
      },
      ValueTypes['activities_aggregate'],
    ];
    activities_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['activities']];
    big_questions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['big_questions_select_column']>
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
          | Array<ValueTypes['big_questions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['big_questions_bool_exp'] | undefined | null;
      },
      ValueTypes['big_questions'],
    ];
    big_questions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['big_questions'],
    ];
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
      ValueTypes['cosouls'],
    ];
    cosouls_by_pk?: [{ id: number }, ValueTypes['cosouls']];
    enriched_casts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['enriched_casts_select_column']>
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
          | Array<ValueTypes['enriched_casts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['enriched_casts_bool_exp'] | undefined | null;
      },
      ValueTypes['enriched_casts'],
    ];
    enriched_casts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['enriched_casts'],
    ];
    farcaster_accounts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['farcaster_accounts_select_column']>
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
          | Array<ValueTypes['farcaster_accounts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['farcaster_accounts_bool_exp'] | undefined | null;
      },
      ValueTypes['farcaster_accounts'],
    ];
    farcaster_accounts_by_pk?: [
      { profile_id: ValueTypes['bigint'] },
      ValueTypes['farcaster_accounts'],
    ];
    getCasts?: [
      { payload: ValueTypes['GetCastsInput'] },
      ValueTypes['GetCastsOutput'],
    ];
    github_accounts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['github_accounts_select_column']>
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
          | Array<ValueTypes['github_accounts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['github_accounts_bool_exp'] | undefined | null;
      },
      ValueTypes['github_accounts'],
    ];
    github_accounts_by_pk?: [
      { profile_id: ValueTypes['bigint'] },
      ValueTypes['github_accounts'],
    ];
    link_holders?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders'],
    ];
    link_holders_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders_aggregate'],
    ];
    link_holders_by_pk?: [
      { holder: ValueTypes['citext']; target: ValueTypes['citext'] },
      ValueTypes['link_holders'],
    ];
    link_tx?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_tx_select_column']>
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
          | Array<ValueTypes['link_tx_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_tx_bool_exp'] | undefined | null;
      },
      ValueTypes['link_tx'],
    ];
    link_tx_by_pk?: [{ tx_hash: ValueTypes['citext'] }, ValueTypes['link_tx']];
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
      ValueTypes['poap_events'],
    ];
    poap_events_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['poap_events'],
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
      ValueTypes['poap_holders'],
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
      ValueTypes['poap_holders_aggregate'],
    ];
    poap_holders_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['poap_holders'],
    ];
    profile_skills?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['profile_skills_select_column']>
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
          | Array<ValueTypes['profile_skills_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['profile_skills_bool_exp'] | undefined | null;
      },
      ValueTypes['profile_skills'],
    ];
    profile_skills_by_pk?: [
      { profile_id: number; skill_name: ValueTypes['citext'] },
      ValueTypes['profile_skills'],
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
    reactions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['reactions_select_column']>
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
          | Array<ValueTypes['reactions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['reactions_bool_exp'] | undefined | null;
      },
      ValueTypes['reactions'],
    ];
    reactions_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['reactions']];
    replies?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['replies_select_column']>
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
          | Array<ValueTypes['replies_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['replies_bool_exp'] | undefined | null;
      },
      ValueTypes['replies'],
    ];
    replies_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['replies']];
    replies_reactions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['replies_reactions_select_column']>
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
          | Array<ValueTypes['replies_reactions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['replies_reactions_bool_exp'] | undefined | null;
      },
      ValueTypes['replies_reactions'],
    ];
    replies_reactions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['replies_reactions'],
    ];
    reputation_scores?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['reputation_scores_select_column']>
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
          | Array<ValueTypes['reputation_scores_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['reputation_scores_bool_exp'] | undefined | null;
      },
      ValueTypes['reputation_scores'],
    ];
    reputation_scores_by_pk?: [
      { profile_id: ValueTypes['bigint'] },
      ValueTypes['reputation_scores'],
    ];
    search_replies?: [
      {
        /** input parameters for function "search_replies" */
        args: ValueTypes['search_replies_args'] /** distinct select on columns */;
        distinct_on?:
          | Array<ValueTypes['replies_select_column']>
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
          | Array<ValueTypes['replies_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['replies_bool_exp'] | undefined | null;
      },
      ValueTypes['replies'],
    ];
    skills?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['skills_select_column']>
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
          | Array<ValueTypes['skills_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['skills_bool_exp'] | undefined | null;
      },
      ValueTypes['skills'],
    ];
    skills_by_pk?: [{ name: ValueTypes['citext'] }, ValueTypes['skills']];
    twitter_accounts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['twitter_accounts_select_column']>
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
          | Array<ValueTypes['twitter_accounts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['twitter_accounts_bool_exp'] | undefined | null;
      },
      ValueTypes['twitter_accounts'],
    ];
    twitter_accounts_by_pk?: [
      { profile_id: number },
      ValueTypes['twitter_accounts'],
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
      ValueTypes['poap_events'],
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
      ValueTypes['poap_holders'],
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
      ValueTypes['poap_holders_aggregate'],
    ];
    __typename?: boolean | `@${string}`;
  }>;
  /** columns and relationships of "reactions" */
  ['reactions']: AliasType<{
    /** An object relationship */
    activity?: ValueTypes['activities'];
    activity_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    /** An object relationship */
    profile_public?: ValueTypes['profiles_public'];
    reaction?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "reactions" */
  ['reactions_aggregate_order_by']: {
    avg?: ValueTypes['reactions_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['reactions_max_order_by'] | undefined | null;
    min?: ValueTypes['reactions_min_order_by'] | undefined | null;
    stddev?: ValueTypes['reactions_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['reactions_stddev_pop_order_by'] | undefined | null;
    stddev_samp?:
      | ValueTypes['reactions_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['reactions_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['reactions_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['reactions_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['reactions_variance_order_by'] | undefined | null;
  };
  /** order by avg() on columns of table "reactions" */
  ['reactions_avg_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "reactions". All fields are combined with a logical 'AND'. */
  ['reactions_bool_exp']: {
    _and?: Array<ValueTypes['reactions_bool_exp']> | undefined | null;
    _not?: ValueTypes['reactions_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['reactions_bool_exp']> | undefined | null;
    activity?: ValueTypes['activities_bool_exp'] | undefined | null;
    activity_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    profile_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    profile_public?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    reaction?: ValueTypes['String_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
  };
  /** order by max() on columns of table "reactions" */
  ['reactions_max_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reaction?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "reactions" */
  ['reactions_min_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reaction?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "reactions". */
  ['reactions_order_by']: {
    activity?: ValueTypes['activities_order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    profile_public?: ValueTypes['profiles_public_order_by'] | undefined | null;
    reaction?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "reactions" */
  ['reactions_select_column']: reactions_select_column;
  /** order by stddev() on columns of table "reactions" */
  ['reactions_stddev_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "reactions" */
  ['reactions_stddev_pop_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "reactions" */
  ['reactions_stddev_samp_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Streaming cursor of the table "reactions" */
  ['reactions_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['reactions_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['reactions_stream_cursor_value_input']: {
    activity_id?: number | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    profile_id?: number | undefined | null;
    reaction?: string | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
  };
  /** order by sum() on columns of table "reactions" */
  ['reactions_sum_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "reactions" */
  ['reactions_var_pop_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "reactions" */
  ['reactions_var_samp_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "reactions" */
  ['reactions_variance_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Replies to activity items */
  ['replies']: AliasType<{
    /** An object relationship */
    activity?: ValueTypes['activities'];
    activity_actor_id?: boolean | `@${string}`;
    activity_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    deleted_at?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    /** An object relationship */
    profile_public?: ValueTypes['profiles_public'];
    reactions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['replies_reactions_select_column']>
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
          | Array<ValueTypes['replies_reactions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['replies_reactions_bool_exp'] | undefined | null;
      },
      ValueTypes['replies_reactions'],
    ];
    reply?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "replies" */
  ['replies_aggregate_order_by']: {
    avg?: ValueTypes['replies_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['replies_max_order_by'] | undefined | null;
    min?: ValueTypes['replies_min_order_by'] | undefined | null;
    stddev?: ValueTypes['replies_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['replies_stddev_pop_order_by'] | undefined | null;
    stddev_samp?: ValueTypes['replies_stddev_samp_order_by'] | undefined | null;
    sum?: ValueTypes['replies_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['replies_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['replies_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['replies_variance_order_by'] | undefined | null;
  };
  /** order by avg() on columns of table "replies" */
  ['replies_avg_order_by']: {
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "replies". All fields are combined with a logical 'AND'. */
  ['replies_bool_exp']: {
    _and?: Array<ValueTypes['replies_bool_exp']> | undefined | null;
    _not?: ValueTypes['replies_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['replies_bool_exp']> | undefined | null;
    activity?: ValueTypes['activities_bool_exp'] | undefined | null;
    activity_actor_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    activity_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    deleted_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    profile_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    profile_public?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    reactions?: ValueTypes['replies_reactions_bool_exp'] | undefined | null;
    reply?: ValueTypes['String_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
  };
  /** order by max() on columns of table "replies" */
  ['replies_max_order_by']: {
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    deleted_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reply?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "replies" */
  ['replies_min_order_by']: {
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    deleted_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reply?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "replies". */
  ['replies_order_by']: {
    activity?: ValueTypes['activities_order_by'] | undefined | null;
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    deleted_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    profile_public?: ValueTypes['profiles_public_order_by'] | undefined | null;
    reactions_aggregate?:
      | ValueTypes['replies_reactions_aggregate_order_by']
      | undefined
      | null;
    reply?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "replies_reactions" */
  ['replies_reactions']: AliasType<{
    /** An object relationship */
    activity?: ValueTypes['activities'];
    activity_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    /** An object relationship */
    profile_public?: ValueTypes['profiles_public'];
    reaction?: boolean | `@${string}`;
    /** An object relationship */
    reply?: ValueTypes['replies'];
    reply_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "replies_reactions" */
  ['replies_reactions_aggregate_order_by']: {
    avg?: ValueTypes['replies_reactions_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['replies_reactions_max_order_by'] | undefined | null;
    min?: ValueTypes['replies_reactions_min_order_by'] | undefined | null;
    stddev?: ValueTypes['replies_reactions_stddev_order_by'] | undefined | null;
    stddev_pop?:
      | ValueTypes['replies_reactions_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['replies_reactions_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['replies_reactions_sum_order_by'] | undefined | null;
    var_pop?:
      | ValueTypes['replies_reactions_var_pop_order_by']
      | undefined
      | null;
    var_samp?:
      | ValueTypes['replies_reactions_var_samp_order_by']
      | undefined
      | null;
    variance?:
      | ValueTypes['replies_reactions_variance_order_by']
      | undefined
      | null;
  };
  /** order by avg() on columns of table "replies_reactions" */
  ['replies_reactions_avg_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "replies_reactions". All fields are combined with a logical 'AND'. */
  ['replies_reactions_bool_exp']: {
    _and?: Array<ValueTypes['replies_reactions_bool_exp']> | undefined | null;
    _not?: ValueTypes['replies_reactions_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['replies_reactions_bool_exp']> | undefined | null;
    activity?: ValueTypes['activities_bool_exp'] | undefined | null;
    activity_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    profile_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    profile_public?: ValueTypes['profiles_public_bool_exp'] | undefined | null;
    reaction?: ValueTypes['String_comparison_exp'] | undefined | null;
    reply?: ValueTypes['replies_bool_exp'] | undefined | null;
    reply_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
  };
  /** order by max() on columns of table "replies_reactions" */
  ['replies_reactions_max_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reaction?: ValueTypes['order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "replies_reactions" */
  ['replies_reactions_min_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reaction?: ValueTypes['order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "replies_reactions". */
  ['replies_reactions_order_by']: {
    activity?: ValueTypes['activities_order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    profile_public?: ValueTypes['profiles_public_order_by'] | undefined | null;
    reaction?: ValueTypes['order_by'] | undefined | null;
    reply?: ValueTypes['replies_order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "replies_reactions" */
  ['replies_reactions_select_column']: replies_reactions_select_column;
  /** order by stddev() on columns of table "replies_reactions" */
  ['replies_reactions_stddev_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "replies_reactions" */
  ['replies_reactions_stddev_pop_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "replies_reactions" */
  ['replies_reactions_stddev_samp_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Streaming cursor of the table "replies_reactions" */
  ['replies_reactions_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['replies_reactions_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['replies_reactions_stream_cursor_value_input']: {
    activity_id?: number | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    profile_id?: number | undefined | null;
    reaction?: string | undefined | null;
    reply_id?: number | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
  };
  /** order by sum() on columns of table "replies_reactions" */
  ['replies_reactions_sum_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "replies_reactions" */
  ['replies_reactions_var_pop_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "replies_reactions" */
  ['replies_reactions_var_samp_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "replies_reactions" */
  ['replies_reactions_variance_order_by']: {
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    reply_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "replies" */
  ['replies_select_column']: replies_select_column;
  /** order by stddev() on columns of table "replies" */
  ['replies_stddev_order_by']: {
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "replies" */
  ['replies_stddev_pop_order_by']: {
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "replies" */
  ['replies_stddev_samp_order_by']: {
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Streaming cursor of the table "replies" */
  ['replies_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['replies_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['replies_stream_cursor_value_input']: {
    activity_actor_id?: number | undefined | null;
    activity_id?: number | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    deleted_at?: ValueTypes['timestamptz'] | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    profile_id?: number | undefined | null;
    reply?: string | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
  };
  /** order by sum() on columns of table "replies" */
  ['replies_sum_order_by']: {
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "replies" */
  ['replies_var_pop_order_by']: {
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "replies" */
  ['replies_var_samp_order_by']: {
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "replies" */
  ['replies_variance_order_by']: {
    activity_actor_id?: ValueTypes['order_by'] | undefined | null;
    activity_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "reputation_scores" */
  ['reputation_scores']: AliasType<{
    colinks_engagement_score?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    email_score?: boolean | `@${string}`;
    github_score?: boolean | `@${string}`;
    invite_score?: boolean | `@${string}`;
    linkedin_score?: boolean | `@${string}`;
    links_score?: boolean | `@${string}`;
    pgive_score?: boolean | `@${string}`;
    poap_score?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    total_score?: boolean | `@${string}`;
    twitter_score?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "reputation_scores". All fields are combined with a logical 'AND'. */
  ['reputation_scores_bool_exp']: {
    _and?: Array<ValueTypes['reputation_scores_bool_exp']> | undefined | null;
    _not?: ValueTypes['reputation_scores_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['reputation_scores_bool_exp']> | undefined | null;
    colinks_engagement_score?:
      | ValueTypes['Int_comparison_exp']
      | undefined
      | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    email_score?: ValueTypes['Int_comparison_exp'] | undefined | null;
    github_score?: ValueTypes['Int_comparison_exp'] | undefined | null;
    invite_score?: ValueTypes['Int_comparison_exp'] | undefined | null;
    linkedin_score?: ValueTypes['Int_comparison_exp'] | undefined | null;
    links_score?: ValueTypes['Int_comparison_exp'] | undefined | null;
    pgive_score?: ValueTypes['Int_comparison_exp'] | undefined | null;
    poap_score?: ValueTypes['Int_comparison_exp'] | undefined | null;
    profile_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    total_score?: ValueTypes['Int_comparison_exp'] | undefined | null;
    twitter_score?: ValueTypes['Int_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "reputation_scores". */
  ['reputation_scores_order_by']: {
    colinks_engagement_score?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    email_score?: ValueTypes['order_by'] | undefined | null;
    github_score?: ValueTypes['order_by'] | undefined | null;
    invite_score?: ValueTypes['order_by'] | undefined | null;
    linkedin_score?: ValueTypes['order_by'] | undefined | null;
    links_score?: ValueTypes['order_by'] | undefined | null;
    pgive_score?: ValueTypes['order_by'] | undefined | null;
    poap_score?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    total_score?: ValueTypes['order_by'] | undefined | null;
    twitter_score?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "reputation_scores" */
  ['reputation_scores_select_column']: reputation_scores_select_column;
  /** Streaming cursor of the table "reputation_scores" */
  ['reputation_scores_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['reputation_scores_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['reputation_scores_stream_cursor_value_input']: {
    colinks_engagement_score?: number | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    email_score?: number | undefined | null;
    github_score?: number | undefined | null;
    invite_score?: number | undefined | null;
    linkedin_score?: number | undefined | null;
    links_score?: number | undefined | null;
    pgive_score?: number | undefined | null;
    poap_score?: number | undefined | null;
    profile_id?: ValueTypes['bigint'] | undefined | null;
    total_score?: number | undefined | null;
    twitter_score?: number | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
  };
  ['search_replies_args']: {
    search?: string | undefined | null;
  };
  /** columns and relationships of "skills" */
  ['skills']: AliasType<{
    count?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    hidden?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    /** An object relationship */
    profile_skills?: ValueTypes['profile_skills'];
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "skills". All fields are combined with a logical 'AND'. */
  ['skills_bool_exp']: {
    _and?: Array<ValueTypes['skills_bool_exp']> | undefined | null;
    _not?: ValueTypes['skills_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['skills_bool_exp']> | undefined | null;
    count?: ValueTypes['Int_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    hidden?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    name?: ValueTypes['citext_comparison_exp'] | undefined | null;
    profile_skills?: ValueTypes['profile_skills_bool_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "skills". */
  ['skills_order_by']: {
    count?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    hidden?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    profile_skills?: ValueTypes['profile_skills_order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "skills" */
  ['skills_select_column']: skills_select_column;
  /** Streaming cursor of the table "skills" */
  ['skills_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['skills_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['skills_stream_cursor_value_input']: {
    count?: number | undefined | null;
    created_at?: ValueTypes['timestamptz'] | undefined | null;
    hidden?: boolean | undefined | null;
    name?: ValueTypes['citext'] | undefined | null;
    updated_at?: ValueTypes['timestamptz'] | undefined | null;
  };
  ['smallint']: unknown;
  /** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
  ['smallint_array_comparison_exp']: {
    /** is the array contained in the given array value */
    _contained_in?: Array<ValueTypes['smallint']> | undefined | null;
    /** does the array contain the given value */
    _contains?: Array<ValueTypes['smallint']> | undefined | null;
    _eq?: Array<ValueTypes['smallint']> | undefined | null;
    _gt?: Array<ValueTypes['smallint']> | undefined | null;
    _gte?: Array<ValueTypes['smallint']> | undefined | null;
    _in?: Array<Array<ValueTypes['smallint']> | undefined | null>;
    _is_null?: boolean | undefined | null;
    _lt?: Array<ValueTypes['smallint']> | undefined | null;
    _lte?: Array<ValueTypes['smallint']> | undefined | null;
    _neq?: Array<ValueTypes['smallint']> | undefined | null;
    _nin?: Array<Array<ValueTypes['smallint']> | undefined | null>;
  };
  ['subscription_root']: AliasType<{
    activities?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['activities_select_column']>
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
          | Array<ValueTypes['activities_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['activities_bool_exp'] | undefined | null;
      },
      ValueTypes['activities'],
    ];
    activities_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['activities_select_column']>
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
          | Array<ValueTypes['activities_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['activities_bool_exp'] | undefined | null;
      },
      ValueTypes['activities_aggregate'],
    ];
    activities_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['activities']];
    activities_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['activities_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['activities_bool_exp'] | undefined | null;
      },
      ValueTypes['activities'],
    ];
    big_questions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['big_questions_select_column']>
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
          | Array<ValueTypes['big_questions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['big_questions_bool_exp'] | undefined | null;
      },
      ValueTypes['big_questions'],
    ];
    big_questions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['big_questions'],
    ];
    big_questions_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['big_questions_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['big_questions_bool_exp'] | undefined | null;
      },
      ValueTypes['big_questions'],
    ];
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
      ValueTypes['cosouls'],
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
      ValueTypes['cosouls'],
    ];
    enriched_casts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['enriched_casts_select_column']>
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
          | Array<ValueTypes['enriched_casts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['enriched_casts_bool_exp'] | undefined | null;
      },
      ValueTypes['enriched_casts'],
    ];
    enriched_casts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['enriched_casts'],
    ];
    enriched_casts_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['enriched_casts_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['enriched_casts_bool_exp'] | undefined | null;
      },
      ValueTypes['enriched_casts'],
    ];
    farcaster_accounts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['farcaster_accounts_select_column']>
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
          | Array<ValueTypes['farcaster_accounts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['farcaster_accounts_bool_exp'] | undefined | null;
      },
      ValueTypes['farcaster_accounts'],
    ];
    farcaster_accounts_by_pk?: [
      { profile_id: ValueTypes['bigint'] },
      ValueTypes['farcaster_accounts'],
    ];
    farcaster_accounts_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          | ValueTypes['farcaster_accounts_stream_cursor_input']
          | undefined
          | null
        > /** filter the rows returned */;
        where?: ValueTypes['farcaster_accounts_bool_exp'] | undefined | null;
      },
      ValueTypes['farcaster_accounts'],
    ];
    github_accounts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['github_accounts_select_column']>
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
          | Array<ValueTypes['github_accounts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['github_accounts_bool_exp'] | undefined | null;
      },
      ValueTypes['github_accounts'],
    ];
    github_accounts_by_pk?: [
      { profile_id: ValueTypes['bigint'] },
      ValueTypes['github_accounts'],
    ];
    github_accounts_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['github_accounts_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['github_accounts_bool_exp'] | undefined | null;
      },
      ValueTypes['github_accounts'],
    ];
    link_holders?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders'],
    ];
    link_holders_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_holders_select_column']>
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
          | Array<ValueTypes['link_holders_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders_aggregate'],
    ];
    link_holders_by_pk?: [
      { holder: ValueTypes['citext']; target: ValueTypes['citext'] },
      ValueTypes['link_holders'],
    ];
    link_holders_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['link_holders_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['link_holders_bool_exp'] | undefined | null;
      },
      ValueTypes['link_holders'],
    ];
    link_tx?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['link_tx_select_column']>
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
          | Array<ValueTypes['link_tx_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['link_tx_bool_exp'] | undefined | null;
      },
      ValueTypes['link_tx'],
    ];
    link_tx_by_pk?: [{ tx_hash: ValueTypes['citext'] }, ValueTypes['link_tx']];
    link_tx_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['link_tx_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['link_tx_bool_exp'] | undefined | null;
      },
      ValueTypes['link_tx'],
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
      ValueTypes['poap_events'],
    ];
    poap_events_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['poap_events'],
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
      ValueTypes['poap_events'],
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
      ValueTypes['poap_holders'],
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
      ValueTypes['poap_holders_aggregate'],
    ];
    poap_holders_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['poap_holders'],
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
      ValueTypes['poap_holders'],
    ];
    profile_skills?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['profile_skills_select_column']>
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
          | Array<ValueTypes['profile_skills_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['profile_skills_bool_exp'] | undefined | null;
      },
      ValueTypes['profile_skills'],
    ];
    profile_skills_by_pk?: [
      { profile_id: number; skill_name: ValueTypes['citext'] },
      ValueTypes['profile_skills'],
    ];
    profile_skills_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['profile_skills_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['profile_skills_bool_exp'] | undefined | null;
      },
      ValueTypes['profile_skills'],
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
    reactions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['reactions_select_column']>
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
          | Array<ValueTypes['reactions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['reactions_bool_exp'] | undefined | null;
      },
      ValueTypes['reactions'],
    ];
    reactions_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['reactions']];
    reactions_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['reactions_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['reactions_bool_exp'] | undefined | null;
      },
      ValueTypes['reactions'],
    ];
    replies?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['replies_select_column']>
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
          | Array<ValueTypes['replies_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['replies_bool_exp'] | undefined | null;
      },
      ValueTypes['replies'],
    ];
    replies_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['replies']];
    replies_reactions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['replies_reactions_select_column']>
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
          | Array<ValueTypes['replies_reactions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['replies_reactions_bool_exp'] | undefined | null;
      },
      ValueTypes['replies_reactions'],
    ];
    replies_reactions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['replies_reactions'],
    ];
    replies_reactions_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['replies_reactions_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['replies_reactions_bool_exp'] | undefined | null;
      },
      ValueTypes['replies_reactions'],
    ];
    replies_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['replies_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['replies_bool_exp'] | undefined | null;
      },
      ValueTypes['replies'],
    ];
    reputation_scores?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['reputation_scores_select_column']>
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
          | Array<ValueTypes['reputation_scores_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['reputation_scores_bool_exp'] | undefined | null;
      },
      ValueTypes['reputation_scores'],
    ];
    reputation_scores_by_pk?: [
      { profile_id: ValueTypes['bigint'] },
      ValueTypes['reputation_scores'],
    ];
    reputation_scores_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['reputation_scores_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['reputation_scores_bool_exp'] | undefined | null;
      },
      ValueTypes['reputation_scores'],
    ];
    search_replies?: [
      {
        /** input parameters for function "search_replies" */
        args: ValueTypes['search_replies_args'] /** distinct select on columns */;
        distinct_on?:
          | Array<ValueTypes['replies_select_column']>
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
          | Array<ValueTypes['replies_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['replies_bool_exp'] | undefined | null;
      },
      ValueTypes['replies'],
    ];
    skills?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['skills_select_column']>
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
          | Array<ValueTypes['skills_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['skills_bool_exp'] | undefined | null;
      },
      ValueTypes['skills'],
    ];
    skills_by_pk?: [{ name: ValueTypes['citext'] }, ValueTypes['skills']];
    skills_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['skills_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['skills_bool_exp'] | undefined | null;
      },
      ValueTypes['skills'],
    ];
    twitter_accounts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['twitter_accounts_select_column']>
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
          | Array<ValueTypes['twitter_accounts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['twitter_accounts_bool_exp'] | undefined | null;
      },
      ValueTypes['twitter_accounts'],
    ];
    twitter_accounts_by_pk?: [
      { profile_id: number },
      ValueTypes['twitter_accounts'],
    ];
    twitter_accounts_stream?: [
      {
        /** maximum number of rows returned in a single batch */
        batch_size: number /** cursor to stream the results returned by the query */;
        cursor: Array<
          ValueTypes['twitter_accounts_stream_cursor_input'] | undefined | null
        > /** filter the rows returned */;
        where?: ValueTypes['twitter_accounts_bool_exp'] | undefined | null;
      },
      ValueTypes['twitter_accounts'],
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
      ValueTypes['poap_events'],
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
      ValueTypes['poap_holders'],
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
      ValueTypes['poap_holders_aggregate'],
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
  /** twitter accounts connected to profiles */
  ['twitter_accounts']: AliasType<{
    id?: boolean | `@${string}`;
    profile_id?: boolean | `@${string}`;
    username?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "twitter_accounts". All fields are combined with a logical 'AND'. */
  ['twitter_accounts_bool_exp']: {
    _and?: Array<ValueTypes['twitter_accounts_bool_exp']> | undefined | null;
    _not?: ValueTypes['twitter_accounts_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['twitter_accounts_bool_exp']> | undefined | null;
    id?: ValueTypes['String_comparison_exp'] | undefined | null;
    profile_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    username?: ValueTypes['String_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "twitter_accounts". */
  ['twitter_accounts_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    profile_id?: ValueTypes['order_by'] | undefined | null;
    username?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "twitter_accounts" */
  ['twitter_accounts_select_column']: twitter_accounts_select_column;
  /** Streaming cursor of the table "twitter_accounts" */
  ['twitter_accounts_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: ValueTypes['twitter_accounts_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: ValueTypes['cursor_ordering'] | undefined | null;
  };
  /** Initial value of the column from where the streaming should start */
  ['twitter_accounts_stream_cursor_value_input']: {
    id?: string | undefined | null;
    profile_id?: number | undefined | null;
    username?: string | undefined | null;
  };
  ['vector']: unknown;
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
  /** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
  ['Boolean_comparison_exp']: GraphQLTypes['Boolean_comparison_exp'];
  ['Cast']: {
    address: string;
    avatar_url: string;
    created_at: string;
    embeds: Array<GraphQLTypes['CastEmbed']>;
    fid: GraphQLTypes['bigint'];
    fname: string;
    hash: string;
    id: GraphQLTypes['bigint'];
    like_count: number;
    mentioned_addresses: Array<GraphQLTypes['CastMention']>;
    recast_count: number;
    replies_count: number;
    text: string;
    text_with_mentions: string;
  };
  ['CastEmbed']: {
    type: string;
    url: string;
  };
  ['CastMention']: {
    address: string;
    fname: string;
  };
  ['GetCastsInput']: GraphQLTypes['GetCastsInput'];
  ['GetCastsOutput']: {
    casts: Array<GraphQLTypes['Cast']>;
  };
  /** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
  ['Int_comparison_exp']: GraphQLTypes['Int_comparison_exp'];
  /** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
  ['String_comparison_exp']: GraphQLTypes['String_comparison_exp'];
  /** Table containing activity on our platform */
  ['activities']: {
    action: string;
    actor_profile_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    actor_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    /** An object relationship */
    big_question?: GraphQLTypes['big_questions'] | undefined;
    big_question_id?: GraphQLTypes['bigint'] | undefined;
    cast_id?: GraphQLTypes['bigint'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    contribution_id?: GraphQLTypes['bigint'] | undefined;
    created_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    enriched_cast?: GraphQLTypes['enriched_casts'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    /** An array relationship */
    gives: Array<GraphQLTypes['colinks_gives']>;
    /** An aggregate relationship */
    gives_aggregate: GraphQLTypes['colinks_gives_aggregate'];
    id: GraphQLTypes['bigint'];
    organization_id?: GraphQLTypes['bigint'] | undefined;
    private_stream: boolean;
    reaction_count: number;
    /** An array relationship */
    reactions: Array<GraphQLTypes['reactions']>;
    /** An array relationship */
    replies: Array<GraphQLTypes['replies']>;
    reply_count: number;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    target_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    updated_at: GraphQLTypes['timestamptz'];
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** aggregated selection of "activities" */
  ['activities_aggregate']: {
    aggregate?: GraphQLTypes['activities_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['activities']>;
  };
  ['activities_aggregate_bool_exp']: GraphQLTypes['activities_aggregate_bool_exp'];
  ['activities_aggregate_bool_exp_bool_and']: GraphQLTypes['activities_aggregate_bool_exp_bool_and'];
  ['activities_aggregate_bool_exp_bool_or']: GraphQLTypes['activities_aggregate_bool_exp_bool_or'];
  ['activities_aggregate_bool_exp_count']: GraphQLTypes['activities_aggregate_bool_exp_count'];
  /** aggregate fields of "activities" */
  ['activities_aggregate_fields']: {
    avg?: GraphQLTypes['activities_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['activities_max_fields'] | undefined;
    min?: GraphQLTypes['activities_min_fields'] | undefined;
    stddev?: GraphQLTypes['activities_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['activities_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['activities_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['activities_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['activities_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['activities_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['activities_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "activities" */
  ['activities_aggregate_order_by']: GraphQLTypes['activities_aggregate_order_by'];
  /** aggregate avg on columns */
  ['activities_avg_fields']: {
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by avg() on columns of table "activities" */
  ['activities_avg_order_by']: GraphQLTypes['activities_avg_order_by'];
  /** Boolean expression to filter rows from the table "activities". All fields are combined with a logical 'AND'. */
  ['activities_bool_exp']: GraphQLTypes['activities_bool_exp'];
  /** aggregate max on columns */
  ['activities_max_fields']: {
    action?: string | undefined;
    actor_profile_id?: GraphQLTypes['bigint'] | undefined;
    big_question_id?: GraphQLTypes['bigint'] | undefined;
    cast_id?: GraphQLTypes['bigint'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    contribution_id?: GraphQLTypes['bigint'] | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    organization_id?: GraphQLTypes['bigint'] | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by max() on columns of table "activities" */
  ['activities_max_order_by']: GraphQLTypes['activities_max_order_by'];
  /** aggregate min on columns */
  ['activities_min_fields']: {
    action?: string | undefined;
    actor_profile_id?: GraphQLTypes['bigint'] | undefined;
    big_question_id?: GraphQLTypes['bigint'] | undefined;
    cast_id?: GraphQLTypes['bigint'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    contribution_id?: GraphQLTypes['bigint'] | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    organization_id?: GraphQLTypes['bigint'] | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by min() on columns of table "activities" */
  ['activities_min_order_by']: GraphQLTypes['activities_min_order_by'];
  /** Ordering options when selecting data from "activities". */
  ['activities_order_by']: GraphQLTypes['activities_order_by'];
  /** select columns of table "activities" */
  ['activities_select_column']: GraphQLTypes['activities_select_column'];
  /** select "activities_aggregate_bool_exp_bool_and_arguments_columns" columns of table "activities" */
  ['activities_select_column_activities_aggregate_bool_exp_bool_and_arguments_columns']: GraphQLTypes['activities_select_column_activities_aggregate_bool_exp_bool_and_arguments_columns'];
  /** select "activities_aggregate_bool_exp_bool_or_arguments_columns" columns of table "activities" */
  ['activities_select_column_activities_aggregate_bool_exp_bool_or_arguments_columns']: GraphQLTypes['activities_select_column_activities_aggregate_bool_exp_bool_or_arguments_columns'];
  /** aggregate stddev on columns */
  ['activities_stddev_fields']: {
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by stddev() on columns of table "activities" */
  ['activities_stddev_order_by']: GraphQLTypes['activities_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['activities_stddev_pop_fields']: {
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "activities" */
  ['activities_stddev_pop_order_by']: GraphQLTypes['activities_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['activities_stddev_samp_fields']: {
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "activities" */
  ['activities_stddev_samp_order_by']: GraphQLTypes['activities_stddev_samp_order_by'];
  /** Streaming cursor of the table "activities" */
  ['activities_stream_cursor_input']: GraphQLTypes['activities_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['activities_stream_cursor_value_input']: GraphQLTypes['activities_stream_cursor_value_input'];
  /** aggregate sum on columns */
  ['activities_sum_fields']: {
    actor_profile_id?: GraphQLTypes['bigint'] | undefined;
    big_question_id?: GraphQLTypes['bigint'] | undefined;
    cast_id?: GraphQLTypes['bigint'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    contribution_id?: GraphQLTypes['bigint'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    organization_id?: GraphQLTypes['bigint'] | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by sum() on columns of table "activities" */
  ['activities_sum_order_by']: GraphQLTypes['activities_sum_order_by'];
  /** aggregate var_pop on columns */
  ['activities_var_pop_fields']: {
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by var_pop() on columns of table "activities" */
  ['activities_var_pop_order_by']: GraphQLTypes['activities_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['activities_var_samp_fields']: {
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by var_samp() on columns of table "activities" */
  ['activities_var_samp_order_by']: GraphQLTypes['activities_var_samp_order_by'];
  /** aggregate variance on columns */
  ['activities_variance_fields']: {
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by variance() on columns of table "activities" */
  ['activities_variance_order_by']: GraphQLTypes['activities_variance_order_by'];
  /** columns and relationships of "big_questions" */
  ['big_questions']: {
    /** An array relationship */
    activities: Array<GraphQLTypes['activities']>;
    /** An aggregate relationship */
    activities_aggregate: GraphQLTypes['activities_aggregate'];
    cover_image_url: string;
    created_at: GraphQLTypes['timestamp'];
    css_background_position?: string | undefined;
    description?: string | undefined;
    expire_at?: GraphQLTypes['timestamp'] | undefined;
    id: GraphQLTypes['bigint'];
    prompt: string;
    publish_at?: GraphQLTypes['timestamp'] | undefined;
    updated_at: GraphQLTypes['timestamp'];
  };
  /** Boolean expression to filter rows from the table "big_questions". All fields are combined with a logical 'AND'. */
  ['big_questions_bool_exp']: GraphQLTypes['big_questions_bool_exp'];
  /** Ordering options when selecting data from "big_questions". */
  ['big_questions_order_by']: GraphQLTypes['big_questions_order_by'];
  /** select columns of table "big_questions" */
  ['big_questions_select_column']: GraphQLTypes['big_questions_select_column'];
  /** Streaming cursor of the table "big_questions" */
  ['big_questions_stream_cursor_input']: GraphQLTypes['big_questions_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['big_questions_stream_cursor_value_input']: GraphQLTypes['big_questions_stream_cursor_value_input'];
  ['bigint']: number;
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_array_comparison_exp']: GraphQLTypes['bigint_array_comparison_exp'];
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_comparison_exp']: GraphQLTypes['bigint_comparison_exp'];
  ['bytea']: any;
  /** Boolean expression to compare columns of type "bytea". All fields are combined with logical 'AND'. */
  ['bytea_comparison_exp']: GraphQLTypes['bytea_comparison_exp'];
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
    attestation_uid?: string | undefined;
    cast_hash?: string | undefined;
    created_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    give_skill?: GraphQLTypes['skills'] | undefined;
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
    attestation_uid?: string | undefined;
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
    attestation_uid?: string | undefined;
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
    /** An object relationship */
    skill_info?: GraphQLTypes['skills'] | undefined;
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
  /** local db copy of last synced on-chain cosoul data */
  ['cosouls']: {
    address: GraphQLTypes['citext'];
    checked_at?: GraphQLTypes['timestamptz'] | undefined;
    created_at: GraphQLTypes['timestamptz'];
    created_tx_hash: string;
    /** An array relationship */
    held_links: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    held_links_aggregate: GraphQLTypes['link_holders_aggregate'];
    id: number;
    /** An array relationship */
    link_holders: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    link_holders_aggregate: GraphQLTypes['link_holders_aggregate'];
    pgive?: number | undefined;
    /** An array relationship */
    poaps: Array<GraphQLTypes['poap_holders']>;
    /** An aggregate relationship */
    poaps_aggregate: GraphQLTypes['poap_holders_aggregate'];
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    synced_at?: GraphQLTypes['timestamptz'] | undefined;
    token_id: number;
    updated_at: GraphQLTypes['timestamptz'];
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
  /** farcaster casts that we actually care about, with some materialized fields */
  ['enriched_casts']: {
    created_at: GraphQLTypes['timestamp'];
    deleted_at?: GraphQLTypes['timestamp'] | undefined;
    embeds: GraphQLTypes['jsonb'];
    fid: GraphQLTypes['bigint'];
    hash: GraphQLTypes['bytea'];
    id: GraphQLTypes['bigint'];
    mentions: Array<GraphQLTypes['bigint']>;
    mentions_positions: Array<GraphQLTypes['smallint']>;
    parent_fid?: GraphQLTypes['bigint'] | undefined;
    parent_hash?: GraphQLTypes['bytea'] | undefined;
    parent_url?: string | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    root_parent_hash?: GraphQLTypes['bytea'] | undefined;
    root_parent_url?: string | undefined;
    text: string;
    timestamp: GraphQLTypes['timestamp'];
    updated_at: GraphQLTypes['timestamp'];
  };
  /** Boolean expression to filter rows from the table "enriched_casts". All fields are combined with a logical 'AND'. */
  ['enriched_casts_bool_exp']: GraphQLTypes['enriched_casts_bool_exp'];
  /** Ordering options when selecting data from "enriched_casts". */
  ['enriched_casts_order_by']: GraphQLTypes['enriched_casts_order_by'];
  /** select columns of table "enriched_casts" */
  ['enriched_casts_select_column']: GraphQLTypes['enriched_casts_select_column'];
  /** Streaming cursor of the table "enriched_casts" */
  ['enriched_casts_stream_cursor_input']: GraphQLTypes['enriched_casts_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['enriched_casts_stream_cursor_value_input']: GraphQLTypes['enriched_casts_stream_cursor_value_input'];
  /** columns and relationships of "farcaster_accounts" */
  ['farcaster_accounts']: {
    bio_text?: string | undefined;
    created_at: GraphQLTypes['timestamptz'];
    custody_address: string;
    fid: GraphQLTypes['bigint'];
    followers_count: number;
    following_count: number;
    name: string;
    pfp_url?: string | undefined;
    profile_id: GraphQLTypes['bigint'];
    updated_at: GraphQLTypes['timestamptz'];
    username: string;
  };
  /** Boolean expression to filter rows from the table "farcaster_accounts". All fields are combined with a logical 'AND'. */
  ['farcaster_accounts_bool_exp']: GraphQLTypes['farcaster_accounts_bool_exp'];
  /** Ordering options when selecting data from "farcaster_accounts". */
  ['farcaster_accounts_order_by']: GraphQLTypes['farcaster_accounts_order_by'];
  /** select columns of table "farcaster_accounts" */
  ['farcaster_accounts_select_column']: GraphQLTypes['farcaster_accounts_select_column'];
  /** Streaming cursor of the table "farcaster_accounts" */
  ['farcaster_accounts_stream_cursor_input']: GraphQLTypes['farcaster_accounts_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['farcaster_accounts_stream_cursor_value_input']: GraphQLTypes['farcaster_accounts_stream_cursor_value_input'];
  ['float8']: any;
  /** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
  ['float8_comparison_exp']: GraphQLTypes['float8_comparison_exp'];
  /** columns and relationships of "github_accounts" */
  ['github_accounts']: {
    profile_id: GraphQLTypes['bigint'];
    username: string;
  };
  /** Boolean expression to filter rows from the table "github_accounts". All fields are combined with a logical 'AND'. */
  ['github_accounts_bool_exp']: GraphQLTypes['github_accounts_bool_exp'];
  /** Ordering options when selecting data from "github_accounts". */
  ['github_accounts_order_by']: GraphQLTypes['github_accounts_order_by'];
  /** select columns of table "github_accounts" */
  ['github_accounts_select_column']: GraphQLTypes['github_accounts_select_column'];
  /** Streaming cursor of the table "github_accounts" */
  ['github_accounts_stream_cursor_input']: GraphQLTypes['github_accounts_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['github_accounts_stream_cursor_value_input']: GraphQLTypes['github_accounts_stream_cursor_value_input'];
  ['jsonb']: any;
  ['jsonb_cast_exp']: GraphQLTypes['jsonb_cast_exp'];
  /** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
  ['jsonb_comparison_exp']: GraphQLTypes['jsonb_comparison_exp'];
  /** tracks the amount of keys an address holds in a given subject. updated with data from the key_tx table */
  ['link_holders']: {
    amount: number;
    holder: GraphQLTypes['citext'];
    /** An object relationship */
    holder_cosoul?: GraphQLTypes['cosouls'] | undefined;
    /** An object relationship */
    holder_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    target: GraphQLTypes['citext'];
    /** An object relationship */
    target_cosoul?: GraphQLTypes['cosouls'] | undefined;
    /** An object relationship */
    target_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** aggregated selection of "link_holders" */
  ['link_holders_aggregate']: {
    aggregate?: GraphQLTypes['link_holders_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['link_holders']>;
  };
  ['link_holders_aggregate_bool_exp']: GraphQLTypes['link_holders_aggregate_bool_exp'];
  ['link_holders_aggregate_bool_exp_count']: GraphQLTypes['link_holders_aggregate_bool_exp_count'];
  /** aggregate fields of "link_holders" */
  ['link_holders_aggregate_fields']: {
    avg?: GraphQLTypes['link_holders_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['link_holders_max_fields'] | undefined;
    min?: GraphQLTypes['link_holders_min_fields'] | undefined;
    stddev?: GraphQLTypes['link_holders_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['link_holders_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['link_holders_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['link_holders_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['link_holders_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['link_holders_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['link_holders_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "link_holders" */
  ['link_holders_aggregate_order_by']: GraphQLTypes['link_holders_aggregate_order_by'];
  /** aggregate avg on columns */
  ['link_holders_avg_fields']: {
    amount?: number | undefined;
  };
  /** order by avg() on columns of table "link_holders" */
  ['link_holders_avg_order_by']: GraphQLTypes['link_holders_avg_order_by'];
  /** Boolean expression to filter rows from the table "link_holders". All fields are combined with a logical 'AND'. */
  ['link_holders_bool_exp']: GraphQLTypes['link_holders_bool_exp'];
  /** aggregate max on columns */
  ['link_holders_max_fields']: {
    amount?: number | undefined;
    holder?: GraphQLTypes['citext'] | undefined;
    target?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by max() on columns of table "link_holders" */
  ['link_holders_max_order_by']: GraphQLTypes['link_holders_max_order_by'];
  /** aggregate min on columns */
  ['link_holders_min_fields']: {
    amount?: number | undefined;
    holder?: GraphQLTypes['citext'] | undefined;
    target?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by min() on columns of table "link_holders" */
  ['link_holders_min_order_by']: GraphQLTypes['link_holders_min_order_by'];
  /** Ordering options when selecting data from "link_holders". */
  ['link_holders_order_by']: GraphQLTypes['link_holders_order_by'];
  /** select columns of table "link_holders" */
  ['link_holders_select_column']: GraphQLTypes['link_holders_select_column'];
  /** aggregate stddev on columns */
  ['link_holders_stddev_fields']: {
    amount?: number | undefined;
  };
  /** order by stddev() on columns of table "link_holders" */
  ['link_holders_stddev_order_by']: GraphQLTypes['link_holders_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['link_holders_stddev_pop_fields']: {
    amount?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "link_holders" */
  ['link_holders_stddev_pop_order_by']: GraphQLTypes['link_holders_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['link_holders_stddev_samp_fields']: {
    amount?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "link_holders" */
  ['link_holders_stddev_samp_order_by']: GraphQLTypes['link_holders_stddev_samp_order_by'];
  /** Streaming cursor of the table "link_holders" */
  ['link_holders_stream_cursor_input']: GraphQLTypes['link_holders_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['link_holders_stream_cursor_value_input']: GraphQLTypes['link_holders_stream_cursor_value_input'];
  /** aggregate sum on columns */
  ['link_holders_sum_fields']: {
    amount?: number | undefined;
  };
  /** order by sum() on columns of table "link_holders" */
  ['link_holders_sum_order_by']: GraphQLTypes['link_holders_sum_order_by'];
  /** aggregate var_pop on columns */
  ['link_holders_var_pop_fields']: {
    amount?: number | undefined;
  };
  /** order by var_pop() on columns of table "link_holders" */
  ['link_holders_var_pop_order_by']: GraphQLTypes['link_holders_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['link_holders_var_samp_fields']: {
    amount?: number | undefined;
  };
  /** order by var_samp() on columns of table "link_holders" */
  ['link_holders_var_samp_order_by']: GraphQLTypes['link_holders_var_samp_order_by'];
  /** aggregate variance on columns */
  ['link_holders_variance_fields']: {
    amount?: number | undefined;
  };
  /** order by variance() on columns of table "link_holders" */
  ['link_holders_variance_order_by']: GraphQLTypes['link_holders_variance_order_by'];
  /** columns and relationships of "link_tx" */
  ['link_tx']: {
    buy: boolean;
    created_at: GraphQLTypes['timestamptz'];
    eth_amount: string;
    holder: GraphQLTypes['citext'];
    /** An object relationship */
    holder_profile?: GraphQLTypes['profiles_public'] | undefined;
    link_amount: string;
    protocol_fee_amount: string;
    supply: GraphQLTypes['numeric'];
    target: GraphQLTypes['citext'];
    target_fee_amount: string;
    /** An object relationship */
    target_profile?: GraphQLTypes['profiles_public'] | undefined;
    tx_hash: GraphQLTypes['citext'];
  };
  /** Boolean expression to filter rows from the table "link_tx". All fields are combined with a logical 'AND'. */
  ['link_tx_bool_exp']: GraphQLTypes['link_tx_bool_exp'];
  /** Ordering options when selecting data from "link_tx". */
  ['link_tx_order_by']: GraphQLTypes['link_tx_order_by'];
  /** select columns of table "link_tx" */
  ['link_tx_select_column']: GraphQLTypes['link_tx_select_column'];
  /** Streaming cursor of the table "link_tx" */
  ['link_tx_stream_cursor_input']: GraphQLTypes['link_tx_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['link_tx_stream_cursor_value_input']: GraphQLTypes['link_tx_stream_cursor_value_input'];
  ['numeric']: any;
  /** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
  ['numeric_comparison_exp']: GraphQLTypes['numeric_comparison_exp'];
  /** column ordering options */
  ['order_by']: GraphQLTypes['order_by'];
  /** Poap event info */
  ['poap_events']: {
    city: string;
    country: string;
    created_at: GraphQLTypes['timestamptz'];
    description: string;
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
  /** Boolean expression to filter rows from the table "poap_events". All fields are combined with a logical 'AND'. */
  ['poap_events_bool_exp']: GraphQLTypes['poap_events_bool_exp'];
  /** Ordering options when selecting data from "poap_events". */
  ['poap_events_order_by']: GraphQLTypes['poap_events_order_by'];
  /** select columns of table "poap_events" */
  ['poap_events_select_column']: GraphQLTypes['poap_events_select_column'];
  /** Streaming cursor of the table "poap_events" */
  ['poap_events_stream_cursor_input']: GraphQLTypes['poap_events_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['poap_events_stream_cursor_value_input']: GraphQLTypes['poap_events_stream_cursor_value_input'];
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
  /** columns and relationships of "profile_skills" */
  ['profile_skills']: {
    profile_id: number;
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    /** An object relationship */
    skill?: GraphQLTypes['skills'] | undefined;
    skill_name: GraphQLTypes['citext'];
  };
  /** order by aggregate values of table "profile_skills" */
  ['profile_skills_aggregate_order_by']: GraphQLTypes['profile_skills_aggregate_order_by'];
  /** order by avg() on columns of table "profile_skills" */
  ['profile_skills_avg_order_by']: GraphQLTypes['profile_skills_avg_order_by'];
  /** Boolean expression to filter rows from the table "profile_skills". All fields are combined with a logical 'AND'. */
  ['profile_skills_bool_exp']: GraphQLTypes['profile_skills_bool_exp'];
  /** order by max() on columns of table "profile_skills" */
  ['profile_skills_max_order_by']: GraphQLTypes['profile_skills_max_order_by'];
  /** order by min() on columns of table "profile_skills" */
  ['profile_skills_min_order_by']: GraphQLTypes['profile_skills_min_order_by'];
  /** Ordering options when selecting data from "profile_skills". */
  ['profile_skills_order_by']: GraphQLTypes['profile_skills_order_by'];
  /** select columns of table "profile_skills" */
  ['profile_skills_select_column']: GraphQLTypes['profile_skills_select_column'];
  /** order by stddev() on columns of table "profile_skills" */
  ['profile_skills_stddev_order_by']: GraphQLTypes['profile_skills_stddev_order_by'];
  /** order by stddev_pop() on columns of table "profile_skills" */
  ['profile_skills_stddev_pop_order_by']: GraphQLTypes['profile_skills_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "profile_skills" */
  ['profile_skills_stddev_samp_order_by']: GraphQLTypes['profile_skills_stddev_samp_order_by'];
  /** Streaming cursor of the table "profile_skills" */
  ['profile_skills_stream_cursor_input']: GraphQLTypes['profile_skills_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['profile_skills_stream_cursor_value_input']: GraphQLTypes['profile_skills_stream_cursor_value_input'];
  /** order by sum() on columns of table "profile_skills" */
  ['profile_skills_sum_order_by']: GraphQLTypes['profile_skills_sum_order_by'];
  /** order by var_pop() on columns of table "profile_skills" */
  ['profile_skills_var_pop_order_by']: GraphQLTypes['profile_skills_var_pop_order_by'];
  /** order by var_samp() on columns of table "profile_skills" */
  ['profile_skills_var_samp_order_by']: GraphQLTypes['profile_skills_var_samp_order_by'];
  /** order by variance() on columns of table "profile_skills" */
  ['profile_skills_variance_order_by']: GraphQLTypes['profile_skills_variance_order_by'];
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
    /** An object relationship */
    cosoul?: GraphQLTypes['cosouls'] | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    description?: string | undefined;
    /** An object relationship */
    farcaster_account?: GraphQLTypes['farcaster_accounts'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    joined_colinks_at?: GraphQLTypes['timestamptz'] | undefined;
    /** An array relationship */
    link_holder: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    link_holder_aggregate: GraphQLTypes['link_holders_aggregate'];
    /** An array relationship */
    link_target: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    link_target_aggregate: GraphQLTypes['link_holders_aggregate'];
    links?: number | undefined;
    links_held?: number | undefined;
    name?: GraphQLTypes['citext'] | undefined;
    post_count?: GraphQLTypes['bigint'] | undefined;
    post_count_last_30_days?: GraphQLTypes['bigint'] | undefined;
    /** An array relationship */
    profile_skills: Array<GraphQLTypes['profile_skills']>;
    /** An object relationship */
    reputation_score?: GraphQLTypes['reputation_scores'] | undefined;
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
    /** An array relationship */
    activities: Array<GraphQLTypes['activities']>;
    /** An aggregate relationship */
    activities_aggregate: GraphQLTypes['activities_aggregate'];
    /** fetch data from the table: "activities" using primary key columns */
    activities_by_pk?: GraphQLTypes['activities'] | undefined;
    /** fetch data from the table: "big_questions" */
    big_questions: Array<GraphQLTypes['big_questions']>;
    /** fetch data from the table: "big_questions" using primary key columns */
    big_questions_by_pk?: GraphQLTypes['big_questions'] | undefined;
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
    /** fetch data from the table: "cosouls" */
    cosouls: Array<GraphQLTypes['cosouls']>;
    /** fetch data from the table: "cosouls" using primary key columns */
    cosouls_by_pk?: GraphQLTypes['cosouls'] | undefined;
    /** fetch data from the table: "enriched_casts" */
    enriched_casts: Array<GraphQLTypes['enriched_casts']>;
    /** fetch data from the table: "enriched_casts" using primary key columns */
    enriched_casts_by_pk?: GraphQLTypes['enriched_casts'] | undefined;
    /** fetch data from the table: "farcaster_accounts" */
    farcaster_accounts: Array<GraphQLTypes['farcaster_accounts']>;
    /** fetch data from the table: "farcaster_accounts" using primary key columns */
    farcaster_accounts_by_pk?: GraphQLTypes['farcaster_accounts'] | undefined;
    /** getCasts */
    getCasts: GraphQLTypes['GetCastsOutput'];
    /** fetch data from the table: "github_accounts" */
    github_accounts: Array<GraphQLTypes['github_accounts']>;
    /** fetch data from the table: "github_accounts" using primary key columns */
    github_accounts_by_pk?: GraphQLTypes['github_accounts'] | undefined;
    /** An array relationship */
    link_holders: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    link_holders_aggregate: GraphQLTypes['link_holders_aggregate'];
    /** fetch data from the table: "link_holders" using primary key columns */
    link_holders_by_pk?: GraphQLTypes['link_holders'] | undefined;
    /** fetch data from the table: "link_tx" */
    link_tx: Array<GraphQLTypes['link_tx']>;
    /** fetch data from the table: "link_tx" using primary key columns */
    link_tx_by_pk?: GraphQLTypes['link_tx'] | undefined;
    /** fetch data from the table: "poap_events" */
    poap_events: Array<GraphQLTypes['poap_events']>;
    /** fetch data from the table: "poap_events" using primary key columns */
    poap_events_by_pk?: GraphQLTypes['poap_events'] | undefined;
    /** fetch data from the table: "poap_holders" */
    poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** fetch aggregated fields from the table: "poap_holders" */
    poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
    /** fetch data from the table: "poap_holders" using primary key columns */
    poap_holders_by_pk?: GraphQLTypes['poap_holders'] | undefined;
    /** An array relationship */
    profile_skills: Array<GraphQLTypes['profile_skills']>;
    /** fetch data from the table: "profile_skills" using primary key columns */
    profile_skills_by_pk?: GraphQLTypes['profile_skills'] | undefined;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
    /** An array relationship */
    reactions: Array<GraphQLTypes['reactions']>;
    /** fetch data from the table: "reactions" using primary key columns */
    reactions_by_pk?: GraphQLTypes['reactions'] | undefined;
    /** An array relationship */
    replies: Array<GraphQLTypes['replies']>;
    /** fetch data from the table: "replies" using primary key columns */
    replies_by_pk?: GraphQLTypes['replies'] | undefined;
    /** fetch data from the table: "replies_reactions" */
    replies_reactions: Array<GraphQLTypes['replies_reactions']>;
    /** fetch data from the table: "replies_reactions" using primary key columns */
    replies_reactions_by_pk?: GraphQLTypes['replies_reactions'] | undefined;
    /** fetch data from the table: "reputation_scores" */
    reputation_scores: Array<GraphQLTypes['reputation_scores']>;
    /** fetch data from the table: "reputation_scores" using primary key columns */
    reputation_scores_by_pk?: GraphQLTypes['reputation_scores'] | undefined;
    /** execute function "search_replies" which returns "replies" */
    search_replies: Array<GraphQLTypes['replies']>;
    /** fetch data from the table: "skills" */
    skills: Array<GraphQLTypes['skills']>;
    /** fetch data from the table: "skills" using primary key columns */
    skills_by_pk?: GraphQLTypes['skills'] | undefined;
    /** fetch data from the table: "twitter_accounts" */
    twitter_accounts: Array<GraphQLTypes['twitter_accounts']>;
    /** fetch data from the table: "twitter_accounts" using primary key columns */
    twitter_accounts_by_pk?: GraphQLTypes['twitter_accounts'] | undefined;
    /** execute function "vector_search_poap_events" which returns "poap_events" */
    vector_search_poap_events: Array<GraphQLTypes['poap_events']>;
    /** execute function "vector_search_poap_holders" which returns "poap_holders" */
    vector_search_poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** execute function "vector_search_poap_holders" and query aggregates on result of table type "poap_holders" */
    vector_search_poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
  };
  /** columns and relationships of "reactions" */
  ['reactions']: {
    /** An object relationship */
    activity?: GraphQLTypes['activities'] | undefined;
    activity_id: number;
    created_at: GraphQLTypes['timestamptz'];
    id: GraphQLTypes['bigint'];
    profile_id: number;
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    reaction: string;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** order by aggregate values of table "reactions" */
  ['reactions_aggregate_order_by']: GraphQLTypes['reactions_aggregate_order_by'];
  /** order by avg() on columns of table "reactions" */
  ['reactions_avg_order_by']: GraphQLTypes['reactions_avg_order_by'];
  /** Boolean expression to filter rows from the table "reactions". All fields are combined with a logical 'AND'. */
  ['reactions_bool_exp']: GraphQLTypes['reactions_bool_exp'];
  /** order by max() on columns of table "reactions" */
  ['reactions_max_order_by']: GraphQLTypes['reactions_max_order_by'];
  /** order by min() on columns of table "reactions" */
  ['reactions_min_order_by']: GraphQLTypes['reactions_min_order_by'];
  /** Ordering options when selecting data from "reactions". */
  ['reactions_order_by']: GraphQLTypes['reactions_order_by'];
  /** select columns of table "reactions" */
  ['reactions_select_column']: GraphQLTypes['reactions_select_column'];
  /** order by stddev() on columns of table "reactions" */
  ['reactions_stddev_order_by']: GraphQLTypes['reactions_stddev_order_by'];
  /** order by stddev_pop() on columns of table "reactions" */
  ['reactions_stddev_pop_order_by']: GraphQLTypes['reactions_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "reactions" */
  ['reactions_stddev_samp_order_by']: GraphQLTypes['reactions_stddev_samp_order_by'];
  /** Streaming cursor of the table "reactions" */
  ['reactions_stream_cursor_input']: GraphQLTypes['reactions_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['reactions_stream_cursor_value_input']: GraphQLTypes['reactions_stream_cursor_value_input'];
  /** order by sum() on columns of table "reactions" */
  ['reactions_sum_order_by']: GraphQLTypes['reactions_sum_order_by'];
  /** order by var_pop() on columns of table "reactions" */
  ['reactions_var_pop_order_by']: GraphQLTypes['reactions_var_pop_order_by'];
  /** order by var_samp() on columns of table "reactions" */
  ['reactions_var_samp_order_by']: GraphQLTypes['reactions_var_samp_order_by'];
  /** order by variance() on columns of table "reactions" */
  ['reactions_variance_order_by']: GraphQLTypes['reactions_variance_order_by'];
  /** Replies to activity items */
  ['replies']: {
    /** An object relationship */
    activity: GraphQLTypes['activities'];
    activity_actor_id: number;
    activity_id: number;
    created_at: GraphQLTypes['timestamptz'];
    deleted_at?: GraphQLTypes['timestamptz'] | undefined;
    id: GraphQLTypes['bigint'];
    profile_id: number;
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    /** An array relationship */
    reactions: Array<GraphQLTypes['replies_reactions']>;
    reply: string;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** order by aggregate values of table "replies" */
  ['replies_aggregate_order_by']: GraphQLTypes['replies_aggregate_order_by'];
  /** order by avg() on columns of table "replies" */
  ['replies_avg_order_by']: GraphQLTypes['replies_avg_order_by'];
  /** Boolean expression to filter rows from the table "replies". All fields are combined with a logical 'AND'. */
  ['replies_bool_exp']: GraphQLTypes['replies_bool_exp'];
  /** order by max() on columns of table "replies" */
  ['replies_max_order_by']: GraphQLTypes['replies_max_order_by'];
  /** order by min() on columns of table "replies" */
  ['replies_min_order_by']: GraphQLTypes['replies_min_order_by'];
  /** Ordering options when selecting data from "replies". */
  ['replies_order_by']: GraphQLTypes['replies_order_by'];
  /** columns and relationships of "replies_reactions" */
  ['replies_reactions']: {
    /** An object relationship */
    activity?: GraphQLTypes['activities'] | undefined;
    activity_id: number;
    created_at: GraphQLTypes['timestamptz'];
    id: GraphQLTypes['bigint'];
    profile_id: number;
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    reaction: string;
    /** An object relationship */
    reply?: GraphQLTypes['replies'] | undefined;
    reply_id: number;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** order by aggregate values of table "replies_reactions" */
  ['replies_reactions_aggregate_order_by']: GraphQLTypes['replies_reactions_aggregate_order_by'];
  /** order by avg() on columns of table "replies_reactions" */
  ['replies_reactions_avg_order_by']: GraphQLTypes['replies_reactions_avg_order_by'];
  /** Boolean expression to filter rows from the table "replies_reactions". All fields are combined with a logical 'AND'. */
  ['replies_reactions_bool_exp']: GraphQLTypes['replies_reactions_bool_exp'];
  /** order by max() on columns of table "replies_reactions" */
  ['replies_reactions_max_order_by']: GraphQLTypes['replies_reactions_max_order_by'];
  /** order by min() on columns of table "replies_reactions" */
  ['replies_reactions_min_order_by']: GraphQLTypes['replies_reactions_min_order_by'];
  /** Ordering options when selecting data from "replies_reactions". */
  ['replies_reactions_order_by']: GraphQLTypes['replies_reactions_order_by'];
  /** select columns of table "replies_reactions" */
  ['replies_reactions_select_column']: GraphQLTypes['replies_reactions_select_column'];
  /** order by stddev() on columns of table "replies_reactions" */
  ['replies_reactions_stddev_order_by']: GraphQLTypes['replies_reactions_stddev_order_by'];
  /** order by stddev_pop() on columns of table "replies_reactions" */
  ['replies_reactions_stddev_pop_order_by']: GraphQLTypes['replies_reactions_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "replies_reactions" */
  ['replies_reactions_stddev_samp_order_by']: GraphQLTypes['replies_reactions_stddev_samp_order_by'];
  /** Streaming cursor of the table "replies_reactions" */
  ['replies_reactions_stream_cursor_input']: GraphQLTypes['replies_reactions_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['replies_reactions_stream_cursor_value_input']: GraphQLTypes['replies_reactions_stream_cursor_value_input'];
  /** order by sum() on columns of table "replies_reactions" */
  ['replies_reactions_sum_order_by']: GraphQLTypes['replies_reactions_sum_order_by'];
  /** order by var_pop() on columns of table "replies_reactions" */
  ['replies_reactions_var_pop_order_by']: GraphQLTypes['replies_reactions_var_pop_order_by'];
  /** order by var_samp() on columns of table "replies_reactions" */
  ['replies_reactions_var_samp_order_by']: GraphQLTypes['replies_reactions_var_samp_order_by'];
  /** order by variance() on columns of table "replies_reactions" */
  ['replies_reactions_variance_order_by']: GraphQLTypes['replies_reactions_variance_order_by'];
  /** select columns of table "replies" */
  ['replies_select_column']: GraphQLTypes['replies_select_column'];
  /** order by stddev() on columns of table "replies" */
  ['replies_stddev_order_by']: GraphQLTypes['replies_stddev_order_by'];
  /** order by stddev_pop() on columns of table "replies" */
  ['replies_stddev_pop_order_by']: GraphQLTypes['replies_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "replies" */
  ['replies_stddev_samp_order_by']: GraphQLTypes['replies_stddev_samp_order_by'];
  /** Streaming cursor of the table "replies" */
  ['replies_stream_cursor_input']: GraphQLTypes['replies_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['replies_stream_cursor_value_input']: GraphQLTypes['replies_stream_cursor_value_input'];
  /** order by sum() on columns of table "replies" */
  ['replies_sum_order_by']: GraphQLTypes['replies_sum_order_by'];
  /** order by var_pop() on columns of table "replies" */
  ['replies_var_pop_order_by']: GraphQLTypes['replies_var_pop_order_by'];
  /** order by var_samp() on columns of table "replies" */
  ['replies_var_samp_order_by']: GraphQLTypes['replies_var_samp_order_by'];
  /** order by variance() on columns of table "replies" */
  ['replies_variance_order_by']: GraphQLTypes['replies_variance_order_by'];
  /** columns and relationships of "reputation_scores" */
  ['reputation_scores']: {
    colinks_engagement_score?: number | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    email_score: number;
    github_score: number;
    invite_score: number;
    linkedin_score: number;
    links_score: number;
    pgive_score: number;
    poap_score: number;
    profile_id: GraphQLTypes['bigint'];
    total_score: number;
    twitter_score: number;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** Boolean expression to filter rows from the table "reputation_scores". All fields are combined with a logical 'AND'. */
  ['reputation_scores_bool_exp']: GraphQLTypes['reputation_scores_bool_exp'];
  /** Ordering options when selecting data from "reputation_scores". */
  ['reputation_scores_order_by']: GraphQLTypes['reputation_scores_order_by'];
  /** select columns of table "reputation_scores" */
  ['reputation_scores_select_column']: GraphQLTypes['reputation_scores_select_column'];
  /** Streaming cursor of the table "reputation_scores" */
  ['reputation_scores_stream_cursor_input']: GraphQLTypes['reputation_scores_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['reputation_scores_stream_cursor_value_input']: GraphQLTypes['reputation_scores_stream_cursor_value_input'];
  ['search_replies_args']: GraphQLTypes['search_replies_args'];
  /** columns and relationships of "skills" */
  ['skills']: {
    count: number;
    created_at: GraphQLTypes['timestamptz'];
    hidden: boolean;
    name: GraphQLTypes['citext'];
    /** An object relationship */
    profile_skills?: GraphQLTypes['profile_skills'] | undefined;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** Boolean expression to filter rows from the table "skills". All fields are combined with a logical 'AND'. */
  ['skills_bool_exp']: GraphQLTypes['skills_bool_exp'];
  /** Ordering options when selecting data from "skills". */
  ['skills_order_by']: GraphQLTypes['skills_order_by'];
  /** select columns of table "skills" */
  ['skills_select_column']: GraphQLTypes['skills_select_column'];
  /** Streaming cursor of the table "skills" */
  ['skills_stream_cursor_input']: GraphQLTypes['skills_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['skills_stream_cursor_value_input']: GraphQLTypes['skills_stream_cursor_value_input'];
  ['smallint']: any;
  /** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
  ['smallint_array_comparison_exp']: GraphQLTypes['smallint_array_comparison_exp'];
  ['subscription_root']: {
    /** An array relationship */
    activities: Array<GraphQLTypes['activities']>;
    /** An aggregate relationship */
    activities_aggregate: GraphQLTypes['activities_aggregate'];
    /** fetch data from the table: "activities" using primary key columns */
    activities_by_pk?: GraphQLTypes['activities'] | undefined;
    /** fetch data from the table in a streaming manner: "activities" */
    activities_stream: Array<GraphQLTypes['activities']>;
    /** fetch data from the table: "big_questions" */
    big_questions: Array<GraphQLTypes['big_questions']>;
    /** fetch data from the table: "big_questions" using primary key columns */
    big_questions_by_pk?: GraphQLTypes['big_questions'] | undefined;
    /** fetch data from the table in a streaming manner: "big_questions" */
    big_questions_stream: Array<GraphQLTypes['big_questions']>;
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
    /** fetch data from the table: "cosouls" */
    cosouls: Array<GraphQLTypes['cosouls']>;
    /** fetch data from the table: "cosouls" using primary key columns */
    cosouls_by_pk?: GraphQLTypes['cosouls'] | undefined;
    /** fetch data from the table in a streaming manner: "cosouls" */
    cosouls_stream: Array<GraphQLTypes['cosouls']>;
    /** fetch data from the table: "enriched_casts" */
    enriched_casts: Array<GraphQLTypes['enriched_casts']>;
    /** fetch data from the table: "enriched_casts" using primary key columns */
    enriched_casts_by_pk?: GraphQLTypes['enriched_casts'] | undefined;
    /** fetch data from the table in a streaming manner: "enriched_casts" */
    enriched_casts_stream: Array<GraphQLTypes['enriched_casts']>;
    /** fetch data from the table: "farcaster_accounts" */
    farcaster_accounts: Array<GraphQLTypes['farcaster_accounts']>;
    /** fetch data from the table: "farcaster_accounts" using primary key columns */
    farcaster_accounts_by_pk?: GraphQLTypes['farcaster_accounts'] | undefined;
    /** fetch data from the table in a streaming manner: "farcaster_accounts" */
    farcaster_accounts_stream: Array<GraphQLTypes['farcaster_accounts']>;
    /** fetch data from the table: "github_accounts" */
    github_accounts: Array<GraphQLTypes['github_accounts']>;
    /** fetch data from the table: "github_accounts" using primary key columns */
    github_accounts_by_pk?: GraphQLTypes['github_accounts'] | undefined;
    /** fetch data from the table in a streaming manner: "github_accounts" */
    github_accounts_stream: Array<GraphQLTypes['github_accounts']>;
    /** An array relationship */
    link_holders: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    link_holders_aggregate: GraphQLTypes['link_holders_aggregate'];
    /** fetch data from the table: "link_holders" using primary key columns */
    link_holders_by_pk?: GraphQLTypes['link_holders'] | undefined;
    /** fetch data from the table in a streaming manner: "link_holders" */
    link_holders_stream: Array<GraphQLTypes['link_holders']>;
    /** fetch data from the table: "link_tx" */
    link_tx: Array<GraphQLTypes['link_tx']>;
    /** fetch data from the table: "link_tx" using primary key columns */
    link_tx_by_pk?: GraphQLTypes['link_tx'] | undefined;
    /** fetch data from the table in a streaming manner: "link_tx" */
    link_tx_stream: Array<GraphQLTypes['link_tx']>;
    /** fetch data from the table: "poap_events" */
    poap_events: Array<GraphQLTypes['poap_events']>;
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
    /** An array relationship */
    profile_skills: Array<GraphQLTypes['profile_skills']>;
    /** fetch data from the table: "profile_skills" using primary key columns */
    profile_skills_by_pk?: GraphQLTypes['profile_skills'] | undefined;
    /** fetch data from the table in a streaming manner: "profile_skills" */
    profile_skills_stream: Array<GraphQLTypes['profile_skills']>;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
    /** fetch data from the table in a streaming manner: "profiles_public" */
    profiles_public_stream: Array<GraphQLTypes['profiles_public']>;
    /** An array relationship */
    reactions: Array<GraphQLTypes['reactions']>;
    /** fetch data from the table: "reactions" using primary key columns */
    reactions_by_pk?: GraphQLTypes['reactions'] | undefined;
    /** fetch data from the table in a streaming manner: "reactions" */
    reactions_stream: Array<GraphQLTypes['reactions']>;
    /** An array relationship */
    replies: Array<GraphQLTypes['replies']>;
    /** fetch data from the table: "replies" using primary key columns */
    replies_by_pk?: GraphQLTypes['replies'] | undefined;
    /** fetch data from the table: "replies_reactions" */
    replies_reactions: Array<GraphQLTypes['replies_reactions']>;
    /** fetch data from the table: "replies_reactions" using primary key columns */
    replies_reactions_by_pk?: GraphQLTypes['replies_reactions'] | undefined;
    /** fetch data from the table in a streaming manner: "replies_reactions" */
    replies_reactions_stream: Array<GraphQLTypes['replies_reactions']>;
    /** fetch data from the table in a streaming manner: "replies" */
    replies_stream: Array<GraphQLTypes['replies']>;
    /** fetch data from the table: "reputation_scores" */
    reputation_scores: Array<GraphQLTypes['reputation_scores']>;
    /** fetch data from the table: "reputation_scores" using primary key columns */
    reputation_scores_by_pk?: GraphQLTypes['reputation_scores'] | undefined;
    /** fetch data from the table in a streaming manner: "reputation_scores" */
    reputation_scores_stream: Array<GraphQLTypes['reputation_scores']>;
    /** execute function "search_replies" which returns "replies" */
    search_replies: Array<GraphQLTypes['replies']>;
    /** fetch data from the table: "skills" */
    skills: Array<GraphQLTypes['skills']>;
    /** fetch data from the table: "skills" using primary key columns */
    skills_by_pk?: GraphQLTypes['skills'] | undefined;
    /** fetch data from the table in a streaming manner: "skills" */
    skills_stream: Array<GraphQLTypes['skills']>;
    /** fetch data from the table: "twitter_accounts" */
    twitter_accounts: Array<GraphQLTypes['twitter_accounts']>;
    /** fetch data from the table: "twitter_accounts" using primary key columns */
    twitter_accounts_by_pk?: GraphQLTypes['twitter_accounts'] | undefined;
    /** fetch data from the table in a streaming manner: "twitter_accounts" */
    twitter_accounts_stream: Array<GraphQLTypes['twitter_accounts']>;
    /** execute function "vector_search_poap_events" which returns "poap_events" */
    vector_search_poap_events: Array<GraphQLTypes['poap_events']>;
    /** execute function "vector_search_poap_holders" which returns "poap_holders" */
    vector_search_poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** execute function "vector_search_poap_holders" and query aggregates on result of table type "poap_holders" */
    vector_search_poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
  };
  ['timestamp']: any;
  /** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
  ['timestamp_comparison_exp']: GraphQLTypes['timestamp_comparison_exp'];
  ['timestamptz']: any;
  /** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
  ['timestamptz_comparison_exp']: GraphQLTypes['timestamptz_comparison_exp'];
  /** twitter accounts connected to profiles */
  ['twitter_accounts']: {
    id: string;
    profile_id: number;
    username: string;
  };
  /** Boolean expression to filter rows from the table "twitter_accounts". All fields are combined with a logical 'AND'. */
  ['twitter_accounts_bool_exp']: GraphQLTypes['twitter_accounts_bool_exp'];
  /** Ordering options when selecting data from "twitter_accounts". */
  ['twitter_accounts_order_by']: GraphQLTypes['twitter_accounts_order_by'];
  /** select columns of table "twitter_accounts" */
  ['twitter_accounts_select_column']: GraphQLTypes['twitter_accounts_select_column'];
  /** Streaming cursor of the table "twitter_accounts" */
  ['twitter_accounts_stream_cursor_input']: GraphQLTypes['twitter_accounts_stream_cursor_input'];
  /** Initial value of the column from where the streaming should start */
  ['twitter_accounts_stream_cursor_value_input']: GraphQLTypes['twitter_accounts_stream_cursor_value_input'];
  ['vector']: any;
  ['vector_search_poap_events_args']: GraphQLTypes['vector_search_poap_events_args'];
  ['vector_search_poap_holders_args']: GraphQLTypes['vector_search_poap_holders_args'];
};

export type GraphQLTypes = {
  /** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
  ['Boolean_comparison_exp']: {
    _eq?: boolean | undefined;
    _gt?: boolean | undefined;
    _gte?: boolean | undefined;
    _in?: Array<boolean> | undefined;
    _is_null?: boolean | undefined;
    _lt?: boolean | undefined;
    _lte?: boolean | undefined;
    _neq?: boolean | undefined;
    _nin?: Array<boolean> | undefined;
  };
  ['Cast']: {
    __typename: 'Cast';
    address: string;
    avatar_url: string;
    created_at: string;
    embeds: Array<GraphQLTypes['CastEmbed']>;
    fid: GraphQLTypes['bigint'];
    fname: string;
    hash: string;
    id: GraphQLTypes['bigint'];
    like_count: number;
    mentioned_addresses: Array<GraphQLTypes['CastMention']>;
    recast_count: number;
    replies_count: number;
    text: string;
    text_with_mentions: string;
  };
  ['CastEmbed']: {
    __typename: 'CastEmbed';
    type: string;
    url: string;
  };
  ['CastMention']: {
    __typename: 'CastMention';
    address: string;
    fname: string;
  };
  ['GetCastsInput']: {
    cast_ids?: Array<GraphQLTypes['bigint']> | undefined;
    fid?: GraphQLTypes['bigint'] | undefined;
  };
  ['GetCastsOutput']: {
    __typename: 'GetCastsOutput';
    casts: Array<GraphQLTypes['Cast']>;
  };
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
  /** Table containing activity on our platform */
  ['activities']: {
    __typename: 'activities';
    action: string;
    actor_profile_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    actor_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    /** An object relationship */
    big_question?: GraphQLTypes['big_questions'] | undefined;
    big_question_id?: GraphQLTypes['bigint'] | undefined;
    cast_id?: GraphQLTypes['bigint'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    contribution_id?: GraphQLTypes['bigint'] | undefined;
    created_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    enriched_cast?: GraphQLTypes['enriched_casts'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    /** An array relationship */
    gives: Array<GraphQLTypes['colinks_gives']>;
    /** An aggregate relationship */
    gives_aggregate: GraphQLTypes['colinks_gives_aggregate'];
    id: GraphQLTypes['bigint'];
    organization_id?: GraphQLTypes['bigint'] | undefined;
    private_stream: boolean;
    reaction_count: number;
    /** An array relationship */
    reactions: Array<GraphQLTypes['reactions']>;
    /** An array relationship */
    replies: Array<GraphQLTypes['replies']>;
    reply_count: number;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    target_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    updated_at: GraphQLTypes['timestamptz'];
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** aggregated selection of "activities" */
  ['activities_aggregate']: {
    __typename: 'activities_aggregate';
    aggregate?: GraphQLTypes['activities_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['activities']>;
  };
  ['activities_aggregate_bool_exp']: {
    bool_and?:
      | GraphQLTypes['activities_aggregate_bool_exp_bool_and']
      | undefined;
    bool_or?: GraphQLTypes['activities_aggregate_bool_exp_bool_or'] | undefined;
    count?: GraphQLTypes['activities_aggregate_bool_exp_count'] | undefined;
  };
  ['activities_aggregate_bool_exp_bool_and']: {
    arguments: GraphQLTypes['activities_select_column_activities_aggregate_bool_exp_bool_and_arguments_columns'];
    distinct?: boolean | undefined;
    filter?: GraphQLTypes['activities_bool_exp'] | undefined;
    predicate: GraphQLTypes['Boolean_comparison_exp'];
  };
  ['activities_aggregate_bool_exp_bool_or']: {
    arguments: GraphQLTypes['activities_select_column_activities_aggregate_bool_exp_bool_or_arguments_columns'];
    distinct?: boolean | undefined;
    filter?: GraphQLTypes['activities_bool_exp'] | undefined;
    predicate: GraphQLTypes['Boolean_comparison_exp'];
  };
  ['activities_aggregate_bool_exp_count']: {
    arguments?: Array<GraphQLTypes['activities_select_column']> | undefined;
    distinct?: boolean | undefined;
    filter?: GraphQLTypes['activities_bool_exp'] | undefined;
    predicate: GraphQLTypes['Int_comparison_exp'];
  };
  /** aggregate fields of "activities" */
  ['activities_aggregate_fields']: {
    __typename: 'activities_aggregate_fields';
    avg?: GraphQLTypes['activities_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['activities_max_fields'] | undefined;
    min?: GraphQLTypes['activities_min_fields'] | undefined;
    stddev?: GraphQLTypes['activities_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['activities_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['activities_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['activities_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['activities_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['activities_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['activities_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "activities" */
  ['activities_aggregate_order_by']: {
    avg?: GraphQLTypes['activities_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['activities_max_order_by'] | undefined;
    min?: GraphQLTypes['activities_min_order_by'] | undefined;
    stddev?: GraphQLTypes['activities_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['activities_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['activities_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['activities_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['activities_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['activities_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['activities_variance_order_by'] | undefined;
  };
  /** aggregate avg on columns */
  ['activities_avg_fields']: {
    __typename: 'activities_avg_fields';
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by avg() on columns of table "activities" */
  ['activities_avg_order_by']: {
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "activities". All fields are combined with a logical 'AND'. */
  ['activities_bool_exp']: {
    _and?: Array<GraphQLTypes['activities_bool_exp']> | undefined;
    _not?: GraphQLTypes['activities_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['activities_bool_exp']> | undefined;
    action?: GraphQLTypes['String_comparison_exp'] | undefined;
    actor_profile_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    actor_profile_public?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    big_question?: GraphQLTypes['big_questions_bool_exp'] | undefined;
    big_question_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    cast_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    circle_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    contribution_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    enriched_cast?: GraphQLTypes['enriched_casts_bool_exp'] | undefined;
    epoch_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    gives?: GraphQLTypes['colinks_gives_bool_exp'] | undefined;
    gives_aggregate?:
      | GraphQLTypes['colinks_gives_aggregate_bool_exp']
      | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    organization_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    private_stream?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    reaction_count?: GraphQLTypes['Int_comparison_exp'] | undefined;
    reactions?: GraphQLTypes['reactions_bool_exp'] | undefined;
    replies?: GraphQLTypes['replies_bool_exp'] | undefined;
    reply_count?: GraphQLTypes['Int_comparison_exp'] | undefined;
    target_profile_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    target_profile_public?:
      | GraphQLTypes['profiles_public_bool_exp']
      | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    user_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
  };
  /** aggregate max on columns */
  ['activities_max_fields']: {
    __typename: 'activities_max_fields';
    action?: string | undefined;
    actor_profile_id?: GraphQLTypes['bigint'] | undefined;
    big_question_id?: GraphQLTypes['bigint'] | undefined;
    cast_id?: GraphQLTypes['bigint'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    contribution_id?: GraphQLTypes['bigint'] | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    organization_id?: GraphQLTypes['bigint'] | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by max() on columns of table "activities" */
  ['activities_max_order_by']: {
    action?: GraphQLTypes['order_by'] | undefined;
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate min on columns */
  ['activities_min_fields']: {
    __typename: 'activities_min_fields';
    action?: string | undefined;
    actor_profile_id?: GraphQLTypes['bigint'] | undefined;
    big_question_id?: GraphQLTypes['bigint'] | undefined;
    cast_id?: GraphQLTypes['bigint'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    contribution_id?: GraphQLTypes['bigint'] | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    organization_id?: GraphQLTypes['bigint'] | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by min() on columns of table "activities" */
  ['activities_min_order_by']: {
    action?: GraphQLTypes['order_by'] | undefined;
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "activities". */
  ['activities_order_by']: {
    action?: GraphQLTypes['order_by'] | undefined;
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    actor_profile_public?: GraphQLTypes['profiles_public_order_by'] | undefined;
    big_question?: GraphQLTypes['big_questions_order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    enriched_cast?: GraphQLTypes['enriched_casts_order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    gives_aggregate?:
      | GraphQLTypes['colinks_gives_aggregate_order_by']
      | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    private_stream?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reactions_aggregate?:
      | GraphQLTypes['reactions_aggregate_order_by']
      | undefined;
    replies_aggregate?: GraphQLTypes['replies_aggregate_order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    target_profile_public?:
      | GraphQLTypes['profiles_public_order_by']
      | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "activities" */
  ['activities_select_column']: activities_select_column;
  /** select "activities_aggregate_bool_exp_bool_and_arguments_columns" columns of table "activities" */
  ['activities_select_column_activities_aggregate_bool_exp_bool_and_arguments_columns']: activities_select_column_activities_aggregate_bool_exp_bool_and_arguments_columns;
  /** select "activities_aggregate_bool_exp_bool_or_arguments_columns" columns of table "activities" */
  ['activities_select_column_activities_aggregate_bool_exp_bool_or_arguments_columns']: activities_select_column_activities_aggregate_bool_exp_bool_or_arguments_columns;
  /** aggregate stddev on columns */
  ['activities_stddev_fields']: {
    __typename: 'activities_stddev_fields';
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by stddev() on columns of table "activities" */
  ['activities_stddev_order_by']: {
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_pop on columns */
  ['activities_stddev_pop_fields']: {
    __typename: 'activities_stddev_pop_fields';
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "activities" */
  ['activities_stddev_pop_order_by']: {
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_samp on columns */
  ['activities_stddev_samp_fields']: {
    __typename: 'activities_stddev_samp_fields';
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "activities" */
  ['activities_stddev_samp_order_by']: {
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Streaming cursor of the table "activities" */
  ['activities_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['activities_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['activities_stream_cursor_value_input']: {
    action?: string | undefined;
    actor_profile_id?: GraphQLTypes['bigint'] | undefined;
    big_question_id?: GraphQLTypes['bigint'] | undefined;
    cast_id?: GraphQLTypes['bigint'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    contribution_id?: GraphQLTypes['bigint'] | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    organization_id?: GraphQLTypes['bigint'] | undefined;
    private_stream?: boolean | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** aggregate sum on columns */
  ['activities_sum_fields']: {
    __typename: 'activities_sum_fields';
    actor_profile_id?: GraphQLTypes['bigint'] | undefined;
    big_question_id?: GraphQLTypes['bigint'] | undefined;
    cast_id?: GraphQLTypes['bigint'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    contribution_id?: GraphQLTypes['bigint'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    organization_id?: GraphQLTypes['bigint'] | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: GraphQLTypes['bigint'] | undefined;
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by sum() on columns of table "activities" */
  ['activities_sum_order_by']: {
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_pop on columns */
  ['activities_var_pop_fields']: {
    __typename: 'activities_var_pop_fields';
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by var_pop() on columns of table "activities" */
  ['activities_var_pop_order_by']: {
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_samp on columns */
  ['activities_var_samp_fields']: {
    __typename: 'activities_var_samp_fields';
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by var_samp() on columns of table "activities" */
  ['activities_var_samp_order_by']: {
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate variance on columns */
  ['activities_variance_fields']: {
    __typename: 'activities_variance_fields';
    actor_profile_id?: number | undefined;
    big_question_id?: number | undefined;
    cast_id?: number | undefined;
    circle_id?: number | undefined;
    contribution_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    organization_id?: number | undefined;
    reaction_count?: number | undefined;
    reply_count?: number | undefined;
    target_profile_id?: number | undefined;
    user_id?: number | undefined;
  };
  /** order by variance() on columns of table "activities" */
  ['activities_variance_order_by']: {
    actor_profile_id?: GraphQLTypes['order_by'] | undefined;
    big_question_id?: GraphQLTypes['order_by'] | undefined;
    cast_id?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    contribution_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    organization_id?: GraphQLTypes['order_by'] | undefined;
    reaction_count?: GraphQLTypes['order_by'] | undefined;
    reply_count?: GraphQLTypes['order_by'] | undefined;
    target_profile_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "big_questions" */
  ['big_questions']: {
    __typename: 'big_questions';
    /** An array relationship */
    activities: Array<GraphQLTypes['activities']>;
    /** An aggregate relationship */
    activities_aggregate: GraphQLTypes['activities_aggregate'];
    cover_image_url: string;
    created_at: GraphQLTypes['timestamp'];
    css_background_position?: string | undefined;
    description?: string | undefined;
    expire_at?: GraphQLTypes['timestamp'] | undefined;
    id: GraphQLTypes['bigint'];
    prompt: string;
    publish_at?: GraphQLTypes['timestamp'] | undefined;
    updated_at: GraphQLTypes['timestamp'];
  };
  /** Boolean expression to filter rows from the table "big_questions". All fields are combined with a logical 'AND'. */
  ['big_questions_bool_exp']: {
    _and?: Array<GraphQLTypes['big_questions_bool_exp']> | undefined;
    _not?: GraphQLTypes['big_questions_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['big_questions_bool_exp']> | undefined;
    activities?: GraphQLTypes['activities_bool_exp'] | undefined;
    activities_aggregate?:
      | GraphQLTypes['activities_aggregate_bool_exp']
      | undefined;
    cover_image_url?: GraphQLTypes['String_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    css_background_position?: GraphQLTypes['String_comparison_exp'] | undefined;
    description?: GraphQLTypes['String_comparison_exp'] | undefined;
    expire_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    prompt?: GraphQLTypes['String_comparison_exp'] | undefined;
    publish_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "big_questions". */
  ['big_questions_order_by']: {
    activities_aggregate?:
      | GraphQLTypes['activities_aggregate_order_by']
      | undefined;
    cover_image_url?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    css_background_position?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
    expire_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    prompt?: GraphQLTypes['order_by'] | undefined;
    publish_at?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "big_questions" */
  ['big_questions_select_column']: big_questions_select_column;
  /** Streaming cursor of the table "big_questions" */
  ['big_questions_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['big_questions_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['big_questions_stream_cursor_value_input']: {
    cover_image_url?: string | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    css_background_position?: string | undefined;
    description?: string | undefined;
    expire_at?: GraphQLTypes['timestamp'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    prompt?: string | undefined;
    publish_at?: GraphQLTypes['timestamp'] | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
  };
  ['bigint']: any;
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_array_comparison_exp']: {
    /** is the array contained in the given array value */
    _contained_in?: Array<GraphQLTypes['bigint']> | undefined;
    /** does the array contain the given value */
    _contains?: Array<GraphQLTypes['bigint']> | undefined;
    _eq?: Array<GraphQLTypes['bigint']> | undefined;
    _gt?: Array<GraphQLTypes['bigint']> | undefined;
    _gte?: Array<GraphQLTypes['bigint']> | undefined;
    _in?: Array<Array<GraphQLTypes['bigint']> | undefined>;
    _is_null?: boolean | undefined;
    _lt?: Array<GraphQLTypes['bigint']> | undefined;
    _lte?: Array<GraphQLTypes['bigint']> | undefined;
    _neq?: Array<GraphQLTypes['bigint']> | undefined;
    _nin?: Array<Array<GraphQLTypes['bigint']> | undefined>;
  };
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
  ['bytea']: any;
  /** Boolean expression to compare columns of type "bytea". All fields are combined with logical 'AND'. */
  ['bytea_comparison_exp']: {
    _eq?: GraphQLTypes['bytea'] | undefined;
    _gt?: GraphQLTypes['bytea'] | undefined;
    _gte?: GraphQLTypes['bytea'] | undefined;
    _in?: Array<GraphQLTypes['bytea']> | undefined;
    _is_null?: boolean | undefined;
    _lt?: GraphQLTypes['bytea'] | undefined;
    _lte?: GraphQLTypes['bytea'] | undefined;
    _neq?: GraphQLTypes['bytea'] | undefined;
    _nin?: Array<GraphQLTypes['bytea']> | undefined;
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
    attestation_uid?: string | undefined;
    cast_hash?: string | undefined;
    created_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    give_skill?: GraphQLTypes['skills'] | undefined;
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
    attestation_uid?: GraphQLTypes['String_comparison_exp'] | undefined;
    cast_hash?: GraphQLTypes['String_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    give_skill?: GraphQLTypes['skills_bool_exp'] | undefined;
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
    attestation_uid?: string | undefined;
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
    attestation_uid?: GraphQLTypes['order_by'] | undefined;
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
    attestation_uid?: string | undefined;
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
    attestation_uid?: GraphQLTypes['order_by'] | undefined;
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
    attestation_uid?: GraphQLTypes['order_by'] | undefined;
    cast_hash?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    give_skill?: GraphQLTypes['skills_order_by'] | undefined;
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
    /** An object relationship */
    skill_info?: GraphQLTypes['skills'] | undefined;
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
    skill_info?: GraphQLTypes['skills_bool_exp'] | undefined;
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
    skill_info?: GraphQLTypes['skills_order_by'] | undefined;
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
    attestation_uid?: string | undefined;
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
  /** local db copy of last synced on-chain cosoul data */
  ['cosouls']: {
    __typename: 'cosouls';
    address: GraphQLTypes['citext'];
    checked_at?: GraphQLTypes['timestamptz'] | undefined;
    created_at: GraphQLTypes['timestamptz'];
    created_tx_hash: string;
    /** An array relationship */
    held_links: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    held_links_aggregate: GraphQLTypes['link_holders_aggregate'];
    id: number;
    /** An array relationship */
    link_holders: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    link_holders_aggregate: GraphQLTypes['link_holders_aggregate'];
    pgive?: number | undefined;
    /** An array relationship */
    poaps: Array<GraphQLTypes['poap_holders']>;
    /** An aggregate relationship */
    poaps_aggregate: GraphQLTypes['poap_holders_aggregate'];
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    synced_at?: GraphQLTypes['timestamptz'] | undefined;
    token_id: number;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** Boolean expression to filter rows from the table "cosouls". All fields are combined with a logical 'AND'. */
  ['cosouls_bool_exp']: {
    _and?: Array<GraphQLTypes['cosouls_bool_exp']> | undefined;
    _not?: GraphQLTypes['cosouls_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['cosouls_bool_exp']> | undefined;
    address?: GraphQLTypes['citext_comparison_exp'] | undefined;
    checked_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    created_tx_hash?: GraphQLTypes['String_comparison_exp'] | undefined;
    held_links?: GraphQLTypes['link_holders_bool_exp'] | undefined;
    held_links_aggregate?:
      | GraphQLTypes['link_holders_aggregate_bool_exp']
      | undefined;
    id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    link_holders?: GraphQLTypes['link_holders_bool_exp'] | undefined;
    link_holders_aggregate?:
      | GraphQLTypes['link_holders_aggregate_bool_exp']
      | undefined;
    pgive?: GraphQLTypes['Int_comparison_exp'] | undefined;
    poaps?: GraphQLTypes['poap_holders_bool_exp'] | undefined;
    poaps_aggregate?:
      | GraphQLTypes['poap_holders_aggregate_bool_exp']
      | undefined;
    profile_public?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    synced_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    token_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "cosouls". */
  ['cosouls_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    checked_at?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_tx_hash?: GraphQLTypes['order_by'] | undefined;
    held_links_aggregate?:
      | GraphQLTypes['link_holders_aggregate_order_by']
      | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    link_holders_aggregate?:
      | GraphQLTypes['link_holders_aggregate_order_by']
      | undefined;
    pgive?: GraphQLTypes['order_by'] | undefined;
    poaps_aggregate?:
      | GraphQLTypes['poap_holders_aggregate_order_by']
      | undefined;
    profile_public?: GraphQLTypes['profiles_public_order_by'] | undefined;
    synced_at?: GraphQLTypes['order_by'] | undefined;
    token_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
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
    checked_at?: GraphQLTypes['timestamptz'] | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    created_tx_hash?: string | undefined;
    id?: number | undefined;
    pgive?: number | undefined;
    synced_at?: GraphQLTypes['timestamptz'] | undefined;
    token_id?: number | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
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
  /** farcaster casts that we actually care about, with some materialized fields */
  ['enriched_casts']: {
    __typename: 'enriched_casts';
    created_at: GraphQLTypes['timestamp'];
    deleted_at?: GraphQLTypes['timestamp'] | undefined;
    embeds: GraphQLTypes['jsonb'];
    fid: GraphQLTypes['bigint'];
    hash: GraphQLTypes['bytea'];
    id: GraphQLTypes['bigint'];
    mentions: Array<GraphQLTypes['bigint']>;
    mentions_positions: Array<GraphQLTypes['smallint']>;
    parent_fid?: GraphQLTypes['bigint'] | undefined;
    parent_hash?: GraphQLTypes['bytea'] | undefined;
    parent_url?: string | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    root_parent_hash?: GraphQLTypes['bytea'] | undefined;
    root_parent_url?: string | undefined;
    text: string;
    timestamp: GraphQLTypes['timestamp'];
    updated_at: GraphQLTypes['timestamp'];
  };
  /** Boolean expression to filter rows from the table "enriched_casts". All fields are combined with a logical 'AND'. */
  ['enriched_casts_bool_exp']: {
    _and?: Array<GraphQLTypes['enriched_casts_bool_exp']> | undefined;
    _not?: GraphQLTypes['enriched_casts_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['enriched_casts_bool_exp']> | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    deleted_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    embeds?: GraphQLTypes['jsonb_comparison_exp'] | undefined;
    fid?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    hash?: GraphQLTypes['bytea_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    mentions?: GraphQLTypes['bigint_array_comparison_exp'] | undefined;
    mentions_positions?:
      | GraphQLTypes['smallint_array_comparison_exp']
      | undefined;
    parent_fid?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    parent_hash?: GraphQLTypes['bytea_comparison_exp'] | undefined;
    parent_url?: GraphQLTypes['String_comparison_exp'] | undefined;
    profile_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    profile_public?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    root_parent_hash?: GraphQLTypes['bytea_comparison_exp'] | undefined;
    root_parent_url?: GraphQLTypes['String_comparison_exp'] | undefined;
    text?: GraphQLTypes['String_comparison_exp'] | undefined;
    timestamp?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "enriched_casts". */
  ['enriched_casts_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    deleted_at?: GraphQLTypes['order_by'] | undefined;
    embeds?: GraphQLTypes['order_by'] | undefined;
    fid?: GraphQLTypes['order_by'] | undefined;
    hash?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    mentions?: GraphQLTypes['order_by'] | undefined;
    mentions_positions?: GraphQLTypes['order_by'] | undefined;
    parent_fid?: GraphQLTypes['order_by'] | undefined;
    parent_hash?: GraphQLTypes['order_by'] | undefined;
    parent_url?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    profile_public?: GraphQLTypes['profiles_public_order_by'] | undefined;
    root_parent_hash?: GraphQLTypes['order_by'] | undefined;
    root_parent_url?: GraphQLTypes['order_by'] | undefined;
    text?: GraphQLTypes['order_by'] | undefined;
    timestamp?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "enriched_casts" */
  ['enriched_casts_select_column']: enriched_casts_select_column;
  /** Streaming cursor of the table "enriched_casts" */
  ['enriched_casts_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['enriched_casts_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['enriched_casts_stream_cursor_value_input']: {
    created_at?: GraphQLTypes['timestamp'] | undefined;
    deleted_at?: GraphQLTypes['timestamp'] | undefined;
    embeds?: GraphQLTypes['jsonb'] | undefined;
    fid?: GraphQLTypes['bigint'] | undefined;
    hash?: GraphQLTypes['bytea'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    mentions?: Array<GraphQLTypes['bigint']> | undefined;
    mentions_positions?: Array<GraphQLTypes['smallint']> | undefined;
    parent_fid?: GraphQLTypes['bigint'] | undefined;
    parent_hash?: GraphQLTypes['bytea'] | undefined;
    parent_url?: string | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    root_parent_hash?: GraphQLTypes['bytea'] | undefined;
    root_parent_url?: string | undefined;
    text?: string | undefined;
    timestamp?: GraphQLTypes['timestamp'] | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
  };
  /** columns and relationships of "farcaster_accounts" */
  ['farcaster_accounts']: {
    __typename: 'farcaster_accounts';
    bio_text?: string | undefined;
    created_at: GraphQLTypes['timestamptz'];
    custody_address: string;
    fid: GraphQLTypes['bigint'];
    followers_count: number;
    following_count: number;
    name: string;
    pfp_url?: string | undefined;
    profile_id: GraphQLTypes['bigint'];
    updated_at: GraphQLTypes['timestamptz'];
    username: string;
  };
  /** Boolean expression to filter rows from the table "farcaster_accounts". All fields are combined with a logical 'AND'. */
  ['farcaster_accounts_bool_exp']: {
    _and?: Array<GraphQLTypes['farcaster_accounts_bool_exp']> | undefined;
    _not?: GraphQLTypes['farcaster_accounts_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['farcaster_accounts_bool_exp']> | undefined;
    bio_text?: GraphQLTypes['String_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    custody_address?: GraphQLTypes['String_comparison_exp'] | undefined;
    fid?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    followers_count?: GraphQLTypes['Int_comparison_exp'] | undefined;
    following_count?: GraphQLTypes['Int_comparison_exp'] | undefined;
    name?: GraphQLTypes['String_comparison_exp'] | undefined;
    pfp_url?: GraphQLTypes['String_comparison_exp'] | undefined;
    profile_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    username?: GraphQLTypes['String_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "farcaster_accounts". */
  ['farcaster_accounts_order_by']: {
    bio_text?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    custody_address?: GraphQLTypes['order_by'] | undefined;
    fid?: GraphQLTypes['order_by'] | undefined;
    followers_count?: GraphQLTypes['order_by'] | undefined;
    following_count?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    pfp_url?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    username?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "farcaster_accounts" */
  ['farcaster_accounts_select_column']: farcaster_accounts_select_column;
  /** Streaming cursor of the table "farcaster_accounts" */
  ['farcaster_accounts_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['farcaster_accounts_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['farcaster_accounts_stream_cursor_value_input']: {
    bio_text?: string | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    custody_address?: string | undefined;
    fid?: GraphQLTypes['bigint'] | undefined;
    followers_count?: number | undefined;
    following_count?: number | undefined;
    name?: string | undefined;
    pfp_url?: string | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
    username?: string | undefined;
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
  /** columns and relationships of "github_accounts" */
  ['github_accounts']: {
    __typename: 'github_accounts';
    profile_id: GraphQLTypes['bigint'];
    username: string;
  };
  /** Boolean expression to filter rows from the table "github_accounts". All fields are combined with a logical 'AND'. */
  ['github_accounts_bool_exp']: {
    _and?: Array<GraphQLTypes['github_accounts_bool_exp']> | undefined;
    _not?: GraphQLTypes['github_accounts_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['github_accounts_bool_exp']> | undefined;
    profile_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    username?: GraphQLTypes['String_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "github_accounts". */
  ['github_accounts_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
    username?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "github_accounts" */
  ['github_accounts_select_column']: github_accounts_select_column;
  /** Streaming cursor of the table "github_accounts" */
  ['github_accounts_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['github_accounts_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['github_accounts_stream_cursor_value_input']: {
    profile_id?: GraphQLTypes['bigint'] | undefined;
    username?: string | undefined;
  };
  ['jsonb']: any;
  ['jsonb_cast_exp']: {
    String?: GraphQLTypes['String_comparison_exp'] | undefined;
  };
  /** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
  ['jsonb_comparison_exp']: {
    _cast?: GraphQLTypes['jsonb_cast_exp'] | undefined;
    /** is the column contained in the given json value */
    _contained_in?: GraphQLTypes['jsonb'] | undefined;
    /** does the column contain the given json value at the top level */
    _contains?: GraphQLTypes['jsonb'] | undefined;
    _eq?: GraphQLTypes['jsonb'] | undefined;
    _gt?: GraphQLTypes['jsonb'] | undefined;
    _gte?: GraphQLTypes['jsonb'] | undefined;
    /** does the string exist as a top-level key in the column */
    _has_key?: string | undefined;
    /** do all of these strings exist as top-level keys in the column */
    _has_keys_all?: Array<string> | undefined;
    /** do any of these strings exist as top-level keys in the column */
    _has_keys_any?: Array<string> | undefined;
    _in?: Array<GraphQLTypes['jsonb']> | undefined;
    _is_null?: boolean | undefined;
    _lt?: GraphQLTypes['jsonb'] | undefined;
    _lte?: GraphQLTypes['jsonb'] | undefined;
    _neq?: GraphQLTypes['jsonb'] | undefined;
    _nin?: Array<GraphQLTypes['jsonb']> | undefined;
  };
  /** tracks the amount of keys an address holds in a given subject. updated with data from the key_tx table */
  ['link_holders']: {
    __typename: 'link_holders';
    amount: number;
    holder: GraphQLTypes['citext'];
    /** An object relationship */
    holder_cosoul?: GraphQLTypes['cosouls'] | undefined;
    /** An object relationship */
    holder_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    target: GraphQLTypes['citext'];
    /** An object relationship */
    target_cosoul?: GraphQLTypes['cosouls'] | undefined;
    /** An object relationship */
    target_profile_public?: GraphQLTypes['profiles_public'] | undefined;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** aggregated selection of "link_holders" */
  ['link_holders_aggregate']: {
    __typename: 'link_holders_aggregate';
    aggregate?: GraphQLTypes['link_holders_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['link_holders']>;
  };
  ['link_holders_aggregate_bool_exp']: {
    count?: GraphQLTypes['link_holders_aggregate_bool_exp_count'] | undefined;
  };
  ['link_holders_aggregate_bool_exp_count']: {
    arguments?: Array<GraphQLTypes['link_holders_select_column']> | undefined;
    distinct?: boolean | undefined;
    filter?: GraphQLTypes['link_holders_bool_exp'] | undefined;
    predicate: GraphQLTypes['Int_comparison_exp'];
  };
  /** aggregate fields of "link_holders" */
  ['link_holders_aggregate_fields']: {
    __typename: 'link_holders_aggregate_fields';
    avg?: GraphQLTypes['link_holders_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['link_holders_max_fields'] | undefined;
    min?: GraphQLTypes['link_holders_min_fields'] | undefined;
    stddev?: GraphQLTypes['link_holders_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['link_holders_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['link_holders_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['link_holders_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['link_holders_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['link_holders_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['link_holders_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "link_holders" */
  ['link_holders_aggregate_order_by']: {
    avg?: GraphQLTypes['link_holders_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['link_holders_max_order_by'] | undefined;
    min?: GraphQLTypes['link_holders_min_order_by'] | undefined;
    stddev?: GraphQLTypes['link_holders_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['link_holders_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['link_holders_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['link_holders_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['link_holders_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['link_holders_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['link_holders_variance_order_by'] | undefined;
  };
  /** aggregate avg on columns */
  ['link_holders_avg_fields']: {
    __typename: 'link_holders_avg_fields';
    amount?: number | undefined;
  };
  /** order by avg() on columns of table "link_holders" */
  ['link_holders_avg_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "link_holders". All fields are combined with a logical 'AND'. */
  ['link_holders_bool_exp']: {
    _and?: Array<GraphQLTypes['link_holders_bool_exp']> | undefined;
    _not?: GraphQLTypes['link_holders_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['link_holders_bool_exp']> | undefined;
    amount?: GraphQLTypes['Int_comparison_exp'] | undefined;
    holder?: GraphQLTypes['citext_comparison_exp'] | undefined;
    holder_cosoul?: GraphQLTypes['cosouls_bool_exp'] | undefined;
    holder_profile_public?:
      | GraphQLTypes['profiles_public_bool_exp']
      | undefined;
    target?: GraphQLTypes['citext_comparison_exp'] | undefined;
    target_cosoul?: GraphQLTypes['cosouls_bool_exp'] | undefined;
    target_profile_public?:
      | GraphQLTypes['profiles_public_bool_exp']
      | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
  };
  /** aggregate max on columns */
  ['link_holders_max_fields']: {
    __typename: 'link_holders_max_fields';
    amount?: number | undefined;
    holder?: GraphQLTypes['citext'] | undefined;
    target?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by max() on columns of table "link_holders" */
  ['link_holders_max_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    holder?: GraphQLTypes['order_by'] | undefined;
    target?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate min on columns */
  ['link_holders_min_fields']: {
    __typename: 'link_holders_min_fields';
    amount?: number | undefined;
    holder?: GraphQLTypes['citext'] | undefined;
    target?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by min() on columns of table "link_holders" */
  ['link_holders_min_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    holder?: GraphQLTypes['order_by'] | undefined;
    target?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "link_holders". */
  ['link_holders_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    holder?: GraphQLTypes['order_by'] | undefined;
    holder_cosoul?: GraphQLTypes['cosouls_order_by'] | undefined;
    holder_profile_public?:
      | GraphQLTypes['profiles_public_order_by']
      | undefined;
    target?: GraphQLTypes['order_by'] | undefined;
    target_cosoul?: GraphQLTypes['cosouls_order_by'] | undefined;
    target_profile_public?:
      | GraphQLTypes['profiles_public_order_by']
      | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "link_holders" */
  ['link_holders_select_column']: link_holders_select_column;
  /** aggregate stddev on columns */
  ['link_holders_stddev_fields']: {
    __typename: 'link_holders_stddev_fields';
    amount?: number | undefined;
  };
  /** order by stddev() on columns of table "link_holders" */
  ['link_holders_stddev_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_pop on columns */
  ['link_holders_stddev_pop_fields']: {
    __typename: 'link_holders_stddev_pop_fields';
    amount?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "link_holders" */
  ['link_holders_stddev_pop_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_samp on columns */
  ['link_holders_stddev_samp_fields']: {
    __typename: 'link_holders_stddev_samp_fields';
    amount?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "link_holders" */
  ['link_holders_stddev_samp_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** Streaming cursor of the table "link_holders" */
  ['link_holders_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['link_holders_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['link_holders_stream_cursor_value_input']: {
    amount?: number | undefined;
    holder?: GraphQLTypes['citext'] | undefined;
    target?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** aggregate sum on columns */
  ['link_holders_sum_fields']: {
    __typename: 'link_holders_sum_fields';
    amount?: number | undefined;
  };
  /** order by sum() on columns of table "link_holders" */
  ['link_holders_sum_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_pop on columns */
  ['link_holders_var_pop_fields']: {
    __typename: 'link_holders_var_pop_fields';
    amount?: number | undefined;
  };
  /** order by var_pop() on columns of table "link_holders" */
  ['link_holders_var_pop_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_samp on columns */
  ['link_holders_var_samp_fields']: {
    __typename: 'link_holders_var_samp_fields';
    amount?: number | undefined;
  };
  /** order by var_samp() on columns of table "link_holders" */
  ['link_holders_var_samp_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate variance on columns */
  ['link_holders_variance_fields']: {
    __typename: 'link_holders_variance_fields';
    amount?: number | undefined;
  };
  /** order by variance() on columns of table "link_holders" */
  ['link_holders_variance_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "link_tx" */
  ['link_tx']: {
    __typename: 'link_tx';
    buy: boolean;
    created_at: GraphQLTypes['timestamptz'];
    eth_amount: string;
    holder: GraphQLTypes['citext'];
    /** An object relationship */
    holder_profile?: GraphQLTypes['profiles_public'] | undefined;
    link_amount: string;
    protocol_fee_amount: string;
    supply: GraphQLTypes['numeric'];
    target: GraphQLTypes['citext'];
    target_fee_amount: string;
    /** An object relationship */
    target_profile?: GraphQLTypes['profiles_public'] | undefined;
    tx_hash: GraphQLTypes['citext'];
  };
  /** Boolean expression to filter rows from the table "link_tx". All fields are combined with a logical 'AND'. */
  ['link_tx_bool_exp']: {
    _and?: Array<GraphQLTypes['link_tx_bool_exp']> | undefined;
    _not?: GraphQLTypes['link_tx_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['link_tx_bool_exp']> | undefined;
    buy?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    eth_amount?: GraphQLTypes['String_comparison_exp'] | undefined;
    holder?: GraphQLTypes['citext_comparison_exp'] | undefined;
    holder_profile?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    link_amount?: GraphQLTypes['String_comparison_exp'] | undefined;
    protocol_fee_amount?: GraphQLTypes['String_comparison_exp'] | undefined;
    supply?: GraphQLTypes['numeric_comparison_exp'] | undefined;
    target?: GraphQLTypes['citext_comparison_exp'] | undefined;
    target_fee_amount?: GraphQLTypes['String_comparison_exp'] | undefined;
    target_profile?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    tx_hash?: GraphQLTypes['citext_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "link_tx". */
  ['link_tx_order_by']: {
    buy?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    eth_amount?: GraphQLTypes['order_by'] | undefined;
    holder?: GraphQLTypes['order_by'] | undefined;
    holder_profile?: GraphQLTypes['profiles_public_order_by'] | undefined;
    link_amount?: GraphQLTypes['order_by'] | undefined;
    protocol_fee_amount?: GraphQLTypes['order_by'] | undefined;
    supply?: GraphQLTypes['order_by'] | undefined;
    target?: GraphQLTypes['order_by'] | undefined;
    target_fee_amount?: GraphQLTypes['order_by'] | undefined;
    target_profile?: GraphQLTypes['profiles_public_order_by'] | undefined;
    tx_hash?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "link_tx" */
  ['link_tx_select_column']: link_tx_select_column;
  /** Streaming cursor of the table "link_tx" */
  ['link_tx_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['link_tx_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['link_tx_stream_cursor_value_input']: {
    buy?: boolean | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    eth_amount?: string | undefined;
    holder?: GraphQLTypes['citext'] | undefined;
    link_amount?: string | undefined;
    protocol_fee_amount?: string | undefined;
    supply?: GraphQLTypes['numeric'] | undefined;
    target?: GraphQLTypes['citext'] | undefined;
    target_fee_amount?: string | undefined;
    tx_hash?: GraphQLTypes['citext'] | undefined;
  };
  ['numeric']: any;
  /** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
  ['numeric_comparison_exp']: {
    _eq?: GraphQLTypes['numeric'] | undefined;
    _gt?: GraphQLTypes['numeric'] | undefined;
    _gte?: GraphQLTypes['numeric'] | undefined;
    _in?: Array<GraphQLTypes['numeric']> | undefined;
    _is_null?: boolean | undefined;
    _lt?: GraphQLTypes['numeric'] | undefined;
    _lte?: GraphQLTypes['numeric'] | undefined;
    _neq?: GraphQLTypes['numeric'] | undefined;
    _nin?: Array<GraphQLTypes['numeric']> | undefined;
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
  /** Boolean expression to filter rows from the table "poap_events". All fields are combined with a logical 'AND'. */
  ['poap_events_bool_exp']: {
    _and?: Array<GraphQLTypes['poap_events_bool_exp']> | undefined;
    _not?: GraphQLTypes['poap_events_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['poap_events_bool_exp']> | undefined;
    city?: GraphQLTypes['String_comparison_exp'] | undefined;
    country?: GraphQLTypes['String_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    description?: GraphQLTypes['String_comparison_exp'] | undefined;
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
  /** Ordering options when selecting data from "poap_events". */
  ['poap_events_order_by']: {
    city?: GraphQLTypes['order_by'] | undefined;
    country?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
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
  /** columns and relationships of "profile_skills" */
  ['profile_skills']: {
    __typename: 'profile_skills';
    profile_id: number;
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    /** An object relationship */
    skill?: GraphQLTypes['skills'] | undefined;
    skill_name: GraphQLTypes['citext'];
  };
  /** order by aggregate values of table "profile_skills" */
  ['profile_skills_aggregate_order_by']: {
    avg?: GraphQLTypes['profile_skills_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['profile_skills_max_order_by'] | undefined;
    min?: GraphQLTypes['profile_skills_min_order_by'] | undefined;
    stddev?: GraphQLTypes['profile_skills_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['profile_skills_stddev_pop_order_by'] | undefined;
    stddev_samp?:
      | GraphQLTypes['profile_skills_stddev_samp_order_by']
      | undefined;
    sum?: GraphQLTypes['profile_skills_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['profile_skills_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['profile_skills_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['profile_skills_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "profile_skills" */
  ['profile_skills_avg_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "profile_skills". All fields are combined with a logical 'AND'. */
  ['profile_skills_bool_exp']: {
    _and?: Array<GraphQLTypes['profile_skills_bool_exp']> | undefined;
    _not?: GraphQLTypes['profile_skills_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['profile_skills_bool_exp']> | undefined;
    profile_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    profile_public?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    skill?: GraphQLTypes['skills_bool_exp'] | undefined;
    skill_name?: GraphQLTypes['citext_comparison_exp'] | undefined;
  };
  /** order by max() on columns of table "profile_skills" */
  ['profile_skills_max_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
    skill_name?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "profile_skills" */
  ['profile_skills_min_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
    skill_name?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "profile_skills". */
  ['profile_skills_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
    profile_public?: GraphQLTypes['profiles_public_order_by'] | undefined;
    skill?: GraphQLTypes['skills_order_by'] | undefined;
    skill_name?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "profile_skills" */
  ['profile_skills_select_column']: profile_skills_select_column;
  /** order by stddev() on columns of table "profile_skills" */
  ['profile_skills_stddev_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "profile_skills" */
  ['profile_skills_stddev_pop_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "profile_skills" */
  ['profile_skills_stddev_samp_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Streaming cursor of the table "profile_skills" */
  ['profile_skills_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['profile_skills_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['profile_skills_stream_cursor_value_input']: {
    profile_id?: number | undefined;
    skill_name?: GraphQLTypes['citext'] | undefined;
  };
  /** order by sum() on columns of table "profile_skills" */
  ['profile_skills_sum_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "profile_skills" */
  ['profile_skills_var_pop_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "profile_skills" */
  ['profile_skills_var_samp_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "profile_skills" */
  ['profile_skills_variance_order_by']: {
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
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
    /** An object relationship */
    cosoul?: GraphQLTypes['cosouls'] | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    description?: string | undefined;
    /** An object relationship */
    farcaster_account?: GraphQLTypes['farcaster_accounts'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    joined_colinks_at?: GraphQLTypes['timestamptz'] | undefined;
    /** An array relationship */
    link_holder: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    link_holder_aggregate: GraphQLTypes['link_holders_aggregate'];
    /** An array relationship */
    link_target: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    link_target_aggregate: GraphQLTypes['link_holders_aggregate'];
    links?: number | undefined;
    links_held?: number | undefined;
    name?: GraphQLTypes['citext'] | undefined;
    post_count?: GraphQLTypes['bigint'] | undefined;
    post_count_last_30_days?: GraphQLTypes['bigint'] | undefined;
    /** An array relationship */
    profile_skills: Array<GraphQLTypes['profile_skills']>;
    /** An object relationship */
    reputation_score?: GraphQLTypes['reputation_scores'] | undefined;
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
    cosoul?: GraphQLTypes['cosouls_bool_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    description?: GraphQLTypes['String_comparison_exp'] | undefined;
    farcaster_account?: GraphQLTypes['farcaster_accounts_bool_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    joined_colinks_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    link_holder?: GraphQLTypes['link_holders_bool_exp'] | undefined;
    link_holder_aggregate?:
      | GraphQLTypes['link_holders_aggregate_bool_exp']
      | undefined;
    link_target?: GraphQLTypes['link_holders_bool_exp'] | undefined;
    link_target_aggregate?:
      | GraphQLTypes['link_holders_aggregate_bool_exp']
      | undefined;
    links?: GraphQLTypes['Int_comparison_exp'] | undefined;
    links_held?: GraphQLTypes['Int_comparison_exp'] | undefined;
    name?: GraphQLTypes['citext_comparison_exp'] | undefined;
    post_count?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    post_count_last_30_days?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    profile_skills?: GraphQLTypes['profile_skills_bool_exp'] | undefined;
    reputation_score?: GraphQLTypes['reputation_scores_bool_exp'] | undefined;
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
    cosoul?: GraphQLTypes['cosouls_order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
    farcaster_account?: GraphQLTypes['farcaster_accounts_order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    joined_colinks_at?: GraphQLTypes['order_by'] | undefined;
    link_holder_aggregate?:
      | GraphQLTypes['link_holders_aggregate_order_by']
      | undefined;
    link_target_aggregate?:
      | GraphQLTypes['link_holders_aggregate_order_by']
      | undefined;
    links?: GraphQLTypes['order_by'] | undefined;
    links_held?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    post_count?: GraphQLTypes['order_by'] | undefined;
    post_count_last_30_days?: GraphQLTypes['order_by'] | undefined;
    profile_skills_aggregate?:
      | GraphQLTypes['profile_skills_aggregate_order_by']
      | undefined;
    reputation_score?: GraphQLTypes['reputation_scores_order_by'] | undefined;
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
    /** An array relationship */
    activities: Array<GraphQLTypes['activities']>;
    /** An aggregate relationship */
    activities_aggregate: GraphQLTypes['activities_aggregate'];
    /** fetch data from the table: "activities" using primary key columns */
    activities_by_pk?: GraphQLTypes['activities'] | undefined;
    /** fetch data from the table: "big_questions" */
    big_questions: Array<GraphQLTypes['big_questions']>;
    /** fetch data from the table: "big_questions" using primary key columns */
    big_questions_by_pk?: GraphQLTypes['big_questions'] | undefined;
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
    /** fetch data from the table: "cosouls" */
    cosouls: Array<GraphQLTypes['cosouls']>;
    /** fetch data from the table: "cosouls" using primary key columns */
    cosouls_by_pk?: GraphQLTypes['cosouls'] | undefined;
    /** fetch data from the table: "enriched_casts" */
    enriched_casts: Array<GraphQLTypes['enriched_casts']>;
    /** fetch data from the table: "enriched_casts" using primary key columns */
    enriched_casts_by_pk?: GraphQLTypes['enriched_casts'] | undefined;
    /** fetch data from the table: "farcaster_accounts" */
    farcaster_accounts: Array<GraphQLTypes['farcaster_accounts']>;
    /** fetch data from the table: "farcaster_accounts" using primary key columns */
    farcaster_accounts_by_pk?: GraphQLTypes['farcaster_accounts'] | undefined;
    /** getCasts */
    getCasts: GraphQLTypes['GetCastsOutput'];
    /** fetch data from the table: "github_accounts" */
    github_accounts: Array<GraphQLTypes['github_accounts']>;
    /** fetch data from the table: "github_accounts" using primary key columns */
    github_accounts_by_pk?: GraphQLTypes['github_accounts'] | undefined;
    /** An array relationship */
    link_holders: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    link_holders_aggregate: GraphQLTypes['link_holders_aggregate'];
    /** fetch data from the table: "link_holders" using primary key columns */
    link_holders_by_pk?: GraphQLTypes['link_holders'] | undefined;
    /** fetch data from the table: "link_tx" */
    link_tx: Array<GraphQLTypes['link_tx']>;
    /** fetch data from the table: "link_tx" using primary key columns */
    link_tx_by_pk?: GraphQLTypes['link_tx'] | undefined;
    /** fetch data from the table: "poap_events" */
    poap_events: Array<GraphQLTypes['poap_events']>;
    /** fetch data from the table: "poap_events" using primary key columns */
    poap_events_by_pk?: GraphQLTypes['poap_events'] | undefined;
    /** fetch data from the table: "poap_holders" */
    poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** fetch aggregated fields from the table: "poap_holders" */
    poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
    /** fetch data from the table: "poap_holders" using primary key columns */
    poap_holders_by_pk?: GraphQLTypes['poap_holders'] | undefined;
    /** An array relationship */
    profile_skills: Array<GraphQLTypes['profile_skills']>;
    /** fetch data from the table: "profile_skills" using primary key columns */
    profile_skills_by_pk?: GraphQLTypes['profile_skills'] | undefined;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
    /** An array relationship */
    reactions: Array<GraphQLTypes['reactions']>;
    /** fetch data from the table: "reactions" using primary key columns */
    reactions_by_pk?: GraphQLTypes['reactions'] | undefined;
    /** An array relationship */
    replies: Array<GraphQLTypes['replies']>;
    /** fetch data from the table: "replies" using primary key columns */
    replies_by_pk?: GraphQLTypes['replies'] | undefined;
    /** fetch data from the table: "replies_reactions" */
    replies_reactions: Array<GraphQLTypes['replies_reactions']>;
    /** fetch data from the table: "replies_reactions" using primary key columns */
    replies_reactions_by_pk?: GraphQLTypes['replies_reactions'] | undefined;
    /** fetch data from the table: "reputation_scores" */
    reputation_scores: Array<GraphQLTypes['reputation_scores']>;
    /** fetch data from the table: "reputation_scores" using primary key columns */
    reputation_scores_by_pk?: GraphQLTypes['reputation_scores'] | undefined;
    /** execute function "search_replies" which returns "replies" */
    search_replies: Array<GraphQLTypes['replies']>;
    /** fetch data from the table: "skills" */
    skills: Array<GraphQLTypes['skills']>;
    /** fetch data from the table: "skills" using primary key columns */
    skills_by_pk?: GraphQLTypes['skills'] | undefined;
    /** fetch data from the table: "twitter_accounts" */
    twitter_accounts: Array<GraphQLTypes['twitter_accounts']>;
    /** fetch data from the table: "twitter_accounts" using primary key columns */
    twitter_accounts_by_pk?: GraphQLTypes['twitter_accounts'] | undefined;
    /** execute function "vector_search_poap_events" which returns "poap_events" */
    vector_search_poap_events: Array<GraphQLTypes['poap_events']>;
    /** execute function "vector_search_poap_holders" which returns "poap_holders" */
    vector_search_poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** execute function "vector_search_poap_holders" and query aggregates on result of table type "poap_holders" */
    vector_search_poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
  };
  /** columns and relationships of "reactions" */
  ['reactions']: {
    __typename: 'reactions';
    /** An object relationship */
    activity?: GraphQLTypes['activities'] | undefined;
    activity_id: number;
    created_at: GraphQLTypes['timestamptz'];
    id: GraphQLTypes['bigint'];
    profile_id: number;
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    reaction: string;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** order by aggregate values of table "reactions" */
  ['reactions_aggregate_order_by']: {
    avg?: GraphQLTypes['reactions_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['reactions_max_order_by'] | undefined;
    min?: GraphQLTypes['reactions_min_order_by'] | undefined;
    stddev?: GraphQLTypes['reactions_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['reactions_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['reactions_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['reactions_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['reactions_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['reactions_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['reactions_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "reactions" */
  ['reactions_avg_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "reactions". All fields are combined with a logical 'AND'. */
  ['reactions_bool_exp']: {
    _and?: Array<GraphQLTypes['reactions_bool_exp']> | undefined;
    _not?: GraphQLTypes['reactions_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['reactions_bool_exp']> | undefined;
    activity?: GraphQLTypes['activities_bool_exp'] | undefined;
    activity_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    profile_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    profile_public?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    reaction?: GraphQLTypes['String_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
  };
  /** order by max() on columns of table "reactions" */
  ['reactions_max_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reaction?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "reactions" */
  ['reactions_min_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reaction?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "reactions". */
  ['reactions_order_by']: {
    activity?: GraphQLTypes['activities_order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    profile_public?: GraphQLTypes['profiles_public_order_by'] | undefined;
    reaction?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "reactions" */
  ['reactions_select_column']: reactions_select_column;
  /** order by stddev() on columns of table "reactions" */
  ['reactions_stddev_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "reactions" */
  ['reactions_stddev_pop_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "reactions" */
  ['reactions_stddev_samp_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Streaming cursor of the table "reactions" */
  ['reactions_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['reactions_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['reactions_stream_cursor_value_input']: {
    activity_id?: number | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    profile_id?: number | undefined;
    reaction?: string | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by sum() on columns of table "reactions" */
  ['reactions_sum_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "reactions" */
  ['reactions_var_pop_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "reactions" */
  ['reactions_var_samp_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "reactions" */
  ['reactions_variance_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Replies to activity items */
  ['replies']: {
    __typename: 'replies';
    /** An object relationship */
    activity: GraphQLTypes['activities'];
    activity_actor_id: number;
    activity_id: number;
    created_at: GraphQLTypes['timestamptz'];
    deleted_at?: GraphQLTypes['timestamptz'] | undefined;
    id: GraphQLTypes['bigint'];
    profile_id: number;
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    /** An array relationship */
    reactions: Array<GraphQLTypes['replies_reactions']>;
    reply: string;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** order by aggregate values of table "replies" */
  ['replies_aggregate_order_by']: {
    avg?: GraphQLTypes['replies_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['replies_max_order_by'] | undefined;
    min?: GraphQLTypes['replies_min_order_by'] | undefined;
    stddev?: GraphQLTypes['replies_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['replies_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['replies_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['replies_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['replies_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['replies_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['replies_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "replies" */
  ['replies_avg_order_by']: {
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "replies". All fields are combined with a logical 'AND'. */
  ['replies_bool_exp']: {
    _and?: Array<GraphQLTypes['replies_bool_exp']> | undefined;
    _not?: GraphQLTypes['replies_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['replies_bool_exp']> | undefined;
    activity?: GraphQLTypes['activities_bool_exp'] | undefined;
    activity_actor_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    activity_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    deleted_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    profile_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    profile_public?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    reactions?: GraphQLTypes['replies_reactions_bool_exp'] | undefined;
    reply?: GraphQLTypes['String_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
  };
  /** order by max() on columns of table "replies" */
  ['replies_max_order_by']: {
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    deleted_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reply?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "replies" */
  ['replies_min_order_by']: {
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    deleted_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reply?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "replies". */
  ['replies_order_by']: {
    activity?: GraphQLTypes['activities_order_by'] | undefined;
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    deleted_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    profile_public?: GraphQLTypes['profiles_public_order_by'] | undefined;
    reactions_aggregate?:
      | GraphQLTypes['replies_reactions_aggregate_order_by']
      | undefined;
    reply?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "replies_reactions" */
  ['replies_reactions']: {
    __typename: 'replies_reactions';
    /** An object relationship */
    activity?: GraphQLTypes['activities'] | undefined;
    activity_id: number;
    created_at: GraphQLTypes['timestamptz'];
    id: GraphQLTypes['bigint'];
    profile_id: number;
    /** An object relationship */
    profile_public?: GraphQLTypes['profiles_public'] | undefined;
    reaction: string;
    /** An object relationship */
    reply?: GraphQLTypes['replies'] | undefined;
    reply_id: number;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** order by aggregate values of table "replies_reactions" */
  ['replies_reactions_aggregate_order_by']: {
    avg?: GraphQLTypes['replies_reactions_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['replies_reactions_max_order_by'] | undefined;
    min?: GraphQLTypes['replies_reactions_min_order_by'] | undefined;
    stddev?: GraphQLTypes['replies_reactions_stddev_order_by'] | undefined;
    stddev_pop?:
      | GraphQLTypes['replies_reactions_stddev_pop_order_by']
      | undefined;
    stddev_samp?:
      | GraphQLTypes['replies_reactions_stddev_samp_order_by']
      | undefined;
    sum?: GraphQLTypes['replies_reactions_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['replies_reactions_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['replies_reactions_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['replies_reactions_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "replies_reactions" */
  ['replies_reactions_avg_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "replies_reactions". All fields are combined with a logical 'AND'. */
  ['replies_reactions_bool_exp']: {
    _and?: Array<GraphQLTypes['replies_reactions_bool_exp']> | undefined;
    _not?: GraphQLTypes['replies_reactions_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['replies_reactions_bool_exp']> | undefined;
    activity?: GraphQLTypes['activities_bool_exp'] | undefined;
    activity_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    profile_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    profile_public?: GraphQLTypes['profiles_public_bool_exp'] | undefined;
    reaction?: GraphQLTypes['String_comparison_exp'] | undefined;
    reply?: GraphQLTypes['replies_bool_exp'] | undefined;
    reply_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
  };
  /** order by max() on columns of table "replies_reactions" */
  ['replies_reactions_max_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reaction?: GraphQLTypes['order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "replies_reactions" */
  ['replies_reactions_min_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reaction?: GraphQLTypes['order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "replies_reactions". */
  ['replies_reactions_order_by']: {
    activity?: GraphQLTypes['activities_order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    profile_public?: GraphQLTypes['profiles_public_order_by'] | undefined;
    reaction?: GraphQLTypes['order_by'] | undefined;
    reply?: GraphQLTypes['replies_order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "replies_reactions" */
  ['replies_reactions_select_column']: replies_reactions_select_column;
  /** order by stddev() on columns of table "replies_reactions" */
  ['replies_reactions_stddev_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "replies_reactions" */
  ['replies_reactions_stddev_pop_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "replies_reactions" */
  ['replies_reactions_stddev_samp_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Streaming cursor of the table "replies_reactions" */
  ['replies_reactions_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['replies_reactions_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['replies_reactions_stream_cursor_value_input']: {
    activity_id?: number | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    profile_id?: number | undefined;
    reaction?: string | undefined;
    reply_id?: number | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by sum() on columns of table "replies_reactions" */
  ['replies_reactions_sum_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "replies_reactions" */
  ['replies_reactions_var_pop_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "replies_reactions" */
  ['replies_reactions_var_samp_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "replies_reactions" */
  ['replies_reactions_variance_order_by']: {
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    reply_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "replies" */
  ['replies_select_column']: replies_select_column;
  /** order by stddev() on columns of table "replies" */
  ['replies_stddev_order_by']: {
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "replies" */
  ['replies_stddev_pop_order_by']: {
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "replies" */
  ['replies_stddev_samp_order_by']: {
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Streaming cursor of the table "replies" */
  ['replies_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['replies_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['replies_stream_cursor_value_input']: {
    activity_actor_id?: number | undefined;
    activity_id?: number | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    deleted_at?: GraphQLTypes['timestamptz'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    profile_id?: number | undefined;
    reply?: string | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** order by sum() on columns of table "replies" */
  ['replies_sum_order_by']: {
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "replies" */
  ['replies_var_pop_order_by']: {
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "replies" */
  ['replies_var_samp_order_by']: {
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "replies" */
  ['replies_variance_order_by']: {
    activity_actor_id?: GraphQLTypes['order_by'] | undefined;
    activity_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "reputation_scores" */
  ['reputation_scores']: {
    __typename: 'reputation_scores';
    colinks_engagement_score?: number | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    email_score: number;
    github_score: number;
    invite_score: number;
    linkedin_score: number;
    links_score: number;
    pgive_score: number;
    poap_score: number;
    profile_id: GraphQLTypes['bigint'];
    total_score: number;
    twitter_score: number;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  /** Boolean expression to filter rows from the table "reputation_scores". All fields are combined with a logical 'AND'. */
  ['reputation_scores_bool_exp']: {
    _and?: Array<GraphQLTypes['reputation_scores_bool_exp']> | undefined;
    _not?: GraphQLTypes['reputation_scores_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['reputation_scores_bool_exp']> | undefined;
    colinks_engagement_score?: GraphQLTypes['Int_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    email_score?: GraphQLTypes['Int_comparison_exp'] | undefined;
    github_score?: GraphQLTypes['Int_comparison_exp'] | undefined;
    invite_score?: GraphQLTypes['Int_comparison_exp'] | undefined;
    linkedin_score?: GraphQLTypes['Int_comparison_exp'] | undefined;
    links_score?: GraphQLTypes['Int_comparison_exp'] | undefined;
    pgive_score?: GraphQLTypes['Int_comparison_exp'] | undefined;
    poap_score?: GraphQLTypes['Int_comparison_exp'] | undefined;
    profile_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    total_score?: GraphQLTypes['Int_comparison_exp'] | undefined;
    twitter_score?: GraphQLTypes['Int_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "reputation_scores". */
  ['reputation_scores_order_by']: {
    colinks_engagement_score?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    email_score?: GraphQLTypes['order_by'] | undefined;
    github_score?: GraphQLTypes['order_by'] | undefined;
    invite_score?: GraphQLTypes['order_by'] | undefined;
    linkedin_score?: GraphQLTypes['order_by'] | undefined;
    links_score?: GraphQLTypes['order_by'] | undefined;
    pgive_score?: GraphQLTypes['order_by'] | undefined;
    poap_score?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    total_score?: GraphQLTypes['order_by'] | undefined;
    twitter_score?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "reputation_scores" */
  ['reputation_scores_select_column']: reputation_scores_select_column;
  /** Streaming cursor of the table "reputation_scores" */
  ['reputation_scores_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['reputation_scores_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['reputation_scores_stream_cursor_value_input']: {
    colinks_engagement_score?: number | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    email_score?: number | undefined;
    github_score?: number | undefined;
    invite_score?: number | undefined;
    linkedin_score?: number | undefined;
    links_score?: number | undefined;
    pgive_score?: number | undefined;
    poap_score?: number | undefined;
    profile_id?: GraphQLTypes['bigint'] | undefined;
    total_score?: number | undefined;
    twitter_score?: number | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  ['search_replies_args']: {
    search?: string | undefined;
  };
  /** columns and relationships of "skills" */
  ['skills']: {
    __typename: 'skills';
    count: number;
    created_at: GraphQLTypes['timestamptz'];
    hidden: boolean;
    name: GraphQLTypes['citext'];
    /** An object relationship */
    profile_skills?: GraphQLTypes['profile_skills'] | undefined;
    updated_at: GraphQLTypes['timestamptz'];
  };
  /** Boolean expression to filter rows from the table "skills". All fields are combined with a logical 'AND'. */
  ['skills_bool_exp']: {
    _and?: Array<GraphQLTypes['skills_bool_exp']> | undefined;
    _not?: GraphQLTypes['skills_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['skills_bool_exp']> | undefined;
    count?: GraphQLTypes['Int_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    hidden?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    name?: GraphQLTypes['citext_comparison_exp'] | undefined;
    profile_skills?: GraphQLTypes['profile_skills_bool_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "skills". */
  ['skills_order_by']: {
    count?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    hidden?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    profile_skills?: GraphQLTypes['profile_skills_order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "skills" */
  ['skills_select_column']: skills_select_column;
  /** Streaming cursor of the table "skills" */
  ['skills_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['skills_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['skills_stream_cursor_value_input']: {
    count?: number | undefined;
    created_at?: GraphQLTypes['timestamptz'] | undefined;
    hidden?: boolean | undefined;
    name?: GraphQLTypes['citext'] | undefined;
    updated_at?: GraphQLTypes['timestamptz'] | undefined;
  };
  ['smallint']: any;
  /** Boolean expression to compare columns of type "smallint". All fields are combined with logical 'AND'. */
  ['smallint_array_comparison_exp']: {
    /** is the array contained in the given array value */
    _contained_in?: Array<GraphQLTypes['smallint']> | undefined;
    /** does the array contain the given value */
    _contains?: Array<GraphQLTypes['smallint']> | undefined;
    _eq?: Array<GraphQLTypes['smallint']> | undefined;
    _gt?: Array<GraphQLTypes['smallint']> | undefined;
    _gte?: Array<GraphQLTypes['smallint']> | undefined;
    _in?: Array<Array<GraphQLTypes['smallint']> | undefined>;
    _is_null?: boolean | undefined;
    _lt?: Array<GraphQLTypes['smallint']> | undefined;
    _lte?: Array<GraphQLTypes['smallint']> | undefined;
    _neq?: Array<GraphQLTypes['smallint']> | undefined;
    _nin?: Array<Array<GraphQLTypes['smallint']> | undefined>;
  };
  ['subscription_root']: {
    __typename: 'subscription_root';
    /** An array relationship */
    activities: Array<GraphQLTypes['activities']>;
    /** An aggregate relationship */
    activities_aggregate: GraphQLTypes['activities_aggregate'];
    /** fetch data from the table: "activities" using primary key columns */
    activities_by_pk?: GraphQLTypes['activities'] | undefined;
    /** fetch data from the table in a streaming manner: "activities" */
    activities_stream: Array<GraphQLTypes['activities']>;
    /** fetch data from the table: "big_questions" */
    big_questions: Array<GraphQLTypes['big_questions']>;
    /** fetch data from the table: "big_questions" using primary key columns */
    big_questions_by_pk?: GraphQLTypes['big_questions'] | undefined;
    /** fetch data from the table in a streaming manner: "big_questions" */
    big_questions_stream: Array<GraphQLTypes['big_questions']>;
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
    /** fetch data from the table: "cosouls" */
    cosouls: Array<GraphQLTypes['cosouls']>;
    /** fetch data from the table: "cosouls" using primary key columns */
    cosouls_by_pk?: GraphQLTypes['cosouls'] | undefined;
    /** fetch data from the table in a streaming manner: "cosouls" */
    cosouls_stream: Array<GraphQLTypes['cosouls']>;
    /** fetch data from the table: "enriched_casts" */
    enriched_casts: Array<GraphQLTypes['enriched_casts']>;
    /** fetch data from the table: "enriched_casts" using primary key columns */
    enriched_casts_by_pk?: GraphQLTypes['enriched_casts'] | undefined;
    /** fetch data from the table in a streaming manner: "enriched_casts" */
    enriched_casts_stream: Array<GraphQLTypes['enriched_casts']>;
    /** fetch data from the table: "farcaster_accounts" */
    farcaster_accounts: Array<GraphQLTypes['farcaster_accounts']>;
    /** fetch data from the table: "farcaster_accounts" using primary key columns */
    farcaster_accounts_by_pk?: GraphQLTypes['farcaster_accounts'] | undefined;
    /** fetch data from the table in a streaming manner: "farcaster_accounts" */
    farcaster_accounts_stream: Array<GraphQLTypes['farcaster_accounts']>;
    /** fetch data from the table: "github_accounts" */
    github_accounts: Array<GraphQLTypes['github_accounts']>;
    /** fetch data from the table: "github_accounts" using primary key columns */
    github_accounts_by_pk?: GraphQLTypes['github_accounts'] | undefined;
    /** fetch data from the table in a streaming manner: "github_accounts" */
    github_accounts_stream: Array<GraphQLTypes['github_accounts']>;
    /** An array relationship */
    link_holders: Array<GraphQLTypes['link_holders']>;
    /** An aggregate relationship */
    link_holders_aggregate: GraphQLTypes['link_holders_aggregate'];
    /** fetch data from the table: "link_holders" using primary key columns */
    link_holders_by_pk?: GraphQLTypes['link_holders'] | undefined;
    /** fetch data from the table in a streaming manner: "link_holders" */
    link_holders_stream: Array<GraphQLTypes['link_holders']>;
    /** fetch data from the table: "link_tx" */
    link_tx: Array<GraphQLTypes['link_tx']>;
    /** fetch data from the table: "link_tx" using primary key columns */
    link_tx_by_pk?: GraphQLTypes['link_tx'] | undefined;
    /** fetch data from the table in a streaming manner: "link_tx" */
    link_tx_stream: Array<GraphQLTypes['link_tx']>;
    /** fetch data from the table: "poap_events" */
    poap_events: Array<GraphQLTypes['poap_events']>;
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
    /** An array relationship */
    profile_skills: Array<GraphQLTypes['profile_skills']>;
    /** fetch data from the table: "profile_skills" using primary key columns */
    profile_skills_by_pk?: GraphQLTypes['profile_skills'] | undefined;
    /** fetch data from the table in a streaming manner: "profile_skills" */
    profile_skills_stream: Array<GraphQLTypes['profile_skills']>;
    /** fetch data from the table: "profiles_public" */
    profiles_public: Array<GraphQLTypes['profiles_public']>;
    /** fetch data from the table in a streaming manner: "profiles_public" */
    profiles_public_stream: Array<GraphQLTypes['profiles_public']>;
    /** An array relationship */
    reactions: Array<GraphQLTypes['reactions']>;
    /** fetch data from the table: "reactions" using primary key columns */
    reactions_by_pk?: GraphQLTypes['reactions'] | undefined;
    /** fetch data from the table in a streaming manner: "reactions" */
    reactions_stream: Array<GraphQLTypes['reactions']>;
    /** An array relationship */
    replies: Array<GraphQLTypes['replies']>;
    /** fetch data from the table: "replies" using primary key columns */
    replies_by_pk?: GraphQLTypes['replies'] | undefined;
    /** fetch data from the table: "replies_reactions" */
    replies_reactions: Array<GraphQLTypes['replies_reactions']>;
    /** fetch data from the table: "replies_reactions" using primary key columns */
    replies_reactions_by_pk?: GraphQLTypes['replies_reactions'] | undefined;
    /** fetch data from the table in a streaming manner: "replies_reactions" */
    replies_reactions_stream: Array<GraphQLTypes['replies_reactions']>;
    /** fetch data from the table in a streaming manner: "replies" */
    replies_stream: Array<GraphQLTypes['replies']>;
    /** fetch data from the table: "reputation_scores" */
    reputation_scores: Array<GraphQLTypes['reputation_scores']>;
    /** fetch data from the table: "reputation_scores" using primary key columns */
    reputation_scores_by_pk?: GraphQLTypes['reputation_scores'] | undefined;
    /** fetch data from the table in a streaming manner: "reputation_scores" */
    reputation_scores_stream: Array<GraphQLTypes['reputation_scores']>;
    /** execute function "search_replies" which returns "replies" */
    search_replies: Array<GraphQLTypes['replies']>;
    /** fetch data from the table: "skills" */
    skills: Array<GraphQLTypes['skills']>;
    /** fetch data from the table: "skills" using primary key columns */
    skills_by_pk?: GraphQLTypes['skills'] | undefined;
    /** fetch data from the table in a streaming manner: "skills" */
    skills_stream: Array<GraphQLTypes['skills']>;
    /** fetch data from the table: "twitter_accounts" */
    twitter_accounts: Array<GraphQLTypes['twitter_accounts']>;
    /** fetch data from the table: "twitter_accounts" using primary key columns */
    twitter_accounts_by_pk?: GraphQLTypes['twitter_accounts'] | undefined;
    /** fetch data from the table in a streaming manner: "twitter_accounts" */
    twitter_accounts_stream: Array<GraphQLTypes['twitter_accounts']>;
    /** execute function "vector_search_poap_events" which returns "poap_events" */
    vector_search_poap_events: Array<GraphQLTypes['poap_events']>;
    /** execute function "vector_search_poap_holders" which returns "poap_holders" */
    vector_search_poap_holders: Array<GraphQLTypes['poap_holders']>;
    /** execute function "vector_search_poap_holders" and query aggregates on result of table type "poap_holders" */
    vector_search_poap_holders_aggregate: GraphQLTypes['poap_holders_aggregate'];
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
  /** twitter accounts connected to profiles */
  ['twitter_accounts']: {
    __typename: 'twitter_accounts';
    id: string;
    profile_id: number;
    username: string;
  };
  /** Boolean expression to filter rows from the table "twitter_accounts". All fields are combined with a logical 'AND'. */
  ['twitter_accounts_bool_exp']: {
    _and?: Array<GraphQLTypes['twitter_accounts_bool_exp']> | undefined;
    _not?: GraphQLTypes['twitter_accounts_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['twitter_accounts_bool_exp']> | undefined;
    id?: GraphQLTypes['String_comparison_exp'] | undefined;
    profile_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    username?: GraphQLTypes['String_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "twitter_accounts". */
  ['twitter_accounts_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    profile_id?: GraphQLTypes['order_by'] | undefined;
    username?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "twitter_accounts" */
  ['twitter_accounts_select_column']: twitter_accounts_select_column;
  /** Streaming cursor of the table "twitter_accounts" */
  ['twitter_accounts_stream_cursor_input']: {
    /** Stream column input with initial value */
    initial_value: GraphQLTypes['twitter_accounts_stream_cursor_value_input'];
    /** cursor ordering */
    ordering?: GraphQLTypes['cursor_ordering'] | undefined;
  };
  /** Initial value of the column from where the streaming should start */
  ['twitter_accounts_stream_cursor_value_input']: {
    id?: string | undefined;
    profile_id?: number | undefined;
    username?: string | undefined;
  };
  ['vector']: any;
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
/** select columns of table "activities" */
export const enum activities_select_column {
  action = 'action',
  actor_profile_id = 'actor_profile_id',
  big_question_id = 'big_question_id',
  cast_id = 'cast_id',
  circle_id = 'circle_id',
  contribution_id = 'contribution_id',
  created_at = 'created_at',
  epoch_id = 'epoch_id',
  id = 'id',
  organization_id = 'organization_id',
  private_stream = 'private_stream',
  reaction_count = 'reaction_count',
  reply_count = 'reply_count',
  target_profile_id = 'target_profile_id',
  updated_at = 'updated_at',
  user_id = 'user_id',
}
/** select "activities_aggregate_bool_exp_bool_and_arguments_columns" columns of table "activities" */
export const enum activities_select_column_activities_aggregate_bool_exp_bool_and_arguments_columns {
  private_stream = 'private_stream',
}
/** select "activities_aggregate_bool_exp_bool_or_arguments_columns" columns of table "activities" */
export const enum activities_select_column_activities_aggregate_bool_exp_bool_or_arguments_columns {
  private_stream = 'private_stream',
}
/** select columns of table "big_questions" */
export const enum big_questions_select_column {
  cover_image_url = 'cover_image_url',
  created_at = 'created_at',
  css_background_position = 'css_background_position',
  description = 'description',
  expire_at = 'expire_at',
  id = 'id',
  prompt = 'prompt',
  publish_at = 'publish_at',
  updated_at = 'updated_at',
}
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
  attestation_uid = 'attestation_uid',
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
/** select columns of table "cosouls" */
export const enum cosouls_select_column {
  address = 'address',
  checked_at = 'checked_at',
  created_at = 'created_at',
  created_tx_hash = 'created_tx_hash',
  id = 'id',
  pgive = 'pgive',
  synced_at = 'synced_at',
  token_id = 'token_id',
  updated_at = 'updated_at',
}
/** ordering argument of a cursor */
export const enum cursor_ordering {
  ASC = 'ASC',
  DESC = 'DESC',
}
/** select columns of table "enriched_casts" */
export const enum enriched_casts_select_column {
  created_at = 'created_at',
  deleted_at = 'deleted_at',
  embeds = 'embeds',
  fid = 'fid',
  hash = 'hash',
  id = 'id',
  mentions = 'mentions',
  mentions_positions = 'mentions_positions',
  parent_fid = 'parent_fid',
  parent_hash = 'parent_hash',
  parent_url = 'parent_url',
  profile_id = 'profile_id',
  root_parent_hash = 'root_parent_hash',
  root_parent_url = 'root_parent_url',
  text = 'text',
  timestamp = 'timestamp',
  updated_at = 'updated_at',
}
/** select columns of table "farcaster_accounts" */
export const enum farcaster_accounts_select_column {
  bio_text = 'bio_text',
  created_at = 'created_at',
  custody_address = 'custody_address',
  fid = 'fid',
  followers_count = 'followers_count',
  following_count = 'following_count',
  name = 'name',
  pfp_url = 'pfp_url',
  profile_id = 'profile_id',
  updated_at = 'updated_at',
  username = 'username',
}
/** select columns of table "github_accounts" */
export const enum github_accounts_select_column {
  profile_id = 'profile_id',
  username = 'username',
}
/** select columns of table "link_holders" */
export const enum link_holders_select_column {
  amount = 'amount',
  holder = 'holder',
  target = 'target',
  updated_at = 'updated_at',
}
/** select columns of table "link_tx" */
export const enum link_tx_select_column {
  buy = 'buy',
  created_at = 'created_at',
  eth_amount = 'eth_amount',
  holder = 'holder',
  link_amount = 'link_amount',
  protocol_fee_amount = 'protocol_fee_amount',
  supply = 'supply',
  target = 'target',
  target_fee_amount = 'target_fee_amount',
  tx_hash = 'tx_hash',
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
/** select columns of table "profile_skills" */
export const enum profile_skills_select_column {
  profile_id = 'profile_id',
  skill_name = 'skill_name',
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
/** select columns of table "reactions" */
export const enum reactions_select_column {
  activity_id = 'activity_id',
  created_at = 'created_at',
  id = 'id',
  profile_id = 'profile_id',
  reaction = 'reaction',
  updated_at = 'updated_at',
}
/** select columns of table "replies_reactions" */
export const enum replies_reactions_select_column {
  activity_id = 'activity_id',
  created_at = 'created_at',
  id = 'id',
  profile_id = 'profile_id',
  reaction = 'reaction',
  reply_id = 'reply_id',
  updated_at = 'updated_at',
}
/** select columns of table "replies" */
export const enum replies_select_column {
  activity_actor_id = 'activity_actor_id',
  activity_id = 'activity_id',
  created_at = 'created_at',
  deleted_at = 'deleted_at',
  id = 'id',
  profile_id = 'profile_id',
  reply = 'reply',
  updated_at = 'updated_at',
}
/** select columns of table "reputation_scores" */
export const enum reputation_scores_select_column {
  colinks_engagement_score = 'colinks_engagement_score',
  created_at = 'created_at',
  email_score = 'email_score',
  github_score = 'github_score',
  invite_score = 'invite_score',
  linkedin_score = 'linkedin_score',
  links_score = 'links_score',
  pgive_score = 'pgive_score',
  poap_score = 'poap_score',
  profile_id = 'profile_id',
  total_score = 'total_score',
  twitter_score = 'twitter_score',
  updated_at = 'updated_at',
}
/** select columns of table "skills" */
export const enum skills_select_column {
  count = 'count',
  created_at = 'created_at',
  hidden = 'hidden',
  name = 'name',
  updated_at = 'updated_at',
}
/** select columns of table "twitter_accounts" */
export const enum twitter_accounts_select_column {
  id = 'id',
  profile_id = 'profile_id',
  username = 'username',
}
