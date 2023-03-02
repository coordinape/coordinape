import { isUserAdmin } from 'lib/users';

import { NavCircle, NavOrg } from './getNavData';

export const isCircleAdmin = (circle: NavCircle) => {
  return circle.users.some(isUserAdmin);
};

export const isOrgAdmin = (org: NavOrg) => {
  return org.circles.some(c => c.users.some(u => u.role == 1));
};
