// export const useBaseState = (): {
//   fetchBaseState: () => Promise<void>;
//   fetchCircles: () => Promise<IUser[]>;
//   fetchFutureEpochs: () => Promise<IEpoch[]>;
// } => {
//   const fetchEpochs = useRecoilFetcher(
//     'rEpochsMap',
//     rEpochsMap,
//     updaterMergeArrayToIdMap
//   );

//   const fetchEpochs = useRecoilFetcher(
//     'rEpochsMap',
//     rEpochsMap,
//     updaterMergeArrayToIdMap
//   );

//   const fetchBaseState = async () => {
//     const results = await Promise.all([
//       await fetchPendingGifts(api.getPendingTokenGifts, [
//         undefined,
//         undefined,
//         circleId,
//       ]),
//       await fetchGifts(api.getTokenGifts, [undefined, undefined, circleId]),
//       await fetchUsers(api.getUsers, [undefined, circleId, undefined, true]),
//       await fetchEpochs(api.getEpochs, [{ circleId }]),
//       // TODO: This should be a part of profile.
//       await fetchMyUsersWithTeammates(api.getUserWithTeammates, [
//         circleId,
//         '0x0dc053c330918c3c4cb556922973ab21f567919b',
//       ]),
//     ]);

//     // TODO: how to load localPEnding
//     const [_, pendingGifts] = results[0] as [
//       () => void,
//       ITokenGift[] | undefined
//     ];
//     console.log('got pending gifts', pendingGifts);

//     results.forEach(([commit]) => commit());
//     setSelectedCircleId(circleId);
//   }

//   return {
//     fetchBaseState,
//     fetchCircles,
//     fetchFutureEpochs,
//   }
// }

export const useBaseState = undefined;
