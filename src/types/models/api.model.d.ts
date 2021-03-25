export interface PostTokenGiftsParam {
  tokens: number;
  recipient_address: string;
  circle_id: number;
  note?: string;
}

export interface PostUsersParam {
  name: string;
  address: string;
  circle_id: number;
}

export interface PutUsersParam {
  name: string;
  bio: string;
  non_receiver: number;
  address: string;
  circle_id: number;
}

export interface PostCirclesParam {
  name: string;
}

export interface PutCirclesParam {
  name: string;
}
