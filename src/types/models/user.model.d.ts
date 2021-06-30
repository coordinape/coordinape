import { ITokenGift } from './tokengift.model';
import { ICircle } from './circle.model';

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
  circle_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  teammates: IUser[];
  pending_sent_gifts: ITokenGift[];
  sent_gifts: ITokenGift[];
  circle?: ICircle;
}
