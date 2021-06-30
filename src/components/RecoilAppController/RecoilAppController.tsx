import React, { useEffect } from 'react';

import {
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  useRecoilSnapshot,
} from 'recoil';
import RecoilizeDebugger from 'recoilize';

import {
  CircleSelectModal,
  ConnectWalletModal,
  LoadingModal,
} from 'components';
import { useConnectedWeb3Context } from 'contexts';
import { useCircle } from 'hooks';
import {
  rMyAddress,
  rWalletModalOpen,
  rGlobalLoading,
  rGlobalLoadingText,
  rSelectedCircleId,
  rCircleSelectorOpen,
} from 'recoilState';
import storage from 'utils/storage';

interface IRecoilAtomValue {
  contents: any;
  state: string;
}

const DebugObserver = () => {
  const snapshot = useRecoilSnapshot();
  React.useEffect(() => {
    console.debug('Recoil: The following atoms were modified:');
    const thing = snapshot.getNodes_UNSTABLE({ isModified: true });
    for (const node of Array.from(thing)) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
};

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
  latest.forEach((v, k) => console.log(k, v.state, v.contents));
};

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export const RecoilAppController = ({ children }: IProps) => {
  const { account } = useConnectedWeb3Context(); // networkId ?

  const setMyAddress = useSetRecoilState(rMyAddress);
  const { selectCircle } = useCircle();
  const [walletModalOpen, setWalletModalOpen] = useRecoilState(
    rWalletModalOpen
  );
  const [circleSelectorOpen, setCircleSelectorOpen] = useRecoilState(
    rCircleSelectorOpen
  );
  const [globalLoading, setGlobalLoading] = useRecoilState(rGlobalLoading);
  const globalLoadingText = useRecoilValue(rGlobalLoadingText);

  useEffect(() => {
    setMyAddress(account ?? '');
    const circleIdSelection = storage.getCircleId();
    if (circleIdSelection === -1) {
      setCircleSelectorOpen(true);
    } else {
      selectCircle(circleIdSelection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <>
      {children}
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
      {/* <LoadingModal text={globalLoadingText} visible={globalLoading > 0} /> */}
    </>
  );
};
