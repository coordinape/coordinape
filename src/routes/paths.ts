import at from 'lodash/at';

import { APP_PATH_CREATE_CIRCLE } from 'utils/domain';

export const NEW_CIRCLE_CREATED_PARAMS = '?new-circle';
export const MAP_HIGHLIGHT_PARAM = 'highlight';
export const EXTERNAL_URL_TYPEFORM =
  'https://yearnfinance.typeform.com/to/egGYEbrC';
export const EXTERNAL_URL_DOCS = 'https://docs.coordinape.com';
export const EXTERNAL_URL_LANDING_PAGE = 'https://coordinape.com';
export const EXTERNAL_URL_DOCS_REGIFT = `${EXTERNAL_URL_DOCS}/welcome/new-feature-regift`;
export const EXTERNAL_URL_TWITTER = 'https://twitter.com/coordinape';
export const EXTERNAL_URL_DISCORD = 'https://discord.coordinape.com';
export const EXTERNAL_URL_DISCORD_SUPPORT =
  'https://discord.coordinape.com/support';
export const EXTERNAL_URL_MEDIUM_ARTICLE =
  'https://medium.com/iearn/decentralized-payroll-management-for-daos-b2252160c543';
// TODO: Change this to something more specific to feedback.
export const EXTERNAL_URL_FEEDBACK =
  'https://coordinape.notion.site/Why-is-Coordinape-in-my-Circle-fd17133a82ef4cbf84d4738311fb557a';

const toSearchString = (params: Record<string, string | number>) =>
  Object.entries(params)
    .reduce<URLSearchParams>((p, [key, val]) => {
      p.set(key, val.toString());
      return p;
    }, new URLSearchParams())
    .toString();

const withSearchParams = (
  path: string,
  params?: Record<string, string | number>
) =>
  params && Object.keys(params).length > 0
    ? `${path}?${toSearchString(params)}`
    : path;

export const paths = {
  adminCircles: '/admin/circles',
  allocation: '/allocation',
  circles: '/circles',
  connectIntegration: '/connect-integration',
  createCircle: APP_PATH_CREATE_CIRCLE,
  developers: '/developers',
  distributions: (epochId: number | string) =>
    `/admin/distributions/${epochId}`,
  epoch: '/epoch',
  give: '/give',
  history: '/history',
  home: '/',
  map: (params?: { highlight?: string }) => withSearchParams('/map', params),
  profile: (address: string) => `/profile/${address}`,
  team: '/team',
  vaults: '/admin/vaults',
  vaultTxs: (id: string) => `${paths.vaults}/${id}/txs`,
  vouching: '/vouching',
};

const circleSpecificPathKeys: (keyof typeof paths)[] = [
  'adminCircles',
  'allocation',
  'epoch',
  'give',
  'history',
  'map',
  'team',
  'vouching',
];

// `as any` works around a typing bug in `at`
export const circleSpecificPaths = at(paths, circleSpecificPathKeys).map(x =>
  typeof x === 'function' ? (x as any)() : x
);
