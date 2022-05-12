export const isUserAdmin = (user?: { role: number }) => {
  return user?.role === 1;
};
