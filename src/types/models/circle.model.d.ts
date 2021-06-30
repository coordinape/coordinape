import { IProtocol } from './protocol.model';
import { IEpoch } from './epoch.model';

export interface ICircle {
  id: number;
  name: string;
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
