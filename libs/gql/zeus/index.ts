/* eslint-disable */

import { AllTypesProps, ReturnTypes } from './const';
type ZEUS_INTERFACES = never
type ZEUS_UNIONS = never

export type ValueTypes = {
    /** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
["Boolean_comparison_exp"]: {
	_eq?:boolean | null,
	_gt?:boolean | null,
	_gte?:boolean | null,
	_in?:boolean[],
	_is_null?:boolean | null,
	_lt?:boolean | null,
	_lte?:boolean | null,
	_neq?:boolean | null,
	_nin?:boolean[]
};
	/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
["Int_comparison_exp"]: {
	_eq?:number | null,
	_gt?:number | null,
	_gte?:number | null,
	_in?:number[],
	_is_null?:boolean | null,
	_lt?:number | null,
	_lte?:number | null,
	_neq?:number | null,
	_nin?:number[]
};
	/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
["String_comparison_exp"]: {
	_eq?:string | null,
	_gt?:string | null,
	_gte?:string | null,
	/** does the column match the given case-insensitive pattern */
	_ilike?:string | null,
	_in?:string[],
	/** does the column match the given POSIX regular expression, case insensitive */
	_iregex?:string | null,
	_is_null?:boolean | null,
	/** does the column match the given pattern */
	_like?:string | null,
	_lt?:string | null,
	_lte?:string | null,
	_neq?:string | null,
	/** does the column NOT match the given case-insensitive pattern */
	_nilike?:string | null,
	_nin?:string[],
	/** does the column NOT match the given POSIX regular expression, case insensitive */
	_niregex?:string | null,
	/** does the column NOT match the given pattern */
	_nlike?:string | null,
	/** does the column NOT match the given POSIX regular expression, case sensitive */
	_nregex?:string | null,
	/** does the column NOT match the given SQL regular expression */
	_nsimilar?:string | null,
	/** does the column match the given POSIX regular expression, case sensitive */
	_regex?:string | null,
	/** does the column match the given SQL regular expression */
	_similar?:string | null
};
	["bigint"]:unknown;
	/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
["bigint_comparison_exp"]: {
	_eq?:ValueTypes["bigint"] | null,
	_gt?:ValueTypes["bigint"] | null,
	_gte?:ValueTypes["bigint"] | null,
	_in?:ValueTypes["bigint"][],
	_is_null?:boolean | null,
	_lt?:ValueTypes["bigint"] | null,
	_lte?:ValueTypes["bigint"] | null,
	_neq?:ValueTypes["bigint"] | null,
	_nin?:ValueTypes["bigint"][]
};
	/** columns and relationships of "circles" */
["circles"]: AliasType<{
	alloc_text?:boolean,
	auto_opt_out?:boolean,
	created_at?:boolean,
	default_opt_in?:boolean,
	discord_webhook?:boolean,
epochs?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["epochs_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["epochs_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["epochs_bool_exp"] | null},ValueTypes["epochs"]],
epochs_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["epochs_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["epochs_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["epochs_bool_exp"] | null},ValueTypes["epochs_aggregate"]],
	id?:boolean,
	is_verified?:boolean,
	logo?:boolean,
	min_vouches?:boolean,
	name?:boolean,
	nomination_days_limit?:boolean,
	only_giver_vouch?:boolean,
	/** An object relationship */
	organization?:ValueTypes["organizations"],
	protocol_id?:boolean,
	team_sel_text?:boolean,
	team_selection?:boolean,
	telegram_id?:boolean,
	token_name?:boolean,
	updated_at?:boolean,
users?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["users_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["users_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["users_bool_exp"] | null},ValueTypes["users"]],
users_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["users_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["users_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["users_bool_exp"] | null},ValueTypes["users_aggregate"]],
	vouching?:boolean,
	vouching_text?:boolean,
		__typename?: boolean
}>;
	/** aggregated selection of "circles" */
["circles_aggregate"]: AliasType<{
	aggregate?:ValueTypes["circles_aggregate_fields"],
	nodes?:ValueTypes["circles"],
		__typename?: boolean
}>;
	/** aggregate fields of "circles" */
["circles_aggregate_fields"]: AliasType<{
	avg?:ValueTypes["circles_avg_fields"],
count?: [{	columns?:ValueTypes["circles_select_column"][],	distinct?:boolean | null},boolean],
	max?:ValueTypes["circles_max_fields"],
	min?:ValueTypes["circles_min_fields"],
	stddev?:ValueTypes["circles_stddev_fields"],
	stddev_pop?:ValueTypes["circles_stddev_pop_fields"],
	stddev_samp?:ValueTypes["circles_stddev_samp_fields"],
	sum?:ValueTypes["circles_sum_fields"],
	var_pop?:ValueTypes["circles_var_pop_fields"],
	var_samp?:ValueTypes["circles_var_samp_fields"],
	variance?:ValueTypes["circles_variance_fields"],
		__typename?: boolean
}>;
	/** order by aggregate values of table "circles" */
["circles_aggregate_order_by"]: {
	avg?:ValueTypes["circles_avg_order_by"] | null,
	count?:ValueTypes["order_by"] | null,
	max?:ValueTypes["circles_max_order_by"] | null,
	min?:ValueTypes["circles_min_order_by"] | null,
	stddev?:ValueTypes["circles_stddev_order_by"] | null,
	stddev_pop?:ValueTypes["circles_stddev_pop_order_by"] | null,
	stddev_samp?:ValueTypes["circles_stddev_samp_order_by"] | null,
	sum?:ValueTypes["circles_sum_order_by"] | null,
	var_pop?:ValueTypes["circles_var_pop_order_by"] | null,
	var_samp?:ValueTypes["circles_var_samp_order_by"] | null,
	variance?:ValueTypes["circles_variance_order_by"] | null
};
	/** input type for inserting array relation for remote table "circles" */
["circles_arr_rel_insert_input"]: {
	data:ValueTypes["circles_insert_input"][],
	/** on conflict condition */
	on_conflict?:ValueTypes["circles_on_conflict"] | null
};
	/** aggregate avg on columns */
["circles_avg_fields"]: AliasType<{
	id?:boolean,
	min_vouches?:boolean,
	nomination_days_limit?:boolean,
	protocol_id?:boolean,
		__typename?: boolean
}>;
	/** order by avg() on columns of table "circles" */
["circles_avg_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null
};
	/** Boolean expression to filter rows from the table "circles". All fields are combined with a logical 'AND'. */
["circles_bool_exp"]: {
	_and?:ValueTypes["circles_bool_exp"][],
	_not?:ValueTypes["circles_bool_exp"] | null,
	_or?:ValueTypes["circles_bool_exp"][],
	alloc_text?:ValueTypes["String_comparison_exp"] | null,
	auto_opt_out?:ValueTypes["Boolean_comparison_exp"] | null,
	created_at?:ValueTypes["timestamp_comparison_exp"] | null,
	default_opt_in?:ValueTypes["Boolean_comparison_exp"] | null,
	discord_webhook?:ValueTypes["String_comparison_exp"] | null,
	epochs?:ValueTypes["epochs_bool_exp"] | null,
	id?:ValueTypes["bigint_comparison_exp"] | null,
	is_verified?:ValueTypes["Boolean_comparison_exp"] | null,
	logo?:ValueTypes["String_comparison_exp"] | null,
	min_vouches?:ValueTypes["Int_comparison_exp"] | null,
	name?:ValueTypes["String_comparison_exp"] | null,
	nomination_days_limit?:ValueTypes["Int_comparison_exp"] | null,
	only_giver_vouch?:ValueTypes["Boolean_comparison_exp"] | null,
	organization?:ValueTypes["organizations_bool_exp"] | null,
	protocol_id?:ValueTypes["Int_comparison_exp"] | null,
	team_sel_text?:ValueTypes["String_comparison_exp"] | null,
	team_selection?:ValueTypes["Boolean_comparison_exp"] | null,
	telegram_id?:ValueTypes["String_comparison_exp"] | null,
	token_name?:ValueTypes["String_comparison_exp"] | null,
	updated_at?:ValueTypes["timestamp_comparison_exp"] | null,
	users?:ValueTypes["users_bool_exp"] | null,
	vouching?:ValueTypes["Boolean_comparison_exp"] | null,
	vouching_text?:ValueTypes["String_comparison_exp"] | null
};
	/** unique or primary key constraints on table "circles" */
["circles_constraint"]:circles_constraint;
	/** input type for incrementing numeric columns in table "circles" */
["circles_inc_input"]: {
	id?:ValueTypes["bigint"] | null,
	min_vouches?:number | null,
	nomination_days_limit?:number | null,
	protocol_id?:number | null
};
	/** input type for inserting data into table "circles" */
["circles_insert_input"]: {
	alloc_text?:string | null,
	auto_opt_out?:boolean | null,
	created_at?:ValueTypes["timestamp"] | null,
	default_opt_in?:boolean | null,
	discord_webhook?:string | null,
	epochs?:ValueTypes["epochs_arr_rel_insert_input"] | null,
	id?:ValueTypes["bigint"] | null,
	is_verified?:boolean | null,
	logo?:string | null,
	min_vouches?:number | null,
	name?:string | null,
	nomination_days_limit?:number | null,
	only_giver_vouch?:boolean | null,
	organization?:ValueTypes["organizations_obj_rel_insert_input"] | null,
	protocol_id?:number | null,
	team_sel_text?:string | null,
	team_selection?:boolean | null,
	telegram_id?:string | null,
	token_name?:string | null,
	updated_at?:ValueTypes["timestamp"] | null,
	users?:ValueTypes["users_arr_rel_insert_input"] | null,
	vouching?:boolean | null,
	vouching_text?:string | null
};
	/** aggregate max on columns */
["circles_max_fields"]: AliasType<{
	alloc_text?:boolean,
	created_at?:boolean,
	discord_webhook?:boolean,
	id?:boolean,
	logo?:boolean,
	min_vouches?:boolean,
	name?:boolean,
	nomination_days_limit?:boolean,
	protocol_id?:boolean,
	team_sel_text?:boolean,
	telegram_id?:boolean,
	token_name?:boolean,
	updated_at?:boolean,
	vouching_text?:boolean,
		__typename?: boolean
}>;
	/** order by max() on columns of table "circles" */
["circles_max_order_by"]: {
	alloc_text?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	discord_webhook?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	logo?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	name?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null,
	team_sel_text?:ValueTypes["order_by"] | null,
	telegram_id?:ValueTypes["order_by"] | null,
	token_name?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null,
	vouching_text?:ValueTypes["order_by"] | null
};
	/** aggregate min on columns */
["circles_min_fields"]: AliasType<{
	alloc_text?:boolean,
	created_at?:boolean,
	discord_webhook?:boolean,
	id?:boolean,
	logo?:boolean,
	min_vouches?:boolean,
	name?:boolean,
	nomination_days_limit?:boolean,
	protocol_id?:boolean,
	team_sel_text?:boolean,
	telegram_id?:boolean,
	token_name?:boolean,
	updated_at?:boolean,
	vouching_text?:boolean,
		__typename?: boolean
}>;
	/** order by min() on columns of table "circles" */
["circles_min_order_by"]: {
	alloc_text?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	discord_webhook?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	logo?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	name?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null,
	team_sel_text?:ValueTypes["order_by"] | null,
	telegram_id?:ValueTypes["order_by"] | null,
	token_name?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null,
	vouching_text?:ValueTypes["order_by"] | null
};
	/** response of any mutation on the table "circles" */
["circles_mutation_response"]: AliasType<{
	/** number of rows affected by the mutation */
	affected_rows?:boolean,
	/** data from the rows affected by the mutation */
	returning?:ValueTypes["circles"],
		__typename?: boolean
}>;
	/** input type for inserting object relation for remote table "circles" */
["circles_obj_rel_insert_input"]: {
	data:ValueTypes["circles_insert_input"],
	/** on conflict condition */
	on_conflict?:ValueTypes["circles_on_conflict"] | null
};
	/** on conflict condition type for table "circles" */
["circles_on_conflict"]: {
	constraint:ValueTypes["circles_constraint"],
	update_columns:ValueTypes["circles_update_column"][],
	where?:ValueTypes["circles_bool_exp"] | null
};
	/** Ordering options when selecting data from "circles". */
["circles_order_by"]: {
	alloc_text?:ValueTypes["order_by"] | null,
	auto_opt_out?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	default_opt_in?:ValueTypes["order_by"] | null,
	discord_webhook?:ValueTypes["order_by"] | null,
	epochs_aggregate?:ValueTypes["epochs_aggregate_order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	is_verified?:ValueTypes["order_by"] | null,
	logo?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	name?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	only_giver_vouch?:ValueTypes["order_by"] | null,
	organization?:ValueTypes["organizations_order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null,
	team_sel_text?:ValueTypes["order_by"] | null,
	team_selection?:ValueTypes["order_by"] | null,
	telegram_id?:ValueTypes["order_by"] | null,
	token_name?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null,
	users_aggregate?:ValueTypes["users_aggregate_order_by"] | null,
	vouching?:ValueTypes["order_by"] | null,
	vouching_text?:ValueTypes["order_by"] | null
};
	/** primary key columns input for table: circles */
["circles_pk_columns_input"]: {
	id:ValueTypes["bigint"]
};
	/** select columns of table "circles" */
["circles_select_column"]:circles_select_column;
	/** input type for updating data in table "circles" */
["circles_set_input"]: {
	alloc_text?:string | null,
	auto_opt_out?:boolean | null,
	created_at?:ValueTypes["timestamp"] | null,
	default_opt_in?:boolean | null,
	discord_webhook?:string | null,
	id?:ValueTypes["bigint"] | null,
	is_verified?:boolean | null,
	logo?:string | null,
	min_vouches?:number | null,
	name?:string | null,
	nomination_days_limit?:number | null,
	only_giver_vouch?:boolean | null,
	protocol_id?:number | null,
	team_sel_text?:string | null,
	team_selection?:boolean | null,
	telegram_id?:string | null,
	token_name?:string | null,
	updated_at?:ValueTypes["timestamp"] | null,
	vouching?:boolean | null,
	vouching_text?:string | null
};
	/** aggregate stddev on columns */
["circles_stddev_fields"]: AliasType<{
	id?:boolean,
	min_vouches?:boolean,
	nomination_days_limit?:boolean,
	protocol_id?:boolean,
		__typename?: boolean
}>;
	/** order by stddev() on columns of table "circles" */
["circles_stddev_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null
};
	/** aggregate stddev_pop on columns */
["circles_stddev_pop_fields"]: AliasType<{
	id?:boolean,
	min_vouches?:boolean,
	nomination_days_limit?:boolean,
	protocol_id?:boolean,
		__typename?: boolean
}>;
	/** order by stddev_pop() on columns of table "circles" */
["circles_stddev_pop_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null
};
	/** aggregate stddev_samp on columns */
["circles_stddev_samp_fields"]: AliasType<{
	id?:boolean,
	min_vouches?:boolean,
	nomination_days_limit?:boolean,
	protocol_id?:boolean,
		__typename?: boolean
}>;
	/** order by stddev_samp() on columns of table "circles" */
["circles_stddev_samp_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null
};
	/** aggregate sum on columns */
["circles_sum_fields"]: AliasType<{
	id?:boolean,
	min_vouches?:boolean,
	nomination_days_limit?:boolean,
	protocol_id?:boolean,
		__typename?: boolean
}>;
	/** order by sum() on columns of table "circles" */
["circles_sum_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null
};
	/** update columns of table "circles" */
["circles_update_column"]:circles_update_column;
	/** aggregate var_pop on columns */
["circles_var_pop_fields"]: AliasType<{
	id?:boolean,
	min_vouches?:boolean,
	nomination_days_limit?:boolean,
	protocol_id?:boolean,
		__typename?: boolean
}>;
	/** order by var_pop() on columns of table "circles" */
["circles_var_pop_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null
};
	/** aggregate var_samp on columns */
["circles_var_samp_fields"]: AliasType<{
	id?:boolean,
	min_vouches?:boolean,
	nomination_days_limit?:boolean,
	protocol_id?:boolean,
		__typename?: boolean
}>;
	/** order by var_samp() on columns of table "circles" */
["circles_var_samp_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null
};
	/** aggregate variance on columns */
["circles_variance_fields"]: AliasType<{
	id?:boolean,
	min_vouches?:boolean,
	nomination_days_limit?:boolean,
	protocol_id?:boolean,
		__typename?: boolean
}>;
	/** order by variance() on columns of table "circles" */
["circles_variance_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	min_vouches?:ValueTypes["order_by"] | null,
	nomination_days_limit?:ValueTypes["order_by"] | null,
	protocol_id?:ValueTypes["order_by"] | null
};
	["date"]:unknown;
	/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
["date_comparison_exp"]: {
	_eq?:ValueTypes["date"] | null,
	_gt?:ValueTypes["date"] | null,
	_gte?:ValueTypes["date"] | null,
	_in?:ValueTypes["date"][],
	_is_null?:boolean | null,
	_lt?:ValueTypes["date"] | null,
	_lte?:ValueTypes["date"] | null,
	_neq?:ValueTypes["date"] | null,
	_nin?:ValueTypes["date"][]
};
	/** columns and relationships of "epoches" */
["epochs"]: AliasType<{
	/** An object relationship */
	circle?:ValueTypes["circles"],
	circle_id?:boolean,
	created_at?:boolean,
	days?:boolean,
	end_date?:boolean,
	ended?:boolean,
	grant?:boolean,
	id?:boolean,
	notified_before_end?:boolean,
	notified_end?:boolean,
	notified_start?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
	start_date?:boolean,
	updated_at?:boolean,
		__typename?: boolean
}>;
	/** aggregated selection of "epoches" */
["epochs_aggregate"]: AliasType<{
	aggregate?:ValueTypes["epochs_aggregate_fields"],
	nodes?:ValueTypes["epochs"],
		__typename?: boolean
}>;
	/** aggregate fields of "epoches" */
["epochs_aggregate_fields"]: AliasType<{
	avg?:ValueTypes["epochs_avg_fields"],
count?: [{	columns?:ValueTypes["epochs_select_column"][],	distinct?:boolean | null},boolean],
	max?:ValueTypes["epochs_max_fields"],
	min?:ValueTypes["epochs_min_fields"],
	stddev?:ValueTypes["epochs_stddev_fields"],
	stddev_pop?:ValueTypes["epochs_stddev_pop_fields"],
	stddev_samp?:ValueTypes["epochs_stddev_samp_fields"],
	sum?:ValueTypes["epochs_sum_fields"],
	var_pop?:ValueTypes["epochs_var_pop_fields"],
	var_samp?:ValueTypes["epochs_var_samp_fields"],
	variance?:ValueTypes["epochs_variance_fields"],
		__typename?: boolean
}>;
	/** order by aggregate values of table "epoches" */
["epochs_aggregate_order_by"]: {
	avg?:ValueTypes["epochs_avg_order_by"] | null,
	count?:ValueTypes["order_by"] | null,
	max?:ValueTypes["epochs_max_order_by"] | null,
	min?:ValueTypes["epochs_min_order_by"] | null,
	stddev?:ValueTypes["epochs_stddev_order_by"] | null,
	stddev_pop?:ValueTypes["epochs_stddev_pop_order_by"] | null,
	stddev_samp?:ValueTypes["epochs_stddev_samp_order_by"] | null,
	sum?:ValueTypes["epochs_sum_order_by"] | null,
	var_pop?:ValueTypes["epochs_var_pop_order_by"] | null,
	var_samp?:ValueTypes["epochs_var_samp_order_by"] | null,
	variance?:ValueTypes["epochs_variance_order_by"] | null
};
	/** input type for inserting array relation for remote table "epoches" */
["epochs_arr_rel_insert_input"]: {
	data:ValueTypes["epochs_insert_input"][],
	/** on conflict condition */
	on_conflict?:ValueTypes["epochs_on_conflict"] | null
};
	/** aggregate avg on columns */
["epochs_avg_fields"]: AliasType<{
	circle_id?:boolean,
	days?:boolean,
	grant?:boolean,
	id?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
		__typename?: boolean
}>;
	/** order by avg() on columns of table "epoches" */
["epochs_avg_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null
};
	/** Boolean expression to filter rows from the table "epoches". All fields are combined with a logical 'AND'. */
["epochs_bool_exp"]: {
	_and?:ValueTypes["epochs_bool_exp"][],
	_not?:ValueTypes["epochs_bool_exp"] | null,
	_or?:ValueTypes["epochs_bool_exp"][],
	circle?:ValueTypes["circles_bool_exp"] | null,
	circle_id?:ValueTypes["Int_comparison_exp"] | null,
	created_at?:ValueTypes["timestamp_comparison_exp"] | null,
	days?:ValueTypes["Int_comparison_exp"] | null,
	end_date?:ValueTypes["timestamptz_comparison_exp"] | null,
	ended?:ValueTypes["Boolean_comparison_exp"] | null,
	grant?:ValueTypes["numeric_comparison_exp"] | null,
	id?:ValueTypes["bigint_comparison_exp"] | null,
	notified_before_end?:ValueTypes["timestamp_comparison_exp"] | null,
	notified_end?:ValueTypes["timestamp_comparison_exp"] | null,
	notified_start?:ValueTypes["timestamp_comparison_exp"] | null,
	number?:ValueTypes["Int_comparison_exp"] | null,
	regift_days?:ValueTypes["Int_comparison_exp"] | null,
	repeat?:ValueTypes["Int_comparison_exp"] | null,
	repeat_day_of_month?:ValueTypes["Int_comparison_exp"] | null,
	start_date?:ValueTypes["timestamptz_comparison_exp"] | null,
	updated_at?:ValueTypes["timestamp_comparison_exp"] | null
};
	/** unique or primary key constraints on table "epoches" */
["epochs_constraint"]:epochs_constraint;
	/** input type for incrementing numeric columns in table "epoches" */
["epochs_inc_input"]: {
	circle_id?:number | null,
	days?:number | null,
	grant?:ValueTypes["numeric"] | null,
	id?:ValueTypes["bigint"] | null,
	number?:number | null,
	regift_days?:number | null,
	repeat?:number | null,
	repeat_day_of_month?:number | null
};
	/** input type for inserting data into table "epoches" */
["epochs_insert_input"]: {
	circle?:ValueTypes["circles_obj_rel_insert_input"] | null,
	circle_id?:number | null,
	created_at?:ValueTypes["timestamp"] | null,
	days?:number | null,
	end_date?:ValueTypes["timestamptz"] | null,
	ended?:boolean | null,
	grant?:ValueTypes["numeric"] | null,
	id?:ValueTypes["bigint"] | null,
	notified_before_end?:ValueTypes["timestamp"] | null,
	notified_end?:ValueTypes["timestamp"] | null,
	notified_start?:ValueTypes["timestamp"] | null,
	number?:number | null,
	regift_days?:number | null,
	repeat?:number | null,
	repeat_day_of_month?:number | null,
	start_date?:ValueTypes["timestamptz"] | null,
	updated_at?:ValueTypes["timestamp"] | null
};
	/** aggregate max on columns */
["epochs_max_fields"]: AliasType<{
	circle_id?:boolean,
	created_at?:boolean,
	days?:boolean,
	end_date?:boolean,
	grant?:boolean,
	id?:boolean,
	notified_before_end?:boolean,
	notified_end?:boolean,
	notified_start?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
	start_date?:boolean,
	updated_at?:boolean,
		__typename?: boolean
}>;
	/** order by max() on columns of table "epoches" */
["epochs_max_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	end_date?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	notified_before_end?:ValueTypes["order_by"] | null,
	notified_end?:ValueTypes["order_by"] | null,
	notified_start?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null,
	start_date?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null
};
	/** aggregate min on columns */
["epochs_min_fields"]: AliasType<{
	circle_id?:boolean,
	created_at?:boolean,
	days?:boolean,
	end_date?:boolean,
	grant?:boolean,
	id?:boolean,
	notified_before_end?:boolean,
	notified_end?:boolean,
	notified_start?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
	start_date?:boolean,
	updated_at?:boolean,
		__typename?: boolean
}>;
	/** order by min() on columns of table "epoches" */
["epochs_min_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	end_date?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	notified_before_end?:ValueTypes["order_by"] | null,
	notified_end?:ValueTypes["order_by"] | null,
	notified_start?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null,
	start_date?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null
};
	/** response of any mutation on the table "epoches" */
["epochs_mutation_response"]: AliasType<{
	/** number of rows affected by the mutation */
	affected_rows?:boolean,
	/** data from the rows affected by the mutation */
	returning?:ValueTypes["epochs"],
		__typename?: boolean
}>;
	/** on conflict condition type for table "epoches" */
["epochs_on_conflict"]: {
	constraint:ValueTypes["epochs_constraint"],
	update_columns:ValueTypes["epochs_update_column"][],
	where?:ValueTypes["epochs_bool_exp"] | null
};
	/** Ordering options when selecting data from "epoches". */
["epochs_order_by"]: {
	circle?:ValueTypes["circles_order_by"] | null,
	circle_id?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	end_date?:ValueTypes["order_by"] | null,
	ended?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	notified_before_end?:ValueTypes["order_by"] | null,
	notified_end?:ValueTypes["order_by"] | null,
	notified_start?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null,
	start_date?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null
};
	/** primary key columns input for table: epochs */
["epochs_pk_columns_input"]: {
	id:ValueTypes["bigint"]
};
	/** select columns of table "epoches" */
["epochs_select_column"]:epochs_select_column;
	/** input type for updating data in table "epoches" */
["epochs_set_input"]: {
	circle_id?:number | null,
	created_at?:ValueTypes["timestamp"] | null,
	days?:number | null,
	end_date?:ValueTypes["timestamptz"] | null,
	ended?:boolean | null,
	grant?:ValueTypes["numeric"] | null,
	id?:ValueTypes["bigint"] | null,
	notified_before_end?:ValueTypes["timestamp"] | null,
	notified_end?:ValueTypes["timestamp"] | null,
	notified_start?:ValueTypes["timestamp"] | null,
	number?:number | null,
	regift_days?:number | null,
	repeat?:number | null,
	repeat_day_of_month?:number | null,
	start_date?:ValueTypes["timestamptz"] | null,
	updated_at?:ValueTypes["timestamp"] | null
};
	/** aggregate stddev on columns */
["epochs_stddev_fields"]: AliasType<{
	circle_id?:boolean,
	days?:boolean,
	grant?:boolean,
	id?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
		__typename?: boolean
}>;
	/** order by stddev() on columns of table "epoches" */
["epochs_stddev_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null
};
	/** aggregate stddev_pop on columns */
["epochs_stddev_pop_fields"]: AliasType<{
	circle_id?:boolean,
	days?:boolean,
	grant?:boolean,
	id?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
		__typename?: boolean
}>;
	/** order by stddev_pop() on columns of table "epoches" */
["epochs_stddev_pop_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null
};
	/** aggregate stddev_samp on columns */
["epochs_stddev_samp_fields"]: AliasType<{
	circle_id?:boolean,
	days?:boolean,
	grant?:boolean,
	id?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
		__typename?: boolean
}>;
	/** order by stddev_samp() on columns of table "epoches" */
["epochs_stddev_samp_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null
};
	/** aggregate sum on columns */
["epochs_sum_fields"]: AliasType<{
	circle_id?:boolean,
	days?:boolean,
	grant?:boolean,
	id?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
		__typename?: boolean
}>;
	/** order by sum() on columns of table "epoches" */
["epochs_sum_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null
};
	/** update columns of table "epoches" */
["epochs_update_column"]:epochs_update_column;
	/** aggregate var_pop on columns */
["epochs_var_pop_fields"]: AliasType<{
	circle_id?:boolean,
	days?:boolean,
	grant?:boolean,
	id?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
		__typename?: boolean
}>;
	/** order by var_pop() on columns of table "epoches" */
["epochs_var_pop_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null
};
	/** aggregate var_samp on columns */
["epochs_var_samp_fields"]: AliasType<{
	circle_id?:boolean,
	days?:boolean,
	grant?:boolean,
	id?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
		__typename?: boolean
}>;
	/** order by var_samp() on columns of table "epoches" */
["epochs_var_samp_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null
};
	/** aggregate variance on columns */
["epochs_variance_fields"]: AliasType<{
	circle_id?:boolean,
	days?:boolean,
	grant?:boolean,
	id?:boolean,
	number?:boolean,
	regift_days?:boolean,
	repeat?:boolean,
	repeat_day_of_month?:boolean,
		__typename?: boolean
}>;
	/** order by variance() on columns of table "epoches" */
["epochs_variance_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	days?:ValueTypes["order_by"] | null,
	grant?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	number?:ValueTypes["order_by"] | null,
	regift_days?:ValueTypes["order_by"] | null,
	repeat?:ValueTypes["order_by"] | null,
	repeat_day_of_month?:ValueTypes["order_by"] | null
};
	/** mutation root */
["mutation_root"]: AliasType<{
delete_circles?: [{	/** filter the rows which have to be deleted */
	where:ValueTypes["circles_bool_exp"]},ValueTypes["circles_mutation_response"]],
delete_circles_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["circles"]],
delete_epochs?: [{	/** filter the rows which have to be deleted */
	where:ValueTypes["epochs_bool_exp"]},ValueTypes["epochs_mutation_response"]],
delete_epochs_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["epochs"]],
delete_nominees?: [{	/** filter the rows which have to be deleted */
	where:ValueTypes["nominees_bool_exp"]},ValueTypes["nominees_mutation_response"]],
delete_nominees_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["nominees"]],
delete_organizations?: [{	/** filter the rows which have to be deleted */
	where:ValueTypes["organizations_bool_exp"]},ValueTypes["organizations_mutation_response"]],
delete_organizations_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["organizations"]],
delete_profiles?: [{	/** filter the rows which have to be deleted */
	where:ValueTypes["profiles_bool_exp"]},ValueTypes["profiles_mutation_response"]],
delete_profiles_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["profiles"]],
delete_users?: [{	/** filter the rows which have to be deleted */
	where:ValueTypes["users_bool_exp"]},ValueTypes["users_mutation_response"]],
delete_users_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["users"]],
delete_vouches?: [{	/** filter the rows which have to be deleted */
	where:ValueTypes["vouches_bool_exp"]},ValueTypes["vouches_mutation_response"]],
delete_vouches_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["vouches"]],
insert_circles?: [{	/** the rows to be inserted */
	objects:ValueTypes["circles_insert_input"][],	/** on conflict condition */
	on_conflict?:ValueTypes["circles_on_conflict"] | null},ValueTypes["circles_mutation_response"]],
insert_circles_one?: [{	/** the row to be inserted */
	object:ValueTypes["circles_insert_input"],	/** on conflict condition */
	on_conflict?:ValueTypes["circles_on_conflict"] | null},ValueTypes["circles"]],
insert_epochs?: [{	/** the rows to be inserted */
	objects:ValueTypes["epochs_insert_input"][],	/** on conflict condition */
	on_conflict?:ValueTypes["epochs_on_conflict"] | null},ValueTypes["epochs_mutation_response"]],
