import { IApiUserProfile, IApiMyUser, IMyProfile } from './api.user.profile';
import { IApiCircle, ICircle } from './api.circle';
import { IApiEpoch, IEpoch } from './api.epoch';
import { IApiProfile, IApiTokenGift, IApiUser, IUser, ITokenGift } from 'types';

export interface IApiFullCircle {
  circle: IApiCircle;
  epochs: IApiEpoch[];
  pending_gifts: IApiTokenGift[];
  token_gifts: IApiTokenGift[];
  users: IApiUser[];
}

export interface IApiManifest {
  profile: IApiProfile;
  myUsers: IApiUser[]; // myUsers
  circles: IApiCircle[];
  active_epochs: IApiEpoch[];
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
}
