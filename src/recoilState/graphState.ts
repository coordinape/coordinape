export const graphStateNothing = 'graphStateNothing';
// type IProfiles = Map<string, IGraphProfile>;
// export const rProfiles = selector<IProfiles>({
//   key: 'rProfiles',
//   get: (params: IRecoilGetParams) => {
//     const users = params.get(rUsers);
//     // TODO: Maybe this is slow to rewrite this every time.
//     const result = new Map() as Map<string, IGraphProfile>;
//     users.forEach((user) => {
//       const address = user.address;
//       const profile = result.get(address);
//       if (profile) {
//         profile.userIds.push(user.id);
//         result.set(address, profile);
//       }
//       result.set(address, { address, userIds: [user.id] });
//     });
//     return result;
//   },
// });

// a vis will have a selectorFamily so that multiple versions
// can be implemented across the app

// Vis parent will be a pattern
// with a hook, useCircle

// What is an example:
// Nodes
// Nodes belong to a GraphView

// GraphView is how slicing is created
// Set of Cirlces
// Set of Epochs
// An optional ego focus and degree

// Recoil is awesome because it will cache the GraphView Params?

// For the links that is intense
// because there could be links between views

// A slice is an array of GraphView
// For the slice each Link(GraphView) will be GIVE
// and then there can be a link

// What about metrics?
// metrics are usually specific to a GraphView
// there could be slice level metrics?
// Really metrics are either Profile specific or Node specific
//
// Metrics are keyed by Node-GraphView or Profile

// What about the dv/dt metrics
// For example ego graph accross epochs

// What other state to store here
// logged in address
// available circleIds
// later perhaps -