insert_epochs_one?: [{	/** the row to be inserted */
	object:ValueTypes["epochs_insert_input"],	/** on conflict condition */
	on_conflict?:ValueTypes["epochs_on_conflict"] | null},ValueTypes["epochs"]],
insert_nominees?: [{	/** the rows to be inserted */
	objects:ValueTypes["nominees_insert_input"][],	/** on conflict condition */
	on_conflict?:ValueTypes["nominees_on_conflict"] | null},ValueTypes["nominees_mutation_response"]],
insert_nominees_one?: [{	/** the row to be inserted */
	object:ValueTypes["nominees_insert_input"],	/** on conflict condition */
	on_conflict?:ValueTypes["nominees_on_conflict"] | null},ValueTypes["nominees"]],
insert_organizations?: [{	/** the rows to be inserted */
	objects:ValueTypes["organizations_insert_input"][],	/** on conflict condition */
	on_conflict?:ValueTypes["organizations_on_conflict"] | null},ValueTypes["organizations_mutation_response"]],
insert_organizations_one?: [{	/** the row to be inserted */
	object:ValueTypes["organizations_insert_input"],	/** on conflict condition */
	on_conflict?:ValueTypes["organizations_on_conflict"] | null},ValueTypes["organizations"]],
insert_profiles?: [{	/** the rows to be inserted */
	objects:ValueTypes["profiles_insert_input"][],	/** on conflict condition */
	on_conflict?:ValueTypes["profiles_on_conflict"] | null},ValueTypes["profiles_mutation_response"]],
insert_profiles_one?: [{	/** the row to be inserted */
	object:ValueTypes["profiles_insert_input"],	/** on conflict condition */
	on_conflict?:ValueTypes["profiles_on_conflict"] | null},ValueTypes["profiles"]],
insert_users?: [{	/** the rows to be inserted */
	objects:ValueTypes["users_insert_input"][],	/** on conflict condition */
	on_conflict?:ValueTypes["users_on_conflict"] | null},ValueTypes["users_mutation_response"]],
insert_users_one?: [{	/** the row to be inserted */
	object:ValueTypes["users_insert_input"],	/** on conflict condition */
	on_conflict?:ValueTypes["users_on_conflict"] | null},ValueTypes["users"]],
insert_vouches?: [{	/** the rows to be inserted */
	objects:ValueTypes["vouches_insert_input"][],	/** on conflict condition */
	on_conflict?:ValueTypes["vouches_on_conflict"] | null},ValueTypes["vouches_mutation_response"]],
insert_vouches_one?: [{	/** the row to be inserted */
	object:ValueTypes["vouches_insert_input"],	/** on conflict condition */
	on_conflict?:ValueTypes["vouches_on_conflict"] | null},ValueTypes["vouches"]],
update_circles?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["circles_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["circles_set_input"] | null,	/** filter the rows which have to be updated */
	where:ValueTypes["circles_bool_exp"]},ValueTypes["circles_mutation_response"]],
update_circles_by_pk?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["circles_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["circles_set_input"] | null,	pk_columns:ValueTypes["circles_pk_columns_input"]},ValueTypes["circles"]],
update_epochs?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["epochs_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["epochs_set_input"] | null,	/** filter the rows which have to be updated */
	where:ValueTypes["epochs_bool_exp"]},ValueTypes["epochs_mutation_response"]],
update_epochs_by_pk?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["epochs_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["epochs_set_input"] | null,	pk_columns:ValueTypes["epochs_pk_columns_input"]},ValueTypes["epochs"]],
update_nominees?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["nominees_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["nominees_set_input"] | null,	/** filter the rows which have to be updated */
	where:ValueTypes["nominees_bool_exp"]},ValueTypes["nominees_mutation_response"]],
update_nominees_by_pk?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["nominees_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["nominees_set_input"] | null,	pk_columns:ValueTypes["nominees_pk_columns_input"]},ValueTypes["nominees"]],
update_organizations?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["organizations_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["organizations_set_input"] | null,	/** filter the rows which have to be updated */
	where:ValueTypes["organizations_bool_exp"]},ValueTypes["organizations_mutation_response"]],
update_organizations_by_pk?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["organizations_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["organizations_set_input"] | null,	pk_columns:ValueTypes["organizations_pk_columns_input"]},ValueTypes["organizations"]],
update_profiles?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["profiles_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["profiles_set_input"] | null,	/** filter the rows which have to be updated */
	where:ValueTypes["profiles_bool_exp"]},ValueTypes["profiles_mutation_response"]],
update_profiles_by_pk?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["profiles_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["profiles_set_input"] | null,	pk_columns:ValueTypes["profiles_pk_columns_input"]},ValueTypes["profiles"]],
update_users?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["users_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["users_set_input"] | null,	/** filter the rows which have to be updated */
	where:ValueTypes["users_bool_exp"]},ValueTypes["users_mutation_response"]],
update_users_by_pk?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["users_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["users_set_input"] | null,	pk_columns:ValueTypes["users_pk_columns_input"]},ValueTypes["users"]],
update_vouches?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["vouches_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["vouches_set_input"] | null,	/** filter the rows which have to be updated */
	where:ValueTypes["vouches_bool_exp"]},ValueTypes["vouches_mutation_response"]],
update_vouches_by_pk?: [{	/** increments the numeric columns with given value of the filtered values */
	_inc?:ValueTypes["vouches_inc_input"] | null,	/** sets the columns of the filtered rows to the given values */
	_set?:ValueTypes["vouches_set_input"] | null,	pk_columns:ValueTypes["vouches_pk_columns_input"]},ValueTypes["vouches"]],
		__typename?: boolean
}>;
	/** columns and relationships of "nominees" */
["nominees"]: AliasType<{
	address?:boolean,
	/** An object relationship */
	circle?:ValueTypes["circles"],
	circle_id?:boolean,
	created_at?:boolean,
	description?:boolean,
	ended?:boolean,
	expiry_date?:boolean,
	id?:boolean,
	name?:boolean,
	nominated_by_user_id?:boolean,
	nominated_date?:boolean,
nominations?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["vouches_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["vouches_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["vouches_bool_exp"] | null},ValueTypes["vouches"]],
nominations_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["vouches_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["vouches_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["vouches_bool_exp"] | null},ValueTypes["vouches_aggregate"]],
	/** An object relationship */
	nominator?:ValueTypes["users"],
	updated_at?:boolean,
	/** An object relationship */
	user?:ValueTypes["users"],
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	/** aggregated selection of "nominees" */
["nominees_aggregate"]: AliasType<{
	aggregate?:ValueTypes["nominees_aggregate_fields"],
	nodes?:ValueTypes["nominees"],
		__typename?: boolean
}>;
	/** aggregate fields of "nominees" */
["nominees_aggregate_fields"]: AliasType<{
	avg?:ValueTypes["nominees_avg_fields"],
count?: [{	columns?:ValueTypes["nominees_select_column"][],	distinct?:boolean | null},boolean],
	max?:ValueTypes["nominees_max_fields"],
	min?:ValueTypes["nominees_min_fields"],
	stddev?:ValueTypes["nominees_stddev_fields"],
	stddev_pop?:ValueTypes["nominees_stddev_pop_fields"],
	stddev_samp?:ValueTypes["nominees_stddev_samp_fields"],
	sum?:ValueTypes["nominees_sum_fields"],
	var_pop?:ValueTypes["nominees_var_pop_fields"],
	var_samp?:ValueTypes["nominees_var_samp_fields"],
	variance?:ValueTypes["nominees_variance_fields"],
		__typename?: boolean
}>;
	/** aggregate avg on columns */
["nominees_avg_fields"]: AliasType<{
	circle_id?:boolean,
	id?:boolean,
	nominated_by_user_id?:boolean,
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	/** Boolean expression to filter rows from the table "nominees". All fields are combined with a logical 'AND'. */
["nominees_bool_exp"]: {
	_and?:ValueTypes["nominees_bool_exp"][],
	_not?:ValueTypes["nominees_bool_exp"] | null,
	_or?:ValueTypes["nominees_bool_exp"][],
	address?:ValueTypes["String_comparison_exp"] | null,
	circle?:ValueTypes["circles_bool_exp"] | null,
	circle_id?:ValueTypes["Int_comparison_exp"] | null,
	created_at?:ValueTypes["timestamp_comparison_exp"] | null,
	description?:ValueTypes["String_comparison_exp"] | null,
	ended?:ValueTypes["Boolean_comparison_exp"] | null,
	expiry_date?:ValueTypes["date_comparison_exp"] | null,
	id?:ValueTypes["bigint_comparison_exp"] | null,
	name?:ValueTypes["String_comparison_exp"] | null,
	nominated_by_user_id?:ValueTypes["Int_comparison_exp"] | null,
	nominated_date?:ValueTypes["date_comparison_exp"] | null,
	nominations?:ValueTypes["vouches_bool_exp"] | null,
	nominator?:ValueTypes["users_bool_exp"] | null,
	updated_at?:ValueTypes["timestamp_comparison_exp"] | null,
	user?:ValueTypes["users_bool_exp"] | null,
	user_id?:ValueTypes["Int_comparison_exp"] | null,
	vouches_required?:ValueTypes["Int_comparison_exp"] | null
};
	/** unique or primary key constraints on table "nominees" */
["nominees_constraint"]:nominees_constraint;
	/** input type for incrementing numeric columns in table "nominees" */
["nominees_inc_input"]: {
	circle_id?:number | null,
	id?:ValueTypes["bigint"] | null,
	nominated_by_user_id?:number | null,
	user_id?:number | null,
	vouches_required?:number | null
};
	/** input type for inserting data into table "nominees" */
["nominees_insert_input"]: {
	address?:string | null,
	circle?:ValueTypes["circles_obj_rel_insert_input"] | null,
	circle_id?:number | null,
	created_at?:ValueTypes["timestamp"] | null,
	description?:string | null,
	ended?:boolean | null,
	expiry_date?:ValueTypes["date"] | null,
	id?:ValueTypes["bigint"] | null,
	name?:string | null,
	nominated_by_user_id?:number | null,
	nominated_date?:ValueTypes["date"] | null,
	nominations?:ValueTypes["vouches_arr_rel_insert_input"] | null,
	nominator?:ValueTypes["users_obj_rel_insert_input"] | null,
	updated_at?:ValueTypes["timestamp"] | null,
	user?:ValueTypes["users_obj_rel_insert_input"] | null,
	user_id?:number | null,
	vouches_required?:number | null
};
	/** aggregate max on columns */
["nominees_max_fields"]: AliasType<{
	address?:boolean,
	circle_id?:boolean,
	created_at?:boolean,
	description?:boolean,
	expiry_date?:boolean,
	id?:boolean,
	name?:boolean,
	nominated_by_user_id?:boolean,
	nominated_date?:boolean,
	updated_at?:boolean,
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	/** aggregate min on columns */
["nominees_min_fields"]: AliasType<{
	address?:boolean,
	circle_id?:boolean,
	created_at?:boolean,
	description?:boolean,
	expiry_date?:boolean,
	id?:boolean,
	name?:boolean,
	nominated_by_user_id?:boolean,
	nominated_date?:boolean,
	updated_at?:boolean,
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	/** response of any mutation on the table "nominees" */
["nominees_mutation_response"]: AliasType<{
	/** number of rows affected by the mutation */
	affected_rows?:boolean,
	/** data from the rows affected by the mutation */
	returning?:ValueTypes["nominees"],
		__typename?: boolean
}>;
	/** input type for inserting object relation for remote table "nominees" */
["nominees_obj_rel_insert_input"]: {
	data:ValueTypes["nominees_insert_input"],
	/** on conflict condition */
	on_conflict?:ValueTypes["nominees_on_conflict"] | null
};
	/** on conflict condition type for table "nominees" */
["nominees_on_conflict"]: {
	constraint:ValueTypes["nominees_constraint"],
	update_columns:ValueTypes["nominees_update_column"][],
	where?:ValueTypes["nominees_bool_exp"] | null
};
	/** Ordering options when selecting data from "nominees". */
["nominees_order_by"]: {
	address?:ValueTypes["order_by"] | null,
	circle?:ValueTypes["circles_order_by"] | null,
	circle_id?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	description?:ValueTypes["order_by"] | null,
	ended?:ValueTypes["order_by"] | null,
	expiry_date?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	name?:ValueTypes["order_by"] | null,
	nominated_by_user_id?:ValueTypes["order_by"] | null,
	nominated_date?:ValueTypes["order_by"] | null,
	nominations_aggregate?:ValueTypes["vouches_aggregate_order_by"] | null,
	nominator?:ValueTypes["users_order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null,
	user?:ValueTypes["users_order_by"] | null,
	user_id?:ValueTypes["order_by"] | null,
	vouches_required?:ValueTypes["order_by"] | null
};
	/** primary key columns input for table: nominees */
["nominees_pk_columns_input"]: {
	id:ValueTypes["bigint"]
};
	/** select columns of table "nominees" */
["nominees_select_column"]:nominees_select_column;
	/** input type for updating data in table "nominees" */
["nominees_set_input"]: {
	address?:string | null,
	circle_id?:number | null,
	created_at?:ValueTypes["timestamp"] | null,
	description?:string | null,
	ended?:boolean | null,
	expiry_date?:ValueTypes["date"] | null,
	id?:ValueTypes["bigint"] | null,
	name?:string | null,
	nominated_by_user_id?:number | null,
	nominated_date?:ValueTypes["date"] | null,
	updated_at?:ValueTypes["timestamp"] | null,
	user_id?:number | null,
	vouches_required?:number | null
};
	/** aggregate stddev on columns */
["nominees_stddev_fields"]: AliasType<{
	circle_id?:boolean,
	id?:boolean,
	nominated_by_user_id?:boolean,
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	/** aggregate stddev_pop on columns */
["nominees_stddev_pop_fields"]: AliasType<{
	circle_id?:boolean,
	id?:boolean,
	nominated_by_user_id?:boolean,
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	/** aggregate stddev_samp on columns */
["nominees_stddev_samp_fields"]: AliasType<{
	circle_id?:boolean,
	id?:boolean,
	nominated_by_user_id?:boolean,
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	/** aggregate sum on columns */
["nominees_sum_fields"]: AliasType<{
	circle_id?:boolean,
	id?:boolean,
	nominated_by_user_id?:boolean,
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	/** update columns of table "nominees" */
["nominees_update_column"]:nominees_update_column;
	/** aggregate var_pop on columns */
["nominees_var_pop_fields"]: AliasType<{
	circle_id?:boolean,
	id?:boolean,
	nominated_by_user_id?:boolean,
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	/** aggregate var_samp on columns */
["nominees_var_samp_fields"]: AliasType<{
	circle_id?:boolean,
	id?:boolean,
	nominated_by_user_id?:boolean,
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	/** aggregate variance on columns */
["nominees_variance_fields"]: AliasType<{
	circle_id?:boolean,
	id?:boolean,
	nominated_by_user_id?:boolean,
	user_id?:boolean,
	vouches_required?:boolean,
		__typename?: boolean
}>;
	["numeric"]:unknown;
	/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
["numeric_comparison_exp"]: {
	_eq?:ValueTypes["numeric"] | null,
	_gt?:ValueTypes["numeric"] | null,
	_gte?:ValueTypes["numeric"] | null,
	_in?:ValueTypes["numeric"][],
	_is_null?:boolean | null,
	_lt?:ValueTypes["numeric"] | null,
	_lte?:ValueTypes["numeric"] | null,
	_neq?:ValueTypes["numeric"] | null,
	_nin?:ValueTypes["numeric"][]
};
	/** column ordering options */
["order_by"]:order_by;
	/** columns and relationships of "protocols" */
["organizations"]: AliasType<{
circles?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["circles_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["circles_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["circles_bool_exp"] | null},ValueTypes["circles"]],
circles_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["circles_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["circles_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["circles_bool_exp"] | null},ValueTypes["circles_aggregate"]],
	created_at?:boolean,
	id?:boolean,
	is_verified?:boolean,
	name?:boolean,
	telegram_id?:boolean,
	updated_at?:boolean,
		__typename?: boolean
}>;
	/** aggregated selection of "protocols" */
["organizations_aggregate"]: AliasType<{
	aggregate?:ValueTypes["organizations_aggregate_fields"],
	nodes?:ValueTypes["organizations"],
		__typename?: boolean
}>;
	/** aggregate fields of "protocols" */
["organizations_aggregate_fields"]: AliasType<{
	avg?:ValueTypes["organizations_avg_fields"],
count?: [{	columns?:ValueTypes["organizations_select_column"][],	distinct?:boolean | null},boolean],
	max?:ValueTypes["organizations_max_fields"],
	min?:ValueTypes["organizations_min_fields"],
	stddev?:ValueTypes["organizations_stddev_fields"],
	stddev_pop?:ValueTypes["organizations_stddev_pop_fields"],
	stddev_samp?:ValueTypes["organizations_stddev_samp_fields"],
	sum?:ValueTypes["organizations_sum_fields"],
	var_pop?:ValueTypes["organizations_var_pop_fields"],
	var_samp?:ValueTypes["organizations_var_samp_fields"],
	variance?:ValueTypes["organizations_variance_fields"],
		__typename?: boolean
}>;
	/** aggregate avg on columns */
["organizations_avg_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
["organizations_bool_exp"]: {
	_and?:ValueTypes["organizations_bool_exp"][],
	_not?:ValueTypes["organizations_bool_exp"] | null,
	_or?:ValueTypes["organizations_bool_exp"][],
	circles?:ValueTypes["circles_bool_exp"] | null,
	created_at?:ValueTypes["timestamp_comparison_exp"] | null,
	id?:ValueTypes["bigint_comparison_exp"] | null,
	is_verified?:ValueTypes["Boolean_comparison_exp"] | null,
	name?:ValueTypes["String_comparison_exp"] | null,
	telegram_id?:ValueTypes["String_comparison_exp"] | null,
	updated_at?:ValueTypes["timestamp_comparison_exp"] | null
};
	/** unique or primary key constraints on table "protocols" */
["organizations_constraint"]:organizations_constraint;
	/** input type for incrementing numeric columns in table "protocols" */
["organizations_inc_input"]: {
	id?:ValueTypes["bigint"] | null
};
	/** input type for inserting data into table "protocols" */
["organizations_insert_input"]: {
	circles?:ValueTypes["circles_arr_rel_insert_input"] | null,
	created_at?:ValueTypes["timestamp"] | null,
	id?:ValueTypes["bigint"] | null,
	is_verified?:boolean | null,
	name?:string | null,
	telegram_id?:string | null,
	updated_at?:ValueTypes["timestamp"] | null
};
	/** aggregate max on columns */
["organizations_max_fields"]: AliasType<{
	created_at?:boolean,
	id?:boolean,
	name?:boolean,
	telegram_id?:boolean,
	updated_at?:boolean,
		__typename?: boolean
}>;
	/** aggregate min on columns */
["organizations_min_fields"]: AliasType<{
	created_at?:boolean,
	id?:boolean,
	name?:boolean,
	telegram_id?:boolean,
	updated_at?:boolean,
		__typename?: boolean
}>;
	/** response of any mutation on the table "protocols" */
["organizations_mutation_response"]: AliasType<{
	/** number of rows affected by the mutation */
	affected_rows?:boolean,
	/** data from the rows affected by the mutation */
	returning?:ValueTypes["organizations"],
		__typename?: boolean
}>;
	/** input type for inserting object relation for remote table "protocols" */
["organizations_obj_rel_insert_input"]: {
	data:ValueTypes["organizations_insert_input"],
	/** on conflict condition */
	on_conflict?:ValueTypes["organizations_on_conflict"] | null
};
	/** on conflict condition type for table "protocols" */
["organizations_on_conflict"]: {
	constraint:ValueTypes["organizations_constraint"],
	update_columns:ValueTypes["organizations_update_column"][],
	where?:ValueTypes["organizations_bool_exp"] | null
};
	/** Ordering options when selecting data from "protocols". */
["organizations_order_by"]: {
	circles_aggregate?:ValueTypes["circles_aggregate_order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	is_verified?:ValueTypes["order_by"] | null,
	name?:ValueTypes["order_by"] | null,
	telegram_id?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null
};
	/** primary key columns input for table: organizations */
["organizations_pk_columns_input"]: {
	id:ValueTypes["bigint"]
};
	/** select columns of table "protocols" */
["organizations_select_column"]:organizations_select_column;
	/** input type for updating data in table "protocols" */
["organizations_set_input"]: {
	created_at?:ValueTypes["timestamp"] | null,
	id?:ValueTypes["bigint"] | null,
	is_verified?:boolean | null,
	name?:string | null,
	telegram_id?:string | null,
	updated_at?:ValueTypes["timestamp"] | null
};
	/** aggregate stddev on columns */
["organizations_stddev_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** aggregate stddev_pop on columns */
["organizations_stddev_pop_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** aggregate stddev_samp on columns */
["organizations_stddev_samp_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** aggregate sum on columns */
["organizations_sum_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** update columns of table "protocols" */
["organizations_update_column"]:organizations_update_column;
	/** aggregate var_pop on columns */
["organizations_var_pop_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** aggregate var_samp on columns */
["organizations_var_samp_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** aggregate variance on columns */
["organizations_variance_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** columns and relationships of "profiles" */
["profiles"]: AliasType<{
	address?:boolean,
	admin_view?:boolean,
	ann_power?:boolean,
	avatar?:boolean,
	background?:boolean,
	bio?:boolean,
	chat_id?:boolean,
	created_at?:boolean,
	discord_username?:boolean,
	github_username?:boolean,
	id?:boolean,
	medium_username?:boolean,
	skills?:boolean,
	telegram_username?:boolean,
	twitter_username?:boolean,
	updated_at?:boolean,
users?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["users_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["users_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["users_bool_exp"] | null},ValueTypes["users"]],
users_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["users_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["users_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["users_bool_exp"] | null},ValueTypes["users_aggregate"]],
	website?:boolean,
		__typename?: boolean
}>;
	/** aggregated selection of "profiles" */
["profiles_aggregate"]: AliasType<{
	aggregate?:ValueTypes["profiles_aggregate_fields"],
	nodes?:ValueTypes["profiles"],
		__typename?: boolean
}>;
	/** aggregate fields of "profiles" */
["profiles_aggregate_fields"]: AliasType<{
	avg?:ValueTypes["profiles_avg_fields"],
count?: [{	columns?:ValueTypes["profiles_select_column"][],	distinct?:boolean | null},boolean],
	max?:ValueTypes["profiles_max_fields"],
	min?:ValueTypes["profiles_min_fields"],
	stddev?:ValueTypes["profiles_stddev_fields"],
	stddev_pop?:ValueTypes["profiles_stddev_pop_fields"],
	stddev_samp?:ValueTypes["profiles_stddev_samp_fields"],
	sum?:ValueTypes["profiles_sum_fields"],
	var_pop?:ValueTypes["profiles_var_pop_fields"],
	var_samp?:ValueTypes["profiles_var_samp_fields"],
	variance?:ValueTypes["profiles_variance_fields"],
		__typename?: boolean
}>;
	/** aggregate avg on columns */
["profiles_avg_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
["profiles_bool_exp"]: {
	_and?:ValueTypes["profiles_bool_exp"][],
	_not?:ValueTypes["profiles_bool_exp"] | null,
	_or?:ValueTypes["profiles_bool_exp"][],
	address?:ValueTypes["String_comparison_exp"] | null,
	admin_view?:ValueTypes["Boolean_comparison_exp"] | null,
	ann_power?:ValueTypes["Boolean_comparison_exp"] | null,
	avatar?:ValueTypes["String_comparison_exp"] | null,
	background?:ValueTypes["String_comparison_exp"] | null,
	bio?:ValueTypes["String_comparison_exp"] | null,
	chat_id?:ValueTypes["String_comparison_exp"] | null,
	created_at?:ValueTypes["timestamp_comparison_exp"] | null,
	discord_username?:ValueTypes["String_comparison_exp"] | null,
	github_username?:ValueTypes["String_comparison_exp"] | null,
	id?:ValueTypes["bigint_comparison_exp"] | null,
	medium_username?:ValueTypes["String_comparison_exp"] | null,
	skills?:ValueTypes["String_comparison_exp"] | null,
	telegram_username?:ValueTypes["String_comparison_exp"] | null,
	twitter_username?:ValueTypes["String_comparison_exp"] | null,
	updated_at?:ValueTypes["timestamp_comparison_exp"] | null,
	users?:ValueTypes["users_bool_exp"] | null,
	website?:ValueTypes["String_comparison_exp"] | null
};
	/** unique or primary key constraints on table "profiles" */
["profiles_constraint"]:profiles_constraint;
	/** input type for incrementing numeric columns in table "profiles" */
["profiles_inc_input"]: {
	id?:ValueTypes["bigint"] | null
};
	/** input type for inserting data into table "profiles" */
["profiles_insert_input"]: {
	address?:string | null,
	admin_view?:boolean | null,
	ann_power?:boolean | null,
	avatar?:string | null,
	background?:string | null,
	bio?:string | null,
	chat_id?:string | null,
	created_at?:ValueTypes["timestamp"] | null,
	discord_username?:string | null,
	github_username?:string | null,
	id?:ValueTypes["bigint"] | null,
	medium_username?:string | null,
	skills?:string | null,
	telegram_username?:string | null,
	twitter_username?:string | null,
	updated_at?:ValueTypes["timestamp"] | null,
	users?:ValueTypes["users_arr_rel_insert_input"] | null,
	website?:string | null
};
	/** aggregate max on columns */
["profiles_max_fields"]: AliasType<{
	address?:boolean,
	avatar?:boolean,
	background?:boolean,
	bio?:boolean,
	chat_id?:boolean,
	created_at?:boolean,
	discord_username?:boolean,
	github_username?:boolean,
	id?:boolean,
	medium_username?:boolean,
	skills?:boolean,
	telegram_username?:boolean,
	twitter_username?:boolean,
	updated_at?:boolean,
	website?:boolean,
		__typename?: boolean
}>;
	/** aggregate min on columns */
["profiles_min_fields"]: AliasType<{
	address?:boolean,
	avatar?:boolean,
	background?:boolean,
	bio?:boolean,
	chat_id?:boolean,
	created_at?:boolean,
	discord_username?:boolean,
	github_username?:boolean,
	id?:boolean,
	medium_username?:boolean,
	skills?:boolean,
	telegram_username?:boolean,
	twitter_username?:boolean,
	updated_at?:boolean,
	website?:boolean,
		__typename?: boolean
}>;
	/** response of any mutation on the table "profiles" */
["profiles_mutation_response"]: AliasType<{
	/** number of rows affected by the mutation */
	affected_rows?:boolean,
	/** data from the rows affected by the mutation */
	returning?:ValueTypes["profiles"],
		__typename?: boolean
}>;
	/** input type for inserting object relation for remote table "profiles" */
["profiles_obj_rel_insert_input"]: {
	data:ValueTypes["profiles_insert_input"],
	/** on conflict condition */
	on_conflict?:ValueTypes["profiles_on_conflict"] | null
};
	/** on conflict condition type for table "profiles" */
["profiles_on_conflict"]: {
	constraint:ValueTypes["profiles_constraint"],
	update_columns:ValueTypes["profiles_update_column"][],
	where?:ValueTypes["profiles_bool_exp"] | null
};
	/** Ordering options when selecting data from "profiles". */
["profiles_order_by"]: {
	address?:ValueTypes["order_by"] | null,
	admin_view?:ValueTypes["order_by"] | null,
	ann_power?:ValueTypes["order_by"] | null,
	avatar?:ValueTypes["order_by"] | null,
	background?:ValueTypes["order_by"] | null,
	bio?:ValueTypes["order_by"] | null,
	chat_id?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	discord_username?:ValueTypes["order_by"] | null,
	github_username?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	medium_username?:ValueTypes["order_by"] | null,
	skills?:ValueTypes["order_by"] | null,
	telegram_username?:ValueTypes["order_by"] | null,
	twitter_username?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null,
	users_aggregate?:ValueTypes["users_aggregate_order_by"] | null,
	website?:ValueTypes["order_by"] | null
};
	/** primary key columns input for table: profiles */
["profiles_pk_columns_input"]: {
	id:ValueTypes["bigint"]
};
	/** select columns of table "profiles" */
["profiles_select_column"]:profiles_select_column;
	/** input type for updating data in table "profiles" */
["profiles_set_input"]: {
	address?:string | null,
	admin_view?:boolean | null,
	ann_power?:boolean | null,
	avatar?:string | null,
	background?:string | null,
	bio?:string | null,
	chat_id?:string | null,
	created_at?:ValueTypes["timestamp"] | null,
	discord_username?:string | null,
	github_username?:string | null,
	id?:ValueTypes["bigint"] | null,
	medium_username?:string | null,
	skills?:string | null,
	telegram_username?:string | null,
	twitter_username?:string | null,
	updated_at?:ValueTypes["timestamp"] | null,
	website?:string | null
};
	/** aggregate stddev on columns */
["profiles_stddev_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** aggregate stddev_pop on columns */
["profiles_stddev_pop_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** aggregate stddev_samp on columns */
["profiles_stddev_samp_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** aggregate sum on columns */
["profiles_sum_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** update columns of table "profiles" */
["profiles_update_column"]:profiles_update_column;
	/** aggregate var_pop on columns */
["profiles_var_pop_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** aggregate var_samp on columns */
["profiles_var_samp_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	/** aggregate variance on columns */
["profiles_variance_fields"]: AliasType<{
	id?:boolean,
		__typename?: boolean
}>;
	["query_root"]: AliasType<{
circles?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["circles_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["circles_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["circles_bool_exp"] | null},ValueTypes["circles"]],
circles_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["circles_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["circles_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["circles_bool_exp"] | null},ValueTypes["circles_aggregate"]],
circles_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["circles"]],
epochs?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["epochs_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["epochs_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["epochs_bool_exp"] | null},ValueTypes["epochs"]],
epochs_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["epochs_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["epochs_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["epochs_bool_exp"] | null},ValueTypes["epochs_aggregate"]],
epochs_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["epochs"]],
nominees?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["nominees_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["nominees_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["nominees_bool_exp"] | null},ValueTypes["nominees"]],
nominees_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["nominees_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["nominees_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["nominees_bool_exp"] | null},ValueTypes["nominees_aggregate"]],
nominees_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["nominees"]],
organizations?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["organizations_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["organizations_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["organizations_bool_exp"] | null},ValueTypes["organizations"]],
organizations_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["organizations_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["organizations_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["organizations_bool_exp"] | null},ValueTypes["organizations_aggregate"]],
organizations_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["organizations"]],
profiles?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["profiles_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["profiles_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["profiles_bool_exp"] | null},ValueTypes["profiles"]],
profiles_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["profiles_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["profiles_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["profiles_bool_exp"] | null},ValueTypes["profiles_aggregate"]],
profiles_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["profiles"]],
users?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["users_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["users_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["users_bool_exp"] | null},ValueTypes["users"]],
users_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["users_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["users_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["users_bool_exp"] | null},ValueTypes["users_aggregate"]],
users_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["users"]],
vouches?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["vouches_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["vouches_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["vouches_bool_exp"] | null},ValueTypes["vouches"]],
vouches_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["vouches_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["vouches_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["vouches_bool_exp"] | null},ValueTypes["vouches_aggregate"]],
vouches_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["vouches"]],
		__typename?: boolean
}>;
	["subscription_root"]: AliasType<{
circles?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["circles_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["circles_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["circles_bool_exp"] | null},ValueTypes["circles"]],
circles_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["circles_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["circles_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["circles_bool_exp"] | null},ValueTypes["circles_aggregate"]],
circles_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["circles"]],
epochs?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["epochs_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["epochs_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["epochs_bool_exp"] | null},ValueTypes["epochs"]],
epochs_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["epochs_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["epochs_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["epochs_bool_exp"] | null},ValueTypes["epochs_aggregate"]],
epochs_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["epochs"]],
nominees?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["nominees_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["nominees_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["nominees_bool_exp"] | null},ValueTypes["nominees"]],
nominees_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["nominees_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["nominees_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["nominees_bool_exp"] | null},ValueTypes["nominees_aggregate"]],
nominees_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["nominees"]],
organizations?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["organizations_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["organizations_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["organizations_bool_exp"] | null},ValueTypes["organizations"]],
organizations_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["organizations_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["organizations_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["organizations_bool_exp"] | null},ValueTypes["organizations_aggregate"]],
organizations_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["organizations"]],
profiles?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["profiles_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["profiles_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["profiles_bool_exp"] | null},ValueTypes["profiles"]],
profiles_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["profiles_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["profiles_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["profiles_bool_exp"] | null},ValueTypes["profiles_aggregate"]],
profiles_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["profiles"]],
users?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["users_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["users_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["users_bool_exp"] | null},ValueTypes["users"]],
users_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["users_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["users_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["users_bool_exp"] | null},ValueTypes["users_aggregate"]],
users_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["users"]],
vouches?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["vouches_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["vouches_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["vouches_bool_exp"] | null},ValueTypes["vouches"]],
vouches_aggregate?: [{	/** distinct select on columns */
	distinct_on?:ValueTypes["vouches_select_column"][],	/** limit the number of rows returned */
	limit?:number | null,	/** skip the first n rows. Use only with order_by */
	offset?:number | null,	/** sort the rows by one or more columns */
	order_by?:ValueTypes["vouches_order_by"][],	/** filter the rows returned */
	where?:ValueTypes["vouches_bool_exp"] | null},ValueTypes["vouches_aggregate"]],
