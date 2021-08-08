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
  rUserProfileMap,
  rUsersMap,
  rGiftsMap,
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
  IUser,
} from 'types';

//
// Asset Map Atoms
// Setting these configures the graph
//
export const rAmEpochId = atom<number | undefined>({
  key: 'rAmEpochId',
  default: undefined, // FAKE_ALL_EPOCH to represent all
});
export const useStateAmEpochId = () => useRecoilState(rAmEpochId);

export const rAmSearch = atom<string>({
  key: 'rAmSearch',
  default: '',
});
export const useStateAmSearch = () => useRecoilState(rAmSearch);
export const useSetAmSearch = () => useSetRecoilState(rAmSearch);

export const rAmEgoAddress = atom<string>({
  key: 'rAmEgoAddress',
  default: '',
});
export const useSetAmEgoAddress = () => useSetRecoilState(rAmEgoAddress);
export const useStateAmEgoAddress = () => useRecoilState(rAmEgoAddress);
export const useAmEgoAddress = () => useRecoilValue(rAmEgoAddress);

export const rAmMetric = atom<MetricEnum>({
  key: 'rAmMetric',
  default: 'give',
});
export const useStateAmMetric = () => useRecoilState(rAmMetric);
export const useAmMetric = () => useRecoilValue(rAmMetric);

//
// Map Selectors
// Computed values used to graph
//
export const rAmEpochs = selector<IEpoch[]>({
  key: 'rAmEpochs',
  get: async ({ get }: IRecoilGetParams) => {
    const { pastEpochs, currentEpoch } = get(
      rCircleEpochsStatus(get(rSelectedCircleId) ?? -1)
    );
    return currentEpoch ? pastEpochs.concat(currentEpoch) : pastEpochs;
  },
});
export const useAmEpochs = () => useRecoilValue(rAmEpochs);

export const rAmEgo = selector<[IFilledProfile | undefined, IUser | undefined]>(
  {
    key: 'rAmEgo',
    get: async ({ get }: IRecoilGetParams) => {
      const circleId = get(rSelectedCircleId);
      const egoAddress = get(rAmEgoAddress);
      const profileMap = get(rUserProfileMap);
      const profile = profileMap.get(egoAddress);
      const user = profile?.users?.find((u) => u.circle_id === circleId);
      return [profile, user];
    },
  }
);
export const useAmEgo = () => useRecoilValue(rAmEgo);

export const rAmSearchRegex = selector<RegExp | undefined>({
  key: 'rAmSearchRegex',
  get: async ({ get }: IRecoilGetParams) => {
    return toSearchRegExp(get(rAmSearch));
  },
});
export const useAmSearchRegex = () => useRecoilValue(rAmSearchRegex);

export const rAmGifts = selector<ITokenGift[]>({
  key: 'rAmGifts',
  get: async ({ get }: IRecoilGetParams) => {
    const epochs = get(rAmEpochs);
    const userMap = get(rUsersMap);
    return iti(epochs)
      .map((epoch) =>
        iti(get(rGiftsByEpoch).get(epoch.id) ?? []).map((g) => {
          // Addresses may have changed, so update them here.
          const recipient = userMap.get(g.recipient_id);
          const sender = userMap.get(g.sender_id);
          if (recipient === undefined) {
            throw `Missing recipient for gift ${g.id}, address: ${g.recipient_id} `;
          }
          if (sender === undefined) {
            throw `Missing sender for gift ${g.id}, sender: ${g.sender_id} `;
          }
          return {
            ...g,
            recipient_address: recipient.address,
            sender_address: sender.address,
          };
        })
      )
      .flat((es) => es)
      .toArray();
  },
});

