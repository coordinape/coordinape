export const getHomePath = () => '/';
export const getAllocationPath = () => '/allocation';
export const getMyTeamPath = () => '/team';
export const getMyEpochPath = () => '/epoch';
export const getGivePath = () => '/give';
export const getMapPath = () => '/map';
export const getHistoryPath = () => '/history';
export const getAdminPath = () => '/admin';
export const getProfilePath = (address: string) => `/profile/${address}`;

export const getMainNavigation = ({
  showAdmin,
}: { showAdmin?: boolean } = {}) => {
  const mainItems = [
    { path: getAllocationPath(), label: 'Allocate' },
    { path: getMapPath(), label: 'Map' },
  ];
  const adminItems = [{ path: getAdminPath(), label: 'Admin' }];
  return showAdmin ? [...mainItems, ...adminItems] : mainItems;
};

export const getMenuNavigation = () => [
  { path: getProfilePath('me'), label: 'Profile' },
  { path: getMyEpochPath(), label: 'My Epoch' },
  { path: getMyTeamPath(), label: 'My Team' },
  { path: getHistoryPath(), label: 'My History' },
];
