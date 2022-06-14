import { apiFetch, Thunder } from './__generated__/zeus';

export const makeThunder = (url: string, adminSecret: string) => {
  return Thunder(async (...params) => {
    return apiFetch([
      url,
      {
        method: 'POST',
        headers: {
          'x-hasura-admin-secret': adminSecret,
          'Hasura-Client-Name': 'serverless-function',
        },
      },
    ])(...params);
  });
};