export const rAmGraphData = selector<GraphData>({
  key: 'rAmGraphData',
  get: async ({ get }: IRecoilGetParams) => {
    const epochs = get(rAmEpochs);
    const epochsMap = iti(epochs).toMap((e) => e.id);
    const gifts = iti(get(rAmGifts));
    const profileMap = get(rUserProfileMap);
    if (epochs.length === 0) {
      return { links: [], nodes: [] };
    }

    const links = gifts
      .filter((g) => g.tokens > 0)
      .map(
        (g): IMapEdge => {
          const epoch = epochsMap.get(g.epoch_id);
          if (epoch === undefined) {
            throw `Missing epoch.id = ${
              g.id
            } in rAmGraphData. have ${epochs.map((e) => e.id)}`;
          }
          return {
            id: g.id,
            source: g.sender_address,
            target: g.recipient_address,
            epochId: epoch.id,
            epochNumber: epoch.number ?? 1, // ugh
            tokens: g.tokens,
          };
        }
      );
    return {
      links: links.toArray(),
      nodes: links
        .map(({ source, target, epochId }) => [
          `${epochId}@${source}`,
          `${epochId}@${target}`,
        ])
        .flat((pair) => pair)
        .distinct()
        .map((key) => {
          const [epochIdStr, address] = key.split('@');
          const profile = profileMap.get(address);
          const epoch = epochsMap.get(Number(epochIdStr));
          if (profile === undefined) {
            throw `Missing profile = ${address} in rAmGraphData`;
          }
          if (epoch === undefined) {
            throw `Missing epoch = ${epochIdStr} in rAmGraphData. have ${epochs.map(
              (e) => e.id
            )}`;
          }
          const user = profile.users.find(
            (u) => u.circle_id === epoch.circle_id
          );
          if (user === undefined) {
            throw `Missing user of circle = ${epoch.circle_id} in rAmGraphData at ${profile.address}`;
          }

          return {
            id: address,
            img: profile.avatar ?? '',
            name: user.name,
            epochId: epoch.id,
            userId: user.id,
          };
        })
        .groupBy((n) => n.id)
        .map(
          ([, n]): IMapNode => {
            const epochIds = n.map((m) => m.epochId);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { epochId, ...node } = assertDef(
              n.first(),
              'rAmGraphData, node with epochIds'
            );
            return {
              ...node,
              epochIds: epochIds.toArray(),
            };
          }
        )
        .toArray(),
    };
  },
});
export const useAmGraphData = () => useRecoilValue(rAmGraphData);

export const rAmActiveNodes = selector<Set<string>>({
  key: 'rAmActiveNodes',
  get: async ({ get }: IRecoilGetParams) => {
    const epochId = get(rAmEpochId);
    if (epochId === undefined) {
      return new Set();
    }
    const { nodes } = (get(rAmGraphData) as unknown) as { nodes: IMapNode[] };
    const includeEpoch =
      epochId === -1 ? () => true : (id: number) => epochId === id;
    return iti(nodes)
      .filter((n) => n.epochIds.some((id) => includeEpoch(id)))
      .map((n) => n.id)
      .toSet();
  },
});

export const rAmOutFrom = selector<Map<string, Uint32Array>>({
  key: 'rAmOutFrom',
  get: async ({ get }: IRecoilGetParams) => {
    const epochId = get(rAmEpochId);
    const includeEpoch =
      epochId === -1 ? () => true : (id: number) => epochId === id;
    return iti(get(rAmGraphData).links as IMapEdge[])
      .filter((l) => includeEpoch(l.epochId))
      .groupBy((l) => l.source)
      .toMap(
        ([address]) => address,
        ([, ls]) => new Uint32Array(ls.map((l) => l.id).toArray())
      );
  },
});

export const rAmInTo = selector<Map<string, Uint32Array>>({
  key: 'rAmInTo',
  get: async ({ get }: IRecoilGetParams) => {
    const epochId = get(rAmEpochId);
    const includeEpoch =
      epochId === -1 ? () => true : (id: number) => epochId === id;
    return iti(get(rAmGraphData).links as IMapEdge[])
      .filter((l) => includeEpoch(l.epochId))
      .groupBy((l) => l.target)
      .toMap(
        ([address]) => address,
        ([, ls]) => new Uint32Array(ls.map((l) => l.id).toArray())
      );
  },
});

export const rAmOutFromTokens = selector<Map<string, Uint32Array>>({
  key: 'rAmOutFromTokens',
  get: async ({ get }: IRecoilGetParams) => {
    const giftMap = get(rGiftsMap);
    return iti(get(rAmOutFrom)).toMap(
      ([address]) => address,
      ([, ls]) =>
        ls.map(
          (l) =>
            assertDef(giftMap.get(l), `rAmOutFromTokens giftMap.get ${l}`)
              .tokens
        )
    );
  },
});

export const rAmInFromTokens = selector<Map<string, Uint32Array>>({
  key: 'rAmInFromTokens',
  get: async ({ get }: IRecoilGetParams) => {
    const giftMap = get(rGiftsMap);
    return iti(get(rAmInTo)).toMap(
      ([address]) => address,
      ([, ls]) =>
        ls.map(
          (l) =>
            assertDef(giftMap.get(l), `rAmInFromTokens giftMap.get ${l}`).tokens
        )
    );
  },
});

