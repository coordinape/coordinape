import { Suspense } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';

import { LoadingModal, EditProfileModal, WalletAuthModal } from 'components';
import {
  rGlobalLoading,
  rGlobalLoadingText,
  rEditProfileOpen,
  rWalletModalOpen,
} from 'recoilState/ui';

export const GlobalUi = () => {
  return (
    <>
      <GlobalLoadingModal />
      <GlobalEditProfileModal />
      <GlobalWalletAuthModal />
    </>
  );
};

const GlobalLoadingModal = () => {
  const globalLoading = useRecoilValue(rGlobalLoading);
  const globalLoadingText = useRecoilValue(rGlobalLoadingText);

  return <LoadingModal text={globalLoadingText} visible={globalLoading > 0} />;
};

const GlobalEditProfileModal = () => {
  const [editProfileOpen, setEditProfileOpen] =
    useRecoilState(rEditProfileOpen);
  return (
    <Suspense fallback={<></>}>
      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
    </Suspense>
  );
};

const GlobalWalletAuthModal = () => {
  const [walletModalOpen, setWalletModalOpen] =
    useRecoilState(rWalletModalOpen);

  return (
    <WalletAuthModal open={walletModalOpen} setOpen={setWalletModalOpen} />
  );
};