vouches_by_pk?: [{	id:ValueTypes["bigint"]},ValueTypes["vouches"]],
		__typename?: boolean
}>;
	["timestamp"]:unknown;
	/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
["timestamp_comparison_exp"]: {
	_eq?:ValueTypes["timestamp"] | null,
	_gt?:ValueTypes["timestamp"] | null,
	_gte?:ValueTypes["timestamp"] | null,
	_in?:ValueTypes["timestamp"][],
	_is_null?:boolean | null,
	_lt?:ValueTypes["timestamp"] | null,
	_lte?:ValueTypes["timestamp"] | null,
	_neq?:ValueTypes["timestamp"] | null,
	_nin?:ValueTypes["timestamp"][]
};
	["timestamptz"]:unknown;
	/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
["timestamptz_comparison_exp"]: {
	_eq?:ValueTypes["timestamptz"] | null,
	_gt?:ValueTypes["timestamptz"] | null,
	_gte?:ValueTypes["timestamptz"] | null,
	_in?:ValueTypes["timestamptz"][],
	_is_null?:boolean | null,
	_lt?:ValueTypes["timestamptz"] | null,
	_lte?:ValueTypes["timestamptz"] | null,
	_neq?:ValueTypes["timestamptz"] | null,
	_nin?:ValueTypes["timestamptz"][]
};
	/** columns and relationships of "users" */
["users"]: AliasType<{
	address?:boolean,
	bio?:boolean,
	/** An object relationship */
	circle?:ValueTypes["circles"],
	circle_id?:boolean,
	created_at?:boolean,
	deleted_at?:boolean,
	epoch_first_visit?:boolean,
	fixed_non_receiver?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	name?:boolean,
	non_giver?:boolean,
	non_receiver?:boolean,
	/** An object relationship */
	profile?:ValueTypes["profiles"],
	role?:boolean,
	starting_tokens?:boolean,
	updated_at?:boolean,
		__typename?: boolean
}>;
	/** aggregated selection of "users" */
["users_aggregate"]: AliasType<{
	aggregate?:ValueTypes["users_aggregate_fields"],
	nodes?:ValueTypes["users"],
		__typename?: boolean
}>;
	/** aggregate fields of "users" */
["users_aggregate_fields"]: AliasType<{
	avg?:ValueTypes["users_avg_fields"],
count?: [{	columns?:ValueTypes["users_select_column"][],	distinct?:boolean | null},boolean],
	max?:ValueTypes["users_max_fields"],
	min?:ValueTypes["users_min_fields"],
	stddev?:ValueTypes["users_stddev_fields"],
	stddev_pop?:ValueTypes["users_stddev_pop_fields"],
	stddev_samp?:ValueTypes["users_stddev_samp_fields"],
	sum?:ValueTypes["users_sum_fields"],
	var_pop?:ValueTypes["users_var_pop_fields"],
	var_samp?:ValueTypes["users_var_samp_fields"],
	variance?:ValueTypes["users_variance_fields"],
		__typename?: boolean
}>;
	/** order by aggregate values of table "users" */
["users_aggregate_order_by"]: {
	avg?:ValueTypes["users_avg_order_by"] | null,
	count?:ValueTypes["order_by"] | null,
	max?:ValueTypes["users_max_order_by"] | null,
	min?:ValueTypes["users_min_order_by"] | null,
	stddev?:ValueTypes["users_stddev_order_by"] | null,
	stddev_pop?:ValueTypes["users_stddev_pop_order_by"] | null,
	stddev_samp?:ValueTypes["users_stddev_samp_order_by"] | null,
	sum?:ValueTypes["users_sum_order_by"] | null,
	var_pop?:ValueTypes["users_var_pop_order_by"] | null,
	var_samp?:ValueTypes["users_var_samp_order_by"] | null,
	variance?:ValueTypes["users_variance_order_by"] | null
};
	/** input type for inserting array relation for remote table "users" */
["users_arr_rel_insert_input"]: {
	data:ValueTypes["users_insert_input"][],
	/** on conflict condition */
	on_conflict?:ValueTypes["users_on_conflict"] | null
};
	/** aggregate avg on columns */
["users_avg_fields"]: AliasType<{
	circle_id?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	role?:boolean,
	starting_tokens?:boolean,
		__typename?: boolean
}>;
	/** order by avg() on columns of table "users" */
["users_avg_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null
};
	/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
["users_bool_exp"]: {
	_and?:ValueTypes["users_bool_exp"][],
	_not?:ValueTypes["users_bool_exp"] | null,
	_or?:ValueTypes["users_bool_exp"][],
	address?:ValueTypes["String_comparison_exp"] | null,
	bio?:ValueTypes["String_comparison_exp"] | null,
	circle?:ValueTypes["circles_bool_exp"] | null,
	circle_id?:ValueTypes["bigint_comparison_exp"] | null,
	created_at?:ValueTypes["timestamp_comparison_exp"] | null,
	deleted_at?:ValueTypes["timestamp_comparison_exp"] | null,
	epoch_first_visit?:ValueTypes["Boolean_comparison_exp"] | null,
	fixed_non_receiver?:ValueTypes["Boolean_comparison_exp"] | null,
	give_token_received?:ValueTypes["Int_comparison_exp"] | null,
	give_token_remaining?:ValueTypes["Int_comparison_exp"] | null,
	id?:ValueTypes["bigint_comparison_exp"] | null,
	name?:ValueTypes["String_comparison_exp"] | null,
	non_giver?:ValueTypes["Boolean_comparison_exp"] | null,
	non_receiver?:ValueTypes["Boolean_comparison_exp"] | null,
	profile?:ValueTypes["profiles_bool_exp"] | null,
	role?:ValueTypes["Int_comparison_exp"] | null,
	starting_tokens?:ValueTypes["Int_comparison_exp"] | null,
	updated_at?:ValueTypes["timestamp_comparison_exp"] | null
};
	/** unique or primary key constraints on table "users" */
["users_constraint"]:users_constraint;
	/** input type for incrementing numeric columns in table "users" */
["users_inc_input"]: {
	circle_id?:ValueTypes["bigint"] | null,
	give_token_received?:number | null,
	give_token_remaining?:number | null,
	id?:ValueTypes["bigint"] | null,
	role?:number | null,
	starting_tokens?:number | null
};
	/** input type for inserting data into table "users" */
["users_insert_input"]: {
	address?:string | null,
	bio?:string | null,
	circle?:ValueTypes["circles_obj_rel_insert_input"] | null,
	circle_id?:ValueTypes["bigint"] | null,
	created_at?:ValueTypes["timestamp"] | null,
	deleted_at?:ValueTypes["timestamp"] | null,
	epoch_first_visit?:boolean | null,
	fixed_non_receiver?:boolean | null,
	give_token_received?:number | null,
	give_token_remaining?:number | null,
	id?:ValueTypes["bigint"] | null,
	name?:string | null,
	non_giver?:boolean | null,
	non_receiver?:boolean | null,
	profile?:ValueTypes["profiles_obj_rel_insert_input"] | null,
	role?:number | null,
	starting_tokens?:number | null,
	updated_at?:ValueTypes["timestamp"] | null
};
	/** aggregate max on columns */
["users_max_fields"]: AliasType<{
	address?:boolean,
	bio?:boolean,
	circle_id?:boolean,
	created_at?:boolean,
	deleted_at?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	name?:boolean,
	role?:boolean,
	starting_tokens?:boolean,
	updated_at?:boolean,
		__typename?: boolean
}>;
	/** order by max() on columns of table "users" */
