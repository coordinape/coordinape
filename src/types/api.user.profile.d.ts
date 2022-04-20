import { ITokenGift } from './api.gift';
import { IApiCircle, ICircle } from './api.circle';

export interface IApiProfile {
  id: number;
  address: string;
  admin_view: boolean;
  avatar?: string;
  background?: string;
  bio?: string;
  discord_username?: string;
  github_username?: string;
  medium_username?: string;
  telegram_username?: string;
  twitter_username?: string;
  website?: string;
  skills?: string[];
  created_at?: string;
  updated_at?: string;
  // Specific
  users?: IApiUser[];
}

export interface IApiUser {
  id: number;
  circle_id: number;
  address: string;
  name: string;
  // User Circle settings
  non_giver: boolean;
  fixed_non_receiver: boolean;
  starting_tokens: number;
  // User Epoch specific fields - These could be in their own table
  bio?: string;
  non_receiver: boolean; // Opt out
  give_token_received: number;
  give_token_remaining: number;
  epoch_first_visit: boolean;
  // DB fields
  created_at?: string; // 2021-07-07T23:29:18.000000Z
  updated_at?: string; // 2021-07-07T23:29:18.000000Z
  deleted_at?: string; // 2021-07-07T23:29:18.000000Z
  // Permissions
  role: number; // 1 is an admin,
  //
  profile?: Omit<IApiProfile, 'users'>;
  teammates?: IApiUser[];
}

export interface IUser extends IApiUser {
  circle?: ICircle;
  isCircleAdmin: boolean;
  isCoordinapeUser: boolean;
  teammates: IUser[];
}

export interface IMyUser extends IUser {
  circle: ICircle;
  teammates: IUser[];
}

export interface IProfile extends IApiProfile {
  hasAdminView: boolean;
  users: IUser[];
}

export interface IMyProfile extends IProfile {
  myUsers: IMyUser[];
}

export interface AggregateCount {
  aggregate?: {
    count?: number;
  };
}

export interface IAllocateUser {
  id: number;
  address: string;
  circle_id: number;
  name: string;
  starting_tokens: number;
  received_gifts: Array<{ tokens: number }>;
  received_gifts_aggregate: AggregateCount;
}
