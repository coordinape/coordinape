import iti from 'itiriri';
import { DateTime } from 'luxon';
import { GraphData } from 'react-force-graph-2d';
import {
  atom,
  selector,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilState,
  selectorFamily,
  useSetRecoilState,
} from 'recoil';

import { rManifest } from 'recoilState';
import { assertDef } from 'utils';
import { getAvatarPath } from 'utils/domain';
import {
  createFakeUser,
  createFakeProfile,
  extraEpoch,
  extraGift,
  extraUser,
} from 'utils/modelExtenders';
import { neverEndingPromise } from 'utils/recoil';

import type { IApiFullCircle } from './queries';

import {
  IRecoilGetParams,
  IMapContext,
  IMapNode,
  IMapEdge,
  IMapEdgeFG,
  IEpoch,
  TDirection,
  IMapNodeFG,
  MetricEnum,
  TScaler,
  IProfile,
  IUser,
  ITokenGift,
} from 'types';

// this is set by useFetchCircle when the map page loads
export const rSelectedCircleIdSource = atom<number | undefined>({
  key: 'rSelectedCircleIdSource',
  default: undefined,
});

// Suspend unless it has a value
const rSelectedCircleId = selector({
  key: 'rSelectedCircleId',
  get: async ({ get }) => {
    const id = get(rSelectedCircleIdSource);
    return id ?? neverEndingPromise<number>();
  },
});

export const rApiFullCircle = atom({
  key: 'rApiFullCircle',
  default: new Map<number, IApiFullCircle>(),
});

interface IFullCircle {
  usersMap: Map<number, IUser>;
  pendingGiftsMap: Map<number, ITokenGift>;
  pastGiftsMap: Map<number, ITokenGift>;
  giftsMap: Map<number, ITokenGift>;
  epochsMap: Map<number, IEpoch>;
}

const rFullCircle = selector<IFullCircle>({
  key: 'rFullCircle',
  get: async ({ get }) => {
    const fullCircle = get(rApiFullCircle);
    if (fullCircle === undefined) {
      return neverEndingPromise<IFullCircle>();
    }

    const users = iti(fullCircle.values())
      .flat(fc =>
        fc.users.map(
          ({ profile, ...u }) => ({ profile, ...extraUser(u) } as IUser)
        )
      )
      .toArray();
    const userMap = iti(users).toMap(u => u.id);

    const pending = iti(
      iti(fullCircle.values())
        .flat(fc => fc.pending_gifts)
        .toArray()
    );
    const pastGifts = iti(
      iti(fullCircle.values())
        .flat(fc => fc.token_gifts.map(g => extraGift(g, userMap, false)))
        .toArray()
    );
    const allGifts = pending
      .map(g => extraGift({ ...g, id: g.id + 1000000000 }, userMap, true))
      .concat(pastGifts);
    const epochs = iti(fullCircle.values()).flat(fc =>
      fc.epochs.map(e => extraEpoch(e))
    );

    return {
      usersMap: iti(users).toMap(u => u.id),
      pendingGiftsMap: pending
        .map(g => extraGift(g, userMap, true))
        .toMap(g => g.id),
      pastGiftsMap: pastGifts.toMap(g => g.id),
      giftsMap: allGifts.toMap(g => g.id),
      epochsMap: epochs.toMap(e => e.id),
    };
  },
});

const rCircleEpochs = selectorFamily<IEpoch[], number>({
  key: 'rCircleEpochs',
  get:
    (circleId: number) =>
    ({ get }) => {
      let lastNumber = 1;
      const epochsWithNumber = [] as IEpoch[];

      iti(get(rFullCircle).epochsMap.values())
        .filter(e => e.circle_id === circleId)
        .sort((a, b) => +new Date(a.start_date) - +new Date(b.start_date))
        .forEach(epoch => {
          lastNumber = epoch.number ?? lastNumber + 1;
          epochsWithNumber.push({ ...epoch, number: lastNumber });
        });

      return epochsWithNumber;
    },
});

