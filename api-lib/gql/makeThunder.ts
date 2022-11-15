import { apiFetch, Thunder } from './__generated__/zeus';

type ThunderOptions = {
  url: string;
  headers: Record<string, string>;
  timeout?: number;
};

export const makeThunder = ({ url, headers, timeout = 0 }: ThunderOptions) =>
  Thunder(async (...params) =>
    apiFetch([url, { method: 'POST', headers, timeout: timeout }])(...params)
  );
