export interface IUserPendingGift {
  id: number;
  name: string;
  address: string;
  give_token_received: number;
  give_token_remaining: number;
  role: number;
  circle_id: number;
  created_at: Date;
  updated_at: Date;
  pending_sent_gifts: ITokenGift[];
}
