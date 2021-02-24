export interface ITokenGift {
  id: number;
  circle_id: number;
  sender_id: number;
  sender_address: string;
  recipient_id: number;
  recipient_address: string;
  tokens: number;
  note: string;
  dts_created: Date;
  created_at: Date;
  updated_at: Date;
}
