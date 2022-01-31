export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Create_Circle_Input = {
  user_name: Scalars['String'];
  address: Scalars['String'];
  circle_name: Scalars['String'];
  protocol_name?: Maybe<Scalars['String']>;
  protocol_id?: Maybe<Scalars['Int']>;
};

export type Create_Circle_Response = {
  __typename?: 'create_circle_response';
  id: Scalars['Int'];
  name: Scalars['String'];
  protocol_id: Scalars['Int'];
  team_sel_text?: Maybe<Scalars['String']>;
  alloc_text?: Maybe<Scalars['String']>;
  vouching: Scalars['Boolean'];
  min_vouches: Scalars['Int'];
  nomination_days_limit: Scalars['Int'];
  vouching_text?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  default_opt_in: Scalars['Boolean'];
  team_selection: Scalars['Boolean'];
  only_giver_vouch: Scalars['Boolean'];
  auto_opt_out: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  create_circle?: Maybe<Create_Circle_Response>;
};

export type MutationCreate_CircleArgs = {
  object: Create_Circle_Input;
};
