import { useSetRecoilState } from 'recoil';

import { rWalletModalOpen, rCircleSelectorOpen } from 'recoilState';

export const useGlobalUi = (): {
  openWalletModal: () => void;
  openCircleSelector: () => void;
} => {
  const setWalletModalOpen = useSetRecoilState(rWalletModalOpen);
  const setCircleSelectorOpen = useSetRecoilState(rCircleSelectorOpen);

  // const onDisconnect = () => {
  //   rawWeb3Context.deactivate();
  //   localStorage.removeItem(STORAGE_KEY_CONNECTOR);
  // };

  const openWalletModal = () => {
    setWalletModalOpen(true);
  };

  const openCircleSelector = () => {
    setCircleSelectorOpen(true);
  };

  return {
    openWalletModal,
    openCircleSelector,
  };
};
