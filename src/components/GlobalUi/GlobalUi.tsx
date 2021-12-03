import { Suspense } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';

import {
  CircleSelectModal,
  LoadingModal,
  EditProfileModal,
  WalletAuthModal,
} from 'components';
import {
  rGlobalLoading,
  rGlobalLoadingText,
  rCircleSelectorOpen,
  rEditProfileOpen,
  rWalletModalOpen,
} from 'recoilState/ui';

export const GlobalUi = () => {
  return (
    <>
      <GlobalLoadingModal />
      <GlobalEditProfileModal />
      <GlobalCircleSelectModal />
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

const GlobalCircleSelectModal = () => {
  const [circleSelectorOpen, setCircleSelectorOpen] =
    useRecoilState(rCircleSelectorOpen);
  return (
    <Suspense fallback={<></>}>
      <CircleSelectModal
        onClose={() => setCircleSelectorOpen(false)}
        visible={circleSelectorOpen}
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
