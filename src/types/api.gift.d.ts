import { IUser } from './api.user';

export interface IApiTokenGift {
  id: number;
  circle_id: number;
  epoch_id: number;
  sender_id: number;
  sender_address: string;
  recipient_id: number;
  recipient_address: string;
  tokens: number;
  note: string;
  dts_created: string;
  created_at: string;
  updated_at: string;
}

export interface ITokenGift extends IApiTokenGift {
  // Calculated
  sender?: IUser;
  recipient?: IUser;
}
