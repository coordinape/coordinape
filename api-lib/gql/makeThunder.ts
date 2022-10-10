import { apiFetch, Thunder } from './__generated__/zeus';

export type UserOptions = {
  profileId: number;
  address: string;
};

type AdminOptions = {
  adminSecret: string;
};

type Options = UserOptions | AdminOptions;

type ThunderOptions = {
  url: string;
  options: Options;
};

const mapOptionsToHeaders = (options: UserOptions) => ({
  'x-hasura-role': 'user',
  'x-hasura-address': options.address,
  'x-hasura-user-id': options.profileId.toString(),
});

export const makeThunder = ({ url, options }: ThunderOptions) => {
  return Thunder(async (...params) => {
    return apiFetch([
      url,
      {
        method: 'POST',
        headers:
          'adminSecret' in options
            ? {
                'x-hasura-admin-secret': options.adminSecret,
              }
            : {
                ...mapOptionsToHeaders(options),
                authorization: 'test-skip-auth',
              },
      },
    ])(...params);
  });
};
