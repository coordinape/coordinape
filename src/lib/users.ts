import assert from 'assert';

import isNil from 'lodash/isNil';

import { COORDINAPE_USER_ADDRESS } from '../config/constants';

export enum Role {
  MEMBER = 0,
  ADMIN = 1,
  COORDINAPE = 2,
}

export const isUserAdmin = (user?: { role?: number }) => {
  return user?.role === Role.ADMIN;
};

export const isUserMember = (user?: { role?: number }) => {
  return user?.role === Role.MEMBER;
};

export const isUserCoordinape = (user: { role?: number; address?: string }) => {
  assert(!isNil(user.role) || user.address, 'user must have role or address');
  return (
    user.role === Role.COORDINAPE || user?.address === COORDINAPE_USER_ADDRESS
  );
};
