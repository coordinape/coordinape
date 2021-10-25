import { matchPath } from 'react-router-dom';

import { IN_PRODUCTION } from 'utils/domain';

export const AUTO_OPEN_WALLET_DIALOG_PARAMS = '?open-wallet';
export const NEW_CIRCLE_CREATED_PARAMS = '?new-circle';
export const MAP_HIGHLIGHT_PARAM = 'highlight';
export const EXTERNAL_URL_TYPEFORM =
  'https://yearnfinance.typeform.com/to/egGYEbrC';
export const EXTERNAL_URL_DOCS = 'https://docs.coordinape.com';
export const EXTERNAL_URL_LANDING_PAGE = 'https://coordinape.com';
export const EXTERNAL_URL_DOCS_REGIFT = `${EXTERNAL_URL_DOCS}/welcome/new-feature-regift`;
export const EXTERNAL_URL_TWITTER = 'https://twitter.com/coordinape';
export const EXTERNAL_URL_DISCORD = 'https://discord.gg/DPjmDWEUH5';
export const EXTERNAL_URL_MEDIUM_ARTICLE =
  'https://medium.com/iearn/decentralized-payroll-management-for-daos-b2252160c543';

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
export const getOverviewPath = () => '/admin/overview';
export const getVaultsPath = () => '/admin/vaults';
export const getCirclesPath = () => '/admin/circles';
export const getCreateCirclePath = () => '/new-circle';
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

export const getAdminNavigation = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asCircleAdmin,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asVouchingEnabled,
}: {
  asCircleAdmin?: boolean;
  asVouchingEnabled?: boolean;
} = {}): INavItem[] => {
  const vaultsItem = [{ path: getVaultsPath(), label: 'Vaults' }];
  const circlesItem = [{ path: getCirclesPath(), label: 'Circles' }];
  const overviewItem = [{ path: getOverviewPath(), label: 'Overview' }];
  const mainItems = [...overviewItem, ...vaultsItem, ...circlesItem];

  return mainItems;
};

export const getMenuNavigation = (): INavItem[] => [
  NAV_ITEM_PROFILE,
  NAV_ITEM_EPOCH,
  NAV_ITEM_TEAM,
  { path: getHistoryPath(), label: 'My History' },
  NAV_ITEM_DOCS,
];

export const checkActive = (pathname: string, navItem: INavItem): boolean =>
  !!matchPath(pathname, {
    exact: true,
    path: navItem.path,
  }) ||
  !!navItem.subItems?.some(
    ({ path }) => !!matchPath(pathname, { exact: true, path })
  );

export const getNavigationFooter = (): INavItem[] => [
  NAV_ITEM_LANDING_PAGE,
  NAV_ITEM_DISCORD,
  NAV_ITEM_TWITTER,
  NAV_ITEM_DOCS,
];
