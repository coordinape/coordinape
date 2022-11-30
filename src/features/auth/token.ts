let token: string | undefined;

export const setAuthToken = (t: string | undefined) => {
  token = t;
};

export const getAuthToken = (required = true) => {
  if (!token && required) throw new Error('auth token not set');
  return token;
};