export const rAmNodeSearchStrings = selector<Map<string, string>>({
  key: 'rAmNodeSearchStrings',
  get: async ({ get }: IRecoilGetParams) => {
    const profileMap = get(rUserProfileMap);
    return iti(get(rAmGraphData).nodes as IMapNode[]).toMap(
      ({ id }) => id,
      ({ id }) => {
        const profile = profileMap.get(id);
        if (profile === undefined) {
          return '';
        }
        const selectedCircleId = get(rSelectedCircleId) ?? -1;
        const user = profile.users.find(
          (u) => u.circle_id === selectedCircleId
        );

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

export const rAmBag = selector<Set<string>>({
  key: 'rAmBag',
  get: async ({ get }: IRecoilGetParams) => {
    const regex = get(rAmSearchRegex);
    if (regex === undefined) {
      return new Set<string>();
    }
    const activeNodes = get(rAmActiveNodes);
    const searchStrings = get(rAmNodeSearchStrings);
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

export const rAmResults = selector<IFilledProfile[]>({
  key: 'rAmResults',
  get: async ({ get }: IRecoilGetParams) => {
    const profileMap = get(rUserProfileMap);
    const bag = get(rAmBag);
    const activeNodes = get(rAmActiveNodes);
    const includeAddr = bag.size ? (addr: string) => bag.has(addr) : () => true;
    return iti(get(rAmGraphData).nodes as IMapNode[])
      .filter((n) => activeNodes.has(n.id) && includeAddr(n.id))
      .map((n) => assertDef(profileMap.get(n.id), 'rAmResults'))
      .toArray();
  },
});
export const useAmResults = () => useRecoilValue(rAmResults);

interface IMeasures {
  min: number;
  max: number;
  measures: Map<string, number>;
}

export const rAmMeasures = selectorFamily<IMeasures, MetricEnum>({
  key: 'rAmMeasures',
  get: (metric: MetricEnum) => ({ get }: IRecoilGetParams) => {
    const actives = get(rAmActiveNodes);
    const outFrom = get(rAmOutFromTokens);
    const inTo = get(rAmInFromTokens);
    let measures = new Map<string, number>();
    switch (metric) {
      case 'give': {
        measures = iti(actives).toMap(
          (address) => address,
          (address) => iti(inTo.get(address) ?? [0]).sum() as number
        );
        break;
      }
      case 'gave': {
        measures = iti(actives).toMap(
          (address) => address,
          (address) => iti(outFrom.get(address) ?? [0]).sum() as number
        );
        break;
      }
      case 'in_degree': {
        measures = iti(actives).toMap(
          (address) => address,
          (address) =>
            iti(inTo.get(address) ?? [0])
              .map(() => 1)
              .sum() as number
        );
        break;
      }
      case 'out_degree': {
        measures = iti(actives).toMap(
          (address) => address,
          (address) =>
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
            .map((arr) => arr.length)
            .max() ?? 1
        );
        measures = iti(actives).toMap(
          (address) => address,
          (address) =>
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
export const useAmMeasures = (metric: MetricEnum) =>
  useRecoilValue(rAmMeasures(metric));

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

export const rAmContext = selector<IMapContext>({
  key: 'rAmContext',
  get: async ({ get }: IRecoilGetParams) => {
    const egoAddress = get(rAmEgoAddress);
    const bag = get(rAmBag);
    const epochId = get(rAmEpochId);
    const metric = get(rAmMetric);
    const giftMap = get(rGiftsMap);
    const outFrom = get(rAmOutFrom);
    const inTo = get(rAmInTo);
    const { min, max, measures } = get(rAmMeasures(metric));

    if (epochId === undefined) {
      return AmContextDefault;
    }

    const isGivingTo = (sAddress: string, oAddress: string) =>
      inTo
        .get(sAddress)
        ?.some(
          (id) =>
            assertDef(giftMap.get(id), `isGivingTo ${id}`).sender_address ===
            oAddress
        ) ?? false;

    const isReceivingFrom = (sAddress: string, oAddress: string) =>
      outFrom
        .get(sAddress)
        ?.some(
          (id) =>
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
      iti(bag).some((address) => isNeighbor(address, node, direction));

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

    const getCurvature = (edge: IMapEdgeFG): number => {
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
export const useAmContext = () => useRecoilValueLoadable(rAmContext);
