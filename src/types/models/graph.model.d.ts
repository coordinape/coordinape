import { IUser } from './user.model';

interface IGraphLink {
  source: number;
  target: number;
  width: number;
  curvature: number;
  tokens: number;
}

interface IGraphNode extends IUser {
  receiverLinks: IGraphLink[];
  giverLinks: IGraphLink[];
  givers: IUserNode[];
  receivers: IUserNode[];
  tokensReceived: number;
  linkCount: number;
}

interface IEpochOption {
  label: string;
  value: number;
}