const rCircleEpochsStatus = selectorFamily({
  key: 'rCircleEpochsStatus',
  get:
    (circleId: number) =>
    ({ get }) => {
      const epochs = get(rCircleEpochs(circleId));
      const pastEpochs = epochs.filter(
        epoch => +new Date(epoch.end_date) - +new Date() <= 0
      );
      const futureEpochs = epochs.filter(
        epoch => +new Date(epoch.start_date) - +new Date() >= 0
      );
      const previousEpoch =
        pastEpochs.length > 0 ? pastEpochs[pastEpochs.length - 1] : undefined;
      const nextEpoch = futureEpochs.length > 0 ? futureEpochs[0] : undefined;
      const previousEpochEndedOn =
        previousEpoch &&
        previousEpoch.endDate
          .minus({ seconds: 1 })
          .toLocal()
          .toLocaleString(DateTime.DATE_MED);

      const currentEpoch = epochs.find(
        epoch =>
          +new Date(epoch.start_date) - +new Date() <= 0 &&
          +new Date(epoch.end_date) - +new Date() >= 0
      );

      const closest = currentEpoch ?? nextEpoch;
      const currentEpochNumber = currentEpoch?.number
        ? String(currentEpoch.number)
        : previousEpoch?.number
        ? String(previousEpoch.number + 1)
        : '1';
      let timingMessage = 'Epoch not Scheduled';
      let longTimingMessage = 'Next Epoch not Scheduled';

      if (closest && !closest.started) {
        timingMessage = `Epoch Begins in ${closest.labelUntilStart}`;
        longTimingMessage = `Epoch ${currentEpochNumber} Begins in ${closest.labelUntilStart}`;
      }
      if (closest && closest.started) {
        timingMessage = `Epoch ends in ${closest.labelUntilEnd}`;
        longTimingMessage = `Epoch ${currentEpochNumber} Ends in ${closest.labelUntilEnd}`;
      }

      return {
        epochs,
        pastEpochs,
        previousEpoch,
        currentEpoch,
        nextEpoch,
        futureEpochs,
        previousEpochEndedOn,
        epochIsActive: !!currentEpoch,
        timingMessage,
        longTimingMessage,
      };
    },
});

export const rUserMapWithFakes = selector<Map<number, IUser>>({
  key: 'rUserMapWithFakes',
  get: ({ get }: IRecoilGetParams) => {
    const usersMap = iti(
      get(rManifest).myProfile.myUsers as unknown as IUser[]
    ).toMap(u => u.id);
    iti(get(rFullCircle).usersMap.values()).forEach(u => usersMap.set(u.id, u));

    const updated = new Map(usersMap);

    for (const c of get(rManifest).circles) {
      const u = createFakeUser(c.id);
      updated.set(u.id, u);
    }

    return updated;
  },
});

export const rUserProfileMap = selector<Map<string, IProfile>>({
  key: 'rUserProfileMap',
  get: ({ get }: IRecoilGetParams) =>
    iti(get(rUserMapWithFakes).values())
      .groupBy(u => u.address)
      .map(([, us]) => {
        const users = us.toArray();
        // Deleted users don't have profiles
        const activeUser = us.find(u => !u.deleted_at);
        const profile = activeUser?.profile?.address
          ? activeUser?.profile
          : createFakeProfile(assertDef(us.first()));
        return {
          ...profile,
          users,
        } as IProfile;
      })
      .toMap(p => p.address),
});

//
// Asset Map Atoms
// Setting these configures the graph
//
export const rMapEpochId = atom<number | undefined>({
  key: 'rMapEpochId',
  default: undefined, // -1 to represent all
});

export const rMapSearch = atom<string>({
  key: 'rMapSearch',
  default: '',
});

export const rMapEgoAddress = atom<string>({
  key: 'rMapEgoAddress',
  default: '',
});

export const rMapMetric = atom<MetricEnum>({
  key: 'rMapMetric',
  default: 'give',
});

