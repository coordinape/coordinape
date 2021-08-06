import { IUser } from './api.user.profile';
import { ITokenGift } from './api.gift';

interface IMapNode {
  id: string;
  img: string;
  name: string;
  epochIds: number[];
  userId: number;
}

interface IMapNodeFG extends IMapNode {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

interface IMapEdge {
  id: number;
  source: string;
  target: string;
  epochNumber: number;
  epochId: number;
  tokens: number;
}
type MetricEnum = 'give' | 'gave' | 'in_degree' | 'out_degree' | 'standardized';
type TDirection = 'receives' | 'gives' | 'both';
type TScaler = (v: number) => number;

interface IMapEdgeFG {
  id: number;
  source: IMapNodeFG;
  target: IMapNodeFG;
  epochNumber: number;
  epochId: number;
  tokens: number;
}

interface IMapContext {
  egoAddress: string;
  bag: Set<string>;
  epochId: number;
  measures: { min: number; max: number; count: number };
  isBagNeighbor: (node: IMapNodeFG, direction: TDirection = 'both') => boolean;
  isEgoNeighbor: (node: IMapNodeFG, direction: TDirection = 'both') => boolean;
  isEgoEdge: (edge: IMapEdgeFG, direction: TDirection = 'both') => boolean;
  isBagEdge: (edge: IMapEdgeFG, direction: TDirection = 'both') => boolean;
  isBetweenBagEdge: (edge: IMapEdgeFG) => boolean;
  getEdgeMeasure: (edge: IMapEdgeFG, scaler?: TScaler) => number;
  getNodeMeasure: (node: IMapNodeFG, scaler?: TScaler) => number;
  getCurvature: (edge: IMapEdgeFG) => number;
}
