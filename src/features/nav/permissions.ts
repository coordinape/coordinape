import { isUserAdmin } from 'lib/users';

import { NavCircle, NavOrg } from './getNavData';

export const isCircleAdmin = (circle: NavCircle) =>
  circle.users.some(isUserAdmin);

export const isOrgAdmin = (org: NavOrg) => org.myCircles.some(isCircleAdmin);
