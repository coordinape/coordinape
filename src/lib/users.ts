export const isUserAdmin = (user?: { role?: number }) => {
  return user?.role === 1;
};

export const isUserMember = (user?: { role?: number }) => {
  return user?.role === 0;
};
