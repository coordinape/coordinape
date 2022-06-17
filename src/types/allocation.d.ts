import { IApiProfile } from './api.user.profile';
import { ICircle } from './api.circle';

export interface ISimpleGiftUser {
  id: number;
  non_receiver: boolean;
  fixed_non_receiver: boolean;
  bio?: string;
  created_at: string;
  name: string;
  profile?: Omit<IApiProfile, 'users'>;
  role: number;
  address: string;
}

export interface ISimpleGift {
  user: ISimpleGiftUser;
  tokens: number;
  note?: string;
}

export interface IAllocationStep {
  key: number;
  buildLabel: (circle: ICircle) => string;
  pathFn: (circleId: number) => string;
}
