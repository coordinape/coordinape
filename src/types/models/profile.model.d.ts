import { IUser } from './user.model';

export interface IProfile {
  id: number;
  address: string;
  background: string;
  bio: string;
  discord_username: string;
  github_username: string;
  medium_username: string;
  telegram_username: string;
  twitter_username: string;
  website: string;
  skills: string;
  users: IUser[];
  created_at: Date;
  updated_at: Date;
}
