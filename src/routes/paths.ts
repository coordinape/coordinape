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
}

export const getMainNavigation = ({
  asCircleAdmin,
}: { asCircleAdmin?: boolean } = {}): INavItem[] => {
  const mainItems = [
    { path: getAllocationPath(), label: 'Allocate' },
    { path: getMapPath(), label: 'Map' },
  ];
  const adminItems = [{ path: getAdminPath(), label: 'Admin' }];
  return asCircleAdmin ? [...mainItems, ...adminItems] : mainItems;
};

export const getMenuNavigation = (): INavItem[] => [
  // { path: getProfilePath('me'), label: 'Profile' },
  { path: getMyEpochPath(), label: 'My Epoch' },
  { path: getMyTeamPath(), label: 'My Team' },
  { path: getHistoryPath(), label: 'My History' },
];
