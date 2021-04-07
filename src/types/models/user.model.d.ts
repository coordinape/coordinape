import { ITokenGift } from './tokengift.model';

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
  role: number;
  circle_id: number;
  created_at: Date;
  updated_at: Date;
  teammates: IUser[];
  pending_sent_gifts: ITokenGift[];
  sent_gifts: ITokenGift[];
}