//
// Map Selectors
// Computed values used to graph
//
export const rMapEpochs = selector<IEpoch[]>({
  key: 'rMapEpochs',
  get: async ({ get }: IRecoilGetParams) => {
    const { pastEpochs, currentEpoch } = get(
      rCircleEpochsStatus(get(rSelectedCircleId) ?? -1)
    );
    return currentEpoch ? pastEpochs.concat(currentEpoch) : pastEpochs;
  },
});

const toSearchRegExp = (value: string) => {
  if (!value) return undefined;
  try {
    return new RegExp(`(${value.replace(/[#-.]|[[-^]|[?{}]/g, '\\$&')})`, 'i');
  } catch (error) {
    console.warn('toSearchRegExp', error);
  }
  return undefined;
};

export const rMapSearchRegex = selector<RegExp | undefined>({
  key: 'rMapSearchRegex',
  get: async ({ get }: IRecoilGetParams) => {
    return toSearchRegExp(get(rMapSearch));
  },
});

// Graph data is all the nodes and links used by the d3-force-3d library
// All of it's callbacks will return these objects.
// E.g. nodeCanvasObject(node)
export const rMapGraphData = selector<GraphData>({
  key: 'rMapGraphData',
  get: async ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId);
    const epochs = get(rMapEpochs);
    const epochsMap = iti(epochs).toMap(e => e.id);
    const gifts = iti(get(rFullCircle).giftsMap.values());
    const userProfileMap = get(rUserProfileMap);
    if (epochs.length === 0) {
      return { links: [], nodes: [] };
    }

    const validEpochIds = epochs.map(e => e.id);

    const links = gifts
      .filter(
        g =>
          g.tokens > 0 &&
          g.circle_id === selectedCircleId &&
          validEpochIds.includes(g.epoch_id)
      )
      .map((g): IMapEdge => {
        const epoch = epochsMap.get(g.epoch_id) as IEpoch;
        return {
          id: g.id,
          source: g.sender_address,
          target: g.recipient_address,
          epochId: epoch.id,
          epochNumber: epoch.number ?? 1, // ugh
          tokens: g.tokens,
        };
      });

    const linksArray = links.toArray();
    return {
      links: linksArray,
      nodes: iti(linksArray)
        .map(({ source, target, epochId }) => [
          `${epochId}@${source}`,
          `${epochId}@${target}`,
        ])
        .flat(pair => pair)
        .distinct()
        .map(key => {
          const [epochIdStr, address] = key.split('@');
          const profile = assertDef(
            userProfileMap.get(address),
            `Missing profile = ${address} in rMapGraphData`
          );
          const epoch = assertDef(
            epochsMap.get(Number(epochIdStr)),
            `Missing epoch = ${epochIdStr} in rMapGraphData. have ${epochs.map(
              e => e.id
            )}`
          );

          const user =
            profile.users.find(u => u.circle_id === epoch.circle_id) ||
            createFakeUser(epoch.circle_id);

          // FIXME we should stop using ui-avatars.com and rewrite this map code
          // to use fallback text like Avatar does
          const img =
            getAvatarPath(profile?.avatar || user?.profile?.avatar) ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user.profile?.name ?? ''
            )}`;

          return {
            id: address,
            img,
            profile,
            name: user.profile?.name ?? '',
            epochId: epoch.id,
            userId: user.id,
          };
        })
        .groupBy(n => n.id)
        .map(([, n]): IMapNode => {
          const epochIds = n.map(m => m.epochId);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { epochId, ...node } = assertDef(
            n.first(),
            'rMapGraphData, node with epochIds'
          );
          return {
            ...node,
            epochIds: epochIds.toArray(),
          };
        })
        .toArray(),
    };
  },
});

// Nodes that are active in this epoch.
export const rMapActiveNodes = selector<Set<string>>({
  key: 'rMapActiveNodes',
  get: async ({ get }: IRecoilGetParams) => {
    const epochId = get(rMapEpochId) ?? new Set();
    const { nodes } = get(rMapGraphData) as unknown as { nodes: IMapNode[] };
    const includeEpoch =
      epochId === -1 ? () => true : (id: number) => epochId === id;
    return iti(nodes)
      .filter(n => n.epochIds.some(id => includeEpoch(id)))
      .map(n => n.id)
      .toSet();
  },
});

export const rMapOutFrom = selector<Map<string, Uint32Array>>({
  key: 'rMapOutFrom',
  get: async ({ get }: IRecoilGetParams) => {
    const epochId = get(rMapEpochId);
    const includeEpoch =
      epochId === -1 ? () => true : (id: number) => epochId === id;
    return iti(get(rMapGraphData).links as IMapEdge[])
      .filter(l => includeEpoch(l.epochId))
      .groupBy(l => l.source)
      .toMap(
        ([address]) => address,
        ([, ls]) => new Uint32Array(ls.map(l => l.id).toArray())
      );
  },
});

export const rMapInTo = selector<Map<string, Uint32Array>>({
  key: 'rMapInTo',
  get: async ({ get }: IRecoilGetParams) => {
    const epochId = get(rMapEpochId);
    const includeEpoch =
      epochId === -1 ? () => true : (id: number) => epochId === id;
    return iti(get(rMapGraphData).links as IMapEdge[])
      .filter(l => includeEpoch(l.epochId))
      .groupBy(l => l.target)
      .toMap(
        ([address]) => address,
        ([, ls]) => new Uint32Array(ls.map(l => l.id).toArray())
      );
  },
});

export const rMapOutFromTokens = selector<Map<string, Uint32Array>>({
  key: 'rMapOutFromTokens',
  get: async ({ get }: IRecoilGetParams) => {
    const giftMap = get(rFullCircle).giftsMap;
    return iti(get(rMapOutFrom)).toMap(
      ([address]) => address,
      ([, ls]) =>
        ls.map(
          l =>
            assertDef(giftMap.get(l), `rMapOutFromTokens giftMap.get ${l}`)
              .tokens
        )
    );
  },
});

export const rMapInFromTokens = selector<Map<string, Uint32Array>>({
  key: 'rMapInFromTokens',
  get: async ({ get }: IRecoilGetParams) => {
    const giftMap = get(rFullCircle).giftsMap;
    return iti(get(rMapInTo)).toMap(
      ([address]) => address,
      ([, ls]) =>
        ls.map(
          l =>
            assertDef(giftMap.get(l), `rMapInFromTokens giftMap.get ${l}`)
              .tokens
        )
    );
  },
});

export const rMapNodeSearchStrings = selector<Map<string, string>>({
  key: 'rMapNodeSearchStrings',
  get: async ({ get }: IRecoilGetParams) => {
    const profileMap = get(rUserProfileMap);
    return iti(get(rMapGraphData).nodes as IMapNode[]).toMap(
      ({ id }) => id,
      ({ id }) => {
        const profile = profileMap.get(id);
        if (profile === undefined) {
          return '';
        }
        const selectedCircleId = get(rSelectedCircleId) ?? -1;
        const user = profile.users.find(u => u.circle_id === selectedCircleId);

        return (
          profile.bio +
          ' ' +
          (user?.bio ?? '') +
          ' ' +
          profile.skills?.join(' ') +
          ' ' +
          (user?.profile?.name ?? '')
        );
      }
    );
  },
});

// Bag is all the addresses that match the search regex
export const rMapBag = selector<Set<string>>({
  key: 'rMapBag',
  get: async ({ get }: IRecoilGetParams) => {
    const regex = get(rMapSearchRegex);
    if (regex === undefined) {
      return new Set<string>();
    }
    const activeNodes = get(rMapActiveNodes);
    const searchStrings = get(rMapNodeSearchStrings);
    return (
      iti(searchStrings)
        .filter(([address]) => activeNodes.has(address))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, str]) => regex.test(str))
        .map(([address]) => address)
        .toSet()
    );
  },
});

// Results are the active profiles in the bag
export const rMapResults = selector<IProfile[]>({
  key: 'rMapResults',
  get: async ({ get }: IRecoilGetParams) => {
    const profileMap = get(rUserProfileMap);
    const bag = get(rMapBag);
    const activeNodes = get(rMapActiveNodes);
    const includeAddr = bag.size ? (addr: string) => bag.has(addr) : () => true;
    return iti(get(rMapGraphData).nodes as IMapNode[])
      .filter(n => activeNodes.has(n.id) && includeAddr(n.id))
      .map(n => assertDef(profileMap.get(n.id), 'rMapResults'))
      .toArray();
  },
});

interface IMeasures {
  min: number;
  max: number;
  measures: Map<string, number>;
}

export const rMapMeasures = selectorFamily<IMeasures, MetricEnum>({
  key: 'rMapMeasures',
  get:
    (metric: MetricEnum) =>
    ({ get }: IRecoilGetParams) => {
      const actives = get(rMapActiveNodes);
      const outFrom = get(rMapOutFromTokens);
      const inTo = get(rMapInFromTokens);
      let measures = new Map<string, number>();
      switch (metric) {
        case 'give': {
          measures = iti(actives).toMap(
            address => address,
            address => iti(inTo.get(address) ?? [0]).sum() as number
          );
          break;
        }
        case 'gave': {
          measures = iti(actives).toMap(
            address => address,
            address => iti(outFrom.get(address) ?? [0]).sum() as number
          );
          break;
        }
        case 'in_degree': {
          measures = iti(actives).toMap(
            address => address,
            address =>
              iti(inTo.get(address) ?? [0])
                .map(() => 1)
                .sum() as number
          );
          break;
        }
        case 'out_degree': {
          measures = iti(actives).toMap(
            address => address,
            address =>
              iti(outFrom.get(address) ?? [])
                .map(() => 1)
                .sum() as number
          );
          break;
        }
        case 'standardized': {
          const maxOut = Math.max(
            1,
            iti(outFrom.values())
              .map(arr => arr.length)
              .max() ?? 1
          );
          measures = iti(actives).toMap(
            address => address,
            address =>
              Math.round(
                ((outFrom.get(address)?.length ?? 0) *
                  (iti(inTo.get(address) ?? []).sum() ?? 0)) /
                  maxOut
              )
          );
          break;
        }
        default:
          throw `Metric, ${metric} unimplemented`;
      }
      return {
        min: iti(measures.values()).min() as number,
        max: iti(measures.values()).max() as number,
        measures,
      };
    },
});

export const AmContextDefault = {
  egoAddress: '',
  bag: new Set<string>(),
  epochId: -1,
  measures: {
    min: 0,
    max: 0,
    count: 0,
  },
  isBagNeighbor: () => false,
  isEgoNeighbor: () => false,
  isEgoEdge: () => false,
  isBagEdge: () => false,
  isBetweenBagEdge: () => false,
  getEdgeMeasure: () => 1,
  getNodeMeasure: () => 1,
  getCurvature: () => 0,
};

// Context is stored in a useRef so that the d3-force-3d callbacks can
// access it without rerenders that would reset it.
export const rMapContext = selector<IMapContext>({
  key: 'rMapContext',
  get: async ({ get }: IRecoilGetParams) => {
    const egoAddress = get(rMapEgoAddress);
    const bag = get(rMapBag);
    const epochId = get(rMapEpochId);
    const metric = get(rMapMetric);
    const giftMap = get(rFullCircle).giftsMap;
    const outFrom = get(rMapOutFrom);
    const inTo = get(rMapInTo);
    const { min, max, measures } = get(rMapMeasures(metric));

    if (epochId === undefined) {
      return AmContextDefault;
    }

    const isGivingTo = (sAddress: string, oAddress: string) =>
      inTo
        .get(sAddress)
        ?.some(
          id =>
            assertDef(giftMap.get(id), `isGivingTo ${id}`).sender_address ===
            oAddress
        ) ?? false;

    const isReceivingFrom = (sAddress: string, oAddress: string) =>
      outFrom
        .get(sAddress)
        ?.some(
          id =>
            assertDef(giftMap.get(id), `isReceivingFrom ${id}`)
              .recipient_address === oAddress
        ) ?? false;

    const isNeighbor = (
      self: string,
      node: IMapNodeFG,
      direction: TDirection = 'both'
    ): boolean => {
      switch (direction) {
        case 'gives': {
          return isGivingTo(self, node.id);
        }
        case 'receives': {
          return isReceivingFrom(self, node.id);
        }
        case 'both': {
          return isGivingTo(self, node.id) && isReceivingFrom(self, node.id);
        }
      }
    };

    const isEgoNeighbor = (
      node: IMapNodeFG,
      direction: TDirection = 'both'
    ): boolean => isNeighbor(egoAddress, node, direction);

    const isBagNeighbor = (
      node: IMapNodeFG,
      direction: TDirection = 'both'
    ): boolean =>
      iti(bag).some(address => isNeighbor(address, node, direction));

    const isEgoEdge = (
      edge: IMapEdgeFG,
      direction: TDirection = 'both'
    ): boolean => {
      switch (direction) {
        case 'gives': {
          return edge.source.id === egoAddress;
        }
        case 'receives': {
          return edge.target.id === egoAddress;
        }
        case 'both': {
          return edge.source.id === egoAddress && edge.target.id === egoAddress;
        }
      }
    };

    const isBetweenBagEdge = (edge: IMapEdgeFG): boolean =>
      bag.has(edge.source.id) && bag.has(edge.target.id);

    const isBagEdge = (
      edge: IMapEdgeFG,
      direction: TDirection = 'both'
    ): boolean => {
      switch (direction) {
        case 'gives': {
          return bag.has(edge.target.id);
        }
        case 'receives': {
          return bag.has(edge.source.id);
        }
        case 'both': {
          return bag.has(edge.target.id) && bag.has(edge.source.id);
        }
      }
    };

    // return the ratio between the value of this edge, and the total amount
    // that a single person received. set a lower bound so edges don't become
    // too thin when there's a skewed distribution.
    //
    // so an edge will be max-width when the person who received the most in the
    // group got it all from a single other person.
    //
    // this works correctly only when metric == 'give'... but the option to
    // change metric to anything else is hidden, so... "this is fine"
    const getEdgeMeasure = (edge: IMapEdgeFG): number => {
      return Math.max(0.1, edge.tokens / max);
    };

    const getNodeMeasure = (node: IMapNodeFG, scaler?: TScaler): number => {
      // TODO: make general for any number range
      const raw = measures.get(node.id) ?? 0;
      const range = max - min;
      return scaler ? scaler(range ? (raw - min) / range : 1) : raw;
    };

    const getCurvature = (): number => {
      // TODO: So much work for this! enumerate the shared edges
      return 0.1;
    };

    return {
      egoAddress,
      bag,
      epochId,
      measures: {
        min,
        max,
        count: measures.size,
      },
      isBagNeighbor,
      isEgoNeighbor,
      isEgoEdge,
      isBagEdge,
      isBetweenBagEdge,
      getEdgeMeasure,
      getNodeMeasure,
      getCurvature,
    };
  },
});

export const useMapResults = () => useRecoilValue(rMapResults);
export const useMapGraphData = () => useRecoilValue(rMapGraphData);
export const useMapSearchRegex = () => useRecoilValue(rMapSearchRegex);
export const useMapEpochs = () => useRecoilValue(rMapEpochs);
export const useStateAmMetric = () => useRecoilState(rMapMetric);
export const useMapMetric = () => useRecoilValue(rMapMetric);
export const useSetAmEgoAddress = () => useSetRecoilState(rMapEgoAddress);
export const useStateAmEgoAddress = () => useRecoilState(rMapEgoAddress);
export const useSetAmSearch = () => useSetRecoilState(rMapSearch);
export const useStateAmEpochId = () => useRecoilState(rMapEpochId);
export const useMapContext = () => useRecoilValueLoadable(rMapContext);

export const useMapMeasures = (metric: MetricEnum) =>
  useRecoilValue(rMapMeasures(metric));
