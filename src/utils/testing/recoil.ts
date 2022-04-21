import { RecoilState, SetRecoilState } from 'recoil';

import { rApiFullCircle, rApiManifest } from 'recoilState';

import { IApiCircle, IApiProfile, IApiUser, IProtocol } from 'types';

const protocol: IProtocol = {
  id: 1,
  name: 'Test Org',
  is_verified: false,
  created_at: new Date(0),
  updated_at: new Date(0),
};

const circle: IApiCircle = {
  id: 1,
  auto_opt_out: false,
  created_at: new Date(0),
  default_opt_in: false,
  is_verified: false,
  logo: '',
  min_vouches: 1,
  name: 'Test Circle',
  nomination_days_limit: 7,
  only_giver_vouch: true,
  protocol: protocol,
  protocol_id: 1,
  team_selection: false,
  vouching: false,
  vouching_text: '',
  updated_at: new Date(0),
};

const profile: IApiProfile = {
  id: 1,
  address: '0x100020003000400050006000700080009000a000',
  admin_view: false,
  created_at: '1970-01-01T00:00:00',
  updated_at: '1970-01-01T00:00:00',
};

const user: IApiUser = {
  id: 1,
  address: profile.address,
  bio: 'hello world',
  circle_id: circle.id,
  created_at: '1970-01-01T00:00:00',
  epoch_first_visit: false,
  fixed_non_receiver: false,
  give_token_received: 0,
  give_token_remaining: 100,
  name: 'Me',
  non_giver: false,
  non_receiver: false,
  role: 0,
  starting_tokens: 100,
  updated_at: '1970-01-01T00:00:00',
};

const manifest = {
  active_epochs: [],
  circles: [circle],
  circle: {
    circle,
    epochs: [],
    nominees: [],
    pending_gifts: [],
    token_gifts: [],
    users: [],
  },
  myUsers: [user],
  profile,
};

// the first type is for snapshot_UNSTABLE;
// the second one is for useRecoilCallback
type SetFn =
  | SetRecoilState
  | (<T>(
      recoilVal: RecoilState<T>,
      valOrUpdater: ((currVal: T) => T) | T
    ) => void);

export const setupRecoilState = (set: SetFn) => {
  set(rApiManifest, () => manifest);

  set(rApiFullCircle, () => {
    const map = new Map();
    map.set(manifest.circle.circle.id, manifest.circle);
    return map;
  });
};

export const fixtures = { circle, manifest, profile, protocol, user };
