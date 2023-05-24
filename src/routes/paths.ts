import type { Location } from 'react-router-dom';

import { APP_PATH_CREATE_CIRCLE } from 'utils/domain';

export const EXTERNAL_URL_DOCS = 'https://docs.coordinape.com';
export const EXTERNAL_URL_DOCS_ORG_MEMBERSHIP =
  'https://docs.coordinape.com/get-started/get-started/new-coordinape-admins/managing-organization-membership';
export const EXTERNAL_URL_SCHEDULE_WALKTHROUGH =
  'https://coordinape.com/schedule-a-walkthrough?utm_medium=helpbutton&utm_campaign=onboarding';
export const EXTERNAL_URL_TWITTER = 'https://twitter.com/coordinape';
export const EXTERNAL_URL_DISCORD = 'https://discord.coordinape.com';
export const EXTERNAL_URL_GET_STARTED =
  'https://docs.coordinape.com/get-started/get-started';
export const EXTERNAL_URL_GET_STARTED_MEMBER =
  'https://docs.coordinape.com/get-started/get-started/new-coordinape-members';
export const EXTERNAL_URL_GET_STARTED_TUTORIAL_VIDEO =
  'https://www.youtube.com/watch?v=j2ixf0Isuuo';
export const EXTERNAL_URL_DISCORD_SUPPORT =
  'https://discord.coordinape.com/support';
export const EXTERNAL_URL_WHY_COORDINAPE_IN_CIRCLE =
  'https://coordinape.com/post/why-is-coordinape-in-my-circle?utm_source=coordinape-app&utm_medium=tooltip&utm_campaign=coordinapeincircle';
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

const orgPath = (suffix: string) => (orgId: number) =>
  `/organizations/${orgId}/${suffix}`;

export const paths = {
  // circle-specific
  circleAdmin: circlePath('admin'),
  circleAdminApi: circlePath('admin/api'),
  connectIntegration: circlePath('admin/connect-integration'),
  contributions: circlePath('contributions'),
  give: circlePath('give'),
  circle: (circleId: number) => `/circles/${circleId}`,
  epochs: circlePath('epochs'),
  members: circlePath('members'),
  membersAdd: circlePath('members/add'),
  membersNominate: circlePath('members/nominate'),
  vouching: circlePath('vouching'),
  distributions: (circleId: number, epochId: number | string) =>
    `/circles/${circleId}/distributions/${epochId}`,
  map: (circleId: number, params?: { highlight?: string }) =>
    withSearchParams(`/circles/${circleId}/map`, params),

  // other
  claims: '/claims',
  createCircle: APP_PATH_CREATE_CIRCLE,
  developers: '/developers',
  discordLink: '/discord/link',
  home: '/',
  cosoul: '/cosoul',
  mint: '/cosoul/mint',
  cosoulView: (address: string) => `/cosoul/${address}`,

  profile: (address: string) => `/profile/${address}`,
  organization: (orgId: string) => `/organizations/${orgId}`,
  orgActivity: orgPath('activity'),
  organizationSettings: orgPath(`settings`),
  vaultsForOrg: orgPath(`vaults`),
  vaultTxs: (orgId: string, address: string) =>
    `/organizations/${orgId}/vaults/${address}/txs`,
  orgMembers: orgPath(`members`),
  orgMembersAdd: orgPath(`members/add`),

  // for circle links
  welcome: (token: string) => `/welcome/${token}`,
  join: (token: string) => `/join/${token}`,
};

export const isCircleSpecificPath = (location: Location) =>
  /\/circles\/\d+/.test(location.pathname);

export const isOrgSpecificPath = (location: Location) =>
  /\/organizations\/\d+/.test(location.pathname);

export const getCircleFromPath = (location: Location) =>
  location.pathname.match(/\/circles\/(\d+)/)?.[1];

export const getOrgFromPath = (location: Location) =>
  location.pathname.match(/\/organizations\/(\d+)/)?.[1] ??
  location.search.match(/org=(\d+)/)?.[1];
