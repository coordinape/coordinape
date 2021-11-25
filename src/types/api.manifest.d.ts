import { IApiUserProfile, IApiMyUser, IMyProfile } from './api.user.profile';
import { IApiCircle, ICircle } from './api.circle';
import { IApiEpoch, IEpoch } from './api.epoch';
import {
  IApiNominee,
  IApiProfile,
  IApiTokenGift,
  IApiUser,
  IUser,
  INominee,
  ITokenGift,
} from 'types';

export interface IApiLogin {
  token: string;
}

export interface IApiFullCircle {
  circle: IApiCircle;
  epochs: IApiEpoch[];
  nominees: IApiNominee[];
  pending_gifts: IApiTokenGift[];
  token_gifts: IApiTokenGift[];
  users: IApiUser[];
}

export interface IApiManifest {
  profile: IApiProfile;
  myUsers: IApiUser[]; // myUsers
  circles: IApiCircle[];
  active_epochs: IApiEpoch[];
  circle?: IApiFullCircle; // TODO: What happens if they don't have a circle?
}

export interface IManifest {
  myProfile: IMyProfile;
  circles: ICircle[];
  epochs: IEpoch[];
}

export interface IFullCircle {
  usersMap: Map<number, IUser>;
  pendingGiftsMap: Map<number, ITokenGift>;
  pastGiftsMap: Map<number, ITokenGift>;
  giftsMap: Map<number, ITokenGift>;
  epochsMap: Map<number, IEpoch>;
  nomineesMap: Map<number, INominee>;
}
