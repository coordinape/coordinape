/**
 * GQTY AUTO-GENERATED CODE: PLEASE DO NOT MODIFY MANUALLY
 */

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  bigint: any;
  timestamp: any;
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export interface Boolean_comparison_exp {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
}

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export interface Int_comparison_exp {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export interface String_comparison_exp {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
}

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export interface bigint_comparison_exp {
  _eq?: InputMaybe<Scalars['bigint']>;
  _gt?: InputMaybe<Scalars['bigint']>;
  _gte?: InputMaybe<Scalars['bigint']>;
  _in?: InputMaybe<Array<Scalars['bigint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['bigint']>;
  _lte?: InputMaybe<Scalars['bigint']>;
  _neq?: InputMaybe<Scalars['bigint']>;
  _nin?: InputMaybe<Array<Scalars['bigint']>>;
}

/** order by aggregate values of table "circles" */
export interface circles_aggregate_order_by {
  avg?: InputMaybe<circles_avg_order_by>;
  count?: InputMaybe<order_by>;
  max?: InputMaybe<circles_max_order_by>;
  min?: InputMaybe<circles_min_order_by>;
  stddev?: InputMaybe<circles_stddev_order_by>;
  stddev_pop?: InputMaybe<circles_stddev_pop_order_by>;
  stddev_samp?: InputMaybe<circles_stddev_samp_order_by>;
  sum?: InputMaybe<circles_sum_order_by>;
  var_pop?: InputMaybe<circles_var_pop_order_by>;
  var_samp?: InputMaybe<circles_var_samp_order_by>;
  variance?: InputMaybe<circles_variance_order_by>;
}

/** input type for inserting array relation for remote table "circles" */
export interface circles_arr_rel_insert_input {
  data: Array<circles_insert_input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<circles_on_conflict>;
}

/** order by avg() on columns of table "circles" */
export interface circles_avg_order_by {
  id?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  protocol_id?: InputMaybe<order_by>;
}

/** Boolean expression to filter rows from the table "circles". All fields are combined with a logical 'AND'. */
export interface circles_bool_exp {
  _and?: InputMaybe<Array<circles_bool_exp>>;
  _not?: InputMaybe<circles_bool_exp>;
  _or?: InputMaybe<Array<circles_bool_exp>>;
  alloc_text?: InputMaybe<String_comparison_exp>;
  auto_opt_out?: InputMaybe<Boolean_comparison_exp>;
  created_at?: InputMaybe<timestamp_comparison_exp>;
  default_opt_in?: InputMaybe<Boolean_comparison_exp>;
  discord_webhook?: InputMaybe<String_comparison_exp>;
  id?: InputMaybe<bigint_comparison_exp>;
  is_verified?: InputMaybe<Boolean_comparison_exp>;
  logo?: InputMaybe<String_comparison_exp>;
  min_vouches?: InputMaybe<Int_comparison_exp>;
  name?: InputMaybe<String_comparison_exp>;
  nomination_days_limit?: InputMaybe<Int_comparison_exp>;
  only_giver_vouch?: InputMaybe<Boolean_comparison_exp>;
  organization?: InputMaybe<organizations_bool_exp>;
  protocol_id?: InputMaybe<Int_comparison_exp>;
  team_sel_text?: InputMaybe<String_comparison_exp>;
  team_selection?: InputMaybe<Boolean_comparison_exp>;
  telegram_id?: InputMaybe<String_comparison_exp>;
  token_name?: InputMaybe<String_comparison_exp>;
  updated_at?: InputMaybe<timestamp_comparison_exp>;
  users?: InputMaybe<users_bool_exp>;
  vouching?: InputMaybe<Boolean_comparison_exp>;
  vouching_text?: InputMaybe<String_comparison_exp>;
}

/** unique or primary key constraints on table "circles" */
export enum circles_constraint {
  /** unique or primary key constraint */
  circles_pkey = 'circles_pkey',
}

/** input type for incrementing numeric columns in table "circles" */
export interface circles_inc_input {
  id?: InputMaybe<Scalars['bigint']>;
  min_vouches?: InputMaybe<Scalars['Int']>;
  nomination_days_limit?: InputMaybe<Scalars['Int']>;
  protocol_id?: InputMaybe<Scalars['Int']>;
}

/** input type for inserting data into table "circles" */
export interface circles_insert_input {
  alloc_text?: InputMaybe<Scalars['String']>;
  auto_opt_out?: InputMaybe<Scalars['Boolean']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  default_opt_in?: InputMaybe<Scalars['Boolean']>;
  discord_webhook?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['bigint']>;
  is_verified?: InputMaybe<Scalars['Boolean']>;
  logo?: InputMaybe<Scalars['String']>;
  min_vouches?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  nomination_days_limit?: InputMaybe<Scalars['Int']>;
  only_giver_vouch?: InputMaybe<Scalars['Boolean']>;
  organization?: InputMaybe<organizations_obj_rel_insert_input>;
  protocol_id?: InputMaybe<Scalars['Int']>;
  team_sel_text?: InputMaybe<Scalars['String']>;
  team_selection?: InputMaybe<Scalars['Boolean']>;
  telegram_id?: InputMaybe<Scalars['String']>;
  token_name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  users?: InputMaybe<users_arr_rel_insert_input>;
  vouching?: InputMaybe<Scalars['Boolean']>;
  vouching_text?: InputMaybe<Scalars['String']>;
}

/** order by max() on columns of table "circles" */
export interface circles_max_order_by {
  alloc_text?: InputMaybe<order_by>;
  created_at?: InputMaybe<order_by>;
  discord_webhook?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  logo?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  name?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  protocol_id?: InputMaybe<order_by>;
  team_sel_text?: InputMaybe<order_by>;
  telegram_id?: InputMaybe<order_by>;
  token_name?: InputMaybe<order_by>;
  updated_at?: InputMaybe<order_by>;
  vouching_text?: InputMaybe<order_by>;
}

/** order by min() on columns of table "circles" */
export interface circles_min_order_by {
  alloc_text?: InputMaybe<order_by>;
  created_at?: InputMaybe<order_by>;
  discord_webhook?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  logo?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  name?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  protocol_id?: InputMaybe<order_by>;
  team_sel_text?: InputMaybe<order_by>;
  telegram_id?: InputMaybe<order_by>;
  token_name?: InputMaybe<order_by>;
  updated_at?: InputMaybe<order_by>;
  vouching_text?: InputMaybe<order_by>;
}

/** input type for inserting object relation for remote table "circles" */
export interface circles_obj_rel_insert_input {
  data: circles_insert_input;
  /** on conflict condition */
  on_conflict?: InputMaybe<circles_on_conflict>;
}

/** on conflict condition type for table "circles" */
export interface circles_on_conflict {
  constraint: circles_constraint;
  update_columns?: Array<circles_update_column>;
  where?: InputMaybe<circles_bool_exp>;
}

/** Ordering options when selecting data from "circles". */
export interface circles_order_by {
  alloc_text?: InputMaybe<order_by>;
  auto_opt_out?: InputMaybe<order_by>;
  created_at?: InputMaybe<order_by>;
  default_opt_in?: InputMaybe<order_by>;
  discord_webhook?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  is_verified?: InputMaybe<order_by>;
  logo?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  name?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  only_giver_vouch?: InputMaybe<order_by>;
  organization?: InputMaybe<organizations_order_by>;
  protocol_id?: InputMaybe<order_by>;
  team_sel_text?: InputMaybe<order_by>;
  team_selection?: InputMaybe<order_by>;
  telegram_id?: InputMaybe<order_by>;
  token_name?: InputMaybe<order_by>;
  updated_at?: InputMaybe<order_by>;
  users_aggregate?: InputMaybe<users_aggregate_order_by>;
  vouching?: InputMaybe<order_by>;
  vouching_text?: InputMaybe<order_by>;
}

/** primary key columns input for table: circles */
export interface circles_pk_columns_input {
  id: Scalars['bigint'];
}

/** select columns of table "circles" */
export enum circles_select_column {
  /** column name */
  alloc_text = 'alloc_text',
  /** column name */
  auto_opt_out = 'auto_opt_out',
  /** column name */
  created_at = 'created_at',
  /** column name */
  default_opt_in = 'default_opt_in',
  /** column name */
  discord_webhook = 'discord_webhook',
  /** column name */
  id = 'id',
  /** column name */
  is_verified = 'is_verified',
  /** column name */
  logo = 'logo',
  /** column name */
  min_vouches = 'min_vouches',
  /** column name */
  name = 'name',
  /** column name */
  nomination_days_limit = 'nomination_days_limit',
  /** column name */
  only_giver_vouch = 'only_giver_vouch',
  /** column name */
  protocol_id = 'protocol_id',
  /** column name */
  team_sel_text = 'team_sel_text',
  /** column name */
  team_selection = 'team_selection',
  /** column name */
  telegram_id = 'telegram_id',
  /** column name */
  token_name = 'token_name',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  vouching = 'vouching',
  /** column name */
  vouching_text = 'vouching_text',
}

/** input type for updating data in table "circles" */
export interface circles_set_input {
  alloc_text?: InputMaybe<Scalars['String']>;
  auto_opt_out?: InputMaybe<Scalars['Boolean']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  default_opt_in?: InputMaybe<Scalars['Boolean']>;
  discord_webhook?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['bigint']>;
  is_verified?: InputMaybe<Scalars['Boolean']>;
  logo?: InputMaybe<Scalars['String']>;
  min_vouches?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  nomination_days_limit?: InputMaybe<Scalars['Int']>;
  only_giver_vouch?: InputMaybe<Scalars['Boolean']>;
  protocol_id?: InputMaybe<Scalars['Int']>;
  team_sel_text?: InputMaybe<Scalars['String']>;
  team_selection?: InputMaybe<Scalars['Boolean']>;
  telegram_id?: InputMaybe<Scalars['String']>;
  token_name?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  vouching?: InputMaybe<Scalars['Boolean']>;
  vouching_text?: InputMaybe<Scalars['String']>;
}

/** order by stddev() on columns of table "circles" */
export interface circles_stddev_order_by {
  id?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  protocol_id?: InputMaybe<order_by>;
}

/** order by stddev_pop() on columns of table "circles" */
export interface circles_stddev_pop_order_by {
  id?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  protocol_id?: InputMaybe<order_by>;
}

/** order by stddev_samp() on columns of table "circles" */
export interface circles_stddev_samp_order_by {
  id?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  protocol_id?: InputMaybe<order_by>;
}

/** order by sum() on columns of table "circles" */
export interface circles_sum_order_by {
  id?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  protocol_id?: InputMaybe<order_by>;
}

/** update columns of table "circles" */
export enum circles_update_column {
  /** column name */
  alloc_text = 'alloc_text',
  /** column name */
  auto_opt_out = 'auto_opt_out',
  /** column name */
  created_at = 'created_at',
  /** column name */
  default_opt_in = 'default_opt_in',
  /** column name */
  discord_webhook = 'discord_webhook',
  /** column name */
  id = 'id',
  /** column name */
  is_verified = 'is_verified',
  /** column name */
  logo = 'logo',
  /** column name */
  min_vouches = 'min_vouches',
  /** column name */
  name = 'name',
  /** column name */
  nomination_days_limit = 'nomination_days_limit',
  /** column name */
  only_giver_vouch = 'only_giver_vouch',
  /** column name */
  protocol_id = 'protocol_id',
  /** column name */
  team_sel_text = 'team_sel_text',
  /** column name */
  team_selection = 'team_selection',
  /** column name */
  telegram_id = 'telegram_id',
  /** column name */
  token_name = 'token_name',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  vouching = 'vouching',
  /** column name */
  vouching_text = 'vouching_text',
}

/** order by var_pop() on columns of table "circles" */
export interface circles_var_pop_order_by {
  id?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  protocol_id?: InputMaybe<order_by>;
}

/** order by var_samp() on columns of table "circles" */
export interface circles_var_samp_order_by {
  id?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  protocol_id?: InputMaybe<order_by>;
}

/** order by variance() on columns of table "circles" */
export interface circles_variance_order_by {
  id?: InputMaybe<order_by>;
  min_vouches?: InputMaybe<order_by>;
  nomination_days_limit?: InputMaybe<order_by>;
  protocol_id?: InputMaybe<order_by>;
}

/** column ordering options */
export enum order_by {
  /** in ascending order, nulls last */
  asc = 'asc',
  /** in ascending order, nulls first */
  asc_nulls_first = 'asc_nulls_first',
  /** in ascending order, nulls last */
  asc_nulls_last = 'asc_nulls_last',
  /** in descending order, nulls first */
  desc = 'desc',
  /** in descending order, nulls first */
  desc_nulls_first = 'desc_nulls_first',
  /** in descending order, nulls last */
  desc_nulls_last = 'desc_nulls_last',
}

/** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
export interface organizations_bool_exp {
  _and?: InputMaybe<Array<organizations_bool_exp>>;
  _not?: InputMaybe<organizations_bool_exp>;
  _or?: InputMaybe<Array<organizations_bool_exp>>;
  circles?: InputMaybe<circles_bool_exp>;
  created_at?: InputMaybe<timestamp_comparison_exp>;
  id?: InputMaybe<bigint_comparison_exp>;
  is_verified?: InputMaybe<Boolean_comparison_exp>;
  name?: InputMaybe<String_comparison_exp>;
  telegram_id?: InputMaybe<String_comparison_exp>;
  updated_at?: InputMaybe<timestamp_comparison_exp>;
}

/** unique or primary key constraints on table "protocols" */
export enum organizations_constraint {
  /** unique or primary key constraint */
  protocols_pkey = 'protocols_pkey',
}

/** input type for incrementing numeric columns in table "protocols" */
export interface organizations_inc_input {
  id?: InputMaybe<Scalars['bigint']>;
}

/** input type for inserting data into table "protocols" */
export interface organizations_insert_input {
  circles?: InputMaybe<circles_arr_rel_insert_input>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['bigint']>;
  is_verified?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  telegram_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
}

/** input type for inserting object relation for remote table "protocols" */
export interface organizations_obj_rel_insert_input {
  data: organizations_insert_input;
  /** on conflict condition */
  on_conflict?: InputMaybe<organizations_on_conflict>;
}

/** on conflict condition type for table "protocols" */
export interface organizations_on_conflict {
  constraint: organizations_constraint;
  update_columns?: Array<organizations_update_column>;
  where?: InputMaybe<organizations_bool_exp>;
}

/** Ordering options when selecting data from "protocols". */
export interface organizations_order_by {
  circles_aggregate?: InputMaybe<circles_aggregate_order_by>;
  created_at?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  is_verified?: InputMaybe<order_by>;
  name?: InputMaybe<order_by>;
  telegram_id?: InputMaybe<order_by>;
  updated_at?: InputMaybe<order_by>;
}

/** primary key columns input for table: organizations */
export interface organizations_pk_columns_input {
  id: Scalars['bigint'];
}

/** select columns of table "protocols" */
export enum organizations_select_column {
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  is_verified = 'is_verified',
  /** column name */
  name = 'name',
  /** column name */
  telegram_id = 'telegram_id',
  /** column name */
  updated_at = 'updated_at',
}

/** input type for updating data in table "protocols" */
export interface organizations_set_input {
  created_at?: InputMaybe<Scalars['timestamp']>;
  id?: InputMaybe<Scalars['bigint']>;
  is_verified?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  telegram_id?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
}

/** update columns of table "protocols" */
export enum organizations_update_column {
  /** column name */
  created_at = 'created_at',
  /** column name */
  id = 'id',
  /** column name */
  is_verified = 'is_verified',
  /** column name */
  name = 'name',
  /** column name */
  telegram_id = 'telegram_id',
  /** column name */
  updated_at = 'updated_at',
}

/** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
export interface profiles_bool_exp {
  _and?: InputMaybe<Array<profiles_bool_exp>>;
  _not?: InputMaybe<profiles_bool_exp>;
  _or?: InputMaybe<Array<profiles_bool_exp>>;
  address?: InputMaybe<String_comparison_exp>;
  admin_view?: InputMaybe<Boolean_comparison_exp>;
  ann_power?: InputMaybe<Boolean_comparison_exp>;
  avatar?: InputMaybe<String_comparison_exp>;
  background?: InputMaybe<String_comparison_exp>;
  bio?: InputMaybe<String_comparison_exp>;
  chat_id?: InputMaybe<String_comparison_exp>;
  created_at?: InputMaybe<timestamp_comparison_exp>;
  discord_username?: InputMaybe<String_comparison_exp>;
  github_username?: InputMaybe<String_comparison_exp>;
  id?: InputMaybe<bigint_comparison_exp>;
  medium_username?: InputMaybe<String_comparison_exp>;
  skills?: InputMaybe<String_comparison_exp>;
  telegram_username?: InputMaybe<String_comparison_exp>;
  twitter_username?: InputMaybe<String_comparison_exp>;
  updated_at?: InputMaybe<timestamp_comparison_exp>;
  users?: InputMaybe<users_bool_exp>;
  website?: InputMaybe<String_comparison_exp>;
}

/** unique or primary key constraints on table "profiles" */
export enum profiles_constraint {
  /** unique or primary key constraint */
  profiles_address_key = 'profiles_address_key',
  /** unique or primary key constraint */
  profiles_pkey = 'profiles_pkey',
}

/** input type for incrementing numeric columns in table "profiles" */
export interface profiles_inc_input {
  id?: InputMaybe<Scalars['bigint']>;
}

/** input type for inserting data into table "profiles" */
export interface profiles_insert_input {
  address?: InputMaybe<Scalars['String']>;
  admin_view?: InputMaybe<Scalars['Boolean']>;
  ann_power?: InputMaybe<Scalars['Boolean']>;
  avatar?: InputMaybe<Scalars['String']>;
  background?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  chat_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  discord_username?: InputMaybe<Scalars['String']>;
  github_username?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['bigint']>;
  medium_username?: InputMaybe<Scalars['String']>;
  skills?: InputMaybe<Scalars['String']>;
  telegram_username?: InputMaybe<Scalars['String']>;
  twitter_username?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  users?: InputMaybe<users_arr_rel_insert_input>;
  website?: InputMaybe<Scalars['String']>;
}

/** input type for inserting object relation for remote table "profiles" */
export interface profiles_obj_rel_insert_input {
  data: profiles_insert_input;
  /** on conflict condition */
  on_conflict?: InputMaybe<profiles_on_conflict>;
}

/** on conflict condition type for table "profiles" */
export interface profiles_on_conflict {
  constraint: profiles_constraint;
  update_columns?: Array<profiles_update_column>;
  where?: InputMaybe<profiles_bool_exp>;
}

/** Ordering options when selecting data from "profiles". */
export interface profiles_order_by {
  address?: InputMaybe<order_by>;
  admin_view?: InputMaybe<order_by>;
  ann_power?: InputMaybe<order_by>;
  avatar?: InputMaybe<order_by>;
  background?: InputMaybe<order_by>;
  bio?: InputMaybe<order_by>;
  chat_id?: InputMaybe<order_by>;
  created_at?: InputMaybe<order_by>;
  discord_username?: InputMaybe<order_by>;
  github_username?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  medium_username?: InputMaybe<order_by>;
  skills?: InputMaybe<order_by>;
  telegram_username?: InputMaybe<order_by>;
  twitter_username?: InputMaybe<order_by>;
  updated_at?: InputMaybe<order_by>;
  users_aggregate?: InputMaybe<users_aggregate_order_by>;
  website?: InputMaybe<order_by>;
}

/** primary key columns input for table: profiles */
export interface profiles_pk_columns_input {
  id: Scalars['bigint'];
}

/** select columns of table "profiles" */
export enum profiles_select_column {
  /** column name */
  address = 'address',
  /** column name */
  admin_view = 'admin_view',
  /** column name */
  ann_power = 'ann_power',
  /** column name */
  avatar = 'avatar',
  /** column name */
  background = 'background',
  /** column name */
  bio = 'bio',
  /** column name */
  chat_id = 'chat_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  discord_username = 'discord_username',
  /** column name */
  github_username = 'github_username',
  /** column name */
  id = 'id',
  /** column name */
  medium_username = 'medium_username',
  /** column name */
  skills = 'skills',
  /** column name */
  telegram_username = 'telegram_username',
  /** column name */
  twitter_username = 'twitter_username',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  website = 'website',
}

/** input type for updating data in table "profiles" */
export interface profiles_set_input {
  address?: InputMaybe<Scalars['String']>;
  admin_view?: InputMaybe<Scalars['Boolean']>;
  ann_power?: InputMaybe<Scalars['Boolean']>;
  avatar?: InputMaybe<Scalars['String']>;
  background?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  chat_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  discord_username?: InputMaybe<Scalars['String']>;
  github_username?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['bigint']>;
  medium_username?: InputMaybe<Scalars['String']>;
  skills?: InputMaybe<Scalars['String']>;
  telegram_username?: InputMaybe<Scalars['String']>;
  twitter_username?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
  website?: InputMaybe<Scalars['String']>;
}

/** update columns of table "profiles" */
export enum profiles_update_column {
  /** column name */
  address = 'address',
  /** column name */
  admin_view = 'admin_view',
  /** column name */
  ann_power = 'ann_power',
  /** column name */
  avatar = 'avatar',
  /** column name */
  background = 'background',
  /** column name */
  bio = 'bio',
  /** column name */
  chat_id = 'chat_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  discord_username = 'discord_username',
  /** column name */
  github_username = 'github_username',
  /** column name */
  id = 'id',
  /** column name */
  medium_username = 'medium_username',
  /** column name */
  skills = 'skills',
  /** column name */
  telegram_username = 'telegram_username',
  /** column name */
  twitter_username = 'twitter_username',
  /** column name */
  updated_at = 'updated_at',
  /** column name */
  website = 'website',
}

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export interface timestamp_comparison_exp {
  _eq?: InputMaybe<Scalars['timestamp']>;
  _gt?: InputMaybe<Scalars['timestamp']>;
  _gte?: InputMaybe<Scalars['timestamp']>;
  _in?: InputMaybe<Array<Scalars['timestamp']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamp']>;
  _lte?: InputMaybe<Scalars['timestamp']>;
  _neq?: InputMaybe<Scalars['timestamp']>;
  _nin?: InputMaybe<Array<Scalars['timestamp']>>;
}

/** order by aggregate values of table "users" */
export interface users_aggregate_order_by {
  avg?: InputMaybe<users_avg_order_by>;
  count?: InputMaybe<order_by>;
  max?: InputMaybe<users_max_order_by>;
  min?: InputMaybe<users_min_order_by>;
  stddev?: InputMaybe<users_stddev_order_by>;
  stddev_pop?: InputMaybe<users_stddev_pop_order_by>;
  stddev_samp?: InputMaybe<users_stddev_samp_order_by>;
  sum?: InputMaybe<users_sum_order_by>;
  var_pop?: InputMaybe<users_var_pop_order_by>;
  var_samp?: InputMaybe<users_var_samp_order_by>;
  variance?: InputMaybe<users_variance_order_by>;
}

/** input type for inserting array relation for remote table "users" */
export interface users_arr_rel_insert_input {
  data: Array<users_insert_input>;
  /** on conflict condition */
  on_conflict?: InputMaybe<users_on_conflict>;
}

/** order by avg() on columns of table "users" */
export interface users_avg_order_by {
  circle_id?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
}

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export interface users_bool_exp {
  _and?: InputMaybe<Array<users_bool_exp>>;
  _not?: InputMaybe<users_bool_exp>;
  _or?: InputMaybe<Array<users_bool_exp>>;
  address?: InputMaybe<String_comparison_exp>;
  bio?: InputMaybe<String_comparison_exp>;
  circle?: InputMaybe<circles_bool_exp>;
  circle_id?: InputMaybe<bigint_comparison_exp>;
  created_at?: InputMaybe<timestamp_comparison_exp>;
  deleted_at?: InputMaybe<timestamp_comparison_exp>;
  epoch_first_visit?: InputMaybe<Boolean_comparison_exp>;
  fixed_non_receiver?: InputMaybe<Boolean_comparison_exp>;
  give_token_received?: InputMaybe<Int_comparison_exp>;
  give_token_remaining?: InputMaybe<Int_comparison_exp>;
  id?: InputMaybe<bigint_comparison_exp>;
  name?: InputMaybe<String_comparison_exp>;
  non_giver?: InputMaybe<Boolean_comparison_exp>;
  non_receiver?: InputMaybe<Boolean_comparison_exp>;
  profile?: InputMaybe<profiles_bool_exp>;
  role?: InputMaybe<Int_comparison_exp>;
  starting_tokens?: InputMaybe<Int_comparison_exp>;
  updated_at?: InputMaybe<timestamp_comparison_exp>;
}

/** unique or primary key constraints on table "users" */
export enum users_constraint {
  /** unique or primary key constraint */
  users_pkey = 'users_pkey',
}

/** input type for incrementing numeric columns in table "users" */
export interface users_inc_input {
  circle_id?: InputMaybe<Scalars['bigint']>;
  give_token_received?: InputMaybe<Scalars['Int']>;
  give_token_remaining?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['bigint']>;
  role?: InputMaybe<Scalars['Int']>;
  starting_tokens?: InputMaybe<Scalars['Int']>;
}

/** input type for inserting data into table "users" */
export interface users_insert_input {
  address?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  circle?: InputMaybe<circles_obj_rel_insert_input>;
  circle_id?: InputMaybe<Scalars['bigint']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  deleted_at?: InputMaybe<Scalars['timestamp']>;
  epoch_first_visit?: InputMaybe<Scalars['Boolean']>;
  fixed_non_receiver?: InputMaybe<Scalars['Boolean']>;
  give_token_received?: InputMaybe<Scalars['Int']>;
  give_token_remaining?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['bigint']>;
  name?: InputMaybe<Scalars['String']>;
  non_giver?: InputMaybe<Scalars['Boolean']>;
  non_receiver?: InputMaybe<Scalars['Boolean']>;
  profile?: InputMaybe<profiles_obj_rel_insert_input>;
  role?: InputMaybe<Scalars['Int']>;
  starting_tokens?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
}

/** order by max() on columns of table "users" */
export interface users_max_order_by {
  address?: InputMaybe<order_by>;
  bio?: InputMaybe<order_by>;
  circle_id?: InputMaybe<order_by>;
  created_at?: InputMaybe<order_by>;
  deleted_at?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  name?: InputMaybe<order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
  updated_at?: InputMaybe<order_by>;
}

/** order by min() on columns of table "users" */
export interface users_min_order_by {
  address?: InputMaybe<order_by>;
  bio?: InputMaybe<order_by>;
  circle_id?: InputMaybe<order_by>;
  created_at?: InputMaybe<order_by>;
  deleted_at?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  name?: InputMaybe<order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
  updated_at?: InputMaybe<order_by>;
}

/** on conflict condition type for table "users" */
export interface users_on_conflict {
  constraint: users_constraint;
  update_columns?: Array<users_update_column>;
  where?: InputMaybe<users_bool_exp>;
}

/** Ordering options when selecting data from "users". */
export interface users_order_by {
  address?: InputMaybe<order_by>;
  bio?: InputMaybe<order_by>;
  circle?: InputMaybe<circles_order_by>;
  circle_id?: InputMaybe<order_by>;
  created_at?: InputMaybe<order_by>;
  deleted_at?: InputMaybe<order_by>;
  epoch_first_visit?: InputMaybe<order_by>;
  fixed_non_receiver?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  name?: InputMaybe<order_by>;
  non_giver?: InputMaybe<order_by>;
  non_receiver?: InputMaybe<order_by>;
  profile?: InputMaybe<profiles_order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
  updated_at?: InputMaybe<order_by>;
}

/** primary key columns input for table: users */
export interface users_pk_columns_input {
  id: Scalars['bigint'];
}

/** select columns of table "users" */
export enum users_select_column {
  /** column name */
  address = 'address',
  /** column name */
  bio = 'bio',
  /** column name */
  circle_id = 'circle_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  deleted_at = 'deleted_at',
  /** column name */
  epoch_first_visit = 'epoch_first_visit',
  /** column name */
  fixed_non_receiver = 'fixed_non_receiver',
  /** column name */
  give_token_received = 'give_token_received',
  /** column name */
  give_token_remaining = 'give_token_remaining',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  non_giver = 'non_giver',
  /** column name */
  non_receiver = 'non_receiver',
  /** column name */
  role = 'role',
  /** column name */
  starting_tokens = 'starting_tokens',
  /** column name */
  updated_at = 'updated_at',
}

/** input type for updating data in table "users" */
export interface users_set_input {
  address?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['String']>;
  circle_id?: InputMaybe<Scalars['bigint']>;
  created_at?: InputMaybe<Scalars['timestamp']>;
  deleted_at?: InputMaybe<Scalars['timestamp']>;
  epoch_first_visit?: InputMaybe<Scalars['Boolean']>;
  fixed_non_receiver?: InputMaybe<Scalars['Boolean']>;
  give_token_received?: InputMaybe<Scalars['Int']>;
  give_token_remaining?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['bigint']>;
  name?: InputMaybe<Scalars['String']>;
  non_giver?: InputMaybe<Scalars['Boolean']>;
  non_receiver?: InputMaybe<Scalars['Boolean']>;
  role?: InputMaybe<Scalars['Int']>;
  starting_tokens?: InputMaybe<Scalars['Int']>;
  updated_at?: InputMaybe<Scalars['timestamp']>;
}

/** order by stddev() on columns of table "users" */
export interface users_stddev_order_by {
  circle_id?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
}

/** order by stddev_pop() on columns of table "users" */
export interface users_stddev_pop_order_by {
  circle_id?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
}

/** order by stddev_samp() on columns of table "users" */
export interface users_stddev_samp_order_by {
  circle_id?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
}

/** order by sum() on columns of table "users" */
export interface users_sum_order_by {
  circle_id?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
}

/** update columns of table "users" */
export enum users_update_column {
  /** column name */
  address = 'address',
  /** column name */
  bio = 'bio',
  /** column name */
  circle_id = 'circle_id',
  /** column name */
  created_at = 'created_at',
  /** column name */
  deleted_at = 'deleted_at',
  /** column name */
  epoch_first_visit = 'epoch_first_visit',
  /** column name */
  fixed_non_receiver = 'fixed_non_receiver',
  /** column name */
  give_token_received = 'give_token_received',
  /** column name */
  give_token_remaining = 'give_token_remaining',
  /** column name */
  id = 'id',
  /** column name */
  name = 'name',
  /** column name */
  non_giver = 'non_giver',
  /** column name */
  non_receiver = 'non_receiver',
  /** column name */
  role = 'role',
  /** column name */
  starting_tokens = 'starting_tokens',
  /** column name */
  updated_at = 'updated_at',
}

/** order by var_pop() on columns of table "users" */
export interface users_var_pop_order_by {
  circle_id?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
}

/** order by var_samp() on columns of table "users" */
export interface users_var_samp_order_by {
  circle_id?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
}

/** order by variance() on columns of table "users" */
export interface users_variance_order_by {
  circle_id?: InputMaybe<order_by>;
  give_token_received?: InputMaybe<order_by>;
  give_token_remaining?: InputMaybe<order_by>;
  id?: InputMaybe<order_by>;
  role?: InputMaybe<order_by>;
  starting_tokens?: InputMaybe<order_by>;
}

export const scalarsEnumsHash: import('gqty').ScalarsEnumsHash = {
  Boolean: true,
  Float: true,
  Int: true,
  String: true,
  bigint: true,
  circles_constraint: true,
  circles_select_column: true,
  circles_update_column: true,
  order_by: true,
  organizations_constraint: true,
  organizations_select_column: true,
  organizations_update_column: true,
  profiles_constraint: true,
  profiles_select_column: true,
  profiles_update_column: true,
  timestamp: true,
  users_constraint: true,
  users_select_column: true,
  users_update_column: true,
};
export const generatedSchema = {
  Boolean_comparison_exp: {
    _eq: { __type: 'Boolean' },
    _gt: { __type: 'Boolean' },
    _gte: { __type: 'Boolean' },
    _in: { __type: '[Boolean!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'Boolean' },
    _lte: { __type: 'Boolean' },
    _neq: { __type: 'Boolean' },
    _nin: { __type: '[Boolean!]' },
  },
  Int_comparison_exp: {
    _eq: { __type: 'Int' },
    _gt: { __type: 'Int' },
    _gte: { __type: 'Int' },
    _in: { __type: '[Int!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'Int' },
    _lte: { __type: 'Int' },
    _neq: { __type: 'Int' },
    _nin: { __type: '[Int!]' },
  },
  String_comparison_exp: {
    _eq: { __type: 'String' },
    _gt: { __type: 'String' },
    _gte: { __type: 'String' },
    _ilike: { __type: 'String' },
    _in: { __type: '[String!]' },
    _iregex: { __type: 'String' },
    _is_null: { __type: 'Boolean' },
    _like: { __type: 'String' },
    _lt: { __type: 'String' },
    _lte: { __type: 'String' },
    _neq: { __type: 'String' },
    _nilike: { __type: 'String' },
    _nin: { __type: '[String!]' },
    _niregex: { __type: 'String' },
    _nlike: { __type: 'String' },
    _nregex: { __type: 'String' },
    _nsimilar: { __type: 'String' },
    _regex: { __type: 'String' },
    _similar: { __type: 'String' },
  },
  bigint_comparison_exp: {
    _eq: { __type: 'bigint' },
    _gt: { __type: 'bigint' },
    _gte: { __type: 'bigint' },
    _in: { __type: '[bigint!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'bigint' },
    _lte: { __type: 'bigint' },
    _neq: { __type: 'bigint' },
    _nin: { __type: '[bigint!]' },
  },
  circles: {
    __typename: { __type: 'String!' },
    alloc_text: { __type: 'String' },
    auto_opt_out: { __type: 'Boolean!' },
    created_at: { __type: 'timestamp' },
    default_opt_in: { __type: 'Boolean!' },
    discord_webhook: { __type: 'String' },
    id: { __type: 'bigint!' },
    is_verified: { __type: 'Boolean!' },
    logo: { __type: 'String' },
    min_vouches: { __type: 'Int!' },
    name: { __type: 'String!' },
    nomination_days_limit: { __type: 'Int!' },
    only_giver_vouch: { __type: 'Boolean!' },
    organization: { __type: 'organizations' },
    protocol_id: { __type: 'Int' },
    team_sel_text: { __type: 'String' },
    team_selection: { __type: 'Boolean!' },
    telegram_id: { __type: 'String' },
    token_name: { __type: 'String!' },
    updated_at: { __type: 'timestamp' },
    users: {
      __type: '[users!]!',
      __args: {
        distinct_on: '[users_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[users_order_by!]',
        where: 'users_bool_exp',
      },
    },
    users_aggregate: {
      __type: 'users_aggregate!',
      __args: {
        distinct_on: '[users_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[users_order_by!]',
        where: 'users_bool_exp',
      },
    },
    vouching: { __type: 'Boolean!' },
    vouching_text: { __type: 'String' },
  },
  circles_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'circles_aggregate_fields' },
    nodes: { __type: '[circles!]!' },
  },
  circles_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'circles_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[circles_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'circles_max_fields' },
    min: { __type: 'circles_min_fields' },
    stddev: { __type: 'circles_stddev_fields' },
    stddev_pop: { __type: 'circles_stddev_pop_fields' },
    stddev_samp: { __type: 'circles_stddev_samp_fields' },
    sum: { __type: 'circles_sum_fields' },
    var_pop: { __type: 'circles_var_pop_fields' },
    var_samp: { __type: 'circles_var_samp_fields' },
    variance: { __type: 'circles_variance_fields' },
  },
  circles_aggregate_order_by: {
    avg: { __type: 'circles_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'circles_max_order_by' },
    min: { __type: 'circles_min_order_by' },
    stddev: { __type: 'circles_stddev_order_by' },
    stddev_pop: { __type: 'circles_stddev_pop_order_by' },
    stddev_samp: { __type: 'circles_stddev_samp_order_by' },
    sum: { __type: 'circles_sum_order_by' },
    var_pop: { __type: 'circles_var_pop_order_by' },
    var_samp: { __type: 'circles_var_samp_order_by' },
    variance: { __type: 'circles_variance_order_by' },
  },
  circles_arr_rel_insert_input: {
    data: { __type: '[circles_insert_input!]!' },
    on_conflict: { __type: 'circles_on_conflict' },
  },
  circles_avg_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
    min_vouches: { __type: 'Float' },
    nomination_days_limit: { __type: 'Float' },
    protocol_id: { __type: 'Float' },
  },
  circles_avg_order_by: {
    id: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    protocol_id: { __type: 'order_by' },
  },
  circles_bool_exp: {
    _and: { __type: '[circles_bool_exp!]' },
    _not: { __type: 'circles_bool_exp' },
    _or: { __type: '[circles_bool_exp!]' },
    alloc_text: { __type: 'String_comparison_exp' },
    auto_opt_out: { __type: 'Boolean_comparison_exp' },
    created_at: { __type: 'timestamp_comparison_exp' },
    default_opt_in: { __type: 'Boolean_comparison_exp' },
    discord_webhook: { __type: 'String_comparison_exp' },
    id: { __type: 'bigint_comparison_exp' },
    is_verified: { __type: 'Boolean_comparison_exp' },
    logo: { __type: 'String_comparison_exp' },
    min_vouches: { __type: 'Int_comparison_exp' },
    name: { __type: 'String_comparison_exp' },
    nomination_days_limit: { __type: 'Int_comparison_exp' },
    only_giver_vouch: { __type: 'Boolean_comparison_exp' },
    organization: { __type: 'organizations_bool_exp' },
    protocol_id: { __type: 'Int_comparison_exp' },
    team_sel_text: { __type: 'String_comparison_exp' },
    team_selection: { __type: 'Boolean_comparison_exp' },
    telegram_id: { __type: 'String_comparison_exp' },
    token_name: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamp_comparison_exp' },
    users: { __type: 'users_bool_exp' },
    vouching: { __type: 'Boolean_comparison_exp' },
    vouching_text: { __type: 'String_comparison_exp' },
  },
  circles_inc_input: {
    id: { __type: 'bigint' },
    min_vouches: { __type: 'Int' },
    nomination_days_limit: { __type: 'Int' },
    protocol_id: { __type: 'Int' },
  },
  circles_insert_input: {
    alloc_text: { __type: 'String' },
    auto_opt_out: { __type: 'Boolean' },
    created_at: { __type: 'timestamp' },
    default_opt_in: { __type: 'Boolean' },
    discord_webhook: { __type: 'String' },
    id: { __type: 'bigint' },
    is_verified: { __type: 'Boolean' },
    logo: { __type: 'String' },
    min_vouches: { __type: 'Int' },
    name: { __type: 'String' },
    nomination_days_limit: { __type: 'Int' },
    only_giver_vouch: { __type: 'Boolean' },
    organization: { __type: 'organizations_obj_rel_insert_input' },
    protocol_id: { __type: 'Int' },
    team_sel_text: { __type: 'String' },
    team_selection: { __type: 'Boolean' },
    telegram_id: { __type: 'String' },
    token_name: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
    users: { __type: 'users_arr_rel_insert_input' },
    vouching: { __type: 'Boolean' },
    vouching_text: { __type: 'String' },
  },
  circles_max_fields: {
    __typename: { __type: 'String!' },
    alloc_text: { __type: 'String' },
    created_at: { __type: 'timestamp' },
    discord_webhook: { __type: 'String' },
    id: { __type: 'bigint' },
    logo: { __type: 'String' },
    min_vouches: { __type: 'Int' },
    name: { __type: 'String' },
    nomination_days_limit: { __type: 'Int' },
    protocol_id: { __type: 'Int' },
    team_sel_text: { __type: 'String' },
    telegram_id: { __type: 'String' },
    token_name: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
    vouching_text: { __type: 'String' },
  },
  circles_max_order_by: {
    alloc_text: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    discord_webhook: { __type: 'order_by' },
    id: { __type: 'order_by' },
    logo: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    name: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    protocol_id: { __type: 'order_by' },
    team_sel_text: { __type: 'order_by' },
    telegram_id: { __type: 'order_by' },
    token_name: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    vouching_text: { __type: 'order_by' },
  },
  circles_min_fields: {
    __typename: { __type: 'String!' },
    alloc_text: { __type: 'String' },
    created_at: { __type: 'timestamp' },
    discord_webhook: { __type: 'String' },
    id: { __type: 'bigint' },
    logo: { __type: 'String' },
    min_vouches: { __type: 'Int' },
    name: { __type: 'String' },
    nomination_days_limit: { __type: 'Int' },
    protocol_id: { __type: 'Int' },
    team_sel_text: { __type: 'String' },
    telegram_id: { __type: 'String' },
    token_name: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
    vouching_text: { __type: 'String' },
  },
  circles_min_order_by: {
    alloc_text: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    discord_webhook: { __type: 'order_by' },
    id: { __type: 'order_by' },
    logo: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    name: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    protocol_id: { __type: 'order_by' },
    team_sel_text: { __type: 'order_by' },
    telegram_id: { __type: 'order_by' },
    token_name: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    vouching_text: { __type: 'order_by' },
  },
  circles_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[circles!]!' },
  },
  circles_obj_rel_insert_input: {
    data: { __type: 'circles_insert_input!' },
    on_conflict: { __type: 'circles_on_conflict' },
  },
  circles_on_conflict: {
    constraint: { __type: 'circles_constraint!' },
    update_columns: { __type: '[circles_update_column!]!' },
    where: { __type: 'circles_bool_exp' },
  },
  circles_order_by: {
    alloc_text: { __type: 'order_by' },
    auto_opt_out: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    default_opt_in: { __type: 'order_by' },
    discord_webhook: { __type: 'order_by' },
    id: { __type: 'order_by' },
    is_verified: { __type: 'order_by' },
    logo: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    name: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    only_giver_vouch: { __type: 'order_by' },
    organization: { __type: 'organizations_order_by' },
    protocol_id: { __type: 'order_by' },
    team_sel_text: { __type: 'order_by' },
    team_selection: { __type: 'order_by' },
    telegram_id: { __type: 'order_by' },
    token_name: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    users_aggregate: { __type: 'users_aggregate_order_by' },
    vouching: { __type: 'order_by' },
    vouching_text: { __type: 'order_by' },
  },
  circles_pk_columns_input: { id: { __type: 'bigint!' } },
  circles_set_input: {
    alloc_text: { __type: 'String' },
    auto_opt_out: { __type: 'Boolean' },
    created_at: { __type: 'timestamp' },
    default_opt_in: { __type: 'Boolean' },
    discord_webhook: { __type: 'String' },
    id: { __type: 'bigint' },
    is_verified: { __type: 'Boolean' },
    logo: { __type: 'String' },
    min_vouches: { __type: 'Int' },
    name: { __type: 'String' },
    nomination_days_limit: { __type: 'Int' },
    only_giver_vouch: { __type: 'Boolean' },
    protocol_id: { __type: 'Int' },
    team_sel_text: { __type: 'String' },
    team_selection: { __type: 'Boolean' },
    telegram_id: { __type: 'String' },
    token_name: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
    vouching: { __type: 'Boolean' },
    vouching_text: { __type: 'String' },
  },
  circles_stddev_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
    min_vouches: { __type: 'Float' },
    nomination_days_limit: { __type: 'Float' },
    protocol_id: { __type: 'Float' },
  },
  circles_stddev_order_by: {
    id: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    protocol_id: { __type: 'order_by' },
  },
  circles_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
    min_vouches: { __type: 'Float' },
    nomination_days_limit: { __type: 'Float' },
    protocol_id: { __type: 'Float' },
  },
  circles_stddev_pop_order_by: {
    id: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    protocol_id: { __type: 'order_by' },
  },
  circles_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
    min_vouches: { __type: 'Float' },
    nomination_days_limit: { __type: 'Float' },
    protocol_id: { __type: 'Float' },
  },
  circles_stddev_samp_order_by: {
    id: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    protocol_id: { __type: 'order_by' },
  },
  circles_sum_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'bigint' },
    min_vouches: { __type: 'Int' },
    nomination_days_limit: { __type: 'Int' },
    protocol_id: { __type: 'Int' },
  },
  circles_sum_order_by: {
    id: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    protocol_id: { __type: 'order_by' },
  },
  circles_var_pop_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
    min_vouches: { __type: 'Float' },
    nomination_days_limit: { __type: 'Float' },
    protocol_id: { __type: 'Float' },
  },
  circles_var_pop_order_by: {
    id: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    protocol_id: { __type: 'order_by' },
  },
  circles_var_samp_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
    min_vouches: { __type: 'Float' },
    nomination_days_limit: { __type: 'Float' },
    protocol_id: { __type: 'Float' },
  },
  circles_var_samp_order_by: {
    id: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    protocol_id: { __type: 'order_by' },
  },
  circles_variance_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
    min_vouches: { __type: 'Float' },
    nomination_days_limit: { __type: 'Float' },
    protocol_id: { __type: 'Float' },
  },
  circles_variance_order_by: {
    id: { __type: 'order_by' },
    min_vouches: { __type: 'order_by' },
    nomination_days_limit: { __type: 'order_by' },
    protocol_id: { __type: 'order_by' },
  },
  mutation: {
    __typename: { __type: 'String!' },
    delete_circles: {
      __type: 'circles_mutation_response',
      __args: { where: 'circles_bool_exp!' },
    },
    delete_circles_by_pk: { __type: 'circles', __args: { id: 'bigint!' } },
    delete_organizations: {
      __type: 'organizations_mutation_response',
      __args: { where: 'organizations_bool_exp!' },
    },
    delete_organizations_by_pk: {
      __type: 'organizations',
      __args: { id: 'bigint!' },
    },
    delete_profiles: {
      __type: 'profiles_mutation_response',
      __args: { where: 'profiles_bool_exp!' },
    },
    delete_profiles_by_pk: { __type: 'profiles', __args: { id: 'bigint!' } },
    delete_users: {
      __type: 'users_mutation_response',
      __args: { where: 'users_bool_exp!' },
    },
    delete_users_by_pk: { __type: 'users', __args: { id: 'bigint!' } },
    insert_circles: {
      __type: 'circles_mutation_response',
      __args: {
        objects: '[circles_insert_input!]!',
        on_conflict: 'circles_on_conflict',
      },
    },
    insert_circles_one: {
      __type: 'circles',
      __args: {
        object: 'circles_insert_input!',
        on_conflict: 'circles_on_conflict',
      },
    },
    insert_organizations: {
      __type: 'organizations_mutation_response',
      __args: {
        objects: '[organizations_insert_input!]!',
        on_conflict: 'organizations_on_conflict',
      },
    },
    insert_organizations_one: {
      __type: 'organizations',
      __args: {
        object: 'organizations_insert_input!',
        on_conflict: 'organizations_on_conflict',
      },
    },
    insert_profiles: {
      __type: 'profiles_mutation_response',
      __args: {
        objects: '[profiles_insert_input!]!',
        on_conflict: 'profiles_on_conflict',
      },
    },
    insert_profiles_one: {
      __type: 'profiles',
      __args: {
        object: 'profiles_insert_input!',
        on_conflict: 'profiles_on_conflict',
      },
    },
    insert_users: {
      __type: 'users_mutation_response',
      __args: {
        objects: '[users_insert_input!]!',
        on_conflict: 'users_on_conflict',
      },
    },
    insert_users_one: {
      __type: 'users',
      __args: {
        object: 'users_insert_input!',
        on_conflict: 'users_on_conflict',
      },
    },
    update_circles: {
      __type: 'circles_mutation_response',
      __args: {
        _inc: 'circles_inc_input',
        _set: 'circles_set_input',
        where: 'circles_bool_exp!',
      },
    },
    update_circles_by_pk: {
      __type: 'circles',
      __args: {
        _inc: 'circles_inc_input',
        _set: 'circles_set_input',
        pk_columns: 'circles_pk_columns_input!',
      },
    },
    update_organizations: {
      __type: 'organizations_mutation_response',
      __args: {
        _inc: 'organizations_inc_input',
        _set: 'organizations_set_input',
        where: 'organizations_bool_exp!',
      },
    },
    update_organizations_by_pk: {
      __type: 'organizations',
      __args: {
        _inc: 'organizations_inc_input',
        _set: 'organizations_set_input',
        pk_columns: 'organizations_pk_columns_input!',
      },
    },
    update_profiles: {
      __type: 'profiles_mutation_response',
      __args: {
        _inc: 'profiles_inc_input',
        _set: 'profiles_set_input',
        where: 'profiles_bool_exp!',
      },
    },
    update_profiles_by_pk: {
      __type: 'profiles',
      __args: {
        _inc: 'profiles_inc_input',
        _set: 'profiles_set_input',
        pk_columns: 'profiles_pk_columns_input!',
      },
    },
    update_users: {
      __type: 'users_mutation_response',
      __args: {
        _inc: 'users_inc_input',
        _set: 'users_set_input',
        where: 'users_bool_exp!',
      },
    },
    update_users_by_pk: {
      __type: 'users',
      __args: {
        _inc: 'users_inc_input',
        _set: 'users_set_input',
        pk_columns: 'users_pk_columns_input!',
      },
    },
  },
  organizations: {
    __typename: { __type: 'String!' },
    circles: {
      __type: '[circles!]!',
      __args: {
        distinct_on: '[circles_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[circles_order_by!]',
        where: 'circles_bool_exp',
      },
    },
    circles_aggregate: {
      __type: 'circles_aggregate!',
      __args: {
        distinct_on: '[circles_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[circles_order_by!]',
        where: 'circles_bool_exp',
      },
    },
    created_at: { __type: 'timestamp' },
    id: { __type: 'bigint!' },
    is_verified: { __type: 'Boolean!' },
    name: { __type: 'String!' },
    telegram_id: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
  },
  organizations_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'organizations_aggregate_fields' },
    nodes: { __type: '[organizations!]!' },
  },
  organizations_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'organizations_avg_fields' },
    count: {
      __type: 'Int!',
      __args: {
        columns: '[organizations_select_column!]',
        distinct: 'Boolean',
      },
    },
    max: { __type: 'organizations_max_fields' },
    min: { __type: 'organizations_min_fields' },
    stddev: { __type: 'organizations_stddev_fields' },
    stddev_pop: { __type: 'organizations_stddev_pop_fields' },
    stddev_samp: { __type: 'organizations_stddev_samp_fields' },
    sum: { __type: 'organizations_sum_fields' },
    var_pop: { __type: 'organizations_var_pop_fields' },
    var_samp: { __type: 'organizations_var_samp_fields' },
    variance: { __type: 'organizations_variance_fields' },
  },
  organizations_avg_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  organizations_bool_exp: {
    _and: { __type: '[organizations_bool_exp!]' },
    _not: { __type: 'organizations_bool_exp' },
    _or: { __type: '[organizations_bool_exp!]' },
    circles: { __type: 'circles_bool_exp' },
    created_at: { __type: 'timestamp_comparison_exp' },
    id: { __type: 'bigint_comparison_exp' },
    is_verified: { __type: 'Boolean_comparison_exp' },
    name: { __type: 'String_comparison_exp' },
    telegram_id: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamp_comparison_exp' },
  },
  organizations_inc_input: { id: { __type: 'bigint' } },
  organizations_insert_input: {
    circles: { __type: 'circles_arr_rel_insert_input' },
    created_at: { __type: 'timestamp' },
    id: { __type: 'bigint' },
    is_verified: { __type: 'Boolean' },
    name: { __type: 'String' },
    telegram_id: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
  },
  organizations_max_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamp' },
    id: { __type: 'bigint' },
    name: { __type: 'String' },
    telegram_id: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
  },
  organizations_min_fields: {
    __typename: { __type: 'String!' },
    created_at: { __type: 'timestamp' },
    id: { __type: 'bigint' },
    name: { __type: 'String' },
    telegram_id: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
  },
  organizations_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[organizations!]!' },
  },
  organizations_obj_rel_insert_input: {
    data: { __type: 'organizations_insert_input!' },
    on_conflict: { __type: 'organizations_on_conflict' },
  },
  organizations_on_conflict: {
    constraint: { __type: 'organizations_constraint!' },
    update_columns: { __type: '[organizations_update_column!]!' },
    where: { __type: 'organizations_bool_exp' },
  },
  organizations_order_by: {
    circles_aggregate: { __type: 'circles_aggregate_order_by' },
    created_at: { __type: 'order_by' },
    id: { __type: 'order_by' },
    is_verified: { __type: 'order_by' },
    name: { __type: 'order_by' },
    telegram_id: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  organizations_pk_columns_input: { id: { __type: 'bigint!' } },
  organizations_set_input: {
    created_at: { __type: 'timestamp' },
    id: { __type: 'bigint' },
    is_verified: { __type: 'Boolean' },
    name: { __type: 'String' },
    telegram_id: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
  },
  organizations_stddev_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  organizations_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  organizations_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  organizations_sum_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'bigint' },
  },
  organizations_var_pop_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  organizations_var_samp_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  organizations_variance_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  profiles: {
    __typename: { __type: 'String!' },
    address: { __type: 'String!' },
    admin_view: { __type: 'Boolean!' },
    ann_power: { __type: 'Boolean!' },
    avatar: { __type: 'String' },
    background: { __type: 'String' },
    bio: { __type: 'String' },
    chat_id: { __type: 'String' },
    created_at: { __type: 'timestamp' },
    discord_username: { __type: 'String' },
    github_username: { __type: 'String' },
    id: { __type: 'bigint!' },
    medium_username: { __type: 'String' },
    skills: { __type: 'String' },
    telegram_username: { __type: 'String' },
    twitter_username: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
    users: {
      __type: '[users!]!',
      __args: {
        distinct_on: '[users_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[users_order_by!]',
        where: 'users_bool_exp',
      },
    },
    users_aggregate: {
      __type: 'users_aggregate!',
      __args: {
        distinct_on: '[users_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[users_order_by!]',
        where: 'users_bool_exp',
      },
    },
    website: { __type: 'String' },
  },
  profiles_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'profiles_aggregate_fields' },
    nodes: { __type: '[profiles!]!' },
  },
  profiles_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'profiles_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[profiles_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'profiles_max_fields' },
    min: { __type: 'profiles_min_fields' },
    stddev: { __type: 'profiles_stddev_fields' },
    stddev_pop: { __type: 'profiles_stddev_pop_fields' },
    stddev_samp: { __type: 'profiles_stddev_samp_fields' },
    sum: { __type: 'profiles_sum_fields' },
    var_pop: { __type: 'profiles_var_pop_fields' },
    var_samp: { __type: 'profiles_var_samp_fields' },
    variance: { __type: 'profiles_variance_fields' },
  },
  profiles_avg_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  profiles_bool_exp: {
    _and: { __type: '[profiles_bool_exp!]' },
    _not: { __type: 'profiles_bool_exp' },
    _or: { __type: '[profiles_bool_exp!]' },
    address: { __type: 'String_comparison_exp' },
    admin_view: { __type: 'Boolean_comparison_exp' },
    ann_power: { __type: 'Boolean_comparison_exp' },
    avatar: { __type: 'String_comparison_exp' },
    background: { __type: 'String_comparison_exp' },
    bio: { __type: 'String_comparison_exp' },
    chat_id: { __type: 'String_comparison_exp' },
    created_at: { __type: 'timestamp_comparison_exp' },
    discord_username: { __type: 'String_comparison_exp' },
    github_username: { __type: 'String_comparison_exp' },
    id: { __type: 'bigint_comparison_exp' },
    medium_username: { __type: 'String_comparison_exp' },
    skills: { __type: 'String_comparison_exp' },
    telegram_username: { __type: 'String_comparison_exp' },
    twitter_username: { __type: 'String_comparison_exp' },
    updated_at: { __type: 'timestamp_comparison_exp' },
    users: { __type: 'users_bool_exp' },
    website: { __type: 'String_comparison_exp' },
  },
  profiles_inc_input: { id: { __type: 'bigint' } },
  profiles_insert_input: {
    address: { __type: 'String' },
    admin_view: { __type: 'Boolean' },
    ann_power: { __type: 'Boolean' },
    avatar: { __type: 'String' },
    background: { __type: 'String' },
    bio: { __type: 'String' },
    chat_id: { __type: 'String' },
    created_at: { __type: 'timestamp' },
    discord_username: { __type: 'String' },
    github_username: { __type: 'String' },
    id: { __type: 'bigint' },
    medium_username: { __type: 'String' },
    skills: { __type: 'String' },
    telegram_username: { __type: 'String' },
    twitter_username: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
    users: { __type: 'users_arr_rel_insert_input' },
    website: { __type: 'String' },
  },
  profiles_max_fields: {
    __typename: { __type: 'String!' },
    address: { __type: 'String' },
    avatar: { __type: 'String' },
    background: { __type: 'String' },
    bio: { __type: 'String' },
    chat_id: { __type: 'String' },
    created_at: { __type: 'timestamp' },
    discord_username: { __type: 'String' },
    github_username: { __type: 'String' },
    id: { __type: 'bigint' },
    medium_username: { __type: 'String' },
    skills: { __type: 'String' },
    telegram_username: { __type: 'String' },
    twitter_username: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
    website: { __type: 'String' },
  },
  profiles_min_fields: {
    __typename: { __type: 'String!' },
    address: { __type: 'String' },
    avatar: { __type: 'String' },
    background: { __type: 'String' },
    bio: { __type: 'String' },
    chat_id: { __type: 'String' },
    created_at: { __type: 'timestamp' },
    discord_username: { __type: 'String' },
    github_username: { __type: 'String' },
    id: { __type: 'bigint' },
    medium_username: { __type: 'String' },
    skills: { __type: 'String' },
    telegram_username: { __type: 'String' },
    twitter_username: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
    website: { __type: 'String' },
  },
  profiles_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[profiles!]!' },
  },
  profiles_obj_rel_insert_input: {
    data: { __type: 'profiles_insert_input!' },
    on_conflict: { __type: 'profiles_on_conflict' },
  },
  profiles_on_conflict: {
    constraint: { __type: 'profiles_constraint!' },
    update_columns: { __type: '[profiles_update_column!]!' },
    where: { __type: 'profiles_bool_exp' },
  },
  profiles_order_by: {
    address: { __type: 'order_by' },
    admin_view: { __type: 'order_by' },
    ann_power: { __type: 'order_by' },
    avatar: { __type: 'order_by' },
    background: { __type: 'order_by' },
    bio: { __type: 'order_by' },
    chat_id: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    discord_username: { __type: 'order_by' },
    github_username: { __type: 'order_by' },
    id: { __type: 'order_by' },
    medium_username: { __type: 'order_by' },
    skills: { __type: 'order_by' },
    telegram_username: { __type: 'order_by' },
    twitter_username: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
    users_aggregate: { __type: 'users_aggregate_order_by' },
    website: { __type: 'order_by' },
  },
  profiles_pk_columns_input: { id: { __type: 'bigint!' } },
  profiles_set_input: {
    address: { __type: 'String' },
    admin_view: { __type: 'Boolean' },
    ann_power: { __type: 'Boolean' },
    avatar: { __type: 'String' },
    background: { __type: 'String' },
    bio: { __type: 'String' },
    chat_id: { __type: 'String' },
    created_at: { __type: 'timestamp' },
    discord_username: { __type: 'String' },
    github_username: { __type: 'String' },
    id: { __type: 'bigint' },
    medium_username: { __type: 'String' },
    skills: { __type: 'String' },
    telegram_username: { __type: 'String' },
    twitter_username: { __type: 'String' },
    updated_at: { __type: 'timestamp' },
    website: { __type: 'String' },
  },
  profiles_stddev_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  profiles_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  profiles_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  profiles_sum_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'bigint' },
  },
  profiles_var_pop_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  profiles_var_samp_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  profiles_variance_fields: {
    __typename: { __type: 'String!' },
    id: { __type: 'Float' },
  },
  query: {
    __typename: { __type: 'String!' },
    circles: {
      __type: '[circles!]!',
      __args: {
        distinct_on: '[circles_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[circles_order_by!]',
        where: 'circles_bool_exp',
      },
    },
    circles_aggregate: {
      __type: 'circles_aggregate!',
      __args: {
        distinct_on: '[circles_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[circles_order_by!]',
        where: 'circles_bool_exp',
      },
    },
    circles_by_pk: { __type: 'circles', __args: { id: 'bigint!' } },
    organizations: {
      __type: '[organizations!]!',
      __args: {
        distinct_on: '[organizations_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[organizations_order_by!]',
        where: 'organizations_bool_exp',
      },
    },
    organizations_aggregate: {
      __type: 'organizations_aggregate!',
      __args: {
        distinct_on: '[organizations_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[organizations_order_by!]',
        where: 'organizations_bool_exp',
      },
    },
    organizations_by_pk: { __type: 'organizations', __args: { id: 'bigint!' } },
    profiles: {
      __type: '[profiles!]!',
      __args: {
        distinct_on: '[profiles_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[profiles_order_by!]',
        where: 'profiles_bool_exp',
      },
    },
    profiles_aggregate: {
      __type: 'profiles_aggregate!',
      __args: {
        distinct_on: '[profiles_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[profiles_order_by!]',
        where: 'profiles_bool_exp',
      },
    },
    profiles_by_pk: { __type: 'profiles', __args: { id: 'bigint!' } },
    users: {
      __type: '[users!]!',
      __args: {
        distinct_on: '[users_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[users_order_by!]',
        where: 'users_bool_exp',
      },
    },
    users_aggregate: {
      __type: 'users_aggregate!',
      __args: {
        distinct_on: '[users_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[users_order_by!]',
        where: 'users_bool_exp',
      },
    },
    users_by_pk: { __type: 'users', __args: { id: 'bigint!' } },
  },
  subscription: {
    __typename: { __type: 'String!' },
    circles: {
      __type: '[circles!]!',
      __args: {
        distinct_on: '[circles_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[circles_order_by!]',
        where: 'circles_bool_exp',
      },
    },
    circles_aggregate: {
      __type: 'circles_aggregate!',
      __args: {
        distinct_on: '[circles_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[circles_order_by!]',
        where: 'circles_bool_exp',
      },
    },
    circles_by_pk: { __type: 'circles', __args: { id: 'bigint!' } },
    organizations: {
      __type: '[organizations!]!',
      __args: {
        distinct_on: '[organizations_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[organizations_order_by!]',
        where: 'organizations_bool_exp',
      },
    },
    organizations_aggregate: {
      __type: 'organizations_aggregate!',
      __args: {
        distinct_on: '[organizations_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[organizations_order_by!]',
        where: 'organizations_bool_exp',
      },
    },
    organizations_by_pk: { __type: 'organizations', __args: { id: 'bigint!' } },
    profiles: {
      __type: '[profiles!]!',
      __args: {
        distinct_on: '[profiles_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[profiles_order_by!]',
        where: 'profiles_bool_exp',
      },
    },
    profiles_aggregate: {
      __type: 'profiles_aggregate!',
      __args: {
        distinct_on: '[profiles_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[profiles_order_by!]',
        where: 'profiles_bool_exp',
      },
    },
    profiles_by_pk: { __type: 'profiles', __args: { id: 'bigint!' } },
    users: {
      __type: '[users!]!',
      __args: {
        distinct_on: '[users_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[users_order_by!]',
        where: 'users_bool_exp',
      },
    },
    users_aggregate: {
      __type: 'users_aggregate!',
      __args: {
        distinct_on: '[users_select_column!]',
        limit: 'Int',
        offset: 'Int',
        order_by: '[users_order_by!]',
        where: 'users_bool_exp',
      },
    },
    users_by_pk: { __type: 'users', __args: { id: 'bigint!' } },
  },
  timestamp_comparison_exp: {
    _eq: { __type: 'timestamp' },
    _gt: { __type: 'timestamp' },
    _gte: { __type: 'timestamp' },
    _in: { __type: '[timestamp!]' },
    _is_null: { __type: 'Boolean' },
    _lt: { __type: 'timestamp' },
    _lte: { __type: 'timestamp' },
    _neq: { __type: 'timestamp' },
    _nin: { __type: '[timestamp!]' },
  },
  users: {
    __typename: { __type: 'String!' },
    address: { __type: 'String!' },
    bio: { __type: 'String' },
    circle: { __type: 'circles!' },
    circle_id: { __type: 'bigint!' },
    created_at: { __type: 'timestamp' },
    deleted_at: { __type: 'timestamp' },
    epoch_first_visit: { __type: 'Boolean!' },
    fixed_non_receiver: { __type: 'Boolean!' },
    give_token_received: { __type: 'Int!' },
    give_token_remaining: { __type: 'Int!' },
    id: { __type: 'bigint!' },
    name: { __type: 'String!' },
    non_giver: { __type: 'Boolean!' },
    non_receiver: { __type: 'Boolean!' },
    profile: { __type: 'profiles' },
    role: { __type: 'Int!' },
    starting_tokens: { __type: 'Int!' },
    updated_at: { __type: 'timestamp' },
  },
  users_aggregate: {
    __typename: { __type: 'String!' },
    aggregate: { __type: 'users_aggregate_fields' },
    nodes: { __type: '[users!]!' },
  },
  users_aggregate_fields: {
    __typename: { __type: 'String!' },
    avg: { __type: 'users_avg_fields' },
    count: {
      __type: 'Int!',
      __args: { columns: '[users_select_column!]', distinct: 'Boolean' },
    },
    max: { __type: 'users_max_fields' },
    min: { __type: 'users_min_fields' },
    stddev: { __type: 'users_stddev_fields' },
    stddev_pop: { __type: 'users_stddev_pop_fields' },
    stddev_samp: { __type: 'users_stddev_samp_fields' },
    sum: { __type: 'users_sum_fields' },
    var_pop: { __type: 'users_var_pop_fields' },
    var_samp: { __type: 'users_var_samp_fields' },
    variance: { __type: 'users_variance_fields' },
  },
  users_aggregate_order_by: {
    avg: { __type: 'users_avg_order_by' },
    count: { __type: 'order_by' },
    max: { __type: 'users_max_order_by' },
    min: { __type: 'users_min_order_by' },
    stddev: { __type: 'users_stddev_order_by' },
    stddev_pop: { __type: 'users_stddev_pop_order_by' },
    stddev_samp: { __type: 'users_stddev_samp_order_by' },
    sum: { __type: 'users_sum_order_by' },
    var_pop: { __type: 'users_var_pop_order_by' },
    var_samp: { __type: 'users_var_samp_order_by' },
    variance: { __type: 'users_variance_order_by' },
  },
  users_arr_rel_insert_input: {
    data: { __type: '[users_insert_input!]!' },
    on_conflict: { __type: 'users_on_conflict' },
  },
  users_avg_fields: {
    __typename: { __type: 'String!' },
    circle_id: { __type: 'Float' },
    give_token_received: { __type: 'Float' },
    give_token_remaining: { __type: 'Float' },
    id: { __type: 'Float' },
    role: { __type: 'Float' },
    starting_tokens: { __type: 'Float' },
  },
  users_avg_order_by: {
    circle_id: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
  },
  users_bool_exp: {
    _and: { __type: '[users_bool_exp!]' },
    _not: { __type: 'users_bool_exp' },
    _or: { __type: '[users_bool_exp!]' },
    address: { __type: 'String_comparison_exp' },
    bio: { __type: 'String_comparison_exp' },
    circle: { __type: 'circles_bool_exp' },
    circle_id: { __type: 'bigint_comparison_exp' },
    created_at: { __type: 'timestamp_comparison_exp' },
    deleted_at: { __type: 'timestamp_comparison_exp' },
    epoch_first_visit: { __type: 'Boolean_comparison_exp' },
    fixed_non_receiver: { __type: 'Boolean_comparison_exp' },
    give_token_received: { __type: 'Int_comparison_exp' },
    give_token_remaining: { __type: 'Int_comparison_exp' },
    id: { __type: 'bigint_comparison_exp' },
    name: { __type: 'String_comparison_exp' },
    non_giver: { __type: 'Boolean_comparison_exp' },
    non_receiver: { __type: 'Boolean_comparison_exp' },
    profile: { __type: 'profiles_bool_exp' },
    role: { __type: 'Int_comparison_exp' },
    starting_tokens: { __type: 'Int_comparison_exp' },
    updated_at: { __type: 'timestamp_comparison_exp' },
  },
  users_inc_input: {
    circle_id: { __type: 'bigint' },
    give_token_received: { __type: 'Int' },
    give_token_remaining: { __type: 'Int' },
    id: { __type: 'bigint' },
    role: { __type: 'Int' },
    starting_tokens: { __type: 'Int' },
  },
  users_insert_input: {
    address: { __type: 'String' },
    bio: { __type: 'String' },
    circle: { __type: 'circles_obj_rel_insert_input' },
    circle_id: { __type: 'bigint' },
    created_at: { __type: 'timestamp' },
    deleted_at: { __type: 'timestamp' },
    epoch_first_visit: { __type: 'Boolean' },
    fixed_non_receiver: { __type: 'Boolean' },
    give_token_received: { __type: 'Int' },
    give_token_remaining: { __type: 'Int' },
    id: { __type: 'bigint' },
    name: { __type: 'String' },
    non_giver: { __type: 'Boolean' },
    non_receiver: { __type: 'Boolean' },
    profile: { __type: 'profiles_obj_rel_insert_input' },
    role: { __type: 'Int' },
    starting_tokens: { __type: 'Int' },
    updated_at: { __type: 'timestamp' },
  },
  users_max_fields: {
    __typename: { __type: 'String!' },
    address: { __type: 'String' },
    bio: { __type: 'String' },
    circle_id: { __type: 'bigint' },
    created_at: { __type: 'timestamp' },
    deleted_at: { __type: 'timestamp' },
    give_token_received: { __type: 'Int' },
    give_token_remaining: { __type: 'Int' },
    id: { __type: 'bigint' },
    name: { __type: 'String' },
    role: { __type: 'Int' },
    starting_tokens: { __type: 'Int' },
    updated_at: { __type: 'timestamp' },
  },
  users_max_order_by: {
    address: { __type: 'order_by' },
    bio: { __type: 'order_by' },
    circle_id: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    deleted_at: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    name: { __type: 'order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  users_min_fields: {
    __typename: { __type: 'String!' },
    address: { __type: 'String' },
    bio: { __type: 'String' },
    circle_id: { __type: 'bigint' },
    created_at: { __type: 'timestamp' },
    deleted_at: { __type: 'timestamp' },
    give_token_received: { __type: 'Int' },
    give_token_remaining: { __type: 'Int' },
    id: { __type: 'bigint' },
    name: { __type: 'String' },
    role: { __type: 'Int' },
    starting_tokens: { __type: 'Int' },
    updated_at: { __type: 'timestamp' },
  },
  users_min_order_by: {
    address: { __type: 'order_by' },
    bio: { __type: 'order_by' },
    circle_id: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    deleted_at: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    name: { __type: 'order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  users_mutation_response: {
    __typename: { __type: 'String!' },
    affected_rows: { __type: 'Int!' },
    returning: { __type: '[users!]!' },
  },
  users_on_conflict: {
    constraint: { __type: 'users_constraint!' },
    update_columns: { __type: '[users_update_column!]!' },
    where: { __type: 'users_bool_exp' },
  },
  users_order_by: {
    address: { __type: 'order_by' },
    bio: { __type: 'order_by' },
    circle: { __type: 'circles_order_by' },
    circle_id: { __type: 'order_by' },
    created_at: { __type: 'order_by' },
    deleted_at: { __type: 'order_by' },
    epoch_first_visit: { __type: 'order_by' },
    fixed_non_receiver: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    name: { __type: 'order_by' },
    non_giver: { __type: 'order_by' },
    non_receiver: { __type: 'order_by' },
    profile: { __type: 'profiles_order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
    updated_at: { __type: 'order_by' },
  },
  users_pk_columns_input: { id: { __type: 'bigint!' } },
  users_set_input: {
    address: { __type: 'String' },
    bio: { __type: 'String' },
    circle_id: { __type: 'bigint' },
    created_at: { __type: 'timestamp' },
    deleted_at: { __type: 'timestamp' },
    epoch_first_visit: { __type: 'Boolean' },
    fixed_non_receiver: { __type: 'Boolean' },
    give_token_received: { __type: 'Int' },
    give_token_remaining: { __type: 'Int' },
    id: { __type: 'bigint' },
    name: { __type: 'String' },
    non_giver: { __type: 'Boolean' },
    non_receiver: { __type: 'Boolean' },
    role: { __type: 'Int' },
    starting_tokens: { __type: 'Int' },
    updated_at: { __type: 'timestamp' },
  },
  users_stddev_fields: {
    __typename: { __type: 'String!' },
    circle_id: { __type: 'Float' },
    give_token_received: { __type: 'Float' },
    give_token_remaining: { __type: 'Float' },
    id: { __type: 'Float' },
    role: { __type: 'Float' },
    starting_tokens: { __type: 'Float' },
  },
  users_stddev_order_by: {
    circle_id: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
  },
  users_stddev_pop_fields: {
    __typename: { __type: 'String!' },
    circle_id: { __type: 'Float' },
    give_token_received: { __type: 'Float' },
    give_token_remaining: { __type: 'Float' },
    id: { __type: 'Float' },
    role: { __type: 'Float' },
    starting_tokens: { __type: 'Float' },
  },
  users_stddev_pop_order_by: {
    circle_id: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
  },
  users_stddev_samp_fields: {
    __typename: { __type: 'String!' },
    circle_id: { __type: 'Float' },
    give_token_received: { __type: 'Float' },
    give_token_remaining: { __type: 'Float' },
    id: { __type: 'Float' },
    role: { __type: 'Float' },
    starting_tokens: { __type: 'Float' },
  },
  users_stddev_samp_order_by: {
    circle_id: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
  },
  users_sum_fields: {
    __typename: { __type: 'String!' },
    circle_id: { __type: 'bigint' },
    give_token_received: { __type: 'Int' },
    give_token_remaining: { __type: 'Int' },
    id: { __type: 'bigint' },
    role: { __type: 'Int' },
    starting_tokens: { __type: 'Int' },
  },
  users_sum_order_by: {
    circle_id: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
  },
  users_var_pop_fields: {
    __typename: { __type: 'String!' },
    circle_id: { __type: 'Float' },
    give_token_received: { __type: 'Float' },
    give_token_remaining: { __type: 'Float' },
    id: { __type: 'Float' },
    role: { __type: 'Float' },
    starting_tokens: { __type: 'Float' },
  },
  users_var_pop_order_by: {
    circle_id: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
  },
  users_var_samp_fields: {
    __typename: { __type: 'String!' },
    circle_id: { __type: 'Float' },
    give_token_received: { __type: 'Float' },
    give_token_remaining: { __type: 'Float' },
    id: { __type: 'Float' },
    role: { __type: 'Float' },
    starting_tokens: { __type: 'Float' },
  },
  users_var_samp_order_by: {
    circle_id: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
  },
  users_variance_fields: {
    __typename: { __type: 'String!' },
    circle_id: { __type: 'Float' },
    give_token_received: { __type: 'Float' },
    give_token_remaining: { __type: 'Float' },
    id: { __type: 'Float' },
    role: { __type: 'Float' },
    starting_tokens: { __type: 'Float' },
  },
  users_variance_order_by: {
    circle_id: { __type: 'order_by' },
    give_token_received: { __type: 'order_by' },
    give_token_remaining: { __type: 'order_by' },
    id: { __type: 'order_by' },
    role: { __type: 'order_by' },
    starting_tokens: { __type: 'order_by' },
  },
} as const;

/**
 * columns and relationships of "circles"
 */
export interface circles {
  __typename?: 'circles';
  alloc_text?: Maybe<ScalarsEnums['String']>;
  auto_opt_out: ScalarsEnums['Boolean'];
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  default_opt_in: ScalarsEnums['Boolean'];
  discord_webhook?: Maybe<ScalarsEnums['String']>;
  id: ScalarsEnums['bigint'];
  is_verified: ScalarsEnums['Boolean'];
  logo?: Maybe<ScalarsEnums['String']>;
  min_vouches: ScalarsEnums['Int'];
  name: ScalarsEnums['String'];
  nomination_days_limit: ScalarsEnums['Int'];
  only_giver_vouch: ScalarsEnums['Boolean'];
  /**
   * An object relationship
   */
  organization?: Maybe<organizations>;
  protocol_id?: Maybe<ScalarsEnums['Int']>;
  team_sel_text?: Maybe<ScalarsEnums['String']>;
  team_selection: ScalarsEnums['Boolean'];
  telegram_id?: Maybe<ScalarsEnums['String']>;
  token_name: ScalarsEnums['String'];
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
  /**
   * An array relationship
   */
  users: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<users_select_column>>;
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>;
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>;
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<users_order_by>>;
    /**
     * filter the rows returned
     */
    where?: Maybe<users_bool_exp>;
  }) => Array<users>;
  /**
   * An aggregate relationship
   */
  users_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<users_select_column>>;
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>;
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>;
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<users_order_by>>;
    /**
     * filter the rows returned
     */
    where?: Maybe<users_bool_exp>;
  }) => users_aggregate;
  vouching: ScalarsEnums['Boolean'];
  vouching_text?: Maybe<ScalarsEnums['String']>;
}

