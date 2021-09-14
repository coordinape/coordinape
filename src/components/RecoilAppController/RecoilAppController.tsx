import React, { useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useRecoilState, useRecoilValue, useRecoilCallback } from 'recoil';
// import RecoilizeDebugger from 'recoilize';

import {
  CircleSelectModal,
  ConnectWalletModal,
  LoadingModal,
} from 'components';
import { useCircle, useMe, useWallet } from 'hooks';
import {
  rWalletModalOpen,
  rGlobalLoading,
  rGlobalLoadingText,
  rCircleSelectorOpen,
  rTriggerMode,
  useConnectorName,
  useStateMyAddress,
} from 'recoilState';
import { AUTO_OPEN_WALLET_DIALOG_PARAMS } from 'routes/paths';
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
    setSelectedCircleId,
  } = useCircle();
  const connectorName = useConnectorName();
  const [myAddress, setMyAddress] = useStateMyAddress();
  const [walletModalOpen, setWalletModalOpen] = useRecoilState(
    rWalletModalOpen
  );
  const [circleSelectorOpen, setCircleSelectorOpen] = useRecoilState(
    rCircleSelectorOpen
  );
  const globalLoading = useRecoilValue(rGlobalLoading);
  const globalLoadingText = useRecoilValue(rGlobalLoadingText);
  const recoilCallback = useRecoilCallback(
    ({ set }) => async (active: boolean) => {
      set(rTriggerMode, active);
    }
  );

  useEffect(() => {
    // Setup dev tool: trigger mode
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.mode = recoilCallback;
  }, [recoilCallback]);

  useEffect(() => {
    if (
      window.location.search === AUTO_OPEN_WALLET_DIALOG_PARAMS ||
      connectorName
    ) {
      setWalletModalOpen(true);
      connectorName && activate(connectorName);
    }
  }, []);

  useEffect(() => {
    if (!web3Context.account) {
      return;
    }
    // console.log('web3Context', web3Context);
    // console.log('connectorName:', connectorName, 'myAddress', myAddress);

    setMyAddress(web3Context.account);
    setWalletModalOpen(false);
    web3Context.connector?.addListener('Web3ReactDeactivate', deactivate);
    web3Context.connector?.addListener('Web3ReactError', deactivate);
    web3Context.connector?.addListener('Web3ReactUpdate', () =>
      console.warn('Web3ReactUpdate')
    );
  }, [web3Context]);

  useEffect(() => {
    getApiService().setProvider(web3Context.library);
  }, [web3Context.library]);

  useEffect(() => {
    if (selectedCircleId !== undefined && myAddress !== undefined) {
      selectAndFetchCircle(selectedCircleId);
    }
  }, [selectedCircleId, myAddress]);

  // Default selectedCircleId to first circle if undefined or no permissions
  useEffect(() => {
    // console.log('useEffect', 'myProfile', 'web3Context');
    if (!web3Context.active || !myProfile) {
      return;
    }
    if (!myProfile?.users?.length) {
      // User has no circles
      // console.log('no circles');
      setSelectedCircleId(undefined);
      return;
    }
    const noAccess =
      !hasAdminView &&
      !!selectedCircleId &&
      !myProfile?.users?.some((u) => u.circle_id === selectedCircleId);
    if (noAccess || selectedCircleId === undefined) {
      setSelectedCircleId(myProfile.users[0].circle_id);
    }
  }, [myProfile, web3Context]);

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
