import { NavCircle, NavOrg } from './getNavData';

export const isCircleAdmin = (circle: NavCircle) => {
  return circle.users.some(u => u.role == 1);
};

export const isOrgAdmin = (org: NavOrg) => {
  return org.circles.some(c => c.users.some(u => u.role == 1));
};
