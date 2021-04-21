import { IProtocol } from './protocol.model';

export interface ICircle {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
  protocol_id: number;
  protocol: IProtocol;
}
