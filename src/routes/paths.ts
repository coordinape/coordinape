import { matchPath } from 'react-router-dom';

export const AUTO_OPEN_WALLET_DIALOG_PARAMS = '?open-wallet';
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

export const getHomePath = () => '/';
export const getAllocationPath = () => '/allocation';
export const getMyTeamPath = () => '/team';
export const getMyEpochPath = () => '/epoch';
export const getGivePath = () => '/give';
export const getMapPath = () => '/map';
export const getHistoryPath = () => '/history';
export const getAdminPath = () => '/admin';
export const getProfilePath = (address: string) => `/profile/${address}`;

interface INavItem {
  label: string;
  path: string;
  icon?: (props: any) => JSX.Element;
  subItems?: INavItem[];
}

const NAV_ITEM_PROFILE = { path: getProfilePath('me'), label: 'My Profile' };
const NAV_ITEM_EPOCH = { path: getMyEpochPath(), label: 'My Epoch' };
const NAV_ITEM_TEAM = { path: getMyTeamPath(), label: 'My Team' };
const NAV_ITEM_GIVE = { path: getGivePath(), label: 'My Allocation' };
const NAV_ITEM_ALLOCATE = {
  path: getAllocationPath(),
  label: 'Allocate',
  subItems: [NAV_ITEM_EPOCH, NAV_ITEM_TEAM, NAV_ITEM_GIVE],
};

export const getMainNavigation = ({
  asCircleAdmin,
}: { asCircleAdmin?: boolean } = {}): INavItem[] => {
  const mainItems = [NAV_ITEM_ALLOCATE, { path: getMapPath(), label: 'Map' }];
  const adminItems = [{ path: getAdminPath(), label: 'Admin' }];
  return asCircleAdmin ? [...mainItems, ...adminItems] : mainItems;
};

export const getMenuNavigation = (): INavItem[] => [
  NAV_ITEM_PROFILE,
  NAV_ITEM_EPOCH,
  NAV_ITEM_TEAM,
  { path: getHistoryPath(), label: 'My History' },
];

export const checkActive = (pathname: string, navItem: INavItem): boolean =>
  !!matchPath(pathname, {
    exact: true,
    path: navItem.path,
  }) ||
  !!navItem.subItems?.some(
    ({ path }) => !!matchPath(pathname, { exact: true, path })
  );

const NAV_ITEM_LANDING_PAGE = {
  path: EXTERNAL_URL_LANDING_PAGE,
  label: 'coordinape.com',
};
const NAV_ITEM_DISCORD = { path: EXTERNAL_URL_DISCORD, label: 'Discord' };
const NAV_ITEM_TWITTER = { path: EXTERNAL_URL_TWITTER, label: 'Twitter' };
const NAV_ITEM_DOCS = {
  path: EXTERNAL_URL_DOCS,
  label: 'Docs',
};

export const getNavigationFooter = (): INavItem[] => [
  NAV_ITEM_LANDING_PAGE,
  NAV_ITEM_DISCORD,
  NAV_ITEM_TWITTER,
  NAV_ITEM_DOCS,
];
