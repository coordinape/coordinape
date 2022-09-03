/**
 *
 * DEPRECATED -- these are all one-off types so they should be co-located with
 * the code that uses them.
 *
 */

export interface PostTokenGiftsParam {
  tokens: number;
  recipient_id: number;
  note?: string;
}

export interface PostUsersParam {
  name: string;
  address: string;
  non_giver?: boolean;
  fixed_non_receiver?: boolean;
  non_receiver?: boolean;
  role?: number;
  starting_tokens?: number;
  fixed_payment_amount?: number;
}

export interface UpdateUsersParam {
  name: string;
  address: string;
  non_giver?: boolean;
  fixed_non_receiver?: boolean;
  non_receiver?: boolean;
  role?: number;
  starting_tokens?: number;
  fixed_payment_amount?: number;
}

export interface PutUsersParam {
  name?: string;
  bio?: string;
  epoch_first_visit?: boolean;
  non_receiver?: boolean;
  non_giver?: boolean;
}

export interface CreateCircleParam {
  user_name: string;
  circle_name: string;
  image_data_base64?: string;
  protocol_name?: string;
  protocol_id?: number;
  contact: string;
}

export interface UpdateCreateEpochParam {
  start_date: string; // 2021-07-09T00:00:00.000000Z
  repeat: number; // (0 = no repeat, 1 = weekly, 2 = monthly)
  days: number; // (minimum 1 - 100 maximum)
  grant?: number; // decimal
}

export interface NominateUserParam {
  name: string;
  address: string;
  description: string;
}
