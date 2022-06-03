/* eslint-disable */

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
    super('');
    // eslint-disable-next-line no-console
    console.info(JSON.stringify(response));
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
  ['AdminUpdateUserInput']: {
    address: string;
    circle_id: number;
    fixed_non_receiver?: boolean | undefined | null;
    name?: string | undefined | null;
    new_address?: string | undefined | null;
    non_giver?: boolean | undefined | null;
    non_receiver?: boolean | undefined | null;
    role?: number | undefined | null;
    starting_tokens?: number | undefined | null;
  };
  ['Allocation']: {
    note: string;
    recipient_id: number;
    tokens: number;
  };
  ['AllocationCsvInput']: {
    circle_id: number;
    epoch?: number | undefined | null;
    epoch_id?: number | undefined | null;
    grant?: number | undefined | null;
  };
  ['AllocationCsvResponse']: AliasType<{
    file?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['Allocations']: {
    allocations?: Array<ValueTypes['Allocation']> | undefined | null;
    circle_id: number;
  };
  ['AllocationsResponse']: AliasType<{
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
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
  ['ConfirmationResponse']: AliasType<{
    success?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['CreateCircleInput']: {
    circle_name: string;
    contact?: string | undefined | null;
    protocol_id?: number | undefined | null;
    protocol_name?: string | undefined | null;
    user_name: string;
  };
  ['CreateCircleResponse']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    id?: boolean | `@${string}`;
    users?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['users_select_column']>
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
          | Array<ValueTypes['users_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['users_bool_exp'] | undefined | null;
      },
      ValueTypes['users']
    ];
    __typename?: boolean | `@${string}`;
  }>;
  ['CreateEpochInput']: {
    circle_id: number;
    days: number;
    grant?: number | undefined | null;
    repeat: number;
    start_date: ValueTypes['timestamptz'];
  };
  ['CreateNomineeInput']: {
    address: string;
    circle_id: number;
    description: string;
    name: string;
  };
  ['CreateNomineeResponse']: AliasType<{
    id?: boolean | `@${string}`;
    /** An object relationship */
    nominee?: ValueTypes['nominees'];
    __typename?: boolean | `@${string}`;
  }>;
  ['CreateUserInput']: {
    address: string;
    circle_id: number;
    fixed_non_receiver?: boolean | undefined | null;
    name: string;
    non_giver?: boolean | undefined | null;
    non_receiver?: boolean | undefined | null;
    role?: number | undefined | null;
    starting_tokens?: number | undefined | null;
  };
  ['CreateUsersInput']: {
    circle_id: number;
    users: Array<ValueTypes['UserObj'] | undefined | null>;
  };
  ['CreateVaultInput']: {
    chain_id: number;
    org_id: number;
    vault_address: string;
  };
  ['DeleteEpochInput']: {
    circle_id: number;
    id: number;
  };
  ['DeleteEpochResponse']: AliasType<{
    success?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['DeleteUserInput']: {
    address: string;
    circle_id: number;
  };
  ['EpochResponse']: AliasType<{
    /** An object relationship */
    epoch?: ValueTypes['epochs'];
    id?: boolean | `@${string}`;
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
  ['LogoutResponse']: AliasType<{
    id?: boolean | `@${string}`;
    /** An object relationship */
    profile?: ValueTypes['profiles'];
    __typename?: boolean | `@${string}`;
  }>;
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
  ['UpdateCircleInput']: {
    alloc_text?: string | undefined | null;
    auto_opt_out?: boolean | undefined | null;
    chain_id?: number | undefined | null;
    circle_id: number;
    default_opt_in?: boolean | undefined | null;
    discord_webhook?: string | undefined | null;
    fixed_payment_token_type?: string | undefined | null;
    min_vouches?: number | undefined | null;
    name?: string | undefined | null;
    nomination_days_limit?: number | undefined | null;
    only_giver_vouch?: boolean | undefined | null;
    team_sel_text?: string | undefined | null;
    team_selection?: boolean | undefined | null;
    token_name?: string | undefined | null;
    update_webhook?: boolean | undefined | null;
    vouching?: boolean | undefined | null;
    vouching_text?: string | undefined | null;
  };
  ['UpdateCircleOutput']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['UpdateCircleResponse']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['UpdateEpochInput']: {
    circle_id: number;
    days: number;
    grant?: number | undefined | null;
    id: number;
    repeat: number;
    start_date: ValueTypes['timestamptz'];
  };
  ['UpdateOrgResponse']: AliasType<{
    id?: boolean | `@${string}`;
    /** An object relationship */
    org?: ValueTypes['organizations'];
    __typename?: boolean | `@${string}`;
  }>;
  ['UpdateProfileResponse']: AliasType<{
    id?: boolean | `@${string}`;
    /** An object relationship */
    profile?: ValueTypes['profiles'];
    __typename?: boolean | `@${string}`;
  }>;
  ['UpdateTeammatesInput']: {
    circle_id: number;
    teammates: Array<number | undefined | null>;
  };
  ['UpdateTeammatesResponse']: AliasType<{
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['UpdateUserInput']: {
    bio?: string | undefined | null;
    circle_id: number;
    epoch_first_visit?: boolean | undefined | null;
    non_receiver?: boolean | undefined | null;
  };
  ['UploadCircleImageInput']: {
    circle_id: number;
    image_data_base64: string;
  };
  ['UploadImageInput']: {
    image_data_base64: string;
  };
  ['UploadOrgImageInput']: {
    image_data_base64: string;
    org_id: number;
  };
  ['UserObj']: {
    address: string;
    fixed_non_receiver?: boolean | undefined | null;
    name: string;
    non_giver?: boolean | undefined | null;
    non_receiver?: boolean | undefined | null;
    role?: number | undefined | null;
    starting_tokens?: number | undefined | null;
  };
  ['UserResponse']: AliasType<{
    /** An object relationship */
    UserResponse?: ValueTypes['users'];
    id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  ['VaultResponse']: AliasType<{
    id?: boolean | `@${string}`;
    /** An object relationship */
    vault?: ValueTypes['vaults'];
    __typename?: boolean | `@${string}`;
  }>;
  ['VouchInput']: {
    nominee_id: number;
  };
  ['VouchOutput']: AliasType<{
    id?: boolean | `@${string}`;
    /** An object relationship */
    nominee?: ValueTypes['nominees'];
    __typename?: boolean | `@${string}`;
  }>;
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
  /** columns and relationships of "burns" */
  ['burns']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    /** An object relationship */
    epoch?: ValueTypes['epochs'];
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    original_amount?: boolean | `@${string}`;
    regift_percent?: boolean | `@${string}`;
    tokens_burnt?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "burns" */
  ['burns_aggregate_order_by']: {
    avg?: ValueTypes['burns_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['burns_max_order_by'] | undefined | null;
    min?: ValueTypes['burns_min_order_by'] | undefined | null;
    stddev?: ValueTypes['burns_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['burns_stddev_pop_order_by'] | undefined | null;
    stddev_samp?: ValueTypes['burns_stddev_samp_order_by'] | undefined | null;
    sum?: ValueTypes['burns_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['burns_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['burns_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['burns_variance_order_by'] | undefined | null;
  };
  /** order by avg() on columns of table "burns" */
  ['burns_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "burns". All fields are combined with a logical 'AND'. */
  ['burns_bool_exp']: {
    _and?: Array<ValueTypes['burns_bool_exp']> | undefined | null;
    _not?: ValueTypes['burns_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['burns_bool_exp']> | undefined | null;
    circle?: ValueTypes['circles_bool_exp'] | undefined | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    epoch?: ValueTypes['epochs_bool_exp'] | undefined | null;
    epoch_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    original_amount?: ValueTypes['Int_comparison_exp'] | undefined | null;
    regift_percent?: ValueTypes['Int_comparison_exp'] | undefined | null;
    tokens_burnt?: ValueTypes['Int_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    user?: ValueTypes['users_bool_exp'] | undefined | null;
    user_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
  };
  /** order by max() on columns of table "burns" */
  ['burns_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "burns" */
  ['burns_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "burns". */
  ['burns_order_by']: {
    circle?: ValueTypes['circles_order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    epoch?: ValueTypes['epochs_order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user?: ValueTypes['users_order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "burns" */
  ['burns_select_column']: burns_select_column;
  /** order by stddev() on columns of table "burns" */
  ['burns_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "burns" */
  ['burns_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "burns" */
  ['burns_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "burns" */
  ['burns_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "burns" */
  ['burns_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "burns" */
  ['burns_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "burns" */
  ['burns_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    original_amount?: ValueTypes['order_by'] | undefined | null;
    regift_percent?: ValueTypes['order_by'] | undefined | null;
    tokens_burnt?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Circle-scoped API keys with user defined permissions to allow third parties to authenticate to Coordinape's GraphQL API.


columns and relationships of "circle_api_keys" */
  ['circle_api_keys']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean | `@${string}`;
    create_vouches?: boolean | `@${string}`;
    /** An object relationship */
    createdByUser?: ValueTypes['users'];
    created_at?: boolean | `@${string}`;
    created_by?: boolean | `@${string}`;
    hash?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    read_circle?: boolean | `@${string}`;
    read_epochs?: boolean | `@${string}`;
    read_member_profiles?: boolean | `@${string}`;
    read_nominees?: boolean | `@${string}`;
    read_pending_token_gifts?: boolean | `@${string}`;
    update_circle?: boolean | `@${string}`;
    update_pending_token_gifts?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "circle_api_keys" */
  ['circle_api_keys_aggregate_order_by']: {
    avg?: ValueTypes['circle_api_keys_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['circle_api_keys_max_order_by'] | undefined | null;
    min?: ValueTypes['circle_api_keys_min_order_by'] | undefined | null;
    stddev?: ValueTypes['circle_api_keys_stddev_order_by'] | undefined | null;
    stddev_pop?:
      | ValueTypes['circle_api_keys_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['circle_api_keys_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['circle_api_keys_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['circle_api_keys_var_pop_order_by'] | undefined | null;
    var_samp?:
      | ValueTypes['circle_api_keys_var_samp_order_by']
      | undefined
      | null;
    variance?:
      | ValueTypes['circle_api_keys_variance_order_by']
      | undefined
      | null;
  };
  /** order by avg() on columns of table "circle_api_keys" */
  ['circle_api_keys_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "circle_api_keys". All fields are combined with a logical 'AND'. */
  ['circle_api_keys_bool_exp']: {
    _and?: Array<ValueTypes['circle_api_keys_bool_exp']> | undefined | null;
    _not?: ValueTypes['circle_api_keys_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['circle_api_keys_bool_exp']> | undefined | null;
    circle?: ValueTypes['circles_bool_exp'] | undefined | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    create_vouches?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    createdByUser?: ValueTypes['users_bool_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    created_by?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    hash?: ValueTypes['String_comparison_exp'] | undefined | null;
    name?: ValueTypes['String_comparison_exp'] | undefined | null;
    read_circle?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    read_epochs?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    read_member_profiles?:
      | ValueTypes['Boolean_comparison_exp']
      | undefined
      | null;
    read_nominees?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    read_pending_token_gifts?:
      | ValueTypes['Boolean_comparison_exp']
      | undefined
      | null;
    update_circle?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    update_pending_token_gifts?:
      | ValueTypes['Boolean_comparison_exp']
      | undefined
      | null;
  };
  /** order by max() on columns of table "circle_api_keys" */
  ['circle_api_keys_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    hash?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "circle_api_keys" */
  ['circle_api_keys_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    hash?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
  };
  /** response of any mutation on the table "circle_api_keys" */
  ['circle_api_keys_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean | `@${string}`;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['circle_api_keys'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Ordering options when selecting data from "circle_api_keys". */
  ['circle_api_keys_order_by']: {
    circle?: ValueTypes['circles_order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    create_vouches?: ValueTypes['order_by'] | undefined | null;
    createdByUser?: ValueTypes['users_order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    hash?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    read_circle?: ValueTypes['order_by'] | undefined | null;
    read_epochs?: ValueTypes['order_by'] | undefined | null;
    read_member_profiles?: ValueTypes['order_by'] | undefined | null;
    read_nominees?: ValueTypes['order_by'] | undefined | null;
    read_pending_token_gifts?: ValueTypes['order_by'] | undefined | null;
    update_circle?: ValueTypes['order_by'] | undefined | null;
    update_pending_token_gifts?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "circle_api_keys" */
  ['circle_api_keys_select_column']: circle_api_keys_select_column;
  /** order by stddev() on columns of table "circle_api_keys" */
  ['circle_api_keys_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "circle_api_keys" */
  ['circle_api_keys_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "circle_api_keys" */
  ['circle_api_keys_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "circle_api_keys" */
  ['circle_api_keys_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "circle_api_keys" */
  ['circle_api_keys_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "circle_api_keys" */
  ['circle_api_keys_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "circle_api_keys" */
  ['circle_api_keys_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "circle_integrations" */
  ['circle_integrations']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean | `@${string}`;
    data?: [
      {
        /** JSON select path */ path?: string | undefined | null;
      },
      boolean | `@${string}`
    ];
    id?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    type?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "circle_integrations" */
  ['circle_integrations_aggregate_order_by']: {
    avg?: ValueTypes['circle_integrations_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['circle_integrations_max_order_by'] | undefined | null;
    min?: ValueTypes['circle_integrations_min_order_by'] | undefined | null;
    stddev?:
      | ValueTypes['circle_integrations_stddev_order_by']
      | undefined
      | null;
    stddev_pop?:
      | ValueTypes['circle_integrations_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['circle_integrations_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['circle_integrations_sum_order_by'] | undefined | null;
    var_pop?:
      | ValueTypes['circle_integrations_var_pop_order_by']
      | undefined
      | null;
    var_samp?:
      | ValueTypes['circle_integrations_var_samp_order_by']
      | undefined
      | null;
    variance?:
      | ValueTypes['circle_integrations_variance_order_by']
      | undefined
      | null;
  };
  /** order by avg() on columns of table "circle_integrations" */
  ['circle_integrations_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "circle_integrations". All fields are combined with a logical 'AND'. */
  ['circle_integrations_bool_exp']: {
    _and?: Array<ValueTypes['circle_integrations_bool_exp']> | undefined | null;
    _not?: ValueTypes['circle_integrations_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['circle_integrations_bool_exp']> | undefined | null;
    circle?: ValueTypes['circles_bool_exp'] | undefined | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    data?: ValueTypes['json_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    name?: ValueTypes['String_comparison_exp'] | undefined | null;
    type?: ValueTypes['String_comparison_exp'] | undefined | null;
  };
  /** input type for inserting data into table "circle_integrations" */
  ['circle_integrations_insert_input']: {
    circle_id?: ValueTypes['bigint'] | undefined | null;
    data?: ValueTypes['json'] | undefined | null;
    name?: string | undefined | null;
    type?: string | undefined | null;
  };
  /** order by max() on columns of table "circle_integrations" */
  ['circle_integrations_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    type?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "circle_integrations" */
  ['circle_integrations_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    type?: ValueTypes['order_by'] | undefined | null;
  };
  /** response of any mutation on the table "circle_integrations" */
  ['circle_integrations_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean | `@${string}`;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['circle_integrations'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Ordering options when selecting data from "circle_integrations". */
  ['circle_integrations_order_by']: {
    circle?: ValueTypes['circles_order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    data?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    type?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "circle_integrations" */
  ['circle_integrations_select_column']: circle_integrations_select_column;
  /** order by stddev() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "circle_integrations" */
  ['circle_integrations_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "circle_integrations" */
  ['circle_integrations_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "circle_integrations" */
  ['circle_integrations_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "circle_integrations" */
  ['circle_integrations_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "circle_private" */
  ['circle_private']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean | `@${string}`;
    discord_webhook?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "circle_private". All fields are combined with a logical 'AND'. */
  ['circle_private_bool_exp']: {
    _and?: Array<ValueTypes['circle_private_bool_exp']> | undefined | null;
    _not?: ValueTypes['circle_private_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['circle_private_bool_exp']> | undefined | null;
    circle?: ValueTypes['circles_bool_exp'] | undefined | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    discord_webhook?: ValueTypes['String_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "circle_private". */
  ['circle_private_order_by']: {
    circle?: ValueTypes['circles_order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    discord_webhook?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "circle_private" */
  ['circle_private_select_column']: circle_private_select_column;
  /** columns and relationships of "circles" */
  ['circles']: AliasType<{
    alloc_text?: boolean | `@${string}`;
    api_keys?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circle_api_keys_select_column']>
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
          | Array<ValueTypes['circle_api_keys_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circle_api_keys_bool_exp'] | undefined | null;
      },
      ValueTypes['circle_api_keys']
    ];
    auto_opt_out?: boolean | `@${string}`;
    burns?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['burns_select_column']>
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
          | Array<ValueTypes['burns_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['burns_bool_exp'] | undefined | null;
      },
      ValueTypes['burns']
    ];
    /** An object relationship */
    circle_private?: ValueTypes['circle_private'];
    created_at?: boolean | `@${string}`;
    default_opt_in?: boolean | `@${string}`;
    epochs?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['epochs_select_column']>
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
          | Array<ValueTypes['epochs_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['epochs_bool_exp'] | undefined | null;
      },
      ValueTypes['epochs']
    ];
    fixed_payment_token_type?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    integrations?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circle_integrations_select_column']>
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
          | Array<ValueTypes['circle_integrations_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circle_integrations_bool_exp'] | undefined | null;
      },
      ValueTypes['circle_integrations']
    ];
    is_verified?: boolean | `@${string}`;
    logo?: boolean | `@${string}`;
    min_vouches?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    nomination_days_limit?: boolean | `@${string}`;
    nominees?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['nominees_select_column']>
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
          | Array<ValueTypes['nominees_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | undefined | null;
      },
      ValueTypes['nominees']
    ];
    nominees_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['nominees_select_column']>
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
          | Array<ValueTypes['nominees_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | undefined | null;
      },
      ValueTypes['nominees_aggregate']
    ];
    only_giver_vouch?: boolean | `@${string}`;
    /** An object relationship */
    organization?: ValueTypes['organizations'];
    pending_token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['pending_token_gifts_select_column']>
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
          | Array<ValueTypes['pending_token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    protocol_id?: boolean | `@${string}`;
    team_sel_text?: boolean | `@${string}`;
    team_selection?: boolean | `@${string}`;
    token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts']
    ];
    token_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    token_name?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    users?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['users_select_column']>
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
          | Array<ValueTypes['users_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['users_bool_exp'] | undefined | null;
      },
      ValueTypes['users']
    ];
    vouching?: boolean | `@${string}`;
    vouching_text?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "circles" */
  ['circles_aggregate_order_by']: {
    avg?: ValueTypes['circles_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['circles_max_order_by'] | undefined | null;
    min?: ValueTypes['circles_min_order_by'] | undefined | null;
    stddev?: ValueTypes['circles_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['circles_stddev_pop_order_by'] | undefined | null;
    stddev_samp?: ValueTypes['circles_stddev_samp_order_by'] | undefined | null;
    sum?: ValueTypes['circles_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['circles_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['circles_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['circles_variance_order_by'] | undefined | null;
  };
  /** order by avg() on columns of table "circles" */
  ['circles_avg_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "circles". All fields are combined with a logical 'AND'. */
  ['circles_bool_exp']: {
    _and?: Array<ValueTypes['circles_bool_exp']> | undefined | null;
    _not?: ValueTypes['circles_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['circles_bool_exp']> | undefined | null;
    alloc_text?: ValueTypes['String_comparison_exp'] | undefined | null;
    api_keys?: ValueTypes['circle_api_keys_bool_exp'] | undefined | null;
    auto_opt_out?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    burns?: ValueTypes['burns_bool_exp'] | undefined | null;
    circle_private?: ValueTypes['circle_private_bool_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    default_opt_in?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    epochs?: ValueTypes['epochs_bool_exp'] | undefined | null;
    fixed_payment_token_type?:
      | ValueTypes['String_comparison_exp']
      | undefined
      | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    integrations?:
      | ValueTypes['circle_integrations_bool_exp']
      | undefined
      | null;
    is_verified?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    logo?: ValueTypes['String_comparison_exp'] | undefined | null;
    min_vouches?: ValueTypes['Int_comparison_exp'] | undefined | null;
    name?: ValueTypes['String_comparison_exp'] | undefined | null;
    nomination_days_limit?: ValueTypes['Int_comparison_exp'] | undefined | null;
    nominees?: ValueTypes['nominees_bool_exp'] | undefined | null;
    only_giver_vouch?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    organization?: ValueTypes['organizations_bool_exp'] | undefined | null;
    pending_token_gifts?:
      | ValueTypes['pending_token_gifts_bool_exp']
      | undefined
      | null;
    protocol_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    team_sel_text?: ValueTypes['String_comparison_exp'] | undefined | null;
    team_selection?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    token_gifts?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
    token_name?: ValueTypes['String_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    users?: ValueTypes['users_bool_exp'] | undefined | null;
    vouching?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    vouching_text?: ValueTypes['String_comparison_exp'] | undefined | null;
  };
  /** input type for incrementing numeric columns in table "circles" */
  ['circles_inc_input']: {
    min_vouches?: number | undefined | null;
    nomination_days_limit?: number | undefined | null;
  };
  /** order by max() on columns of table "circles" */
  ['circles_max_order_by']: {
    alloc_text?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    fixed_payment_token_type?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    logo?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
    team_sel_text?: ValueTypes['order_by'] | undefined | null;
    token_name?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    vouching_text?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "circles" */
  ['circles_min_order_by']: {
    alloc_text?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    fixed_payment_token_type?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    logo?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
    team_sel_text?: ValueTypes['order_by'] | undefined | null;
    token_name?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    vouching_text?: ValueTypes['order_by'] | undefined | null;
  };
  /** response of any mutation on the table "circles" */
  ['circles_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean | `@${string}`;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['circles'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Ordering options when selecting data from "circles". */
  ['circles_order_by']: {
    alloc_text?: ValueTypes['order_by'] | undefined | null;
    api_keys_aggregate?:
      | ValueTypes['circle_api_keys_aggregate_order_by']
      | undefined
      | null;
    auto_opt_out?: ValueTypes['order_by'] | undefined | null;
    burns_aggregate?: ValueTypes['burns_aggregate_order_by'] | undefined | null;
    circle_private?: ValueTypes['circle_private_order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    default_opt_in?: ValueTypes['order_by'] | undefined | null;
    epochs_aggregate?:
      | ValueTypes['epochs_aggregate_order_by']
      | undefined
      | null;
    fixed_payment_token_type?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    integrations_aggregate?:
      | ValueTypes['circle_integrations_aggregate_order_by']
      | undefined
      | null;
    is_verified?: ValueTypes['order_by'] | undefined | null;
    logo?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    nominees_aggregate?:
      | ValueTypes['nominees_aggregate_order_by']
      | undefined
      | null;
    only_giver_vouch?: ValueTypes['order_by'] | undefined | null;
    organization?: ValueTypes['organizations_order_by'] | undefined | null;
    pending_token_gifts_aggregate?:
      | ValueTypes['pending_token_gifts_aggregate_order_by']
      | undefined
      | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
    team_sel_text?: ValueTypes['order_by'] | undefined | null;
    team_selection?: ValueTypes['order_by'] | undefined | null;
    token_gifts_aggregate?:
      | ValueTypes['token_gifts_aggregate_order_by']
      | undefined
      | null;
    token_name?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    users_aggregate?: ValueTypes['users_aggregate_order_by'] | undefined | null;
    vouching?: ValueTypes['order_by'] | undefined | null;
    vouching_text?: ValueTypes['order_by'] | undefined | null;
  };
  /** primary key columns input for table: circles */
  ['circles_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "circles" */
  ['circles_select_column']: circles_select_column;
  /** input type for updating data in table "circles" */
  ['circles_set_input']: {
    alloc_text?: string | undefined | null;
    auto_opt_out?: boolean | undefined | null;
    default_opt_in?: boolean | undefined | null;
    discord_webhook?: string | undefined | null;
    fixed_payment_token_type?: string | undefined | null;
    is_verified?: boolean | undefined | null;
    logo?: string | undefined | null;
    min_vouches?: number | undefined | null;
    name?: string | undefined | null;
    nomination_days_limit?: number | undefined | null;
    only_giver_vouch?: boolean | undefined | null;
    team_sel_text?: string | undefined | null;
    team_selection?: boolean | undefined | null;
    token_name?: string | undefined | null;
    vouching?: boolean | undefined | null;
    vouching_text?: string | undefined | null;
  };
  /** order by stddev() on columns of table "circles" */
  ['circles_stddev_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "circles" */
  ['circles_stddev_pop_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "circles" */
  ['circles_stddev_samp_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "circles" */
  ['circles_sum_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "circles" */
  ['circles_var_pop_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "circles" */
  ['circles_var_samp_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "circles" */
  ['circles_variance_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    min_vouches?: ValueTypes['order_by'] | undefined | null;
    nomination_days_limit?: ValueTypes['order_by'] | undefined | null;
    protocol_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "claims" */
  ['claims']: AliasType<{
    address?: boolean | `@${string}`;
    amount?: boolean | `@${string}`;
    claimed?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    /** An object relationship */
    distribution?: ValueTypes['distributions'];
    distribution_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    index?: boolean | `@${string}`;
    new_amount?: boolean | `@${string}`;
    proof?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "claims" */
  ['claims_aggregate_order_by']: {
    avg?: ValueTypes['claims_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['claims_max_order_by'] | undefined | null;
    min?: ValueTypes['claims_min_order_by'] | undefined | null;
    stddev?: ValueTypes['claims_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['claims_stddev_pop_order_by'] | undefined | null;
    stddev_samp?: ValueTypes['claims_stddev_samp_order_by'] | undefined | null;
    sum?: ValueTypes['claims_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['claims_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['claims_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['claims_variance_order_by'] | undefined | null;
  };
  /** input type for inserting array relation for remote table "claims" */
  ['claims_arr_rel_insert_input']: {
    data: Array<ValueTypes['claims_insert_input']>;
    /** on conflict condition */
    on_conflict?: ValueTypes['claims_on_conflict'] | undefined | null;
  };
  /** order by avg() on columns of table "claims" */
  ['claims_avg_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "claims". All fields are combined with a logical 'AND'. */
  ['claims_bool_exp']: {
    _and?: Array<ValueTypes['claims_bool_exp']> | undefined | null;
    _not?: ValueTypes['claims_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['claims_bool_exp']> | undefined | null;
    address?: ValueTypes['String_comparison_exp'] | undefined | null;
    amount?: ValueTypes['numeric_comparison_exp'] | undefined | null;
    claimed?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    distribution?: ValueTypes['distributions_bool_exp'] | undefined | null;
    distribution_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    index?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    new_amount?: ValueTypes['numeric_comparison_exp'] | undefined | null;
    proof?: ValueTypes['String_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    user?: ValueTypes['users_bool_exp'] | undefined | null;
    user_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
  };
  /** unique or primary key constraints on table "claims" */
  ['claims_constraint']: claims_constraint;
  /** input type for inserting data into table "claims" */
  ['claims_insert_input']: {
    address?: string | undefined | null;
    amount?: ValueTypes['numeric'] | undefined | null;
    distribution?:
      | ValueTypes['distributions_obj_rel_insert_input']
      | undefined
      | null;
    id?: ValueTypes['bigint'] | undefined | null;
    index?: ValueTypes['bigint'] | undefined | null;
    new_amount?: ValueTypes['numeric'] | undefined | null;
    proof?: string | undefined | null;
    user_id?: ValueTypes['bigint'] | undefined | null;
  };
  /** order by max() on columns of table "claims" */
  ['claims_max_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    amount?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    proof?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "claims" */
  ['claims_min_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    amount?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    proof?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** response of any mutation on the table "claims" */
  ['claims_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean | `@${string}`;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['claims'];
    __typename?: boolean | `@${string}`;
  }>;
  /** on conflict condition type for table "claims" */
  ['claims_on_conflict']: {
    constraint: ValueTypes['claims_constraint'];
    update_columns: Array<ValueTypes['claims_update_column']>;
    where?: ValueTypes['claims_bool_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "claims". */
  ['claims_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    amount?: ValueTypes['order_by'] | undefined | null;
    claimed?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    distribution?: ValueTypes['distributions_order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    proof?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user?: ValueTypes['users_order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** primary key columns input for table: claims */
  ['claims_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "claims" */
  ['claims_select_column']: claims_select_column;
  /** input type for updating data in table "claims" */
  ['claims_set_input']: {
    claimed?: boolean | undefined | null;
  };
  /** order by stddev() on columns of table "claims" */
  ['claims_stddev_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "claims" */
  ['claims_stddev_pop_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "claims" */
  ['claims_stddev_samp_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "claims" */
  ['claims_sum_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** update columns of table "claims" */
  ['claims_update_column']: claims_update_column;
  /** order by var_pop() on columns of table "claims" */
  ['claims_var_pop_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "claims" */
  ['claims_var_samp_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "claims" */
  ['claims_variance_order_by']: {
    amount?: ValueTypes['order_by'] | undefined | null;
    distribution_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    index?: ValueTypes['order_by'] | undefined | null;
    new_amount?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
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
  /** Vault Distributions


columns and relationships of "distributions" */
  ['distributions']: AliasType<{
    claims?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['claims_select_column']>
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
          | Array<ValueTypes['claims_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['claims_bool_exp'] | undefined | null;
      },
      ValueTypes['claims']
    ];
    created_at?: boolean | `@${string}`;
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    distribution_json?: [
      {
        /** JSON select path */ path?: string | undefined | null;
      },
      boolean | `@${string}`
    ];
    /** An object relationship */
    epoch?: ValueTypes['epochs'];
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    merkle_root?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    tx_hash?: boolean | `@${string}`;
    /** An object relationship */
    vault?: ValueTypes['vaults'];
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregated selection of "distributions" */
  ['distributions_aggregate']: AliasType<{
    aggregate?: ValueTypes['distributions_aggregate_fields'];
    nodes?: ValueTypes['distributions'];
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate fields of "distributions" */
  ['distributions_aggregate_fields']: AliasType<{
    avg?: ValueTypes['distributions_avg_fields'];
    count?: [
      {
        columns?:
          | Array<ValueTypes['distributions_select_column']>
          | undefined
          | null;
        distinct?: boolean | undefined | null;
      },
      boolean | `@${string}`
    ];
    max?: ValueTypes['distributions_max_fields'];
    min?: ValueTypes['distributions_min_fields'];
    stddev?: ValueTypes['distributions_stddev_fields'];
    stddev_pop?: ValueTypes['distributions_stddev_pop_fields'];
    stddev_samp?: ValueTypes['distributions_stddev_samp_fields'];
    sum?: ValueTypes['distributions_sum_fields'];
    var_pop?: ValueTypes['distributions_var_pop_fields'];
    var_samp?: ValueTypes['distributions_var_samp_fields'];
    variance?: ValueTypes['distributions_variance_fields'];
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "distributions" */
  ['distributions_aggregate_order_by']: {
    avg?: ValueTypes['distributions_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['distributions_max_order_by'] | undefined | null;
    min?: ValueTypes['distributions_min_order_by'] | undefined | null;
    stddev?: ValueTypes['distributions_stddev_order_by'] | undefined | null;
    stddev_pop?:
      | ValueTypes['distributions_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['distributions_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['distributions_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['distributions_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['distributions_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['distributions_variance_order_by'] | undefined | null;
  };
  /** aggregate avg on columns */
  ['distributions_avg_fields']: AliasType<{
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by avg() on columns of table "distributions" */
  ['distributions_avg_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "distributions". All fields are combined with a logical 'AND'. */
  ['distributions_bool_exp']: {
    _and?: Array<ValueTypes['distributions_bool_exp']> | undefined | null;
    _not?: ValueTypes['distributions_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['distributions_bool_exp']> | undefined | null;
    claims?: ValueTypes['claims_bool_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    created_by?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    distribution_epoch_id?:
      | ValueTypes['bigint_comparison_exp']
      | undefined
      | null;
    distribution_json?: ValueTypes['jsonb_comparison_exp'] | undefined | null;
    epoch?: ValueTypes['epochs_bool_exp'] | undefined | null;
    epoch_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    merkle_root?: ValueTypes['String_comparison_exp'] | undefined | null;
    total_amount?: ValueTypes['numeric_comparison_exp'] | undefined | null;
    tx_hash?: ValueTypes['String_comparison_exp'] | undefined | null;
    vault?: ValueTypes['vaults_bool_exp'] | undefined | null;
    vault_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
  };
  /** unique or primary key constraints on table "distributions" */
  ['distributions_constraint']: distributions_constraint;
  /** input type for incrementing numeric columns in table "distributions" */
  ['distributions_inc_input']: {
    distribution_epoch_id?: ValueTypes['bigint'] | undefined | null;
  };
  /** input type for inserting data into table "distributions" */
  ['distributions_insert_input']: {
    claims?: ValueTypes['claims_arr_rel_insert_input'] | undefined | null;
    distribution_epoch_id?: ValueTypes['bigint'] | undefined | null;
    distribution_json?: ValueTypes['jsonb'] | undefined | null;
    epoch_id?: ValueTypes['bigint'] | undefined | null;
    merkle_root?: string | undefined | null;
    total_amount?: ValueTypes['numeric'] | undefined | null;
    vault_id?: ValueTypes['bigint'] | undefined | null;
  };
  /** aggregate max on columns */
  ['distributions_max_fields']: AliasType<{
    created_at?: boolean | `@${string}`;
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    merkle_root?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    tx_hash?: boolean | `@${string}`;
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by max() on columns of table "distributions" */
  ['distributions_max_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    merkle_root?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    tx_hash?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate min on columns */
  ['distributions_min_fields']: AliasType<{
    created_at?: boolean | `@${string}`;
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    merkle_root?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    tx_hash?: boolean | `@${string}`;
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by min() on columns of table "distributions" */
  ['distributions_min_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    merkle_root?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    tx_hash?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** response of any mutation on the table "distributions" */
  ['distributions_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean | `@${string}`;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['distributions'];
    __typename?: boolean | `@${string}`;
  }>;
  /** input type for inserting object relation for remote table "distributions" */
  ['distributions_obj_rel_insert_input']: {
    data: ValueTypes['distributions_insert_input'];
    /** on conflict condition */
    on_conflict?: ValueTypes['distributions_on_conflict'] | undefined | null;
  };
  /** on conflict condition type for table "distributions" */
  ['distributions_on_conflict']: {
    constraint: ValueTypes['distributions_constraint'];
    update_columns: Array<ValueTypes['distributions_update_column']>;
    where?: ValueTypes['distributions_bool_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "distributions". */
  ['distributions_order_by']: {
    claims_aggregate?:
      | ValueTypes['claims_aggregate_order_by']
      | undefined
      | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    distribution_json?: ValueTypes['order_by'] | undefined | null;
    epoch?: ValueTypes['epochs_order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    merkle_root?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    tx_hash?: ValueTypes['order_by'] | undefined | null;
    vault?: ValueTypes['vaults_order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** primary key columns input for table: distributions */
  ['distributions_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "distributions" */
  ['distributions_select_column']: distributions_select_column;
  /** input type for updating data in table "distributions" */
  ['distributions_set_input']: {
    distribution_epoch_id?: ValueTypes['bigint'] | undefined | null;
    tx_hash?: string | undefined | null;
  };
  /** aggregate stddev on columns */
  ['distributions_stddev_fields']: AliasType<{
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev() on columns of table "distributions" */
  ['distributions_stddev_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_pop on columns */
  ['distributions_stddev_pop_fields']: AliasType<{
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_pop() on columns of table "distributions" */
  ['distributions_stddev_pop_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_samp on columns */
  ['distributions_stddev_samp_fields']: AliasType<{
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_samp() on columns of table "distributions" */
  ['distributions_stddev_samp_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate sum on columns */
  ['distributions_sum_fields']: AliasType<{
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by sum() on columns of table "distributions" */
  ['distributions_sum_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** update columns of table "distributions" */
  ['distributions_update_column']: distributions_update_column;
  /** aggregate var_pop on columns */
  ['distributions_var_pop_fields']: AliasType<{
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_pop() on columns of table "distributions" */
  ['distributions_var_pop_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_samp on columns */
  ['distributions_var_samp_fields']: AliasType<{
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_samp() on columns of table "distributions" */
  ['distributions_var_samp_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate variance on columns */
  ['distributions_variance_fields']: AliasType<{
    created_by?: boolean | `@${string}`;
    distribution_epoch_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    total_amount?: boolean | `@${string}`;
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by variance() on columns of table "distributions" */
  ['distributions_variance_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    distribution_epoch_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    total_amount?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "epoches" */
  ['epochs']: AliasType<{
    burns?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['burns_select_column']>
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
          | Array<ValueTypes['burns_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['burns_bool_exp'] | undefined | null;
      },
      ValueTypes['burns']
    ];
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    days?: boolean | `@${string}`;
    distributions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['distributions_select_column']>
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
          | Array<ValueTypes['distributions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['distributions_bool_exp'] | undefined | null;
      },
      ValueTypes['distributions']
    ];
    distributions_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['distributions_select_column']>
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
          | Array<ValueTypes['distributions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['distributions_bool_exp'] | undefined | null;
      },
      ValueTypes['distributions_aggregate']
    ];
    end_date?: boolean | `@${string}`;
    ended?: boolean | `@${string}`;
    epoch_pending_token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['pending_token_gifts_select_column']>
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
          | Array<ValueTypes['pending_token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    grant?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    notified_before_end?: boolean | `@${string}`;
    notified_end?: boolean | `@${string}`;
    notified_start?: boolean | `@${string}`;
    number?: boolean | `@${string}`;
    repeat?: boolean | `@${string}`;
    repeat_day_of_month?: boolean | `@${string}`;
    start_date?: boolean | `@${string}`;
    token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts']
    ];
    token_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "epoches" */
  ['epochs_aggregate_order_by']: {
    avg?: ValueTypes['epochs_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['epochs_max_order_by'] | undefined | null;
    min?: ValueTypes['epochs_min_order_by'] | undefined | null;
    stddev?: ValueTypes['epochs_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['epochs_stddev_pop_order_by'] | undefined | null;
    stddev_samp?: ValueTypes['epochs_stddev_samp_order_by'] | undefined | null;
    sum?: ValueTypes['epochs_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['epochs_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['epochs_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['epochs_variance_order_by'] | undefined | null;
  };
  /** order by avg() on columns of table "epoches" */
  ['epochs_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "epoches". All fields are combined with a logical 'AND'. */
  ['epochs_bool_exp']: {
    _and?: Array<ValueTypes['epochs_bool_exp']> | undefined | null;
    _not?: ValueTypes['epochs_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['epochs_bool_exp']> | undefined | null;
    burns?: ValueTypes['burns_bool_exp'] | undefined | null;
    circle?: ValueTypes['circles_bool_exp'] | undefined | null;
    circle_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    days?: ValueTypes['Int_comparison_exp'] | undefined | null;
    distributions?: ValueTypes['distributions_bool_exp'] | undefined | null;
    end_date?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    ended?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    epoch_pending_token_gifts?:
      | ValueTypes['pending_token_gifts_bool_exp']
      | undefined
      | null;
    grant?: ValueTypes['numeric_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    notified_before_end?:
      | ValueTypes['timestamp_comparison_exp']
      | undefined
      | null;
    notified_end?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    notified_start?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    number?: ValueTypes['Int_comparison_exp'] | undefined | null;
    repeat?: ValueTypes['Int_comparison_exp'] | undefined | null;
    repeat_day_of_month?: ValueTypes['Int_comparison_exp'] | undefined | null;
    start_date?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    token_gifts?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
  };
  /** order by max() on columns of table "epoches" */
  ['epochs_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    end_date?: ValueTypes['order_by'] | undefined | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    notified_before_end?: ValueTypes['order_by'] | undefined | null;
    notified_end?: ValueTypes['order_by'] | undefined | null;
    notified_start?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
    start_date?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "epoches" */
  ['epochs_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    end_date?: ValueTypes['order_by'] | undefined | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    notified_before_end?: ValueTypes['order_by'] | undefined | null;
    notified_end?: ValueTypes['order_by'] | undefined | null;
    notified_start?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
    start_date?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "epoches". */
  ['epochs_order_by']: {
    burns_aggregate?: ValueTypes['burns_aggregate_order_by'] | undefined | null;
    circle?: ValueTypes['circles_order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    distributions_aggregate?:
      | ValueTypes['distributions_aggregate_order_by']
      | undefined
      | null;
    end_date?: ValueTypes['order_by'] | undefined | null;
    ended?: ValueTypes['order_by'] | undefined | null;
    epoch_pending_token_gifts_aggregate?:
      | ValueTypes['pending_token_gifts_aggregate_order_by']
      | undefined
      | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    notified_before_end?: ValueTypes['order_by'] | undefined | null;
    notified_end?: ValueTypes['order_by'] | undefined | null;
    notified_start?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
    start_date?: ValueTypes['order_by'] | undefined | null;
    token_gifts_aggregate?:
      | ValueTypes['token_gifts_aggregate_order_by']
      | undefined
      | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "epoches" */
  ['epochs_select_column']: epochs_select_column;
  /** order by stddev() on columns of table "epoches" */
  ['epochs_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "epoches" */
  ['epochs_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "epoches" */
  ['epochs_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "epoches" */
  ['epochs_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "epoches" */
  ['epochs_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "epoches" */
  ['epochs_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "epoches" */
  ['epochs_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    days?: ValueTypes['order_by'] | undefined | null;
    grant?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    number?: ValueTypes['order_by'] | undefined | null;
    repeat?: ValueTypes['order_by'] | undefined | null;
    repeat_day_of_month?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "gift_private" */
  ['gift_private']: AliasType<{
    gift_id?: boolean | `@${string}`;
    note?: boolean | `@${string}`;
    /** An object relationship */
    recipient?: ValueTypes['users'];
    recipient_id?: boolean | `@${string}`;
    /** An object relationship */
    sender?: ValueTypes['users'];
    sender_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "gift_private". All fields are combined with a logical 'AND'. */
  ['gift_private_bool_exp']: {
    _and?: Array<ValueTypes['gift_private_bool_exp']> | undefined | null;
    _not?: ValueTypes['gift_private_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['gift_private_bool_exp']> | undefined | null;
    gift_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    note?: ValueTypes['String_comparison_exp'] | undefined | null;
    recipient?: ValueTypes['users_bool_exp'] | undefined | null;
    recipient_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    sender?: ValueTypes['users_bool_exp'] | undefined | null;
    sender_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "gift_private". */
  ['gift_private_order_by']: {
    gift_id?: ValueTypes['order_by'] | undefined | null;
    note?: ValueTypes['order_by'] | undefined | null;
    recipient?: ValueTypes['users_order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender?: ValueTypes['users_order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "gift_private" */
  ['gift_private_select_column']: gift_private_select_column;
  ['json']: unknown;
  /** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
  ['json_comparison_exp']: {
    _eq?: ValueTypes['json'] | undefined | null;
    _gt?: ValueTypes['json'] | undefined | null;
    _gte?: ValueTypes['json'] | undefined | null;
    _in?: Array<ValueTypes['json']> | undefined | null;
    _is_null?: boolean | undefined | null;
    _lt?: ValueTypes['json'] | undefined | null;
    _lte?: ValueTypes['json'] | undefined | null;
    _neq?: ValueTypes['json'] | undefined | null;
    _nin?: Array<ValueTypes['json']> | undefined | null;
  };
  ['jsonb']: unknown;
  /** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
  ['jsonb_comparison_exp']: {
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
  /** mutation root */
  ['mutation_root']: AliasType<{
    adminUpdateUser?: [
      { payload: ValueTypes['AdminUpdateUserInput'] },
      ValueTypes['UserResponse']
    ];
    allocationCsv?: [
      { payload: ValueTypes['AllocationCsvInput'] },
      ValueTypes['AllocationCsvResponse']
    ];
    createCircle?: [
      { payload: ValueTypes['CreateCircleInput'] },
      ValueTypes['CreateCircleResponse']
    ];
    createEpoch?: [
      { payload: ValueTypes['CreateEpochInput'] },
      ValueTypes['EpochResponse']
    ];
    createNominee?: [
      { payload: ValueTypes['CreateNomineeInput'] },
      ValueTypes['CreateNomineeResponse']
    ];
    createUser?: [
      { payload: ValueTypes['CreateUserInput'] },
      ValueTypes['UserResponse']
    ];
    createUsers?: [
      { payload: ValueTypes['CreateUsersInput'] },
      ValueTypes['UserResponse']
    ];
    createVault?: [
      { payload: ValueTypes['CreateVaultInput'] },
      ValueTypes['VaultResponse']
    ];
    deleteEpoch?: [
      { payload: ValueTypes['DeleteEpochInput'] },
      ValueTypes['DeleteEpochResponse']
    ];
    deleteUser?: [
      { payload: ValueTypes['DeleteUserInput'] },
      ValueTypes['ConfirmationResponse']
    ];
    delete_circle_api_keys?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['circle_api_keys_bool_exp'];
      },
      ValueTypes['circle_api_keys_mutation_response']
    ];
    delete_circle_api_keys_by_pk?: [
      { hash: string },
      ValueTypes['circle_api_keys']
    ];
    delete_circle_integrations?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['circle_integrations_bool_exp'];
      },
      ValueTypes['circle_integrations_mutation_response']
    ];
    delete_circle_integrations_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['circle_integrations']
    ];
    insert_circle_integrations?: [
      {
        /** the rows to be inserted */
        objects: Array<ValueTypes['circle_integrations_insert_input']>;
      },
      ValueTypes['circle_integrations_mutation_response']
    ];
    insert_circle_integrations_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['circle_integrations_insert_input'];
      },
      ValueTypes['circle_integrations']
    ];
    insert_claims?: [
      {
        /** the rows to be inserted */
        objects: Array<
          ValueTypes['claims_insert_input']
        > /** on conflict condition */;
        on_conflict?: ValueTypes['claims_on_conflict'] | undefined | null;
      },
      ValueTypes['claims_mutation_response']
    ];
    insert_claims_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['claims_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['claims_on_conflict'] | undefined | null;
      },
      ValueTypes['claims']
    ];
    insert_distributions?: [
      {
        /** the rows to be inserted */
        objects: Array<
          ValueTypes['distributions_insert_input']
        > /** on conflict condition */;
        on_conflict?:
          | ValueTypes['distributions_on_conflict']
          | undefined
          | null;
      },
      ValueTypes['distributions_mutation_response']
    ];
    insert_distributions_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['distributions_insert_input'] /** on conflict condition */;
        on_conflict?:
          | ValueTypes['distributions_on_conflict']
          | undefined
          | null;
      },
      ValueTypes['distributions']
    ];
    insert_vault_transactions?: [
      {
        /** the rows to be inserted */
        objects: Array<ValueTypes['vault_transactions_insert_input']>;
      },
      ValueTypes['vault_transactions_mutation_response']
    ];
    insert_vault_transactions_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['vault_transactions_insert_input'];
      },
      ValueTypes['vault_transactions']
    ];
    logoutUser?: ValueTypes['LogoutResponse'];
    updateAllocations?: [
      { payload: ValueTypes['Allocations'] },
      ValueTypes['AllocationsResponse']
    ];
    updateCircle?: [
      { payload: ValueTypes['UpdateCircleInput'] },
      ValueTypes['UpdateCircleOutput']
    ];
    updateEpoch?: [
      { payload: ValueTypes['UpdateEpochInput'] },
      ValueTypes['EpochResponse']
    ];
    updateTeammates?: [
      { payload: ValueTypes['UpdateTeammatesInput'] },
      ValueTypes['UpdateTeammatesResponse']
    ];
    updateUser?: [
      { payload: ValueTypes['UpdateUserInput'] },
      ValueTypes['UserResponse']
    ];
    update_circles?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['circles_inc_input']
          | undefined
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['circles_set_input']
          | undefined
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['circles_bool_exp'];
      },
      ValueTypes['circles_mutation_response']
    ];
    update_circles_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['circles_inc_input']
          | undefined
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['circles_set_input'] | undefined | null;
        pk_columns: ValueTypes['circles_pk_columns_input'];
      },
      ValueTypes['circles']
    ];
    update_claims?: [
      {
        /** sets the columns of the filtered rows to the given values */
        _set?:
          | ValueTypes['claims_set_input']
          | undefined
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['claims_bool_exp'];
      },
      ValueTypes['claims_mutation_response']
    ];
    update_claims_by_pk?: [
      {
        /** sets the columns of the filtered rows to the given values */
        _set?: ValueTypes['claims_set_input'] | undefined | null;
        pk_columns: ValueTypes['claims_pk_columns_input'];
      },
      ValueTypes['claims']
    ];
    update_distributions?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['distributions_inc_input']
          | undefined
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['distributions_set_input']
          | undefined
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['distributions_bool_exp'];
      },
      ValueTypes['distributions_mutation_response']
    ];
    update_distributions_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['distributions_inc_input']
          | undefined
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['distributions_set_input'] | undefined | null;
        pk_columns: ValueTypes['distributions_pk_columns_input'];
      },
      ValueTypes['distributions']
    ];
    update_profiles?: [
      {
        /** sets the columns of the filtered rows to the given values */
        _set?:
          | ValueTypes['profiles_set_input']
          | undefined
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['profiles_bool_exp'];
      },
      ValueTypes['profiles_mutation_response']
    ];
    update_profiles_by_pk?: [
      {
        /** sets the columns of the filtered rows to the given values */
        _set?: ValueTypes['profiles_set_input'] | undefined | null;
        pk_columns: ValueTypes['profiles_pk_columns_input'];
      },
      ValueTypes['profiles']
    ];
    uploadCircleLogo?: [
      { payload: ValueTypes['UploadCircleImageInput'] },
      ValueTypes['UpdateCircleResponse']
    ];
    uploadOrgLogo?: [
      { payload: ValueTypes['UploadOrgImageInput'] },
      ValueTypes['UpdateOrgResponse']
    ];
    uploadProfileAvatar?: [
      { payload: ValueTypes['UploadImageInput'] },
      ValueTypes['UpdateProfileResponse']
    ];
    uploadProfileBackground?: [
      { payload: ValueTypes['UploadImageInput'] },
      ValueTypes['UpdateProfileResponse']
    ];
    vouch?: [{ payload: ValueTypes['VouchInput'] }, ValueTypes['VouchOutput']];
    __typename?: boolean | `@${string}`;
  }>;
  /** columns and relationships of "nominees" */
  ['nominees']: AliasType<{
    address?: boolean | `@${string}`;
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    description?: boolean | `@${string}`;
    ended?: boolean | `@${string}`;
    expiry_date?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    nominated_date?: boolean | `@${string}`;
    nominations?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['vouches_select_column']>
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
          | Array<ValueTypes['vouches_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['vouches_bool_exp'] | undefined | null;
      },
      ValueTypes['vouches']
    ];
    /** An object relationship */
    nominator?: ValueTypes['users'];
    updated_at?: boolean | `@${string}`;
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregated selection of "nominees" */
  ['nominees_aggregate']: AliasType<{
    aggregate?: ValueTypes['nominees_aggregate_fields'];
    nodes?: ValueTypes['nominees'];
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate fields of "nominees" */
  ['nominees_aggregate_fields']: AliasType<{
    avg?: ValueTypes['nominees_avg_fields'];
    count?: [
      {
        columns?:
          | Array<ValueTypes['nominees_select_column']>
          | undefined
          | null;
        distinct?: boolean | undefined | null;
      },
      boolean | `@${string}`
    ];
    max?: ValueTypes['nominees_max_fields'];
    min?: ValueTypes['nominees_min_fields'];
    stddev?: ValueTypes['nominees_stddev_fields'];
    stddev_pop?: ValueTypes['nominees_stddev_pop_fields'];
    stddev_samp?: ValueTypes['nominees_stddev_samp_fields'];
    sum?: ValueTypes['nominees_sum_fields'];
    var_pop?: ValueTypes['nominees_var_pop_fields'];
    var_samp?: ValueTypes['nominees_var_samp_fields'];
    variance?: ValueTypes['nominees_variance_fields'];
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "nominees" */
  ['nominees_aggregate_order_by']: {
    avg?: ValueTypes['nominees_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['nominees_max_order_by'] | undefined | null;
    min?: ValueTypes['nominees_min_order_by'] | undefined | null;
    stddev?: ValueTypes['nominees_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['nominees_stddev_pop_order_by'] | undefined | null;
    stddev_samp?:
      | ValueTypes['nominees_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['nominees_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['nominees_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['nominees_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['nominees_variance_order_by'] | undefined | null;
  };
  /** aggregate avg on columns */
  ['nominees_avg_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by avg() on columns of table "nominees" */
  ['nominees_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "nominees". All fields are combined with a logical 'AND'. */
  ['nominees_bool_exp']: {
    _and?: Array<ValueTypes['nominees_bool_exp']> | undefined | null;
    _not?: ValueTypes['nominees_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['nominees_bool_exp']> | undefined | null;
    address?: ValueTypes['String_comparison_exp'] | undefined | null;
    circle?: ValueTypes['circles_bool_exp'] | undefined | null;
    circle_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    description?: ValueTypes['String_comparison_exp'] | undefined | null;
    ended?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    expiry_date?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    name?: ValueTypes['String_comparison_exp'] | undefined | null;
    nominated_by_user_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    nominated_date?: ValueTypes['date_comparison_exp'] | undefined | null;
    nominations?: ValueTypes['vouches_bool_exp'] | undefined | null;
    nominator?: ValueTypes['users_bool_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    user?: ValueTypes['users_bool_exp'] | undefined | null;
    user_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    vouches_required?: ValueTypes['Int_comparison_exp'] | undefined | null;
  };
  /** aggregate max on columns */
  ['nominees_max_fields']: AliasType<{
    address?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    description?: boolean | `@${string}`;
    expiry_date?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    nominated_date?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by max() on columns of table "nominees" */
  ['nominees_max_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
    expiry_date?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    nominated_date?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate min on columns */
  ['nominees_min_fields']: AliasType<{
    address?: boolean | `@${string}`;
    circle_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    description?: boolean | `@${string}`;
    expiry_date?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    nominated_date?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by min() on columns of table "nominees" */
  ['nominees_min_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
    expiry_date?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    nominated_date?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "nominees". */
  ['nominees_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    circle?: ValueTypes['circles_order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
    ended?: ValueTypes['order_by'] | undefined | null;
    expiry_date?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    nominated_date?: ValueTypes['order_by'] | undefined | null;
    nominations_aggregate?:
      | ValueTypes['vouches_aggregate_order_by']
      | undefined
      | null;
    nominator?: ValueTypes['users_order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user?: ValueTypes['users_order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "nominees" */
  ['nominees_select_column']: nominees_select_column;
  /** aggregate stddev on columns */
  ['nominees_stddev_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev() on columns of table "nominees" */
  ['nominees_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_pop on columns */
  ['nominees_stddev_pop_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_pop() on columns of table "nominees" */
  ['nominees_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_samp on columns */
  ['nominees_stddev_samp_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_samp() on columns of table "nominees" */
  ['nominees_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate sum on columns */
  ['nominees_sum_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by sum() on columns of table "nominees" */
  ['nominees_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_pop on columns */
  ['nominees_var_pop_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_pop() on columns of table "nominees" */
  ['nominees_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_samp on columns */
  ['nominees_var_samp_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_samp() on columns of table "nominees" */
  ['nominees_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate variance on columns */
  ['nominees_variance_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    nominated_by_user_id?: boolean | `@${string}`;
    user_id?: boolean | `@${string}`;
    vouches_required?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by variance() on columns of table "nominees" */
  ['nominees_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominated_by_user_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
    vouches_required?: ValueTypes['order_by'] | undefined | null;
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
  /** columns and relationships of "protocols" */
  ['organizations']: AliasType<{
    circles?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circles_select_column']>
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
          | Array<ValueTypes['circles_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circles_bool_exp'] | undefined | null;
      },
      ValueTypes['circles']
    ];
    created_at?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    logo?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    vaults?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['vaults_select_column']>
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
          | Array<ValueTypes['vaults_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['vaults_bool_exp'] | undefined | null;
      },
      ValueTypes['vaults']
    ];
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
  ['organizations_bool_exp']: {
    _and?: Array<ValueTypes['organizations_bool_exp']> | undefined | null;
    _not?: ValueTypes['organizations_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['organizations_bool_exp']> | undefined | null;
    circles?: ValueTypes['circles_bool_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    logo?: ValueTypes['String_comparison_exp'] | undefined | null;
    name?: ValueTypes['String_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    vaults?: ValueTypes['vaults_bool_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "protocols". */
  ['organizations_order_by']: {
    circles_aggregate?:
      | ValueTypes['circles_aggregate_order_by']
      | undefined
      | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    logo?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    vaults_aggregate?:
      | ValueTypes['vaults_aggregate_order_by']
      | undefined
      | null;
  };
  /** select columns of table "protocols" */
  ['organizations_select_column']: organizations_select_column;
  /** columns and relationships of "pending_gift_private" */
  ['pending_gift_private']: AliasType<{
    gift_id?: boolean | `@${string}`;
    note?: boolean | `@${string}`;
    /** An object relationship */
    recipient?: ValueTypes['users'];
    recipient_id?: boolean | `@${string}`;
    /** An object relationship */
    sender?: ValueTypes['users'];
    sender_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "pending_gift_private". All fields are combined with a logical 'AND'. */
  ['pending_gift_private_bool_exp']: {
    _and?:
      | Array<ValueTypes['pending_gift_private_bool_exp']>
      | undefined
      | null;
    _not?: ValueTypes['pending_gift_private_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['pending_gift_private_bool_exp']> | undefined | null;
    gift_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    note?: ValueTypes['String_comparison_exp'] | undefined | null;
    recipient?: ValueTypes['users_bool_exp'] | undefined | null;
    recipient_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    sender?: ValueTypes['users_bool_exp'] | undefined | null;
    sender_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "pending_gift_private". */
  ['pending_gift_private_order_by']: {
    gift_id?: ValueTypes['order_by'] | undefined | null;
    note?: ValueTypes['order_by'] | undefined | null;
    recipient?: ValueTypes['users_order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender?: ValueTypes['users_order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "pending_gift_private" */
  ['pending_gift_private_select_column']: pending_gift_private_select_column;
  /** GIVE allocations made by circle members for the currently running epoch


columns and relationships of "pending_token_gifts" */
  ['pending_token_gifts']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    dts_created?: boolean | `@${string}`;
    /** An object relationship */
    epoch?: ValueTypes['epochs'];
    epoch_id?: boolean | `@${string}`;
    /** An object relationship */
    gift_private?: ValueTypes['pending_gift_private'];
    id?: boolean | `@${string}`;
    /** An object relationship */
    recipient?: ValueTypes['users'];
    recipient_address?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    /** An object relationship */
    sender?: ValueTypes['users'];
    sender_address?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "pending_token_gifts" */
  ['pending_token_gifts_aggregate_order_by']: {
    avg?: ValueTypes['pending_token_gifts_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['pending_token_gifts_max_order_by'] | undefined | null;
    min?: ValueTypes['pending_token_gifts_min_order_by'] | undefined | null;
    stddev?:
      | ValueTypes['pending_token_gifts_stddev_order_by']
      | undefined
      | null;
    stddev_pop?:
      | ValueTypes['pending_token_gifts_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['pending_token_gifts_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['pending_token_gifts_sum_order_by'] | undefined | null;
    var_pop?:
      | ValueTypes['pending_token_gifts_var_pop_order_by']
      | undefined
      | null;
    var_samp?:
      | ValueTypes['pending_token_gifts_var_samp_order_by']
      | undefined
      | null;
    variance?:
      | ValueTypes['pending_token_gifts_variance_order_by']
      | undefined
      | null;
  };
  /** order by avg() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "pending_token_gifts". All fields are combined with a logical 'AND'. */
  ['pending_token_gifts_bool_exp']: {
    _and?: Array<ValueTypes['pending_token_gifts_bool_exp']> | undefined | null;
    _not?: ValueTypes['pending_token_gifts_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['pending_token_gifts_bool_exp']> | undefined | null;
    circle?: ValueTypes['circles_bool_exp'] | undefined | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    dts_created?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    epoch?: ValueTypes['epochs_bool_exp'] | undefined | null;
    epoch_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    gift_private?:
      | ValueTypes['pending_gift_private_bool_exp']
      | undefined
      | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    recipient?: ValueTypes['users_bool_exp'] | undefined | null;
    recipient_address?: ValueTypes['String_comparison_exp'] | undefined | null;
    recipient_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    sender?: ValueTypes['users_bool_exp'] | undefined | null;
    sender_address?: ValueTypes['String_comparison_exp'] | undefined | null;
    sender_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    tokens?: ValueTypes['Int_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
  };
  /** order by max() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    dts_created?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_address?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_address?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    dts_created?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_address?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_address?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "pending_token_gifts". */
  ['pending_token_gifts_order_by']: {
    circle?: ValueTypes['circles_order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    dts_created?: ValueTypes['order_by'] | undefined | null;
    epoch?: ValueTypes['epochs_order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    gift_private?:
      | ValueTypes['pending_gift_private_order_by']
      | undefined
      | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient?: ValueTypes['users_order_by'] | undefined | null;
    recipient_address?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender?: ValueTypes['users_order_by'] | undefined | null;
    sender_address?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "pending_token_gifts" */
  ['pending_token_gifts_select_column']: pending_token_gifts_select_column;
  /** order by stddev() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** Coordinape user accounts that can belong to one or many circles via the relationship to the users table


columns and relationships of "profiles" */
  ['profiles']: AliasType<{
    address?: boolean | `@${string}`;
    avatar?: boolean | `@${string}`;
    background?: boolean | `@${string}`;
    bio?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    discord_username?: boolean | `@${string}`;
    github_username?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    medium_username?: boolean | `@${string}`;
    skills?: boolean | `@${string}`;
    telegram_username?: boolean | `@${string}`;
    twitter_username?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    users?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['users_select_column']>
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
          | Array<ValueTypes['users_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['users_bool_exp'] | undefined | null;
      },
      ValueTypes['users']
    ];
    website?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
  ['profiles_bool_exp']: {
    _and?: Array<ValueTypes['profiles_bool_exp']> | undefined | null;
    _not?: ValueTypes['profiles_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['profiles_bool_exp']> | undefined | null;
    address?: ValueTypes['String_comparison_exp'] | undefined | null;
    avatar?: ValueTypes['String_comparison_exp'] | undefined | null;
    background?: ValueTypes['String_comparison_exp'] | undefined | null;
    bio?: ValueTypes['String_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    discord_username?: ValueTypes['String_comparison_exp'] | undefined | null;
    github_username?: ValueTypes['String_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    medium_username?: ValueTypes['String_comparison_exp'] | undefined | null;
    skills?: ValueTypes['String_comparison_exp'] | undefined | null;
    telegram_username?: ValueTypes['String_comparison_exp'] | undefined | null;
    twitter_username?: ValueTypes['String_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    users?: ValueTypes['users_bool_exp'] | undefined | null;
    website?: ValueTypes['String_comparison_exp'] | undefined | null;
  };
  /** response of any mutation on the table "profiles" */
  ['profiles_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean | `@${string}`;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['profiles'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Ordering options when selecting data from "profiles". */
  ['profiles_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    avatar?: ValueTypes['order_by'] | undefined | null;
    background?: ValueTypes['order_by'] | undefined | null;
    bio?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    discord_username?: ValueTypes['order_by'] | undefined | null;
    github_username?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    medium_username?: ValueTypes['order_by'] | undefined | null;
    skills?: ValueTypes['order_by'] | undefined | null;
    telegram_username?: ValueTypes['order_by'] | undefined | null;
    twitter_username?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    users_aggregate?: ValueTypes['users_aggregate_order_by'] | undefined | null;
    website?: ValueTypes['order_by'] | undefined | null;
  };
  /** primary key columns input for table: profiles */
  ['profiles_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "profiles" */
  ['profiles_select_column']: profiles_select_column;
  /** input type for updating data in table "profiles" */
  ['profiles_set_input']: {
    avatar?: string | undefined | null;
    background?: string | undefined | null;
    bio?: string | undefined | null;
    discord_username?: string | undefined | null;
    github_username?: string | undefined | null;
    medium_username?: string | undefined | null;
    skills?: string | undefined | null;
    telegram_username?: string | undefined | null;
    twitter_username?: string | undefined | null;
    website?: string | undefined | null;
  };
  ['query_root']: AliasType<{
    burns?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['burns_select_column']>
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
          | Array<ValueTypes['burns_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['burns_bool_exp'] | undefined | null;
      },
      ValueTypes['burns']
    ];
    burns_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['burns']];
    circle_api_keys?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circle_api_keys_select_column']>
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
          | Array<ValueTypes['circle_api_keys_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circle_api_keys_bool_exp'] | undefined | null;
      },
      ValueTypes['circle_api_keys']
    ];
    circle_api_keys_by_pk?: [{ hash: string }, ValueTypes['circle_api_keys']];
    circle_integrations?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circle_integrations_select_column']>
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
          | Array<ValueTypes['circle_integrations_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circle_integrations_bool_exp'] | undefined | null;
      },
      ValueTypes['circle_integrations']
    ];
    circle_integrations_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['circle_integrations']
    ];
    circle_private?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circle_private_select_column']>
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
          | Array<ValueTypes['circle_private_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circle_private_bool_exp'] | undefined | null;
      },
      ValueTypes['circle_private']
    ];
    circles?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circles_select_column']>
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
          | Array<ValueTypes['circles_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circles_bool_exp'] | undefined | null;
      },
      ValueTypes['circles']
    ];
    circles_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['circles']];
    claims?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['claims_select_column']>
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
          | Array<ValueTypes['claims_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['claims_bool_exp'] | undefined | null;
      },
      ValueTypes['claims']
    ];
    claims_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['claims']];
    distributions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['distributions_select_column']>
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
          | Array<ValueTypes['distributions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['distributions_bool_exp'] | undefined | null;
      },
      ValueTypes['distributions']
    ];
    distributions_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['distributions_select_column']>
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
          | Array<ValueTypes['distributions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['distributions_bool_exp'] | undefined | null;
      },
      ValueTypes['distributions_aggregate']
    ];
    distributions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['distributions']
    ];
    epochs?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['epochs_select_column']>
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
          | Array<ValueTypes['epochs_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['epochs_bool_exp'] | undefined | null;
      },
      ValueTypes['epochs']
    ];
    epochs_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['epochs']];
    gift_private?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['gift_private_select_column']>
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
          | Array<ValueTypes['gift_private_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['gift_private_bool_exp'] | undefined | null;
      },
      ValueTypes['gift_private']
    ];
    nominees?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['nominees_select_column']>
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
          | Array<ValueTypes['nominees_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | undefined | null;
      },
      ValueTypes['nominees']
    ];
    nominees_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['nominees_select_column']>
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
          | Array<ValueTypes['nominees_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | undefined | null;
      },
      ValueTypes['nominees_aggregate']
    ];
    nominees_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['nominees']];
    organizations?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['organizations_select_column']>
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
          | Array<ValueTypes['organizations_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['organizations_bool_exp'] | undefined | null;
      },
      ValueTypes['organizations']
    ];
    organizations_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['organizations']
    ];
    pending_gift_private?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['pending_gift_private_select_column']>
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
          | Array<ValueTypes['pending_gift_private_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['pending_gift_private_bool_exp'] | undefined | null;
      },
      ValueTypes['pending_gift_private']
    ];
    pending_token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['pending_token_gifts_select_column']>
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
          | Array<ValueTypes['pending_token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    pending_token_gifts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['pending_token_gifts']
    ];
    profiles?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['profiles_select_column']>
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
          | Array<ValueTypes['profiles_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['profiles_bool_exp'] | undefined | null;
      },
      ValueTypes['profiles']
    ];
    profiles_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['profiles']];
    teammates?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['teammates_select_column']>
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
          | Array<ValueTypes['teammates_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['teammates_bool_exp'] | undefined | null;
      },
      ValueTypes['teammates']
    ];
    teammates_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['teammates']];
    token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts']
    ];
    token_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    token_gifts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['token_gifts']
    ];
    user_private?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['user_private_select_column']>
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
          | Array<ValueTypes['user_private_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['user_private_bool_exp'] | undefined | null;
      },
      ValueTypes['user_private']
    ];
    users?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['users_select_column']>
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
          | Array<ValueTypes['users_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['users_bool_exp'] | undefined | null;
      },
      ValueTypes['users']
    ];
    users_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['users']];
    vault_transactions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['vault_transactions_select_column']>
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
          | Array<ValueTypes['vault_transactions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['vault_transactions_bool_exp'] | undefined | null;
      },
      ValueTypes['vault_transactions']
    ];
    vault_transactions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['vault_transactions']
    ];
    vaults?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['vaults_select_column']>
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
          | Array<ValueTypes['vaults_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['vaults_bool_exp'] | undefined | null;
      },
      ValueTypes['vaults']
    ];
    vaults_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['vaults']];
    vouches?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['vouches_select_column']>
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
          | Array<ValueTypes['vouches_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['vouches_bool_exp'] | undefined | null;
      },
      ValueTypes['vouches']
    ];
    vouches_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['vouches']];
    __typename?: boolean | `@${string}`;
  }>;
  ['subscription_root']: AliasType<{
    burns?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['burns_select_column']>
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
          | Array<ValueTypes['burns_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['burns_bool_exp'] | undefined | null;
      },
      ValueTypes['burns']
    ];
    burns_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['burns']];
    circle_api_keys?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circle_api_keys_select_column']>
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
          | Array<ValueTypes['circle_api_keys_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circle_api_keys_bool_exp'] | undefined | null;
      },
      ValueTypes['circle_api_keys']
    ];
    circle_api_keys_by_pk?: [{ hash: string }, ValueTypes['circle_api_keys']];
    circle_integrations?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circle_integrations_select_column']>
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
          | Array<ValueTypes['circle_integrations_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circle_integrations_bool_exp'] | undefined | null;
      },
      ValueTypes['circle_integrations']
    ];
    circle_integrations_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['circle_integrations']
    ];
    circle_private?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circle_private_select_column']>
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
          | Array<ValueTypes['circle_private_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circle_private_bool_exp'] | undefined | null;
      },
      ValueTypes['circle_private']
    ];
    circles?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['circles_select_column']>
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
          | Array<ValueTypes['circles_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['circles_bool_exp'] | undefined | null;
      },
      ValueTypes['circles']
    ];
    circles_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['circles']];
    claims?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['claims_select_column']>
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
          | Array<ValueTypes['claims_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['claims_bool_exp'] | undefined | null;
      },
      ValueTypes['claims']
    ];
    claims_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['claims']];
    distributions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['distributions_select_column']>
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
          | Array<ValueTypes['distributions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['distributions_bool_exp'] | undefined | null;
      },
      ValueTypes['distributions']
    ];
    distributions_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['distributions_select_column']>
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
          | Array<ValueTypes['distributions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['distributions_bool_exp'] | undefined | null;
      },
      ValueTypes['distributions_aggregate']
    ];
    distributions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['distributions']
    ];
    epochs?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['epochs_select_column']>
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
          | Array<ValueTypes['epochs_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['epochs_bool_exp'] | undefined | null;
      },
      ValueTypes['epochs']
    ];
    epochs_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['epochs']];
    gift_private?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['gift_private_select_column']>
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
          | Array<ValueTypes['gift_private_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['gift_private_bool_exp'] | undefined | null;
      },
      ValueTypes['gift_private']
    ];
    nominees?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['nominees_select_column']>
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
          | Array<ValueTypes['nominees_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | undefined | null;
      },
      ValueTypes['nominees']
    ];
    nominees_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['nominees_select_column']>
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
          | Array<ValueTypes['nominees_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | undefined | null;
      },
      ValueTypes['nominees_aggregate']
    ];
    nominees_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['nominees']];
    organizations?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['organizations_select_column']>
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
          | Array<ValueTypes['organizations_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['organizations_bool_exp'] | undefined | null;
      },
      ValueTypes['organizations']
    ];
    organizations_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['organizations']
    ];
    pending_gift_private?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['pending_gift_private_select_column']>
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
          | Array<ValueTypes['pending_gift_private_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['pending_gift_private_bool_exp'] | undefined | null;
      },
      ValueTypes['pending_gift_private']
    ];
    pending_token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['pending_token_gifts_select_column']>
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
          | Array<ValueTypes['pending_token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    pending_token_gifts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['pending_token_gifts']
    ];
    profiles?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['profiles_select_column']>
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
          | Array<ValueTypes['profiles_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['profiles_bool_exp'] | undefined | null;
      },
      ValueTypes['profiles']
    ];
    profiles_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['profiles']];
    teammates?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['teammates_select_column']>
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
          | Array<ValueTypes['teammates_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['teammates_bool_exp'] | undefined | null;
      },
      ValueTypes['teammates']
    ];
    teammates_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['teammates']];
    token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts']
    ];
    token_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    token_gifts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['token_gifts']
    ];
    user_private?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['user_private_select_column']>
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
          | Array<ValueTypes['user_private_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['user_private_bool_exp'] | undefined | null;
      },
      ValueTypes['user_private']
    ];
    users?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['users_select_column']>
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
          | Array<ValueTypes['users_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['users_bool_exp'] | undefined | null;
      },
      ValueTypes['users']
    ];
    users_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['users']];
    vault_transactions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['vault_transactions_select_column']>
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
          | Array<ValueTypes['vault_transactions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['vault_transactions_bool_exp'] | undefined | null;
      },
      ValueTypes['vault_transactions']
    ];
    vault_transactions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['vault_transactions']
    ];
    vaults?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['vaults_select_column']>
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
          | Array<ValueTypes['vaults_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['vaults_bool_exp'] | undefined | null;
      },
      ValueTypes['vaults']
    ];
    vaults_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['vaults']];
    vouches?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['vouches_select_column']>
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
          | Array<ValueTypes['vouches_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['vouches_bool_exp'] | undefined | null;
      },
      ValueTypes['vouches']
    ];
    vouches_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['vouches']];
    __typename?: boolean | `@${string}`;
  }>;
  /** columns and relationships of "teammates" */
  ['teammates']: AliasType<{
    created_at?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    team_mate_id?: boolean | `@${string}`;
    /** An object relationship */
    teammate?: ValueTypes['users'];
    updated_at?: boolean | `@${string}`;
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "teammates" */
  ['teammates_aggregate_order_by']: {
    avg?: ValueTypes['teammates_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['teammates_max_order_by'] | undefined | null;
    min?: ValueTypes['teammates_min_order_by'] | undefined | null;
    stddev?: ValueTypes['teammates_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['teammates_stddev_pop_order_by'] | undefined | null;
    stddev_samp?:
      | ValueTypes['teammates_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['teammates_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['teammates_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['teammates_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['teammates_variance_order_by'] | undefined | null;
  };
  /** order by avg() on columns of table "teammates" */
  ['teammates_avg_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "teammates". All fields are combined with a logical 'AND'. */
  ['teammates_bool_exp']: {
    _and?: Array<ValueTypes['teammates_bool_exp']> | undefined | null;
    _not?: ValueTypes['teammates_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['teammates_bool_exp']> | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    team_mate_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    teammate?: ValueTypes['users_bool_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    user?: ValueTypes['users_bool_exp'] | undefined | null;
    user_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
  };
  /** order by max() on columns of table "teammates" */
  ['teammates_max_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "teammates" */
  ['teammates_min_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "teammates". */
  ['teammates_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    teammate?: ValueTypes['users_order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user?: ValueTypes['users_order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "teammates" */
  ['teammates_select_column']: teammates_select_column;
  /** order by stddev() on columns of table "teammates" */
  ['teammates_stddev_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "teammates" */
  ['teammates_stddev_pop_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "teammates" */
  ['teammates_stddev_samp_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "teammates" */
  ['teammates_sum_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "teammates" */
  ['teammates_var_pop_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "teammates" */
  ['teammates_var_samp_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "teammates" */
  ['teammates_variance_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    team_mate_id?: ValueTypes['order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
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
  /** GIVE allocations made by circle members for past epochs


columns and relationships of "token_gifts" */
  ['token_gifts']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    dts_created?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    /** An object relationship */
    gift_private?: ValueTypes['gift_private'];
    id?: boolean | `@${string}`;
    /** An object relationship */
    recipient?: ValueTypes['users'];
    recipient_address?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    /** An object relationship */
    sender?: ValueTypes['users'];
    sender_address?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregated selection of "token_gifts" */
  ['token_gifts_aggregate']: AliasType<{
    aggregate?: ValueTypes['token_gifts_aggregate_fields'];
    nodes?: ValueTypes['token_gifts'];
    __typename?: boolean | `@${string}`;
  }>;
  /** aggregate fields of "token_gifts" */
  ['token_gifts_aggregate_fields']: AliasType<{
    avg?: ValueTypes['token_gifts_avg_fields'];
    count?: [
      {
        columns?:
          | Array<ValueTypes['token_gifts_select_column']>
          | undefined
          | null;
        distinct?: boolean | undefined | null;
      },
      boolean | `@${string}`
    ];
    max?: ValueTypes['token_gifts_max_fields'];
    min?: ValueTypes['token_gifts_min_fields'];
    stddev?: ValueTypes['token_gifts_stddev_fields'];
    stddev_pop?: ValueTypes['token_gifts_stddev_pop_fields'];
    stddev_samp?: ValueTypes['token_gifts_stddev_samp_fields'];
    sum?: ValueTypes['token_gifts_sum_fields'];
    var_pop?: ValueTypes['token_gifts_var_pop_fields'];
    var_samp?: ValueTypes['token_gifts_var_samp_fields'];
    variance?: ValueTypes['token_gifts_variance_fields'];
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "token_gifts" */
  ['token_gifts_aggregate_order_by']: {
    avg?: ValueTypes['token_gifts_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['token_gifts_max_order_by'] | undefined | null;
    min?: ValueTypes['token_gifts_min_order_by'] | undefined | null;
    stddev?: ValueTypes['token_gifts_stddev_order_by'] | undefined | null;
    stddev_pop?:
      | ValueTypes['token_gifts_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['token_gifts_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['token_gifts_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['token_gifts_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['token_gifts_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['token_gifts_variance_order_by'] | undefined | null;
  };
  /** aggregate avg on columns */
  ['token_gifts_avg_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by avg() on columns of table "token_gifts" */
  ['token_gifts_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "token_gifts". All fields are combined with a logical 'AND'. */
  ['token_gifts_bool_exp']: {
    _and?: Array<ValueTypes['token_gifts_bool_exp']> | undefined | null;
    _not?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['token_gifts_bool_exp']> | undefined | null;
    circle?: ValueTypes['circles_bool_exp'] | undefined | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    dts_created?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    epoch_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    gift_private?: ValueTypes['gift_private_bool_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    recipient?: ValueTypes['users_bool_exp'] | undefined | null;
    recipient_address?: ValueTypes['String_comparison_exp'] | undefined | null;
    recipient_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    sender?: ValueTypes['users_bool_exp'] | undefined | null;
    sender_address?: ValueTypes['String_comparison_exp'] | undefined | null;
    sender_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    tokens?: ValueTypes['Int_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
  };
  /** aggregate max on columns */
  ['token_gifts_max_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    dts_created?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    recipient_address?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    sender_address?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by max() on columns of table "token_gifts" */
  ['token_gifts_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    dts_created?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_address?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_address?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate min on columns */
  ['token_gifts_min_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    dts_created?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    recipient_address?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    sender_address?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by min() on columns of table "token_gifts" */
  ['token_gifts_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    dts_created?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_address?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_address?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "token_gifts". */
  ['token_gifts_order_by']: {
    circle?: ValueTypes['circles_order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    dts_created?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    gift_private?: ValueTypes['gift_private_order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient?: ValueTypes['users_order_by'] | undefined | null;
    recipient_address?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender?: ValueTypes['users_order_by'] | undefined | null;
    sender_address?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "token_gifts" */
  ['token_gifts_select_column']: token_gifts_select_column;
  /** aggregate stddev on columns */
  ['token_gifts_stddev_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev() on columns of table "token_gifts" */
  ['token_gifts_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_pop on columns */
  ['token_gifts_stddev_pop_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_pop() on columns of table "token_gifts" */
  ['token_gifts_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate stddev_samp on columns */
  ['token_gifts_stddev_samp_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by stddev_samp() on columns of table "token_gifts" */
  ['token_gifts_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate sum on columns */
  ['token_gifts_sum_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by sum() on columns of table "token_gifts" */
  ['token_gifts_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_pop on columns */
  ['token_gifts_var_pop_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_pop() on columns of table "token_gifts" */
  ['token_gifts_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate var_samp on columns */
  ['token_gifts_var_samp_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by var_samp() on columns of table "token_gifts" */
  ['token_gifts_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** aggregate variance on columns */
  ['token_gifts_variance_fields']: AliasType<{
    circle_id?: boolean | `@${string}`;
    epoch_id?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    recipient_id?: boolean | `@${string}`;
    sender_id?: boolean | `@${string}`;
    tokens?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by variance() on columns of table "token_gifts" */
  ['token_gifts_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    epoch_id?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    recipient_id?: ValueTypes['order_by'] | undefined | null;
    sender_id?: ValueTypes['order_by'] | undefined | null;
    tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "user_private" */
  ['user_private']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    fixed_payment_amount?: boolean | `@${string}`;
    fixed_payment_token_type?: boolean | `@${string}`;
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** Boolean expression to filter rows from the table "user_private". All fields are combined with a logical 'AND'. */
  ['user_private_bool_exp']: {
    _and?: Array<ValueTypes['user_private_bool_exp']> | undefined | null;
    _not?: ValueTypes['user_private_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['user_private_bool_exp']> | undefined | null;
    circle?: ValueTypes['circles_bool_exp'] | undefined | null;
    fixed_payment_amount?:
      | ValueTypes['numeric_comparison_exp']
      | undefined
      | null;
    fixed_payment_token_type?:
      | ValueTypes['String_comparison_exp']
      | undefined
      | null;
    user?: ValueTypes['users_bool_exp'] | undefined | null;
    user_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
  };
  /** Ordering options when selecting data from "user_private". */
  ['user_private_order_by']: {
    circle?: ValueTypes['circles_order_by'] | undefined | null;
    fixed_payment_amount?: ValueTypes['order_by'] | undefined | null;
    fixed_payment_token_type?: ValueTypes['order_by'] | undefined | null;
    user?: ValueTypes['users_order_by'] | undefined | null;
    user_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "user_private" */
  ['user_private_select_column']: user_private_select_column;
  /** Members of a circle


columns and relationships of "users" */
  ['users']: AliasType<{
    address?: boolean | `@${string}`;
    bio?: boolean | `@${string}`;
    burns?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['burns_select_column']>
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
          | Array<ValueTypes['burns_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['burns_bool_exp'] | undefined | null;
      },
      ValueTypes['burns']
    ];
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    deleted_at?: boolean | `@${string}`;
    epoch_first_visit?: boolean | `@${string}`;
    fixed_non_receiver?: boolean | `@${string}`;
    give_token_received?: boolean | `@${string}`;
    give_token_remaining?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    non_giver?: boolean | `@${string}`;
    non_receiver?: boolean | `@${string}`;
    pending_received_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['pending_token_gifts_select_column']>
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
          | Array<ValueTypes['pending_token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    pending_sent_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['pending_token_gifts_select_column']>
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
          | Array<ValueTypes['pending_token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    /** An object relationship */
    profile?: ValueTypes['profiles'];
    received_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts']
    ];
    received_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    role?: boolean | `@${string}`;
    sent_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts']
    ];
    sent_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['token_gifts_select_column']>
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
          | Array<ValueTypes['token_gifts_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    starting_tokens?: boolean | `@${string}`;
    teammates?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['teammates_select_column']>
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
          | Array<ValueTypes['teammates_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['teammates_bool_exp'] | undefined | null;
      },
      ValueTypes['teammates']
    ];
    updated_at?: boolean | `@${string}`;
    /** An object relationship */
    user_private?: ValueTypes['user_private'];
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "users" */
  ['users_aggregate_order_by']: {
    avg?: ValueTypes['users_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['users_max_order_by'] | undefined | null;
    min?: ValueTypes['users_min_order_by'] | undefined | null;
    stddev?: ValueTypes['users_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['users_stddev_pop_order_by'] | undefined | null;
    stddev_samp?: ValueTypes['users_stddev_samp_order_by'] | undefined | null;
    sum?: ValueTypes['users_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['users_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['users_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['users_variance_order_by'] | undefined | null;
  };
  /** order by avg() on columns of table "users" */
  ['users_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    role?: ValueTypes['order_by'] | undefined | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
  ['users_bool_exp']: {
    _and?: Array<ValueTypes['users_bool_exp']> | undefined | null;
    _not?: ValueTypes['users_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['users_bool_exp']> | undefined | null;
    address?: ValueTypes['String_comparison_exp'] | undefined | null;
    bio?: ValueTypes['String_comparison_exp'] | undefined | null;
    burns?: ValueTypes['burns_bool_exp'] | undefined | null;
    circle?: ValueTypes['circles_bool_exp'] | undefined | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    deleted_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    epoch_first_visit?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    fixed_non_receiver?:
      | ValueTypes['Boolean_comparison_exp']
      | undefined
      | null;
    give_token_received?: ValueTypes['Int_comparison_exp'] | undefined | null;
    give_token_remaining?: ValueTypes['Int_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    name?: ValueTypes['String_comparison_exp'] | undefined | null;
    non_giver?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    non_receiver?: ValueTypes['Boolean_comparison_exp'] | undefined | null;
    pending_received_gifts?:
      | ValueTypes['pending_token_gifts_bool_exp']
      | undefined
      | null;
    pending_sent_gifts?:
      | ValueTypes['pending_token_gifts_bool_exp']
      | undefined
      | null;
    profile?: ValueTypes['profiles_bool_exp'] | undefined | null;
    received_gifts?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
    role?: ValueTypes['Int_comparison_exp'] | undefined | null;
    sent_gifts?: ValueTypes['token_gifts_bool_exp'] | undefined | null;
    starting_tokens?: ValueTypes['Int_comparison_exp'] | undefined | null;
    teammates?: ValueTypes['teammates_bool_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    user_private?: ValueTypes['user_private_bool_exp'] | undefined | null;
  };
  /** order by max() on columns of table "users" */
  ['users_max_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    bio?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    deleted_at?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    role?: ValueTypes['order_by'] | undefined | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "users" */
  ['users_min_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    bio?: ValueTypes['order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    deleted_at?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    role?: ValueTypes['order_by'] | undefined | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "users". */
  ['users_order_by']: {
    address?: ValueTypes['order_by'] | undefined | null;
    bio?: ValueTypes['order_by'] | undefined | null;
    burns_aggregate?: ValueTypes['burns_aggregate_order_by'] | undefined | null;
    circle?: ValueTypes['circles_order_by'] | undefined | null;
    circle_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    deleted_at?: ValueTypes['order_by'] | undefined | null;
    epoch_first_visit?: ValueTypes['order_by'] | undefined | null;
    fixed_non_receiver?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    non_giver?: ValueTypes['order_by'] | undefined | null;
    non_receiver?: ValueTypes['order_by'] | undefined | null;
    pending_received_gifts_aggregate?:
      | ValueTypes['pending_token_gifts_aggregate_order_by']
      | undefined
      | null;
    pending_sent_gifts_aggregate?:
      | ValueTypes['pending_token_gifts_aggregate_order_by']
      | undefined
      | null;
    profile?: ValueTypes['profiles_order_by'] | undefined | null;
    received_gifts_aggregate?:
      | ValueTypes['token_gifts_aggregate_order_by']
      | undefined
      | null;
    role?: ValueTypes['order_by'] | undefined | null;
    sent_gifts_aggregate?:
      | ValueTypes['token_gifts_aggregate_order_by']
      | undefined
      | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
    teammates_aggregate?:
      | ValueTypes['teammates_aggregate_order_by']
      | undefined
      | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user_private?: ValueTypes['user_private_order_by'] | undefined | null;
  };
  /** select columns of table "users" */
  ['users_select_column']: users_select_column;
  /** order by stddev() on columns of table "users" */
  ['users_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    role?: ValueTypes['order_by'] | undefined | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "users" */
  ['users_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    role?: ValueTypes['order_by'] | undefined | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "users" */
  ['users_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    role?: ValueTypes['order_by'] | undefined | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "users" */
  ['users_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    role?: ValueTypes['order_by'] | undefined | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "users" */
  ['users_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    role?: ValueTypes['order_by'] | undefined | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "users" */
  ['users_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    role?: ValueTypes['order_by'] | undefined | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "users" */
  ['users_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | undefined | null;
    give_token_received?: ValueTypes['order_by'] | undefined | null;
    give_token_remaining?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    role?: ValueTypes['order_by'] | undefined | null;
    starting_tokens?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "vault_transactions" */
  ['vault_transactions']: AliasType<{
    created_at?: boolean | `@${string}`;
    created_by?: boolean | `@${string}`;
    date?: boolean | `@${string}`;
    description?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    name?: boolean | `@${string}`;
    tx_hash?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    /** An object relationship */
    user?: ValueTypes['users'];
    value?: boolean | `@${string}`;
    /** An object relationship */
    vault?: ValueTypes['vaults'];
    vault_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "vault_transactions" */
  ['vault_transactions_aggregate_order_by']: {
    avg?: ValueTypes['vault_transactions_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['vault_transactions_max_order_by'] | undefined | null;
    min?: ValueTypes['vault_transactions_min_order_by'] | undefined | null;
    stddev?:
      | ValueTypes['vault_transactions_stddev_order_by']
      | undefined
      | null;
    stddev_pop?:
      | ValueTypes['vault_transactions_stddev_pop_order_by']
      | undefined
      | null;
    stddev_samp?:
      | ValueTypes['vault_transactions_stddev_samp_order_by']
      | undefined
      | null;
    sum?: ValueTypes['vault_transactions_sum_order_by'] | undefined | null;
    var_pop?:
      | ValueTypes['vault_transactions_var_pop_order_by']
      | undefined
      | null;
    var_samp?:
      | ValueTypes['vault_transactions_var_samp_order_by']
      | undefined
      | null;
    variance?:
      | ValueTypes['vault_transactions_variance_order_by']
      | undefined
      | null;
  };
  /** order by avg() on columns of table "vault_transactions" */
  ['vault_transactions_avg_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "vault_transactions". All fields are combined with a logical 'AND'. */
  ['vault_transactions_bool_exp']: {
    _and?: Array<ValueTypes['vault_transactions_bool_exp']> | undefined | null;
    _not?: ValueTypes['vault_transactions_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['vault_transactions_bool_exp']> | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    created_by?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    date?: ValueTypes['date_comparison_exp'] | undefined | null;
    description?: ValueTypes['String_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    name?: ValueTypes['String_comparison_exp'] | undefined | null;
    tx_hash?: ValueTypes['String_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    user?: ValueTypes['users_bool_exp'] | undefined | null;
    value?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    vault?: ValueTypes['vaults_bool_exp'] | undefined | null;
    vault_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
  };
  /** input type for inserting data into table "vault_transactions" */
  ['vault_transactions_insert_input']: {
    created_at?: ValueTypes['timestamp'] | undefined | null;
    created_by?: ValueTypes['bigint'] | undefined | null;
    date?: ValueTypes['date'] | undefined | null;
    description?: string | undefined | null;
    id?: ValueTypes['bigint'] | undefined | null;
    name?: string | undefined | null;
    tx_hash?: string | undefined | null;
    updated_at?: ValueTypes['timestamp'] | undefined | null;
    value?: ValueTypes['bigint'] | undefined | null;
    vault_id?: ValueTypes['bigint'] | undefined | null;
  };
  /** order by max() on columns of table "vault_transactions" */
  ['vault_transactions_max_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    date?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    tx_hash?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "vault_transactions" */
  ['vault_transactions_min_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    date?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    tx_hash?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** response of any mutation on the table "vault_transactions" */
  ['vault_transactions_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean | `@${string}`;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['vault_transactions'];
    __typename?: boolean | `@${string}`;
  }>;
  /** Ordering options when selecting data from "vault_transactions". */
  ['vault_transactions_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    date?: ValueTypes['order_by'] | undefined | null;
    description?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    name?: ValueTypes['order_by'] | undefined | null;
    tx_hash?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    user?: ValueTypes['users_order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault?: ValueTypes['vaults_order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "vault_transactions" */
  ['vault_transactions_select_column']: vault_transactions_select_column;
  /** order by stddev() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_pop_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_samp_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "vault_transactions" */
  ['vault_transactions_sum_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "vault_transactions" */
  ['vault_transactions_var_pop_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "vault_transactions" */
  ['vault_transactions_var_samp_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "vault_transactions" */
  ['vault_transactions_variance_order_by']: {
    created_by?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    value?: ValueTypes['order_by'] | undefined | null;
    vault_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "vaults" */
  ['vaults']: AliasType<{
    chain_id?: boolean | `@${string}`;
    created_at?: boolean | `@${string}`;
    created_by?: boolean | `@${string}`;
    decimals?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    org_id?: boolean | `@${string}`;
    /** An object relationship */
    profile?: ValueTypes['profiles'];
    /** An object relationship */
    protocol?: ValueTypes['organizations'];
    simple_token_address?: boolean | `@${string}`;
    symbol?: boolean | `@${string}`;
    token_address?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    vault_address?: boolean | `@${string}`;
    vault_transactions?: [
      {
        /** distinct select on columns */
        distinct_on?:
          | Array<ValueTypes['vault_transactions_select_column']>
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
          | Array<ValueTypes['vault_transactions_order_by']>
          | undefined
          | null /** filter the rows returned */;
        where?: ValueTypes['vault_transactions_bool_exp'] | undefined | null;
      },
      ValueTypes['vault_transactions']
    ];
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "vaults" */
  ['vaults_aggregate_order_by']: {
    avg?: ValueTypes['vaults_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['vaults_max_order_by'] | undefined | null;
    min?: ValueTypes['vaults_min_order_by'] | undefined | null;
    stddev?: ValueTypes['vaults_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['vaults_stddev_pop_order_by'] | undefined | null;
    stddev_samp?: ValueTypes['vaults_stddev_samp_order_by'] | undefined | null;
    sum?: ValueTypes['vaults_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['vaults_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['vaults_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['vaults_variance_order_by'] | undefined | null;
  };
  /** order by avg() on columns of table "vaults" */
  ['vaults_avg_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "vaults". All fields are combined with a logical 'AND'. */
  ['vaults_bool_exp']: {
    _and?: Array<ValueTypes['vaults_bool_exp']> | undefined | null;
    _not?: ValueTypes['vaults_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['vaults_bool_exp']> | undefined | null;
    chain_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    created_by?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    decimals?: ValueTypes['Int_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    org_id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    profile?: ValueTypes['profiles_bool_exp'] | undefined | null;
    protocol?: ValueTypes['organizations_bool_exp'] | undefined | null;
    simple_token_address?:
      | ValueTypes['String_comparison_exp']
      | undefined
      | null;
    symbol?: ValueTypes['String_comparison_exp'] | undefined | null;
    token_address?: ValueTypes['String_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | undefined | null;
    vault_address?: ValueTypes['String_comparison_exp'] | undefined | null;
    vault_transactions?:
      | ValueTypes['vault_transactions_bool_exp']
      | undefined
      | null;
  };
  /** order by max() on columns of table "vaults" */
  ['vaults_max_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
    simple_token_address?: ValueTypes['order_by'] | undefined | null;
    symbol?: ValueTypes['order_by'] | undefined | null;
    token_address?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    vault_address?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "vaults" */
  ['vaults_min_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
    simple_token_address?: ValueTypes['order_by'] | undefined | null;
    symbol?: ValueTypes['order_by'] | undefined | null;
    token_address?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    vault_address?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "vaults". */
  ['vaults_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_at?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
    profile?: ValueTypes['profiles_order_by'] | undefined | null;
    protocol?: ValueTypes['organizations_order_by'] | undefined | null;
    simple_token_address?: ValueTypes['order_by'] | undefined | null;
    symbol?: ValueTypes['order_by'] | undefined | null;
    token_address?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    vault_address?: ValueTypes['order_by'] | undefined | null;
    vault_transactions_aggregate?:
      | ValueTypes['vault_transactions_aggregate_order_by']
      | undefined
      | null;
  };
  /** select columns of table "vaults" */
  ['vaults_select_column']: vaults_select_column;
  /** order by stddev() on columns of table "vaults" */
  ['vaults_stddev_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "vaults" */
  ['vaults_stddev_pop_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "vaults" */
  ['vaults_stddev_samp_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "vaults" */
  ['vaults_sum_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "vaults" */
  ['vaults_var_pop_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "vaults" */
  ['vaults_var_samp_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "vaults" */
  ['vaults_variance_order_by']: {
    chain_id?: ValueTypes['order_by'] | undefined | null;
    created_by?: ValueTypes['order_by'] | undefined | null;
    decimals?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    org_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** columns and relationships of "vouches" */
  ['vouches']: AliasType<{
    created_at?: boolean | `@${string}`;
    id?: boolean | `@${string}`;
    /** An object relationship */
    nominee?: ValueTypes['nominees'];
    nominee_id?: boolean | `@${string}`;
    updated_at?: boolean | `@${string}`;
    /** An object relationship */
    voucher?: ValueTypes['users'];
    voucher_id?: boolean | `@${string}`;
    __typename?: boolean | `@${string}`;
  }>;
  /** order by aggregate values of table "vouches" */
  ['vouches_aggregate_order_by']: {
    avg?: ValueTypes['vouches_avg_order_by'] | undefined | null;
    count?: ValueTypes['order_by'] | undefined | null;
    max?: ValueTypes['vouches_max_order_by'] | undefined | null;
    min?: ValueTypes['vouches_min_order_by'] | undefined | null;
    stddev?: ValueTypes['vouches_stddev_order_by'] | undefined | null;
    stddev_pop?: ValueTypes['vouches_stddev_pop_order_by'] | undefined | null;
    stddev_samp?: ValueTypes['vouches_stddev_samp_order_by'] | undefined | null;
    sum?: ValueTypes['vouches_sum_order_by'] | undefined | null;
    var_pop?: ValueTypes['vouches_var_pop_order_by'] | undefined | null;
    var_samp?: ValueTypes['vouches_var_samp_order_by'] | undefined | null;
    variance?: ValueTypes['vouches_variance_order_by'] | undefined | null;
  };
  /** order by avg() on columns of table "vouches" */
  ['vouches_avg_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Boolean expression to filter rows from the table "vouches". All fields are combined with a logical 'AND'. */
  ['vouches_bool_exp']: {
    _and?: Array<ValueTypes['vouches_bool_exp']> | undefined | null;
    _not?: ValueTypes['vouches_bool_exp'] | undefined | null;
    _or?: Array<ValueTypes['vouches_bool_exp']> | undefined | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    id?: ValueTypes['bigint_comparison_exp'] | undefined | null;
    nominee?: ValueTypes['nominees_bool_exp'] | undefined | null;
    nominee_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | undefined | null;
    voucher?: ValueTypes['users_bool_exp'] | undefined | null;
    voucher_id?: ValueTypes['Int_comparison_exp'] | undefined | null;
  };
  /** order by max() on columns of table "vouches" */
  ['vouches_max_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by min() on columns of table "vouches" */
  ['vouches_min_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** Ordering options when selecting data from "vouches". */
  ['vouches_order_by']: {
    created_at?: ValueTypes['order_by'] | undefined | null;
    id?: ValueTypes['order_by'] | undefined | null;
    nominee?: ValueTypes['nominees_order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    updated_at?: ValueTypes['order_by'] | undefined | null;
    voucher?: ValueTypes['users_order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** select columns of table "vouches" */
  ['vouches_select_column']: vouches_select_column;
  /** order by stddev() on columns of table "vouches" */
  ['vouches_stddev_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_pop() on columns of table "vouches" */
  ['vouches_stddev_pop_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by stddev_samp() on columns of table "vouches" */
  ['vouches_stddev_samp_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by sum() on columns of table "vouches" */
  ['vouches_sum_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_pop() on columns of table "vouches" */
  ['vouches_var_pop_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by var_samp() on columns of table "vouches" */
  ['vouches_var_samp_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
  /** order by variance() on columns of table "vouches" */
  ['vouches_variance_order_by']: {
    id?: ValueTypes['order_by'] | undefined | null;
    nominee_id?: ValueTypes['order_by'] | undefined | null;
    voucher_id?: ValueTypes['order_by'] | undefined | null;
  };
};

export type ModelTypes = {
  ['AdminUpdateUserInput']: GraphQLTypes['AdminUpdateUserInput'];
  ['Allocation']: GraphQLTypes['Allocation'];
  ['AllocationCsvInput']: GraphQLTypes['AllocationCsvInput'];
  ['AllocationCsvResponse']: {
    file: string;
  };
  ['Allocations']: GraphQLTypes['Allocations'];
  ['AllocationsResponse']: {
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: number;
  };
  /** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
  ['Boolean_comparison_exp']: GraphQLTypes['Boolean_comparison_exp'];
  ['ConfirmationResponse']: {
    success: boolean;
  };
  ['CreateCircleInput']: GraphQLTypes['CreateCircleInput'];
  ['CreateCircleResponse']: {
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    id: number;
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
  };
  ['CreateEpochInput']: GraphQLTypes['CreateEpochInput'];
  ['CreateNomineeInput']: GraphQLTypes['CreateNomineeInput'];
  ['CreateNomineeResponse']: {
    id?: number | undefined;
    /** An object relationship */
    nominee: GraphQLTypes['nominees'];
  };
  ['CreateUserInput']: GraphQLTypes['CreateUserInput'];
  ['CreateUsersInput']: GraphQLTypes['CreateUsersInput'];
  ['CreateVaultInput']: GraphQLTypes['CreateVaultInput'];
  ['DeleteEpochInput']: GraphQLTypes['DeleteEpochInput'];
  ['DeleteEpochResponse']: {
    success: boolean;
  };
  ['DeleteUserInput']: GraphQLTypes['DeleteUserInput'];
  ['EpochResponse']: {
    /** An object relationship */
    epoch: GraphQLTypes['epochs'];
    id: string;
  };
  /** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
  ['Int_comparison_exp']: GraphQLTypes['Int_comparison_exp'];
  ['LogoutResponse']: {
    id?: number | undefined;
    /** An object relationship */
    profile: GraphQLTypes['profiles'];
  };
  /** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
  ['String_comparison_exp']: GraphQLTypes['String_comparison_exp'];
  ['UpdateCircleInput']: GraphQLTypes['UpdateCircleInput'];
  ['UpdateCircleOutput']: {
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    id: number;
  };
  ['UpdateCircleResponse']: {
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    id: number;
  };
  ['UpdateEpochInput']: GraphQLTypes['UpdateEpochInput'];
  ['UpdateOrgResponse']: {
    id: number;
    /** An object relationship */
    org: GraphQLTypes['organizations'];
  };
  ['UpdateProfileResponse']: {
    id: number;
    /** An object relationship */
    profile: GraphQLTypes['profiles'];
  };
  ['UpdateTeammatesInput']: GraphQLTypes['UpdateTeammatesInput'];
  ['UpdateTeammatesResponse']: {
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: string;
  };
  ['UpdateUserInput']: GraphQLTypes['UpdateUserInput'];
  ['UploadCircleImageInput']: GraphQLTypes['UploadCircleImageInput'];
  ['UploadImageInput']: GraphQLTypes['UploadImageInput'];
  ['UploadOrgImageInput']: GraphQLTypes['UploadOrgImageInput'];
  ['UserObj']: GraphQLTypes['UserObj'];
  ['UserResponse']: {
    /** An object relationship */
    UserResponse: GraphQLTypes['users'];
    id: string;
  };
  ['VaultResponse']: {
    id: string;
    /** An object relationship */
    vault: GraphQLTypes['vaults'];
  };
  ['VouchInput']: GraphQLTypes['VouchInput'];
  ['VouchOutput']: {
    id: number;
    /** An object relationship */
    nominee: GraphQLTypes['nominees'];
  };
  ['bigint']: number;
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_comparison_exp']: GraphQLTypes['bigint_comparison_exp'];
  /** columns and relationships of "burns" */
  ['burns']: {
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    epoch: GraphQLTypes['epochs'];
    epoch_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    original_amount: number;
    regift_percent: number;
    tokens_burnt: number;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: GraphQLTypes['bigint'];
  };
  /** order by aggregate values of table "burns" */
  ['burns_aggregate_order_by']: GraphQLTypes['burns_aggregate_order_by'];
  /** order by avg() on columns of table "burns" */
  ['burns_avg_order_by']: GraphQLTypes['burns_avg_order_by'];
  /** Boolean expression to filter rows from the table "burns". All fields are combined with a logical 'AND'. */
  ['burns_bool_exp']: GraphQLTypes['burns_bool_exp'];
  /** order by max() on columns of table "burns" */
  ['burns_max_order_by']: GraphQLTypes['burns_max_order_by'];
  /** order by min() on columns of table "burns" */
  ['burns_min_order_by']: GraphQLTypes['burns_min_order_by'];
  /** Ordering options when selecting data from "burns". */
  ['burns_order_by']: GraphQLTypes['burns_order_by'];
  /** select columns of table "burns" */
  ['burns_select_column']: GraphQLTypes['burns_select_column'];
  /** order by stddev() on columns of table "burns" */
  ['burns_stddev_order_by']: GraphQLTypes['burns_stddev_order_by'];
  /** order by stddev_pop() on columns of table "burns" */
  ['burns_stddev_pop_order_by']: GraphQLTypes['burns_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "burns" */
  ['burns_stddev_samp_order_by']: GraphQLTypes['burns_stddev_samp_order_by'];
  /** order by sum() on columns of table "burns" */
  ['burns_sum_order_by']: GraphQLTypes['burns_sum_order_by'];
  /** order by var_pop() on columns of table "burns" */
  ['burns_var_pop_order_by']: GraphQLTypes['burns_var_pop_order_by'];
  /** order by var_samp() on columns of table "burns" */
  ['burns_var_samp_order_by']: GraphQLTypes['burns_var_samp_order_by'];
  /** order by variance() on columns of table "burns" */
  ['burns_variance_order_by']: GraphQLTypes['burns_variance_order_by'];
  /** Circle-scoped API keys with user defined permissions to allow third parties to authenticate to Coordinape's GraphQL API.


columns and relationships of "circle_api_keys" */
  ['circle_api_keys']: {
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    create_vouches: boolean;
    /** An object relationship */
    createdByUser: GraphQLTypes['users'];
    created_at: GraphQLTypes['timestamptz'];
    created_by: GraphQLTypes['bigint'];
    hash: string;
    name: string;
    read_circle: boolean;
    read_epochs: boolean;
    read_member_profiles: boolean;
    read_nominees: boolean;
    read_pending_token_gifts: boolean;
    update_circle: boolean;
    update_pending_token_gifts: boolean;
  };
  /** order by aggregate values of table "circle_api_keys" */
  ['circle_api_keys_aggregate_order_by']: GraphQLTypes['circle_api_keys_aggregate_order_by'];
  /** order by avg() on columns of table "circle_api_keys" */
  ['circle_api_keys_avg_order_by']: GraphQLTypes['circle_api_keys_avg_order_by'];
  /** Boolean expression to filter rows from the table "circle_api_keys". All fields are combined with a logical 'AND'. */
  ['circle_api_keys_bool_exp']: GraphQLTypes['circle_api_keys_bool_exp'];
  /** order by max() on columns of table "circle_api_keys" */
  ['circle_api_keys_max_order_by']: GraphQLTypes['circle_api_keys_max_order_by'];
  /** order by min() on columns of table "circle_api_keys" */
  ['circle_api_keys_min_order_by']: GraphQLTypes['circle_api_keys_min_order_by'];
  /** response of any mutation on the table "circle_api_keys" */
  ['circle_api_keys_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['circle_api_keys']>;
  };
  /** Ordering options when selecting data from "circle_api_keys". */
  ['circle_api_keys_order_by']: GraphQLTypes['circle_api_keys_order_by'];
  /** select columns of table "circle_api_keys" */
  ['circle_api_keys_select_column']: GraphQLTypes['circle_api_keys_select_column'];
  /** order by stddev() on columns of table "circle_api_keys" */
  ['circle_api_keys_stddev_order_by']: GraphQLTypes['circle_api_keys_stddev_order_by'];
  /** order by stddev_pop() on columns of table "circle_api_keys" */
  ['circle_api_keys_stddev_pop_order_by']: GraphQLTypes['circle_api_keys_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "circle_api_keys" */
  ['circle_api_keys_stddev_samp_order_by']: GraphQLTypes['circle_api_keys_stddev_samp_order_by'];
  /** order by sum() on columns of table "circle_api_keys" */
  ['circle_api_keys_sum_order_by']: GraphQLTypes['circle_api_keys_sum_order_by'];
  /** order by var_pop() on columns of table "circle_api_keys" */
  ['circle_api_keys_var_pop_order_by']: GraphQLTypes['circle_api_keys_var_pop_order_by'];
  /** order by var_samp() on columns of table "circle_api_keys" */
  ['circle_api_keys_var_samp_order_by']: GraphQLTypes['circle_api_keys_var_samp_order_by'];
  /** order by variance() on columns of table "circle_api_keys" */
  ['circle_api_keys_variance_order_by']: GraphQLTypes['circle_api_keys_variance_order_by'];
  /** columns and relationships of "circle_integrations" */
  ['circle_integrations']: {
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    data: GraphQLTypes['json'];
    id: GraphQLTypes['bigint'];
    name: string;
    type: string;
  };
  /** order by aggregate values of table "circle_integrations" */
  ['circle_integrations_aggregate_order_by']: GraphQLTypes['circle_integrations_aggregate_order_by'];
  /** order by avg() on columns of table "circle_integrations" */
  ['circle_integrations_avg_order_by']: GraphQLTypes['circle_integrations_avg_order_by'];
  /** Boolean expression to filter rows from the table "circle_integrations". All fields are combined with a logical 'AND'. */
  ['circle_integrations_bool_exp']: GraphQLTypes['circle_integrations_bool_exp'];
  /** input type for inserting data into table "circle_integrations" */
  ['circle_integrations_insert_input']: GraphQLTypes['circle_integrations_insert_input'];
  /** order by max() on columns of table "circle_integrations" */
  ['circle_integrations_max_order_by']: GraphQLTypes['circle_integrations_max_order_by'];
  /** order by min() on columns of table "circle_integrations" */
  ['circle_integrations_min_order_by']: GraphQLTypes['circle_integrations_min_order_by'];
  /** response of any mutation on the table "circle_integrations" */
  ['circle_integrations_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['circle_integrations']>;
  };
  /** Ordering options when selecting data from "circle_integrations". */
  ['circle_integrations_order_by']: GraphQLTypes['circle_integrations_order_by'];
  /** select columns of table "circle_integrations" */
  ['circle_integrations_select_column']: GraphQLTypes['circle_integrations_select_column'];
  /** order by stddev() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_order_by']: GraphQLTypes['circle_integrations_stddev_order_by'];
  /** order by stddev_pop() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_pop_order_by']: GraphQLTypes['circle_integrations_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_samp_order_by']: GraphQLTypes['circle_integrations_stddev_samp_order_by'];
  /** order by sum() on columns of table "circle_integrations" */
  ['circle_integrations_sum_order_by']: GraphQLTypes['circle_integrations_sum_order_by'];
  /** order by var_pop() on columns of table "circle_integrations" */
  ['circle_integrations_var_pop_order_by']: GraphQLTypes['circle_integrations_var_pop_order_by'];
  /** order by var_samp() on columns of table "circle_integrations" */
  ['circle_integrations_var_samp_order_by']: GraphQLTypes['circle_integrations_var_samp_order_by'];
  /** order by variance() on columns of table "circle_integrations" */
  ['circle_integrations_variance_order_by']: GraphQLTypes['circle_integrations_variance_order_by'];
  /** columns and relationships of "circle_private" */
  ['circle_private']: {
    /** An object relationship */
    circle?: GraphQLTypes['circles'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    discord_webhook?: string | undefined;
  };
  /** Boolean expression to filter rows from the table "circle_private". All fields are combined with a logical 'AND'. */
  ['circle_private_bool_exp']: GraphQLTypes['circle_private_bool_exp'];
  /** Ordering options when selecting data from "circle_private". */
  ['circle_private_order_by']: GraphQLTypes['circle_private_order_by'];
  /** select columns of table "circle_private" */
  ['circle_private_select_column']: GraphQLTypes['circle_private_select_column'];
  /** columns and relationships of "circles" */
  ['circles']: {
    alloc_text?: string | undefined;
    /** An array relationship */
    api_keys: Array<GraphQLTypes['circle_api_keys']>;
    auto_opt_out: boolean;
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An object relationship */
    circle_private?: GraphQLTypes['circle_private'] | undefined;
    created_at: GraphQLTypes['timestamp'];
    default_opt_in: boolean;
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    fixed_payment_token_type?: string | undefined;
    id: GraphQLTypes['bigint'];
    /** An array relationship */
    integrations: Array<GraphQLTypes['circle_integrations']>;
    is_verified: boolean;
    logo?: string | undefined;
    min_vouches: number;
    name: string;
    nomination_days_limit: number;
    /** An array relationship */
    nominees: Array<GraphQLTypes['nominees']>;
    /** An aggregate relationship */
    nominees_aggregate: GraphQLTypes['nominees_aggregate'];
    only_giver_vouch: boolean;
    /** An object relationship */
    organization: GraphQLTypes['organizations'];
    /** An array relationship */
    pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    protocol_id: number;
    team_sel_text?: string | undefined;
    team_selection: boolean;
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    token_name: string;
    updated_at: GraphQLTypes['timestamp'];
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    vouching: boolean;
    vouching_text?: string | undefined;
  };
  /** order by aggregate values of table "circles" */
  ['circles_aggregate_order_by']: GraphQLTypes['circles_aggregate_order_by'];
  /** order by avg() on columns of table "circles" */
  ['circles_avg_order_by']: GraphQLTypes['circles_avg_order_by'];
  /** Boolean expression to filter rows from the table "circles". All fields are combined with a logical 'AND'. */
  ['circles_bool_exp']: GraphQLTypes['circles_bool_exp'];
  /** input type for incrementing numeric columns in table "circles" */
  ['circles_inc_input']: GraphQLTypes['circles_inc_input'];
  /** order by max() on columns of table "circles" */
  ['circles_max_order_by']: GraphQLTypes['circles_max_order_by'];
  /** order by min() on columns of table "circles" */
  ['circles_min_order_by']: GraphQLTypes['circles_min_order_by'];
  /** response of any mutation on the table "circles" */
  ['circles_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['circles']>;
  };
  /** Ordering options when selecting data from "circles". */
  ['circles_order_by']: GraphQLTypes['circles_order_by'];
  /** primary key columns input for table: circles */
  ['circles_pk_columns_input']: GraphQLTypes['circles_pk_columns_input'];
  /** select columns of table "circles" */
  ['circles_select_column']: GraphQLTypes['circles_select_column'];
  /** input type for updating data in table "circles" */
  ['circles_set_input']: GraphQLTypes['circles_set_input'];
  /** order by stddev() on columns of table "circles" */
  ['circles_stddev_order_by']: GraphQLTypes['circles_stddev_order_by'];
  /** order by stddev_pop() on columns of table "circles" */
  ['circles_stddev_pop_order_by']: GraphQLTypes['circles_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "circles" */
  ['circles_stddev_samp_order_by']: GraphQLTypes['circles_stddev_samp_order_by'];
  /** order by sum() on columns of table "circles" */
  ['circles_sum_order_by']: GraphQLTypes['circles_sum_order_by'];
  /** order by var_pop() on columns of table "circles" */
  ['circles_var_pop_order_by']: GraphQLTypes['circles_var_pop_order_by'];
  /** order by var_samp() on columns of table "circles" */
  ['circles_var_samp_order_by']: GraphQLTypes['circles_var_samp_order_by'];
  /** order by variance() on columns of table "circles" */
  ['circles_variance_order_by']: GraphQLTypes['circles_variance_order_by'];
  /** columns and relationships of "claims" */
  ['claims']: {
    address: string;
    amount: GraphQLTypes['numeric'];
    claimed: boolean;
    created_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    distribution: GraphQLTypes['distributions'];
    distribution_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    index: GraphQLTypes['bigint'];
    new_amount: GraphQLTypes['numeric'];
    proof: string;
    updated_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: GraphQLTypes['bigint'];
  };
  /** order by aggregate values of table "claims" */
  ['claims_aggregate_order_by']: GraphQLTypes['claims_aggregate_order_by'];
  /** input type for inserting array relation for remote table "claims" */
  ['claims_arr_rel_insert_input']: GraphQLTypes['claims_arr_rel_insert_input'];
  /** order by avg() on columns of table "claims" */
  ['claims_avg_order_by']: GraphQLTypes['claims_avg_order_by'];
  /** Boolean expression to filter rows from the table "claims". All fields are combined with a logical 'AND'. */
  ['claims_bool_exp']: GraphQLTypes['claims_bool_exp'];
  /** unique or primary key constraints on table "claims" */
  ['claims_constraint']: GraphQLTypes['claims_constraint'];
  /** input type for inserting data into table "claims" */
  ['claims_insert_input']: GraphQLTypes['claims_insert_input'];
  /** order by max() on columns of table "claims" */
  ['claims_max_order_by']: GraphQLTypes['claims_max_order_by'];
  /** order by min() on columns of table "claims" */
  ['claims_min_order_by']: GraphQLTypes['claims_min_order_by'];
  /** response of any mutation on the table "claims" */
  ['claims_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['claims']>;
  };
  /** on conflict condition type for table "claims" */
  ['claims_on_conflict']: GraphQLTypes['claims_on_conflict'];
  /** Ordering options when selecting data from "claims". */
  ['claims_order_by']: GraphQLTypes['claims_order_by'];
  /** primary key columns input for table: claims */
  ['claims_pk_columns_input']: GraphQLTypes['claims_pk_columns_input'];
  /** select columns of table "claims" */
  ['claims_select_column']: GraphQLTypes['claims_select_column'];
  /** input type for updating data in table "claims" */
  ['claims_set_input']: GraphQLTypes['claims_set_input'];
  /** order by stddev() on columns of table "claims" */
  ['claims_stddev_order_by']: GraphQLTypes['claims_stddev_order_by'];
  /** order by stddev_pop() on columns of table "claims" */
  ['claims_stddev_pop_order_by']: GraphQLTypes['claims_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "claims" */
  ['claims_stddev_samp_order_by']: GraphQLTypes['claims_stddev_samp_order_by'];
  /** order by sum() on columns of table "claims" */
  ['claims_sum_order_by']: GraphQLTypes['claims_sum_order_by'];
  /** update columns of table "claims" */
  ['claims_update_column']: GraphQLTypes['claims_update_column'];
  /** order by var_pop() on columns of table "claims" */
  ['claims_var_pop_order_by']: GraphQLTypes['claims_var_pop_order_by'];
  /** order by var_samp() on columns of table "claims" */
  ['claims_var_samp_order_by']: GraphQLTypes['claims_var_samp_order_by'];
  /** order by variance() on columns of table "claims" */
  ['claims_variance_order_by']: GraphQLTypes['claims_variance_order_by'];
  ['date']: any;
  /** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
  ['date_comparison_exp']: GraphQLTypes['date_comparison_exp'];
  /** Vault Distributions


columns and relationships of "distributions" */
  ['distributions']: {
    /** An array relationship */
    claims: Array<GraphQLTypes['claims']>;
    created_at: GraphQLTypes['timestamp'];
    created_by: GraphQLTypes['bigint'];
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
    distribution_json: GraphQLTypes['jsonb'];
    /** An object relationship */
    epoch: GraphQLTypes['epochs'];
    epoch_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    merkle_root?: string | undefined;
    total_amount: GraphQLTypes['numeric'];
    tx_hash?: string | undefined;
    /** An object relationship */
    vault: GraphQLTypes['vaults'];
    vault_id: GraphQLTypes['bigint'];
  };
  /** aggregated selection of "distributions" */
  ['distributions_aggregate']: {
    aggregate?: GraphQLTypes['distributions_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['distributions']>;
  };
  /** aggregate fields of "distributions" */
  ['distributions_aggregate_fields']: {
    avg?: GraphQLTypes['distributions_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['distributions_max_fields'] | undefined;
    min?: GraphQLTypes['distributions_min_fields'] | undefined;
    stddev?: GraphQLTypes['distributions_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['distributions_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['distributions_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['distributions_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['distributions_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['distributions_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['distributions_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "distributions" */
  ['distributions_aggregate_order_by']: GraphQLTypes['distributions_aggregate_order_by'];
  /** aggregate avg on columns */
  ['distributions_avg_fields']: {
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by avg() on columns of table "distributions" */
  ['distributions_avg_order_by']: GraphQLTypes['distributions_avg_order_by'];
  /** Boolean expression to filter rows from the table "distributions". All fields are combined with a logical 'AND'. */
  ['distributions_bool_exp']: GraphQLTypes['distributions_bool_exp'];
  /** unique or primary key constraints on table "distributions" */
  ['distributions_constraint']: GraphQLTypes['distributions_constraint'];
  /** input type for incrementing numeric columns in table "distributions" */
  ['distributions_inc_input']: GraphQLTypes['distributions_inc_input'];
  /** input type for inserting data into table "distributions" */
  ['distributions_insert_input']: GraphQLTypes['distributions_insert_input'];
  /** aggregate max on columns */
  ['distributions_max_fields']: {
    created_at?: GraphQLTypes['timestamp'] | undefined;
    created_by?: GraphQLTypes['bigint'] | undefined;
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    merkle_root?: string | undefined;
    total_amount?: GraphQLTypes['numeric'] | undefined;
    tx_hash?: string | undefined;
    vault_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by max() on columns of table "distributions" */
  ['distributions_max_order_by']: GraphQLTypes['distributions_max_order_by'];
  /** aggregate min on columns */
  ['distributions_min_fields']: {
    created_at?: GraphQLTypes['timestamp'] | undefined;
    created_by?: GraphQLTypes['bigint'] | undefined;
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    merkle_root?: string | undefined;
    total_amount?: GraphQLTypes['numeric'] | undefined;
    tx_hash?: string | undefined;
    vault_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by min() on columns of table "distributions" */
  ['distributions_min_order_by']: GraphQLTypes['distributions_min_order_by'];
  /** response of any mutation on the table "distributions" */
  ['distributions_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['distributions']>;
  };
  /** input type for inserting object relation for remote table "distributions" */
  ['distributions_obj_rel_insert_input']: GraphQLTypes['distributions_obj_rel_insert_input'];
  /** on conflict condition type for table "distributions" */
  ['distributions_on_conflict']: GraphQLTypes['distributions_on_conflict'];
  /** Ordering options when selecting data from "distributions". */
  ['distributions_order_by']: GraphQLTypes['distributions_order_by'];
  /** primary key columns input for table: distributions */
  ['distributions_pk_columns_input']: GraphQLTypes['distributions_pk_columns_input'];
  /** select columns of table "distributions" */
  ['distributions_select_column']: GraphQLTypes['distributions_select_column'];
  /** input type for updating data in table "distributions" */
  ['distributions_set_input']: GraphQLTypes['distributions_set_input'];
  /** aggregate stddev on columns */
  ['distributions_stddev_fields']: {
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by stddev() on columns of table "distributions" */
  ['distributions_stddev_order_by']: GraphQLTypes['distributions_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['distributions_stddev_pop_fields']: {
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "distributions" */
  ['distributions_stddev_pop_order_by']: GraphQLTypes['distributions_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['distributions_stddev_samp_fields']: {
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "distributions" */
  ['distributions_stddev_samp_order_by']: GraphQLTypes['distributions_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['distributions_sum_fields']: {
    created_by?: GraphQLTypes['bigint'] | undefined;
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    total_amount?: GraphQLTypes['numeric'] | undefined;
    vault_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by sum() on columns of table "distributions" */
  ['distributions_sum_order_by']: GraphQLTypes['distributions_sum_order_by'];
  /** update columns of table "distributions" */
  ['distributions_update_column']: GraphQLTypes['distributions_update_column'];
  /** aggregate var_pop on columns */
  ['distributions_var_pop_fields']: {
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by var_pop() on columns of table "distributions" */
  ['distributions_var_pop_order_by']: GraphQLTypes['distributions_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['distributions_var_samp_fields']: {
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by var_samp() on columns of table "distributions" */
  ['distributions_var_samp_order_by']: GraphQLTypes['distributions_var_samp_order_by'];
  /** aggregate variance on columns */
  ['distributions_variance_fields']: {
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by variance() on columns of table "distributions" */
  ['distributions_variance_order_by']: GraphQLTypes['distributions_variance_order_by'];
  /** columns and relationships of "epoches" */
  ['epochs']: {
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An object relationship */
    circle?: GraphQLTypes['circles'] | undefined;
    circle_id: number;
    created_at: GraphQLTypes['timestamp'];
    days?: number | undefined;
    /** An array relationship */
    distributions: Array<GraphQLTypes['distributions']>;
    /** An aggregate relationship */
    distributions_aggregate: GraphQLTypes['distributions_aggregate'];
    end_date: GraphQLTypes['timestamptz'];
    ended: boolean;
    /** An array relationship */
    epoch_pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    grant: GraphQLTypes['numeric'];
    id: GraphQLTypes['bigint'];
    notified_before_end?: GraphQLTypes['timestamp'] | undefined;
    notified_end?: GraphQLTypes['timestamp'] | undefined;
    notified_start?: GraphQLTypes['timestamp'] | undefined;
    number?: number | undefined;
    repeat: number;
    repeat_day_of_month: number;
    start_date: GraphQLTypes['timestamptz'];
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    updated_at: GraphQLTypes['timestamp'];
  };
  /** order by aggregate values of table "epoches" */
  ['epochs_aggregate_order_by']: GraphQLTypes['epochs_aggregate_order_by'];
  /** order by avg() on columns of table "epoches" */
  ['epochs_avg_order_by']: GraphQLTypes['epochs_avg_order_by'];
  /** Boolean expression to filter rows from the table "epoches". All fields are combined with a logical 'AND'. */
  ['epochs_bool_exp']: GraphQLTypes['epochs_bool_exp'];
  /** order by max() on columns of table "epoches" */
  ['epochs_max_order_by']: GraphQLTypes['epochs_max_order_by'];
  /** order by min() on columns of table "epoches" */
  ['epochs_min_order_by']: GraphQLTypes['epochs_min_order_by'];
  /** Ordering options when selecting data from "epoches". */
  ['epochs_order_by']: GraphQLTypes['epochs_order_by'];
  /** select columns of table "epoches" */
  ['epochs_select_column']: GraphQLTypes['epochs_select_column'];
  /** order by stddev() on columns of table "epoches" */
  ['epochs_stddev_order_by']: GraphQLTypes['epochs_stddev_order_by'];
  /** order by stddev_pop() on columns of table "epoches" */
  ['epochs_stddev_pop_order_by']: GraphQLTypes['epochs_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "epoches" */
  ['epochs_stddev_samp_order_by']: GraphQLTypes['epochs_stddev_samp_order_by'];
  /** order by sum() on columns of table "epoches" */
  ['epochs_sum_order_by']: GraphQLTypes['epochs_sum_order_by'];
  /** order by var_pop() on columns of table "epoches" */
  ['epochs_var_pop_order_by']: GraphQLTypes['epochs_var_pop_order_by'];
  /** order by var_samp() on columns of table "epoches" */
  ['epochs_var_samp_order_by']: GraphQLTypes['epochs_var_samp_order_by'];
  /** order by variance() on columns of table "epoches" */
  ['epochs_variance_order_by']: GraphQLTypes['epochs_variance_order_by'];
  /** columns and relationships of "gift_private" */
  ['gift_private']: {
    gift_id?: GraphQLTypes['bigint'] | undefined;
    note?: string | undefined;
    /** An object relationship */
    recipient?: GraphQLTypes['users'] | undefined;
    recipient_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    sender?: GraphQLTypes['users'] | undefined;
    sender_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** Boolean expression to filter rows from the table "gift_private". All fields are combined with a logical 'AND'. */
  ['gift_private_bool_exp']: GraphQLTypes['gift_private_bool_exp'];
  /** Ordering options when selecting data from "gift_private". */
  ['gift_private_order_by']: GraphQLTypes['gift_private_order_by'];
  /** select columns of table "gift_private" */
  ['gift_private_select_column']: GraphQLTypes['gift_private_select_column'];
  ['json']: any;
  /** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
  ['json_comparison_exp']: GraphQLTypes['json_comparison_exp'];
  ['jsonb']: any;
  /** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
  ['jsonb_comparison_exp']: GraphQLTypes['jsonb_comparison_exp'];
  /** mutation root */
  ['mutation_root']: {
    adminUpdateUser?: GraphQLTypes['UserResponse'] | undefined;
    allocationCsv?: GraphQLTypes['AllocationCsvResponse'] | undefined;
    createCircle?: GraphQLTypes['CreateCircleResponse'] | undefined;
    createEpoch?: GraphQLTypes['EpochResponse'] | undefined;
    createNominee?: GraphQLTypes['CreateNomineeResponse'] | undefined;
    createUser?: GraphQLTypes['UserResponse'] | undefined;
    createUsers?: Array<GraphQLTypes['UserResponse'] | undefined> | undefined;
    createVault?: GraphQLTypes['VaultResponse'] | undefined;
    deleteEpoch?: GraphQLTypes['DeleteEpochResponse'] | undefined;
    deleteUser?: GraphQLTypes['ConfirmationResponse'] | undefined;
    /** delete data from the table: "circle_api_keys" */
    delete_circle_api_keys?:
      | GraphQLTypes['circle_api_keys_mutation_response']
      | undefined;
    /** delete single row from the table: "circle_api_keys" */
    delete_circle_api_keys_by_pk?: GraphQLTypes['circle_api_keys'] | undefined;
    /** delete data from the table: "circle_integrations" */
    delete_circle_integrations?:
      | GraphQLTypes['circle_integrations_mutation_response']
      | undefined;
    /** delete single row from the table: "circle_integrations" */
    delete_circle_integrations_by_pk?:
      | GraphQLTypes['circle_integrations']
      | undefined;
    /** insert data into the table: "circle_integrations" */
    insert_circle_integrations?:
      | GraphQLTypes['circle_integrations_mutation_response']
      | undefined;
    /** insert a single row into the table: "circle_integrations" */
    insert_circle_integrations_one?:
      | GraphQLTypes['circle_integrations']
      | undefined;
    /** insert data into the table: "claims" */
    insert_claims?: GraphQLTypes['claims_mutation_response'] | undefined;
    /** insert a single row into the table: "claims" */
    insert_claims_one?: GraphQLTypes['claims'] | undefined;
    /** insert data into the table: "distributions" */
    insert_distributions?:
      | GraphQLTypes['distributions_mutation_response']
      | undefined;
    /** insert a single row into the table: "distributions" */
    insert_distributions_one?: GraphQLTypes['distributions'] | undefined;
    /** insert data into the table: "vault_transactions" */
    insert_vault_transactions?:
      | GraphQLTypes['vault_transactions_mutation_response']
      | undefined;
    /** insert a single row into the table: "vault_transactions" */
    insert_vault_transactions_one?:
      | GraphQLTypes['vault_transactions']
      | undefined;
    logoutUser?: GraphQLTypes['LogoutResponse'] | undefined;
    updateAllocations?: GraphQLTypes['AllocationsResponse'] | undefined;
    updateCircle?: GraphQLTypes['UpdateCircleOutput'] | undefined;
    updateEpoch?: GraphQLTypes['EpochResponse'] | undefined;
    updateTeammates?: GraphQLTypes['UpdateTeammatesResponse'] | undefined;
    /** Update own user */
    updateUser?: GraphQLTypes['UserResponse'] | undefined;
    /** update data of the table: "circles" */
    update_circles?: GraphQLTypes['circles_mutation_response'] | undefined;
    /** update single row of the table: "circles" */
    update_circles_by_pk?: GraphQLTypes['circles'] | undefined;
    /** update data of the table: "claims" */
    update_claims?: GraphQLTypes['claims_mutation_response'] | undefined;
    /** update single row of the table: "claims" */
    update_claims_by_pk?: GraphQLTypes['claims'] | undefined;
    /** update data of the table: "distributions" */
    update_distributions?:
      | GraphQLTypes['distributions_mutation_response']
      | undefined;
    /** update single row of the table: "distributions" */
    update_distributions_by_pk?: GraphQLTypes['distributions'] | undefined;
    /** update data of the table: "profiles" */
    update_profiles?: GraphQLTypes['profiles_mutation_response'] | undefined;
    /** update single row of the table: "profiles" */
    update_profiles_by_pk?: GraphQLTypes['profiles'] | undefined;
    uploadCircleLogo?: GraphQLTypes['UpdateCircleResponse'] | undefined;
    uploadOrgLogo?: GraphQLTypes['UpdateOrgResponse'] | undefined;
    uploadProfileAvatar?: GraphQLTypes['UpdateProfileResponse'] | undefined;
    uploadProfileBackground?: GraphQLTypes['UpdateProfileResponse'] | undefined;
    vouch?: GraphQLTypes['VouchOutput'] | undefined;
  };
  /** columns and relationships of "nominees" */
  ['nominees']: {
    address: string;
    /** An object relationship */
    circle?: GraphQLTypes['circles'] | undefined;
    circle_id: number;
    created_at: GraphQLTypes['timestamp'];
    description: string;
    ended: boolean;
    expiry_date: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    name: string;
    nominated_by_user_id: number;
    nominated_date: GraphQLTypes['date'];
    /** An array relationship */
    nominations: Array<GraphQLTypes['vouches']>;
    /** An object relationship */
    nominator?: GraphQLTypes['users'] | undefined;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user?: GraphQLTypes['users'] | undefined;
    user_id?: number | undefined;
    vouches_required: number;
  };
  /** aggregated selection of "nominees" */
  ['nominees_aggregate']: {
    aggregate?: GraphQLTypes['nominees_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['nominees']>;
  };
  /** aggregate fields of "nominees" */
  ['nominees_aggregate_fields']: {
    avg?: GraphQLTypes['nominees_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['nominees_max_fields'] | undefined;
    min?: GraphQLTypes['nominees_min_fields'] | undefined;
    stddev?: GraphQLTypes['nominees_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['nominees_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['nominees_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['nominees_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['nominees_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['nominees_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['nominees_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "nominees" */
  ['nominees_aggregate_order_by']: GraphQLTypes['nominees_aggregate_order_by'];
  /** aggregate avg on columns */
  ['nominees_avg_fields']: {
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by avg() on columns of table "nominees" */
  ['nominees_avg_order_by']: GraphQLTypes['nominees_avg_order_by'];
  /** Boolean expression to filter rows from the table "nominees". All fields are combined with a logical 'AND'. */
  ['nominees_bool_exp']: GraphQLTypes['nominees_bool_exp'];
  /** aggregate max on columns */
  ['nominees_max_fields']: {
    address?: string | undefined;
    circle_id?: number | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    description?: string | undefined;
    expiry_date?: GraphQLTypes['timestamp'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    name?: string | undefined;
    nominated_by_user_id?: number | undefined;
    nominated_date?: GraphQLTypes['date'] | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by max() on columns of table "nominees" */
  ['nominees_max_order_by']: GraphQLTypes['nominees_max_order_by'];
  /** aggregate min on columns */
  ['nominees_min_fields']: {
    address?: string | undefined;
    circle_id?: number | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    description?: string | undefined;
    expiry_date?: GraphQLTypes['timestamp'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    name?: string | undefined;
    nominated_by_user_id?: number | undefined;
    nominated_date?: GraphQLTypes['date'] | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by min() on columns of table "nominees" */
  ['nominees_min_order_by']: GraphQLTypes['nominees_min_order_by'];
  /** Ordering options when selecting data from "nominees". */
  ['nominees_order_by']: GraphQLTypes['nominees_order_by'];
  /** select columns of table "nominees" */
  ['nominees_select_column']: GraphQLTypes['nominees_select_column'];
  /** aggregate stddev on columns */
  ['nominees_stddev_fields']: {
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by stddev() on columns of table "nominees" */
  ['nominees_stddev_order_by']: GraphQLTypes['nominees_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['nominees_stddev_pop_fields']: {
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "nominees" */
  ['nominees_stddev_pop_order_by']: GraphQLTypes['nominees_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['nominees_stddev_samp_fields']: {
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "nominees" */
  ['nominees_stddev_samp_order_by']: GraphQLTypes['nominees_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['nominees_sum_fields']: {
    circle_id?: number | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by sum() on columns of table "nominees" */
  ['nominees_sum_order_by']: GraphQLTypes['nominees_sum_order_by'];
  /** aggregate var_pop on columns */
  ['nominees_var_pop_fields']: {
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by var_pop() on columns of table "nominees" */
  ['nominees_var_pop_order_by']: GraphQLTypes['nominees_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['nominees_var_samp_fields']: {
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by var_samp() on columns of table "nominees" */
  ['nominees_var_samp_order_by']: GraphQLTypes['nominees_var_samp_order_by'];
  /** aggregate variance on columns */
  ['nominees_variance_fields']: {
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by variance() on columns of table "nominees" */
  ['nominees_variance_order_by']: GraphQLTypes['nominees_variance_order_by'];
  ['numeric']: any;
  /** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
  ['numeric_comparison_exp']: GraphQLTypes['numeric_comparison_exp'];
  /** column ordering options */
  ['order_by']: GraphQLTypes['order_by'];
  /** columns and relationships of "protocols" */
  ['organizations']: {
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    created_at: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    logo?: string | undefined;
    name: string;
    updated_at: GraphQLTypes['timestamp'];
    /** An array relationship */
    vaults: Array<GraphQLTypes['vaults']>;
  };
  /** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
  ['organizations_bool_exp']: GraphQLTypes['organizations_bool_exp'];
  /** Ordering options when selecting data from "protocols". */
  ['organizations_order_by']: GraphQLTypes['organizations_order_by'];
  /** select columns of table "protocols" */
  ['organizations_select_column']: GraphQLTypes['organizations_select_column'];
  /** columns and relationships of "pending_gift_private" */
  ['pending_gift_private']: {
    gift_id?: GraphQLTypes['bigint'] | undefined;
    note?: string | undefined;
    /** An object relationship */
    recipient?: GraphQLTypes['users'] | undefined;
    recipient_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    sender?: GraphQLTypes['users'] | undefined;
    sender_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** Boolean expression to filter rows from the table "pending_gift_private". All fields are combined with a logical 'AND'. */
  ['pending_gift_private_bool_exp']: GraphQLTypes['pending_gift_private_bool_exp'];
  /** Ordering options when selecting data from "pending_gift_private". */
  ['pending_gift_private_order_by']: GraphQLTypes['pending_gift_private_order_by'];
  /** select columns of table "pending_gift_private" */
  ['pending_gift_private_select_column']: GraphQLTypes['pending_gift_private_select_column'];
  /** GIVE allocations made by circle members for the currently running epoch


columns and relationships of "pending_token_gifts" */
  ['pending_token_gifts']: {
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at: GraphQLTypes['timestamp'];
    dts_created: GraphQLTypes['timestamp'];
    /** An object relationship */
    epoch?: GraphQLTypes['epochs'] | undefined;
    epoch_id: number;
    /** An object relationship */
    gift_private?: GraphQLTypes['pending_gift_private'] | undefined;
    id: GraphQLTypes['bigint'];
    /** An object relationship */
    recipient: GraphQLTypes['users'];
    recipient_address: string;
    recipient_id: GraphQLTypes['bigint'];
    /** An object relationship */
    sender: GraphQLTypes['users'];
    sender_address: string;
    sender_id: GraphQLTypes['bigint'];
    tokens: number;
    updated_at: GraphQLTypes['timestamp'];
  };
  /** order by aggregate values of table "pending_token_gifts" */
  ['pending_token_gifts_aggregate_order_by']: GraphQLTypes['pending_token_gifts_aggregate_order_by'];
  /** order by avg() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_avg_order_by']: GraphQLTypes['pending_token_gifts_avg_order_by'];
  /** Boolean expression to filter rows from the table "pending_token_gifts". All fields are combined with a logical 'AND'. */
  ['pending_token_gifts_bool_exp']: GraphQLTypes['pending_token_gifts_bool_exp'];
  /** order by max() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_max_order_by']: GraphQLTypes['pending_token_gifts_max_order_by'];
  /** order by min() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_min_order_by']: GraphQLTypes['pending_token_gifts_min_order_by'];
  /** Ordering options when selecting data from "pending_token_gifts". */
  ['pending_token_gifts_order_by']: GraphQLTypes['pending_token_gifts_order_by'];
  /** select columns of table "pending_token_gifts" */
  ['pending_token_gifts_select_column']: GraphQLTypes['pending_token_gifts_select_column'];
  /** order by stddev() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_order_by']: GraphQLTypes['pending_token_gifts_stddev_order_by'];
  /** order by stddev_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_pop_order_by']: GraphQLTypes['pending_token_gifts_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_samp_order_by']: GraphQLTypes['pending_token_gifts_stddev_samp_order_by'];
  /** order by sum() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_sum_order_by']: GraphQLTypes['pending_token_gifts_sum_order_by'];
  /** order by var_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_pop_order_by']: GraphQLTypes['pending_token_gifts_var_pop_order_by'];
  /** order by var_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_samp_order_by']: GraphQLTypes['pending_token_gifts_var_samp_order_by'];
  /** order by variance() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_variance_order_by']: GraphQLTypes['pending_token_gifts_variance_order_by'];
  /** Coordinape user accounts that can belong to one or many circles via the relationship to the users table


columns and relationships of "profiles" */
  ['profiles']: {
    address: string;
    avatar?: string | undefined;
    background?: string | undefined;
    bio?: string | undefined;
    created_at: GraphQLTypes['timestamp'];
    discord_username?: string | undefined;
    github_username?: string | undefined;
    id: GraphQLTypes['bigint'];
    medium_username?: string | undefined;
    skills?: string | undefined;
    telegram_username?: string | undefined;
    twitter_username?: string | undefined;
    updated_at: GraphQLTypes['timestamp'];
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    website?: string | undefined;
  };
  /** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
  ['profiles_bool_exp']: GraphQLTypes['profiles_bool_exp'];
  /** response of any mutation on the table "profiles" */
  ['profiles_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['profiles']>;
  };
  /** Ordering options when selecting data from "profiles". */
  ['profiles_order_by']: GraphQLTypes['profiles_order_by'];
  /** primary key columns input for table: profiles */
  ['profiles_pk_columns_input']: GraphQLTypes['profiles_pk_columns_input'];
  /** select columns of table "profiles" */
  ['profiles_select_column']: GraphQLTypes['profiles_select_column'];
  /** input type for updating data in table "profiles" */
  ['profiles_set_input']: GraphQLTypes['profiles_set_input'];
  ['query_root']: {
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: GraphQLTypes['burns'] | undefined;
    /** fetch data from the table: "circle_api_keys" */
    circle_api_keys: Array<GraphQLTypes['circle_api_keys']>;
    /** fetch data from the table: "circle_api_keys" using primary key columns */
    circle_api_keys_by_pk?: GraphQLTypes['circle_api_keys'] | undefined;
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: Array<GraphQLTypes['circle_integrations']>;
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: GraphQLTypes['circle_integrations'] | undefined;
    /** fetch data from the table: "circle_private" */
    circle_private: Array<GraphQLTypes['circle_private']>;
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: GraphQLTypes['circles'] | undefined;
    /** An array relationship */
    claims: Array<GraphQLTypes['claims']>;
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: GraphQLTypes['claims'] | undefined;
    /** An array relationship */
    distributions: Array<GraphQLTypes['distributions']>;
    /** An aggregate relationship */
    distributions_aggregate: GraphQLTypes['distributions_aggregate'];
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: GraphQLTypes['distributions'] | undefined;
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: GraphQLTypes['epochs'] | undefined;
    /** fetch data from the table: "gift_private" */
    gift_private: Array<GraphQLTypes['gift_private']>;
    /** An array relationship */
    nominees: Array<GraphQLTypes['nominees']>;
    /** An aggregate relationship */
    nominees_aggregate: GraphQLTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: GraphQLTypes['nominees'] | undefined;
    /** fetch data from the table: "protocols" */
    organizations: Array<GraphQLTypes['organizations']>;
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: GraphQLTypes['organizations'] | undefined;
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: Array<GraphQLTypes['pending_gift_private']>;
    /** An array relationship */
    pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: GraphQLTypes['pending_token_gifts'] | undefined;
    /** fetch data from the table: "profiles" */
    profiles: Array<GraphQLTypes['profiles']>;
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: GraphQLTypes['profiles'] | undefined;
    /** An array relationship */
    teammates: Array<GraphQLTypes['teammates']>;
    /** fetch data from the table: "teammates" using primary key columns */
    teammates_by_pk?: GraphQLTypes['teammates'] | undefined;
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    /** fetch data from the table: "token_gifts" using primary key columns */
    token_gifts_by_pk?: GraphQLTypes['token_gifts'] | undefined;
    /** fetch data from the table: "user_private" */
    user_private: Array<GraphQLTypes['user_private']>;
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: GraphQLTypes['users'] | undefined;
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: GraphQLTypes['vault_transactions'] | undefined;
    /** An array relationship */
    vaults: Array<GraphQLTypes['vaults']>;
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: GraphQLTypes['vaults'] | undefined;
    /** fetch data from the table: "vouches" */
    vouches: Array<GraphQLTypes['vouches']>;
    /** fetch data from the table: "vouches" using primary key columns */
    vouches_by_pk?: GraphQLTypes['vouches'] | undefined;
  };
  ['subscription_root']: {
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: GraphQLTypes['burns'] | undefined;
    /** fetch data from the table: "circle_api_keys" */
    circle_api_keys: Array<GraphQLTypes['circle_api_keys']>;
    /** fetch data from the table: "circle_api_keys" using primary key columns */
    circle_api_keys_by_pk?: GraphQLTypes['circle_api_keys'] | undefined;
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: Array<GraphQLTypes['circle_integrations']>;
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: GraphQLTypes['circle_integrations'] | undefined;
    /** fetch data from the table: "circle_private" */
    circle_private: Array<GraphQLTypes['circle_private']>;
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: GraphQLTypes['circles'] | undefined;
    /** An array relationship */
    claims: Array<GraphQLTypes['claims']>;
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: GraphQLTypes['claims'] | undefined;
    /** An array relationship */
    distributions: Array<GraphQLTypes['distributions']>;
    /** An aggregate relationship */
    distributions_aggregate: GraphQLTypes['distributions_aggregate'];
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: GraphQLTypes['distributions'] | undefined;
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: GraphQLTypes['epochs'] | undefined;
    /** fetch data from the table: "gift_private" */
    gift_private: Array<GraphQLTypes['gift_private']>;
    /** An array relationship */
    nominees: Array<GraphQLTypes['nominees']>;
    /** An aggregate relationship */
    nominees_aggregate: GraphQLTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: GraphQLTypes['nominees'] | undefined;
    /** fetch data from the table: "protocols" */
    organizations: Array<GraphQLTypes['organizations']>;
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: GraphQLTypes['organizations'] | undefined;
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: Array<GraphQLTypes['pending_gift_private']>;
    /** An array relationship */
    pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: GraphQLTypes['pending_token_gifts'] | undefined;
    /** fetch data from the table: "profiles" */
    profiles: Array<GraphQLTypes['profiles']>;
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: GraphQLTypes['profiles'] | undefined;
    /** An array relationship */
    teammates: Array<GraphQLTypes['teammates']>;
    /** fetch data from the table: "teammates" using primary key columns */
    teammates_by_pk?: GraphQLTypes['teammates'] | undefined;
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    /** fetch data from the table: "token_gifts" using primary key columns */
    token_gifts_by_pk?: GraphQLTypes['token_gifts'] | undefined;
    /** fetch data from the table: "user_private" */
    user_private: Array<GraphQLTypes['user_private']>;
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: GraphQLTypes['users'] | undefined;
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: GraphQLTypes['vault_transactions'] | undefined;
    /** An array relationship */
    vaults: Array<GraphQLTypes['vaults']>;
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: GraphQLTypes['vaults'] | undefined;
    /** fetch data from the table: "vouches" */
    vouches: Array<GraphQLTypes['vouches']>;
    /** fetch data from the table: "vouches" using primary key columns */
    vouches_by_pk?: GraphQLTypes['vouches'] | undefined;
  };
  /** columns and relationships of "teammates" */
  ['teammates']: {
    created_at: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    team_mate_id: number;
    /** An object relationship */
    teammate?: GraphQLTypes['users'] | undefined;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user?: GraphQLTypes['users'] | undefined;
    user_id: number;
  };
  /** order by aggregate values of table "teammates" */
  ['teammates_aggregate_order_by']: GraphQLTypes['teammates_aggregate_order_by'];
  /** order by avg() on columns of table "teammates" */
  ['teammates_avg_order_by']: GraphQLTypes['teammates_avg_order_by'];
  /** Boolean expression to filter rows from the table "teammates". All fields are combined with a logical 'AND'. */
  ['teammates_bool_exp']: GraphQLTypes['teammates_bool_exp'];
  /** order by max() on columns of table "teammates" */
  ['teammates_max_order_by']: GraphQLTypes['teammates_max_order_by'];
  /** order by min() on columns of table "teammates" */
  ['teammates_min_order_by']: GraphQLTypes['teammates_min_order_by'];
  /** Ordering options when selecting data from "teammates". */
  ['teammates_order_by']: GraphQLTypes['teammates_order_by'];
  /** select columns of table "teammates" */
  ['teammates_select_column']: GraphQLTypes['teammates_select_column'];
  /** order by stddev() on columns of table "teammates" */
  ['teammates_stddev_order_by']: GraphQLTypes['teammates_stddev_order_by'];
  /** order by stddev_pop() on columns of table "teammates" */
  ['teammates_stddev_pop_order_by']: GraphQLTypes['teammates_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "teammates" */
  ['teammates_stddev_samp_order_by']: GraphQLTypes['teammates_stddev_samp_order_by'];
  /** order by sum() on columns of table "teammates" */
  ['teammates_sum_order_by']: GraphQLTypes['teammates_sum_order_by'];
  /** order by var_pop() on columns of table "teammates" */
  ['teammates_var_pop_order_by']: GraphQLTypes['teammates_var_pop_order_by'];
  /** order by var_samp() on columns of table "teammates" */
  ['teammates_var_samp_order_by']: GraphQLTypes['teammates_var_samp_order_by'];
  /** order by variance() on columns of table "teammates" */
  ['teammates_variance_order_by']: GraphQLTypes['teammates_variance_order_by'];
  ['timestamp']: any;
  /** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
  ['timestamp_comparison_exp']: GraphQLTypes['timestamp_comparison_exp'];
  ['timestamptz']: any;
  /** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
  ['timestamptz_comparison_exp']: GraphQLTypes['timestamptz_comparison_exp'];
  /** GIVE allocations made by circle members for past epochs


columns and relationships of "token_gifts" */
  ['token_gifts']: {
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at: GraphQLTypes['timestamp'];
    dts_created: GraphQLTypes['timestamp'];
    epoch_id: number;
    /** An object relationship */
    gift_private?: GraphQLTypes['gift_private'] | undefined;
    id: GraphQLTypes['bigint'];
    /** An object relationship */
    recipient: GraphQLTypes['users'];
    recipient_address: string;
    recipient_id: GraphQLTypes['bigint'];
    /** An object relationship */
    sender: GraphQLTypes['users'];
    sender_address: string;
    sender_id: GraphQLTypes['bigint'];
    tokens: number;
    updated_at: GraphQLTypes['timestamp'];
  };
  /** aggregated selection of "token_gifts" */
  ['token_gifts_aggregate']: {
    aggregate?: GraphQLTypes['token_gifts_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['token_gifts']>;
  };
  /** aggregate fields of "token_gifts" */
  ['token_gifts_aggregate_fields']: {
    avg?: GraphQLTypes['token_gifts_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['token_gifts_max_fields'] | undefined;
    min?: GraphQLTypes['token_gifts_min_fields'] | undefined;
    stddev?: GraphQLTypes['token_gifts_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['token_gifts_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['token_gifts_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['token_gifts_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['token_gifts_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['token_gifts_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['token_gifts_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "token_gifts" */
  ['token_gifts_aggregate_order_by']: GraphQLTypes['token_gifts_aggregate_order_by'];
  /** aggregate avg on columns */
  ['token_gifts_avg_fields']: {
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by avg() on columns of table "token_gifts" */
  ['token_gifts_avg_order_by']: GraphQLTypes['token_gifts_avg_order_by'];
  /** Boolean expression to filter rows from the table "token_gifts". All fields are combined with a logical 'AND'. */
  ['token_gifts_bool_exp']: GraphQLTypes['token_gifts_bool_exp'];
  /** aggregate max on columns */
  ['token_gifts_max_fields']: {
    circle_id?: GraphQLTypes['bigint'] | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    dts_created?: GraphQLTypes['timestamp'] | undefined;
    epoch_id?: number | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    recipient_address?: string | undefined;
    recipient_id?: GraphQLTypes['bigint'] | undefined;
    sender_address?: string | undefined;
    sender_id?: GraphQLTypes['bigint'] | undefined;
    tokens?: number | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
  };
  /** order by max() on columns of table "token_gifts" */
  ['token_gifts_max_order_by']: GraphQLTypes['token_gifts_max_order_by'];
  /** aggregate min on columns */
  ['token_gifts_min_fields']: {
    circle_id?: GraphQLTypes['bigint'] | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    dts_created?: GraphQLTypes['timestamp'] | undefined;
    epoch_id?: number | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    recipient_address?: string | undefined;
    recipient_id?: GraphQLTypes['bigint'] | undefined;
    sender_address?: string | undefined;
    sender_id?: GraphQLTypes['bigint'] | undefined;
    tokens?: number | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
  };
  /** order by min() on columns of table "token_gifts" */
  ['token_gifts_min_order_by']: GraphQLTypes['token_gifts_min_order_by'];
  /** Ordering options when selecting data from "token_gifts". */
  ['token_gifts_order_by']: GraphQLTypes['token_gifts_order_by'];
  /** select columns of table "token_gifts" */
  ['token_gifts_select_column']: GraphQLTypes['token_gifts_select_column'];
  /** aggregate stddev on columns */
  ['token_gifts_stddev_fields']: {
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by stddev() on columns of table "token_gifts" */
  ['token_gifts_stddev_order_by']: GraphQLTypes['token_gifts_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['token_gifts_stddev_pop_fields']: {
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "token_gifts" */
  ['token_gifts_stddev_pop_order_by']: GraphQLTypes['token_gifts_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['token_gifts_stddev_samp_fields']: {
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "token_gifts" */
  ['token_gifts_stddev_samp_order_by']: GraphQLTypes['token_gifts_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['token_gifts_sum_fields']: {
    circle_id?: GraphQLTypes['bigint'] | undefined;
    epoch_id?: number | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    recipient_id?: GraphQLTypes['bigint'] | undefined;
    sender_id?: GraphQLTypes['bigint'] | undefined;
    tokens?: number | undefined;
  };
  /** order by sum() on columns of table "token_gifts" */
  ['token_gifts_sum_order_by']: GraphQLTypes['token_gifts_sum_order_by'];
  /** aggregate var_pop on columns */
  ['token_gifts_var_pop_fields']: {
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by var_pop() on columns of table "token_gifts" */
  ['token_gifts_var_pop_order_by']: GraphQLTypes['token_gifts_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['token_gifts_var_samp_fields']: {
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by var_samp() on columns of table "token_gifts" */
  ['token_gifts_var_samp_order_by']: GraphQLTypes['token_gifts_var_samp_order_by'];
  /** aggregate variance on columns */
  ['token_gifts_variance_fields']: {
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by variance() on columns of table "token_gifts" */
  ['token_gifts_variance_order_by']: GraphQLTypes['token_gifts_variance_order_by'];
  /** columns and relationships of "user_private" */
  ['user_private']: {
    /** An object relationship */
    circle?: GraphQLTypes['circles'] | undefined;
    fixed_payment_amount?: GraphQLTypes['numeric'] | undefined;
    fixed_payment_token_type?: string | undefined;
    /** An object relationship */
    user?: GraphQLTypes['users'] | undefined;
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** Boolean expression to filter rows from the table "user_private". All fields are combined with a logical 'AND'. */
  ['user_private_bool_exp']: GraphQLTypes['user_private_bool_exp'];
  /** Ordering options when selecting data from "user_private". */
  ['user_private_order_by']: GraphQLTypes['user_private_order_by'];
  /** select columns of table "user_private" */
  ['user_private_select_column']: GraphQLTypes['user_private_select_column'];
  /** Members of a circle


columns and relationships of "users" */
  ['users']: {
    address: string;
    bio?: string | undefined;
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at: GraphQLTypes['timestamp'];
    deleted_at?: GraphQLTypes['timestamp'] | undefined;
    epoch_first_visit: boolean;
    fixed_non_receiver: boolean;
    give_token_received: number;
    give_token_remaining: number;
    id: GraphQLTypes['bigint'];
    name: string;
    non_giver: boolean;
    non_receiver: boolean;
    /** An array relationship */
    pending_received_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** An array relationship */
    pending_sent_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** An object relationship */
    profile: GraphQLTypes['profiles'];
    /** An array relationship */
    received_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    received_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    role: number;
    /** An array relationship */
    sent_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    sent_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    starting_tokens: number;
    /** An array relationship */
    teammates: Array<GraphQLTypes['teammates']>;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user_private?: GraphQLTypes['user_private'] | undefined;
  };
  /** order by aggregate values of table "users" */
  ['users_aggregate_order_by']: GraphQLTypes['users_aggregate_order_by'];
  /** order by avg() on columns of table "users" */
  ['users_avg_order_by']: GraphQLTypes['users_avg_order_by'];
  /** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
  ['users_bool_exp']: GraphQLTypes['users_bool_exp'];
  /** order by max() on columns of table "users" */
  ['users_max_order_by']: GraphQLTypes['users_max_order_by'];
  /** order by min() on columns of table "users" */
  ['users_min_order_by']: GraphQLTypes['users_min_order_by'];
  /** Ordering options when selecting data from "users". */
  ['users_order_by']: GraphQLTypes['users_order_by'];
  /** select columns of table "users" */
  ['users_select_column']: GraphQLTypes['users_select_column'];
  /** order by stddev() on columns of table "users" */
  ['users_stddev_order_by']: GraphQLTypes['users_stddev_order_by'];
  /** order by stddev_pop() on columns of table "users" */
  ['users_stddev_pop_order_by']: GraphQLTypes['users_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "users" */
  ['users_stddev_samp_order_by']: GraphQLTypes['users_stddev_samp_order_by'];
  /** order by sum() on columns of table "users" */
  ['users_sum_order_by']: GraphQLTypes['users_sum_order_by'];
  /** order by var_pop() on columns of table "users" */
  ['users_var_pop_order_by']: GraphQLTypes['users_var_pop_order_by'];
  /** order by var_samp() on columns of table "users" */
  ['users_var_samp_order_by']: GraphQLTypes['users_var_samp_order_by'];
  /** order by variance() on columns of table "users" */
  ['users_variance_order_by']: GraphQLTypes['users_variance_order_by'];
  /** columns and relationships of "vault_transactions" */
  ['vault_transactions']: {
    created_at: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'] | undefined;
    date: GraphQLTypes['date'];
    description?: string | undefined;
    id: GraphQLTypes['bigint'];
    name: string;
    tx_hash: string;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user?: GraphQLTypes['users'] | undefined;
    value?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    vault: GraphQLTypes['vaults'];
    vault_id: GraphQLTypes['bigint'];
  };
  /** order by aggregate values of table "vault_transactions" */
  ['vault_transactions_aggregate_order_by']: GraphQLTypes['vault_transactions_aggregate_order_by'];
  /** order by avg() on columns of table "vault_transactions" */
  ['vault_transactions_avg_order_by']: GraphQLTypes['vault_transactions_avg_order_by'];
  /** Boolean expression to filter rows from the table "vault_transactions". All fields are combined with a logical 'AND'. */
  ['vault_transactions_bool_exp']: GraphQLTypes['vault_transactions_bool_exp'];
  /** input type for inserting data into table "vault_transactions" */
  ['vault_transactions_insert_input']: GraphQLTypes['vault_transactions_insert_input'];
  /** order by max() on columns of table "vault_transactions" */
  ['vault_transactions_max_order_by']: GraphQLTypes['vault_transactions_max_order_by'];
  /** order by min() on columns of table "vault_transactions" */
  ['vault_transactions_min_order_by']: GraphQLTypes['vault_transactions_min_order_by'];
  /** response of any mutation on the table "vault_transactions" */
  ['vault_transactions_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['vault_transactions']>;
  };
  /** Ordering options when selecting data from "vault_transactions". */
  ['vault_transactions_order_by']: GraphQLTypes['vault_transactions_order_by'];
  /** select columns of table "vault_transactions" */
  ['vault_transactions_select_column']: GraphQLTypes['vault_transactions_select_column'];
  /** order by stddev() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_order_by']: GraphQLTypes['vault_transactions_stddev_order_by'];
  /** order by stddev_pop() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_pop_order_by']: GraphQLTypes['vault_transactions_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_samp_order_by']: GraphQLTypes['vault_transactions_stddev_samp_order_by'];
  /** order by sum() on columns of table "vault_transactions" */
  ['vault_transactions_sum_order_by']: GraphQLTypes['vault_transactions_sum_order_by'];
  /** order by var_pop() on columns of table "vault_transactions" */
  ['vault_transactions_var_pop_order_by']: GraphQLTypes['vault_transactions_var_pop_order_by'];
  /** order by var_samp() on columns of table "vault_transactions" */
  ['vault_transactions_var_samp_order_by']: GraphQLTypes['vault_transactions_var_samp_order_by'];
  /** order by variance() on columns of table "vault_transactions" */
  ['vault_transactions_variance_order_by']: GraphQLTypes['vault_transactions_variance_order_by'];
  /** columns and relationships of "vaults" */
  ['vaults']: {
    chain_id: number;
    created_at: GraphQLTypes['timestamptz'];
    created_by: GraphQLTypes['bigint'];
    decimals: number;
    id: GraphQLTypes['bigint'];
    org_id: GraphQLTypes['bigint'];
    /** An object relationship */
    profile: GraphQLTypes['profiles'];
    /** An object relationship */
    protocol: GraphQLTypes['organizations'];
    simple_token_address?: string | undefined;
    symbol: string;
    token_address?: string | undefined;
    updated_at: GraphQLTypes['timestamptz'];
    vault_address: string;
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
  };
  /** order by aggregate values of table "vaults" */
  ['vaults_aggregate_order_by']: GraphQLTypes['vaults_aggregate_order_by'];
  /** order by avg() on columns of table "vaults" */
  ['vaults_avg_order_by']: GraphQLTypes['vaults_avg_order_by'];
  /** Boolean expression to filter rows from the table "vaults". All fields are combined with a logical 'AND'. */
  ['vaults_bool_exp']: GraphQLTypes['vaults_bool_exp'];
  /** order by max() on columns of table "vaults" */
  ['vaults_max_order_by']: GraphQLTypes['vaults_max_order_by'];
  /** order by min() on columns of table "vaults" */
  ['vaults_min_order_by']: GraphQLTypes['vaults_min_order_by'];
  /** Ordering options when selecting data from "vaults". */
  ['vaults_order_by']: GraphQLTypes['vaults_order_by'];
  /** select columns of table "vaults" */
  ['vaults_select_column']: GraphQLTypes['vaults_select_column'];
  /** order by stddev() on columns of table "vaults" */
  ['vaults_stddev_order_by']: GraphQLTypes['vaults_stddev_order_by'];
  /** order by stddev_pop() on columns of table "vaults" */
  ['vaults_stddev_pop_order_by']: GraphQLTypes['vaults_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "vaults" */
  ['vaults_stddev_samp_order_by']: GraphQLTypes['vaults_stddev_samp_order_by'];
  /** order by sum() on columns of table "vaults" */
  ['vaults_sum_order_by']: GraphQLTypes['vaults_sum_order_by'];
  /** order by var_pop() on columns of table "vaults" */
  ['vaults_var_pop_order_by']: GraphQLTypes['vaults_var_pop_order_by'];
  /** order by var_samp() on columns of table "vaults" */
  ['vaults_var_samp_order_by']: GraphQLTypes['vaults_var_samp_order_by'];
  /** order by variance() on columns of table "vaults" */
  ['vaults_variance_order_by']: GraphQLTypes['vaults_variance_order_by'];
  /** columns and relationships of "vouches" */
  ['vouches']: {
    created_at: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    /** An object relationship */
    nominee?: GraphQLTypes['nominees'] | undefined;
    nominee_id: number;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    voucher?: GraphQLTypes['users'] | undefined;
    voucher_id: number;
  };
  /** order by aggregate values of table "vouches" */
  ['vouches_aggregate_order_by']: GraphQLTypes['vouches_aggregate_order_by'];
  /** order by avg() on columns of table "vouches" */
  ['vouches_avg_order_by']: GraphQLTypes['vouches_avg_order_by'];
  /** Boolean expression to filter rows from the table "vouches". All fields are combined with a logical 'AND'. */
  ['vouches_bool_exp']: GraphQLTypes['vouches_bool_exp'];
  /** order by max() on columns of table "vouches" */
  ['vouches_max_order_by']: GraphQLTypes['vouches_max_order_by'];
  /** order by min() on columns of table "vouches" */
  ['vouches_min_order_by']: GraphQLTypes['vouches_min_order_by'];
  /** Ordering options when selecting data from "vouches". */
  ['vouches_order_by']: GraphQLTypes['vouches_order_by'];
  /** select columns of table "vouches" */
  ['vouches_select_column']: GraphQLTypes['vouches_select_column'];
  /** order by stddev() on columns of table "vouches" */
  ['vouches_stddev_order_by']: GraphQLTypes['vouches_stddev_order_by'];
  /** order by stddev_pop() on columns of table "vouches" */
  ['vouches_stddev_pop_order_by']: GraphQLTypes['vouches_stddev_pop_order_by'];
  /** order by stddev_samp() on columns of table "vouches" */
  ['vouches_stddev_samp_order_by']: GraphQLTypes['vouches_stddev_samp_order_by'];
  /** order by sum() on columns of table "vouches" */
  ['vouches_sum_order_by']: GraphQLTypes['vouches_sum_order_by'];
  /** order by var_pop() on columns of table "vouches" */
  ['vouches_var_pop_order_by']: GraphQLTypes['vouches_var_pop_order_by'];
  /** order by var_samp() on columns of table "vouches" */
  ['vouches_var_samp_order_by']: GraphQLTypes['vouches_var_samp_order_by'];
  /** order by variance() on columns of table "vouches" */
  ['vouches_variance_order_by']: GraphQLTypes['vouches_variance_order_by'];
};

export type GraphQLTypes = {
  ['AdminUpdateUserInput']: {
    address: string;
    circle_id: number;
    fixed_non_receiver?: boolean | undefined;
    name?: string | undefined;
    new_address?: string | undefined;
    non_giver?: boolean | undefined;
    non_receiver?: boolean | undefined;
    role?: number | undefined;
    starting_tokens?: number | undefined;
  };
  ['Allocation']: {
    note: string;
    recipient_id: number;
    tokens: number;
  };
  ['AllocationCsvInput']: {
    circle_id: number;
    epoch?: number | undefined;
    epoch_id?: number | undefined;
    grant?: number | undefined;
  };
  ['AllocationCsvResponse']: {
    __typename: 'AllocationCsvResponse';
    file: string;
  };
  ['Allocations']: {
    allocations?: Array<GraphQLTypes['Allocation']> | undefined;
    circle_id: number;
  };
  ['AllocationsResponse']: {
    __typename: 'AllocationsResponse';
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: number;
  };
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
  ['ConfirmationResponse']: {
    __typename: 'ConfirmationResponse';
    success: boolean;
  };
  ['CreateCircleInput']: {
    circle_name: string;
    contact?: string | undefined;
    protocol_id?: number | undefined;
    protocol_name?: string | undefined;
    user_name: string;
  };
  ['CreateCircleResponse']: {
    __typename: 'CreateCircleResponse';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    id: number;
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
  };
  ['CreateEpochInput']: {
    circle_id: number;
    days: number;
    grant?: number | undefined;
    repeat: number;
    start_date: GraphQLTypes['timestamptz'];
  };
  ['CreateNomineeInput']: {
    address: string;
    circle_id: number;
    description: string;
    name: string;
  };
  ['CreateNomineeResponse']: {
    __typename: 'CreateNomineeResponse';
    id?: number | undefined;
    /** An object relationship */
    nominee: GraphQLTypes['nominees'];
  };
  ['CreateUserInput']: {
    address: string;
    circle_id: number;
    fixed_non_receiver?: boolean | undefined;
    name: string;
    non_giver?: boolean | undefined;
    non_receiver?: boolean | undefined;
    role?: number | undefined;
    starting_tokens?: number | undefined;
  };
  ['CreateUsersInput']: {
    circle_id: number;
    users: Array<GraphQLTypes['UserObj'] | undefined>;
  };
  ['CreateVaultInput']: {
    chain_id: number;
    org_id: number;
    vault_address: string;
  };
  ['DeleteEpochInput']: {
    circle_id: number;
    id: number;
  };
  ['DeleteEpochResponse']: {
    __typename: 'DeleteEpochResponse';
    success: boolean;
  };
  ['DeleteUserInput']: {
    address: string;
    circle_id: number;
  };
  ['EpochResponse']: {
    __typename: 'EpochResponse';
    /** An object relationship */
    epoch: GraphQLTypes['epochs'];
    id: string;
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
  ['LogoutResponse']: {
    __typename: 'LogoutResponse';
    id?: number | undefined;
    /** An object relationship */
    profile: GraphQLTypes['profiles'];
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
  ['UpdateCircleInput']: {
    alloc_text?: string | undefined;
    auto_opt_out?: boolean | undefined;
    chain_id?: number | undefined;
    circle_id: number;
    default_opt_in?: boolean | undefined;
    discord_webhook?: string | undefined;
    fixed_payment_token_type?: string | undefined;
    min_vouches?: number | undefined;
    name?: string | undefined;
    nomination_days_limit?: number | undefined;
    only_giver_vouch?: boolean | undefined;
    team_sel_text?: string | undefined;
    team_selection?: boolean | undefined;
    token_name?: string | undefined;
    update_webhook?: boolean | undefined;
    vouching?: boolean | undefined;
    vouching_text?: string | undefined;
  };
  ['UpdateCircleOutput']: {
    __typename: 'UpdateCircleOutput';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    id: number;
  };
  ['UpdateCircleResponse']: {
    __typename: 'UpdateCircleResponse';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    id: number;
  };
  ['UpdateEpochInput']: {
    circle_id: number;
    days: number;
    grant?: number | undefined;
    id: number;
    repeat: number;
    start_date: GraphQLTypes['timestamptz'];
  };
  ['UpdateOrgResponse']: {
    __typename: 'UpdateOrgResponse';
    id: number;
    /** An object relationship */
    org: GraphQLTypes['organizations'];
  };
  ['UpdateProfileResponse']: {
    __typename: 'UpdateProfileResponse';
    id: number;
    /** An object relationship */
    profile: GraphQLTypes['profiles'];
  };
  ['UpdateTeammatesInput']: {
    circle_id: number;
    teammates: Array<number | undefined>;
  };
  ['UpdateTeammatesResponse']: {
    __typename: 'UpdateTeammatesResponse';
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: string;
  };
  ['UpdateUserInput']: {
    bio?: string | undefined;
    circle_id: number;
    epoch_first_visit?: boolean | undefined;
    non_receiver?: boolean | undefined;
  };
  ['UploadCircleImageInput']: {
    circle_id: number;
    image_data_base64: string;
  };
  ['UploadImageInput']: {
    image_data_base64: string;
  };
  ['UploadOrgImageInput']: {
    image_data_base64: string;
    org_id: number;
  };
  ['UserObj']: {
    address: string;
    fixed_non_receiver?: boolean | undefined;
    name: string;
    non_giver?: boolean | undefined;
    non_receiver?: boolean | undefined;
    role?: number | undefined;
    starting_tokens?: number | undefined;
  };
  ['UserResponse']: {
    __typename: 'UserResponse';
    /** An object relationship */
    UserResponse: GraphQLTypes['users'];
    id: string;
  };
  ['VaultResponse']: {
    __typename: 'VaultResponse';
    id: string;
    /** An object relationship */
    vault: GraphQLTypes['vaults'];
  };
  ['VouchInput']: {
    nominee_id: number;
  };
  ['VouchOutput']: {
    __typename: 'VouchOutput';
    id: number;
    /** An object relationship */
    nominee: GraphQLTypes['nominees'];
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
  /** columns and relationships of "burns" */
  ['burns']: {
    __typename: 'burns';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    epoch: GraphQLTypes['epochs'];
    epoch_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    original_amount: number;
    regift_percent: number;
    tokens_burnt: number;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: GraphQLTypes['bigint'];
  };
  /** order by aggregate values of table "burns" */
  ['burns_aggregate_order_by']: {
    avg?: GraphQLTypes['burns_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['burns_max_order_by'] | undefined;
    min?: GraphQLTypes['burns_min_order_by'] | undefined;
    stddev?: GraphQLTypes['burns_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['burns_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['burns_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['burns_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['burns_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['burns_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['burns_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "burns" */
  ['burns_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "burns". All fields are combined with a logical 'AND'. */
  ['burns_bool_exp']: {
    _and?: Array<GraphQLTypes['burns_bool_exp']> | undefined;
    _not?: GraphQLTypes['burns_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['burns_bool_exp']> | undefined;
    circle?: GraphQLTypes['circles_bool_exp'] | undefined;
    circle_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    epoch?: GraphQLTypes['epochs_bool_exp'] | undefined;
    epoch_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    original_amount?: GraphQLTypes['Int_comparison_exp'] | undefined;
    regift_percent?: GraphQLTypes['Int_comparison_exp'] | undefined;
    tokens_burnt?: GraphQLTypes['Int_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    user?: GraphQLTypes['users_bool_exp'] | undefined;
    user_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
  };
  /** order by max() on columns of table "burns" */
  ['burns_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "burns" */
  ['burns_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "burns". */
  ['burns_order_by']: {
    circle?: GraphQLTypes['circles_order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    epoch?: GraphQLTypes['epochs_order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user?: GraphQLTypes['users_order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "burns" */
  ['burns_select_column']: burns_select_column;
  /** order by stddev() on columns of table "burns" */
  ['burns_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "burns" */
  ['burns_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "burns" */
  ['burns_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "burns" */
  ['burns_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "burns" */
  ['burns_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "burns" */
  ['burns_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "burns" */
  ['burns_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    original_amount?: GraphQLTypes['order_by'] | undefined;
    regift_percent?: GraphQLTypes['order_by'] | undefined;
    tokens_burnt?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Circle-scoped API keys with user defined permissions to allow third parties to authenticate to Coordinape's GraphQL API.


columns and relationships of "circle_api_keys" */
  ['circle_api_keys']: {
    __typename: 'circle_api_keys';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    create_vouches: boolean;
    /** An object relationship */
    createdByUser: GraphQLTypes['users'];
    created_at: GraphQLTypes['timestamptz'];
    created_by: GraphQLTypes['bigint'];
    hash: string;
    name: string;
    read_circle: boolean;
    read_epochs: boolean;
    read_member_profiles: boolean;
    read_nominees: boolean;
    read_pending_token_gifts: boolean;
    update_circle: boolean;
    update_pending_token_gifts: boolean;
  };
  /** order by aggregate values of table "circle_api_keys" */
  ['circle_api_keys_aggregate_order_by']: {
    avg?: GraphQLTypes['circle_api_keys_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['circle_api_keys_max_order_by'] | undefined;
    min?: GraphQLTypes['circle_api_keys_min_order_by'] | undefined;
    stddev?: GraphQLTypes['circle_api_keys_stddev_order_by'] | undefined;
    stddev_pop?:
      | GraphQLTypes['circle_api_keys_stddev_pop_order_by']
      | undefined;
    stddev_samp?:
      | GraphQLTypes['circle_api_keys_stddev_samp_order_by']
      | undefined;
    sum?: GraphQLTypes['circle_api_keys_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['circle_api_keys_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['circle_api_keys_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['circle_api_keys_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "circle_api_keys" */
  ['circle_api_keys_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "circle_api_keys". All fields are combined with a logical 'AND'. */
  ['circle_api_keys_bool_exp']: {
    _and?: Array<GraphQLTypes['circle_api_keys_bool_exp']> | undefined;
    _not?: GraphQLTypes['circle_api_keys_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['circle_api_keys_bool_exp']> | undefined;
    circle?: GraphQLTypes['circles_bool_exp'] | undefined;
    circle_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    create_vouches?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    createdByUser?: GraphQLTypes['users_bool_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    created_by?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    hash?: GraphQLTypes['String_comparison_exp'] | undefined;
    name?: GraphQLTypes['String_comparison_exp'] | undefined;
    read_circle?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    read_epochs?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    read_member_profiles?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    read_nominees?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    read_pending_token_gifts?:
      | GraphQLTypes['Boolean_comparison_exp']
      | undefined;
    update_circle?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    update_pending_token_gifts?:
      | GraphQLTypes['Boolean_comparison_exp']
      | undefined;
  };
  /** order by max() on columns of table "circle_api_keys" */
  ['circle_api_keys_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    hash?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "circle_api_keys" */
  ['circle_api_keys_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    hash?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
  };
  /** response of any mutation on the table "circle_api_keys" */
  ['circle_api_keys_mutation_response']: {
    __typename: 'circle_api_keys_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['circle_api_keys']>;
  };
  /** Ordering options when selecting data from "circle_api_keys". */
  ['circle_api_keys_order_by']: {
    circle?: GraphQLTypes['circles_order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    create_vouches?: GraphQLTypes['order_by'] | undefined;
    createdByUser?: GraphQLTypes['users_order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    hash?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    read_circle?: GraphQLTypes['order_by'] | undefined;
    read_epochs?: GraphQLTypes['order_by'] | undefined;
    read_member_profiles?: GraphQLTypes['order_by'] | undefined;
    read_nominees?: GraphQLTypes['order_by'] | undefined;
    read_pending_token_gifts?: GraphQLTypes['order_by'] | undefined;
    update_circle?: GraphQLTypes['order_by'] | undefined;
    update_pending_token_gifts?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "circle_api_keys" */
  ['circle_api_keys_select_column']: circle_api_keys_select_column;
  /** order by stddev() on columns of table "circle_api_keys" */
  ['circle_api_keys_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "circle_api_keys" */
  ['circle_api_keys_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "circle_api_keys" */
  ['circle_api_keys_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "circle_api_keys" */
  ['circle_api_keys_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "circle_api_keys" */
  ['circle_api_keys_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "circle_api_keys" */
  ['circle_api_keys_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "circle_api_keys" */
  ['circle_api_keys_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "circle_integrations" */
  ['circle_integrations']: {
    __typename: 'circle_integrations';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    data: GraphQLTypes['json'];
    id: GraphQLTypes['bigint'];
    name: string;
    type: string;
  };
  /** order by aggregate values of table "circle_integrations" */
  ['circle_integrations_aggregate_order_by']: {
    avg?: GraphQLTypes['circle_integrations_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['circle_integrations_max_order_by'] | undefined;
    min?: GraphQLTypes['circle_integrations_min_order_by'] | undefined;
    stddev?: GraphQLTypes['circle_integrations_stddev_order_by'] | undefined;
    stddev_pop?:
      | GraphQLTypes['circle_integrations_stddev_pop_order_by']
      | undefined;
    stddev_samp?:
      | GraphQLTypes['circle_integrations_stddev_samp_order_by']
      | undefined;
    sum?: GraphQLTypes['circle_integrations_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['circle_integrations_var_pop_order_by'] | undefined;
    var_samp?:
      | GraphQLTypes['circle_integrations_var_samp_order_by']
      | undefined;
    variance?:
      | GraphQLTypes['circle_integrations_variance_order_by']
      | undefined;
  };
  /** order by avg() on columns of table "circle_integrations" */
  ['circle_integrations_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "circle_integrations". All fields are combined with a logical 'AND'. */
  ['circle_integrations_bool_exp']: {
    _and?: Array<GraphQLTypes['circle_integrations_bool_exp']> | undefined;
    _not?: GraphQLTypes['circle_integrations_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['circle_integrations_bool_exp']> | undefined;
    circle?: GraphQLTypes['circles_bool_exp'] | undefined;
    circle_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    data?: GraphQLTypes['json_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    name?: GraphQLTypes['String_comparison_exp'] | undefined;
    type?: GraphQLTypes['String_comparison_exp'] | undefined;
  };
  /** input type for inserting data into table "circle_integrations" */
  ['circle_integrations_insert_input']: {
    circle_id?: GraphQLTypes['bigint'] | undefined;
    data?: GraphQLTypes['json'] | undefined;
    name?: string | undefined;
    type?: string | undefined;
  };
  /** order by max() on columns of table "circle_integrations" */
  ['circle_integrations_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    type?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "circle_integrations" */
  ['circle_integrations_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    type?: GraphQLTypes['order_by'] | undefined;
  };
  /** response of any mutation on the table "circle_integrations" */
  ['circle_integrations_mutation_response']: {
    __typename: 'circle_integrations_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['circle_integrations']>;
  };
  /** Ordering options when selecting data from "circle_integrations". */
  ['circle_integrations_order_by']: {
    circle?: GraphQLTypes['circles_order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    data?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    type?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "circle_integrations" */
  ['circle_integrations_select_column']: circle_integrations_select_column;
  /** order by stddev() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "circle_integrations" */
  ['circle_integrations_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "circle_integrations" */
  ['circle_integrations_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "circle_integrations" */
  ['circle_integrations_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "circle_integrations" */
  ['circle_integrations_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "circle_private" */
  ['circle_private']: {
    __typename: 'circle_private';
    /** An object relationship */
    circle?: GraphQLTypes['circles'] | undefined;
    circle_id?: GraphQLTypes['bigint'] | undefined;
    discord_webhook?: string | undefined;
  };
  /** Boolean expression to filter rows from the table "circle_private". All fields are combined with a logical 'AND'. */
  ['circle_private_bool_exp']: {
    _and?: Array<GraphQLTypes['circle_private_bool_exp']> | undefined;
    _not?: GraphQLTypes['circle_private_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['circle_private_bool_exp']> | undefined;
    circle?: GraphQLTypes['circles_bool_exp'] | undefined;
    circle_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    discord_webhook?: GraphQLTypes['String_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "circle_private". */
  ['circle_private_order_by']: {
    circle?: GraphQLTypes['circles_order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    discord_webhook?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "circle_private" */
  ['circle_private_select_column']: circle_private_select_column;
  /** columns and relationships of "circles" */
  ['circles']: {
    __typename: 'circles';
    alloc_text?: string | undefined;
    /** An array relationship */
    api_keys: Array<GraphQLTypes['circle_api_keys']>;
    auto_opt_out: boolean;
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An object relationship */
    circle_private?: GraphQLTypes['circle_private'] | undefined;
    created_at: GraphQLTypes['timestamp'];
    default_opt_in: boolean;
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    fixed_payment_token_type?: string | undefined;
    id: GraphQLTypes['bigint'];
    /** An array relationship */
    integrations: Array<GraphQLTypes['circle_integrations']>;
    is_verified: boolean;
    logo?: string | undefined;
    min_vouches: number;
    name: string;
    nomination_days_limit: number;
    /** An array relationship */
    nominees: Array<GraphQLTypes['nominees']>;
    /** An aggregate relationship */
    nominees_aggregate: GraphQLTypes['nominees_aggregate'];
    only_giver_vouch: boolean;
    /** An object relationship */
    organization: GraphQLTypes['organizations'];
    /** An array relationship */
    pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    protocol_id: number;
    team_sel_text?: string | undefined;
    team_selection: boolean;
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    token_name: string;
    updated_at: GraphQLTypes['timestamp'];
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    vouching: boolean;
    vouching_text?: string | undefined;
  };
  /** order by aggregate values of table "circles" */
  ['circles_aggregate_order_by']: {
    avg?: GraphQLTypes['circles_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['circles_max_order_by'] | undefined;
    min?: GraphQLTypes['circles_min_order_by'] | undefined;
    stddev?: GraphQLTypes['circles_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['circles_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['circles_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['circles_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['circles_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['circles_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['circles_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "circles" */
  ['circles_avg_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "circles". All fields are combined with a logical 'AND'. */
  ['circles_bool_exp']: {
    _and?: Array<GraphQLTypes['circles_bool_exp']> | undefined;
    _not?: GraphQLTypes['circles_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['circles_bool_exp']> | undefined;
    alloc_text?: GraphQLTypes['String_comparison_exp'] | undefined;
    api_keys?: GraphQLTypes['circle_api_keys_bool_exp'] | undefined;
    auto_opt_out?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    burns?: GraphQLTypes['burns_bool_exp'] | undefined;
    circle_private?: GraphQLTypes['circle_private_bool_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    default_opt_in?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    epochs?: GraphQLTypes['epochs_bool_exp'] | undefined;
    fixed_payment_token_type?:
      | GraphQLTypes['String_comparison_exp']
      | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    integrations?: GraphQLTypes['circle_integrations_bool_exp'] | undefined;
    is_verified?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    logo?: GraphQLTypes['String_comparison_exp'] | undefined;
    min_vouches?: GraphQLTypes['Int_comparison_exp'] | undefined;
    name?: GraphQLTypes['String_comparison_exp'] | undefined;
    nomination_days_limit?: GraphQLTypes['Int_comparison_exp'] | undefined;
    nominees?: GraphQLTypes['nominees_bool_exp'] | undefined;
    only_giver_vouch?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    organization?: GraphQLTypes['organizations_bool_exp'] | undefined;
    pending_token_gifts?:
      | GraphQLTypes['pending_token_gifts_bool_exp']
      | undefined;
    protocol_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    team_sel_text?: GraphQLTypes['String_comparison_exp'] | undefined;
    team_selection?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    token_gifts?: GraphQLTypes['token_gifts_bool_exp'] | undefined;
    token_name?: GraphQLTypes['String_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    users?: GraphQLTypes['users_bool_exp'] | undefined;
    vouching?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    vouching_text?: GraphQLTypes['String_comparison_exp'] | undefined;
  };
  /** input type for incrementing numeric columns in table "circles" */
  ['circles_inc_input']: {
    min_vouches?: number | undefined;
    nomination_days_limit?: number | undefined;
  };
  /** order by max() on columns of table "circles" */
  ['circles_max_order_by']: {
    alloc_text?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    fixed_payment_token_type?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    logo?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
    team_sel_text?: GraphQLTypes['order_by'] | undefined;
    token_name?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    vouching_text?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "circles" */
  ['circles_min_order_by']: {
    alloc_text?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    fixed_payment_token_type?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    logo?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
    team_sel_text?: GraphQLTypes['order_by'] | undefined;
    token_name?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    vouching_text?: GraphQLTypes['order_by'] | undefined;
  };
  /** response of any mutation on the table "circles" */
  ['circles_mutation_response']: {
    __typename: 'circles_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['circles']>;
  };
  /** Ordering options when selecting data from "circles". */
  ['circles_order_by']: {
    alloc_text?: GraphQLTypes['order_by'] | undefined;
    api_keys_aggregate?:
      | GraphQLTypes['circle_api_keys_aggregate_order_by']
      | undefined;
    auto_opt_out?: GraphQLTypes['order_by'] | undefined;
    burns_aggregate?: GraphQLTypes['burns_aggregate_order_by'] | undefined;
    circle_private?: GraphQLTypes['circle_private_order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    default_opt_in?: GraphQLTypes['order_by'] | undefined;
    epochs_aggregate?: GraphQLTypes['epochs_aggregate_order_by'] | undefined;
    fixed_payment_token_type?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    integrations_aggregate?:
      | GraphQLTypes['circle_integrations_aggregate_order_by']
      | undefined;
    is_verified?: GraphQLTypes['order_by'] | undefined;
    logo?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    nominees_aggregate?:
      | GraphQLTypes['nominees_aggregate_order_by']
      | undefined;
    only_giver_vouch?: GraphQLTypes['order_by'] | undefined;
    organization?: GraphQLTypes['organizations_order_by'] | undefined;
    pending_token_gifts_aggregate?:
      | GraphQLTypes['pending_token_gifts_aggregate_order_by']
      | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
    team_sel_text?: GraphQLTypes['order_by'] | undefined;
    team_selection?: GraphQLTypes['order_by'] | undefined;
    token_gifts_aggregate?:
      | GraphQLTypes['token_gifts_aggregate_order_by']
      | undefined;
    token_name?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    users_aggregate?: GraphQLTypes['users_aggregate_order_by'] | undefined;
    vouching?: GraphQLTypes['order_by'] | undefined;
    vouching_text?: GraphQLTypes['order_by'] | undefined;
  };
  /** primary key columns input for table: circles */
  ['circles_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "circles" */
  ['circles_select_column']: circles_select_column;
  /** input type for updating data in table "circles" */
  ['circles_set_input']: {
    alloc_text?: string | undefined;
    auto_opt_out?: boolean | undefined;
    default_opt_in?: boolean | undefined;
    discord_webhook?: string | undefined;
    fixed_payment_token_type?: string | undefined;
    is_verified?: boolean | undefined;
    logo?: string | undefined;
    min_vouches?: number | undefined;
    name?: string | undefined;
    nomination_days_limit?: number | undefined;
    only_giver_vouch?: boolean | undefined;
    team_sel_text?: string | undefined;
    team_selection?: boolean | undefined;
    token_name?: string | undefined;
    vouching?: boolean | undefined;
    vouching_text?: string | undefined;
  };
  /** order by stddev() on columns of table "circles" */
  ['circles_stddev_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "circles" */
  ['circles_stddev_pop_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "circles" */
  ['circles_stddev_samp_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "circles" */
  ['circles_sum_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "circles" */
  ['circles_var_pop_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "circles" */
  ['circles_var_samp_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "circles" */
  ['circles_variance_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    min_vouches?: GraphQLTypes['order_by'] | undefined;
    nomination_days_limit?: GraphQLTypes['order_by'] | undefined;
    protocol_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "claims" */
  ['claims']: {
    __typename: 'claims';
    address: string;
    amount: GraphQLTypes['numeric'];
    claimed: boolean;
    created_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    distribution: GraphQLTypes['distributions'];
    distribution_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    index: GraphQLTypes['bigint'];
    new_amount: GraphQLTypes['numeric'];
    proof: string;
    updated_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: GraphQLTypes['bigint'];
  };
  /** order by aggregate values of table "claims" */
  ['claims_aggregate_order_by']: {
    avg?: GraphQLTypes['claims_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['claims_max_order_by'] | undefined;
    min?: GraphQLTypes['claims_min_order_by'] | undefined;
    stddev?: GraphQLTypes['claims_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['claims_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['claims_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['claims_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['claims_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['claims_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['claims_variance_order_by'] | undefined;
  };
  /** input type for inserting array relation for remote table "claims" */
  ['claims_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['claims_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['claims_on_conflict'] | undefined;
  };
  /** order by avg() on columns of table "claims" */
  ['claims_avg_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "claims". All fields are combined with a logical 'AND'. */
  ['claims_bool_exp']: {
    _and?: Array<GraphQLTypes['claims_bool_exp']> | undefined;
    _not?: GraphQLTypes['claims_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['claims_bool_exp']> | undefined;
    address?: GraphQLTypes['String_comparison_exp'] | undefined;
    amount?: GraphQLTypes['numeric_comparison_exp'] | undefined;
    claimed?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    distribution?: GraphQLTypes['distributions_bool_exp'] | undefined;
    distribution_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    index?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    new_amount?: GraphQLTypes['numeric_comparison_exp'] | undefined;
    proof?: GraphQLTypes['String_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    user?: GraphQLTypes['users_bool_exp'] | undefined;
    user_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
  };
  /** unique or primary key constraints on table "claims" */
  ['claims_constraint']: claims_constraint;
  /** input type for inserting data into table "claims" */
  ['claims_insert_input']: {
    address?: string | undefined;
    amount?: GraphQLTypes['numeric'] | undefined;
    distribution?:
      | GraphQLTypes['distributions_obj_rel_insert_input']
      | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    index?: GraphQLTypes['bigint'] | undefined;
    new_amount?: GraphQLTypes['numeric'] | undefined;
    proof?: string | undefined;
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by max() on columns of table "claims" */
  ['claims_max_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    amount?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    proof?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "claims" */
  ['claims_min_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    amount?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    proof?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** response of any mutation on the table "claims" */
  ['claims_mutation_response']: {
    __typename: 'claims_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['claims']>;
  };
  /** on conflict condition type for table "claims" */
  ['claims_on_conflict']: {
    constraint: GraphQLTypes['claims_constraint'];
    update_columns: Array<GraphQLTypes['claims_update_column']>;
    where?: GraphQLTypes['claims_bool_exp'] | undefined;
  };
  /** Ordering options when selecting data from "claims". */
  ['claims_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    amount?: GraphQLTypes['order_by'] | undefined;
    claimed?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    distribution?: GraphQLTypes['distributions_order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    proof?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user?: GraphQLTypes['users_order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** primary key columns input for table: claims */
  ['claims_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "claims" */
  ['claims_select_column']: claims_select_column;
  /** input type for updating data in table "claims" */
  ['claims_set_input']: {
    claimed?: boolean | undefined;
  };
  /** order by stddev() on columns of table "claims" */
  ['claims_stddev_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "claims" */
  ['claims_stddev_pop_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "claims" */
  ['claims_stddev_samp_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "claims" */
  ['claims_sum_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** update columns of table "claims" */
  ['claims_update_column']: claims_update_column;
  /** order by var_pop() on columns of table "claims" */
  ['claims_var_pop_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "claims" */
  ['claims_var_samp_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "claims" */
  ['claims_variance_order_by']: {
    amount?: GraphQLTypes['order_by'] | undefined;
    distribution_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    index?: GraphQLTypes['order_by'] | undefined;
    new_amount?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
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
  /** Vault Distributions


columns and relationships of "distributions" */
  ['distributions']: {
    __typename: 'distributions';
    /** An array relationship */
    claims: Array<GraphQLTypes['claims']>;
    created_at: GraphQLTypes['timestamp'];
    created_by: GraphQLTypes['bigint'];
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
    distribution_json: GraphQLTypes['jsonb'];
    /** An object relationship */
    epoch: GraphQLTypes['epochs'];
    epoch_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    merkle_root?: string | undefined;
    total_amount: GraphQLTypes['numeric'];
    tx_hash?: string | undefined;
    /** An object relationship */
    vault: GraphQLTypes['vaults'];
    vault_id: GraphQLTypes['bigint'];
  };
  /** aggregated selection of "distributions" */
  ['distributions_aggregate']: {
    __typename: 'distributions_aggregate';
    aggregate?: GraphQLTypes['distributions_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['distributions']>;
  };
  /** aggregate fields of "distributions" */
  ['distributions_aggregate_fields']: {
    __typename: 'distributions_aggregate_fields';
    avg?: GraphQLTypes['distributions_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['distributions_max_fields'] | undefined;
    min?: GraphQLTypes['distributions_min_fields'] | undefined;
    stddev?: GraphQLTypes['distributions_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['distributions_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['distributions_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['distributions_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['distributions_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['distributions_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['distributions_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "distributions" */
  ['distributions_aggregate_order_by']: {
    avg?: GraphQLTypes['distributions_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['distributions_max_order_by'] | undefined;
    min?: GraphQLTypes['distributions_min_order_by'] | undefined;
    stddev?: GraphQLTypes['distributions_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['distributions_stddev_pop_order_by'] | undefined;
    stddev_samp?:
      | GraphQLTypes['distributions_stddev_samp_order_by']
      | undefined;
    sum?: GraphQLTypes['distributions_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['distributions_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['distributions_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['distributions_variance_order_by'] | undefined;
  };
  /** aggregate avg on columns */
  ['distributions_avg_fields']: {
    __typename: 'distributions_avg_fields';
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by avg() on columns of table "distributions" */
  ['distributions_avg_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "distributions". All fields are combined with a logical 'AND'. */
  ['distributions_bool_exp']: {
    _and?: Array<GraphQLTypes['distributions_bool_exp']> | undefined;
    _not?: GraphQLTypes['distributions_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['distributions_bool_exp']> | undefined;
    claims?: GraphQLTypes['claims_bool_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    created_by?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    distribution_epoch_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    distribution_json?: GraphQLTypes['jsonb_comparison_exp'] | undefined;
    epoch?: GraphQLTypes['epochs_bool_exp'] | undefined;
    epoch_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    merkle_root?: GraphQLTypes['String_comparison_exp'] | undefined;
    total_amount?: GraphQLTypes['numeric_comparison_exp'] | undefined;
    tx_hash?: GraphQLTypes['String_comparison_exp'] | undefined;
    vault?: GraphQLTypes['vaults_bool_exp'] | undefined;
    vault_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
  };
  /** unique or primary key constraints on table "distributions" */
  ['distributions_constraint']: distributions_constraint;
  /** input type for incrementing numeric columns in table "distributions" */
  ['distributions_inc_input']: {
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** input type for inserting data into table "distributions" */
  ['distributions_insert_input']: {
    claims?: GraphQLTypes['claims_arr_rel_insert_input'] | undefined;
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
    distribution_json?: GraphQLTypes['jsonb'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    merkle_root?: string | undefined;
    total_amount?: GraphQLTypes['numeric'] | undefined;
    vault_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** aggregate max on columns */
  ['distributions_max_fields']: {
    __typename: 'distributions_max_fields';
    created_at?: GraphQLTypes['timestamp'] | undefined;
    created_by?: GraphQLTypes['bigint'] | undefined;
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    merkle_root?: string | undefined;
    total_amount?: GraphQLTypes['numeric'] | undefined;
    tx_hash?: string | undefined;
    vault_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by max() on columns of table "distributions" */
  ['distributions_max_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    merkle_root?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    tx_hash?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate min on columns */
  ['distributions_min_fields']: {
    __typename: 'distributions_min_fields';
    created_at?: GraphQLTypes['timestamp'] | undefined;
    created_by?: GraphQLTypes['bigint'] | undefined;
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    merkle_root?: string | undefined;
    total_amount?: GraphQLTypes['numeric'] | undefined;
    tx_hash?: string | undefined;
    vault_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by min() on columns of table "distributions" */
  ['distributions_min_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    merkle_root?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    tx_hash?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** response of any mutation on the table "distributions" */
  ['distributions_mutation_response']: {
    __typename: 'distributions_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['distributions']>;
  };
  /** input type for inserting object relation for remote table "distributions" */
  ['distributions_obj_rel_insert_input']: {
    data: GraphQLTypes['distributions_insert_input'];
    /** on conflict condition */
    on_conflict?: GraphQLTypes['distributions_on_conflict'] | undefined;
  };
  /** on conflict condition type for table "distributions" */
  ['distributions_on_conflict']: {
    constraint: GraphQLTypes['distributions_constraint'];
    update_columns: Array<GraphQLTypes['distributions_update_column']>;
    where?: GraphQLTypes['distributions_bool_exp'] | undefined;
  };
  /** Ordering options when selecting data from "distributions". */
  ['distributions_order_by']: {
    claims_aggregate?: GraphQLTypes['claims_aggregate_order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    distribution_json?: GraphQLTypes['order_by'] | undefined;
    epoch?: GraphQLTypes['epochs_order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    merkle_root?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    tx_hash?: GraphQLTypes['order_by'] | undefined;
    vault?: GraphQLTypes['vaults_order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** primary key columns input for table: distributions */
  ['distributions_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "distributions" */
  ['distributions_select_column']: distributions_select_column;
  /** input type for updating data in table "distributions" */
  ['distributions_set_input']: {
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
    tx_hash?: string | undefined;
  };
  /** aggregate stddev on columns */
  ['distributions_stddev_fields']: {
    __typename: 'distributions_stddev_fields';
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by stddev() on columns of table "distributions" */
  ['distributions_stddev_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_pop on columns */
  ['distributions_stddev_pop_fields']: {
    __typename: 'distributions_stddev_pop_fields';
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "distributions" */
  ['distributions_stddev_pop_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_samp on columns */
  ['distributions_stddev_samp_fields']: {
    __typename: 'distributions_stddev_samp_fields';
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "distributions" */
  ['distributions_stddev_samp_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate sum on columns */
  ['distributions_sum_fields']: {
    __typename: 'distributions_sum_fields';
    created_by?: GraphQLTypes['bigint'] | undefined;
    distribution_epoch_id?: GraphQLTypes['bigint'] | undefined;
    epoch_id?: GraphQLTypes['bigint'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    total_amount?: GraphQLTypes['numeric'] | undefined;
    vault_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by sum() on columns of table "distributions" */
  ['distributions_sum_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** update columns of table "distributions" */
  ['distributions_update_column']: distributions_update_column;
  /** aggregate var_pop on columns */
  ['distributions_var_pop_fields']: {
    __typename: 'distributions_var_pop_fields';
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by var_pop() on columns of table "distributions" */
  ['distributions_var_pop_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_samp on columns */
  ['distributions_var_samp_fields']: {
    __typename: 'distributions_var_samp_fields';
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by var_samp() on columns of table "distributions" */
  ['distributions_var_samp_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate variance on columns */
  ['distributions_variance_fields']: {
    __typename: 'distributions_variance_fields';
    created_by?: number | undefined;
    distribution_epoch_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    total_amount?: number | undefined;
    vault_id?: number | undefined;
  };
  /** order by variance() on columns of table "distributions" */
  ['distributions_variance_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    distribution_epoch_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    total_amount?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "epoches" */
  ['epochs']: {
    __typename: 'epochs';
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An object relationship */
    circle?: GraphQLTypes['circles'] | undefined;
    circle_id: number;
    created_at: GraphQLTypes['timestamp'];
    days?: number | undefined;
    /** An array relationship */
    distributions: Array<GraphQLTypes['distributions']>;
    /** An aggregate relationship */
    distributions_aggregate: GraphQLTypes['distributions_aggregate'];
    end_date: GraphQLTypes['timestamptz'];
    ended: boolean;
    /** An array relationship */
    epoch_pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    grant: GraphQLTypes['numeric'];
    id: GraphQLTypes['bigint'];
    notified_before_end?: GraphQLTypes['timestamp'] | undefined;
    notified_end?: GraphQLTypes['timestamp'] | undefined;
    notified_start?: GraphQLTypes['timestamp'] | undefined;
    number?: number | undefined;
    repeat: number;
    repeat_day_of_month: number;
    start_date: GraphQLTypes['timestamptz'];
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    updated_at: GraphQLTypes['timestamp'];
  };
  /** order by aggregate values of table "epoches" */
  ['epochs_aggregate_order_by']: {
    avg?: GraphQLTypes['epochs_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['epochs_max_order_by'] | undefined;
    min?: GraphQLTypes['epochs_min_order_by'] | undefined;
    stddev?: GraphQLTypes['epochs_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['epochs_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['epochs_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['epochs_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['epochs_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['epochs_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['epochs_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "epoches" */
  ['epochs_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "epoches". All fields are combined with a logical 'AND'. */
  ['epochs_bool_exp']: {
    _and?: Array<GraphQLTypes['epochs_bool_exp']> | undefined;
    _not?: GraphQLTypes['epochs_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['epochs_bool_exp']> | undefined;
    burns?: GraphQLTypes['burns_bool_exp'] | undefined;
    circle?: GraphQLTypes['circles_bool_exp'] | undefined;
    circle_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    days?: GraphQLTypes['Int_comparison_exp'] | undefined;
    distributions?: GraphQLTypes['distributions_bool_exp'] | undefined;
    end_date?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    ended?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    epoch_pending_token_gifts?:
      | GraphQLTypes['pending_token_gifts_bool_exp']
      | undefined;
    grant?: GraphQLTypes['numeric_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    notified_before_end?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    notified_end?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    notified_start?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    number?: GraphQLTypes['Int_comparison_exp'] | undefined;
    repeat?: GraphQLTypes['Int_comparison_exp'] | undefined;
    repeat_day_of_month?: GraphQLTypes['Int_comparison_exp'] | undefined;
    start_date?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    token_gifts?: GraphQLTypes['token_gifts_bool_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
  };
  /** order by max() on columns of table "epoches" */
  ['epochs_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    end_date?: GraphQLTypes['order_by'] | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    notified_before_end?: GraphQLTypes['order_by'] | undefined;
    notified_end?: GraphQLTypes['order_by'] | undefined;
    notified_start?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
    start_date?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "epoches" */
  ['epochs_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    end_date?: GraphQLTypes['order_by'] | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    notified_before_end?: GraphQLTypes['order_by'] | undefined;
    notified_end?: GraphQLTypes['order_by'] | undefined;
    notified_start?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
    start_date?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "epoches". */
  ['epochs_order_by']: {
    burns_aggregate?: GraphQLTypes['burns_aggregate_order_by'] | undefined;
    circle?: GraphQLTypes['circles_order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    distributions_aggregate?:
      | GraphQLTypes['distributions_aggregate_order_by']
      | undefined;
    end_date?: GraphQLTypes['order_by'] | undefined;
    ended?: GraphQLTypes['order_by'] | undefined;
    epoch_pending_token_gifts_aggregate?:
      | GraphQLTypes['pending_token_gifts_aggregate_order_by']
      | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    notified_before_end?: GraphQLTypes['order_by'] | undefined;
    notified_end?: GraphQLTypes['order_by'] | undefined;
    notified_start?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
    start_date?: GraphQLTypes['order_by'] | undefined;
    token_gifts_aggregate?:
      | GraphQLTypes['token_gifts_aggregate_order_by']
      | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "epoches" */
  ['epochs_select_column']: epochs_select_column;
  /** order by stddev() on columns of table "epoches" */
  ['epochs_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "epoches" */
  ['epochs_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "epoches" */
  ['epochs_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "epoches" */
  ['epochs_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "epoches" */
  ['epochs_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "epoches" */
  ['epochs_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "epoches" */
  ['epochs_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    days?: GraphQLTypes['order_by'] | undefined;
    grant?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    number?: GraphQLTypes['order_by'] | undefined;
    repeat?: GraphQLTypes['order_by'] | undefined;
    repeat_day_of_month?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "gift_private" */
  ['gift_private']: {
    __typename: 'gift_private';
    gift_id?: GraphQLTypes['bigint'] | undefined;
    note?: string | undefined;
    /** An object relationship */
    recipient?: GraphQLTypes['users'] | undefined;
    recipient_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    sender?: GraphQLTypes['users'] | undefined;
    sender_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** Boolean expression to filter rows from the table "gift_private". All fields are combined with a logical 'AND'. */
  ['gift_private_bool_exp']: {
    _and?: Array<GraphQLTypes['gift_private_bool_exp']> | undefined;
    _not?: GraphQLTypes['gift_private_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['gift_private_bool_exp']> | undefined;
    gift_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    note?: GraphQLTypes['String_comparison_exp'] | undefined;
    recipient?: GraphQLTypes['users_bool_exp'] | undefined;
    recipient_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    sender?: GraphQLTypes['users_bool_exp'] | undefined;
    sender_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "gift_private". */
  ['gift_private_order_by']: {
    gift_id?: GraphQLTypes['order_by'] | undefined;
    note?: GraphQLTypes['order_by'] | undefined;
    recipient?: GraphQLTypes['users_order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender?: GraphQLTypes['users_order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "gift_private" */
  ['gift_private_select_column']: gift_private_select_column;
  ['json']: any;
  /** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
  ['json_comparison_exp']: {
    _eq?: GraphQLTypes['json'] | undefined;
    _gt?: GraphQLTypes['json'] | undefined;
    _gte?: GraphQLTypes['json'] | undefined;
    _in?: Array<GraphQLTypes['json']> | undefined;
    _is_null?: boolean | undefined;
    _lt?: GraphQLTypes['json'] | undefined;
    _lte?: GraphQLTypes['json'] | undefined;
    _neq?: GraphQLTypes['json'] | undefined;
    _nin?: Array<GraphQLTypes['json']> | undefined;
  };
  ['jsonb']: any;
  /** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
  ['jsonb_comparison_exp']: {
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
  /** mutation root */
  ['mutation_root']: {
    __typename: 'mutation_root';
    adminUpdateUser?: GraphQLTypes['UserResponse'] | undefined;
    allocationCsv?: GraphQLTypes['AllocationCsvResponse'] | undefined;
    createCircle?: GraphQLTypes['CreateCircleResponse'] | undefined;
    createEpoch?: GraphQLTypes['EpochResponse'] | undefined;
    createNominee?: GraphQLTypes['CreateNomineeResponse'] | undefined;
    createUser?: GraphQLTypes['UserResponse'] | undefined;
    createUsers?: Array<GraphQLTypes['UserResponse'] | undefined> | undefined;
    createVault?: GraphQLTypes['VaultResponse'] | undefined;
    deleteEpoch?: GraphQLTypes['DeleteEpochResponse'] | undefined;
    deleteUser?: GraphQLTypes['ConfirmationResponse'] | undefined;
    /** delete data from the table: "circle_api_keys" */
    delete_circle_api_keys?:
      | GraphQLTypes['circle_api_keys_mutation_response']
      | undefined;
    /** delete single row from the table: "circle_api_keys" */
    delete_circle_api_keys_by_pk?: GraphQLTypes['circle_api_keys'] | undefined;
    /** delete data from the table: "circle_integrations" */
    delete_circle_integrations?:
      | GraphQLTypes['circle_integrations_mutation_response']
      | undefined;
    /** delete single row from the table: "circle_integrations" */
    delete_circle_integrations_by_pk?:
      | GraphQLTypes['circle_integrations']
      | undefined;
    /** insert data into the table: "circle_integrations" */
    insert_circle_integrations?:
      | GraphQLTypes['circle_integrations_mutation_response']
      | undefined;
    /** insert a single row into the table: "circle_integrations" */
    insert_circle_integrations_one?:
      | GraphQLTypes['circle_integrations']
      | undefined;
    /** insert data into the table: "claims" */
    insert_claims?: GraphQLTypes['claims_mutation_response'] | undefined;
    /** insert a single row into the table: "claims" */
    insert_claims_one?: GraphQLTypes['claims'] | undefined;
    /** insert data into the table: "distributions" */
    insert_distributions?:
      | GraphQLTypes['distributions_mutation_response']
      | undefined;
    /** insert a single row into the table: "distributions" */
    insert_distributions_one?: GraphQLTypes['distributions'] | undefined;
    /** insert data into the table: "vault_transactions" */
    insert_vault_transactions?:
      | GraphQLTypes['vault_transactions_mutation_response']
      | undefined;
    /** insert a single row into the table: "vault_transactions" */
    insert_vault_transactions_one?:
      | GraphQLTypes['vault_transactions']
      | undefined;
    logoutUser?: GraphQLTypes['LogoutResponse'] | undefined;
    updateAllocations?: GraphQLTypes['AllocationsResponse'] | undefined;
    updateCircle?: GraphQLTypes['UpdateCircleOutput'] | undefined;
    updateEpoch?: GraphQLTypes['EpochResponse'] | undefined;
    updateTeammates?: GraphQLTypes['UpdateTeammatesResponse'] | undefined;
    /** Update own user */
    updateUser?: GraphQLTypes['UserResponse'] | undefined;
    /** update data of the table: "circles" */
    update_circles?: GraphQLTypes['circles_mutation_response'] | undefined;
    /** update single row of the table: "circles" */
    update_circles_by_pk?: GraphQLTypes['circles'] | undefined;
    /** update data of the table: "claims" */
    update_claims?: GraphQLTypes['claims_mutation_response'] | undefined;
    /** update single row of the table: "claims" */
    update_claims_by_pk?: GraphQLTypes['claims'] | undefined;
    /** update data of the table: "distributions" */
    update_distributions?:
      | GraphQLTypes['distributions_mutation_response']
      | undefined;
    /** update single row of the table: "distributions" */
    update_distributions_by_pk?: GraphQLTypes['distributions'] | undefined;
    /** update data of the table: "profiles" */
    update_profiles?: GraphQLTypes['profiles_mutation_response'] | undefined;
    /** update single row of the table: "profiles" */
    update_profiles_by_pk?: GraphQLTypes['profiles'] | undefined;
    uploadCircleLogo?: GraphQLTypes['UpdateCircleResponse'] | undefined;
    uploadOrgLogo?: GraphQLTypes['UpdateOrgResponse'] | undefined;
    uploadProfileAvatar?: GraphQLTypes['UpdateProfileResponse'] | undefined;
    uploadProfileBackground?: GraphQLTypes['UpdateProfileResponse'] | undefined;
    vouch?: GraphQLTypes['VouchOutput'] | undefined;
  };
  /** columns and relationships of "nominees" */
  ['nominees']: {
    __typename: 'nominees';
    address: string;
    /** An object relationship */
    circle?: GraphQLTypes['circles'] | undefined;
    circle_id: number;
    created_at: GraphQLTypes['timestamp'];
    description: string;
    ended: boolean;
    expiry_date: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    name: string;
    nominated_by_user_id: number;
    nominated_date: GraphQLTypes['date'];
    /** An array relationship */
    nominations: Array<GraphQLTypes['vouches']>;
    /** An object relationship */
    nominator?: GraphQLTypes['users'] | undefined;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user?: GraphQLTypes['users'] | undefined;
    user_id?: number | undefined;
    vouches_required: number;
  };
  /** aggregated selection of "nominees" */
  ['nominees_aggregate']: {
    __typename: 'nominees_aggregate';
    aggregate?: GraphQLTypes['nominees_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['nominees']>;
  };
  /** aggregate fields of "nominees" */
  ['nominees_aggregate_fields']: {
    __typename: 'nominees_aggregate_fields';
    avg?: GraphQLTypes['nominees_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['nominees_max_fields'] | undefined;
    min?: GraphQLTypes['nominees_min_fields'] | undefined;
    stddev?: GraphQLTypes['nominees_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['nominees_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['nominees_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['nominees_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['nominees_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['nominees_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['nominees_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "nominees" */
  ['nominees_aggregate_order_by']: {
    avg?: GraphQLTypes['nominees_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['nominees_max_order_by'] | undefined;
    min?: GraphQLTypes['nominees_min_order_by'] | undefined;
    stddev?: GraphQLTypes['nominees_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['nominees_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['nominees_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['nominees_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['nominees_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['nominees_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['nominees_variance_order_by'] | undefined;
  };
  /** aggregate avg on columns */
  ['nominees_avg_fields']: {
    __typename: 'nominees_avg_fields';
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by avg() on columns of table "nominees" */
  ['nominees_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "nominees". All fields are combined with a logical 'AND'. */
  ['nominees_bool_exp']: {
    _and?: Array<GraphQLTypes['nominees_bool_exp']> | undefined;
    _not?: GraphQLTypes['nominees_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['nominees_bool_exp']> | undefined;
    address?: GraphQLTypes['String_comparison_exp'] | undefined;
    circle?: GraphQLTypes['circles_bool_exp'] | undefined;
    circle_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    description?: GraphQLTypes['String_comparison_exp'] | undefined;
    ended?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    expiry_date?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    name?: GraphQLTypes['String_comparison_exp'] | undefined;
    nominated_by_user_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    nominated_date?: GraphQLTypes['date_comparison_exp'] | undefined;
    nominations?: GraphQLTypes['vouches_bool_exp'] | undefined;
    nominator?: GraphQLTypes['users_bool_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    user?: GraphQLTypes['users_bool_exp'] | undefined;
    user_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    vouches_required?: GraphQLTypes['Int_comparison_exp'] | undefined;
  };
  /** aggregate max on columns */
  ['nominees_max_fields']: {
    __typename: 'nominees_max_fields';
    address?: string | undefined;
    circle_id?: number | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    description?: string | undefined;
    expiry_date?: GraphQLTypes['timestamp'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    name?: string | undefined;
    nominated_by_user_id?: number | undefined;
    nominated_date?: GraphQLTypes['date'] | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by max() on columns of table "nominees" */
  ['nominees_max_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
    expiry_date?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    nominated_date?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate min on columns */
  ['nominees_min_fields']: {
    __typename: 'nominees_min_fields';
    address?: string | undefined;
    circle_id?: number | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    description?: string | undefined;
    expiry_date?: GraphQLTypes['timestamp'] | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    name?: string | undefined;
    nominated_by_user_id?: number | undefined;
    nominated_date?: GraphQLTypes['date'] | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by min() on columns of table "nominees" */
  ['nominees_min_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
    expiry_date?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    nominated_date?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "nominees". */
  ['nominees_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    circle?: GraphQLTypes['circles_order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
    ended?: GraphQLTypes['order_by'] | undefined;
    expiry_date?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    nominated_date?: GraphQLTypes['order_by'] | undefined;
    nominations_aggregate?:
      | GraphQLTypes['vouches_aggregate_order_by']
      | undefined;
    nominator?: GraphQLTypes['users_order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user?: GraphQLTypes['users_order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "nominees" */
  ['nominees_select_column']: nominees_select_column;
  /** aggregate stddev on columns */
  ['nominees_stddev_fields']: {
    __typename: 'nominees_stddev_fields';
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by stddev() on columns of table "nominees" */
  ['nominees_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_pop on columns */
  ['nominees_stddev_pop_fields']: {
    __typename: 'nominees_stddev_pop_fields';
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "nominees" */
  ['nominees_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_samp on columns */
  ['nominees_stddev_samp_fields']: {
    __typename: 'nominees_stddev_samp_fields';
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "nominees" */
  ['nominees_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate sum on columns */
  ['nominees_sum_fields']: {
    __typename: 'nominees_sum_fields';
    circle_id?: number | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by sum() on columns of table "nominees" */
  ['nominees_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_pop on columns */
  ['nominees_var_pop_fields']: {
    __typename: 'nominees_var_pop_fields';
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by var_pop() on columns of table "nominees" */
  ['nominees_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_samp on columns */
  ['nominees_var_samp_fields']: {
    __typename: 'nominees_var_samp_fields';
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by var_samp() on columns of table "nominees" */
  ['nominees_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate variance on columns */
  ['nominees_variance_fields']: {
    __typename: 'nominees_variance_fields';
    circle_id?: number | undefined;
    id?: number | undefined;
    nominated_by_user_id?: number | undefined;
    user_id?: number | undefined;
    vouches_required?: number | undefined;
  };
  /** order by variance() on columns of table "nominees" */
  ['nominees_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominated_by_user_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
    vouches_required?: GraphQLTypes['order_by'] | undefined;
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
  /** columns and relationships of "protocols" */
  ['organizations']: {
    __typename: 'organizations';
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    created_at: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    logo?: string | undefined;
    name: string;
    updated_at: GraphQLTypes['timestamp'];
    /** An array relationship */
    vaults: Array<GraphQLTypes['vaults']>;
  };
  /** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
  ['organizations_bool_exp']: {
    _and?: Array<GraphQLTypes['organizations_bool_exp']> | undefined;
    _not?: GraphQLTypes['organizations_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['organizations_bool_exp']> | undefined;
    circles?: GraphQLTypes['circles_bool_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    logo?: GraphQLTypes['String_comparison_exp'] | undefined;
    name?: GraphQLTypes['String_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    vaults?: GraphQLTypes['vaults_bool_exp'] | undefined;
  };
  /** Ordering options when selecting data from "protocols". */
  ['organizations_order_by']: {
    circles_aggregate?: GraphQLTypes['circles_aggregate_order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    logo?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    vaults_aggregate?: GraphQLTypes['vaults_aggregate_order_by'] | undefined;
  };
  /** select columns of table "protocols" */
  ['organizations_select_column']: organizations_select_column;
  /** columns and relationships of "pending_gift_private" */
  ['pending_gift_private']: {
    __typename: 'pending_gift_private';
    gift_id?: GraphQLTypes['bigint'] | undefined;
    note?: string | undefined;
    /** An object relationship */
    recipient?: GraphQLTypes['users'] | undefined;
    recipient_id?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    sender?: GraphQLTypes['users'] | undefined;
    sender_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** Boolean expression to filter rows from the table "pending_gift_private". All fields are combined with a logical 'AND'. */
  ['pending_gift_private_bool_exp']: {
    _and?: Array<GraphQLTypes['pending_gift_private_bool_exp']> | undefined;
    _not?: GraphQLTypes['pending_gift_private_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['pending_gift_private_bool_exp']> | undefined;
    gift_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    note?: GraphQLTypes['String_comparison_exp'] | undefined;
    recipient?: GraphQLTypes['users_bool_exp'] | undefined;
    recipient_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    sender?: GraphQLTypes['users_bool_exp'] | undefined;
    sender_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "pending_gift_private". */
  ['pending_gift_private_order_by']: {
    gift_id?: GraphQLTypes['order_by'] | undefined;
    note?: GraphQLTypes['order_by'] | undefined;
    recipient?: GraphQLTypes['users_order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender?: GraphQLTypes['users_order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "pending_gift_private" */
  ['pending_gift_private_select_column']: pending_gift_private_select_column;
  /** GIVE allocations made by circle members for the currently running epoch


columns and relationships of "pending_token_gifts" */
  ['pending_token_gifts']: {
    __typename: 'pending_token_gifts';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at: GraphQLTypes['timestamp'];
    dts_created: GraphQLTypes['timestamp'];
    /** An object relationship */
    epoch?: GraphQLTypes['epochs'] | undefined;
    epoch_id: number;
    /** An object relationship */
    gift_private?: GraphQLTypes['pending_gift_private'] | undefined;
    id: GraphQLTypes['bigint'];
    /** An object relationship */
    recipient: GraphQLTypes['users'];
    recipient_address: string;
    recipient_id: GraphQLTypes['bigint'];
    /** An object relationship */
    sender: GraphQLTypes['users'];
    sender_address: string;
    sender_id: GraphQLTypes['bigint'];
    tokens: number;
    updated_at: GraphQLTypes['timestamp'];
  };
  /** order by aggregate values of table "pending_token_gifts" */
  ['pending_token_gifts_aggregate_order_by']: {
    avg?: GraphQLTypes['pending_token_gifts_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['pending_token_gifts_max_order_by'] | undefined;
    min?: GraphQLTypes['pending_token_gifts_min_order_by'] | undefined;
    stddev?: GraphQLTypes['pending_token_gifts_stddev_order_by'] | undefined;
    stddev_pop?:
      | GraphQLTypes['pending_token_gifts_stddev_pop_order_by']
      | undefined;
    stddev_samp?:
      | GraphQLTypes['pending_token_gifts_stddev_samp_order_by']
      | undefined;
    sum?: GraphQLTypes['pending_token_gifts_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['pending_token_gifts_var_pop_order_by'] | undefined;
    var_samp?:
      | GraphQLTypes['pending_token_gifts_var_samp_order_by']
      | undefined;
    variance?:
      | GraphQLTypes['pending_token_gifts_variance_order_by']
      | undefined;
  };
  /** order by avg() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "pending_token_gifts". All fields are combined with a logical 'AND'. */
  ['pending_token_gifts_bool_exp']: {
    _and?: Array<GraphQLTypes['pending_token_gifts_bool_exp']> | undefined;
    _not?: GraphQLTypes['pending_token_gifts_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['pending_token_gifts_bool_exp']> | undefined;
    circle?: GraphQLTypes['circles_bool_exp'] | undefined;
    circle_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    dts_created?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    epoch?: GraphQLTypes['epochs_bool_exp'] | undefined;
    epoch_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    gift_private?: GraphQLTypes['pending_gift_private_bool_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    recipient?: GraphQLTypes['users_bool_exp'] | undefined;
    recipient_address?: GraphQLTypes['String_comparison_exp'] | undefined;
    recipient_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    sender?: GraphQLTypes['users_bool_exp'] | undefined;
    sender_address?: GraphQLTypes['String_comparison_exp'] | undefined;
    sender_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    tokens?: GraphQLTypes['Int_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
  };
  /** order by max() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    dts_created?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_address?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_address?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    dts_created?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_address?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_address?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "pending_token_gifts". */
  ['pending_token_gifts_order_by']: {
    circle?: GraphQLTypes['circles_order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    dts_created?: GraphQLTypes['order_by'] | undefined;
    epoch?: GraphQLTypes['epochs_order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    gift_private?: GraphQLTypes['pending_gift_private_order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient?: GraphQLTypes['users_order_by'] | undefined;
    recipient_address?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender?: GraphQLTypes['users_order_by'] | undefined;
    sender_address?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "pending_token_gifts" */
  ['pending_token_gifts_select_column']: pending_token_gifts_select_column;
  /** order by stddev() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** Coordinape user accounts that can belong to one or many circles via the relationship to the users table


columns and relationships of "profiles" */
  ['profiles']: {
    __typename: 'profiles';
    address: string;
    avatar?: string | undefined;
    background?: string | undefined;
    bio?: string | undefined;
    created_at: GraphQLTypes['timestamp'];
    discord_username?: string | undefined;
    github_username?: string | undefined;
    id: GraphQLTypes['bigint'];
    medium_username?: string | undefined;
    skills?: string | undefined;
    telegram_username?: string | undefined;
    twitter_username?: string | undefined;
    updated_at: GraphQLTypes['timestamp'];
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    website?: string | undefined;
  };
  /** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
  ['profiles_bool_exp']: {
    _and?: Array<GraphQLTypes['profiles_bool_exp']> | undefined;
    _not?: GraphQLTypes['profiles_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['profiles_bool_exp']> | undefined;
    address?: GraphQLTypes['String_comparison_exp'] | undefined;
    avatar?: GraphQLTypes['String_comparison_exp'] | undefined;
    background?: GraphQLTypes['String_comparison_exp'] | undefined;
    bio?: GraphQLTypes['String_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    discord_username?: GraphQLTypes['String_comparison_exp'] | undefined;
    github_username?: GraphQLTypes['String_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    medium_username?: GraphQLTypes['String_comparison_exp'] | undefined;
    skills?: GraphQLTypes['String_comparison_exp'] | undefined;
    telegram_username?: GraphQLTypes['String_comparison_exp'] | undefined;
    twitter_username?: GraphQLTypes['String_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    users?: GraphQLTypes['users_bool_exp'] | undefined;
    website?: GraphQLTypes['String_comparison_exp'] | undefined;
  };
  /** response of any mutation on the table "profiles" */
  ['profiles_mutation_response']: {
    __typename: 'profiles_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['profiles']>;
  };
  /** Ordering options when selecting data from "profiles". */
  ['profiles_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    avatar?: GraphQLTypes['order_by'] | undefined;
    background?: GraphQLTypes['order_by'] | undefined;
    bio?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    discord_username?: GraphQLTypes['order_by'] | undefined;
    github_username?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    medium_username?: GraphQLTypes['order_by'] | undefined;
    skills?: GraphQLTypes['order_by'] | undefined;
    telegram_username?: GraphQLTypes['order_by'] | undefined;
    twitter_username?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    users_aggregate?: GraphQLTypes['users_aggregate_order_by'] | undefined;
    website?: GraphQLTypes['order_by'] | undefined;
  };
  /** primary key columns input for table: profiles */
  ['profiles_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "profiles" */
  ['profiles_select_column']: profiles_select_column;
  /** input type for updating data in table "profiles" */
  ['profiles_set_input']: {
    avatar?: string | undefined;
    background?: string | undefined;
    bio?: string | undefined;
    discord_username?: string | undefined;
    github_username?: string | undefined;
    medium_username?: string | undefined;
    skills?: string | undefined;
    telegram_username?: string | undefined;
    twitter_username?: string | undefined;
    website?: string | undefined;
  };
  ['query_root']: {
    __typename: 'query_root';
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: GraphQLTypes['burns'] | undefined;
    /** fetch data from the table: "circle_api_keys" */
    circle_api_keys: Array<GraphQLTypes['circle_api_keys']>;
    /** fetch data from the table: "circle_api_keys" using primary key columns */
    circle_api_keys_by_pk?: GraphQLTypes['circle_api_keys'] | undefined;
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: Array<GraphQLTypes['circle_integrations']>;
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: GraphQLTypes['circle_integrations'] | undefined;
    /** fetch data from the table: "circle_private" */
    circle_private: Array<GraphQLTypes['circle_private']>;
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: GraphQLTypes['circles'] | undefined;
    /** An array relationship */
    claims: Array<GraphQLTypes['claims']>;
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: GraphQLTypes['claims'] | undefined;
    /** An array relationship */
    distributions: Array<GraphQLTypes['distributions']>;
    /** An aggregate relationship */
    distributions_aggregate: GraphQLTypes['distributions_aggregate'];
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: GraphQLTypes['distributions'] | undefined;
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: GraphQLTypes['epochs'] | undefined;
    /** fetch data from the table: "gift_private" */
    gift_private: Array<GraphQLTypes['gift_private']>;
    /** An array relationship */
    nominees: Array<GraphQLTypes['nominees']>;
    /** An aggregate relationship */
    nominees_aggregate: GraphQLTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: GraphQLTypes['nominees'] | undefined;
    /** fetch data from the table: "protocols" */
    organizations: Array<GraphQLTypes['organizations']>;
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: GraphQLTypes['organizations'] | undefined;
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: Array<GraphQLTypes['pending_gift_private']>;
    /** An array relationship */
    pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: GraphQLTypes['pending_token_gifts'] | undefined;
    /** fetch data from the table: "profiles" */
    profiles: Array<GraphQLTypes['profiles']>;
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: GraphQLTypes['profiles'] | undefined;
    /** An array relationship */
    teammates: Array<GraphQLTypes['teammates']>;
    /** fetch data from the table: "teammates" using primary key columns */
    teammates_by_pk?: GraphQLTypes['teammates'] | undefined;
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    /** fetch data from the table: "token_gifts" using primary key columns */
    token_gifts_by_pk?: GraphQLTypes['token_gifts'] | undefined;
    /** fetch data from the table: "user_private" */
    user_private: Array<GraphQLTypes['user_private']>;
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: GraphQLTypes['users'] | undefined;
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: GraphQLTypes['vault_transactions'] | undefined;
    /** An array relationship */
    vaults: Array<GraphQLTypes['vaults']>;
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: GraphQLTypes['vaults'] | undefined;
    /** fetch data from the table: "vouches" */
    vouches: Array<GraphQLTypes['vouches']>;
    /** fetch data from the table: "vouches" using primary key columns */
    vouches_by_pk?: GraphQLTypes['vouches'] | undefined;
  };
  ['subscription_root']: {
    __typename: 'subscription_root';
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: GraphQLTypes['burns'] | undefined;
    /** fetch data from the table: "circle_api_keys" */
    circle_api_keys: Array<GraphQLTypes['circle_api_keys']>;
    /** fetch data from the table: "circle_api_keys" using primary key columns */
    circle_api_keys_by_pk?: GraphQLTypes['circle_api_keys'] | undefined;
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: Array<GraphQLTypes['circle_integrations']>;
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: GraphQLTypes['circle_integrations'] | undefined;
    /** fetch data from the table: "circle_private" */
    circle_private: Array<GraphQLTypes['circle_private']>;
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: GraphQLTypes['circles'] | undefined;
    /** An array relationship */
    claims: Array<GraphQLTypes['claims']>;
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: GraphQLTypes['claims'] | undefined;
    /** An array relationship */
    distributions: Array<GraphQLTypes['distributions']>;
    /** An aggregate relationship */
    distributions_aggregate: GraphQLTypes['distributions_aggregate'];
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: GraphQLTypes['distributions'] | undefined;
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: GraphQLTypes['epochs'] | undefined;
    /** fetch data from the table: "gift_private" */
    gift_private: Array<GraphQLTypes['gift_private']>;
    /** An array relationship */
    nominees: Array<GraphQLTypes['nominees']>;
    /** An aggregate relationship */
    nominees_aggregate: GraphQLTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: GraphQLTypes['nominees'] | undefined;
    /** fetch data from the table: "protocols" */
    organizations: Array<GraphQLTypes['organizations']>;
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: GraphQLTypes['organizations'] | undefined;
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: Array<GraphQLTypes['pending_gift_private']>;
    /** An array relationship */
    pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: GraphQLTypes['pending_token_gifts'] | undefined;
    /** fetch data from the table: "profiles" */
    profiles: Array<GraphQLTypes['profiles']>;
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: GraphQLTypes['profiles'] | undefined;
    /** An array relationship */
    teammates: Array<GraphQLTypes['teammates']>;
    /** fetch data from the table: "teammates" using primary key columns */
    teammates_by_pk?: GraphQLTypes['teammates'] | undefined;
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    /** fetch data from the table: "token_gifts" using primary key columns */
    token_gifts_by_pk?: GraphQLTypes['token_gifts'] | undefined;
    /** fetch data from the table: "user_private" */
    user_private: Array<GraphQLTypes['user_private']>;
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: GraphQLTypes['users'] | undefined;
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: GraphQLTypes['vault_transactions'] | undefined;
    /** An array relationship */
    vaults: Array<GraphQLTypes['vaults']>;
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: GraphQLTypes['vaults'] | undefined;
    /** fetch data from the table: "vouches" */
    vouches: Array<GraphQLTypes['vouches']>;
    /** fetch data from the table: "vouches" using primary key columns */
    vouches_by_pk?: GraphQLTypes['vouches'] | undefined;
  };
  /** columns and relationships of "teammates" */
  ['teammates']: {
    __typename: 'teammates';
    created_at: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    team_mate_id: number;
    /** An object relationship */
    teammate?: GraphQLTypes['users'] | undefined;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user?: GraphQLTypes['users'] | undefined;
    user_id: number;
  };
  /** order by aggregate values of table "teammates" */
  ['teammates_aggregate_order_by']: {
    avg?: GraphQLTypes['teammates_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['teammates_max_order_by'] | undefined;
    min?: GraphQLTypes['teammates_min_order_by'] | undefined;
    stddev?: GraphQLTypes['teammates_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['teammates_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['teammates_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['teammates_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['teammates_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['teammates_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['teammates_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "teammates" */
  ['teammates_avg_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "teammates". All fields are combined with a logical 'AND'. */
  ['teammates_bool_exp']: {
    _and?: Array<GraphQLTypes['teammates_bool_exp']> | undefined;
    _not?: GraphQLTypes['teammates_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['teammates_bool_exp']> | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    team_mate_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    teammate?: GraphQLTypes['users_bool_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    user?: GraphQLTypes['users_bool_exp'] | undefined;
    user_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
  };
  /** order by max() on columns of table "teammates" */
  ['teammates_max_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "teammates" */
  ['teammates_min_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "teammates". */
  ['teammates_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    teammate?: GraphQLTypes['users_order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user?: GraphQLTypes['users_order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "teammates" */
  ['teammates_select_column']: teammates_select_column;
  /** order by stddev() on columns of table "teammates" */
  ['teammates_stddev_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "teammates" */
  ['teammates_stddev_pop_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "teammates" */
  ['teammates_stddev_samp_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "teammates" */
  ['teammates_sum_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "teammates" */
  ['teammates_var_pop_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "teammates" */
  ['teammates_var_samp_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "teammates" */
  ['teammates_variance_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    team_mate_id?: GraphQLTypes['order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
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
  /** GIVE allocations made by circle members for past epochs


columns and relationships of "token_gifts" */
  ['token_gifts']: {
    __typename: 'token_gifts';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at: GraphQLTypes['timestamp'];
    dts_created: GraphQLTypes['timestamp'];
    epoch_id: number;
    /** An object relationship */
    gift_private?: GraphQLTypes['gift_private'] | undefined;
    id: GraphQLTypes['bigint'];
    /** An object relationship */
    recipient: GraphQLTypes['users'];
    recipient_address: string;
    recipient_id: GraphQLTypes['bigint'];
    /** An object relationship */
    sender: GraphQLTypes['users'];
    sender_address: string;
    sender_id: GraphQLTypes['bigint'];
    tokens: number;
    updated_at: GraphQLTypes['timestamp'];
  };
  /** aggregated selection of "token_gifts" */
  ['token_gifts_aggregate']: {
    __typename: 'token_gifts_aggregate';
    aggregate?: GraphQLTypes['token_gifts_aggregate_fields'] | undefined;
    nodes: Array<GraphQLTypes['token_gifts']>;
  };
  /** aggregate fields of "token_gifts" */
  ['token_gifts_aggregate_fields']: {
    __typename: 'token_gifts_aggregate_fields';
    avg?: GraphQLTypes['token_gifts_avg_fields'] | undefined;
    count: number;
    max?: GraphQLTypes['token_gifts_max_fields'] | undefined;
    min?: GraphQLTypes['token_gifts_min_fields'] | undefined;
    stddev?: GraphQLTypes['token_gifts_stddev_fields'] | undefined;
    stddev_pop?: GraphQLTypes['token_gifts_stddev_pop_fields'] | undefined;
    stddev_samp?: GraphQLTypes['token_gifts_stddev_samp_fields'] | undefined;
    sum?: GraphQLTypes['token_gifts_sum_fields'] | undefined;
    var_pop?: GraphQLTypes['token_gifts_var_pop_fields'] | undefined;
    var_samp?: GraphQLTypes['token_gifts_var_samp_fields'] | undefined;
    variance?: GraphQLTypes['token_gifts_variance_fields'] | undefined;
  };
  /** order by aggregate values of table "token_gifts" */
  ['token_gifts_aggregate_order_by']: {
    avg?: GraphQLTypes['token_gifts_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['token_gifts_max_order_by'] | undefined;
    min?: GraphQLTypes['token_gifts_min_order_by'] | undefined;
    stddev?: GraphQLTypes['token_gifts_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['token_gifts_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['token_gifts_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['token_gifts_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['token_gifts_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['token_gifts_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['token_gifts_variance_order_by'] | undefined;
  };
  /** aggregate avg on columns */
  ['token_gifts_avg_fields']: {
    __typename: 'token_gifts_avg_fields';
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by avg() on columns of table "token_gifts" */
  ['token_gifts_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "token_gifts". All fields are combined with a logical 'AND'. */
  ['token_gifts_bool_exp']: {
    _and?: Array<GraphQLTypes['token_gifts_bool_exp']> | undefined;
    _not?: GraphQLTypes['token_gifts_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['token_gifts_bool_exp']> | undefined;
    circle?: GraphQLTypes['circles_bool_exp'] | undefined;
    circle_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    dts_created?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    epoch_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    gift_private?: GraphQLTypes['gift_private_bool_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    recipient?: GraphQLTypes['users_bool_exp'] | undefined;
    recipient_address?: GraphQLTypes['String_comparison_exp'] | undefined;
    recipient_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    sender?: GraphQLTypes['users_bool_exp'] | undefined;
    sender_address?: GraphQLTypes['String_comparison_exp'] | undefined;
    sender_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    tokens?: GraphQLTypes['Int_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
  };
  /** aggregate max on columns */
  ['token_gifts_max_fields']: {
    __typename: 'token_gifts_max_fields';
    circle_id?: GraphQLTypes['bigint'] | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    dts_created?: GraphQLTypes['timestamp'] | undefined;
    epoch_id?: number | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    recipient_address?: string | undefined;
    recipient_id?: GraphQLTypes['bigint'] | undefined;
    sender_address?: string | undefined;
    sender_id?: GraphQLTypes['bigint'] | undefined;
    tokens?: number | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
  };
  /** order by max() on columns of table "token_gifts" */
  ['token_gifts_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    dts_created?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_address?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_address?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate min on columns */
  ['token_gifts_min_fields']: {
    __typename: 'token_gifts_min_fields';
    circle_id?: GraphQLTypes['bigint'] | undefined;
    created_at?: GraphQLTypes['timestamp'] | undefined;
    dts_created?: GraphQLTypes['timestamp'] | undefined;
    epoch_id?: number | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    recipient_address?: string | undefined;
    recipient_id?: GraphQLTypes['bigint'] | undefined;
    sender_address?: string | undefined;
    sender_id?: GraphQLTypes['bigint'] | undefined;
    tokens?: number | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
  };
  /** order by min() on columns of table "token_gifts" */
  ['token_gifts_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    dts_created?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_address?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_address?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "token_gifts". */
  ['token_gifts_order_by']: {
    circle?: GraphQLTypes['circles_order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    dts_created?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    gift_private?: GraphQLTypes['gift_private_order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient?: GraphQLTypes['users_order_by'] | undefined;
    recipient_address?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender?: GraphQLTypes['users_order_by'] | undefined;
    sender_address?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "token_gifts" */
  ['token_gifts_select_column']: token_gifts_select_column;
  /** aggregate stddev on columns */
  ['token_gifts_stddev_fields']: {
    __typename: 'token_gifts_stddev_fields';
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by stddev() on columns of table "token_gifts" */
  ['token_gifts_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_pop on columns */
  ['token_gifts_stddev_pop_fields']: {
    __typename: 'token_gifts_stddev_pop_fields';
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by stddev_pop() on columns of table "token_gifts" */
  ['token_gifts_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate stddev_samp on columns */
  ['token_gifts_stddev_samp_fields']: {
    __typename: 'token_gifts_stddev_samp_fields';
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by stddev_samp() on columns of table "token_gifts" */
  ['token_gifts_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate sum on columns */
  ['token_gifts_sum_fields']: {
    __typename: 'token_gifts_sum_fields';
    circle_id?: GraphQLTypes['bigint'] | undefined;
    epoch_id?: number | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    recipient_id?: GraphQLTypes['bigint'] | undefined;
    sender_id?: GraphQLTypes['bigint'] | undefined;
    tokens?: number | undefined;
  };
  /** order by sum() on columns of table "token_gifts" */
  ['token_gifts_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_pop on columns */
  ['token_gifts_var_pop_fields']: {
    __typename: 'token_gifts_var_pop_fields';
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by var_pop() on columns of table "token_gifts" */
  ['token_gifts_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate var_samp on columns */
  ['token_gifts_var_samp_fields']: {
    __typename: 'token_gifts_var_samp_fields';
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by var_samp() on columns of table "token_gifts" */
  ['token_gifts_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** aggregate variance on columns */
  ['token_gifts_variance_fields']: {
    __typename: 'token_gifts_variance_fields';
    circle_id?: number | undefined;
    epoch_id?: number | undefined;
    id?: number | undefined;
    recipient_id?: number | undefined;
    sender_id?: number | undefined;
    tokens?: number | undefined;
  };
  /** order by variance() on columns of table "token_gifts" */
  ['token_gifts_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    epoch_id?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    recipient_id?: GraphQLTypes['order_by'] | undefined;
    sender_id?: GraphQLTypes['order_by'] | undefined;
    tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "user_private" */
  ['user_private']: {
    __typename: 'user_private';
    /** An object relationship */
    circle?: GraphQLTypes['circles'] | undefined;
    fixed_payment_amount?: GraphQLTypes['numeric'] | undefined;
    fixed_payment_token_type?: string | undefined;
    /** An object relationship */
    user?: GraphQLTypes['users'] | undefined;
    user_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** Boolean expression to filter rows from the table "user_private". All fields are combined with a logical 'AND'. */
  ['user_private_bool_exp']: {
    _and?: Array<GraphQLTypes['user_private_bool_exp']> | undefined;
    _not?: GraphQLTypes['user_private_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['user_private_bool_exp']> | undefined;
    circle?: GraphQLTypes['circles_bool_exp'] | undefined;
    fixed_payment_amount?: GraphQLTypes['numeric_comparison_exp'] | undefined;
    fixed_payment_token_type?:
      | GraphQLTypes['String_comparison_exp']
      | undefined;
    user?: GraphQLTypes['users_bool_exp'] | undefined;
    user_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
  };
  /** Ordering options when selecting data from "user_private". */
  ['user_private_order_by']: {
    circle?: GraphQLTypes['circles_order_by'] | undefined;
    fixed_payment_amount?: GraphQLTypes['order_by'] | undefined;
    fixed_payment_token_type?: GraphQLTypes['order_by'] | undefined;
    user?: GraphQLTypes['users_order_by'] | undefined;
    user_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "user_private" */
  ['user_private_select_column']: user_private_select_column;
  /** Members of a circle


columns and relationships of "users" */
  ['users']: {
    __typename: 'users';
    address: string;
    bio?: string | undefined;
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at: GraphQLTypes['timestamp'];
    deleted_at?: GraphQLTypes['timestamp'] | undefined;
    epoch_first_visit: boolean;
    fixed_non_receiver: boolean;
    give_token_received: number;
    give_token_remaining: number;
    id: GraphQLTypes['bigint'];
    name: string;
    non_giver: boolean;
    non_receiver: boolean;
    /** An array relationship */
    pending_received_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** An array relationship */
    pending_sent_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** An object relationship */
    profile: GraphQLTypes['profiles'];
    /** An array relationship */
    received_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    received_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    role: number;
    /** An array relationship */
    sent_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    sent_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    starting_tokens: number;
    /** An array relationship */
    teammates: Array<GraphQLTypes['teammates']>;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user_private?: GraphQLTypes['user_private'] | undefined;
  };
  /** order by aggregate values of table "users" */
  ['users_aggregate_order_by']: {
    avg?: GraphQLTypes['users_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['users_max_order_by'] | undefined;
    min?: GraphQLTypes['users_min_order_by'] | undefined;
    stddev?: GraphQLTypes['users_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['users_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['users_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['users_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['users_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['users_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['users_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "users" */
  ['users_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
  ['users_bool_exp']: {
    _and?: Array<GraphQLTypes['users_bool_exp']> | undefined;
    _not?: GraphQLTypes['users_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['users_bool_exp']> | undefined;
    address?: GraphQLTypes['String_comparison_exp'] | undefined;
    bio?: GraphQLTypes['String_comparison_exp'] | undefined;
    burns?: GraphQLTypes['burns_bool_exp'] | undefined;
    circle?: GraphQLTypes['circles_bool_exp'] | undefined;
    circle_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    deleted_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    epoch_first_visit?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    fixed_non_receiver?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    give_token_received?: GraphQLTypes['Int_comparison_exp'] | undefined;
    give_token_remaining?: GraphQLTypes['Int_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    name?: GraphQLTypes['String_comparison_exp'] | undefined;
    non_giver?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    non_receiver?: GraphQLTypes['Boolean_comparison_exp'] | undefined;
    pending_received_gifts?:
      | GraphQLTypes['pending_token_gifts_bool_exp']
      | undefined;
    pending_sent_gifts?:
      | GraphQLTypes['pending_token_gifts_bool_exp']
      | undefined;
    profile?: GraphQLTypes['profiles_bool_exp'] | undefined;
    received_gifts?: GraphQLTypes['token_gifts_bool_exp'] | undefined;
    role?: GraphQLTypes['Int_comparison_exp'] | undefined;
    sent_gifts?: GraphQLTypes['token_gifts_bool_exp'] | undefined;
    starting_tokens?: GraphQLTypes['Int_comparison_exp'] | undefined;
    teammates?: GraphQLTypes['teammates_bool_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    user_private?: GraphQLTypes['user_private_bool_exp'] | undefined;
  };
  /** order by max() on columns of table "users" */
  ['users_max_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    bio?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    deleted_at?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "users" */
  ['users_min_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    bio?: GraphQLTypes['order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    deleted_at?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "users". */
  ['users_order_by']: {
    address?: GraphQLTypes['order_by'] | undefined;
    bio?: GraphQLTypes['order_by'] | undefined;
    burns_aggregate?: GraphQLTypes['burns_aggregate_order_by'] | undefined;
    circle?: GraphQLTypes['circles_order_by'] | undefined;
    circle_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    deleted_at?: GraphQLTypes['order_by'] | undefined;
    epoch_first_visit?: GraphQLTypes['order_by'] | undefined;
    fixed_non_receiver?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    non_giver?: GraphQLTypes['order_by'] | undefined;
    non_receiver?: GraphQLTypes['order_by'] | undefined;
    pending_received_gifts_aggregate?:
      | GraphQLTypes['pending_token_gifts_aggregate_order_by']
      | undefined;
    pending_sent_gifts_aggregate?:
      | GraphQLTypes['pending_token_gifts_aggregate_order_by']
      | undefined;
    profile?: GraphQLTypes['profiles_order_by'] | undefined;
    received_gifts_aggregate?:
      | GraphQLTypes['token_gifts_aggregate_order_by']
      | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    sent_gifts_aggregate?:
      | GraphQLTypes['token_gifts_aggregate_order_by']
      | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
    teammates_aggregate?:
      | GraphQLTypes['teammates_aggregate_order_by']
      | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user_private?: GraphQLTypes['user_private_order_by'] | undefined;
  };
  /** select columns of table "users" */
  ['users_select_column']: users_select_column;
  /** order by stddev() on columns of table "users" */
  ['users_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "users" */
  ['users_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "users" */
  ['users_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "users" */
  ['users_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "users" */
  ['users_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "users" */
  ['users_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "users" */
  ['users_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'] | undefined;
    give_token_received?: GraphQLTypes['order_by'] | undefined;
    give_token_remaining?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    role?: GraphQLTypes['order_by'] | undefined;
    starting_tokens?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "vault_transactions" */
  ['vault_transactions']: {
    __typename: 'vault_transactions';
    created_at: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'] | undefined;
    date: GraphQLTypes['date'];
    description?: string | undefined;
    id: GraphQLTypes['bigint'];
    name: string;
    tx_hash: string;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user?: GraphQLTypes['users'] | undefined;
    value?: GraphQLTypes['bigint'] | undefined;
    /** An object relationship */
    vault: GraphQLTypes['vaults'];
    vault_id: GraphQLTypes['bigint'];
  };
  /** order by aggregate values of table "vault_transactions" */
  ['vault_transactions_aggregate_order_by']: {
    avg?: GraphQLTypes['vault_transactions_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['vault_transactions_max_order_by'] | undefined;
    min?: GraphQLTypes['vault_transactions_min_order_by'] | undefined;
    stddev?: GraphQLTypes['vault_transactions_stddev_order_by'] | undefined;
    stddev_pop?:
      | GraphQLTypes['vault_transactions_stddev_pop_order_by']
      | undefined;
    stddev_samp?:
      | GraphQLTypes['vault_transactions_stddev_samp_order_by']
      | undefined;
    sum?: GraphQLTypes['vault_transactions_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['vault_transactions_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['vault_transactions_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['vault_transactions_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "vault_transactions" */
  ['vault_transactions_avg_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "vault_transactions". All fields are combined with a logical 'AND'. */
  ['vault_transactions_bool_exp']: {
    _and?: Array<GraphQLTypes['vault_transactions_bool_exp']> | undefined;
    _not?: GraphQLTypes['vault_transactions_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['vault_transactions_bool_exp']> | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    created_by?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    date?: GraphQLTypes['date_comparison_exp'] | undefined;
    description?: GraphQLTypes['String_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    name?: GraphQLTypes['String_comparison_exp'] | undefined;
    tx_hash?: GraphQLTypes['String_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    user?: GraphQLTypes['users_bool_exp'] | undefined;
    value?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    vault?: GraphQLTypes['vaults_bool_exp'] | undefined;
    vault_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
  };
  /** input type for inserting data into table "vault_transactions" */
  ['vault_transactions_insert_input']: {
    created_at?: GraphQLTypes['timestamp'] | undefined;
    created_by?: GraphQLTypes['bigint'] | undefined;
    date?: GraphQLTypes['date'] | undefined;
    description?: string | undefined;
    id?: GraphQLTypes['bigint'] | undefined;
    name?: string | undefined;
    tx_hash?: string | undefined;
    updated_at?: GraphQLTypes['timestamp'] | undefined;
    value?: GraphQLTypes['bigint'] | undefined;
    vault_id?: GraphQLTypes['bigint'] | undefined;
  };
  /** order by max() on columns of table "vault_transactions" */
  ['vault_transactions_max_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    date?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    tx_hash?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "vault_transactions" */
  ['vault_transactions_min_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    date?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    tx_hash?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** response of any mutation on the table "vault_transactions" */
  ['vault_transactions_mutation_response']: {
    __typename: 'vault_transactions_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['vault_transactions']>;
  };
  /** Ordering options when selecting data from "vault_transactions". */
  ['vault_transactions_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    date?: GraphQLTypes['order_by'] | undefined;
    description?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    name?: GraphQLTypes['order_by'] | undefined;
    tx_hash?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    user?: GraphQLTypes['users_order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault?: GraphQLTypes['vaults_order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "vault_transactions" */
  ['vault_transactions_select_column']: vault_transactions_select_column;
  /** order by stddev() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_pop_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_samp_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "vault_transactions" */
  ['vault_transactions_sum_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "vault_transactions" */
  ['vault_transactions_var_pop_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "vault_transactions" */
  ['vault_transactions_var_samp_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "vault_transactions" */
  ['vault_transactions_variance_order_by']: {
    created_by?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    value?: GraphQLTypes['order_by'] | undefined;
    vault_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "vaults" */
  ['vaults']: {
    __typename: 'vaults';
    chain_id: number;
    created_at: GraphQLTypes['timestamptz'];
    created_by: GraphQLTypes['bigint'];
    decimals: number;
    id: GraphQLTypes['bigint'];
    org_id: GraphQLTypes['bigint'];
    /** An object relationship */
    profile: GraphQLTypes['profiles'];
    /** An object relationship */
    protocol: GraphQLTypes['organizations'];
    simple_token_address?: string | undefined;
    symbol: string;
    token_address?: string | undefined;
    updated_at: GraphQLTypes['timestamptz'];
    vault_address: string;
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
  };
  /** order by aggregate values of table "vaults" */
  ['vaults_aggregate_order_by']: {
    avg?: GraphQLTypes['vaults_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['vaults_max_order_by'] | undefined;
    min?: GraphQLTypes['vaults_min_order_by'] | undefined;
    stddev?: GraphQLTypes['vaults_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['vaults_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['vaults_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['vaults_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['vaults_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['vaults_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['vaults_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "vaults" */
  ['vaults_avg_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "vaults". All fields are combined with a logical 'AND'. */
  ['vaults_bool_exp']: {
    _and?: Array<GraphQLTypes['vaults_bool_exp']> | undefined;
    _not?: GraphQLTypes['vaults_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['vaults_bool_exp']> | undefined;
    chain_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    created_by?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    decimals?: GraphQLTypes['Int_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    org_id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    profile?: GraphQLTypes['profiles_bool_exp'] | undefined;
    protocol?: GraphQLTypes['organizations_bool_exp'] | undefined;
    simple_token_address?: GraphQLTypes['String_comparison_exp'] | undefined;
    symbol?: GraphQLTypes['String_comparison_exp'] | undefined;
    token_address?: GraphQLTypes['String_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'] | undefined;
    vault_address?: GraphQLTypes['String_comparison_exp'] | undefined;
    vault_transactions?:
      | GraphQLTypes['vault_transactions_bool_exp']
      | undefined;
  };
  /** order by max() on columns of table "vaults" */
  ['vaults_max_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
    simple_token_address?: GraphQLTypes['order_by'] | undefined;
    symbol?: GraphQLTypes['order_by'] | undefined;
    token_address?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    vault_address?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "vaults" */
  ['vaults_min_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
    simple_token_address?: GraphQLTypes['order_by'] | undefined;
    symbol?: GraphQLTypes['order_by'] | undefined;
    token_address?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    vault_address?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "vaults". */
  ['vaults_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_at?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
    profile?: GraphQLTypes['profiles_order_by'] | undefined;
    protocol?: GraphQLTypes['organizations_order_by'] | undefined;
    simple_token_address?: GraphQLTypes['order_by'] | undefined;
    symbol?: GraphQLTypes['order_by'] | undefined;
    token_address?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    vault_address?: GraphQLTypes['order_by'] | undefined;
    vault_transactions_aggregate?:
      | GraphQLTypes['vault_transactions_aggregate_order_by']
      | undefined;
  };
  /** select columns of table "vaults" */
  ['vaults_select_column']: vaults_select_column;
  /** order by stddev() on columns of table "vaults" */
  ['vaults_stddev_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "vaults" */
  ['vaults_stddev_pop_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "vaults" */
  ['vaults_stddev_samp_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "vaults" */
  ['vaults_sum_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "vaults" */
  ['vaults_var_pop_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "vaults" */
  ['vaults_var_samp_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "vaults" */
  ['vaults_variance_order_by']: {
    chain_id?: GraphQLTypes['order_by'] | undefined;
    created_by?: GraphQLTypes['order_by'] | undefined;
    decimals?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    org_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** columns and relationships of "vouches" */
  ['vouches']: {
    __typename: 'vouches';
    created_at: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    /** An object relationship */
    nominee?: GraphQLTypes['nominees'] | undefined;
    nominee_id: number;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    voucher?: GraphQLTypes['users'] | undefined;
    voucher_id: number;
  };
  /** order by aggregate values of table "vouches" */
  ['vouches_aggregate_order_by']: {
    avg?: GraphQLTypes['vouches_avg_order_by'] | undefined;
    count?: GraphQLTypes['order_by'] | undefined;
    max?: GraphQLTypes['vouches_max_order_by'] | undefined;
    min?: GraphQLTypes['vouches_min_order_by'] | undefined;
    stddev?: GraphQLTypes['vouches_stddev_order_by'] | undefined;
    stddev_pop?: GraphQLTypes['vouches_stddev_pop_order_by'] | undefined;
    stddev_samp?: GraphQLTypes['vouches_stddev_samp_order_by'] | undefined;
    sum?: GraphQLTypes['vouches_sum_order_by'] | undefined;
    var_pop?: GraphQLTypes['vouches_var_pop_order_by'] | undefined;
    var_samp?: GraphQLTypes['vouches_var_samp_order_by'] | undefined;
    variance?: GraphQLTypes['vouches_variance_order_by'] | undefined;
  };
  /** order by avg() on columns of table "vouches" */
  ['vouches_avg_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Boolean expression to filter rows from the table "vouches". All fields are combined with a logical 'AND'. */
  ['vouches_bool_exp']: {
    _and?: Array<GraphQLTypes['vouches_bool_exp']> | undefined;
    _not?: GraphQLTypes['vouches_bool_exp'] | undefined;
    _or?: Array<GraphQLTypes['vouches_bool_exp']> | undefined;
    created_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    id?: GraphQLTypes['bigint_comparison_exp'] | undefined;
    nominee?: GraphQLTypes['nominees_bool_exp'] | undefined;
    nominee_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
    updated_at?: GraphQLTypes['timestamp_comparison_exp'] | undefined;
    voucher?: GraphQLTypes['users_bool_exp'] | undefined;
    voucher_id?: GraphQLTypes['Int_comparison_exp'] | undefined;
  };
  /** order by max() on columns of table "vouches" */
  ['vouches_max_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by min() on columns of table "vouches" */
  ['vouches_min_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** Ordering options when selecting data from "vouches". */
  ['vouches_order_by']: {
    created_at?: GraphQLTypes['order_by'] | undefined;
    id?: GraphQLTypes['order_by'] | undefined;
    nominee?: GraphQLTypes['nominees_order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    updated_at?: GraphQLTypes['order_by'] | undefined;
    voucher?: GraphQLTypes['users_order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** select columns of table "vouches" */
  ['vouches_select_column']: vouches_select_column;
  /** order by stddev() on columns of table "vouches" */
  ['vouches_stddev_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_pop() on columns of table "vouches" */
  ['vouches_stddev_pop_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by stddev_samp() on columns of table "vouches" */
  ['vouches_stddev_samp_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by sum() on columns of table "vouches" */
  ['vouches_sum_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_pop() on columns of table "vouches" */
  ['vouches_var_pop_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by var_samp() on columns of table "vouches" */
  ['vouches_var_samp_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
  /** order by variance() on columns of table "vouches" */
  ['vouches_variance_order_by']: {
    id?: GraphQLTypes['order_by'] | undefined;
    nominee_id?: GraphQLTypes['order_by'] | undefined;
    voucher_id?: GraphQLTypes['order_by'] | undefined;
  };
};
/** select columns of table "burns" */
export const enum burns_select_column {
  circle_id = 'circle_id',
  created_at = 'created_at',
  epoch_id = 'epoch_id',
  id = 'id',
  original_amount = 'original_amount',
  regift_percent = 'regift_percent',
  tokens_burnt = 'tokens_burnt',
  updated_at = 'updated_at',
  user_id = 'user_id',
}
/** select columns of table "circle_api_keys" */
export const enum circle_api_keys_select_column {
  circle_id = 'circle_id',
  create_vouches = 'create_vouches',
  created_at = 'created_at',
  created_by = 'created_by',
  hash = 'hash',
  name = 'name',
  read_circle = 'read_circle',
  read_epochs = 'read_epochs',
  read_member_profiles = 'read_member_profiles',
  read_nominees = 'read_nominees',
  read_pending_token_gifts = 'read_pending_token_gifts',
  update_circle = 'update_circle',
  update_pending_token_gifts = 'update_pending_token_gifts',
}
/** select columns of table "circle_integrations" */
export const enum circle_integrations_select_column {
  circle_id = 'circle_id',
  data = 'data',
  id = 'id',
  name = 'name',
  type = 'type',
}
/** select columns of table "circle_private" */
export const enum circle_private_select_column {
  circle_id = 'circle_id',
  discord_webhook = 'discord_webhook',
}
/** select columns of table "circles" */
export const enum circles_select_column {
  alloc_text = 'alloc_text',
  auto_opt_out = 'auto_opt_out',
  created_at = 'created_at',
  default_opt_in = 'default_opt_in',
  fixed_payment_token_type = 'fixed_payment_token_type',
  id = 'id',
  is_verified = 'is_verified',
  logo = 'logo',
  min_vouches = 'min_vouches',
  name = 'name',
  nomination_days_limit = 'nomination_days_limit',
  only_giver_vouch = 'only_giver_vouch',
  protocol_id = 'protocol_id',
  team_sel_text = 'team_sel_text',
  team_selection = 'team_selection',
  token_name = 'token_name',
  updated_at = 'updated_at',
  vouching = 'vouching',
  vouching_text = 'vouching_text',
}
/** unique or primary key constraints on table "claims" */
export const enum claims_constraint {
  claims_pkey = 'claims_pkey',
}
/** select columns of table "claims" */
export const enum claims_select_column {
  address = 'address',
  amount = 'amount',
  claimed = 'claimed',
  created_at = 'created_at',
  distribution_id = 'distribution_id',
  id = 'id',
  index = 'index',
  new_amount = 'new_amount',
  proof = 'proof',
  updated_at = 'updated_at',
  user_id = 'user_id',
}
/** update columns of table "claims" */
export const enum claims_update_column {
  claimed = 'claimed',
}
/** unique or primary key constraints on table "distributions" */
export const enum distributions_constraint {
  distributions_pkey = 'distributions_pkey',
}
/** select columns of table "distributions" */
export const enum distributions_select_column {
  created_at = 'created_at',
  created_by = 'created_by',
  distribution_epoch_id = 'distribution_epoch_id',
  distribution_json = 'distribution_json',
  epoch_id = 'epoch_id',
  id = 'id',
  merkle_root = 'merkle_root',
  total_amount = 'total_amount',
  tx_hash = 'tx_hash',
  vault_id = 'vault_id',
}
/** update columns of table "distributions" */
export const enum distributions_update_column {
  distribution_epoch_id = 'distribution_epoch_id',
  tx_hash = 'tx_hash',
}
/** select columns of table "epoches" */
export const enum epochs_select_column {
  circle_id = 'circle_id',
  created_at = 'created_at',
  days = 'days',
  end_date = 'end_date',
  ended = 'ended',
  grant = 'grant',
  id = 'id',
  notified_before_end = 'notified_before_end',
  notified_end = 'notified_end',
  notified_start = 'notified_start',
  number = 'number',
  repeat = 'repeat',
  repeat_day_of_month = 'repeat_day_of_month',
  start_date = 'start_date',
  updated_at = 'updated_at',
}
/** select columns of table "gift_private" */
export const enum gift_private_select_column {
  gift_id = 'gift_id',
  note = 'note',
  recipient_id = 'recipient_id',
  sender_id = 'sender_id',
}
/** select columns of table "nominees" */
export const enum nominees_select_column {
  address = 'address',
  circle_id = 'circle_id',
  created_at = 'created_at',
  description = 'description',
  ended = 'ended',
  expiry_date = 'expiry_date',
  id = 'id',
  name = 'name',
  nominated_by_user_id = 'nominated_by_user_id',
  nominated_date = 'nominated_date',
  updated_at = 'updated_at',
  user_id = 'user_id',
  vouches_required = 'vouches_required',
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
/** select columns of table "protocols" */
export const enum organizations_select_column {
  created_at = 'created_at',
  id = 'id',
  logo = 'logo',
  name = 'name',
  updated_at = 'updated_at',
}
/** select columns of table "pending_gift_private" */
export const enum pending_gift_private_select_column {
  gift_id = 'gift_id',
  note = 'note',
  recipient_id = 'recipient_id',
  sender_id = 'sender_id',
}
/** select columns of table "pending_token_gifts" */
export const enum pending_token_gifts_select_column {
  circle_id = 'circle_id',
  created_at = 'created_at',
  dts_created = 'dts_created',
  epoch_id = 'epoch_id',
  id = 'id',
  recipient_address = 'recipient_address',
  recipient_id = 'recipient_id',
  sender_address = 'sender_address',
  sender_id = 'sender_id',
  tokens = 'tokens',
  updated_at = 'updated_at',
}
/** select columns of table "profiles" */
export const enum profiles_select_column {
  address = 'address',
  avatar = 'avatar',
  background = 'background',
  bio = 'bio',
  created_at = 'created_at',
  discord_username = 'discord_username',
  github_username = 'github_username',
  id = 'id',
  medium_username = 'medium_username',
  skills = 'skills',
  telegram_username = 'telegram_username',
  twitter_username = 'twitter_username',
  updated_at = 'updated_at',
  website = 'website',
}
/** select columns of table "teammates" */
export const enum teammates_select_column {
  created_at = 'created_at',
  id = 'id',
  team_mate_id = 'team_mate_id',
  updated_at = 'updated_at',
  user_id = 'user_id',
}
/** select columns of table "token_gifts" */
export const enum token_gifts_select_column {
  circle_id = 'circle_id',
  created_at = 'created_at',
  dts_created = 'dts_created',
  epoch_id = 'epoch_id',
  id = 'id',
  recipient_address = 'recipient_address',
  recipient_id = 'recipient_id',
  sender_address = 'sender_address',
  sender_id = 'sender_id',
  tokens = 'tokens',
  updated_at = 'updated_at',
}
/** select columns of table "user_private" */
export const enum user_private_select_column {
  fixed_payment_amount = 'fixed_payment_amount',
  fixed_payment_token_type = 'fixed_payment_token_type',
  user_id = 'user_id',
}
/** select columns of table "users" */
export const enum users_select_column {
  address = 'address',
  bio = 'bio',
  circle_id = 'circle_id',
  created_at = 'created_at',
  deleted_at = 'deleted_at',
  epoch_first_visit = 'epoch_first_visit',
  fixed_non_receiver = 'fixed_non_receiver',
  give_token_received = 'give_token_received',
  give_token_remaining = 'give_token_remaining',
  id = 'id',
  name = 'name',
  non_giver = 'non_giver',
  non_receiver = 'non_receiver',
  role = 'role',
  starting_tokens = 'starting_tokens',
  updated_at = 'updated_at',
}
/** select columns of table "vault_transactions" */
export const enum vault_transactions_select_column {
  created_at = 'created_at',
  created_by = 'created_by',
  date = 'date',
  description = 'description',
  id = 'id',
  name = 'name',
  tx_hash = 'tx_hash',
  updated_at = 'updated_at',
  value = 'value',
  vault_id = 'vault_id',
}
/** select columns of table "vaults" */
export const enum vaults_select_column {
  chain_id = 'chain_id',
  created_at = 'created_at',
  created_by = 'created_by',
  decimals = 'decimals',
  id = 'id',
  org_id = 'org_id',
  simple_token_address = 'simple_token_address',
  symbol = 'symbol',
  token_address = 'token_address',
  updated_at = 'updated_at',
  vault_address = 'vault_address',
}
/** select columns of table "vouches" */
export const enum vouches_select_column {
  created_at = 'created_at',
  id = 'id',
  nominee_id = 'nominee_id',
  updated_at = 'updated_at',
  voucher_id = 'voucher_id',
}
