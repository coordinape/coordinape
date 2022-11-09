import { apiFetch, Thunder } from './__generated__/zeus';

type ThunderOptions = {
  url: string;
  headers: Record<string, string>;
};

export const makeThunder = ({ url, headers }: ThunderOptions) =>
  Thunder(async (...params) =>
    apiFetch([url, { method: 'POST', headers }])(...params)
  );
