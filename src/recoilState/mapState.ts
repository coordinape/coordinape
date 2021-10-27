import iti from 'itiriri';
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

import { toSearchRegExp, assertDef } from 'utils/tools';

import {
  rGiftsByEpoch,
  rSelectedCircleId,
  rCircleEpochsStatus,
  rUsersMap,
  rGiftsMap,
  rCircles,
} from './appState';

import {
  IRecoilGetParams,
  ITokenGift,
  IMapContext,
  IMapNode,
  IMapEdge,
  IMapEdgeFG,
  IEpoch,
  TDirection,
  IMapNodeFG,
  MetricEnum,
  TScaler,
  IFilledProfile,
  IProfileEmbed,
  IUser,
} from 'types';

//
// Injest App State
//

// Fake users are created to when either the user data is not ready for the
// edges or when users have been deleted that once existed.
// Of the later there are a few from early when the coordinape team
// was actively in the strategist circle to observe and mistakenly got some
// give.
// TODO: Think about how best to resolve this sort of thing.
const FAKE_ID_OFFSET = 100000;
const FAKE_ADDRESS = '0xFAKE';
const createFakeProfile = (u: IUser): IProfileEmbed => ({
  id: u.id + FAKE_ID_OFFSET,
  address: u.address,
  admin_view: 0,
  avatar: '',
  created_at: u.created_at,
  updated_at: u.updated_at,
});
const createFakeUser = (circleId: number): IUser => ({
  name: 'HardDelete',
  id: FAKE_ID_OFFSET - circleId,
  circle_id: circleId,
  address: FAKE_ADDRESS,
  non_giver: 1,
  fixed_non_receiver: 1,
  starting_tokens: 100,
  bio: 'This user was hard deleted, Inconsistent data error.',
  non_receiver: 1,
  give_token_received: 0,
  give_token_remaining: 0,
  epoch_first_visit: 0,
  created_at: '2021-07-07T23:29:18.000000Z',
  updated_at: '2021-07-07T23:29:18.000000Z',
  deleted_at: '2021-07-07T23:29:18.000000Z',
  role: 1,
  profile: {
    id: FAKE_ID_OFFSET,
    address: FAKE_ADDRESS,
    admin_view: 0,
    avatar: 'deleted-user_1628632000.jpg',
    created_at: '2021-07-07T23:29:18.000000Z',
    updated_at: '2021-07-07T23:29:18.000000Z',
  },
});

export const rUserMapWithFakes = selector<Map<number, IUser>>({
  key: 'rUserMapWithFakes',
  get: ({ get }: IRecoilGetParams) => {
    const usersMap = get(rUsersMap);
    const updated = new Map(usersMap);
    get(rCircles)
      .map(c => createFakeUser(c.id))
      .forEach(u => updated.set(u.id, u));

    return updated;
  },
});

export const rUserProfileMap = selector<Map<string, IFilledProfile>>({
  key: 'rUserProfileMap',
  get: ({ get }: IRecoilGetParams) =>
    iti(get(rUserMapWithFakes).values())
      .groupBy(u => u.address)
      .map(([, us]) => {
        const users = us.toArray();
        // Deleted users don't have profiles
        const activeUser = us.find(u => !u.deleted_at);
        const profile =
          activeUser?.profile ?? createFakeProfile(assertDef(us.first()));
        return {
          ...profile,
          users,
        } as IFilledProfile;
      })
      .toMap(p => p.address),
});
export const useUserProfileMap = () => useRecoilValue(rUserProfileMap);

//
// Asset Map Atoms
// Setting these configures the graph
//
export const rMapEpochId = atom<number | undefined>({
  key: 'rMapEpochId',
  default: undefined, // -1 to represent all
});
export const useStateAmEpochId = () => useRecoilState(rMapEpochId);

export const rMapSearch = atom<string>({
  key: 'rMapSearch',
  default: '',
});
export const useStateAmSearch = () => useRecoilState(rMapSearch);
export const useSetAmSearch = () => useSetRecoilState(rMapSearch);

export const rMapEgoAddress = atom<string>({
  key: 'rMapEgoAddress',
  default: '',
});
export const useSetAmEgoAddress = () => useSetRecoilState(rMapEgoAddress);
export const useStateAmEgoAddress = () => useRecoilState(rMapEgoAddress);
export const useMapEgoAddress = () => useRecoilValue(rMapEgoAddress);

