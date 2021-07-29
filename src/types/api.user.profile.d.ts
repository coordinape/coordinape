import { ITokenGift } from './api.gift';
import { ICircle } from './api.circle';

export interface IProfile {
  id: number;
  address: string;
  avatar: string;
  background?: string;
  bio?: string;
  discord_username?: string;
  github_username?: string;
  medium_username?: string;
  telegram_username?: string;
  twitter_username?: string;
  website?: string;
  skills?: string[];
  users: IUser[];
  created_at: Date;
  updated_at: Date;
}

export interface IUser {
  id: number;
  name: string;
  avatar: string;
  bio: string;
  address: string;
  give_token_received: number;
  give_token_remaining: number;
  epoch_first_visit: number;
  non_receiver: number;
  non_giver: number;
  fixed_non_receiver: number;
  regift_percent: number;
  starting_tokens: number;
  role: number;
  is_hidden: number;
  admin_view: number;
  super: number; // Can blast announcements with bot
  circle_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  teammates?: IUser[];
  pending_sent_gifts?: ITokenGift[];
  sent_gifts: ITokenGift[];
  circle?: ICircle;
  profile?: IProfile;
}
