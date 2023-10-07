/* eslint-disable */

export const AllTypesProps: Record<string, any> = {
  Int_comparison_exp: {},
  String_comparison_exp: {},
  bigint: 'String',
  bigint_comparison_exp: {
    _eq: 'bigint',
    _gt: 'bigint',
    _gte: 'bigint',
    _in: 'bigint',
    _lt: 'bigint',
    _lte: 'bigint',
    _neq: 'bigint',
    _nin: 'bigint',
  },
  citext: 'String',
  citext_comparison_exp: {
    _eq: 'citext',
    _gt: 'citext',
    _gte: 'citext',
    _ilike: 'citext',
    _in: 'citext',
    _iregex: 'citext',
    _like: 'citext',
    _lt: 'citext',
    _lte: 'citext',
    _neq: 'citext',
    _nilike: 'citext',
    _nin: 'citext',
    _niregex: 'citext',
    _nlike: 'citext',
    _nregex: 'citext',
    _nsimilar: 'citext',
    _regex: 'citext',
    _similar: 'citext',
  },
  cosouls_bool_exp: {
    _and: 'cosouls_bool_exp',
    _not: 'cosouls_bool_exp',
    _or: 'cosouls_bool_exp',
    address: 'citext_comparison_exp',
    id: 'Int_comparison_exp',
    pgive: 'Int_comparison_exp',
    profile_public: 'profiles_public_bool_exp',
    token_id: 'Int_comparison_exp',
  },
  cosouls_order_by: {
    address: 'order_by',
    id: 'order_by',
    pgive: 'order_by',
    profile_public: 'profiles_public_order_by',
    token_id: 'order_by',
  },
  cosouls_select_column: true,
  cosouls_stream_cursor_input: {
    initial_value: 'cosouls_stream_cursor_value_input',
    ordering: 'cursor_ordering',
  },
  cosouls_stream_cursor_value_input: {
    address: 'citext',
  },
  cursor_ordering: true,
  order_by: true,
  profiles_public_bool_exp: {
    _and: 'profiles_public_bool_exp',
    _not: 'profiles_public_bool_exp',
    _or: 'profiles_public_bool_exp',
    address: 'String_comparison_exp',
    avatar: 'String_comparison_exp',
    id: 'bigint_comparison_exp',
    name: 'citext_comparison_exp',
  },
  profiles_public_order_by: {
    address: 'order_by',
    avatar: 'order_by',
    id: 'order_by',
    name: 'order_by',
  },
  profiles_public_select_column: true,
  profiles_public_stream_cursor_input: {
    initial_value: 'profiles_public_stream_cursor_value_input',
    ordering: 'cursor_ordering',
  },
  profiles_public_stream_cursor_value_input: {
    id: 'bigint',
    name: 'citext',
  },
  query_root: {
    cosouls: {
      distinct_on: 'cosouls_select_column',
      order_by: 'cosouls_order_by',
      where: 'cosouls_bool_exp',
    },
    cosouls_by_pk: {},
    price_per_share: {},
    profiles_public: {
      distinct_on: 'profiles_public_select_column',
      order_by: 'profiles_public_order_by',
      where: 'profiles_public_bool_exp',
    },
  },
  subscription_root: {
    cosouls: {
      distinct_on: 'cosouls_select_column',
      order_by: 'cosouls_order_by',
      where: 'cosouls_bool_exp',
    },
    cosouls_by_pk: {},
    cosouls_stream: {
      cursor: 'cosouls_stream_cursor_input',
      where: 'cosouls_bool_exp',
    },
    profiles_public: {
      distinct_on: 'profiles_public_select_column',
      order_by: 'profiles_public_order_by',
      where: 'profiles_public_bool_exp',
    },
    profiles_public_stream: {
      cursor: 'profiles_public_stream_cursor_input',
      where: 'profiles_public_bool_exp',
    },
  },
};

export const ReturnTypes: Record<string, any> = {
  cached: {
    ttl: 'Int',
    refresh: 'Boolean',
  },
  cosouls: {
    address: 'citext',
    id: 'Int',
    pgive: 'Int',
    profile_public: 'profiles_public',
    token_id: 'Int',
  },
  profiles_public: {
    address: 'String',
    avatar: 'String',
    id: 'bigint',
    name: 'citext',
  },
  query_root: {
    cosouls: 'cosouls',
    cosouls_by_pk: 'cosouls',
    price_per_share: 'Float',
    profiles_public: 'profiles_public',
  },
  subscription_root: {
    cosouls: 'cosouls',
    cosouls_by_pk: 'cosouls',
    cosouls_stream: 'cosouls',
    profiles_public: 'profiles_public',
    profiles_public_stream: 'profiles_public',
  },
};

export const Ops = {
  query: 'query_root' as const,
  subscription: 'subscription_root' as const,
};
