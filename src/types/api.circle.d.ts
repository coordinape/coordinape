import { IEpoch } from './api.epoch';

export interface IProtocol {
  id: number;
  name: string;
  is_verified?: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IApiCircle {
  id: number;
  name: string;
  logo?: string;
  default_opt_in: boolean;
  is_verified: boolean;
  alloc_text?: string;
  team_sel_text?: string;
  token_name?: string;
  vouching: boolean;
  min_vouches: number;
  nomination_days_limit: number;
  vouching_text?: string;
  only_giver_vouch: boolean;
  team_selection: boolean;
  created_at: Date;
  updated_at: Date;
  protocol_id: number;
  protocol: IProtocol;
  auto_opt_out: boolean;
}

export interface ICircle extends IApiCircle {
  tokenName: string;
  teamSelText: string;
  allocText: string;
  vouchingText: string;
  hasVouching: boolean;
}
