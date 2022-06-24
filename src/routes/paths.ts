import type { Location } from 'react-router-dom';

import { APP_PATH_CREATE_CIRCLE } from 'utils/domain';

export const NEW_CIRCLE_CREATED_PARAMS = '?new-circle';
export const MAP_HIGHLIGHT_PARAM = 'highlight';
export const EXTERNAL_URL_TYPEFORM =
  'https://yearnfinance.typeform.com/to/egGYEbrC';
export const EXTERNAL_URL_DOCS = 'https://docs.coordinape.com';
export const EXTERNAL_URL_SCHEDULE_WALKTHROUGH =
  'https://coordinape.com/schedule-a-walkthrough?utm_medium=helpbutton&utm_campaign=onboarding';
export const EXTERNAL_URL_LANDING_PAGE = 'https://coordinape.com';
export const EXTERNAL_URL_DOCS_REGIFT = `${EXTERNAL_URL_DOCS}/welcome/new-feature-regift`;
export const EXTERNAL_URL_TWITTER = 'https://twitter.com/coordinape';
export const EXTERNAL_URL_DISCORD = 'https://discord.coordinape.com';
export const EXTERNAL_URL_GET_STARTED =
  'https://docs.coordinape.com/get-started/get-started';
export const EXTERNAL_URL_LEARN_ABOUT_VAULTS =
  'https://docs.coordinape.com/info/documentation/coordinape-vaults';
export const EXTERNAL_URL_YEARN_VAULTS = 'https://yearn.finance/vaults';
export const EXTERNAL_URL_DISCORD_SUPPORT =
  'https://discord.coordinape.com/support';
export const EXTERNAL_URL_MEDIUM_ARTICLE =
  'https://medium.com/iearn/decentralized-payroll-management-for-daos-b2252160c543';
// TODO: Change this to something more specific to feedback.
export const EXTERNAL_URL_FEEDBACK =
  'https://coordinape.notion.site/Why-is-Coordinape-in-my-Circle-fd17133a82ef4cbf84d4738311fb557a';
export const EXTERNAL_URL_TYPEFORM_FEEDBACK =
  'https://fe7gssn4rhy.typeform.com/to/nvOUfHKN';
export const EXTERNAL_URL_MAILTO_SUPPORT = 'mailto:support@coordinape.com';

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

const circlePath = (suffix: string) => (circleId: number) =>
  `/circles/${circleId}/${suffix}`;

export const paths = {
  // circle-specific
  allocation: circlePath('allocation'),
  circleAdmin: circlePath('admin'),
  circleAdminApi: circlePath('admin/api'),
  connectIntegration: circlePath('admin/connect-integration'),
  epoch: circlePath('epoch'),
  give: circlePath('give'),
  history: circlePath('history'),
  members: circlePath('members'),
  membersAdd: circlePath('members/add'),
  team: circlePath('team'),
  vouching: circlePath('vouching'),
  distributions: (circleId: number, epochId: number | string) =>
    `/circles/${circleId}/distributions/${epochId}`,
  map: (circleId: number, params?: { highlight?: string }) =>
    withSearchParams(`/circles/${circleId}/map`, params),

  // other
  circles: '/circles', // the overview page
  claims: '/claims',
  createCircle: APP_PATH_CREATE_CIRCLE,
  developers: '/developers',
  home: '/',

  profile: (address: string) => `/profile/${address}`,
  vaults: '/vaults',
  vaultTxs: (address: string) => `${paths.vaults}/${address}/txs`,

  // for circle links
  invite: (token: string) => `/invite/${token}`,
  join: (token: string) => `/join/${token}`,
};

export const isCircleSpecificPath = (location: Location) =>
  location.pathname.match(/\/circles\/\d+/);
