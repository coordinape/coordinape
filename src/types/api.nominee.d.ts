import { IUser } from './user.model';

export interface INominee {
  id: number;
  name: string;
  address: string;
  nominated_by_user_id: number;
  circle_id: number;
  description: string;
  nominated_date: Date;
  expiry_date: Date;
  vouches_required: number;
  user_id: string;
  ended: string;
  created_at: Date;
  updated_at: Date;
  nominations: IUser[];
}