/**
 * aggregated selection of "circles"
 */
export interface circles_aggregate {
  __typename?: 'circles_aggregate';
  aggregate?: Maybe<circles_aggregate_fields>;
  nodes: Array<circles>;
}

/**
 * aggregate fields of "circles"
 */
export interface circles_aggregate_fields {
  __typename?: 'circles_aggregate_fields';
  avg?: Maybe<circles_avg_fields>;
  count: (args?: {
    columns?: Maybe<Array<circles_select_column>>;
    distinct?: Maybe<Scalars['Boolean']>;
  }) => ScalarsEnums['Int'];
  max?: Maybe<circles_max_fields>;
  min?: Maybe<circles_min_fields>;
  stddev?: Maybe<circles_stddev_fields>;
  stddev_pop?: Maybe<circles_stddev_pop_fields>;
  stddev_samp?: Maybe<circles_stddev_samp_fields>;
  sum?: Maybe<circles_sum_fields>;
  var_pop?: Maybe<circles_var_pop_fields>;
  var_samp?: Maybe<circles_var_samp_fields>;
  variance?: Maybe<circles_variance_fields>;
}

/**
 * aggregate avg on columns
 */
export interface circles_avg_fields {
  __typename?: 'circles_avg_fields';
  id?: Maybe<ScalarsEnums['Float']>;
  min_vouches?: Maybe<ScalarsEnums['Float']>;
  nomination_days_limit?: Maybe<ScalarsEnums['Float']>;
  protocol_id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate max on columns
 */
export interface circles_max_fields {
  __typename?: 'circles_max_fields';
  alloc_text?: Maybe<ScalarsEnums['String']>;
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  discord_webhook?: Maybe<ScalarsEnums['String']>;
  id?: Maybe<ScalarsEnums['bigint']>;
  logo?: Maybe<ScalarsEnums['String']>;
  min_vouches?: Maybe<ScalarsEnums['Int']>;
  name?: Maybe<ScalarsEnums['String']>;
  nomination_days_limit?: Maybe<ScalarsEnums['Int']>;
  protocol_id?: Maybe<ScalarsEnums['Int']>;
  team_sel_text?: Maybe<ScalarsEnums['String']>;
  telegram_id?: Maybe<ScalarsEnums['String']>;
  token_name?: Maybe<ScalarsEnums['String']>;
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
  vouching_text?: Maybe<ScalarsEnums['String']>;
}

/**
 * aggregate min on columns
 */
export interface circles_min_fields {
  __typename?: 'circles_min_fields';
  alloc_text?: Maybe<ScalarsEnums['String']>;
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  discord_webhook?: Maybe<ScalarsEnums['String']>;
  id?: Maybe<ScalarsEnums['bigint']>;
  logo?: Maybe<ScalarsEnums['String']>;
  min_vouches?: Maybe<ScalarsEnums['Int']>;
  name?: Maybe<ScalarsEnums['String']>;
  nomination_days_limit?: Maybe<ScalarsEnums['Int']>;
  protocol_id?: Maybe<ScalarsEnums['Int']>;
  team_sel_text?: Maybe<ScalarsEnums['String']>;
  telegram_id?: Maybe<ScalarsEnums['String']>;
  token_name?: Maybe<ScalarsEnums['String']>;
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
  vouching_text?: Maybe<ScalarsEnums['String']>;
}

/**
 * response of any mutation on the table "circles"
 */
export interface circles_mutation_response {
  __typename?: 'circles_mutation_response';
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int'];
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<circles>;
}

/**
 * aggregate stddev on columns
 */
export interface circles_stddev_fields {
  __typename?: 'circles_stddev_fields';
  id?: Maybe<ScalarsEnums['Float']>;
  min_vouches?: Maybe<ScalarsEnums['Float']>;
  nomination_days_limit?: Maybe<ScalarsEnums['Float']>;
  protocol_id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate stddev_pop on columns
 */
export interface circles_stddev_pop_fields {
  __typename?: 'circles_stddev_pop_fields';
  id?: Maybe<ScalarsEnums['Float']>;
  min_vouches?: Maybe<ScalarsEnums['Float']>;
  nomination_days_limit?: Maybe<ScalarsEnums['Float']>;
  protocol_id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate stddev_samp on columns
 */
export interface circles_stddev_samp_fields {
  __typename?: 'circles_stddev_samp_fields';
  id?: Maybe<ScalarsEnums['Float']>;
  min_vouches?: Maybe<ScalarsEnums['Float']>;
  nomination_days_limit?: Maybe<ScalarsEnums['Float']>;
  protocol_id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate sum on columns
 */
export interface circles_sum_fields {
  __typename?: 'circles_sum_fields';
  id?: Maybe<ScalarsEnums['bigint']>;
  min_vouches?: Maybe<ScalarsEnums['Int']>;
  nomination_days_limit?: Maybe<ScalarsEnums['Int']>;
  protocol_id?: Maybe<ScalarsEnums['Int']>;
}

/**
 * aggregate var_pop on columns
 */
export interface circles_var_pop_fields {
  __typename?: 'circles_var_pop_fields';
  id?: Maybe<ScalarsEnums['Float']>;
  min_vouches?: Maybe<ScalarsEnums['Float']>;
  nomination_days_limit?: Maybe<ScalarsEnums['Float']>;
  protocol_id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate var_samp on columns
 */
export interface circles_var_samp_fields {
  __typename?: 'circles_var_samp_fields';
  id?: Maybe<ScalarsEnums['Float']>;
  min_vouches?: Maybe<ScalarsEnums['Float']>;
  nomination_days_limit?: Maybe<ScalarsEnums['Float']>;
  protocol_id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate variance on columns
 */
export interface circles_variance_fields {
  __typename?: 'circles_variance_fields';
  id?: Maybe<ScalarsEnums['Float']>;
  min_vouches?: Maybe<ScalarsEnums['Float']>;
  nomination_days_limit?: Maybe<ScalarsEnums['Float']>;
  protocol_id?: Maybe<ScalarsEnums['Float']>;
}

export interface Mutation {
  __typename?: 'Mutation';
  delete_circles: (args: {
    where: circles_bool_exp;
  }) => Maybe<circles_mutation_response>;
  delete_circles_by_pk: (args: { id: Scalars['bigint'] }) => Maybe<circles>;
  delete_organizations: (args: {
    where: organizations_bool_exp;
  }) => Maybe<organizations_mutation_response>;
  delete_organizations_by_pk: (args: {
    id: Scalars['bigint'];
  }) => Maybe<organizations>;
  delete_profiles: (args: {
    where: profiles_bool_exp;
  }) => Maybe<profiles_mutation_response>;
  delete_profiles_by_pk: (args: { id: Scalars['bigint'] }) => Maybe<profiles>;
  delete_users: (args: {
    where: users_bool_exp;
  }) => Maybe<users_mutation_response>;
  delete_users_by_pk: (args: { id: Scalars['bigint'] }) => Maybe<users>;
  insert_circles: (args: {
    objects: Array<circles_insert_input>;
    on_conflict?: Maybe<circles_on_conflict>;
  }) => Maybe<circles_mutation_response>;
  insert_circles_one: (args: {
    object: circles_insert_input;
    on_conflict?: Maybe<circles_on_conflict>;
  }) => Maybe<circles>;
  insert_organizations: (args: {
    objects: Array<organizations_insert_input>;
    on_conflict?: Maybe<organizations_on_conflict>;
  }) => Maybe<organizations_mutation_response>;
  insert_organizations_one: (args: {
    object: organizations_insert_input;
    on_conflict?: Maybe<organizations_on_conflict>;
  }) => Maybe<organizations>;
  insert_profiles: (args: {
    objects: Array<profiles_insert_input>;
    on_conflict?: Maybe<profiles_on_conflict>;
  }) => Maybe<profiles_mutation_response>;
  insert_profiles_one: (args: {
    object: profiles_insert_input;
    on_conflict?: Maybe<profiles_on_conflict>;
  }) => Maybe<profiles>;
  insert_users: (args: {
    objects: Array<users_insert_input>;
    on_conflict?: Maybe<users_on_conflict>;
  }) => Maybe<users_mutation_response>;
  insert_users_one: (args: {
    object: users_insert_input;
    on_conflict?: Maybe<users_on_conflict>;
  }) => Maybe<users>;
  update_circles: (args: {
    _inc?: Maybe<circles_inc_input>;
    _set?: Maybe<circles_set_input>;
    where: circles_bool_exp;
  }) => Maybe<circles_mutation_response>;
  update_circles_by_pk: (args: {
    _inc?: Maybe<circles_inc_input>;
    _set?: Maybe<circles_set_input>;
    pk_columns: circles_pk_columns_input;
  }) => Maybe<circles>;
  update_organizations: (args: {
    _inc?: Maybe<organizations_inc_input>;
    _set?: Maybe<organizations_set_input>;
    where: organizations_bool_exp;
  }) => Maybe<organizations_mutation_response>;
  update_organizations_by_pk: (args: {
    _inc?: Maybe<organizations_inc_input>;
    _set?: Maybe<organizations_set_input>;
    pk_columns: organizations_pk_columns_input;
  }) => Maybe<organizations>;
  update_profiles: (args: {
    _inc?: Maybe<profiles_inc_input>;
    _set?: Maybe<profiles_set_input>;
    where: profiles_bool_exp;
  }) => Maybe<profiles_mutation_response>;
  update_profiles_by_pk: (args: {
    _inc?: Maybe<profiles_inc_input>;
    _set?: Maybe<profiles_set_input>;
    pk_columns: profiles_pk_columns_input;
  }) => Maybe<profiles>;
  update_users: (args: {
    _inc?: Maybe<users_inc_input>;
    _set?: Maybe<users_set_input>;
    where: users_bool_exp;
  }) => Maybe<users_mutation_response>;
  update_users_by_pk: (args: {
    _inc?: Maybe<users_inc_input>;
    _set?: Maybe<users_set_input>;
    pk_columns: users_pk_columns_input;
  }) => Maybe<users>;
}

/**
 * columns and relationships of "protocols"
 */
export interface organizations {
  __typename?: 'organizations';
  /**
   * An array relationship
   */
  circles: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<circles_select_column>>;
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>;
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>;
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<circles_order_by>>;
    /**
     * filter the rows returned
     */
    where?: Maybe<circles_bool_exp>;
  }) => Array<circles>;
  /**
   * An aggregate relationship
   */
  circles_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<circles_select_column>>;
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>;
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>;
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<circles_order_by>>;
    /**
     * filter the rows returned
     */
    where?: Maybe<circles_bool_exp>;
  }) => circles_aggregate;
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  id: ScalarsEnums['bigint'];
  is_verified: ScalarsEnums['Boolean'];
  name: ScalarsEnums['String'];
  telegram_id?: Maybe<ScalarsEnums['String']>;
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
}

/**
 * aggregated selection of "protocols"
 */
export interface organizations_aggregate {
  __typename?: 'organizations_aggregate';
  aggregate?: Maybe<organizations_aggregate_fields>;
  nodes: Array<organizations>;
}

/**
 * aggregate fields of "protocols"
 */
export interface organizations_aggregate_fields {
  __typename?: 'organizations_aggregate_fields';
  avg?: Maybe<organizations_avg_fields>;
  count: (args?: {
    columns?: Maybe<Array<organizations_select_column>>;
    distinct?: Maybe<Scalars['Boolean']>;
  }) => ScalarsEnums['Int'];
  max?: Maybe<organizations_max_fields>;
  min?: Maybe<organizations_min_fields>;
  stddev?: Maybe<organizations_stddev_fields>;
  stddev_pop?: Maybe<organizations_stddev_pop_fields>;
  stddev_samp?: Maybe<organizations_stddev_samp_fields>;
  sum?: Maybe<organizations_sum_fields>;
  var_pop?: Maybe<organizations_var_pop_fields>;
  var_samp?: Maybe<organizations_var_samp_fields>;
  variance?: Maybe<organizations_variance_fields>;
}

/**
 * aggregate avg on columns
 */
export interface organizations_avg_fields {
  __typename?: 'organizations_avg_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate max on columns
 */
export interface organizations_max_fields {
  __typename?: 'organizations_max_fields';
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  id?: Maybe<ScalarsEnums['bigint']>;
  name?: Maybe<ScalarsEnums['String']>;
  telegram_id?: Maybe<ScalarsEnums['String']>;
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
}

/**
 * aggregate min on columns
 */
export interface organizations_min_fields {
  __typename?: 'organizations_min_fields';
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  id?: Maybe<ScalarsEnums['bigint']>;
  name?: Maybe<ScalarsEnums['String']>;
  telegram_id?: Maybe<ScalarsEnums['String']>;
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
}

/**
 * response of any mutation on the table "protocols"
 */
export interface organizations_mutation_response {
  __typename?: 'organizations_mutation_response';
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int'];
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<organizations>;
}

/**
 * aggregate stddev on columns
 */
export interface organizations_stddev_fields {
  __typename?: 'organizations_stddev_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate stddev_pop on columns
 */
export interface organizations_stddev_pop_fields {
  __typename?: 'organizations_stddev_pop_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate stddev_samp on columns
 */
export interface organizations_stddev_samp_fields {
  __typename?: 'organizations_stddev_samp_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate sum on columns
 */
export interface organizations_sum_fields {
  __typename?: 'organizations_sum_fields';
  id?: Maybe<ScalarsEnums['bigint']>;
}

/**
 * aggregate var_pop on columns
 */
export interface organizations_var_pop_fields {
  __typename?: 'organizations_var_pop_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate var_samp on columns
 */
export interface organizations_var_samp_fields {
  __typename?: 'organizations_var_samp_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate variance on columns
 */
export interface organizations_variance_fields {
  __typename?: 'organizations_variance_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * columns and relationships of "profiles"
 */
export interface profiles {
  __typename?: 'profiles';
  address: ScalarsEnums['String'];
  admin_view: ScalarsEnums['Boolean'];
  ann_power: ScalarsEnums['Boolean'];
  avatar?: Maybe<ScalarsEnums['String']>;
  background?: Maybe<ScalarsEnums['String']>;
  bio?: Maybe<ScalarsEnums['String']>;
  chat_id?: Maybe<ScalarsEnums['String']>;
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  discord_username?: Maybe<ScalarsEnums['String']>;
  github_username?: Maybe<ScalarsEnums['String']>;
  id: ScalarsEnums['bigint'];
  medium_username?: Maybe<ScalarsEnums['String']>;
  skills?: Maybe<ScalarsEnums['String']>;
  telegram_username?: Maybe<ScalarsEnums['String']>;
  twitter_username?: Maybe<ScalarsEnums['String']>;
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
  /**
   * An array relationship
   */
  users: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<users_select_column>>;
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>;
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>;
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<users_order_by>>;
    /**
     * filter the rows returned
     */
    where?: Maybe<users_bool_exp>;
  }) => Array<users>;
  /**
   * An aggregate relationship
   */
  users_aggregate: (args?: {
    /**
     * distinct select on columns
     */
    distinct_on?: Maybe<Array<users_select_column>>;
    /**
     * limit the number of rows returned
     */
    limit?: Maybe<Scalars['Int']>;
    /**
     * skip the first n rows. Use only with order_by
     */
    offset?: Maybe<Scalars['Int']>;
    /**
     * sort the rows by one or more columns
     */
    order_by?: Maybe<Array<users_order_by>>;
    /**
     * filter the rows returned
     */
    where?: Maybe<users_bool_exp>;
  }) => users_aggregate;
  website?: Maybe<ScalarsEnums['String']>;
}

/**
 * aggregated selection of "profiles"
 */
export interface profiles_aggregate {
  __typename?: 'profiles_aggregate';
  aggregate?: Maybe<profiles_aggregate_fields>;
  nodes: Array<profiles>;
}

/**
 * aggregate fields of "profiles"
 */
export interface profiles_aggregate_fields {
  __typename?: 'profiles_aggregate_fields';
  avg?: Maybe<profiles_avg_fields>;
  count: (args?: {
    columns?: Maybe<Array<profiles_select_column>>;
    distinct?: Maybe<Scalars['Boolean']>;
  }) => ScalarsEnums['Int'];
  max?: Maybe<profiles_max_fields>;
  min?: Maybe<profiles_min_fields>;
  stddev?: Maybe<profiles_stddev_fields>;
  stddev_pop?: Maybe<profiles_stddev_pop_fields>;
  stddev_samp?: Maybe<profiles_stddev_samp_fields>;
  sum?: Maybe<profiles_sum_fields>;
  var_pop?: Maybe<profiles_var_pop_fields>;
  var_samp?: Maybe<profiles_var_samp_fields>;
  variance?: Maybe<profiles_variance_fields>;
}

/**
 * aggregate avg on columns
 */
export interface profiles_avg_fields {
  __typename?: 'profiles_avg_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate max on columns
 */
export interface profiles_max_fields {
  __typename?: 'profiles_max_fields';
  address?: Maybe<ScalarsEnums['String']>;
  avatar?: Maybe<ScalarsEnums['String']>;
  background?: Maybe<ScalarsEnums['String']>;
  bio?: Maybe<ScalarsEnums['String']>;
  chat_id?: Maybe<ScalarsEnums['String']>;
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  discord_username?: Maybe<ScalarsEnums['String']>;
  github_username?: Maybe<ScalarsEnums['String']>;
  id?: Maybe<ScalarsEnums['bigint']>;
  medium_username?: Maybe<ScalarsEnums['String']>;
  skills?: Maybe<ScalarsEnums['String']>;
  telegram_username?: Maybe<ScalarsEnums['String']>;
  twitter_username?: Maybe<ScalarsEnums['String']>;
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
  website?: Maybe<ScalarsEnums['String']>;
}

/**
 * aggregate min on columns
 */
export interface profiles_min_fields {
  __typename?: 'profiles_min_fields';
  address?: Maybe<ScalarsEnums['String']>;
  avatar?: Maybe<ScalarsEnums['String']>;
  background?: Maybe<ScalarsEnums['String']>;
  bio?: Maybe<ScalarsEnums['String']>;
  chat_id?: Maybe<ScalarsEnums['String']>;
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  discord_username?: Maybe<ScalarsEnums['String']>;
  github_username?: Maybe<ScalarsEnums['String']>;
  id?: Maybe<ScalarsEnums['bigint']>;
  medium_username?: Maybe<ScalarsEnums['String']>;
  skills?: Maybe<ScalarsEnums['String']>;
  telegram_username?: Maybe<ScalarsEnums['String']>;
  twitter_username?: Maybe<ScalarsEnums['String']>;
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
  website?: Maybe<ScalarsEnums['String']>;
}

/**
 * response of any mutation on the table "profiles"
 */
export interface profiles_mutation_response {
  __typename?: 'profiles_mutation_response';
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int'];
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<profiles>;
}

/**
 * aggregate stddev on columns
 */
export interface profiles_stddev_fields {
  __typename?: 'profiles_stddev_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate stddev_pop on columns
 */
export interface profiles_stddev_pop_fields {
  __typename?: 'profiles_stddev_pop_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate stddev_samp on columns
 */
export interface profiles_stddev_samp_fields {
  __typename?: 'profiles_stddev_samp_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate sum on columns
 */
export interface profiles_sum_fields {
  __typename?: 'profiles_sum_fields';
  id?: Maybe<ScalarsEnums['bigint']>;
}

/**
 * aggregate var_pop on columns
 */
export interface profiles_var_pop_fields {
  __typename?: 'profiles_var_pop_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate var_samp on columns
 */
export interface profiles_var_samp_fields {
  __typename?: 'profiles_var_samp_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate variance on columns
 */
export interface profiles_variance_fields {
  __typename?: 'profiles_variance_fields';
  id?: Maybe<ScalarsEnums['Float']>;
}

export interface Query {
  __typename?: 'Query';
  circles: (args?: {
    distinct_on?: Maybe<Array<circles_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<circles_order_by>>;
    where?: Maybe<circles_bool_exp>;
  }) => Array<circles>;
  circles_aggregate: (args?: {
    distinct_on?: Maybe<Array<circles_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<circles_order_by>>;
    where?: Maybe<circles_bool_exp>;
  }) => circles_aggregate;
  circles_by_pk: (args: { id: Scalars['bigint'] }) => Maybe<circles>;
  organizations: (args?: {
    distinct_on?: Maybe<Array<organizations_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<organizations_order_by>>;
    where?: Maybe<organizations_bool_exp>;
  }) => Array<organizations>;
  organizations_aggregate: (args?: {
    distinct_on?: Maybe<Array<organizations_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<organizations_order_by>>;
    where?: Maybe<organizations_bool_exp>;
  }) => organizations_aggregate;
  organizations_by_pk: (args: {
    id: Scalars['bigint'];
  }) => Maybe<organizations>;
  profiles: (args?: {
    distinct_on?: Maybe<Array<profiles_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<profiles_order_by>>;
    where?: Maybe<profiles_bool_exp>;
  }) => Array<profiles>;
  profiles_aggregate: (args?: {
    distinct_on?: Maybe<Array<profiles_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<profiles_order_by>>;
    where?: Maybe<profiles_bool_exp>;
  }) => profiles_aggregate;
  profiles_by_pk: (args: { id: Scalars['bigint'] }) => Maybe<profiles>;
  users: (args?: {
    distinct_on?: Maybe<Array<users_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<users_order_by>>;
    where?: Maybe<users_bool_exp>;
  }) => Array<users>;
  users_aggregate: (args?: {
    distinct_on?: Maybe<Array<users_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<users_order_by>>;
    where?: Maybe<users_bool_exp>;
  }) => users_aggregate;
  users_by_pk: (args: { id: Scalars['bigint'] }) => Maybe<users>;
}

export interface Subscription {
  __typename?: 'Subscription';
  circles: (args?: {
    distinct_on?: Maybe<Array<circles_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<circles_order_by>>;
    where?: Maybe<circles_bool_exp>;
  }) => Array<circles>;
  circles_aggregate: (args?: {
    distinct_on?: Maybe<Array<circles_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<circles_order_by>>;
    where?: Maybe<circles_bool_exp>;
  }) => circles_aggregate;
  circles_by_pk: (args: { id: Scalars['bigint'] }) => Maybe<circles>;
  organizations: (args?: {
    distinct_on?: Maybe<Array<organizations_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<organizations_order_by>>;
    where?: Maybe<organizations_bool_exp>;
  }) => Array<organizations>;
  organizations_aggregate: (args?: {
    distinct_on?: Maybe<Array<organizations_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<organizations_order_by>>;
    where?: Maybe<organizations_bool_exp>;
  }) => organizations_aggregate;
  organizations_by_pk: (args: {
    id: Scalars['bigint'];
  }) => Maybe<organizations>;
  profiles: (args?: {
    distinct_on?: Maybe<Array<profiles_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<profiles_order_by>>;
    where?: Maybe<profiles_bool_exp>;
  }) => Array<profiles>;
  profiles_aggregate: (args?: {
    distinct_on?: Maybe<Array<profiles_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<profiles_order_by>>;
    where?: Maybe<profiles_bool_exp>;
  }) => profiles_aggregate;
  profiles_by_pk: (args: { id: Scalars['bigint'] }) => Maybe<profiles>;
  users: (args?: {
    distinct_on?: Maybe<Array<users_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<users_order_by>>;
    where?: Maybe<users_bool_exp>;
  }) => Array<users>;
  users_aggregate: (args?: {
    distinct_on?: Maybe<Array<users_select_column>>;
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
    order_by?: Maybe<Array<users_order_by>>;
    where?: Maybe<users_bool_exp>;
  }) => users_aggregate;
  users_by_pk: (args: { id: Scalars['bigint'] }) => Maybe<users>;
}

/**
 * columns and relationships of "users"
 */
export interface users {
  __typename?: 'users';
  address: ScalarsEnums['String'];
  bio?: Maybe<ScalarsEnums['String']>;
  /**
   * An object relationship
   */
  circle: circles;
  circle_id: ScalarsEnums['bigint'];
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  deleted_at?: Maybe<ScalarsEnums['timestamp']>;
  epoch_first_visit: ScalarsEnums['Boolean'];
  fixed_non_receiver: ScalarsEnums['Boolean'];
  give_token_received: ScalarsEnums['Int'];
  give_token_remaining: ScalarsEnums['Int'];
  id: ScalarsEnums['bigint'];
  name: ScalarsEnums['String'];
  non_giver: ScalarsEnums['Boolean'];
  non_receiver: ScalarsEnums['Boolean'];
  /**
   * An object relationship
   */
  profile?: Maybe<profiles>;
  role: ScalarsEnums['Int'];
  starting_tokens: ScalarsEnums['Int'];
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
}

/**
 * aggregated selection of "users"
 */
export interface users_aggregate {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<users_aggregate_fields>;
  nodes: Array<users>;
}

/**
 * aggregate fields of "users"
 */
export interface users_aggregate_fields {
  __typename?: 'users_aggregate_fields';
  avg?: Maybe<users_avg_fields>;
  count: (args?: {
    columns?: Maybe<Array<users_select_column>>;
    distinct?: Maybe<Scalars['Boolean']>;
  }) => ScalarsEnums['Int'];
  max?: Maybe<users_max_fields>;
  min?: Maybe<users_min_fields>;
  stddev?: Maybe<users_stddev_fields>;
  stddev_pop?: Maybe<users_stddev_pop_fields>;
  stddev_samp?: Maybe<users_stddev_samp_fields>;
  sum?: Maybe<users_sum_fields>;
  var_pop?: Maybe<users_var_pop_fields>;
  var_samp?: Maybe<users_var_samp_fields>;
  variance?: Maybe<users_variance_fields>;
}

/**
 * aggregate avg on columns
 */
export interface users_avg_fields {
  __typename?: 'users_avg_fields';
  circle_id?: Maybe<ScalarsEnums['Float']>;
  give_token_received?: Maybe<ScalarsEnums['Float']>;
  give_token_remaining?: Maybe<ScalarsEnums['Float']>;
  id?: Maybe<ScalarsEnums['Float']>;
  role?: Maybe<ScalarsEnums['Float']>;
  starting_tokens?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate max on columns
 */
export interface users_max_fields {
  __typename?: 'users_max_fields';
  address?: Maybe<ScalarsEnums['String']>;
  bio?: Maybe<ScalarsEnums['String']>;
  circle_id?: Maybe<ScalarsEnums['bigint']>;
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  deleted_at?: Maybe<ScalarsEnums['timestamp']>;
  give_token_received?: Maybe<ScalarsEnums['Int']>;
  give_token_remaining?: Maybe<ScalarsEnums['Int']>;
  id?: Maybe<ScalarsEnums['bigint']>;
  name?: Maybe<ScalarsEnums['String']>;
  role?: Maybe<ScalarsEnums['Int']>;
  starting_tokens?: Maybe<ScalarsEnums['Int']>;
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
}

/**
 * aggregate min on columns
 */
export interface users_min_fields {
  __typename?: 'users_min_fields';
  address?: Maybe<ScalarsEnums['String']>;
  bio?: Maybe<ScalarsEnums['String']>;
  circle_id?: Maybe<ScalarsEnums['bigint']>;
  created_at?: Maybe<ScalarsEnums['timestamp']>;
  deleted_at?: Maybe<ScalarsEnums['timestamp']>;
  give_token_received?: Maybe<ScalarsEnums['Int']>;
  give_token_remaining?: Maybe<ScalarsEnums['Int']>;
  id?: Maybe<ScalarsEnums['bigint']>;
  name?: Maybe<ScalarsEnums['String']>;
  role?: Maybe<ScalarsEnums['Int']>;
  starting_tokens?: Maybe<ScalarsEnums['Int']>;
  updated_at?: Maybe<ScalarsEnums['timestamp']>;
}

/**
 * response of any mutation on the table "users"
 */
export interface users_mutation_response {
  __typename?: 'users_mutation_response';
  /**
   * number of rows affected by the mutation
   */
  affected_rows: ScalarsEnums['Int'];
  /**
   * data from the rows affected by the mutation
   */
  returning: Array<users>;
}

/**
 * aggregate stddev on columns
 */
export interface users_stddev_fields {
  __typename?: 'users_stddev_fields';
  circle_id?: Maybe<ScalarsEnums['Float']>;
  give_token_received?: Maybe<ScalarsEnums['Float']>;
  give_token_remaining?: Maybe<ScalarsEnums['Float']>;
  id?: Maybe<ScalarsEnums['Float']>;
  role?: Maybe<ScalarsEnums['Float']>;
  starting_tokens?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate stddev_pop on columns
 */
export interface users_stddev_pop_fields {
  __typename?: 'users_stddev_pop_fields';
  circle_id?: Maybe<ScalarsEnums['Float']>;
  give_token_received?: Maybe<ScalarsEnums['Float']>;
  give_token_remaining?: Maybe<ScalarsEnums['Float']>;
  id?: Maybe<ScalarsEnums['Float']>;
  role?: Maybe<ScalarsEnums['Float']>;
  starting_tokens?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate stddev_samp on columns
 */
export interface users_stddev_samp_fields {
  __typename?: 'users_stddev_samp_fields';
  circle_id?: Maybe<ScalarsEnums['Float']>;
  give_token_received?: Maybe<ScalarsEnums['Float']>;
  give_token_remaining?: Maybe<ScalarsEnums['Float']>;
  id?: Maybe<ScalarsEnums['Float']>;
  role?: Maybe<ScalarsEnums['Float']>;
  starting_tokens?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate sum on columns
 */
export interface users_sum_fields {
  __typename?: 'users_sum_fields';
  circle_id?: Maybe<ScalarsEnums['bigint']>;
  give_token_received?: Maybe<ScalarsEnums['Int']>;
  give_token_remaining?: Maybe<ScalarsEnums['Int']>;
  id?: Maybe<ScalarsEnums['bigint']>;
  role?: Maybe<ScalarsEnums['Int']>;
  starting_tokens?: Maybe<ScalarsEnums['Int']>;
}

/**
 * aggregate var_pop on columns
 */
export interface users_var_pop_fields {
  __typename?: 'users_var_pop_fields';
  circle_id?: Maybe<ScalarsEnums['Float']>;
  give_token_received?: Maybe<ScalarsEnums['Float']>;
  give_token_remaining?: Maybe<ScalarsEnums['Float']>;
  id?: Maybe<ScalarsEnums['Float']>;
  role?: Maybe<ScalarsEnums['Float']>;
  starting_tokens?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate var_samp on columns
 */
export interface users_var_samp_fields {
  __typename?: 'users_var_samp_fields';
  circle_id?: Maybe<ScalarsEnums['Float']>;
  give_token_received?: Maybe<ScalarsEnums['Float']>;
  give_token_remaining?: Maybe<ScalarsEnums['Float']>;
  id?: Maybe<ScalarsEnums['Float']>;
  role?: Maybe<ScalarsEnums['Float']>;
  starting_tokens?: Maybe<ScalarsEnums['Float']>;
}

/**
 * aggregate variance on columns
 */
export interface users_variance_fields {
  __typename?: 'users_variance_fields';
  circle_id?: Maybe<ScalarsEnums['Float']>;
  give_token_received?: Maybe<ScalarsEnums['Float']>;
  give_token_remaining?: Maybe<ScalarsEnums['Float']>;
  id?: Maybe<ScalarsEnums['Float']>;
  role?: Maybe<ScalarsEnums['Float']>;
  starting_tokens?: Maybe<ScalarsEnums['Float']>;
}

export interface SchemaObjectTypes {
  Mutation: Mutation;
  Query: Query;
  Subscription: Subscription;
  circles: circles;
  circles_aggregate: circles_aggregate;
  circles_aggregate_fields: circles_aggregate_fields;
  circles_avg_fields: circles_avg_fields;
  circles_max_fields: circles_max_fields;
  circles_min_fields: circles_min_fields;
  circles_mutation_response: circles_mutation_response;
  circles_stddev_fields: circles_stddev_fields;
  circles_stddev_pop_fields: circles_stddev_pop_fields;
  circles_stddev_samp_fields: circles_stddev_samp_fields;
  circles_sum_fields: circles_sum_fields;
  circles_var_pop_fields: circles_var_pop_fields;
  circles_var_samp_fields: circles_var_samp_fields;
  circles_variance_fields: circles_variance_fields;
  organizations: organizations;
  organizations_aggregate: organizations_aggregate;
  organizations_aggregate_fields: organizations_aggregate_fields;
  organizations_avg_fields: organizations_avg_fields;
  organizations_max_fields: organizations_max_fields;
  organizations_min_fields: organizations_min_fields;
  organizations_mutation_response: organizations_mutation_response;
  organizations_stddev_fields: organizations_stddev_fields;
  organizations_stddev_pop_fields: organizations_stddev_pop_fields;
  organizations_stddev_samp_fields: organizations_stddev_samp_fields;
  organizations_sum_fields: organizations_sum_fields;
  organizations_var_pop_fields: organizations_var_pop_fields;
  organizations_var_samp_fields: organizations_var_samp_fields;
  organizations_variance_fields: organizations_variance_fields;
  profiles: profiles;
  profiles_aggregate: profiles_aggregate;
  profiles_aggregate_fields: profiles_aggregate_fields;
  profiles_avg_fields: profiles_avg_fields;
  profiles_max_fields: profiles_max_fields;
  profiles_min_fields: profiles_min_fields;
  profiles_mutation_response: profiles_mutation_response;
  profiles_stddev_fields: profiles_stddev_fields;
  profiles_stddev_pop_fields: profiles_stddev_pop_fields;
  profiles_stddev_samp_fields: profiles_stddev_samp_fields;
  profiles_sum_fields: profiles_sum_fields;
  profiles_var_pop_fields: profiles_var_pop_fields;
  profiles_var_samp_fields: profiles_var_samp_fields;
  profiles_variance_fields: profiles_variance_fields;
  users: users;
  users_aggregate: users_aggregate;
  users_aggregate_fields: users_aggregate_fields;
  users_avg_fields: users_avg_fields;
  users_max_fields: users_max_fields;
  users_min_fields: users_min_fields;
  users_mutation_response: users_mutation_response;
  users_stddev_fields: users_stddev_fields;
  users_stddev_pop_fields: users_stddev_pop_fields;
  users_stddev_samp_fields: users_stddev_samp_fields;
  users_sum_fields: users_sum_fields;
  users_var_pop_fields: users_var_pop_fields;
  users_var_samp_fields: users_var_samp_fields;
  users_variance_fields: users_variance_fields;
}
export type SchemaObjectTypesNames =
  | 'Mutation'
  | 'Query'
  | 'Subscription'
  | 'circles'
  | 'circles_aggregate'
  | 'circles_aggregate_fields'
  | 'circles_avg_fields'
  | 'circles_max_fields'
  | 'circles_min_fields'
  | 'circles_mutation_response'
  | 'circles_stddev_fields'
  | 'circles_stddev_pop_fields'
  | 'circles_stddev_samp_fields'
  | 'circles_sum_fields'
  | 'circles_var_pop_fields'
  | 'circles_var_samp_fields'
  | 'circles_variance_fields'
  | 'organizations'
  | 'organizations_aggregate'
  | 'organizations_aggregate_fields'
  | 'organizations_avg_fields'
  | 'organizations_max_fields'
  | 'organizations_min_fields'
  | 'organizations_mutation_response'
  | 'organizations_stddev_fields'
  | 'organizations_stddev_pop_fields'
  | 'organizations_stddev_samp_fields'
  | 'organizations_sum_fields'
  | 'organizations_var_pop_fields'
  | 'organizations_var_samp_fields'
  | 'organizations_variance_fields'
  | 'profiles'
  | 'profiles_aggregate'
  | 'profiles_aggregate_fields'
  | 'profiles_avg_fields'
  | 'profiles_max_fields'
  | 'profiles_min_fields'
  | 'profiles_mutation_response'
  | 'profiles_stddev_fields'
  | 'profiles_stddev_pop_fields'
  | 'profiles_stddev_samp_fields'
  | 'profiles_sum_fields'
  | 'profiles_var_pop_fields'
  | 'profiles_var_samp_fields'
  | 'profiles_variance_fields'
  | 'users'
  | 'users_aggregate'
  | 'users_aggregate_fields'
  | 'users_avg_fields'
  | 'users_max_fields'
  | 'users_min_fields'
  | 'users_mutation_response'
  | 'users_stddev_fields'
  | 'users_stddev_pop_fields'
  | 'users_stddev_samp_fields'
  | 'users_sum_fields'
  | 'users_var_pop_fields'
  | 'users_var_samp_fields'
  | 'users_variance_fields';

export interface GeneratedSchema {
  query: Query;
  mutation: Mutation;
  subscription: Subscription;
}

export type MakeNullable<T> = {
  [K in keyof T]: T[K] | undefined;
};

export interface ScalarsEnums extends MakeNullable<Scalars> {
  circles_constraint: circles_constraint | undefined;
  circles_select_column: circles_select_column | undefined;
  circles_update_column: circles_update_column | undefined;
  order_by: order_by | undefined;
  organizations_constraint: organizations_constraint | undefined;
  organizations_select_column: organizations_select_column | undefined;
  organizations_update_column: organizations_update_column | undefined;
  profiles_constraint: profiles_constraint | undefined;
  profiles_select_column: profiles_select_column | undefined;
  profiles_update_column: profiles_update_column | undefined;
  users_constraint: users_constraint | undefined;
  users_select_column: users_select_column | undefined;
  users_update_column: users_update_column | undefined;
}
