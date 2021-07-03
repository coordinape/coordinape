import React, { useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useRecoilState, useRecoilValue } from 'recoil';
// import RecoilizeDebugger from 'recoilize';

import {
  CircleSelectModal,
  ConnectWalletModal,
  LoadingModal,
} from 'components';
import { AUTO_OPEN_WALLET_DIALOG_PARAMS } from 'config/constants';
import { useCircle, useMe, useWallet } from 'hooks';
import {
  rWalletModalOpen,
  rGlobalLoading,
  rGlobalLoadingText,
  rCircleSelectorOpen,
  useValConnectorName,
  useStateInitialized,
  useSetMyAddress,
} from 'recoilState';
import { getApiService } from 'services/api';

// The following DebugObserver and window.$recoilValues are for debugging.
interface IRecoilAtomValue {
  contents: any;
  state: string;
}

// const DebugObserver = () => {
//   const snapshot = useRecoilSnapshot();
//   React.useEffect(() => {
//     console.debug('Recoil: The following atoms were modified:');
//     const thing = snapshot.getNodes_UNSTABLE({ isModified: true });
//     for (const node of Array.from(thing)) {
//       console.debug(node.key, snapshot.getLoadable(node));
//     }
//   }, [snapshot]);

//   return null;
// };

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: This is debug code!!!
window.$recoilValues = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const states = window.$recoilDebugStates as RecoilState[];
  const latest = states[states.length - 1]?.atomValues?._hamt as Map<
    string,
    IRecoilAtomValue
  >;
  // eslint-disable-next-line no-console
  latest.forEach((v, k) => console.log(k, v.state, v.contents));
};

export const RecoilAppController = () => {
  const web3Context = useWeb3React<Web3Provider>();

  const { deactivate, activate } = useWallet();
  const { myProfile, hasAdminView } = useMe();
  const {
    selectAndFetchCircle,
    selectedCircleId,
    clearSelectedCircle,
  } = useCircle();
  const [initialized, setInitialized] = useStateInitialized();

  const connectorName = useValConnectorName();
  const setMyAddress = useSetMyAddress();
  const [walletModalOpen, setWalletModalOpen] = useRecoilState(
    rWalletModalOpen
  );
  const [circleSelectorOpen, setCircleSelectorOpen] = useRecoilState(
    rCircleSelectorOpen
  );
  const globalLoading = useRecoilValue(rGlobalLoading);
  const globalLoadingText = useRecoilValue(rGlobalLoadingText);

  useEffect(() => {
    // TODO: this can be the atom default state
    if (window.location.search === AUTO_OPEN_WALLET_DIALOG_PARAMS) {
      setWalletModalOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getApiService().setProvider(web3Context.library);
  }, [web3Context.library]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    if (!web3Context.account) {
      throw 'Expected web3Context.account to be set';
    }

    setMyAddress(web3Context.account);

    if (walletModalOpen) {
      setWalletModalOpen(false);
    }

    if (selectedCircleId === undefined) {
      setCircleSelectorOpen(true);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

  useEffect(() => {
    if (web3Context.error) {
      setInitialized(false);
      deactivate();
      return;
    }

    if (!web3Context.active && connectorName && !initialized) {
      activate(connectorName);
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Context.error, web3Context.active, web3Context.library]);

  useEffect(() => {
    if (initialized || selectedCircleId === undefined) {
      return;
    }
    selectAndFetchCircle(selectedCircleId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCircleId]);

  useEffect(() => {
    if (!initialized || !myProfile || hasAdminView) {
      return;
    }

    if (
      selectedCircleId &&
      !myProfile?.users?.some((u) => u.circle_id !== selectedCircleId)
    ) {
      // This profile shouldn't have access to this circle.
      clearSelectedCircle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myProfile]);

  return (
    <>
      {/* <DebugObserver /> */}
      {/* <RecoilizeDebugger /> */}
      <ConnectWalletModal
        onClose={() => setWalletModalOpen(false)}
        visible={walletModalOpen}
      />
      <CircleSelectModal
        onClose={() => setCircleSelectorOpen(false)}
        visible={circleSelectorOpen}
      />
      <LoadingModal text={globalLoadingText} visible={globalLoading > 0} />
    </>
  );
};
