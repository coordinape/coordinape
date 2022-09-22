import { useEffect } from 'react';

import {
  RecoilState,
  SetRecoilState,
  useRecoilCallback,
  useRecoilSnapshot,
} from 'recoil';

import { rApiFullCircle, rApiManifest } from 'recoilState';

import { IApiCircle, IApiProfile, IApiUser, IProtocol } from 'types';

const organization: IProtocol = {
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
  organization: organization,
  organization_id: 1,
  team_selection: false,
  vouching: false,
  vouching_text: '',
  updated_at: new Date(0),
  fixed_payment_token_type: '',
};

const profile: IApiProfile = {
  id: 1,
  address: '0x100020003000400050006000700080009000a000',
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
  fixed_payment_amount: 0,
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

export const fixtures = { circle, manifest, profile, organization, user };

// the first type is for snapshot_UNSTABLE;
// the second one is for useRecoilCallback
type SetFn =
  | SetRecoilState
  | (<T>(
      recoilVal: RecoilState<T>,
      valOrUpdater: ((currVal: T) => T) | T
    ) => void);

const setupRecoilState = (set: SetFn) => {
  set(rApiManifest, () => manifest);

  set(rApiFullCircle, () => {
    const map = new Map();
    map.set(manifest.circle.circle.id, manifest.circle);
    return map;
  });
};

export const useMockRecoilState = (
  // just provide an empty object as this argument, and the hook will set the
  // `snapshot` and `release` properties on it. you can use `snapshot` to read
  // recoil state from your test (i.e. with `snapshot.getPromise`) and you can
  // clean up afterward with `release`.
  externalState: any,

  // pass a callback to do any additional setting of recoil state beyond the
  // default installation of the fixtures above.
  customSetter?: (set: SetFn) => void
) => {
  const setup = useRecoilCallback(({ set }) => () => {
    setupRecoilState(set);
    if (customSetter) customSetter(set);
  });

  useEffect(() => {
    setup();
  }, []);

  const snapshot = useRecoilSnapshot();
  if (snapshot && externalState.snapshot !== snapshot) {
    if (externalState.release) externalState.release();
    externalState.snapshot = snapshot;
    externalState.release = snapshot.retain();
  }
};
