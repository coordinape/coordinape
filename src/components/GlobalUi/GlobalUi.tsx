import { Suspense } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';

import { LoadingModal, EditProfileModal } from 'components';
import {
  rGlobalLoading,
  rGlobalLoadingText,
  rEditProfileOpen,
} from 'recoilState/ui';

export const GlobalUi = () => {
  return (
    <>
      <GlobalLoadingModal />
      <GlobalEditProfileModal />
    </>
  );
};

const GlobalLoadingModal = () => {
  const globalLoading = useRecoilValue(rGlobalLoading);
  const globalLoadingText = useRecoilValue(rGlobalLoadingText);

  return (
    <LoadingModal
      text={globalLoadingText}
      visible={globalLoading > 0}
      note="global"
    />
  );
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
