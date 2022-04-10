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
export const EXTERNAL_URL_DISCORD = 'https://discord.gg/coordinape';
export const EXTERNAL_URL_DISCORD_SUPPORT = 'https://discord.gg/BG3fDAvzuB';
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
  epoch: '/epoch',
  give: '/give',
  history: '/history',
  home: '/',
  map: '/map',
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

export const circleSpecificPaths = at(paths, circleSpecificPathKeys);

// these getters for static paths are deprecated -- use paths above instead
export const getHomePath = () => paths.home;
export const getAllocationPath = () => paths.allocation;
export const getMyTeamPath = () => paths.team;
export const getMyEpochPath = () => paths.epoch;
export const getGivePath = () => paths.give;
export const getVouchingPath = () => paths.vouching;
export const getHistoryPath = () => paths.history;
export const getVaultsPath = () => paths.vaults;

// this one is different because it's used on the landing page
export const getCreateCirclePath = () => APP_PATH_CREATE_CIRCLE;

export const getMapPath = (params?: { highlight?: string }) =>
  withSearchParams('/map', params);
export const getDistributePath = (epochId: number | string) =>
  `/admin/distribute/${epochId}`;
export const getProfilePath = ({ address }: { address: string }) =>
  `/profile/${address}`;

export interface INavItem {
  label: string;
  path: string;
  icon?: (props: any) => JSX.Element;
  isExternal?: boolean;
  subItems?: INavItem[];
}

const NAV_ITEM_LANDING_PAGE = {
  path: EXTERNAL_URL_LANDING_PAGE,
  label: 'coordinape.com',
  isExternal: true,
};
const NAV_ITEM_DISCORD = {
  path: EXTERNAL_URL_DISCORD,
  label: 'Discord',
  isExternal: true,
};
const NAV_ITEM_TWITTER = {
  path: EXTERNAL_URL_TWITTER,
  label: 'Twitter',
  isExternal: true,
};
const NAV_ITEM_DOCS = {
  path: EXTERNAL_URL_DOCS,
  label: 'Docs',
  isExternal: true,
};

export const getNavigationFooter = (): INavItem[] => [
  NAV_ITEM_LANDING_PAGE,
  NAV_ITEM_DISCORD,
  NAV_ITEM_TWITTER,
  NAV_ITEM_DOCS,
];
