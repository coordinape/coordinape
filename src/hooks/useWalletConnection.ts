import { useRecoilState } from 'recoil';

import { rWalletModalOpen } from 'recoilState';

export const useWalletConnection = (): { openWalletModal: () => void } => {
  const [walletModalOpen, setWalletModalOpen] = useRecoilState(
    rWalletModalOpen
  );

  // const onDisconnect = () => {
  //   rawWeb3Context.deactivate();
  //   localStorage.removeItem(STORAGE_KEY_CONNECTOR);
  // };

  const openWalletModal = () => {
    setWalletModalOpen(true);
  };

  return {
    openWalletModal,
  };
};
