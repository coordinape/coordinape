import iti from 'itiriri';
import moment from 'moment';
import { atom, selector, useRecoilValue } from 'recoil';

import { createExtendedNominee } from 'utils/modelExtenders';

import { rUsersMap } from './appState';

import { IRecoilGetParams, INominee, IApiNominee } from 'types';

export const rNomineesRaw = atom<Map<number, IApiNominee>>({
  key: 'rNomineesRaw',
  default: new Map(),
});

export const rNomineesMap = selector<Map<number, INominee>>({
  key: 'rNomineesMap',
  get: ({ get }: IRecoilGetParams) => {
    const userMap = get(rUsersMap);
    return iti(get(rNomineesRaw).values())
      .map((n) => createExtendedNominee(n, userMap))
      .toMap((g) => g.id);
  },
});

export const rNominees = selector<INominee[]>({
  key: 'rNominees',
  get: ({ get }: IRecoilGetParams) =>
    iti(get(rNomineesMap).values())
      .sort(({ expiryDate: a }, { expiryDate: b }) => a.diff(b))
      .toArray(),
});
export const useNominees = () => useRecoilValue(rNominees);

export const rActiveNominees = selector<INominee[]>({
  key: 'rActiveNominees',
  get: ({ get }: IRecoilGetParams) =>
    iti(get(rNominees))
      .filter(
        (n) =>
          !n.ended &&
          moment(moment.now()).diff(n.expiryDate) < 0 &&
          n.vouchesNeeded > 0
      )
      .toArray(),
});
export const useActiveNominees = () => useRecoilValue(rActiveNominees);