["users_max_order_by"]: {
	address?:ValueTypes["order_by"] | null,
	bio?:ValueTypes["order_by"] | null,
	circle_id?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	deleted_at?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	name?:ValueTypes["order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null
};
	/** aggregate min on columns */
["users_min_fields"]: AliasType<{
	address?:boolean,
	bio?:boolean,
	circle_id?:boolean,
	created_at?:boolean,
	deleted_at?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	name?:boolean,
	role?:boolean,
	starting_tokens?:boolean,
	updated_at?:boolean,
		__typename?: boolean
}>;
	/** order by min() on columns of table "users" */
["users_min_order_by"]: {
	address?:ValueTypes["order_by"] | null,
	bio?:ValueTypes["order_by"] | null,
	circle_id?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	deleted_at?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	name?:ValueTypes["order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null
};
	/** response of any mutation on the table "users" */
["users_mutation_response"]: AliasType<{
	/** number of rows affected by the mutation */
	affected_rows?:boolean,
	/** data from the rows affected by the mutation */
	returning?:ValueTypes["users"],
		__typename?: boolean
}>;
	/** input type for inserting object relation for remote table "users" */
["users_obj_rel_insert_input"]: {
	data:ValueTypes["users_insert_input"],
	/** on conflict condition */
	on_conflict?:ValueTypes["users_on_conflict"] | null
};
	/** on conflict condition type for table "users" */
["users_on_conflict"]: {
	constraint:ValueTypes["users_constraint"],
	update_columns:ValueTypes["users_update_column"][],
	where?:ValueTypes["users_bool_exp"] | null
};
	/** Ordering options when selecting data from "users". */
["users_order_by"]: {
	address?:ValueTypes["order_by"] | null,
	bio?:ValueTypes["order_by"] | null,
	circle?:ValueTypes["circles_order_by"] | null,
	circle_id?:ValueTypes["order_by"] | null,
	created_at?:ValueTypes["order_by"] | null,
	deleted_at?:ValueTypes["order_by"] | null,
	epoch_first_visit?:ValueTypes["order_by"] | null,
	fixed_non_receiver?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	name?:ValueTypes["order_by"] | null,
	non_giver?:ValueTypes["order_by"] | null,
	non_receiver?:ValueTypes["order_by"] | null,
	profile?:ValueTypes["profiles_order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null
};
	/** primary key columns input for table: users */
["users_pk_columns_input"]: {
	id:ValueTypes["bigint"]
};
	/** select columns of table "users" */
["users_select_column"]:users_select_column;
	/** input type for updating data in table "users" */
["users_set_input"]: {
	address?:string | null,
	bio?:string | null,
	circle_id?:ValueTypes["bigint"] | null,
	created_at?:ValueTypes["timestamp"] | null,
	deleted_at?:ValueTypes["timestamp"] | null,
	epoch_first_visit?:boolean | null,
	fixed_non_receiver?:boolean | null,
	give_token_received?:number | null,
	give_token_remaining?:number | null,
	id?:ValueTypes["bigint"] | null,
	name?:string | null,
	non_giver?:boolean | null,
	non_receiver?:boolean | null,
	role?:number | null,
	starting_tokens?:number | null,
	updated_at?:ValueTypes["timestamp"] | null
};
	/** aggregate stddev on columns */
["users_stddev_fields"]: AliasType<{
	circle_id?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	role?:boolean,
	starting_tokens?:boolean,
		__typename?: boolean
}>;
	/** order by stddev() on columns of table "users" */
["users_stddev_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null
};
	/** aggregate stddev_pop on columns */
["users_stddev_pop_fields"]: AliasType<{
	circle_id?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	role?:boolean,
	starting_tokens?:boolean,
		__typename?: boolean
}>;
	/** order by stddev_pop() on columns of table "users" */
["users_stddev_pop_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null
};
	/** aggregate stddev_samp on columns */
["users_stddev_samp_fields"]: AliasType<{
	circle_id?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	role?:boolean,
	starting_tokens?:boolean,
		__typename?: boolean
}>;
	/** order by stddev_samp() on columns of table "users" */
["users_stddev_samp_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null
};
	/** aggregate sum on columns */
["users_sum_fields"]: AliasType<{
	circle_id?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	role?:boolean,
	starting_tokens?:boolean,
		__typename?: boolean
}>;
	/** order by sum() on columns of table "users" */
["users_sum_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null
};
	/** update columns of table "users" */
["users_update_column"]:users_update_column;
	/** aggregate var_pop on columns */
["users_var_pop_fields"]: AliasType<{
	circle_id?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	role?:boolean,
	starting_tokens?:boolean,
		__typename?: boolean
}>;
	/** order by var_pop() on columns of table "users" */
["users_var_pop_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null
};
	/** aggregate var_samp on columns */
["users_var_samp_fields"]: AliasType<{
	circle_id?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	role?:boolean,
	starting_tokens?:boolean,
		__typename?: boolean
}>;
	/** order by var_samp() on columns of table "users" */
["users_var_samp_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null
};
	/** aggregate variance on columns */
["users_variance_fields"]: AliasType<{
	circle_id?:boolean,
	give_token_received?:boolean,
	give_token_remaining?:boolean,
	id?:boolean,
	role?:boolean,
	starting_tokens?:boolean,
		__typename?: boolean
}>;
	/** order by variance() on columns of table "users" */
["users_variance_order_by"]: {
	circle_id?:ValueTypes["order_by"] | null,
	give_token_received?:ValueTypes["order_by"] | null,
	give_token_remaining?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	role?:ValueTypes["order_by"] | null,
	starting_tokens?:ValueTypes["order_by"] | null
};
	/** columns and relationships of "vouches" */
["vouches"]: AliasType<{
	created_at?:boolean,
	id?:boolean,
	/** An object relationship */
	nominee?:ValueTypes["nominees"],
	nominee_id?:boolean,
	updated_at?:boolean,
	/** An object relationship */
	voucher?:ValueTypes["users"],
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** aggregated selection of "vouches" */
["vouches_aggregate"]: AliasType<{
	aggregate?:ValueTypes["vouches_aggregate_fields"],
	nodes?:ValueTypes["vouches"],
		__typename?: boolean
}>;
	/** aggregate fields of "vouches" */
["vouches_aggregate_fields"]: AliasType<{
	avg?:ValueTypes["vouches_avg_fields"],
count?: [{	columns?:ValueTypes["vouches_select_column"][],	distinct?:boolean | null},boolean],
	max?:ValueTypes["vouches_max_fields"],
	min?:ValueTypes["vouches_min_fields"],
	stddev?:ValueTypes["vouches_stddev_fields"],
	stddev_pop?:ValueTypes["vouches_stddev_pop_fields"],
	stddev_samp?:ValueTypes["vouches_stddev_samp_fields"],
	sum?:ValueTypes["vouches_sum_fields"],
	var_pop?:ValueTypes["vouches_var_pop_fields"],
	var_samp?:ValueTypes["vouches_var_samp_fields"],
	variance?:ValueTypes["vouches_variance_fields"],
		__typename?: boolean
}>;
	/** order by aggregate values of table "vouches" */
["vouches_aggregate_order_by"]: {
	avg?:ValueTypes["vouches_avg_order_by"] | null,
	count?:ValueTypes["order_by"] | null,
	max?:ValueTypes["vouches_max_order_by"] | null,
	min?:ValueTypes["vouches_min_order_by"] | null,
	stddev?:ValueTypes["vouches_stddev_order_by"] | null,
	stddev_pop?:ValueTypes["vouches_stddev_pop_order_by"] | null,
	stddev_samp?:ValueTypes["vouches_stddev_samp_order_by"] | null,
	sum?:ValueTypes["vouches_sum_order_by"] | null,
	var_pop?:ValueTypes["vouches_var_pop_order_by"] | null,
	var_samp?:ValueTypes["vouches_var_samp_order_by"] | null,
	variance?:ValueTypes["vouches_variance_order_by"] | null
};
	/** input type for inserting array relation for remote table "vouches" */
["vouches_arr_rel_insert_input"]: {
	data:ValueTypes["vouches_insert_input"][],
	/** on conflict condition */
	on_conflict?:ValueTypes["vouches_on_conflict"] | null
};
	/** aggregate avg on columns */
["vouches_avg_fields"]: AliasType<{
	id?:boolean,
	nominee_id?:boolean,
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** order by avg() on columns of table "vouches" */
["vouches_avg_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
};
	/** Boolean expression to filter rows from the table "vouches". All fields are combined with a logical 'AND'. */
["vouches_bool_exp"]: {
	_and?:ValueTypes["vouches_bool_exp"][],
	_not?:ValueTypes["vouches_bool_exp"] | null,
	_or?:ValueTypes["vouches_bool_exp"][],
	created_at?:ValueTypes["timestamp_comparison_exp"] | null,
	id?:ValueTypes["bigint_comparison_exp"] | null,
	nominee?:ValueTypes["nominees_bool_exp"] | null,
	nominee_id?:ValueTypes["Int_comparison_exp"] | null,
	updated_at?:ValueTypes["timestamp_comparison_exp"] | null,
	voucher?:ValueTypes["users_bool_exp"] | null,
	voucher_id?:ValueTypes["Int_comparison_exp"] | null
};
	/** unique or primary key constraints on table "vouches" */
["vouches_constraint"]:vouches_constraint;
	/** input type for incrementing numeric columns in table "vouches" */
["vouches_inc_input"]: {
	id?:ValueTypes["bigint"] | null,
	nominee_id?:number | null,
	voucher_id?:number | null
};
	/** input type for inserting data into table "vouches" */
["vouches_insert_input"]: {
	created_at?:ValueTypes["timestamp"] | null,
	id?:ValueTypes["bigint"] | null,
	nominee?:ValueTypes["nominees_obj_rel_insert_input"] | null,
	nominee_id?:number | null,
	updated_at?:ValueTypes["timestamp"] | null,
	voucher?:ValueTypes["users_obj_rel_insert_input"] | null,
	voucher_id?:number | null
};
	/** aggregate max on columns */
["vouches_max_fields"]: AliasType<{
	created_at?:boolean,
	id?:boolean,
	nominee_id?:boolean,
	updated_at?:boolean,
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** order by max() on columns of table "vouches" */
["vouches_max_order_by"]: {
	created_at?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
};
	/** aggregate min on columns */
["vouches_min_fields"]: AliasType<{
	created_at?:boolean,
	id?:boolean,
	nominee_id?:boolean,
	updated_at?:boolean,
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** order by min() on columns of table "vouches" */
["vouches_min_order_by"]: {
	created_at?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
};
	/** response of any mutation on the table "vouches" */
["vouches_mutation_response"]: AliasType<{
	/** number of rows affected by the mutation */
	affected_rows?:boolean,
	/** data from the rows affected by the mutation */
	returning?:ValueTypes["vouches"],
		__typename?: boolean
}>;
	/** on conflict condition type for table "vouches" */
["vouches_on_conflict"]: {
	constraint:ValueTypes["vouches_constraint"],
	update_columns:ValueTypes["vouches_update_column"][],
	where?:ValueTypes["vouches_bool_exp"] | null
};
	/** Ordering options when selecting data from "vouches". */
["vouches_order_by"]: {
	created_at?:ValueTypes["order_by"] | null,
	id?:ValueTypes["order_by"] | null,
	nominee?:ValueTypes["nominees_order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	updated_at?:ValueTypes["order_by"] | null,
	voucher?:ValueTypes["users_order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
};
	/** primary key columns input for table: vouches */
["vouches_pk_columns_input"]: {
	id:ValueTypes["bigint"]
};
	/** select columns of table "vouches" */
["vouches_select_column"]:vouches_select_column;
	/** input type for updating data in table "vouches" */
["vouches_set_input"]: {
	created_at?:ValueTypes["timestamp"] | null,
	id?:ValueTypes["bigint"] | null,
	nominee_id?:number | null,
	updated_at?:ValueTypes["timestamp"] | null,
	voucher_id?:number | null
};
	/** aggregate stddev on columns */
["vouches_stddev_fields"]: AliasType<{
	id?:boolean,
	nominee_id?:boolean,
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** order by stddev() on columns of table "vouches" */
["vouches_stddev_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
};
	/** aggregate stddev_pop on columns */
["vouches_stddev_pop_fields"]: AliasType<{
	id?:boolean,
	nominee_id?:boolean,
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** order by stddev_pop() on columns of table "vouches" */
["vouches_stddev_pop_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
};
	/** aggregate stddev_samp on columns */
["vouches_stddev_samp_fields"]: AliasType<{
	id?:boolean,
	nominee_id?:boolean,
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** order by stddev_samp() on columns of table "vouches" */
["vouches_stddev_samp_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
};
	/** aggregate sum on columns */
["vouches_sum_fields"]: AliasType<{
	id?:boolean,
	nominee_id?:boolean,
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** order by sum() on columns of table "vouches" */
["vouches_sum_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
};
	/** update columns of table "vouches" */
["vouches_update_column"]:vouches_update_column;
	/** aggregate var_pop on columns */
["vouches_var_pop_fields"]: AliasType<{
	id?:boolean,
	nominee_id?:boolean,
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** order by var_pop() on columns of table "vouches" */
["vouches_var_pop_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
};
	/** aggregate var_samp on columns */
["vouches_var_samp_fields"]: AliasType<{
	id?:boolean,
	nominee_id?:boolean,
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** order by var_samp() on columns of table "vouches" */
["vouches_var_samp_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
};
	/** aggregate variance on columns */
["vouches_variance_fields"]: AliasType<{
	id?:boolean,
	nominee_id?:boolean,
	voucher_id?:boolean,
		__typename?: boolean
}>;
	/** order by variance() on columns of table "vouches" */
["vouches_variance_order_by"]: {
	id?:ValueTypes["order_by"] | null,
	nominee_id?:ValueTypes["order_by"] | null,
	voucher_id?:ValueTypes["order_by"] | null
}
  }

export type ModelTypes = {
    /** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
["Boolean_comparison_exp"]: GraphQLTypes["Boolean_comparison_exp"];
	/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
["Int_comparison_exp"]: GraphQLTypes["Int_comparison_exp"];
	/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
["String_comparison_exp"]: GraphQLTypes["String_comparison_exp"];
	["bigint"]:any;
	/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
["bigint_comparison_exp"]: GraphQLTypes["bigint_comparison_exp"];
	/** columns and relationships of "circles" */
["circles"]: {
		alloc_text?:string,
	auto_opt_out:boolean,
	created_at?:ModelTypes["timestamp"],
	default_opt_in:boolean,
	discord_webhook?:string,
	/** An array relationship */
	epochs:ModelTypes["epochs"][],
	/** An aggregate relationship */
	epochs_aggregate:ModelTypes["epochs_aggregate"],
	id:ModelTypes["bigint"],
	is_verified:boolean,
	logo?:string,
	min_vouches:number,
	name:string,
	nomination_days_limit:number,
	only_giver_vouch:boolean,
	/** An object relationship */
	organization?:ModelTypes["organizations"],
	protocol_id?:number,
	team_sel_text?:string,
	team_selection:boolean,
	telegram_id?:string,
	token_name:string,
	updated_at?:ModelTypes["timestamp"],
	/** An array relationship */
	users:ModelTypes["users"][],
	/** An aggregate relationship */
	users_aggregate:ModelTypes["users_aggregate"],
	vouching:boolean,
	vouching_text?:string
};
	/** aggregated selection of "circles" */
["circles_aggregate"]: {
		aggregate?:ModelTypes["circles_aggregate_fields"],
	nodes:ModelTypes["circles"][]
};
	/** aggregate fields of "circles" */
["circles_aggregate_fields"]: {
		avg?:ModelTypes["circles_avg_fields"],
	count:number,
	max?:ModelTypes["circles_max_fields"],
	min?:ModelTypes["circles_min_fields"],
	stddev?:ModelTypes["circles_stddev_fields"],
	stddev_pop?:ModelTypes["circles_stddev_pop_fields"],
	stddev_samp?:ModelTypes["circles_stddev_samp_fields"],
	sum?:ModelTypes["circles_sum_fields"],
	var_pop?:ModelTypes["circles_var_pop_fields"],
	var_samp?:ModelTypes["circles_var_samp_fields"],
	variance?:ModelTypes["circles_variance_fields"]
};
	/** order by aggregate values of table "circles" */
["circles_aggregate_order_by"]: GraphQLTypes["circles_aggregate_order_by"];
	/** input type for inserting array relation for remote table "circles" */
["circles_arr_rel_insert_input"]: GraphQLTypes["circles_arr_rel_insert_input"];
	/** aggregate avg on columns */
["circles_avg_fields"]: {
		id?:number,
	min_vouches?:number,
	nomination_days_limit?:number,
	protocol_id?:number
};
	/** order by avg() on columns of table "circles" */
["circles_avg_order_by"]: GraphQLTypes["circles_avg_order_by"];
	/** Boolean expression to filter rows from the table "circles". All fields are combined with a logical 'AND'. */
["circles_bool_exp"]: GraphQLTypes["circles_bool_exp"];
	/** unique or primary key constraints on table "circles" */
["circles_constraint"]: GraphQLTypes["circles_constraint"];
	/** input type for incrementing numeric columns in table "circles" */
["circles_inc_input"]: GraphQLTypes["circles_inc_input"];
	/** input type for inserting data into table "circles" */
["circles_insert_input"]: GraphQLTypes["circles_insert_input"];
	/** aggregate max on columns */
["circles_max_fields"]: {
		alloc_text?:string,
	created_at?:ModelTypes["timestamp"],
	discord_webhook?:string,
	id?:ModelTypes["bigint"],
	logo?:string,
	min_vouches?:number,
	name?:string,
	nomination_days_limit?:number,
	protocol_id?:number,
	team_sel_text?:string,
	telegram_id?:string,
	token_name?:string,
	updated_at?:ModelTypes["timestamp"],
	vouching_text?:string
};
	/** order by max() on columns of table "circles" */
["circles_max_order_by"]: GraphQLTypes["circles_max_order_by"];
	/** aggregate min on columns */
["circles_min_fields"]: {
		alloc_text?:string,
	created_at?:ModelTypes["timestamp"],
	discord_webhook?:string,
	id?:ModelTypes["bigint"],
	logo?:string,
	min_vouches?:number,
	name?:string,
	nomination_days_limit?:number,
	protocol_id?:number,
	team_sel_text?:string,
	telegram_id?:string,
	token_name?:string,
	updated_at?:ModelTypes["timestamp"],
	vouching_text?:string
};
	/** order by min() on columns of table "circles" */
["circles_min_order_by"]: GraphQLTypes["circles_min_order_by"];
	/** response of any mutation on the table "circles" */
["circles_mutation_response"]: {
		/** number of rows affected by the mutation */
	affected_rows:number,
	/** data from the rows affected by the mutation */
	returning:ModelTypes["circles"][]
};
	/** input type for inserting object relation for remote table "circles" */
["circles_obj_rel_insert_input"]: GraphQLTypes["circles_obj_rel_insert_input"];
	/** on conflict condition type for table "circles" */
["circles_on_conflict"]: GraphQLTypes["circles_on_conflict"];
	/** Ordering options when selecting data from "circles". */
["circles_order_by"]: GraphQLTypes["circles_order_by"];
	/** primary key columns input for table: circles */
["circles_pk_columns_input"]: GraphQLTypes["circles_pk_columns_input"];
	/** select columns of table "circles" */
["circles_select_column"]: GraphQLTypes["circles_select_column"];
	/** input type for updating data in table "circles" */
["circles_set_input"]: GraphQLTypes["circles_set_input"];
	/** aggregate stddev on columns */
["circles_stddev_fields"]: {
		id?:number,
	min_vouches?:number,
	nomination_days_limit?:number,
	protocol_id?:number
};
	/** order by stddev() on columns of table "circles" */
["circles_stddev_order_by"]: GraphQLTypes["circles_stddev_order_by"];
	/** aggregate stddev_pop on columns */
["circles_stddev_pop_fields"]: {
		id?:number,
	min_vouches?:number,
	nomination_days_limit?:number,
	protocol_id?:number
};
	/** order by stddev_pop() on columns of table "circles" */
["circles_stddev_pop_order_by"]: GraphQLTypes["circles_stddev_pop_order_by"];
	/** aggregate stddev_samp on columns */
["circles_stddev_samp_fields"]: {
		id?:number,
	min_vouches?:number,
	nomination_days_limit?:number,
	protocol_id?:number
};
	/** order by stddev_samp() on columns of table "circles" */
["circles_stddev_samp_order_by"]: GraphQLTypes["circles_stddev_samp_order_by"];
	/** aggregate sum on columns */
["circles_sum_fields"]: {
		id?:ModelTypes["bigint"],
	min_vouches?:number,
	nomination_days_limit?:number,
	protocol_id?:number
};
	/** order by sum() on columns of table "circles" */
["circles_sum_order_by"]: GraphQLTypes["circles_sum_order_by"];
	/** update columns of table "circles" */
["circles_update_column"]: GraphQLTypes["circles_update_column"];
	/** aggregate var_pop on columns */
["circles_var_pop_fields"]: {
		id?:number,
	min_vouches?:number,
	nomination_days_limit?:number,
	protocol_id?:number
};
	/** order by var_pop() on columns of table "circles" */
["circles_var_pop_order_by"]: GraphQLTypes["circles_var_pop_order_by"];
	/** aggregate var_samp on columns */
["circles_var_samp_fields"]: {
		id?:number,
	min_vouches?:number,
	nomination_days_limit?:number,
	protocol_id?:number
};
	/** order by var_samp() on columns of table "circles" */
["circles_var_samp_order_by"]: GraphQLTypes["circles_var_samp_order_by"];
	/** aggregate variance on columns */
["circles_variance_fields"]: {
		id?:number,
	min_vouches?:number,
	nomination_days_limit?:number,
	protocol_id?:number
};
	/** order by variance() on columns of table "circles" */
["circles_variance_order_by"]: GraphQLTypes["circles_variance_order_by"];
	["date"]:any;
	/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
["date_comparison_exp"]: GraphQLTypes["date_comparison_exp"];
	/** columns and relationships of "epoches" */
["epochs"]: {
		/** An object relationship */
	circle?:ModelTypes["circles"],
	circle_id:number,
	created_at?:ModelTypes["timestamp"],
	days?:number,
	end_date:ModelTypes["timestamptz"],
	ended:boolean,
	grant:ModelTypes["numeric"],
	id:ModelTypes["bigint"],
	notified_before_end?:ModelTypes["timestamp"],
	notified_end?:ModelTypes["timestamp"],
	notified_start?:ModelTypes["timestamp"],
	number?:number,
	regift_days:number,
	repeat:number,
	repeat_day_of_month:number,
	start_date?:ModelTypes["timestamptz"],
	updated_at?:ModelTypes["timestamp"]
};
	/** aggregated selection of "epoches" */
["epochs_aggregate"]: {
		aggregate?:ModelTypes["epochs_aggregate_fields"],
	nodes:ModelTypes["epochs"][]
};
	/** aggregate fields of "epoches" */
["epochs_aggregate_fields"]: {
		avg?:ModelTypes["epochs_avg_fields"],
	count:number,
	max?:ModelTypes["epochs_max_fields"],
	min?:ModelTypes["epochs_min_fields"],
	stddev?:ModelTypes["epochs_stddev_fields"],
	stddev_pop?:ModelTypes["epochs_stddev_pop_fields"],
	stddev_samp?:ModelTypes["epochs_stddev_samp_fields"],
	sum?:ModelTypes["epochs_sum_fields"],
	var_pop?:ModelTypes["epochs_var_pop_fields"],
	var_samp?:ModelTypes["epochs_var_samp_fields"],
	variance?:ModelTypes["epochs_variance_fields"]
};
	/** order by aggregate values of table "epoches" */
["epochs_aggregate_order_by"]: GraphQLTypes["epochs_aggregate_order_by"];
	/** input type for inserting array relation for remote table "epoches" */
["epochs_arr_rel_insert_input"]: GraphQLTypes["epochs_arr_rel_insert_input"];
	/** aggregate avg on columns */
["epochs_avg_fields"]: {
		circle_id?:number,
	days?:number,
	grant?:number,
	id?:number,
	number?:number,
	regift_days?:number,
	repeat?:number,
	repeat_day_of_month?:number
};
	/** order by avg() on columns of table "epoches" */
["epochs_avg_order_by"]: GraphQLTypes["epochs_avg_order_by"];
	/** Boolean expression to filter rows from the table "epoches". All fields are combined with a logical 'AND'. */
["epochs_bool_exp"]: GraphQLTypes["epochs_bool_exp"];
	/** unique or primary key constraints on table "epoches" */
["epochs_constraint"]: GraphQLTypes["epochs_constraint"];
	/** input type for incrementing numeric columns in table "epoches" */
["epochs_inc_input"]: GraphQLTypes["epochs_inc_input"];
	/** input type for inserting data into table "epoches" */
["epochs_insert_input"]: GraphQLTypes["epochs_insert_input"];
	/** aggregate max on columns */
["epochs_max_fields"]: {
		circle_id?:number,
	created_at?:ModelTypes["timestamp"],
	days?:number,
	end_date?:ModelTypes["timestamptz"],
	grant?:ModelTypes["numeric"],
	id?:ModelTypes["bigint"],
	notified_before_end?:ModelTypes["timestamp"],
	notified_end?:ModelTypes["timestamp"],
	notified_start?:ModelTypes["timestamp"],
	number?:number,
	regift_days?:number,
	repeat?:number,
	repeat_day_of_month?:number,
	start_date?:ModelTypes["timestamptz"],
	updated_at?:ModelTypes["timestamp"]
};
	/** order by max() on columns of table "epoches" */
["epochs_max_order_by"]: GraphQLTypes["epochs_max_order_by"];
	/** aggregate min on columns */
["epochs_min_fields"]: {
		circle_id?:number,
	created_at?:ModelTypes["timestamp"],
	days?:number,
	end_date?:ModelTypes["timestamptz"],
	grant?:ModelTypes["numeric"],
	id?:ModelTypes["bigint"],
	notified_before_end?:ModelTypes["timestamp"],
	notified_end?:ModelTypes["timestamp"],
	notified_start?:ModelTypes["timestamp"],
	number?:number,
	regift_days?:number,
	repeat?:number,
	repeat_day_of_month?:number,
	start_date?:ModelTypes["timestamptz"],
	updated_at?:ModelTypes["timestamp"]
};
	/** order by min() on columns of table "epoches" */
["epochs_min_order_by"]: GraphQLTypes["epochs_min_order_by"];
	/** response of any mutation on the table "epoches" */
["epochs_mutation_response"]: {
		/** number of rows affected by the mutation */
	affected_rows:number,
	/** data from the rows affected by the mutation */
	returning:ModelTypes["epochs"][]
};
	/** on conflict condition type for table "epoches" */
["epochs_on_conflict"]: GraphQLTypes["epochs_on_conflict"];
	/** Ordering options when selecting data from "epoches". */
["epochs_order_by"]: GraphQLTypes["epochs_order_by"];
	/** primary key columns input for table: epochs */
["epochs_pk_columns_input"]: GraphQLTypes["epochs_pk_columns_input"];
	/** select columns of table "epoches" */
["epochs_select_column"]: GraphQLTypes["epochs_select_column"];
	/** input type for updating data in table "epoches" */
["epochs_set_input"]: GraphQLTypes["epochs_set_input"];
	/** aggregate stddev on columns */
["epochs_stddev_fields"]: {
		circle_id?:number,
	days?:number,
	grant?:number,
	id?:number,
	number?:number,
	regift_days?:number,
	repeat?:number,
	repeat_day_of_month?:number
};
	/** order by stddev() on columns of table "epoches" */
["epochs_stddev_order_by"]: GraphQLTypes["epochs_stddev_order_by"];
	/** aggregate stddev_pop on columns */
["epochs_stddev_pop_fields"]: {
		circle_id?:number,
	days?:number,
	grant?:number,
	id?:number,
	number?:number,
	regift_days?:number,
	repeat?:number,
	repeat_day_of_month?:number
};
	/** order by stddev_pop() on columns of table "epoches" */
["epochs_stddev_pop_order_by"]: GraphQLTypes["epochs_stddev_pop_order_by"];
	/** aggregate stddev_samp on columns */
["epochs_stddev_samp_fields"]: {
		circle_id?:number,
	days?:number,
	grant?:number,
	id?:number,
	number?:number,
	regift_days?:number,
	repeat?:number,
	repeat_day_of_month?:number
};
	/** order by stddev_samp() on columns of table "epoches" */
["epochs_stddev_samp_order_by"]: GraphQLTypes["epochs_stddev_samp_order_by"];
	/** aggregate sum on columns */
["epochs_sum_fields"]: {
		circle_id?:number,
	days?:number,
	grant?:ModelTypes["numeric"],
	id?:ModelTypes["bigint"],
	number?:number,
	regift_days?:number,
	repeat?:number,
	repeat_day_of_month?:number
};
	/** order by sum() on columns of table "epoches" */
["epochs_sum_order_by"]: GraphQLTypes["epochs_sum_order_by"];
	/** update columns of table "epoches" */
["epochs_update_column"]: GraphQLTypes["epochs_update_column"];
	/** aggregate var_pop on columns */
["epochs_var_pop_fields"]: {
		circle_id?:number,
	days?:number,
	grant?:number,
	id?:number,
	number?:number,
	regift_days?:number,
	repeat?:number,
	repeat_day_of_month?:number
};
	/** order by var_pop() on columns of table "epoches" */
["epochs_var_pop_order_by"]: GraphQLTypes["epochs_var_pop_order_by"];
	/** aggregate var_samp on columns */
["epochs_var_samp_fields"]: {
		circle_id?:number,
	days?:number,
	grant?:number,
	id?:number,
	number?:number,
	regift_days?:number,
	repeat?:number,
	repeat_day_of_month?:number
};
	/** order by var_samp() on columns of table "epoches" */
["epochs_var_samp_order_by"]: GraphQLTypes["epochs_var_samp_order_by"];
	/** aggregate variance on columns */
["epochs_variance_fields"]: {
		circle_id?:number,
	days?:number,
	grant?:number,
	id?:number,
	number?:number,
	regift_days?:number,
	repeat?:number,
	repeat_day_of_month?:number
};
	/** order by variance() on columns of table "epoches" */
["epochs_variance_order_by"]: GraphQLTypes["epochs_variance_order_by"];
	/** mutation root */
["mutation_root"]: {
		/** delete data from the table: "circles" */
	delete_circles?:ModelTypes["circles_mutation_response"],
	/** delete single row from the table: "circles" */
	delete_circles_by_pk?:ModelTypes["circles"],
	/** delete data from the table: "epoches" */
	delete_epochs?:ModelTypes["epochs_mutation_response"],
	/** delete single row from the table: "epoches" */
	delete_epochs_by_pk?:ModelTypes["epochs"],
	/** delete data from the table: "nominees" */
	delete_nominees?:ModelTypes["nominees_mutation_response"],
	/** delete single row from the table: "nominees" */
	delete_nominees_by_pk?:ModelTypes["nominees"],
	/** delete data from the table: "protocols" */
	delete_organizations?:ModelTypes["organizations_mutation_response"],
	/** delete single row from the table: "protocols" */
	delete_organizations_by_pk?:ModelTypes["organizations"],
	/** delete data from the table: "profiles" */
	delete_profiles?:ModelTypes["profiles_mutation_response"],
	/** delete single row from the table: "profiles" */
	delete_profiles_by_pk?:ModelTypes["profiles"],
	/** delete data from the table: "users" */
	delete_users?:ModelTypes["users_mutation_response"],
	/** delete single row from the table: "users" */
	delete_users_by_pk?:ModelTypes["users"],
	/** delete data from the table: "vouches" */
	delete_vouches?:ModelTypes["vouches_mutation_response"],
	/** delete single row from the table: "vouches" */
	delete_vouches_by_pk?:ModelTypes["vouches"],
	/** insert data into the table: "circles" */
	insert_circles?:ModelTypes["circles_mutation_response"],
	/** insert a single row into the table: "circles" */
	insert_circles_one?:ModelTypes["circles"],
	/** insert data into the table: "epoches" */
	insert_epochs?:ModelTypes["epochs_mutation_response"],
	/** insert a single row into the table: "epoches" */
	insert_epochs_one?:ModelTypes["epochs"],
	/** insert data into the table: "nominees" */
	insert_nominees?:ModelTypes["nominees_mutation_response"],
	/** insert a single row into the table: "nominees" */
	insert_nominees_one?:ModelTypes["nominees"],
	/** insert data into the table: "protocols" */
	insert_organizations?:ModelTypes["organizations_mutation_response"],
	/** insert a single row into the table: "protocols" */
	insert_organizations_one?:ModelTypes["organizations"],
	/** insert data into the table: "profiles" */
	insert_profiles?:ModelTypes["profiles_mutation_response"],
	/** insert a single row into the table: "profiles" */
	insert_profiles_one?:ModelTypes["profiles"],
	/** insert data into the table: "users" */
	insert_users?:ModelTypes["users_mutation_response"],
	/** insert a single row into the table: "users" */
	insert_users_one?:ModelTypes["users"],
	/** insert data into the table: "vouches" */
	insert_vouches?:ModelTypes["vouches_mutation_response"],
	/** insert a single row into the table: "vouches" */
	insert_vouches_one?:ModelTypes["vouches"],
	/** update data of the table: "circles" */
	update_circles?:ModelTypes["circles_mutation_response"],
	/** update single row of the table: "circles" */
	update_circles_by_pk?:ModelTypes["circles"],
	/** update data of the table: "epoches" */
	update_epochs?:ModelTypes["epochs_mutation_response"],
	/** update single row of the table: "epoches" */
	update_epochs_by_pk?:ModelTypes["epochs"],
	/** update data of the table: "nominees" */
	update_nominees?:ModelTypes["nominees_mutation_response"],
	/** update single row of the table: "nominees" */
	update_nominees_by_pk?:ModelTypes["nominees"],
	/** update data of the table: "protocols" */
	update_organizations?:ModelTypes["organizations_mutation_response"],
	/** update single row of the table: "protocols" */
	update_organizations_by_pk?:ModelTypes["organizations"],
	/** update data of the table: "profiles" */
	update_profiles?:ModelTypes["profiles_mutation_response"],
	/** update single row of the table: "profiles" */
	update_profiles_by_pk?:ModelTypes["profiles"],
	/** update data of the table: "users" */
	update_users?:ModelTypes["users_mutation_response"],
	/** update single row of the table: "users" */
	update_users_by_pk?:ModelTypes["users"],
	/** update data of the table: "vouches" */
	update_vouches?:ModelTypes["vouches_mutation_response"],
	/** update single row of the table: "vouches" */
	update_vouches_by_pk?:ModelTypes["vouches"]
};
	/** columns and relationships of "nominees" */
["nominees"]: {
		address:string,
	/** An object relationship */
	circle?:ModelTypes["circles"],
	circle_id:number,
	created_at?:ModelTypes["timestamp"],
	description:string,
	ended:boolean,
	expiry_date:ModelTypes["date"],
	id:ModelTypes["bigint"],
	name:string,
	nominated_by_user_id:number,
	nominated_date:ModelTypes["date"],
	/** An array relationship */
	nominations:ModelTypes["vouches"][],
	/** An aggregate relationship */
	nominations_aggregate:ModelTypes["vouches_aggregate"],
	/** An object relationship */
	nominator?:ModelTypes["users"],
	updated_at?:ModelTypes["timestamp"],
	/** An object relationship */
	user?:ModelTypes["users"],
	user_id?:number,
	vouches_required:number
};
	/** aggregated selection of "nominees" */
["nominees_aggregate"]: {
		aggregate?:ModelTypes["nominees_aggregate_fields"],
	nodes:ModelTypes["nominees"][]
};
	/** aggregate fields of "nominees" */
["nominees_aggregate_fields"]: {
		avg?:ModelTypes["nominees_avg_fields"],
	count:number,
	max?:ModelTypes["nominees_max_fields"],
	min?:ModelTypes["nominees_min_fields"],
	stddev?:ModelTypes["nominees_stddev_fields"],
	stddev_pop?:ModelTypes["nominees_stddev_pop_fields"],
	stddev_samp?:ModelTypes["nominees_stddev_samp_fields"],
	sum?:ModelTypes["nominees_sum_fields"],
	var_pop?:ModelTypes["nominees_var_pop_fields"],
	var_samp?:ModelTypes["nominees_var_samp_fields"],
	variance?:ModelTypes["nominees_variance_fields"]
};
	/** aggregate avg on columns */
["nominees_avg_fields"]: {
		circle_id?:number,
	id?:number,
	nominated_by_user_id?:number,
	user_id?:number,
	vouches_required?:number
};
	/** Boolean expression to filter rows from the table "nominees". All fields are combined with a logical 'AND'. */
["nominees_bool_exp"]: GraphQLTypes["nominees_bool_exp"];
	/** unique or primary key constraints on table "nominees" */
["nominees_constraint"]: GraphQLTypes["nominees_constraint"];
	/** input type for incrementing numeric columns in table "nominees" */
["nominees_inc_input"]: GraphQLTypes["nominees_inc_input"];
	/** input type for inserting data into table "nominees" */
["nominees_insert_input"]: GraphQLTypes["nominees_insert_input"];
	/** aggregate max on columns */
["nominees_max_fields"]: {
		address?:string,
	circle_id?:number,
	created_at?:ModelTypes["timestamp"],
	description?:string,
	expiry_date?:ModelTypes["date"],
	id?:ModelTypes["bigint"],
	name?:string,
	nominated_by_user_id?:number,
	nominated_date?:ModelTypes["date"],
	updated_at?:ModelTypes["timestamp"],
	user_id?:number,
	vouches_required?:number
};
	/** aggregate min on columns */
["nominees_min_fields"]: {
		address?:string,
	circle_id?:number,
	created_at?:ModelTypes["timestamp"],
	description?:string,
	expiry_date?:ModelTypes["date"],
	id?:ModelTypes["bigint"],
	name?:string,
	nominated_by_user_id?:number,
	nominated_date?:ModelTypes["date"],
	updated_at?:ModelTypes["timestamp"],
	user_id?:number,
	vouches_required?:number
};
	/** response of any mutation on the table "nominees" */
["nominees_mutation_response"]: {
		/** number of rows affected by the mutation */
	affected_rows:number,
	/** data from the rows affected by the mutation */
	returning:ModelTypes["nominees"][]
};
	/** input type for inserting object relation for remote table "nominees" */
["nominees_obj_rel_insert_input"]: GraphQLTypes["nominees_obj_rel_insert_input"];
	/** on conflict condition type for table "nominees" */
["nominees_on_conflict"]: GraphQLTypes["nominees_on_conflict"];
	/** Ordering options when selecting data from "nominees". */
["nominees_order_by"]: GraphQLTypes["nominees_order_by"];
	/** primary key columns input for table: nominees */
["nominees_pk_columns_input"]: GraphQLTypes["nominees_pk_columns_input"];
	/** select columns of table "nominees" */
["nominees_select_column"]: GraphQLTypes["nominees_select_column"];
	/** input type for updating data in table "nominees" */
["nominees_set_input"]: GraphQLTypes["nominees_set_input"];
	/** aggregate stddev on columns */
["nominees_stddev_fields"]: {
		circle_id?:number,
	id?:number,
	nominated_by_user_id?:number,
	user_id?:number,
	vouches_required?:number
};
	/** aggregate stddev_pop on columns */
["nominees_stddev_pop_fields"]: {
		circle_id?:number,
	id?:number,
	nominated_by_user_id?:number,
	user_id?:number,
	vouches_required?:number
};
	/** aggregate stddev_samp on columns */
["nominees_stddev_samp_fields"]: {
		circle_id?:number,
	id?:number,
	nominated_by_user_id?:number,
	user_id?:number,
	vouches_required?:number
};
	/** aggregate sum on columns */
["nominees_sum_fields"]: {
		circle_id?:number,
	id?:ModelTypes["bigint"],
	nominated_by_user_id?:number,
	user_id?:number,
	vouches_required?:number
};
	/** update columns of table "nominees" */
["nominees_update_column"]: GraphQLTypes["nominees_update_column"];
	/** aggregate var_pop on columns */
["nominees_var_pop_fields"]: {
		circle_id?:number,
	id?:number,
	nominated_by_user_id?:number,
	user_id?:number,
	vouches_required?:number
};
	/** aggregate var_samp on columns */
["nominees_var_samp_fields"]: {
		circle_id?:number,
	id?:number,
	nominated_by_user_id?:number,
	user_id?:number,
	vouches_required?:number
};
	/** aggregate variance on columns */
["nominees_variance_fields"]: {
		circle_id?:number,
	id?:number,
	nominated_by_user_id?:number,
	user_id?:number,
	vouches_required?:number
};
	["numeric"]:any;
	/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
["numeric_comparison_exp"]: GraphQLTypes["numeric_comparison_exp"];
	/** column ordering options */
["order_by"]: GraphQLTypes["order_by"];
	/** columns and relationships of "protocols" */
["organizations"]: {
		/** An array relationship */
	circles:ModelTypes["circles"][],
	/** An aggregate relationship */
	circles_aggregate:ModelTypes["circles_aggregate"],
	created_at?:ModelTypes["timestamp"],
	id:ModelTypes["bigint"],
	is_verified:boolean,
	name:string,
	telegram_id?:string,
	updated_at?:ModelTypes["timestamp"]
};
	/** aggregated selection of "protocols" */
["organizations_aggregate"]: {
		aggregate?:ModelTypes["organizations_aggregate_fields"],
	nodes:ModelTypes["organizations"][]
};
	/** aggregate fields of "protocols" */
["organizations_aggregate_fields"]: {
		avg?:ModelTypes["organizations_avg_fields"],
	count:number,
	max?:ModelTypes["organizations_max_fields"],
	min?:ModelTypes["organizations_min_fields"],
	stddev?:ModelTypes["organizations_stddev_fields"],
	stddev_pop?:ModelTypes["organizations_stddev_pop_fields"],
	stddev_samp?:ModelTypes["organizations_stddev_samp_fields"],
	sum?:ModelTypes["organizations_sum_fields"],
	var_pop?:ModelTypes["organizations_var_pop_fields"],
	var_samp?:ModelTypes["organizations_var_samp_fields"],
	variance?:ModelTypes["organizations_variance_fields"]
};
	/** aggregate avg on columns */
["organizations_avg_fields"]: {
		id?:number
};
	/** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
["organizations_bool_exp"]: GraphQLTypes["organizations_bool_exp"];
	/** unique or primary key constraints on table "protocols" */
["organizations_constraint"]: GraphQLTypes["organizations_constraint"];
	/** input type for incrementing numeric columns in table "protocols" */
["organizations_inc_input"]: GraphQLTypes["organizations_inc_input"];
	/** input type for inserting data into table "protocols" */
["organizations_insert_input"]: GraphQLTypes["organizations_insert_input"];
	/** aggregate max on columns */
["organizations_max_fields"]: {
		created_at?:ModelTypes["timestamp"],
	id?:ModelTypes["bigint"],
	name?:string,
	telegram_id?:string,
	updated_at?:ModelTypes["timestamp"]
};
	/** aggregate min on columns */
["organizations_min_fields"]: {
		created_at?:ModelTypes["timestamp"],
	id?:ModelTypes["bigint"],
	name?:string,
	telegram_id?:string,
	updated_at?:ModelTypes["timestamp"]
};
	/** response of any mutation on the table "protocols" */
["organizations_mutation_response"]: {
		/** number of rows affected by the mutation */
	affected_rows:number,
	/** data from the rows affected by the mutation */
	returning:ModelTypes["organizations"][]
};
	/** input type for inserting object relation for remote table "protocols" */
["organizations_obj_rel_insert_input"]: GraphQLTypes["organizations_obj_rel_insert_input"];
	/** on conflict condition type for table "protocols" */
["organizations_on_conflict"]: GraphQLTypes["organizations_on_conflict"];
	/** Ordering options when selecting data from "protocols". */
["organizations_order_by"]: GraphQLTypes["organizations_order_by"];
	/** primary key columns input for table: organizations */
["organizations_pk_columns_input"]: GraphQLTypes["organizations_pk_columns_input"];
	/** select columns of table "protocols" */
["organizations_select_column"]: GraphQLTypes["organizations_select_column"];
	/** input type for updating data in table "protocols" */
["organizations_set_input"]: GraphQLTypes["organizations_set_input"];
	/** aggregate stddev on columns */
["organizations_stddev_fields"]: {
		id?:number
};
	/** aggregate stddev_pop on columns */
["organizations_stddev_pop_fields"]: {
		id?:number
};
	/** aggregate stddev_samp on columns */
["organizations_stddev_samp_fields"]: {
		id?:number
};
	/** aggregate sum on columns */
["organizations_sum_fields"]: {
		id?:ModelTypes["bigint"]
};
	/** update columns of table "protocols" */
["organizations_update_column"]: GraphQLTypes["organizations_update_column"];
	/** aggregate var_pop on columns */
["organizations_var_pop_fields"]: {
		id?:number
};
	/** aggregate var_samp on columns */
["organizations_var_samp_fields"]: {
		id?:number
};
	/** aggregate variance on columns */
["organizations_variance_fields"]: {
		id?:number
};
	/** columns and relationships of "profiles" */
["profiles"]: {
		address:string,
	admin_view:boolean,
	ann_power:boolean,
	avatar?:string,
	background?:string,
	bio?:string,
	chat_id?:string,
	created_at?:ModelTypes["timestamp"],
	discord_username?:string,
	github_username?:string,
	id:ModelTypes["bigint"],
	medium_username?:string,
	skills?:string,
	telegram_username?:string,
	twitter_username?:string,
	updated_at?:ModelTypes["timestamp"],
	/** An array relationship */
	users:ModelTypes["users"][],
	/** An aggregate relationship */
	users_aggregate:ModelTypes["users_aggregate"],
	website?:string
};
	/** aggregated selection of "profiles" */
["profiles_aggregate"]: {
		aggregate?:ModelTypes["profiles_aggregate_fields"],
	nodes:ModelTypes["profiles"][]
};
	/** aggregate fields of "profiles" */
["profiles_aggregate_fields"]: {
		avg?:ModelTypes["profiles_avg_fields"],
	count:number,
	max?:ModelTypes["profiles_max_fields"],
	min?:ModelTypes["profiles_min_fields"],
	stddev?:ModelTypes["profiles_stddev_fields"],
	stddev_pop?:ModelTypes["profiles_stddev_pop_fields"],
	stddev_samp?:ModelTypes["profiles_stddev_samp_fields"],
	sum?:ModelTypes["profiles_sum_fields"],
	var_pop?:ModelTypes["profiles_var_pop_fields"],
	var_samp?:ModelTypes["profiles_var_samp_fields"],
	variance?:ModelTypes["profiles_variance_fields"]
};
	/** aggregate avg on columns */
["profiles_avg_fields"]: {
		id?:number
};
	/** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
["profiles_bool_exp"]: GraphQLTypes["profiles_bool_exp"];
	/** unique or primary key constraints on table "profiles" */
["profiles_constraint"]: GraphQLTypes["profiles_constraint"];
	/** input type for incrementing numeric columns in table "profiles" */
["profiles_inc_input"]: GraphQLTypes["profiles_inc_input"];
	/** input type for inserting data into table "profiles" */
["profiles_insert_input"]: GraphQLTypes["profiles_insert_input"];
	/** aggregate max on columns */
["profiles_max_fields"]: {
		address?:string,
	avatar?:string,
	background?:string,
	bio?:string,
	chat_id?:string,
	created_at?:ModelTypes["timestamp"],
	discord_username?:string,
	github_username?:string,
	id?:ModelTypes["bigint"],
	medium_username?:string,
	skills?:string,
	telegram_username?:string,
	twitter_username?:string,
	updated_at?:ModelTypes["timestamp"],
	website?:string
};
	/** aggregate min on columns */
["profiles_min_fields"]: {
		address?:string,
	avatar?:string,
	background?:string,
	bio?:string,
	chat_id?:string,
	created_at?:ModelTypes["timestamp"],
	discord_username?:string,
	github_username?:string,
	id?:ModelTypes["bigint"],
	medium_username?:string,
	skills?:string,
	telegram_username?:string,
	twitter_username?:string,
	updated_at?:ModelTypes["timestamp"],
	website?:string
};
	/** response of any mutation on the table "profiles" */
["profiles_mutation_response"]: {
		/** number of rows affected by the mutation */
	affected_rows:number,
	/** data from the rows affected by the mutation */
	returning:ModelTypes["profiles"][]
};
	/** input type for inserting object relation for remote table "profiles" */
["profiles_obj_rel_insert_input"]: GraphQLTypes["profiles_obj_rel_insert_input"];
	/** on conflict condition type for table "profiles" */
["profiles_on_conflict"]: GraphQLTypes["profiles_on_conflict"];
	/** Ordering options when selecting data from "profiles". */
["profiles_order_by"]: GraphQLTypes["profiles_order_by"];
	/** primary key columns input for table: profiles */
["profiles_pk_columns_input"]: GraphQLTypes["profiles_pk_columns_input"];
	/** select columns of table "profiles" */
["profiles_select_column"]: GraphQLTypes["profiles_select_column"];
	/** input type for updating data in table "profiles" */
["profiles_set_input"]: GraphQLTypes["profiles_set_input"];
	/** aggregate stddev on columns */
["profiles_stddev_fields"]: {
		id?:number
};
	/** aggregate stddev_pop on columns */
["profiles_stddev_pop_fields"]: {
		id?:number
};
	/** aggregate stddev_samp on columns */
["profiles_stddev_samp_fields"]: {
		id?:number
};
	/** aggregate sum on columns */
["profiles_sum_fields"]: {
		id?:ModelTypes["bigint"]
};
	/** update columns of table "profiles" */
["profiles_update_column"]: GraphQLTypes["profiles_update_column"];
	/** aggregate var_pop on columns */
["profiles_var_pop_fields"]: {
		id?:number
};
	/** aggregate var_samp on columns */
["profiles_var_samp_fields"]: {
		id?:number
};
	/** aggregate variance on columns */
["profiles_variance_fields"]: {
		id?:number
};
	["query_root"]: {
		/** An array relationship */
	circles:ModelTypes["circles"][],
	/** An aggregate relationship */
	circles_aggregate:ModelTypes["circles_aggregate"],
	/** fetch data from the table: "circles" using primary key columns */
	circles_by_pk?:ModelTypes["circles"],
	/** An array relationship */
	epochs:ModelTypes["epochs"][],
	/** An aggregate relationship */
	epochs_aggregate:ModelTypes["epochs_aggregate"],
	/** fetch data from the table: "epoches" using primary key columns */
	epochs_by_pk?:ModelTypes["epochs"],
	/** fetch data from the table: "nominees" */
	nominees:ModelTypes["nominees"][],
	/** fetch aggregated fields from the table: "nominees" */
	nominees_aggregate:ModelTypes["nominees_aggregate"],
	/** fetch data from the table: "nominees" using primary key columns */
	nominees_by_pk?:ModelTypes["nominees"],
	/** fetch data from the table: "protocols" */
	organizations:ModelTypes["organizations"][],
	/** fetch aggregated fields from the table: "protocols" */
	organizations_aggregate:ModelTypes["organizations_aggregate"],
	/** fetch data from the table: "protocols" using primary key columns */
	organizations_by_pk?:ModelTypes["organizations"],
	/** fetch data from the table: "profiles" */
	profiles:ModelTypes["profiles"][],
	/** fetch aggregated fields from the table: "profiles" */
	profiles_aggregate:ModelTypes["profiles_aggregate"],
	/** fetch data from the table: "profiles" using primary key columns */
	profiles_by_pk?:ModelTypes["profiles"],
	/** An array relationship */
	users:ModelTypes["users"][],
	/** An aggregate relationship */
	users_aggregate:ModelTypes["users_aggregate"],
	/** fetch data from the table: "users" using primary key columns */
	users_by_pk?:ModelTypes["users"],
	/** fetch data from the table: "vouches" */
	vouches:ModelTypes["vouches"][],
	/** fetch aggregated fields from the table: "vouches" */
	vouches_aggregate:ModelTypes["vouches_aggregate"],
	/** fetch data from the table: "vouches" using primary key columns */
	vouches_by_pk?:ModelTypes["vouches"]
};
	["subscription_root"]: {
		/** An array relationship */
	circles:ModelTypes["circles"][],
	/** An aggregate relationship */
	circles_aggregate:ModelTypes["circles_aggregate"],
	/** fetch data from the table: "circles" using primary key columns */
	circles_by_pk?:ModelTypes["circles"],
	/** An array relationship */
	epochs:ModelTypes["epochs"][],
	/** An aggregate relationship */
	epochs_aggregate:ModelTypes["epochs_aggregate"],
	/** fetch data from the table: "epoches" using primary key columns */
	epochs_by_pk?:ModelTypes["epochs"],
	/** fetch data from the table: "nominees" */
	nominees:ModelTypes["nominees"][],
	/** fetch aggregated fields from the table: "nominees" */
	nominees_aggregate:ModelTypes["nominees_aggregate"],
	/** fetch data from the table: "nominees" using primary key columns */
	nominees_by_pk?:ModelTypes["nominees"],
	/** fetch data from the table: "protocols" */
	organizations:ModelTypes["organizations"][],
	/** fetch aggregated fields from the table: "protocols" */
	organizations_aggregate:ModelTypes["organizations_aggregate"],
	/** fetch data from the table: "protocols" using primary key columns */
	organizations_by_pk?:ModelTypes["organizations"],
	/** fetch data from the table: "profiles" */
	profiles:ModelTypes["profiles"][],
	/** fetch aggregated fields from the table: "profiles" */
	profiles_aggregate:ModelTypes["profiles_aggregate"],
	/** fetch data from the table: "profiles" using primary key columns */
	profiles_by_pk?:ModelTypes["profiles"],
	/** An array relationship */
	users:ModelTypes["users"][],
	/** An aggregate relationship */
	users_aggregate:ModelTypes["users_aggregate"],
	/** fetch data from the table: "users" using primary key columns */
	users_by_pk?:ModelTypes["users"],
	/** fetch data from the table: "vouches" */
	vouches:ModelTypes["vouches"][],
	/** fetch aggregated fields from the table: "vouches" */
	vouches_aggregate:ModelTypes["vouches_aggregate"],
	/** fetch data from the table: "vouches" using primary key columns */
	vouches_by_pk?:ModelTypes["vouches"]
};
	["timestamp"]:any;
	/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
["timestamp_comparison_exp"]: GraphQLTypes["timestamp_comparison_exp"];
	["timestamptz"]:any;
	/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
["timestamptz_comparison_exp"]: GraphQLTypes["timestamptz_comparison_exp"];
	/** columns and relationships of "users" */
["users"]: {
		address:string,
	bio?:string,
	/** An object relationship */
	circle:ModelTypes["circles"],
	circle_id:ModelTypes["bigint"],
	created_at?:ModelTypes["timestamp"],
	deleted_at?:ModelTypes["timestamp"],
	epoch_first_visit:boolean,
	fixed_non_receiver:boolean,
	give_token_received:number,
	give_token_remaining:number,
	id:ModelTypes["bigint"],
	name:string,
	non_giver:boolean,
	non_receiver:boolean,
	/** An object relationship */
	profile?:ModelTypes["profiles"],
	role:number,
	starting_tokens:number,
	updated_at?:ModelTypes["timestamp"]
};
	/** aggregated selection of "users" */
["users_aggregate"]: {
		aggregate?:ModelTypes["users_aggregate_fields"],
	nodes:ModelTypes["users"][]
};
	/** aggregate fields of "users" */
["users_aggregate_fields"]: {
		avg?:ModelTypes["users_avg_fields"],
	count:number,
	max?:ModelTypes["users_max_fields"],
	min?:ModelTypes["users_min_fields"],
	stddev?:ModelTypes["users_stddev_fields"],
	stddev_pop?:ModelTypes["users_stddev_pop_fields"],
	stddev_samp?:ModelTypes["users_stddev_samp_fields"],
	sum?:ModelTypes["users_sum_fields"],
	var_pop?:ModelTypes["users_var_pop_fields"],
	var_samp?:ModelTypes["users_var_samp_fields"],
	variance?:ModelTypes["users_variance_fields"]
};
	/** order by aggregate values of table "users" */
["users_aggregate_order_by"]: GraphQLTypes["users_aggregate_order_by"];
	/** input type for inserting array relation for remote table "users" */
["users_arr_rel_insert_input"]: GraphQLTypes["users_arr_rel_insert_input"];
	/** aggregate avg on columns */
["users_avg_fields"]: {
		circle_id?:number,
	give_token_received?:number,
	give_token_remaining?:number,
	id?:number,
	role?:number,
	starting_tokens?:number
};
	/** order by avg() on columns of table "users" */
["users_avg_order_by"]: GraphQLTypes["users_avg_order_by"];
	/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
["users_bool_exp"]: GraphQLTypes["users_bool_exp"];
	/** unique or primary key constraints on table "users" */
["users_constraint"]: GraphQLTypes["users_constraint"];
	/** input type for incrementing numeric columns in table "users" */
["users_inc_input"]: GraphQLTypes["users_inc_input"];
	/** input type for inserting data into table "users" */
["users_insert_input"]: GraphQLTypes["users_insert_input"];
	/** aggregate max on columns */
["users_max_fields"]: {
		address?:string,
	bio?:string,
	circle_id?:ModelTypes["bigint"],
	created_at?:ModelTypes["timestamp"],
	deleted_at?:ModelTypes["timestamp"],
	give_token_received?:number,
	give_token_remaining?:number,
	id?:ModelTypes["bigint"],
	name?:string,
	role?:number,
	starting_tokens?:number,
	updated_at?:ModelTypes["timestamp"]
};
	/** order by max() on columns of table "users" */
["users_max_order_by"]: GraphQLTypes["users_max_order_by"];
	/** aggregate min on columns */
["users_min_fields"]: {
		address?:string,
	bio?:string,
	circle_id?:ModelTypes["bigint"],
	created_at?:ModelTypes["timestamp"],
	deleted_at?:ModelTypes["timestamp"],
	give_token_received?:number,
	give_token_remaining?:number,
	id?:ModelTypes["bigint"],
	name?:string,
	role?:number,
	starting_tokens?:number,
	updated_at?:ModelTypes["timestamp"]
};
	/** order by min() on columns of table "users" */
["users_min_order_by"]: GraphQLTypes["users_min_order_by"];
	/** response of any mutation on the table "users" */
["users_mutation_response"]: {
		/** number of rows affected by the mutation */
	affected_rows:number,
	/** data from the rows affected by the mutation */
	returning:ModelTypes["users"][]
};
	/** input type for inserting object relation for remote table "users" */
["users_obj_rel_insert_input"]: GraphQLTypes["users_obj_rel_insert_input"];
	/** on conflict condition type for table "users" */
["users_on_conflict"]: GraphQLTypes["users_on_conflict"];
	/** Ordering options when selecting data from "users". */
["users_order_by"]: GraphQLTypes["users_order_by"];
	/** primary key columns input for table: users */
["users_pk_columns_input"]: GraphQLTypes["users_pk_columns_input"];
	/** select columns of table "users" */
["users_select_column"]: GraphQLTypes["users_select_column"];
	/** input type for updating data in table "users" */
["users_set_input"]: GraphQLTypes["users_set_input"];
	/** aggregate stddev on columns */
["users_stddev_fields"]: {
		circle_id?:number,
	give_token_received?:number,
	give_token_remaining?:number,
	id?:number,
	role?:number,
	starting_tokens?:number
};
	/** order by stddev() on columns of table "users" */
["users_stddev_order_by"]: GraphQLTypes["users_stddev_order_by"];
	/** aggregate stddev_pop on columns */
["users_stddev_pop_fields"]: {
		circle_id?:number,
	give_token_received?:number,
	give_token_remaining?:number,
	id?:number,
	role?:number,
	starting_tokens?:number
};
	/** order by stddev_pop() on columns of table "users" */
["users_stddev_pop_order_by"]: GraphQLTypes["users_stddev_pop_order_by"];
	/** aggregate stddev_samp on columns */
["users_stddev_samp_fields"]: {
		circle_id?:number,
	give_token_received?:number,
	give_token_remaining?:number,
	id?:number,
	role?:number,
	starting_tokens?:number
};
	/** order by stddev_samp() on columns of table "users" */
["users_stddev_samp_order_by"]: GraphQLTypes["users_stddev_samp_order_by"];
	/** aggregate sum on columns */
["users_sum_fields"]: {
		circle_id?:ModelTypes["bigint"],
	give_token_received?:number,
	give_token_remaining?:number,
	id?:ModelTypes["bigint"],
	role?:number,
	starting_tokens?:number
};
	/** order by sum() on columns of table "users" */
["users_sum_order_by"]: GraphQLTypes["users_sum_order_by"];
	/** update columns of table "users" */
["users_update_column"]: GraphQLTypes["users_update_column"];
	/** aggregate var_pop on columns */
["users_var_pop_fields"]: {
		circle_id?:number,
	give_token_received?:number,
	give_token_remaining?:number,
	id?:number,
	role?:number,
	starting_tokens?:number
};
	/** order by var_pop() on columns of table "users" */
["users_var_pop_order_by"]: GraphQLTypes["users_var_pop_order_by"];
	/** aggregate var_samp on columns */
["users_var_samp_fields"]: {
		circle_id?:number,
	give_token_received?:number,
	give_token_remaining?:number,
	id?:number,
	role?:number,
	starting_tokens?:number
};
	/** order by var_samp() on columns of table "users" */
["users_var_samp_order_by"]: GraphQLTypes["users_var_samp_order_by"];
	/** aggregate variance on columns */
["users_variance_fields"]: {
		circle_id?:number,
	give_token_received?:number,
	give_token_remaining?:number,
	id?:number,
	role?:number,
	starting_tokens?:number
};
	/** order by variance() on columns of table "users" */
["users_variance_order_by"]: GraphQLTypes["users_variance_order_by"];
	/** columns and relationships of "vouches" */
["vouches"]: {
		created_at?:ModelTypes["timestamp"],
	id:ModelTypes["bigint"],
	/** An object relationship */
	nominee?:ModelTypes["nominees"],
	nominee_id:number,
	updated_at?:ModelTypes["timestamp"],
	/** An object relationship */
	voucher?:ModelTypes["users"],
	voucher_id:number
};
	/** aggregated selection of "vouches" */
["vouches_aggregate"]: {
		aggregate?:ModelTypes["vouches_aggregate_fields"],
	nodes:ModelTypes["vouches"][]
};
	/** aggregate fields of "vouches" */
["vouches_aggregate_fields"]: {
		avg?:ModelTypes["vouches_avg_fields"],
	count:number,
	max?:ModelTypes["vouches_max_fields"],
	min?:ModelTypes["vouches_min_fields"],
	stddev?:ModelTypes["vouches_stddev_fields"],
	stddev_pop?:ModelTypes["vouches_stddev_pop_fields"],
	stddev_samp?:ModelTypes["vouches_stddev_samp_fields"],
	sum?:ModelTypes["vouches_sum_fields"],
	var_pop?:ModelTypes["vouches_var_pop_fields"],
	var_samp?:ModelTypes["vouches_var_samp_fields"],
	variance?:ModelTypes["vouches_variance_fields"]
};
	/** order by aggregate values of table "vouches" */
["vouches_aggregate_order_by"]: GraphQLTypes["vouches_aggregate_order_by"];
	/** input type for inserting array relation for remote table "vouches" */
["vouches_arr_rel_insert_input"]: GraphQLTypes["vouches_arr_rel_insert_input"];
	/** aggregate avg on columns */
["vouches_avg_fields"]: {
		id?:number,
	nominee_id?:number,
	voucher_id?:number
};
	/** order by avg() on columns of table "vouches" */
["vouches_avg_order_by"]: GraphQLTypes["vouches_avg_order_by"];
	/** Boolean expression to filter rows from the table "vouches". All fields are combined with a logical 'AND'. */
["vouches_bool_exp"]: GraphQLTypes["vouches_bool_exp"];
	/** unique or primary key constraints on table "vouches" */
["vouches_constraint"]: GraphQLTypes["vouches_constraint"];
	/** input type for incrementing numeric columns in table "vouches" */
["vouches_inc_input"]: GraphQLTypes["vouches_inc_input"];
	/** input type for inserting data into table "vouches" */
["vouches_insert_input"]: GraphQLTypes["vouches_insert_input"];
	/** aggregate max on columns */
["vouches_max_fields"]: {
		created_at?:ModelTypes["timestamp"],
	id?:ModelTypes["bigint"],
	nominee_id?:number,
	updated_at?:ModelTypes["timestamp"],
	voucher_id?:number
};
	/** order by max() on columns of table "vouches" */
["vouches_max_order_by"]: GraphQLTypes["vouches_max_order_by"];
	/** aggregate min on columns */
["vouches_min_fields"]: {
		created_at?:ModelTypes["timestamp"],
	id?:ModelTypes["bigint"],
	nominee_id?:number,
	updated_at?:ModelTypes["timestamp"],
	voucher_id?:number
};
	/** order by min() on columns of table "vouches" */
["vouches_min_order_by"]: GraphQLTypes["vouches_min_order_by"];
	/** response of any mutation on the table "vouches" */
["vouches_mutation_response"]: {
		/** number of rows affected by the mutation */
	affected_rows:number,
	/** data from the rows affected by the mutation */
	returning:ModelTypes["vouches"][]
};
	/** on conflict condition type for table "vouches" */
["vouches_on_conflict"]: GraphQLTypes["vouches_on_conflict"];
	/** Ordering options when selecting data from "vouches". */
["vouches_order_by"]: GraphQLTypes["vouches_order_by"];
	/** primary key columns input for table: vouches */
["vouches_pk_columns_input"]: GraphQLTypes["vouches_pk_columns_input"];
	/** select columns of table "vouches" */
["vouches_select_column"]: GraphQLTypes["vouches_select_column"];
	/** input type for updating data in table "vouches" */
["vouches_set_input"]: GraphQLTypes["vouches_set_input"];
	/** aggregate stddev on columns */
["vouches_stddev_fields"]: {
		id?:number,
	nominee_id?:number,
	voucher_id?:number
};
	/** order by stddev() on columns of table "vouches" */
["vouches_stddev_order_by"]: GraphQLTypes["vouches_stddev_order_by"];
	/** aggregate stddev_pop on columns */
["vouches_stddev_pop_fields"]: {
		id?:number,
	nominee_id?:number,
	voucher_id?:number
};
	/** order by stddev_pop() on columns of table "vouches" */
["vouches_stddev_pop_order_by"]: GraphQLTypes["vouches_stddev_pop_order_by"];
	/** aggregate stddev_samp on columns */
["vouches_stddev_samp_fields"]: {
		id?:number,
	nominee_id?:number,
	voucher_id?:number
};
	/** order by stddev_samp() on columns of table "vouches" */
["vouches_stddev_samp_order_by"]: GraphQLTypes["vouches_stddev_samp_order_by"];
	/** aggregate sum on columns */
["vouches_sum_fields"]: {
		id?:ModelTypes["bigint"],
	nominee_id?:number,
	voucher_id?:number
};
	/** order by sum() on columns of table "vouches" */
["vouches_sum_order_by"]: GraphQLTypes["vouches_sum_order_by"];
	/** update columns of table "vouches" */
["vouches_update_column"]: GraphQLTypes["vouches_update_column"];
	/** aggregate var_pop on columns */
["vouches_var_pop_fields"]: {
		id?:number,
	nominee_id?:number,
	voucher_id?:number
};
	/** order by var_pop() on columns of table "vouches" */
["vouches_var_pop_order_by"]: GraphQLTypes["vouches_var_pop_order_by"];
	/** aggregate var_samp on columns */
["vouches_var_samp_fields"]: {
		id?:number,
	nominee_id?:number,
	voucher_id?:number
};
	/** order by var_samp() on columns of table "vouches" */
["vouches_var_samp_order_by"]: GraphQLTypes["vouches_var_samp_order_by"];
	/** aggregate variance on columns */
["vouches_variance_fields"]: {
		id?:number,
	nominee_id?:number,
	voucher_id?:number
};
	/** order by variance() on columns of table "vouches" */
["vouches_variance_order_by"]: GraphQLTypes["vouches_variance_order_by"]
    }

export type GraphQLTypes = {
    /** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
["Boolean_comparison_exp"]: {
		_eq?: boolean,
	_gt?: boolean,
	_gte?: boolean,
	_in?: Array<boolean>,
	_is_null?: boolean,
	_lt?: boolean,
	_lte?: boolean,
	_neq?: boolean,
	_nin?: Array<boolean>
};
	/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
["Int_comparison_exp"]: {
		_eq?: number,
	_gt?: number,
	_gte?: number,
	_in?: Array<number>,
	_is_null?: boolean,
	_lt?: number,
	_lte?: number,
	_neq?: number,
	_nin?: Array<number>
};
	/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
["String_comparison_exp"]: {
		_eq?: string,
	_gt?: string,
	_gte?: string,
	/** does the column match the given case-insensitive pattern */
	_ilike?: string,
	_in?: Array<string>,
	/** does the column match the given POSIX regular expression, case insensitive */
	_iregex?: string,
	_is_null?: boolean,
	/** does the column match the given pattern */
	_like?: string,
	_lt?: string,
	_lte?: string,
	_neq?: string,
	/** does the column NOT match the given case-insensitive pattern */
	_nilike?: string,
	_nin?: Array<string>,
	/** does the column NOT match the given POSIX regular expression, case insensitive */
	_niregex?: string,
	/** does the column NOT match the given pattern */
	_nlike?: string,
	/** does the column NOT match the given POSIX regular expression, case sensitive */
	_nregex?: string,
	/** does the column NOT match the given SQL regular expression */
	_nsimilar?: string,
	/** does the column match the given POSIX regular expression, case sensitive */
	_regex?: string,
	/** does the column match the given SQL regular expression */
	_similar?: string
};
	["bigint"]:any;
	/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
["bigint_comparison_exp"]: {
		_eq?: GraphQLTypes["bigint"],
	_gt?: GraphQLTypes["bigint"],
	_gte?: GraphQLTypes["bigint"],
	_in?: Array<GraphQLTypes["bigint"]>,
	_is_null?: boolean,
	_lt?: GraphQLTypes["bigint"],
	_lte?: GraphQLTypes["bigint"],
	_neq?: GraphQLTypes["bigint"],
	_nin?: Array<GraphQLTypes["bigint"]>
};
	/** columns and relationships of "circles" */
["circles"]: {
	__typename: "circles",
	alloc_text?: string,
	auto_opt_out: boolean,
	created_at?: GraphQLTypes["timestamp"],
	default_opt_in: boolean,
	discord_webhook?: string,
	/** An array relationship */
	epochs: Array<GraphQLTypes["epochs"]>,
	/** An aggregate relationship */
	epochs_aggregate: GraphQLTypes["epochs_aggregate"],
	id: GraphQLTypes["bigint"],
	is_verified: boolean,
	logo?: string,
	min_vouches: number,
	name: string,
	nomination_days_limit: number,
	only_giver_vouch: boolean,
	/** An object relationship */
	organization?: GraphQLTypes["organizations"],
	protocol_id?: number,
	team_sel_text?: string,
	team_selection: boolean,
	telegram_id?: string,
	token_name: string,
	updated_at?: GraphQLTypes["timestamp"],
	/** An array relationship */
	users: Array<GraphQLTypes["users"]>,
	/** An aggregate relationship */
	users_aggregate: GraphQLTypes["users_aggregate"],
	vouching: boolean,
	vouching_text?: string
};
	/** aggregated selection of "circles" */
["circles_aggregate"]: {
	__typename: "circles_aggregate",
	aggregate?: GraphQLTypes["circles_aggregate_fields"],
	nodes: Array<GraphQLTypes["circles"]>
};
	/** aggregate fields of "circles" */
["circles_aggregate_fields"]: {
	__typename: "circles_aggregate_fields",
	avg?: GraphQLTypes["circles_avg_fields"],
	count: number,
	max?: GraphQLTypes["circles_max_fields"],
	min?: GraphQLTypes["circles_min_fields"],
	stddev?: GraphQLTypes["circles_stddev_fields"],
	stddev_pop?: GraphQLTypes["circles_stddev_pop_fields"],
	stddev_samp?: GraphQLTypes["circles_stddev_samp_fields"],
	sum?: GraphQLTypes["circles_sum_fields"],
	var_pop?: GraphQLTypes["circles_var_pop_fields"],
	var_samp?: GraphQLTypes["circles_var_samp_fields"],
	variance?: GraphQLTypes["circles_variance_fields"]
};
	/** order by aggregate values of table "circles" */
["circles_aggregate_order_by"]: {
		avg?: GraphQLTypes["circles_avg_order_by"],
	count?: GraphQLTypes["order_by"],
	max?: GraphQLTypes["circles_max_order_by"],
	min?: GraphQLTypes["circles_min_order_by"],
	stddev?: GraphQLTypes["circles_stddev_order_by"],
	stddev_pop?: GraphQLTypes["circles_stddev_pop_order_by"],
	stddev_samp?: GraphQLTypes["circles_stddev_samp_order_by"],
	sum?: GraphQLTypes["circles_sum_order_by"],
	var_pop?: GraphQLTypes["circles_var_pop_order_by"],
	var_samp?: GraphQLTypes["circles_var_samp_order_by"],
	variance?: GraphQLTypes["circles_variance_order_by"]
};
	/** input type for inserting array relation for remote table "circles" */
["circles_arr_rel_insert_input"]: {
		data: Array<GraphQLTypes["circles_insert_input"]>,
	/** on conflict condition */
	on_conflict?: GraphQLTypes["circles_on_conflict"]
};
	/** aggregate avg on columns */
["circles_avg_fields"]: {
	__typename: "circles_avg_fields",
	id?: number,
	min_vouches?: number,
	nomination_days_limit?: number,
	protocol_id?: number
};
	/** order by avg() on columns of table "circles" */
["circles_avg_order_by"]: {
		id?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	protocol_id?: GraphQLTypes["order_by"]
};
	/** Boolean expression to filter rows from the table "circles". All fields are combined with a logical 'AND'. */
["circles_bool_exp"]: {
		_and?: Array<GraphQLTypes["circles_bool_exp"]>,
	_not?: GraphQLTypes["circles_bool_exp"],
	_or?: Array<GraphQLTypes["circles_bool_exp"]>,
	alloc_text?: GraphQLTypes["String_comparison_exp"],
	auto_opt_out?: GraphQLTypes["Boolean_comparison_exp"],
	created_at?: GraphQLTypes["timestamp_comparison_exp"],
	default_opt_in?: GraphQLTypes["Boolean_comparison_exp"],
	discord_webhook?: GraphQLTypes["String_comparison_exp"],
	epochs?: GraphQLTypes["epochs_bool_exp"],
	id?: GraphQLTypes["bigint_comparison_exp"],
	is_verified?: GraphQLTypes["Boolean_comparison_exp"],
	logo?: GraphQLTypes["String_comparison_exp"],
	min_vouches?: GraphQLTypes["Int_comparison_exp"],
	name?: GraphQLTypes["String_comparison_exp"],
	nomination_days_limit?: GraphQLTypes["Int_comparison_exp"],
	only_giver_vouch?: GraphQLTypes["Boolean_comparison_exp"],
	organization?: GraphQLTypes["organizations_bool_exp"],
	protocol_id?: GraphQLTypes["Int_comparison_exp"],
	team_sel_text?: GraphQLTypes["String_comparison_exp"],
	team_selection?: GraphQLTypes["Boolean_comparison_exp"],
	telegram_id?: GraphQLTypes["String_comparison_exp"],
	token_name?: GraphQLTypes["String_comparison_exp"],
	updated_at?: GraphQLTypes["timestamp_comparison_exp"],
	users?: GraphQLTypes["users_bool_exp"],
	vouching?: GraphQLTypes["Boolean_comparison_exp"],
	vouching_text?: GraphQLTypes["String_comparison_exp"]
};
	/** unique or primary key constraints on table "circles" */
["circles_constraint"]: circles_constraint;
	/** input type for incrementing numeric columns in table "circles" */
["circles_inc_input"]: {
		id?: GraphQLTypes["bigint"],
	min_vouches?: number,
	nomination_days_limit?: number,
	protocol_id?: number
};
	/** input type for inserting data into table "circles" */
["circles_insert_input"]: {
		alloc_text?: string,
	auto_opt_out?: boolean,
	created_at?: GraphQLTypes["timestamp"],
	default_opt_in?: boolean,
	discord_webhook?: string,
	epochs?: GraphQLTypes["epochs_arr_rel_insert_input"],
	id?: GraphQLTypes["bigint"],
	is_verified?: boolean,
	logo?: string,
	min_vouches?: number,
	name?: string,
	nomination_days_limit?: number,
	only_giver_vouch?: boolean,
	organization?: GraphQLTypes["organizations_obj_rel_insert_input"],
	protocol_id?: number,
	team_sel_text?: string,
	team_selection?: boolean,
	telegram_id?: string,
	token_name?: string,
	updated_at?: GraphQLTypes["timestamp"],
	users?: GraphQLTypes["users_arr_rel_insert_input"],
	vouching?: boolean,
	vouching_text?: string
};
	/** aggregate max on columns */
["circles_max_fields"]: {
	__typename: "circles_max_fields",
	alloc_text?: string,
	created_at?: GraphQLTypes["timestamp"],
	discord_webhook?: string,
	id?: GraphQLTypes["bigint"],
	logo?: string,
	min_vouches?: number,
	name?: string,
	nomination_days_limit?: number,
	protocol_id?: number,
	team_sel_text?: string,
	telegram_id?: string,
	token_name?: string,
	updated_at?: GraphQLTypes["timestamp"],
	vouching_text?: string
};
	/** order by max() on columns of table "circles" */
["circles_max_order_by"]: {
		alloc_text?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	discord_webhook?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	logo?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	name?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	protocol_id?: GraphQLTypes["order_by"],
	team_sel_text?: GraphQLTypes["order_by"],
	telegram_id?: GraphQLTypes["order_by"],
	token_name?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"],
	vouching_text?: GraphQLTypes["order_by"]
};
	/** aggregate min on columns */
["circles_min_fields"]: {
	__typename: "circles_min_fields",
	alloc_text?: string,
	created_at?: GraphQLTypes["timestamp"],
	discord_webhook?: string,
	id?: GraphQLTypes["bigint"],
	logo?: string,
	min_vouches?: number,
	name?: string,
	nomination_days_limit?: number,
	protocol_id?: number,
	team_sel_text?: string,
	telegram_id?: string,
	token_name?: string,
	updated_at?: GraphQLTypes["timestamp"],
	vouching_text?: string
};
	/** order by min() on columns of table "circles" */
["circles_min_order_by"]: {
		alloc_text?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	discord_webhook?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	logo?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	name?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	protocol_id?: GraphQLTypes["order_by"],
	team_sel_text?: GraphQLTypes["order_by"],
	telegram_id?: GraphQLTypes["order_by"],
	token_name?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"],
	vouching_text?: GraphQLTypes["order_by"]
};
	/** response of any mutation on the table "circles" */
["circles_mutation_response"]: {
	__typename: "circles_mutation_response",
	/** number of rows affected by the mutation */
	affected_rows: number,
	/** data from the rows affected by the mutation */
	returning: Array<GraphQLTypes["circles"]>
};
	/** input type for inserting object relation for remote table "circles" */
["circles_obj_rel_insert_input"]: {
		data: GraphQLTypes["circles_insert_input"],
	/** on conflict condition */
	on_conflict?: GraphQLTypes["circles_on_conflict"]
};
	/** on conflict condition type for table "circles" */
["circles_on_conflict"]: {
		constraint: GraphQLTypes["circles_constraint"],
	update_columns: Array<GraphQLTypes["circles_update_column"]>,
	where?: GraphQLTypes["circles_bool_exp"]
};
	/** Ordering options when selecting data from "circles". */
["circles_order_by"]: {
		alloc_text?: GraphQLTypes["order_by"],
	auto_opt_out?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	default_opt_in?: GraphQLTypes["order_by"],
	discord_webhook?: GraphQLTypes["order_by"],
	epochs_aggregate?: GraphQLTypes["epochs_aggregate_order_by"],
	id?: GraphQLTypes["order_by"],
	is_verified?: GraphQLTypes["order_by"],
	logo?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	name?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	only_giver_vouch?: GraphQLTypes["order_by"],
	organization?: GraphQLTypes["organizations_order_by"],
	protocol_id?: GraphQLTypes["order_by"],
	team_sel_text?: GraphQLTypes["order_by"],
	team_selection?: GraphQLTypes["order_by"],
	telegram_id?: GraphQLTypes["order_by"],
	token_name?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"],
	users_aggregate?: GraphQLTypes["users_aggregate_order_by"],
	vouching?: GraphQLTypes["order_by"],
	vouching_text?: GraphQLTypes["order_by"]
};
	/** primary key columns input for table: circles */
["circles_pk_columns_input"]: {
		id: GraphQLTypes["bigint"]
};
	/** select columns of table "circles" */
["circles_select_column"]: circles_select_column;
	/** input type for updating data in table "circles" */
["circles_set_input"]: {
		alloc_text?: string,
	auto_opt_out?: boolean,
	created_at?: GraphQLTypes["timestamp"],
	default_opt_in?: boolean,
	discord_webhook?: string,
	id?: GraphQLTypes["bigint"],
	is_verified?: boolean,
	logo?: string,
	min_vouches?: number,
	name?: string,
	nomination_days_limit?: number,
	only_giver_vouch?: boolean,
	protocol_id?: number,
	team_sel_text?: string,
	team_selection?: boolean,
	telegram_id?: string,
	token_name?: string,
	updated_at?: GraphQLTypes["timestamp"],
	vouching?: boolean,
	vouching_text?: string
};
	/** aggregate stddev on columns */
["circles_stddev_fields"]: {
	__typename: "circles_stddev_fields",
	id?: number,
	min_vouches?: number,
	nomination_days_limit?: number,
	protocol_id?: number
};
	/** order by stddev() on columns of table "circles" */
["circles_stddev_order_by"]: {
		id?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	protocol_id?: GraphQLTypes["order_by"]
};
	/** aggregate stddev_pop on columns */
["circles_stddev_pop_fields"]: {
	__typename: "circles_stddev_pop_fields",
	id?: number,
	min_vouches?: number,
	nomination_days_limit?: number,
	protocol_id?: number
};
	/** order by stddev_pop() on columns of table "circles" */
["circles_stddev_pop_order_by"]: {
		id?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	protocol_id?: GraphQLTypes["order_by"]
};
	/** aggregate stddev_samp on columns */
["circles_stddev_samp_fields"]: {
	__typename: "circles_stddev_samp_fields",
	id?: number,
	min_vouches?: number,
	nomination_days_limit?: number,
	protocol_id?: number
};
	/** order by stddev_samp() on columns of table "circles" */
["circles_stddev_samp_order_by"]: {
		id?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	protocol_id?: GraphQLTypes["order_by"]
};
	/** aggregate sum on columns */
["circles_sum_fields"]: {
	__typename: "circles_sum_fields",
	id?: GraphQLTypes["bigint"],
	min_vouches?: number,
	nomination_days_limit?: number,
	protocol_id?: number
};
	/** order by sum() on columns of table "circles" */
["circles_sum_order_by"]: {
		id?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	protocol_id?: GraphQLTypes["order_by"]
};
	/** update columns of table "circles" */
["circles_update_column"]: circles_update_column;
	/** aggregate var_pop on columns */
["circles_var_pop_fields"]: {
	__typename: "circles_var_pop_fields",
	id?: number,
	min_vouches?: number,
	nomination_days_limit?: number,
	protocol_id?: number
};
	/** order by var_pop() on columns of table "circles" */
["circles_var_pop_order_by"]: {
		id?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	protocol_id?: GraphQLTypes["order_by"]
};
	/** aggregate var_samp on columns */
["circles_var_samp_fields"]: {
	__typename: "circles_var_samp_fields",
	id?: number,
	min_vouches?: number,
	nomination_days_limit?: number,
	protocol_id?: number
};
	/** order by var_samp() on columns of table "circles" */
["circles_var_samp_order_by"]: {
		id?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	protocol_id?: GraphQLTypes["order_by"]
};
	/** aggregate variance on columns */
["circles_variance_fields"]: {
	__typename: "circles_variance_fields",
	id?: number,
	min_vouches?: number,
	nomination_days_limit?: number,
	protocol_id?: number
};
	/** order by variance() on columns of table "circles" */
["circles_variance_order_by"]: {
		id?: GraphQLTypes["order_by"],
	min_vouches?: GraphQLTypes["order_by"],
	nomination_days_limit?: GraphQLTypes["order_by"],
	protocol_id?: GraphQLTypes["order_by"]
};
	["date"]:any;
	/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
["date_comparison_exp"]: {
		_eq?: GraphQLTypes["date"],
	_gt?: GraphQLTypes["date"],
	_gte?: GraphQLTypes["date"],
	_in?: Array<GraphQLTypes["date"]>,
	_is_null?: boolean,
	_lt?: GraphQLTypes["date"],
	_lte?: GraphQLTypes["date"],
	_neq?: GraphQLTypes["date"],
	_nin?: Array<GraphQLTypes["date"]>
};
	/** columns and relationships of "epoches" */
["epochs"]: {
	__typename: "epochs",
	/** An object relationship */
	circle?: GraphQLTypes["circles"],
	circle_id: number,
	created_at?: GraphQLTypes["timestamp"],
	days?: number,
	end_date: GraphQLTypes["timestamptz"],
	ended: boolean,
	grant: GraphQLTypes["numeric"],
	id: GraphQLTypes["bigint"],
	notified_before_end?: GraphQLTypes["timestamp"],
	notified_end?: GraphQLTypes["timestamp"],
	notified_start?: GraphQLTypes["timestamp"],
	number?: number,
	regift_days: number,
	repeat: number,
	repeat_day_of_month: number,
	start_date?: GraphQLTypes["timestamptz"],
	updated_at?: GraphQLTypes["timestamp"]
};
	/** aggregated selection of "epoches" */
["epochs_aggregate"]: {
	__typename: "epochs_aggregate",
	aggregate?: GraphQLTypes["epochs_aggregate_fields"],
	nodes: Array<GraphQLTypes["epochs"]>
};
	/** aggregate fields of "epoches" */
["epochs_aggregate_fields"]: {
	__typename: "epochs_aggregate_fields",
	avg?: GraphQLTypes["epochs_avg_fields"],
	count: number,
	max?: GraphQLTypes["epochs_max_fields"],
	min?: GraphQLTypes["epochs_min_fields"],
	stddev?: GraphQLTypes["epochs_stddev_fields"],
	stddev_pop?: GraphQLTypes["epochs_stddev_pop_fields"],
	stddev_samp?: GraphQLTypes["epochs_stddev_samp_fields"],
	sum?: GraphQLTypes["epochs_sum_fields"],
	var_pop?: GraphQLTypes["epochs_var_pop_fields"],
	var_samp?: GraphQLTypes["epochs_var_samp_fields"],
	variance?: GraphQLTypes["epochs_variance_fields"]
};
	/** order by aggregate values of table "epoches" */
["epochs_aggregate_order_by"]: {
		avg?: GraphQLTypes["epochs_avg_order_by"],
	count?: GraphQLTypes["order_by"],
	max?: GraphQLTypes["epochs_max_order_by"],
	min?: GraphQLTypes["epochs_min_order_by"],
	stddev?: GraphQLTypes["epochs_stddev_order_by"],
	stddev_pop?: GraphQLTypes["epochs_stddev_pop_order_by"],
	stddev_samp?: GraphQLTypes["epochs_stddev_samp_order_by"],
	sum?: GraphQLTypes["epochs_sum_order_by"],
	var_pop?: GraphQLTypes["epochs_var_pop_order_by"],
	var_samp?: GraphQLTypes["epochs_var_samp_order_by"],
	variance?: GraphQLTypes["epochs_variance_order_by"]
};
	/** input type for inserting array relation for remote table "epoches" */
["epochs_arr_rel_insert_input"]: {
		data: Array<GraphQLTypes["epochs_insert_input"]>,
	/** on conflict condition */
	on_conflict?: GraphQLTypes["epochs_on_conflict"]
};
	/** aggregate avg on columns */
["epochs_avg_fields"]: {
	__typename: "epochs_avg_fields",
	circle_id?: number,
	days?: number,
	grant?: number,
	id?: number,
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number
};
	/** order by avg() on columns of table "epoches" */
["epochs_avg_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"]
};
	/** Boolean expression to filter rows from the table "epoches". All fields are combined with a logical 'AND'. */
["epochs_bool_exp"]: {
		_and?: Array<GraphQLTypes["epochs_bool_exp"]>,
	_not?: GraphQLTypes["epochs_bool_exp"],
	_or?: Array<GraphQLTypes["epochs_bool_exp"]>,
	circle?: GraphQLTypes["circles_bool_exp"],
	circle_id?: GraphQLTypes["Int_comparison_exp"],
	created_at?: GraphQLTypes["timestamp_comparison_exp"],
	days?: GraphQLTypes["Int_comparison_exp"],
	end_date?: GraphQLTypes["timestamptz_comparison_exp"],
	ended?: GraphQLTypes["Boolean_comparison_exp"],
	grant?: GraphQLTypes["numeric_comparison_exp"],
	id?: GraphQLTypes["bigint_comparison_exp"],
	notified_before_end?: GraphQLTypes["timestamp_comparison_exp"],
	notified_end?: GraphQLTypes["timestamp_comparison_exp"],
	notified_start?: GraphQLTypes["timestamp_comparison_exp"],
	number?: GraphQLTypes["Int_comparison_exp"],
	regift_days?: GraphQLTypes["Int_comparison_exp"],
	repeat?: GraphQLTypes["Int_comparison_exp"],
	repeat_day_of_month?: GraphQLTypes["Int_comparison_exp"],
	start_date?: GraphQLTypes["timestamptz_comparison_exp"],
	updated_at?: GraphQLTypes["timestamp_comparison_exp"]
};
	/** unique or primary key constraints on table "epoches" */
["epochs_constraint"]: epochs_constraint;
	/** input type for incrementing numeric columns in table "epoches" */
["epochs_inc_input"]: {
		circle_id?: number,
	days?: number,
	grant?: GraphQLTypes["numeric"],
	id?: GraphQLTypes["bigint"],
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number
};
	/** input type for inserting data into table "epoches" */
["epochs_insert_input"]: {
		circle?: GraphQLTypes["circles_obj_rel_insert_input"],
	circle_id?: number,
	created_at?: GraphQLTypes["timestamp"],
	days?: number,
	end_date?: GraphQLTypes["timestamptz"],
	ended?: boolean,
	grant?: GraphQLTypes["numeric"],
	id?: GraphQLTypes["bigint"],
	notified_before_end?: GraphQLTypes["timestamp"],
	notified_end?: GraphQLTypes["timestamp"],
	notified_start?: GraphQLTypes["timestamp"],
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number,
	start_date?: GraphQLTypes["timestamptz"],
	updated_at?: GraphQLTypes["timestamp"]
};
	/** aggregate max on columns */
["epochs_max_fields"]: {
	__typename: "epochs_max_fields",
	circle_id?: number,
	created_at?: GraphQLTypes["timestamp"],
	days?: number,
	end_date?: GraphQLTypes["timestamptz"],
	grant?: GraphQLTypes["numeric"],
	id?: GraphQLTypes["bigint"],
	notified_before_end?: GraphQLTypes["timestamp"],
	notified_end?: GraphQLTypes["timestamp"],
	notified_start?: GraphQLTypes["timestamp"],
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number,
	start_date?: GraphQLTypes["timestamptz"],
	updated_at?: GraphQLTypes["timestamp"]
};
	/** order by max() on columns of table "epoches" */
["epochs_max_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	end_date?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	notified_before_end?: GraphQLTypes["order_by"],
	notified_end?: GraphQLTypes["order_by"],
	notified_start?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"],
	start_date?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"]
};
	/** aggregate min on columns */
["epochs_min_fields"]: {
	__typename: "epochs_min_fields",
	circle_id?: number,
	created_at?: GraphQLTypes["timestamp"],
	days?: number,
	end_date?: GraphQLTypes["timestamptz"],
	grant?: GraphQLTypes["numeric"],
	id?: GraphQLTypes["bigint"],
	notified_before_end?: GraphQLTypes["timestamp"],
	notified_end?: GraphQLTypes["timestamp"],
	notified_start?: GraphQLTypes["timestamp"],
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number,
	start_date?: GraphQLTypes["timestamptz"],
	updated_at?: GraphQLTypes["timestamp"]
};
	/** order by min() on columns of table "epoches" */
["epochs_min_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	end_date?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	notified_before_end?: GraphQLTypes["order_by"],
	notified_end?: GraphQLTypes["order_by"],
	notified_start?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"],
	start_date?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"]
};
	/** response of any mutation on the table "epoches" */
["epochs_mutation_response"]: {
	__typename: "epochs_mutation_response",
	/** number of rows affected by the mutation */
	affected_rows: number,
	/** data from the rows affected by the mutation */
	returning: Array<GraphQLTypes["epochs"]>
};
	/** on conflict condition type for table "epoches" */
["epochs_on_conflict"]: {
		constraint: GraphQLTypes["epochs_constraint"],
	update_columns: Array<GraphQLTypes["epochs_update_column"]>,
	where?: GraphQLTypes["epochs_bool_exp"]
};
	/** Ordering options when selecting data from "epoches". */
["epochs_order_by"]: {
		circle?: GraphQLTypes["circles_order_by"],
	circle_id?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	end_date?: GraphQLTypes["order_by"],
	ended?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	notified_before_end?: GraphQLTypes["order_by"],
	notified_end?: GraphQLTypes["order_by"],
	notified_start?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"],
	start_date?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"]
};
	/** primary key columns input for table: epochs */
["epochs_pk_columns_input"]: {
		id: GraphQLTypes["bigint"]
};
	/** select columns of table "epoches" */
["epochs_select_column"]: epochs_select_column;
	/** input type for updating data in table "epoches" */
["epochs_set_input"]: {
		circle_id?: number,
	created_at?: GraphQLTypes["timestamp"],
	days?: number,
	end_date?: GraphQLTypes["timestamptz"],
	ended?: boolean,
	grant?: GraphQLTypes["numeric"],
	id?: GraphQLTypes["bigint"],
	notified_before_end?: GraphQLTypes["timestamp"],
	notified_end?: GraphQLTypes["timestamp"],
	notified_start?: GraphQLTypes["timestamp"],
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number,
	start_date?: GraphQLTypes["timestamptz"],
	updated_at?: GraphQLTypes["timestamp"]
};
	/** aggregate stddev on columns */
["epochs_stddev_fields"]: {
	__typename: "epochs_stddev_fields",
	circle_id?: number,
	days?: number,
	grant?: number,
	id?: number,
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number
};
	/** order by stddev() on columns of table "epoches" */
["epochs_stddev_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"]
};
	/** aggregate stddev_pop on columns */
["epochs_stddev_pop_fields"]: {
	__typename: "epochs_stddev_pop_fields",
	circle_id?: number,
	days?: number,
	grant?: number,
	id?: number,
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number
};
	/** order by stddev_pop() on columns of table "epoches" */
["epochs_stddev_pop_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"]
};
	/** aggregate stddev_samp on columns */
["epochs_stddev_samp_fields"]: {
	__typename: "epochs_stddev_samp_fields",
	circle_id?: number,
	days?: number,
	grant?: number,
	id?: number,
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number
};
	/** order by stddev_samp() on columns of table "epoches" */
["epochs_stddev_samp_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"]
};
	/** aggregate sum on columns */
["epochs_sum_fields"]: {
	__typename: "epochs_sum_fields",
	circle_id?: number,
	days?: number,
	grant?: GraphQLTypes["numeric"],
	id?: GraphQLTypes["bigint"],
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number
};
	/** order by sum() on columns of table "epoches" */
["epochs_sum_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"]
};
	/** update columns of table "epoches" */
["epochs_update_column"]: epochs_update_column;
	/** aggregate var_pop on columns */
["epochs_var_pop_fields"]: {
	__typename: "epochs_var_pop_fields",
	circle_id?: number,
	days?: number,
	grant?: number,
	id?: number,
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number
};
	/** order by var_pop() on columns of table "epoches" */
["epochs_var_pop_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"]
};
	/** aggregate var_samp on columns */
["epochs_var_samp_fields"]: {
	__typename: "epochs_var_samp_fields",
	circle_id?: number,
	days?: number,
	grant?: number,
	id?: number,
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number
};
	/** order by var_samp() on columns of table "epoches" */
["epochs_var_samp_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"]
};
	/** aggregate variance on columns */
["epochs_variance_fields"]: {
	__typename: "epochs_variance_fields",
	circle_id?: number,
	days?: number,
	grant?: number,
	id?: number,
	number?: number,
	regift_days?: number,
	repeat?: number,
	repeat_day_of_month?: number
};
	/** order by variance() on columns of table "epoches" */
["epochs_variance_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	days?: GraphQLTypes["order_by"],
	grant?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	number?: GraphQLTypes["order_by"],
	regift_days?: GraphQLTypes["order_by"],
	repeat?: GraphQLTypes["order_by"],
	repeat_day_of_month?: GraphQLTypes["order_by"]
};
	/** mutation root */
["mutation_root"]: {
	__typename: "mutation_root",
	/** delete data from the table: "circles" */
	delete_circles?: GraphQLTypes["circles_mutation_response"],
	/** delete single row from the table: "circles" */
	delete_circles_by_pk?: GraphQLTypes["circles"],
	/** delete data from the table: "epoches" */
	delete_epochs?: GraphQLTypes["epochs_mutation_response"],
	/** delete single row from the table: "epoches" */
	delete_epochs_by_pk?: GraphQLTypes["epochs"],
	/** delete data from the table: "nominees" */
	delete_nominees?: GraphQLTypes["nominees_mutation_response"],
	/** delete single row from the table: "nominees" */
	delete_nominees_by_pk?: GraphQLTypes["nominees"],
	/** delete data from the table: "protocols" */
	delete_organizations?: GraphQLTypes["organizations_mutation_response"],
	/** delete single row from the table: "protocols" */
	delete_organizations_by_pk?: GraphQLTypes["organizations"],
	/** delete data from the table: "profiles" */
	delete_profiles?: GraphQLTypes["profiles_mutation_response"],
	/** delete single row from the table: "profiles" */
	delete_profiles_by_pk?: GraphQLTypes["profiles"],
	/** delete data from the table: "users" */
	delete_users?: GraphQLTypes["users_mutation_response"],
	/** delete single row from the table: "users" */
	delete_users_by_pk?: GraphQLTypes["users"],
	/** delete data from the table: "vouches" */
	delete_vouches?: GraphQLTypes["vouches_mutation_response"],
	/** delete single row from the table: "vouches" */
	delete_vouches_by_pk?: GraphQLTypes["vouches"],
	/** insert data into the table: "circles" */
	insert_circles?: GraphQLTypes["circles_mutation_response"],
	/** insert a single row into the table: "circles" */
	insert_circles_one?: GraphQLTypes["circles"],
	/** insert data into the table: "epoches" */
	insert_epochs?: GraphQLTypes["epochs_mutation_response"],
	/** insert a single row into the table: "epoches" */
	insert_epochs_one?: GraphQLTypes["epochs"],
	/** insert data into the table: "nominees" */
	insert_nominees?: GraphQLTypes["nominees_mutation_response"],
	/** insert a single row into the table: "nominees" */
	insert_nominees_one?: GraphQLTypes["nominees"],
	/** insert data into the table: "protocols" */
	insert_organizations?: GraphQLTypes["organizations_mutation_response"],
	/** insert a single row into the table: "protocols" */
	insert_organizations_one?: GraphQLTypes["organizations"],
	/** insert data into the table: "profiles" */
	insert_profiles?: GraphQLTypes["profiles_mutation_response"],
	/** insert a single row into the table: "profiles" */
	insert_profiles_one?: GraphQLTypes["profiles"],
	/** insert data into the table: "users" */
	insert_users?: GraphQLTypes["users_mutation_response"],
	/** insert a single row into the table: "users" */
	insert_users_one?: GraphQLTypes["users"],
	/** insert data into the table: "vouches" */
	insert_vouches?: GraphQLTypes["vouches_mutation_response"],
	/** insert a single row into the table: "vouches" */
	insert_vouches_one?: GraphQLTypes["vouches"],
	/** update data of the table: "circles" */
	update_circles?: GraphQLTypes["circles_mutation_response"],
	/** update single row of the table: "circles" */
	update_circles_by_pk?: GraphQLTypes["circles"],
	/** update data of the table: "epoches" */
	update_epochs?: GraphQLTypes["epochs_mutation_response"],
	/** update single row of the table: "epoches" */
	update_epochs_by_pk?: GraphQLTypes["epochs"],
	/** update data of the table: "nominees" */
	update_nominees?: GraphQLTypes["nominees_mutation_response"],
	/** update single row of the table: "nominees" */
	update_nominees_by_pk?: GraphQLTypes["nominees"],
	/** update data of the table: "protocols" */
	update_organizations?: GraphQLTypes["organizations_mutation_response"],
	/** update single row of the table: "protocols" */
	update_organizations_by_pk?: GraphQLTypes["organizations"],
	/** update data of the table: "profiles" */
	update_profiles?: GraphQLTypes["profiles_mutation_response"],
	/** update single row of the table: "profiles" */
	update_profiles_by_pk?: GraphQLTypes["profiles"],
	/** update data of the table: "users" */
	update_users?: GraphQLTypes["users_mutation_response"],
	/** update single row of the table: "users" */
	update_users_by_pk?: GraphQLTypes["users"],
	/** update data of the table: "vouches" */
	update_vouches?: GraphQLTypes["vouches_mutation_response"],
	/** update single row of the table: "vouches" */
	update_vouches_by_pk?: GraphQLTypes["vouches"]
};
	/** columns and relationships of "nominees" */
["nominees"]: {
	__typename: "nominees",
	address: string,
	/** An object relationship */
	circle?: GraphQLTypes["circles"],
	circle_id: number,
	created_at?: GraphQLTypes["timestamp"],
	description: string,
	ended: boolean,
	expiry_date: GraphQLTypes["date"],
	id: GraphQLTypes["bigint"],
	name: string,
	nominated_by_user_id: number,
	nominated_date: GraphQLTypes["date"],
	/** An array relationship */
	nominations: Array<GraphQLTypes["vouches"]>,
	/** An aggregate relationship */
	nominations_aggregate: GraphQLTypes["vouches_aggregate"],
	/** An object relationship */
	nominator?: GraphQLTypes["users"],
	updated_at?: GraphQLTypes["timestamp"],
	/** An object relationship */
	user?: GraphQLTypes["users"],
	user_id?: number,
	vouches_required: number
};
	/** aggregated selection of "nominees" */
["nominees_aggregate"]: {
	__typename: "nominees_aggregate",
	aggregate?: GraphQLTypes["nominees_aggregate_fields"],
	nodes: Array<GraphQLTypes["nominees"]>
};
	/** aggregate fields of "nominees" */
["nominees_aggregate_fields"]: {
	__typename: "nominees_aggregate_fields",
	avg?: GraphQLTypes["nominees_avg_fields"],
	count: number,
	max?: GraphQLTypes["nominees_max_fields"],
	min?: GraphQLTypes["nominees_min_fields"],
	stddev?: GraphQLTypes["nominees_stddev_fields"],
	stddev_pop?: GraphQLTypes["nominees_stddev_pop_fields"],
	stddev_samp?: GraphQLTypes["nominees_stddev_samp_fields"],
	sum?: GraphQLTypes["nominees_sum_fields"],
	var_pop?: GraphQLTypes["nominees_var_pop_fields"],
	var_samp?: GraphQLTypes["nominees_var_samp_fields"],
	variance?: GraphQLTypes["nominees_variance_fields"]
};
	/** aggregate avg on columns */
["nominees_avg_fields"]: {
	__typename: "nominees_avg_fields",
	circle_id?: number,
	id?: number,
	nominated_by_user_id?: number,
	user_id?: number,
	vouches_required?: number
};
	/** Boolean expression to filter rows from the table "nominees". All fields are combined with a logical 'AND'. */
["nominees_bool_exp"]: {
		_and?: Array<GraphQLTypes["nominees_bool_exp"]>,
	_not?: GraphQLTypes["nominees_bool_exp"],
	_or?: Array<GraphQLTypes["nominees_bool_exp"]>,
	address?: GraphQLTypes["String_comparison_exp"],
	circle?: GraphQLTypes["circles_bool_exp"],
	circle_id?: GraphQLTypes["Int_comparison_exp"],
	created_at?: GraphQLTypes["timestamp_comparison_exp"],
	description?: GraphQLTypes["String_comparison_exp"],
	ended?: GraphQLTypes["Boolean_comparison_exp"],
	expiry_date?: GraphQLTypes["date_comparison_exp"],
	id?: GraphQLTypes["bigint_comparison_exp"],
	name?: GraphQLTypes["String_comparison_exp"],
	nominated_by_user_id?: GraphQLTypes["Int_comparison_exp"],
	nominated_date?: GraphQLTypes["date_comparison_exp"],
	nominations?: GraphQLTypes["vouches_bool_exp"],
	nominator?: GraphQLTypes["users_bool_exp"],
	updated_at?: GraphQLTypes["timestamp_comparison_exp"],
	user?: GraphQLTypes["users_bool_exp"],
	user_id?: GraphQLTypes["Int_comparison_exp"],
	vouches_required?: GraphQLTypes["Int_comparison_exp"]
};
	/** unique or primary key constraints on table "nominees" */
["nominees_constraint"]: nominees_constraint;
	/** input type for incrementing numeric columns in table "nominees" */
["nominees_inc_input"]: {
		circle_id?: number,
	id?: GraphQLTypes["bigint"],
	nominated_by_user_id?: number,
	user_id?: number,
	vouches_required?: number
};
	/** input type for inserting data into table "nominees" */
["nominees_insert_input"]: {
		address?: string,
	circle?: GraphQLTypes["circles_obj_rel_insert_input"],
	circle_id?: number,
	created_at?: GraphQLTypes["timestamp"],
	description?: string,
	ended?: boolean,
	expiry_date?: GraphQLTypes["date"],
	id?: GraphQLTypes["bigint"],
	name?: string,
	nominated_by_user_id?: number,
	nominated_date?: GraphQLTypes["date"],
	nominations?: GraphQLTypes["vouches_arr_rel_insert_input"],
	nominator?: GraphQLTypes["users_obj_rel_insert_input"],
	updated_at?: GraphQLTypes["timestamp"],
	user?: GraphQLTypes["users_obj_rel_insert_input"],
	user_id?: number,
	vouches_required?: number
};
	/** aggregate max on columns */
["nominees_max_fields"]: {
	__typename: "nominees_max_fields",
	address?: string,
	circle_id?: number,
	created_at?: GraphQLTypes["timestamp"],
	description?: string,
	expiry_date?: GraphQLTypes["date"],
	id?: GraphQLTypes["bigint"],
	name?: string,
	nominated_by_user_id?: number,
	nominated_date?: GraphQLTypes["date"],
	updated_at?: GraphQLTypes["timestamp"],
	user_id?: number,
	vouches_required?: number
};
	/** aggregate min on columns */
["nominees_min_fields"]: {
	__typename: "nominees_min_fields",
	address?: string,
	circle_id?: number,
	created_at?: GraphQLTypes["timestamp"],
	description?: string,
	expiry_date?: GraphQLTypes["date"],
	id?: GraphQLTypes["bigint"],
	name?: string,
	nominated_by_user_id?: number,
	nominated_date?: GraphQLTypes["date"],
	updated_at?: GraphQLTypes["timestamp"],
	user_id?: number,
	vouches_required?: number
};
	/** response of any mutation on the table "nominees" */
["nominees_mutation_response"]: {
	__typename: "nominees_mutation_response",
	/** number of rows affected by the mutation */
	affected_rows: number,
	/** data from the rows affected by the mutation */
	returning: Array<GraphQLTypes["nominees"]>
};
	/** input type for inserting object relation for remote table "nominees" */
["nominees_obj_rel_insert_input"]: {
		data: GraphQLTypes["nominees_insert_input"],
	/** on conflict condition */
	on_conflict?: GraphQLTypes["nominees_on_conflict"]
};
	/** on conflict condition type for table "nominees" */
["nominees_on_conflict"]: {
		constraint: GraphQLTypes["nominees_constraint"],
	update_columns: Array<GraphQLTypes["nominees_update_column"]>,
	where?: GraphQLTypes["nominees_bool_exp"]
};
	/** Ordering options when selecting data from "nominees". */
["nominees_order_by"]: {
		address?: GraphQLTypes["order_by"],
	circle?: GraphQLTypes["circles_order_by"],
	circle_id?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	description?: GraphQLTypes["order_by"],
	ended?: GraphQLTypes["order_by"],
	expiry_date?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	name?: GraphQLTypes["order_by"],
	nominated_by_user_id?: GraphQLTypes["order_by"],
	nominated_date?: GraphQLTypes["order_by"],
	nominations_aggregate?: GraphQLTypes["vouches_aggregate_order_by"],
	nominator?: GraphQLTypes["users_order_by"],
	updated_at?: GraphQLTypes["order_by"],
	user?: GraphQLTypes["users_order_by"],
	user_id?: GraphQLTypes["order_by"],
	vouches_required?: GraphQLTypes["order_by"]
};
	/** primary key columns input for table: nominees */
["nominees_pk_columns_input"]: {
		id: GraphQLTypes["bigint"]
};
	/** select columns of table "nominees" */
["nominees_select_column"]: nominees_select_column;
	/** input type for updating data in table "nominees" */
["nominees_set_input"]: {
		address?: string,
	circle_id?: number,
	created_at?: GraphQLTypes["timestamp"],
	description?: string,
	ended?: boolean,
	expiry_date?: GraphQLTypes["date"],
	id?: GraphQLTypes["bigint"],
	name?: string,
	nominated_by_user_id?: number,
	nominated_date?: GraphQLTypes["date"],
	updated_at?: GraphQLTypes["timestamp"],
	user_id?: number,
	vouches_required?: number
};
	/** aggregate stddev on columns */
["nominees_stddev_fields"]: {
	__typename: "nominees_stddev_fields",
	circle_id?: number,
	id?: number,
	nominated_by_user_id?: number,
	user_id?: number,
	vouches_required?: number
};
	/** aggregate stddev_pop on columns */
["nominees_stddev_pop_fields"]: {
	__typename: "nominees_stddev_pop_fields",
	circle_id?: number,
	id?: number,
	nominated_by_user_id?: number,
	user_id?: number,
	vouches_required?: number
};
	/** aggregate stddev_samp on columns */
["nominees_stddev_samp_fields"]: {
	__typename: "nominees_stddev_samp_fields",
	circle_id?: number,
	id?: number,
	nominated_by_user_id?: number,
	user_id?: number,
	vouches_required?: number
};
	/** aggregate sum on columns */
["nominees_sum_fields"]: {
	__typename: "nominees_sum_fields",
	circle_id?: number,
	id?: GraphQLTypes["bigint"],
	nominated_by_user_id?: number,
	user_id?: number,
	vouches_required?: number
};
	/** update columns of table "nominees" */
["nominees_update_column"]: nominees_update_column;
	/** aggregate var_pop on columns */
["nominees_var_pop_fields"]: {
	__typename: "nominees_var_pop_fields",
	circle_id?: number,
	id?: number,
	nominated_by_user_id?: number,
	user_id?: number,
	vouches_required?: number
};
	/** aggregate var_samp on columns */
["nominees_var_samp_fields"]: {
	__typename: "nominees_var_samp_fields",
	circle_id?: number,
	id?: number,
	nominated_by_user_id?: number,
	user_id?: number,
	vouches_required?: number
};
	/** aggregate variance on columns */
["nominees_variance_fields"]: {
	__typename: "nominees_variance_fields",
	circle_id?: number,
	id?: number,
	nominated_by_user_id?: number,
	user_id?: number,
	vouches_required?: number
};
	["numeric"]:any;
	/** Boolean expression to compare columns of type "numeric". All fields are combined with logical 'AND'. */
["numeric_comparison_exp"]: {
		_eq?: GraphQLTypes["numeric"],
	_gt?: GraphQLTypes["numeric"],
	_gte?: GraphQLTypes["numeric"],
	_in?: Array<GraphQLTypes["numeric"]>,
	_is_null?: boolean,
	_lt?: GraphQLTypes["numeric"],
	_lte?: GraphQLTypes["numeric"],
	_neq?: GraphQLTypes["numeric"],
	_nin?: Array<GraphQLTypes["numeric"]>
};
	/** column ordering options */
["order_by"]: order_by;
	/** columns and relationships of "protocols" */
["organizations"]: {
	__typename: "organizations",
	/** An array relationship */
	circles: Array<GraphQLTypes["circles"]>,
	/** An aggregate relationship */
	circles_aggregate: GraphQLTypes["circles_aggregate"],
	created_at?: GraphQLTypes["timestamp"],
	id: GraphQLTypes["bigint"],
	is_verified: boolean,
	name: string,
	telegram_id?: string,
	updated_at?: GraphQLTypes["timestamp"]
};
	/** aggregated selection of "protocols" */
["organizations_aggregate"]: {
	__typename: "organizations_aggregate",
	aggregate?: GraphQLTypes["organizations_aggregate_fields"],
	nodes: Array<GraphQLTypes["organizations"]>
};
	/** aggregate fields of "protocols" */
["organizations_aggregate_fields"]: {
	__typename: "organizations_aggregate_fields",
	avg?: GraphQLTypes["organizations_avg_fields"],
	count: number,
	max?: GraphQLTypes["organizations_max_fields"],
	min?: GraphQLTypes["organizations_min_fields"],
	stddev?: GraphQLTypes["organizations_stddev_fields"],
	stddev_pop?: GraphQLTypes["organizations_stddev_pop_fields"],
	stddev_samp?: GraphQLTypes["organizations_stddev_samp_fields"],
	sum?: GraphQLTypes["organizations_sum_fields"],
	var_pop?: GraphQLTypes["organizations_var_pop_fields"],
	var_samp?: GraphQLTypes["organizations_var_samp_fields"],
	variance?: GraphQLTypes["organizations_variance_fields"]
};
	/** aggregate avg on columns */
["organizations_avg_fields"]: {
	__typename: "organizations_avg_fields",
	id?: number
};
	/** Boolean expression to filter rows from the table "protocols". All fields are combined with a logical 'AND'. */
["organizations_bool_exp"]: {
		_and?: Array<GraphQLTypes["organizations_bool_exp"]>,
	_not?: GraphQLTypes["organizations_bool_exp"],
	_or?: Array<GraphQLTypes["organizations_bool_exp"]>,
	circles?: GraphQLTypes["circles_bool_exp"],
	created_at?: GraphQLTypes["timestamp_comparison_exp"],
	id?: GraphQLTypes["bigint_comparison_exp"],
	is_verified?: GraphQLTypes["Boolean_comparison_exp"],
	name?: GraphQLTypes["String_comparison_exp"],
	telegram_id?: GraphQLTypes["String_comparison_exp"],
	updated_at?: GraphQLTypes["timestamp_comparison_exp"]
};
	/** unique or primary key constraints on table "protocols" */
["organizations_constraint"]: organizations_constraint;
	/** input type for incrementing numeric columns in table "protocols" */
["organizations_inc_input"]: {
		id?: GraphQLTypes["bigint"]
};
	/** input type for inserting data into table "protocols" */
["organizations_insert_input"]: {
		circles?: GraphQLTypes["circles_arr_rel_insert_input"],
	created_at?: GraphQLTypes["timestamp"],
	id?: GraphQLTypes["bigint"],
	is_verified?: boolean,
	name?: string,
	telegram_id?: string,
	updated_at?: GraphQLTypes["timestamp"]
};
	/** aggregate max on columns */
["organizations_max_fields"]: {
	__typename: "organizations_max_fields",
	created_at?: GraphQLTypes["timestamp"],
	id?: GraphQLTypes["bigint"],
	name?: string,
	telegram_id?: string,
	updated_at?: GraphQLTypes["timestamp"]
};
	/** aggregate min on columns */
["organizations_min_fields"]: {
	__typename: "organizations_min_fields",
	created_at?: GraphQLTypes["timestamp"],
	id?: GraphQLTypes["bigint"],
	name?: string,
	telegram_id?: string,
	updated_at?: GraphQLTypes["timestamp"]
};
	/** response of any mutation on the table "protocols" */
["organizations_mutation_response"]: {
	__typename: "organizations_mutation_response",
	/** number of rows affected by the mutation */
	affected_rows: number,
	/** data from the rows affected by the mutation */
	returning: Array<GraphQLTypes["organizations"]>
};
	/** input type for inserting object relation for remote table "protocols" */
["organizations_obj_rel_insert_input"]: {
		data: GraphQLTypes["organizations_insert_input"],
	/** on conflict condition */
	on_conflict?: GraphQLTypes["organizations_on_conflict"]
};
	/** on conflict condition type for table "protocols" */
["organizations_on_conflict"]: {
		constraint: GraphQLTypes["organizations_constraint"],
	update_columns: Array<GraphQLTypes["organizations_update_column"]>,
	where?: GraphQLTypes["organizations_bool_exp"]
};
	/** Ordering options when selecting data from "protocols". */
["organizations_order_by"]: {
		circles_aggregate?: GraphQLTypes["circles_aggregate_order_by"],
	created_at?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	is_verified?: GraphQLTypes["order_by"],
	name?: GraphQLTypes["order_by"],
	telegram_id?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"]
};
	/** primary key columns input for table: organizations */
["organizations_pk_columns_input"]: {
		id: GraphQLTypes["bigint"]
};
	/** select columns of table "protocols" */
["organizations_select_column"]: organizations_select_column;
	/** input type for updating data in table "protocols" */
["organizations_set_input"]: {
		created_at?: GraphQLTypes["timestamp"],
	id?: GraphQLTypes["bigint"],
	is_verified?: boolean,
	name?: string,
	telegram_id?: string,
	updated_at?: GraphQLTypes["timestamp"]
};
	/** aggregate stddev on columns */
["organizations_stddev_fields"]: {
	__typename: "organizations_stddev_fields",
	id?: number
};
	/** aggregate stddev_pop on columns */
["organizations_stddev_pop_fields"]: {
	__typename: "organizations_stddev_pop_fields",
	id?: number
};
	/** aggregate stddev_samp on columns */
["organizations_stddev_samp_fields"]: {
	__typename: "organizations_stddev_samp_fields",
	id?: number
};
	/** aggregate sum on columns */
["organizations_sum_fields"]: {
	__typename: "organizations_sum_fields",
	id?: GraphQLTypes["bigint"]
};
	/** update columns of table "protocols" */
["organizations_update_column"]: organizations_update_column;
	/** aggregate var_pop on columns */
["organizations_var_pop_fields"]: {
	__typename: "organizations_var_pop_fields",
	id?: number
};
	/** aggregate var_samp on columns */
["organizations_var_samp_fields"]: {
	__typename: "organizations_var_samp_fields",
	id?: number
};
	/** aggregate variance on columns */
["organizations_variance_fields"]: {
	__typename: "organizations_variance_fields",
	id?: number
};
	/** columns and relationships of "profiles" */
["profiles"]: {
	__typename: "profiles",
	address: string,
	admin_view: boolean,
	ann_power: boolean,
	avatar?: string,
	background?: string,
	bio?: string,
	chat_id?: string,
	created_at?: GraphQLTypes["timestamp"],
	discord_username?: string,
	github_username?: string,
	id: GraphQLTypes["bigint"],
	medium_username?: string,
	skills?: string,
	telegram_username?: string,
	twitter_username?: string,
	updated_at?: GraphQLTypes["timestamp"],
	/** An array relationship */
	users: Array<GraphQLTypes["users"]>,
	/** An aggregate relationship */
	users_aggregate: GraphQLTypes["users_aggregate"],
	website?: string
};
	/** aggregated selection of "profiles" */
["profiles_aggregate"]: {
	__typename: "profiles_aggregate",
	aggregate?: GraphQLTypes["profiles_aggregate_fields"],
	nodes: Array<GraphQLTypes["profiles"]>
};
	/** aggregate fields of "profiles" */
["profiles_aggregate_fields"]: {
	__typename: "profiles_aggregate_fields",
	avg?: GraphQLTypes["profiles_avg_fields"],
	count: number,
	max?: GraphQLTypes["profiles_max_fields"],
	min?: GraphQLTypes["profiles_min_fields"],
	stddev?: GraphQLTypes["profiles_stddev_fields"],
	stddev_pop?: GraphQLTypes["profiles_stddev_pop_fields"],
	stddev_samp?: GraphQLTypes["profiles_stddev_samp_fields"],
	sum?: GraphQLTypes["profiles_sum_fields"],
	var_pop?: GraphQLTypes["profiles_var_pop_fields"],
	var_samp?: GraphQLTypes["profiles_var_samp_fields"],
	variance?: GraphQLTypes["profiles_variance_fields"]
};
	/** aggregate avg on columns */
["profiles_avg_fields"]: {
	__typename: "profiles_avg_fields",
	id?: number
};
	/** Boolean expression to filter rows from the table "profiles". All fields are combined with a logical 'AND'. */
["profiles_bool_exp"]: {
		_and?: Array<GraphQLTypes["profiles_bool_exp"]>,
	_not?: GraphQLTypes["profiles_bool_exp"],
	_or?: Array<GraphQLTypes["profiles_bool_exp"]>,
	address?: GraphQLTypes["String_comparison_exp"],
	admin_view?: GraphQLTypes["Boolean_comparison_exp"],
	ann_power?: GraphQLTypes["Boolean_comparison_exp"],
	avatar?: GraphQLTypes["String_comparison_exp"],
	background?: GraphQLTypes["String_comparison_exp"],
	bio?: GraphQLTypes["String_comparison_exp"],
	chat_id?: GraphQLTypes["String_comparison_exp"],
	created_at?: GraphQLTypes["timestamp_comparison_exp"],
	discord_username?: GraphQLTypes["String_comparison_exp"],
	github_username?: GraphQLTypes["String_comparison_exp"],
	id?: GraphQLTypes["bigint_comparison_exp"],
	medium_username?: GraphQLTypes["String_comparison_exp"],
	skills?: GraphQLTypes["String_comparison_exp"],
	telegram_username?: GraphQLTypes["String_comparison_exp"],
	twitter_username?: GraphQLTypes["String_comparison_exp"],
	updated_at?: GraphQLTypes["timestamp_comparison_exp"],
	users?: GraphQLTypes["users_bool_exp"],
	website?: GraphQLTypes["String_comparison_exp"]
};
	/** unique or primary key constraints on table "profiles" */
["profiles_constraint"]: profiles_constraint;
	/** input type for incrementing numeric columns in table "profiles" */
["profiles_inc_input"]: {
		id?: GraphQLTypes["bigint"]
};
	/** input type for inserting data into table "profiles" */
["profiles_insert_input"]: {
		address?: string,
	admin_view?: boolean,
	ann_power?: boolean,
	avatar?: string,
	background?: string,
	bio?: string,
	chat_id?: string,
	created_at?: GraphQLTypes["timestamp"],
	discord_username?: string,
	github_username?: string,
	id?: GraphQLTypes["bigint"],
	medium_username?: string,
	skills?: string,
	telegram_username?: string,
	twitter_username?: string,
	updated_at?: GraphQLTypes["timestamp"],
	users?: GraphQLTypes["users_arr_rel_insert_input"],
	website?: string
};
	/** aggregate max on columns */
["profiles_max_fields"]: {
	__typename: "profiles_max_fields",
	address?: string,
	avatar?: string,
	background?: string,
	bio?: string,
	chat_id?: string,
	created_at?: GraphQLTypes["timestamp"],
	discord_username?: string,
	github_username?: string,
	id?: GraphQLTypes["bigint"],
	medium_username?: string,
	skills?: string,
	telegram_username?: string,
	twitter_username?: string,
	updated_at?: GraphQLTypes["timestamp"],
	website?: string
};
	/** aggregate min on columns */
["profiles_min_fields"]: {
	__typename: "profiles_min_fields",
	address?: string,
	avatar?: string,
	background?: string,
	bio?: string,
	chat_id?: string,
	created_at?: GraphQLTypes["timestamp"],
	discord_username?: string,
	github_username?: string,
	id?: GraphQLTypes["bigint"],
	medium_username?: string,
	skills?: string,
	telegram_username?: string,
	twitter_username?: string,
	updated_at?: GraphQLTypes["timestamp"],
	website?: string
};
	/** response of any mutation on the table "profiles" */
["profiles_mutation_response"]: {
	__typename: "profiles_mutation_response",
	/** number of rows affected by the mutation */
	affected_rows: number,
	/** data from the rows affected by the mutation */
	returning: Array<GraphQLTypes["profiles"]>
};
	/** input type for inserting object relation for remote table "profiles" */
["profiles_obj_rel_insert_input"]: {
		data: GraphQLTypes["profiles_insert_input"],
	/** on conflict condition */
	on_conflict?: GraphQLTypes["profiles_on_conflict"]
};
	/** on conflict condition type for table "profiles" */
["profiles_on_conflict"]: {
		constraint: GraphQLTypes["profiles_constraint"],
	update_columns: Array<GraphQLTypes["profiles_update_column"]>,
	where?: GraphQLTypes["profiles_bool_exp"]
};
	/** Ordering options when selecting data from "profiles". */
["profiles_order_by"]: {
		address?: GraphQLTypes["order_by"],
	admin_view?: GraphQLTypes["order_by"],
	ann_power?: GraphQLTypes["order_by"],
	avatar?: GraphQLTypes["order_by"],
	background?: GraphQLTypes["order_by"],
	bio?: GraphQLTypes["order_by"],
	chat_id?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	discord_username?: GraphQLTypes["order_by"],
	github_username?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	medium_username?: GraphQLTypes["order_by"],
	skills?: GraphQLTypes["order_by"],
	telegram_username?: GraphQLTypes["order_by"],
	twitter_username?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"],
	users_aggregate?: GraphQLTypes["users_aggregate_order_by"],
	website?: GraphQLTypes["order_by"]
};
	/** primary key columns input for table: profiles */
["profiles_pk_columns_input"]: {
		id: GraphQLTypes["bigint"]
};
	/** select columns of table "profiles" */
["profiles_select_column"]: profiles_select_column;
	/** input type for updating data in table "profiles" */
["profiles_set_input"]: {
		address?: string,
	admin_view?: boolean,
	ann_power?: boolean,
	avatar?: string,
	background?: string,
	bio?: string,
	chat_id?: string,
	created_at?: GraphQLTypes["timestamp"],
	discord_username?: string,
	github_username?: string,
	id?: GraphQLTypes["bigint"],
	medium_username?: string,
	skills?: string,
	telegram_username?: string,
	twitter_username?: string,
	updated_at?: GraphQLTypes["timestamp"],
	website?: string
};
	/** aggregate stddev on columns */
["profiles_stddev_fields"]: {
	__typename: "profiles_stddev_fields",
	id?: number
};
	/** aggregate stddev_pop on columns */
["profiles_stddev_pop_fields"]: {
	__typename: "profiles_stddev_pop_fields",
	id?: number
};
	/** aggregate stddev_samp on columns */
["profiles_stddev_samp_fields"]: {
	__typename: "profiles_stddev_samp_fields",
	id?: number
};
	/** aggregate sum on columns */
["profiles_sum_fields"]: {
	__typename: "profiles_sum_fields",
	id?: GraphQLTypes["bigint"]
};
	/** update columns of table "profiles" */
["profiles_update_column"]: profiles_update_column;
	/** aggregate var_pop on columns */
["profiles_var_pop_fields"]: {
	__typename: "profiles_var_pop_fields",
	id?: number
};
	/** aggregate var_samp on columns */
["profiles_var_samp_fields"]: {
	__typename: "profiles_var_samp_fields",
	id?: number
};
	/** aggregate variance on columns */
["profiles_variance_fields"]: {
	__typename: "profiles_variance_fields",
	id?: number
};
	["query_root"]: {
	__typename: "query_root",
	/** An array relationship */
	circles: Array<GraphQLTypes["circles"]>,
	/** An aggregate relationship */
	circles_aggregate: GraphQLTypes["circles_aggregate"],
	/** fetch data from the table: "circles" using primary key columns */
	circles_by_pk?: GraphQLTypes["circles"],
	/** An array relationship */
	epochs: Array<GraphQLTypes["epochs"]>,
	/** An aggregate relationship */
	epochs_aggregate: GraphQLTypes["epochs_aggregate"],
	/** fetch data from the table: "epoches" using primary key columns */
	epochs_by_pk?: GraphQLTypes["epochs"],
	/** fetch data from the table: "nominees" */
	nominees: Array<GraphQLTypes["nominees"]>,
	/** fetch aggregated fields from the table: "nominees" */
	nominees_aggregate: GraphQLTypes["nominees_aggregate"],
	/** fetch data from the table: "nominees" using primary key columns */
	nominees_by_pk?: GraphQLTypes["nominees"],
	/** fetch data from the table: "protocols" */
	organizations: Array<GraphQLTypes["organizations"]>,
	/** fetch aggregated fields from the table: "protocols" */
	organizations_aggregate: GraphQLTypes["organizations_aggregate"],
	/** fetch data from the table: "protocols" using primary key columns */
	organizations_by_pk?: GraphQLTypes["organizations"],
	/** fetch data from the table: "profiles" */
	profiles: Array<GraphQLTypes["profiles"]>,
	/** fetch aggregated fields from the table: "profiles" */
	profiles_aggregate: GraphQLTypes["profiles_aggregate"],
	/** fetch data from the table: "profiles" using primary key columns */
	profiles_by_pk?: GraphQLTypes["profiles"],
	/** An array relationship */
	users: Array<GraphQLTypes["users"]>,
	/** An aggregate relationship */
	users_aggregate: GraphQLTypes["users_aggregate"],
	/** fetch data from the table: "users" using primary key columns */
	users_by_pk?: GraphQLTypes["users"],
	/** fetch data from the table: "vouches" */
	vouches: Array<GraphQLTypes["vouches"]>,
	/** fetch aggregated fields from the table: "vouches" */
	vouches_aggregate: GraphQLTypes["vouches_aggregate"],
	/** fetch data from the table: "vouches" using primary key columns */
	vouches_by_pk?: GraphQLTypes["vouches"]
};
	["subscription_root"]: {
	__typename: "subscription_root",
	/** An array relationship */
	circles: Array<GraphQLTypes["circles"]>,
	/** An aggregate relationship */
	circles_aggregate: GraphQLTypes["circles_aggregate"],
	/** fetch data from the table: "circles" using primary key columns */
	circles_by_pk?: GraphQLTypes["circles"],
	/** An array relationship */
	epochs: Array<GraphQLTypes["epochs"]>,
	/** An aggregate relationship */
	epochs_aggregate: GraphQLTypes["epochs_aggregate"],
	/** fetch data from the table: "epoches" using primary key columns */
	epochs_by_pk?: GraphQLTypes["epochs"],
	/** fetch data from the table: "nominees" */
	nominees: Array<GraphQLTypes["nominees"]>,
	/** fetch aggregated fields from the table: "nominees" */
	nominees_aggregate: GraphQLTypes["nominees_aggregate"],
	/** fetch data from the table: "nominees" using primary key columns */
	nominees_by_pk?: GraphQLTypes["nominees"],
	/** fetch data from the table: "protocols" */
	organizations: Array<GraphQLTypes["organizations"]>,
	/** fetch aggregated fields from the table: "protocols" */
	organizations_aggregate: GraphQLTypes["organizations_aggregate"],
	/** fetch data from the table: "protocols" using primary key columns */
	organizations_by_pk?: GraphQLTypes["organizations"],
	/** fetch data from the table: "profiles" */
	profiles: Array<GraphQLTypes["profiles"]>,
	/** fetch aggregated fields from the table: "profiles" */
	profiles_aggregate: GraphQLTypes["profiles_aggregate"],
	/** fetch data from the table: "profiles" using primary key columns */
	profiles_by_pk?: GraphQLTypes["profiles"],
	/** An array relationship */
	users: Array<GraphQLTypes["users"]>,
	/** An aggregate relationship */
	users_aggregate: GraphQLTypes["users_aggregate"],
	/** fetch data from the table: "users" using primary key columns */
	users_by_pk?: GraphQLTypes["users"],
	/** fetch data from the table: "vouches" */
	vouches: Array<GraphQLTypes["vouches"]>,
	/** fetch aggregated fields from the table: "vouches" */
	vouches_aggregate: GraphQLTypes["vouches_aggregate"],
	/** fetch data from the table: "vouches" using primary key columns */
	vouches_by_pk?: GraphQLTypes["vouches"]
};
	["timestamp"]:any;
	/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
["timestamp_comparison_exp"]: {
		_eq?: GraphQLTypes["timestamp"],
	_gt?: GraphQLTypes["timestamp"],
	_gte?: GraphQLTypes["timestamp"],
	_in?: Array<GraphQLTypes["timestamp"]>,
	_is_null?: boolean,
	_lt?: GraphQLTypes["timestamp"],
	_lte?: GraphQLTypes["timestamp"],
	_neq?: GraphQLTypes["timestamp"],
	_nin?: Array<GraphQLTypes["timestamp"]>
};
	["timestamptz"]:any;
	/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
["timestamptz_comparison_exp"]: {
		_eq?: GraphQLTypes["timestamptz"],
	_gt?: GraphQLTypes["timestamptz"],
	_gte?: GraphQLTypes["timestamptz"],
	_in?: Array<GraphQLTypes["timestamptz"]>,
	_is_null?: boolean,
	_lt?: GraphQLTypes["timestamptz"],
	_lte?: GraphQLTypes["timestamptz"],
	_neq?: GraphQLTypes["timestamptz"],
	_nin?: Array<GraphQLTypes["timestamptz"]>
};
	/** columns and relationships of "users" */
["users"]: {
	__typename: "users",
	address: string,
	bio?: string,
	/** An object relationship */
	circle: GraphQLTypes["circles"],
	circle_id: GraphQLTypes["bigint"],
	created_at?: GraphQLTypes["timestamp"],
	deleted_at?: GraphQLTypes["timestamp"],
	epoch_first_visit: boolean,
	fixed_non_receiver: boolean,
	give_token_received: number,
	give_token_remaining: number,
	id: GraphQLTypes["bigint"],
	name: string,
	non_giver: boolean,
	non_receiver: boolean,
	/** An object relationship */
	profile?: GraphQLTypes["profiles"],
	role: number,
	starting_tokens: number,
	updated_at?: GraphQLTypes["timestamp"]
};
	/** aggregated selection of "users" */
["users_aggregate"]: {
	__typename: "users_aggregate",
	aggregate?: GraphQLTypes["users_aggregate_fields"],
	nodes: Array<GraphQLTypes["users"]>
};
	/** aggregate fields of "users" */
["users_aggregate_fields"]: {
	__typename: "users_aggregate_fields",
	avg?: GraphQLTypes["users_avg_fields"],
	count: number,
	max?: GraphQLTypes["users_max_fields"],
	min?: GraphQLTypes["users_min_fields"],
	stddev?: GraphQLTypes["users_stddev_fields"],
	stddev_pop?: GraphQLTypes["users_stddev_pop_fields"],
	stddev_samp?: GraphQLTypes["users_stddev_samp_fields"],
	sum?: GraphQLTypes["users_sum_fields"],
	var_pop?: GraphQLTypes["users_var_pop_fields"],
	var_samp?: GraphQLTypes["users_var_samp_fields"],
	variance?: GraphQLTypes["users_variance_fields"]
};
	/** order by aggregate values of table "users" */
["users_aggregate_order_by"]: {
		avg?: GraphQLTypes["users_avg_order_by"],
	count?: GraphQLTypes["order_by"],
	max?: GraphQLTypes["users_max_order_by"],
	min?: GraphQLTypes["users_min_order_by"],
	stddev?: GraphQLTypes["users_stddev_order_by"],
	stddev_pop?: GraphQLTypes["users_stddev_pop_order_by"],
	stddev_samp?: GraphQLTypes["users_stddev_samp_order_by"],
	sum?: GraphQLTypes["users_sum_order_by"],
	var_pop?: GraphQLTypes["users_var_pop_order_by"],
	var_samp?: GraphQLTypes["users_var_samp_order_by"],
	variance?: GraphQLTypes["users_variance_order_by"]
};
	/** input type for inserting array relation for remote table "users" */
["users_arr_rel_insert_input"]: {
		data: Array<GraphQLTypes["users_insert_input"]>,
	/** on conflict condition */
	on_conflict?: GraphQLTypes["users_on_conflict"]
};
	/** aggregate avg on columns */
["users_avg_fields"]: {
	__typename: "users_avg_fields",
	circle_id?: number,
	give_token_received?: number,
	give_token_remaining?: number,
	id?: number,
	role?: number,
	starting_tokens?: number
};
	/** order by avg() on columns of table "users" */
["users_avg_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"]
};
	/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
["users_bool_exp"]: {
		_and?: Array<GraphQLTypes["users_bool_exp"]>,
	_not?: GraphQLTypes["users_bool_exp"],
	_or?: Array<GraphQLTypes["users_bool_exp"]>,
	address?: GraphQLTypes["String_comparison_exp"],
	bio?: GraphQLTypes["String_comparison_exp"],
	circle?: GraphQLTypes["circles_bool_exp"],
	circle_id?: GraphQLTypes["bigint_comparison_exp"],
	created_at?: GraphQLTypes["timestamp_comparison_exp"],
	deleted_at?: GraphQLTypes["timestamp_comparison_exp"],
	epoch_first_visit?: GraphQLTypes["Boolean_comparison_exp"],
	fixed_non_receiver?: GraphQLTypes["Boolean_comparison_exp"],
	give_token_received?: GraphQLTypes["Int_comparison_exp"],
	give_token_remaining?: GraphQLTypes["Int_comparison_exp"],
	id?: GraphQLTypes["bigint_comparison_exp"],
	name?: GraphQLTypes["String_comparison_exp"],
	non_giver?: GraphQLTypes["Boolean_comparison_exp"],
	non_receiver?: GraphQLTypes["Boolean_comparison_exp"],
	profile?: GraphQLTypes["profiles_bool_exp"],
	role?: GraphQLTypes["Int_comparison_exp"],
	starting_tokens?: GraphQLTypes["Int_comparison_exp"],
	updated_at?: GraphQLTypes["timestamp_comparison_exp"]
};
	/** unique or primary key constraints on table "users" */
["users_constraint"]: users_constraint;
	/** input type for incrementing numeric columns in table "users" */
["users_inc_input"]: {
		circle_id?: GraphQLTypes["bigint"],
	give_token_received?: number,
	give_token_remaining?: number,
	id?: GraphQLTypes["bigint"],
	role?: number,
	starting_tokens?: number
};
	/** input type for inserting data into table "users" */
["users_insert_input"]: {
		address?: string,
	bio?: string,
	circle?: GraphQLTypes["circles_obj_rel_insert_input"],
	circle_id?: GraphQLTypes["bigint"],
	created_at?: GraphQLTypes["timestamp"],
	deleted_at?: GraphQLTypes["timestamp"],
	epoch_first_visit?: boolean,
	fixed_non_receiver?: boolean,
	give_token_received?: number,
	give_token_remaining?: number,
	id?: GraphQLTypes["bigint"],
	name?: string,
	non_giver?: boolean,
	non_receiver?: boolean,
	profile?: GraphQLTypes["profiles_obj_rel_insert_input"],
	role?: number,
	starting_tokens?: number,
	updated_at?: GraphQLTypes["timestamp"]
};
	/** aggregate max on columns */
["users_max_fields"]: {
	__typename: "users_max_fields",
	address?: string,
	bio?: string,
	circle_id?: GraphQLTypes["bigint"],
	created_at?: GraphQLTypes["timestamp"],
	deleted_at?: GraphQLTypes["timestamp"],
	give_token_received?: number,
	give_token_remaining?: number,
	id?: GraphQLTypes["bigint"],
	name?: string,
	role?: number,
	starting_tokens?: number,
	updated_at?: GraphQLTypes["timestamp"]
};
	/** order by max() on columns of table "users" */
["users_max_order_by"]: {
		address?: GraphQLTypes["order_by"],
	bio?: GraphQLTypes["order_by"],
	circle_id?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	deleted_at?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	name?: GraphQLTypes["order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"]
};
	/** aggregate min on columns */
["users_min_fields"]: {
	__typename: "users_min_fields",
	address?: string,
	bio?: string,
	circle_id?: GraphQLTypes["bigint"],
	created_at?: GraphQLTypes["timestamp"],
	deleted_at?: GraphQLTypes["timestamp"],
	give_token_received?: number,
	give_token_remaining?: number,
	id?: GraphQLTypes["bigint"],
	name?: string,
	role?: number,
	starting_tokens?: number,
	updated_at?: GraphQLTypes["timestamp"]
};
	/** order by min() on columns of table "users" */
["users_min_order_by"]: {
		address?: GraphQLTypes["order_by"],
	bio?: GraphQLTypes["order_by"],
	circle_id?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	deleted_at?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	name?: GraphQLTypes["order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"]
};
	/** response of any mutation on the table "users" */
["users_mutation_response"]: {
	__typename: "users_mutation_response",
	/** number of rows affected by the mutation */
	affected_rows: number,
	/** data from the rows affected by the mutation */
	returning: Array<GraphQLTypes["users"]>
};
	/** input type for inserting object relation for remote table "users" */
["users_obj_rel_insert_input"]: {
		data: GraphQLTypes["users_insert_input"],
	/** on conflict condition */
	on_conflict?: GraphQLTypes["users_on_conflict"]
};
	/** on conflict condition type for table "users" */
["users_on_conflict"]: {
		constraint: GraphQLTypes["users_constraint"],
	update_columns: Array<GraphQLTypes["users_update_column"]>,
	where?: GraphQLTypes["users_bool_exp"]
};
	/** Ordering options when selecting data from "users". */
["users_order_by"]: {
		address?: GraphQLTypes["order_by"],
	bio?: GraphQLTypes["order_by"],
	circle?: GraphQLTypes["circles_order_by"],
	circle_id?: GraphQLTypes["order_by"],
	created_at?: GraphQLTypes["order_by"],
	deleted_at?: GraphQLTypes["order_by"],
	epoch_first_visit?: GraphQLTypes["order_by"],
	fixed_non_receiver?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	name?: GraphQLTypes["order_by"],
	non_giver?: GraphQLTypes["order_by"],
	non_receiver?: GraphQLTypes["order_by"],
	profile?: GraphQLTypes["profiles_order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"]
};
	/** primary key columns input for table: users */
["users_pk_columns_input"]: {
		id: GraphQLTypes["bigint"]
};
	/** select columns of table "users" */
["users_select_column"]: users_select_column;
	/** input type for updating data in table "users" */
["users_set_input"]: {
		address?: string,
	bio?: string,
	circle_id?: GraphQLTypes["bigint"],
	created_at?: GraphQLTypes["timestamp"],
	deleted_at?: GraphQLTypes["timestamp"],
	epoch_first_visit?: boolean,
	fixed_non_receiver?: boolean,
	give_token_received?: number,
	give_token_remaining?: number,
	id?: GraphQLTypes["bigint"],
	name?: string,
	non_giver?: boolean,
	non_receiver?: boolean,
	role?: number,
	starting_tokens?: number,
	updated_at?: GraphQLTypes["timestamp"]
};
	/** aggregate stddev on columns */
["users_stddev_fields"]: {
	__typename: "users_stddev_fields",
	circle_id?: number,
	give_token_received?: number,
	give_token_remaining?: number,
	id?: number,
	role?: number,
	starting_tokens?: number
};
	/** order by stddev() on columns of table "users" */
["users_stddev_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"]
};
	/** aggregate stddev_pop on columns */
["users_stddev_pop_fields"]: {
	__typename: "users_stddev_pop_fields",
	circle_id?: number,
	give_token_received?: number,
	give_token_remaining?: number,
	id?: number,
	role?: number,
	starting_tokens?: number
};
	/** order by stddev_pop() on columns of table "users" */
["users_stddev_pop_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"]
};
	/** aggregate stddev_samp on columns */
["users_stddev_samp_fields"]: {
	__typename: "users_stddev_samp_fields",
	circle_id?: number,
	give_token_received?: number,
	give_token_remaining?: number,
	id?: number,
	role?: number,
	starting_tokens?: number
};
	/** order by stddev_samp() on columns of table "users" */
["users_stddev_samp_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"]
};
	/** aggregate sum on columns */
["users_sum_fields"]: {
	__typename: "users_sum_fields",
	circle_id?: GraphQLTypes["bigint"],
	give_token_received?: number,
	give_token_remaining?: number,
	id?: GraphQLTypes["bigint"],
	role?: number,
	starting_tokens?: number
};
	/** order by sum() on columns of table "users" */
["users_sum_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"]
};
	/** update columns of table "users" */
["users_update_column"]: users_update_column;
	/** aggregate var_pop on columns */
["users_var_pop_fields"]: {
	__typename: "users_var_pop_fields",
	circle_id?: number,
	give_token_received?: number,
	give_token_remaining?: number,
	id?: number,
	role?: number,
	starting_tokens?: number
};
	/** order by var_pop() on columns of table "users" */
["users_var_pop_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"]
};
	/** aggregate var_samp on columns */
["users_var_samp_fields"]: {
	__typename: "users_var_samp_fields",
	circle_id?: number,
	give_token_received?: number,
	give_token_remaining?: number,
	id?: number,
	role?: number,
	starting_tokens?: number
};
	/** order by var_samp() on columns of table "users" */
["users_var_samp_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"]
};
	/** aggregate variance on columns */
