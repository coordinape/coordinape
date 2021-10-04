import { ITokenGift } from './api.gift';
import { IApiCircle } from './api.circle';

export interface IApiProfile {
  id: number;
  address: string;
  admin_view: number;
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
  users: IApiUser[];
  created_at: string;
  updated_at: string;
}

export interface IProfileEmbed extends Omit<IApiProfile, 'users'> {}

export interface IApiUser {
  id: number;
  circle_id: number;
  address: string;
  name: string; // deprecate this and move to profile?
  // User Circle settings
  non_giver: number;
  fixed_non_receiver: number;
  starting_tokens: number;
  // User Epoch specific fields - These could be in their own table
  bio: string;
  non_receiver: number; // Opt out
  regift_percent: number; // Deprecate this?
  give_token_received: number;
  give_token_remaining: number;
  epoch_first_visit: number;
  // DB fields
  created_at: string; // 2021-07-07T23:29:18.000000Z
  updated_at: string; // 2021-07-07T23:29:18.000000Z
  deleted_at?: string; // 2021-07-07T23:29:18.000000Z
  // Permissions
  role: number; // 1 is an admin,
}

export interface IApiUserProfile extends IApiUser {
  profile: IProfileEmbed;
}

export interface IApiUserInProfile extends IApiUser {
  circle: IApiCircle;
  teammates: IApiUser[];
}

export interface IApiFilledProfile extends IApiProfile {
  users?: IApiUserInProfile[];
}

// This is created on the front end
export interface IMyUsers extends IApiUserProfile {
  circle: IApiCircle;
  teammates: IApiUser[];
}

// These are just wrappers, nothing extended currently:
export interface IUser extends IApiUserProfile {}
export interface IProfile extends IApiProfile {}

export interface IFilledProfile extends IApiProfile {
  users: IUser[];
}
