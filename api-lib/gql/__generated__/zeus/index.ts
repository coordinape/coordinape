/* eslint-disable */
import WebSocket from 'ws';
import fetch from 'node-fetch';

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
    users_aggregate?: [
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
      ValueTypes['users_aggregate']
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
  /** aggregated selection of "burns" */
  ['burns_aggregate']: AliasType<{
    aggregate?: ValueTypes['burns_aggregate_fields'];
    nodes?: ValueTypes['burns'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "burns" */
  ['burns_aggregate_fields']: AliasType<{
    avg?: ValueTypes['burns_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['burns_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['burns_max_fields'];
    min?: ValueTypes['burns_min_fields'];
    stddev?: ValueTypes['burns_stddev_fields'];
    stddev_pop?: ValueTypes['burns_stddev_pop_fields'];
    stddev_samp?: ValueTypes['burns_stddev_samp_fields'];
    sum?: ValueTypes['burns_sum_fields'];
    var_pop?: ValueTypes['burns_var_pop_fields'];
    var_samp?: ValueTypes['burns_var_samp_fields'];
    variance?: ValueTypes['burns_variance_fields'];
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
  /** input type for inserting array relation for remote table "burns" */
  ['burns_arr_rel_insert_input']: {
    data: ValueTypes['burns_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['burns_on_conflict'] | null;
  };
  /** aggregate avg on columns */
  ['burns_avg_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** unique or primary key constraints on table "burns" */
  ['burns_constraint']: burns_constraint;
  /** input type for incrementing numeric columns in table "burns" */
  ['burns_inc_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    epoch_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
    original_amount?: number | null;
    regift_percent?: number | null;
    tokens_burnt?: number | null;
    user_id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "burns" */
  ['burns_insert_input']: {
    circle?: ValueTypes['circles_obj_rel_insert_input'] | null;
    circle_id?: ValueTypes['bigint'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    epoch?: ValueTypes['epochs_obj_rel_insert_input'] | null;
    epoch_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
    original_amount?: number | null;
    regift_percent?: number | null;
    tokens_burnt?: number | null;
    updated_at?: ValueTypes['timestamp'] | null;
    user?: ValueTypes['users_obj_rel_insert_input'] | null;
    user_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate max on columns */
  ['burns_max_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    updated_at?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate min on columns */
  ['burns_min_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    updated_at?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** response of any mutation on the table "burns" */
  ['burns_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['burns'];
    __typename?: boolean;
  }>;
  /** on conflict condition type for table "burns" */
  ['burns_on_conflict']: {
    constraint: ValueTypes['burns_constraint'];
    update_columns: ValueTypes['burns_update_column'][];
    where?: ValueTypes['burns_bool_exp'] | null;
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
  /** primary key columns input for table: burns */
  ['burns_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "burns" */
  ['burns_select_column']: burns_select_column;
  /** input type for updating data in table "burns" */
  ['burns_set_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    epoch_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
    original_amount?: number | null;
    regift_percent?: number | null;
    tokens_burnt?: number | null;
    updated_at?: ValueTypes['timestamp'] | null;
    user_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate stddev on columns */
  ['burns_stddev_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate stddev_pop on columns */
  ['burns_stddev_pop_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate stddev_samp on columns */
  ['burns_stddev_samp_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate sum on columns */
  ['burns_sum_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** update columns of table "burns" */
  ['burns_update_column']: burns_update_column;
  /** aggregate var_pop on columns */
  ['burns_var_pop_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate var_samp on columns */
  ['burns_var_samp_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate variance on columns */
  ['burns_variance_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    original_amount?: boolean;
    regift_percent?: boolean;
    tokens_burnt?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregated selection of "circle_integrations" */
  ['circle_integrations_aggregate']: AliasType<{
    aggregate?: ValueTypes['circle_integrations_aggregate_fields'];
    nodes?: ValueTypes['circle_integrations'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "circle_integrations" */
  ['circle_integrations_aggregate_fields']: AliasType<{
    avg?: ValueTypes['circle_integrations_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['circle_integrations_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['circle_integrations_max_fields'];
    min?: ValueTypes['circle_integrations_min_fields'];
    stddev?: ValueTypes['circle_integrations_stddev_fields'];
    stddev_pop?: ValueTypes['circle_integrations_stddev_pop_fields'];
    stddev_samp?: ValueTypes['circle_integrations_stddev_samp_fields'];
    sum?: ValueTypes['circle_integrations_sum_fields'];
    var_pop?: ValueTypes['circle_integrations_var_pop_fields'];
    var_samp?: ValueTypes['circle_integrations_var_samp_fields'];
    variance?: ValueTypes['circle_integrations_variance_fields'];
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
  /** input type for inserting array relation for remote table "circle_integrations" */
  ['circle_integrations_arr_rel_insert_input']: {
    data: ValueTypes['circle_integrations_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['circle_integrations_on_conflict'] | null;
  };
  /** aggregate avg on columns */
  ['circle_integrations_avg_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
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
  /** unique or primary key constraints on table "circle_integrations" */
  ['circle_integrations_constraint']: circle_integrations_constraint;
  /** input type for incrementing numeric columns in table "circle_integrations" */
  ['circle_integrations_inc_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "circle_integrations" */
  ['circle_integrations_insert_input']: {
    circle?: ValueTypes['circles_obj_rel_insert_input'] | null;
    circle_id?: ValueTypes['bigint'] | null;
    data?: ValueTypes['json'] | null;
    id?: ValueTypes['bigint'] | null;
    name?: string | null;
    type?: string | null;
  };
  /** aggregate max on columns */
  ['circle_integrations_max_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    name?: boolean;
    type?: boolean;
    __typename?: boolean;
  }>;
  /** order by max() on columns of table "circle_integrations" */
  ['circle_integrations_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    type?: ValueTypes['order_by'] | null;
  };
  /** aggregate min on columns */
  ['circle_integrations_min_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    name?: boolean;
    type?: boolean;
    __typename?: boolean;
  }>;
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
  /** on conflict condition type for table "circle_integrations" */
  ['circle_integrations_on_conflict']: {
    constraint: ValueTypes['circle_integrations_constraint'];
    update_columns: ValueTypes['circle_integrations_update_column'][];
    where?: ValueTypes['circle_integrations_bool_exp'] | null;
  };
  /** Ordering options when selecting data from "circle_integrations". */
  ['circle_integrations_order_by']: {
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    data?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    type?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: circle_integrations */
  ['circle_integrations_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "circle_integrations" */
  ['circle_integrations_select_column']: circle_integrations_select_column;
  /** input type for updating data in table "circle_integrations" */
  ['circle_integrations_set_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    data?: ValueTypes['json'] | null;
    id?: ValueTypes['bigint'] | null;
    name?: string | null;
    type?: string | null;
  };
  /** aggregate stddev on columns */
  ['circle_integrations_stddev_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['circle_integrations_stddev_pop_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['circle_integrations_stddev_samp_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['circle_integrations_sum_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "circle_integrations" */
  ['circle_integrations_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** update columns of table "circle_integrations" */
  ['circle_integrations_update_column']: circle_integrations_update_column;
  /** aggregate var_pop on columns */
  ['circle_integrations_var_pop_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "circle_integrations" */
  ['circle_integrations_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['circle_integrations_var_samp_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "circle_integrations" */
  ['circle_integrations_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['circle_integrations_variance_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by variance() on columns of table "circle_integrations" */
  ['circle_integrations_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** columns and relationships of "circle_metadata" */
  ['circle_metadata']: AliasType<{
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean;
    created_at?: boolean;
    id?: boolean;
    json?: [
      {
        /** JSON select path */ path?: string | null;
      },
      boolean
    ];
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** aggregated selection of "circle_metadata" */
  ['circle_metadata_aggregate']: AliasType<{
    aggregate?: ValueTypes['circle_metadata_aggregate_fields'];
    nodes?: ValueTypes['circle_metadata'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "circle_metadata" */
  ['circle_metadata_aggregate_fields']: AliasType<{
    avg?: ValueTypes['circle_metadata_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['circle_metadata_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['circle_metadata_max_fields'];
    min?: ValueTypes['circle_metadata_min_fields'];
    stddev?: ValueTypes['circle_metadata_stddev_fields'];
    stddev_pop?: ValueTypes['circle_metadata_stddev_pop_fields'];
    stddev_samp?: ValueTypes['circle_metadata_stddev_samp_fields'];
    sum?: ValueTypes['circle_metadata_sum_fields'];
    var_pop?: ValueTypes['circle_metadata_var_pop_fields'];
    var_samp?: ValueTypes['circle_metadata_var_samp_fields'];
    variance?: ValueTypes['circle_metadata_variance_fields'];
    __typename?: boolean;
  }>;
  /** order by aggregate values of table "circle_metadata" */
  ['circle_metadata_aggregate_order_by']: {
    avg?: ValueTypes['circle_metadata_avg_order_by'] | null;
    count?: ValueTypes['order_by'] | null;
    max?: ValueTypes['circle_metadata_max_order_by'] | null;
    min?: ValueTypes['circle_metadata_min_order_by'] | null;
    stddev?: ValueTypes['circle_metadata_stddev_order_by'] | null;
    stddev_pop?: ValueTypes['circle_metadata_stddev_pop_order_by'] | null;
    stddev_samp?: ValueTypes['circle_metadata_stddev_samp_order_by'] | null;
    sum?: ValueTypes['circle_metadata_sum_order_by'] | null;
    var_pop?: ValueTypes['circle_metadata_var_pop_order_by'] | null;
    var_samp?: ValueTypes['circle_metadata_var_samp_order_by'] | null;
    variance?: ValueTypes['circle_metadata_variance_order_by'] | null;
  };
  /** input type for inserting array relation for remote table "circle_metadata" */
  ['circle_metadata_arr_rel_insert_input']: {
    data: ValueTypes['circle_metadata_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['circle_metadata_on_conflict'] | null;
  };
  /** aggregate avg on columns */
  ['circle_metadata_avg_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by avg() on columns of table "circle_metadata" */
  ['circle_metadata_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** Boolean expression to filter rows from the table "circle_metadata". All fields are combined with a logical 'AND'. */
  ['circle_metadata_bool_exp']: {
    _and?: ValueTypes['circle_metadata_bool_exp'][];
    _not?: ValueTypes['circle_metadata_bool_exp'] | null;
    _or?: ValueTypes['circle_metadata_bool_exp'][];
    circle?: ValueTypes['circles_bool_exp'] | null;
    circle_id?: ValueTypes['bigint_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    json?: ValueTypes['json_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** unique or primary key constraints on table "circle_metadata" */
  ['circle_metadata_constraint']: circle_metadata_constraint;
  /** input type for incrementing numeric columns in table "circle_metadata" */
  ['circle_metadata_inc_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "circle_metadata" */
  ['circle_metadata_insert_input']: {
    circle?: ValueTypes['circles_obj_rel_insert_input'] | null;
    circle_id?: ValueTypes['bigint'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    id?: ValueTypes['bigint'] | null;
    json?: ValueTypes['json'] | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate max on columns */
  ['circle_metadata_max_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    id?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** order by max() on columns of table "circle_metadata" */
  ['circle_metadata_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** aggregate min on columns */
  ['circle_metadata_min_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    id?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** order by min() on columns of table "circle_metadata" */
  ['circle_metadata_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** response of any mutation on the table "circle_metadata" */
  ['circle_metadata_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['circle_metadata'];
    __typename?: boolean;
  }>;
  /** on conflict condition type for table "circle_metadata" */
  ['circle_metadata_on_conflict']: {
    constraint: ValueTypes['circle_metadata_constraint'];
    update_columns: ValueTypes['circle_metadata_update_column'][];
    where?: ValueTypes['circle_metadata_bool_exp'] | null;
  };
  /** Ordering options when selecting data from "circle_metadata". */
  ['circle_metadata_order_by']: {
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    json?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: circle_metadata */
  ['circle_metadata_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "circle_metadata" */
  ['circle_metadata_select_column']: circle_metadata_select_column;
  /** input type for updating data in table "circle_metadata" */
  ['circle_metadata_set_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    id?: ValueTypes['bigint'] | null;
    json?: ValueTypes['json'] | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate stddev on columns */
  ['circle_metadata_stddev_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "circle_metadata" */
  ['circle_metadata_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['circle_metadata_stddev_pop_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "circle_metadata" */
  ['circle_metadata_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['circle_metadata_stddev_samp_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "circle_metadata" */
  ['circle_metadata_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['circle_metadata_sum_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "circle_metadata" */
  ['circle_metadata_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** update columns of table "circle_metadata" */
  ['circle_metadata_update_column']: circle_metadata_update_column;
  /** aggregate var_pop on columns */
  ['circle_metadata_var_pop_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "circle_metadata" */
  ['circle_metadata_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['circle_metadata_var_samp_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "circle_metadata" */
  ['circle_metadata_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['circle_metadata_variance_fields']: AliasType<{
    circle_id?: boolean;
    id?: boolean;
    __typename?: boolean;
  }>;
  /** order by variance() on columns of table "circle_metadata" */
  ['circle_metadata_variance_order_by']: {
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
  /** aggregated selection of "circle_private" */
  ['circle_private_aggregate']: AliasType<{
    aggregate?: ValueTypes['circle_private_aggregate_fields'];
    nodes?: ValueTypes['circle_private'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "circle_private" */
  ['circle_private_aggregate_fields']: AliasType<{
    avg?: ValueTypes['circle_private_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['circle_private_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['circle_private_max_fields'];
    min?: ValueTypes['circle_private_min_fields'];
    stddev?: ValueTypes['circle_private_stddev_fields'];
    stddev_pop?: ValueTypes['circle_private_stddev_pop_fields'];
    stddev_samp?: ValueTypes['circle_private_stddev_samp_fields'];
    sum?: ValueTypes['circle_private_sum_fields'];
    var_pop?: ValueTypes['circle_private_var_pop_fields'];
    var_samp?: ValueTypes['circle_private_var_samp_fields'];
    variance?: ValueTypes['circle_private_variance_fields'];
    __typename?: boolean;
  }>;
  /** aggregate avg on columns */
  ['circle_private_avg_fields']: AliasType<{
    circle_id?: boolean;
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
  /** input type for incrementing numeric columns in table "circle_private" */
  ['circle_private_inc_input']: {
    circle_id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "circle_private" */
  ['circle_private_insert_input']: {
    circle?: ValueTypes['circles_obj_rel_insert_input'] | null;
    circle_id?: ValueTypes['bigint'] | null;
    discord_webhook?: string | null;
  };
  /** aggregate max on columns */
  ['circle_private_max_fields']: AliasType<{
    circle_id?: boolean;
    discord_webhook?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate min on columns */
  ['circle_private_min_fields']: AliasType<{
    circle_id?: boolean;
    discord_webhook?: boolean;
    __typename?: boolean;
  }>;
  /** response of any mutation on the table "circle_private" */
  ['circle_private_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['circle_private'];
    __typename?: boolean;
  }>;
  /** input type for inserting object relation for remote table "circle_private" */
  ['circle_private_obj_rel_insert_input']: {
    data: ValueTypes['circle_private_insert_input'];
  };
  /** Ordering options when selecting data from "circle_private". */
  ['circle_private_order_by']: {
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    discord_webhook?: ValueTypes['order_by'] | null;
  };
  /** select columns of table "circle_private" */
  ['circle_private_select_column']: circle_private_select_column;
  /** input type for updating data in table "circle_private" */
  ['circle_private_set_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    discord_webhook?: string | null;
  };
  /** aggregate stddev on columns */
  ['circle_private_stddev_fields']: AliasType<{
    circle_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_pop on columns */
  ['circle_private_stddev_pop_fields']: AliasType<{
    circle_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_samp on columns */
  ['circle_private_stddev_samp_fields']: AliasType<{
    circle_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate sum on columns */
  ['circle_private_sum_fields']: AliasType<{
    circle_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_pop on columns */
  ['circle_private_var_pop_fields']: AliasType<{
    circle_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_samp on columns */
  ['circle_private_var_samp_fields']: AliasType<{
    circle_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate variance on columns */
  ['circle_private_variance_fields']: AliasType<{
    circle_id?: boolean;
    __typename?: boolean;
  }>;
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
    burns_aggregate?: [
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
      ValueTypes['burns_aggregate']
    ];
    circle_metadata?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circle_metadata_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_metadata_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_metadata_bool_exp'] | null;
      },
      ValueTypes['circle_metadata']
    ];
    circle_metadata_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circle_metadata_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_metadata_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_metadata_bool_exp'] | null;
      },
      ValueTypes['circle_metadata_aggregate']
    ];
    /** An object relationship */
    circle_private?: ValueTypes['circle_private'];
    contact?: boolean;
    created_at?: boolean;
    default_opt_in?: boolean;
    discord_webhook?: boolean;
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
    epochs_aggregate?: [
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
      ValueTypes['epochs_aggregate']
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
    integrations_aggregate?: [
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
      ValueTypes['circle_integrations_aggregate']
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
    pending_token_gifts_aggregate?: [
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
      ValueTypes['pending_token_gifts_aggregate']
    ];
    protocol_id?: boolean;
    team_sel_text?: boolean;
    team_selection?: boolean;
    telegram_id?: boolean;
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
    users_aggregate?: [
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
      ValueTypes['users_aggregate']
    ];
    vouching?: boolean;
    vouching_text?: boolean;
    __typename?: boolean;
  }>;
  /** aggregated selection of "circles" */
  ['circles_aggregate']: AliasType<{
    aggregate?: ValueTypes['circles_aggregate_fields'];
    nodes?: ValueTypes['circles'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "circles" */
  ['circles_aggregate_fields']: AliasType<{
    avg?: ValueTypes['circles_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['circles_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['circles_max_fields'];
    min?: ValueTypes['circles_min_fields'];
    stddev?: ValueTypes['circles_stddev_fields'];
    stddev_pop?: ValueTypes['circles_stddev_pop_fields'];
    stddev_samp?: ValueTypes['circles_stddev_samp_fields'];
    sum?: ValueTypes['circles_sum_fields'];
    var_pop?: ValueTypes['circles_var_pop_fields'];
    var_samp?: ValueTypes['circles_var_samp_fields'];
    variance?: ValueTypes['circles_variance_fields'];
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
  /** input type for inserting array relation for remote table "circles" */
  ['circles_arr_rel_insert_input']: {
    data: ValueTypes['circles_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['circles_on_conflict'] | null;
  };
  /** aggregate avg on columns */
  ['circles_avg_fields']: AliasType<{
    id?: boolean;
    min_vouches?: boolean;
    nomination_days_limit?: boolean;
    protocol_id?: boolean;
    __typename?: boolean;
  }>;
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
    circle_metadata?: ValueTypes['circle_metadata_bool_exp'] | null;
    circle_private?: ValueTypes['circle_private_bool_exp'] | null;
    contact?: ValueTypes['String_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    default_opt_in?: ValueTypes['Boolean_comparison_exp'] | null;
    discord_webhook?: ValueTypes['String_comparison_exp'] | null;
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
    telegram_id?: ValueTypes['String_comparison_exp'] | null;
    token_gifts?: ValueTypes['token_gifts_bool_exp'] | null;
    token_name?: ValueTypes['String_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
    users?: ValueTypes['users_bool_exp'] | null;
    vouching?: ValueTypes['Boolean_comparison_exp'] | null;
    vouching_text?: ValueTypes['String_comparison_exp'] | null;
  };
  /** unique or primary key constraints on table "circles" */
  ['circles_constraint']: circles_constraint;
  /** input type for incrementing numeric columns in table "circles" */
  ['circles_inc_input']: {
    id?: ValueTypes['bigint'] | null;
    min_vouches?: number | null;
    nomination_days_limit?: number | null;
    protocol_id?: number | null;
  };
  /** input type for inserting data into table "circles" */
  ['circles_insert_input']: {
    alloc_text?: string | null;
    auto_opt_out?: boolean | null;
    burns?: ValueTypes['burns_arr_rel_insert_input'] | null;
    circle_metadata?: ValueTypes['circle_metadata_arr_rel_insert_input'] | null;
    circle_private?: ValueTypes['circle_private_obj_rel_insert_input'] | null;
    contact?: string | null;
    created_at?: ValueTypes['timestamp'] | null;
    default_opt_in?: boolean | null;
    discord_webhook?: string | null;
    epochs?: ValueTypes['epochs_arr_rel_insert_input'] | null;
    id?: ValueTypes['bigint'] | null;
    integrations?:
      | ValueTypes['circle_integrations_arr_rel_insert_input']
      | null;
    is_verified?: boolean | null;
    logo?: string | null;
    min_vouches?: number | null;
    name?: string | null;
    nomination_days_limit?: number | null;
    nominees?: ValueTypes['nominees_arr_rel_insert_input'] | null;
    only_giver_vouch?: boolean | null;
    organization?: ValueTypes['organizations_obj_rel_insert_input'] | null;
    pending_token_gifts?:
      | ValueTypes['pending_token_gifts_arr_rel_insert_input']
      | null;
    protocol_id?: number | null;
    team_sel_text?: string | null;
    team_selection?: boolean | null;
    telegram_id?: string | null;
    token_gifts?: ValueTypes['token_gifts_arr_rel_insert_input'] | null;
    token_name?: string | null;
    updated_at?: ValueTypes['timestamp'] | null;
    users?: ValueTypes['users_arr_rel_insert_input'] | null;
    vouching?: boolean | null;
    vouching_text?: string | null;
  };
  /** aggregate max on columns */
  ['circles_max_fields']: AliasType<{
    alloc_text?: boolean;
    contact?: boolean;
    created_at?: boolean;
    discord_webhook?: boolean;
    id?: boolean;
    logo?: boolean;
    min_vouches?: boolean;
    name?: boolean;
    nomination_days_limit?: boolean;
    protocol_id?: boolean;
    team_sel_text?: boolean;
    telegram_id?: boolean;
    token_name?: boolean;
    updated_at?: boolean;
    vouching_text?: boolean;
    __typename?: boolean;
  }>;
  /** order by max() on columns of table "circles" */
  ['circles_max_order_by']: {
    alloc_text?: ValueTypes['order_by'] | null;
    contact?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    discord_webhook?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    logo?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
    team_sel_text?: ValueTypes['order_by'] | null;
    telegram_id?: ValueTypes['order_by'] | null;
    token_name?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    vouching_text?: ValueTypes['order_by'] | null;
  };
  /** aggregate min on columns */
  ['circles_min_fields']: AliasType<{
    alloc_text?: boolean;
    contact?: boolean;
    created_at?: boolean;
    discord_webhook?: boolean;
    id?: boolean;
    logo?: boolean;
    min_vouches?: boolean;
    name?: boolean;
    nomination_days_limit?: boolean;
    protocol_id?: boolean;
    team_sel_text?: boolean;
    telegram_id?: boolean;
    token_name?: boolean;
    updated_at?: boolean;
    vouching_text?: boolean;
    __typename?: boolean;
  }>;
  /** order by min() on columns of table "circles" */
  ['circles_min_order_by']: {
    alloc_text?: ValueTypes['order_by'] | null;
    contact?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    discord_webhook?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    logo?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
    team_sel_text?: ValueTypes['order_by'] | null;
    telegram_id?: ValueTypes['order_by'] | null;
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
  /** input type for inserting object relation for remote table "circles" */
  ['circles_obj_rel_insert_input']: {
    data: ValueTypes['circles_insert_input'];
    /** on conflict condition */
    on_conflict?: ValueTypes['circles_on_conflict'] | null;
  };
  /** on conflict condition type for table "circles" */
  ['circles_on_conflict']: {
    constraint: ValueTypes['circles_constraint'];
    update_columns: ValueTypes['circles_update_column'][];
    where?: ValueTypes['circles_bool_exp'] | null;
  };
  /** Ordering options when selecting data from "circles". */
  ['circles_order_by']: {
    alloc_text?: ValueTypes['order_by'] | null;
    auto_opt_out?: ValueTypes['order_by'] | null;
    burns_aggregate?: ValueTypes['burns_aggregate_order_by'] | null;
    circle_metadata_aggregate?:
      | ValueTypes['circle_metadata_aggregate_order_by']
      | null;
    circle_private?: ValueTypes['circle_private_order_by'] | null;
    contact?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    default_opt_in?: ValueTypes['order_by'] | null;
    discord_webhook?: ValueTypes['order_by'] | null;
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
    telegram_id?: ValueTypes['order_by'] | null;
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
    contact?: string | null;
    created_at?: ValueTypes['timestamp'] | null;
    default_opt_in?: boolean | null;
    discord_webhook?: string | null;
    id?: ValueTypes['bigint'] | null;
    is_verified?: boolean | null;
    logo?: string | null;
    min_vouches?: number | null;
    name?: string | null;
    nomination_days_limit?: number | null;
    only_giver_vouch?: boolean | null;
    protocol_id?: number | null;
    team_sel_text?: string | null;
    team_selection?: boolean | null;
    telegram_id?: string | null;
    token_name?: string | null;
    updated_at?: ValueTypes['timestamp'] | null;
    vouching?: boolean | null;
    vouching_text?: string | null;
  };
  /** aggregate stddev on columns */
  ['circles_stddev_fields']: AliasType<{
    id?: boolean;
    min_vouches?: boolean;
    nomination_days_limit?: boolean;
    protocol_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "circles" */
  ['circles_stddev_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['circles_stddev_pop_fields']: AliasType<{
    id?: boolean;
    min_vouches?: boolean;
    nomination_days_limit?: boolean;
    protocol_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "circles" */
  ['circles_stddev_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['circles_stddev_samp_fields']: AliasType<{
    id?: boolean;
    min_vouches?: boolean;
    nomination_days_limit?: boolean;
    protocol_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "circles" */
  ['circles_stddev_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['circles_sum_fields']: AliasType<{
    id?: boolean;
    min_vouches?: boolean;
    nomination_days_limit?: boolean;
    protocol_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "circles" */
  ['circles_sum_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** update columns of table "circles" */
  ['circles_update_column']: circles_update_column;
  /** aggregate var_pop on columns */
  ['circles_var_pop_fields']: AliasType<{
    id?: boolean;
    min_vouches?: boolean;
    nomination_days_limit?: boolean;
    protocol_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "circles" */
  ['circles_var_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['circles_var_samp_fields']: AliasType<{
    id?: boolean;
    min_vouches?: boolean;
    nomination_days_limit?: boolean;
    protocol_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "circles" */
  ['circles_var_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    min_vouches?: ValueTypes['order_by'] | null;
    nomination_days_limit?: ValueTypes['order_by'] | null;
    protocol_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['circles_variance_fields']: AliasType<{
    id?: boolean;
    min_vouches?: boolean;
    nomination_days_limit?: boolean;
    protocol_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregated selection of "claims" */
  ['claims_aggregate']: AliasType<{
    aggregate?: ValueTypes['claims_aggregate_fields'];
    nodes?: ValueTypes['claims'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "claims" */
  ['claims_aggregate_fields']: AliasType<{
    avg?: ValueTypes['claims_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['claims_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['claims_max_fields'];
    min?: ValueTypes['claims_min_fields'];
    stddev?: ValueTypes['claims_stddev_fields'];
    stddev_pop?: ValueTypes['claims_stddev_pop_fields'];
    stddev_samp?: ValueTypes['claims_stddev_samp_fields'];
    sum?: ValueTypes['claims_sum_fields'];
    var_pop?: ValueTypes['claims_var_pop_fields'];
    var_samp?: ValueTypes['claims_var_samp_fields'];
    variance?: ValueTypes['claims_variance_fields'];
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
  /** aggregate avg on columns */
  ['claims_avg_fields']: AliasType<{
    amount?: boolean;
    created_by?: boolean;
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    updated_by?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** input type for incrementing numeric columns in table "claims" */
  ['claims_inc_input']: {
    amount?: ValueTypes['numeric'] | null;
    created_by?: ValueTypes['bigint'] | null;
    distribution_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
    index?: ValueTypes['bigint'] | null;
    new_amount?: ValueTypes['numeric'] | null;
    updated_by?: ValueTypes['bigint'] | null;
    user_id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "claims" */
  ['claims_insert_input']: {
    address?: string | null;
    amount?: ValueTypes['numeric'] | null;
    claimed?: boolean | null;
    createdByUser?: ValueTypes['users_obj_rel_insert_input'] | null;
    created_at?: ValueTypes['timestamptz'] | null;
    created_by?: ValueTypes['bigint'] | null;
    distribution?: ValueTypes['distributions_obj_rel_insert_input'] | null;
    distribution_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
    index?: ValueTypes['bigint'] | null;
    new_amount?: ValueTypes['numeric'] | null;
    proof?: string | null;
    updatedByUser?: ValueTypes['users_obj_rel_insert_input'] | null;
    updated_at?: ValueTypes['timestamptz'] | null;
    updated_by?: ValueTypes['bigint'] | null;
    user?: ValueTypes['users_obj_rel_insert_input'] | null;
    user_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate max on columns */
  ['claims_max_fields']: AliasType<{
    address?: boolean;
    amount?: boolean;
    created_at?: boolean;
    created_by?: boolean;
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    proof?: boolean;
    updated_at?: boolean;
    updated_by?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate min on columns */
  ['claims_min_fields']: AliasType<{
    address?: boolean;
    amount?: boolean;
    created_at?: boolean;
    created_by?: boolean;
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    proof?: boolean;
    updated_at?: boolean;
    updated_by?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
    address?: string | null;
    amount?: ValueTypes['numeric'] | null;
    claimed?: boolean | null;
    created_at?: ValueTypes['timestamptz'] | null;
    created_by?: ValueTypes['bigint'] | null;
    distribution_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
    index?: ValueTypes['bigint'] | null;
    new_amount?: ValueTypes['numeric'] | null;
    proof?: string | null;
    updated_at?: ValueTypes['timestamptz'] | null;
    updated_by?: ValueTypes['bigint'] | null;
    user_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate stddev on columns */
  ['claims_stddev_fields']: AliasType<{
    amount?: boolean;
    created_by?: boolean;
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    updated_by?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate stddev_pop on columns */
  ['claims_stddev_pop_fields']: AliasType<{
    amount?: boolean;
    created_by?: boolean;
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    updated_by?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate stddev_samp on columns */
  ['claims_stddev_samp_fields']: AliasType<{
    amount?: boolean;
    created_by?: boolean;
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    updated_by?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate sum on columns */
  ['claims_sum_fields']: AliasType<{
    amount?: boolean;
    created_by?: boolean;
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    updated_by?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate var_pop on columns */
  ['claims_var_pop_fields']: AliasType<{
    amount?: boolean;
    created_by?: boolean;
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    updated_by?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate var_samp on columns */
  ['claims_var_samp_fields']: AliasType<{
    amount?: boolean;
    created_by?: boolean;
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    updated_by?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate variance on columns */
  ['claims_variance_fields']: AliasType<{
    amount?: boolean;
    created_by?: boolean;
    distribution_id?: boolean;
    id?: boolean;
    index?: boolean;
    new_amount?: boolean;
    updated_by?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
    claims_aggregate?: [
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
      ValueTypes['claims_aggregate']
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
  /** aggregated selection of "distributions" */
  ['distributions_aggregate']: AliasType<{
    aggregate?: ValueTypes['distributions_aggregate_fields'];
    nodes?: ValueTypes['distributions'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "distributions" */
  ['distributions_aggregate_fields']: AliasType<{
    avg?: ValueTypes['distributions_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['distributions_select_column'][];
        distinct?: boolean | null;
      },
      boolean
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
    __typename?: boolean;
  }>;
  /** append existing jsonb value of filtered columns with new jsonb value */
  ['distributions_append_input']: {
    distribution_json?: ValueTypes['jsonb'] | null;
  };
  /** aggregate avg on columns */
  ['distributions_avg_fields']: AliasType<{
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    total_amount?: boolean;
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
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  ['distributions_delete_at_path_input']: {
    distribution_json?: string[];
  };
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  ['distributions_delete_elem_input']: {
    distribution_json?: number | null;
  };
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  ['distributions_delete_key_input']: {
    distribution_json?: string | null;
  };
  /** input type for incrementing numeric columns in table "distributions" */
  ['distributions_inc_input']: {
    created_by?: ValueTypes['bigint'] | null;
    distribution_epoch_id?: ValueTypes['bigint'] | null;
    epoch_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
    total_amount?: ValueTypes['numeric'] | null;
    vault_id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "distributions" */
  ['distributions_insert_input']: {
    claims?: ValueTypes['claims_arr_rel_insert_input'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    created_by?: ValueTypes['bigint'] | null;
    distribution_epoch_id?: ValueTypes['bigint'] | null;
    distribution_json?: ValueTypes['jsonb'] | null;
    epoch?: ValueTypes['epochs_obj_rel_insert_input'] | null;
    epoch_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
    merkle_root?: string | null;
    saved_on_chain?: boolean | null;
    total_amount?: ValueTypes['numeric'] | null;
    vault?: ValueTypes['vaults_obj_rel_insert_input'] | null;
    vault_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate max on columns */
  ['distributions_max_fields']: AliasType<{
    created_at?: boolean;
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    merkle_root?: boolean;
    total_amount?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate min on columns */
  ['distributions_min_fields']: AliasType<{
    created_at?: boolean;
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    merkle_root?: boolean;
    total_amount?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  ['distributions_prepend_input']: {
    distribution_json?: ValueTypes['jsonb'] | null;
  };
  /** select columns of table "distributions" */
  ['distributions_select_column']: distributions_select_column;
  /** input type for updating data in table "distributions" */
  ['distributions_set_input']: {
    created_at?: ValueTypes['timestamp'] | null;
    created_by?: ValueTypes['bigint'] | null;
    distribution_epoch_id?: ValueTypes['bigint'] | null;
    distribution_json?: ValueTypes['jsonb'] | null;
    epoch_id?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
    merkle_root?: string | null;
    saved_on_chain?: boolean | null;
    total_amount?: ValueTypes['numeric'] | null;
    vault_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate stddev on columns */
  ['distributions_stddev_fields']: AliasType<{
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    total_amount?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_pop on columns */
  ['distributions_stddev_pop_fields']: AliasType<{
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    total_amount?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_samp on columns */
  ['distributions_stddev_samp_fields']: AliasType<{
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    total_amount?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate sum on columns */
  ['distributions_sum_fields']: AliasType<{
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    total_amount?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** update columns of table "distributions" */
  ['distributions_update_column']: distributions_update_column;
  /** aggregate var_pop on columns */
  ['distributions_var_pop_fields']: AliasType<{
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    total_amount?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_samp on columns */
  ['distributions_var_samp_fields']: AliasType<{
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    total_amount?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate variance on columns */
  ['distributions_variance_fields']: AliasType<{
    created_by?: boolean;
    distribution_epoch_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    total_amount?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
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
    burns_aggregate?: [
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
      ValueTypes['burns_aggregate']
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
    epoch_pending_token_gifts_aggregate?: [
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
      ValueTypes['pending_token_gifts_aggregate']
    ];
    grant?: boolean;
    id?: boolean;
    notified_before_end?: boolean;
    notified_end?: boolean;
    notified_start?: boolean;
    number?: boolean;
    regift_days?: boolean;
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
  /** aggregated selection of "epoches" */
  ['epochs_aggregate']: AliasType<{
    aggregate?: ValueTypes['epochs_aggregate_fields'];
    nodes?: ValueTypes['epochs'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "epoches" */
  ['epochs_aggregate_fields']: AliasType<{
    avg?: ValueTypes['epochs_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['epochs_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['epochs_max_fields'];
    min?: ValueTypes['epochs_min_fields'];
    stddev?: ValueTypes['epochs_stddev_fields'];
    stddev_pop?: ValueTypes['epochs_stddev_pop_fields'];
    stddev_samp?: ValueTypes['epochs_stddev_samp_fields'];
    sum?: ValueTypes['epochs_sum_fields'];
    var_pop?: ValueTypes['epochs_var_pop_fields'];
    var_samp?: ValueTypes['epochs_var_samp_fields'];
    variance?: ValueTypes['epochs_variance_fields'];
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
  /** input type for inserting array relation for remote table "epoches" */
  ['epochs_arr_rel_insert_input']: {
    data: ValueTypes['epochs_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['epochs_on_conflict'] | null;
  };
  /** aggregate avg on columns */
  ['epochs_avg_fields']: AliasType<{
    circle_id?: boolean;
    days?: boolean;
    grant?: boolean;
    id?: boolean;
    number?: boolean;
    regift_days?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    __typename?: boolean;
  }>;
  /** order by avg() on columns of table "epoches" */
  ['epochs_avg_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    regift_days?: ValueTypes['order_by'] | null;
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
    regift_days?: ValueTypes['Int_comparison_exp'] | null;
    repeat?: ValueTypes['Int_comparison_exp'] | null;
    repeat_day_of_month?: ValueTypes['Int_comparison_exp'] | null;
    start_date?: ValueTypes['timestamptz_comparison_exp'] | null;
    token_gifts?: ValueTypes['token_gifts_bool_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** unique or primary key constraints on table "epoches" */
  ['epochs_constraint']: epochs_constraint;
  /** input type for incrementing numeric columns in table "epoches" */
  ['epochs_inc_input']: {
    circle_id?: number | null;
    days?: number | null;
    grant?: ValueTypes['numeric'] | null;
    id?: ValueTypes['bigint'] | null;
    number?: number | null;
    regift_days?: number | null;
    repeat?: number | null;
    repeat_day_of_month?: number | null;
  };
  /** input type for inserting data into table "epoches" */
  ['epochs_insert_input']: {
    burns?: ValueTypes['burns_arr_rel_insert_input'] | null;
    circle?: ValueTypes['circles_obj_rel_insert_input'] | null;
    circle_id?: number | null;
    created_at?: ValueTypes['timestamp'] | null;
    days?: number | null;
    end_date?: ValueTypes['timestamptz'] | null;
    ended?: boolean | null;
    epoch_pending_token_gifts?:
      | ValueTypes['pending_token_gifts_arr_rel_insert_input']
      | null;
    grant?: ValueTypes['numeric'] | null;
    id?: ValueTypes['bigint'] | null;
    notified_before_end?: ValueTypes['timestamp'] | null;
    notified_end?: ValueTypes['timestamp'] | null;
    notified_start?: ValueTypes['timestamp'] | null;
    number?: number | null;
    regift_days?: number | null;
    repeat?: number | null;
    repeat_day_of_month?: number | null;
    start_date?: ValueTypes['timestamptz'] | null;
    token_gifts?: ValueTypes['token_gifts_arr_rel_insert_input'] | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate max on columns */
  ['epochs_max_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    days?: boolean;
    end_date?: boolean;
    grant?: boolean;
    id?: boolean;
    notified_before_end?: boolean;
    notified_end?: boolean;
    notified_start?: boolean;
    number?: boolean;
    regift_days?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    start_date?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
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
    regift_days?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
    start_date?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** aggregate min on columns */
  ['epochs_min_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    days?: boolean;
    end_date?: boolean;
    grant?: boolean;
    id?: boolean;
    notified_before_end?: boolean;
    notified_end?: boolean;
    notified_start?: boolean;
    number?: boolean;
    regift_days?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    start_date?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
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
    regift_days?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
    start_date?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** response of any mutation on the table "epoches" */
  ['epochs_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['epochs'];
    __typename?: boolean;
  }>;
  /** input type for inserting object relation for remote table "epoches" */
  ['epochs_obj_rel_insert_input']: {
    data: ValueTypes['epochs_insert_input'];
    /** on conflict condition */
    on_conflict?: ValueTypes['epochs_on_conflict'] | null;
  };
  /** on conflict condition type for table "epoches" */
  ['epochs_on_conflict']: {
    constraint: ValueTypes['epochs_constraint'];
    update_columns: ValueTypes['epochs_update_column'][];
    where?: ValueTypes['epochs_bool_exp'] | null;
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
    regift_days?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
    start_date?: ValueTypes['order_by'] | null;
    token_gifts_aggregate?: ValueTypes['token_gifts_aggregate_order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: epochs */
  ['epochs_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "epoches" */
  ['epochs_select_column']: epochs_select_column;
  /** input type for updating data in table "epoches" */
  ['epochs_set_input']: {
    circle_id?: number | null;
    created_at?: ValueTypes['timestamp'] | null;
    days?: number | null;
    end_date?: ValueTypes['timestamptz'] | null;
    ended?: boolean | null;
    grant?: ValueTypes['numeric'] | null;
    id?: ValueTypes['bigint'] | null;
    notified_before_end?: ValueTypes['timestamp'] | null;
    notified_end?: ValueTypes['timestamp'] | null;
    notified_start?: ValueTypes['timestamp'] | null;
    number?: number | null;
    regift_days?: number | null;
    repeat?: number | null;
    repeat_day_of_month?: number | null;
    start_date?: ValueTypes['timestamptz'] | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate stddev on columns */
  ['epochs_stddev_fields']: AliasType<{
    circle_id?: boolean;
    days?: boolean;
    grant?: boolean;
    id?: boolean;
    number?: boolean;
    regift_days?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "epoches" */
  ['epochs_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    regift_days?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['epochs_stddev_pop_fields']: AliasType<{
    circle_id?: boolean;
    days?: boolean;
    grant?: boolean;
    id?: boolean;
    number?: boolean;
    regift_days?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "epoches" */
  ['epochs_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    regift_days?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['epochs_stddev_samp_fields']: AliasType<{
    circle_id?: boolean;
    days?: boolean;
    grant?: boolean;
    id?: boolean;
    number?: boolean;
    regift_days?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "epoches" */
  ['epochs_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    regift_days?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['epochs_sum_fields']: AliasType<{
    circle_id?: boolean;
    days?: boolean;
    grant?: boolean;
    id?: boolean;
    number?: boolean;
    regift_days?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "epoches" */
  ['epochs_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    regift_days?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** update columns of table "epoches" */
  ['epochs_update_column']: epochs_update_column;
  /** aggregate var_pop on columns */
  ['epochs_var_pop_fields']: AliasType<{
    circle_id?: boolean;
    days?: boolean;
    grant?: boolean;
    id?: boolean;
    number?: boolean;
    regift_days?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "epoches" */
  ['epochs_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    regift_days?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['epochs_var_samp_fields']: AliasType<{
    circle_id?: boolean;
    days?: boolean;
    grant?: boolean;
    id?: boolean;
    number?: boolean;
    regift_days?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "epoches" */
  ['epochs_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    regift_days?: ValueTypes['order_by'] | null;
    repeat?: ValueTypes['order_by'] | null;
    repeat_day_of_month?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['epochs_variance_fields']: AliasType<{
    circle_id?: boolean;
    days?: boolean;
    grant?: boolean;
    id?: boolean;
    number?: boolean;
    regift_days?: boolean;
    repeat?: boolean;
    repeat_day_of_month?: boolean;
    __typename?: boolean;
  }>;
  /** order by variance() on columns of table "epoches" */
  ['epochs_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    days?: ValueTypes['order_by'] | null;
    grant?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    number?: ValueTypes['order_by'] | null;
    regift_days?: ValueTypes['order_by'] | null;
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
  /** aggregated selection of "gift_private" */
  ['gift_private_aggregate']: AliasType<{
    aggregate?: ValueTypes['gift_private_aggregate_fields'];
    nodes?: ValueTypes['gift_private'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "gift_private" */
  ['gift_private_aggregate_fields']: AliasType<{
    avg?: ValueTypes['gift_private_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['gift_private_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['gift_private_max_fields'];
    min?: ValueTypes['gift_private_min_fields'];
    stddev?: ValueTypes['gift_private_stddev_fields'];
    stddev_pop?: ValueTypes['gift_private_stddev_pop_fields'];
    stddev_samp?: ValueTypes['gift_private_stddev_samp_fields'];
    sum?: ValueTypes['gift_private_sum_fields'];
    var_pop?: ValueTypes['gift_private_var_pop_fields'];
    var_samp?: ValueTypes['gift_private_var_samp_fields'];
    variance?: ValueTypes['gift_private_variance_fields'];
    __typename?: boolean;
  }>;
  /** aggregate avg on columns */
  ['gift_private_avg_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
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
  /** input type for incrementing numeric columns in table "gift_private" */
  ['gift_private_inc_input']: {
    gift_id?: ValueTypes['bigint'] | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender_id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "gift_private" */
  ['gift_private_insert_input']: {
    gift_id?: ValueTypes['bigint'] | null;
    note?: string | null;
    recipient?: ValueTypes['users_obj_rel_insert_input'] | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender?: ValueTypes['users_obj_rel_insert_input'] | null;
    sender_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate max on columns */
  ['gift_private_max_fields']: AliasType<{
    gift_id?: boolean;
    note?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate min on columns */
  ['gift_private_min_fields']: AliasType<{
    gift_id?: boolean;
    note?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** response of any mutation on the table "gift_private" */
  ['gift_private_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['gift_private'];
    __typename?: boolean;
  }>;
  /** input type for inserting object relation for remote table "gift_private" */
  ['gift_private_obj_rel_insert_input']: {
    data: ValueTypes['gift_private_insert_input'];
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
  /** input type for updating data in table "gift_private" */
  ['gift_private_set_input']: {
    gift_id?: ValueTypes['bigint'] | null;
    note?: string | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate stddev on columns */
  ['gift_private_stddev_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_pop on columns */
  ['gift_private_stddev_pop_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_samp on columns */
  ['gift_private_stddev_samp_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate sum on columns */
  ['gift_private_sum_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_pop on columns */
  ['gift_private_var_pop_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_samp on columns */
  ['gift_private_var_samp_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate variance on columns */
  ['gift_private_variance_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** columns and relationships of "histories" */
  ['histories']: AliasType<{
    bio?: boolean;
    /** An object relationship */
    circle?: ValueTypes['circles'];
    circle_id?: boolean;
    created_at?: boolean;
    /** An object relationship */
    epoch?: ValueTypes['epochs'];
    epoch_id?: boolean;
    id?: boolean;
    updated_at?: boolean;
    /** An object relationship */
    user?: ValueTypes['users'];
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregated selection of "histories" */
  ['histories_aggregate']: AliasType<{
    aggregate?: ValueTypes['histories_aggregate_fields'];
    nodes?: ValueTypes['histories'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "histories" */
  ['histories_aggregate_fields']: AliasType<{
    avg?: ValueTypes['histories_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['histories_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['histories_max_fields'];
    min?: ValueTypes['histories_min_fields'];
    stddev?: ValueTypes['histories_stddev_fields'];
    stddev_pop?: ValueTypes['histories_stddev_pop_fields'];
    stddev_samp?: ValueTypes['histories_stddev_samp_fields'];
    sum?: ValueTypes['histories_sum_fields'];
    var_pop?: ValueTypes['histories_var_pop_fields'];
    var_samp?: ValueTypes['histories_var_samp_fields'];
    variance?: ValueTypes['histories_variance_fields'];
    __typename?: boolean;
  }>;
  /** aggregate avg on columns */
  ['histories_avg_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to filter rows from the table "histories". All fields are combined with a logical 'AND'. */
  ['histories_bool_exp']: {
    _and?: ValueTypes['histories_bool_exp'][];
    _not?: ValueTypes['histories_bool_exp'] | null;
    _or?: ValueTypes['histories_bool_exp'][];
    bio?: ValueTypes['String_comparison_exp'] | null;
    circle?: ValueTypes['circles_bool_exp'] | null;
    circle_id?: ValueTypes['Int_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    epoch?: ValueTypes['epochs_bool_exp'] | null;
    epoch_id?: ValueTypes['Int_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
    user?: ValueTypes['users_bool_exp'] | null;
    user_id?: ValueTypes['Int_comparison_exp'] | null;
  };
  /** unique or primary key constraints on table "histories" */
  ['histories_constraint']: histories_constraint;
  /** input type for incrementing numeric columns in table "histories" */
  ['histories_inc_input']: {
    circle_id?: number | null;
    epoch_id?: number | null;
    id?: ValueTypes['bigint'] | null;
    user_id?: number | null;
  };
  /** input type for inserting data into table "histories" */
  ['histories_insert_input']: {
    bio?: string | null;
    circle?: ValueTypes['circles_obj_rel_insert_input'] | null;
    circle_id?: number | null;
    created_at?: ValueTypes['timestamp'] | null;
    epoch?: ValueTypes['epochs_obj_rel_insert_input'] | null;
    epoch_id?: number | null;
    id?: ValueTypes['bigint'] | null;
    updated_at?: ValueTypes['timestamp'] | null;
    user?: ValueTypes['users_obj_rel_insert_input'] | null;
    user_id?: number | null;
  };
  /** aggregate max on columns */
  ['histories_max_fields']: AliasType<{
    bio?: boolean;
    circle_id?: boolean;
    created_at?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    updated_at?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate min on columns */
  ['histories_min_fields']: AliasType<{
    bio?: boolean;
    circle_id?: boolean;
    created_at?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    updated_at?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** response of any mutation on the table "histories" */
  ['histories_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['histories'];
    __typename?: boolean;
  }>;
  /** on conflict condition type for table "histories" */
  ['histories_on_conflict']: {
    constraint: ValueTypes['histories_constraint'];
    update_columns: ValueTypes['histories_update_column'][];
    where?: ValueTypes['histories_bool_exp'] | null;
  };
  /** Ordering options when selecting data from "histories". */
  ['histories_order_by']: {
    bio?: ValueTypes['order_by'] | null;
    circle?: ValueTypes['circles_order_by'] | null;
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    epoch?: ValueTypes['epochs_order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user?: ValueTypes['users_order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: histories */
  ['histories_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "histories" */
  ['histories_select_column']: histories_select_column;
  /** input type for updating data in table "histories" */
  ['histories_set_input']: {
    bio?: string | null;
    circle_id?: number | null;
    created_at?: ValueTypes['timestamp'] | null;
    epoch_id?: number | null;
    id?: ValueTypes['bigint'] | null;
    updated_at?: ValueTypes['timestamp'] | null;
    user_id?: number | null;
  };
  /** aggregate stddev on columns */
  ['histories_stddev_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_pop on columns */
  ['histories_stddev_pop_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_samp on columns */
  ['histories_stddev_samp_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate sum on columns */
  ['histories_sum_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** update columns of table "histories" */
  ['histories_update_column']: histories_update_column;
  /** aggregate var_pop on columns */
  ['histories_var_pop_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_samp on columns */
  ['histories_var_samp_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate variance on columns */
  ['histories_variance_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
    delete_burns?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['burns_bool_exp'];
      },
      ValueTypes['burns_mutation_response']
    ];
    delete_burns_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['burns']];
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
    delete_circle_metadata?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['circle_metadata_bool_exp'];
      },
      ValueTypes['circle_metadata_mutation_response']
    ];
    delete_circle_metadata_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['circle_metadata']
    ];
    delete_circle_private?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['circle_private_bool_exp'];
      },
      ValueTypes['circle_private_mutation_response']
    ];
    delete_circles?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['circles_bool_exp'];
      },
      ValueTypes['circles_mutation_response']
    ];
    delete_circles_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['circles']
    ];
    delete_claims?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['claims_bool_exp'];
      },
      ValueTypes['claims_mutation_response']
    ];
    delete_claims_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['claims']];
    delete_distributions?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['distributions_bool_exp'];
      },
      ValueTypes['distributions_mutation_response']
    ];
    delete_distributions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['distributions']
    ];
    delete_epochs?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['epochs_bool_exp'];
      },
      ValueTypes['epochs_mutation_response']
    ];
    delete_epochs_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['epochs']];
    delete_gift_private?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['gift_private_bool_exp'];
      },
      ValueTypes['gift_private_mutation_response']
    ];
    delete_histories?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['histories_bool_exp'];
      },
      ValueTypes['histories_mutation_response']
    ];
    delete_histories_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['histories']
    ];
    delete_nominees?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['nominees_bool_exp'];
      },
      ValueTypes['nominees_mutation_response']
    ];
    delete_nominees_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['nominees']
    ];
    delete_organizations?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['organizations_bool_exp'];
      },
      ValueTypes['organizations_mutation_response']
    ];
    delete_organizations_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['organizations']
    ];
    delete_pending_gift_private?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['pending_gift_private_bool_exp'];
      },
      ValueTypes['pending_gift_private_mutation_response']
    ];
    delete_pending_token_gifts?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['pending_token_gifts_bool_exp'];
      },
      ValueTypes['pending_token_gifts_mutation_response']
    ];
    delete_pending_token_gifts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['pending_token_gifts']
    ];
    delete_personal_access_tokens?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['personal_access_tokens_bool_exp'];
      },
      ValueTypes['personal_access_tokens_mutation_response']
    ];
    delete_personal_access_tokens_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['personal_access_tokens']
    ];
    delete_profiles?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['profiles_bool_exp'];
      },
      ValueTypes['profiles_mutation_response']
    ];
    delete_profiles_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['profiles']
    ];
    delete_teammates?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['teammates_bool_exp'];
      },
      ValueTypes['teammates_mutation_response']
    ];
    delete_teammates_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['teammates']
    ];
    delete_token_gifts?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['token_gifts_bool_exp'];
      },
      ValueTypes['token_gifts_mutation_response']
    ];
    delete_token_gifts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['token_gifts']
    ];
    delete_users?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['users_bool_exp'];
      },
      ValueTypes['users_mutation_response']
    ];
    delete_users_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['users']];
    delete_vault_transactions?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['vault_transactions_bool_exp'];
      },
      ValueTypes['vault_transactions_mutation_response']
    ];
    delete_vault_transactions_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['vault_transactions']
    ];
    delete_vaults?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['vaults_bool_exp'];
      },
      ValueTypes['vaults_mutation_response']
    ];
    delete_vaults_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['vaults']];
    delete_vouches?: [
      {
        /** filter the rows which have to be deleted */
        where: ValueTypes['vouches_bool_exp'];
      },
      ValueTypes['vouches_mutation_response']
    ];
    delete_vouches_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['vouches']
    ];
    insert_burns?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['burns_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['burns_on_conflict'] | null;
      },
      ValueTypes['burns_mutation_response']
    ];
    insert_burns_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['burns_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['burns_on_conflict'] | null;
      },
      ValueTypes['burns']
    ];
    insert_circle_integrations?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['circle_integrations_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['circle_integrations_on_conflict'] | null;
      },
      ValueTypes['circle_integrations_mutation_response']
    ];
    insert_circle_integrations_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['circle_integrations_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['circle_integrations_on_conflict'] | null;
      },
      ValueTypes['circle_integrations']
    ];
    insert_circle_metadata?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['circle_metadata_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['circle_metadata_on_conflict'] | null;
      },
      ValueTypes['circle_metadata_mutation_response']
    ];
    insert_circle_metadata_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['circle_metadata_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['circle_metadata_on_conflict'] | null;
      },
      ValueTypes['circle_metadata']
    ];
    insert_circle_private?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['circle_private_insert_input'][];
      },
      ValueTypes['circle_private_mutation_response']
    ];
    insert_circle_private_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['circle_private_insert_input'];
      },
      ValueTypes['circle_private']
    ];
    insert_circles?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['circles_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['circles_on_conflict'] | null;
      },
      ValueTypes['circles_mutation_response']
    ];
    insert_circles_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['circles_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['circles_on_conflict'] | null;
      },
      ValueTypes['circles']
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
    insert_epochs?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['epochs_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['epochs_on_conflict'] | null;
      },
      ValueTypes['epochs_mutation_response']
    ];
    insert_epochs_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['epochs_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['epochs_on_conflict'] | null;
      },
      ValueTypes['epochs']
    ];
    insert_gift_private?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['gift_private_insert_input'][];
      },
      ValueTypes['gift_private_mutation_response']
    ];
    insert_gift_private_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['gift_private_insert_input'];
      },
      ValueTypes['gift_private']
    ];
    insert_histories?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['histories_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['histories_on_conflict'] | null;
      },
      ValueTypes['histories_mutation_response']
    ];
    insert_histories_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['histories_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['histories_on_conflict'] | null;
      },
      ValueTypes['histories']
    ];
    insert_nominees?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['nominees_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['nominees_on_conflict'] | null;
      },
      ValueTypes['nominees_mutation_response']
    ];
    insert_nominees_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['nominees_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['nominees_on_conflict'] | null;
      },
      ValueTypes['nominees']
    ];
    insert_organizations?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['organizations_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['organizations_on_conflict'] | null;
      },
      ValueTypes['organizations_mutation_response']
    ];
    insert_organizations_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['organizations_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['organizations_on_conflict'] | null;
      },
      ValueTypes['organizations']
    ];
    insert_pending_gift_private?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['pending_gift_private_insert_input'][];
      },
      ValueTypes['pending_gift_private_mutation_response']
    ];
    insert_pending_gift_private_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['pending_gift_private_insert_input'];
      },
      ValueTypes['pending_gift_private']
    ];
    insert_pending_token_gifts?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['pending_token_gifts_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['pending_token_gifts_on_conflict'] | null;
      },
      ValueTypes['pending_token_gifts_mutation_response']
    ];
    insert_pending_token_gifts_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['pending_token_gifts_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['pending_token_gifts_on_conflict'] | null;
      },
      ValueTypes['pending_token_gifts']
    ];
    insert_personal_access_tokens?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['personal_access_tokens_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['personal_access_tokens_on_conflict'] | null;
      },
      ValueTypes['personal_access_tokens_mutation_response']
    ];
    insert_personal_access_tokens_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['personal_access_tokens_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['personal_access_tokens_on_conflict'] | null;
      },
      ValueTypes['personal_access_tokens']
    ];
    insert_profiles?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['profiles_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['profiles_on_conflict'] | null;
      },
      ValueTypes['profiles_mutation_response']
    ];
    insert_profiles_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['profiles_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['profiles_on_conflict'] | null;
      },
      ValueTypes['profiles']
    ];
    insert_teammates?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['teammates_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['teammates_on_conflict'] | null;
      },
      ValueTypes['teammates_mutation_response']
    ];
    insert_teammates_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['teammates_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['teammates_on_conflict'] | null;
      },
      ValueTypes['teammates']
    ];
    insert_token_gifts?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['token_gifts_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['token_gifts_on_conflict'] | null;
      },
      ValueTypes['token_gifts_mutation_response']
    ];
    insert_token_gifts_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['token_gifts_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['token_gifts_on_conflict'] | null;
      },
      ValueTypes['token_gifts']
    ];
    insert_users?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['users_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['users_on_conflict'] | null;
      },
      ValueTypes['users_mutation_response']
    ];
    insert_users_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['users_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['users_on_conflict'] | null;
      },
      ValueTypes['users']
    ];
    insert_vault_transactions?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['vault_transactions_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['vault_transactions_on_conflict'] | null;
      },
      ValueTypes['vault_transactions_mutation_response']
    ];
    insert_vault_transactions_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['vault_transactions_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['vault_transactions_on_conflict'] | null;
      },
      ValueTypes['vault_transactions']
    ];
    insert_vaults?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['vaults_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['vaults_on_conflict'] | null;
      },
      ValueTypes['vaults_mutation_response']
    ];
    insert_vaults_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['vaults_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['vaults_on_conflict'] | null;
      },
      ValueTypes['vaults']
    ];
    insert_vouches?: [
      {
        /** the rows to be inserted */
        objects: ValueTypes['vouches_insert_input'][] /** on conflict condition */;
        on_conflict?: ValueTypes['vouches_on_conflict'] | null;
      },
      ValueTypes['vouches_mutation_response']
    ];
    insert_vouches_one?: [
      {
        /** the row to be inserted */
        object: ValueTypes['vouches_insert_input'] /** on conflict condition */;
        on_conflict?: ValueTypes['vouches_on_conflict'] | null;
      },
      ValueTypes['vouches']
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
    update_burns?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['burns_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['burns_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['burns_bool_exp'];
      },
      ValueTypes['burns_mutation_response']
    ];
    update_burns_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['burns_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['burns_set_input'] | null;
        pk_columns: ValueTypes['burns_pk_columns_input'];
      },
      ValueTypes['burns']
    ];
    update_circle_integrations?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['circle_integrations_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['circle_integrations_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['circle_integrations_bool_exp'];
      },
      ValueTypes['circle_integrations_mutation_response']
    ];
    update_circle_integrations_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['circle_integrations_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['circle_integrations_set_input'] | null;
        pk_columns: ValueTypes['circle_integrations_pk_columns_input'];
      },
      ValueTypes['circle_integrations']
    ];
    update_circle_metadata?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['circle_metadata_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['circle_metadata_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['circle_metadata_bool_exp'];
      },
      ValueTypes['circle_metadata_mutation_response']
    ];
    update_circle_metadata_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['circle_metadata_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['circle_metadata_set_input'] | null;
        pk_columns: ValueTypes['circle_metadata_pk_columns_input'];
      },
      ValueTypes['circle_metadata']
    ];
    update_circle_private?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['circle_private_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['circle_private_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['circle_private_bool_exp'];
      },
      ValueTypes['circle_private_mutation_response']
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
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['claims_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['claims_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['claims_bool_exp'];
      },
      ValueTypes['claims_mutation_response']
    ];
    update_claims_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['claims_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['claims_set_input'] | null;
        pk_columns: ValueTypes['claims_pk_columns_input'];
      },
      ValueTypes['claims']
    ];
    update_distributions?: [
      {
        /** append existing jsonb value of filtered columns with new jsonb value */
        _append?:
          | ValueTypes['distributions_append_input']
          | null /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */;
        _delete_at_path?:
          | ValueTypes['distributions_delete_at_path_input']
          | null /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */;
        _delete_elem?:
          | ValueTypes['distributions_delete_elem_input']
          | null /** delete key/value pair or string element. key/value pairs are matched based on their key value */;
        _delete_key?:
          | ValueTypes['distributions_delete_key_input']
          | null /** increments the numeric columns with given value of the filtered values */;
        _inc?:
          | ValueTypes['distributions_inc_input']
          | null /** prepend existing jsonb value of filtered columns with new jsonb value */;
        _prepend?:
          | ValueTypes['distributions_prepend_input']
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
        /** append existing jsonb value of filtered columns with new jsonb value */
        _append?:
          | ValueTypes['distributions_append_input']
          | null /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */;
        _delete_at_path?:
          | ValueTypes['distributions_delete_at_path_input']
          | null /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */;
        _delete_elem?:
          | ValueTypes['distributions_delete_elem_input']
          | null /** delete key/value pair or string element. key/value pairs are matched based on their key value */;
        _delete_key?:
          | ValueTypes['distributions_delete_key_input']
          | null /** increments the numeric columns with given value of the filtered values */;
        _inc?:
          | ValueTypes['distributions_inc_input']
          | null /** prepend existing jsonb value of filtered columns with new jsonb value */;
        _prepend?:
          | ValueTypes['distributions_prepend_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['distributions_set_input'] | null;
        pk_columns: ValueTypes['distributions_pk_columns_input'];
      },
      ValueTypes['distributions']
    ];
    update_epochs?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['epochs_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['epochs_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['epochs_bool_exp'];
      },
      ValueTypes['epochs_mutation_response']
    ];
    update_epochs_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['epochs_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['epochs_set_input'] | null;
        pk_columns: ValueTypes['epochs_pk_columns_input'];
      },
      ValueTypes['epochs']
    ];
    update_gift_private?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['gift_private_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['gift_private_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['gift_private_bool_exp'];
      },
      ValueTypes['gift_private_mutation_response']
    ];
    update_histories?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['histories_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['histories_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['histories_bool_exp'];
      },
      ValueTypes['histories_mutation_response']
    ];
    update_histories_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['histories_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['histories_set_input'] | null;
        pk_columns: ValueTypes['histories_pk_columns_input'];
      },
      ValueTypes['histories']
    ];
    update_nominees?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['nominees_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['nominees_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['nominees_bool_exp'];
      },
      ValueTypes['nominees_mutation_response']
    ];
    update_nominees_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['nominees_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['nominees_set_input'] | null;
        pk_columns: ValueTypes['nominees_pk_columns_input'];
      },
      ValueTypes['nominees']
    ];
    update_organizations?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['organizations_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['organizations_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['organizations_bool_exp'];
      },
      ValueTypes['organizations_mutation_response']
    ];
    update_organizations_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['organizations_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['organizations_set_input'] | null;
        pk_columns: ValueTypes['organizations_pk_columns_input'];
      },
      ValueTypes['organizations']
    ];
    update_pending_gift_private?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['pending_gift_private_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['pending_gift_private_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['pending_gift_private_bool_exp'];
      },
      ValueTypes['pending_gift_private_mutation_response']
    ];
    update_pending_token_gifts?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['pending_token_gifts_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['pending_token_gifts_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['pending_token_gifts_bool_exp'];
      },
      ValueTypes['pending_token_gifts_mutation_response']
    ];
    update_pending_token_gifts_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['pending_token_gifts_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['pending_token_gifts_set_input'] | null;
        pk_columns: ValueTypes['pending_token_gifts_pk_columns_input'];
      },
      ValueTypes['pending_token_gifts']
    ];
    update_personal_access_tokens?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['personal_access_tokens_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['personal_access_tokens_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['personal_access_tokens_bool_exp'];
      },
      ValueTypes['personal_access_tokens_mutation_response']
    ];
    update_personal_access_tokens_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['personal_access_tokens_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['personal_access_tokens_set_input'] | null;
        pk_columns: ValueTypes['personal_access_tokens_pk_columns_input'];
      },
      ValueTypes['personal_access_tokens']
    ];
    update_profiles?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['profiles_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['profiles_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['profiles_bool_exp'];
      },
      ValueTypes['profiles_mutation_response']
    ];
    update_profiles_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['profiles_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['profiles_set_input'] | null;
        pk_columns: ValueTypes['profiles_pk_columns_input'];
      },
      ValueTypes['profiles']
    ];
    update_teammates?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['teammates_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['teammates_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['teammates_bool_exp'];
      },
      ValueTypes['teammates_mutation_response']
    ];
    update_teammates_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['teammates_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['teammates_set_input'] | null;
        pk_columns: ValueTypes['teammates_pk_columns_input'];
      },
      ValueTypes['teammates']
    ];
    update_token_gifts?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['token_gifts_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['token_gifts_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['token_gifts_bool_exp'];
      },
      ValueTypes['token_gifts_mutation_response']
    ];
    update_token_gifts_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['token_gifts_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['token_gifts_set_input'] | null;
        pk_columns: ValueTypes['token_gifts_pk_columns_input'];
      },
      ValueTypes['token_gifts']
    ];
    update_users?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['users_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['users_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['users_bool_exp'];
      },
      ValueTypes['users_mutation_response']
    ];
    update_users_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['users_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['users_set_input'] | null;
        pk_columns: ValueTypes['users_pk_columns_input'];
      },
      ValueTypes['users']
    ];
    update_vault_transactions?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['vault_transactions_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['vault_transactions_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['vault_transactions_bool_exp'];
      },
      ValueTypes['vault_transactions_mutation_response']
    ];
    update_vault_transactions_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['vault_transactions_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['vault_transactions_set_input'] | null;
        pk_columns: ValueTypes['vault_transactions_pk_columns_input'];
      },
      ValueTypes['vault_transactions']
    ];
    update_vaults?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['vaults_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['vaults_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['vaults_bool_exp'];
      },
      ValueTypes['vaults_mutation_response']
    ];
    update_vaults_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['vaults_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['vaults_set_input'] | null;
        pk_columns: ValueTypes['vaults_pk_columns_input'];
      },
      ValueTypes['vaults']
    ];
    update_vouches?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['vouches_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?:
          | ValueTypes['vouches_set_input']
          | null /** filter the rows which have to be updated */;
        where: ValueTypes['vouches_bool_exp'];
      },
      ValueTypes['vouches_mutation_response']
    ];
    update_vouches_by_pk?: [
      {
        /** increments the numeric columns with given value of the filtered values */
        _inc?:
          | ValueTypes['vouches_inc_input']
          | null /** sets the columns of the filtered rows to the given values */;
        _set?: ValueTypes['vouches_set_input'] | null;
        pk_columns: ValueTypes['vouches_pk_columns_input'];
      },
      ValueTypes['vouches']
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
    nominations_aggregate?: [
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
      ValueTypes['vouches_aggregate']
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
  /** input type for inserting array relation for remote table "nominees" */
  ['nominees_arr_rel_insert_input']: {
    data: ValueTypes['nominees_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['nominees_on_conflict'] | null;
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
  /** unique or primary key constraints on table "nominees" */
  ['nominees_constraint']: nominees_constraint;
  /** input type for incrementing numeric columns in table "nominees" */
  ['nominees_inc_input']: {
    circle_id?: number | null;
    id?: ValueTypes['bigint'] | null;
    nominated_by_user_id?: number | null;
    user_id?: number | null;
    vouches_required?: number | null;
  };
  /** input type for inserting data into table "nominees" */
  ['nominees_insert_input']: {
    address?: string | null;
    circle?: ValueTypes['circles_obj_rel_insert_input'] | null;
    circle_id?: number | null;
    created_at?: ValueTypes['timestamp'] | null;
    description?: string | null;
    ended?: boolean | null;
    expiry_date?: ValueTypes['date'] | null;
    id?: ValueTypes['bigint'] | null;
    name?: string | null;
    nominated_by_user_id?: number | null;
    nominated_date?: ValueTypes['date'] | null;
    nominations?: ValueTypes['vouches_arr_rel_insert_input'] | null;
    nominator?: ValueTypes['users_obj_rel_insert_input'] | null;
    updated_at?: ValueTypes['timestamp'] | null;
    user?: ValueTypes['users_obj_rel_insert_input'] | null;
    user_id?: number | null;
    vouches_required?: number | null;
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
  /** response of any mutation on the table "nominees" */
  ['nominees_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['nominees'];
    __typename?: boolean;
  }>;
  /** input type for inserting object relation for remote table "nominees" */
  ['nominees_obj_rel_insert_input']: {
    data: ValueTypes['nominees_insert_input'];
    /** on conflict condition */
    on_conflict?: ValueTypes['nominees_on_conflict'] | null;
  };
  /** on conflict condition type for table "nominees" */
  ['nominees_on_conflict']: {
    constraint: ValueTypes['nominees_constraint'];
    update_columns: ValueTypes['nominees_update_column'][];
    where?: ValueTypes['nominees_bool_exp'] | null;
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
  /** primary key columns input for table: nominees */
  ['nominees_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "nominees" */
  ['nominees_select_column']: nominees_select_column;
  /** input type for updating data in table "nominees" */
  ['nominees_set_input']: {
    address?: string | null;
    circle_id?: number | null;
    created_at?: ValueTypes['timestamp'] | null;
    description?: string | null;
    ended?: boolean | null;
    expiry_date?: ValueTypes['date'] | null;
    id?: ValueTypes['bigint'] | null;
    name?: string | null;
    nominated_by_user_id?: number | null;
    nominated_date?: ValueTypes['date'] | null;
    updated_at?: ValueTypes['timestamp'] | null;
    user_id?: number | null;
    vouches_required?: number | null;
  };
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
  /** update columns of table "nominees" */
  ['nominees_update_column']: nominees_update_column;
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
    circles_aggregate?: [
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
      ValueTypes['circles_aggregate']
    ];
    created_at?: boolean;
    id?: boolean;
    is_verified?: boolean;
    name?: boolean;
    telegram_id?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** aggregated selection of "protocols" */
  ['organizations_aggregate']: AliasType<{
    aggregate?: ValueTypes['organizations_aggregate_fields'];
    nodes?: ValueTypes['organizations'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "protocols" */
  ['organizations_aggregate_fields']: AliasType<{
    avg?: ValueTypes['organizations_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['organizations_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['organizations_max_fields'];
    min?: ValueTypes['organizations_min_fields'];
    stddev?: ValueTypes['organizations_stddev_fields'];
    stddev_pop?: ValueTypes['organizations_stddev_pop_fields'];
    stddev_samp?: ValueTypes['organizations_stddev_samp_fields'];
    sum?: ValueTypes['organizations_sum_fields'];
    var_pop?: ValueTypes['organizations_var_pop_fields'];
    var_samp?: ValueTypes['organizations_var_samp_fields'];
    variance?: ValueTypes['organizations_variance_fields'];
    __typename?: boolean;
  }>;
  /** aggregate avg on columns */
  ['organizations_avg_fields']: AliasType<{
    id?: boolean;
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
    is_verified?: ValueTypes['Boolean_comparison_exp'] | null;
    name?: ValueTypes['String_comparison_exp'] | null;
    telegram_id?: ValueTypes['String_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** unique or primary key constraints on table "protocols" */
  ['organizations_constraint']: organizations_constraint;
  /** input type for incrementing numeric columns in table "protocols" */
  ['organizations_inc_input']: {
    id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "protocols" */
  ['organizations_insert_input']: {
    circles?: ValueTypes['circles_arr_rel_insert_input'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    id?: ValueTypes['bigint'] | null;
    is_verified?: boolean | null;
    name?: string | null;
    telegram_id?: string | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate max on columns */
  ['organizations_max_fields']: AliasType<{
    created_at?: boolean;
    id?: boolean;
    name?: boolean;
    telegram_id?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate min on columns */
  ['organizations_min_fields']: AliasType<{
    created_at?: boolean;
    id?: boolean;
    name?: boolean;
    telegram_id?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** response of any mutation on the table "protocols" */
  ['organizations_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['organizations'];
    __typename?: boolean;
  }>;
  /** input type for inserting object relation for remote table "protocols" */
  ['organizations_obj_rel_insert_input']: {
    data: ValueTypes['organizations_insert_input'];
    /** on conflict condition */
    on_conflict?: ValueTypes['organizations_on_conflict'] | null;
  };
  /** on conflict condition type for table "protocols" */
  ['organizations_on_conflict']: {
    constraint: ValueTypes['organizations_constraint'];
    update_columns: ValueTypes['organizations_update_column'][];
    where?: ValueTypes['organizations_bool_exp'] | null;
  };
  /** Ordering options when selecting data from "protocols". */
  ['organizations_order_by']: {
    circles_aggregate?: ValueTypes['circles_aggregate_order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    is_verified?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    telegram_id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: organizations */
  ['organizations_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "protocols" */
  ['organizations_select_column']: organizations_select_column;
  /** input type for updating data in table "protocols" */
  ['organizations_set_input']: {
    created_at?: ValueTypes['timestamp'] | null;
    id?: ValueTypes['bigint'] | null;
    is_verified?: boolean | null;
    name?: string | null;
    telegram_id?: string | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate stddev on columns */
  ['organizations_stddev_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_pop on columns */
  ['organizations_stddev_pop_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_samp on columns */
  ['organizations_stddev_samp_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate sum on columns */
  ['organizations_sum_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** update columns of table "protocols" */
  ['organizations_update_column']: organizations_update_column;
  /** aggregate var_pop on columns */
  ['organizations_var_pop_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_samp on columns */
  ['organizations_var_samp_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate variance on columns */
  ['organizations_variance_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregated selection of "pending_gift_private" */
  ['pending_gift_private_aggregate']: AliasType<{
    aggregate?: ValueTypes['pending_gift_private_aggregate_fields'];
    nodes?: ValueTypes['pending_gift_private'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "pending_gift_private" */
  ['pending_gift_private_aggregate_fields']: AliasType<{
    avg?: ValueTypes['pending_gift_private_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['pending_gift_private_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['pending_gift_private_max_fields'];
    min?: ValueTypes['pending_gift_private_min_fields'];
    stddev?: ValueTypes['pending_gift_private_stddev_fields'];
    stddev_pop?: ValueTypes['pending_gift_private_stddev_pop_fields'];
    stddev_samp?: ValueTypes['pending_gift_private_stddev_samp_fields'];
    sum?: ValueTypes['pending_gift_private_sum_fields'];
    var_pop?: ValueTypes['pending_gift_private_var_pop_fields'];
    var_samp?: ValueTypes['pending_gift_private_var_samp_fields'];
    variance?: ValueTypes['pending_gift_private_variance_fields'];
    __typename?: boolean;
  }>;
  /** aggregate avg on columns */
  ['pending_gift_private_avg_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
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
  /** input type for incrementing numeric columns in table "pending_gift_private" */
  ['pending_gift_private_inc_input']: {
    gift_id?: ValueTypes['bigint'] | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender_id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "pending_gift_private" */
  ['pending_gift_private_insert_input']: {
    gift_id?: ValueTypes['bigint'] | null;
    note?: string | null;
    recipient?: ValueTypes['users_obj_rel_insert_input'] | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender?: ValueTypes['users_obj_rel_insert_input'] | null;
    sender_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate max on columns */
  ['pending_gift_private_max_fields']: AliasType<{
    gift_id?: boolean;
    note?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate min on columns */
  ['pending_gift_private_min_fields']: AliasType<{
    gift_id?: boolean;
    note?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** response of any mutation on the table "pending_gift_private" */
  ['pending_gift_private_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['pending_gift_private'];
    __typename?: boolean;
  }>;
  /** input type for inserting object relation for remote table "pending_gift_private" */
  ['pending_gift_private_obj_rel_insert_input']: {
    data: ValueTypes['pending_gift_private_insert_input'];
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
  /** input type for updating data in table "pending_gift_private" */
  ['pending_gift_private_set_input']: {
    gift_id?: ValueTypes['bigint'] | null;
    note?: string | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate stddev on columns */
  ['pending_gift_private_stddev_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_pop on columns */
  ['pending_gift_private_stddev_pop_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_samp on columns */
  ['pending_gift_private_stddev_samp_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate sum on columns */
  ['pending_gift_private_sum_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_pop on columns */
  ['pending_gift_private_var_pop_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_samp on columns */
  ['pending_gift_private_var_samp_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate variance on columns */
  ['pending_gift_private_variance_fields']: AliasType<{
    gift_id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    __typename?: boolean;
  }>;
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
    note?: boolean;
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
  /** aggregated selection of "pending_token_gifts" */
  ['pending_token_gifts_aggregate']: AliasType<{
    aggregate?: ValueTypes['pending_token_gifts_aggregate_fields'];
    nodes?: ValueTypes['pending_token_gifts'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "pending_token_gifts" */
  ['pending_token_gifts_aggregate_fields']: AliasType<{
    avg?: ValueTypes['pending_token_gifts_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['pending_token_gifts_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['pending_token_gifts_max_fields'];
    min?: ValueTypes['pending_token_gifts_min_fields'];
    stddev?: ValueTypes['pending_token_gifts_stddev_fields'];
    stddev_pop?: ValueTypes['pending_token_gifts_stddev_pop_fields'];
    stddev_samp?: ValueTypes['pending_token_gifts_stddev_samp_fields'];
    sum?: ValueTypes['pending_token_gifts_sum_fields'];
    var_pop?: ValueTypes['pending_token_gifts_var_pop_fields'];
    var_samp?: ValueTypes['pending_token_gifts_var_samp_fields'];
    variance?: ValueTypes['pending_token_gifts_variance_fields'];
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
  /** input type for inserting array relation for remote table "pending_token_gifts" */
  ['pending_token_gifts_arr_rel_insert_input']: {
    data: ValueTypes['pending_token_gifts_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['pending_token_gifts_on_conflict'] | null;
  };
  /** aggregate avg on columns */
  ['pending_token_gifts_avg_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
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
    note?: ValueTypes['String_comparison_exp'] | null;
    recipient?: ValueTypes['users_bool_exp'] | null;
    recipient_address?: ValueTypes['String_comparison_exp'] | null;
    recipient_id?: ValueTypes['bigint_comparison_exp'] | null;
    sender?: ValueTypes['users_bool_exp'] | null;
    sender_address?: ValueTypes['String_comparison_exp'] | null;
    sender_id?: ValueTypes['bigint_comparison_exp'] | null;
    tokens?: ValueTypes['Int_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** unique or primary key constraints on table "pending_token_gifts" */
  ['pending_token_gifts_constraint']: pending_token_gifts_constraint;
  /** input type for incrementing numeric columns in table "pending_token_gifts" */
  ['pending_token_gifts_inc_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    epoch_id?: number | null;
    id?: ValueTypes['bigint'] | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender_id?: ValueTypes['bigint'] | null;
    tokens?: number | null;
  };
  /** input type for inserting data into table "pending_token_gifts" */
  ['pending_token_gifts_insert_input']: {
    circle?: ValueTypes['circles_obj_rel_insert_input'] | null;
    circle_id?: ValueTypes['bigint'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    dts_created?: ValueTypes['timestamp'] | null;
    epoch?: ValueTypes['epochs_obj_rel_insert_input'] | null;
    epoch_id?: number | null;
    gift_private?:
      | ValueTypes['pending_gift_private_obj_rel_insert_input']
      | null;
    id?: ValueTypes['bigint'] | null;
    note?: string | null;
    recipient?: ValueTypes['users_obj_rel_insert_input'] | null;
    recipient_address?: string | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender?: ValueTypes['users_obj_rel_insert_input'] | null;
    sender_address?: string | null;
    sender_id?: ValueTypes['bigint'] | null;
    tokens?: number | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate max on columns */
  ['pending_token_gifts_max_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    dts_created?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    note?: boolean;
    recipient_address?: boolean;
    recipient_id?: boolean;
    sender_address?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** order by max() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_max_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    dts_created?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    note?: ValueTypes['order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** aggregate min on columns */
  ['pending_token_gifts_min_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    dts_created?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    note?: boolean;
    recipient_address?: boolean;
    recipient_id?: boolean;
    sender_address?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** order by min() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_min_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    dts_created?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    note?: ValueTypes['order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** response of any mutation on the table "pending_token_gifts" */
  ['pending_token_gifts_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['pending_token_gifts'];
    __typename?: boolean;
  }>;
  /** on conflict condition type for table "pending_token_gifts" */
  ['pending_token_gifts_on_conflict']: {
    constraint: ValueTypes['pending_token_gifts_constraint'];
    update_columns: ValueTypes['pending_token_gifts_update_column'][];
    where?: ValueTypes['pending_token_gifts_bool_exp'] | null;
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
    note?: ValueTypes['order_by'] | null;
    recipient?: ValueTypes['users_order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender?: ValueTypes['users_order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: pending_token_gifts */
  ['pending_token_gifts_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "pending_token_gifts" */
  ['pending_token_gifts_select_column']: pending_token_gifts_select_column;
  /** input type for updating data in table "pending_token_gifts" */
  ['pending_token_gifts_set_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    dts_created?: ValueTypes['timestamp'] | null;
    epoch_id?: number | null;
    id?: ValueTypes['bigint'] | null;
    note?: string | null;
    recipient_address?: string | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender_address?: string | null;
    sender_id?: ValueTypes['bigint'] | null;
    tokens?: number | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate stddev on columns */
  ['pending_token_gifts_stddev_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['pending_token_gifts_stddev_pop_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['pending_token_gifts_stddev_samp_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['pending_token_gifts_sum_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** update columns of table "pending_token_gifts" */
  ['pending_token_gifts_update_column']: pending_token_gifts_update_column;
  /** aggregate var_pop on columns */
  ['pending_token_gifts_var_pop_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['pending_token_gifts_var_samp_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['pending_token_gifts_variance_fields']: AliasType<{
    circle_id?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    recipient_id?: boolean;
    sender_id?: boolean;
    tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by variance() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_variance_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    epoch_id?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
  };
  /** columns and relationships of "personal_access_tokens" */
  ['personal_access_tokens']: AliasType<{
    abilities?: boolean;
    created_at?: boolean;
    id?: boolean;
    last_used_at?: boolean;
    name?: boolean;
    /** An object relationship */
    profile?: ValueTypes['profiles'];
    token?: boolean;
    tokenable_id?: boolean;
    tokenable_type?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** aggregated selection of "personal_access_tokens" */
  ['personal_access_tokens_aggregate']: AliasType<{
    aggregate?: ValueTypes['personal_access_tokens_aggregate_fields'];
    nodes?: ValueTypes['personal_access_tokens'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "personal_access_tokens" */
  ['personal_access_tokens_aggregate_fields']: AliasType<{
    avg?: ValueTypes['personal_access_tokens_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['personal_access_tokens_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['personal_access_tokens_max_fields'];
    min?: ValueTypes['personal_access_tokens_min_fields'];
    stddev?: ValueTypes['personal_access_tokens_stddev_fields'];
    stddev_pop?: ValueTypes['personal_access_tokens_stddev_pop_fields'];
    stddev_samp?: ValueTypes['personal_access_tokens_stddev_samp_fields'];
    sum?: ValueTypes['personal_access_tokens_sum_fields'];
    var_pop?: ValueTypes['personal_access_tokens_var_pop_fields'];
    var_samp?: ValueTypes['personal_access_tokens_var_samp_fields'];
    variance?: ValueTypes['personal_access_tokens_variance_fields'];
    __typename?: boolean;
  }>;
  /** aggregate avg on columns */
  ['personal_access_tokens_avg_fields']: AliasType<{
    id?: boolean;
    tokenable_id?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to filter rows from the table "personal_access_tokens". All fields are combined with a logical 'AND'. */
  ['personal_access_tokens_bool_exp']: {
    _and?: ValueTypes['personal_access_tokens_bool_exp'][];
    _not?: ValueTypes['personal_access_tokens_bool_exp'] | null;
    _or?: ValueTypes['personal_access_tokens_bool_exp'][];
    abilities?: ValueTypes['String_comparison_exp'] | null;
    created_at?: ValueTypes['timestamp_comparison_exp'] | null;
    id?: ValueTypes['bigint_comparison_exp'] | null;
    last_used_at?: ValueTypes['timestamp_comparison_exp'] | null;
    name?: ValueTypes['String_comparison_exp'] | null;
    profile?: ValueTypes['profiles_bool_exp'] | null;
    token?: ValueTypes['String_comparison_exp'] | null;
    tokenable_id?: ValueTypes['bigint_comparison_exp'] | null;
    tokenable_type?: ValueTypes['String_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** unique or primary key constraints on table "personal_access_tokens" */
  ['personal_access_tokens_constraint']: personal_access_tokens_constraint;
  /** input type for incrementing numeric columns in table "personal_access_tokens" */
  ['personal_access_tokens_inc_input']: {
    id?: ValueTypes['bigint'] | null;
    tokenable_id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "personal_access_tokens" */
  ['personal_access_tokens_insert_input']: {
    abilities?: string | null;
    created_at?: ValueTypes['timestamp'] | null;
    id?: ValueTypes['bigint'] | null;
    last_used_at?: ValueTypes['timestamp'] | null;
    name?: string | null;
    profile?: ValueTypes['profiles_obj_rel_insert_input'] | null;
    token?: string | null;
    tokenable_id?: ValueTypes['bigint'] | null;
    tokenable_type?: string | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate max on columns */
  ['personal_access_tokens_max_fields']: AliasType<{
    abilities?: boolean;
    created_at?: boolean;
    id?: boolean;
    last_used_at?: boolean;
    name?: boolean;
    token?: boolean;
    tokenable_id?: boolean;
    tokenable_type?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate min on columns */
  ['personal_access_tokens_min_fields']: AliasType<{
    abilities?: boolean;
    created_at?: boolean;
    id?: boolean;
    last_used_at?: boolean;
    name?: boolean;
    token?: boolean;
    tokenable_id?: boolean;
    tokenable_type?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** response of any mutation on the table "personal_access_tokens" */
  ['personal_access_tokens_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['personal_access_tokens'];
    __typename?: boolean;
  }>;
  /** on conflict condition type for table "personal_access_tokens" */
  ['personal_access_tokens_on_conflict']: {
    constraint: ValueTypes['personal_access_tokens_constraint'];
    update_columns: ValueTypes['personal_access_tokens_update_column'][];
    where?: ValueTypes['personal_access_tokens_bool_exp'] | null;
  };
  /** Ordering options when selecting data from "personal_access_tokens". */
  ['personal_access_tokens_order_by']: {
    abilities?: ValueTypes['order_by'] | null;
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    last_used_at?: ValueTypes['order_by'] | null;
    name?: ValueTypes['order_by'] | null;
    profile?: ValueTypes['profiles_order_by'] | null;
    token?: ValueTypes['order_by'] | null;
    tokenable_id?: ValueTypes['order_by'] | null;
    tokenable_type?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: personal_access_tokens */
  ['personal_access_tokens_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "personal_access_tokens" */
  ['personal_access_tokens_select_column']: personal_access_tokens_select_column;
  /** input type for updating data in table "personal_access_tokens" */
  ['personal_access_tokens_set_input']: {
    abilities?: string | null;
    created_at?: ValueTypes['timestamp'] | null;
    id?: ValueTypes['bigint'] | null;
    last_used_at?: ValueTypes['timestamp'] | null;
    name?: string | null;
    token?: string | null;
    tokenable_id?: ValueTypes['bigint'] | null;
    tokenable_type?: string | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate stddev on columns */
  ['personal_access_tokens_stddev_fields']: AliasType<{
    id?: boolean;
    tokenable_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_pop on columns */
  ['personal_access_tokens_stddev_pop_fields']: AliasType<{
    id?: boolean;
    tokenable_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_samp on columns */
  ['personal_access_tokens_stddev_samp_fields']: AliasType<{
    id?: boolean;
    tokenable_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate sum on columns */
  ['personal_access_tokens_sum_fields']: AliasType<{
    id?: boolean;
    tokenable_id?: boolean;
    __typename?: boolean;
  }>;
  /** update columns of table "personal_access_tokens" */
  ['personal_access_tokens_update_column']: personal_access_tokens_update_column;
  /** aggregate var_pop on columns */
  ['personal_access_tokens_var_pop_fields']: AliasType<{
    id?: boolean;
    tokenable_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_samp on columns */
  ['personal_access_tokens_var_samp_fields']: AliasType<{
    id?: boolean;
    tokenable_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate variance on columns */
  ['personal_access_tokens_variance_fields']: AliasType<{
    id?: boolean;
    tokenable_id?: boolean;
    __typename?: boolean;
  }>;
  /** columns and relationships of "profiles" */
  ['profiles']: AliasType<{
    address?: boolean;
    admin_view?: boolean;
    ann_power?: boolean;
    avatar?: boolean;
    background?: boolean;
    bio?: boolean;
    chat_id?: boolean;
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
    users_aggregate?: [
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
      ValueTypes['users_aggregate']
    ];
    website?: boolean;
    __typename?: boolean;
  }>;
  /** aggregated selection of "profiles" */
  ['profiles_aggregate']: AliasType<{
    aggregate?: ValueTypes['profiles_aggregate_fields'];
    nodes?: ValueTypes['profiles'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "profiles" */
  ['profiles_aggregate_fields']: AliasType<{
    avg?: ValueTypes['profiles_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['profiles_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['profiles_max_fields'];
    min?: ValueTypes['profiles_min_fields'];
    stddev?: ValueTypes['profiles_stddev_fields'];
    stddev_pop?: ValueTypes['profiles_stddev_pop_fields'];
    stddev_samp?: ValueTypes['profiles_stddev_samp_fields'];
    sum?: ValueTypes['profiles_sum_fields'];
    var_pop?: ValueTypes['profiles_var_pop_fields'];
    var_samp?: ValueTypes['profiles_var_samp_fields'];
    variance?: ValueTypes['profiles_variance_fields'];
    __typename?: boolean;
  }>;
  /** aggregate avg on columns */
  ['profiles_avg_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
  ['profiles_bool_exp']: {
    _and?: ValueTypes['profiles_bool_exp'][];
    _not?: ValueTypes['profiles_bool_exp'] | null;
    _or?: ValueTypes['profiles_bool_exp'][];
    address?: ValueTypes['String_comparison_exp'] | null;
    admin_view?: ValueTypes['Boolean_comparison_exp'] | null;
    ann_power?: ValueTypes['Boolean_comparison_exp'] | null;
    avatar?: ValueTypes['String_comparison_exp'] | null;
    background?: ValueTypes['String_comparison_exp'] | null;
    bio?: ValueTypes['String_comparison_exp'] | null;
    chat_id?: ValueTypes['String_comparison_exp'] | null;
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
  /** unique or primary key constraints on table "profiles" */
  ['profiles_constraint']: profiles_constraint;
  /** input type for incrementing numeric columns in table "profiles" */
  ['profiles_inc_input']: {
    id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "profiles" */
  ['profiles_insert_input']: {
    address?: string | null;
    admin_view?: boolean | null;
    ann_power?: boolean | null;
    avatar?: string | null;
    background?: string | null;
    bio?: string | null;
    chat_id?: string | null;
    created_at?: ValueTypes['timestamp'] | null;
    discord_username?: string | null;
    github_username?: string | null;
    id?: ValueTypes['bigint'] | null;
    medium_username?: string | null;
    skills?: string | null;
    telegram_username?: string | null;
    twitter_username?: string | null;
    updated_at?: ValueTypes['timestamp'] | null;
    users?: ValueTypes['users_arr_rel_insert_input'] | null;
    website?: string | null;
  };
  /** aggregate max on columns */
  ['profiles_max_fields']: AliasType<{
    address?: boolean;
    avatar?: boolean;
    background?: boolean;
    bio?: boolean;
    chat_id?: boolean;
    created_at?: boolean;
    discord_username?: boolean;
    github_username?: boolean;
    id?: boolean;
    medium_username?: boolean;
    skills?: boolean;
    telegram_username?: boolean;
    twitter_username?: boolean;
    updated_at?: boolean;
    website?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate min on columns */
  ['profiles_min_fields']: AliasType<{
    address?: boolean;
    avatar?: boolean;
    background?: boolean;
    bio?: boolean;
    chat_id?: boolean;
    created_at?: boolean;
    discord_username?: boolean;
    github_username?: boolean;
    id?: boolean;
    medium_username?: boolean;
    skills?: boolean;
    telegram_username?: boolean;
    twitter_username?: boolean;
    updated_at?: boolean;
    website?: boolean;
    __typename?: boolean;
  }>;
  /** response of any mutation on the table "profiles" */
  ['profiles_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['profiles'];
    __typename?: boolean;
  }>;
  /** input type for inserting object relation for remote table "profiles" */
  ['profiles_obj_rel_insert_input']: {
    data: ValueTypes['profiles_insert_input'];
    /** on conflict condition */
    on_conflict?: ValueTypes['profiles_on_conflict'] | null;
  };
  /** on conflict condition type for table "profiles" */
  ['profiles_on_conflict']: {
    constraint: ValueTypes['profiles_constraint'];
    update_columns: ValueTypes['profiles_update_column'][];
    where?: ValueTypes['profiles_bool_exp'] | null;
  };
  /** Ordering options when selecting data from "profiles". */
  ['profiles_order_by']: {
    address?: ValueTypes['order_by'] | null;
    admin_view?: ValueTypes['order_by'] | null;
    ann_power?: ValueTypes['order_by'] | null;
    avatar?: ValueTypes['order_by'] | null;
    background?: ValueTypes['order_by'] | null;
    bio?: ValueTypes['order_by'] | null;
    chat_id?: ValueTypes['order_by'] | null;
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
    address?: string | null;
    admin_view?: boolean | null;
    ann_power?: boolean | null;
    avatar?: string | null;
    background?: string | null;
    bio?: string | null;
    chat_id?: string | null;
    created_at?: ValueTypes['timestamp'] | null;
    discord_username?: string | null;
    github_username?: string | null;
    id?: ValueTypes['bigint'] | null;
    medium_username?: string | null;
    skills?: string | null;
    telegram_username?: string | null;
    twitter_username?: string | null;
    updated_at?: ValueTypes['timestamp'] | null;
    website?: string | null;
  };
  /** aggregate stddev on columns */
  ['profiles_stddev_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_pop on columns */
  ['profiles_stddev_pop_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_samp on columns */
  ['profiles_stddev_samp_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate sum on columns */
  ['profiles_sum_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** update columns of table "profiles" */
  ['profiles_update_column']: profiles_update_column;
  /** aggregate var_pop on columns */
  ['profiles_var_pop_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_samp on columns */
  ['profiles_var_samp_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate variance on columns */
  ['profiles_variance_fields']: AliasType<{
    id?: boolean;
    __typename?: boolean;
  }>;
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
    burns_aggregate?: [
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
      ValueTypes['burns_aggregate']
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
    circle_integrations_aggregate?: [
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
      ValueTypes['circle_integrations_aggregate']
    ];
    circle_integrations_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['circle_integrations']
    ];
    circle_metadata?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circle_metadata_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_metadata_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_metadata_bool_exp'] | null;
      },
      ValueTypes['circle_metadata']
    ];
    circle_metadata_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circle_metadata_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_metadata_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_metadata_bool_exp'] | null;
      },
      ValueTypes['circle_metadata_aggregate']
    ];
    circle_metadata_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['circle_metadata']
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
    circle_private_aggregate?: [
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
      ValueTypes['circle_private_aggregate']
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
    circles_aggregate?: [
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
      ValueTypes['circles_aggregate']
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
    claims_aggregate?: [
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
      ValueTypes['claims_aggregate']
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
    distributions_aggregate?: [
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
      ValueTypes['distributions_aggregate']
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
    epochs_aggregate?: [
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
      ValueTypes['epochs_aggregate']
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
    gift_private_aggregate?: [
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
      ValueTypes['gift_private_aggregate']
    ];
    histories?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['histories_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['histories_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['histories_bool_exp'] | null;
      },
      ValueTypes['histories']
    ];
    histories_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['histories_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['histories_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['histories_bool_exp'] | null;
      },
      ValueTypes['histories_aggregate']
    ];
    histories_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['histories']];
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
    organizations_aggregate?: [
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
      ValueTypes['organizations_aggregate']
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
    pending_gift_private_aggregate?: [
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
      ValueTypes['pending_gift_private_aggregate']
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
    pending_token_gifts_aggregate?: [
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
      ValueTypes['pending_token_gifts_aggregate']
    ];
    pending_token_gifts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['pending_token_gifts']
    ];
    personal_access_tokens?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['personal_access_tokens_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['personal_access_tokens_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['personal_access_tokens_bool_exp'] | null;
      },
      ValueTypes['personal_access_tokens']
    ];
    personal_access_tokens_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['personal_access_tokens_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['personal_access_tokens_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['personal_access_tokens_bool_exp'] | null;
      },
      ValueTypes['personal_access_tokens_aggregate']
    ];
    personal_access_tokens_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['personal_access_tokens']
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
    profiles_aggregate?: [
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
      ValueTypes['profiles_aggregate']
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
    teammates_aggregate?: [
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
      ValueTypes['teammates_aggregate']
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
    users_aggregate?: [
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
      ValueTypes['users_aggregate']
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
    vault_transactions_aggregate?: [
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
      ValueTypes['vault_transactions_aggregate']
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
    vaults_aggregate?: [
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
      ValueTypes['vaults_aggregate']
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
    vouches_aggregate?: [
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
      ValueTypes['vouches_aggregate']
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
    burns_aggregate?: [
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
      ValueTypes['burns_aggregate']
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
    circle_integrations_aggregate?: [
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
      ValueTypes['circle_integrations_aggregate']
    ];
    circle_integrations_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['circle_integrations']
    ];
    circle_metadata?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circle_metadata_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_metadata_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_metadata_bool_exp'] | null;
      },
      ValueTypes['circle_metadata']
    ];
    circle_metadata_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['circle_metadata_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['circle_metadata_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['circle_metadata_bool_exp'] | null;
      },
      ValueTypes['circle_metadata_aggregate']
    ];
    circle_metadata_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['circle_metadata']
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
    circle_private_aggregate?: [
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
      ValueTypes['circle_private_aggregate']
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
    circles_aggregate?: [
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
      ValueTypes['circles_aggregate']
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
    claims_aggregate?: [
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
      ValueTypes['claims_aggregate']
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
    distributions_aggregate?: [
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
      ValueTypes['distributions_aggregate']
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
    epochs_aggregate?: [
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
      ValueTypes['epochs_aggregate']
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
    gift_private_aggregate?: [
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
      ValueTypes['gift_private_aggregate']
    ];
    histories?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['histories_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['histories_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['histories_bool_exp'] | null;
      },
      ValueTypes['histories']
    ];
    histories_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['histories_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['histories_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['histories_bool_exp'] | null;
      },
      ValueTypes['histories_aggregate']
    ];
    histories_by_pk?: [{ id: ValueTypes['bigint'] }, ValueTypes['histories']];
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
    organizations_aggregate?: [
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
      ValueTypes['organizations_aggregate']
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
    pending_gift_private_aggregate?: [
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
      ValueTypes['pending_gift_private_aggregate']
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
    pending_token_gifts_aggregate?: [
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
      ValueTypes['pending_token_gifts_aggregate']
    ];
    pending_token_gifts_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['pending_token_gifts']
    ];
    personal_access_tokens?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['personal_access_tokens_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['personal_access_tokens_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['personal_access_tokens_bool_exp'] | null;
      },
      ValueTypes['personal_access_tokens']
    ];
    personal_access_tokens_aggregate?: [
      {
        /** distinct select on columns */
        distinct_on?: ValueTypes['personal_access_tokens_select_column'][] /** limit the number of rows returned */;
        limit?:
          | number
          | null /** skip the first n rows. Use only with order_by */;
        offset?: number | null /** sort the rows by one or more columns */;
        order_by?: ValueTypes['personal_access_tokens_order_by'][] /** filter the rows returned */;
        where?: ValueTypes['personal_access_tokens_bool_exp'] | null;
      },
      ValueTypes['personal_access_tokens_aggregate']
    ];
    personal_access_tokens_by_pk?: [
      { id: ValueTypes['bigint'] },
      ValueTypes['personal_access_tokens']
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
    profiles_aggregate?: [
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
      ValueTypes['profiles_aggregate']
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
    teammates_aggregate?: [
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
      ValueTypes['teammates_aggregate']
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
    users_aggregate?: [
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
      ValueTypes['users_aggregate']
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
    vault_transactions_aggregate?: [
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
      ValueTypes['vault_transactions_aggregate']
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
    vaults_aggregate?: [
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
      ValueTypes['vaults_aggregate']
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
    vouches_aggregate?: [
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
      ValueTypes['vouches_aggregate']
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
  /** aggregated selection of "teammates" */
  ['teammates_aggregate']: AliasType<{
    aggregate?: ValueTypes['teammates_aggregate_fields'];
    nodes?: ValueTypes['teammates'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "teammates" */
  ['teammates_aggregate_fields']: AliasType<{
    avg?: ValueTypes['teammates_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['teammates_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['teammates_max_fields'];
    min?: ValueTypes['teammates_min_fields'];
    stddev?: ValueTypes['teammates_stddev_fields'];
    stddev_pop?: ValueTypes['teammates_stddev_pop_fields'];
    stddev_samp?: ValueTypes['teammates_stddev_samp_fields'];
    sum?: ValueTypes['teammates_sum_fields'];
    var_pop?: ValueTypes['teammates_var_pop_fields'];
    var_samp?: ValueTypes['teammates_var_samp_fields'];
    variance?: ValueTypes['teammates_variance_fields'];
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
  /** input type for inserting array relation for remote table "teammates" */
  ['teammates_arr_rel_insert_input']: {
    data: ValueTypes['teammates_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['teammates_on_conflict'] | null;
  };
  /** aggregate avg on columns */
  ['teammates_avg_fields']: AliasType<{
    id?: boolean;
    team_mate_id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** unique or primary key constraints on table "teammates" */
  ['teammates_constraint']: teammates_constraint;
  /** input type for incrementing numeric columns in table "teammates" */
  ['teammates_inc_input']: {
    id?: ValueTypes['bigint'] | null;
    team_mate_id?: number | null;
    user_id?: number | null;
  };
  /** input type for inserting data into table "teammates" */
  ['teammates_insert_input']: {
    created_at?: ValueTypes['timestamp'] | null;
    id?: ValueTypes['bigint'] | null;
    team_mate_id?: number | null;
    teammate?: ValueTypes['users_obj_rel_insert_input'] | null;
    updated_at?: ValueTypes['timestamp'] | null;
    user?: ValueTypes['users_obj_rel_insert_input'] | null;
    user_id?: number | null;
  };
  /** aggregate max on columns */
  ['teammates_max_fields']: AliasType<{
    created_at?: boolean;
    id?: boolean;
    team_mate_id?: boolean;
    updated_at?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by max() on columns of table "teammates" */
  ['teammates_max_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate min on columns */
  ['teammates_min_fields']: AliasType<{
    created_at?: boolean;
    id?: boolean;
    team_mate_id?: boolean;
    updated_at?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by min() on columns of table "teammates" */
  ['teammates_min_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** response of any mutation on the table "teammates" */
  ['teammates_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['teammates'];
    __typename?: boolean;
  }>;
  /** on conflict condition type for table "teammates" */
  ['teammates_on_conflict']: {
    constraint: ValueTypes['teammates_constraint'];
    update_columns: ValueTypes['teammates_update_column'][];
    where?: ValueTypes['teammates_bool_exp'] | null;
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
  /** primary key columns input for table: teammates */
  ['teammates_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "teammates" */
  ['teammates_select_column']: teammates_select_column;
  /** input type for updating data in table "teammates" */
  ['teammates_set_input']: {
    created_at?: ValueTypes['timestamp'] | null;
    id?: ValueTypes['bigint'] | null;
    team_mate_id?: number | null;
    updated_at?: ValueTypes['timestamp'] | null;
    user_id?: number | null;
  };
  /** aggregate stddev on columns */
  ['teammates_stddev_fields']: AliasType<{
    id?: boolean;
    team_mate_id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "teammates" */
  ['teammates_stddev_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['teammates_stddev_pop_fields']: AliasType<{
    id?: boolean;
    team_mate_id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "teammates" */
  ['teammates_stddev_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['teammates_stddev_samp_fields']: AliasType<{
    id?: boolean;
    team_mate_id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "teammates" */
  ['teammates_stddev_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['teammates_sum_fields']: AliasType<{
    id?: boolean;
    team_mate_id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "teammates" */
  ['teammates_sum_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** update columns of table "teammates" */
  ['teammates_update_column']: teammates_update_column;
  /** aggregate var_pop on columns */
  ['teammates_var_pop_fields']: AliasType<{
    id?: boolean;
    team_mate_id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "teammates" */
  ['teammates_var_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['teammates_var_samp_fields']: AliasType<{
    id?: boolean;
    team_mate_id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "teammates" */
  ['teammates_var_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    team_mate_id?: ValueTypes['order_by'] | null;
    user_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['teammates_variance_fields']: AliasType<{
    id?: boolean;
    team_mate_id?: boolean;
    user_id?: boolean;
    __typename?: boolean;
  }>;
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
    note?: boolean;
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
  /** input type for inserting array relation for remote table "token_gifts" */
  ['token_gifts_arr_rel_insert_input']: {
    data: ValueTypes['token_gifts_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['token_gifts_on_conflict'] | null;
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
    note?: ValueTypes['String_comparison_exp'] | null;
    recipient?: ValueTypes['users_bool_exp'] | null;
    recipient_address?: ValueTypes['String_comparison_exp'] | null;
    recipient_id?: ValueTypes['bigint_comparison_exp'] | null;
    sender?: ValueTypes['users_bool_exp'] | null;
    sender_address?: ValueTypes['String_comparison_exp'] | null;
    sender_id?: ValueTypes['bigint_comparison_exp'] | null;
    tokens?: ValueTypes['Int_comparison_exp'] | null;
    updated_at?: ValueTypes['timestamp_comparison_exp'] | null;
  };
  /** unique or primary key constraints on table "token_gifts" */
  ['token_gifts_constraint']: token_gifts_constraint;
  /** input type for incrementing numeric columns in table "token_gifts" */
  ['token_gifts_inc_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    epoch_id?: number | null;
    id?: ValueTypes['bigint'] | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender_id?: ValueTypes['bigint'] | null;
    tokens?: number | null;
  };
  /** input type for inserting data into table "token_gifts" */
  ['token_gifts_insert_input']: {
    circle?: ValueTypes['circles_obj_rel_insert_input'] | null;
    circle_id?: ValueTypes['bigint'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    dts_created?: ValueTypes['timestamp'] | null;
    epoch_id?: number | null;
    gift_private?: ValueTypes['gift_private_obj_rel_insert_input'] | null;
    id?: ValueTypes['bigint'] | null;
    note?: string | null;
    recipient?: ValueTypes['users_obj_rel_insert_input'] | null;
    recipient_address?: string | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender?: ValueTypes['users_obj_rel_insert_input'] | null;
    sender_address?: string | null;
    sender_id?: ValueTypes['bigint'] | null;
    tokens?: number | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate max on columns */
  ['token_gifts_max_fields']: AliasType<{
    circle_id?: boolean;
    created_at?: boolean;
    dts_created?: boolean;
    epoch_id?: boolean;
    id?: boolean;
    note?: boolean;
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
    note?: ValueTypes['order_by'] | null;
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
    note?: boolean;
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
    note?: ValueTypes['order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** response of any mutation on the table "token_gifts" */
  ['token_gifts_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['token_gifts'];
    __typename?: boolean;
  }>;
  /** on conflict condition type for table "token_gifts" */
  ['token_gifts_on_conflict']: {
    constraint: ValueTypes['token_gifts_constraint'];
    update_columns: ValueTypes['token_gifts_update_column'][];
    where?: ValueTypes['token_gifts_bool_exp'] | null;
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
    note?: ValueTypes['order_by'] | null;
    recipient?: ValueTypes['users_order_by'] | null;
    recipient_address?: ValueTypes['order_by'] | null;
    recipient_id?: ValueTypes['order_by'] | null;
    sender?: ValueTypes['users_order_by'] | null;
    sender_address?: ValueTypes['order_by'] | null;
    sender_id?: ValueTypes['order_by'] | null;
    tokens?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
  };
  /** primary key columns input for table: token_gifts */
  ['token_gifts_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "token_gifts" */
  ['token_gifts_select_column']: token_gifts_select_column;
  /** input type for updating data in table "token_gifts" */
  ['token_gifts_set_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    dts_created?: ValueTypes['timestamp'] | null;
    epoch_id?: number | null;
    id?: ValueTypes['bigint'] | null;
    note?: string | null;
    recipient_address?: string | null;
    recipient_id?: ValueTypes['bigint'] | null;
    sender_address?: string | null;
    sender_id?: ValueTypes['bigint'] | null;
    tokens?: number | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
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
  /** update columns of table "token_gifts" */
  ['token_gifts_update_column']: token_gifts_update_column;
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
    burns_aggregate?: [
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
      ValueTypes['burns_aggregate']
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
    pending_received_gifts_aggregate?: [
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
      ValueTypes['pending_token_gifts_aggregate']
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
    pending_sent_gifts_aggregate?: [
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
      ValueTypes['pending_token_gifts_aggregate']
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
    teammates_aggregate?: [
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
      ValueTypes['teammates_aggregate']
    ];
    updated_at?: boolean;
    __typename?: boolean;
  }>;
  /** aggregated selection of "users" */
  ['users_aggregate']: AliasType<{
    aggregate?: ValueTypes['users_aggregate_fields'];
    nodes?: ValueTypes['users'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "users" */
  ['users_aggregate_fields']: AliasType<{
    avg?: ValueTypes['users_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['users_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['users_max_fields'];
    min?: ValueTypes['users_min_fields'];
    stddev?: ValueTypes['users_stddev_fields'];
    stddev_pop?: ValueTypes['users_stddev_pop_fields'];
    stddev_samp?: ValueTypes['users_stddev_samp_fields'];
    sum?: ValueTypes['users_sum_fields'];
    var_pop?: ValueTypes['users_var_pop_fields'];
    var_samp?: ValueTypes['users_var_samp_fields'];
    variance?: ValueTypes['users_variance_fields'];
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
  /** input type for inserting array relation for remote table "users" */
  ['users_arr_rel_insert_input']: {
    data: ValueTypes['users_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['users_on_conflict'] | null;
  };
  /** aggregate avg on columns */
  ['users_avg_fields']: AliasType<{
    circle_id?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    role?: boolean;
    starting_tokens?: boolean;
    __typename?: boolean;
  }>;
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
  /** unique or primary key constraints on table "users" */
  ['users_constraint']: users_constraint;
  /** input type for incrementing numeric columns in table "users" */
  ['users_inc_input']: {
    circle_id?: ValueTypes['bigint'] | null;
    give_token_received?: number | null;
    give_token_remaining?: number | null;
    id?: ValueTypes['bigint'] | null;
    role?: number | null;
    starting_tokens?: number | null;
  };
  /** input type for inserting data into table "users" */
  ['users_insert_input']: {
    address?: string | null;
    bio?: string | null;
    burns?: ValueTypes['burns_arr_rel_insert_input'] | null;
    circle?: ValueTypes['circles_obj_rel_insert_input'] | null;
    circle_id?: ValueTypes['bigint'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    deleted_at?: ValueTypes['timestamp'] | null;
    epoch_first_visit?: boolean | null;
    fixed_non_receiver?: boolean | null;
    give_token_received?: number | null;
    give_token_remaining?: number | null;
    id?: ValueTypes['bigint'] | null;
    name?: string | null;
    non_giver?: boolean | null;
    non_receiver?: boolean | null;
    pending_received_gifts?:
      | ValueTypes['pending_token_gifts_arr_rel_insert_input']
      | null;
    pending_sent_gifts?:
      | ValueTypes['pending_token_gifts_arr_rel_insert_input']
      | null;
    profile?: ValueTypes['profiles_obj_rel_insert_input'] | null;
    received_gifts?: ValueTypes['token_gifts_arr_rel_insert_input'] | null;
    role?: number | null;
    sent_gifts?: ValueTypes['token_gifts_arr_rel_insert_input'] | null;
    starting_tokens?: number | null;
    teammates?: ValueTypes['teammates_arr_rel_insert_input'] | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate max on columns */
  ['users_max_fields']: AliasType<{
    address?: boolean;
    bio?: boolean;
    circle_id?: boolean;
    created_at?: boolean;
    deleted_at?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    name?: boolean;
    role?: boolean;
    starting_tokens?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate min on columns */
  ['users_min_fields']: AliasType<{
    address?: boolean;
    bio?: boolean;
    circle_id?: boolean;
    created_at?: boolean;
    deleted_at?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    name?: boolean;
    role?: boolean;
    starting_tokens?: boolean;
    updated_at?: boolean;
    __typename?: boolean;
  }>;
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
  /** response of any mutation on the table "users" */
  ['users_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['users'];
    __typename?: boolean;
  }>;
  /** input type for inserting object relation for remote table "users" */
  ['users_obj_rel_insert_input']: {
    data: ValueTypes['users_insert_input'];
    /** on conflict condition */
    on_conflict?: ValueTypes['users_on_conflict'] | null;
  };
  /** on conflict condition type for table "users" */
  ['users_on_conflict']: {
    constraint: ValueTypes['users_constraint'];
    update_columns: ValueTypes['users_update_column'][];
    where?: ValueTypes['users_bool_exp'] | null;
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
  /** primary key columns input for table: users */
  ['users_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "users" */
  ['users_select_column']: users_select_column;
  /** input type for updating data in table "users" */
  ['users_set_input']: {
    address?: string | null;
    bio?: string | null;
    circle_id?: ValueTypes['bigint'] | null;
    created_at?: ValueTypes['timestamp'] | null;
    deleted_at?: ValueTypes['timestamp'] | null;
    epoch_first_visit?: boolean | null;
    fixed_non_receiver?: boolean | null;
    give_token_received?: number | null;
    give_token_remaining?: number | null;
    id?: ValueTypes['bigint'] | null;
    name?: string | null;
    non_giver?: boolean | null;
    non_receiver?: boolean | null;
    role?: number | null;
    starting_tokens?: number | null;
    updated_at?: ValueTypes['timestamp'] | null;
  };
  /** aggregate stddev on columns */
  ['users_stddev_fields']: AliasType<{
    circle_id?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    role?: boolean;
    starting_tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "users" */
  ['users_stddev_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['users_stddev_pop_fields']: AliasType<{
    circle_id?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    role?: boolean;
    starting_tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "users" */
  ['users_stddev_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['users_stddev_samp_fields']: AliasType<{
    circle_id?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    role?: boolean;
    starting_tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "users" */
  ['users_stddev_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['users_sum_fields']: AliasType<{
    circle_id?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    role?: boolean;
    starting_tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "users" */
  ['users_sum_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** update columns of table "users" */
  ['users_update_column']: users_update_column;
  /** aggregate var_pop on columns */
  ['users_var_pop_fields']: AliasType<{
    circle_id?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    role?: boolean;
    starting_tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "users" */
  ['users_var_pop_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['users_var_samp_fields']: AliasType<{
    circle_id?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    role?: boolean;
    starting_tokens?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "users" */
  ['users_var_samp_order_by']: {
    circle_id?: ValueTypes['order_by'] | null;
    give_token_received?: ValueTypes['order_by'] | null;
    give_token_remaining?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    role?: ValueTypes['order_by'] | null;
    starting_tokens?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['users_variance_fields']: AliasType<{
    circle_id?: boolean;
    give_token_received?: boolean;
    give_token_remaining?: boolean;
    id?: boolean;
    role?: boolean;
    starting_tokens?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregated selection of "vault_transactions" */
  ['vault_transactions_aggregate']: AliasType<{
    aggregate?: ValueTypes['vault_transactions_aggregate_fields'];
    nodes?: ValueTypes['vault_transactions'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "vault_transactions" */
  ['vault_transactions_aggregate_fields']: AliasType<{
    avg?: ValueTypes['vault_transactions_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['vault_transactions_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['vault_transactions_max_fields'];
    min?: ValueTypes['vault_transactions_min_fields'];
    stddev?: ValueTypes['vault_transactions_stddev_fields'];
    stddev_pop?: ValueTypes['vault_transactions_stddev_pop_fields'];
    stddev_samp?: ValueTypes['vault_transactions_stddev_samp_fields'];
    sum?: ValueTypes['vault_transactions_sum_fields'];
    var_pop?: ValueTypes['vault_transactions_var_pop_fields'];
    var_samp?: ValueTypes['vault_transactions_var_samp_fields'];
    variance?: ValueTypes['vault_transactions_variance_fields'];
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
    /** on conflict condition */
    on_conflict?: ValueTypes['vault_transactions_on_conflict'] | null;
  };
  /** aggregate avg on columns */
  ['vault_transactions_avg_fields']: AliasType<{
    created_by?: boolean;
    id?: boolean;
    value?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** unique or primary key constraints on table "vault_transactions" */
  ['vault_transactions_constraint']: vault_transactions_constraint;
  /** input type for incrementing numeric columns in table "vault_transactions" */
  ['vault_transactions_inc_input']: {
    created_by?: ValueTypes['bigint'] | null;
    id?: ValueTypes['bigint'] | null;
    value?: ValueTypes['bigint'] | null;
    vault_id?: ValueTypes['bigint'] | null;
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
    user?: ValueTypes['users_obj_rel_insert_input'] | null;
    value?: ValueTypes['bigint'] | null;
    vault?: ValueTypes['vaults_obj_rel_insert_input'] | null;
    vault_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate max on columns */
  ['vault_transactions_max_fields']: AliasType<{
    created_at?: boolean;
    created_by?: boolean;
    date?: boolean;
    description?: boolean;
    id?: boolean;
    name?: boolean;
    tx_hash?: boolean;
    updated_at?: boolean;
    value?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregate min on columns */
  ['vault_transactions_min_fields']: AliasType<{
    created_at?: boolean;
    created_by?: boolean;
    date?: boolean;
    description?: boolean;
    id?: boolean;
    name?: boolean;
    tx_hash?: boolean;
    updated_at?: boolean;
    value?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** on conflict condition type for table "vault_transactions" */
  ['vault_transactions_on_conflict']: {
    constraint: ValueTypes['vault_transactions_constraint'];
    update_columns: ValueTypes['vault_transactions_update_column'][];
    where?: ValueTypes['vault_transactions_bool_exp'] | null;
  };
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
  /** primary key columns input for table: vault_transactions */
  ['vault_transactions_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "vault_transactions" */
  ['vault_transactions_select_column']: vault_transactions_select_column;
  /** input type for updating data in table "vault_transactions" */
  ['vault_transactions_set_input']: {
    created_at?: ValueTypes['timestamp'] | null;
    created_by?: ValueTypes['bigint'] | null;
    date?: ValueTypes['date'] | null;
    description?: string | null;
    id?: ValueTypes['bigint'] | null;
    name?: string | null;
    tx_hash?: string | null;
    updated_at?: ValueTypes['timestamp'] | null;
    value?: ValueTypes['bigint'] | null;
    vault_id?: ValueTypes['bigint'] | null;
  };
  /** aggregate stddev on columns */
  ['vault_transactions_stddev_fields']: AliasType<{
    created_by?: boolean;
    id?: boolean;
    value?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['vault_transactions_stddev_pop_fields']: AliasType<{
    created_by?: boolean;
    id?: boolean;
    value?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_pop_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['vault_transactions_stddev_samp_fields']: AliasType<{
    created_by?: boolean;
    id?: boolean;
    value?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_samp_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['vault_transactions_sum_fields']: AliasType<{
    created_by?: boolean;
    id?: boolean;
    value?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "vault_transactions" */
  ['vault_transactions_sum_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** update columns of table "vault_transactions" */
  ['vault_transactions_update_column']: vault_transactions_update_column;
  /** aggregate var_pop on columns */
  ['vault_transactions_var_pop_fields']: AliasType<{
    created_by?: boolean;
    id?: boolean;
    value?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "vault_transactions" */
  ['vault_transactions_var_pop_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['vault_transactions_var_samp_fields']: AliasType<{
    created_by?: boolean;
    id?: boolean;
    value?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "vault_transactions" */
  ['vault_transactions_var_samp_order_by']: {
    created_by?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    value?: ValueTypes['order_by'] | null;
    vault_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['vault_transactions_variance_fields']: AliasType<{
    created_by?: boolean;
    id?: boolean;
    value?: boolean;
    vault_id?: boolean;
    __typename?: boolean;
  }>;
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
    vault_transactions_aggregate?: [
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
      ValueTypes['vault_transactions_aggregate']
    ];
    __typename?: boolean;
  }>;
  /** aggregated selection of "vaults" */
  ['vaults_aggregate']: AliasType<{
    aggregate?: ValueTypes['vaults_aggregate_fields'];
    nodes?: ValueTypes['vaults'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "vaults" */
  ['vaults_aggregate_fields']: AliasType<{
    avg?: ValueTypes['vaults_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['vaults_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['vaults_max_fields'];
    min?: ValueTypes['vaults_min_fields'];
    stddev?: ValueTypes['vaults_stddev_fields'];
    stddev_pop?: ValueTypes['vaults_stddev_pop_fields'];
    stddev_samp?: ValueTypes['vaults_stddev_samp_fields'];
    sum?: ValueTypes['vaults_sum_fields'];
    var_pop?: ValueTypes['vaults_var_pop_fields'];
    var_samp?: ValueTypes['vaults_var_samp_fields'];
    variance?: ValueTypes['vaults_variance_fields'];
    __typename?: boolean;
  }>;
  /** aggregate avg on columns */
  ['vaults_avg_fields']: AliasType<{
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
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
  /** unique or primary key constraints on table "vaults" */
  ['vaults_constraint']: vaults_constraint;
  /** input type for incrementing numeric columns in table "vaults" */
  ['vaults_inc_input']: {
    created_by?: ValueTypes['bigint'] | null;
    decimals?: number | null;
    id?: ValueTypes['bigint'] | null;
    org_id?: ValueTypes['bigint'] | null;
  };
  /** input type for inserting data into table "vaults" */
  ['vaults_insert_input']: {
    created_at?: ValueTypes['timestamptz'] | null;
    created_by?: ValueTypes['bigint'] | null;
    decimals?: number | null;
    id?: ValueTypes['bigint'] | null;
    org_id?: ValueTypes['bigint'] | null;
    protocol?: ValueTypes['organizations_obj_rel_insert_input'] | null;
    simple_token_address?: string | null;
    symbol?: string | null;
    token_address?: string | null;
    updated_at?: ValueTypes['timestamptz'] | null;
    user?: ValueTypes['users_obj_rel_insert_input'] | null;
    vault_address?: string | null;
    vault_transactions?:
      | ValueTypes['vault_transactions_arr_rel_insert_input']
      | null;
  };
  /** aggregate max on columns */
  ['vaults_max_fields']: AliasType<{
    created_at?: boolean;
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
    simple_token_address?: boolean;
    symbol?: boolean;
    token_address?: boolean;
    updated_at?: boolean;
    vault_address?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate min on columns */
  ['vaults_min_fields']: AliasType<{
    created_at?: boolean;
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
    simple_token_address?: boolean;
    symbol?: boolean;
    token_address?: boolean;
    updated_at?: boolean;
    vault_address?: boolean;
    __typename?: boolean;
  }>;
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
    /** on conflict condition */
    on_conflict?: ValueTypes['vaults_on_conflict'] | null;
  };
  /** on conflict condition type for table "vaults" */
  ['vaults_on_conflict']: {
    constraint: ValueTypes['vaults_constraint'];
    update_columns: ValueTypes['vaults_update_column'][];
    where?: ValueTypes['vaults_bool_exp'] | null;
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
  /** primary key columns input for table: vaults */
  ['vaults_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "vaults" */
  ['vaults_select_column']: vaults_select_column;
  /** input type for updating data in table "vaults" */
  ['vaults_set_input']: {
    created_at?: ValueTypes['timestamptz'] | null;
    created_by?: ValueTypes['bigint'] | null;
    decimals?: number | null;
    id?: ValueTypes['bigint'] | null;
    org_id?: ValueTypes['bigint'] | null;
    simple_token_address?: string | null;
    symbol?: string | null;
    token_address?: string | null;
    updated_at?: ValueTypes['timestamptz'] | null;
    vault_address?: string | null;
  };
  /** aggregate stddev on columns */
  ['vaults_stddev_fields']: AliasType<{
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_pop on columns */
  ['vaults_stddev_pop_fields']: AliasType<{
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate stddev_samp on columns */
  ['vaults_stddev_samp_fields']: AliasType<{
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate sum on columns */
  ['vaults_sum_fields']: AliasType<{
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
    __typename?: boolean;
  }>;
  /** update columns of table "vaults" */
  ['vaults_update_column']: vaults_update_column;
  /** aggregate var_pop on columns */
  ['vaults_var_pop_fields']: AliasType<{
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate var_samp on columns */
  ['vaults_var_samp_fields']: AliasType<{
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
    __typename?: boolean;
  }>;
  /** aggregate variance on columns */
  ['vaults_variance_fields']: AliasType<{
    created_by?: boolean;
    decimals?: boolean;
    id?: boolean;
    org_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** aggregated selection of "vouches" */
  ['vouches_aggregate']: AliasType<{
    aggregate?: ValueTypes['vouches_aggregate_fields'];
    nodes?: ValueTypes['vouches'];
    __typename?: boolean;
  }>;
  /** aggregate fields of "vouches" */
  ['vouches_aggregate_fields']: AliasType<{
    avg?: ValueTypes['vouches_avg_fields'];
    count?: [
      {
        columns?: ValueTypes['vouches_select_column'][];
        distinct?: boolean | null;
      },
      boolean
    ];
    max?: ValueTypes['vouches_max_fields'];
    min?: ValueTypes['vouches_min_fields'];
    stddev?: ValueTypes['vouches_stddev_fields'];
    stddev_pop?: ValueTypes['vouches_stddev_pop_fields'];
    stddev_samp?: ValueTypes['vouches_stddev_samp_fields'];
    sum?: ValueTypes['vouches_sum_fields'];
    var_pop?: ValueTypes['vouches_var_pop_fields'];
    var_samp?: ValueTypes['vouches_var_samp_fields'];
    variance?: ValueTypes['vouches_variance_fields'];
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
  /** input type for inserting array relation for remote table "vouches" */
  ['vouches_arr_rel_insert_input']: {
    data: ValueTypes['vouches_insert_input'][];
    /** on conflict condition */
    on_conflict?: ValueTypes['vouches_on_conflict'] | null;
  };
  /** aggregate avg on columns */
  ['vouches_avg_fields']: AliasType<{
    id?: boolean;
    nominee_id?: boolean;
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
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
  /** unique or primary key constraints on table "vouches" */
  ['vouches_constraint']: vouches_constraint;
  /** input type for incrementing numeric columns in table "vouches" */
  ['vouches_inc_input']: {
    id?: ValueTypes['bigint'] | null;
    nominee_id?: number | null;
    voucher_id?: number | null;
  };
  /** input type for inserting data into table "vouches" */
  ['vouches_insert_input']: {
    created_at?: ValueTypes['timestamp'] | null;
    id?: ValueTypes['bigint'] | null;
    nominee?: ValueTypes['nominees_obj_rel_insert_input'] | null;
    nominee_id?: number | null;
    updated_at?: ValueTypes['timestamp'] | null;
    voucher?: ValueTypes['users_obj_rel_insert_input'] | null;
    voucher_id?: number | null;
  };
  /** aggregate max on columns */
  ['vouches_max_fields']: AliasType<{
    created_at?: boolean;
    id?: boolean;
    nominee_id?: boolean;
    updated_at?: boolean;
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by max() on columns of table "vouches" */
  ['vouches_max_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate min on columns */
  ['vouches_min_fields']: AliasType<{
    created_at?: boolean;
    id?: boolean;
    nominee_id?: boolean;
    updated_at?: boolean;
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by min() on columns of table "vouches" */
  ['vouches_min_order_by']: {
    created_at?: ValueTypes['order_by'] | null;
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    updated_at?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** response of any mutation on the table "vouches" */
  ['vouches_mutation_response']: AliasType<{
    /** number of rows affected by the mutation */
    affected_rows?: boolean;
    /** data from the rows affected by the mutation */
    returning?: ValueTypes['vouches'];
    __typename?: boolean;
  }>;
  /** on conflict condition type for table "vouches" */
  ['vouches_on_conflict']: {
    constraint: ValueTypes['vouches_constraint'];
    update_columns: ValueTypes['vouches_update_column'][];
    where?: ValueTypes['vouches_bool_exp'] | null;
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
  /** primary key columns input for table: vouches */
  ['vouches_pk_columns_input']: {
    id: ValueTypes['bigint'];
  };
  /** select columns of table "vouches" */
  ['vouches_select_column']: vouches_select_column;
  /** input type for updating data in table "vouches" */
  ['vouches_set_input']: {
    created_at?: ValueTypes['timestamp'] | null;
    id?: ValueTypes['bigint'] | null;
    nominee_id?: number | null;
    updated_at?: ValueTypes['timestamp'] | null;
    voucher_id?: number | null;
  };
  /** aggregate stddev on columns */
  ['vouches_stddev_fields']: AliasType<{
    id?: boolean;
    nominee_id?: boolean;
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev() on columns of table "vouches" */
  ['vouches_stddev_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_pop on columns */
  ['vouches_stddev_pop_fields']: AliasType<{
    id?: boolean;
    nominee_id?: boolean;
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_pop() on columns of table "vouches" */
  ['vouches_stddev_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate stddev_samp on columns */
  ['vouches_stddev_samp_fields']: AliasType<{
    id?: boolean;
    nominee_id?: boolean;
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by stddev_samp() on columns of table "vouches" */
  ['vouches_stddev_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate sum on columns */
  ['vouches_sum_fields']: AliasType<{
    id?: boolean;
    nominee_id?: boolean;
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by sum() on columns of table "vouches" */
  ['vouches_sum_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** update columns of table "vouches" */
  ['vouches_update_column']: vouches_update_column;
  /** aggregate var_pop on columns */
  ['vouches_var_pop_fields']: AliasType<{
    id?: boolean;
    nominee_id?: boolean;
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_pop() on columns of table "vouches" */
  ['vouches_var_pop_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate var_samp on columns */
  ['vouches_var_samp_fields']: AliasType<{
    id?: boolean;
    nominee_id?: boolean;
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
  /** order by var_samp() on columns of table "vouches" */
  ['vouches_var_samp_order_by']: {
    id?: ValueTypes['order_by'] | null;
    nominee_id?: ValueTypes['order_by'] | null;
    voucher_id?: ValueTypes['order_by'] | null;
  };
  /** aggregate variance on columns */
  ['vouches_variance_fields']: AliasType<{
    id?: boolean;
    nominee_id?: boolean;
    voucher_id?: boolean;
    __typename?: boolean;
  }>;
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
    /** An aggregate relationship */
    users_aggregate: ModelTypes['users_aggregate'];
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
  /** aggregated selection of "burns" */
  ['burns_aggregate']: {
    aggregate?: ModelTypes['burns_aggregate_fields'];
    nodes: ModelTypes['burns'][];
  };
  /** aggregate fields of "burns" */
  ['burns_aggregate_fields']: {
    avg?: ModelTypes['burns_avg_fields'];
    count: number;
    max?: ModelTypes['burns_max_fields'];
    min?: ModelTypes['burns_min_fields'];
    stddev?: ModelTypes['burns_stddev_fields'];
    stddev_pop?: ModelTypes['burns_stddev_pop_fields'];
    stddev_samp?: ModelTypes['burns_stddev_samp_fields'];
    sum?: ModelTypes['burns_sum_fields'];
    var_pop?: ModelTypes['burns_var_pop_fields'];
    var_samp?: ModelTypes['burns_var_samp_fields'];
    variance?: ModelTypes['burns_variance_fields'];
  };
  /** order by aggregate values of table "burns" */
  ['burns_aggregate_order_by']: GraphQLTypes['burns_aggregate_order_by'];
  /** input type for inserting array relation for remote table "burns" */
  ['burns_arr_rel_insert_input']: GraphQLTypes['burns_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['burns_avg_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
  };
  /** order by avg() on columns of table "burns" */
  ['burns_avg_order_by']: GraphQLTypes['burns_avg_order_by'];
  /** Boolean expression to filter rows from the table "burns". All fields are combined with a logical 'AND'. */
  ['burns_bool_exp']: GraphQLTypes['burns_bool_exp'];
  /** unique or primary key constraints on table "burns" */
  ['burns_constraint']: GraphQLTypes['burns_constraint'];
  /** input type for incrementing numeric columns in table "burns" */
  ['burns_inc_input']: GraphQLTypes['burns_inc_input'];
  /** input type for inserting data into table "burns" */
  ['burns_insert_input']: GraphQLTypes['burns_insert_input'];
  /** aggregate max on columns */
  ['burns_max_fields']: {
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    epoch_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    updated_at?: ModelTypes['timestamp'];
    user_id?: ModelTypes['bigint'];
  };
  /** order by max() on columns of table "burns" */
  ['burns_max_order_by']: GraphQLTypes['burns_max_order_by'];
  /** aggregate min on columns */
  ['burns_min_fields']: {
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    epoch_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    updated_at?: ModelTypes['timestamp'];
    user_id?: ModelTypes['bigint'];
  };
  /** order by min() on columns of table "burns" */
  ['burns_min_order_by']: GraphQLTypes['burns_min_order_by'];
  /** response of any mutation on the table "burns" */
  ['burns_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['burns'][];
  };
  /** on conflict condition type for table "burns" */
  ['burns_on_conflict']: GraphQLTypes['burns_on_conflict'];
  /** Ordering options when selecting data from "burns". */
  ['burns_order_by']: GraphQLTypes['burns_order_by'];
  /** primary key columns input for table: burns */
  ['burns_pk_columns_input']: GraphQLTypes['burns_pk_columns_input'];
  /** select columns of table "burns" */
  ['burns_select_column']: GraphQLTypes['burns_select_column'];
  /** input type for updating data in table "burns" */
  ['burns_set_input']: GraphQLTypes['burns_set_input'];
  /** aggregate stddev on columns */
  ['burns_stddev_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
  };
  /** order by stddev() on columns of table "burns" */
  ['burns_stddev_order_by']: GraphQLTypes['burns_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['burns_stddev_pop_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
  };
  /** order by stddev_pop() on columns of table "burns" */
  ['burns_stddev_pop_order_by']: GraphQLTypes['burns_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['burns_stddev_samp_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
  };
  /** order by stddev_samp() on columns of table "burns" */
  ['burns_stddev_samp_order_by']: GraphQLTypes['burns_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['burns_sum_fields']: {
    circle_id?: ModelTypes['bigint'];
    epoch_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: ModelTypes['bigint'];
  };
  /** order by sum() on columns of table "burns" */
  ['burns_sum_order_by']: GraphQLTypes['burns_sum_order_by'];
  /** update columns of table "burns" */
  ['burns_update_column']: GraphQLTypes['burns_update_column'];
  /** aggregate var_pop on columns */
  ['burns_var_pop_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
  };
  /** order by var_pop() on columns of table "burns" */
  ['burns_var_pop_order_by']: GraphQLTypes['burns_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['burns_var_samp_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
  };
  /** order by var_samp() on columns of table "burns" */
  ['burns_var_samp_order_by']: GraphQLTypes['burns_var_samp_order_by'];
  /** aggregate variance on columns */
  ['burns_variance_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
  };
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
  /** aggregated selection of "circle_integrations" */
  ['circle_integrations_aggregate']: {
    aggregate?: ModelTypes['circle_integrations_aggregate_fields'];
    nodes: ModelTypes['circle_integrations'][];
  };
  /** aggregate fields of "circle_integrations" */
  ['circle_integrations_aggregate_fields']: {
    avg?: ModelTypes['circle_integrations_avg_fields'];
    count: number;
    max?: ModelTypes['circle_integrations_max_fields'];
    min?: ModelTypes['circle_integrations_min_fields'];
    stddev?: ModelTypes['circle_integrations_stddev_fields'];
    stddev_pop?: ModelTypes['circle_integrations_stddev_pop_fields'];
    stddev_samp?: ModelTypes['circle_integrations_stddev_samp_fields'];
    sum?: ModelTypes['circle_integrations_sum_fields'];
    var_pop?: ModelTypes['circle_integrations_var_pop_fields'];
    var_samp?: ModelTypes['circle_integrations_var_samp_fields'];
    variance?: ModelTypes['circle_integrations_variance_fields'];
  };
  /** order by aggregate values of table "circle_integrations" */
  ['circle_integrations_aggregate_order_by']: GraphQLTypes['circle_integrations_aggregate_order_by'];
  /** input type for inserting array relation for remote table "circle_integrations" */
  ['circle_integrations_arr_rel_insert_input']: GraphQLTypes['circle_integrations_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['circle_integrations_avg_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by avg() on columns of table "circle_integrations" */
  ['circle_integrations_avg_order_by']: GraphQLTypes['circle_integrations_avg_order_by'];
  /** Boolean expression to filter rows from the table "circle_integrations". All fields are combined with a logical 'AND'. */
  ['circle_integrations_bool_exp']: GraphQLTypes['circle_integrations_bool_exp'];
  /** unique or primary key constraints on table "circle_integrations" */
  ['circle_integrations_constraint']: GraphQLTypes['circle_integrations_constraint'];
  /** input type for incrementing numeric columns in table "circle_integrations" */
  ['circle_integrations_inc_input']: GraphQLTypes['circle_integrations_inc_input'];
  /** input type for inserting data into table "circle_integrations" */
  ['circle_integrations_insert_input']: GraphQLTypes['circle_integrations_insert_input'];
  /** aggregate max on columns */
  ['circle_integrations_max_fields']: {
    circle_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    name?: string;
    type?: string;
  };
  /** order by max() on columns of table "circle_integrations" */
  ['circle_integrations_max_order_by']: GraphQLTypes['circle_integrations_max_order_by'];
  /** aggregate min on columns */
  ['circle_integrations_min_fields']: {
    circle_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    name?: string;
    type?: string;
  };
  /** order by min() on columns of table "circle_integrations" */
  ['circle_integrations_min_order_by']: GraphQLTypes['circle_integrations_min_order_by'];
  /** response of any mutation on the table "circle_integrations" */
  ['circle_integrations_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['circle_integrations'][];
  };
  /** on conflict condition type for table "circle_integrations" */
  ['circle_integrations_on_conflict']: GraphQLTypes['circle_integrations_on_conflict'];
  /** Ordering options when selecting data from "circle_integrations". */
  ['circle_integrations_order_by']: GraphQLTypes['circle_integrations_order_by'];
  /** primary key columns input for table: circle_integrations */
  ['circle_integrations_pk_columns_input']: GraphQLTypes['circle_integrations_pk_columns_input'];
  /** select columns of table "circle_integrations" */
  ['circle_integrations_select_column']: GraphQLTypes['circle_integrations_select_column'];
  /** input type for updating data in table "circle_integrations" */
  ['circle_integrations_set_input']: GraphQLTypes['circle_integrations_set_input'];
  /** aggregate stddev on columns */
  ['circle_integrations_stddev_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by stddev() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_order_by']: GraphQLTypes['circle_integrations_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['circle_integrations_stddev_pop_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by stddev_pop() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_pop_order_by']: GraphQLTypes['circle_integrations_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['circle_integrations_stddev_samp_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by stddev_samp() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_samp_order_by']: GraphQLTypes['circle_integrations_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['circle_integrations_sum_fields']: {
    circle_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
  };
  /** order by sum() on columns of table "circle_integrations" */
  ['circle_integrations_sum_order_by']: GraphQLTypes['circle_integrations_sum_order_by'];
  /** update columns of table "circle_integrations" */
  ['circle_integrations_update_column']: GraphQLTypes['circle_integrations_update_column'];
  /** aggregate var_pop on columns */
  ['circle_integrations_var_pop_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by var_pop() on columns of table "circle_integrations" */
  ['circle_integrations_var_pop_order_by']: GraphQLTypes['circle_integrations_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['circle_integrations_var_samp_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by var_samp() on columns of table "circle_integrations" */
  ['circle_integrations_var_samp_order_by']: GraphQLTypes['circle_integrations_var_samp_order_by'];
  /** aggregate variance on columns */
  ['circle_integrations_variance_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by variance() on columns of table "circle_integrations" */
  ['circle_integrations_variance_order_by']: GraphQLTypes['circle_integrations_variance_order_by'];
  /** columns and relationships of "circle_metadata" */
  ['circle_metadata']: {
    /** An object relationship */
    circle: ModelTypes['circles'];
    circle_id: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    id: ModelTypes['bigint'];
    json?: ModelTypes['json'];
    updated_at?: ModelTypes['timestamp'];
  };
  /** aggregated selection of "circle_metadata" */
  ['circle_metadata_aggregate']: {
    aggregate?: ModelTypes['circle_metadata_aggregate_fields'];
    nodes: ModelTypes['circle_metadata'][];
  };
  /** aggregate fields of "circle_metadata" */
  ['circle_metadata_aggregate_fields']: {
    avg?: ModelTypes['circle_metadata_avg_fields'];
    count: number;
    max?: ModelTypes['circle_metadata_max_fields'];
    min?: ModelTypes['circle_metadata_min_fields'];
    stddev?: ModelTypes['circle_metadata_stddev_fields'];
    stddev_pop?: ModelTypes['circle_metadata_stddev_pop_fields'];
    stddev_samp?: ModelTypes['circle_metadata_stddev_samp_fields'];
    sum?: ModelTypes['circle_metadata_sum_fields'];
    var_pop?: ModelTypes['circle_metadata_var_pop_fields'];
    var_samp?: ModelTypes['circle_metadata_var_samp_fields'];
    variance?: ModelTypes['circle_metadata_variance_fields'];
  };
  /** order by aggregate values of table "circle_metadata" */
  ['circle_metadata_aggregate_order_by']: GraphQLTypes['circle_metadata_aggregate_order_by'];
  /** input type for inserting array relation for remote table "circle_metadata" */
  ['circle_metadata_arr_rel_insert_input']: GraphQLTypes['circle_metadata_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['circle_metadata_avg_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by avg() on columns of table "circle_metadata" */
  ['circle_metadata_avg_order_by']: GraphQLTypes['circle_metadata_avg_order_by'];
  /** Boolean expression to filter rows from the table "circle_metadata". All fields are combined with a logical 'AND'. */
  ['circle_metadata_bool_exp']: GraphQLTypes['circle_metadata_bool_exp'];
  /** unique or primary key constraints on table "circle_metadata" */
  ['circle_metadata_constraint']: GraphQLTypes['circle_metadata_constraint'];
  /** input type for incrementing numeric columns in table "circle_metadata" */
  ['circle_metadata_inc_input']: GraphQLTypes['circle_metadata_inc_input'];
  /** input type for inserting data into table "circle_metadata" */
  ['circle_metadata_insert_input']: GraphQLTypes['circle_metadata_insert_input'];
  /** aggregate max on columns */
  ['circle_metadata_max_fields']: {
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    id?: ModelTypes['bigint'];
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by max() on columns of table "circle_metadata" */
  ['circle_metadata_max_order_by']: GraphQLTypes['circle_metadata_max_order_by'];
  /** aggregate min on columns */
  ['circle_metadata_min_fields']: {
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    id?: ModelTypes['bigint'];
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by min() on columns of table "circle_metadata" */
  ['circle_metadata_min_order_by']: GraphQLTypes['circle_metadata_min_order_by'];
  /** response of any mutation on the table "circle_metadata" */
  ['circle_metadata_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['circle_metadata'][];
  };
  /** on conflict condition type for table "circle_metadata" */
  ['circle_metadata_on_conflict']: GraphQLTypes['circle_metadata_on_conflict'];
  /** Ordering options when selecting data from "circle_metadata". */
  ['circle_metadata_order_by']: GraphQLTypes['circle_metadata_order_by'];
  /** primary key columns input for table: circle_metadata */
  ['circle_metadata_pk_columns_input']: GraphQLTypes['circle_metadata_pk_columns_input'];
  /** select columns of table "circle_metadata" */
  ['circle_metadata_select_column']: GraphQLTypes['circle_metadata_select_column'];
  /** input type for updating data in table "circle_metadata" */
  ['circle_metadata_set_input']: GraphQLTypes['circle_metadata_set_input'];
  /** aggregate stddev on columns */
  ['circle_metadata_stddev_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by stddev() on columns of table "circle_metadata" */
  ['circle_metadata_stddev_order_by']: GraphQLTypes['circle_metadata_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['circle_metadata_stddev_pop_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by stddev_pop() on columns of table "circle_metadata" */
  ['circle_metadata_stddev_pop_order_by']: GraphQLTypes['circle_metadata_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['circle_metadata_stddev_samp_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by stddev_samp() on columns of table "circle_metadata" */
  ['circle_metadata_stddev_samp_order_by']: GraphQLTypes['circle_metadata_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['circle_metadata_sum_fields']: {
    circle_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
  };
  /** order by sum() on columns of table "circle_metadata" */
  ['circle_metadata_sum_order_by']: GraphQLTypes['circle_metadata_sum_order_by'];
  /** update columns of table "circle_metadata" */
  ['circle_metadata_update_column']: GraphQLTypes['circle_metadata_update_column'];
  /** aggregate var_pop on columns */
  ['circle_metadata_var_pop_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by var_pop() on columns of table "circle_metadata" */
  ['circle_metadata_var_pop_order_by']: GraphQLTypes['circle_metadata_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['circle_metadata_var_samp_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by var_samp() on columns of table "circle_metadata" */
  ['circle_metadata_var_samp_order_by']: GraphQLTypes['circle_metadata_var_samp_order_by'];
  /** aggregate variance on columns */
  ['circle_metadata_variance_fields']: {
    circle_id?: number;
    id?: number;
  };
  /** order by variance() on columns of table "circle_metadata" */
  ['circle_metadata_variance_order_by']: GraphQLTypes['circle_metadata_variance_order_by'];
  /** columns and relationships of "circle_private" */
  ['circle_private']: {
    /** An object relationship */
    circle?: ModelTypes['circles'];
    circle_id?: ModelTypes['bigint'];
    discord_webhook?: string;
  };
  /** aggregated selection of "circle_private" */
  ['circle_private_aggregate']: {
    aggregate?: ModelTypes['circle_private_aggregate_fields'];
    nodes: ModelTypes['circle_private'][];
  };
  /** aggregate fields of "circle_private" */
  ['circle_private_aggregate_fields']: {
    avg?: ModelTypes['circle_private_avg_fields'];
    count: number;
    max?: ModelTypes['circle_private_max_fields'];
    min?: ModelTypes['circle_private_min_fields'];
    stddev?: ModelTypes['circle_private_stddev_fields'];
    stddev_pop?: ModelTypes['circle_private_stddev_pop_fields'];
    stddev_samp?: ModelTypes['circle_private_stddev_samp_fields'];
    sum?: ModelTypes['circle_private_sum_fields'];
    var_pop?: ModelTypes['circle_private_var_pop_fields'];
    var_samp?: ModelTypes['circle_private_var_samp_fields'];
    variance?: ModelTypes['circle_private_variance_fields'];
  };
  /** aggregate avg on columns */
  ['circle_private_avg_fields']: {
    circle_id?: number;
  };
  /** Boolean expression to filter rows from the table "circle_private". All fields are combined with a logical 'AND'. */
  ['circle_private_bool_exp']: GraphQLTypes['circle_private_bool_exp'];
  /** input type for incrementing numeric columns in table "circle_private" */
  ['circle_private_inc_input']: GraphQLTypes['circle_private_inc_input'];
  /** input type for inserting data into table "circle_private" */
  ['circle_private_insert_input']: GraphQLTypes['circle_private_insert_input'];
  /** aggregate max on columns */
  ['circle_private_max_fields']: {
    circle_id?: ModelTypes['bigint'];
    discord_webhook?: string;
  };
  /** aggregate min on columns */
  ['circle_private_min_fields']: {
    circle_id?: ModelTypes['bigint'];
    discord_webhook?: string;
  };
  /** response of any mutation on the table "circle_private" */
  ['circle_private_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['circle_private'][];
  };
  /** input type for inserting object relation for remote table "circle_private" */
  ['circle_private_obj_rel_insert_input']: GraphQLTypes['circle_private_obj_rel_insert_input'];
  /** Ordering options when selecting data from "circle_private". */
  ['circle_private_order_by']: GraphQLTypes['circle_private_order_by'];
  /** select columns of table "circle_private" */
  ['circle_private_select_column']: GraphQLTypes['circle_private_select_column'];
  /** input type for updating data in table "circle_private" */
  ['circle_private_set_input']: GraphQLTypes['circle_private_set_input'];
  /** aggregate stddev on columns */
  ['circle_private_stddev_fields']: {
    circle_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['circle_private_stddev_pop_fields']: {
    circle_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['circle_private_stddev_samp_fields']: {
    circle_id?: number;
  };
  /** aggregate sum on columns */
  ['circle_private_sum_fields']: {
    circle_id?: ModelTypes['bigint'];
  };
  /** aggregate var_pop on columns */
  ['circle_private_var_pop_fields']: {
    circle_id?: number;
  };
  /** aggregate var_samp on columns */
  ['circle_private_var_samp_fields']: {
    circle_id?: number;
  };
  /** aggregate variance on columns */
  ['circle_private_variance_fields']: {
    circle_id?: number;
  };
  /** columns and relationships of "circles" */
  ['circles']: {
    alloc_text?: string;
    auto_opt_out: boolean;
    /** An array relationship */
    burns: ModelTypes['burns'][];
    /** An aggregate relationship */
    burns_aggregate: ModelTypes['burns_aggregate'];
    /** An array relationship */
    circle_metadata: ModelTypes['circle_metadata'][];
    /** An aggregate relationship */
    circle_metadata_aggregate: ModelTypes['circle_metadata_aggregate'];
    /** An object relationship */
    circle_private?: ModelTypes['circle_private'];
    contact?: string;
    created_at?: ModelTypes['timestamp'];
    default_opt_in: boolean;
    discord_webhook?: string;
    /** An array relationship */
    epochs: ModelTypes['epochs'][];
    /** An aggregate relationship */
    epochs_aggregate: ModelTypes['epochs_aggregate'];
    id: ModelTypes['bigint'];
    /** An array relationship */
    integrations: ModelTypes['circle_integrations'][];
    /** An aggregate relationship */
    integrations_aggregate: ModelTypes['circle_integrations_aggregate'];
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
    /** An aggregate relationship */
    pending_token_gifts_aggregate: ModelTypes['pending_token_gifts_aggregate'];
    protocol_id: number;
    team_sel_text?: string;
    team_selection: boolean;
    telegram_id?: string;
    /** An array relationship */
    token_gifts: ModelTypes['token_gifts'][];
    /** An aggregate relationship */
    token_gifts_aggregate: ModelTypes['token_gifts_aggregate'];
    token_name: string;
    updated_at?: ModelTypes['timestamp'];
    /** An array relationship */
    users: ModelTypes['users'][];
    /** An aggregate relationship */
    users_aggregate: ModelTypes['users_aggregate'];
    vouching: boolean;
    vouching_text?: string;
  };
  /** aggregated selection of "circles" */
  ['circles_aggregate']: {
    aggregate?: ModelTypes['circles_aggregate_fields'];
    nodes: ModelTypes['circles'][];
  };
  /** aggregate fields of "circles" */
  ['circles_aggregate_fields']: {
    avg?: ModelTypes['circles_avg_fields'];
    count: number;
    max?: ModelTypes['circles_max_fields'];
    min?: ModelTypes['circles_min_fields'];
    stddev?: ModelTypes['circles_stddev_fields'];
    stddev_pop?: ModelTypes['circles_stddev_pop_fields'];
    stddev_samp?: ModelTypes['circles_stddev_samp_fields'];
    sum?: ModelTypes['circles_sum_fields'];
    var_pop?: ModelTypes['circles_var_pop_fields'];
    var_samp?: ModelTypes['circles_var_samp_fields'];
    variance?: ModelTypes['circles_variance_fields'];
  };
  /** order by aggregate values of table "circles" */
  ['circles_aggregate_order_by']: GraphQLTypes['circles_aggregate_order_by'];
  /** input type for inserting array relation for remote table "circles" */
  ['circles_arr_rel_insert_input']: GraphQLTypes['circles_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['circles_avg_fields']: {
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by avg() on columns of table "circles" */
  ['circles_avg_order_by']: GraphQLTypes['circles_avg_order_by'];
  /** Boolean expression to filter rows from the table "circles". All fields are combined with a logical 'AND'. */
  ['circles_bool_exp']: GraphQLTypes['circles_bool_exp'];
  /** unique or primary key constraints on table "circles" */
  ['circles_constraint']: GraphQLTypes['circles_constraint'];
  /** input type for incrementing numeric columns in table "circles" */
  ['circles_inc_input']: GraphQLTypes['circles_inc_input'];
  /** input type for inserting data into table "circles" */
  ['circles_insert_input']: GraphQLTypes['circles_insert_input'];
  /** aggregate max on columns */
  ['circles_max_fields']: {
    alloc_text?: string;
    contact?: string;
    created_at?: ModelTypes['timestamp'];
    discord_webhook?: string;
    id?: ModelTypes['bigint'];
    logo?: string;
    min_vouches?: number;
    name?: string;
    nomination_days_limit?: number;
    protocol_id?: number;
    team_sel_text?: string;
    telegram_id?: string;
    token_name?: string;
    updated_at?: ModelTypes['timestamp'];
    vouching_text?: string;
  };
  /** order by max() on columns of table "circles" */
  ['circles_max_order_by']: GraphQLTypes['circles_max_order_by'];
  /** aggregate min on columns */
  ['circles_min_fields']: {
    alloc_text?: string;
    contact?: string;
    created_at?: ModelTypes['timestamp'];
    discord_webhook?: string;
    id?: ModelTypes['bigint'];
    logo?: string;
    min_vouches?: number;
    name?: string;
    nomination_days_limit?: number;
    protocol_id?: number;
    team_sel_text?: string;
    telegram_id?: string;
    token_name?: string;
    updated_at?: ModelTypes['timestamp'];
    vouching_text?: string;
  };
  /** order by min() on columns of table "circles" */
  ['circles_min_order_by']: GraphQLTypes['circles_min_order_by'];
  /** response of any mutation on the table "circles" */
  ['circles_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['circles'][];
  };
  /** input type for inserting object relation for remote table "circles" */
  ['circles_obj_rel_insert_input']: GraphQLTypes['circles_obj_rel_insert_input'];
  /** on conflict condition type for table "circles" */
  ['circles_on_conflict']: GraphQLTypes['circles_on_conflict'];
  /** Ordering options when selecting data from "circles". */
  ['circles_order_by']: GraphQLTypes['circles_order_by'];
  /** primary key columns input for table: circles */
  ['circles_pk_columns_input']: GraphQLTypes['circles_pk_columns_input'];
  /** select columns of table "circles" */
  ['circles_select_column']: GraphQLTypes['circles_select_column'];
  /** input type for updating data in table "circles" */
  ['circles_set_input']: GraphQLTypes['circles_set_input'];
  /** aggregate stddev on columns */
  ['circles_stddev_fields']: {
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by stddev() on columns of table "circles" */
  ['circles_stddev_order_by']: GraphQLTypes['circles_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['circles_stddev_pop_fields']: {
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by stddev_pop() on columns of table "circles" */
  ['circles_stddev_pop_order_by']: GraphQLTypes['circles_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['circles_stddev_samp_fields']: {
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by stddev_samp() on columns of table "circles" */
  ['circles_stddev_samp_order_by']: GraphQLTypes['circles_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['circles_sum_fields']: {
    id?: ModelTypes['bigint'];
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by sum() on columns of table "circles" */
  ['circles_sum_order_by']: GraphQLTypes['circles_sum_order_by'];
  /** update columns of table "circles" */
  ['circles_update_column']: GraphQLTypes['circles_update_column'];
  /** aggregate var_pop on columns */
  ['circles_var_pop_fields']: {
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by var_pop() on columns of table "circles" */
  ['circles_var_pop_order_by']: GraphQLTypes['circles_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['circles_var_samp_fields']: {
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by var_samp() on columns of table "circles" */
  ['circles_var_samp_order_by']: GraphQLTypes['circles_var_samp_order_by'];
  /** aggregate variance on columns */
  ['circles_variance_fields']: {
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
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
  /** aggregated selection of "claims" */
  ['claims_aggregate']: {
    aggregate?: ModelTypes['claims_aggregate_fields'];
    nodes: ModelTypes['claims'][];
  };
  /** aggregate fields of "claims" */
  ['claims_aggregate_fields']: {
    avg?: ModelTypes['claims_avg_fields'];
    count: number;
    max?: ModelTypes['claims_max_fields'];
    min?: ModelTypes['claims_min_fields'];
    stddev?: ModelTypes['claims_stddev_fields'];
    stddev_pop?: ModelTypes['claims_stddev_pop_fields'];
    stddev_samp?: ModelTypes['claims_stddev_samp_fields'];
    sum?: ModelTypes['claims_sum_fields'];
    var_pop?: ModelTypes['claims_var_pop_fields'];
    var_samp?: ModelTypes['claims_var_samp_fields'];
    variance?: ModelTypes['claims_variance_fields'];
  };
  /** order by aggregate values of table "claims" */
  ['claims_aggregate_order_by']: GraphQLTypes['claims_aggregate_order_by'];
  /** input type for inserting array relation for remote table "claims" */
  ['claims_arr_rel_insert_input']: GraphQLTypes['claims_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['claims_avg_fields']: {
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
  };
  /** order by avg() on columns of table "claims" */
  ['claims_avg_order_by']: GraphQLTypes['claims_avg_order_by'];
  /** Boolean expression to filter rows from the table "claims". All fields are combined with a logical 'AND'. */
  ['claims_bool_exp']: GraphQLTypes['claims_bool_exp'];
  /** unique or primary key constraints on table "claims" */
  ['claims_constraint']: GraphQLTypes['claims_constraint'];
  /** input type for incrementing numeric columns in table "claims" */
  ['claims_inc_input']: GraphQLTypes['claims_inc_input'];
  /** input type for inserting data into table "claims" */
  ['claims_insert_input']: GraphQLTypes['claims_insert_input'];
  /** aggregate max on columns */
  ['claims_max_fields']: {
    address?: string;
    amount?: ModelTypes['numeric'];
    created_at?: ModelTypes['timestamptz'];
    created_by?: ModelTypes['bigint'];
    distribution_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    index?: ModelTypes['bigint'];
    new_amount?: ModelTypes['numeric'];
    proof?: string;
    updated_at?: ModelTypes['timestamptz'];
    updated_by?: ModelTypes['bigint'];
    user_id?: ModelTypes['bigint'];
  };
  /** order by max() on columns of table "claims" */
  ['claims_max_order_by']: GraphQLTypes['claims_max_order_by'];
  /** aggregate min on columns */
  ['claims_min_fields']: {
    address?: string;
    amount?: ModelTypes['numeric'];
    created_at?: ModelTypes['timestamptz'];
    created_by?: ModelTypes['bigint'];
    distribution_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    index?: ModelTypes['bigint'];
    new_amount?: ModelTypes['numeric'];
    proof?: string;
    updated_at?: ModelTypes['timestamptz'];
    updated_by?: ModelTypes['bigint'];
    user_id?: ModelTypes['bigint'];
  };
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
  /** aggregate stddev on columns */
  ['claims_stddev_fields']: {
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
  };
  /** order by stddev() on columns of table "claims" */
  ['claims_stddev_order_by']: GraphQLTypes['claims_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['claims_stddev_pop_fields']: {
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
  };
  /** order by stddev_pop() on columns of table "claims" */
  ['claims_stddev_pop_order_by']: GraphQLTypes['claims_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['claims_stddev_samp_fields']: {
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
  };
  /** order by stddev_samp() on columns of table "claims" */
  ['claims_stddev_samp_order_by']: GraphQLTypes['claims_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['claims_sum_fields']: {
    amount?: ModelTypes['numeric'];
    created_by?: ModelTypes['bigint'];
    distribution_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    index?: ModelTypes['bigint'];
    new_amount?: ModelTypes['numeric'];
    updated_by?: ModelTypes['bigint'];
    user_id?: ModelTypes['bigint'];
  };
  /** order by sum() on columns of table "claims" */
  ['claims_sum_order_by']: GraphQLTypes['claims_sum_order_by'];
  /** update columns of table "claims" */
  ['claims_update_column']: GraphQLTypes['claims_update_column'];
  /** aggregate var_pop on columns */
  ['claims_var_pop_fields']: {
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
  };
  /** order by var_pop() on columns of table "claims" */
  ['claims_var_pop_order_by']: GraphQLTypes['claims_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['claims_var_samp_fields']: {
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
  };
  /** order by var_samp() on columns of table "claims" */
  ['claims_var_samp_order_by']: GraphQLTypes['claims_var_samp_order_by'];
  /** aggregate variance on columns */
  ['claims_variance_fields']: {
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
  };
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
    /** An aggregate relationship */
    claims_aggregate: ModelTypes['claims_aggregate'];
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
  /** aggregated selection of "distributions" */
  ['distributions_aggregate']: {
    aggregate?: ModelTypes['distributions_aggregate_fields'];
    nodes: ModelTypes['distributions'][];
  };
  /** aggregate fields of "distributions" */
  ['distributions_aggregate_fields']: {
    avg?: ModelTypes['distributions_avg_fields'];
    count: number;
    max?: ModelTypes['distributions_max_fields'];
    min?: ModelTypes['distributions_min_fields'];
    stddev?: ModelTypes['distributions_stddev_fields'];
    stddev_pop?: ModelTypes['distributions_stddev_pop_fields'];
    stddev_samp?: ModelTypes['distributions_stddev_samp_fields'];
    sum?: ModelTypes['distributions_sum_fields'];
    var_pop?: ModelTypes['distributions_var_pop_fields'];
    var_samp?: ModelTypes['distributions_var_samp_fields'];
    variance?: ModelTypes['distributions_variance_fields'];
  };
  /** append existing jsonb value of filtered columns with new jsonb value */
  ['distributions_append_input']: GraphQLTypes['distributions_append_input'];
  /** aggregate avg on columns */
  ['distributions_avg_fields']: {
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** Boolean expression to filter rows from the table "distributions". All fields are combined with a logical 'AND'. */
  ['distributions_bool_exp']: GraphQLTypes['distributions_bool_exp'];
  /** unique or primary key constraints on table "distributions" */
  ['distributions_constraint']: GraphQLTypes['distributions_constraint'];
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  ['distributions_delete_at_path_input']: GraphQLTypes['distributions_delete_at_path_input'];
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  ['distributions_delete_elem_input']: GraphQLTypes['distributions_delete_elem_input'];
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  ['distributions_delete_key_input']: GraphQLTypes['distributions_delete_key_input'];
  /** input type for incrementing numeric columns in table "distributions" */
  ['distributions_inc_input']: GraphQLTypes['distributions_inc_input'];
  /** input type for inserting data into table "distributions" */
  ['distributions_insert_input']: GraphQLTypes['distributions_insert_input'];
  /** aggregate max on columns */
  ['distributions_max_fields']: {
    created_at?: ModelTypes['timestamp'];
    created_by?: ModelTypes['bigint'];
    distribution_epoch_id?: ModelTypes['bigint'];
    epoch_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    merkle_root?: string;
    total_amount?: ModelTypes['numeric'];
    vault_id?: ModelTypes['bigint'];
  };
  /** aggregate min on columns */
  ['distributions_min_fields']: {
    created_at?: ModelTypes['timestamp'];
    created_by?: ModelTypes['bigint'];
    distribution_epoch_id?: ModelTypes['bigint'];
    epoch_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    merkle_root?: string;
    total_amount?: ModelTypes['numeric'];
    vault_id?: ModelTypes['bigint'];
  };
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
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  ['distributions_prepend_input']: GraphQLTypes['distributions_prepend_input'];
  /** select columns of table "distributions" */
  ['distributions_select_column']: GraphQLTypes['distributions_select_column'];
  /** input type for updating data in table "distributions" */
  ['distributions_set_input']: GraphQLTypes['distributions_set_input'];
  /** aggregate stddev on columns */
  ['distributions_stddev_fields']: {
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['distributions_stddev_pop_fields']: {
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['distributions_stddev_samp_fields']: {
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** aggregate sum on columns */
  ['distributions_sum_fields']: {
    created_by?: ModelTypes['bigint'];
    distribution_epoch_id?: ModelTypes['bigint'];
    epoch_id?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    total_amount?: ModelTypes['numeric'];
    vault_id?: ModelTypes['bigint'];
  };
  /** update columns of table "distributions" */
  ['distributions_update_column']: GraphQLTypes['distributions_update_column'];
  /** aggregate var_pop on columns */
  ['distributions_var_pop_fields']: {
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** aggregate var_samp on columns */
  ['distributions_var_samp_fields']: {
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** aggregate variance on columns */
  ['distributions_variance_fields']: {
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** columns and relationships of "epoches" */
  ['epochs']: {
    /** An array relationship */
    burns: ModelTypes['burns'][];
    /** An aggregate relationship */
    burns_aggregate: ModelTypes['burns_aggregate'];
    /** An object relationship */
    circle?: ModelTypes['circles'];
    circle_id: number;
    created_at: ModelTypes['timestamp'];
    days?: number;
    end_date: ModelTypes['timestamptz'];
    ended: boolean;
    /** An array relationship */
    epoch_pending_token_gifts: ModelTypes['pending_token_gifts'][];
    /** An aggregate relationship */
    epoch_pending_token_gifts_aggregate: ModelTypes['pending_token_gifts_aggregate'];
    grant: ModelTypes['numeric'];
    id: ModelTypes['bigint'];
    notified_before_end?: ModelTypes['timestamp'];
    notified_end?: ModelTypes['timestamp'];
    notified_start?: ModelTypes['timestamp'];
    number?: number;
    regift_days: number;
    repeat: number;
    repeat_day_of_month: number;
    start_date: ModelTypes['timestamptz'];
    /** An array relationship */
    token_gifts: ModelTypes['token_gifts'][];
    /** An aggregate relationship */
    token_gifts_aggregate: ModelTypes['token_gifts_aggregate'];
    updated_at: ModelTypes['timestamp'];
  };
  /** aggregated selection of "epoches" */
  ['epochs_aggregate']: {
    aggregate?: ModelTypes['epochs_aggregate_fields'];
    nodes: ModelTypes['epochs'][];
  };
  /** aggregate fields of "epoches" */
  ['epochs_aggregate_fields']: {
    avg?: ModelTypes['epochs_avg_fields'];
    count: number;
    max?: ModelTypes['epochs_max_fields'];
    min?: ModelTypes['epochs_min_fields'];
    stddev?: ModelTypes['epochs_stddev_fields'];
    stddev_pop?: ModelTypes['epochs_stddev_pop_fields'];
    stddev_samp?: ModelTypes['epochs_stddev_samp_fields'];
    sum?: ModelTypes['epochs_sum_fields'];
    var_pop?: ModelTypes['epochs_var_pop_fields'];
    var_samp?: ModelTypes['epochs_var_samp_fields'];
    variance?: ModelTypes['epochs_variance_fields'];
  };
  /** order by aggregate values of table "epoches" */
  ['epochs_aggregate_order_by']: GraphQLTypes['epochs_aggregate_order_by'];
  /** input type for inserting array relation for remote table "epoches" */
  ['epochs_arr_rel_insert_input']: GraphQLTypes['epochs_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['epochs_avg_fields']: {
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by avg() on columns of table "epoches" */
  ['epochs_avg_order_by']: GraphQLTypes['epochs_avg_order_by'];
  /** Boolean expression to filter rows from the table "epoches". All fields are combined with a logical 'AND'. */
  ['epochs_bool_exp']: GraphQLTypes['epochs_bool_exp'];
  /** unique or primary key constraints on table "epoches" */
  ['epochs_constraint']: GraphQLTypes['epochs_constraint'];
  /** input type for incrementing numeric columns in table "epoches" */
  ['epochs_inc_input']: GraphQLTypes['epochs_inc_input'];
  /** input type for inserting data into table "epoches" */
  ['epochs_insert_input']: GraphQLTypes['epochs_insert_input'];
  /** aggregate max on columns */
  ['epochs_max_fields']: {
    circle_id?: number;
    created_at?: ModelTypes['timestamp'];
    days?: number;
    end_date?: ModelTypes['timestamptz'];
    grant?: ModelTypes['numeric'];
    id?: ModelTypes['bigint'];
    notified_before_end?: ModelTypes['timestamp'];
    notified_end?: ModelTypes['timestamp'];
    notified_start?: ModelTypes['timestamp'];
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
    start_date?: ModelTypes['timestamptz'];
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by max() on columns of table "epoches" */
  ['epochs_max_order_by']: GraphQLTypes['epochs_max_order_by'];
  /** aggregate min on columns */
  ['epochs_min_fields']: {
    circle_id?: number;
    created_at?: ModelTypes['timestamp'];
    days?: number;
    end_date?: ModelTypes['timestamptz'];
    grant?: ModelTypes['numeric'];
    id?: ModelTypes['bigint'];
    notified_before_end?: ModelTypes['timestamp'];
    notified_end?: ModelTypes['timestamp'];
    notified_start?: ModelTypes['timestamp'];
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
    start_date?: ModelTypes['timestamptz'];
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by min() on columns of table "epoches" */
  ['epochs_min_order_by']: GraphQLTypes['epochs_min_order_by'];
  /** response of any mutation on the table "epoches" */
  ['epochs_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['epochs'][];
  };
  /** input type for inserting object relation for remote table "epoches" */
  ['epochs_obj_rel_insert_input']: GraphQLTypes['epochs_obj_rel_insert_input'];
  /** on conflict condition type for table "epoches" */
  ['epochs_on_conflict']: GraphQLTypes['epochs_on_conflict'];
  /** Ordering options when selecting data from "epoches". */
  ['epochs_order_by']: GraphQLTypes['epochs_order_by'];
  /** primary key columns input for table: epochs */
  ['epochs_pk_columns_input']: GraphQLTypes['epochs_pk_columns_input'];
  /** select columns of table "epoches" */
  ['epochs_select_column']: GraphQLTypes['epochs_select_column'];
  /** input type for updating data in table "epoches" */
  ['epochs_set_input']: GraphQLTypes['epochs_set_input'];
  /** aggregate stddev on columns */
  ['epochs_stddev_fields']: {
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by stddev() on columns of table "epoches" */
  ['epochs_stddev_order_by']: GraphQLTypes['epochs_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['epochs_stddev_pop_fields']: {
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by stddev_pop() on columns of table "epoches" */
  ['epochs_stddev_pop_order_by']: GraphQLTypes['epochs_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['epochs_stddev_samp_fields']: {
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by stddev_samp() on columns of table "epoches" */
  ['epochs_stddev_samp_order_by']: GraphQLTypes['epochs_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['epochs_sum_fields']: {
    circle_id?: number;
    days?: number;
    grant?: ModelTypes['numeric'];
    id?: ModelTypes['bigint'];
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by sum() on columns of table "epoches" */
  ['epochs_sum_order_by']: GraphQLTypes['epochs_sum_order_by'];
  /** update columns of table "epoches" */
  ['epochs_update_column']: GraphQLTypes['epochs_update_column'];
  /** aggregate var_pop on columns */
  ['epochs_var_pop_fields']: {
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by var_pop() on columns of table "epoches" */
  ['epochs_var_pop_order_by']: GraphQLTypes['epochs_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['epochs_var_samp_fields']: {
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by var_samp() on columns of table "epoches" */
  ['epochs_var_samp_order_by']: GraphQLTypes['epochs_var_samp_order_by'];
  /** aggregate variance on columns */
  ['epochs_variance_fields']: {
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
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
  /** aggregated selection of "gift_private" */
  ['gift_private_aggregate']: {
    aggregate?: ModelTypes['gift_private_aggregate_fields'];
    nodes: ModelTypes['gift_private'][];
  };
  /** aggregate fields of "gift_private" */
  ['gift_private_aggregate_fields']: {
    avg?: ModelTypes['gift_private_avg_fields'];
    count: number;
    max?: ModelTypes['gift_private_max_fields'];
    min?: ModelTypes['gift_private_min_fields'];
    stddev?: ModelTypes['gift_private_stddev_fields'];
    stddev_pop?: ModelTypes['gift_private_stddev_pop_fields'];
    stddev_samp?: ModelTypes['gift_private_stddev_samp_fields'];
    sum?: ModelTypes['gift_private_sum_fields'];
    var_pop?: ModelTypes['gift_private_var_pop_fields'];
    var_samp?: ModelTypes['gift_private_var_samp_fields'];
    variance?: ModelTypes['gift_private_variance_fields'];
  };
  /** aggregate avg on columns */
  ['gift_private_avg_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** Boolean expression to filter rows from the table "gift_private". All fields are combined with a logical 'AND'. */
  ['gift_private_bool_exp']: GraphQLTypes['gift_private_bool_exp'];
  /** input type for incrementing numeric columns in table "gift_private" */
  ['gift_private_inc_input']: GraphQLTypes['gift_private_inc_input'];
  /** input type for inserting data into table "gift_private" */
  ['gift_private_insert_input']: GraphQLTypes['gift_private_insert_input'];
  /** aggregate max on columns */
  ['gift_private_max_fields']: {
    gift_id?: ModelTypes['bigint'];
    note?: string;
    recipient_id?: ModelTypes['bigint'];
    sender_id?: ModelTypes['bigint'];
  };
  /** aggregate min on columns */
  ['gift_private_min_fields']: {
    gift_id?: ModelTypes['bigint'];
    note?: string;
    recipient_id?: ModelTypes['bigint'];
    sender_id?: ModelTypes['bigint'];
  };
  /** response of any mutation on the table "gift_private" */
  ['gift_private_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['gift_private'][];
  };
  /** input type for inserting object relation for remote table "gift_private" */
  ['gift_private_obj_rel_insert_input']: GraphQLTypes['gift_private_obj_rel_insert_input'];
  /** Ordering options when selecting data from "gift_private". */
  ['gift_private_order_by']: GraphQLTypes['gift_private_order_by'];
  /** select columns of table "gift_private" */
  ['gift_private_select_column']: GraphQLTypes['gift_private_select_column'];
  /** input type for updating data in table "gift_private" */
  ['gift_private_set_input']: GraphQLTypes['gift_private_set_input'];
  /** aggregate stddev on columns */
  ['gift_private_stddev_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['gift_private_stddev_pop_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['gift_private_stddev_samp_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate sum on columns */
  ['gift_private_sum_fields']: {
    gift_id?: ModelTypes['bigint'];
    recipient_id?: ModelTypes['bigint'];
    sender_id?: ModelTypes['bigint'];
  };
  /** aggregate var_pop on columns */
  ['gift_private_var_pop_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate var_samp on columns */
  ['gift_private_var_samp_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate variance on columns */
  ['gift_private_variance_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** columns and relationships of "histories" */
  ['histories']: {
    bio?: string;
    /** An object relationship */
    circle?: ModelTypes['circles'];
    circle_id: number;
    created_at?: ModelTypes['timestamp'];
    /** An object relationship */
    epoch?: ModelTypes['epochs'];
    epoch_id: number;
    id: ModelTypes['bigint'];
    updated_at?: ModelTypes['timestamp'];
    /** An object relationship */
    user?: ModelTypes['users'];
    user_id: number;
  };
  /** aggregated selection of "histories" */
  ['histories_aggregate']: {
    aggregate?: ModelTypes['histories_aggregate_fields'];
    nodes: ModelTypes['histories'][];
  };
  /** aggregate fields of "histories" */
  ['histories_aggregate_fields']: {
    avg?: ModelTypes['histories_avg_fields'];
    count: number;
    max?: ModelTypes['histories_max_fields'];
    min?: ModelTypes['histories_min_fields'];
    stddev?: ModelTypes['histories_stddev_fields'];
    stddev_pop?: ModelTypes['histories_stddev_pop_fields'];
    stddev_samp?: ModelTypes['histories_stddev_samp_fields'];
    sum?: ModelTypes['histories_sum_fields'];
    var_pop?: ModelTypes['histories_var_pop_fields'];
    var_samp?: ModelTypes['histories_var_samp_fields'];
    variance?: ModelTypes['histories_variance_fields'];
  };
  /** aggregate avg on columns */
  ['histories_avg_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** Boolean expression to filter rows from the table "histories". All fields are combined with a logical 'AND'. */
  ['histories_bool_exp']: GraphQLTypes['histories_bool_exp'];
  /** unique or primary key constraints on table "histories" */
  ['histories_constraint']: GraphQLTypes['histories_constraint'];
  /** input type for incrementing numeric columns in table "histories" */
  ['histories_inc_input']: GraphQLTypes['histories_inc_input'];
  /** input type for inserting data into table "histories" */
  ['histories_insert_input']: GraphQLTypes['histories_insert_input'];
  /** aggregate max on columns */
  ['histories_max_fields']: {
    bio?: string;
    circle_id?: number;
    created_at?: ModelTypes['timestamp'];
    epoch_id?: number;
    id?: ModelTypes['bigint'];
    updated_at?: ModelTypes['timestamp'];
    user_id?: number;
  };
  /** aggregate min on columns */
  ['histories_min_fields']: {
    bio?: string;
    circle_id?: number;
    created_at?: ModelTypes['timestamp'];
    epoch_id?: number;
    id?: ModelTypes['bigint'];
    updated_at?: ModelTypes['timestamp'];
    user_id?: number;
  };
  /** response of any mutation on the table "histories" */
  ['histories_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['histories'][];
  };
  /** on conflict condition type for table "histories" */
  ['histories_on_conflict']: GraphQLTypes['histories_on_conflict'];
  /** Ordering options when selecting data from "histories". */
  ['histories_order_by']: GraphQLTypes['histories_order_by'];
  /** primary key columns input for table: histories */
  ['histories_pk_columns_input']: GraphQLTypes['histories_pk_columns_input'];
  /** select columns of table "histories" */
  ['histories_select_column']: GraphQLTypes['histories_select_column'];
  /** input type for updating data in table "histories" */
  ['histories_set_input']: GraphQLTypes['histories_set_input'];
  /** aggregate stddev on columns */
  ['histories_stddev_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['histories_stddev_pop_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['histories_stddev_samp_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** aggregate sum on columns */
  ['histories_sum_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: ModelTypes['bigint'];
    user_id?: number;
  };
  /** update columns of table "histories" */
  ['histories_update_column']: GraphQLTypes['histories_update_column'];
  /** aggregate var_pop on columns */
  ['histories_var_pop_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** aggregate var_samp on columns */
  ['histories_var_samp_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** aggregate variance on columns */
  ['histories_variance_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
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
    /** delete data from the table: "burns" */
    delete_burns?: ModelTypes['burns_mutation_response'];
    /** delete single row from the table: "burns" */
    delete_burns_by_pk?: ModelTypes['burns'];
    /** delete data from the table: "circle_integrations" */
    delete_circle_integrations?: ModelTypes['circle_integrations_mutation_response'];
    /** delete single row from the table: "circle_integrations" */
    delete_circle_integrations_by_pk?: ModelTypes['circle_integrations'];
    /** delete data from the table: "circle_metadata" */
    delete_circle_metadata?: ModelTypes['circle_metadata_mutation_response'];
    /** delete single row from the table: "circle_metadata" */
    delete_circle_metadata_by_pk?: ModelTypes['circle_metadata'];
    /** delete data from the table: "circle_private" */
    delete_circle_private?: ModelTypes['circle_private_mutation_response'];
    /** delete data from the table: "circles" */
    delete_circles?: ModelTypes['circles_mutation_response'];
    /** delete single row from the table: "circles" */
    delete_circles_by_pk?: ModelTypes['circles'];
    /** delete data from the table: "claims" */
    delete_claims?: ModelTypes['claims_mutation_response'];
    /** delete single row from the table: "claims" */
    delete_claims_by_pk?: ModelTypes['claims'];
    /** delete data from the table: "distributions" */
    delete_distributions?: ModelTypes['distributions_mutation_response'];
    /** delete single row from the table: "distributions" */
    delete_distributions_by_pk?: ModelTypes['distributions'];
    /** delete data from the table: "epoches" */
    delete_epochs?: ModelTypes['epochs_mutation_response'];
    /** delete single row from the table: "epoches" */
    delete_epochs_by_pk?: ModelTypes['epochs'];
    /** delete data from the table: "gift_private" */
    delete_gift_private?: ModelTypes['gift_private_mutation_response'];
    /** delete data from the table: "histories" */
    delete_histories?: ModelTypes['histories_mutation_response'];
    /** delete single row from the table: "histories" */
    delete_histories_by_pk?: ModelTypes['histories'];
    /** delete data from the table: "nominees" */
    delete_nominees?: ModelTypes['nominees_mutation_response'];
    /** delete single row from the table: "nominees" */
    delete_nominees_by_pk?: ModelTypes['nominees'];
    /** delete data from the table: "protocols" */
    delete_organizations?: ModelTypes['organizations_mutation_response'];
    /** delete single row from the table: "protocols" */
    delete_organizations_by_pk?: ModelTypes['organizations'];
    /** delete data from the table: "pending_gift_private" */
    delete_pending_gift_private?: ModelTypes['pending_gift_private_mutation_response'];
    /** delete data from the table: "pending_token_gifts" */
    delete_pending_token_gifts?: ModelTypes['pending_token_gifts_mutation_response'];
    /** delete single row from the table: "pending_token_gifts" */
    delete_pending_token_gifts_by_pk?: ModelTypes['pending_token_gifts'];
    /** delete data from the table: "personal_access_tokens" */
    delete_personal_access_tokens?: ModelTypes['personal_access_tokens_mutation_response'];
    /** delete single row from the table: "personal_access_tokens" */
    delete_personal_access_tokens_by_pk?: ModelTypes['personal_access_tokens'];
    /** delete data from the table: "profiles" */
    delete_profiles?: ModelTypes['profiles_mutation_response'];
    /** delete single row from the table: "profiles" */
    delete_profiles_by_pk?: ModelTypes['profiles'];
    /** delete data from the table: "teammates" */
    delete_teammates?: ModelTypes['teammates_mutation_response'];
    /** delete single row from the table: "teammates" */
    delete_teammates_by_pk?: ModelTypes['teammates'];
    /** delete data from the table: "token_gifts" */
    delete_token_gifts?: ModelTypes['token_gifts_mutation_response'];
    /** delete single row from the table: "token_gifts" */
    delete_token_gifts_by_pk?: ModelTypes['token_gifts'];
    /** delete data from the table: "users" */
    delete_users?: ModelTypes['users_mutation_response'];
    /** delete single row from the table: "users" */
    delete_users_by_pk?: ModelTypes['users'];
    /** delete data from the table: "vault_transactions" */
    delete_vault_transactions?: ModelTypes['vault_transactions_mutation_response'];
    /** delete single row from the table: "vault_transactions" */
    delete_vault_transactions_by_pk?: ModelTypes['vault_transactions'];
    /** delete data from the table: "vaults" */
    delete_vaults?: ModelTypes['vaults_mutation_response'];
    /** delete single row from the table: "vaults" */
    delete_vaults_by_pk?: ModelTypes['vaults'];
    /** delete data from the table: "vouches" */
    delete_vouches?: ModelTypes['vouches_mutation_response'];
    /** delete single row from the table: "vouches" */
    delete_vouches_by_pk?: ModelTypes['vouches'];
    /** insert data into the table: "burns" */
    insert_burns?: ModelTypes['burns_mutation_response'];
    /** insert a single row into the table: "burns" */
    insert_burns_one?: ModelTypes['burns'];
    /** insert data into the table: "circle_integrations" */
    insert_circle_integrations?: ModelTypes['circle_integrations_mutation_response'];
    /** insert a single row into the table: "circle_integrations" */
    insert_circle_integrations_one?: ModelTypes['circle_integrations'];
    /** insert data into the table: "circle_metadata" */
    insert_circle_metadata?: ModelTypes['circle_metadata_mutation_response'];
    /** insert a single row into the table: "circle_metadata" */
    insert_circle_metadata_one?: ModelTypes['circle_metadata'];
    /** insert data into the table: "circle_private" */
    insert_circle_private?: ModelTypes['circle_private_mutation_response'];
    /** insert a single row into the table: "circle_private" */
    insert_circle_private_one?: ModelTypes['circle_private'];
    /** insert data into the table: "circles" */
    insert_circles?: ModelTypes['circles_mutation_response'];
    /** insert a single row into the table: "circles" */
    insert_circles_one?: ModelTypes['circles'];
    /** insert data into the table: "claims" */
    insert_claims?: ModelTypes['claims_mutation_response'];
    /** insert a single row into the table: "claims" */
    insert_claims_one?: ModelTypes['claims'];
    /** insert data into the table: "distributions" */
    insert_distributions?: ModelTypes['distributions_mutation_response'];
    /** insert a single row into the table: "distributions" */
    insert_distributions_one?: ModelTypes['distributions'];
    /** insert data into the table: "epoches" */
    insert_epochs?: ModelTypes['epochs_mutation_response'];
    /** insert a single row into the table: "epoches" */
    insert_epochs_one?: ModelTypes['epochs'];
    /** insert data into the table: "gift_private" */
    insert_gift_private?: ModelTypes['gift_private_mutation_response'];
    /** insert a single row into the table: "gift_private" */
    insert_gift_private_one?: ModelTypes['gift_private'];
    /** insert data into the table: "histories" */
    insert_histories?: ModelTypes['histories_mutation_response'];
    /** insert a single row into the table: "histories" */
    insert_histories_one?: ModelTypes['histories'];
    /** insert data into the table: "nominees" */
    insert_nominees?: ModelTypes['nominees_mutation_response'];
    /** insert a single row into the table: "nominees" */
    insert_nominees_one?: ModelTypes['nominees'];
    /** insert data into the table: "protocols" */
    insert_organizations?: ModelTypes['organizations_mutation_response'];
    /** insert a single row into the table: "protocols" */
    insert_organizations_one?: ModelTypes['organizations'];
    /** insert data into the table: "pending_gift_private" */
    insert_pending_gift_private?: ModelTypes['pending_gift_private_mutation_response'];
    /** insert a single row into the table: "pending_gift_private" */
    insert_pending_gift_private_one?: ModelTypes['pending_gift_private'];
    /** insert data into the table: "pending_token_gifts" */
    insert_pending_token_gifts?: ModelTypes['pending_token_gifts_mutation_response'];
    /** insert a single row into the table: "pending_token_gifts" */
    insert_pending_token_gifts_one?: ModelTypes['pending_token_gifts'];
    /** insert data into the table: "personal_access_tokens" */
    insert_personal_access_tokens?: ModelTypes['personal_access_tokens_mutation_response'];
    /** insert a single row into the table: "personal_access_tokens" */
    insert_personal_access_tokens_one?: ModelTypes['personal_access_tokens'];
    /** insert data into the table: "profiles" */
    insert_profiles?: ModelTypes['profiles_mutation_response'];
    /** insert a single row into the table: "profiles" */
    insert_profiles_one?: ModelTypes['profiles'];
    /** insert data into the table: "teammates" */
    insert_teammates?: ModelTypes['teammates_mutation_response'];
    /** insert a single row into the table: "teammates" */
    insert_teammates_one?: ModelTypes['teammates'];
    /** insert data into the table: "token_gifts" */
    insert_token_gifts?: ModelTypes['token_gifts_mutation_response'];
    /** insert a single row into the table: "token_gifts" */
    insert_token_gifts_one?: ModelTypes['token_gifts'];
    /** insert data into the table: "users" */
    insert_users?: ModelTypes['users_mutation_response'];
    /** insert a single row into the table: "users" */
    insert_users_one?: ModelTypes['users'];
    /** insert data into the table: "vault_transactions" */
    insert_vault_transactions?: ModelTypes['vault_transactions_mutation_response'];
    /** insert a single row into the table: "vault_transactions" */
    insert_vault_transactions_one?: ModelTypes['vault_transactions'];
    /** insert data into the table: "vaults" */
    insert_vaults?: ModelTypes['vaults_mutation_response'];
    /** insert a single row into the table: "vaults" */
    insert_vaults_one?: ModelTypes['vaults'];
    /** insert data into the table: "vouches" */
    insert_vouches?: ModelTypes['vouches_mutation_response'];
    /** insert a single row into the table: "vouches" */
    insert_vouches_one?: ModelTypes['vouches'];
    logoutUser?: ModelTypes['LogoutResponse'];
    updateAllocations?: ModelTypes['AllocationsResponse'];
    updateCircle?: ModelTypes['UpdateCircleOutput'];
    updateEpoch?: ModelTypes['EpochResponse'];
    updateTeammates?: ModelTypes['UpdateTeammatesResponse'];
    /** Update own user */
    updateUser?: ModelTypes['UserResponse'];
    /** update data of the table: "burns" */
    update_burns?: ModelTypes['burns_mutation_response'];
    /** update single row of the table: "burns" */
    update_burns_by_pk?: ModelTypes['burns'];
    /** update data of the table: "circle_integrations" */
    update_circle_integrations?: ModelTypes['circle_integrations_mutation_response'];
    /** update single row of the table: "circle_integrations" */
    update_circle_integrations_by_pk?: ModelTypes['circle_integrations'];
    /** update data of the table: "circle_metadata" */
    update_circle_metadata?: ModelTypes['circle_metadata_mutation_response'];
    /** update single row of the table: "circle_metadata" */
    update_circle_metadata_by_pk?: ModelTypes['circle_metadata'];
    /** update data of the table: "circle_private" */
    update_circle_private?: ModelTypes['circle_private_mutation_response'];
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
    /** update data of the table: "epoches" */
    update_epochs?: ModelTypes['epochs_mutation_response'];
    /** update single row of the table: "epoches" */
    update_epochs_by_pk?: ModelTypes['epochs'];
    /** update data of the table: "gift_private" */
    update_gift_private?: ModelTypes['gift_private_mutation_response'];
    /** update data of the table: "histories" */
    update_histories?: ModelTypes['histories_mutation_response'];
    /** update single row of the table: "histories" */
    update_histories_by_pk?: ModelTypes['histories'];
    /** update data of the table: "nominees" */
    update_nominees?: ModelTypes['nominees_mutation_response'];
    /** update single row of the table: "nominees" */
    update_nominees_by_pk?: ModelTypes['nominees'];
    /** update data of the table: "protocols" */
    update_organizations?: ModelTypes['organizations_mutation_response'];
    /** update single row of the table: "protocols" */
    update_organizations_by_pk?: ModelTypes['organizations'];
    /** update data of the table: "pending_gift_private" */
    update_pending_gift_private?: ModelTypes['pending_gift_private_mutation_response'];
    /** update data of the table: "pending_token_gifts" */
    update_pending_token_gifts?: ModelTypes['pending_token_gifts_mutation_response'];
    /** update single row of the table: "pending_token_gifts" */
    update_pending_token_gifts_by_pk?: ModelTypes['pending_token_gifts'];
    /** update data of the table: "personal_access_tokens" */
    update_personal_access_tokens?: ModelTypes['personal_access_tokens_mutation_response'];
    /** update single row of the table: "personal_access_tokens" */
    update_personal_access_tokens_by_pk?: ModelTypes['personal_access_tokens'];
    /** update data of the table: "profiles" */
    update_profiles?: ModelTypes['profiles_mutation_response'];
    /** update single row of the table: "profiles" */
    update_profiles_by_pk?: ModelTypes['profiles'];
    /** update data of the table: "teammates" */
    update_teammates?: ModelTypes['teammates_mutation_response'];
    /** update single row of the table: "teammates" */
    update_teammates_by_pk?: ModelTypes['teammates'];
    /** update data of the table: "token_gifts" */
    update_token_gifts?: ModelTypes['token_gifts_mutation_response'];
    /** update single row of the table: "token_gifts" */
    update_token_gifts_by_pk?: ModelTypes['token_gifts'];
    /** update data of the table: "users" */
    update_users?: ModelTypes['users_mutation_response'];
    /** update single row of the table: "users" */
    update_users_by_pk?: ModelTypes['users'];
    /** update data of the table: "vault_transactions" */
    update_vault_transactions?: ModelTypes['vault_transactions_mutation_response'];
    /** update single row of the table: "vault_transactions" */
    update_vault_transactions_by_pk?: ModelTypes['vault_transactions'];
    /** update data of the table: "vaults" */
    update_vaults?: ModelTypes['vaults_mutation_response'];
    /** update single row of the table: "vaults" */
    update_vaults_by_pk?: ModelTypes['vaults'];
    /** update data of the table: "vouches" */
    update_vouches?: ModelTypes['vouches_mutation_response'];
    /** update single row of the table: "vouches" */
    update_vouches_by_pk?: ModelTypes['vouches'];
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
    /** An aggregate relationship */
    nominations_aggregate: ModelTypes['vouches_aggregate'];
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
  /** input type for inserting array relation for remote table "nominees" */
  ['nominees_arr_rel_insert_input']: GraphQLTypes['nominees_arr_rel_insert_input'];
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
  /** unique or primary key constraints on table "nominees" */
  ['nominees_constraint']: GraphQLTypes['nominees_constraint'];
  /** input type for incrementing numeric columns in table "nominees" */
  ['nominees_inc_input']: GraphQLTypes['nominees_inc_input'];
  /** input type for inserting data into table "nominees" */
  ['nominees_insert_input']: GraphQLTypes['nominees_insert_input'];
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
  /** response of any mutation on the table "nominees" */
  ['nominees_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['nominees'][];
  };
  /** input type for inserting object relation for remote table "nominees" */
  ['nominees_obj_rel_insert_input']: GraphQLTypes['nominees_obj_rel_insert_input'];
  /** on conflict condition type for table "nominees" */
  ['nominees_on_conflict']: GraphQLTypes['nominees_on_conflict'];
  /** Ordering options when selecting data from "nominees". */
  ['nominees_order_by']: GraphQLTypes['nominees_order_by'];
  /** primary key columns input for table: nominees */
  ['nominees_pk_columns_input']: GraphQLTypes['nominees_pk_columns_input'];
  /** select columns of table "nominees" */
  ['nominees_select_column']: GraphQLTypes['nominees_select_column'];
  /** input type for updating data in table "nominees" */
  ['nominees_set_input']: GraphQLTypes['nominees_set_input'];
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
  /** update columns of table "nominees" */
  ['nominees_update_column']: GraphQLTypes['nominees_update_column'];
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
    /** An aggregate relationship */
    circles_aggregate: ModelTypes['circles_aggregate'];
    created_at?: ModelTypes['timestamp'];
    id: ModelTypes['bigint'];
    is_verified: boolean;
    name: string;
    telegram_id?: string;
    updated_at?: ModelTypes['timestamp'];
  };
  /** aggregated selection of "protocols" */
  ['organizations_aggregate']: {
    aggregate?: ModelTypes['organizations_aggregate_fields'];
    nodes: ModelTypes['organizations'][];
  };
  /** aggregate fields of "protocols" */
  ['organizations_aggregate_fields']: {
    avg?: ModelTypes['organizations_avg_fields'];
    count: number;
    max?: ModelTypes['organizations_max_fields'];
    min?: ModelTypes['organizations_min_fields'];
    stddev?: ModelTypes['organizations_stddev_fields'];
    stddev_pop?: ModelTypes['organizations_stddev_pop_fields'];
    stddev_samp?: ModelTypes['organizations_stddev_samp_fields'];
    sum?: ModelTypes['organizations_sum_fields'];
    var_pop?: ModelTypes['organizations_var_pop_fields'];
    var_samp?: ModelTypes['organizations_var_samp_fields'];
    variance?: ModelTypes['organizations_variance_fields'];
  };
  /** aggregate avg on columns */
  ['organizations_avg_fields']: {
    id?: number;
  };
  /** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
  ['organizations_bool_exp']: GraphQLTypes['organizations_bool_exp'];
  /** unique or primary key constraints on table "protocols" */
  ['organizations_constraint']: GraphQLTypes['organizations_constraint'];
  /** input type for incrementing numeric columns in table "protocols" */
  ['organizations_inc_input']: GraphQLTypes['organizations_inc_input'];
  /** input type for inserting data into table "protocols" */
  ['organizations_insert_input']: GraphQLTypes['organizations_insert_input'];
  /** aggregate max on columns */
  ['organizations_max_fields']: {
    created_at?: ModelTypes['timestamp'];
    id?: ModelTypes['bigint'];
    name?: string;
    telegram_id?: string;
    updated_at?: ModelTypes['timestamp'];
  };
  /** aggregate min on columns */
  ['organizations_min_fields']: {
    created_at?: ModelTypes['timestamp'];
    id?: ModelTypes['bigint'];
    name?: string;
    telegram_id?: string;
    updated_at?: ModelTypes['timestamp'];
  };
  /** response of any mutation on the table "protocols" */
  ['organizations_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['organizations'][];
  };
  /** input type for inserting object relation for remote table "protocols" */
  ['organizations_obj_rel_insert_input']: GraphQLTypes['organizations_obj_rel_insert_input'];
  /** on conflict condition type for table "protocols" */
  ['organizations_on_conflict']: GraphQLTypes['organizations_on_conflict'];
  /** Ordering options when selecting data from "protocols". */
  ['organizations_order_by']: GraphQLTypes['organizations_order_by'];
  /** primary key columns input for table: organizations */
  ['organizations_pk_columns_input']: GraphQLTypes['organizations_pk_columns_input'];
  /** select columns of table "protocols" */
  ['organizations_select_column']: GraphQLTypes['organizations_select_column'];
  /** input type for updating data in table "protocols" */
  ['organizations_set_input']: GraphQLTypes['organizations_set_input'];
  /** aggregate stddev on columns */
  ['organizations_stddev_fields']: {
    id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['organizations_stddev_pop_fields']: {
    id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['organizations_stddev_samp_fields']: {
    id?: number;
  };
  /** aggregate sum on columns */
  ['organizations_sum_fields']: {
    id?: ModelTypes['bigint'];
  };
  /** update columns of table "protocols" */
  ['organizations_update_column']: GraphQLTypes['organizations_update_column'];
  /** aggregate var_pop on columns */
  ['organizations_var_pop_fields']: {
    id?: number;
  };
  /** aggregate var_samp on columns */
  ['organizations_var_samp_fields']: {
    id?: number;
  };
  /** aggregate variance on columns */
  ['organizations_variance_fields']: {
    id?: number;
  };
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
  /** aggregated selection of "pending_gift_private" */
  ['pending_gift_private_aggregate']: {
    aggregate?: ModelTypes['pending_gift_private_aggregate_fields'];
    nodes: ModelTypes['pending_gift_private'][];
  };
  /** aggregate fields of "pending_gift_private" */
  ['pending_gift_private_aggregate_fields']: {
    avg?: ModelTypes['pending_gift_private_avg_fields'];
    count: number;
    max?: ModelTypes['pending_gift_private_max_fields'];
    min?: ModelTypes['pending_gift_private_min_fields'];
    stddev?: ModelTypes['pending_gift_private_stddev_fields'];
    stddev_pop?: ModelTypes['pending_gift_private_stddev_pop_fields'];
    stddev_samp?: ModelTypes['pending_gift_private_stddev_samp_fields'];
    sum?: ModelTypes['pending_gift_private_sum_fields'];
    var_pop?: ModelTypes['pending_gift_private_var_pop_fields'];
    var_samp?: ModelTypes['pending_gift_private_var_samp_fields'];
    variance?: ModelTypes['pending_gift_private_variance_fields'];
  };
  /** aggregate avg on columns */
  ['pending_gift_private_avg_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** Boolean expression to filter rows from the table "pending_gift_private". All fields are combined with a logical 'AND'. */
  ['pending_gift_private_bool_exp']: GraphQLTypes['pending_gift_private_bool_exp'];
  /** input type for incrementing numeric columns in table "pending_gift_private" */
  ['pending_gift_private_inc_input']: GraphQLTypes['pending_gift_private_inc_input'];
  /** input type for inserting data into table "pending_gift_private" */
  ['pending_gift_private_insert_input']: GraphQLTypes['pending_gift_private_insert_input'];
  /** aggregate max on columns */
  ['pending_gift_private_max_fields']: {
    gift_id?: ModelTypes['bigint'];
    note?: string;
    recipient_id?: ModelTypes['bigint'];
    sender_id?: ModelTypes['bigint'];
  };
  /** aggregate min on columns */
  ['pending_gift_private_min_fields']: {
    gift_id?: ModelTypes['bigint'];
    note?: string;
    recipient_id?: ModelTypes['bigint'];
    sender_id?: ModelTypes['bigint'];
  };
  /** response of any mutation on the table "pending_gift_private" */
  ['pending_gift_private_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['pending_gift_private'][];
  };
  /** input type for inserting object relation for remote table "pending_gift_private" */
  ['pending_gift_private_obj_rel_insert_input']: GraphQLTypes['pending_gift_private_obj_rel_insert_input'];
  /** Ordering options when selecting data from "pending_gift_private". */
  ['pending_gift_private_order_by']: GraphQLTypes['pending_gift_private_order_by'];
  /** select columns of table "pending_gift_private" */
  ['pending_gift_private_select_column']: GraphQLTypes['pending_gift_private_select_column'];
  /** input type for updating data in table "pending_gift_private" */
  ['pending_gift_private_set_input']: GraphQLTypes['pending_gift_private_set_input'];
  /** aggregate stddev on columns */
  ['pending_gift_private_stddev_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['pending_gift_private_stddev_pop_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['pending_gift_private_stddev_samp_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate sum on columns */
  ['pending_gift_private_sum_fields']: {
    gift_id?: ModelTypes['bigint'];
    recipient_id?: ModelTypes['bigint'];
    sender_id?: ModelTypes['bigint'];
  };
  /** aggregate var_pop on columns */
  ['pending_gift_private_var_pop_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate var_samp on columns */
  ['pending_gift_private_var_samp_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate variance on columns */
  ['pending_gift_private_variance_fields']: {
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
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
    note?: string;
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
  /** aggregated selection of "pending_token_gifts" */
  ['pending_token_gifts_aggregate']: {
    aggregate?: ModelTypes['pending_token_gifts_aggregate_fields'];
    nodes: ModelTypes['pending_token_gifts'][];
  };
  /** aggregate fields of "pending_token_gifts" */
  ['pending_token_gifts_aggregate_fields']: {
    avg?: ModelTypes['pending_token_gifts_avg_fields'];
    count: number;
    max?: ModelTypes['pending_token_gifts_max_fields'];
    min?: ModelTypes['pending_token_gifts_min_fields'];
    stddev?: ModelTypes['pending_token_gifts_stddev_fields'];
    stddev_pop?: ModelTypes['pending_token_gifts_stddev_pop_fields'];
    stddev_samp?: ModelTypes['pending_token_gifts_stddev_samp_fields'];
    sum?: ModelTypes['pending_token_gifts_sum_fields'];
    var_pop?: ModelTypes['pending_token_gifts_var_pop_fields'];
    var_samp?: ModelTypes['pending_token_gifts_var_samp_fields'];
    variance?: ModelTypes['pending_token_gifts_variance_fields'];
  };
  /** order by aggregate values of table "pending_token_gifts" */
  ['pending_token_gifts_aggregate_order_by']: GraphQLTypes['pending_token_gifts_aggregate_order_by'];
  /** input type for inserting array relation for remote table "pending_token_gifts" */
  ['pending_token_gifts_arr_rel_insert_input']: GraphQLTypes['pending_token_gifts_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['pending_token_gifts_avg_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by avg() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_avg_order_by']: GraphQLTypes['pending_token_gifts_avg_order_by'];
  /** Boolean expression to filter rows from the table "pending_token_gifts". All fields are combined with a logical 'AND'. */
  ['pending_token_gifts_bool_exp']: GraphQLTypes['pending_token_gifts_bool_exp'];
  /** unique or primary key constraints on table "pending_token_gifts" */
  ['pending_token_gifts_constraint']: GraphQLTypes['pending_token_gifts_constraint'];
  /** input type for incrementing numeric columns in table "pending_token_gifts" */
  ['pending_token_gifts_inc_input']: GraphQLTypes['pending_token_gifts_inc_input'];
  /** input type for inserting data into table "pending_token_gifts" */
  ['pending_token_gifts_insert_input']: GraphQLTypes['pending_token_gifts_insert_input'];
  /** aggregate max on columns */
  ['pending_token_gifts_max_fields']: {
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    dts_created?: ModelTypes['timestamp'];
    epoch_id?: number;
    id?: ModelTypes['bigint'];
    note?: string;
    recipient_address?: string;
    recipient_id?: ModelTypes['bigint'];
    sender_address?: string;
    sender_id?: ModelTypes['bigint'];
    tokens?: number;
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by max() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_max_order_by']: GraphQLTypes['pending_token_gifts_max_order_by'];
  /** aggregate min on columns */
  ['pending_token_gifts_min_fields']: {
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    dts_created?: ModelTypes['timestamp'];
    epoch_id?: number;
    id?: ModelTypes['bigint'];
    note?: string;
    recipient_address?: string;
    recipient_id?: ModelTypes['bigint'];
    sender_address?: string;
    sender_id?: ModelTypes['bigint'];
    tokens?: number;
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by min() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_min_order_by']: GraphQLTypes['pending_token_gifts_min_order_by'];
  /** response of any mutation on the table "pending_token_gifts" */
  ['pending_token_gifts_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['pending_token_gifts'][];
  };
  /** on conflict condition type for table "pending_token_gifts" */
  ['pending_token_gifts_on_conflict']: GraphQLTypes['pending_token_gifts_on_conflict'];
  /** Ordering options when selecting data from "pending_token_gifts". */
  ['pending_token_gifts_order_by']: GraphQLTypes['pending_token_gifts_order_by'];
  /** primary key columns input for table: pending_token_gifts */
  ['pending_token_gifts_pk_columns_input']: GraphQLTypes['pending_token_gifts_pk_columns_input'];
  /** select columns of table "pending_token_gifts" */
  ['pending_token_gifts_select_column']: GraphQLTypes['pending_token_gifts_select_column'];
  /** input type for updating data in table "pending_token_gifts" */
  ['pending_token_gifts_set_input']: GraphQLTypes['pending_token_gifts_set_input'];
  /** aggregate stddev on columns */
  ['pending_token_gifts_stddev_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by stddev() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_order_by']: GraphQLTypes['pending_token_gifts_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['pending_token_gifts_stddev_pop_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by stddev_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_pop_order_by']: GraphQLTypes['pending_token_gifts_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['pending_token_gifts_stddev_samp_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by stddev_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_samp_order_by']: GraphQLTypes['pending_token_gifts_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['pending_token_gifts_sum_fields']: {
    circle_id?: ModelTypes['bigint'];
    epoch_id?: number;
    id?: ModelTypes['bigint'];
    recipient_id?: ModelTypes['bigint'];
    sender_id?: ModelTypes['bigint'];
    tokens?: number;
  };
  /** order by sum() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_sum_order_by']: GraphQLTypes['pending_token_gifts_sum_order_by'];
  /** update columns of table "pending_token_gifts" */
  ['pending_token_gifts_update_column']: GraphQLTypes['pending_token_gifts_update_column'];
  /** aggregate var_pop on columns */
  ['pending_token_gifts_var_pop_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by var_pop() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_pop_order_by']: GraphQLTypes['pending_token_gifts_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['pending_token_gifts_var_samp_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by var_samp() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_var_samp_order_by']: GraphQLTypes['pending_token_gifts_var_samp_order_by'];
  /** aggregate variance on columns */
  ['pending_token_gifts_variance_fields']: {
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by variance() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_variance_order_by']: GraphQLTypes['pending_token_gifts_variance_order_by'];
  /** columns and relationships of "personal_access_tokens" */
  ['personal_access_tokens']: {
    abilities?: string;
    created_at?: ModelTypes['timestamp'];
    id: ModelTypes['bigint'];
    last_used_at?: ModelTypes['timestamp'];
    name: string;
    /** An object relationship */
    profile?: ModelTypes['profiles'];
    token: string;
    tokenable_id: ModelTypes['bigint'];
    tokenable_type: string;
    updated_at?: ModelTypes['timestamp'];
  };
  /** aggregated selection of "personal_access_tokens" */
  ['personal_access_tokens_aggregate']: {
    aggregate?: ModelTypes['personal_access_tokens_aggregate_fields'];
    nodes: ModelTypes['personal_access_tokens'][];
  };
  /** aggregate fields of "personal_access_tokens" */
  ['personal_access_tokens_aggregate_fields']: {
    avg?: ModelTypes['personal_access_tokens_avg_fields'];
    count: number;
    max?: ModelTypes['personal_access_tokens_max_fields'];
    min?: ModelTypes['personal_access_tokens_min_fields'];
    stddev?: ModelTypes['personal_access_tokens_stddev_fields'];
    stddev_pop?: ModelTypes['personal_access_tokens_stddev_pop_fields'];
    stddev_samp?: ModelTypes['personal_access_tokens_stddev_samp_fields'];
    sum?: ModelTypes['personal_access_tokens_sum_fields'];
    var_pop?: ModelTypes['personal_access_tokens_var_pop_fields'];
    var_samp?: ModelTypes['personal_access_tokens_var_samp_fields'];
    variance?: ModelTypes['personal_access_tokens_variance_fields'];
  };
  /** aggregate avg on columns */
  ['personal_access_tokens_avg_fields']: {
    id?: number;
    tokenable_id?: number;
  };
  /** Boolean expression to filter rows from the table "personal_access_tokens". All fields are combined with a logical 'AND'. */
  ['personal_access_tokens_bool_exp']: GraphQLTypes['personal_access_tokens_bool_exp'];
  /** unique or primary key constraints on table "personal_access_tokens" */
  ['personal_access_tokens_constraint']: GraphQLTypes['personal_access_tokens_constraint'];
  /** input type for incrementing numeric columns in table "personal_access_tokens" */
  ['personal_access_tokens_inc_input']: GraphQLTypes['personal_access_tokens_inc_input'];
  /** input type for inserting data into table "personal_access_tokens" */
  ['personal_access_tokens_insert_input']: GraphQLTypes['personal_access_tokens_insert_input'];
  /** aggregate max on columns */
  ['personal_access_tokens_max_fields']: {
    abilities?: string;
    created_at?: ModelTypes['timestamp'];
    id?: ModelTypes['bigint'];
    last_used_at?: ModelTypes['timestamp'];
    name?: string;
    token?: string;
    tokenable_id?: ModelTypes['bigint'];
    tokenable_type?: string;
    updated_at?: ModelTypes['timestamp'];
  };
  /** aggregate min on columns */
  ['personal_access_tokens_min_fields']: {
    abilities?: string;
    created_at?: ModelTypes['timestamp'];
    id?: ModelTypes['bigint'];
    last_used_at?: ModelTypes['timestamp'];
    name?: string;
    token?: string;
    tokenable_id?: ModelTypes['bigint'];
    tokenable_type?: string;
    updated_at?: ModelTypes['timestamp'];
  };
  /** response of any mutation on the table "personal_access_tokens" */
  ['personal_access_tokens_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['personal_access_tokens'][];
  };
  /** on conflict condition type for table "personal_access_tokens" */
  ['personal_access_tokens_on_conflict']: GraphQLTypes['personal_access_tokens_on_conflict'];
  /** Ordering options when selecting data from "personal_access_tokens". */
  ['personal_access_tokens_order_by']: GraphQLTypes['personal_access_tokens_order_by'];
  /** primary key columns input for table: personal_access_tokens */
  ['personal_access_tokens_pk_columns_input']: GraphQLTypes['personal_access_tokens_pk_columns_input'];
  /** select columns of table "personal_access_tokens" */
  ['personal_access_tokens_select_column']: GraphQLTypes['personal_access_tokens_select_column'];
  /** input type for updating data in table "personal_access_tokens" */
  ['personal_access_tokens_set_input']: GraphQLTypes['personal_access_tokens_set_input'];
  /** aggregate stddev on columns */
  ['personal_access_tokens_stddev_fields']: {
    id?: number;
    tokenable_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['personal_access_tokens_stddev_pop_fields']: {
    id?: number;
    tokenable_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['personal_access_tokens_stddev_samp_fields']: {
    id?: number;
    tokenable_id?: number;
  };
  /** aggregate sum on columns */
  ['personal_access_tokens_sum_fields']: {
    id?: ModelTypes['bigint'];
    tokenable_id?: ModelTypes['bigint'];
  };
  /** update columns of table "personal_access_tokens" */
  ['personal_access_tokens_update_column']: GraphQLTypes['personal_access_tokens_update_column'];
  /** aggregate var_pop on columns */
  ['personal_access_tokens_var_pop_fields']: {
    id?: number;
    tokenable_id?: number;
  };
  /** aggregate var_samp on columns */
  ['personal_access_tokens_var_samp_fields']: {
    id?: number;
    tokenable_id?: number;
  };
  /** aggregate variance on columns */
  ['personal_access_tokens_variance_fields']: {
    id?: number;
    tokenable_id?: number;
  };
  /** columns and relationships of "profiles" */
  ['profiles']: {
    address: string;
    admin_view: boolean;
    ann_power: boolean;
    avatar?: string;
    background?: string;
    bio?: string;
    chat_id?: string;
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
    /** An aggregate relationship */
    users_aggregate: ModelTypes['users_aggregate'];
    website?: string;
  };
  /** aggregated selection of "profiles" */
  ['profiles_aggregate']: {
    aggregate?: ModelTypes['profiles_aggregate_fields'];
    nodes: ModelTypes['profiles'][];
  };
  /** aggregate fields of "profiles" */
  ['profiles_aggregate_fields']: {
    avg?: ModelTypes['profiles_avg_fields'];
    count: number;
    max?: ModelTypes['profiles_max_fields'];
    min?: ModelTypes['profiles_min_fields'];
    stddev?: ModelTypes['profiles_stddev_fields'];
    stddev_pop?: ModelTypes['profiles_stddev_pop_fields'];
    stddev_samp?: ModelTypes['profiles_stddev_samp_fields'];
    sum?: ModelTypes['profiles_sum_fields'];
    var_pop?: ModelTypes['profiles_var_pop_fields'];
    var_samp?: ModelTypes['profiles_var_samp_fields'];
    variance?: ModelTypes['profiles_variance_fields'];
  };
  /** aggregate avg on columns */
  ['profiles_avg_fields']: {
    id?: number;
  };
  /** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
  ['profiles_bool_exp']: GraphQLTypes['profiles_bool_exp'];
  /** unique or primary key constraints on table "profiles" */
  ['profiles_constraint']: GraphQLTypes['profiles_constraint'];
  /** input type for incrementing numeric columns in table "profiles" */
  ['profiles_inc_input']: GraphQLTypes['profiles_inc_input'];
  /** input type for inserting data into table "profiles" */
  ['profiles_insert_input']: GraphQLTypes['profiles_insert_input'];
  /** aggregate max on columns */
  ['profiles_max_fields']: {
    address?: string;
    avatar?: string;
    background?: string;
    bio?: string;
    chat_id?: string;
    created_at?: ModelTypes['timestamp'];
    discord_username?: string;
    github_username?: string;
    id?: ModelTypes['bigint'];
    medium_username?: string;
    skills?: string;
    telegram_username?: string;
    twitter_username?: string;
    updated_at?: ModelTypes['timestamp'];
    website?: string;
  };
  /** aggregate min on columns */
  ['profiles_min_fields']: {
    address?: string;
    avatar?: string;
    background?: string;
    bio?: string;
    chat_id?: string;
    created_at?: ModelTypes['timestamp'];
    discord_username?: string;
    github_username?: string;
    id?: ModelTypes['bigint'];
    medium_username?: string;
    skills?: string;
    telegram_username?: string;
    twitter_username?: string;
    updated_at?: ModelTypes['timestamp'];
    website?: string;
  };
  /** response of any mutation on the table "profiles" */
  ['profiles_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['profiles'][];
  };
  /** input type for inserting object relation for remote table "profiles" */
  ['profiles_obj_rel_insert_input']: GraphQLTypes['profiles_obj_rel_insert_input'];
  /** on conflict condition type for table "profiles" */
  ['profiles_on_conflict']: GraphQLTypes['profiles_on_conflict'];
  /** Ordering options when selecting data from "profiles". */
  ['profiles_order_by']: GraphQLTypes['profiles_order_by'];
  /** primary key columns input for table: profiles */
  ['profiles_pk_columns_input']: GraphQLTypes['profiles_pk_columns_input'];
  /** select columns of table "profiles" */
  ['profiles_select_column']: GraphQLTypes['profiles_select_column'];
  /** input type for updating data in table "profiles" */
  ['profiles_set_input']: GraphQLTypes['profiles_set_input'];
  /** aggregate stddev on columns */
  ['profiles_stddev_fields']: {
    id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['profiles_stddev_pop_fields']: {
    id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['profiles_stddev_samp_fields']: {
    id?: number;
  };
  /** aggregate sum on columns */
  ['profiles_sum_fields']: {
    id?: ModelTypes['bigint'];
  };
  /** update columns of table "profiles" */
  ['profiles_update_column']: GraphQLTypes['profiles_update_column'];
  /** aggregate var_pop on columns */
  ['profiles_var_pop_fields']: {
    id?: number;
  };
  /** aggregate var_samp on columns */
  ['profiles_var_samp_fields']: {
    id?: number;
  };
  /** aggregate variance on columns */
  ['profiles_variance_fields']: {
    id?: number;
  };
  ['query_root']: {
    /** An array relationship */
    burns: ModelTypes['burns'][];
    /** An aggregate relationship */
    burns_aggregate: ModelTypes['burns_aggregate'];
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: ModelTypes['burns'];
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: ModelTypes['circle_integrations'][];
    /** fetch aggregated fields from the table: "circle_integrations" */
    circle_integrations_aggregate: ModelTypes['circle_integrations_aggregate'];
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: ModelTypes['circle_integrations'];
    /** An array relationship */
    circle_metadata: ModelTypes['circle_metadata'][];
    /** An aggregate relationship */
    circle_metadata_aggregate: ModelTypes['circle_metadata_aggregate'];
    /** fetch data from the table: "circle_metadata" using primary key columns */
    circle_metadata_by_pk?: ModelTypes['circle_metadata'];
    /** fetch data from the table: "circle_private" */
    circle_private: ModelTypes['circle_private'][];
    /** fetch aggregated fields from the table: "circle_private" */
    circle_private_aggregate: ModelTypes['circle_private_aggregate'];
    /** An array relationship */
    circles: ModelTypes['circles'][];
    /** An aggregate relationship */
    circles_aggregate: ModelTypes['circles_aggregate'];
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: ModelTypes['circles'];
    /** fetch data from the table: "claims" */
    claims: ModelTypes['claims'][];
    /** An aggregate relationship */
    claims_aggregate: ModelTypes['claims_aggregate'];
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: ModelTypes['claims'];
    /** fetch data from the table: "distributions" */
    distributions: ModelTypes['distributions'][];
    /** fetch aggregated fields from the table: "distributions" */
    distributions_aggregate: ModelTypes['distributions_aggregate'];
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: ModelTypes['distributions'];
    /** An array relationship */
    epochs: ModelTypes['epochs'][];
    /** An aggregate relationship */
    epochs_aggregate: ModelTypes['epochs_aggregate'];
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: ModelTypes['epochs'];
    /** fetch data from the table: "gift_private" */
    gift_private: ModelTypes['gift_private'][];
    /** fetch aggregated fields from the table: "gift_private" */
    gift_private_aggregate: ModelTypes['gift_private_aggregate'];
    /** fetch data from the table: "histories" */
    histories: ModelTypes['histories'][];
    /** fetch aggregated fields from the table: "histories" */
    histories_aggregate: ModelTypes['histories_aggregate'];
    /** fetch data from the table: "histories" using primary key columns */
    histories_by_pk?: ModelTypes['histories'];
    /** An array relationship */
    nominees: ModelTypes['nominees'][];
    /** An aggregate relationship */
    nominees_aggregate: ModelTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: ModelTypes['nominees'];
    /** fetch data from the table: "protocols" */
    organizations: ModelTypes['organizations'][];
    /** fetch aggregated fields from the table: "protocols" */
    organizations_aggregate: ModelTypes['organizations_aggregate'];
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: ModelTypes['organizations'];
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: ModelTypes['pending_gift_private'][];
    /** fetch aggregated fields from the table: "pending_gift_private" */
    pending_gift_private_aggregate: ModelTypes['pending_gift_private_aggregate'];
    /** An array relationship */
    pending_token_gifts: ModelTypes['pending_token_gifts'][];
    /** An aggregate relationship */
    pending_token_gifts_aggregate: ModelTypes['pending_token_gifts_aggregate'];
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: ModelTypes['pending_token_gifts'];
    /** fetch data from the table: "personal_access_tokens" */
    personal_access_tokens: ModelTypes['personal_access_tokens'][];
    /** fetch aggregated fields from the table: "personal_access_tokens" */
    personal_access_tokens_aggregate: ModelTypes['personal_access_tokens_aggregate'];
    /** fetch data from the table: "personal_access_tokens" using primary key columns */
    personal_access_tokens_by_pk?: ModelTypes['personal_access_tokens'];
    /** fetch data from the table: "profiles" */
    profiles: ModelTypes['profiles'][];
    /** fetch aggregated fields from the table: "profiles" */
    profiles_aggregate: ModelTypes['profiles_aggregate'];
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: ModelTypes['profiles'];
    /** An array relationship */
    teammates: ModelTypes['teammates'][];
    /** An aggregate relationship */
    teammates_aggregate: ModelTypes['teammates_aggregate'];
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
    /** An aggregate relationship */
    users_aggregate: ModelTypes['users_aggregate'];
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: ModelTypes['users'];
    /** An array relationship */
    vault_transactions: ModelTypes['vault_transactions'][];
    /** An aggregate relationship */
    vault_transactions_aggregate: ModelTypes['vault_transactions_aggregate'];
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: ModelTypes['vault_transactions'];
    /** fetch data from the table: "vaults" */
    vaults: ModelTypes['vaults'][];
    /** fetch aggregated fields from the table: "vaults" */
    vaults_aggregate: ModelTypes['vaults_aggregate'];
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: ModelTypes['vaults'];
    /** fetch data from the table: "vouches" */
    vouches: ModelTypes['vouches'][];
    /** fetch aggregated fields from the table: "vouches" */
    vouches_aggregate: ModelTypes['vouches_aggregate'];
    /** fetch data from the table: "vouches" using primary key columns */
    vouches_by_pk?: ModelTypes['vouches'];
  };
  ['subscription_root']: {
    /** An array relationship */
    burns: ModelTypes['burns'][];
    /** An aggregate relationship */
    burns_aggregate: ModelTypes['burns_aggregate'];
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: ModelTypes['burns'];
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: ModelTypes['circle_integrations'][];
    /** fetch aggregated fields from the table: "circle_integrations" */
    circle_integrations_aggregate: ModelTypes['circle_integrations_aggregate'];
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: ModelTypes['circle_integrations'];
    /** An array relationship */
    circle_metadata: ModelTypes['circle_metadata'][];
    /** An aggregate relationship */
    circle_metadata_aggregate: ModelTypes['circle_metadata_aggregate'];
    /** fetch data from the table: "circle_metadata" using primary key columns */
    circle_metadata_by_pk?: ModelTypes['circle_metadata'];
    /** fetch data from the table: "circle_private" */
    circle_private: ModelTypes['circle_private'][];
    /** fetch aggregated fields from the table: "circle_private" */
    circle_private_aggregate: ModelTypes['circle_private_aggregate'];
    /** An array relationship */
    circles: ModelTypes['circles'][];
    /** An aggregate relationship */
    circles_aggregate: ModelTypes['circles_aggregate'];
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: ModelTypes['circles'];
    /** fetch data from the table: "claims" */
    claims: ModelTypes['claims'][];
    /** An aggregate relationship */
    claims_aggregate: ModelTypes['claims_aggregate'];
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: ModelTypes['claims'];
    /** fetch data from the table: "distributions" */
    distributions: ModelTypes['distributions'][];
    /** fetch aggregated fields from the table: "distributions" */
    distributions_aggregate: ModelTypes['distributions_aggregate'];
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: ModelTypes['distributions'];
    /** An array relationship */
    epochs: ModelTypes['epochs'][];
    /** An aggregate relationship */
    epochs_aggregate: ModelTypes['epochs_aggregate'];
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: ModelTypes['epochs'];
    /** fetch data from the table: "gift_private" */
    gift_private: ModelTypes['gift_private'][];
    /** fetch aggregated fields from the table: "gift_private" */
    gift_private_aggregate: ModelTypes['gift_private_aggregate'];
    /** fetch data from the table: "histories" */
    histories: ModelTypes['histories'][];
    /** fetch aggregated fields from the table: "histories" */
    histories_aggregate: ModelTypes['histories_aggregate'];
    /** fetch data from the table: "histories" using primary key columns */
    histories_by_pk?: ModelTypes['histories'];
    /** An array relationship */
    nominees: ModelTypes['nominees'][];
    /** An aggregate relationship */
    nominees_aggregate: ModelTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: ModelTypes['nominees'];
    /** fetch data from the table: "protocols" */
    organizations: ModelTypes['organizations'][];
    /** fetch aggregated fields from the table: "protocols" */
    organizations_aggregate: ModelTypes['organizations_aggregate'];
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: ModelTypes['organizations'];
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: ModelTypes['pending_gift_private'][];
    /** fetch aggregated fields from the table: "pending_gift_private" */
    pending_gift_private_aggregate: ModelTypes['pending_gift_private_aggregate'];
    /** An array relationship */
    pending_token_gifts: ModelTypes['pending_token_gifts'][];
    /** An aggregate relationship */
    pending_token_gifts_aggregate: ModelTypes['pending_token_gifts_aggregate'];
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: ModelTypes['pending_token_gifts'];
    /** fetch data from the table: "personal_access_tokens" */
    personal_access_tokens: ModelTypes['personal_access_tokens'][];
    /** fetch aggregated fields from the table: "personal_access_tokens" */
    personal_access_tokens_aggregate: ModelTypes['personal_access_tokens_aggregate'];
    /** fetch data from the table: "personal_access_tokens" using primary key columns */
    personal_access_tokens_by_pk?: ModelTypes['personal_access_tokens'];
    /** fetch data from the table: "profiles" */
    profiles: ModelTypes['profiles'][];
    /** fetch aggregated fields from the table: "profiles" */
    profiles_aggregate: ModelTypes['profiles_aggregate'];
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: ModelTypes['profiles'];
    /** An array relationship */
    teammates: ModelTypes['teammates'][];
    /** An aggregate relationship */
    teammates_aggregate: ModelTypes['teammates_aggregate'];
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
    /** An aggregate relationship */
    users_aggregate: ModelTypes['users_aggregate'];
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: ModelTypes['users'];
    /** An array relationship */
    vault_transactions: ModelTypes['vault_transactions'][];
    /** An aggregate relationship */
    vault_transactions_aggregate: ModelTypes['vault_transactions_aggregate'];
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: ModelTypes['vault_transactions'];
    /** fetch data from the table: "vaults" */
    vaults: ModelTypes['vaults'][];
    /** fetch aggregated fields from the table: "vaults" */
    vaults_aggregate: ModelTypes['vaults_aggregate'];
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: ModelTypes['vaults'];
    /** fetch data from the table: "vouches" */
    vouches: ModelTypes['vouches'][];
    /** fetch aggregated fields from the table: "vouches" */
    vouches_aggregate: ModelTypes['vouches_aggregate'];
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
  /** aggregated selection of "teammates" */
  ['teammates_aggregate']: {
    aggregate?: ModelTypes['teammates_aggregate_fields'];
    nodes: ModelTypes['teammates'][];
  };
  /** aggregate fields of "teammates" */
  ['teammates_aggregate_fields']: {
    avg?: ModelTypes['teammates_avg_fields'];
    count: number;
    max?: ModelTypes['teammates_max_fields'];
    min?: ModelTypes['teammates_min_fields'];
    stddev?: ModelTypes['teammates_stddev_fields'];
    stddev_pop?: ModelTypes['teammates_stddev_pop_fields'];
    stddev_samp?: ModelTypes['teammates_stddev_samp_fields'];
    sum?: ModelTypes['teammates_sum_fields'];
    var_pop?: ModelTypes['teammates_var_pop_fields'];
    var_samp?: ModelTypes['teammates_var_samp_fields'];
    variance?: ModelTypes['teammates_variance_fields'];
  };
  /** order by aggregate values of table "teammates" */
  ['teammates_aggregate_order_by']: GraphQLTypes['teammates_aggregate_order_by'];
  /** input type for inserting array relation for remote table "teammates" */
  ['teammates_arr_rel_insert_input']: GraphQLTypes['teammates_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['teammates_avg_fields']: {
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by avg() on columns of table "teammates" */
  ['teammates_avg_order_by']: GraphQLTypes['teammates_avg_order_by'];
  /** Boolean expression to filter rows from the table "teammates". All fields are combined with a logical 'AND'. */
  ['teammates_bool_exp']: GraphQLTypes['teammates_bool_exp'];
  /** unique or primary key constraints on table "teammates" */
  ['teammates_constraint']: GraphQLTypes['teammates_constraint'];
  /** input type for incrementing numeric columns in table "teammates" */
  ['teammates_inc_input']: GraphQLTypes['teammates_inc_input'];
  /** input type for inserting data into table "teammates" */
  ['teammates_insert_input']: GraphQLTypes['teammates_insert_input'];
  /** aggregate max on columns */
  ['teammates_max_fields']: {
    created_at?: ModelTypes['timestamp'];
    id?: ModelTypes['bigint'];
    team_mate_id?: number;
    updated_at?: ModelTypes['timestamp'];
    user_id?: number;
  };
  /** order by max() on columns of table "teammates" */
  ['teammates_max_order_by']: GraphQLTypes['teammates_max_order_by'];
  /** aggregate min on columns */
  ['teammates_min_fields']: {
    created_at?: ModelTypes['timestamp'];
    id?: ModelTypes['bigint'];
    team_mate_id?: number;
    updated_at?: ModelTypes['timestamp'];
    user_id?: number;
  };
  /** order by min() on columns of table "teammates" */
  ['teammates_min_order_by']: GraphQLTypes['teammates_min_order_by'];
  /** response of any mutation on the table "teammates" */
  ['teammates_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['teammates'][];
  };
  /** on conflict condition type for table "teammates" */
  ['teammates_on_conflict']: GraphQLTypes['teammates_on_conflict'];
  /** Ordering options when selecting data from "teammates". */
  ['teammates_order_by']: GraphQLTypes['teammates_order_by'];
  /** primary key columns input for table: teammates */
  ['teammates_pk_columns_input']: GraphQLTypes['teammates_pk_columns_input'];
  /** select columns of table "teammates" */
  ['teammates_select_column']: GraphQLTypes['teammates_select_column'];
  /** input type for updating data in table "teammates" */
  ['teammates_set_input']: GraphQLTypes['teammates_set_input'];
  /** aggregate stddev on columns */
  ['teammates_stddev_fields']: {
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by stddev() on columns of table "teammates" */
  ['teammates_stddev_order_by']: GraphQLTypes['teammates_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['teammates_stddev_pop_fields']: {
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by stddev_pop() on columns of table "teammates" */
  ['teammates_stddev_pop_order_by']: GraphQLTypes['teammates_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['teammates_stddev_samp_fields']: {
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by stddev_samp() on columns of table "teammates" */
  ['teammates_stddev_samp_order_by']: GraphQLTypes['teammates_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['teammates_sum_fields']: {
    id?: ModelTypes['bigint'];
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by sum() on columns of table "teammates" */
  ['teammates_sum_order_by']: GraphQLTypes['teammates_sum_order_by'];
  /** update columns of table "teammates" */
  ['teammates_update_column']: GraphQLTypes['teammates_update_column'];
  /** aggregate var_pop on columns */
  ['teammates_var_pop_fields']: {
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by var_pop() on columns of table "teammates" */
  ['teammates_var_pop_order_by']: GraphQLTypes['teammates_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['teammates_var_samp_fields']: {
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by var_samp() on columns of table "teammates" */
  ['teammates_var_samp_order_by']: GraphQLTypes['teammates_var_samp_order_by'];
  /** aggregate variance on columns */
  ['teammates_variance_fields']: {
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
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
    note?: string;
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
  /** input type for inserting array relation for remote table "token_gifts" */
  ['token_gifts_arr_rel_insert_input']: GraphQLTypes['token_gifts_arr_rel_insert_input'];
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
  /** unique or primary key constraints on table "token_gifts" */
  ['token_gifts_constraint']: GraphQLTypes['token_gifts_constraint'];
  /** input type for incrementing numeric columns in table "token_gifts" */
  ['token_gifts_inc_input']: GraphQLTypes['token_gifts_inc_input'];
  /** input type for inserting data into table "token_gifts" */
  ['token_gifts_insert_input']: GraphQLTypes['token_gifts_insert_input'];
  /** aggregate max on columns */
  ['token_gifts_max_fields']: {
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    dts_created?: ModelTypes['timestamp'];
    epoch_id?: number;
    id?: ModelTypes['bigint'];
    note?: string;
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
    note?: string;
    recipient_address?: string;
    recipient_id?: ModelTypes['bigint'];
    sender_address?: string;
    sender_id?: ModelTypes['bigint'];
    tokens?: number;
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by min() on columns of table "token_gifts" */
  ['token_gifts_min_order_by']: GraphQLTypes['token_gifts_min_order_by'];
  /** response of any mutation on the table "token_gifts" */
  ['token_gifts_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['token_gifts'][];
  };
  /** on conflict condition type for table "token_gifts" */
  ['token_gifts_on_conflict']: GraphQLTypes['token_gifts_on_conflict'];
  /** Ordering options when selecting data from "token_gifts". */
  ['token_gifts_order_by']: GraphQLTypes['token_gifts_order_by'];
  /** primary key columns input for table: token_gifts */
  ['token_gifts_pk_columns_input']: GraphQLTypes['token_gifts_pk_columns_input'];
  /** select columns of table "token_gifts" */
  ['token_gifts_select_column']: GraphQLTypes['token_gifts_select_column'];
  /** input type for updating data in table "token_gifts" */
  ['token_gifts_set_input']: GraphQLTypes['token_gifts_set_input'];
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
  /** update columns of table "token_gifts" */
  ['token_gifts_update_column']: GraphQLTypes['token_gifts_update_column'];
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
    /** An aggregate relationship */
    burns_aggregate: ModelTypes['burns_aggregate'];
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
    /** An aggregate relationship */
    pending_received_gifts_aggregate: ModelTypes['pending_token_gifts_aggregate'];
    /** An array relationship */
    pending_sent_gifts: ModelTypes['pending_token_gifts'][];
    /** An aggregate relationship */
    pending_sent_gifts_aggregate: ModelTypes['pending_token_gifts_aggregate'];
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
    /** An aggregate relationship */
    teammates_aggregate: ModelTypes['teammates_aggregate'];
    updated_at?: ModelTypes['timestamp'];
  };
  /** aggregated selection of "users" */
  ['users_aggregate']: {
    aggregate?: ModelTypes['users_aggregate_fields'];
    nodes: ModelTypes['users'][];
  };
  /** aggregate fields of "users" */
  ['users_aggregate_fields']: {
    avg?: ModelTypes['users_avg_fields'];
    count: number;
    max?: ModelTypes['users_max_fields'];
    min?: ModelTypes['users_min_fields'];
    stddev?: ModelTypes['users_stddev_fields'];
    stddev_pop?: ModelTypes['users_stddev_pop_fields'];
    stddev_samp?: ModelTypes['users_stddev_samp_fields'];
    sum?: ModelTypes['users_sum_fields'];
    var_pop?: ModelTypes['users_var_pop_fields'];
    var_samp?: ModelTypes['users_var_samp_fields'];
    variance?: ModelTypes['users_variance_fields'];
  };
  /** order by aggregate values of table "users" */
  ['users_aggregate_order_by']: GraphQLTypes['users_aggregate_order_by'];
  /** input type for inserting array relation for remote table "users" */
  ['users_arr_rel_insert_input']: GraphQLTypes['users_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['users_avg_fields']: {
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
  };
  /** order by avg() on columns of table "users" */
  ['users_avg_order_by']: GraphQLTypes['users_avg_order_by'];
  /** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
  ['users_bool_exp']: GraphQLTypes['users_bool_exp'];
  /** unique or primary key constraints on table "users" */
  ['users_constraint']: GraphQLTypes['users_constraint'];
  /** input type for incrementing numeric columns in table "users" */
  ['users_inc_input']: GraphQLTypes['users_inc_input'];
  /** input type for inserting data into table "users" */
  ['users_insert_input']: GraphQLTypes['users_insert_input'];
  /** aggregate max on columns */
  ['users_max_fields']: {
    address?: string;
    bio?: string;
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    deleted_at?: ModelTypes['timestamp'];
    give_token_received?: number;
    give_token_remaining?: number;
    id?: ModelTypes['bigint'];
    name?: string;
    role?: number;
    starting_tokens?: number;
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by max() on columns of table "users" */
  ['users_max_order_by']: GraphQLTypes['users_max_order_by'];
  /** aggregate min on columns */
  ['users_min_fields']: {
    address?: string;
    bio?: string;
    circle_id?: ModelTypes['bigint'];
    created_at?: ModelTypes['timestamp'];
    deleted_at?: ModelTypes['timestamp'];
    give_token_received?: number;
    give_token_remaining?: number;
    id?: ModelTypes['bigint'];
    name?: string;
    role?: number;
    starting_tokens?: number;
    updated_at?: ModelTypes['timestamp'];
  };
  /** order by min() on columns of table "users" */
  ['users_min_order_by']: GraphQLTypes['users_min_order_by'];
  /** response of any mutation on the table "users" */
  ['users_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['users'][];
  };
  /** input type for inserting object relation for remote table "users" */
  ['users_obj_rel_insert_input']: GraphQLTypes['users_obj_rel_insert_input'];
  /** on conflict condition type for table "users" */
  ['users_on_conflict']: GraphQLTypes['users_on_conflict'];
  /** Ordering options when selecting data from "users". */
  ['users_order_by']: GraphQLTypes['users_order_by'];
  /** primary key columns input for table: users */
  ['users_pk_columns_input']: GraphQLTypes['users_pk_columns_input'];
  /** select columns of table "users" */
  ['users_select_column']: GraphQLTypes['users_select_column'];
  /** input type for updating data in table "users" */
  ['users_set_input']: GraphQLTypes['users_set_input'];
  /** aggregate stddev on columns */
  ['users_stddev_fields']: {
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
  };
  /** order by stddev() on columns of table "users" */
  ['users_stddev_order_by']: GraphQLTypes['users_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['users_stddev_pop_fields']: {
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
  };
  /** order by stddev_pop() on columns of table "users" */
  ['users_stddev_pop_order_by']: GraphQLTypes['users_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['users_stddev_samp_fields']: {
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
  };
  /** order by stddev_samp() on columns of table "users" */
  ['users_stddev_samp_order_by']: GraphQLTypes['users_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['users_sum_fields']: {
    circle_id?: ModelTypes['bigint'];
    give_token_received?: number;
    give_token_remaining?: number;
    id?: ModelTypes['bigint'];
    role?: number;
    starting_tokens?: number;
  };
  /** order by sum() on columns of table "users" */
  ['users_sum_order_by']: GraphQLTypes['users_sum_order_by'];
  /** update columns of table "users" */
  ['users_update_column']: GraphQLTypes['users_update_column'];
  /** aggregate var_pop on columns */
  ['users_var_pop_fields']: {
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
  };
  /** order by var_pop() on columns of table "users" */
  ['users_var_pop_order_by']: GraphQLTypes['users_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['users_var_samp_fields']: {
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
  };
  /** order by var_samp() on columns of table "users" */
  ['users_var_samp_order_by']: GraphQLTypes['users_var_samp_order_by'];
  /** aggregate variance on columns */
  ['users_variance_fields']: {
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
  };
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
  /** aggregated selection of "vault_transactions" */
  ['vault_transactions_aggregate']: {
    aggregate?: ModelTypes['vault_transactions_aggregate_fields'];
    nodes: ModelTypes['vault_transactions'][];
  };
  /** aggregate fields of "vault_transactions" */
  ['vault_transactions_aggregate_fields']: {
    avg?: ModelTypes['vault_transactions_avg_fields'];
    count: number;
    max?: ModelTypes['vault_transactions_max_fields'];
    min?: ModelTypes['vault_transactions_min_fields'];
    stddev?: ModelTypes['vault_transactions_stddev_fields'];
    stddev_pop?: ModelTypes['vault_transactions_stddev_pop_fields'];
    stddev_samp?: ModelTypes['vault_transactions_stddev_samp_fields'];
    sum?: ModelTypes['vault_transactions_sum_fields'];
    var_pop?: ModelTypes['vault_transactions_var_pop_fields'];
    var_samp?: ModelTypes['vault_transactions_var_samp_fields'];
    variance?: ModelTypes['vault_transactions_variance_fields'];
  };
  /** order by aggregate values of table "vault_transactions" */
  ['vault_transactions_aggregate_order_by']: GraphQLTypes['vault_transactions_aggregate_order_by'];
  /** input type for inserting array relation for remote table "vault_transactions" */
  ['vault_transactions_arr_rel_insert_input']: GraphQLTypes['vault_transactions_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['vault_transactions_avg_fields']: {
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by avg() on columns of table "vault_transactions" */
  ['vault_transactions_avg_order_by']: GraphQLTypes['vault_transactions_avg_order_by'];
  /** Boolean expression to filter rows from the table "vault_transactions". All fields are combined with a logical 'AND'. */
  ['vault_transactions_bool_exp']: GraphQLTypes['vault_transactions_bool_exp'];
  /** unique or primary key constraints on table "vault_transactions" */
  ['vault_transactions_constraint']: GraphQLTypes['vault_transactions_constraint'];
  /** input type for incrementing numeric columns in table "vault_transactions" */
  ['vault_transactions_inc_input']: GraphQLTypes['vault_transactions_inc_input'];
  /** input type for inserting data into table "vault_transactions" */
  ['vault_transactions_insert_input']: GraphQLTypes['vault_transactions_insert_input'];
  /** aggregate max on columns */
  ['vault_transactions_max_fields']: {
    created_at?: ModelTypes['timestamp'];
    created_by?: ModelTypes['bigint'];
    date?: ModelTypes['date'];
    description?: string;
    id?: ModelTypes['bigint'];
    name?: string;
    tx_hash?: string;
    updated_at?: ModelTypes['timestamp'];
    value?: ModelTypes['bigint'];
    vault_id?: ModelTypes['bigint'];
  };
  /** order by max() on columns of table "vault_transactions" */
  ['vault_transactions_max_order_by']: GraphQLTypes['vault_transactions_max_order_by'];
  /** aggregate min on columns */
  ['vault_transactions_min_fields']: {
    created_at?: ModelTypes['timestamp'];
    created_by?: ModelTypes['bigint'];
    date?: ModelTypes['date'];
    description?: string;
    id?: ModelTypes['bigint'];
    name?: string;
    tx_hash?: string;
    updated_at?: ModelTypes['timestamp'];
    value?: ModelTypes['bigint'];
    vault_id?: ModelTypes['bigint'];
  };
  /** order by min() on columns of table "vault_transactions" */
  ['vault_transactions_min_order_by']: GraphQLTypes['vault_transactions_min_order_by'];
  /** response of any mutation on the table "vault_transactions" */
  ['vault_transactions_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['vault_transactions'][];
  };
  /** on conflict condition type for table "vault_transactions" */
  ['vault_transactions_on_conflict']: GraphQLTypes['vault_transactions_on_conflict'];
  /** Ordering options when selecting data from "vault_transactions". */
  ['vault_transactions_order_by']: GraphQLTypes['vault_transactions_order_by'];
  /** primary key columns input for table: vault_transactions */
  ['vault_transactions_pk_columns_input']: GraphQLTypes['vault_transactions_pk_columns_input'];
  /** select columns of table "vault_transactions" */
  ['vault_transactions_select_column']: GraphQLTypes['vault_transactions_select_column'];
  /** input type for updating data in table "vault_transactions" */
  ['vault_transactions_set_input']: GraphQLTypes['vault_transactions_set_input'];
  /** aggregate stddev on columns */
  ['vault_transactions_stddev_fields']: {
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by stddev() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_order_by']: GraphQLTypes['vault_transactions_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['vault_transactions_stddev_pop_fields']: {
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by stddev_pop() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_pop_order_by']: GraphQLTypes['vault_transactions_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['vault_transactions_stddev_samp_fields']: {
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by stddev_samp() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_samp_order_by']: GraphQLTypes['vault_transactions_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['vault_transactions_sum_fields']: {
    created_by?: ModelTypes['bigint'];
    id?: ModelTypes['bigint'];
    value?: ModelTypes['bigint'];
    vault_id?: ModelTypes['bigint'];
  };
  /** order by sum() on columns of table "vault_transactions" */
  ['vault_transactions_sum_order_by']: GraphQLTypes['vault_transactions_sum_order_by'];
  /** update columns of table "vault_transactions" */
  ['vault_transactions_update_column']: GraphQLTypes['vault_transactions_update_column'];
  /** aggregate var_pop on columns */
  ['vault_transactions_var_pop_fields']: {
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by var_pop() on columns of table "vault_transactions" */
  ['vault_transactions_var_pop_order_by']: GraphQLTypes['vault_transactions_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['vault_transactions_var_samp_fields']: {
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by var_samp() on columns of table "vault_transactions" */
  ['vault_transactions_var_samp_order_by']: GraphQLTypes['vault_transactions_var_samp_order_by'];
  /** aggregate variance on columns */
  ['vault_transactions_variance_fields']: {
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
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
    /** An aggregate relationship */
    vault_transactions_aggregate: ModelTypes['vault_transactions_aggregate'];
  };
  /** aggregated selection of "vaults" */
  ['vaults_aggregate']: {
    aggregate?: ModelTypes['vaults_aggregate_fields'];
    nodes: ModelTypes['vaults'][];
  };
  /** aggregate fields of "vaults" */
  ['vaults_aggregate_fields']: {
    avg?: ModelTypes['vaults_avg_fields'];
    count: number;
    max?: ModelTypes['vaults_max_fields'];
    min?: ModelTypes['vaults_min_fields'];
    stddev?: ModelTypes['vaults_stddev_fields'];
    stddev_pop?: ModelTypes['vaults_stddev_pop_fields'];
    stddev_samp?: ModelTypes['vaults_stddev_samp_fields'];
    sum?: ModelTypes['vaults_sum_fields'];
    var_pop?: ModelTypes['vaults_var_pop_fields'];
    var_samp?: ModelTypes['vaults_var_samp_fields'];
    variance?: ModelTypes['vaults_variance_fields'];
  };
  /** aggregate avg on columns */
  ['vaults_avg_fields']: {
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** Boolean expression to filter rows from the table "vaults". All fields are combined with a logical 'AND'. */
  ['vaults_bool_exp']: GraphQLTypes['vaults_bool_exp'];
  /** unique or primary key constraints on table "vaults" */
  ['vaults_constraint']: GraphQLTypes['vaults_constraint'];
  /** input type for incrementing numeric columns in table "vaults" */
  ['vaults_inc_input']: GraphQLTypes['vaults_inc_input'];
  /** input type for inserting data into table "vaults" */
  ['vaults_insert_input']: GraphQLTypes['vaults_insert_input'];
  /** aggregate max on columns */
  ['vaults_max_fields']: {
    created_at?: ModelTypes['timestamptz'];
    created_by?: ModelTypes['bigint'];
    decimals?: number;
    id?: ModelTypes['bigint'];
    org_id?: ModelTypes['bigint'];
    simple_token_address?: string;
    symbol?: string;
    token_address?: string;
    updated_at?: ModelTypes['timestamptz'];
    vault_address?: string;
  };
  /** aggregate min on columns */
  ['vaults_min_fields']: {
    created_at?: ModelTypes['timestamptz'];
    created_by?: ModelTypes['bigint'];
    decimals?: number;
    id?: ModelTypes['bigint'];
    org_id?: ModelTypes['bigint'];
    simple_token_address?: string;
    symbol?: string;
    token_address?: string;
    updated_at?: ModelTypes['timestamptz'];
    vault_address?: string;
  };
  /** response of any mutation on the table "vaults" */
  ['vaults_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['vaults'][];
  };
  /** input type for inserting object relation for remote table "vaults" */
  ['vaults_obj_rel_insert_input']: GraphQLTypes['vaults_obj_rel_insert_input'];
  /** on conflict condition type for table "vaults" */
  ['vaults_on_conflict']: GraphQLTypes['vaults_on_conflict'];
  /** Ordering options when selecting data from "vaults". */
  ['vaults_order_by']: GraphQLTypes['vaults_order_by'];
  /** primary key columns input for table: vaults */
  ['vaults_pk_columns_input']: GraphQLTypes['vaults_pk_columns_input'];
  /** select columns of table "vaults" */
  ['vaults_select_column']: GraphQLTypes['vaults_select_column'];
  /** input type for updating data in table "vaults" */
  ['vaults_set_input']: GraphQLTypes['vaults_set_input'];
  /** aggregate stddev on columns */
  ['vaults_stddev_fields']: {
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['vaults_stddev_pop_fields']: {
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['vaults_stddev_samp_fields']: {
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** aggregate sum on columns */
  ['vaults_sum_fields']: {
    created_by?: ModelTypes['bigint'];
    decimals?: number;
    id?: ModelTypes['bigint'];
    org_id?: ModelTypes['bigint'];
  };
  /** update columns of table "vaults" */
  ['vaults_update_column']: GraphQLTypes['vaults_update_column'];
  /** aggregate var_pop on columns */
  ['vaults_var_pop_fields']: {
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** aggregate var_samp on columns */
  ['vaults_var_samp_fields']: {
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** aggregate variance on columns */
  ['vaults_variance_fields']: {
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
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
  /** aggregated selection of "vouches" */
  ['vouches_aggregate']: {
    aggregate?: ModelTypes['vouches_aggregate_fields'];
    nodes: ModelTypes['vouches'][];
  };
  /** aggregate fields of "vouches" */
  ['vouches_aggregate_fields']: {
    avg?: ModelTypes['vouches_avg_fields'];
    count: number;
    max?: ModelTypes['vouches_max_fields'];
    min?: ModelTypes['vouches_min_fields'];
    stddev?: ModelTypes['vouches_stddev_fields'];
    stddev_pop?: ModelTypes['vouches_stddev_pop_fields'];
    stddev_samp?: ModelTypes['vouches_stddev_samp_fields'];
    sum?: ModelTypes['vouches_sum_fields'];
    var_pop?: ModelTypes['vouches_var_pop_fields'];
    var_samp?: ModelTypes['vouches_var_samp_fields'];
    variance?: ModelTypes['vouches_variance_fields'];
  };
  /** order by aggregate values of table "vouches" */
  ['vouches_aggregate_order_by']: GraphQLTypes['vouches_aggregate_order_by'];
  /** input type for inserting array relation for remote table "vouches" */
  ['vouches_arr_rel_insert_input']: GraphQLTypes['vouches_arr_rel_insert_input'];
  /** aggregate avg on columns */
  ['vouches_avg_fields']: {
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by avg() on columns of table "vouches" */
  ['vouches_avg_order_by']: GraphQLTypes['vouches_avg_order_by'];
  /** Boolean expression to filter rows from the table "vouches". All fields are combined with a logical 'AND'. */
  ['vouches_bool_exp']: GraphQLTypes['vouches_bool_exp'];
  /** unique or primary key constraints on table "vouches" */
  ['vouches_constraint']: GraphQLTypes['vouches_constraint'];
  /** input type for incrementing numeric columns in table "vouches" */
  ['vouches_inc_input']: GraphQLTypes['vouches_inc_input'];
  /** input type for inserting data into table "vouches" */
  ['vouches_insert_input']: GraphQLTypes['vouches_insert_input'];
  /** aggregate max on columns */
  ['vouches_max_fields']: {
    created_at?: ModelTypes['timestamp'];
    id?: ModelTypes['bigint'];
    nominee_id?: number;
    updated_at?: ModelTypes['timestamp'];
    voucher_id?: number;
  };
  /** order by max() on columns of table "vouches" */
  ['vouches_max_order_by']: GraphQLTypes['vouches_max_order_by'];
  /** aggregate min on columns */
  ['vouches_min_fields']: {
    created_at?: ModelTypes['timestamp'];
    id?: ModelTypes['bigint'];
    nominee_id?: number;
    updated_at?: ModelTypes['timestamp'];
    voucher_id?: number;
  };
  /** order by min() on columns of table "vouches" */
  ['vouches_min_order_by']: GraphQLTypes['vouches_min_order_by'];
  /** response of any mutation on the table "vouches" */
  ['vouches_mutation_response']: {
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: ModelTypes['vouches'][];
  };
  /** on conflict condition type for table "vouches" */
  ['vouches_on_conflict']: GraphQLTypes['vouches_on_conflict'];
  /** Ordering options when selecting data from "vouches". */
  ['vouches_order_by']: GraphQLTypes['vouches_order_by'];
  /** primary key columns input for table: vouches */
  ['vouches_pk_columns_input']: GraphQLTypes['vouches_pk_columns_input'];
  /** select columns of table "vouches" */
  ['vouches_select_column']: GraphQLTypes['vouches_select_column'];
  /** input type for updating data in table "vouches" */
  ['vouches_set_input']: GraphQLTypes['vouches_set_input'];
  /** aggregate stddev on columns */
  ['vouches_stddev_fields']: {
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by stddev() on columns of table "vouches" */
  ['vouches_stddev_order_by']: GraphQLTypes['vouches_stddev_order_by'];
  /** aggregate stddev_pop on columns */
  ['vouches_stddev_pop_fields']: {
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by stddev_pop() on columns of table "vouches" */
  ['vouches_stddev_pop_order_by']: GraphQLTypes['vouches_stddev_pop_order_by'];
  /** aggregate stddev_samp on columns */
  ['vouches_stddev_samp_fields']: {
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by stddev_samp() on columns of table "vouches" */
  ['vouches_stddev_samp_order_by']: GraphQLTypes['vouches_stddev_samp_order_by'];
  /** aggregate sum on columns */
  ['vouches_sum_fields']: {
    id?: ModelTypes['bigint'];
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by sum() on columns of table "vouches" */
  ['vouches_sum_order_by']: GraphQLTypes['vouches_sum_order_by'];
  /** update columns of table "vouches" */
  ['vouches_update_column']: GraphQLTypes['vouches_update_column'];
  /** aggregate var_pop on columns */
  ['vouches_var_pop_fields']: {
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by var_pop() on columns of table "vouches" */
  ['vouches_var_pop_order_by']: GraphQLTypes['vouches_var_pop_order_by'];
  /** aggregate var_samp on columns */
  ['vouches_var_samp_fields']: {
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by var_samp() on columns of table "vouches" */
  ['vouches_var_samp_order_by']: GraphQLTypes['vouches_var_samp_order_by'];
  /** aggregate variance on columns */
  ['vouches_variance_fields']: {
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
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
    /** An aggregate relationship */
    users_aggregate: GraphQLTypes['users_aggregate'];
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
  /** aggregated selection of "burns" */
  ['burns_aggregate']: {
    __typename: 'burns_aggregate';
    aggregate?: GraphQLTypes['burns_aggregate_fields'];
    nodes: Array<GraphQLTypes['burns']>;
  };
  /** aggregate fields of "burns" */
  ['burns_aggregate_fields']: {
    __typename: 'burns_aggregate_fields';
    avg?: GraphQLTypes['burns_avg_fields'];
    count: number;
    max?: GraphQLTypes['burns_max_fields'];
    min?: GraphQLTypes['burns_min_fields'];
    stddev?: GraphQLTypes['burns_stddev_fields'];
    stddev_pop?: GraphQLTypes['burns_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['burns_stddev_samp_fields'];
    sum?: GraphQLTypes['burns_sum_fields'];
    var_pop?: GraphQLTypes['burns_var_pop_fields'];
    var_samp?: GraphQLTypes['burns_var_samp_fields'];
    variance?: GraphQLTypes['burns_variance_fields'];
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
  /** input type for inserting array relation for remote table "burns" */
  ['burns_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['burns_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['burns_on_conflict'];
  };
  /** aggregate avg on columns */
  ['burns_avg_fields']: {
    __typename: 'burns_avg_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
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
  /** unique or primary key constraints on table "burns" */
  ['burns_constraint']: burns_constraint;
  /** input type for incrementing numeric columns in table "burns" */
  ['burns_inc_input']: {
    circle_id?: GraphQLTypes['bigint'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "burns" */
  ['burns_insert_input']: {
    circle?: GraphQLTypes['circles_obj_rel_insert_input'];
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    epoch?: GraphQLTypes['epochs_obj_rel_insert_input'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    updated_at?: GraphQLTypes['timestamp'];
    user?: GraphQLTypes['users_obj_rel_insert_input'];
    user_id?: GraphQLTypes['bigint'];
  };
  /** aggregate max on columns */
  ['burns_max_fields']: {
    __typename: 'burns_max_fields';
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: GraphQLTypes['bigint'];
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
  /** aggregate min on columns */
  ['burns_min_fields']: {
    __typename: 'burns_min_fields';
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: GraphQLTypes['bigint'];
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
  /** response of any mutation on the table "burns" */
  ['burns_mutation_response']: {
    __typename: 'burns_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['burns']>;
  };
  /** on conflict condition type for table "burns" */
  ['burns_on_conflict']: {
    constraint: GraphQLTypes['burns_constraint'];
    update_columns: Array<GraphQLTypes['burns_update_column']>;
    where?: GraphQLTypes['burns_bool_exp'];
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
  /** primary key columns input for table: burns */
  ['burns_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "burns" */
  ['burns_select_column']: burns_select_column;
  /** input type for updating data in table "burns" */
  ['burns_set_input']: {
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: GraphQLTypes['bigint'];
  };
  /** aggregate stddev on columns */
  ['burns_stddev_fields']: {
    __typename: 'burns_stddev_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
  };
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
  /** aggregate stddev_pop on columns */
  ['burns_stddev_pop_fields']: {
    __typename: 'burns_stddev_pop_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
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
  /** aggregate stddev_samp on columns */
  ['burns_stddev_samp_fields']: {
    __typename: 'burns_stddev_samp_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
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
  /** aggregate sum on columns */
  ['burns_sum_fields']: {
    __typename: 'burns_sum_fields';
    circle_id?: GraphQLTypes['bigint'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: GraphQLTypes['bigint'];
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
  /** update columns of table "burns" */
  ['burns_update_column']: burns_update_column;
  /** aggregate var_pop on columns */
  ['burns_var_pop_fields']: {
    __typename: 'burns_var_pop_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
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
  /** aggregate var_samp on columns */
  ['burns_var_samp_fields']: {
    __typename: 'burns_var_samp_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
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
  /** aggregate variance on columns */
  ['burns_variance_fields']: {
    __typename: 'burns_variance_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    original_amount?: number;
    regift_percent?: number;
    tokens_burnt?: number;
    user_id?: number;
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
  /** aggregated selection of "circle_integrations" */
  ['circle_integrations_aggregate']: {
    __typename: 'circle_integrations_aggregate';
    aggregate?: GraphQLTypes['circle_integrations_aggregate_fields'];
    nodes: Array<GraphQLTypes['circle_integrations']>;
  };
  /** aggregate fields of "circle_integrations" */
  ['circle_integrations_aggregate_fields']: {
    __typename: 'circle_integrations_aggregate_fields';
    avg?: GraphQLTypes['circle_integrations_avg_fields'];
    count: number;
    max?: GraphQLTypes['circle_integrations_max_fields'];
    min?: GraphQLTypes['circle_integrations_min_fields'];
    stddev?: GraphQLTypes['circle_integrations_stddev_fields'];
    stddev_pop?: GraphQLTypes['circle_integrations_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['circle_integrations_stddev_samp_fields'];
    sum?: GraphQLTypes['circle_integrations_sum_fields'];
    var_pop?: GraphQLTypes['circle_integrations_var_pop_fields'];
    var_samp?: GraphQLTypes['circle_integrations_var_samp_fields'];
    variance?: GraphQLTypes['circle_integrations_variance_fields'];
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
  /** input type for inserting array relation for remote table "circle_integrations" */
  ['circle_integrations_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['circle_integrations_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['circle_integrations_on_conflict'];
  };
  /** aggregate avg on columns */
  ['circle_integrations_avg_fields']: {
    __typename: 'circle_integrations_avg_fields';
    circle_id?: number;
    id?: number;
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
  /** unique or primary key constraints on table "circle_integrations" */
  ['circle_integrations_constraint']: circle_integrations_constraint;
  /** input type for incrementing numeric columns in table "circle_integrations" */
  ['circle_integrations_inc_input']: {
    circle_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "circle_integrations" */
  ['circle_integrations_insert_input']: {
    circle?: GraphQLTypes['circles_obj_rel_insert_input'];
    circle_id?: GraphQLTypes['bigint'];
    data?: GraphQLTypes['json'];
    id?: GraphQLTypes['bigint'];
    name?: string;
    type?: string;
  };
  /** aggregate max on columns */
  ['circle_integrations_max_fields']: {
    __typename: 'circle_integrations_max_fields';
    circle_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
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
  /** aggregate min on columns */
  ['circle_integrations_min_fields']: {
    __typename: 'circle_integrations_min_fields';
    circle_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    name?: string;
    type?: string;
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
  /** on conflict condition type for table "circle_integrations" */
  ['circle_integrations_on_conflict']: {
    constraint: GraphQLTypes['circle_integrations_constraint'];
    update_columns: Array<GraphQLTypes['circle_integrations_update_column']>;
    where?: GraphQLTypes['circle_integrations_bool_exp'];
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
  /** primary key columns input for table: circle_integrations */
  ['circle_integrations_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "circle_integrations" */
  ['circle_integrations_select_column']: circle_integrations_select_column;
  /** input type for updating data in table "circle_integrations" */
  ['circle_integrations_set_input']: {
    circle_id?: GraphQLTypes['bigint'];
    data?: GraphQLTypes['json'];
    id?: GraphQLTypes['bigint'];
    name?: string;
    type?: string;
  };
  /** aggregate stddev on columns */
  ['circle_integrations_stddev_fields']: {
    __typename: 'circle_integrations_stddev_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by stddev() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['circle_integrations_stddev_pop_fields']: {
    __typename: 'circle_integrations_stddev_pop_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by stddev_pop() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_samp on columns */
  ['circle_integrations_stddev_samp_fields']: {
    __typename: 'circle_integrations_stddev_samp_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by stddev_samp() on columns of table "circle_integrations" */
  ['circle_integrations_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** aggregate sum on columns */
  ['circle_integrations_sum_fields']: {
    __typename: 'circle_integrations_sum_fields';
    circle_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
  };
  /** order by sum() on columns of table "circle_integrations" */
  ['circle_integrations_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** update columns of table "circle_integrations" */
  ['circle_integrations_update_column']: circle_integrations_update_column;
  /** aggregate var_pop on columns */
  ['circle_integrations_var_pop_fields']: {
    __typename: 'circle_integrations_var_pop_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by var_pop() on columns of table "circle_integrations" */
  ['circle_integrations_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** aggregate var_samp on columns */
  ['circle_integrations_var_samp_fields']: {
    __typename: 'circle_integrations_var_samp_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by var_samp() on columns of table "circle_integrations" */
  ['circle_integrations_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** aggregate variance on columns */
  ['circle_integrations_variance_fields']: {
    __typename: 'circle_integrations_variance_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by variance() on columns of table "circle_integrations" */
  ['circle_integrations_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** columns and relationships of "circle_metadata" */
  ['circle_metadata']: {
    __typename: 'circle_metadata';
    /** An object relationship */
    circle: GraphQLTypes['circles'];
    circle_id: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    json?: GraphQLTypes['json'];
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregated selection of "circle_metadata" */
  ['circle_metadata_aggregate']: {
    __typename: 'circle_metadata_aggregate';
    aggregate?: GraphQLTypes['circle_metadata_aggregate_fields'];
    nodes: Array<GraphQLTypes['circle_metadata']>;
  };
  /** aggregate fields of "circle_metadata" */
  ['circle_metadata_aggregate_fields']: {
    __typename: 'circle_metadata_aggregate_fields';
    avg?: GraphQLTypes['circle_metadata_avg_fields'];
    count: number;
    max?: GraphQLTypes['circle_metadata_max_fields'];
    min?: GraphQLTypes['circle_metadata_min_fields'];
    stddev?: GraphQLTypes['circle_metadata_stddev_fields'];
    stddev_pop?: GraphQLTypes['circle_metadata_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['circle_metadata_stddev_samp_fields'];
    sum?: GraphQLTypes['circle_metadata_sum_fields'];
    var_pop?: GraphQLTypes['circle_metadata_var_pop_fields'];
    var_samp?: GraphQLTypes['circle_metadata_var_samp_fields'];
    variance?: GraphQLTypes['circle_metadata_variance_fields'];
  };
  /** order by aggregate values of table "circle_metadata" */
  ['circle_metadata_aggregate_order_by']: {
    avg?: GraphQLTypes['circle_metadata_avg_order_by'];
    count?: GraphQLTypes['order_by'];
    max?: GraphQLTypes['circle_metadata_max_order_by'];
    min?: GraphQLTypes['circle_metadata_min_order_by'];
    stddev?: GraphQLTypes['circle_metadata_stddev_order_by'];
    stddev_pop?: GraphQLTypes['circle_metadata_stddev_pop_order_by'];
    stddev_samp?: GraphQLTypes['circle_metadata_stddev_samp_order_by'];
    sum?: GraphQLTypes['circle_metadata_sum_order_by'];
    var_pop?: GraphQLTypes['circle_metadata_var_pop_order_by'];
    var_samp?: GraphQLTypes['circle_metadata_var_samp_order_by'];
    variance?: GraphQLTypes['circle_metadata_variance_order_by'];
  };
  /** input type for inserting array relation for remote table "circle_metadata" */
  ['circle_metadata_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['circle_metadata_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['circle_metadata_on_conflict'];
  };
  /** aggregate avg on columns */
  ['circle_metadata_avg_fields']: {
    __typename: 'circle_metadata_avg_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by avg() on columns of table "circle_metadata" */
  ['circle_metadata_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** Boolean expression to filter rows from the table "circle_metadata". All fields are combined with a logical 'AND'. */
  ['circle_metadata_bool_exp']: {
    _and?: Array<GraphQLTypes['circle_metadata_bool_exp']>;
    _not?: GraphQLTypes['circle_metadata_bool_exp'];
    _or?: Array<GraphQLTypes['circle_metadata_bool_exp']>;
    circle?: GraphQLTypes['circles_bool_exp'];
    circle_id?: GraphQLTypes['bigint_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    json?: GraphQLTypes['json_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** unique or primary key constraints on table "circle_metadata" */
  ['circle_metadata_constraint']: circle_metadata_constraint;
  /** input type for incrementing numeric columns in table "circle_metadata" */
  ['circle_metadata_inc_input']: {
    circle_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "circle_metadata" */
  ['circle_metadata_insert_input']: {
    circle?: GraphQLTypes['circles_obj_rel_insert_input'];
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    json?: GraphQLTypes['json'];
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate max on columns */
  ['circle_metadata_max_fields']: {
    __typename: 'circle_metadata_max_fields';
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** order by max() on columns of table "circle_metadata" */
  ['circle_metadata_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** aggregate min on columns */
  ['circle_metadata_min_fields']: {
    __typename: 'circle_metadata_min_fields';
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** order by min() on columns of table "circle_metadata" */
  ['circle_metadata_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** response of any mutation on the table "circle_metadata" */
  ['circle_metadata_mutation_response']: {
    __typename: 'circle_metadata_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['circle_metadata']>;
  };
  /** on conflict condition type for table "circle_metadata" */
  ['circle_metadata_on_conflict']: {
    constraint: GraphQLTypes['circle_metadata_constraint'];
    update_columns: Array<GraphQLTypes['circle_metadata_update_column']>;
    where?: GraphQLTypes['circle_metadata_bool_exp'];
  };
  /** Ordering options when selecting data from "circle_metadata". */
  ['circle_metadata_order_by']: {
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    json?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: circle_metadata */
  ['circle_metadata_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "circle_metadata" */
  ['circle_metadata_select_column']: circle_metadata_select_column;
  /** input type for updating data in table "circle_metadata" */
  ['circle_metadata_set_input']: {
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    json?: GraphQLTypes['json'];
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate stddev on columns */
  ['circle_metadata_stddev_fields']: {
    __typename: 'circle_metadata_stddev_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by stddev() on columns of table "circle_metadata" */
  ['circle_metadata_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['circle_metadata_stddev_pop_fields']: {
    __typename: 'circle_metadata_stddev_pop_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by stddev_pop() on columns of table "circle_metadata" */
  ['circle_metadata_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_samp on columns */
  ['circle_metadata_stddev_samp_fields']: {
    __typename: 'circle_metadata_stddev_samp_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by stddev_samp() on columns of table "circle_metadata" */
  ['circle_metadata_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** aggregate sum on columns */
  ['circle_metadata_sum_fields']: {
    __typename: 'circle_metadata_sum_fields';
    circle_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
  };
  /** order by sum() on columns of table "circle_metadata" */
  ['circle_metadata_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** update columns of table "circle_metadata" */
  ['circle_metadata_update_column']: circle_metadata_update_column;
  /** aggregate var_pop on columns */
  ['circle_metadata_var_pop_fields']: {
    __typename: 'circle_metadata_var_pop_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by var_pop() on columns of table "circle_metadata" */
  ['circle_metadata_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** aggregate var_samp on columns */
  ['circle_metadata_var_samp_fields']: {
    __typename: 'circle_metadata_var_samp_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by var_samp() on columns of table "circle_metadata" */
  ['circle_metadata_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
  };
  /** aggregate variance on columns */
  ['circle_metadata_variance_fields']: {
    __typename: 'circle_metadata_variance_fields';
    circle_id?: number;
    id?: number;
  };
  /** order by variance() on columns of table "circle_metadata" */
  ['circle_metadata_variance_order_by']: {
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
  /** aggregated selection of "circle_private" */
  ['circle_private_aggregate']: {
    __typename: 'circle_private_aggregate';
    aggregate?: GraphQLTypes['circle_private_aggregate_fields'];
    nodes: Array<GraphQLTypes['circle_private']>;
  };
  /** aggregate fields of "circle_private" */
  ['circle_private_aggregate_fields']: {
    __typename: 'circle_private_aggregate_fields';
    avg?: GraphQLTypes['circle_private_avg_fields'];
    count: number;
    max?: GraphQLTypes['circle_private_max_fields'];
    min?: GraphQLTypes['circle_private_min_fields'];
    stddev?: GraphQLTypes['circle_private_stddev_fields'];
    stddev_pop?: GraphQLTypes['circle_private_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['circle_private_stddev_samp_fields'];
    sum?: GraphQLTypes['circle_private_sum_fields'];
    var_pop?: GraphQLTypes['circle_private_var_pop_fields'];
    var_samp?: GraphQLTypes['circle_private_var_samp_fields'];
    variance?: GraphQLTypes['circle_private_variance_fields'];
  };
  /** aggregate avg on columns */
  ['circle_private_avg_fields']: {
    __typename: 'circle_private_avg_fields';
    circle_id?: number;
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
  /** input type for incrementing numeric columns in table "circle_private" */
  ['circle_private_inc_input']: {
    circle_id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "circle_private" */
  ['circle_private_insert_input']: {
    circle?: GraphQLTypes['circles_obj_rel_insert_input'];
    circle_id?: GraphQLTypes['bigint'];
    discord_webhook?: string;
  };
  /** aggregate max on columns */
  ['circle_private_max_fields']: {
    __typename: 'circle_private_max_fields';
    circle_id?: GraphQLTypes['bigint'];
    discord_webhook?: string;
  };
  /** aggregate min on columns */
  ['circle_private_min_fields']: {
    __typename: 'circle_private_min_fields';
    circle_id?: GraphQLTypes['bigint'];
    discord_webhook?: string;
  };
  /** response of any mutation on the table "circle_private" */
  ['circle_private_mutation_response']: {
    __typename: 'circle_private_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['circle_private']>;
  };
  /** input type for inserting object relation for remote table "circle_private" */
  ['circle_private_obj_rel_insert_input']: {
    data: GraphQLTypes['circle_private_insert_input'];
  };
  /** Ordering options when selecting data from "circle_private". */
  ['circle_private_order_by']: {
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    discord_webhook?: GraphQLTypes['order_by'];
  };
  /** select columns of table "circle_private" */
  ['circle_private_select_column']: circle_private_select_column;
  /** input type for updating data in table "circle_private" */
  ['circle_private_set_input']: {
    circle_id?: GraphQLTypes['bigint'];
    discord_webhook?: string;
  };
  /** aggregate stddev on columns */
  ['circle_private_stddev_fields']: {
    __typename: 'circle_private_stddev_fields';
    circle_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['circle_private_stddev_pop_fields']: {
    __typename: 'circle_private_stddev_pop_fields';
    circle_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['circle_private_stddev_samp_fields']: {
    __typename: 'circle_private_stddev_samp_fields';
    circle_id?: number;
  };
  /** aggregate sum on columns */
  ['circle_private_sum_fields']: {
    __typename: 'circle_private_sum_fields';
    circle_id?: GraphQLTypes['bigint'];
  };
  /** aggregate var_pop on columns */
  ['circle_private_var_pop_fields']: {
    __typename: 'circle_private_var_pop_fields';
    circle_id?: number;
  };
  /** aggregate var_samp on columns */
  ['circle_private_var_samp_fields']: {
    __typename: 'circle_private_var_samp_fields';
    circle_id?: number;
  };
  /** aggregate variance on columns */
  ['circle_private_variance_fields']: {
    __typename: 'circle_private_variance_fields';
    circle_id?: number;
  };
  /** columns and relationships of "circles" */
  ['circles']: {
    __typename: 'circles';
    alloc_text?: string;
    auto_opt_out: boolean;
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An aggregate relationship */
    burns_aggregate: GraphQLTypes['burns_aggregate'];
    /** An array relationship */
    circle_metadata: Array<GraphQLTypes['circle_metadata']>;
    /** An aggregate relationship */
    circle_metadata_aggregate: GraphQLTypes['circle_metadata_aggregate'];
    /** An object relationship */
    circle_private?: GraphQLTypes['circle_private'];
    contact?: string;
    created_at?: GraphQLTypes['timestamp'];
    default_opt_in: boolean;
    discord_webhook?: string;
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    /** An aggregate relationship */
    epochs_aggregate: GraphQLTypes['epochs_aggregate'];
    id: GraphQLTypes['bigint'];
    /** An array relationship */
    integrations: Array<GraphQLTypes['circle_integrations']>;
    /** An aggregate relationship */
    integrations_aggregate: GraphQLTypes['circle_integrations_aggregate'];
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
    /** An aggregate relationship */
    pending_token_gifts_aggregate: GraphQLTypes['pending_token_gifts_aggregate'];
    protocol_id: number;
    team_sel_text?: string;
    team_selection: boolean;
    telegram_id?: string;
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    token_name: string;
    updated_at?: GraphQLTypes['timestamp'];
    /** An array relationship */
    users: Array<GraphQLTypes['users']>;
    /** An aggregate relationship */
    users_aggregate: GraphQLTypes['users_aggregate'];
    vouching: boolean;
    vouching_text?: string;
  };
  /** aggregated selection of "circles" */
  ['circles_aggregate']: {
    __typename: 'circles_aggregate';
    aggregate?: GraphQLTypes['circles_aggregate_fields'];
    nodes: Array<GraphQLTypes['circles']>;
  };
  /** aggregate fields of "circles" */
  ['circles_aggregate_fields']: {
    __typename: 'circles_aggregate_fields';
    avg?: GraphQLTypes['circles_avg_fields'];
    count: number;
    max?: GraphQLTypes['circles_max_fields'];
    min?: GraphQLTypes['circles_min_fields'];
    stddev?: GraphQLTypes['circles_stddev_fields'];
    stddev_pop?: GraphQLTypes['circles_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['circles_stddev_samp_fields'];
    sum?: GraphQLTypes['circles_sum_fields'];
    var_pop?: GraphQLTypes['circles_var_pop_fields'];
    var_samp?: GraphQLTypes['circles_var_samp_fields'];
    variance?: GraphQLTypes['circles_variance_fields'];
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
  /** input type for inserting array relation for remote table "circles" */
  ['circles_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['circles_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['circles_on_conflict'];
  };
  /** aggregate avg on columns */
  ['circles_avg_fields']: {
    __typename: 'circles_avg_fields';
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
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
    circle_metadata?: GraphQLTypes['circle_metadata_bool_exp'];
    circle_private?: GraphQLTypes['circle_private_bool_exp'];
    contact?: GraphQLTypes['String_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    default_opt_in?: GraphQLTypes['Boolean_comparison_exp'];
    discord_webhook?: GraphQLTypes['String_comparison_exp'];
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
    telegram_id?: GraphQLTypes['String_comparison_exp'];
    token_gifts?: GraphQLTypes['token_gifts_bool_exp'];
    token_name?: GraphQLTypes['String_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
    users?: GraphQLTypes['users_bool_exp'];
    vouching?: GraphQLTypes['Boolean_comparison_exp'];
    vouching_text?: GraphQLTypes['String_comparison_exp'];
  };
  /** unique or primary key constraints on table "circles" */
  ['circles_constraint']: circles_constraint;
  /** input type for incrementing numeric columns in table "circles" */
  ['circles_inc_input']: {
    id?: GraphQLTypes['bigint'];
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** input type for inserting data into table "circles" */
  ['circles_insert_input']: {
    alloc_text?: string;
    auto_opt_out?: boolean;
    burns?: GraphQLTypes['burns_arr_rel_insert_input'];
    circle_metadata?: GraphQLTypes['circle_metadata_arr_rel_insert_input'];
    circle_private?: GraphQLTypes['circle_private_obj_rel_insert_input'];
    contact?: string;
    created_at?: GraphQLTypes['timestamp'];
    default_opt_in?: boolean;
    discord_webhook?: string;
    epochs?: GraphQLTypes['epochs_arr_rel_insert_input'];
    id?: GraphQLTypes['bigint'];
    integrations?: GraphQLTypes['circle_integrations_arr_rel_insert_input'];
    is_verified?: boolean;
    logo?: string;
    min_vouches?: number;
    name?: string;
    nomination_days_limit?: number;
    nominees?: GraphQLTypes['nominees_arr_rel_insert_input'];
    only_giver_vouch?: boolean;
    organization?: GraphQLTypes['organizations_obj_rel_insert_input'];
    pending_token_gifts?: GraphQLTypes['pending_token_gifts_arr_rel_insert_input'];
    protocol_id?: number;
    team_sel_text?: string;
    team_selection?: boolean;
    telegram_id?: string;
    token_gifts?: GraphQLTypes['token_gifts_arr_rel_insert_input'];
    token_name?: string;
    updated_at?: GraphQLTypes['timestamp'];
    users?: GraphQLTypes['users_arr_rel_insert_input'];
    vouching?: boolean;
    vouching_text?: string;
  };
  /** aggregate max on columns */
  ['circles_max_fields']: {
    __typename: 'circles_max_fields';
    alloc_text?: string;
    contact?: string;
    created_at?: GraphQLTypes['timestamp'];
    discord_webhook?: string;
    id?: GraphQLTypes['bigint'];
    logo?: string;
    min_vouches?: number;
    name?: string;
    nomination_days_limit?: number;
    protocol_id?: number;
    team_sel_text?: string;
    telegram_id?: string;
    token_name?: string;
    updated_at?: GraphQLTypes['timestamp'];
    vouching_text?: string;
  };
  /** order by max() on columns of table "circles" */
  ['circles_max_order_by']: {
    alloc_text?: GraphQLTypes['order_by'];
    contact?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    discord_webhook?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    logo?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
    team_sel_text?: GraphQLTypes['order_by'];
    telegram_id?: GraphQLTypes['order_by'];
    token_name?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    vouching_text?: GraphQLTypes['order_by'];
  };
  /** aggregate min on columns */
  ['circles_min_fields']: {
    __typename: 'circles_min_fields';
    alloc_text?: string;
    contact?: string;
    created_at?: GraphQLTypes['timestamp'];
    discord_webhook?: string;
    id?: GraphQLTypes['bigint'];
    logo?: string;
    min_vouches?: number;
    name?: string;
    nomination_days_limit?: number;
    protocol_id?: number;
    team_sel_text?: string;
    telegram_id?: string;
    token_name?: string;
    updated_at?: GraphQLTypes['timestamp'];
    vouching_text?: string;
  };
  /** order by min() on columns of table "circles" */
  ['circles_min_order_by']: {
    alloc_text?: GraphQLTypes['order_by'];
    contact?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    discord_webhook?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    logo?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
    team_sel_text?: GraphQLTypes['order_by'];
    telegram_id?: GraphQLTypes['order_by'];
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
  /** input type for inserting object relation for remote table "circles" */
  ['circles_obj_rel_insert_input']: {
    data: GraphQLTypes['circles_insert_input'];
    /** on conflict condition */
    on_conflict?: GraphQLTypes['circles_on_conflict'];
  };
  /** on conflict condition type for table "circles" */
  ['circles_on_conflict']: {
    constraint: GraphQLTypes['circles_constraint'];
    update_columns: Array<GraphQLTypes['circles_update_column']>;
    where?: GraphQLTypes['circles_bool_exp'];
  };
  /** Ordering options when selecting data from "circles". */
  ['circles_order_by']: {
    alloc_text?: GraphQLTypes['order_by'];
    auto_opt_out?: GraphQLTypes['order_by'];
    burns_aggregate?: GraphQLTypes['burns_aggregate_order_by'];
    circle_metadata_aggregate?: GraphQLTypes['circle_metadata_aggregate_order_by'];
    circle_private?: GraphQLTypes['circle_private_order_by'];
    contact?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    default_opt_in?: GraphQLTypes['order_by'];
    discord_webhook?: GraphQLTypes['order_by'];
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
    telegram_id?: GraphQLTypes['order_by'];
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
    contact?: string;
    created_at?: GraphQLTypes['timestamp'];
    default_opt_in?: boolean;
    discord_webhook?: string;
    id?: GraphQLTypes['bigint'];
    is_verified?: boolean;
    logo?: string;
    min_vouches?: number;
    name?: string;
    nomination_days_limit?: number;
    only_giver_vouch?: boolean;
    protocol_id?: number;
    team_sel_text?: string;
    team_selection?: boolean;
    telegram_id?: string;
    token_name?: string;
    updated_at?: GraphQLTypes['timestamp'];
    vouching?: boolean;
    vouching_text?: string;
  };
  /** aggregate stddev on columns */
  ['circles_stddev_fields']: {
    __typename: 'circles_stddev_fields';
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by stddev() on columns of table "circles" */
  ['circles_stddev_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['circles_stddev_pop_fields']: {
    __typename: 'circles_stddev_pop_fields';
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by stddev_pop() on columns of table "circles" */
  ['circles_stddev_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_samp on columns */
  ['circles_stddev_samp_fields']: {
    __typename: 'circles_stddev_samp_fields';
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by stddev_samp() on columns of table "circles" */
  ['circles_stddev_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** aggregate sum on columns */
  ['circles_sum_fields']: {
    __typename: 'circles_sum_fields';
    id?: GraphQLTypes['bigint'];
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by sum() on columns of table "circles" */
  ['circles_sum_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** update columns of table "circles" */
  ['circles_update_column']: circles_update_column;
  /** aggregate var_pop on columns */
  ['circles_var_pop_fields']: {
    __typename: 'circles_var_pop_fields';
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by var_pop() on columns of table "circles" */
  ['circles_var_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** aggregate var_samp on columns */
  ['circles_var_samp_fields']: {
    __typename: 'circles_var_samp_fields';
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
  };
  /** order by var_samp() on columns of table "circles" */
  ['circles_var_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    min_vouches?: GraphQLTypes['order_by'];
    nomination_days_limit?: GraphQLTypes['order_by'];
    protocol_id?: GraphQLTypes['order_by'];
  };
  /** aggregate variance on columns */
  ['circles_variance_fields']: {
    __typename: 'circles_variance_fields';
    id?: number;
    min_vouches?: number;
    nomination_days_limit?: number;
    protocol_id?: number;
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
  /** aggregated selection of "claims" */
  ['claims_aggregate']: {
    __typename: 'claims_aggregate';
    aggregate?: GraphQLTypes['claims_aggregate_fields'];
    nodes: Array<GraphQLTypes['claims']>;
  };
  /** aggregate fields of "claims" */
  ['claims_aggregate_fields']: {
    __typename: 'claims_aggregate_fields';
    avg?: GraphQLTypes['claims_avg_fields'];
    count: number;
    max?: GraphQLTypes['claims_max_fields'];
    min?: GraphQLTypes['claims_min_fields'];
    stddev?: GraphQLTypes['claims_stddev_fields'];
    stddev_pop?: GraphQLTypes['claims_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['claims_stddev_samp_fields'];
    sum?: GraphQLTypes['claims_sum_fields'];
    var_pop?: GraphQLTypes['claims_var_pop_fields'];
    var_samp?: GraphQLTypes['claims_var_samp_fields'];
    variance?: GraphQLTypes['claims_variance_fields'];
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
  /** aggregate avg on columns */
  ['claims_avg_fields']: {
    __typename: 'claims_avg_fields';
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
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
  /** input type for incrementing numeric columns in table "claims" */
  ['claims_inc_input']: {
    amount?: GraphQLTypes['numeric'];
    created_by?: GraphQLTypes['bigint'];
    distribution_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    index?: GraphQLTypes['bigint'];
    new_amount?: GraphQLTypes['numeric'];
    updated_by?: GraphQLTypes['bigint'];
    user_id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "claims" */
  ['claims_insert_input']: {
    address?: string;
    amount?: GraphQLTypes['numeric'];
    claimed?: boolean;
    createdByUser?: GraphQLTypes['users_obj_rel_insert_input'];
    created_at?: GraphQLTypes['timestamptz'];
    created_by?: GraphQLTypes['bigint'];
    distribution?: GraphQLTypes['distributions_obj_rel_insert_input'];
    distribution_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    index?: GraphQLTypes['bigint'];
    new_amount?: GraphQLTypes['numeric'];
    proof?: string;
    updatedByUser?: GraphQLTypes['users_obj_rel_insert_input'];
    updated_at?: GraphQLTypes['timestamptz'];
    updated_by?: GraphQLTypes['bigint'];
    user?: GraphQLTypes['users_obj_rel_insert_input'];
    user_id?: GraphQLTypes['bigint'];
  };
  /** aggregate max on columns */
  ['claims_max_fields']: {
    __typename: 'claims_max_fields';
    address?: string;
    amount?: GraphQLTypes['numeric'];
    created_at?: GraphQLTypes['timestamptz'];
    created_by?: GraphQLTypes['bigint'];
    distribution_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    index?: GraphQLTypes['bigint'];
    new_amount?: GraphQLTypes['numeric'];
    proof?: string;
    updated_at?: GraphQLTypes['timestamptz'];
    updated_by?: GraphQLTypes['bigint'];
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
  /** aggregate min on columns */
  ['claims_min_fields']: {
    __typename: 'claims_min_fields';
    address?: string;
    amount?: GraphQLTypes['numeric'];
    created_at?: GraphQLTypes['timestamptz'];
    created_by?: GraphQLTypes['bigint'];
    distribution_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    index?: GraphQLTypes['bigint'];
    new_amount?: GraphQLTypes['numeric'];
    proof?: string;
    updated_at?: GraphQLTypes['timestamptz'];
    updated_by?: GraphQLTypes['bigint'];
    user_id?: GraphQLTypes['bigint'];
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
    address?: string;
    amount?: GraphQLTypes['numeric'];
    claimed?: boolean;
    created_at?: GraphQLTypes['timestamptz'];
    created_by?: GraphQLTypes['bigint'];
    distribution_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    index?: GraphQLTypes['bigint'];
    new_amount?: GraphQLTypes['numeric'];
    proof?: string;
    updated_at?: GraphQLTypes['timestamptz'];
    updated_by?: GraphQLTypes['bigint'];
    user_id?: GraphQLTypes['bigint'];
  };
  /** aggregate stddev on columns */
  ['claims_stddev_fields']: {
    __typename: 'claims_stddev_fields';
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
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
  /** aggregate stddev_pop on columns */
  ['claims_stddev_pop_fields']: {
    __typename: 'claims_stddev_pop_fields';
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
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
  /** aggregate stddev_samp on columns */
  ['claims_stddev_samp_fields']: {
    __typename: 'claims_stddev_samp_fields';
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
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
  /** aggregate sum on columns */
  ['claims_sum_fields']: {
    __typename: 'claims_sum_fields';
    amount?: GraphQLTypes['numeric'];
    created_by?: GraphQLTypes['bigint'];
    distribution_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    index?: GraphQLTypes['bigint'];
    new_amount?: GraphQLTypes['numeric'];
    updated_by?: GraphQLTypes['bigint'];
    user_id?: GraphQLTypes['bigint'];
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
  /** aggregate var_pop on columns */
  ['claims_var_pop_fields']: {
    __typename: 'claims_var_pop_fields';
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
  };
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
  /** aggregate var_samp on columns */
  ['claims_var_samp_fields']: {
    __typename: 'claims_var_samp_fields';
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
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
  /** aggregate variance on columns */
  ['claims_variance_fields']: {
    __typename: 'claims_variance_fields';
    amount?: number;
    created_by?: number;
    distribution_id?: number;
    id?: number;
    index?: number;
    new_amount?: number;
    updated_by?: number;
    user_id?: number;
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
    /** An aggregate relationship */
    claims_aggregate: GraphQLTypes['claims_aggregate'];
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
  /** aggregated selection of "distributions" */
  ['distributions_aggregate']: {
    __typename: 'distributions_aggregate';
    aggregate?: GraphQLTypes['distributions_aggregate_fields'];
    nodes: Array<GraphQLTypes['distributions']>;
  };
  /** aggregate fields of "distributions" */
  ['distributions_aggregate_fields']: {
    __typename: 'distributions_aggregate_fields';
    avg?: GraphQLTypes['distributions_avg_fields'];
    count: number;
    max?: GraphQLTypes['distributions_max_fields'];
    min?: GraphQLTypes['distributions_min_fields'];
    stddev?: GraphQLTypes['distributions_stddev_fields'];
    stddev_pop?: GraphQLTypes['distributions_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['distributions_stddev_samp_fields'];
    sum?: GraphQLTypes['distributions_sum_fields'];
    var_pop?: GraphQLTypes['distributions_var_pop_fields'];
    var_samp?: GraphQLTypes['distributions_var_samp_fields'];
    variance?: GraphQLTypes['distributions_variance_fields'];
  };
  /** append existing jsonb value of filtered columns with new jsonb value */
  ['distributions_append_input']: {
    distribution_json?: GraphQLTypes['jsonb'];
  };
  /** aggregate avg on columns */
  ['distributions_avg_fields']: {
    __typename: 'distributions_avg_fields';
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
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
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  ['distributions_delete_at_path_input']: {
    distribution_json?: Array<string>;
  };
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  ['distributions_delete_elem_input']: {
    distribution_json?: number;
  };
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  ['distributions_delete_key_input']: {
    distribution_json?: string;
  };
  /** input type for incrementing numeric columns in table "distributions" */
  ['distributions_inc_input']: {
    created_by?: GraphQLTypes['bigint'];
    distribution_epoch_id?: GraphQLTypes['bigint'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    total_amount?: GraphQLTypes['numeric'];
    vault_id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "distributions" */
  ['distributions_insert_input']: {
    claims?: GraphQLTypes['claims_arr_rel_insert_input'];
    created_at?: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'];
    distribution_epoch_id?: GraphQLTypes['bigint'];
    distribution_json?: GraphQLTypes['jsonb'];
    epoch?: GraphQLTypes['epochs_obj_rel_insert_input'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    merkle_root?: string;
    saved_on_chain?: boolean;
    total_amount?: GraphQLTypes['numeric'];
    vault?: GraphQLTypes['vaults_obj_rel_insert_input'];
    vault_id?: GraphQLTypes['bigint'];
  };
  /** aggregate max on columns */
  ['distributions_max_fields']: {
    __typename: 'distributions_max_fields';
    created_at?: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'];
    distribution_epoch_id?: GraphQLTypes['bigint'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    merkle_root?: string;
    total_amount?: GraphQLTypes['numeric'];
    vault_id?: GraphQLTypes['bigint'];
  };
  /** aggregate min on columns */
  ['distributions_min_fields']: {
    __typename: 'distributions_min_fields';
    created_at?: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'];
    distribution_epoch_id?: GraphQLTypes['bigint'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    merkle_root?: string;
    total_amount?: GraphQLTypes['numeric'];
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
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  ['distributions_prepend_input']: {
    distribution_json?: GraphQLTypes['jsonb'];
  };
  /** select columns of table "distributions" */
  ['distributions_select_column']: distributions_select_column;
  /** input type for updating data in table "distributions" */
  ['distributions_set_input']: {
    created_at?: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'];
    distribution_epoch_id?: GraphQLTypes['bigint'];
    distribution_json?: GraphQLTypes['jsonb'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    merkle_root?: string;
    saved_on_chain?: boolean;
    total_amount?: GraphQLTypes['numeric'];
    vault_id?: GraphQLTypes['bigint'];
  };
  /** aggregate stddev on columns */
  ['distributions_stddev_fields']: {
    __typename: 'distributions_stddev_fields';
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['distributions_stddev_pop_fields']: {
    __typename: 'distributions_stddev_pop_fields';
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['distributions_stddev_samp_fields']: {
    __typename: 'distributions_stddev_samp_fields';
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** aggregate sum on columns */
  ['distributions_sum_fields']: {
    __typename: 'distributions_sum_fields';
    created_by?: GraphQLTypes['bigint'];
    distribution_epoch_id?: GraphQLTypes['bigint'];
    epoch_id?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    total_amount?: GraphQLTypes['numeric'];
    vault_id?: GraphQLTypes['bigint'];
  };
  /** update columns of table "distributions" */
  ['distributions_update_column']: distributions_update_column;
  /** aggregate var_pop on columns */
  ['distributions_var_pop_fields']: {
    __typename: 'distributions_var_pop_fields';
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** aggregate var_samp on columns */
  ['distributions_var_samp_fields']: {
    __typename: 'distributions_var_samp_fields';
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** aggregate variance on columns */
  ['distributions_variance_fields']: {
    __typename: 'distributions_variance_fields';
    created_by?: number;
    distribution_epoch_id?: number;
    epoch_id?: number;
    id?: number;
    total_amount?: number;
    vault_id?: number;
  };
  /** columns and relationships of "epoches" */
  ['epochs']: {
    __typename: 'epochs';
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An aggregate relationship */
    burns_aggregate: GraphQLTypes['burns_aggregate'];
    /** An object relationship */
    circle?: GraphQLTypes['circles'];
    circle_id: number;
    created_at: GraphQLTypes['timestamp'];
    days?: number;
    end_date: GraphQLTypes['timestamptz'];
    ended: boolean;
    /** An array relationship */
    epoch_pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** An aggregate relationship */
    epoch_pending_token_gifts_aggregate: GraphQLTypes['pending_token_gifts_aggregate'];
    grant: GraphQLTypes['numeric'];
    id: GraphQLTypes['bigint'];
    notified_before_end?: GraphQLTypes['timestamp'];
    notified_end?: GraphQLTypes['timestamp'];
    notified_start?: GraphQLTypes['timestamp'];
    number?: number;
    regift_days: number;
    repeat: number;
    repeat_day_of_month: number;
    start_date: GraphQLTypes['timestamptz'];
    /** An array relationship */
    token_gifts: Array<GraphQLTypes['token_gifts']>;
    /** An aggregate relationship */
    token_gifts_aggregate: GraphQLTypes['token_gifts_aggregate'];
    updated_at: GraphQLTypes['timestamp'];
  };
  /** aggregated selection of "epoches" */
  ['epochs_aggregate']: {
    __typename: 'epochs_aggregate';
    aggregate?: GraphQLTypes['epochs_aggregate_fields'];
    nodes: Array<GraphQLTypes['epochs']>;
  };
  /** aggregate fields of "epoches" */
  ['epochs_aggregate_fields']: {
    __typename: 'epochs_aggregate_fields';
    avg?: GraphQLTypes['epochs_avg_fields'];
    count: number;
    max?: GraphQLTypes['epochs_max_fields'];
    min?: GraphQLTypes['epochs_min_fields'];
    stddev?: GraphQLTypes['epochs_stddev_fields'];
    stddev_pop?: GraphQLTypes['epochs_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['epochs_stddev_samp_fields'];
    sum?: GraphQLTypes['epochs_sum_fields'];
    var_pop?: GraphQLTypes['epochs_var_pop_fields'];
    var_samp?: GraphQLTypes['epochs_var_samp_fields'];
    variance?: GraphQLTypes['epochs_variance_fields'];
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
  /** input type for inserting array relation for remote table "epoches" */
  ['epochs_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['epochs_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['epochs_on_conflict'];
  };
  /** aggregate avg on columns */
  ['epochs_avg_fields']: {
    __typename: 'epochs_avg_fields';
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by avg() on columns of table "epoches" */
  ['epochs_avg_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    regift_days?: GraphQLTypes['order_by'];
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
    regift_days?: GraphQLTypes['Int_comparison_exp'];
    repeat?: GraphQLTypes['Int_comparison_exp'];
    repeat_day_of_month?: GraphQLTypes['Int_comparison_exp'];
    start_date?: GraphQLTypes['timestamptz_comparison_exp'];
    token_gifts?: GraphQLTypes['token_gifts_bool_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** unique or primary key constraints on table "epoches" */
  ['epochs_constraint']: epochs_constraint;
  /** input type for incrementing numeric columns in table "epoches" */
  ['epochs_inc_input']: {
    circle_id?: number;
    days?: number;
    grant?: GraphQLTypes['numeric'];
    id?: GraphQLTypes['bigint'];
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** input type for inserting data into table "epoches" */
  ['epochs_insert_input']: {
    burns?: GraphQLTypes['burns_arr_rel_insert_input'];
    circle?: GraphQLTypes['circles_obj_rel_insert_input'];
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    days?: number;
    end_date?: GraphQLTypes['timestamptz'];
    ended?: boolean;
    epoch_pending_token_gifts?: GraphQLTypes['pending_token_gifts_arr_rel_insert_input'];
    grant?: GraphQLTypes['numeric'];
    id?: GraphQLTypes['bigint'];
    notified_before_end?: GraphQLTypes['timestamp'];
    notified_end?: GraphQLTypes['timestamp'];
    notified_start?: GraphQLTypes['timestamp'];
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
    start_date?: GraphQLTypes['timestamptz'];
    token_gifts?: GraphQLTypes['token_gifts_arr_rel_insert_input'];
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate max on columns */
  ['epochs_max_fields']: {
    __typename: 'epochs_max_fields';
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    days?: number;
    end_date?: GraphQLTypes['timestamptz'];
    grant?: GraphQLTypes['numeric'];
    id?: GraphQLTypes['bigint'];
    notified_before_end?: GraphQLTypes['timestamp'];
    notified_end?: GraphQLTypes['timestamp'];
    notified_start?: GraphQLTypes['timestamp'];
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
    start_date?: GraphQLTypes['timestamptz'];
    updated_at?: GraphQLTypes['timestamp'];
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
    regift_days?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
    start_date?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** aggregate min on columns */
  ['epochs_min_fields']: {
    __typename: 'epochs_min_fields';
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    days?: number;
    end_date?: GraphQLTypes['timestamptz'];
    grant?: GraphQLTypes['numeric'];
    id?: GraphQLTypes['bigint'];
    notified_before_end?: GraphQLTypes['timestamp'];
    notified_end?: GraphQLTypes['timestamp'];
    notified_start?: GraphQLTypes['timestamp'];
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
    start_date?: GraphQLTypes['timestamptz'];
    updated_at?: GraphQLTypes['timestamp'];
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
    regift_days?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
    start_date?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** response of any mutation on the table "epoches" */
  ['epochs_mutation_response']: {
    __typename: 'epochs_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['epochs']>;
  };
  /** input type for inserting object relation for remote table "epoches" */
  ['epochs_obj_rel_insert_input']: {
    data: GraphQLTypes['epochs_insert_input'];
    /** on conflict condition */
    on_conflict?: GraphQLTypes['epochs_on_conflict'];
  };
  /** on conflict condition type for table "epoches" */
  ['epochs_on_conflict']: {
    constraint: GraphQLTypes['epochs_constraint'];
    update_columns: Array<GraphQLTypes['epochs_update_column']>;
    where?: GraphQLTypes['epochs_bool_exp'];
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
    regift_days?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
    start_date?: GraphQLTypes['order_by'];
    token_gifts_aggregate?: GraphQLTypes['token_gifts_aggregate_order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: epochs */
  ['epochs_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "epoches" */
  ['epochs_select_column']: epochs_select_column;
  /** input type for updating data in table "epoches" */
  ['epochs_set_input']: {
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    days?: number;
    end_date?: GraphQLTypes['timestamptz'];
    ended?: boolean;
    grant?: GraphQLTypes['numeric'];
    id?: GraphQLTypes['bigint'];
    notified_before_end?: GraphQLTypes['timestamp'];
    notified_end?: GraphQLTypes['timestamp'];
    notified_start?: GraphQLTypes['timestamp'];
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
    start_date?: GraphQLTypes['timestamptz'];
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate stddev on columns */
  ['epochs_stddev_fields']: {
    __typename: 'epochs_stddev_fields';
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by stddev() on columns of table "epoches" */
  ['epochs_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    regift_days?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['epochs_stddev_pop_fields']: {
    __typename: 'epochs_stddev_pop_fields';
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by stddev_pop() on columns of table "epoches" */
  ['epochs_stddev_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    regift_days?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_samp on columns */
  ['epochs_stddev_samp_fields']: {
    __typename: 'epochs_stddev_samp_fields';
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by stddev_samp() on columns of table "epoches" */
  ['epochs_stddev_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    regift_days?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** aggregate sum on columns */
  ['epochs_sum_fields']: {
    __typename: 'epochs_sum_fields';
    circle_id?: number;
    days?: number;
    grant?: GraphQLTypes['numeric'];
    id?: GraphQLTypes['bigint'];
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by sum() on columns of table "epoches" */
  ['epochs_sum_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    regift_days?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** update columns of table "epoches" */
  ['epochs_update_column']: epochs_update_column;
  /** aggregate var_pop on columns */
  ['epochs_var_pop_fields']: {
    __typename: 'epochs_var_pop_fields';
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by var_pop() on columns of table "epoches" */
  ['epochs_var_pop_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    regift_days?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** aggregate var_samp on columns */
  ['epochs_var_samp_fields']: {
    __typename: 'epochs_var_samp_fields';
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by var_samp() on columns of table "epoches" */
  ['epochs_var_samp_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    regift_days?: GraphQLTypes['order_by'];
    repeat?: GraphQLTypes['order_by'];
    repeat_day_of_month?: GraphQLTypes['order_by'];
  };
  /** aggregate variance on columns */
  ['epochs_variance_fields']: {
    __typename: 'epochs_variance_fields';
    circle_id?: number;
    days?: number;
    grant?: number;
    id?: number;
    number?: number;
    regift_days?: number;
    repeat?: number;
    repeat_day_of_month?: number;
  };
  /** order by variance() on columns of table "epoches" */
  ['epochs_variance_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    days?: GraphQLTypes['order_by'];
    grant?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    number?: GraphQLTypes['order_by'];
    regift_days?: GraphQLTypes['order_by'];
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
  /** aggregated selection of "gift_private" */
  ['gift_private_aggregate']: {
    __typename: 'gift_private_aggregate';
    aggregate?: GraphQLTypes['gift_private_aggregate_fields'];
    nodes: Array<GraphQLTypes['gift_private']>;
  };
  /** aggregate fields of "gift_private" */
  ['gift_private_aggregate_fields']: {
    __typename: 'gift_private_aggregate_fields';
    avg?: GraphQLTypes['gift_private_avg_fields'];
    count: number;
    max?: GraphQLTypes['gift_private_max_fields'];
    min?: GraphQLTypes['gift_private_min_fields'];
    stddev?: GraphQLTypes['gift_private_stddev_fields'];
    stddev_pop?: GraphQLTypes['gift_private_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['gift_private_stddev_samp_fields'];
    sum?: GraphQLTypes['gift_private_sum_fields'];
    var_pop?: GraphQLTypes['gift_private_var_pop_fields'];
    var_samp?: GraphQLTypes['gift_private_var_samp_fields'];
    variance?: GraphQLTypes['gift_private_variance_fields'];
  };
  /** aggregate avg on columns */
  ['gift_private_avg_fields']: {
    __typename: 'gift_private_avg_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
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
  /** input type for incrementing numeric columns in table "gift_private" */
  ['gift_private_inc_input']: {
    gift_id?: GraphQLTypes['bigint'];
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "gift_private" */
  ['gift_private_insert_input']: {
    gift_id?: GraphQLTypes['bigint'];
    note?: string;
    recipient?: GraphQLTypes['users_obj_rel_insert_input'];
    recipient_id?: GraphQLTypes['bigint'];
    sender?: GraphQLTypes['users_obj_rel_insert_input'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** aggregate max on columns */
  ['gift_private_max_fields']: {
    __typename: 'gift_private_max_fields';
    gift_id?: GraphQLTypes['bigint'];
    note?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** aggregate min on columns */
  ['gift_private_min_fields']: {
    __typename: 'gift_private_min_fields';
    gift_id?: GraphQLTypes['bigint'];
    note?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** response of any mutation on the table "gift_private" */
  ['gift_private_mutation_response']: {
    __typename: 'gift_private_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['gift_private']>;
  };
  /** input type for inserting object relation for remote table "gift_private" */
  ['gift_private_obj_rel_insert_input']: {
    data: GraphQLTypes['gift_private_insert_input'];
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
  /** input type for updating data in table "gift_private" */
  ['gift_private_set_input']: {
    gift_id?: GraphQLTypes['bigint'];
    note?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** aggregate stddev on columns */
  ['gift_private_stddev_fields']: {
    __typename: 'gift_private_stddev_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['gift_private_stddev_pop_fields']: {
    __typename: 'gift_private_stddev_pop_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['gift_private_stddev_samp_fields']: {
    __typename: 'gift_private_stddev_samp_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate sum on columns */
  ['gift_private_sum_fields']: {
    __typename: 'gift_private_sum_fields';
    gift_id?: GraphQLTypes['bigint'];
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** aggregate var_pop on columns */
  ['gift_private_var_pop_fields']: {
    __typename: 'gift_private_var_pop_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate var_samp on columns */
  ['gift_private_var_samp_fields']: {
    __typename: 'gift_private_var_samp_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate variance on columns */
  ['gift_private_variance_fields']: {
    __typename: 'gift_private_variance_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** columns and relationships of "histories" */
  ['histories']: {
    __typename: 'histories';
    bio?: string;
    /** An object relationship */
    circle?: GraphQLTypes['circles'];
    circle_id: number;
    created_at?: GraphQLTypes['timestamp'];
    /** An object relationship */
    epoch?: GraphQLTypes['epochs'];
    epoch_id: number;
    id: GraphQLTypes['bigint'];
    updated_at?: GraphQLTypes['timestamp'];
    /** An object relationship */
    user?: GraphQLTypes['users'];
    user_id: number;
  };
  /** aggregated selection of "histories" */
  ['histories_aggregate']: {
    __typename: 'histories_aggregate';
    aggregate?: GraphQLTypes['histories_aggregate_fields'];
    nodes: Array<GraphQLTypes['histories']>;
  };
  /** aggregate fields of "histories" */
  ['histories_aggregate_fields']: {
    __typename: 'histories_aggregate_fields';
    avg?: GraphQLTypes['histories_avg_fields'];
    count: number;
    max?: GraphQLTypes['histories_max_fields'];
    min?: GraphQLTypes['histories_min_fields'];
    stddev?: GraphQLTypes['histories_stddev_fields'];
    stddev_pop?: GraphQLTypes['histories_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['histories_stddev_samp_fields'];
    sum?: GraphQLTypes['histories_sum_fields'];
    var_pop?: GraphQLTypes['histories_var_pop_fields'];
    var_samp?: GraphQLTypes['histories_var_samp_fields'];
    variance?: GraphQLTypes['histories_variance_fields'];
  };
  /** aggregate avg on columns */
  ['histories_avg_fields']: {
    __typename: 'histories_avg_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** Boolean expression to filter rows from the table "histories". All fields are combined with a logical 'AND'. */
  ['histories_bool_exp']: {
    _and?: Array<GraphQLTypes['histories_bool_exp']>;
    _not?: GraphQLTypes['histories_bool_exp'];
    _or?: Array<GraphQLTypes['histories_bool_exp']>;
    bio?: GraphQLTypes['String_comparison_exp'];
    circle?: GraphQLTypes['circles_bool_exp'];
    circle_id?: GraphQLTypes['Int_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    epoch?: GraphQLTypes['epochs_bool_exp'];
    epoch_id?: GraphQLTypes['Int_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
    user?: GraphQLTypes['users_bool_exp'];
    user_id?: GraphQLTypes['Int_comparison_exp'];
  };
  /** unique or primary key constraints on table "histories" */
  ['histories_constraint']: histories_constraint;
  /** input type for incrementing numeric columns in table "histories" */
  ['histories_inc_input']: {
    circle_id?: number;
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    user_id?: number;
  };
  /** input type for inserting data into table "histories" */
  ['histories_insert_input']: {
    bio?: string;
    circle?: GraphQLTypes['circles_obj_rel_insert_input'];
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    epoch?: GraphQLTypes['epochs_obj_rel_insert_input'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    updated_at?: GraphQLTypes['timestamp'];
    user?: GraphQLTypes['users_obj_rel_insert_input'];
    user_id?: number;
  };
  /** aggregate max on columns */
  ['histories_max_fields']: {
    __typename: 'histories_max_fields';
    bio?: string;
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: number;
  };
  /** aggregate min on columns */
  ['histories_min_fields']: {
    __typename: 'histories_min_fields';
    bio?: string;
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: number;
  };
  /** response of any mutation on the table "histories" */
  ['histories_mutation_response']: {
    __typename: 'histories_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['histories']>;
  };
  /** on conflict condition type for table "histories" */
  ['histories_on_conflict']: {
    constraint: GraphQLTypes['histories_constraint'];
    update_columns: Array<GraphQLTypes['histories_update_column']>;
    where?: GraphQLTypes['histories_bool_exp'];
  };
  /** Ordering options when selecting data from "histories". */
  ['histories_order_by']: {
    bio?: GraphQLTypes['order_by'];
    circle?: GraphQLTypes['circles_order_by'];
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    epoch?: GraphQLTypes['epochs_order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user?: GraphQLTypes['users_order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: histories */
  ['histories_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "histories" */
  ['histories_select_column']: histories_select_column;
  /** input type for updating data in table "histories" */
  ['histories_set_input']: {
    bio?: string;
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: number;
  };
  /** aggregate stddev on columns */
  ['histories_stddev_fields']: {
    __typename: 'histories_stddev_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['histories_stddev_pop_fields']: {
    __typename: 'histories_stddev_pop_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['histories_stddev_samp_fields']: {
    __typename: 'histories_stddev_samp_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** aggregate sum on columns */
  ['histories_sum_fields']: {
    __typename: 'histories_sum_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    user_id?: number;
  };
  /** update columns of table "histories" */
  ['histories_update_column']: histories_update_column;
  /** aggregate var_pop on columns */
  ['histories_var_pop_fields']: {
    __typename: 'histories_var_pop_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** aggregate var_samp on columns */
  ['histories_var_samp_fields']: {
    __typename: 'histories_var_samp_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
  /** aggregate variance on columns */
  ['histories_variance_fields']: {
    __typename: 'histories_variance_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    user_id?: number;
  };
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
    /** delete data from the table: "burns" */
    delete_burns?: GraphQLTypes['burns_mutation_response'];
    /** delete single row from the table: "burns" */
    delete_burns_by_pk?: GraphQLTypes['burns'];
    /** delete data from the table: "circle_integrations" */
    delete_circle_integrations?: GraphQLTypes['circle_integrations_mutation_response'];
    /** delete single row from the table: "circle_integrations" */
    delete_circle_integrations_by_pk?: GraphQLTypes['circle_integrations'];
    /** delete data from the table: "circle_metadata" */
    delete_circle_metadata?: GraphQLTypes['circle_metadata_mutation_response'];
    /** delete single row from the table: "circle_metadata" */
    delete_circle_metadata_by_pk?: GraphQLTypes['circle_metadata'];
    /** delete data from the table: "circle_private" */
    delete_circle_private?: GraphQLTypes['circle_private_mutation_response'];
    /** delete data from the table: "circles" */
    delete_circles?: GraphQLTypes['circles_mutation_response'];
    /** delete single row from the table: "circles" */
    delete_circles_by_pk?: GraphQLTypes['circles'];
    /** delete data from the table: "claims" */
    delete_claims?: GraphQLTypes['claims_mutation_response'];
    /** delete single row from the table: "claims" */
    delete_claims_by_pk?: GraphQLTypes['claims'];
    /** delete data from the table: "distributions" */
    delete_distributions?: GraphQLTypes['distributions_mutation_response'];
    /** delete single row from the table: "distributions" */
    delete_distributions_by_pk?: GraphQLTypes['distributions'];
    /** delete data from the table: "epoches" */
    delete_epochs?: GraphQLTypes['epochs_mutation_response'];
    /** delete single row from the table: "epoches" */
    delete_epochs_by_pk?: GraphQLTypes['epochs'];
    /** delete data from the table: "gift_private" */
    delete_gift_private?: GraphQLTypes['gift_private_mutation_response'];
    /** delete data from the table: "histories" */
    delete_histories?: GraphQLTypes['histories_mutation_response'];
    /** delete single row from the table: "histories" */
    delete_histories_by_pk?: GraphQLTypes['histories'];
    /** delete data from the table: "nominees" */
    delete_nominees?: GraphQLTypes['nominees_mutation_response'];
    /** delete single row from the table: "nominees" */
    delete_nominees_by_pk?: GraphQLTypes['nominees'];
    /** delete data from the table: "protocols" */
    delete_organizations?: GraphQLTypes['organizations_mutation_response'];
    /** delete single row from the table: "protocols" */
    delete_organizations_by_pk?: GraphQLTypes['organizations'];
    /** delete data from the table: "pending_gift_private" */
    delete_pending_gift_private?: GraphQLTypes['pending_gift_private_mutation_response'];
    /** delete data from the table: "pending_token_gifts" */
    delete_pending_token_gifts?: GraphQLTypes['pending_token_gifts_mutation_response'];
    /** delete single row from the table: "pending_token_gifts" */
    delete_pending_token_gifts_by_pk?: GraphQLTypes['pending_token_gifts'];
    /** delete data from the table: "personal_access_tokens" */
    delete_personal_access_tokens?: GraphQLTypes['personal_access_tokens_mutation_response'];
    /** delete single row from the table: "personal_access_tokens" */
    delete_personal_access_tokens_by_pk?: GraphQLTypes['personal_access_tokens'];
    /** delete data from the table: "profiles" */
    delete_profiles?: GraphQLTypes['profiles_mutation_response'];
    /** delete single row from the table: "profiles" */
    delete_profiles_by_pk?: GraphQLTypes['profiles'];
    /** delete data from the table: "teammates" */
    delete_teammates?: GraphQLTypes['teammates_mutation_response'];
    /** delete single row from the table: "teammates" */
    delete_teammates_by_pk?: GraphQLTypes['teammates'];
    /** delete data from the table: "token_gifts" */
    delete_token_gifts?: GraphQLTypes['token_gifts_mutation_response'];
    /** delete single row from the table: "token_gifts" */
    delete_token_gifts_by_pk?: GraphQLTypes['token_gifts'];
    /** delete data from the table: "users" */
    delete_users?: GraphQLTypes['users_mutation_response'];
    /** delete single row from the table: "users" */
    delete_users_by_pk?: GraphQLTypes['users'];
    /** delete data from the table: "vault_transactions" */
    delete_vault_transactions?: GraphQLTypes['vault_transactions_mutation_response'];
    /** delete single row from the table: "vault_transactions" */
    delete_vault_transactions_by_pk?: GraphQLTypes['vault_transactions'];
    /** delete data from the table: "vaults" */
    delete_vaults?: GraphQLTypes['vaults_mutation_response'];
    /** delete single row from the table: "vaults" */
    delete_vaults_by_pk?: GraphQLTypes['vaults'];
    /** delete data from the table: "vouches" */
    delete_vouches?: GraphQLTypes['vouches_mutation_response'];
    /** delete single row from the table: "vouches" */
    delete_vouches_by_pk?: GraphQLTypes['vouches'];
    /** insert data into the table: "burns" */
    insert_burns?: GraphQLTypes['burns_mutation_response'];
    /** insert a single row into the table: "burns" */
    insert_burns_one?: GraphQLTypes['burns'];
    /** insert data into the table: "circle_integrations" */
    insert_circle_integrations?: GraphQLTypes['circle_integrations_mutation_response'];
    /** insert a single row into the table: "circle_integrations" */
    insert_circle_integrations_one?: GraphQLTypes['circle_integrations'];
    /** insert data into the table: "circle_metadata" */
    insert_circle_metadata?: GraphQLTypes['circle_metadata_mutation_response'];
    /** insert a single row into the table: "circle_metadata" */
    insert_circle_metadata_one?: GraphQLTypes['circle_metadata'];
    /** insert data into the table: "circle_private" */
    insert_circle_private?: GraphQLTypes['circle_private_mutation_response'];
    /** insert a single row into the table: "circle_private" */
    insert_circle_private_one?: GraphQLTypes['circle_private'];
    /** insert data into the table: "circles" */
    insert_circles?: GraphQLTypes['circles_mutation_response'];
    /** insert a single row into the table: "circles" */
    insert_circles_one?: GraphQLTypes['circles'];
    /** insert data into the table: "claims" */
    insert_claims?: GraphQLTypes['claims_mutation_response'];
    /** insert a single row into the table: "claims" */
    insert_claims_one?: GraphQLTypes['claims'];
    /** insert data into the table: "distributions" */
    insert_distributions?: GraphQLTypes['distributions_mutation_response'];
    /** insert a single row into the table: "distributions" */
    insert_distributions_one?: GraphQLTypes['distributions'];
    /** insert data into the table: "epoches" */
    insert_epochs?: GraphQLTypes['epochs_mutation_response'];
    /** insert a single row into the table: "epoches" */
    insert_epochs_one?: GraphQLTypes['epochs'];
    /** insert data into the table: "gift_private" */
    insert_gift_private?: GraphQLTypes['gift_private_mutation_response'];
    /** insert a single row into the table: "gift_private" */
    insert_gift_private_one?: GraphQLTypes['gift_private'];
    /** insert data into the table: "histories" */
    insert_histories?: GraphQLTypes['histories_mutation_response'];
    /** insert a single row into the table: "histories" */
    insert_histories_one?: GraphQLTypes['histories'];
    /** insert data into the table: "nominees" */
    insert_nominees?: GraphQLTypes['nominees_mutation_response'];
    /** insert a single row into the table: "nominees" */
    insert_nominees_one?: GraphQLTypes['nominees'];
    /** insert data into the table: "protocols" */
    insert_organizations?: GraphQLTypes['organizations_mutation_response'];
    /** insert a single row into the table: "protocols" */
    insert_organizations_one?: GraphQLTypes['organizations'];
    /** insert data into the table: "pending_gift_private" */
    insert_pending_gift_private?: GraphQLTypes['pending_gift_private_mutation_response'];
    /** insert a single row into the table: "pending_gift_private" */
    insert_pending_gift_private_one?: GraphQLTypes['pending_gift_private'];
    /** insert data into the table: "pending_token_gifts" */
    insert_pending_token_gifts?: GraphQLTypes['pending_token_gifts_mutation_response'];
    /** insert a single row into the table: "pending_token_gifts" */
    insert_pending_token_gifts_one?: GraphQLTypes['pending_token_gifts'];
    /** insert data into the table: "personal_access_tokens" */
    insert_personal_access_tokens?: GraphQLTypes['personal_access_tokens_mutation_response'];
    /** insert a single row into the table: "personal_access_tokens" */
    insert_personal_access_tokens_one?: GraphQLTypes['personal_access_tokens'];
    /** insert data into the table: "profiles" */
    insert_profiles?: GraphQLTypes['profiles_mutation_response'];
    /** insert a single row into the table: "profiles" */
    insert_profiles_one?: GraphQLTypes['profiles'];
    /** insert data into the table: "teammates" */
    insert_teammates?: GraphQLTypes['teammates_mutation_response'];
    /** insert a single row into the table: "teammates" */
    insert_teammates_one?: GraphQLTypes['teammates'];
    /** insert data into the table: "token_gifts" */
    insert_token_gifts?: GraphQLTypes['token_gifts_mutation_response'];
    /** insert a single row into the table: "token_gifts" */
    insert_token_gifts_one?: GraphQLTypes['token_gifts'];
    /** insert data into the table: "users" */
    insert_users?: GraphQLTypes['users_mutation_response'];
    /** insert a single row into the table: "users" */
    insert_users_one?: GraphQLTypes['users'];
    /** insert data into the table: "vault_transactions" */
    insert_vault_transactions?: GraphQLTypes['vault_transactions_mutation_response'];
    /** insert a single row into the table: "vault_transactions" */
    insert_vault_transactions_one?: GraphQLTypes['vault_transactions'];
    /** insert data into the table: "vaults" */
    insert_vaults?: GraphQLTypes['vaults_mutation_response'];
    /** insert a single row into the table: "vaults" */
    insert_vaults_one?: GraphQLTypes['vaults'];
    /** insert data into the table: "vouches" */
    insert_vouches?: GraphQLTypes['vouches_mutation_response'];
    /** insert a single row into the table: "vouches" */
    insert_vouches_one?: GraphQLTypes['vouches'];
    logoutUser?: GraphQLTypes['LogoutResponse'];
    updateAllocations?: GraphQLTypes['AllocationsResponse'];
    updateCircle?: GraphQLTypes['UpdateCircleOutput'];
    updateEpoch?: GraphQLTypes['EpochResponse'];
    updateTeammates?: GraphQLTypes['UpdateTeammatesResponse'];
    /** Update own user */
    updateUser?: GraphQLTypes['UserResponse'];
    /** update data of the table: "burns" */
    update_burns?: GraphQLTypes['burns_mutation_response'];
    /** update single row of the table: "burns" */
    update_burns_by_pk?: GraphQLTypes['burns'];
    /** update data of the table: "circle_integrations" */
    update_circle_integrations?: GraphQLTypes['circle_integrations_mutation_response'];
    /** update single row of the table: "circle_integrations" */
    update_circle_integrations_by_pk?: GraphQLTypes['circle_integrations'];
    /** update data of the table: "circle_metadata" */
    update_circle_metadata?: GraphQLTypes['circle_metadata_mutation_response'];
    /** update single row of the table: "circle_metadata" */
    update_circle_metadata_by_pk?: GraphQLTypes['circle_metadata'];
    /** update data of the table: "circle_private" */
    update_circle_private?: GraphQLTypes['circle_private_mutation_response'];
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
    /** update data of the table: "epoches" */
    update_epochs?: GraphQLTypes['epochs_mutation_response'];
    /** update single row of the table: "epoches" */
    update_epochs_by_pk?: GraphQLTypes['epochs'];
    /** update data of the table: "gift_private" */
    update_gift_private?: GraphQLTypes['gift_private_mutation_response'];
    /** update data of the table: "histories" */
    update_histories?: GraphQLTypes['histories_mutation_response'];
    /** update single row of the table: "histories" */
    update_histories_by_pk?: GraphQLTypes['histories'];
    /** update data of the table: "nominees" */
    update_nominees?: GraphQLTypes['nominees_mutation_response'];
    /** update single row of the table: "nominees" */
    update_nominees_by_pk?: GraphQLTypes['nominees'];
    /** update data of the table: "protocols" */
    update_organizations?: GraphQLTypes['organizations_mutation_response'];
    /** update single row of the table: "protocols" */
    update_organizations_by_pk?: GraphQLTypes['organizations'];
    /** update data of the table: "pending_gift_private" */
    update_pending_gift_private?: GraphQLTypes['pending_gift_private_mutation_response'];
    /** update data of the table: "pending_token_gifts" */
    update_pending_token_gifts?: GraphQLTypes['pending_token_gifts_mutation_response'];
    /** update single row of the table: "pending_token_gifts" */
    update_pending_token_gifts_by_pk?: GraphQLTypes['pending_token_gifts'];
    /** update data of the table: "personal_access_tokens" */
    update_personal_access_tokens?: GraphQLTypes['personal_access_tokens_mutation_response'];
    /** update single row of the table: "personal_access_tokens" */
    update_personal_access_tokens_by_pk?: GraphQLTypes['personal_access_tokens'];
    /** update data of the table: "profiles" */
    update_profiles?: GraphQLTypes['profiles_mutation_response'];
    /** update single row of the table: "profiles" */
    update_profiles_by_pk?: GraphQLTypes['profiles'];
    /** update data of the table: "teammates" */
    update_teammates?: GraphQLTypes['teammates_mutation_response'];
    /** update single row of the table: "teammates" */
    update_teammates_by_pk?: GraphQLTypes['teammates'];
    /** update data of the table: "token_gifts" */
    update_token_gifts?: GraphQLTypes['token_gifts_mutation_response'];
    /** update single row of the table: "token_gifts" */
    update_token_gifts_by_pk?: GraphQLTypes['token_gifts'];
    /** update data of the table: "users" */
    update_users?: GraphQLTypes['users_mutation_response'];
    /** update single row of the table: "users" */
    update_users_by_pk?: GraphQLTypes['users'];
    /** update data of the table: "vault_transactions" */
    update_vault_transactions?: GraphQLTypes['vault_transactions_mutation_response'];
    /** update single row of the table: "vault_transactions" */
    update_vault_transactions_by_pk?: GraphQLTypes['vault_transactions'];
    /** update data of the table: "vaults" */
    update_vaults?: GraphQLTypes['vaults_mutation_response'];
    /** update single row of the table: "vaults" */
    update_vaults_by_pk?: GraphQLTypes['vaults'];
    /** update data of the table: "vouches" */
    update_vouches?: GraphQLTypes['vouches_mutation_response'];
    /** update single row of the table: "vouches" */
    update_vouches_by_pk?: GraphQLTypes['vouches'];
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
    /** An aggregate relationship */
    nominations_aggregate: GraphQLTypes['vouches_aggregate'];
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
  /** input type for inserting array relation for remote table "nominees" */
  ['nominees_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['nominees_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['nominees_on_conflict'];
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
  /** unique or primary key constraints on table "nominees" */
  ['nominees_constraint']: nominees_constraint;
  /** input type for incrementing numeric columns in table "nominees" */
  ['nominees_inc_input']: {
    circle_id?: number;
    id?: GraphQLTypes['bigint'];
    nominated_by_user_id?: number;
    user_id?: number;
    vouches_required?: number;
  };
  /** input type for inserting data into table "nominees" */
  ['nominees_insert_input']: {
    address?: string;
    circle?: GraphQLTypes['circles_obj_rel_insert_input'];
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    description?: string;
    ended?: boolean;
    expiry_date?: GraphQLTypes['date'];
    id?: GraphQLTypes['bigint'];
    name?: string;
    nominated_by_user_id?: number;
    nominated_date?: GraphQLTypes['date'];
    nominations?: GraphQLTypes['vouches_arr_rel_insert_input'];
    nominator?: GraphQLTypes['users_obj_rel_insert_input'];
    updated_at?: GraphQLTypes['timestamp'];
    user?: GraphQLTypes['users_obj_rel_insert_input'];
    user_id?: number;
    vouches_required?: number;
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
  /** response of any mutation on the table "nominees" */
  ['nominees_mutation_response']: {
    __typename: 'nominees_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['nominees']>;
  };
  /** input type for inserting object relation for remote table "nominees" */
  ['nominees_obj_rel_insert_input']: {
    data: GraphQLTypes['nominees_insert_input'];
    /** on conflict condition */
    on_conflict?: GraphQLTypes['nominees_on_conflict'];
  };
  /** on conflict condition type for table "nominees" */
  ['nominees_on_conflict']: {
    constraint: GraphQLTypes['nominees_constraint'];
    update_columns: Array<GraphQLTypes['nominees_update_column']>;
    where?: GraphQLTypes['nominees_bool_exp'];
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
  /** primary key columns input for table: nominees */
  ['nominees_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "nominees" */
  ['nominees_select_column']: nominees_select_column;
  /** input type for updating data in table "nominees" */
  ['nominees_set_input']: {
    address?: string;
    circle_id?: number;
    created_at?: GraphQLTypes['timestamp'];
    description?: string;
    ended?: boolean;
    expiry_date?: GraphQLTypes['date'];
    id?: GraphQLTypes['bigint'];
    name?: string;
    nominated_by_user_id?: number;
    nominated_date?: GraphQLTypes['date'];
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: number;
    vouches_required?: number;
  };
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
  /** update columns of table "nominees" */
  ['nominees_update_column']: nominees_update_column;
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
    /** An aggregate relationship */
    circles_aggregate: GraphQLTypes['circles_aggregate'];
    created_at?: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    is_verified: boolean;
    name: string;
    telegram_id?: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregated selection of "protocols" */
  ['organizations_aggregate']: {
    __typename: 'organizations_aggregate';
    aggregate?: GraphQLTypes['organizations_aggregate_fields'];
    nodes: Array<GraphQLTypes['organizations']>;
  };
  /** aggregate fields of "protocols" */
  ['organizations_aggregate_fields']: {
    __typename: 'organizations_aggregate_fields';
    avg?: GraphQLTypes['organizations_avg_fields'];
    count: number;
    max?: GraphQLTypes['organizations_max_fields'];
    min?: GraphQLTypes['organizations_min_fields'];
    stddev?: GraphQLTypes['organizations_stddev_fields'];
    stddev_pop?: GraphQLTypes['organizations_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['organizations_stddev_samp_fields'];
    sum?: GraphQLTypes['organizations_sum_fields'];
    var_pop?: GraphQLTypes['organizations_var_pop_fields'];
    var_samp?: GraphQLTypes['organizations_var_samp_fields'];
    variance?: GraphQLTypes['organizations_variance_fields'];
  };
  /** aggregate avg on columns */
  ['organizations_avg_fields']: {
    __typename: 'organizations_avg_fields';
    id?: number;
  };
  /** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
  ['organizations_bool_exp']: {
    _and?: Array<GraphQLTypes['organizations_bool_exp']>;
    _not?: GraphQLTypes['organizations_bool_exp'];
    _or?: Array<GraphQLTypes['organizations_bool_exp']>;
    circles?: GraphQLTypes['circles_bool_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    is_verified?: GraphQLTypes['Boolean_comparison_exp'];
    name?: GraphQLTypes['String_comparison_exp'];
    telegram_id?: GraphQLTypes['String_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** unique or primary key constraints on table "protocols" */
  ['organizations_constraint']: organizations_constraint;
  /** input type for incrementing numeric columns in table "protocols" */
  ['organizations_inc_input']: {
    id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "protocols" */
  ['organizations_insert_input']: {
    circles?: GraphQLTypes['circles_arr_rel_insert_input'];
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    is_verified?: boolean;
    name?: string;
    telegram_id?: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate max on columns */
  ['organizations_max_fields']: {
    __typename: 'organizations_max_fields';
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    name?: string;
    telegram_id?: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate min on columns */
  ['organizations_min_fields']: {
    __typename: 'organizations_min_fields';
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    name?: string;
    telegram_id?: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** response of any mutation on the table "protocols" */
  ['organizations_mutation_response']: {
    __typename: 'organizations_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['organizations']>;
  };
  /** input type for inserting object relation for remote table "protocols" */
  ['organizations_obj_rel_insert_input']: {
    data: GraphQLTypes['organizations_insert_input'];
    /** on conflict condition */
    on_conflict?: GraphQLTypes['organizations_on_conflict'];
  };
  /** on conflict condition type for table "protocols" */
  ['organizations_on_conflict']: {
    constraint: GraphQLTypes['organizations_constraint'];
    update_columns: Array<GraphQLTypes['organizations_update_column']>;
    where?: GraphQLTypes['organizations_bool_exp'];
  };
  /** Ordering options when selecting data from "protocols". */
  ['organizations_order_by']: {
    circles_aggregate?: GraphQLTypes['circles_aggregate_order_by'];
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    is_verified?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    telegram_id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: organizations */
  ['organizations_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "protocols" */
  ['organizations_select_column']: organizations_select_column;
  /** input type for updating data in table "protocols" */
  ['organizations_set_input']: {
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    is_verified?: boolean;
    name?: string;
    telegram_id?: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate stddev on columns */
  ['organizations_stddev_fields']: {
    __typename: 'organizations_stddev_fields';
    id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['organizations_stddev_pop_fields']: {
    __typename: 'organizations_stddev_pop_fields';
    id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['organizations_stddev_samp_fields']: {
    __typename: 'organizations_stddev_samp_fields';
    id?: number;
  };
  /** aggregate sum on columns */
  ['organizations_sum_fields']: {
    __typename: 'organizations_sum_fields';
    id?: GraphQLTypes['bigint'];
  };
  /** update columns of table "protocols" */
  ['organizations_update_column']: organizations_update_column;
  /** aggregate var_pop on columns */
  ['organizations_var_pop_fields']: {
    __typename: 'organizations_var_pop_fields';
    id?: number;
  };
  /** aggregate var_samp on columns */
  ['organizations_var_samp_fields']: {
    __typename: 'organizations_var_samp_fields';
    id?: number;
  };
  /** aggregate variance on columns */
  ['organizations_variance_fields']: {
    __typename: 'organizations_variance_fields';
    id?: number;
  };
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
  /** aggregated selection of "pending_gift_private" */
  ['pending_gift_private_aggregate']: {
    __typename: 'pending_gift_private_aggregate';
    aggregate?: GraphQLTypes['pending_gift_private_aggregate_fields'];
    nodes: Array<GraphQLTypes['pending_gift_private']>;
  };
  /** aggregate fields of "pending_gift_private" */
  ['pending_gift_private_aggregate_fields']: {
    __typename: 'pending_gift_private_aggregate_fields';
    avg?: GraphQLTypes['pending_gift_private_avg_fields'];
    count: number;
    max?: GraphQLTypes['pending_gift_private_max_fields'];
    min?: GraphQLTypes['pending_gift_private_min_fields'];
    stddev?: GraphQLTypes['pending_gift_private_stddev_fields'];
    stddev_pop?: GraphQLTypes['pending_gift_private_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['pending_gift_private_stddev_samp_fields'];
    sum?: GraphQLTypes['pending_gift_private_sum_fields'];
    var_pop?: GraphQLTypes['pending_gift_private_var_pop_fields'];
    var_samp?: GraphQLTypes['pending_gift_private_var_samp_fields'];
    variance?: GraphQLTypes['pending_gift_private_variance_fields'];
  };
  /** aggregate avg on columns */
  ['pending_gift_private_avg_fields']: {
    __typename: 'pending_gift_private_avg_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
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
  /** input type for incrementing numeric columns in table "pending_gift_private" */
  ['pending_gift_private_inc_input']: {
    gift_id?: GraphQLTypes['bigint'];
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "pending_gift_private" */
  ['pending_gift_private_insert_input']: {
    gift_id?: GraphQLTypes['bigint'];
    note?: string;
    recipient?: GraphQLTypes['users_obj_rel_insert_input'];
    recipient_id?: GraphQLTypes['bigint'];
    sender?: GraphQLTypes['users_obj_rel_insert_input'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** aggregate max on columns */
  ['pending_gift_private_max_fields']: {
    __typename: 'pending_gift_private_max_fields';
    gift_id?: GraphQLTypes['bigint'];
    note?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** aggregate min on columns */
  ['pending_gift_private_min_fields']: {
    __typename: 'pending_gift_private_min_fields';
    gift_id?: GraphQLTypes['bigint'];
    note?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** response of any mutation on the table "pending_gift_private" */
  ['pending_gift_private_mutation_response']: {
    __typename: 'pending_gift_private_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['pending_gift_private']>;
  };
  /** input type for inserting object relation for remote table "pending_gift_private" */
  ['pending_gift_private_obj_rel_insert_input']: {
    data: GraphQLTypes['pending_gift_private_insert_input'];
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
  /** input type for updating data in table "pending_gift_private" */
  ['pending_gift_private_set_input']: {
    gift_id?: GraphQLTypes['bigint'];
    note?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** aggregate stddev on columns */
  ['pending_gift_private_stddev_fields']: {
    __typename: 'pending_gift_private_stddev_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['pending_gift_private_stddev_pop_fields']: {
    __typename: 'pending_gift_private_stddev_pop_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['pending_gift_private_stddev_samp_fields']: {
    __typename: 'pending_gift_private_stddev_samp_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate sum on columns */
  ['pending_gift_private_sum_fields']: {
    __typename: 'pending_gift_private_sum_fields';
    gift_id?: GraphQLTypes['bigint'];
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
  };
  /** aggregate var_pop on columns */
  ['pending_gift_private_var_pop_fields']: {
    __typename: 'pending_gift_private_var_pop_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate var_samp on columns */
  ['pending_gift_private_var_samp_fields']: {
    __typename: 'pending_gift_private_var_samp_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
  /** aggregate variance on columns */
  ['pending_gift_private_variance_fields']: {
    __typename: 'pending_gift_private_variance_fields';
    gift_id?: number;
    recipient_id?: number;
    sender_id?: number;
  };
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
    note?: string;
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
  /** aggregated selection of "pending_token_gifts" */
  ['pending_token_gifts_aggregate']: {
    __typename: 'pending_token_gifts_aggregate';
    aggregate?: GraphQLTypes['pending_token_gifts_aggregate_fields'];
    nodes: Array<GraphQLTypes['pending_token_gifts']>;
  };
  /** aggregate fields of "pending_token_gifts" */
  ['pending_token_gifts_aggregate_fields']: {
    __typename: 'pending_token_gifts_aggregate_fields';
    avg?: GraphQLTypes['pending_token_gifts_avg_fields'];
    count: number;
    max?: GraphQLTypes['pending_token_gifts_max_fields'];
    min?: GraphQLTypes['pending_token_gifts_min_fields'];
    stddev?: GraphQLTypes['pending_token_gifts_stddev_fields'];
    stddev_pop?: GraphQLTypes['pending_token_gifts_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['pending_token_gifts_stddev_samp_fields'];
    sum?: GraphQLTypes['pending_token_gifts_sum_fields'];
    var_pop?: GraphQLTypes['pending_token_gifts_var_pop_fields'];
    var_samp?: GraphQLTypes['pending_token_gifts_var_samp_fields'];
    variance?: GraphQLTypes['pending_token_gifts_variance_fields'];
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
  /** input type for inserting array relation for remote table "pending_token_gifts" */
  ['pending_token_gifts_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['pending_token_gifts_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['pending_token_gifts_on_conflict'];
  };
  /** aggregate avg on columns */
  ['pending_token_gifts_avg_fields']: {
    __typename: 'pending_token_gifts_avg_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
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
    note?: GraphQLTypes['String_comparison_exp'];
    recipient?: GraphQLTypes['users_bool_exp'];
    recipient_address?: GraphQLTypes['String_comparison_exp'];
    recipient_id?: GraphQLTypes['bigint_comparison_exp'];
    sender?: GraphQLTypes['users_bool_exp'];
    sender_address?: GraphQLTypes['String_comparison_exp'];
    sender_id?: GraphQLTypes['bigint_comparison_exp'];
    tokens?: GraphQLTypes['Int_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** unique or primary key constraints on table "pending_token_gifts" */
  ['pending_token_gifts_constraint']: pending_token_gifts_constraint;
  /** input type for incrementing numeric columns in table "pending_token_gifts" */
  ['pending_token_gifts_inc_input']: {
    circle_id?: GraphQLTypes['bigint'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
  };
  /** input type for inserting data into table "pending_token_gifts" */
  ['pending_token_gifts_insert_input']: {
    circle?: GraphQLTypes['circles_obj_rel_insert_input'];
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created?: GraphQLTypes['timestamp'];
    epoch?: GraphQLTypes['epochs_obj_rel_insert_input'];
    epoch_id?: number;
    gift_private?: GraphQLTypes['pending_gift_private_obj_rel_insert_input'];
    id?: GraphQLTypes['bigint'];
    note?: string;
    recipient?: GraphQLTypes['users_obj_rel_insert_input'];
    recipient_address?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender?: GraphQLTypes['users_obj_rel_insert_input'];
    sender_address?: string;
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate max on columns */
  ['pending_token_gifts_max_fields']: {
    __typename: 'pending_token_gifts_max_fields';
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    note?: string;
    recipient_address?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_address?: string;
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** order by max() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_max_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    dts_created?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    note?: GraphQLTypes['order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** aggregate min on columns */
  ['pending_token_gifts_min_fields']: {
    __typename: 'pending_token_gifts_min_fields';
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    note?: string;
    recipient_address?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_address?: string;
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** order by min() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_min_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    dts_created?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    note?: GraphQLTypes['order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** response of any mutation on the table "pending_token_gifts" */
  ['pending_token_gifts_mutation_response']: {
    __typename: 'pending_token_gifts_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['pending_token_gifts']>;
  };
  /** on conflict condition type for table "pending_token_gifts" */
  ['pending_token_gifts_on_conflict']: {
    constraint: GraphQLTypes['pending_token_gifts_constraint'];
    update_columns: Array<GraphQLTypes['pending_token_gifts_update_column']>;
    where?: GraphQLTypes['pending_token_gifts_bool_exp'];
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
    note?: GraphQLTypes['order_by'];
    recipient?: GraphQLTypes['users_order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender?: GraphQLTypes['users_order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: pending_token_gifts */
  ['pending_token_gifts_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "pending_token_gifts" */
  ['pending_token_gifts_select_column']: pending_token_gifts_select_column;
  /** input type for updating data in table "pending_token_gifts" */
  ['pending_token_gifts_set_input']: {
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    note?: string;
    recipient_address?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_address?: string;
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate stddev on columns */
  ['pending_token_gifts_stddev_fields']: {
    __typename: 'pending_token_gifts_stddev_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
  };
  /** order by stddev() on columns of table "pending_token_gifts" */
  ['pending_token_gifts_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    epoch_id?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['pending_token_gifts_stddev_pop_fields']: {
    __typename: 'pending_token_gifts_stddev_pop_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
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
  /** aggregate stddev_samp on columns */
  ['pending_token_gifts_stddev_samp_fields']: {
    __typename: 'pending_token_gifts_stddev_samp_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
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
  /** aggregate sum on columns */
  ['pending_token_gifts_sum_fields']: {
    __typename: 'pending_token_gifts_sum_fields';
    circle_id?: GraphQLTypes['bigint'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
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
  /** update columns of table "pending_token_gifts" */
  ['pending_token_gifts_update_column']: pending_token_gifts_update_column;
  /** aggregate var_pop on columns */
  ['pending_token_gifts_var_pop_fields']: {
    __typename: 'pending_token_gifts_var_pop_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
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
  /** aggregate var_samp on columns */
  ['pending_token_gifts_var_samp_fields']: {
    __typename: 'pending_token_gifts_var_samp_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
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
  /** aggregate variance on columns */
  ['pending_token_gifts_variance_fields']: {
    __typename: 'pending_token_gifts_variance_fields';
    circle_id?: number;
    epoch_id?: number;
    id?: number;
    recipient_id?: number;
    sender_id?: number;
    tokens?: number;
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
  /** columns and relationships of "personal_access_tokens" */
  ['personal_access_tokens']: {
    __typename: 'personal_access_tokens';
    abilities?: string;
    created_at?: GraphQLTypes['timestamp'];
    id: GraphQLTypes['bigint'];
    last_used_at?: GraphQLTypes['timestamp'];
    name: string;
    /** An object relationship */
    profile?: GraphQLTypes['profiles'];
    token: string;
    tokenable_id: GraphQLTypes['bigint'];
    tokenable_type: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregated selection of "personal_access_tokens" */
  ['personal_access_tokens_aggregate']: {
    __typename: 'personal_access_tokens_aggregate';
    aggregate?: GraphQLTypes['personal_access_tokens_aggregate_fields'];
    nodes: Array<GraphQLTypes['personal_access_tokens']>;
  };
  /** aggregate fields of "personal_access_tokens" */
  ['personal_access_tokens_aggregate_fields']: {
    __typename: 'personal_access_tokens_aggregate_fields';
    avg?: GraphQLTypes['personal_access_tokens_avg_fields'];
    count: number;
    max?: GraphQLTypes['personal_access_tokens_max_fields'];
    min?: GraphQLTypes['personal_access_tokens_min_fields'];
    stddev?: GraphQLTypes['personal_access_tokens_stddev_fields'];
    stddev_pop?: GraphQLTypes['personal_access_tokens_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['personal_access_tokens_stddev_samp_fields'];
    sum?: GraphQLTypes['personal_access_tokens_sum_fields'];
    var_pop?: GraphQLTypes['personal_access_tokens_var_pop_fields'];
    var_samp?: GraphQLTypes['personal_access_tokens_var_samp_fields'];
    variance?: GraphQLTypes['personal_access_tokens_variance_fields'];
  };
  /** aggregate avg on columns */
  ['personal_access_tokens_avg_fields']: {
    __typename: 'personal_access_tokens_avg_fields';
    id?: number;
    tokenable_id?: number;
  };
  /** Boolean expression to filter rows from the table "personal_access_tokens". All fields are combined with a logical 'AND'. */
  ['personal_access_tokens_bool_exp']: {
    _and?: Array<GraphQLTypes['personal_access_tokens_bool_exp']>;
    _not?: GraphQLTypes['personal_access_tokens_bool_exp'];
    _or?: Array<GraphQLTypes['personal_access_tokens_bool_exp']>;
    abilities?: GraphQLTypes['String_comparison_exp'];
    created_at?: GraphQLTypes['timestamp_comparison_exp'];
    id?: GraphQLTypes['bigint_comparison_exp'];
    last_used_at?: GraphQLTypes['timestamp_comparison_exp'];
    name?: GraphQLTypes['String_comparison_exp'];
    profile?: GraphQLTypes['profiles_bool_exp'];
    token?: GraphQLTypes['String_comparison_exp'];
    tokenable_id?: GraphQLTypes['bigint_comparison_exp'];
    tokenable_type?: GraphQLTypes['String_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** unique or primary key constraints on table "personal_access_tokens" */
  ['personal_access_tokens_constraint']: personal_access_tokens_constraint;
  /** input type for incrementing numeric columns in table "personal_access_tokens" */
  ['personal_access_tokens_inc_input']: {
    id?: GraphQLTypes['bigint'];
    tokenable_id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "personal_access_tokens" */
  ['personal_access_tokens_insert_input']: {
    abilities?: string;
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    last_used_at?: GraphQLTypes['timestamp'];
    name?: string;
    profile?: GraphQLTypes['profiles_obj_rel_insert_input'];
    token?: string;
    tokenable_id?: GraphQLTypes['bigint'];
    tokenable_type?: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate max on columns */
  ['personal_access_tokens_max_fields']: {
    __typename: 'personal_access_tokens_max_fields';
    abilities?: string;
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    last_used_at?: GraphQLTypes['timestamp'];
    name?: string;
    token?: string;
    tokenable_id?: GraphQLTypes['bigint'];
    tokenable_type?: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate min on columns */
  ['personal_access_tokens_min_fields']: {
    __typename: 'personal_access_tokens_min_fields';
    abilities?: string;
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    last_used_at?: GraphQLTypes['timestamp'];
    name?: string;
    token?: string;
    tokenable_id?: GraphQLTypes['bigint'];
    tokenable_type?: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** response of any mutation on the table "personal_access_tokens" */
  ['personal_access_tokens_mutation_response']: {
    __typename: 'personal_access_tokens_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['personal_access_tokens']>;
  };
  /** on conflict condition type for table "personal_access_tokens" */
  ['personal_access_tokens_on_conflict']: {
    constraint: GraphQLTypes['personal_access_tokens_constraint'];
    update_columns: Array<GraphQLTypes['personal_access_tokens_update_column']>;
    where?: GraphQLTypes['personal_access_tokens_bool_exp'];
  };
  /** Ordering options when selecting data from "personal_access_tokens". */
  ['personal_access_tokens_order_by']: {
    abilities?: GraphQLTypes['order_by'];
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    last_used_at?: GraphQLTypes['order_by'];
    name?: GraphQLTypes['order_by'];
    profile?: GraphQLTypes['profiles_order_by'];
    token?: GraphQLTypes['order_by'];
    tokenable_id?: GraphQLTypes['order_by'];
    tokenable_type?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: personal_access_tokens */
  ['personal_access_tokens_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "personal_access_tokens" */
  ['personal_access_tokens_select_column']: personal_access_tokens_select_column;
  /** input type for updating data in table "personal_access_tokens" */
  ['personal_access_tokens_set_input']: {
    abilities?: string;
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    last_used_at?: GraphQLTypes['timestamp'];
    name?: string;
    token?: string;
    tokenable_id?: GraphQLTypes['bigint'];
    tokenable_type?: string;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate stddev on columns */
  ['personal_access_tokens_stddev_fields']: {
    __typename: 'personal_access_tokens_stddev_fields';
    id?: number;
    tokenable_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['personal_access_tokens_stddev_pop_fields']: {
    __typename: 'personal_access_tokens_stddev_pop_fields';
    id?: number;
    tokenable_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['personal_access_tokens_stddev_samp_fields']: {
    __typename: 'personal_access_tokens_stddev_samp_fields';
    id?: number;
    tokenable_id?: number;
  };
  /** aggregate sum on columns */
  ['personal_access_tokens_sum_fields']: {
    __typename: 'personal_access_tokens_sum_fields';
    id?: GraphQLTypes['bigint'];
    tokenable_id?: GraphQLTypes['bigint'];
  };
  /** update columns of table "personal_access_tokens" */
  ['personal_access_tokens_update_column']: personal_access_tokens_update_column;
  /** aggregate var_pop on columns */
  ['personal_access_tokens_var_pop_fields']: {
    __typename: 'personal_access_tokens_var_pop_fields';
    id?: number;
    tokenable_id?: number;
  };
  /** aggregate var_samp on columns */
  ['personal_access_tokens_var_samp_fields']: {
    __typename: 'personal_access_tokens_var_samp_fields';
    id?: number;
    tokenable_id?: number;
  };
  /** aggregate variance on columns */
  ['personal_access_tokens_variance_fields']: {
    __typename: 'personal_access_tokens_variance_fields';
    id?: number;
    tokenable_id?: number;
  };
  /** columns and relationships of "profiles" */
  ['profiles']: {
    __typename: 'profiles';
    address: string;
    admin_view: boolean;
    ann_power: boolean;
    avatar?: string;
    background?: string;
    bio?: string;
    chat_id?: string;
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
    /** An aggregate relationship */
    users_aggregate: GraphQLTypes['users_aggregate'];
    website?: string;
  };
  /** aggregated selection of "profiles" */
  ['profiles_aggregate']: {
    __typename: 'profiles_aggregate';
    aggregate?: GraphQLTypes['profiles_aggregate_fields'];
    nodes: Array<GraphQLTypes['profiles']>;
  };
  /** aggregate fields of "profiles" */
  ['profiles_aggregate_fields']: {
    __typename: 'profiles_aggregate_fields';
    avg?: GraphQLTypes['profiles_avg_fields'];
    count: number;
    max?: GraphQLTypes['profiles_max_fields'];
    min?: GraphQLTypes['profiles_min_fields'];
    stddev?: GraphQLTypes['profiles_stddev_fields'];
    stddev_pop?: GraphQLTypes['profiles_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['profiles_stddev_samp_fields'];
    sum?: GraphQLTypes['profiles_sum_fields'];
    var_pop?: GraphQLTypes['profiles_var_pop_fields'];
    var_samp?: GraphQLTypes['profiles_var_samp_fields'];
    variance?: GraphQLTypes['profiles_variance_fields'];
  };
  /** aggregate avg on columns */
  ['profiles_avg_fields']: {
    __typename: 'profiles_avg_fields';
    id?: number;
  };
  /** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
  ['profiles_bool_exp']: {
    _and?: Array<GraphQLTypes['profiles_bool_exp']>;
    _not?: GraphQLTypes['profiles_bool_exp'];
    _or?: Array<GraphQLTypes['profiles_bool_exp']>;
    address?: GraphQLTypes['String_comparison_exp'];
    admin_view?: GraphQLTypes['Boolean_comparison_exp'];
    ann_power?: GraphQLTypes['Boolean_comparison_exp'];
    avatar?: GraphQLTypes['String_comparison_exp'];
    background?: GraphQLTypes['String_comparison_exp'];
    bio?: GraphQLTypes['String_comparison_exp'];
    chat_id?: GraphQLTypes['String_comparison_exp'];
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
  /** unique or primary key constraints on table "profiles" */
  ['profiles_constraint']: profiles_constraint;
  /** input type for incrementing numeric columns in table "profiles" */
  ['profiles_inc_input']: {
    id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "profiles" */
  ['profiles_insert_input']: {
    address?: string;
    admin_view?: boolean;
    ann_power?: boolean;
    avatar?: string;
    background?: string;
    bio?: string;
    chat_id?: string;
    created_at?: GraphQLTypes['timestamp'];
    discord_username?: string;
    github_username?: string;
    id?: GraphQLTypes['bigint'];
    medium_username?: string;
    skills?: string;
    telegram_username?: string;
    twitter_username?: string;
    updated_at?: GraphQLTypes['timestamp'];
    users?: GraphQLTypes['users_arr_rel_insert_input'];
    website?: string;
  };
  /** aggregate max on columns */
  ['profiles_max_fields']: {
    __typename: 'profiles_max_fields';
    address?: string;
    avatar?: string;
    background?: string;
    bio?: string;
    chat_id?: string;
    created_at?: GraphQLTypes['timestamp'];
    discord_username?: string;
    github_username?: string;
    id?: GraphQLTypes['bigint'];
    medium_username?: string;
    skills?: string;
    telegram_username?: string;
    twitter_username?: string;
    updated_at?: GraphQLTypes['timestamp'];
    website?: string;
  };
  /** aggregate min on columns */
  ['profiles_min_fields']: {
    __typename: 'profiles_min_fields';
    address?: string;
    avatar?: string;
    background?: string;
    bio?: string;
    chat_id?: string;
    created_at?: GraphQLTypes['timestamp'];
    discord_username?: string;
    github_username?: string;
    id?: GraphQLTypes['bigint'];
    medium_username?: string;
    skills?: string;
    telegram_username?: string;
    twitter_username?: string;
    updated_at?: GraphQLTypes['timestamp'];
    website?: string;
  };
  /** response of any mutation on the table "profiles" */
  ['profiles_mutation_response']: {
    __typename: 'profiles_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['profiles']>;
  };
  /** input type for inserting object relation for remote table "profiles" */
  ['profiles_obj_rel_insert_input']: {
    data: GraphQLTypes['profiles_insert_input'];
    /** on conflict condition */
    on_conflict?: GraphQLTypes['profiles_on_conflict'];
  };
  /** on conflict condition type for table "profiles" */
  ['profiles_on_conflict']: {
    constraint: GraphQLTypes['profiles_constraint'];
    update_columns: Array<GraphQLTypes['profiles_update_column']>;
    where?: GraphQLTypes['profiles_bool_exp'];
  };
  /** Ordering options when selecting data from "profiles". */
  ['profiles_order_by']: {
    address?: GraphQLTypes['order_by'];
    admin_view?: GraphQLTypes['order_by'];
    ann_power?: GraphQLTypes['order_by'];
    avatar?: GraphQLTypes['order_by'];
    background?: GraphQLTypes['order_by'];
    bio?: GraphQLTypes['order_by'];
    chat_id?: GraphQLTypes['order_by'];
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
    address?: string;
    admin_view?: boolean;
    ann_power?: boolean;
    avatar?: string;
    background?: string;
    bio?: string;
    chat_id?: string;
    created_at?: GraphQLTypes['timestamp'];
    discord_username?: string;
    github_username?: string;
    id?: GraphQLTypes['bigint'];
    medium_username?: string;
    skills?: string;
    telegram_username?: string;
    twitter_username?: string;
    updated_at?: GraphQLTypes['timestamp'];
    website?: string;
  };
  /** aggregate stddev on columns */
  ['profiles_stddev_fields']: {
    __typename: 'profiles_stddev_fields';
    id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['profiles_stddev_pop_fields']: {
    __typename: 'profiles_stddev_pop_fields';
    id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['profiles_stddev_samp_fields']: {
    __typename: 'profiles_stddev_samp_fields';
    id?: number;
  };
  /** aggregate sum on columns */
  ['profiles_sum_fields']: {
    __typename: 'profiles_sum_fields';
    id?: GraphQLTypes['bigint'];
  };
  /** update columns of table "profiles" */
  ['profiles_update_column']: profiles_update_column;
  /** aggregate var_pop on columns */
  ['profiles_var_pop_fields']: {
    __typename: 'profiles_var_pop_fields';
    id?: number;
  };
  /** aggregate var_samp on columns */
  ['profiles_var_samp_fields']: {
    __typename: 'profiles_var_samp_fields';
    id?: number;
  };
  /** aggregate variance on columns */
  ['profiles_variance_fields']: {
    __typename: 'profiles_variance_fields';
    id?: number;
  };
  ['query_root']: {
    __typename: 'query_root';
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An aggregate relationship */
    burns_aggregate: GraphQLTypes['burns_aggregate'];
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: GraphQLTypes['burns'];
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: Array<GraphQLTypes['circle_integrations']>;
    /** fetch aggregated fields from the table: "circle_integrations" */
    circle_integrations_aggregate: GraphQLTypes['circle_integrations_aggregate'];
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: GraphQLTypes['circle_integrations'];
    /** An array relationship */
    circle_metadata: Array<GraphQLTypes['circle_metadata']>;
    /** An aggregate relationship */
    circle_metadata_aggregate: GraphQLTypes['circle_metadata_aggregate'];
    /** fetch data from the table: "circle_metadata" using primary key columns */
    circle_metadata_by_pk?: GraphQLTypes['circle_metadata'];
    /** fetch data from the table: "circle_private" */
    circle_private: Array<GraphQLTypes['circle_private']>;
    /** fetch aggregated fields from the table: "circle_private" */
    circle_private_aggregate: GraphQLTypes['circle_private_aggregate'];
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    /** An aggregate relationship */
    circles_aggregate: GraphQLTypes['circles_aggregate'];
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: GraphQLTypes['circles'];
    /** fetch data from the table: "claims" */
    claims: Array<GraphQLTypes['claims']>;
    /** An aggregate relationship */
    claims_aggregate: GraphQLTypes['claims_aggregate'];
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: GraphQLTypes['claims'];
    /** fetch data from the table: "distributions" */
    distributions: Array<GraphQLTypes['distributions']>;
    /** fetch aggregated fields from the table: "distributions" */
    distributions_aggregate: GraphQLTypes['distributions_aggregate'];
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: GraphQLTypes['distributions'];
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    /** An aggregate relationship */
    epochs_aggregate: GraphQLTypes['epochs_aggregate'];
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: GraphQLTypes['epochs'];
    /** fetch data from the table: "gift_private" */
    gift_private: Array<GraphQLTypes['gift_private']>;
    /** fetch aggregated fields from the table: "gift_private" */
    gift_private_aggregate: GraphQLTypes['gift_private_aggregate'];
    /** fetch data from the table: "histories" */
    histories: Array<GraphQLTypes['histories']>;
    /** fetch aggregated fields from the table: "histories" */
    histories_aggregate: GraphQLTypes['histories_aggregate'];
    /** fetch data from the table: "histories" using primary key columns */
    histories_by_pk?: GraphQLTypes['histories'];
    /** An array relationship */
    nominees: Array<GraphQLTypes['nominees']>;
    /** An aggregate relationship */
    nominees_aggregate: GraphQLTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: GraphQLTypes['nominees'];
    /** fetch data from the table: "protocols" */
    organizations: Array<GraphQLTypes['organizations']>;
    /** fetch aggregated fields from the table: "protocols" */
    organizations_aggregate: GraphQLTypes['organizations_aggregate'];
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: GraphQLTypes['organizations'];
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: Array<GraphQLTypes['pending_gift_private']>;
    /** fetch aggregated fields from the table: "pending_gift_private" */
    pending_gift_private_aggregate: GraphQLTypes['pending_gift_private_aggregate'];
    /** An array relationship */
    pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** An aggregate relationship */
    pending_token_gifts_aggregate: GraphQLTypes['pending_token_gifts_aggregate'];
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: GraphQLTypes['pending_token_gifts'];
    /** fetch data from the table: "personal_access_tokens" */
    personal_access_tokens: Array<GraphQLTypes['personal_access_tokens']>;
    /** fetch aggregated fields from the table: "personal_access_tokens" */
    personal_access_tokens_aggregate: GraphQLTypes['personal_access_tokens_aggregate'];
    /** fetch data from the table: "personal_access_tokens" using primary key columns */
    personal_access_tokens_by_pk?: GraphQLTypes['personal_access_tokens'];
    /** fetch data from the table: "profiles" */
    profiles: Array<GraphQLTypes['profiles']>;
    /** fetch aggregated fields from the table: "profiles" */
    profiles_aggregate: GraphQLTypes['profiles_aggregate'];
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: GraphQLTypes['profiles'];
    /** An array relationship */
    teammates: Array<GraphQLTypes['teammates']>;
    /** An aggregate relationship */
    teammates_aggregate: GraphQLTypes['teammates_aggregate'];
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
    /** An aggregate relationship */
    users_aggregate: GraphQLTypes['users_aggregate'];
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: GraphQLTypes['users'];
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
    /** An aggregate relationship */
    vault_transactions_aggregate: GraphQLTypes['vault_transactions_aggregate'];
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: GraphQLTypes['vault_transactions'];
    /** fetch data from the table: "vaults" */
    vaults: Array<GraphQLTypes['vaults']>;
    /** fetch aggregated fields from the table: "vaults" */
    vaults_aggregate: GraphQLTypes['vaults_aggregate'];
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: GraphQLTypes['vaults'];
    /** fetch data from the table: "vouches" */
    vouches: Array<GraphQLTypes['vouches']>;
    /** fetch aggregated fields from the table: "vouches" */
    vouches_aggregate: GraphQLTypes['vouches_aggregate'];
    /** fetch data from the table: "vouches" using primary key columns */
    vouches_by_pk?: GraphQLTypes['vouches'];
  };
  ['subscription_root']: {
    __typename: 'subscription_root';
    /** An array relationship */
    burns: Array<GraphQLTypes['burns']>;
    /** An aggregate relationship */
    burns_aggregate: GraphQLTypes['burns_aggregate'];
    /** fetch data from the table: "burns" using primary key columns */
    burns_by_pk?: GraphQLTypes['burns'];
    /** fetch data from the table: "circle_integrations" */
    circle_integrations: Array<GraphQLTypes['circle_integrations']>;
    /** fetch aggregated fields from the table: "circle_integrations" */
    circle_integrations_aggregate: GraphQLTypes['circle_integrations_aggregate'];
    /** fetch data from the table: "circle_integrations" using primary key columns */
    circle_integrations_by_pk?: GraphQLTypes['circle_integrations'];
    /** An array relationship */
    circle_metadata: Array<GraphQLTypes['circle_metadata']>;
    /** An aggregate relationship */
    circle_metadata_aggregate: GraphQLTypes['circle_metadata_aggregate'];
    /** fetch data from the table: "circle_metadata" using primary key columns */
    circle_metadata_by_pk?: GraphQLTypes['circle_metadata'];
    /** fetch data from the table: "circle_private" */
    circle_private: Array<GraphQLTypes['circle_private']>;
    /** fetch aggregated fields from the table: "circle_private" */
    circle_private_aggregate: GraphQLTypes['circle_private_aggregate'];
    /** An array relationship */
    circles: Array<GraphQLTypes['circles']>;
    /** An aggregate relationship */
    circles_aggregate: GraphQLTypes['circles_aggregate'];
    /** fetch data from the table: "circles" using primary key columns */
    circles_by_pk?: GraphQLTypes['circles'];
    /** fetch data from the table: "claims" */
    claims: Array<GraphQLTypes['claims']>;
    /** An aggregate relationship */
    claims_aggregate: GraphQLTypes['claims_aggregate'];
    /** fetch data from the table: "claims" using primary key columns */
    claims_by_pk?: GraphQLTypes['claims'];
    /** fetch data from the table: "distributions" */
    distributions: Array<GraphQLTypes['distributions']>;
    /** fetch aggregated fields from the table: "distributions" */
    distributions_aggregate: GraphQLTypes['distributions_aggregate'];
    /** fetch data from the table: "distributions" using primary key columns */
    distributions_by_pk?: GraphQLTypes['distributions'];
    /** An array relationship */
    epochs: Array<GraphQLTypes['epochs']>;
    /** An aggregate relationship */
    epochs_aggregate: GraphQLTypes['epochs_aggregate'];
    /** fetch data from the table: "epoches" using primary key columns */
    epochs_by_pk?: GraphQLTypes['epochs'];
    /** fetch data from the table: "gift_private" */
    gift_private: Array<GraphQLTypes['gift_private']>;
    /** fetch aggregated fields from the table: "gift_private" */
    gift_private_aggregate: GraphQLTypes['gift_private_aggregate'];
    /** fetch data from the table: "histories" */
    histories: Array<GraphQLTypes['histories']>;
    /** fetch aggregated fields from the table: "histories" */
    histories_aggregate: GraphQLTypes['histories_aggregate'];
    /** fetch data from the table: "histories" using primary key columns */
    histories_by_pk?: GraphQLTypes['histories'];
    /** An array relationship */
    nominees: Array<GraphQLTypes['nominees']>;
    /** An aggregate relationship */
    nominees_aggregate: GraphQLTypes['nominees_aggregate'];
    /** fetch data from the table: "nominees" using primary key columns */
    nominees_by_pk?: GraphQLTypes['nominees'];
    /** fetch data from the table: "protocols" */
    organizations: Array<GraphQLTypes['organizations']>;
    /** fetch aggregated fields from the table: "protocols" */
    organizations_aggregate: GraphQLTypes['organizations_aggregate'];
    /** fetch data from the table: "protocols" using primary key columns */
    organizations_by_pk?: GraphQLTypes['organizations'];
    /** fetch data from the table: "pending_gift_private" */
    pending_gift_private: Array<GraphQLTypes['pending_gift_private']>;
    /** fetch aggregated fields from the table: "pending_gift_private" */
    pending_gift_private_aggregate: GraphQLTypes['pending_gift_private_aggregate'];
    /** An array relationship */
    pending_token_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** An aggregate relationship */
    pending_token_gifts_aggregate: GraphQLTypes['pending_token_gifts_aggregate'];
    /** fetch data from the table: "pending_token_gifts" using primary key columns */
    pending_token_gifts_by_pk?: GraphQLTypes['pending_token_gifts'];
    /** fetch data from the table: "personal_access_tokens" */
    personal_access_tokens: Array<GraphQLTypes['personal_access_tokens']>;
    /** fetch aggregated fields from the table: "personal_access_tokens" */
    personal_access_tokens_aggregate: GraphQLTypes['personal_access_tokens_aggregate'];
    /** fetch data from the table: "personal_access_tokens" using primary key columns */
    personal_access_tokens_by_pk?: GraphQLTypes['personal_access_tokens'];
    /** fetch data from the table: "profiles" */
    profiles: Array<GraphQLTypes['profiles']>;
    /** fetch aggregated fields from the table: "profiles" */
    profiles_aggregate: GraphQLTypes['profiles_aggregate'];
    /** fetch data from the table: "profiles" using primary key columns */
    profiles_by_pk?: GraphQLTypes['profiles'];
    /** An array relationship */
    teammates: Array<GraphQLTypes['teammates']>;
    /** An aggregate relationship */
    teammates_aggregate: GraphQLTypes['teammates_aggregate'];
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
    /** An aggregate relationship */
    users_aggregate: GraphQLTypes['users_aggregate'];
    /** fetch data from the table: "users" using primary key columns */
    users_by_pk?: GraphQLTypes['users'];
    /** An array relationship */
    vault_transactions: Array<GraphQLTypes['vault_transactions']>;
    /** An aggregate relationship */
    vault_transactions_aggregate: GraphQLTypes['vault_transactions_aggregate'];
    /** fetch data from the table: "vault_transactions" using primary key columns */
    vault_transactions_by_pk?: GraphQLTypes['vault_transactions'];
    /** fetch data from the table: "vaults" */
    vaults: Array<GraphQLTypes['vaults']>;
    /** fetch aggregated fields from the table: "vaults" */
    vaults_aggregate: GraphQLTypes['vaults_aggregate'];
    /** fetch data from the table: "vaults" using primary key columns */
    vaults_by_pk?: GraphQLTypes['vaults'];
    /** fetch data from the table: "vouches" */
    vouches: Array<GraphQLTypes['vouches']>;
    /** fetch aggregated fields from the table: "vouches" */
    vouches_aggregate: GraphQLTypes['vouches_aggregate'];
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
  /** aggregated selection of "teammates" */
  ['teammates_aggregate']: {
    __typename: 'teammates_aggregate';
    aggregate?: GraphQLTypes['teammates_aggregate_fields'];
    nodes: Array<GraphQLTypes['teammates']>;
  };
  /** aggregate fields of "teammates" */
  ['teammates_aggregate_fields']: {
    __typename: 'teammates_aggregate_fields';
    avg?: GraphQLTypes['teammates_avg_fields'];
    count: number;
    max?: GraphQLTypes['teammates_max_fields'];
    min?: GraphQLTypes['teammates_min_fields'];
    stddev?: GraphQLTypes['teammates_stddev_fields'];
    stddev_pop?: GraphQLTypes['teammates_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['teammates_stddev_samp_fields'];
    sum?: GraphQLTypes['teammates_sum_fields'];
    var_pop?: GraphQLTypes['teammates_var_pop_fields'];
    var_samp?: GraphQLTypes['teammates_var_samp_fields'];
    variance?: GraphQLTypes['teammates_variance_fields'];
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
  /** input type for inserting array relation for remote table "teammates" */
  ['teammates_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['teammates_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['teammates_on_conflict'];
  };
  /** aggregate avg on columns */
  ['teammates_avg_fields']: {
    __typename: 'teammates_avg_fields';
    id?: number;
    team_mate_id?: number;
    user_id?: number;
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
  /** unique or primary key constraints on table "teammates" */
  ['teammates_constraint']: teammates_constraint;
  /** input type for incrementing numeric columns in table "teammates" */
  ['teammates_inc_input']: {
    id?: GraphQLTypes['bigint'];
    team_mate_id?: number;
    user_id?: number;
  };
  /** input type for inserting data into table "teammates" */
  ['teammates_insert_input']: {
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    team_mate_id?: number;
    teammate?: GraphQLTypes['users_obj_rel_insert_input'];
    updated_at?: GraphQLTypes['timestamp'];
    user?: GraphQLTypes['users_obj_rel_insert_input'];
    user_id?: number;
  };
  /** aggregate max on columns */
  ['teammates_max_fields']: {
    __typename: 'teammates_max_fields';
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    team_mate_id?: number;
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: number;
  };
  /** order by max() on columns of table "teammates" */
  ['teammates_max_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** aggregate min on columns */
  ['teammates_min_fields']: {
    __typename: 'teammates_min_fields';
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    team_mate_id?: number;
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: number;
  };
  /** order by min() on columns of table "teammates" */
  ['teammates_min_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** response of any mutation on the table "teammates" */
  ['teammates_mutation_response']: {
    __typename: 'teammates_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['teammates']>;
  };
  /** on conflict condition type for table "teammates" */
  ['teammates_on_conflict']: {
    constraint: GraphQLTypes['teammates_constraint'];
    update_columns: Array<GraphQLTypes['teammates_update_column']>;
    where?: GraphQLTypes['teammates_bool_exp'];
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
  /** primary key columns input for table: teammates */
  ['teammates_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "teammates" */
  ['teammates_select_column']: teammates_select_column;
  /** input type for updating data in table "teammates" */
  ['teammates_set_input']: {
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    team_mate_id?: number;
    updated_at?: GraphQLTypes['timestamp'];
    user_id?: number;
  };
  /** aggregate stddev on columns */
  ['teammates_stddev_fields']: {
    __typename: 'teammates_stddev_fields';
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by stddev() on columns of table "teammates" */
  ['teammates_stddev_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['teammates_stddev_pop_fields']: {
    __typename: 'teammates_stddev_pop_fields';
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by stddev_pop() on columns of table "teammates" */
  ['teammates_stddev_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_samp on columns */
  ['teammates_stddev_samp_fields']: {
    __typename: 'teammates_stddev_samp_fields';
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by stddev_samp() on columns of table "teammates" */
  ['teammates_stddev_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** aggregate sum on columns */
  ['teammates_sum_fields']: {
    __typename: 'teammates_sum_fields';
    id?: GraphQLTypes['bigint'];
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by sum() on columns of table "teammates" */
  ['teammates_sum_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** update columns of table "teammates" */
  ['teammates_update_column']: teammates_update_column;
  /** aggregate var_pop on columns */
  ['teammates_var_pop_fields']: {
    __typename: 'teammates_var_pop_fields';
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by var_pop() on columns of table "teammates" */
  ['teammates_var_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** aggregate var_samp on columns */
  ['teammates_var_samp_fields']: {
    __typename: 'teammates_var_samp_fields';
    id?: number;
    team_mate_id?: number;
    user_id?: number;
  };
  /** order by var_samp() on columns of table "teammates" */
  ['teammates_var_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    team_mate_id?: GraphQLTypes['order_by'];
    user_id?: GraphQLTypes['order_by'];
  };
  /** aggregate variance on columns */
  ['teammates_variance_fields']: {
    __typename: 'teammates_variance_fields';
    id?: number;
    team_mate_id?: number;
    user_id?: number;
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
    note?: string;
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
  /** input type for inserting array relation for remote table "token_gifts" */
  ['token_gifts_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['token_gifts_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['token_gifts_on_conflict'];
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
    note?: GraphQLTypes['String_comparison_exp'];
    recipient?: GraphQLTypes['users_bool_exp'];
    recipient_address?: GraphQLTypes['String_comparison_exp'];
    recipient_id?: GraphQLTypes['bigint_comparison_exp'];
    sender?: GraphQLTypes['users_bool_exp'];
    sender_address?: GraphQLTypes['String_comparison_exp'];
    sender_id?: GraphQLTypes['bigint_comparison_exp'];
    tokens?: GraphQLTypes['Int_comparison_exp'];
    updated_at?: GraphQLTypes['timestamp_comparison_exp'];
  };
  /** unique or primary key constraints on table "token_gifts" */
  ['token_gifts_constraint']: token_gifts_constraint;
  /** input type for incrementing numeric columns in table "token_gifts" */
  ['token_gifts_inc_input']: {
    circle_id?: GraphQLTypes['bigint'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    recipient_id?: GraphQLTypes['bigint'];
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
  };
  /** input type for inserting data into table "token_gifts" */
  ['token_gifts_insert_input']: {
    circle?: GraphQLTypes['circles_obj_rel_insert_input'];
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    gift_private?: GraphQLTypes['gift_private_obj_rel_insert_input'];
    id?: GraphQLTypes['bigint'];
    note?: string;
    recipient?: GraphQLTypes['users_obj_rel_insert_input'];
    recipient_address?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender?: GraphQLTypes['users_obj_rel_insert_input'];
    sender_address?: string;
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate max on columns */
  ['token_gifts_max_fields']: {
    __typename: 'token_gifts_max_fields';
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    note?: string;
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
    note?: GraphQLTypes['order_by'];
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
    note?: string;
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
    note?: GraphQLTypes['order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** response of any mutation on the table "token_gifts" */
  ['token_gifts_mutation_response']: {
    __typename: 'token_gifts_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['token_gifts']>;
  };
  /** on conflict condition type for table "token_gifts" */
  ['token_gifts_on_conflict']: {
    constraint: GraphQLTypes['token_gifts_constraint'];
    update_columns: Array<GraphQLTypes['token_gifts_update_column']>;
    where?: GraphQLTypes['token_gifts_bool_exp'];
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
    note?: GraphQLTypes['order_by'];
    recipient?: GraphQLTypes['users_order_by'];
    recipient_address?: GraphQLTypes['order_by'];
    recipient_id?: GraphQLTypes['order_by'];
    sender?: GraphQLTypes['users_order_by'];
    sender_address?: GraphQLTypes['order_by'];
    sender_id?: GraphQLTypes['order_by'];
    tokens?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
  };
  /** primary key columns input for table: token_gifts */
  ['token_gifts_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "token_gifts" */
  ['token_gifts_select_column']: token_gifts_select_column;
  /** input type for updating data in table "token_gifts" */
  ['token_gifts_set_input']: {
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    dts_created?: GraphQLTypes['timestamp'];
    epoch_id?: number;
    id?: GraphQLTypes['bigint'];
    note?: string;
    recipient_address?: string;
    recipient_id?: GraphQLTypes['bigint'];
    sender_address?: string;
    sender_id?: GraphQLTypes['bigint'];
    tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
  };
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
  /** update columns of table "token_gifts" */
  ['token_gifts_update_column']: token_gifts_update_column;
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
    /** An aggregate relationship */
    burns_aggregate: GraphQLTypes['burns_aggregate'];
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
    /** An aggregate relationship */
    pending_received_gifts_aggregate: GraphQLTypes['pending_token_gifts_aggregate'];
    /** An array relationship */
    pending_sent_gifts: Array<GraphQLTypes['pending_token_gifts']>;
    /** An aggregate relationship */
    pending_sent_gifts_aggregate: GraphQLTypes['pending_token_gifts_aggregate'];
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
    /** An aggregate relationship */
    teammates_aggregate: GraphQLTypes['teammates_aggregate'];
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregated selection of "users" */
  ['users_aggregate']: {
    __typename: 'users_aggregate';
    aggregate?: GraphQLTypes['users_aggregate_fields'];
    nodes: Array<GraphQLTypes['users']>;
  };
  /** aggregate fields of "users" */
  ['users_aggregate_fields']: {
    __typename: 'users_aggregate_fields';
    avg?: GraphQLTypes['users_avg_fields'];
    count: number;
    max?: GraphQLTypes['users_max_fields'];
    min?: GraphQLTypes['users_min_fields'];
    stddev?: GraphQLTypes['users_stddev_fields'];
    stddev_pop?: GraphQLTypes['users_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['users_stddev_samp_fields'];
    sum?: GraphQLTypes['users_sum_fields'];
    var_pop?: GraphQLTypes['users_var_pop_fields'];
    var_samp?: GraphQLTypes['users_var_samp_fields'];
    variance?: GraphQLTypes['users_variance_fields'];
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
  /** input type for inserting array relation for remote table "users" */
  ['users_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['users_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['users_on_conflict'];
  };
  /** aggregate avg on columns */
  ['users_avg_fields']: {
    __typename: 'users_avg_fields';
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
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
  /** unique or primary key constraints on table "users" */
  ['users_constraint']: users_constraint;
  /** input type for incrementing numeric columns in table "users" */
  ['users_inc_input']: {
    circle_id?: GraphQLTypes['bigint'];
    give_token_received?: number;
    give_token_remaining?: number;
    id?: GraphQLTypes['bigint'];
    role?: number;
    starting_tokens?: number;
  };
  /** input type for inserting data into table "users" */
  ['users_insert_input']: {
    address?: string;
    bio?: string;
    burns?: GraphQLTypes['burns_arr_rel_insert_input'];
    circle?: GraphQLTypes['circles_obj_rel_insert_input'];
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    deleted_at?: GraphQLTypes['timestamp'];
    epoch_first_visit?: boolean;
    fixed_non_receiver?: boolean;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: GraphQLTypes['bigint'];
    name?: string;
    non_giver?: boolean;
    non_receiver?: boolean;
    pending_received_gifts?: GraphQLTypes['pending_token_gifts_arr_rel_insert_input'];
    pending_sent_gifts?: GraphQLTypes['pending_token_gifts_arr_rel_insert_input'];
    profile?: GraphQLTypes['profiles_obj_rel_insert_input'];
    received_gifts?: GraphQLTypes['token_gifts_arr_rel_insert_input'];
    role?: number;
    sent_gifts?: GraphQLTypes['token_gifts_arr_rel_insert_input'];
    starting_tokens?: number;
    teammates?: GraphQLTypes['teammates_arr_rel_insert_input'];
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate max on columns */
  ['users_max_fields']: {
    __typename: 'users_max_fields';
    address?: string;
    bio?: string;
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    deleted_at?: GraphQLTypes['timestamp'];
    give_token_received?: number;
    give_token_remaining?: number;
    id?: GraphQLTypes['bigint'];
    name?: string;
    role?: number;
    starting_tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
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
  /** aggregate min on columns */
  ['users_min_fields']: {
    __typename: 'users_min_fields';
    address?: string;
    bio?: string;
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    deleted_at?: GraphQLTypes['timestamp'];
    give_token_received?: number;
    give_token_remaining?: number;
    id?: GraphQLTypes['bigint'];
    name?: string;
    role?: number;
    starting_tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
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
  /** response of any mutation on the table "users" */
  ['users_mutation_response']: {
    __typename: 'users_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['users']>;
  };
  /** input type for inserting object relation for remote table "users" */
  ['users_obj_rel_insert_input']: {
    data: GraphQLTypes['users_insert_input'];
    /** on conflict condition */
    on_conflict?: GraphQLTypes['users_on_conflict'];
  };
  /** on conflict condition type for table "users" */
  ['users_on_conflict']: {
    constraint: GraphQLTypes['users_constraint'];
    update_columns: Array<GraphQLTypes['users_update_column']>;
    where?: GraphQLTypes['users_bool_exp'];
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
  /** primary key columns input for table: users */
  ['users_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "users" */
  ['users_select_column']: users_select_column;
  /** input type for updating data in table "users" */
  ['users_set_input']: {
    address?: string;
    bio?: string;
    circle_id?: GraphQLTypes['bigint'];
    created_at?: GraphQLTypes['timestamp'];
    deleted_at?: GraphQLTypes['timestamp'];
    epoch_first_visit?: boolean;
    fixed_non_receiver?: boolean;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: GraphQLTypes['bigint'];
    name?: string;
    non_giver?: boolean;
    non_receiver?: boolean;
    role?: number;
    starting_tokens?: number;
    updated_at?: GraphQLTypes['timestamp'];
  };
  /** aggregate stddev on columns */
  ['users_stddev_fields']: {
    __typename: 'users_stddev_fields';
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
  };
  /** order by stddev() on columns of table "users" */
  ['users_stddev_order_by']: {
    circle_id?: GraphQLTypes['order_by'];
    give_token_received?: GraphQLTypes['order_by'];
    give_token_remaining?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    role?: GraphQLTypes['order_by'];
    starting_tokens?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['users_stddev_pop_fields']: {
    __typename: 'users_stddev_pop_fields';
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
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
  /** aggregate stddev_samp on columns */
  ['users_stddev_samp_fields']: {
    __typename: 'users_stddev_samp_fields';
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
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
  /** aggregate sum on columns */
  ['users_sum_fields']: {
    __typename: 'users_sum_fields';
    circle_id?: GraphQLTypes['bigint'];
    give_token_received?: number;
    give_token_remaining?: number;
    id?: GraphQLTypes['bigint'];
    role?: number;
    starting_tokens?: number;
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
  /** update columns of table "users" */
  ['users_update_column']: users_update_column;
  /** aggregate var_pop on columns */
  ['users_var_pop_fields']: {
    __typename: 'users_var_pop_fields';
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
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
  /** aggregate var_samp on columns */
  ['users_var_samp_fields']: {
    __typename: 'users_var_samp_fields';
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
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
  /** aggregate variance on columns */
  ['users_variance_fields']: {
    __typename: 'users_variance_fields';
    circle_id?: number;
    give_token_received?: number;
    give_token_remaining?: number;
    id?: number;
    role?: number;
    starting_tokens?: number;
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
  /** aggregated selection of "vault_transactions" */
  ['vault_transactions_aggregate']: {
    __typename: 'vault_transactions_aggregate';
    aggregate?: GraphQLTypes['vault_transactions_aggregate_fields'];
    nodes: Array<GraphQLTypes['vault_transactions']>;
  };
  /** aggregate fields of "vault_transactions" */
  ['vault_transactions_aggregate_fields']: {
    __typename: 'vault_transactions_aggregate_fields';
    avg?: GraphQLTypes['vault_transactions_avg_fields'];
    count: number;
    max?: GraphQLTypes['vault_transactions_max_fields'];
    min?: GraphQLTypes['vault_transactions_min_fields'];
    stddev?: GraphQLTypes['vault_transactions_stddev_fields'];
    stddev_pop?: GraphQLTypes['vault_transactions_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['vault_transactions_stddev_samp_fields'];
    sum?: GraphQLTypes['vault_transactions_sum_fields'];
    var_pop?: GraphQLTypes['vault_transactions_var_pop_fields'];
    var_samp?: GraphQLTypes['vault_transactions_var_samp_fields'];
    variance?: GraphQLTypes['vault_transactions_variance_fields'];
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
    /** on conflict condition */
    on_conflict?: GraphQLTypes['vault_transactions_on_conflict'];
  };
  /** aggregate avg on columns */
  ['vault_transactions_avg_fields']: {
    __typename: 'vault_transactions_avg_fields';
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
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
  /** unique or primary key constraints on table "vault_transactions" */
  ['vault_transactions_constraint']: vault_transactions_constraint;
  /** input type for incrementing numeric columns in table "vault_transactions" */
  ['vault_transactions_inc_input']: {
    created_by?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    value?: GraphQLTypes['bigint'];
    vault_id?: GraphQLTypes['bigint'];
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
    user?: GraphQLTypes['users_obj_rel_insert_input'];
    value?: GraphQLTypes['bigint'];
    vault?: GraphQLTypes['vaults_obj_rel_insert_input'];
    vault_id?: GraphQLTypes['bigint'];
  };
  /** aggregate max on columns */
  ['vault_transactions_max_fields']: {
    __typename: 'vault_transactions_max_fields';
    created_at?: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'];
    date?: GraphQLTypes['date'];
    description?: string;
    id?: GraphQLTypes['bigint'];
    name?: string;
    tx_hash?: string;
    updated_at?: GraphQLTypes['timestamp'];
    value?: GraphQLTypes['bigint'];
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
  /** aggregate min on columns */
  ['vault_transactions_min_fields']: {
    __typename: 'vault_transactions_min_fields';
    created_at?: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'];
    date?: GraphQLTypes['date'];
    description?: string;
    id?: GraphQLTypes['bigint'];
    name?: string;
    tx_hash?: string;
    updated_at?: GraphQLTypes['timestamp'];
    value?: GraphQLTypes['bigint'];
    vault_id?: GraphQLTypes['bigint'];
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
  /** on conflict condition type for table "vault_transactions" */
  ['vault_transactions_on_conflict']: {
    constraint: GraphQLTypes['vault_transactions_constraint'];
    update_columns: Array<GraphQLTypes['vault_transactions_update_column']>;
    where?: GraphQLTypes['vault_transactions_bool_exp'];
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
  /** primary key columns input for table: vault_transactions */
  ['vault_transactions_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "vault_transactions" */
  ['vault_transactions_select_column']: vault_transactions_select_column;
  /** input type for updating data in table "vault_transactions" */
  ['vault_transactions_set_input']: {
    created_at?: GraphQLTypes['timestamp'];
    created_by?: GraphQLTypes['bigint'];
    date?: GraphQLTypes['date'];
    description?: string;
    id?: GraphQLTypes['bigint'];
    name?: string;
    tx_hash?: string;
    updated_at?: GraphQLTypes['timestamp'];
    value?: GraphQLTypes['bigint'];
    vault_id?: GraphQLTypes['bigint'];
  };
  /** aggregate stddev on columns */
  ['vault_transactions_stddev_fields']: {
    __typename: 'vault_transactions_stddev_fields';
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by stddev() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['vault_transactions_stddev_pop_fields']: {
    __typename: 'vault_transactions_stddev_pop_fields';
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by stddev_pop() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_pop_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_samp on columns */
  ['vault_transactions_stddev_samp_fields']: {
    __typename: 'vault_transactions_stddev_samp_fields';
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by stddev_samp() on columns of table "vault_transactions" */
  ['vault_transactions_stddev_samp_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** aggregate sum on columns */
  ['vault_transactions_sum_fields']: {
    __typename: 'vault_transactions_sum_fields';
    created_by?: GraphQLTypes['bigint'];
    id?: GraphQLTypes['bigint'];
    value?: GraphQLTypes['bigint'];
    vault_id?: GraphQLTypes['bigint'];
  };
  /** order by sum() on columns of table "vault_transactions" */
  ['vault_transactions_sum_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** update columns of table "vault_transactions" */
  ['vault_transactions_update_column']: vault_transactions_update_column;
  /** aggregate var_pop on columns */
  ['vault_transactions_var_pop_fields']: {
    __typename: 'vault_transactions_var_pop_fields';
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by var_pop() on columns of table "vault_transactions" */
  ['vault_transactions_var_pop_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** aggregate var_samp on columns */
  ['vault_transactions_var_samp_fields']: {
    __typename: 'vault_transactions_var_samp_fields';
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
  };
  /** order by var_samp() on columns of table "vault_transactions" */
  ['vault_transactions_var_samp_order_by']: {
    created_by?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    value?: GraphQLTypes['order_by'];
    vault_id?: GraphQLTypes['order_by'];
  };
  /** aggregate variance on columns */
  ['vault_transactions_variance_fields']: {
    __typename: 'vault_transactions_variance_fields';
    created_by?: number;
    id?: number;
    value?: number;
    vault_id?: number;
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
    /** An aggregate relationship */
    vault_transactions_aggregate: GraphQLTypes['vault_transactions_aggregate'];
  };
  /** aggregated selection of "vaults" */
  ['vaults_aggregate']: {
    __typename: 'vaults_aggregate';
    aggregate?: GraphQLTypes['vaults_aggregate_fields'];
    nodes: Array<GraphQLTypes['vaults']>;
  };
  /** aggregate fields of "vaults" */
  ['vaults_aggregate_fields']: {
    __typename: 'vaults_aggregate_fields';
    avg?: GraphQLTypes['vaults_avg_fields'];
    count: number;
    max?: GraphQLTypes['vaults_max_fields'];
    min?: GraphQLTypes['vaults_min_fields'];
    stddev?: GraphQLTypes['vaults_stddev_fields'];
    stddev_pop?: GraphQLTypes['vaults_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['vaults_stddev_samp_fields'];
    sum?: GraphQLTypes['vaults_sum_fields'];
    var_pop?: GraphQLTypes['vaults_var_pop_fields'];
    var_samp?: GraphQLTypes['vaults_var_samp_fields'];
    variance?: GraphQLTypes['vaults_variance_fields'];
  };
  /** aggregate avg on columns */
  ['vaults_avg_fields']: {
    __typename: 'vaults_avg_fields';
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
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
  /** unique or primary key constraints on table "vaults" */
  ['vaults_constraint']: vaults_constraint;
  /** input type for incrementing numeric columns in table "vaults" */
  ['vaults_inc_input']: {
    created_by?: GraphQLTypes['bigint'];
    decimals?: number;
    id?: GraphQLTypes['bigint'];
    org_id?: GraphQLTypes['bigint'];
  };
  /** input type for inserting data into table "vaults" */
  ['vaults_insert_input']: {
    created_at?: GraphQLTypes['timestamptz'];
    created_by?: GraphQLTypes['bigint'];
    decimals?: number;
    id?: GraphQLTypes['bigint'];
    org_id?: GraphQLTypes['bigint'];
    protocol?: GraphQLTypes['organizations_obj_rel_insert_input'];
    simple_token_address?: string;
    symbol?: string;
    token_address?: string;
    updated_at?: GraphQLTypes['timestamptz'];
    user?: GraphQLTypes['users_obj_rel_insert_input'];
    vault_address?: string;
    vault_transactions?: GraphQLTypes['vault_transactions_arr_rel_insert_input'];
  };
  /** aggregate max on columns */
  ['vaults_max_fields']: {
    __typename: 'vaults_max_fields';
    created_at?: GraphQLTypes['timestamptz'];
    created_by?: GraphQLTypes['bigint'];
    decimals?: number;
    id?: GraphQLTypes['bigint'];
    org_id?: GraphQLTypes['bigint'];
    simple_token_address?: string;
    symbol?: string;
    token_address?: string;
    updated_at?: GraphQLTypes['timestamptz'];
    vault_address?: string;
  };
  /** aggregate min on columns */
  ['vaults_min_fields']: {
    __typename: 'vaults_min_fields';
    created_at?: GraphQLTypes['timestamptz'];
    created_by?: GraphQLTypes['bigint'];
    decimals?: number;
    id?: GraphQLTypes['bigint'];
    org_id?: GraphQLTypes['bigint'];
    simple_token_address?: string;
    symbol?: string;
    token_address?: string;
    updated_at?: GraphQLTypes['timestamptz'];
    vault_address?: string;
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
    /** on conflict condition */
    on_conflict?: GraphQLTypes['vaults_on_conflict'];
  };
  /** on conflict condition type for table "vaults" */
  ['vaults_on_conflict']: {
    constraint: GraphQLTypes['vaults_constraint'];
    update_columns: Array<GraphQLTypes['vaults_update_column']>;
    where?: GraphQLTypes['vaults_bool_exp'];
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
  /** primary key columns input for table: vaults */
  ['vaults_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "vaults" */
  ['vaults_select_column']: vaults_select_column;
  /** input type for updating data in table "vaults" */
  ['vaults_set_input']: {
    created_at?: GraphQLTypes['timestamptz'];
    created_by?: GraphQLTypes['bigint'];
    decimals?: number;
    id?: GraphQLTypes['bigint'];
    org_id?: GraphQLTypes['bigint'];
    simple_token_address?: string;
    symbol?: string;
    token_address?: string;
    updated_at?: GraphQLTypes['timestamptz'];
    vault_address?: string;
  };
  /** aggregate stddev on columns */
  ['vaults_stddev_fields']: {
    __typename: 'vaults_stddev_fields';
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** aggregate stddev_pop on columns */
  ['vaults_stddev_pop_fields']: {
    __typename: 'vaults_stddev_pop_fields';
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** aggregate stddev_samp on columns */
  ['vaults_stddev_samp_fields']: {
    __typename: 'vaults_stddev_samp_fields';
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** aggregate sum on columns */
  ['vaults_sum_fields']: {
    __typename: 'vaults_sum_fields';
    created_by?: GraphQLTypes['bigint'];
    decimals?: number;
    id?: GraphQLTypes['bigint'];
    org_id?: GraphQLTypes['bigint'];
  };
  /** update columns of table "vaults" */
  ['vaults_update_column']: vaults_update_column;
  /** aggregate var_pop on columns */
  ['vaults_var_pop_fields']: {
    __typename: 'vaults_var_pop_fields';
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** aggregate var_samp on columns */
  ['vaults_var_samp_fields']: {
    __typename: 'vaults_var_samp_fields';
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
  /** aggregate variance on columns */
  ['vaults_variance_fields']: {
    __typename: 'vaults_variance_fields';
    created_by?: number;
    decimals?: number;
    id?: number;
    org_id?: number;
  };
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
  /** aggregated selection of "vouches" */
  ['vouches_aggregate']: {
    __typename: 'vouches_aggregate';
    aggregate?: GraphQLTypes['vouches_aggregate_fields'];
    nodes: Array<GraphQLTypes['vouches']>;
  };
  /** aggregate fields of "vouches" */
  ['vouches_aggregate_fields']: {
    __typename: 'vouches_aggregate_fields';
    avg?: GraphQLTypes['vouches_avg_fields'];
    count: number;
    max?: GraphQLTypes['vouches_max_fields'];
    min?: GraphQLTypes['vouches_min_fields'];
    stddev?: GraphQLTypes['vouches_stddev_fields'];
    stddev_pop?: GraphQLTypes['vouches_stddev_pop_fields'];
    stddev_samp?: GraphQLTypes['vouches_stddev_samp_fields'];
    sum?: GraphQLTypes['vouches_sum_fields'];
    var_pop?: GraphQLTypes['vouches_var_pop_fields'];
    var_samp?: GraphQLTypes['vouches_var_samp_fields'];
    variance?: GraphQLTypes['vouches_variance_fields'];
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
  /** input type for inserting array relation for remote table "vouches" */
  ['vouches_arr_rel_insert_input']: {
    data: Array<GraphQLTypes['vouches_insert_input']>;
    /** on conflict condition */
    on_conflict?: GraphQLTypes['vouches_on_conflict'];
  };
  /** aggregate avg on columns */
  ['vouches_avg_fields']: {
    __typename: 'vouches_avg_fields';
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
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
  /** unique or primary key constraints on table "vouches" */
  ['vouches_constraint']: vouches_constraint;
  /** input type for incrementing numeric columns in table "vouches" */
  ['vouches_inc_input']: {
    id?: GraphQLTypes['bigint'];
    nominee_id?: number;
    voucher_id?: number;
  };
  /** input type for inserting data into table "vouches" */
  ['vouches_insert_input']: {
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    nominee?: GraphQLTypes['nominees_obj_rel_insert_input'];
    nominee_id?: number;
    updated_at?: GraphQLTypes['timestamp'];
    voucher?: GraphQLTypes['users_obj_rel_insert_input'];
    voucher_id?: number;
  };
  /** aggregate max on columns */
  ['vouches_max_fields']: {
    __typename: 'vouches_max_fields';
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    nominee_id?: number;
    updated_at?: GraphQLTypes['timestamp'];
    voucher_id?: number;
  };
  /** order by max() on columns of table "vouches" */
  ['vouches_max_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** aggregate min on columns */
  ['vouches_min_fields']: {
    __typename: 'vouches_min_fields';
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    nominee_id?: number;
    updated_at?: GraphQLTypes['timestamp'];
    voucher_id?: number;
  };
  /** order by min() on columns of table "vouches" */
  ['vouches_min_order_by']: {
    created_at?: GraphQLTypes['order_by'];
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    updated_at?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** response of any mutation on the table "vouches" */
  ['vouches_mutation_response']: {
    __typename: 'vouches_mutation_response';
    /** number of rows affected by the mutation */
    affected_rows: number;
    /** data from the rows affected by the mutation */
    returning: Array<GraphQLTypes['vouches']>;
  };
  /** on conflict condition type for table "vouches" */
  ['vouches_on_conflict']: {
    constraint: GraphQLTypes['vouches_constraint'];
    update_columns: Array<GraphQLTypes['vouches_update_column']>;
    where?: GraphQLTypes['vouches_bool_exp'];
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
  /** primary key columns input for table: vouches */
  ['vouches_pk_columns_input']: {
    id: GraphQLTypes['bigint'];
  };
  /** select columns of table "vouches" */
  ['vouches_select_column']: vouches_select_column;
  /** input type for updating data in table "vouches" */
  ['vouches_set_input']: {
    created_at?: GraphQLTypes['timestamp'];
    id?: GraphQLTypes['bigint'];
    nominee_id?: number;
    updated_at?: GraphQLTypes['timestamp'];
    voucher_id?: number;
  };
  /** aggregate stddev on columns */
  ['vouches_stddev_fields']: {
    __typename: 'vouches_stddev_fields';
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by stddev() on columns of table "vouches" */
  ['vouches_stddev_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_pop on columns */
  ['vouches_stddev_pop_fields']: {
    __typename: 'vouches_stddev_pop_fields';
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by stddev_pop() on columns of table "vouches" */
  ['vouches_stddev_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** aggregate stddev_samp on columns */
  ['vouches_stddev_samp_fields']: {
    __typename: 'vouches_stddev_samp_fields';
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by stddev_samp() on columns of table "vouches" */
  ['vouches_stddev_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** aggregate sum on columns */
  ['vouches_sum_fields']: {
    __typename: 'vouches_sum_fields';
    id?: GraphQLTypes['bigint'];
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by sum() on columns of table "vouches" */
  ['vouches_sum_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** update columns of table "vouches" */
  ['vouches_update_column']: vouches_update_column;
  /** aggregate var_pop on columns */
  ['vouches_var_pop_fields']: {
    __typename: 'vouches_var_pop_fields';
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by var_pop() on columns of table "vouches" */
  ['vouches_var_pop_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** aggregate var_samp on columns */
  ['vouches_var_samp_fields']: {
    __typename: 'vouches_var_samp_fields';
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by var_samp() on columns of table "vouches" */
  ['vouches_var_samp_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
  /** aggregate variance on columns */
  ['vouches_variance_fields']: {
    __typename: 'vouches_variance_fields';
    id?: number;
    nominee_id?: number;
    voucher_id?: number;
  };
  /** order by variance() on columns of table "vouches" */
  ['vouches_variance_order_by']: {
    id?: GraphQLTypes['order_by'];
    nominee_id?: GraphQLTypes['order_by'];
    voucher_id?: GraphQLTypes['order_by'];
  };
};
/** unique or primary key constraints on table "burns" */
export const enum burns_constraint {
  burns_pkey = 'burns_pkey',
}
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
/** update columns of table "burns" */
export const enum burns_update_column {
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
/** unique or primary key constraints on table "circle_integrations" */
export const enum circle_integrations_constraint {
  circle_integrations_pkey = 'circle_integrations_pkey',
}
/** select columns of table "circle_integrations" */
export const enum circle_integrations_select_column {
  circle_id = 'circle_id',
  data = 'data',
  id = 'id',
  name = 'name',
  type = 'type',
}
/** update columns of table "circle_integrations" */
export const enum circle_integrations_update_column {
  circle_id = 'circle_id',
  data = 'data',
  id = 'id',
  name = 'name',
  type = 'type',
}
/** unique or primary key constraints on table "circle_metadata" */
export const enum circle_metadata_constraint {
  circle_metadata_pkey = 'circle_metadata_pkey',
}
/** select columns of table "circle_metadata" */
export const enum circle_metadata_select_column {
  circle_id = 'circle_id',
  created_at = 'created_at',
  id = 'id',
  json = 'json',
  updated_at = 'updated_at',
}
/** update columns of table "circle_metadata" */
export const enum circle_metadata_update_column {
  circle_id = 'circle_id',
  created_at = 'created_at',
  id = 'id',
  json = 'json',
  updated_at = 'updated_at',
}
/** select columns of table "circle_private" */
export const enum circle_private_select_column {
  circle_id = 'circle_id',
  discord_webhook = 'discord_webhook',
}
/** unique or primary key constraints on table "circles" */
export const enum circles_constraint {
  circles_pkey = 'circles_pkey',
}
/** select columns of table "circles" */
export const enum circles_select_column {
  alloc_text = 'alloc_text',
  auto_opt_out = 'auto_opt_out',
  contact = 'contact',
  created_at = 'created_at',
  default_opt_in = 'default_opt_in',
  discord_webhook = 'discord_webhook',
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
  telegram_id = 'telegram_id',
  token_name = 'token_name',
  updated_at = 'updated_at',
  vouching = 'vouching',
  vouching_text = 'vouching_text',
}
/** update columns of table "circles" */
export const enum circles_update_column {
  alloc_text = 'alloc_text',
  auto_opt_out = 'auto_opt_out',
  contact = 'contact',
  created_at = 'created_at',
  default_opt_in = 'default_opt_in',
  discord_webhook = 'discord_webhook',
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
  telegram_id = 'telegram_id',
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
/** unique or primary key constraints on table "epoches" */
export const enum epochs_constraint {
  epoches_pkey = 'epoches_pkey',
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
  regift_days = 'regift_days',
  repeat = 'repeat',
  repeat_day_of_month = 'repeat_day_of_month',
  start_date = 'start_date',
  updated_at = 'updated_at',
}
/** update columns of table "epoches" */
export const enum epochs_update_column {
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
  regift_days = 'regift_days',
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
/** unique or primary key constraints on table "histories" */
export const enum histories_constraint {
  histories_pkey = 'histories_pkey',
}
/** select columns of table "histories" */
export const enum histories_select_column {
  bio = 'bio',
  circle_id = 'circle_id',
  created_at = 'created_at',
  epoch_id = 'epoch_id',
  id = 'id',
  updated_at = 'updated_at',
  user_id = 'user_id',
}
/** update columns of table "histories" */
export const enum histories_update_column {
  bio = 'bio',
  circle_id = 'circle_id',
  created_at = 'created_at',
  epoch_id = 'epoch_id',
  id = 'id',
  updated_at = 'updated_at',
  user_id = 'user_id',
}
/** unique or primary key constraints on table "nominees" */
export const enum nominees_constraint {
  nominees_pkey = 'nominees_pkey',
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
/** update columns of table "nominees" */
export const enum nominees_update_column {
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
/** unique or primary key constraints on table "protocols" */
export const enum organizations_constraint {
  protocols_pkey = 'protocols_pkey',
}
/** select columns of table "protocols" */
export const enum organizations_select_column {
  created_at = 'created_at',
  id = 'id',
  is_verified = 'is_verified',
  name = 'name',
  telegram_id = 'telegram_id',
  updated_at = 'updated_at',
}
/** update columns of table "protocols" */
export const enum organizations_update_column {
  created_at = 'created_at',
  id = 'id',
  is_verified = 'is_verified',
  name = 'name',
  telegram_id = 'telegram_id',
  updated_at = 'updated_at',
}
/** select columns of table "pending_gift_private" */
export const enum pending_gift_private_select_column {
  gift_id = 'gift_id',
  note = 'note',
  recipient_id = 'recipient_id',
  sender_id = 'sender_id',
}
/** unique or primary key constraints on table "pending_token_gifts" */
export const enum pending_token_gifts_constraint {
  pending_token_gifts_pkey = 'pending_token_gifts_pkey',
  pending_token_gifts_sender_id_recipient_id_epoch_id_key = 'pending_token_gifts_sender_id_recipient_id_epoch_id_key',
}
/** select columns of table "pending_token_gifts" */
export const enum pending_token_gifts_select_column {
  circle_id = 'circle_id',
  created_at = 'created_at',
  dts_created = 'dts_created',
  epoch_id = 'epoch_id',
  id = 'id',
  note = 'note',
  recipient_address = 'recipient_address',
  recipient_id = 'recipient_id',
  sender_address = 'sender_address',
  sender_id = 'sender_id',
  tokens = 'tokens',
  updated_at = 'updated_at',
}
/** update columns of table "pending_token_gifts" */
export const enum pending_token_gifts_update_column {
  circle_id = 'circle_id',
  created_at = 'created_at',
  dts_created = 'dts_created',
  epoch_id = 'epoch_id',
  id = 'id',
  note = 'note',
  recipient_address = 'recipient_address',
  recipient_id = 'recipient_id',
  sender_address = 'sender_address',
  sender_id = 'sender_id',
  tokens = 'tokens',
  updated_at = 'updated_at',
}
/** unique or primary key constraints on table "personal_access_tokens" */
export const enum personal_access_tokens_constraint {
  personal_access_tokens_pkey = 'personal_access_tokens_pkey',
  personal_access_tokens_token_key = 'personal_access_tokens_token_key',
}
/** select columns of table "personal_access_tokens" */
export const enum personal_access_tokens_select_column {
  abilities = 'abilities',
  created_at = 'created_at',
  id = 'id',
  last_used_at = 'last_used_at',
  name = 'name',
  token = 'token',
  tokenable_id = 'tokenable_id',
  tokenable_type = 'tokenable_type',
  updated_at = 'updated_at',
}
/** update columns of table "personal_access_tokens" */
export const enum personal_access_tokens_update_column {
  abilities = 'abilities',
  created_at = 'created_at',
  id = 'id',
  last_used_at = 'last_used_at',
  name = 'name',
  token = 'token',
  tokenable_id = 'tokenable_id',
  tokenable_type = 'tokenable_type',
  updated_at = 'updated_at',
}
/** unique or primary key constraints on table "profiles" */
export const enum profiles_constraint {
  profiles_address_key = 'profiles_address_key',
  profiles_pkey = 'profiles_pkey',
}
/** select columns of table "profiles" */
export const enum profiles_select_column {
  address = 'address',
  admin_view = 'admin_view',
  ann_power = 'ann_power',
  avatar = 'avatar',
  background = 'background',
  bio = 'bio',
  chat_id = 'chat_id',
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
/** update columns of table "profiles" */
export const enum profiles_update_column {
  address = 'address',
  admin_view = 'admin_view',
  ann_power = 'ann_power',
  avatar = 'avatar',
  background = 'background',
  bio = 'bio',
  chat_id = 'chat_id',
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
/** unique or primary key constraints on table "teammates" */
export const enum teammates_constraint {
  teammates_pkey = 'teammates_pkey',
  teammates_user_id_team_mate_id_key = 'teammates_user_id_team_mate_id_key',
}
/** select columns of table "teammates" */
export const enum teammates_select_column {
  created_at = 'created_at',
  id = 'id',
  team_mate_id = 'team_mate_id',
  updated_at = 'updated_at',
  user_id = 'user_id',
}
/** update columns of table "teammates" */
export const enum teammates_update_column {
  created_at = 'created_at',
  id = 'id',
  team_mate_id = 'team_mate_id',
  updated_at = 'updated_at',
  user_id = 'user_id',
}
/** unique or primary key constraints on table "token_gifts" */
export const enum token_gifts_constraint {
  token_gifts_pkey = 'token_gifts_pkey',
}
/** select columns of table "token_gifts" */
export const enum token_gifts_select_column {
  circle_id = 'circle_id',
  created_at = 'created_at',
  dts_created = 'dts_created',
  epoch_id = 'epoch_id',
  id = 'id',
  note = 'note',
  recipient_address = 'recipient_address',
  recipient_id = 'recipient_id',
  sender_address = 'sender_address',
  sender_id = 'sender_id',
  tokens = 'tokens',
  updated_at = 'updated_at',
}
/** update columns of table "token_gifts" */
export const enum token_gifts_update_column {
  circle_id = 'circle_id',
  created_at = 'created_at',
  dts_created = 'dts_created',
  epoch_id = 'epoch_id',
  id = 'id',
  note = 'note',
  recipient_address = 'recipient_address',
  recipient_id = 'recipient_id',
  sender_address = 'sender_address',
  sender_id = 'sender_id',
  tokens = 'tokens',
  updated_at = 'updated_at',
}
/** unique or primary key constraints on table "users" */
export const enum users_constraint {
  users_pkey = 'users_pkey',
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
/** update columns of table "users" */
export const enum users_update_column {
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
/** unique or primary key constraints on table "vault_transactions" */
export const enum vault_transactions_constraint {
  vault_transactions_pkey = 'vault_transactions_pkey',
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
/** update columns of table "vault_transactions" */
export const enum vault_transactions_update_column {
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
/** unique or primary key constraints on table "vaults" */
export const enum vaults_constraint {
  vaults_pkey = 'vaults_pkey',
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
/** update columns of table "vaults" */
export const enum vaults_update_column {
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
/** unique or primary key constraints on table "vouches" */
export const enum vouches_constraint {
  vouches_pkey = 'vouches_pkey',
}
/** select columns of table "vouches" */
export const enum vouches_select_column {
  created_at = 'created_at',
  id = 'id',
  nominee_id = 'nominee_id',
  updated_at = 'updated_at',
  voucher_id = 'voucher_id',
}
/** update columns of table "vouches" */
export const enum vouches_update_column {
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
    let fetchFunction;
    let queryString = query;
    let fetchOptions = options[1] || {};
    try {
      fetchFunction = require('node-fetch');
    } catch (error) {
      throw new Error(
        "Please install 'node-fetch' to use zeus in nodejs environment"
      );
    }
    if (fetchOptions.method && fetchOptions.method === 'GET') {
      try {
        queryString = require('querystring').stringify(query);
      } catch (error) {
        throw new Error(
          "Something gone wrong 'querystring' is a part of nodejs environment"
        );
      }
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
    const WebSocket = require('ws');
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
    throw new Error('No websockets implemented. Please install ws');
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
