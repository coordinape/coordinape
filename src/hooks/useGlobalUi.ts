import { useSetRecoilState } from 'recoil';

import { rWalletModalOpen, rCircleSelectorOpen } from 'recoilState';

export const useGlobalUi = (): {
  openWalletModal: () => void;
  openCircleSelector: () => void;
} => {
  const setWalletModalOpen = useSetRecoilState(rWalletModalOpen);
  const setCircleSelectorOpen = useSetRecoilState(rCircleSelectorOpen);

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