["users_variance_fields"]: {
	__typename: "users_variance_fields",
	circle_id?: number,
	give_token_received?: number,
	give_token_remaining?: number,
	id?: number,
	role?: number,
	starting_tokens?: number
};
	/** order by variance() on columns of table "users" */
["users_variance_order_by"]: {
		circle_id?: GraphQLTypes["order_by"],
	give_token_received?: GraphQLTypes["order_by"],
	give_token_remaining?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	role?: GraphQLTypes["order_by"],
	starting_tokens?: GraphQLTypes["order_by"]
};
	/** columns and relationships of "vouches" */
["vouches"]: {
	__typename: "vouches",
	created_at?: GraphQLTypes["timestamp"],
	id: GraphQLTypes["bigint"],
	/** An object relationship */
	nominee?: GraphQLTypes["nominees"],
	nominee_id: number,
	updated_at?: GraphQLTypes["timestamp"],
	/** An object relationship */
	voucher?: GraphQLTypes["users"],
	voucher_id: number
};
	/** aggregated selection of "vouches" */
["vouches_aggregate"]: {
	__typename: "vouches_aggregate",
	aggregate?: GraphQLTypes["vouches_aggregate_fields"],
	nodes: Array<GraphQLTypes["vouches"]>
};
	/** aggregate fields of "vouches" */
