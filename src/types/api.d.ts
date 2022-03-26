export interface PostProfileParam {
  bio?: string;
  skills?: string[];
  twitter_username?: string;
  github_username?: string;
  telegram_username?: string;
  discord_username?: string;
  medium_username?: string;
  website?: string;
}

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
}

export interface UpdateUsersParam {
  name: string;
  address: string;
  non_giver?: boolean;
  fixed_non_receiver?: boolean;
  non_receiver?: boolean;
  role?: number;
  starting_tokens?: number;
}

export interface PutUsersParam {
  name?: string;
  bio?: string;
  epoch_first_visit?: boolean;
  non_receiver?: boolean;
  non_giver?: boolean;
}

export interface PostCirclesParam {
  name: string;
}

export interface PutCirclesParam {
  name: string;
  vouching: boolean;
  token_name: string;
  min_vouches: number;
  team_sel_text?: string;
  nomination_days_limit: number;
  alloc_text?: string;
  discord_webhook?: string;
  update_webhook: number;
  default_opt_in: boolean;
  vouching_text?: string;
  only_giver_vouch: boolean;
  team_selection: boolean;
  auto_opt_out: boolean;
}

export interface CreateCircleParam {
  user_name: string;
  circle_name: string;
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
