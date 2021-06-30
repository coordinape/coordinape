export interface PostProfileParam {
  skills?: string;
  github_username?: string;
  telegram_username?: string;
  discord_username?: string;
  medium_username?: string;
  website?: string;
}

export interface PostTokenGiftsParam {
  tokens: number;
  recipient_id: number;
  circle_id: number;
  note?: string;
}

export interface PostUsersParam {
  name: string;
  address: string;
  non_giver?: number;
  fixed_non_receiver?: number;
  role?: number;
  starting_tokens?: number;
}

export interface UpdateUsersParam {
  name: string;
  address: string;
  non_giver?: number;
  fixed_non_receiver?: number;
  role?: number;
  starting_tokens?: number;
}

export interface PutUsersParam {
  name?: string;
  bio?: string;
  epoch_first_visit?: number;
  non_receiver?: number;
  non_giver?: number;
}

export interface PostCirclesParam {
  name: string;
}

export interface PutCirclesParam {
  name: string;
  token_name: string;
  team_sel_text?: string;
  alloc_text?: string;
}
