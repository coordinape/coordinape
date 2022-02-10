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
  date: any;
  timestamptz: any;
};

export type Create_Nominee_Input = {
  name: Scalars['String'];
  address: Scalars['String'];
  description: Scalars['String'];
  circle_id: Scalars['Int'];
};

export type Create_Nominee_Response = {
  __typename?: 'create_nominee_response';
  id: Scalars['Int'];
  name: Scalars['String'];
  address?: Maybe<Scalars['String']>;
  nominated_by_user_id?: Maybe<Scalars['Int']>;
  circle_id?: Maybe<Scalars['Int']>;
  description: Scalars['String'];
  nominated_date?: Maybe<Scalars['date']>;
  expiry_date?: Maybe<Scalars['date']>;
  vouches_required?: Maybe<Scalars['Int']>;
  user_id?: Maybe<Scalars['Int']>;
  ended?: Maybe<Scalars['Boolean']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  create_nominee?: Maybe<Create_Nominee_Response>;
};

export type MutationCreate_NomineeArgs = {
  object: Create_Nominee_Input;
};
