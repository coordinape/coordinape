/* eslint-disable */

import { AllTypesProps, ReturnTypes } from './const';
type ZEUS_INTERFACES = never;
type ZEUS_UNIONS = never;

export type ValueTypes = {
  ['AdminUpdateUserInput']: {
    address: string;
    circle_id: number;
    fixed_non_receiver?: boolean | null;
    name?: string | null;
    new_address?: string | null;
    non_giver?: boolean | null;
    non_receiver?: boolean | null;
    role?: number | null;
    starting_tokens?: number | null;
  };
  ['Allocation']: {
    note: string;
    recipient_id: number;
    tokens: number;
  };
  ['Allocations']: {
    allocations?: ValueTypes['Allocation'][];
    circle_id: number;
  };
  ['AllocationsResponse']: AliasType<{
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
  ['Boolean_comparison_exp']: {
    _eq?: boolean | null;
    _gt?: boolean | null;
    _gte?: boolean | null;
    _in?: boolean[];
    _is_null?: boolean | null;
    _lt?: boolean | null;
    _lte?: boolean | null;
    _neq?: boolean | null;
    _nin?: boolean[];
  };
  ['ConfirmationResponse']: AliasType<{
    success?: boolean;
    __typename?: boolean;
  }>;
  ['CreateCircleInput']: {
    circle_name: string;
    contact?: string | null;
    protocol_id?: number | null;
    protocol_name?: string | null;
    user_name: string;
  };
  ['CreateCircleResponse']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    id?: boolean;
    users?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['users_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['users_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['users_bool_exp'] | null;
      },
      ValueTypes['users']
    ];
    __typename?: boolean;
  }>;
  ['CreateEpochInput']: {
    circle_id: number;
    days: number;
    grant?: number | null;
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
    id?: boolean;
    /** An object relationship */
    nominee?: ValueTypes['nominees'];
    __typename?: boolean;
  }>;
  ['CreateUserInput']: {
    address: string;
    circle_id: number;
    fixed_non_receiver?: boolean | null;
    name: string;
    non_giver?: boolean | null;
    non_receiver?: boolean | null;
    role?: number | null;
    starting_tokens?: number | null;
  };
  ['DeleteEpochInput']: {
    circle_id: number;
    id: number;
  };
  ['DeleteEpochResponse']: AliasType<{
    success?: boolean;
    __typename?: boolean;
  }>;
  ['DeleteUserInput']: {
    address: string;
    circle_id: number;
  };
  ['EpochResponse']: AliasType<{
    /** An object relationship */
    epoch?: ValueTypes['epochs'];
    id?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
  ['Int_comparison_exp']: {
    _eq?: number | null;
    _gt?: number | null;
    _gte?: number | null;
    _in?: number[];
    _is_null?: boolean | null;
    _lt?: number | null;
    _lte?: number | null;
    _neq?: number | null;
    _nin?: number[];
  };
  ['LogoutResponse']: AliasType<{
    id?: boolean;
    /** An object relationship */
    profile?: ValueTypes['profiles'];
    __typename?: boolean;
  }>;
  /** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
  ['String_comparison_exp']: {
    _eq?: string | null;
    _gt?: string | null;
    _gte?: string | null;
    /** does the column match the given case-insensitive pattern */
    _ilike?: string | null;
    _in?: string[];
    /** does the column match the given POSIX regular expression, case insensitive */
    _iregex?: string | null;
    _is_null?: boolean | null;
    /** does the column match the given pattern */
    _like?: string | null;
    _lt?: string | null;
    _lte?: string | null;
    _neq?: string | null;
    /** does the column NOT match the given case-insensitive pattern */
    _nilike?: string | null;
    _nin?: string[];
    /** does the column NOT match the given POSIX regular expression, case insensitive */
    _niregex?: string | null;
    /** does the column NOT match the given pattern */
    _nlike?: string | null;
    /** does the column NOT match the given POSIX regular expression, case sensitive */
    _nregex?: string | null;
    /** does the column NOT match the given SQL regular expression */
    _nsimilar?: string | null;
    /** does the column match the given POSIX regular expression, case sensitive */
    _regex?: string | null;
    /** does the column match the given SQL regular expression */
    _similar?: string | null;
  };
  ['UpdateCircleInput']: {
    alloc_text?: string | null;
    auto_opt_out?: boolean | null;
    circle_id: number;
    default_opt_in?: boolean | null;
    discord_webhook?: string | null;
    min_vouches?: number | null;
    name?: string | null;
    nomination_days_limit?: number | null;
    only_giver_vouch?: boolean | null;
    team_sel_text?: string | null;
    team_selection?: boolean | null;
    token_name?: string | null;
    update_webhook?: boolean | null;
    vouching?: boolean | null;
    vouching_text?: string | null;
  };
  ['UpdateCircleOutput']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    id?: boolean;
    __typename?: boolean;
  }>;
  ['UpdateCircleResponse']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    id?: boolean;
    __typename?: boolean;
  }>;
  ['UpdateEpochInput']: {
    circle_id: number;
    days: number;
    grant?: number | null;
    id: number;
    repeat: number;
    start_date: ValueTypes['timestamptz'];
  };
  ['UpdateProfileResponse']: AliasType<{
    id?: boolean;
    /** An object relationship */
    profile?: ValueTypes['profiles'];
    __typename?: boolean;
  }>;
  ['UpdateTeammatesInput']: {
    circle_id: number;
    teammates?: number[];
  };
  ['UpdateTeammatesResponse']: AliasType<{
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean;
    __typename?: boolean;
  }>;
  ['UpdateUserInput']: {
    bio?: string | null;
    circle_id: number;
    epoch_first_visit?: boolean | null;
    non_receiver?: boolean | null;
  };
  ['UploadCircleImageInput']: {
    circle_id: number;
    image_data_base64: string;
  };
  ['UploadImageInput']: {
    image_data_base64: string;
  };
  ['UserResponse']: AliasType<{
    /** An object relationship */
    UserResponse?: ValueTypes['users'];
    id?: boolean;
    __typename?: boolean;
  }>;
  ['VouchInput']: {
    nominee_id: number;
  };
  ['VouchOutput']: AliasType<{
    id?: boolean;
    /** An object relationship */
    nominee?: ValueTypes['nominees'];
    __typename?: boolean;
  }>;
  ['bigint']: number;
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_comparison_exp']: {
    _eq?: ValueTypes['bigint'] | null;
    _gt?: ValueTypes['bigint'] | null;
    _gte?: ValueTypes['bigint'] | null;
    _in?: ValueTypes['bigint'][];
    _is_null?: boolean | null;
    _lt?: ValueTypes['bigint'] | null;
    _lte?: ValueTypes['bigint'] | null;
    _neq?: ValueTypes['bigint'] | null;
    _nin?: ValueTypes['bigint'][];
  };
  /** columns and relationships of "burns" */
  ['burns']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean;
    created_at?: boolean;
    /** An object relationship */
    epoch?: ValueTypes['epochs'];
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    updated_at?: boolean;
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "burns" */
  ['burns_aggregate_order_by']: {
    avg?: ValueTypes['burns_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['burns_max_order_by'] | null;
    min?: ValueTypes['burns_min_order_by'] | null;
    stddev?: ValueTypes['burns_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['burns_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['burns_stddev_samp_order_by'] | null;
    sum?: ValueTypes['burns_sum_order_by'] | null;
    var_pop?: ValueTypes['burns_var_pop_order_by'] | null;
    var_samp?: ValueTypes['burns_var_samp_order_by'] | null;
    variance?: ValueTypes['burns_variance_order_by'] | null;
  };
  /** order by avg() on columns of table "burns" */
  ['burns_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "burns". All fields are combined with a logical 'AND'. */
  ['burns_bool_exp']: {
    _and?: ValueTypes['burns_bool_exp'][];
    _not?: ValueTypes['burns_bool_exp'] | null;
    _or?: ValueTypes['burns_bool_exp'][];
    circle?: ValueTypes['circles_bool_exp'] | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    epoch?: ValueTypes['epochs_bool_exp'] | null;
    epoch_id?: ValueTypes['bigint_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    original_amount?: ValueTypes['Int_comparison_exp'] | null;
    regift_percent?: ValueTypes['Int_comparison_exp'] | null;
    tokens_burnt?: ValueTypes['Int_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
    user?: ValueTypes['users_bool_exp'] | null;
    user_id?: ValueTypes['bigint_comparison_exp'] | null;
  };
  /** order by max() on columns of table "burns" */
  ['burns_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by min() on columns of table "burns" */
  ['burns_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** Ordering options when selecting data from "burns". */
  ['burns_order_by']: {
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    epoch?: ValueTypes['epochs_order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user?: ValueTypes['users_order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "burns" */
  ['burns_select_column']: burns_select_column;
  /** order by stddev() on columns of table "burns" */
  ['burns_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_pop() on columns of table "burns" */
  ['burns_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_samp() on columns of table "burns" */
  ['burns_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by sum() on columns of table "burns" */
  ['burns_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_pop() on columns of table "burns" */
  ['burns_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_samp() on columns of table "burns" */
  ['burns_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by variance() on columns of table "burns" */
  ['burns_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    original_amount?: ValueTypes['order_by'] | null;
    regift_percent?: ValueTypes['order_by'] | null;
    tokens_burnt?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** columns and relationships of "circle_integrations" */
  ['circle_integrations']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean;
    data?: [
      {
        /** JSON select path */ path?: string | null;
      },
      boolean
    ];
    id?: boolean;
    name?: boolean;
    type?: boolean;
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "circle_integrations" */
  ['circle_integrations_aggregate_order_by']: {
    avg?: ValueTypes['circle_integrations_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['circle_integrations_max_order_by'] | null;
    min?: ValueTypes['circle_integrations_min_order_by'] | null;
    stddev?: ValueTypes['circle_integrations_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['circle_integrations_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['circle_integrations_stddev_samp_order_by'] | null;
    sum?: ValueTypes['circle_integrations_sum_order_by'] | null;
    var_pop?: ValueTypes['circle_integrations_var_pop_order_by'] | null;
    var_samp?: ValueTypes['circle_integrations_var_samp_order_by'] | null;
    variance?: ValueTypes['circle_integrations_variance_order_by'] | null;
  };
  /** order by avg() on columns of table "circle_integrations" */
  ['circle_integrations_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "circle_integrations". All fields are combined with a logical 'AND'. */
  ['circle_integrations_bool_exp']: {
    _and?: ValueTypes['circle_integrations_bool_exp'][];
    _not?: ValueTypes['circle_integrations_bool_exp'] | null;
    _or?: ValueTypes['circle_integrations_bool_exp'][];
    circle?: ValueTypes['circles_bool_exp'] | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | null;
    data?: ValueTypes['json_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    name?: ValueTypes['String_comparison_exp'] | null;
    type?: ValueTypes['String_comparison_exp'] | null;
  };
  /** input type for inserting data into table "circle_integrations" */
  ['circle_integrations_insert_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    data?: ValueTypes['json'] | null;
    name?: string | null;
    type?: string | null;
  };
  /** order by max() on columns of table "circle_integrations" */
  ['circle_integrations_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    type?: ValueTypes['order_by'] | null;
  };
  /** order by min() on columns of table "circle_integrations" */
  ['circle_integrations_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    type?: ValueTypes['order_by'] | null;
  };
  /** response of any mutation on the table "circle_integrations" */
  ['circle_integrations_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['circle_integrations'];
    __typename?: boolean;
  }>;
  /** Ordering options when selecting data from "circle_integrations". */
  ['circle_integrations_order_by']: {
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    data?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    type?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "circle_integrations" */
  ['circle_integrations_select_column']: circle_integrations_select_column;
  /** order by stddev() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_pop() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_samp() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** order by sum() on columns of table "circle_integrations" */
  ['circle_integrations_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** order by var_pop() on columns of table "circle_integrations" */
  ['circle_integrations_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** order by var_samp() on columns of table "circle_integrations" */
  ['circle_integrations_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** order by variance() on columns of table "circle_integrations" */
  ['circle_integrations_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** columns and relationships of "circle_private" */
  ['circle_private']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean;
    discord_webhook?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to filter rows from the table "circle_private". All fields are combined with a logical 'AND'. */
  ['circle_private_bool_exp']: {
    _and?: ValueTypes['circle_private_bool_exp'][];
    _not?: ValueTypes['circle_private_bool_exp'] | null;
    _or?: ValueTypes['circle_private_bool_exp'][];
    circle?: ValueTypes['circles_bool_exp'] | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | null;
    discord_webhook?: ValueTypes['String_comparison_exp'] | null;
  };
  /** Ordering options when selecting data from "circle_private". */
  ['circle_private_order_by']: {
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    discord_webhook?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "circle_private" */
  ['circle_private_select_column']: circle_private_select_column;
  /** columns and relationships of "circles" */
  ['circles']: AliasType<{
    alloc_text?: boolean;
    auto_opt_out?: boolean;
    burns?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['burns_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['burns_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['burns_bool_exp'] | null;
      },
      ValueTypes['burns']
    ];
    /** An object relationship */
    circle_private?: ValueTypes['circle_private'];
    created_at?: boolean;
    default_opt_in?: boolean;
    epochs?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['epochs_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['epochs_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['epochs_bool_exp'] | null;
      },
      ValueTypes['epochs']
    ];
    id?: boolean;
    integrations?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circle_integrations_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_integrations_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_integrations_bool_exp'] | null;
      },
      ValueTypes['circle_integrations']
    ];
    is_verified?: boolean;
    logo?: boolean;
    min_vouches?: boolean;
    name?: boolean;
    nomination_days_limit?: boolean;
    nominees?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['nominees_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['nominees_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | null;
      },
      ValueTypes['nominees']
    ];
    nominees_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['nominees_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['nominees_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | null;
      },
      ValueTypes['nominees_aggregate']
    ];
    only_giver_vouch?: boolean;
    /** An object relationship */
    organization?: ValueTypes['organizations'];
    pending_token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['pending_token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['pending_token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    protocol_id?: boolean;
    team_sel_text?: boolean;
    team_selection?: boolean;
    token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts']
    ];
    token_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    token_name?: boolean;
    updated_at?: boolean;
    users?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['users_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['users_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['users_bool_exp'] | null;
      },
      ValueTypes['users']
    ];
    vouching?: boolean;
    vouching_text?: boolean;
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "circles" */
  ['circles_aggregate_order_by']: {
    avg?: ValueTypes['circles_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['circles_max_order_by'] | null;
    min?: ValueTypes['circles_min_order_by'] | null;
    stddev?: ValueTypes['circles_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['circles_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['circles_stddev_samp_order_by'] | null;
    sum?: ValueTypes['circles_sum_order_by'] | null;
    var_pop?: ValueTypes['circles_var_pop_order_by'] | null;
    var_samp?: ValueTypes['circles_var_samp_order_by'] | null;
    variance?: ValueTypes['circles_variance_order_by'] | null;
  };
  /** order by avg() on columns of table "circles" */
  ['circles_avg_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "circles". All fields are combined with a logical 'AND'. */
  ['circles_bool_exp']: {
    _and?: ValueTypes['circles_bool_exp'][];
    _not?: ValueTypes['circles_bool_exp'] | null;
    _or?: ValueTypes['circles_bool_exp'][];
    alloc_text?: ValueTypes['String_comparison_exp'] | null;
    auto_opt_out?: ValueTypes['Boolean_comparison_exp'] | null;
    burns?: ValueTypes['burns_bool_exp'] | null;
    circle_private?: ValueTypes['circle_private_bool_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    default_opt_in?: ValueTypes['Boolean_comparison_exp'] | null;
    epochs?: ValueTypes['epochs_bool_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    integrations?: ValueTypes['circle_integrations_bool_exp'] | null;
    is_verified?: ValueTypes['Boolean_comparison_exp'] | null;
    logo?: ValueTypes['String_comparison_exp'] | null;
    min_vouches?: ValueTypes['Int_comparison_exp'] | null;
    name?: ValueTypes['String_comparison_exp'] | null;
    nomination_days_limit?: ValueTypes['Int_comparison_exp'] | null;
    nominees?: ValueTypes['nominees_bool_exp'] | null;
    only_giver_vouch?: ValueTypes['Boolean_comparison_exp'] | null;
    organization?: ValueTypes['organizations_bool_exp'] | null;
    pending_token_gifts?: ValueTypes['pending_token_gifts_bool_exp'] | null;
    protocol_id?: ValueTypes['Int_comparison_exp'] | null;
    team_sel_text?: ValueTypes['String_comparison_exp'] | null;
    team_selection?: ValueTypes['Boolean_comparison_exp'] | null;
    token_gifts?: ValueTypes['token_gifts_bool_exp'] | null;
    token_name?: ValueTypes['String_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
    users?: ValueTypes['users_bool_exp'] | null;
    vouching?: ValueTypes['Boolean_comparison_exp'] | null;
    vouching_text?: ValueTypes['String_comparison_exp'] | null;
  };
  /** input type for incrementing numeric columns in table "circles" */
  ['circles_inc_input']: {
    min_vouches?: number | null;
    nomination_days_limit?: number | null;
  };
  /** order by max() on columns of table "circles" */
  ['circles_max_order_by']: {
    alloc_text?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    logo?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
    team_sel_text?: ValueTypes['order_by'] | null;
    token_name?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    vouching_text?: ValueTypes['order_by'] | null;
  };
  /** order by min() on columns of table "circles" */
  ['circles_min_order_by']: {
    alloc_text?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    logo?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
    team_sel_text?: ValueTypes['order_by'] | null;
    token_name?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    vouching_text?: ValueTypes['order_by'] | null;
  };
  /** response of any mutation on the table "circles" */
  ['circles_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['circles'];
    __typename?: boolean;
  }>;
  /** Ordering options when selecting data from "circles". */
  ['circles_order_by']: {
    alloc_text?: ValueTypes['order_by'] | null;
    auto_opt_out?: ValueTypes['order_by'] | null;
    burns_aggregate?: ValueTypes['burns_aggregate_order_by'] | null;
    circle_private?: ValueTypes['circle_private_order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    default_opt_in?: ValueTypes['order_by'] | null;
    epochs_aggregate?: ValueTypes['epochs_aggregate_order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    integrations_aggregate?:
      | ValueTypes['circle_integrations_aggregate_order_by']
      | null;
    is_verified?: ValueTypes['order_by'] | null;
    logo?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    nominees_aggregate?: ValueTypes['nominees_aggregate_order_by'] | null;
    only_giver_vouch?: ValueTypes['order_by'] | null;
    organization?: ValueTypes['organizations_order_by'] | null;
    pending_token_gifts_aggregate?:
      | ValueTypes['pending_token_gifts_aggregate_order_by']
      | null;
    protocol_id?: ValueTypes['order_by'] | null;
    team_sel_text?: ValueTypes['order_by'] | null;
    team_selection?: ValueTypes['order_by'] | null;
    token_gifts_aggregate?: ValueTypes['token_gifts_aggregate_order_by'] | null;
    token_name?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    users_aggregate?: ValueTypes['users_aggregate_order_by'] | null;
    vouching?: ValueTypes['order_by'] | null;
    vouching_text?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: circles */
  ['circles_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "circles" */
  ['circles_select_column']: circles_select_column;
  /** input type for updating data in table "circles" */
  ['circles_set_input']: {
    alloc_text?: string | null;
    auto_opt_out?: boolean | null;
    default_opt_in?: boolean | null;
    discord_webhook?: string | null;
    is_verified?: boolean | null;
    logo?: string | null;
    min_vouches?: number | null;
    name?: string | null;
    nomination_days_limit?: number | null;
    only_giver_vouch?: boolean | null;
    team_sel_text?: string | null;
    team_selection?: boolean | null;
    token_name?: string | null;
    vouching?: boolean | null;
    vouching_text?: string | null;
  };
  /** order by stddev() on columns of table "circles" */
  ['circles_stddev_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_pop() on columns of table "circles" */
  ['circles_stddev_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_samp() on columns of table "circles" */
  ['circles_stddev_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** order by sum() on columns of table "circles" */
  ['circles_sum_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_pop() on columns of table "circles" */
  ['circles_var_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_samp() on columns of table "circles" */
  ['circles_var_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** order by variance() on columns of table "circles" */
  ['circles_variance_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** columns and relationships of "claims" */
  ['claims']: AliasType<{
    address?: boolean;
    amount?: boolean;
    claimed?: boolean;
    /** An object relationship */
    createdByUser?: ValueTypes['users'];
    created_at?: boolean;
    created_by?: boolean;
    /** An object relationship */
    distribution?: ValueTypes['distributions'];
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    proof?: boolean;
    /** An object relationship */
    updatedByUser?: ValueTypes['users'];
    updated_at?: boolean;
    updated_by?: boolean;
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "claims" */
  ['claims_aggregate_order_by']: {
    avg?: ValueTypes['claims_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['claims_max_order_by'] | null;
    min?: ValueTypes['claims_min_order_by'] | null;
    stddev?: ValueTypes['claims_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['claims_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['claims_stddev_samp_order_by'] | null;
    sum?: ValueTypes['claims_sum_order_by'] | null;
    var_pop?: ValueTypes['claims_var_pop_order_by'] | null;
    var_samp?: ValueTypes['claims_var_samp_order_by'] | null;
    variance?: ValueTypes['claims_variance_order_by'] | null;
  };
  /** input type for inserting array relation for remote table "claims" */
  ['claims_arr_rel_insert_input']: {
    data: ValueTypes['claims_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['claims_on_conflict'] | null;
  };
  /** order by avg() on columns of table "claims" */
  ['claims_avg_order_by']: {
    amount?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "claims". All fields are combined with a logical 'AND'. */
  ['claims_bool_exp']: {
    _and?: ValueTypes['claims_bool_exp'][];
    _not?: ValueTypes['claims_bool_exp'] | null;
    _or?: ValueTypes['claims_bool_exp'][];
    address?: ValueTypes['String_comparison_exp'] | null;
    amount?: ValueTypes['numeric_comparison_exp'] | null;
    claimed?: ValueTypes['Boolean_comparison_exp'] | null;
    createdByUser?: ValueTypes['users_bool_exp'] | null;
    created_at?: ValueTypes['timestamptz_comparison_exp'] | null;
    created_by?: ValueTypes['bigint_comparison_exp'] | null;
    distribution?: ValueTypes['distributions_bool_exp'] | null;
    distribution_id?: ValueTypes['bigint_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    index?: ValueTypes['bigint_comparison_exp'] | null;
    new_amount?: ValueTypes['numeric_comparison_exp'] | null;
    proof?: ValueTypes['String_comparison_exp'] | null;
    updatedByUser?: ValueTypes['users_bool_exp'] | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | null;
    updated_by?: ValueTypes['bigint_comparison_exp'] | null;
    user?: ValueTypes['users_bool_exp'] | null;
    user_id?: ValueTypes['bigint_comparison_exp'] | null;
  };
  /** unique or primary key constraints on table "claims" */
  ['claims_constraint']: claims_constraint;
  /** input type for inserting data into table "claims" */
  ['claims_insert_input']: {
    address?: string | null;
    amount?: ValueTypes['numeric'] | null;
    distribution?: ValueTypes['distributions_obj_rel_insert_input'] | null;
    id?: ValueTypes['bigint'] | null;
    index?: ValueTypes['bigint'] | null;
    new_amount?: ValueTypes['numeric'] | null;
    proof?: string | null;
    user_id?: ValueTypes['bigint'] | null;
  };
  /** order by max() on columns of table "claims" */
  ['claims_max_order_by']: {
    address?: ValueTypes['order_by'] | null;
    amount?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    proof?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by min() on columns of table "claims" */
  ['claims_min_order_by']: {
    address?: ValueTypes['order_by'] | null;
    amount?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    proof?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** response of any mutation on the table "claims" */
  ['claims_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['claims'];
    __typename?: boolean;
  }>;
  /** on conflict condition type for table "claims" */
  ['claims_on_conflict']: {
    constraint: ValueTypes['claims_constraint'];
    update_columns: ValueTypes['claims_update_column'][];
    where?: ValueTypes['claims_bool_exp'] | null;
  };
  /** Ordering options when selecting data from "claims". */
  ['claims_order_by']: {
    address?: ValueTypes['order_by'] | null;
    amount?: ValueTypes['order_by'] | null;
    claimed?: ValueTypes['order_by'] | null;
    createdByUser?: ValueTypes['users_order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution?: ValueTypes['distributions_order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    proof?: ValueTypes['order_by'] | null;
    updatedByUser?: ValueTypes['users_order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user?: ValueTypes['users_order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: claims */
  ['claims_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "claims" */
  ['claims_select_column']: claims_select_column;
  /** input type for updating data in table "claims" */
  ['claims_set_input']: {
    claimed?: boolean | null;
  };
  /** order by stddev() on columns of table "claims" */
  ['claims_stddev_order_by']: {
    amount?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_pop() on columns of table "claims" */
  ['claims_stddev_pop_order_by']: {
    amount?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_samp() on columns of table "claims" */
  ['claims_stddev_samp_order_by']: {
    amount?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by sum() on columns of table "claims" */
  ['claims_sum_order_by']: {
    amount?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** update columns of table "claims" */
  ['claims_update_column']: claims_update_column;
  /** order by var_pop() on columns of table "claims" */
  ['claims_var_pop_order_by']: {
    amount?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_samp() on columns of table "claims" */
  ['claims_var_samp_order_by']: {
    amount?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by variance() on columns of table "claims" */
  ['claims_variance_order_by']: {
    amount?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    index?: ValueTypes['order_by'] | null;
    new_amount?: ValueTypes['order_by'] | null;
    updated_by?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  ['date']: unknown;
  /** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
  ['date_comparison_exp']: {
    _eq?: ValueTypes['date'] | null;
    _gt?: ValueTypes['date'] | null;
    _gte?: ValueTypes['date'] | null;
    _in?: ValueTypes['date'][];
    _is_null?: boolean | null;
    _lt?: ValueTypes['date'] | null;
    _lte?: ValueTypes['date'] | null;
    _neq?: ValueTypes['date'] | null;
    _nin?: ValueTypes['date'][];
  };
  /** Vault Distributions


columns and relationships of "distributions" */
  ['distributions']: AliasType<{
    claims?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['claims_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['claims_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['claims_bool_exp'] | null;
      },
      ValueTypes['claims']
    ];
    created_at?: boolean;
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    distribution_json?: [
      {
        /** JSON select path */ path?: string | null;
      },
      boolean
    ];
    /** An object relationship */
    epoch?: ValueTypes['epochs'];
    epoch_id?: boolean;
    id?: boolean;
    merkle_root?: boolean;
    saved_on_chain?: boolean;
    total_amount?: boolean;
    /** An object relationship */
    vault?: ValueTypes['vaults'];
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to filter rows from the table "distributions". All fields are combined with a logical 'AND'. */
  ['distributions_bool_exp']: {
    _and?: ValueTypes['distributions_bool_exp'][];
    _not?: ValueTypes['distributions_bool_exp'] | null;
    _or?: ValueTypes['distributions_bool_exp'][];
    claims?: ValueTypes['claims_bool_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    created_by?: ValueTypes['bigint_comparison_exp'] | null;
    distribution_epoch_id?: ValueTypes['bigint_comparison_exp'] | null;
    distribution_json?: ValueTypes['jsonb_comparison_exp'] | null;
    epoch?: ValueTypes['epochs_bool_exp'] | null;
    epoch_id?: ValueTypes['bigint_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    merkle_root?: ValueTypes['String_comparison_exp'] | null;
    saved_on_chain?: ValueTypes['Boolean_comparison_exp'] | null;
    total_amount?: ValueTypes['numeric_comparison_exp'] | null;
    vault?: ValueTypes['vaults_bool_exp'] | null;
    vault_id?: ValueTypes['bigint_comparison_exp'] | null;
  };
  /** unique or primary key constraints on table "distributions" */
  ['distributions_constraint']: distributions_constraint;
  /** input type for incrementing numeric columns in table "distributions" */
  ['distributions_inc_input']: {
    distribution_epoch_id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "distributions" */
  ['distributions_insert_input']: {
    claims?: ValueTypes['claims_arr_rel_insert_input'] | null;
    distribution_epoch_id?: ValueTypes['bigint'] | null;
    distribution_json?: ValueTypes['jsonb'] | null;
    epoch_id?: ValueTypes['bigint'] | null;
    merkle_root?: string | null;
    total_amount?: ValueTypes['numeric'] | null;
    vault?: ValueTypes['vaults_obj_rel_insert_input'] | null;
    vault_id?: ValueTypes['bigint'] | null;
  };
  /** response of any mutation on the table "distributions" */
  ['distributions_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['distributions'];
    __typename?: boolean;
  }>;
  /** input type for inserting object relation for remote table "distributions" */
  ['distributions_obj_rel_insert_input']: {
    data: ValueTypes['distributions_insert_input'];
    /** on conflict condition */
    on_conflict?: ValueTypes['distributions_on_conflict'] | null;
  };
  /** on conflict condition type for table "distributions" */
  ['distributions_on_conflict']: {
    constraint: ValueTypes['distributions_constraint'];
    update_columns: ValueTypes['distributions_update_column'][];
    where?: ValueTypes['distributions_bool_exp'] | null;
  };
  /** Ordering options when selecting data from "distributions". */
  ['distributions_order_by']: {
    claims_aggregate?: ValueTypes['claims_aggregate_order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    distribution_epoch_id?: ValueTypes['order_by'] | null;
    distribution_json?: ValueTypes['order_by'] | null;
    epoch?: ValueTypes['epochs_order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    merkle_root?: ValueTypes['order_by'] | null;
    saved_on_chain?: ValueTypes['order_by'] | null;
    total_amount?: ValueTypes['order_by'] | null;
    vault?: ValueTypes['vaults_order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: distributions */
  ['distributions_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "distributions" */
  ['distributions_select_column']: distributions_select_column;
  /** input type for updating data in table "distributions" */
  ['distributions_set_input']: {
    distribution_epoch_id?: ValueTypes['bigint'] | null;
    saved_on_chain?: boolean | null;
  };
  /** update columns of table "distributions" */
  ['distributions_update_column']: distributions_update_column;
  /** columns and relationships of "epoches" */
  ['epochs']: AliasType<{
    burns?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['burns_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['burns_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['burns_bool_exp'] | null;
      },
      ValueTypes['burns']
    ];
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean;
    created_at?: boolean;
    days?: boolean;
    end_date?: boolean;
    ended?: boolean;
    epoch_pending_token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['pending_token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['pending_token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    grant?: boolean;
    id?: boolean;
    notified_before_end?: boolean;
    notified_end?: boolean;
    notified_start?: boolean;
    number?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    start_date?: boolean;
    token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts']
    ];
    token_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "epoches" */
  ['epochs_aggregate_order_by']: {
    avg?: ValueTypes['epochs_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['epochs_max_order_by'] | null;
    min?: ValueTypes['epochs_min_order_by'] | null;
    stddev?: ValueTypes['epochs_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['epochs_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['epochs_stddev_samp_order_by'] | null;
    sum?: ValueTypes['epochs_sum_order_by'] | null;
    var_pop?: ValueTypes['epochs_var_pop_order_by'] | null;
    var_samp?: ValueTypes['epochs_var_samp_order_by'] | null;
    variance?: ValueTypes['epochs_variance_order_by'] | null;
  };
  /** order by avg() on columns of table "epoches" */
  ['epochs_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "epoches". All fields are combined with a logical 'AND'. */
  ['epochs_bool_exp']: {
    _and?: ValueTypes['epochs_bool_exp'][];
    _not?: ValueTypes['epochs_bool_exp'] | null;
    _or?: ValueTypes['epochs_bool_exp'][];
    burns?: ValueTypes['burns_bool_exp'] | null;
    circle?: ValueTypes['circles_bool_exp'] | null;
    circle_id?: ValueTypes['Int_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    days?: ValueTypes['Int_comparison_exp'] | null;
    end_date?: ValueTypes['timestamptz_comparison_exp'] | null;
    ended?: ValueTypes['Boolean_comparison_exp'] | null;
    epoch_pending_token_gifts?:
      | ValueTypes['pending_token_gifts_bool_exp']
      | null;
    grant?: ValueTypes['numeric_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    notified_before_end?: ValueTypes['timestamp_comparison_exp'] | null;
    notified_end?: ValueTypes['timestamp_comparison_exp'] | null;
    notified_start?: ValueTypes['timestamp_comparison_exp'] | null;
    number?: ValueTypes['Int_comparison_exp'] | null;
    repeat?: ValueTypes['Int_comparison_exp'] | null;
    repeat_day_of_month?: ValueTypes['Int_comparison_exp'] | null;
    start_date?: ValueTypes['timestamptz_comparison_exp'] | null;
    token_gifts?: ValueTypes['token_gifts_bool_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** order by max() on columns of table "epoches" */
  ['epochs_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    end_date?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    notified_before_end?: ValueTypes['order_by'] | null;
    notified_end?: ValueTypes['order_by'] | null;
    notified_start?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
    start_date?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** order by min() on columns of table "epoches" */
  ['epochs_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    end_date?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    notified_before_end?: ValueTypes['order_by'] | null;
    notified_end?: ValueTypes['order_by'] | null;
    notified_start?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
    start_date?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** Ordering options when selecting data from "epoches". */
  ['epochs_order_by']: {
    burns_aggregate?: ValueTypes['burns_aggregate_order_by'] | null;
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    end_date?: ValueTypes['order_by'] | null;
    ended?: ValueTypes['order_by'] | null;
    epoch_pending_token_gifts_aggregate?:
      | ValueTypes['pending_token_gifts_aggregate_order_by']
      | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    notified_before_end?: ValueTypes['order_by'] | null;
    notified_end?: ValueTypes['order_by'] | null;
    notified_start?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
    start_date?: ValueTypes['order_by'] | null;
    token_gifts_aggregate?: ValueTypes['token_gifts_aggregate_order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "epoches" */
  ['epochs_select_column']: epochs_select_column;
  /** order by stddev() on columns of table "epoches" */
  ['epochs_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_pop() on columns of table "epoches" */
  ['epochs_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_samp() on columns of table "epoches" */
  ['epochs_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** order by sum() on columns of table "epoches" */
  ['epochs_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** order by var_pop() on columns of table "epoches" */
  ['epochs_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** order by var_samp() on columns of table "epoches" */
  ['epochs_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** order by variance() on columns of table "epoches" */
  ['epochs_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** columns and relationships of "gift_private" */
  ['gift_private']: AliasType<{
    gift_id?: boolean;
    note?: boolean;
    /** An object relationship */
    recipient?: ValueTypes['users'];
    recipient_id?: boolean;
    /** An object relationship */
    sender?: ValueTypes['users'];
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to filter rows from the table "gift_private". All fields are combined with a logical 'AND'. */
  ['gift_private_bool_exp']: {
    _and?: ValueTypes['gift_private_bool_exp'][];
    _not?: ValueTypes['gift_private_bool_exp'] | null;
    _or?: ValueTypes['gift_private_bool_exp'][];
    gift_id?: ValueTypes['bigint_comparison_exp'] | null;
    note?: ValueTypes['String_comparison_exp'] | null;
    recipient?: ValueTypes['users_bool_exp'] | null;
    recipient_id?: ValueTypes['bigint_comparison_exp'] | null;
    sender?: ValueTypes['users_bool_exp'] | null;
    sender_id?: ValueTypes['bigint_comparison_exp'] | null;
  };
  /** Ordering options when selecting data from "gift_private". */
  ['gift_private_order_by']: {
    gift_id?: ValueTypes['order_by'] | null;
    note?: ValueTypes['order_by'] | null;
    recipient?: ValueTypes['users_order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender?: ValueTypes['users_order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "gift_private" */
  ['gift_private_select_column']: gift_private_select_column;
  ['json']: unknown;
  /** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
  ['json_comparison_exp']: {
    _eq?: ValueTypes['json'] | null;
    _gt?: ValueTypes['json'] | null;
    _gte?: ValueTypes['json'] | null;
    _in?: ValueTypes['json'][];
    _is_null?: boolean | null;
    _lt?: ValueTypes['json'] | null;
    _lte?: ValueTypes['json'] | null;
    _neq?: ValueTypes['json'] | null;
    _nin?: ValueTypes['json'][];
  };
  ['jsonb']: unknown;
  /** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
  ['jsonb_comparison_exp']: {
    /** is the column contained in the given json value */
    _contained_in?: ValueTypes['jsonb'] | null;
    /** does the column contain the given json value at the top level */
    _contains?: ValueTypes['jsonb'] | null;
    _eq?: ValueTypes['jsonb'] | null;
    _gt?: ValueTypes['jsonb'] | null;
    _gte?: ValueTypes['jsonb'] | null;
    /** does the string exist as a top-level key in the column */
    _has_key?: string | null;
    /** do all of these strings exist as top-level keys in the column */
    _has_keys_all?: string[];
    /** do any of these strings exist as top-level keys in the column */
    _has_keys_any?: string[];
    _in?: ValueTypes['jsonb'][];
    _is_null?: boolean | null;
    _lt?: ValueTypes['jsonb'] | null;
    _lte?: ValueTypes['jsonb'] | null;
    _neq?: ValueTypes['jsonb'] | null;
    _nin?: ValueTypes['jsonb'][];
  };
  /** mutation root */
  ['mutation_root']: AliasType<{
    adminUpdateUser?: [
      { payload: ValueTypes['AdminUpdateUserInput'] },
      ValueTypes['UserResponse']
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
    deleteEpoch?: [
      { payload: ValueTypes['DeleteEpochInput'] },
      ValueTypes['DeleteEpochResponse']
    ];
    deleteUser?: [
      { payload: ValueTypes['DeleteUserInput'] },
      ValueTypes['ConfirmationResponse']
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
        objects: ValueTypes['circle_integrations_insert_input'][];
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
        objects: ValueTypes['claims_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['claims_on_conflict'] | null;
      },
      ValueTypes['claims_mutation_response']
    ];
    insert_claims_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['claims_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['claims_on_conflict'] | null;
      },
      ValueTypes['claims']
    ];
    insert_distributions?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['distributions_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['distributions_on_conflict'] | null;
      },
      ValueTypes['distributions_mutation_response']
    ];
    insert_distributions_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['distributions_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['distributions_on_conflict'] | null;
      },
      ValueTypes['distributions']
    ];
    insert_vault_transactions?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['vault_transactions_insert_input'][];
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
    insert_vaults?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['vaults_insert_input'][];
      },
      ValueTypes['vaults_mutation_response']
    ];
    insert_vaults_one?: [
      {
        /** the row to be inserted */ object: ValueTypes['vaults_insert_input'];
      },
      ValueTypes['vaults']
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
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['circles_set_input']
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
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['circles_set_input'] | null;
        pk_columns: ValueTypes['circles_pk_columns_input'];
      },
      ValueTypes['circles']
    ];
    update_claims?: [
      {
        /** sets the columns of the filtered rows to the given values */
        _set?:
          | ValueTypes['claims_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['claims_bool_exp'];
      },
      ValueTypes['claims_mutation_response']
    ];
    update_claims_by_pk?: [
      {
        /** sets the columns of the filtered rows to the given values */
        _set?: ValueTypes['claims_set_input'] | null;
        pk_columns: ValueTypes['claims_pk_columns_input'];
      },
      ValueTypes['claims']
    ];
    update_distributions?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['distributions_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['distributions_set_input']
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
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['distributions_set_input'] | null;
        pk_columns: ValueTypes['distributions_pk_columns_input'];
      },
      ValueTypes['distributions']
    ];
    update_profiles?: [
      {
        /** sets the columns of the filtered rows to the given values */
        _set?:
          | ValueTypes['profiles_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['profiles_bool_exp'];
      },
      ValueTypes['profiles_mutation_response']
    ];
    update_profiles_by_pk?: [
      {
        /** sets the columns of the filtered rows to the given values */
        _set?: ValueTypes['profiles_set_input'] | null;
        pk_columns: ValueTypes['profiles_pk_columns_input'];
      },
      ValueTypes['profiles']
    ];
    uploadCircleLogo?: [
      { payload: ValueTypes['UploadCircleImageInput'] },
      ValueTypes['UpdateCircleResponse']
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
    __typename?: boolean;
  }>;
  /** columns and relationships of "nominees" */
  ['nominees']: AliasType<{
    address?: boolean;
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean;
    created_at?: boolean;
    description?: boolean;
    ended?: boolean;
    expiry_date?: boolean;
    id?: boolean;
    name?: boolean;
    nominated_by_user_id?: boolean;
    nominated_date?: boolean;
    nominations?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['vouches_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['vouches_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['vouches_bool_exp'] | null;
      },
      ValueTypes['vouches']
    ];
    /** An object relationship */
    nominator?: ValueTypes['users'];
    updated_at?: boolean;
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** aggregated selection of "nominees" */
  ['nominees_aggregate']: AliasType<{
    aggregate?: ValueTypes['nominees_aggregate_fields'];
    nodes?: ValueTypes['nominees'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "nominees" */
  ['nominees_aggregate_fields']: AliasType<{
    avg?: ValueTypes['nominees_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['nominees_select_column'][];
        distinct?: boolean | null;
      },
      boolean
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
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "nominees" */
  ['nominees_aggregate_order_by']: {
    avg?: ValueTypes['nominees_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['nominees_max_order_by'] | null;
    min?: ValueTypes['nominees_min_order_by'] | null;
    stddev?: ValueTypes['nominees_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['nominees_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['nominees_stddev_samp_order_by'] | null;
    sum?: ValueTypes['nominees_sum_order_by'] | null;
    var_pop?: ValueTypes['nominees_var_pop_order_by'] | null;
    var_samp?: ValueTypes['nominees_var_samp_order_by'] | null;
    variance?: ValueTypes['nominees_variance_order_by'] | null;
  };
  /** aggregate avg on columns */
  ['nominees_avg_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    nominated_by_user_id?: boolean;
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** order by avg() on columns of table "nominees" */
  ['nominees_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "nominees". All fields are combined with a logical 'AND'. */
  ['nominees_bool_exp']: {
    _and?: ValueTypes['nominees_bool_exp'][];
    _not?: ValueTypes['nominees_bool_exp'] | null;
    _or?: ValueTypes['nominees_bool_exp'][];
    address?: ValueTypes['String_comparison_exp'] | null;
    circle?: ValueTypes['circles_bool_exp'] | null;
    circle_id?: ValueTypes['Int_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    description?: ValueTypes['String_comparison_exp'] | null;
    ended?: ValueTypes['Boolean_comparison_exp'] | null;
    expiry_date?: ValueTypes['date_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    name?: ValueTypes['String_comparison_exp'] | null;
    nominated_by_user_id?: ValueTypes['Int_comparison_exp'] | null;
    nominated_date?: ValueTypes['date_comparison_exp'] | null;
    nominations?: ValueTypes['vouches_bool_exp'] | null;
    nominator?: ValueTypes['users_bool_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
    user?: ValueTypes['users_bool_exp'] | null;
    user_id?: ValueTypes['Int_comparison_exp'] | null;
    vouches_required?: ValueTypes['Int_comparison_exp'] | null;
  };
  /** aggregate max on columns */
  ['nominees_max_fields']: AliasType<{
    address?: boolean;
    circle_id?: boolean;
    created_at?: boolean;
    description?: boolean;
    expiry_date?: boolean;
    id?: boolean;
    name?: boolean;
    nominated_by_user_id?: boolean;
    nominated_date?: boolean;
    updated_at?: boolean;
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** order by max() on columns of table "nominees" */
  ['nominees_max_order_by']: {
    address?: ValueTypes['order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    description?: ValueTypes['order_by'] | null;
    expiry_date?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    nominated_date?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  /** aggregate min on columns */
  ['nominees_min_fields']: AliasType<{
    address?: boolean;
    circle_id?: boolean;
    created_at?: boolean;
    description?: boolean;
    expiry_date?: boolean;
    id?: boolean;
    name?: boolean;
    nominated_by_user_id?: boolean;
    nominated_date?: boolean;
    updated_at?: boolean;
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** order by min() on columns of table "nominees" */
  ['nominees_min_order_by']: {
    address?: ValueTypes['order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    description?: ValueTypes['order_by'] | null;
    expiry_date?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    nominated_date?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  /** Ordering options when selecting data from "nominees". */
  ['nominees_order_by']: {
    address?: ValueTypes['order_by'] | null;
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    description?: ValueTypes['order_by'] | null;
    ended?: ValueTypes['order_by'] | null;
    expiry_date?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    nominated_date?: ValueTypes['order_by'] | null;
    nominations_aggregate?: ValueTypes['vouches_aggregate_order_by'] | null;
    nominator?: ValueTypes['users_order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user?: ValueTypes['users_order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "nominees" */
  ['nominees_select_column']: nominees_select_column;
  /** aggregate stddev on columns */
  ['nominees_stddev_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    nominated_by_user_id?: boolean;
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "nominees" */
  ['nominees_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['nominees_stddev_pop_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    nominated_by_user_id?: boolean;
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "nominees" */
  ['nominees_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['nominees_stddev_samp_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    nominated_by_user_id?: boolean;
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "nominees" */
  ['nominees_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['nominees_sum_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    nominated_by_user_id?: boolean;
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "nominees" */
  ['nominees_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_pop on columns */
  ['nominees_var_pop_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    nominated_by_user_id?: boolean;
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "nominees" */
  ['nominees_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['nominees_var_samp_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    nominated_by_user_id?: boolean;
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "nominees" */
  ['nominees_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['nominees_variance_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    nominated_by_user_id?: boolean;
    user_id?: boolean;
    vouches_required?: boolean;
    __typename?: boolean;
  }>;
  /** order by variance() on columns of table "nominees" */
  ['nominees_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominated_by_user_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
    vouches_required?: ValueTypes['order_by'] | null;
  };
  ['numeric']: unknown;
  /** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
  ['numeric_comparison_exp']: {
    _eq?: ValueTypes['numeric'] | null;
    _gt?: ValueTypes['numeric'] | null;
    _gte?: ValueTypes['numeric'] | null;
    _in?: ValueTypes['numeric'][];
    _is_null?: boolean | null;
    _lt?: ValueTypes['numeric'] | null;
    _lte?: ValueTypes['numeric'] | null;
    _neq?: ValueTypes['numeric'] | null;
    _nin?: ValueTypes['numeric'][];
  };
  /** column ordering options */
  ['order_by']: order_by;
  /** columns and relationships of "protocols" */
  ['organizations']: AliasType<{
    circles?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circles_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circles_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circles_bool_exp'] | null;
      },
      ValueTypes['circles']
    ];
    created_at?: boolean;
    id?: boolean;
    name?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
  ['organizations_bool_exp']: {
    _and?: ValueTypes['organizations_bool_exp'][];
    _not?: ValueTypes['organizations_bool_exp'] | null;
    _or?: ValueTypes['organizations_bool_exp'][];
    circles?: ValueTypes['circles_bool_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    name?: ValueTypes['String_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** Ordering options when selecting data from "protocols". */
  ['organizations_order_by']: {
    circles_aggregate?: ValueTypes['circles_aggregate_order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "protocols" */
  ['organizations_select_column']: organizations_select_column;
  /** columns and relationships of "pending_gift_private" */
  ['pending_gift_private']: AliasType<{
    gift_id?: boolean;
    note?: boolean;
    /** An object relationship */
    recipient?: ValueTypes['users'];
    recipient_id?: boolean;
    /** An object relationship */
    sender?: ValueTypes['users'];
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to filter rows from the table "pending_gift_private". All fields are combined with a logical 'AND'. */
  ['pending_gift_private_bool_exp']: {
    _and?: ValueTypes['pending_gift_private_bool_exp'][];
    _not?: ValueTypes['pending_gift_private_bool_exp'] | null;
    _or?: ValueTypes['pending_gift_private_bool_exp'][];
    gift_id?: ValueTypes['bigint_comparison_exp'] | null;
    note?: ValueTypes['String_comparison_exp'] | null;
    recipient?: ValueTypes['users_bool_exp'] | null;
    recipient_id?: ValueTypes['bigint_comparison_exp'] | null;
    sender?: ValueTypes['users_bool_exp'] | null;
    sender_id?: ValueTypes['bigint_comparison_exp'] | null;
  };
  /** Ordering options when selecting data from "pending_gift_private". */
  ['pending_gift_private_order_by']: {
    gift_id?: ValueTypes['order_by'] | null;
    note?: ValueTypes['order_by'] | null;
    recipient?: ValueTypes['users_order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender?: ValueTypes['users_order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "pending_gift_private" */
  ['pending_gift_private_select_column']: pending_gift_private_select_column;
  /** columns and relationships of "pending_token_gifts" */
  ['pending_token_gifts']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean;
    created_at?: boolean;
    dts_created?: boolean;
    /** An object relationship */
    epoch?: ValueTypes['epochs'];
    epoch_id?: boolean;
    /** An object relationship */
    gift_private?: ValueTypes['pending_gift_private'];
    id?: boolean;
    /** An object relationship */
    recipient?: ValueTypes['users'];
    recipient_address?: boolean;
    recipient_id?: boolean;
    /** An object relationship */
    sender?: ValueTypes['users'];
    sender_address?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "pending_token_gifts" */
  ['pending_token_gifts_aggregate_order_by']: {
    avg?: ValueTypes['pending_token_gifts_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['pending_token_gifts_max_order_by'] | null;
    min?: ValueTypes['pending_token_gifts_min_order_by'] | null;
    stddev?: ValueTypes['pending_token_gifts_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['pending_token_gifts_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['pending_token_gifts_stddev_samp_order_by'] | null;
    sum?: ValueTypes['pending_token_gifts_sum_order_by'] | null;
    var_pop?: ValueTypes['pending_token_gifts_var_pop_order_by'] | null;
    var_samp?: ValueTypes['pending_token_gifts_var_samp_order_by'] | null;
    variance?: ValueTypes['pending_token_gifts_variance_order_by'] | null;
  };
  /** order by avg() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "pending_token_gifts". All fields are combined with a logical 'AND'. */
  ['pending_token_gifts_bool_exp']: {
    _and?: ValueTypes['pending_token_gifts_bool_exp'][];
    _not?: ValueTypes['pending_token_gifts_bool_exp'] | null;
    _or?: ValueTypes['pending_token_gifts_bool_exp'][];
    circle?: ValueTypes['circles_bool_exp'] | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    dts_created?: ValueTypes['timestamp_comparison_exp'] | null;
    epoch?: ValueTypes['epochs_bool_exp'] | null;
    epoch_id?: ValueTypes['Int_comparison_exp'] | null;
    gift_private?: ValueTypes['pending_gift_private_bool_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    recipient?: ValueTypes['users_bool_exp'] | null;
    recipient_address?: ValueTypes['String_comparison_exp'] | null;
    recipient_id?: ValueTypes['bigint_comparison_exp'] | null;
    sender?: ValueTypes['users_bool_exp'] | null;
    sender_address?: ValueTypes['String_comparison_exp'] | null;
    sender_id?: ValueTypes['bigint_comparison_exp'] | null;
    tokens?: ValueTypes['Int_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** order by max() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    dts_created?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** order by min() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    dts_created?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** Ordering options when selecting data from "pending_token_gifts". */
  ['pending_token_gifts_order_by']: {
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    dts_created?: ValueTypes['order_by'] | null;
    epoch?: ValueTypes['epochs_order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    gift_private?: ValueTypes['pending_gift_private_order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient?: ValueTypes['users_order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender?: ValueTypes['users_order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "pending_token_gifts" */
  ['pending_token_gifts_select_column']: pending_token_gifts_select_column;
  /** order by stddev() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** order by sum() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** order by var_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** order by var_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** order by variance() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** columns and relationships of "profiles" */
  ['profiles']: AliasType<{
    address?: boolean;
    admin_view?: boolean;
    avatar?: boolean;
    background?: boolean;
    bio?: boolean;
    created_at?: boolean;
    discord_username?: boolean;
    github_username?: boolean;
    id?: boolean;
    medium_username?: boolean;
    skills?: boolean;
    telegram_username?: boolean;
    twitter_username?: boolean;
    updated_at?: boolean;
    users?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['users_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['users_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['users_bool_exp'] | null;
      },
      ValueTypes['users']
    ];
    website?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
  ['profiles_bool_exp']: {
    _and?: ValueTypes['profiles_bool_exp'][];
    _not?: ValueTypes['profiles_bool_exp'] | null;
    _or?: ValueTypes['profiles_bool_exp'][];
    address?: ValueTypes['String_comparison_exp'] | null;
    admin_view?: ValueTypes['Boolean_comparison_exp'] | null;
    avatar?: ValueTypes['String_comparison_exp'] | null;
    background?: ValueTypes['String_comparison_exp'] | null;
    bio?: ValueTypes['String_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    discord_username?: ValueTypes['String_comparison_exp'] | null;
    github_username?: ValueTypes['String_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    medium_username?: ValueTypes['String_comparison_exp'] | null;
    skills?: ValueTypes['String_comparison_exp'] | null;
    telegram_username?: ValueTypes['String_comparison_exp'] | null;
    twitter_username?: ValueTypes['String_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
    users?: ValueTypes['users_bool_exp'] | null;
    website?: ValueTypes['String_comparison_exp'] | null;
  };
  /** response of any mutation on the table "profiles" */
  ['profiles_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['profiles'];
    __typename?: boolean;
  }>;
  /** Ordering options when selecting data from "profiles". */
  ['profiles_order_by']: {
    address?: ValueTypes['order_by'] | null;
    admin_view?: ValueTypes['order_by'] | null;
    avatar?: ValueTypes['order_by'] | null;
    background?: ValueTypes['order_by'] | null;
    bio?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    discord_username?: ValueTypes['order_by'] | null;
    github_username?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    medium_username?: ValueTypes['order_by'] | null;
    skills?: ValueTypes['order_by'] | null;
    telegram_username?: ValueTypes['order_by'] | null;
    twitter_username?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    users_aggregate?: ValueTypes['users_aggregate_order_by'] | null;
    website?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: profiles */
  ['profiles_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "profiles" */
  ['profiles_select_column']: profiles_select_column;
  /** input type for updating data in table "profiles" */
  ['profiles_set_input']: {
    avatar?: string | null;
    background?: string | null;
    bio?: string | null;
    discord_username?: string | null;
    github_username?: string | null;
    medium_username?: string | null;
    skills?: string | null;
    telegram_username?: string | null;
    twitter_username?: string | null;
    website?: string | null;
  };
  ['query_root']: AliasType<{
    burns?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['burns_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['burns_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['burns_bool_exp'] | null;
      },
      ValueTypes['burns']
    ];
    burns_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['burns']];
    circle_integrations?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circle_integrations_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_integrations_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_integrations_bool_exp'] | null;
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
        distinct_on?: ValueTypes['circle_private_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_private_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_private_bool_exp'] | null;
      },
      ValueTypes['circle_private']
    ];
    circles?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circles_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circles_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circles_bool_exp'] | null;
      },
      ValueTypes['circles']
    ];
    circles_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['circles']];
    claims?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['claims_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['claims_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['claims_bool_exp'] | null;
      },
      ValueTypes['claims']
    ];
    claims_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['claims']];
    distributions?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['distributions_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['distributions_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['distributions_bool_exp'] | null;
      },
      ValueTypes['distributions']
    ];
    distributions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['distributions']
    ];
    epochs?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['epochs_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['epochs_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['epochs_bool_exp'] | null;
      },
      ValueTypes['epochs']
    ];
    epochs_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['epochs']];
    gift_private?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['gift_private_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['gift_private_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['gift_private_bool_exp'] | null;
      },
      ValueTypes['gift_private']
    ];
    nominees?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['nominees_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['nominees_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | null;
      },
      ValueTypes['nominees']
    ];
    nominees_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['nominees_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['nominees_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | null;
      },
      ValueTypes['nominees_aggregate']
    ];
    nominees_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['nominees']];
    organizations?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['organizations_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['organizations_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['organizations_bool_exp'] | null;
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
        distinct_on?: ValueTypes['pending_gift_private_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['pending_gift_private_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['pending_gift_private_bool_exp'] | null;
      },
      ValueTypes['pending_gift_private']
    ];
    pending_token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['pending_token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['pending_token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | null;
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
        distinct_on?: ValueTypes['profiles_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['profiles_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['profiles_bool_exp'] | null;
      },
      ValueTypes['profiles']
    ];
    profiles_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['profiles']];
    teammates?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['teammates_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['teammates_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['teammates_bool_exp'] | null;
      },
      ValueTypes['teammates']
    ];
    teammates_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['teammates']];
    token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts']
    ];
    token_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    token_gifts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['token_gifts']
    ];
    users?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['users_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['users_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['users_bool_exp'] | null;
      },
      ValueTypes['users']
    ];
    users_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['users']];
    vault_transactions?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['vault_transactions_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['vault_transactions_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['vault_transactions_bool_exp'] | null;
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
        distinct_on?: ValueTypes['vaults_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['vaults_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['vaults_bool_exp'] | null;
      },
      ValueTypes['vaults']
    ];
    vaults_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['vaults']];
    vouches?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['vouches_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['vouches_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['vouches_bool_exp'] | null;
      },
      ValueTypes['vouches']
    ];
    vouches_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['vouches']];
    __typename?: boolean;
  }>;
  ['subscription_root']: AliasType<{
    burns?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['burns_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['burns_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['burns_bool_exp'] | null;
      },
      ValueTypes['burns']
    ];
    burns_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['burns']];
    circle_integrations?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circle_integrations_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_integrations_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_integrations_bool_exp'] | null;
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
        distinct_on?: ValueTypes['circle_private_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_private_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_private_bool_exp'] | null;
      },
      ValueTypes['circle_private']
    ];
    circles?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circles_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circles_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circles_bool_exp'] | null;
      },
      ValueTypes['circles']
    ];
    circles_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['circles']];
    claims?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['claims_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['claims_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['claims_bool_exp'] | null;
      },
      ValueTypes['claims']
    ];
    claims_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['claims']];
    distributions?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['distributions_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['distributions_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['distributions_bool_exp'] | null;
      },
      ValueTypes['distributions']
    ];
    distributions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['distributions']
    ];
    epochs?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['epochs_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['epochs_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['epochs_bool_exp'] | null;
      },
      ValueTypes['epochs']
    ];
    epochs_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['epochs']];
    gift_private?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['gift_private_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['gift_private_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['gift_private_bool_exp'] | null;
      },
      ValueTypes['gift_private']
    ];
    nominees?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['nominees_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['nominees_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | null;
      },
      ValueTypes['nominees']
    ];
    nominees_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['nominees_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['nominees_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['nominees_bool_exp'] | null;
      },
      ValueTypes['nominees_aggregate']
    ];
    nominees_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['nominees']];
    organizations?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['organizations_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['organizations_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['organizations_bool_exp'] | null;
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
        distinct_on?: ValueTypes['pending_gift_private_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['pending_gift_private_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['pending_gift_private_bool_exp'] | null;
      },
      ValueTypes['pending_gift_private']
    ];
    pending_token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['pending_token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['pending_token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | null;
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
        distinct_on?: ValueTypes['profiles_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['profiles_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['profiles_bool_exp'] | null;
      },
      ValueTypes['profiles']
    ];
    profiles_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['profiles']];
    teammates?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['teammates_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['teammates_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['teammates_bool_exp'] | null;
      },
      ValueTypes['teammates']
    ];
    teammates_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['teammates']];
    token_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts']
    ];
    token_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    token_gifts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['token_gifts']
    ];
    users?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['users_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['users_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['users_bool_exp'] | null;
      },
      ValueTypes['users']
    ];
    users_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['users']];
    vault_transactions?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['vault_transactions_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['vault_transactions_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['vault_transactions_bool_exp'] | null;
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
        distinct_on?: ValueTypes['vaults_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['vaults_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['vaults_bool_exp'] | null;
      },
      ValueTypes['vaults']
    ];
    vaults_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['vaults']];
    vouches?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['vouches_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['vouches_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['vouches_bool_exp'] | null;
      },
      ValueTypes['vouches']
    ];
    vouches_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['vouches']];
    __typename?: boolean;
  }>;
  /** columns and relationships of "teammates" */
  ['teammates']: AliasType<{
    created_at?: boolean;
    id?: boolean;
    team_mate_id?: boolean;
    /** An object relationship */
    teammate?: ValueTypes['users'];
    updated_at?: boolean;
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "teammates" */
  ['teammates_aggregate_order_by']: {
    avg?: ValueTypes['teammates_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['teammates_max_order_by'] | null;
    min?: ValueTypes['teammates_min_order_by'] | null;
    stddev?: ValueTypes['teammates_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['teammates_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['teammates_stddev_samp_order_by'] | null;
    sum?: ValueTypes['teammates_sum_order_by'] | null;
    var_pop?: ValueTypes['teammates_var_pop_order_by'] | null;
    var_samp?: ValueTypes['teammates_var_samp_order_by'] | null;
    variance?: ValueTypes['teammates_variance_order_by'] | null;
  };
  /** order by avg() on columns of table "teammates" */
  ['teammates_avg_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "teammates". All fields are combined with a logical 'AND'. */
  ['teammates_bool_exp']: {
    _and?: ValueTypes['teammates_bool_exp'][];
    _not?: ValueTypes['teammates_bool_exp'] | null;
    _or?: ValueTypes['teammates_bool_exp'][];
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    team_mate_id?: ValueTypes['Int_comparison_exp'] | null;
    teammate?: ValueTypes['users_bool_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
    user?: ValueTypes['users_bool_exp'] | null;
    user_id?: ValueTypes['Int_comparison_exp'] | null;
  };
  /** order by max() on columns of table "teammates" */
  ['teammates_max_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by min() on columns of table "teammates" */
  ['teammates_min_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** Ordering options when selecting data from "teammates". */
  ['teammates_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    teammate?: ValueTypes['users_order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user?: ValueTypes['users_order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "teammates" */
  ['teammates_select_column']: teammates_select_column;
  /** order by stddev() on columns of table "teammates" */
  ['teammates_stddev_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_pop() on columns of table "teammates" */
  ['teammates_stddev_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_samp() on columns of table "teammates" */
  ['teammates_stddev_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by sum() on columns of table "teammates" */
  ['teammates_sum_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_pop() on columns of table "teammates" */
  ['teammates_var_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_samp() on columns of table "teammates" */
  ['teammates_var_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** order by variance() on columns of table "teammates" */
  ['teammates_variance_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  ['timestamp']: unknown;
  /** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
  ['timestamp_comparison_exp']: {
    _eq?: ValueTypes['timestamp'] | null;
    _gt?: ValueTypes['timestamp'] | null;
    _gte?: ValueTypes['timestamp'] | null;
    _in?: ValueTypes['timestamp'][];
    _is_null?: boolean | null;
    _lt?: ValueTypes['timestamp'] | null;
    _lte?: ValueTypes['timestamp'] | null;
    _neq?: ValueTypes['timestamp'] | null;
    _nin?: ValueTypes['timestamp'][];
  };
  ['timestamptz']: unknown;
  /** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
  ['timestamptz_comparison_exp']: {
    _eq?: ValueTypes['timestamptz'] | null;
    _gt?: ValueTypes['timestamptz'] | null;
    _gte?: ValueTypes['timestamptz'] | null;
    _in?: ValueTypes['timestamptz'][];
    _is_null?: boolean | null;
    _lt?: ValueTypes['timestamptz'] | null;
    _lte?: ValueTypes['timestamptz'] | null;
    _neq?: ValueTypes['timestamptz'] | null;
    _nin?: ValueTypes['timestamptz'][];
  };
  /** columns and relationships of "token_gifts" */
  ['token_gifts']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean;
    created_at?: boolean;
    dts_created?: boolean;
    epoch_id?: boolean;
    /** An object relationship */
    gift_private?: ValueTypes['gift_private'];
    id?: boolean;
    /** An object relationship */
    recipient?: ValueTypes['users'];
    recipient_address?: boolean;
    recipient_id?: boolean;
    /** An object relationship */
    sender?: ValueTypes['users'];
    sender_address?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** aggregated selection of "token_gifts" */
  ['token_gifts_aggregate']: AliasType<{
    aggregate?: ValueTypes['token_gifts_aggregate_fields'];
    nodes?: ValueTypes['token_gifts'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "token_gifts" */
  ['token_gifts_aggregate_fields']: AliasType<{
    avg?: ValueTypes['token_gifts_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['token_gifts_select_column'][];
        distinct?: boolean | null;
      },
      boolean
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
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "token_gifts" */
  ['token_gifts_aggregate_order_by']: {
    avg?: ValueTypes['token_gifts_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['token_gifts_max_order_by'] | null;
    min?: ValueTypes['token_gifts_min_order_by'] | null;
    stddev?: ValueTypes['token_gifts_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['token_gifts_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['token_gifts_stddev_samp_order_by'] | null;
    sum?: ValueTypes['token_gifts_sum_order_by'] | null;
    var_pop?: ValueTypes['token_gifts_var_pop_order_by'] | null;
    var_samp?: ValueTypes['token_gifts_var_samp_order_by'] | null;
    variance?: ValueTypes['token_gifts_variance_order_by'] | null;
  };
  /** aggregate avg on columns */
  ['token_gifts_avg_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by avg() on columns of table "token_gifts" */
  ['token_gifts_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "token_gifts". All fields are combined with a logical 'AND'. */
  ['token_gifts_bool_exp']: {
    _and?: ValueTypes['token_gifts_bool_exp'][];
    _not?: ValueTypes['token_gifts_bool_exp'] | null;
    _or?: ValueTypes['token_gifts_bool_exp'][];
    circle?: ValueTypes['circles_bool_exp'] | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    dts_created?: ValueTypes['timestamp_comparison_exp'] | null;
    epoch_id?: ValueTypes['Int_comparison_exp'] | null;
    gift_private?: ValueTypes['gift_private_bool_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    recipient?: ValueTypes['users_bool_exp'] | null;
    recipient_address?: ValueTypes['String_comparison_exp'] | null;
    recipient_id?: ValueTypes['bigint_comparison_exp'] | null;
    sender?: ValueTypes['users_bool_exp'] | null;
    sender_address?: ValueTypes['String_comparison_exp'] | null;
    sender_id?: ValueTypes['bigint_comparison_exp'] | null;
    tokens?: ValueTypes['Int_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** aggregate max on columns */
  ['token_gifts_max_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    dts_created?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_address?: boolean;
    recipient_id?: boolean;
    sender_address?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** order by max() on columns of table "token_gifts" */
  ['token_gifts_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    dts_created?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** aggregate min on columns */
  ['token_gifts_min_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    dts_created?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_address?: boolean;
    recipient_id?: boolean;
    sender_address?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** order by min() on columns of table "token_gifts" */
  ['token_gifts_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    dts_created?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** Ordering options when selecting data from "token_gifts". */
  ['token_gifts_order_by']: {
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    dts_created?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    gift_private?: ValueTypes['gift_private_order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient?: ValueTypes['users_order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender?: ValueTypes['users_order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "token_gifts" */
  ['token_gifts_select_column']: token_gifts_select_column;
  /** aggregate stddev on columns */
  ['token_gifts_stddev_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "token_gifts" */
  ['token_gifts_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['token_gifts_stddev_pop_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "token_gifts" */
  ['token_gifts_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['token_gifts_stddev_samp_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "token_gifts" */
  ['token_gifts_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['token_gifts_sum_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "token_gifts" */
  ['token_gifts_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_pop on columns */
  ['token_gifts_var_pop_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "token_gifts" */
  ['token_gifts_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['token_gifts_var_samp_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "token_gifts" */
  ['token_gifts_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['token_gifts_variance_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by variance() on columns of table "token_gifts" */
  ['token_gifts_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** columns and relationships of "users" */
  ['users']: AliasType<{
    address?: boolean;
    bio?: boolean;
    burns?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['burns_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['burns_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['burns_bool_exp'] | null;
      },
      ValueTypes['burns']
    ];
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean;
    created_at?: boolean;
    deleted_at?: boolean;
    epoch_first_visit?: boolean;
    fixed_non_receiver?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    name?: boolean;
    non_giver?: boolean;
    non_receiver?: boolean;
    pending_received_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['pending_token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['pending_token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    pending_sent_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['pending_token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['pending_token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['pending_token_gifts_bool_exp'] | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    /** An object relationship */
    profile?: ValueTypes['profiles'];
    received_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts']
    ];
    received_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    role?: boolean;
    sent_gifts?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts']
    ];
    sent_gifts_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['token_gifts_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['token_gifts_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['token_gifts_bool_exp'] | null;
      },
      ValueTypes['token_gifts_aggregate']
    ];
    starting_tokens?: boolean;
    teammates?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['teammates_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['teammates_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['teammates_bool_exp'] | null;
      },
      ValueTypes['teammates']
    ];
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "users" */
  ['users_aggregate_order_by']: {
    avg?: ValueTypes['users_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['users_max_order_by'] | null;
    min?: ValueTypes['users_min_order_by'] | null;
    stddev?: ValueTypes['users_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['users_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['users_stddev_samp_order_by'] | null;
    sum?: ValueTypes['users_sum_order_by'] | null;
    var_pop?: ValueTypes['users_var_pop_order_by'] | null;
    var_samp?: ValueTypes['users_var_samp_order_by'] | null;
    variance?: ValueTypes['users_variance_order_by'] | null;
  };
  /** order by avg() on columns of table "users" */
  ['users_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
  ['users_bool_exp']: {
    _and?: ValueTypes['users_bool_exp'][];
    _not?: ValueTypes['users_bool_exp'] | null;
    _or?: ValueTypes['users_bool_exp'][];
    address?: ValueTypes['String_comparison_exp'] | null;
    bio?: ValueTypes['String_comparison_exp'] | null;
    burns?: ValueTypes['burns_bool_exp'] | null;
    circle?: ValueTypes['circles_bool_exp'] | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    deleted_at?: ValueTypes['timestamp_comparison_exp'] | null;
    epoch_first_visit?: ValueTypes['Boolean_comparison_exp'] | null;
    fixed_non_receiver?: ValueTypes['Boolean_comparison_exp'] | null;
    give_token_received?: ValueTypes['Int_comparison_exp'] | null;
    give_token_remaining?: ValueTypes['Int_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    name?: ValueTypes['String_comparison_exp'] | null;
    non_giver?: ValueTypes['Boolean_comparison_exp'] | null;
    non_receiver?: ValueTypes['Boolean_comparison_exp'] | null;
    pending_received_gifts?: ValueTypes['pending_token_gifts_bool_exp'] | null;
    pending_sent_gifts?: ValueTypes['pending_token_gifts_bool_exp'] | null;
    profile?: ValueTypes['profiles_bool_exp'] | null;
    received_gifts?: ValueTypes['token_gifts_bool_exp'] | null;
    role?: ValueTypes['Int_comparison_exp'] | null;
    sent_gifts?: ValueTypes['token_gifts_bool_exp'] | null;
    starting_tokens?: ValueTypes['Int_comparison_exp'] | null;
    teammates?: ValueTypes['teammates_bool_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** order by max() on columns of table "users" */
  ['users_max_order_by']: {
    address?: ValueTypes['order_by'] | null;
    bio?: ValueTypes['order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    deleted_at?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** order by min() on columns of table "users" */
  ['users_min_order_by']: {
    address?: ValueTypes['order_by'] | null;
    bio?: ValueTypes['order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    deleted_at?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** Ordering options when selecting data from "users". */
  ['users_order_by']: {
    address?: ValueTypes['order_by'] | null;
    bio?: ValueTypes['order_by'] | null;
    burns_aggregate?: ValueTypes['burns_aggregate_order_by'] | null;
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    deleted_at?: ValueTypes['order_by'] | null;
    epoch_first_visit?: ValueTypes['order_by'] | null;
    fixed_non_receiver?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    non_giver?: ValueTypes['order_by'] | null;
    non_receiver?: ValueTypes['order_by'] | null;
    pending_received_gifts_aggregate?:
      | ValueTypes['pending_token_gifts_aggregate_order_by']
      | null;
    pending_sent_gifts_aggregate?:
      | ValueTypes['pending_token_gifts_aggregate_order_by']
      | null;
    profile?: ValueTypes['profiles_order_by'] | null;
    received_gifts_aggregate?:
      | ValueTypes['token_gifts_aggregate_order_by']
      | null;
    role?: ValueTypes['order_by'] | null;
    sent_gifts_aggregate?: ValueTypes['token_gifts_aggregate_order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
    teammates_aggregate?: ValueTypes['teammates_aggregate_order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "users" */
  ['users_select_column']: users_select_column;
  /** order by stddev() on columns of table "users" */
  ['users_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_pop() on columns of table "users" */
  ['users_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_samp() on columns of table "users" */
  ['users_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** order by sum() on columns of table "users" */
  ['users_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** order by var_pop() on columns of table "users" */
  ['users_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** order by var_samp() on columns of table "users" */
  ['users_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** order by variance() on columns of table "users" */
  ['users_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** columns and relationships of "vault_transactions" */
  ['vault_transactions']: AliasType<{
    created_at?: boolean;
    created_by?: boolean;
    date?: boolean;
    description?: boolean;
    id?: boolean;
    name?: boolean;
    tx_hash?: boolean;
    updated_at?: boolean;
    /** An object relationship */
    user?: ValueTypes['users'];
    value?: boolean;
    /** An object relationship */
    vault?: ValueTypes['vaults'];
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "vault_transactions" */
  ['vault_transactions_aggregate_order_by']: {
    avg?: ValueTypes['vault_transactions_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['vault_transactions_max_order_by'] | null;
    min?: ValueTypes['vault_transactions_min_order_by'] | null;
    stddev?: ValueTypes['vault_transactions_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['vault_transactions_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['vault_transactions_stddev_samp_order_by'] | null;
    sum?: ValueTypes['vault_transactions_sum_order_by'] | null;
    var_pop?: ValueTypes['vault_transactions_var_pop_order_by'] | null;
    var_samp?: ValueTypes['vault_transactions_var_samp_order_by'] | null;
    variance?: ValueTypes['vault_transactions_variance_order_by'] | null;
  };
  /** input type for inserting array relation for remote table "vault_transactions" */
  ['vault_transactions_arr_rel_insert_input']: {
    data: ValueTypes['vault_transactions_insert_input'][];
  };
  /** order by avg() on columns of table "vault_transactions" */
  ['vault_transactions_avg_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "vault_transactions". All fields are combined with a logical 'AND'. */
  ['vault_transactions_bool_exp']: {
    _and?: ValueTypes['vault_transactions_bool_exp'][];
    _not?: ValueTypes['vault_transactions_bool_exp'] | null;
    _or?: ValueTypes['vault_transactions_bool_exp'][];
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    created_by?: ValueTypes['bigint_comparison_exp'] | null;
    date?: ValueTypes['date_comparison_exp'] | null;
    description?: ValueTypes['String_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    name?: ValueTypes['String_comparison_exp'] | null;
    tx_hash?: ValueTypes['String_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
    user?: ValueTypes['users_bool_exp'] | null;
    value?: ValueTypes['bigint_comparison_exp'] | null;
    vault?: ValueTypes['vaults_bool_exp'] | null;
    vault_id?: ValueTypes['bigint_comparison_exp'] | null;
  };
  /** input type for inserting data into table "vault_transactions" */
  ['vault_transactions_insert_input']: {
    created_at?: ValueTypes['timestamp'] | null;
    created_by?: ValueTypes['bigint'] | null;
    date?: ValueTypes['date'] | null;
    description?: string | null;
    id?: ValueTypes['bigint'] | null;
    name?: string | null;
    tx_hash?: string | null;
    updated_at?: ValueTypes['timestamp'] | null;
    value?: ValueTypes['bigint'] | null;
    vault?: ValueTypes['vaults_obj_rel_insert_input'] | null;
    vault_id?: ValueTypes['bigint'] | null;
  };
  /** order by max() on columns of table "vault_transactions" */
  ['vault_transactions_max_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    date?: ValueTypes['order_by'] | null;
    description?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    tx_hash?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** order by min() on columns of table "vault_transactions" */
  ['vault_transactions_min_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    date?: ValueTypes['order_by'] | null;
    description?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    tx_hash?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** response of any mutation on the table "vault_transactions" */
  ['vault_transactions_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['vault_transactions'];
    __typename?: boolean;
  }>;
  /** Ordering options when selecting data from "vault_transactions". */
  ['vault_transactions_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    date?: ValueTypes['order_by'] | null;
    description?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    tx_hash?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user?: ValueTypes['users_order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault?: ValueTypes['vaults_order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "vault_transactions" */
  ['vault_transactions_select_column']: vault_transactions_select_column;
  /** order by stddev() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_pop() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_pop_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_samp() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_samp_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** order by sum() on columns of table "vault_transactions" */
  ['vault_transactions_sum_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_pop() on columns of table "vault_transactions" */
  ['vault_transactions_var_pop_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_samp() on columns of table "vault_transactions" */
  ['vault_transactions_var_samp_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** order by variance() on columns of table "vault_transactions" */
  ['vault_transactions_variance_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** columns and relationships of "vaults" */
  ['vaults']: AliasType<{
    created_at?: boolean;
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
    /** An object relationship */
    protocol?: ValueTypes['organizations'];
    simple_token_address?: boolean;
    symbol?: boolean;
    token_address?: boolean;
    updated_at?: boolean;
    /** An object relationship */
    user?: ValueTypes['users'];
    vault_address?: boolean;
    vault_transactions?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['vault_transactions_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['vault_transactions_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['vault_transactions_bool_exp'] | null;
      },
      ValueTypes['vault_transactions']
    ];
    __typename?: boolean;
  }>;
  /** Boolean expression to filter rows from the table "vaults". All fields are combined with a logical 'AND'. */
  ['vaults_bool_exp']: {
    _and?: ValueTypes['vaults_bool_exp'][];
    _not?: ValueTypes['vaults_bool_exp'] | null;
    _or?: ValueTypes['vaults_bool_exp'][];
    created_at?: ValueTypes['timestamptz_comparison_exp'] | null;
    created_by?: ValueTypes['bigint_comparison_exp'] | null;
    decimals?: ValueTypes['Int_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    org_id?: ValueTypes['bigint_comparison_exp'] | null;
    protocol?: ValueTypes['organizations_bool_exp'] | null;
    simple_token_address?: ValueTypes['String_comparison_exp'] | null;
    symbol?: ValueTypes['String_comparison_exp'] | null;
    token_address?: ValueTypes['String_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamptz_comparison_exp'] | null;
    user?: ValueTypes['users_bool_exp'] | null;
    vault_address?: ValueTypes['String_comparison_exp'] | null;
    vault_transactions?: ValueTypes['vault_transactions_bool_exp'] | null;
  };
  /** input type for inserting data into table "vaults" */
  ['vaults_insert_input']: {
    decimals?: number | null;
    id?: ValueTypes['bigint'] | null;
    org_id?: ValueTypes['bigint'] | null;
    simple_token_address?: string | null;
    symbol?: string | null;
    token_address?: string | null;
    vault_address?: string | null;
    vault_transactions?:
      | ValueTypes['vault_transactions_arr_rel_insert_input']
      | null;
  };
  /** response of any mutation on the table "vaults" */
  ['vaults_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['vaults'];
    __typename?: boolean;
  }>;
  /** input type for inserting object relation for remote table "vaults" */
  ['vaults_obj_rel_insert_input']: {
    data: ValueTypes['vaults_insert_input'];
  };
  /** Ordering options when selecting data from "vaults". */
  ['vaults_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    created_by?: ValueTypes['order_by'] | null;
    decimals?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    org_id?: ValueTypes['order_by'] | null;
    protocol?: ValueTypes['organizations_order_by'] | null;
    simple_token_address?: ValueTypes['order_by'] | null;
    symbol?: ValueTypes['order_by'] | null;
    token_address?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user?: ValueTypes['users_order_by'] | null;
    vault_address?: ValueTypes['order_by'] | null;
    vault_transactions_aggregate?:
      | ValueTypes['vault_transactions_aggregate_order_by']
      | null;
  };
  /** select columns of table "vaults" */
  ['vaults_select_column']: vaults_select_column;
  /** columns and relationships of "vouches" */
  ['vouches']: AliasType<{
    created_at?: boolean;
    id?: boolean;
    /** An object relationship */
    nominee?: ValueTypes['nominees'];
    nominee_id?: boolean;
    updated_at?: boolean;
    /** An object relationship */
    voucher?: ValueTypes['users'];
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "vouches" */
  ['vouches_aggregate_order_by']: {
    avg?: ValueTypes['vouches_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['vouches_max_order_by'] | null;
    min?: ValueTypes['vouches_min_order_by'] | null;
    stddev?: ValueTypes['vouches_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['vouches_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['vouches_stddev_samp_order_by'] | null;
    sum?: ValueTypes['vouches_sum_order_by'] | null;
    var_pop?: ValueTypes['vouches_var_pop_order_by'] | null;
    var_samp?: ValueTypes['vouches_var_samp_order_by'] | null;
    variance?: ValueTypes['vouches_variance_order_by'] | null;
  };
  /** order by avg() on columns of table "vouches" */
  ['vouches_avg_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "vouches". All fields are combined with a logical 'AND'. */
  ['vouches_bool_exp']: {
    _and?: ValueTypes['vouches_bool_exp'][];
    _not?: ValueTypes['vouches_bool_exp'] | null;
    _or?: ValueTypes['vouches_bool_exp'][];
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    nominee?: ValueTypes['nominees_bool_exp'] | null;
    nominee_id?: ValueTypes['Int_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
    voucher?: ValueTypes['users_bool_exp'] | null;
    voucher_id?: ValueTypes['Int_comparison_exp'] | null;
  };
  /** order by max() on columns of table "vouches" */
  ['vouches_max_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** order by min() on columns of table "vouches" */
  ['vouches_min_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** Ordering options when selecting data from "vouches". */
  ['vouches_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominee?: ValueTypes['nominees_order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    voucher?: ValueTypes['users_order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "vouches" */
  ['vouches_select_column']: vouches_select_column;
  /** order by stddev() on columns of table "vouches" */
  ['vouches_stddev_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_pop() on columns of table "vouches" */
  ['vouches_stddev_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** order by stddev_samp() on columns of table "vouches" */
  ['vouches_stddev_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** order by sum() on columns of table "vouches" */
  ['vouches_sum_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_pop() on columns of table "vouches" */
  ['vouches_var_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** order by var_samp() on columns of table "vouches" */
  ['vouches_var_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** order by variance() on columns of table "vouches" */
  ['vouches_variance_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
};

export type ModelTypes = {
  ['AdminUpdateUserInput']: GraphQLTypes['AdminUpdateUserInput'];
  ['Allocation']: GraphQLTypes['Allocation'];
  ['Allocations']: GraphQLTypes['Allocations'];
  ['AllocationsResponse']: {
    /** An object relationship */
    user: ModelTypes['users'];
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
    circle: ModelTypes['circles'];
    id: number;
    /** An array relationship */
    users: ModelTypes['users'][];
  };
  ['CreateEpochInput']: GraphQLTypes['CreateEpochInput'];
  ['CreateNomineeInput']: GraphQLTypes['CreateNomineeInput'];
  ['CreateNomineeResponse']: {
    id?: number;
    /** An object relationship */
    nominee: ModelTypes['nominees'];
  };
  ['CreateUserInput']: GraphQLTypes['CreateUserInput'];
  ['DeleteEpochInput']: GraphQLTypes['DeleteEpochInput'];
  ['DeleteEpochResponse']: {
    success: boolean;
  };
  ['DeleteUserInput']: GraphQLTypes['DeleteUserInput'];
  ['EpochResponse']: {
    /** An object relationship */
    epoch: ModelTypes['epochs'];
    id: string;
  };
  /** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
  ['Int_comparison_exp']: GraphQLTypes['Int_comparison_exp'];
  ['LogoutResponse']: {
    id?: number;
    /** An object relationship */
    profile: ModelTypes['profiles'];
  };
  /** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
  ['String_comparison_exp']: GraphQLTypes['String_comparison_exp'];
  ['UpdateCircleInput']: GraphQLTypes['UpdateCircleInput'];
  ['UpdateCircleOutput']: {
    /** An object relationship */
    circle: ModelTypes['circles'];
    id: number;
  };
  ['UpdateCircleResponse']: {
    /** An object relationship */
    circle: ModelTypes['circles'];
    id: number;
  };
  ['UpdateEpochInput']: GraphQLTypes['UpdateEpochInput'];
  ['UpdateProfileResponse']: {
    id: number;
    /** An object relationship */
    profile: ModelTypes['profiles'];
  };
  ['UpdateTeammatesInput']: GraphQLTypes['UpdateTeammatesInput'];
  ['UpdateTeammatesResponse']: {
    /** An object relationship */
    user: ModelTypes['users'];
    user_id: string;
  };
  ['UpdateUserInput']: GraphQLTypes['UpdateUserInput'];
  ['UploadCircleImageInput']: GraphQLTypes['UploadCircleImageInput'];
  ['UploadImageInput']: GraphQLTypes['UploadImageInput'];
  ['UserResponse']: {
    /** An object relationship */
    UserResponse: ModelTypes['users'];
    id: string;
  };
  ['VouchInput']: GraphQLTypes['VouchInput'];
  ['VouchOutput']: {
    id: number;
    /** An object relationship */
    nominee: ModelTypes['nominees'];
  };
  ['bigint']: number;
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_comparison_exp']: GraphQLTypes['bigint_comparison_exp'];
  /** columns and relationships of "burns" */
  ['burns']: {
    /** An object relationship */
    circle: ModelTypes['circles'];
    circle_id: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    /** An object relationship */
    epoch: ModelTypes['epochs'];
    epoch_id: ModelTypes['bigint'];
    id: ModelTypes['bigint'];
    original_amount: number;
    regift_percent: number;
    tokens_burnt: number;
    updated_at?: ModelTypes['timestamp'];
    /** An object relationship */
    user: ModelTypes['users'];
    user_id: ModelTypes['bigint'];
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
  /** columns and relationships of "circle_integrations" */
  ['circle_integrations']: {
    /** An object relationship */
    circle: ModelTypes['circles'];
    circle_id: ModelTypes['bigint'];
    data: ModelTypes['json'];
    id: ModelTypes['bigint'];
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
    returning: ModelTypes['circle_integrations'][];
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
    circle?: ModelTypes['circles'];
    circle_id?: ModelTypes['bigint'];
    discord_webhook?: string;
  };
  /** Boolean expression to filter rows from the table "circle_private". All fields are combined with a logical 'AND'. */
  ['circle_private_bool_exp']: GraphQLTypes['circle_private_bool_exp'];
  /** Ordering options when selecting data from "circle_private". */
  ['circle_private_order_by']: GraphQLTypes['circle_private_order_by'];
  /** select columns of table "circle_private" */
  ['circle_private_select_column']: GraphQLTypes['circle_private_select_column'];
  /** columns and relationships of "circles" */
  ['circles']: {
    alloc_text?: string;
    auto_opt_out: boolean;
    /** An array relationship */
    burns: ModelTypes['burns'][];
    /** An object relationship */
    circle_private?: ModelTypes['circle_private'];
    created_at?: ModelTypes['timestamp'];
    default_opt_in: boolean;
    /** An array relationship */
    epochs: ModelTypes['epochs'][];
    id: ModelTypes['bigint'];
    /** An array relationship */
    integrations: ModelTypes['circle_integrations'][];
    is_verified: boolean;
    logo?: string;
    min_vouches: number;
    name: string;
    nomination_days_limit: number;
    /** An array relationship */
    nominees: ModelTypes['nominees'][];
    /** An aggregate relationship */
    nominees_aggregate: ModelTypes['nominees_aggregate'];
    only_giver_vouch: boolean;
    /** An object relationship */
    organization: ModelTypes['organizations'];
    /** An array relationship */
    pending_token_gifts: ModelTypes['pending_token_gifts'][];
    protocol_id: number;
    team_sel_text?: string;
    team_selection: boolean;
    /** An array relationship */
    token_gifts: ModelTypes['token_gifts'][];
    /** An aggregate relationship */
    token_gifts_aggregate: ModelTypes['token_gifts_aggregate'];
    token_name: string;
    updated_at?: ModelTypes['timestamp'];
    /** An array relationship */
    users: ModelTypes['users'][];
    vouching: boolean;
    vouching_text?: string;
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
    returning: ModelTypes['circles'][];
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
    amount: ModelTypes['numeric'];
    claimed: boolean;
    /** An object relationship */
    createdByUser: ModelTypes['users'];
    created_at: ModelTypes['timestamptz'];
    created_by: ModelTypes['bigint'];
    /** An object relationship */
    distribution: ModelTypes['distributions'];
    distribution_id: ModelTypes['bigint'];
    id: ModelTypes['bigint'];
    index: ModelTypes['bigint'];
    new_amount: ModelTypes['numeric'];
    proof: string;
    /** An object relationship */
    updatedByUser: ModelTypes['users'];
    updated_at: ModelTypes['timestamptz'];
    updated_by: ModelTypes['bigint'];
    /** An object relationship */
    user: ModelTypes['users'];
    user_id: ModelTypes['bigint'];
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
    returning: ModelTypes['claims'][];
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
    /** fetch data from the table: "claims" */
    claims: ModelTypes['claims'][];
    created_at: ModelTypes['timestamp'];
    created_by: ModelTypes['bigint'];
    distribution_epoch_id?: ModelTypes['bigint'];
    distribution_json: ModelTypes['jsonb'];
    /** An object relationship */
    epoch: ModelTypes['epochs'];
    epoch_id: ModelTypes['bigint'];
    id: ModelTypes['bigint'];
    merkle_root?: string;
    saved_on_chain: boolean;
    total_amount: ModelTypes['numeric'];
    /** An object relationship */
    vault: ModelTypes['vaults'];
    vault_id: ModelTypes['bigint'];
  };
  /** Boolean expression to filter rows from the table "distributions". All fields are combined with a logical 'AND'. */
  ['distributions_bool_exp']: GraphQLTypes['distributions_bool_exp'];
  /** unique or primary key constraints on table "distributions" */
  ['distributions_constraint']: GraphQLTypes['distributions_constraint'];
  /** input type for incrementing numeric columns in table "distributions" */
  ['distributions_inc_input']: GraphQLTypes['distributions_inc_input'];
  /** input type for inserting data into table "distributions" */
  ['distributions_insert_input']: GraphQLTypes['distributions_insert_input'];
  /** response of any mutation on the table "distributions" */
  ['distributions_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['distributions'][];
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
  /** update columns of table "distributions" */
  ['distributions_update_column']: GraphQLTypes['distributions_update_column'];
  /** columns and relationships of "epoches" */
  ['epochs']: {
    /** An array relationship */
    burns: ModelTypes['burns'][];
    /** An object relationship */
    circle?: ModelTypes['circles'];
    circle_id: number;
    created_at: ModelTypes['timestamp'];
    days?: number;
    end_date: ModelTypes['timestamptz'];
    ended: boolean;
    /** An array relationship */
    epoch_pending_token_gifts: ModelTypes['pending_token_gifts'][];
    grant: ModelTypes['numeric'];
    id: ModelTypes['bigint'];
    notified_before_end?: ModelTypes['timestamp'];
    notified_end?: ModelTypes['timestamp'];
    notified_start?: ModelTypes['timestamp'];
    number?: number;
    repeat: number;
    repeat_day_of_month: number;
    start_date: ModelTypes['timestamptz'];
    /** An array relationship */
    token_gifts: ModelTypes['token_gifts'][];
    /** An aggregate relationship */
    token_gifts_aggregate: ModelTypes['token_gifts_aggregate'];
    updated_at: ModelTypes['timestamp'];
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
    gift_id?: ModelTypes['bigint'];
    note?: string;
    /** An object relationship */
    recipient?: ModelTypes['users'];
    recipient_id?: ModelTypes['bigint'];
    /** An object relationship */
    sender?: ModelTypes['users'];
    sender_id?: ModelTypes['bigint'];
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
    adminUpdateUser?: ModelTypes['UserResponse'];
    createCircle?: ModelTypes['CreateCircleResponse'];
    createEpoch?: ModelTypes['EpochResponse'];
    createNominee?: ModelTypes['CreateNomineeResponse'];
    createUser?: ModelTypes['UserResponse'];
    deleteEpoch?: ModelTypes['DeleteEpochResponse'];
    deleteUser?: ModelTypes['ConfirmationResponse'];
    /** delete data from the table: "circle_integrations" */
    delete_circle_integrations?: ModelTypes['circle_integrations_mutation_response'];
    /** delete single row from the table: "circle_integrations" */
    delete_circle_integrations_by_pk?: ModelTypes['circle_integrations'];
    /** insert data into the table: "circle_integrations" */
    insert_circle_integrations?: ModelTypes['circle_integrations_mutation_response'];
    /** insert a single row into the table: "circle_integrations" */
    insert_circle_integrations_one?: ModelTypes['circle_integrations'];
    /** insert data into the table: "claims" */
    insert_claims?: ModelTypes['claims_mutation_response'];
    /** insert a single row into the table: "claims" */
    insert_claims_one?: ModelTypes['claims'];
    /** insert data into the table: "distributions" */
    insert_distributions?: ModelTypes['distributions_mutation_response'];
    /** insert a single row into the table: "distributions" */
    insert_distributions_one?: ModelTypes['distributions'];
    /** insert data into the table: "vault_transactions" */
    insert_vault_transactions?: ModelTypes['vault_transactions_mutation_response'];
    /** insert a single row into the table: "vault_transactions" */
    insert_vault_transactions_one?: ModelTypes['vault_transactions'];
    /** insert data into the table: "vaults" */
    insert_vaults?: ModelTypes['vaults_mutation_response'];
    /** insert a single row into the table: "vaults" */
    insert_vaults_one?: ModelTypes['vaults'];
    logoutUser?: ModelTypes['LogoutResponse'];
    updateAllocations?: ModelTypes['AllocationsResponse'];
    updateCircle?: ModelTypes['UpdateCircleOutput'];
    updateEpoch?: ModelTypes['EpochResponse'];
    updateTeammates?: ModelTypes['UpdateTeammatesResponse'];
    /** Update own user */
    updateUser?: ModelTypes['UserResponse'];
    /** update data of the table: "circles" */
    update_circles?: ModelTypes['circles_mutation_response'];
    /** update single row of the table: "circles" */
    update_circles_by_pk?: ModelTypes['circles'];
    /** update data of the table: "claims" */
    update_claims?: ModelTypes['claims_mutation_response'];
    /** update single row of the table: "claims" */
    update_claims_by_pk?: ModelTypes['claims'];
    /** update data of the table: "distributions" */
    update_distributions?: ModelTypes['distributions_mutation_response'];
    /** update single row of the table: "distributions" */
    update_distributions_by_pk?: ModelTypes['distributions'];
    /** update data of the table: "profiles" */
    update_profiles?: ModelTypes['profiles_mutation_response'];
    /** update single row of the table: "profiles" */
    update_profiles_by_pk?: ModelTypes['profiles'];
    uploadCircleLogo?: ModelTypes['UpdateCircleResponse'];
    uploadProfileAvatar?: ModelTypes['UpdateProfileResponse'];
    uploadProfileBackground?: ModelTypes['UpdateProfileResponse'];
    vouch?: ModelTypes['VouchOutput'];
  };
  /** columns and relationships of "nominees" */
  ['nominees']: {
    address: string;
    /** An object relationship */
    circle?: ModelTypes['circles'];
    circle_id: number;
    created_at?: ModelTypes['timestamp'];
    description: string;
    ended: boolean;
    expiry_date: ModelTypes['date'];
    id: ModelTypes['bigint'];
    name: string;
    nominated_by_user_id: number;
    nominated_date: ModelTypes['date'];
    /** An array relationship */
    nominations: ModelTypes['vouches'][];
    /** An object relationship */
    nominator?: ModelTypes['users'];
    updated_at?: ModelTypes['timestamp'];
    /** An object relationship */
    user?: ModelTypes['users'];
    user_id?: number;
    vouches_required: number;
  };
  /** aggregated selection of "nominees" */
  ['nominees_aggregate']: {
    aggregate?: ModelTypes['nominees_aggregate_fields'];
    nodes: ModelTypes['nominees'][];
  };
  /** aggregate fields of "nominees" */
  ['nominees_aggregate_fields']: {
    avg?: ModelTypes['nominees_avg_fields'];
    count: number;
    max?: ModelTypes['nominees_max_fields'];
    min?: ModelTypes['nominees_min_fields'];
    stddev?: ModelTypes['nominees_stddev_fields'];
    stddev_pop?: ModelTypes['nominees_stddev_pop_fields'];
    stddev_samp?: ModelTypes['nominees_stddev_samp_fields'];
    sum?: ModelTypes['nominees_sum_fields'];
    var_pop?: ModelTypes['nominees_var_pop_fields'];
    var_samp?: ModelTypes['nominees_var_samp_fields'];
    variance?: ModelTypes['nominees_variance_fields'];
  };
  /** order by aggregate values of table "nominees" */
  ['nominees_aggregate_order_by']: GraphQLTypes['nominees_aggregate_order_by'];
  /** aggregate avg on columns */
  ['nominees_avg_fields']: {
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by avg() on columns of table "nominees" */
  ['nominees_avg_order_by']: GraphQLTypes['nominees_avg_order_by'];
  /** Boolean expression to filter rows from the table "nominees". All fields are combined with a logical 'AND'. */
  ['nominees_bool_exp']: GraphQLTypes['nominees_bool_exp'];
  /** aggregate max on columns */
  ['nominees_max_fields']: {
    address?: string;
    circle_id?: number;
    created_at?: ModelTypes['timestamp'];
    description?: string;
    expiry_date?: ModelTypes['date'];
    id?: ModelTypes['bigint'];
    name?: string;
    nominated_by_user_id?: number;
    nominated_date?: ModelTypes['date'];
    updated_at?: ModelTypes['timestamp'];
    user_id?: number;
    vouches_required?: number;
  };
  /** order by max() on columns of table "nominees" */
  ['nominees_max_order_by']: GraphQLTypes['nominees_max_order_by'];
  /** aggregate min on columns */
  ['nominees_min_fields']: {
    address?: string;
    circle_id?: number;
    created_at?: ModelTypes['timestamp'];
    description?: string;
    expiry_date?: ModelTypes['date'];
    id?: ModelTypes['bigint'];
    name?: string;
    nominated_by_user_id?: number;
    nominated_date?: ModelTypes['date'];
    updated_at?: ModelTypes['timestamp'];
    user_id?: number;
    vouches_required?: number;
  };
  /** order by min() on columns of table "nominees" */
  ['nominees_min_order_by']: GraphQLTypes['nominees_min_order_by'];
  /** Ordering options when selecting data from "nominees". */
  ['nominees_order_by']: GraphQLTypes['nominees_order_by'];
  /** select columns of table "nominees" */
  ['nominees_select_column']: GraphQLTypes['nominees_select_column'];
  /** aggregate stddev on columns */
  ['nominees_stddev_fields']: {
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by stddev() on columns of table "nominees" */
  ['nominees_stddev_order_by']: GraphQLTypes['nominees_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['nominees_stddev_pop_fields']: {
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by stddev_pop() on columns of table "nominees" */
  ['nominees_stddev_pop_order_by']: GraphQLTypes['nominees_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['nominees_stddev_samp_fields']: {
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by stddev_samp() on columns of table "nominees" */
  ['nominees_stddev_samp_order_by']: GraphQLTypes['nominees_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['nominees_sum_fields']: {
    circle_id?: number;
    id?: ModelTypes['bigint'];
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by sum() on columns of table "nominees" */
  ['nominees_sum_order_by']: GraphQLTypes['nominees_sum_order_by'];
  /** aggregate var_pop on columns */
  ['nominees_var_pop_fields']: {
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by var_pop() on columns of table "nominees" */
  ['nominees_var_pop_order_by']: GraphQLTypes['nominees_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['nominees_var_samp_fields']: {
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by var_samp() on columns of table "nominees" */
  ['nominees_var_samp_order_by']: GraphQLTypes['nominees_var_samp_order_by'];
  /** aggregate variance on columns */
  ['nominees_variance_fields']: {
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
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
    circles: ModelTypes['circles'][];
    created_at?: ModelTypes['timestamp'];
    id: ModelTypes['bigint'];
    name: string;
    updated_at?: ModelTypes['timestamp'];
  };
  /** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
  ['organizations_bool_exp']: GraphQLTypes['organizations_bool_exp'];
  /** Ordering options when selecting data from "protocols". */
  ['organizations_order_by']: GraphQLTypes['organizations_order_by'];
  /** select columns of table "protocols" */
  ['organizations_select_column']: GraphQLTypes['organizations_select_column'];
  /** columns and relationships of "pending_gift_private" */
  ['pending_gift_private']: {
    gift_id?: ModelTypes['bigint'];
    note?: string;
    /** An object relationship */
    recipient?: ModelTypes['users'];
    recipient_id?: ModelTypes['bigint'];
    /** An object relationship */
    sender?: ModelTypes['users'];
    sender_id?: ModelTypes['bigint'];
  };
  /** Boolean expression to filter rows from the table "pending_gift_private". All fields are combined with a logical 'AND'. */
  ['pending_gift_private_bool_exp']: GraphQLTypes['pending_gift_private_bool_exp'];
  /** Ordering options when selecting data from "pending_gift_private". */
  ['pending_gift_private_order_by']: GraphQLTypes['pending_gift_private_order_by'];
  /** select columns of table "pending_gift_private" */
  ['pending_gift_private_select_column']: GraphQLTypes['pending_gift_private_select_column'];
  /** columns and relationships of "pending_token_gifts" */
  ['pending_token_gifts']: {
    /** An object relationship */
    circle: ModelTypes['circles'];
    circle_id: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    dts_created: ModelTypes['timestamp'];
    /** An object relationship */
    epoch?: ModelTypes['epochs'];
    epoch_id?: number;
    /** An object relationship */
    gift_private?: ModelTypes['pending_gift_private'];
    id: ModelTypes['bigint'];
    /** An object relationship */
    recipient: ModelTypes['users'];
    recipient_address: string;
    recipient_id: ModelTypes['bigint'];
    /** An object relationship */
    sender: ModelTypes['users'];
    sender_address: string;
    sender_id: ModelTypes['bigint'];
    tokens: number;
    updated_at?: ModelTypes['timestamp'];
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
  /** columns and relationships of "profiles" */
  ['profiles']: {
    address: string;
    admin_view: boolean;
    avatar?: string;
    background?: string;
    bio?: string;
    created_at?: ModelTypes['timestamp'];
    discord_username?: string;
    github_username?: string;
    id: ModelTypes['bigint'];
    medium_username?: string;
    skills?: string;
    telegram_username?: string;
    twitter_username?: string;
    updated_at?: ModelTypes['timestamp'];
    /** An array relationship */
    users: ModelTypes['users'][];
    website?: string;
  };
  /** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
  ['profiles_bool_exp']: GraphQLTypes['profiles_bool_exp'];
  /** response of any mutation on the table "profiles" */
  ['profiles_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['profiles'][];
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
    burns: ModelTypes['burns'][];
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: ModelTypes['burns'];
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: ModelTypes['circle_integrations'][];
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: ModelTypes['circle_integrations'];
    /** fetch data from the table: "circle_private" */
    circle_private: ModelTypes['circle_private'][];
    /** An array relationship */
    circles: ModelTypes['circles'][];
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: ModelTypes['circles'];
    /** fetch data from the table: "claims" */
    claims: ModelTypes['claims'][];
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: ModelTypes['claims'];
    /** fetch data from the table: "distributions" */
    distributions: ModelTypes['distributions'][];
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: ModelTypes['distributions'];
    /** An array relationship */
    epochs: ModelTypes['epochs'][];
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: ModelTypes['epochs'];
    /** fetch data from the table: "gift_private" */
    gift_private: ModelTypes['gift_private'][];
    /** An array relationship */
    nominees: ModelTypes['nominees'][];
    /** An aggregate relationship */
    nominees_aggregate: ModelTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: ModelTypes['nominees'];
    /** fetch data from the table: "protocols" */
    organizations: ModelTypes['organizations'][];
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: ModelTypes['organizations'];
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: ModelTypes['pending_gift_private'][];
    /** An array relationship */
    pending_token_gifts: ModelTypes['pending_token_gifts'][];
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: ModelTypes['pending_token_gifts'];
    /** fetch data from the table: "profiles" */
    profiles: ModelTypes['profiles'][];
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: ModelTypes['profiles'];
    /** An array relationship */
    teammates: ModelTypes['teammates'][];
    /** fetch data from the table: "teammates" using primary key columns */
    teammates_by_pk?: ModelTypes['teammates'];
    /** An array relationship */
    token_gifts: ModelTypes['token_gifts'][];
    /** An aggregate relationship */
    token_gifts_aggregate: ModelTypes['token_gifts_aggregate'];
    /** fetch data from the table: "token_gifts" using primary key columns */
    token_gifts_by_pk?: ModelTypes['token_gifts'];
    /** An array relationship */
    users: ModelTypes['users'][];
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: ModelTypes['users'];
    /** An array relationship */
    vault_transactions: ModelTypes['vault_transactions'][];
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: ModelTypes['vault_transactions'];
    /** fetch data from the table: "vaults" */
    vaults: ModelTypes['vaults'][];
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: ModelTypes['vaults'];
    /** fetch data from the table: "vouches" */
    vouches: ModelTypes['vouches'][];
    /** fetch data from the table: "vouches" using primary key columns */
    vouches_by_pk?: ModelTypes['vouches'];
  };
  ['subscription_root']: {
    /** An array relationship */
    burns: ModelTypes['burns'][];
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: ModelTypes['burns'];
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: ModelTypes['circle_integrations'][];
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: ModelTypes['circle_integrations'];
    /** fetch data from the table: "circle_private" */
    circle_private: ModelTypes['circle_private'][];
    /** An array relationship */
    circles: ModelTypes['circles'][];
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: ModelTypes['circles'];
    /** fetch data from the table: "claims" */
    claims: ModelTypes['claims'][];
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: ModelTypes['claims'];
    /** fetch data from the table: "distributions" */
    distributions: ModelTypes['distributions'][];
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: ModelTypes['distributions'];
    /** An array relationship */
    epochs: ModelTypes['epochs'][];
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: ModelTypes['epochs'];
    /** fetch data from the table: "gift_private" */
    gift_private: ModelTypes['gift_private'][];
    /** An array relationship */
    nominees: ModelTypes['nominees'][];
    /** An aggregate relationship */
    nominees_aggregate: ModelTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: ModelTypes['nominees'];
    /** fetch data from the table: "protocols" */
    organizations: ModelTypes['organizations'][];
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: ModelTypes['organizations'];
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: ModelTypes['pending_gift_private'][];
    /** An array relationship */
    pending_token_gifts: ModelTypes['pending_token_gifts'][];
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: ModelTypes['pending_token_gifts'];
    /** fetch data from the table: "profiles" */
    profiles: ModelTypes['profiles'][];
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: ModelTypes['profiles'];
    /** An array relationship */
    teammates: ModelTypes['teammates'][];
    /** fetch data from the table: "teammates" using primary key columns */
    teammates_by_pk?: ModelTypes['teammates'];
    /** An array relationship */
    token_gifts: ModelTypes['token_gifts'][];
    /** An aggregate relationship */
    token_gifts_aggregate: ModelTypes['token_gifts_aggregate'];
    /** fetch data from the table: "token_gifts" using primary key columns */
    token_gifts_by_pk?: ModelTypes['token_gifts'];
    /** An array relationship */
    users: ModelTypes['users'][];
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: ModelTypes['users'];
    /** An array relationship */
    vault_transactions: ModelTypes['vault_transactions'][];
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: ModelTypes['vault_transactions'];
    /** fetch data from the table: "vaults" */
    vaults: ModelTypes['vaults'][];
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: ModelTypes['vaults'];
    /** fetch data from the table: "vouches" */
    vouches: ModelTypes['vouches'][];
    /** fetch data from the table: "vouches" using primary key columns */
    vouches_by_pk?: ModelTypes['vouches'];
  };
  /** columns and relationships of "teammates" */
  ['teammates']: {
    created_at?: ModelTypes['timestamp'];
    id: ModelTypes['bigint'];
    team_mate_id: number;
    /** An object relationship */
    teammate?: ModelTypes['users'];
    updated_at?: ModelTypes['timestamp'];
    /** An object relationship */
    user?: ModelTypes['users'];
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
  /** columns and relationships of "token_gifts" */
  ['token_gifts']: {
    /** An object relationship */
    circle: ModelTypes['circles'];
    circle_id: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    dts_created: ModelTypes['timestamp'];
    epoch_id: number;
    /** An object relationship */
    gift_private?: ModelTypes['gift_private'];
    id: ModelTypes['bigint'];
    /** An object relationship */
    recipient: ModelTypes['users'];
    recipient_address: string;
    recipient_id: ModelTypes['bigint'];
    /** An object relationship */
    sender: ModelTypes['users'];
    sender_address: string;
    sender_id: ModelTypes['bigint'];
    tokens: number;
    updated_at?: ModelTypes['timestamp'];
  };
  /** aggregated selection of "token_gifts" */
  ['token_gifts_aggregate']: {
    aggregate?: ModelTypes['token_gifts_aggregate_fields'];
    nodes: ModelTypes['token_gifts'][];
  };
  /** aggregate fields of "token_gifts" */
  ['token_gifts_aggregate_fields']: {
    avg?: ModelTypes['token_gifts_avg_fields'];
    count: number;
    max?: ModelTypes['token_gifts_max_fields'];
    min?: ModelTypes['token_gifts_min_fields'];
    stddev?: ModelTypes['token_gifts_stddev_fields'];
    stddev_pop?: ModelTypes['token_gifts_stddev_pop_fields'];
    stddev_samp?: ModelTypes['token_gifts_stddev_samp_fields'];
    sum?: ModelTypes['token_gifts_sum_fields'];
    var_pop?: ModelTypes['token_gifts_var_pop_fields'];
    var_samp?: ModelTypes['token_gifts_var_samp_fields'];
    variance?: ModelTypes['token_gifts_variance_fields'];
  };
  /** order by aggregate values of table "token_gifts" */
  ['token_gifts_aggregate_order_by']: GraphQLTypes['token_gifts_aggregate_order_by'];
  /** aggregate avg on columns */
  ['token_gifts_avg_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by avg() on columns of table "token_gifts" */
  ['token_gifts_avg_order_by']: GraphQLTypes['token_gifts_avg_order_by'];
  /** Boolean expression to filter rows from the table "token_gifts". All fields are combined with a logical 'AND'. */
  ['token_gifts_bool_exp']: GraphQLTypes['token_gifts_bool_exp'];
  /** aggregate max on columns */
  ['token_gifts_max_fields']: {
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    dts_created?: ModelTypes['timestamp'];
    epoch_id?: number;
    id?: ModelTypes['bigint'];
    recipient_address?: string;
    recipient_id?: ModelTypes['bigint'];
    sender_address?: string;
    sender_id?: ModelTypes['bigint'];
    tokens?: number;
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by max() on columns of table "token_gifts" */
  ['token_gifts_max_order_by']: GraphQLTypes['token_gifts_max_order_by'];
  /** aggregate min on columns */
  ['token_gifts_min_fields']: {
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    dts_created?: ModelTypes['timestamp'];
    epoch_id?: number;
    id?: ModelTypes['bigint'];
    recipient_address?: string;
    recipient_id?: ModelTypes['bigint'];
    sender_address?: string;
    sender_id?: ModelTypes['bigint'];
    tokens?: number;
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by min() on columns of table "token_gifts" */
  ['token_gifts_min_order_by']: GraphQLTypes['token_gifts_min_order_by'];
  /** Ordering options when selecting data from "token_gifts". */
  ['token_gifts_order_by']: GraphQLTypes['token_gifts_order_by'];
  /** select columns of table "token_gifts" */
  ['token_gifts_select_column']: GraphQLTypes['token_gifts_select_column'];
  /** aggregate stddev on columns */
  ['token_gifts_stddev_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by stddev() on columns of table "token_gifts" */
  ['token_gifts_stddev_order_by']: GraphQLTypes['token_gifts_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['token_gifts_stddev_pop_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by stddev_pop() on columns of table "token_gifts" */
  ['token_gifts_stddev_pop_order_by']: GraphQLTypes['token_gifts_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['token_gifts_stddev_samp_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by stddev_samp() on columns of table "token_gifts" */
  ['token_gifts_stddev_samp_order_by']: GraphQLTypes['token_gifts_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['token_gifts_sum_fields']: {
    circle_id?: ModelTypes['bigint'];
    epoch_id?: number;
    id?: ModelTypes['bigint'];
    recipient_id?: ModelTypes['bigint'];
    sender_id?: ModelTypes['bigint'];
    tokens?: number;
  };
  /** order by sum() on columns of table "token_gifts" */
  ['token_gifts_sum_order_by']: GraphQLTypes['token_gifts_sum_order_by'];
  /** aggregate var_pop on columns */
  ['token_gifts_var_pop_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by var_pop() on columns of table "token_gifts" */
  ['token_gifts_var_pop_order_by']: GraphQLTypes['token_gifts_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['token_gifts_var_samp_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by var_samp() on columns of table "token_gifts" */
  ['token_gifts_var_samp_order_by']: GraphQLTypes['token_gifts_var_samp_order_by'];
  /** aggregate variance on columns */
  ['token_gifts_variance_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by variance() on columns of table "token_gifts" */
  ['token_gifts_variance_order_by']: GraphQLTypes['token_gifts_variance_order_by'];
  /** columns and relationships of "users" */
  ['users']: {
    address: string;
    bio?: string;
    /** An array relationship */
    burns: ModelTypes['burns'][];
    /** An object relationship */
    circle: ModelTypes['circles'];
    circle_id: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    deleted_at?: ModelTypes['timestamp'];
    epoch_first_visit: boolean;
    fixed_non_receiver: boolean;
    give_token_received: number;
    give_token_remaining: number;
    id: ModelTypes['bigint'];
    name: string;
    non_giver: boolean;
    non_receiver: boolean;
    /** An array relationship */
    pending_received_gifts: ModelTypes['pending_token_gifts'][];
    /** An array relationship */
    pending_sent_gifts: ModelTypes['pending_token_gifts'][];
    /** An object relationship */
    profile?: ModelTypes['profiles'];
    /** An array relationship */
    received_gifts: ModelTypes['token_gifts'][];
    /** An aggregate relationship */
    received_gifts_aggregate: ModelTypes['token_gifts_aggregate'];
    role: number;
    /** An array relationship */
    sent_gifts: ModelTypes['token_gifts'][];
    /** An aggregate relationship */
    sent_gifts_aggregate: ModelTypes['token_gifts_aggregate'];
    starting_tokens: number;
    /** An array relationship */
    teammates: ModelTypes['teammates'][];
    updated_at?: ModelTypes['timestamp'];
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
    created_at: ModelTypes['timestamp'];
    created_by?: ModelTypes['bigint'];
    date: ModelTypes['date'];
    description?: string;
    id: ModelTypes['bigint'];
    name: string;
    tx_hash: string;
    updated_at: ModelTypes['timestamp'];
    /** An object relationship */
    user?: ModelTypes['users'];
    value?: ModelTypes['bigint'];
    /** An object relationship */
    vault: ModelTypes['vaults'];
    vault_id: ModelTypes['bigint'];
  };
  /** order by aggregate values of table "vault_transactions" */
  ['vault_transactions_aggregate_order_by']: GraphQLTypes['vault_transactions_aggregate_order_by'];
  /** input type for inserting array relation for remote table "vault_transactions" */
  ['vault_transactions_arr_rel_insert_input']: GraphQLTypes['vault_transactions_arr_rel_insert_input'];
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
    returning: ModelTypes['vault_transactions'][];
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
    created_at: ModelTypes['timestamptz'];
    created_by: ModelTypes['bigint'];
    decimals: number;
    id: ModelTypes['bigint'];
    org_id: ModelTypes['bigint'];
    /** An object relationship */
    protocol: ModelTypes['organizations'];
    simple_token_address?: string;
    symbol: string;
    token_address?: string;
    updated_at: ModelTypes['timestamptz'];
    /** An object relationship */
    user: ModelTypes['users'];
    vault_address: string;
    /** An array relationship */
    vault_transactions: ModelTypes['vault_transactions'][];
  };
  /** Boolean expression to filter rows from the table "vaults". All fields are combined with a logical 'AND'. */
  ['vaults_bool_exp']: GraphQLTypes['vaults_bool_exp'];
  /** input type for inserting data into table "vaults" */
  ['vaults_insert_input']: GraphQLTypes['vaults_insert_input'];
  /** response of any mutation on the table "vaults" */
  ['vaults_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['vaults'][];
  };
  /** input type for inserting object relation for remote table "vaults" */
  ['vaults_obj_rel_insert_input']: GraphQLTypes['vaults_obj_rel_insert_input'];
  /** Ordering options when selecting data from "vaults". */
  ['vaults_order_by']: GraphQLTypes['vaults_order_by'];
  /** select columns of table "vaults" */
  ['vaults_select_column']: GraphQLTypes['vaults_select_column'];
  /** columns and relationships of "vouches" */
  ['vouches']: {
    created_at?: ModelTypes['timestamp'];
    id: ModelTypes['bigint'];
    /** An object relationship */
    nominee?: ModelTypes['nominees'];
    nominee_id: number;
    updated_at?: ModelTypes['timestamp'];
    /** An object relationship */
    voucher?: ModelTypes['users'];
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
    fixed_non_receiver?: boolean;
    name?: string;
    new_address?: string;
    non_giver?: boolean;
    non_receiver?: boolean;
    role?: number;
    starting_tokens?: number;
  };
  ['Allocation']: {
    note: string;
    recipient_id: number;
    tokens: number;
  };
  ['Allocations']: {
    allocations?: Array<GraphQLTypes['Allocation']>;
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
    _eq?: boolean;
    _gt?: boolean;
    _gte?: boolean;
    _in?: Array<boolean>;
    _is_null?: boolean;
    _lt?: boolean;
    _lte?: boolean;
    _neq?: boolean;
    _nin?: Array<boolean>;
  };
  ['ConfirmationResponse']: {
    __typename: 'ConfirmationResponse';
    success: boolean;
  };
  ['CreateCircleInput']: {
    circle_name: string;
    contact?: string;
    protocol_id?: number;
    protocol_name?: string;
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
    grant?: number;
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
    id?: number;
    /** An object relationship */
    nominee: GraphQLTypes['nominees'];
  };
  ['CreateUserInput']: {
    address: string;
    circle_id: number;
    fixed_non_receiver?: boolean;
    name: string;
    non_giver?: boolean;
    non_receiver?: boolean;
    role?: number;
    starting_tokens?: number;
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
    _eq?: number;
    _gt?: number;
    _gte?: number;
    _in?: Array<number>;
    _is_null?: boolean;
    _lt?: number;
    _lte?: number;
    _neq?: number;
    _nin?: Array<number>;
  };
  ['LogoutResponse']: {
    __typename: 'LogoutResponse';
    id?: number;
    /** An object relationship */
    profile: GraphQLTypes['profiles'];
  };
  /** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
  ['String_comparison_exp']: {
    _eq?: string;
    _gt?: string;
    _gte?: string;
    /** does the column match the given case-insensitive pattern */
    _ilike?: string;
    _in?: Array<string>;
    /** does the column match the given POSIX regular expression, case insensitive */
    _iregex?: string;
    _is_null?: boolean;
    /** does the column match the given pattern */
    _like?: string;
    _lt?: string;
    _lte?: string;
    _neq?: string;
    /** does the column NOT match the given case-insensitive pattern */
    _nilike?: string;
    _nin?: Array<string>;
    /** does the column NOT match the given POSIX regular expression, case insensitive */
    _niregex?: string;
    /** does the column NOT match the given pattern */
    _nlike?: string;
    /** does the column NOT match the given POSIX regular expression, case sensitive */
    _nregex?: string;
    /** does the column NOT match the given SQL regular expression */
    _nsimilar?: string;
    /** does the column match the given POSIX regular expression, case sensitive */
    _regex?: string;
    /** does the column match the given SQL regular expression */
    _similar?: string;
  };
  ['UpdateCircleInput']: {
    alloc_text?: string;
    auto_opt_out?: boolean;
    circle_id: number;
    default_opt_in?: boolean;
    discord_webhook?: string;
    min_vouches?: number;
    name?: string;
    nomination_days_limit?: number;
    only_giver_vouch?: boolean;
    team_sel_text?: string;
    team_selection?: boolean;
    token_name?: string;
    update_webhook?: boolean;
    vouching?: boolean;
    vouching_text?: string;
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
    grant?: number;
    id: number;
    repeat: number;
    start_date: GraphQLTypes['timestamptz'];
  };
  ['UpdateProfileResponse']: {
    __typename: 'UpdateProfileResponse';
    id: number;
    /** An object relationship */
    profile: GraphQLTypes['profiles'];
  };
  ['UpdateTeammatesInput']: {
    circle_id: number;
    teammates?: Array<number>;
  };
  ['UpdateTeammatesResponse']: {
    __typename: 'UpdateTeammatesResponse';
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: string;
  };
  ['UpdateUserInput']: {
    bio?: string;
    circle_id: number;
    epoch_first_visit?: boolean;
    non_receiver?: boolean;
  };
  ['UploadCircleImageInput']: {
    circle_id: number;
    image_data_base64: string;
  };
  ['UploadImageInput']: {
    image_data_base64: string;
  };
  ['UserResponse']: {
    __typename: 'UserResponse';
    /** An object relationship */
    UserResponse: GraphQLTypes['users'];
    id: string;
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
  ['bigint']: number;
  /** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
  ['bigint_comparison_exp']: {
    _eq?: GraphQLTypes['bigint'];
    _gt?: GraphQLTypes['bigint'];
    _gte?: GraphQLTypes['bigint'];
    _in?: Array<GraphQLTypes['bigint']>;
    _is_null?: boolean;
    _lt?: GraphQLTypes['bigint'];
    _lte?: GraphQLTypes['bigint'];
    _neq?: GraphQLTypes['bigint'];
    _nin?: Array<GraphQLTypes['bigint']>;
  };
  /** columns and relationships of "burns" */
  ['burns']: {
    __typename: 'burns';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    /** An object relationship */
    epoch: GraphQLTypes['epochs'];
    epoch_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    original_amount: number;
    regift_percent: number;
    tokens_burnt: number;
    updated_at?: GraphQLTypes['timestamp'];
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: GraphQLTypes['bigint'];
  };
  /** order by aggregate values of table "burns" */
  ['burns_aggregate_order_by']: {
    avg?: GraphQLTypes['burns_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['burns_max_order_by'];
    min?: GraphQLTypes['burns_min_order_by'];
    stddev?: GraphQLTypes['burns_stddev_order_by'];
    stddev_pop?: GraphQLTypes['burns_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['burns_stddev_samp_order_by'];
    sum?: GraphQLTypes['burns_sum_order_by'];
    var_pop?: GraphQLTypes['burns_var_pop_order_by'];
    var_samp?: GraphQLTypes['burns_var_samp_order_by'];
    variance?: GraphQLTypes['burns_variance_order_by'];
  };
  /** order by avg() on columns of table "burns" */
  ['burns_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "burns". All fields are combined with a logical 'AND'. */
  ['burns_bool_exp']: {
    _and?: Array<GraphQLTypes['burns_bool_exp']>;
    _not?: GraphQLTypes['burns_bool_exp'];
    _or?: Array<GraphQLTypes['burns_bool_exp']>;
    circle?: GraphQLTypes['circles_bool_exp'];
    circle_id?: GraphQLTypes['bigint_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    epoch?: GraphQLTypes['epochs_bool_exp'];
    epoch_id?: GraphQLTypes['bigint_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    original_amount?: GraphQLTypes['Int_comparison_exp'];
    regift_percent?: GraphQLTypes['Int_comparison_exp'];
    tokens_burnt?: GraphQLTypes['Int_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
    user?: GraphQLTypes['users_bool_exp'];
    user_id?: GraphQLTypes['bigint_comparison_exp'];
  };
  /** order by max() on columns of table "burns" */
  ['burns_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by min() on columns of table "burns" */
  ['burns_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** Ordering options when selecting data from "burns". */
  ['burns_order_by']: {
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    epoch?: GraphQLTypes['epochs_order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user?: GraphQLTypes['users_order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** select columns of table "burns" */
  ['burns_select_column']: burns_select_column;
  /** order by stddev() on columns of table "burns" */
  ['burns_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_pop() on columns of table "burns" */
  ['burns_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_samp() on columns of table "burns" */
  ['burns_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by sum() on columns of table "burns" */
  ['burns_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by var_pop() on columns of table "burns" */
  ['burns_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by var_samp() on columns of table "burns" */
  ['burns_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by variance() on columns of table "burns" */
  ['burns_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    original_amount?: GraphQLTypes['order_by'];
    regift_percent?: GraphQLTypes['order_by'];
    tokens_burnt?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
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
    avg?: GraphQLTypes['circle_integrations_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['circle_integrations_max_order_by'];
    min?: GraphQLTypes['circle_integrations_min_order_by'];
    stddev?: GraphQLTypes['circle_integrations_stddev_order_by'];
    stddev_pop?: GraphQLTypes['circle_integrations_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['circle_integrations_stddev_samp_order_by'];
    sum?: GraphQLTypes['circle_integrations_sum_order_by'];
    var_pop?: GraphQLTypes['circle_integrations_var_pop_order_by'];
    var_samp?: GraphQLTypes['circle_integrations_var_samp_order_by'];
    variance?: GraphQLTypes['circle_integrations_variance_order_by'];
  };
  /** order by avg() on columns of table "circle_integrations" */
  ['circle_integrations_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "circle_integrations". All fields are combined with a logical 'AND'. */
  ['circle_integrations_bool_exp']: {
    _and?: Array<GraphQLTypes['circle_integrations_bool_exp']>;
    _not?: GraphQLTypes['circle_integrations_bool_exp'];
    _or?: Array<GraphQLTypes['circle_integrations_bool_exp']>;
    circle?: GraphQLTypes['circles_bool_exp'];
    circle_id?: GraphQLTypes['bigint_comparison_exp'];
    data?: GraphQLTypes['json_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    name?: GraphQLTypes['String_comparison_exp'];
    type?: GraphQLTypes['String_comparison_exp'];
  };
  /** input type for inserting data into table "circle_integrations" */
  ['circle_integrations_insert_input']: {
    circle_id?: GraphQLTypes['bigint'];
    data?: GraphQLTypes['json'];
    name?: string;
    type?: string;
  };
  /** order by max() on columns of table "circle_integrations" */
  ['circle_integrations_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    type?: GraphQLTypes['order_by'];
  };
  /** order by min() on columns of table "circle_integrations" */
  ['circle_integrations_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    type?: GraphQLTypes['order_by'];
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
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    data?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    type?: GraphQLTypes['order_by'];
  };
  /** select columns of table "circle_integrations" */
  ['circle_integrations_select_column']: circle_integrations_select_column;
  /** order by stddev() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_pop() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_samp() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** order by sum() on columns of table "circle_integrations" */
  ['circle_integrations_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** order by var_pop() on columns of table "circle_integrations" */
  ['circle_integrations_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** order by var_samp() on columns of table "circle_integrations" */
  ['circle_integrations_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** order by variance() on columns of table "circle_integrations" */
  ['circle_integrations_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** columns and relationships of "circle_private" */
  ['circle_private']: {
    __typename: 'circle_private';
    /** An object relationship */
    circle?: GraphQLTypes['circles'];
    circle_id?: GraphQLTypes['bigint'];
    discord_webhook?: string;
  };
  /** Boolean expression to filter rows from the table "circle_private". All fields are combined with a logical 'AND'. */
  ['circle_private_bool_exp']: {
    _and?: Array<GraphQLTypes['circle_private_bool_exp']>;
    _not?: GraphQLTypes['circle_private_bool_exp'];
    _or?: Array<GraphQLTypes['circle_private_bool_exp']>;
    circle?: GraphQLTypes['circles_bool_exp'];
    circle_id?: GraphQLTypes['bigint_comparison_exp'];
    discord_webhook?: GraphQLTypes['String_comparison_exp'];
  };
  /** Ordering options when selecting data from "circle_private". */
  ['circle_private_order_by']: {
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    discord_webhook?: GraphQLTypes['order_by'];
  };
  /** select columns of table "circle_private" */
  ['circle_private_select_column']: circle_private_select_column;
  /** columns and relationships of "circles" */
  ['circles']: {
    __typename: 'circles';
    alloc_text?: string;
    auto_opt_out: boolean;
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An object relationship */
    circle_private?: GraphQLTypes['circle_private'];
    created_at?: GraphQLTypes['timestamp'];
    default_opt_in: boolean;
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    id: GraphQLTypes['bigint'];
    /** An array relationship */
    integrations: Array<GraphQLTypes['circle_integrations']>;
    is_verified: boolean;
    logo?: string;
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
    team_sel_text?: string;
    team_selection: boolean;
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    token_name: string;
    updated_at?: GraphQLTypes['timestamp'];
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    vouching: boolean;
    vouching_text?: string;
  };
  /** order by aggregate values of table "circles" */
  ['circles_aggregate_order_by']: {
    avg?: GraphQLTypes['circles_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['circles_max_order_by'];
    min?: GraphQLTypes['circles_min_order_by'];
    stddev?: GraphQLTypes['circles_stddev_order_by'];
    stddev_pop?: GraphQLTypes['circles_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['circles_stddev_samp_order_by'];
    sum?: GraphQLTypes['circles_sum_order_by'];
    var_pop?: GraphQLTypes['circles_var_pop_order_by'];
    var_samp?: GraphQLTypes['circles_var_samp_order_by'];
    variance?: GraphQLTypes['circles_variance_order_by'];
  };
  /** order by avg() on columns of table "circles" */
  ['circles_avg_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "circles". All fields are combined with a logical 'AND'. */
  ['circles_bool_exp']: {
    _and?: Array<GraphQLTypes['circles_bool_exp']>;
    _not?: GraphQLTypes['circles_bool_exp'];
    _or?: Array<GraphQLTypes['circles_bool_exp']>;
    alloc_text?: GraphQLTypes['String_comparison_exp'];
    auto_opt_out?: GraphQLTypes['Boolean_comparison_exp'];
    burns?: GraphQLTypes['burns_bool_exp'];
    circle_private?: GraphQLTypes['circle_private_bool_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    default_opt_in?: GraphQLTypes['Boolean_comparison_exp'];
    epochs?: GraphQLTypes['epochs_bool_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    integrations?: GraphQLTypes['circle_integrations_bool_exp'];
    is_verified?: GraphQLTypes['Boolean_comparison_exp'];
    logo?: GraphQLTypes['String_comparison_exp'];
    min_vouches?: GraphQLTypes['Int_comparison_exp'];
    name?: GraphQLTypes['String_comparison_exp'];
    nomination_days_limit?: GraphQLTypes['Int_comparison_exp'];
    nominees?: GraphQLTypes['nominees_bool_exp'];
    only_giver_vouch?: GraphQLTypes['Boolean_comparison_exp'];
    organization?: GraphQLTypes['organizations_bool_exp'];
    pending_token_gifts?: GraphQLTypes['pending_token_gifts_bool_exp'];
    protocol_id?: GraphQLTypes['Int_comparison_exp'];
    team_sel_text?: GraphQLTypes['String_comparison_exp'];
    team_selection?: GraphQLTypes['Boolean_comparison_exp'];
    token_gifts?: GraphQLTypes['token_gifts_bool_exp'];
    token_name?: GraphQLTypes['String_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
    users?: GraphQLTypes['users_bool_exp'];
    vouching?: GraphQLTypes['Boolean_comparison_exp'];
    vouching_text?: GraphQLTypes['String_comparison_exp'];
  };
  /** input type for incrementing numeric columns in table "circles" */
  ['circles_inc_input']: {
    min_vouches?: number;
    nomination_days_limit?: number;
  };
  /** order by max() on columns of table "circles" */
  ['circles_max_order_by']: {
    alloc_text?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    logo?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
    team_sel_text?: GraphQLTypes['order_by'];
    token_name?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    vouching_text?: GraphQLTypes['order_by'];
  };
  /** order by min() on columns of table "circles" */
  ['circles_min_order_by']: {
    alloc_text?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    logo?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
    team_sel_text?: GraphQLTypes['order_by'];
    token_name?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    vouching_text?: GraphQLTypes['order_by'];
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
    alloc_text?: GraphQLTypes['order_by'];
    auto_opt_out?: GraphQLTypes['order_by'];
    burns_aggregate?: GraphQLTypes['burns_aggregate_order_by'];
    circle_private?: GraphQLTypes['circle_private_order_by'];
    created_at?: GraphQLTypes['order_by'];
    default_opt_in?: GraphQLTypes['order_by'];
    epochs_aggregate?: GraphQLTypes['epochs_aggregate_order_by'];
    id?: GraphQLTypes['order_by'];
    integrations_aggregate?: GraphQLTypes['circle_integrations_aggregate_order_by'];
    is_verified?: GraphQLTypes['order_by'];
    logo?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    nominees_aggregate?: GraphQLTypes['nominees_aggregate_order_by'];
    only_giver_vouch?: GraphQLTypes['order_by'];
    organization?: GraphQLTypes['organizations_order_by'];
    pending_token_gifts_aggregate?: GraphQLTypes['pending_token_gifts_aggregate_order_by'];
    protocol_id?: GraphQLTypes['order_by'];
    team_sel_text?: GraphQLTypes['order_by'];
    team_selection?: GraphQLTypes['order_by'];
    token_gifts_aggregate?: GraphQLTypes['token_gifts_aggregate_order_by'];
    token_name?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    users_aggregate?: GraphQLTypes['users_aggregate_order_by'];
    vouching?: GraphQLTypes['order_by'];
    vouching_text?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: circles */
  ['circles_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "circles" */
  ['circles_select_column']: circles_select_column;
  /** input type for updating data in table "circles" */
  ['circles_set_input']: {
    alloc_text?: string;
    auto_opt_out?: boolean;
    default_opt_in?: boolean;
    discord_webhook?: string;
    is_verified?: boolean;
    logo?: string;
    min_vouches?: number;
    name?: string;
    nomination_days_limit?: number;
    only_giver_vouch?: boolean;
    team_sel_text?: string;
    team_selection?: boolean;
    token_name?: string;
    vouching?: boolean;
    vouching_text?: string;
  };
  /** order by stddev() on columns of table "circles" */
  ['circles_stddev_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_pop() on columns of table "circles" */
  ['circles_stddev_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_samp() on columns of table "circles" */
  ['circles_stddev_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** order by sum() on columns of table "circles" */
  ['circles_sum_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** order by var_pop() on columns of table "circles" */
  ['circles_var_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** order by var_samp() on columns of table "circles" */
  ['circles_var_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** order by variance() on columns of table "circles" */
  ['circles_variance_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** columns and relationships of "claims" */
  ['claims']: {
    __typename: 'claims';
    address: string;
    amount: GraphQLTypes['numeric'];
    claimed: boolean;
    /** An object relationship */
    createdByUser: GraphQLTypes['users'];
    created_at: GraphQLTypes['timestamptz'];
    created_by: GraphQLTypes['bigint'];
    /** An object relationship */
    distribution: GraphQLTypes['distributions'];
    distribution_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    index: GraphQLTypes['bigint'];
    new_amount: GraphQLTypes['numeric'];
    proof: string;
    /** An object relationship */
    updatedByUser: GraphQLTypes['users'];
    updated_at: GraphQLTypes['timestamptz'];
    updated_by: GraphQLTypes['bigint'];
    /** An object relationship */
    user: GraphQLTypes['users'];
    user_id: GraphQLTypes['bigint'];
  };
  /** order by aggregate values of table "claims" */
  ['claims_aggregate_order_by']: {
    avg?: GraphQLTypes['claims_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['claims_max_order_by'];
    min?: GraphQLTypes['claims_min_order_by'];
    stddev?: GraphQLTypes['claims_stddev_order_by'];
    stddev_pop?: GraphQLTypes['claims_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['claims_stddev_samp_order_by'];
    sum?: GraphQLTypes['claims_sum_order_by'];
    var_pop?: GraphQLTypes['claims_var_pop_order_by'];
    var_samp?: GraphQLTypes['claims_var_samp_order_by'];
    variance?: GraphQLTypes['claims_variance_order_by'];
  };
  /** input type for inserting array relation for remote table "claims" */
  ['claims_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['claims_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['claims_on_conflict'];
  };
  /** order by avg() on columns of table "claims" */
  ['claims_avg_order_by']: {
    amount?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "claims". All fields are combined with a logical 'AND'. */
  ['claims_bool_exp']: {
    _and?: Array<GraphQLTypes['claims_bool_exp']>;
    _not?: GraphQLTypes['claims_bool_exp'];
    _or?: Array<GraphQLTypes['claims_bool_exp']>;
    address?: GraphQLTypes['String_comparison_exp'];
    amount?: GraphQLTypes['numeric_comparison_exp'];
    claimed?: GraphQLTypes['Boolean_comparison_exp'];
    createdByUser?: GraphQLTypes['users_bool_exp'];
    created_at?: GraphQLTypes['timestamptz_comparison_exp'];
    created_by?: GraphQLTypes['bigint_comparison_exp'];
    distribution?: GraphQLTypes['distributions_bool_exp'];
    distribution_id?: GraphQLTypes['bigint_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    index?: GraphQLTypes['bigint_comparison_exp'];
    new_amount?: GraphQLTypes['numeric_comparison_exp'];
    proof?: GraphQLTypes['String_comparison_exp'];
    updatedByUser?: GraphQLTypes['users_bool_exp'];
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'];
    updated_by?: GraphQLTypes['bigint_comparison_exp'];
    user?: GraphQLTypes['users_bool_exp'];
    user_id?: GraphQLTypes['bigint_comparison_exp'];
  };
  /** unique or primary key constraints on table "claims" */
  ['claims_constraint']: claims_constraint;
  /** input type for inserting data into table "claims" */
  ['claims_insert_input']: {
    address?: string;
    amount?: GraphQLTypes['numeric'];
    distribution?: GraphQLTypes['distributions_obj_rel_insert_input'];
    id?: GraphQLTypes['bigint'];
    index?: GraphQLTypes['bigint'];
    new_amount?: GraphQLTypes['numeric'];
    proof?: string;
    user_id?: GraphQLTypes['bigint'];
  };
  /** order by max() on columns of table "claims" */
  ['claims_max_order_by']: {
    address?: GraphQLTypes['order_by'];
    amount?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    proof?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by min() on columns of table "claims" */
  ['claims_min_order_by']: {
    address?: GraphQLTypes['order_by'];
    amount?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    proof?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
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
    where?: GraphQLTypes['claims_bool_exp'];
  };
  /** Ordering options when selecting data from "claims". */
  ['claims_order_by']: {
    address?: GraphQLTypes['order_by'];
    amount?: GraphQLTypes['order_by'];
    claimed?: GraphQLTypes['order_by'];
    createdByUser?: GraphQLTypes['users_order_by'];
    created_at?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution?: GraphQLTypes['distributions_order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    proof?: GraphQLTypes['order_by'];
    updatedByUser?: GraphQLTypes['users_order_by'];
    updated_at?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user?: GraphQLTypes['users_order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: claims */
  ['claims_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "claims" */
  ['claims_select_column']: claims_select_column;
  /** input type for updating data in table "claims" */
  ['claims_set_input']: {
    claimed?: boolean;
  };
  /** order by stddev() on columns of table "claims" */
  ['claims_stddev_order_by']: {
    amount?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_pop() on columns of table "claims" */
  ['claims_stddev_pop_order_by']: {
    amount?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_samp() on columns of table "claims" */
  ['claims_stddev_samp_order_by']: {
    amount?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by sum() on columns of table "claims" */
  ['claims_sum_order_by']: {
    amount?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** update columns of table "claims" */
  ['claims_update_column']: claims_update_column;
  /** order by var_pop() on columns of table "claims" */
  ['claims_var_pop_order_by']: {
    amount?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by var_samp() on columns of table "claims" */
  ['claims_var_samp_order_by']: {
    amount?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by variance() on columns of table "claims" */
  ['claims_variance_order_by']: {
    amount?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    index?: GraphQLTypes['order_by'];
    new_amount?: GraphQLTypes['order_by'];
    updated_by?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  ['date']: any;
  /** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
  ['date_comparison_exp']: {
    _eq?: GraphQLTypes['date'];
    _gt?: GraphQLTypes['date'];
    _gte?: GraphQLTypes['date'];
    _in?: Array<GraphQLTypes['date']>;
    _is_null?: boolean;
    _lt?: GraphQLTypes['date'];
    _lte?: GraphQLTypes['date'];
    _neq?: GraphQLTypes['date'];
    _nin?: Array<GraphQLTypes['date']>;
  };
  /** Vault Distributions


columns and relationships of "distributions" */
  ['distributions']: {
    __typename: 'distributions';
    /** fetch data from the table: "claims" */
    claims: Array<GraphQLTypes['claims']>;
    created_at: GraphQLTypes['timestamp'];
    created_by: GraphQLTypes['bigint'];
    distribution_epoch_id?: GraphQLTypes['bigint'];
    distribution_json: GraphQLTypes['jsonb'];
    /** An object relationship */
    epoch: GraphQLTypes['epochs'];
    epoch_id: GraphQLTypes['bigint'];
    id: GraphQLTypes['bigint'];
    merkle_root?: string;
    saved_on_chain: boolean;
    total_amount: GraphQLTypes['numeric'];
    /** An object relationship */
    vault: GraphQLTypes['vaults'];
    vault_id: GraphQLTypes['bigint'];
  };
  /** Boolean expression to filter rows from the table "distributions". All fields are combined with a logical 'AND'. */
  ['distributions_bool_exp']: {
    _and?: Array<GraphQLTypes['distributions_bool_exp']>;
    _not?: GraphQLTypes['distributions_bool_exp'];
    _or?: Array<GraphQLTypes['distributions_bool_exp']>;
    claims?: GraphQLTypes['claims_bool_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    created_by?: GraphQLTypes['bigint_comparison_exp'];
    distribution_epoch_id?: GraphQLTypes['bigint_comparison_exp'];
    distribution_json?: GraphQLTypes['jsonb_comparison_exp'];
    epoch?: GraphQLTypes['epochs_bool_exp'];
    epoch_id?: GraphQLTypes['bigint_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    merkle_root?: GraphQLTypes['String_comparison_exp'];
    saved_on_chain?: GraphQLTypes['Boolean_comparison_exp'];
    total_amount?: GraphQLTypes['numeric_comparison_exp'];
    vault?: GraphQLTypes['vaults_bool_exp'];
    vault_id?: GraphQLTypes['bigint_comparison_exp'];
  };
  /** unique or primary key constraints on table "distributions" */
  ['distributions_constraint']: distributions_constraint;
  /** input type for incrementing numeric columns in table "distributions" */
  ['distributions_inc_input']: {
    distribution_epoch_id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "distributions" */
  ['distributions_insert_input']: {
    claims?: GraphQLTypes['claims_arr_rel_insert_input'];
    distribution_epoch_id?: GraphQLTypes['bigint'];
    distribution_json?: GraphQLTypes['jsonb'];
    epoch_id?: GraphQLTypes['bigint'];
    merkle_root?: string;
    total_amount?: GraphQLTypes['numeric'];
    vault?: GraphQLTypes['vaults_obj_rel_insert_input'];
    vault_id?: GraphQLTypes['bigint'];
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
    on_conflict?: GraphQLTypes['distributions_on_conflict'];
  };
  /** on conflict condition type for table "distributions" */
  ['distributions_on_conflict']: {
    constraint: GraphQLTypes['distributions_constraint'];
    update_columns: Array<GraphQLTypes['distributions_update_column']>;
    where?: GraphQLTypes['distributions_bool_exp'];
  };
  /** Ordering options when selecting data from "distributions". */
  ['distributions_order_by']: {
    claims_aggregate?: GraphQLTypes['claims_aggregate_order_by'];
    created_at?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    distribution_epoch_id?: GraphQLTypes['order_by'];
    distribution_json?: GraphQLTypes['order_by'];
    epoch?: GraphQLTypes['epochs_order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    merkle_root?: GraphQLTypes['order_by'];
    saved_on_chain?: GraphQLTypes['order_by'];
    total_amount?: GraphQLTypes['order_by'];
    vault?: GraphQLTypes['vaults_order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: distributions */
  ['distributions_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "distributions" */
  ['distributions_select_column']: distributions_select_column;
  /** input type for updating data in table "distributions" */
  ['distributions_set_input']: {
    distribution_epoch_id?: GraphQLTypes['bigint'];
    saved_on_chain?: boolean;
  };
  /** update columns of table "distributions" */
  ['distributions_update_column']: distributions_update_column;
  /** columns and relationships of "epoches" */
  ['epochs']: {
    __typename: 'epochs';
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An object relationship */
    circle?: GraphQLTypes['circles'];
    circle_id: number;
    created_at: GraphQLTypes['timestamp'];
    days?: number;
    end_date: GraphQLTypes['timestamptz'];
    ended: boolean;
    /** An array relationship */
    epoch_pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    grant: GraphQLTypes['numeric'];
    id: GraphQLTypes['bigint'];
    notified_before_end?: GraphQLTypes['timestamp'];
    notified_end?: GraphQLTypes['timestamp'];
    notified_start?: GraphQLTypes['timestamp'];
    number?: number;
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
    avg?: GraphQLTypes['epochs_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['epochs_max_order_by'];
    min?: GraphQLTypes['epochs_min_order_by'];
    stddev?: GraphQLTypes['epochs_stddev_order_by'];
    stddev_pop?: GraphQLTypes['epochs_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['epochs_stddev_samp_order_by'];
    sum?: GraphQLTypes['epochs_sum_order_by'];
    var_pop?: GraphQLTypes['epochs_var_pop_order_by'];
    var_samp?: GraphQLTypes['epochs_var_samp_order_by'];
    variance?: GraphQLTypes['epochs_variance_order_by'];
  };
  /** order by avg() on columns of table "epoches" */
  ['epochs_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "epoches". All fields are combined with a logical 'AND'. */
  ['epochs_bool_exp']: {
    _and?: Array<GraphQLTypes['epochs_bool_exp']>;
    _not?: GraphQLTypes['epochs_bool_exp'];
    _or?: Array<GraphQLTypes['epochs_bool_exp']>;
    burns?: GraphQLTypes['burns_bool_exp'];
    circle?: GraphQLTypes['circles_bool_exp'];
    circle_id?: GraphQLTypes['Int_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    days?: GraphQLTypes['Int_comparison_exp'];
    end_date?: GraphQLTypes['timestamptz_comparison_exp'];
    ended?: GraphQLTypes['Boolean_comparison_exp'];
    epoch_pending_token_gifts?: GraphQLTypes['pending_token_gifts_bool_exp'];
    grant?: GraphQLTypes['numeric_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    notified_before_end?: GraphQLTypes['timestamp_comparison_exp'];
    notified_end?: GraphQLTypes['timestamp_comparison_exp'];
    notified_start?: GraphQLTypes['timestamp_comparison_exp'];
    number?: GraphQLTypes['Int_comparison_exp'];
    repeat?: GraphQLTypes['Int_comparison_exp'];
    repeat_day_of_month?: GraphQLTypes['Int_comparison_exp'];
    start_date?: GraphQLTypes['timestamptz_comparison_exp'];
    token_gifts?: GraphQLTypes['token_gifts_bool_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** order by max() on columns of table "epoches" */
  ['epochs_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    end_date?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    notified_before_end?: GraphQLTypes['order_by'];
    notified_end?: GraphQLTypes['order_by'];
    notified_start?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
    start_date?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** order by min() on columns of table "epoches" */
  ['epochs_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    end_date?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    notified_before_end?: GraphQLTypes['order_by'];
    notified_end?: GraphQLTypes['order_by'];
    notified_start?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
    start_date?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** Ordering options when selecting data from "epoches". */
  ['epochs_order_by']: {
    burns_aggregate?: GraphQLTypes['burns_aggregate_order_by'];
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    end_date?: GraphQLTypes['order_by'];
    ended?: GraphQLTypes['order_by'];
    epoch_pending_token_gifts_aggregate?: GraphQLTypes['pending_token_gifts_aggregate_order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    notified_before_end?: GraphQLTypes['order_by'];
    notified_end?: GraphQLTypes['order_by'];
    notified_start?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
    start_date?: GraphQLTypes['order_by'];
    token_gifts_aggregate?: GraphQLTypes['token_gifts_aggregate_order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** select columns of table "epoches" */
  ['epochs_select_column']: epochs_select_column;
  /** order by stddev() on columns of table "epoches" */
  ['epochs_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** order by stddev_pop() on columns of table "epoches" */
  ['epochs_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** order by stddev_samp() on columns of table "epoches" */
  ['epochs_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** order by sum() on columns of table "epoches" */
  ['epochs_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** order by var_pop() on columns of table "epoches" */
  ['epochs_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** order by var_samp() on columns of table "epoches" */
  ['epochs_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** order by variance() on columns of table "epoches" */
  ['epochs_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** columns and relationships of "gift_private" */
  ['gift_private']: {
    __typename: 'gift_private';
    gift_id?: GraphQLTypes['bigint'];
    note?: string;
    /** An object relationship */
    recipient?: GraphQLTypes['users'];
    recipient_id?: GraphQLTypes['bigint'];
    /** An object relationship */
    sender?: GraphQLTypes['users'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** Boolean expression to filter rows from the table "gift_private". All fields are combined with a logical 'AND'. */
  ['gift_private_bool_exp']: {
    _and?: Array<GraphQLTypes['gift_private_bool_exp']>;
    _not?: GraphQLTypes['gift_private_bool_exp'];
    _or?: Array<GraphQLTypes['gift_private_bool_exp']>;
    gift_id?: GraphQLTypes['bigint_comparison_exp'];
    note?: GraphQLTypes['String_comparison_exp'];
    recipient?: GraphQLTypes['users_bool_exp'];
    recipient_id?: GraphQLTypes['bigint_comparison_exp'];
    sender?: GraphQLTypes['users_bool_exp'];
    sender_id?: GraphQLTypes['bigint_comparison_exp'];
  };
  /** Ordering options when selecting data from "gift_private". */
  ['gift_private_order_by']: {
    gift_id?: GraphQLTypes['order_by'];
    note?: GraphQLTypes['order_by'];
    recipient?: GraphQLTypes['users_order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender?: GraphQLTypes['users_order_by'];
    sender_id?: GraphQLTypes['order_by'];
  };
  /** select columns of table "gift_private" */
  ['gift_private_select_column']: gift_private_select_column;
  ['json']: any;
  /** Boolean expression to compare columns of type "json". All fields are combined with logical 'AND'. */
  ['json_comparison_exp']: {
    _eq?: GraphQLTypes['json'];
    _gt?: GraphQLTypes['json'];
    _gte?: GraphQLTypes['json'];
    _in?: Array<GraphQLTypes['json']>;
    _is_null?: boolean;
    _lt?: GraphQLTypes['json'];
    _lte?: GraphQLTypes['json'];
    _neq?: GraphQLTypes['json'];
    _nin?: Array<GraphQLTypes['json']>;
  };
  ['jsonb']: any;
  /** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
  ['jsonb_comparison_exp']: {
    /** is the column contained in the given json value */
    _contained_in?: GraphQLTypes['jsonb'];
    /** does the column contain the given json value at the top level */
    _contains?: GraphQLTypes['jsonb'];
    _eq?: GraphQLTypes['jsonb'];
    _gt?: GraphQLTypes['jsonb'];
    _gte?: GraphQLTypes['jsonb'];
    /** does the string exist as a top-level key in the column */
    _has_key?: string;
    /** do all of these strings exist as top-level keys in the column */
    _has_keys_all?: Array<string>;
    /** do any of these strings exist as top-level keys in the column */
    _has_keys_any?: Array<string>;
    _in?: Array<GraphQLTypes['jsonb']>;
    _is_null?: boolean;
    _lt?: GraphQLTypes['jsonb'];
    _lte?: GraphQLTypes['jsonb'];
    _neq?: GraphQLTypes['jsonb'];
    _nin?: Array<GraphQLTypes['jsonb']>;
  };
  /** mutation root */
  ['mutation_root']: {
    __typename: 'mutation_root';
    adminUpdateUser?: GraphQLTypes['UserResponse'];
    createCircle?: GraphQLTypes['CreateCircleResponse'];
    createEpoch?: GraphQLTypes['EpochResponse'];
    createNominee?: GraphQLTypes['CreateNomineeResponse'];
    createUser?: GraphQLTypes['UserResponse'];
    deleteEpoch?: GraphQLTypes['DeleteEpochResponse'];
    deleteUser?: GraphQLTypes['ConfirmationResponse'];
    /** delete data from the table: "circle_integrations" */
    delete_circle_integrations?: GraphQLTypes['circle_integrations_mutation_response'];
    /** delete single row from the table: "circle_integrations" */
    delete_circle_integrations_by_pk?: GraphQLTypes['circle_integrations'];
    /** insert data into the table: "circle_integrations" */
    insert_circle_integrations?: GraphQLTypes['circle_integrations_mutation_response'];
    /** insert a single row into the table: "circle_integrations" */
    insert_circle_integrations_one?: GraphQLTypes['circle_integrations'];
    /** insert data into the table: "claims" */
    insert_claims?: GraphQLTypes['claims_mutation_response'];
    /** insert a single row into the table: "claims" */
    insert_claims_one?: GraphQLTypes['claims'];
    /** insert data into the table: "distributions" */
    insert_distributions?: GraphQLTypes['distributions_mutation_response'];
    /** insert a single row into the table: "distributions" */
    insert_distributions_one?: GraphQLTypes['distributions'];
    /** insert data into the table: "vault_transactions" */
    insert_vault_transactions?: GraphQLTypes['vault_transactions_mutation_response'];
    /** insert a single row into the table: "vault_transactions" */
    insert_vault_transactions_one?: GraphQLTypes['vault_transactions'];
    /** insert data into the table: "vaults" */
    insert_vaults?: GraphQLTypes['vaults_mutation_response'];
    /** insert a single row into the table: "vaults" */
    insert_vaults_one?: GraphQLTypes['vaults'];
    logoutUser?: GraphQLTypes['LogoutResponse'];
    updateAllocations?: GraphQLTypes['AllocationsResponse'];
    updateCircle?: GraphQLTypes['UpdateCircleOutput'];
    updateEpoch?: GraphQLTypes['EpochResponse'];
    updateTeammates?: GraphQLTypes['UpdateTeammatesResponse'];
    /** Update own user */
    updateUser?: GraphQLTypes['UserResponse'];
    /** update data of the table: "circles" */
    update_circles?: GraphQLTypes['circles_mutation_response'];
    /** update single row of the table: "circles" */
    update_circles_by_pk?: GraphQLTypes['circles'];
    /** update data of the table: "claims" */
    update_claims?: GraphQLTypes['claims_mutation_response'];
    /** update single row of the table: "claims" */
    update_claims_by_pk?: GraphQLTypes['claims'];
    /** update data of the table: "distributions" */
    update_distributions?: GraphQLTypes['distributions_mutation_response'];
    /** update single row of the table: "distributions" */
    update_distributions_by_pk?: GraphQLTypes['distributions'];
    /** update data of the table: "profiles" */
    update_profiles?: GraphQLTypes['profiles_mutation_response'];
    /** update single row of the table: "profiles" */
    update_profiles_by_pk?: GraphQLTypes['profiles'];
    uploadCircleLogo?: GraphQLTypes['UpdateCircleResponse'];
    uploadProfileAvatar?: GraphQLTypes['UpdateProfileResponse'];
    uploadProfileBackground?: GraphQLTypes['UpdateProfileResponse'];
    vouch?: GraphQLTypes['VouchOutput'];
  };
  /** columns and relationships of "nominees" */
  ['nominees']: {
    __typename: 'nominees';
    address: string;
    /** An object relationship */
    circle?: GraphQLTypes['circles'];
    circle_id: number;
    created_at?: GraphQLTypes['timestamp'];
    description: string;
    ended: boolean;
    expiry_date: GraphQLTypes['date'];
    id: GraphQLTypes['bigint'];
    name: string;
    nominated_by_user_id: number;
    nominated_date: GraphQLTypes['date'];
    /** An array relationship */
    nominations: Array<GraphQLTypes['vouches']>;
    /** An object relationship */
    nominator?: GraphQLTypes['users'];
    updated_at?: GraphQLTypes['timestamp'];
    /** An object relationship */
    user?: GraphQLTypes['users'];
    user_id?: number;
    vouches_required: number;
  };
  /** aggregated selection of "nominees" */
  ['nominees_aggregate']: {
    __typename: 'nominees_aggregate';
    aggregate?: GraphQLTypes['nominees_aggregate_fields'];
    nodes: Array<GraphQLTypes['nominees']>;
  };
  /** aggregate fields of "nominees" */
  ['nominees_aggregate_fields']: {
    __typename: 'nominees_aggregate_fields';
    avg?: GraphQLTypes['nominees_avg_fields'];
    count: number;
    max?: GraphQLTypes['nominees_max_fields'];
    min?: GraphQLTypes['nominees_min_fields'];
    stddev?: GraphQLTypes['nominees_stddev_fields'];
    stddev_pop?: GraphQLTypes['nominees_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['nominees_stddev_samp_fields'];
    sum?: GraphQLTypes['nominees_sum_fields'];
    var_pop?: GraphQLTypes['nominees_var_pop_fields'];
    var_samp?: GraphQLTypes['nominees_var_samp_fields'];
    variance?: GraphQLTypes['nominees_variance_fields'];
  };
  /** order by aggregate values of table "nominees" */
  ['nominees_aggregate_order_by']: {
    avg?: GraphQLTypes['nominees_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['nominees_max_order_by'];
    min?: GraphQLTypes['nominees_min_order_by'];
    stddev?: GraphQLTypes['nominees_stddev_order_by'];
    stddev_pop?: GraphQLTypes['nominees_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['nominees_stddev_samp_order_by'];
    sum?: GraphQLTypes['nominees_sum_order_by'];
    var_pop?: GraphQLTypes['nominees_var_pop_order_by'];
    var_samp?: GraphQLTypes['nominees_var_samp_order_by'];
    variance?: GraphQLTypes['nominees_variance_order_by'];
  };
  /** aggregate avg on columns */
  ['nominees_avg_fields']: {
    __typename: 'nominees_avg_fields';
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by avg() on columns of table "nominees" */
  ['nominees_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "nominees". All fields are combined with a logical 'AND'. */
  ['nominees_bool_exp']: {
    _and?: Array<GraphQLTypes['nominees_bool_exp']>;
    _not?: GraphQLTypes['nominees_bool_exp'];
    _or?: Array<GraphQLTypes['nominees_bool_exp']>;
    address?: GraphQLTypes['String_comparison_exp'];
    circle?: GraphQLTypes['circles_bool_exp'];
    circle_id?: GraphQLTypes['Int_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    description?: GraphQLTypes['String_comparison_exp'];
    ended?: GraphQLTypes['Boolean_comparison_exp'];
    expiry_date?: GraphQLTypes['date_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    name?: GraphQLTypes['String_comparison_exp'];
    nominated_by_user_id?: GraphQLTypes['Int_comparison_exp'];
    nominated_date?: GraphQLTypes['date_comparison_exp'];
    nominations?: GraphQLTypes['vouches_bool_exp'];
    nominator?: GraphQLTypes['users_bool_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
    user?: GraphQLTypes['users_bool_exp'];
    user_id?: GraphQLTypes['Int_comparison_exp'];
    vouches_required?: GraphQLTypes['Int_comparison_exp'];
  };
  /** aggregate max on columns */
  ['nominees_max_fields']: {
    __typename: 'nominees_max_fields';
    address?: string;
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    description?: string;
    expiry_date?: GraphQLTypes['date'];
    id?: GraphQLTypes['bigint'];
    name?: string;
    nominated_by_user_id?: number;
    nominated_date?: GraphQLTypes['date'];
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: number;
    vouches_required?: number;
  };
  /** order by max() on columns of table "nominees" */
  ['nominees_max_order_by']: {
    address?: GraphQLTypes['order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    description?: GraphQLTypes['order_by'];
    expiry_date?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    nominated_date?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  /** aggregate min on columns */
  ['nominees_min_fields']: {
    __typename: 'nominees_min_fields';
    address?: string;
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    description?: string;
    expiry_date?: GraphQLTypes['date'];
    id?: GraphQLTypes['bigint'];
    name?: string;
    nominated_by_user_id?: number;
    nominated_date?: GraphQLTypes['date'];
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: number;
    vouches_required?: number;
  };
  /** order by min() on columns of table "nominees" */
  ['nominees_min_order_by']: {
    address?: GraphQLTypes['order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    description?: GraphQLTypes['order_by'];
    expiry_date?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    nominated_date?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  /** Ordering options when selecting data from "nominees". */
  ['nominees_order_by']: {
    address?: GraphQLTypes['order_by'];
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    description?: GraphQLTypes['order_by'];
    ended?: GraphQLTypes['order_by'];
    expiry_date?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    nominated_date?: GraphQLTypes['order_by'];
    nominations_aggregate?: GraphQLTypes['vouches_aggregate_order_by'];
    nominator?: GraphQLTypes['users_order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user?: GraphQLTypes['users_order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  /** select columns of table "nominees" */
  ['nominees_select_column']: nominees_select_column;
  /** aggregate stddev on columns */
  ['nominees_stddev_fields']: {
    __typename: 'nominees_stddev_fields';
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by stddev() on columns of table "nominees" */
  ['nominees_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['nominees_stddev_pop_fields']: {
    __typename: 'nominees_stddev_pop_fields';
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by stddev_pop() on columns of table "nominees" */
  ['nominees_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_samp on columns */
  ['nominees_stddev_samp_fields']: {
    __typename: 'nominees_stddev_samp_fields';
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by stddev_samp() on columns of table "nominees" */
  ['nominees_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  /** aggregate sum on columns */
  ['nominees_sum_fields']: {
    __typename: 'nominees_sum_fields';
    circle_id?: number;
    id?: GraphQLTypes['bigint'];
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by sum() on columns of table "nominees" */
  ['nominees_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  /** aggregate var_pop on columns */
  ['nominees_var_pop_fields']: {
    __typename: 'nominees_var_pop_fields';
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by var_pop() on columns of table "nominees" */
  ['nominees_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  /** aggregate var_samp on columns */
  ['nominees_var_samp_fields']: {
    __typename: 'nominees_var_samp_fields';
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by var_samp() on columns of table "nominees" */
  ['nominees_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  /** aggregate variance on columns */
  ['nominees_variance_fields']: {
    __typename: 'nominees_variance_fields';
    circle_id?: number;
    id?: number;
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** order by variance() on columns of table "nominees" */
  ['nominees_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominated_by_user_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
    vouches_required?: GraphQLTypes['order_by'];
  };
  ['numeric']: any;
  /** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
  ['numeric_comparison_exp']: {
    _eq?: GraphQLTypes['numeric'];
    _gt?: GraphQLTypes['numeric'];
    _gte?: GraphQLTypes['numeric'];
    _in?: Array<GraphQLTypes['numeric']>;
    _is_null?: boolean;
    _lt?: GraphQLTypes['numeric'];
    _lte?: GraphQLTypes['numeric'];
    _neq?: GraphQLTypes['numeric'];
    _nin?: Array<GraphQLTypes['numeric']>;
  };
  /** column ordering options */
  ['order_by']: order_by;
  /** columns and relationships of "protocols" */
  ['organizations']: {
    __typename: 'organizations';
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    created_at?: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    name: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
  ['organizations_bool_exp']: {
    _and?: Array<GraphQLTypes['organizations_bool_exp']>;
    _not?: GraphQLTypes['organizations_bool_exp'];
    _or?: Array<GraphQLTypes['organizations_bool_exp']>;
    circles?: GraphQLTypes['circles_bool_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    name?: GraphQLTypes['String_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** Ordering options when selecting data from "protocols". */
  ['organizations_order_by']: {
    circles_aggregate?: GraphQLTypes['circles_aggregate_order_by'];
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** select columns of table "protocols" */
  ['organizations_select_column']: organizations_select_column;
  /** columns and relationships of "pending_gift_private" */
  ['pending_gift_private']: {
    __typename: 'pending_gift_private';
    gift_id?: GraphQLTypes['bigint'];
    note?: string;
    /** An object relationship */
    recipient?: GraphQLTypes['users'];
    recipient_id?: GraphQLTypes['bigint'];
    /** An object relationship */
    sender?: GraphQLTypes['users'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** Boolean expression to filter rows from the table "pending_gift_private". All fields are combined with a logical 'AND'. */
  ['pending_gift_private_bool_exp']: {
    _and?: Array<GraphQLTypes['pending_gift_private_bool_exp']>;
    _not?: GraphQLTypes['pending_gift_private_bool_exp'];
    _or?: Array<GraphQLTypes['pending_gift_private_bool_exp']>;
    gift_id?: GraphQLTypes['bigint_comparison_exp'];
    note?: GraphQLTypes['String_comparison_exp'];
    recipient?: GraphQLTypes['users_bool_exp'];
    recipient_id?: GraphQLTypes['bigint_comparison_exp'];
    sender?: GraphQLTypes['users_bool_exp'];
    sender_id?: GraphQLTypes['bigint_comparison_exp'];
  };
  /** Ordering options when selecting data from "pending_gift_private". */
  ['pending_gift_private_order_by']: {
    gift_id?: GraphQLTypes['order_by'];
    note?: GraphQLTypes['order_by'];
    recipient?: GraphQLTypes['users_order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender?: GraphQLTypes['users_order_by'];
    sender_id?: GraphQLTypes['order_by'];
  };
  /** select columns of table "pending_gift_private" */
  ['pending_gift_private_select_column']: pending_gift_private_select_column;
  /** columns and relationships of "pending_token_gifts" */
  ['pending_token_gifts']: {
    __typename: 'pending_token_gifts';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created: GraphQLTypes['timestamp'];
    /** An object relationship */
    epoch?: GraphQLTypes['epochs'];
    epoch_id?: number;
    /** An object relationship */
    gift_private?: GraphQLTypes['pending_gift_private'];
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
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** order by aggregate values of table "pending_token_gifts" */
  ['pending_token_gifts_aggregate_order_by']: {
    avg?: GraphQLTypes['pending_token_gifts_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['pending_token_gifts_max_order_by'];
    min?: GraphQLTypes['pending_token_gifts_min_order_by'];
    stddev?: GraphQLTypes['pending_token_gifts_stddev_order_by'];
    stddev_pop?: GraphQLTypes['pending_token_gifts_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['pending_token_gifts_stddev_samp_order_by'];
    sum?: GraphQLTypes['pending_token_gifts_sum_order_by'];
    var_pop?: GraphQLTypes['pending_token_gifts_var_pop_order_by'];
    var_samp?: GraphQLTypes['pending_token_gifts_var_samp_order_by'];
    variance?: GraphQLTypes['pending_token_gifts_variance_order_by'];
  };
  /** order by avg() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "pending_token_gifts". All fields are combined with a logical 'AND'. */
  ['pending_token_gifts_bool_exp']: {
    _and?: Array<GraphQLTypes['pending_token_gifts_bool_exp']>;
    _not?: GraphQLTypes['pending_token_gifts_bool_exp'];
    _or?: Array<GraphQLTypes['pending_token_gifts_bool_exp']>;
    circle?: GraphQLTypes['circles_bool_exp'];
    circle_id?: GraphQLTypes['bigint_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    dts_created?: GraphQLTypes['timestamp_comparison_exp'];
    epoch?: GraphQLTypes['epochs_bool_exp'];
    epoch_id?: GraphQLTypes['Int_comparison_exp'];
    gift_private?: GraphQLTypes['pending_gift_private_bool_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    recipient?: GraphQLTypes['users_bool_exp'];
    recipient_address?: GraphQLTypes['String_comparison_exp'];
    recipient_id?: GraphQLTypes['bigint_comparison_exp'];
    sender?: GraphQLTypes['users_bool_exp'];
    sender_address?: GraphQLTypes['String_comparison_exp'];
    sender_id?: GraphQLTypes['bigint_comparison_exp'];
    tokens?: GraphQLTypes['Int_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** order by max() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    dts_created?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** order by min() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    dts_created?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** Ordering options when selecting data from "pending_token_gifts". */
  ['pending_token_gifts_order_by']: {
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    dts_created?: GraphQLTypes['order_by'];
    epoch?: GraphQLTypes['epochs_order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    gift_private?: GraphQLTypes['pending_gift_private_order_by'];
    id?: GraphQLTypes['order_by'];
    recipient?: GraphQLTypes['users_order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender?: GraphQLTypes['users_order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** select columns of table "pending_token_gifts" */
  ['pending_token_gifts_select_column']: pending_token_gifts_select_column;
  /** order by stddev() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** order by stddev_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** order by stddev_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** order by sum() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** order by var_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** order by var_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** order by variance() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** columns and relationships of "profiles" */
  ['profiles']: {
    __typename: 'profiles';
    address: string;
    admin_view: boolean;
    avatar?: string;
    background?: string;
    bio?: string;
    created_at?: GraphQLTypes['timestamp'];
    discord_username?: string;
    github_username?: string;
    id: GraphQLTypes['bigint'];
    medium_username?: string;
    skills?: string;
    telegram_username?: string;
    twitter_username?: string;
    updated_at?: GraphQLTypes['timestamp'];
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    website?: string;
  };
  /** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
  ['profiles_bool_exp']: {
    _and?: Array<GraphQLTypes['profiles_bool_exp']>;
    _not?: GraphQLTypes['profiles_bool_exp'];
    _or?: Array<GraphQLTypes['profiles_bool_exp']>;
    address?: GraphQLTypes['String_comparison_exp'];
    admin_view?: GraphQLTypes['Boolean_comparison_exp'];
    avatar?: GraphQLTypes['String_comparison_exp'];
    background?: GraphQLTypes['String_comparison_exp'];
    bio?: GraphQLTypes['String_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    discord_username?: GraphQLTypes['String_comparison_exp'];
    github_username?: GraphQLTypes['String_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    medium_username?: GraphQLTypes['String_comparison_exp'];
    skills?: GraphQLTypes['String_comparison_exp'];
    telegram_username?: GraphQLTypes['String_comparison_exp'];
    twitter_username?: GraphQLTypes['String_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
    users?: GraphQLTypes['users_bool_exp'];
    website?: GraphQLTypes['String_comparison_exp'];
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
    address?: GraphQLTypes['order_by'];
    admin_view?: GraphQLTypes['order_by'];
    avatar?: GraphQLTypes['order_by'];
    background?: GraphQLTypes['order_by'];
    bio?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    discord_username?: GraphQLTypes['order_by'];
    github_username?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    medium_username?: GraphQLTypes['order_by'];
    skills?: GraphQLTypes['order_by'];
    telegram_username?: GraphQLTypes['order_by'];
    twitter_username?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    users_aggregate?: GraphQLTypes['users_aggregate_order_by'];
    website?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: profiles */
  ['profiles_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "profiles" */
  ['profiles_select_column']: profiles_select_column;
  /** input type for updating data in table "profiles" */
  ['profiles_set_input']: {
    avatar?: string;
    background?: string;
    bio?: string;
    discord_username?: string;
    github_username?: string;
    medium_username?: string;
    skills?: string;
    telegram_username?: string;
    twitter_username?: string;
    website?: string;
  };
  ['query_root']: {
    __typename: 'query_root';
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: GraphQLTypes['burns'];
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: Array<GraphQLTypes['circle_integrations']>;
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: GraphQLTypes['circle_integrations'];
    /** fetch data from the table: "circle_private" */
    circle_private: Array<GraphQLTypes['circle_private']>;
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: GraphQLTypes['circles'];
    /** fetch data from the table: "claims" */
    claims: Array<GraphQLTypes['claims']>;
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: GraphQLTypes['claims'];
    /** fetch data from the table: "distributions" */
    distributions: Array<GraphQLTypes['distributions']>;
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: GraphQLTypes['distributions'];
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: GraphQLTypes['epochs'];
    /** fetch data from the table: "gift_private" */
    gift_private: Array<GraphQLTypes['gift_private']>;
    /** An array relationship */
    nominees: Array<GraphQLTypes['nominees']>;
    /** An aggregate relationship */
    nominees_aggregate: GraphQLTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: GraphQLTypes['nominees'];
    /** fetch data from the table: "protocols" */
    organizations: Array<GraphQLTypes['organizations']>;
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: GraphQLTypes['organizations'];
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: Array<GraphQLTypes['pending_gift_private']>;
    /** An array relationship */
    pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: GraphQLTypes['pending_token_gifts'];
    /** fetch data from the table: "profiles" */
    profiles: Array<GraphQLTypes['profiles']>;
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: GraphQLTypes['profiles'];
    /** An array relationship */
    teammates: Array<GraphQLTypes['teammates']>;
    /** fetch data from the table: "teammates" using primary key columns */
    teammates_by_pk?: GraphQLTypes['teammates'];
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    /** fetch data from the table: "token_gifts" using primary key columns */
    token_gifts_by_pk?: GraphQLTypes['token_gifts'];
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: GraphQLTypes['users'];
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: GraphQLTypes['vault_transactions'];
    /** fetch data from the table: "vaults" */
    vaults: Array<GraphQLTypes['vaults']>;
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: GraphQLTypes['vaults'];
    /** fetch data from the table: "vouches" */
    vouches: Array<GraphQLTypes['vouches']>;
    /** fetch data from the table: "vouches" using primary key columns */
    vouches_by_pk?: GraphQLTypes['vouches'];
  };
  ['subscription_root']: {
    __typename: 'subscription_root';
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: GraphQLTypes['burns'];
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: Array<GraphQLTypes['circle_integrations']>;
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: GraphQLTypes['circle_integrations'];
    /** fetch data from the table: "circle_private" */
    circle_private: Array<GraphQLTypes['circle_private']>;
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: GraphQLTypes['circles'];
    /** fetch data from the table: "claims" */
    claims: Array<GraphQLTypes['claims']>;
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: GraphQLTypes['claims'];
    /** fetch data from the table: "distributions" */
    distributions: Array<GraphQLTypes['distributions']>;
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: GraphQLTypes['distributions'];
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: GraphQLTypes['epochs'];
    /** fetch data from the table: "gift_private" */
    gift_private: Array<GraphQLTypes['gift_private']>;
    /** An array relationship */
    nominees: Array<GraphQLTypes['nominees']>;
    /** An aggregate relationship */
    nominees_aggregate: GraphQLTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: GraphQLTypes['nominees'];
    /** fetch data from the table: "protocols" */
    organizations: Array<GraphQLTypes['organizations']>;
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: GraphQLTypes['organizations'];
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: Array<GraphQLTypes['pending_gift_private']>;
    /** An array relationship */
    pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: GraphQLTypes['pending_token_gifts'];
    /** fetch data from the table: "profiles" */
    profiles: Array<GraphQLTypes['profiles']>;
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: GraphQLTypes['profiles'];
    /** An array relationship */
    teammates: Array<GraphQLTypes['teammates']>;
    /** fetch data from the table: "teammates" using primary key columns */
    teammates_by_pk?: GraphQLTypes['teammates'];
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    /** fetch data from the table: "token_gifts" using primary key columns */
    token_gifts_by_pk?: GraphQLTypes['token_gifts'];
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: GraphQLTypes['users'];
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: GraphQLTypes['vault_transactions'];
    /** fetch data from the table: "vaults" */
    vaults: Array<GraphQLTypes['vaults']>;
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: GraphQLTypes['vaults'];
    /** fetch data from the table: "vouches" */
    vouches: Array<GraphQLTypes['vouches']>;
    /** fetch data from the table: "vouches" using primary key columns */
    vouches_by_pk?: GraphQLTypes['vouches'];
  };
  /** columns and relationships of "teammates" */
  ['teammates']: {
    __typename: 'teammates';
    created_at?: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    team_mate_id: number;
    /** An object relationship */
    teammate?: GraphQLTypes['users'];
    updated_at?: GraphQLTypes['timestamp'];
    /** An object relationship */
    user?: GraphQLTypes['users'];
    user_id: number;
  };
  /** order by aggregate values of table "teammates" */
  ['teammates_aggregate_order_by']: {
    avg?: GraphQLTypes['teammates_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['teammates_max_order_by'];
    min?: GraphQLTypes['teammates_min_order_by'];
    stddev?: GraphQLTypes['teammates_stddev_order_by'];
    stddev_pop?: GraphQLTypes['teammates_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['teammates_stddev_samp_order_by'];
    sum?: GraphQLTypes['teammates_sum_order_by'];
    var_pop?: GraphQLTypes['teammates_var_pop_order_by'];
    var_samp?: GraphQLTypes['teammates_var_samp_order_by'];
    variance?: GraphQLTypes['teammates_variance_order_by'];
  };
  /** order by avg() on columns of table "teammates" */
  ['teammates_avg_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "teammates". All fields are combined with a logical 'AND'. */
  ['teammates_bool_exp']: {
    _and?: Array<GraphQLTypes['teammates_bool_exp']>;
    _not?: GraphQLTypes['teammates_bool_exp'];
    _or?: Array<GraphQLTypes['teammates_bool_exp']>;
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    team_mate_id?: GraphQLTypes['Int_comparison_exp'];
    teammate?: GraphQLTypes['users_bool_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
    user?: GraphQLTypes['users_bool_exp'];
    user_id?: GraphQLTypes['Int_comparison_exp'];
  };
  /** order by max() on columns of table "teammates" */
  ['teammates_max_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by min() on columns of table "teammates" */
  ['teammates_min_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** Ordering options when selecting data from "teammates". */
  ['teammates_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    teammate?: GraphQLTypes['users_order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user?: GraphQLTypes['users_order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** select columns of table "teammates" */
  ['teammates_select_column']: teammates_select_column;
  /** order by stddev() on columns of table "teammates" */
  ['teammates_stddev_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_pop() on columns of table "teammates" */
  ['teammates_stddev_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_samp() on columns of table "teammates" */
  ['teammates_stddev_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by sum() on columns of table "teammates" */
  ['teammates_sum_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by var_pop() on columns of table "teammates" */
  ['teammates_var_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by var_samp() on columns of table "teammates" */
  ['teammates_var_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** order by variance() on columns of table "teammates" */
  ['teammates_variance_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  ['timestamp']: any;
  /** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
  ['timestamp_comparison_exp']: {
    _eq?: GraphQLTypes['timestamp'];
    _gt?: GraphQLTypes['timestamp'];
    _gte?: GraphQLTypes['timestamp'];
    _in?: Array<GraphQLTypes['timestamp']>;
    _is_null?: boolean;
    _lt?: GraphQLTypes['timestamp'];
    _lte?: GraphQLTypes['timestamp'];
    _neq?: GraphQLTypes['timestamp'];
    _nin?: Array<GraphQLTypes['timestamp']>;
  };
  ['timestamptz']: any;
  /** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
  ['timestamptz_comparison_exp']: {
    _eq?: GraphQLTypes['timestamptz'];
    _gt?: GraphQLTypes['timestamptz'];
    _gte?: GraphQLTypes['timestamptz'];
    _in?: Array<GraphQLTypes['timestamptz']>;
    _is_null?: boolean;
    _lt?: GraphQLTypes['timestamptz'];
    _lte?: GraphQLTypes['timestamptz'];
    _neq?: GraphQLTypes['timestamptz'];
    _nin?: Array<GraphQLTypes['timestamptz']>;
  };
  /** columns and relationships of "token_gifts" */
  ['token_gifts']: {
    __typename: 'token_gifts';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created: GraphQLTypes['timestamp'];
    epoch_id: number;
    /** An object relationship */
    gift_private?: GraphQLTypes['gift_private'];
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
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregated selection of "token_gifts" */
  ['token_gifts_aggregate']: {
    __typename: 'token_gifts_aggregate';
    aggregate?: GraphQLTypes['token_gifts_aggregate_fields'];
    nodes: Array<GraphQLTypes['token_gifts']>;
  };
  /** aggregate fields of "token_gifts" */
  ['token_gifts_aggregate_fields']: {
    __typename: 'token_gifts_aggregate_fields';
    avg?: GraphQLTypes['token_gifts_avg_fields'];
    count: number;
    max?: GraphQLTypes['token_gifts_max_fields'];
    min?: GraphQLTypes['token_gifts_min_fields'];
    stddev?: GraphQLTypes['token_gifts_stddev_fields'];
    stddev_pop?: GraphQLTypes['token_gifts_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['token_gifts_stddev_samp_fields'];
    sum?: GraphQLTypes['token_gifts_sum_fields'];
    var_pop?: GraphQLTypes['token_gifts_var_pop_fields'];
    var_samp?: GraphQLTypes['token_gifts_var_samp_fields'];
    variance?: GraphQLTypes['token_gifts_variance_fields'];
  };
  /** order by aggregate values of table "token_gifts" */
  ['token_gifts_aggregate_order_by']: {
    avg?: GraphQLTypes['token_gifts_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['token_gifts_max_order_by'];
    min?: GraphQLTypes['token_gifts_min_order_by'];
    stddev?: GraphQLTypes['token_gifts_stddev_order_by'];
    stddev_pop?: GraphQLTypes['token_gifts_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['token_gifts_stddev_samp_order_by'];
    sum?: GraphQLTypes['token_gifts_sum_order_by'];
    var_pop?: GraphQLTypes['token_gifts_var_pop_order_by'];
    var_samp?: GraphQLTypes['token_gifts_var_samp_order_by'];
    variance?: GraphQLTypes['token_gifts_variance_order_by'];
  };
  /** aggregate avg on columns */
  ['token_gifts_avg_fields']: {
    __typename: 'token_gifts_avg_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by avg() on columns of table "token_gifts" */
  ['token_gifts_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "token_gifts". All fields are combined with a logical 'AND'. */
  ['token_gifts_bool_exp']: {
    _and?: Array<GraphQLTypes['token_gifts_bool_exp']>;
    _not?: GraphQLTypes['token_gifts_bool_exp'];
    _or?: Array<GraphQLTypes['token_gifts_bool_exp']>;
    circle?: GraphQLTypes['circles_bool_exp'];
    circle_id?: GraphQLTypes['bigint_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    dts_created?: GraphQLTypes['timestamp_comparison_exp'];
    epoch_id?: GraphQLTypes['Int_comparison_exp'];
    gift_private?: GraphQLTypes['gift_private_bool_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    recipient?: GraphQLTypes['users_bool_exp'];
    recipient_address?: GraphQLTypes['String_comparison_exp'];
    recipient_id?: GraphQLTypes['bigint_comparison_exp'];
    sender?: GraphQLTypes['users_bool_exp'];
    sender_address?: GraphQLTypes['String_comparison_exp'];
    sender_id?: GraphQLTypes['bigint_comparison_exp'];
    tokens?: GraphQLTypes['Int_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** aggregate max on columns */
  ['token_gifts_max_fields']: {
    __typename: 'token_gifts_max_fields';
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    recipient_address?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_address?: string;
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** order by max() on columns of table "token_gifts" */
  ['token_gifts_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    dts_created?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** aggregate min on columns */
  ['token_gifts_min_fields']: {
    __typename: 'token_gifts_min_fields';
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    recipient_address?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_address?: string;
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** order by min() on columns of table "token_gifts" */
  ['token_gifts_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    dts_created?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** Ordering options when selecting data from "token_gifts". */
  ['token_gifts_order_by']: {
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    dts_created?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    gift_private?: GraphQLTypes['gift_private_order_by'];
    id?: GraphQLTypes['order_by'];
    recipient?: GraphQLTypes['users_order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender?: GraphQLTypes['users_order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** select columns of table "token_gifts" */
  ['token_gifts_select_column']: token_gifts_select_column;
  /** aggregate stddev on columns */
  ['token_gifts_stddev_fields']: {
    __typename: 'token_gifts_stddev_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by stddev() on columns of table "token_gifts" */
  ['token_gifts_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['token_gifts_stddev_pop_fields']: {
    __typename: 'token_gifts_stddev_pop_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by stddev_pop() on columns of table "token_gifts" */
  ['token_gifts_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_samp on columns */
  ['token_gifts_stddev_samp_fields']: {
    __typename: 'token_gifts_stddev_samp_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by stddev_samp() on columns of table "token_gifts" */
  ['token_gifts_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** aggregate sum on columns */
  ['token_gifts_sum_fields']: {
    __typename: 'token_gifts_sum_fields';
    circle_id?: GraphQLTypes['bigint'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
  };
  /** order by sum() on columns of table "token_gifts" */
  ['token_gifts_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** aggregate var_pop on columns */
  ['token_gifts_var_pop_fields']: {
    __typename: 'token_gifts_var_pop_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by var_pop() on columns of table "token_gifts" */
  ['token_gifts_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** aggregate var_samp on columns */
  ['token_gifts_var_samp_fields']: {
    __typename: 'token_gifts_var_samp_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by var_samp() on columns of table "token_gifts" */
  ['token_gifts_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** aggregate variance on columns */
  ['token_gifts_variance_fields']: {
    __typename: 'token_gifts_variance_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by variance() on columns of table "token_gifts" */
  ['token_gifts_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** columns and relationships of "users" */
  ['users']: {
    __typename: 'users';
    address: string;
    bio?: string;
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    deleted_at?: GraphQLTypes['timestamp'];
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
    profile?: GraphQLTypes['profiles'];
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
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** order by aggregate values of table "users" */
  ['users_aggregate_order_by']: {
    avg?: GraphQLTypes['users_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['users_max_order_by'];
    min?: GraphQLTypes['users_min_order_by'];
    stddev?: GraphQLTypes['users_stddev_order_by'];
    stddev_pop?: GraphQLTypes['users_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['users_stddev_samp_order_by'];
    sum?: GraphQLTypes['users_sum_order_by'];
    var_pop?: GraphQLTypes['users_var_pop_order_by'];
    var_samp?: GraphQLTypes['users_var_samp_order_by'];
    variance?: GraphQLTypes['users_variance_order_by'];
  };
  /** order by avg() on columns of table "users" */
  ['users_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
  ['users_bool_exp']: {
    _and?: Array<GraphQLTypes['users_bool_exp']>;
    _not?: GraphQLTypes['users_bool_exp'];
    _or?: Array<GraphQLTypes['users_bool_exp']>;
    address?: GraphQLTypes['String_comparison_exp'];
    bio?: GraphQLTypes['String_comparison_exp'];
    burns?: GraphQLTypes['burns_bool_exp'];
    circle?: GraphQLTypes['circles_bool_exp'];
    circle_id?: GraphQLTypes['bigint_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    deleted_at?: GraphQLTypes['timestamp_comparison_exp'];
    epoch_first_visit?: GraphQLTypes['Boolean_comparison_exp'];
    fixed_non_receiver?: GraphQLTypes['Boolean_comparison_exp'];
    give_token_received?: GraphQLTypes['Int_comparison_exp'];
    give_token_remaining?: GraphQLTypes['Int_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    name?: GraphQLTypes['String_comparison_exp'];
    non_giver?: GraphQLTypes['Boolean_comparison_exp'];
    non_receiver?: GraphQLTypes['Boolean_comparison_exp'];
    pending_received_gifts?: GraphQLTypes['pending_token_gifts_bool_exp'];
    pending_sent_gifts?: GraphQLTypes['pending_token_gifts_bool_exp'];
    profile?: GraphQLTypes['profiles_bool_exp'];
    received_gifts?: GraphQLTypes['token_gifts_bool_exp'];
    role?: GraphQLTypes['Int_comparison_exp'];
    sent_gifts?: GraphQLTypes['token_gifts_bool_exp'];
    starting_tokens?: GraphQLTypes['Int_comparison_exp'];
    teammates?: GraphQLTypes['teammates_bool_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** order by max() on columns of table "users" */
  ['users_max_order_by']: {
    address?: GraphQLTypes['order_by'];
    bio?: GraphQLTypes['order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    deleted_at?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** order by min() on columns of table "users" */
  ['users_min_order_by']: {
    address?: GraphQLTypes['order_by'];
    bio?: GraphQLTypes['order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    deleted_at?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** Ordering options when selecting data from "users". */
  ['users_order_by']: {
    address?: GraphQLTypes['order_by'];
    bio?: GraphQLTypes['order_by'];
    burns_aggregate?: GraphQLTypes['burns_aggregate_order_by'];
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    deleted_at?: GraphQLTypes['order_by'];
    epoch_first_visit?: GraphQLTypes['order_by'];
    fixed_non_receiver?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    non_giver?: GraphQLTypes['order_by'];
    non_receiver?: GraphQLTypes['order_by'];
    pending_received_gifts_aggregate?: GraphQLTypes['pending_token_gifts_aggregate_order_by'];
    pending_sent_gifts_aggregate?: GraphQLTypes['pending_token_gifts_aggregate_order_by'];
    profile?: GraphQLTypes['profiles_order_by'];
    received_gifts_aggregate?: GraphQLTypes['token_gifts_aggregate_order_by'];
    role?: GraphQLTypes['order_by'];
    sent_gifts_aggregate?: GraphQLTypes['token_gifts_aggregate_order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
    teammates_aggregate?: GraphQLTypes['teammates_aggregate_order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** select columns of table "users" */
  ['users_select_column']: users_select_column;
  /** order by stddev() on columns of table "users" */
  ['users_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
  };
  /** order by stddev_pop() on columns of table "users" */
  ['users_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
  };
  /** order by stddev_samp() on columns of table "users" */
  ['users_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
  };
  /** order by sum() on columns of table "users" */
  ['users_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
  };
  /** order by var_pop() on columns of table "users" */
  ['users_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
  };
  /** order by var_samp() on columns of table "users" */
  ['users_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
  };
  /** order by variance() on columns of table "users" */
  ['users_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
  };
  /** columns and relationships of "vault_transactions" */
  ['vault_transactions']: {
    __typename: 'vault_transactions';
    created_at: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'];
    date: GraphQLTypes['date'];
    description?: string;
    id: GraphQLTypes['bigint'];
    name: string;
    tx_hash: string;
    updated_at: GraphQLTypes['timestamp'];
    /** An object relationship */
    user?: GraphQLTypes['users'];
    value?: GraphQLTypes['bigint'];
    /** An object relationship */
    vault: GraphQLTypes['vaults'];
    vault_id: GraphQLTypes['bigint'];
  };
  /** order by aggregate values of table "vault_transactions" */
  ['vault_transactions_aggregate_order_by']: {
    avg?: GraphQLTypes['vault_transactions_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['vault_transactions_max_order_by'];
    min?: GraphQLTypes['vault_transactions_min_order_by'];
    stddev?: GraphQLTypes['vault_transactions_stddev_order_by'];
    stddev_pop?: GraphQLTypes['vault_transactions_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['vault_transactions_stddev_samp_order_by'];
    sum?: GraphQLTypes['vault_transactions_sum_order_by'];
    var_pop?: GraphQLTypes['vault_transactions_var_pop_order_by'];
    var_samp?: GraphQLTypes['vault_transactions_var_samp_order_by'];
    variance?: GraphQLTypes['vault_transactions_variance_order_by'];
  };
  /** input type for inserting array relation for remote table "vault_transactions" */
  ['vault_transactions_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['vault_transactions_insert_input']>;
  };
  /** order by avg() on columns of table "vault_transactions" */
  ['vault_transactions_avg_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "vault_transactions". All fields are combined with a logical 'AND'. */
  ['vault_transactions_bool_exp']: {
    _and?: Array<GraphQLTypes['vault_transactions_bool_exp']>;
    _not?: GraphQLTypes['vault_transactions_bool_exp'];
    _or?: Array<GraphQLTypes['vault_transactions_bool_exp']>;
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    created_by?: GraphQLTypes['bigint_comparison_exp'];
    date?: GraphQLTypes['date_comparison_exp'];
    description?: GraphQLTypes['String_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    name?: GraphQLTypes['String_comparison_exp'];
    tx_hash?: GraphQLTypes['String_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
    user?: GraphQLTypes['users_bool_exp'];
    value?: GraphQLTypes['bigint_comparison_exp'];
    vault?: GraphQLTypes['vaults_bool_exp'];
    vault_id?: GraphQLTypes['bigint_comparison_exp'];
  };
  /** input type for inserting data into table "vault_transactions" */
  ['vault_transactions_insert_input']: {
    created_at?: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'];
    date?: GraphQLTypes['date'];
    description?: string;
    id?: GraphQLTypes['bigint'];
    name?: string;
    tx_hash?: string;
    updated_at?: GraphQLTypes['timestamp'];
    value?: GraphQLTypes['bigint'];
    vault?: GraphQLTypes['vaults_obj_rel_insert_input'];
    vault_id?: GraphQLTypes['bigint'];
  };
  /** order by max() on columns of table "vault_transactions" */
  ['vault_transactions_max_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    date?: GraphQLTypes['order_by'];
    description?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    tx_hash?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** order by min() on columns of table "vault_transactions" */
  ['vault_transactions_min_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    date?: GraphQLTypes['order_by'];
    description?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    tx_hash?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
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
    created_at?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    date?: GraphQLTypes['order_by'];
    description?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    tx_hash?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user?: GraphQLTypes['users_order_by'];
    value?: GraphQLTypes['order_by'];
    vault?: GraphQLTypes['vaults_order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** select columns of table "vault_transactions" */
  ['vault_transactions_select_column']: vault_transactions_select_column;
  /** order by stddev() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_pop() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_pop_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_samp() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_samp_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** order by sum() on columns of table "vault_transactions" */
  ['vault_transactions_sum_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** order by var_pop() on columns of table "vault_transactions" */
  ['vault_transactions_var_pop_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** order by var_samp() on columns of table "vault_transactions" */
  ['vault_transactions_var_samp_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** order by variance() on columns of table "vault_transactions" */
  ['vault_transactions_variance_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** columns and relationships of "vaults" */
  ['vaults']: {
    __typename: 'vaults';
    created_at: GraphQLTypes['timestamptz'];
    created_by: GraphQLTypes['bigint'];
    decimals: number;
    id: GraphQLTypes['bigint'];
    org_id: GraphQLTypes['bigint'];
    /** An object relationship */
    protocol: GraphQLTypes['organizations'];
    simple_token_address?: string;
    symbol: string;
    token_address?: string;
    updated_at: GraphQLTypes['timestamptz'];
    /** An object relationship */
    user: GraphQLTypes['users'];
    vault_address: string;
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
  };
  /** Boolean expression to filter rows from the table "vaults". All fields are combined with a logical 'AND'. */
  ['vaults_bool_exp']: {
    _and?: Array<GraphQLTypes['vaults_bool_exp']>;
    _not?: GraphQLTypes['vaults_bool_exp'];
    _or?: Array<GraphQLTypes['vaults_bool_exp']>;
    created_at?: GraphQLTypes['timestamptz_comparison_exp'];
    created_by?: GraphQLTypes['bigint_comparison_exp'];
    decimals?: GraphQLTypes['Int_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    org_id?: GraphQLTypes['bigint_comparison_exp'];
    protocol?: GraphQLTypes['organizations_bool_exp'];
    simple_token_address?: GraphQLTypes['String_comparison_exp'];
    symbol?: GraphQLTypes['String_comparison_exp'];
    token_address?: GraphQLTypes['String_comparison_exp'];
    updated_at?: GraphQLTypes['timestamptz_comparison_exp'];
    user?: GraphQLTypes['users_bool_exp'];
    vault_address?: GraphQLTypes['String_comparison_exp'];
    vault_transactions?: GraphQLTypes['vault_transactions_bool_exp'];
  };
  /** input type for inserting data into table "vaults" */
  ['vaults_insert_input']: {
    decimals?: number;
    id?: GraphQLTypes['bigint'];
    org_id?: GraphQLTypes['bigint'];
    simple_token_address?: string;
    symbol?: string;
    token_address?: string;
    vault_address?: string;
    vault_transactions?: GraphQLTypes['vault_transactions_arr_rel_insert_input'];
  };
  /** response of any mutation on the table "vaults" */
  ['vaults_mutation_response']: {
    __typename: 'vaults_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['vaults']>;
  };
  /** input type for inserting object relation for remote table "vaults" */
  ['vaults_obj_rel_insert_input']: {
    data: GraphQLTypes['vaults_insert_input'];
  };
  /** Ordering options when selecting data from "vaults". */
  ['vaults_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    created_by?: GraphQLTypes['order_by'];
    decimals?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    org_id?: GraphQLTypes['order_by'];
    protocol?: GraphQLTypes['organizations_order_by'];
    simple_token_address?: GraphQLTypes['order_by'];
    symbol?: GraphQLTypes['order_by'];
    token_address?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user?: GraphQLTypes['users_order_by'];
    vault_address?: GraphQLTypes['order_by'];
    vault_transactions_aggregate?: GraphQLTypes['vault_transactions_aggregate_order_by'];
  };
  /** select columns of table "vaults" */
  ['vaults_select_column']: vaults_select_column;
  /** columns and relationships of "vouches" */
  ['vouches']: {
    __typename: 'vouches';
    created_at?: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    /** An object relationship */
    nominee?: GraphQLTypes['nominees'];
    nominee_id: number;
    updated_at?: GraphQLTypes['timestamp'];
    /** An object relationship */
    voucher?: GraphQLTypes['users'];
    voucher_id: number;
  };
  /** order by aggregate values of table "vouches" */
  ['vouches_aggregate_order_by']: {
    avg?: GraphQLTypes['vouches_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['vouches_max_order_by'];
    min?: GraphQLTypes['vouches_min_order_by'];
    stddev?: GraphQLTypes['vouches_stddev_order_by'];
    stddev_pop?: GraphQLTypes['vouches_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['vouches_stddev_samp_order_by'];
    sum?: GraphQLTypes['vouches_sum_order_by'];
    var_pop?: GraphQLTypes['vouches_var_pop_order_by'];
    var_samp?: GraphQLTypes['vouches_var_samp_order_by'];
    variance?: GraphQLTypes['vouches_variance_order_by'];
  };
  /** order by avg() on columns of table "vouches" */
  ['vouches_avg_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "vouches". All fields are combined with a logical 'AND'. */
  ['vouches_bool_exp']: {
    _and?: Array<GraphQLTypes['vouches_bool_exp']>;
    _not?: GraphQLTypes['vouches_bool_exp'];
    _or?: Array<GraphQLTypes['vouches_bool_exp']>;
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    nominee?: GraphQLTypes['nominees_bool_exp'];
    nominee_id?: GraphQLTypes['Int_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
    voucher?: GraphQLTypes['users_bool_exp'];
    voucher_id?: GraphQLTypes['Int_comparison_exp'];
  };
  /** order by max() on columns of table "vouches" */
  ['vouches_max_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** order by min() on columns of table "vouches" */
  ['vouches_min_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** Ordering options when selecting data from "vouches". */
  ['vouches_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominee?: GraphQLTypes['nominees_order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    voucher?: GraphQLTypes['users_order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** select columns of table "vouches" */
  ['vouches_select_column']: vouches_select_column;
  /** order by stddev() on columns of table "vouches" */
  ['vouches_stddev_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_pop() on columns of table "vouches" */
  ['vouches_stddev_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** order by stddev_samp() on columns of table "vouches" */
  ['vouches_stddev_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** order by sum() on columns of table "vouches" */
  ['vouches_sum_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** order by var_pop() on columns of table "vouches" */
  ['vouches_var_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** order by var_samp() on columns of table "vouches" */
  ['vouches_var_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** order by variance() on columns of table "vouches" */
  ['vouches_variance_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
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
  created_by = 'created_by',
  distribution_id = 'distribution_id',
  id = 'id',
  index = 'index',
  new_amount = 'new_amount',
  proof = 'proof',
  updated_at = 'updated_at',
  updated_by = 'updated_by',
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
  saved_on_chain = 'saved_on_chain',
  total_amount = 'total_amount',
  vault_id = 'vault_id',
}
/** update columns of table "distributions" */
export const enum distributions_update_column {
  distribution_epoch_id = 'distribution_epoch_id',
  saved_on_chain = 'saved_on_chain',
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
  admin_view = 'admin_view',
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
export class GraphQLError extends Error {
  constructor(public response: GraphQLResponse) {
    super('');
    console.error(response);
  }
  toString() {
    return 'GraphQL Response Error';
  }
}

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

type WithTypeNameValue<T> = T & {
  __typename?: boolean;
};
type AliasType<T> = WithTypeNameValue<T> & {
  __alias?: Record<string, WithTypeNameValue<T>>;
};
export interface GraphQLResponse {
  data?: Record<string, any>;
  errors?: Array<{
    message: string;
  }>;
}
type DeepAnify<T> = {
  [P in keyof T]?: any;
};
type IsPayLoad<T> = T extends [any, infer PayLoad] ? PayLoad : T;
type IsArray<T, U> = T extends Array<infer R>
  ? InputType<R, U>[]
  : InputType<T, U>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;

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
          : {}
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
      >]: IsPayLoad<DST[P]> extends boolean ? SRC[P] : IsArray<SRC[P], DST[P]>;
    }
  : {
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends boolean
        ? SRC[P]
        : IsArray<SRC[P], DST[P]>;
    };

export type MapType<SRC, DST> = SRC extends DeepAnify<DST>
  ? IsInterfaced<SRC, DST>
  : never;
export type InputType<SRC, DST> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P]>;
    } & MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>>
  : MapType<SRC, IsPayLoad<DST>>;
type Func<P extends any[], R> = (...args: P) => R;
type AnyFunc = Func<any, any>;
export type ArgsType<F extends AnyFunc> = F extends Func<infer P, any>
  ? P
  : never;
export type OperationOptions = {
  variables?: Record<string, any>;
  operationName?: string;
};
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
export type SelectionFunction<V> = <T>(t: T | V) => T;
export type fetchOptions = ArgsType<typeof fetch>;
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

export const ZeusSelect = <T>() => ((t: any) => t) as SelectionFunction<T>;

export const ScalarResolver = (scalar: string, value: any) => {
  switch (scalar) {
    case 'String':
      return `${JSON.stringify(value)}`;
    case 'Int':
      return `${value}`;
    case 'Float':
      return `${value}`;
    case 'Boolean':
      return `${value}`;
    case 'ID':
      return `"${value}"`;
    case 'enum':
      return `${value}`;
    case 'scalar':
      return `${value}`;
    default:
      return false;
  }
};

export const TypesPropsResolver = ({
  value,
  type,
  name,
  key,
  blockArrays,
}: {
  value: any;
  type: string;
  name: string;
  key?: string;
  blockArrays?: boolean;
}): string => {
  if (value === null) {
    return `null`;
  }
  let resolvedValue = AllTypesProps[type][name];
  if (key) {
    resolvedValue = resolvedValue[key];
  }
  if (!resolvedValue) {
    throw new Error(`Cannot resolve ${type} ${name}${key ? ` ${key}` : ''}`);
  }
  const typeResolved = resolvedValue.type;
  const isArray = resolvedValue.array;
  const isArrayRequired = resolvedValue.arrayRequired;
  if (typeof value === 'string' && value.startsWith(`ZEUS_VAR$`)) {
    const isRequired = resolvedValue.required ? '!' : '';
    let t = `${typeResolved}`;
    if (isArray) {
      if (isRequired) {
        t = `${t}!`;
      }
      t = `[${t}]`;
      if (isArrayRequired) {
        t = `${t}!`;
      }
    } else {
      if (isRequired) {
        t = `${t}!`;
      }
    }
    return `\$${value.split(`ZEUS_VAR$`)[1]}__ZEUS_VAR__${t}`;
  }
  if (isArray && !blockArrays) {
    return `[${value
      .map((v: any) =>
        TypesPropsResolver({ value: v, type, name, key, blockArrays: true })
      )
      .join(',')}]`;
  }
  const reslovedScalar = ScalarResolver(typeResolved, value);
  if (!reslovedScalar) {
    const resolvedType = AllTypesProps[typeResolved];
    if (typeof resolvedType === 'object') {
      const argsKeys = Object.keys(resolvedType);
      return `{${argsKeys
        .filter(ak => value[ak] !== undefined)
        .map(
          ak =>
            `${ak}:${TypesPropsResolver({
              value: value[ak],
              type: typeResolved,
              name: ak,
            })}`
        )}}`;
    }
    return ScalarResolver(AllTypesProps[typeResolved], value) as string;
  }
  return reslovedScalar;
};

const isArrayFunction = (parent: string[], a: any[]) => {
  const [values, r] = a;
  const [mainKey, key, ...keys] = parent;
  const keyValues = Object.keys(values).filter(
    k => typeof values[k] !== 'undefined'
  );

  if (!keys.length) {
    return keyValues.length > 0
      ? `(${keyValues
          .map(
            v =>
              `${v}:${TypesPropsResolver({
                value: values[v],
                type: mainKey,
                name: key,
                key: v,
              })}`
          )
          .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
      : traverseToSeekArrays(parent, r);
  }

  const [typeResolverKey] = keys.splice(keys.length - 1, 1);
  let valueToResolve = ReturnTypes[mainKey][key];
  for (const k of keys) {
    valueToResolve = ReturnTypes[valueToResolve][k];
  }

  const argumentString =
    keyValues.length > 0
      ? `(${keyValues
          .map(
            v =>
              `${v}:${TypesPropsResolver({
                value: values[v],
                type: valueToResolve,
                name: typeResolverKey,
                key: v,
              })}`
          )
          .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
      : traverseToSeekArrays(parent, r);
  return argumentString;
};

const resolveKV = (
  k: string,
  v: boolean | string | { [x: string]: boolean | string }
) =>
  typeof v === 'boolean'
    ? k
    : typeof v === 'object'
    ? `${k}{${objectToTree(v)}}`
    : `${k}${v}`;

const objectToTree = (o: { [x: string]: boolean | string }): string =>
  `{${Object.keys(o)
    .map(k => `${resolveKV(k, o[k])}`)
    .join(' ')}}`;

const traverseToSeekArrays = (parent: string[], a?: any): string => {
  if (!a) return '';
  if (Object.keys(a).length === 0) {
    return '';
  }
  let b: Record<string, any> = {};
  if (Array.isArray(a)) {
    return isArrayFunction([...parent], a);
  } else {
    if (typeof a === 'object') {
      Object.keys(a)
        .filter(k => typeof a[k] !== 'undefined')
        .forEach(k => {
          if (k === '__alias') {
            Object.keys(a[k]).forEach(aliasKey => {
              const aliasOperations = a[k][aliasKey];
              const aliasOperationName = Object.keys(aliasOperations)[0];
              const aliasOperation = aliasOperations[aliasOperationName];
              b[
                `${aliasOperationName}__alias__${aliasKey}: ${aliasOperationName}`
              ] = traverseToSeekArrays(
                [...parent, aliasOperationName],
                aliasOperation
              );
            });
          } else {
            b[k] = traverseToSeekArrays([...parent, k], a[k]);
          }
        });
    } else {
      return '';
    }
  }
  return objectToTree(b);
};

const buildQuery = (type: string, a?: Record<any, any>) =>
  traverseToSeekArrays([type], a);

const inspectVariables = (query: string) => {
  const regex = /\$\b\w*__ZEUS_VAR__\[?[^!^\]^\s^,^\)^\}]*[!]?[\]]?[!]?/g;
  let result;
  const AllVariables: string[] = [];
  while ((result = regex.exec(query))) {
    if (AllVariables.includes(result[0])) {
      continue;
    }
    AllVariables.push(result[0]);
  }
  if (!AllVariables.length) {
    return query;
  }
  let filteredQuery = query;
  AllVariables.forEach(variable => {
    while (filteredQuery.includes(variable)) {
      filteredQuery = filteredQuery.replace(
        variable,
        variable.split('__ZEUS_VAR__')[0]
      );
    }
  });
  return `(${AllVariables.map(a => a.split('__ZEUS_VAR__'))
    .map(([variableName, variableType]) => `${variableName}:${variableType}`)
    .join(', ')})${filteredQuery}`;
};

export const queryConstruct =
  (
    t: 'query' | 'mutation' | 'subscription',
    tName: string,
    operationName?: string
  ) =>
  (o: Record<any, any>) =>
    `${t.toLowerCase()}${
      operationName ? ' ' + operationName : ''
    }${inspectVariables(buildQuery(tName, o))}`;

export const fullChainConstruct =
  (fn: FetchFunction) =>
  (t: 'query' | 'mutation' | 'subscription', tName: string) =>
  (o: Record<any, any>, options?: OperationOptions) =>
    fn(
      queryConstruct(t, tName, options?.operationName)(o),
      options?.variables
    ).then((r: any) => {
      seekForAliases(r);
      return r;
    });

export const fullSubscriptionConstruct =
  (fn: SubscriptionFunction) =>
  (t: 'query' | 'mutation' | 'subscription', tName: string) =>
  (o: Record<any, any>, options?: OperationOptions) =>
    fn(queryConstruct(t, tName, options?.operationName)(o));

const seekForAliases = (response: any) => {
  const traverseAlias = (value: any) => {
    if (Array.isArray(value)) {
      value.forEach(seekForAliases);
    } else {
      if (typeof value === 'object') {
        seekForAliases(value);
      }
    }
  };
  if (typeof response === 'object' && response) {
    const keys = Object.keys(response);
    if (keys.length < 1) {
      return;
    }
    keys.forEach(k => {
      const value = response[k];
      if (k.indexOf('__alias__') !== -1) {
        const [operation, alias] = k.split('__alias__');
        response[alias] = {
          [operation]: value,
        };
        delete response[k];
      }
      traverseAlias(value);
    });
  }
};

export const $ = (t: TemplateStringsArray): any => `ZEUS_VAR$${t.join('')}`;

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

const handleFetchResponse = (
  response: Parameters<
    Extract<Parameters<ReturnType<typeof fetch>['then']>[0], Function>
  >[0]
): Promise<GraphQLResponse> => {
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
  (query: string, variables: Record<string, any> = {}) => {
    let fetchFunction = fetch;
    let queryString = query;
    let fetchOptions = options[1] || {};
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      queryString = encodeURIComponent(query);
      return fetchFunction(`${options[0]}?query=${queryString}`, fetchOptions)
        .then(handleFetchResponse)
        .then((response: GraphQLResponse) => {
          if (response.errors) {
            throw new GraphQLError(response);
          }
          return response.data;
        });
    }
    return fetchFunction(`${options[0]}`, {
      body: JSON.stringify({ query: queryString, variables }),
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
            if (data) {
              seekForAliases(data);
            }
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

const allOperations = {
  query: 'query_root',
  mutation: 'mutation_root',
  subscription: 'subscription_root',
};

export type GenericOperation<O> = O extends 'query'
  ? 'query_root'
  : O extends 'mutation'
  ? 'mutation_root'
  : 'subscription_root';

export const Thunder =
  (fn: FetchFunction) =>
  <
    O extends 'query' | 'mutation' | 'subscription',
    R extends keyof ValueTypes = GenericOperation<O>
  >(
    operation: O
  ) =>
  <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions) =>
    fullChainConstruct(fn)(operation, allOperations[operation])(
      o as any,
      ops
    ) as Promise<InputType<GraphQLTypes[R], Z>>;

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));

export const SubscriptionThunder =
  (fn: SubscriptionFunction) =>
  <
    O extends 'query' | 'mutation' | 'subscription',
    R extends keyof ValueTypes = GenericOperation<O>
  >(
    operation: O
  ) =>
  <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions) =>
    fullSubscriptionConstruct(fn)(operation, allOperations[operation])(
      o as any,
      ops
    ) as SubscriptionToGraphQL<Z, GraphQLTypes[R]>;

export const Subscription = (...options: chainOptions) =>
  SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends 'query' | 'mutation' | 'subscription',
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
  o: Z | ValueTypes[R],
  operationName?: string
) =>
  queryConstruct(operation, allOperations[operation], operationName)(o as any);
export const Selector = <T extends keyof ValueTypes>(key: T) =>
  ZeusSelect<ValueTypes[T]>();

export const Gql = Chain('http://localhost:8080/v1/graphql');