["vouches_aggregate_fields"]: {
	__typename: "vouches_aggregate_fields",
	avg?: GraphQLTypes["vouches_avg_fields"],
	count: number,
	max?: GraphQLTypes["vouches_max_fields"],
	min?: GraphQLTypes["vouches_min_fields"],
	stddev?: GraphQLTypes["vouches_stddev_fields"],
	stddev_pop?: GraphQLTypes["vouches_stddev_pop_fields"],
	stddev_samp?: GraphQLTypes["vouches_stddev_samp_fields"],
	sum?: GraphQLTypes["vouches_sum_fields"],
	var_pop?: GraphQLTypes["vouches_var_pop_fields"],
	var_samp?: GraphQLTypes["vouches_var_samp_fields"],
	variance?: GraphQLTypes["vouches_variance_fields"]
};
	/** order by aggregate values of table "vouches" */
["vouches_aggregate_order_by"]: {
		avg?: GraphQLTypes["vouches_avg_order_by"],
	count?: GraphQLTypes["order_by"],
	max?: GraphQLTypes["vouches_max_order_by"],
	min?: GraphQLTypes["vouches_min_order_by"],
	stddev?: GraphQLTypes["vouches_stddev_order_by"],
	stddev_pop?: GraphQLTypes["vouches_stddev_pop_order_by"],
	stddev_samp?: GraphQLTypes["vouches_stddev_samp_order_by"],
	sum?: GraphQLTypes["vouches_sum_order_by"],
	var_pop?: GraphQLTypes["vouches_var_pop_order_by"],
	var_samp?: GraphQLTypes["vouches_var_samp_order_by"],
	variance?: GraphQLTypes["vouches_variance_order_by"]
};
	/** input type for inserting array relation for remote table "vouches" */
