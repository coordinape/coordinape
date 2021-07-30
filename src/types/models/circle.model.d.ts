import { IProtocol } from './protocol.model';
import { IEpoch } from './epoch.model';

export interface ICircle {
  id: number;
  name: string;
  logo: string;
  vouching: number;
  min_vouches: number;
  nomination_days_limit: number;
  vouching_text: string;
  alloc_text: string;
  team_sel_text: string;
  token_name: string;
  created_at: Date;
  updated_at: Date;
  protocol_id: number;
  protocol: IProtocol;
  // Derived data
  pastEpochs: IEpoch[];
  futureEpochs: IEpoch[];
  currentEpoch: IEpoch;
}
