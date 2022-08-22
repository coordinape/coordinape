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