export const rMapMetric = atom<MetricEnum>({
  key: 'rMapMetric',
  default: 'give',
});
export const useStateAmMetric = () => useRecoilState(rMapMetric);
export const useMapMetric = () => useRecoilValue(rMapMetric);

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
export const useMapEpochs = () => useRecoilValue(rMapEpochs);

export const rMapSearchRegex = selector<RegExp | undefined>({
  key: 'rMapSearchRegex',
  get: async ({ get }: IRecoilGetParams) => {
    return toSearchRegExp(get(rMapSearch));
  },
});
export const useMapSearchRegex = () => useRecoilValue(rMapSearchRegex);

export const rMapGifts = selector<ITokenGift[]>({
  key: 'rMapGifts',
  get: async ({ get }: IRecoilGetParams) => {
    const selectedCircleId = get(rSelectedCircleId) ?? -1;
    const epochs = get(rMapEpochs);
    const userMap = get(rUserMapWithFakes);

    const fakeUser = assertDef(
      userMap.get(FAKE_ID_OFFSET - selectedCircleId),
      'Missing fake user'
    );
    return iti(epochs)
      .map(epoch =>
        iti(get(rGiftsByEpoch).get(epoch.id) ?? []).map(g => {
          // const recipient = assertDef(
          //   userMap.get(g.recipient_id),
          //   `Missing recipient for gift ${g.id}, address: ${g.recipient_id} `
          // );
          // const sender = assertDef(
          //   userMap.get(g.sender_id),
          //   `Missing sender for gift ${g.id}, sender: ${g.sender_id} `
          // );
          // Addresses may have changed, so update them here.
          const recipient = userMap.get(g.recipient_id) ?? fakeUser;
          const sender = userMap.get(g.sender_id) ?? fakeUser;
          return {
            ...g,
            recipient_address: recipient.address,
            sender_address: sender.address,
          };
        })
      )
      .flat(es => es)
      .toArray();
  },
});

// Graph data is all the nodes and links used by the d3-force-3d library
// All of it's callbacks will return these objects.
// E.g. nodeCanvasObject(node)
export const rMapGraphData = selector<GraphData>({
  key: 'rMapGraphData',
  get: async ({ get }: IRecoilGetParams) => {
    const epochs = get(rMapEpochs);
    const epochsMap = iti(epochs).toMap(e => e.id);
    const gifts = iti(get(rMapGifts));
    const userProfileMap = get(rUserProfileMap);
    if (epochs.length === 0) {
      return { links: [], nodes: [] };
    }

    const links = gifts
      .filter(g => g.tokens > 0)
      .map((g): IMapEdge => {
        const epoch = assertDef(
          epochsMap.get(g.epoch_id),
          `Missing epoch.id = ${g.id} in rMapGraphData. have ${epochs.map(
            e => e.id
          )}`
        );
        return {
          id: g.id,
          source: g.sender_address,
          target: g.recipient_address,
          epochId: epoch.id,
          epochNumber: epoch.number ?? 1, // ugh
          tokens: g.tokens,
        };
      });
    return {
      links: links.toArray(),
      nodes: links
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
          const user = assertDef(
            profile.users.find(u => u.circle_id === epoch.circle_id),
            `Missing user of circle = ${epoch.circle_id} in rMapGraphData at ${profile.address}`
          );

          return {
            id: address,
            img: profile.avatar ?? '',
            profile,
            name: user.name,
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
export const useMapGraphData = () => useRecoilValue(rMapGraphData);

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
    const giftMap = get(rGiftsMap);
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
    const giftMap = get(rGiftsMap);
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
          (user?.name ?? '')
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
export const rMapResults = selector<IFilledProfile[]>({
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
export const useMapResults = () => useRecoilValue(rMapResults);

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
export const useMapMeasures = (metric: MetricEnum) =>
  useRecoilValue(rMapMeasures(metric));

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
    const giftMap = get(rGiftsMap);
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

    const getEdgeMeasure = (edge: IMapEdgeFG, scaler?: TScaler): number => {
      return scaler ? scaler(edge.tokens / 100) : edge.tokens;
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
export const useMapContext = () => useRecoilValueLoadable(rMapContext);
