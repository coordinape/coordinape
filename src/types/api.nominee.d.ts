import { DateTime } from 'luxon';

import { IApiUser, IUser } from './api.user.profile';

export interface IApiNominee {
  id: number;
  name: string;
  address: string;
  nominated_by_user_id: number;
  circle_id: number;
  description: string;
  vouches_required: number;
  user_id?: string;
  ended?: boolean; // Came back optional from the nominate endpoint
  nominated_date: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  nominations?: IApiUser[];
}

export interface INominee extends IApiNominee {
  ended: boolean;
  expired: boolean;
  nominations: IUser[];
  expiryDate: DateTime;
  nominatedDate: DateTime;
  vouchesNeeded: number;
  nominator: IUser;
}
