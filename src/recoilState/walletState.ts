import {
  atom,
  useRecoilValue,
  useRecoilState,
  useSetRecoilState,
} from 'recoil';

import { ConnectorNames } from 'utils/enums';
import storage from 'utils/storage';

export const rMyAddress = atom<string | undefined>({
  key: 'rMyAddress',
  default: storage.getConnectorName() ? storage.getAddress() : undefined,
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
export const useMyAddress = () => useRecoilValue(rMyAddress);
export const useStateMyAddress = () => useRecoilState(rMyAddress);
export const useSetMyAddress = () => useSetRecoilState(rMyAddress);

export const rConnectorName = atom<ConnectorNames | undefined>({
  key: 'rConnectorName',
  default: storage.getAddress() ? storage.getConnectorName() : undefined,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newId) => {
        if (newId === undefined) {
          storage.clearConnectorName();
        } else {
          storage.setConnectorName(newId);
        }
      });
    },
  ],
});
export const useConnectorName = () => useRecoilValue(rConnectorName);
export const useStateConnectorName = () => useRecoilState(rConnectorName);
export const useSetConnectorName = () => useSetRecoilState(rConnectorName);
