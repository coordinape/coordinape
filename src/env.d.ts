/// <reference types="vite/client" />
import 'vite/client';

interface ImportMetaEnv {
  readonly VITE_HASURA_URL: string;
  readonly VITE_MIXPANEL_TOKEN: string;
  readonly VITE_MIXPANEL_HOST: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
