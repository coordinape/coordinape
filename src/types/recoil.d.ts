import { RecoilValue } from 'recoil';

export type IRecoilGet = <T>(recoilState: RecoilValue<T>) => T;

export interface IRecoilGetParams {
  get: IRecoilGet;
}