["vouches_arr_rel_insert_input"]: {
		data: Array<GraphQLTypes["vouches_insert_input"]>,
	/** on conflict condition */
	on_conflict?: GraphQLTypes["vouches_on_conflict"]
};
	/** aggregate avg on columns */
["vouches_avg_fields"]: {
	__typename: "vouches_avg_fields",
	id?: number,
	nominee_id?: number,
	voucher_id?: number
};
	/** order by avg() on columns of table "vouches" */
["vouches_avg_order_by"]: {
		id?: GraphQLTypes["order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	voucher_id?: GraphQLTypes["order_by"]
};
	/** Boolean expression to filter rows from the table "vouches". All fields are combined with a logical 'AND'. */
["vouches_bool_exp"]: {
		_and?: Array<GraphQLTypes["vouches_bool_exp"]>,
	_not?: GraphQLTypes["vouches_bool_exp"],
	_or?: Array<GraphQLTypes["vouches_bool_exp"]>,
	created_at?: GraphQLTypes["timestamp_comparison_exp"],
	id?: GraphQLTypes["bigint_comparison_exp"],
	nominee?: GraphQLTypes["nominees_bool_exp"],
	nominee_id?: GraphQLTypes["Int_comparison_exp"],
	updated_at?: GraphQLTypes["timestamp_comparison_exp"],
	voucher?: GraphQLTypes["users_bool_exp"],
	voucher_id?: GraphQLTypes["Int_comparison_exp"]
};
	/** unique or primary key constraints on table "vouches" */
["vouches_constraint"]: vouches_constraint;
	/** input type for incrementing numeric columns in table "vouches" */
["vouches_inc_input"]: {
		id?: GraphQLTypes["bigint"],
	nominee_id?: number,
	voucher_id?: number
};
	/** input type for inserting data into table "vouches" */
["vouches_insert_input"]: {
		created_at?: GraphQLTypes["timestamp"],
	id?: GraphQLTypes["bigint"],
	nominee?: GraphQLTypes["nominees_obj_rel_insert_input"],
	nominee_id?: number,
	updated_at?: GraphQLTypes["timestamp"],
	voucher?: GraphQLTypes["users_obj_rel_insert_input"],
	voucher_id?: number
};
	/** aggregate max on columns */
["vouches_max_fields"]: {
	__typename: "vouches_max_fields",
	created_at?: GraphQLTypes["timestamp"],
	id?: GraphQLTypes["bigint"],
	nominee_id?: number,
	updated_at?: GraphQLTypes["timestamp"],
	voucher_id?: number
};
	/** order by max() on columns of table "vouches" */
["vouches_max_order_by"]: {
		created_at?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"],
	voucher_id?: GraphQLTypes["order_by"]
};
	/** aggregate min on columns */
["vouches_min_fields"]: {
	__typename: "vouches_min_fields",
	created_at?: GraphQLTypes["timestamp"],
	id?: GraphQLTypes["bigint"],
	nominee_id?: number,
	updated_at?: GraphQLTypes["timestamp"],
	voucher_id?: number
};
	/** order by min() on columns of table "vouches" */
["vouches_min_order_by"]: {
		created_at?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"],
	voucher_id?: GraphQLTypes["order_by"]
};
	/** response of any mutation on the table "vouches" */
["vouches_mutation_response"]: {
	__typename: "vouches_mutation_response",
	/** number of rows affected by the mutation */
	affected_rows: number,
	/** data from the rows affected by the mutation */
	returning: Array<GraphQLTypes["vouches"]>
};
	/** on conflict condition type for table "vouches" */
["vouches_on_conflict"]: {
		constraint: GraphQLTypes["vouches_constraint"],
	update_columns: Array<GraphQLTypes["vouches_update_column"]>,
	where?: GraphQLTypes["vouches_bool_exp"]
};
	/** Ordering options when selecting data from "vouches". */
["vouches_order_by"]: {
		created_at?: GraphQLTypes["order_by"],
	id?: GraphQLTypes["order_by"],
	nominee?: GraphQLTypes["nominees_order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	updated_at?: GraphQLTypes["order_by"],
	voucher?: GraphQLTypes["users_order_by"],
	voucher_id?: GraphQLTypes["order_by"]
};
	/** primary key columns input for table: vouches */
["vouches_pk_columns_input"]: {
		id: GraphQLTypes["bigint"]
};
	/** select columns of table "vouches" */
["vouches_select_column"]: vouches_select_column;
	/** input type for updating data in table "vouches" */
["vouches_set_input"]: {
		created_at?: GraphQLTypes["timestamp"],
	id?: GraphQLTypes["bigint"],
	nominee_id?: number,
	updated_at?: GraphQLTypes["timestamp"],
	voucher_id?: number
};
	/** aggregate stddev on columns */
["vouches_stddev_fields"]: {
	__typename: "vouches_stddev_fields",
	id?: number,
	nominee_id?: number,
	voucher_id?: number
};
	/** order by stddev() on columns of table "vouches" */
["vouches_stddev_order_by"]: {
		id?: GraphQLTypes["order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	voucher_id?: GraphQLTypes["order_by"]
};
	/** aggregate stddev_pop on columns */
["vouches_stddev_pop_fields"]: {
	__typename: "vouches_stddev_pop_fields",
	id?: number,
	nominee_id?: number,
	voucher_id?: number
};
	/** order by stddev_pop() on columns of table "vouches" */
["vouches_stddev_pop_order_by"]: {
		id?: GraphQLTypes["order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	voucher_id?: GraphQLTypes["order_by"]
};
	/** aggregate stddev_samp on columns */
["vouches_stddev_samp_fields"]: {
	__typename: "vouches_stddev_samp_fields",
	id?: number,
	nominee_id?: number,
	voucher_id?: number
};
	/** order by stddev_samp() on columns of table "vouches" */
["vouches_stddev_samp_order_by"]: {
		id?: GraphQLTypes["order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	voucher_id?: GraphQLTypes["order_by"]
};
	/** aggregate sum on columns */
["vouches_sum_fields"]: {
	__typename: "vouches_sum_fields",
	id?: GraphQLTypes["bigint"],
	nominee_id?: number,
	voucher_id?: number
};
	/** order by sum() on columns of table "vouches" */
["vouches_sum_order_by"]: {
		id?: GraphQLTypes["order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	voucher_id?: GraphQLTypes["order_by"]
};
	/** update columns of table "vouches" */
["vouches_update_column"]: vouches_update_column;
	/** aggregate var_pop on columns */
["vouches_var_pop_fields"]: {
	__typename: "vouches_var_pop_fields",
	id?: number,
	nominee_id?: number,
	voucher_id?: number
};
	/** order by var_pop() on columns of table "vouches" */
["vouches_var_pop_order_by"]: {
		id?: GraphQLTypes["order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	voucher_id?: GraphQLTypes["order_by"]
};
	/** aggregate var_samp on columns */
["vouches_var_samp_fields"]: {
	__typename: "vouches_var_samp_fields",
	id?: number,
	nominee_id?: number,
	voucher_id?: number
};
	/** order by var_samp() on columns of table "vouches" */
["vouches_var_samp_order_by"]: {
		id?: GraphQLTypes["order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	voucher_id?: GraphQLTypes["order_by"]
};
	/** aggregate variance on columns */
["vouches_variance_fields"]: {
	__typename: "vouches_variance_fields",
	id?: number,
	nominee_id?: number,
	voucher_id?: number
};
	/** order by variance() on columns of table "vouches" */
["vouches_variance_order_by"]: {
		id?: GraphQLTypes["order_by"],
	nominee_id?: GraphQLTypes["order_by"],
	voucher_id?: GraphQLTypes["order_by"]
}
    }
/** unique or primary key constraints on table "circles" */
export const enum circles_constraint {
	circles_pkey = "circles_pkey"
}
/** select columns of table "circles" */
export const enum circles_select_column {
	alloc_text = "alloc_text",
	auto_opt_out = "auto_opt_out",
	created_at = "created_at",
	default_opt_in = "default_opt_in",
	discord_webhook = "discord_webhook",
	id = "id",
	is_verified = "is_verified",
	logo = "logo",
	min_vouches = "min_vouches",
	name = "name",
	nomination_days_limit = "nomination_days_limit",
	only_giver_vouch = "only_giver_vouch",
	protocol_id = "protocol_id",
	team_sel_text = "team_sel_text",
	team_selection = "team_selection",
	telegram_id = "telegram_id",
	token_name = "token_name",
	updated_at = "updated_at",
	vouching = "vouching",
	vouching_text = "vouching_text"
}
/** update columns of table "circles" */
export const enum circles_update_column {
	alloc_text = "alloc_text",
	auto_opt_out = "auto_opt_out",
	created_at = "created_at",
	default_opt_in = "default_opt_in",
	discord_webhook = "discord_webhook",
	id = "id",
	is_verified = "is_verified",
	logo = "logo",
	min_vouches = "min_vouches",
	name = "name",
	nomination_days_limit = "nomination_days_limit",
	only_giver_vouch = "only_giver_vouch",
	protocol_id = "protocol_id",
	team_sel_text = "team_sel_text",
	team_selection = "team_selection",
	telegram_id = "telegram_id",
	token_name = "token_name",
	updated_at = "updated_at",
	vouching = "vouching",
	vouching_text = "vouching_text"
}
/** unique or primary key constraints on table "epoches" */
export const enum epochs_constraint {
	epoches_pkey = "epoches_pkey"
}
/** select columns of table "epoches" */
export const enum epochs_select_column {
	circle_id = "circle_id",
	created_at = "created_at",
	days = "days",
	end_date = "end_date",
	ended = "ended",
	grant = "grant",
	id = "id",
	notified_before_end = "notified_before_end",
	notified_end = "notified_end",
	notified_start = "notified_start",
	number = "number",
	regift_days = "regift_days",
	repeat = "repeat",
	repeat_day_of_month = "repeat_day_of_month",
	start_date = "start_date",
	updated_at = "updated_at"
}
/** update columns of table "epoches" */
export const enum epochs_update_column {
	circle_id = "circle_id",
	created_at = "created_at",
	days = "days",
	end_date = "end_date",
	ended = "ended",
	grant = "grant",
	id = "id",
	notified_before_end = "notified_before_end",
	notified_end = "notified_end",
	notified_start = "notified_start",
	number = "number",
	regift_days = "regift_days",
	repeat = "repeat",
	repeat_day_of_month = "repeat_day_of_month",
	start_date = "start_date",
	updated_at = "updated_at"
}
/** unique or primary key constraints on table "nominees" */
export const enum nominees_constraint {
	nominees_pkey = "nominees_pkey"
}
/** select columns of table "nominees" */
export const enum nominees_select_column {
	address = "address",
	circle_id = "circle_id",
	created_at = "created_at",
	description = "description",
	ended = "ended",
	expiry_date = "expiry_date",
	id = "id",
	name = "name",
	nominated_by_user_id = "nominated_by_user_id",
	nominated_date = "nominated_date",
	updated_at = "updated_at",
	user_id = "user_id",
	vouches_required = "vouches_required"
}
/** update columns of table "nominees" */
export const enum nominees_update_column {
	address = "address",
	circle_id = "circle_id",
	created_at = "created_at",
	description = "description",
	ended = "ended",
	expiry_date = "expiry_date",
	id = "id",
	name = "name",
	nominated_by_user_id = "nominated_by_user_id",
	nominated_date = "nominated_date",
	updated_at = "updated_at",
	user_id = "user_id",
	vouches_required = "vouches_required"
}
/** column ordering options */
export const enum order_by {
	asc = "asc",
	asc_nulls_first = "asc_nulls_first",
	asc_nulls_last = "asc_nulls_last",
	desc = "desc",
	desc_nulls_first = "desc_nulls_first",
	desc_nulls_last = "desc_nulls_last"
}
/** unique or primary key constraints on table "protocols" */
export const enum organizations_constraint {
	protocols_pkey = "protocols_pkey"
}
/** select columns of table "protocols" */
export const enum organizations_select_column {
	created_at = "created_at",
	id = "id",
	is_verified = "is_verified",
	name = "name",
	telegram_id = "telegram_id",
	updated_at = "updated_at"
}
/** update columns of table "protocols" */
export const enum organizations_update_column {
	created_at = "created_at",
	id = "id",
	is_verified = "is_verified",
	name = "name",
	telegram_id = "telegram_id",
	updated_at = "updated_at"
}
/** unique or primary key constraints on table "profiles" */
export const enum profiles_constraint {
	profiles_address_key = "profiles_address_key",
	profiles_pkey = "profiles_pkey"
}
/** select columns of table "profiles" */
export const enum profiles_select_column {
	address = "address",
	admin_view = "admin_view",
	ann_power = "ann_power",
	avatar = "avatar",
	background = "background",
	bio = "bio",
	chat_id = "chat_id",
	created_at = "created_at",
	discord_username = "discord_username",
	github_username = "github_username",
	id = "id",
	medium_username = "medium_username",
	skills = "skills",
	telegram_username = "telegram_username",
	twitter_username = "twitter_username",
	updated_at = "updated_at",
	website = "website"
}
/** update columns of table "profiles" */
export const enum profiles_update_column {
	address = "address",
	admin_view = "admin_view",
	ann_power = "ann_power",
	avatar = "avatar",
	background = "background",
	bio = "bio",
	chat_id = "chat_id",
	created_at = "created_at",
	discord_username = "discord_username",
	github_username = "github_username",
	id = "id",
	medium_username = "medium_username",
	skills = "skills",
	telegram_username = "telegram_username",
	twitter_username = "twitter_username",
	updated_at = "updated_at",
	website = "website"
}
/** unique or primary key constraints on table "users" */
export const enum users_constraint {
	users_pkey = "users_pkey"
}
/** select columns of table "users" */
export const enum users_select_column {
	address = "address",
	bio = "bio",
	circle_id = "circle_id",
	created_at = "created_at",
	deleted_at = "deleted_at",
	epoch_first_visit = "epoch_first_visit",
	fixed_non_receiver = "fixed_non_receiver",
	give_token_received = "give_token_received",
	give_token_remaining = "give_token_remaining",
	id = "id",
	name = "name",
	non_giver = "non_giver",
	non_receiver = "non_receiver",
	role = "role",
	starting_tokens = "starting_tokens",
	updated_at = "updated_at"
}
/** update columns of table "users" */
export const enum users_update_column {
	address = "address",
	bio = "bio",
	circle_id = "circle_id",
	created_at = "created_at",
	deleted_at = "deleted_at",
	epoch_first_visit = "epoch_first_visit",
	fixed_non_receiver = "fixed_non_receiver",
	give_token_received = "give_token_received",
	give_token_remaining = "give_token_remaining",
	id = "id",
	name = "name",
	non_giver = "non_giver",
	non_receiver = "non_receiver",
	role = "role",
	starting_tokens = "starting_tokens",
	updated_at = "updated_at"
}
/** unique or primary key constraints on table "vouches" */
export const enum vouches_constraint {
	vouches_pkey = "vouches_pkey"
}
/** select columns of table "vouches" */
export const enum vouches_select_column {
	created_at = "created_at",
	id = "id",
	nominee_id = "nominee_id",
	updated_at = "updated_at",
	voucher_id = "voucher_id"
}
/** update columns of table "vouches" */
export const enum vouches_update_column {
	created_at = "created_at",
	id = "id",
	nominee_id = "nominee_id",
	updated_at = "updated_at",
	voucher_id = "voucher_id"
}
export class GraphQLError extends Error {
    constructor(public response: GraphQLResponse) {
      super("");
      console.error(response);
    }
    toString() {
      return "GraphQL Response Error";
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
type IsArray<T, U> = T extends Array<infer R> ? InputType<R, U>[] : InputType<T, U>;
type FlattenArray<T> = T extends Array<infer R> ? R : T;

type IsInterfaced<SRC extends DeepAnify<DST>, DST> = FlattenArray<SRC> extends ZEUS_INTERFACES | ZEUS_UNIONS
  ? {
      [P in keyof SRC]: SRC[P] extends '__union' & infer R
        ? P extends keyof DST
          ? IsArray<R, '__typename' extends keyof DST ? DST[P] & { __typename: true } : DST[P]>
          : {}
        : never;
    }[keyof DST] &
      {
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
      [P in keyof Pick<SRC, keyof DST>]: IsPayLoad<DST[P]> extends boolean ? SRC[P] : IsArray<SRC[P], DST[P]>;
    };

export type MapType<SRC, DST> = SRC extends DeepAnify<DST> ? IsInterfaced<SRC, DST> : never;
export type InputType<SRC, DST> = IsPayLoad<DST> extends { __alias: infer R }
  ? {
      [P in keyof R]: MapType<SRC, R[P]>;
    } &
      MapType<SRC, Omit<IsPayLoad<DST>, '__alias'>>
  : MapType<SRC, IsPayLoad<DST>>;
type Func<P extends any[], R> = (...args: P) => R;
type AnyFunc = Func<any, any>;
export type ArgsType<F extends AnyFunc> = F extends Func<infer P, any> ? P : never;
export type OperationOptions = {
  variables?: Record<string, any>;
  operationName?: string;
};
export type SubscriptionToGraphQL<Z, T> = {
  ws: WebSocket;
  on: (fn: (args: InputType<T, Z>) => void) => void;
  off: (fn: (e: { data?: InputType<T, Z>; code?: number; reason?: string; message?: string }) => void) => void;
  error: (fn: (e: { data?: InputType<T, Z>; errors?: string[] }) => void) => void;
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
  | [fetchOptions[0], fetchOptions[1] & {websocket?: websocketOptions}]
  | [fetchOptions[0]];
export type FetchFunction = (
  query: string,
  variables?: Record<string, any>,
) => Promise<any>;
export type SubscriptionFunction = (query: string) => any;
type NotUndefined<T> = T extends undefined ? never : T;
export type ResolverType<F> = NotUndefined<F extends [infer ARGS, any] ? ARGS : undefined>;



export const ZeusSelect = <T>() => ((t: any) => t) as SelectionFunction<T>;

export const ScalarResolver = (scalar: string, value: any) => {
  switch (scalar) {
    case 'String':
      return  `${JSON.stringify(value)}`;
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
    blockArrays
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
        throw new Error(`Cannot resolve ${type} ${name}${key ? ` ${key}` : ''}`)
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
          if(isArrayRequired){
            t = `${t}!`;
          }
        }else{
          if (isRequired) {
                t = `${t}!`;
          }
        }
        return `\$${value.split(`ZEUS_VAR$`)[1]}__ZEUS_VAR__${t}`;
    }
    if (isArray && !blockArrays) {
        return `[${value
        .map((v: any) => TypesPropsResolver({ value: v, type, name, key, blockArrays: true }))
        .join(',')}]`;
    }
    const reslovedScalar = ScalarResolver(typeResolved, value);
    if (!reslovedScalar) {
        const resolvedType = AllTypesProps[typeResolved];
        if (typeof resolvedType === 'object') {
        const argsKeys = Object.keys(resolvedType);
        return `{${argsKeys
            .filter((ak) => value[ak] !== undefined)
            .map(
            (ak) => `${ak}:${TypesPropsResolver({ value: value[ak], type: typeResolved, name: ak })}`
            )}}`;
        }
        return ScalarResolver(AllTypesProps[typeResolved], value) as string;
    }
    return reslovedScalar;
};


const isArrayFunction = (
  parent: string[],
  a: any[]
) => {
  const [values, r] = a;
  const [mainKey, key, ...keys] = parent;
  const keyValues = Object.keys(values).filter((k) => typeof values[k] !== 'undefined');

  if (!keys.length) {
      return keyValues.length > 0
        ? `(${keyValues
            .map(
              (v) =>
                `${v}:${TypesPropsResolver({
                  value: values[v],
                  type: mainKey,
                  name: key,
                  key: v
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
            (v) =>
              `${v}:${TypesPropsResolver({
                value: values[v],
                type: valueToResolve,
                name: typeResolverKey,
                key: v
              })}`
          )
          .join(',')})${r ? traverseToSeekArrays(parent, r) : ''}`
      : traverseToSeekArrays(parent, r);
  return argumentString;
};


const resolveKV = (k: string, v: boolean | string | { [x: string]: boolean | string }) =>
  typeof v === 'boolean' ? k : typeof v === 'object' ? `${k}{${objectToTree(v)}}` : `${k}${v}`;


const objectToTree = (o: { [x: string]: boolean | string }): string =>
  `{${Object.keys(o).map((k) => `${resolveKV(k, o[k])}`).join(' ')}}`;


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
        .filter((k) => typeof a[k] !== 'undefined')
        .forEach((k) => {
        if (k === '__alias') {
          Object.keys(a[k]).forEach((aliasKey) => {
            const aliasOperations = a[k][aliasKey];
            const aliasOperationName = Object.keys(aliasOperations)[0];
            const aliasOperation = aliasOperations[aliasOperationName];
            b[
              `${aliasOperationName}__alias__${aliasKey}: ${aliasOperationName}`
            ] = traverseToSeekArrays([...parent, aliasOperationName], aliasOperation);
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
  AllVariables.forEach((variable) => {
    while (filteredQuery.includes(variable)) {
      filteredQuery = filteredQuery.replace(variable, variable.split('__ZEUS_VAR__')[0]);
    }
  });
  return `(${AllVariables.map((a) => a.split('__ZEUS_VAR__'))
    .map(([variableName, variableType]) => `${variableName}:${variableType}`)
    .join(', ')})${filteredQuery}`;
};


export const queryConstruct = (t: 'query' | 'mutation' | 'subscription', tName: string, operationName?: string) => (o: Record<any, any>) =>
  `${t.toLowerCase()}${operationName ? ' ' + operationName : ''}${inspectVariables(buildQuery(tName, o))}`;
  

export const fullChainConstruct = (fn: FetchFunction) => (t: 'query' | 'mutation' | 'subscription', tName: string) => (
  o: Record<any, any>,
  options?: OperationOptions,
) => fn(queryConstruct(t, tName, options?.operationName)(o), options?.variables).then((r:any) => { 
  seekForAliases(r)
  return r
});


export const fullSubscriptionConstruct = (fn: SubscriptionFunction) => (
  t: 'query' | 'mutation' | 'subscription',
  tName: string,
) => (o: Record<any, any>, options?: OperationOptions) =>
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
    keys.forEach((k) => {
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
  Z extends keyof ValueTypes[T],
>(
  type: T,
  field: Z,
  fn: (
    args: Required<ValueTypes[T]>[Z] extends [infer Input, any] ? Input : any,
    source: any,
  ) => Z extends keyof ModelTypes[T] ? ModelTypes[T][Z] | Promise<ModelTypes[T][Z]> | X : any,
) => fn as (args?: any,source?: any) => any;


const handleFetchResponse = (
  response: Parameters<Extract<Parameters<ReturnType<typeof fetch>['then']>[0], Function>>[0]
): Promise<GraphQLResponse> => {
  if (!response.ok) {
    return new Promise((_, reject) => {
      response.text().then(text => {
        try { reject(JSON.parse(text)); }
        catch (err) { reject(text); }
      }).catch(reject);
    });
  }
  return response.json();
};

export const apiFetch = (options: fetchOptions) => (query: string, variables: Record<string, any> = {}) => {
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
        'Content-Type': 'application/json'
      },
      ...fetchOptions
    })
      .then(handleFetchResponse)
      .then((response: GraphQLResponse) => {
        if (response.errors) {
          throw new GraphQLError(response);
        }
        return response.data;
      });
  };
  

export const apiSubscription = (options: chainOptions) => (
    query: string,
  ) => {
    try {
      const queryString = options[0] + '?query=' + encodeURIComponent(query);
      const wsString = queryString.replace('http', 'ws');
      const host = (options.length > 1 && options[1]?.websocket?.[0]) || wsString;
      const webSocketOptions = options[1]?.websocket || [host];
      const ws = new WebSocket(...webSocketOptions);
      return {
        ws,
        on: (e: (args: any) => void) => {
          ws.onmessage = (event:any) => {
            if(event.data){
              const parsed = JSON.parse(event.data)
              const data = parsed.data
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
    "query": "query_root",
    "mutation": "mutation_root",
    "subscription": "subscription_root"
}

export type GenericOperation<O> = O extends 'query'
  ? "query_root"
  : O extends 'mutation'
  ? "mutation_root"
  : "subscription_root"

export const Thunder = (fn: FetchFunction) => <
  O extends 'query' | 'mutation' | 'subscription',
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
) => <Z extends ValueTypes[R]>(o: Z | ValueTypes[R], ops?: OperationOptions) =>
  fullChainConstruct(fn)(operation, allOperations[operation])(o as any, ops) as Promise<InputType<GraphQLTypes[R], Z>>;

export const Chain = (...options: chainOptions) => Thunder(apiFetch(options));  
  
export const SubscriptionThunder = (fn: SubscriptionFunction) => <
  O extends 'query' | 'mutation' | 'subscription',
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
) => <Z extends ValueTypes[R]>(
  o: Z | ValueTypes[R],
  ops?: OperationOptions
)=>
  fullSubscriptionConstruct(fn)(operation, allOperations[operation])(
    o as any,
    ops,
  ) as SubscriptionToGraphQL<Z, GraphQLTypes[R]>;

export const Subscription = (...options: chainOptions) => SubscriptionThunder(apiSubscription(options));
export const Zeus = <
  Z extends ValueTypes[R],
  O extends 'query' | 'mutation' | 'subscription',
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
  o: Z | ValueTypes[R],
  operationName?: string,
) => queryConstruct(operation, allOperations[operation], operationName)(o as any);
export const Selector = <T extends keyof ValueTypes>(key: T) => ZeusSelect<ValueTypes[T]>();
  

export const Gql = Chain('http://localhost:8080/v1/graphql')