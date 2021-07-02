import { Web3Provider } from '@ethersproject/providers';
import {
  atom,
  selector,
  DefaultValue,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';

import { APIService } from 'services/api';
import { ConnectorNames } from 'utils/enums';
import storage from 'utils/storage';

import { IRecoilGetParams } from 'types';

export const rMyAddress = atom<string | undefined>({
  key: 'rMyAddress',
  default: storage.getAddress(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newAddress) => {
        if (newAddress === undefined) {
          storage.clearAddress();
        } else {
          storage.setAddress(newAddress as string);
        }
      });
    },
  ],
});
export const useValMyAddress = () => useRecoilValue(rMyAddress);
export const useStateMyAddress = () => useRecoilState(rMyAddress);
export const useSetMyAddress = () => useSetRecoilState(rMyAddress);

export const rConnectorName = atom<ConnectorNames | undefined>({
  key: 'rConnectorName',
  default: storage.getConnectorName(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newId) => {
        if (newId === undefined || newId instanceof DefaultValue) {
          storage.clearConnectorName();
        } else {
          storage.setConnectorName(newId);
        }
      });
    },
  ],
});
export const useValConnectorName = () => useRecoilValue(rConnectorName);
export const useStateConnectorName = () => useRecoilState(rConnectorName);
export const useSetConnectorName = () => useSetRecoilState(rConnectorName);
