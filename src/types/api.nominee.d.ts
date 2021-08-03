import { Moment } from 'moment';

import { IApiUser, IUser } from './api.user.profile';

export interface IApiNominee {
  id: number;
  name: string;
  address: string;
  nominated_by_user_id: number;
  nominator: IApiUser;
  circle_id: number;
  description: string;
  vouches_required: number;
  user_id?: string;
  ended?: number; // Came back optional from the nominate endpoint
  nominated_date: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
  nominations: IApiUser[];
}

export interface INominee extends IApiNominee {
  ended: boolean;
  nominations: IUser[];
  expiryDate: Moment;
  nominatedDate: Moment;
}
