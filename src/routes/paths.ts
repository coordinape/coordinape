import { IN_PRODUCTION } from 'config/env';
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

export const getHomePath = () => '/';
export const getAllocationPath = () => '/allocation';
export const getMyTeamPath = () => '/team';
export const getMyEpochPath = () => '/epoch';
export const getGivePath = () => '/give';
export const getMapPath = (params?: { highlight?: string }) =>
  withSearchParams('/map', params);
export const getVouchingPath = () => '/vouching';
export const getHistoryPath = () => '/history';
export const getAdminPath = () => '/admin';
export const getVaultsPath = () => '/admin/vaults';
export const getCirclesPath = () => '/admin/circles';
export const getNewCirclePath = () => '/new-circle';
export const getCreateCirclePath = () => APP_PATH_CREATE_CIRCLE;
export const getDistributePath = (epochId: number | string) =>
  `/admin/distribute/${epochId}`;
export const getProfilePath = ({ address }: { address: string }) =>
  `/profile/${address}`;

interface INavItem {
  label: string;
  path: string;
  icon?: (props: any) => JSX.Element;
  isExternal?: boolean;
  subItems?: INavItem[];
}

const NAV_ITEM_PROFILE = {
  path: getProfilePath({ address: 'me' }),
  label: 'My Profile',
};
const NAV_ITEM_NEW_CIRCLE = { path: getNewCirclePath(), label: ' Add Circle' };
const NAV_ITEM_EPOCH = { path: getMyEpochPath(), label: 'My Epoch' };
const NAV_ITEM_TEAM = { path: getMyTeamPath(), label: 'My Team' };
const NAV_ITEM_GIVE = { path: getGivePath(), label: 'My Allocation' };
const NAV_ITEM_ALLOCATE = {
  path: getAllocationPath(),
  label: 'Allocate',
  subItems: [NAV_ITEM_EPOCH, NAV_ITEM_TEAM, NAV_ITEM_GIVE],
};
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

export const getMainNavigation = ({
  asCircleAdmin,
  asVouchingEnabled,
}: {
  asCircleAdmin?: boolean;
  asVouchingEnabled?: boolean;
} = {}): INavItem[] => {
  let mainItems = [NAV_ITEM_ALLOCATE, { path: getMapPath(), label: 'Map' }];
  const vouchingItems = [{ path: getVouchingPath(), label: 'Vouching' }];
  if (IN_PRODUCTION) {
    const adminItems1 = [{ path: getAdminPath(), label: 'Admin' }];
    if (asVouchingEnabled) {
      mainItems = [...mainItems, ...vouchingItems];
    }
    if (asCircleAdmin) {
      mainItems = [...mainItems, ...adminItems1];
    }
  } else {
    const adminItems1 = [{ path: getVaultsPath(), label: 'Admin' }];
    if (asVouchingEnabled) {
      mainItems = [...mainItems, ...vouchingItems];
    }
    if (asCircleAdmin) {
      mainItems = [...mainItems, ...adminItems1];
    }
  }

  return mainItems;
};

export const getAdminNavigation = (): INavItem[] => [
  { path: getVaultsPath(), label: 'Vaults' },
  { path: getCirclesPath(), label: 'Circles' },
];

export const getMenuNavigation = (): INavItem[] => [
  NAV_ITEM_PROFILE,
  NAV_ITEM_EPOCH,
  NAV_ITEM_TEAM,
  { path: getHistoryPath(), label: 'My History' },
  NAV_ITEM_NEW_CIRCLE,
  NAV_ITEM_DOCS,
];

export const getRelatedNavigation = (): INavItem[] => [
  NAV_ITEM_NEW_CIRCLE,
  NAV_ITEM_DOCS,
];

export const getNavigationFooter = (): INavItem[] => [
  NAV_ITEM_LANDING_PAGE,
  NAV_ITEM_DISCORD,
  NAV_ITEM_TWITTER,
  NAV_ITEM_DOCS,
];
