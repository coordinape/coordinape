import React, { useEffect } from 'react';

import { useGetRecoilValueInfo_UNSTABLE, RecoilValueReadOnly } from 'recoil';

import * as recoilState from 'recoilState';

export const RecoilDebugger = () => {
  const getRecoilValueInfo = useGetRecoilValueInfo_UNSTABLE();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: For Debug
    window.$rGetBasics = (baseCircleId?: number) => {
      logRecoilValue(getRecoilValueInfo(recoilState.rMyAddress), 'rMyAddress');
      logRecoilValue(getRecoilValueInfo(recoilState.rMyProfile), 'rMyProfile');
      const selectedCircleState = getRecoilValueInfo(
        recoilState.rSelectedCircleId
      );
      const circleId = baseCircleId ?? selectedCircleState.loadable?.contents;
      logRecoilValue(selectedCircleState, 'rSelectedCircleId');
      logRecoilValue(getRecoilValueInfo(recoilState.rManifest), 'rManifest');
      logRecoilValue(
        getRecoilValueInfo(recoilState.rFullCircle),
        'rFullCircle'
      );
      logRecoilValue(
        getRecoilValueInfo(recoilState.rCirclesState),
        'rCirclesState'
      );
      logRecoilValue(
        getRecoilValueInfo(recoilState.rCircleState(circleId)),
        'rCircleState'
      );
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: For Debug
    window.$rget = Object.assign(
      {},
      ...Object.entries(recoilState)
        .filter(([k]) => k.startsWith('r'))
        .map(([k, v]) => ({
          [k]:
            typeof v === 'function'
              ? (arg: any) =>
                  logRecoilValue(
                    getRecoilValueInfo((v as (arg: any) => any)(arg))
                  )
              : () =>
                  logRecoilValue(
                    getRecoilValueInfo(v as RecoilValueReadOnly<string>)
                  ),
        }))
    );
  }, [getRecoilValueInfo]);

  return <></>;
};

// The following DebugObserver and window.$recoilValues are for debugging.
interface IRecoilAtomValue {
  contents: any;
  state: string;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: For Debug
window.$recoilValues = (pendingOnly = false) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore For Debug
  const states = window.$recoilDebugStates as RecoilState[];
  const latest = states[states.length - 1]?.atomValues?._hamt as Map<
    string,
    IRecoilAtomValue
  >;
  latest.forEach((v, k) => {
    if (!pendingOnly || v.state !== 'hasValue') {
      // eslint-disable-next-line no-console
      console.log(k, v.state, v.contents);
    }
  });
};

const logRecoilValue = (
  info: ReturnType<ReturnType<typeof useGetRecoilValueInfo_UNSTABLE>>,
  key = ''
) => {
  // eslint-disable-next-line no-console
  console.log(
    `Δ ${key} ${info.isActive ? '  active' : 'inactive'} ${
      info.loadable?.state
    }`,
    info.loadable?.contents
  );
};

// const DebugObserver = () => {
//   const snapshot = useRecoilSnapshot();
//   React.useEffect(() => {
//     // This only get's atoms not selectors, see:
//     // https://github.com/facebookexperimental/Recoil/issues/1214
//     const nodes = Array.from(snapshot.getNodes_UNSTABLE({ isModified: true }));
//     // eslint-disable-next-line no-console
//     console.groupCollapsed('RECOIL Δ', ...nodes.map(n => n.key));
//     for (const node of nodes) {
//       const loadable = snapshot.getLoadable(node);
//       // eslint-disable-next-line no-console
//       console.log(
//         '-',
//         node.key,
//         loadable.state === 'hasValue' ? loadable.contents : loadable.state
//       );
//     }
//     // eslint-disable-next-line no-console
//     console.groupEnd();
//   }, [snapshot]);

//   return null;
// };
