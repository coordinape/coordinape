import { VERCEL_BRANCH_URL } from '../../api-lib/config';

import { BRANCH_URL, IN_PRODUCTION } from './env';

export const COLINKS_PRODUCTION_URL = 'https://colinks.coordinape.com';
export const COORDINAPE_MARKETING_URL = 'https://coordinape.com';
const GIVE_PRODUCTION_URL = 'https://app.coordinape.com';

export const COLINKS_STAGING_URL = 'https://colinks.costaging.co';
const GIVE_STAGING_URL = 'https://app.costaging.co';

export const GIVE_LOCAL_URL = 'http://app.co.local:3000';
export const COLINKS_LOCAL_URL = 'http://colinks.co.local:3000';

export const webAppURL = (app: 'colinks' | 'give' | 'cosoul') => {
  // support backend BRANCH_URL
  const branch_url = BRANCH_URL || VERCEL_BRANCH_URL;

  // eslint-disable-next-line no-console
  console.log('webAppURL', {
    app,
    IN_PRODUCTION,
    BRANCH_URL,
    VERCEL_BRANCH_URL,
  });

  if (IN_PRODUCTION) {
    switch (app) {
      case 'colinks':
        return COLINKS_PRODUCTION_URL;
      case 'cosoul':
        return GIVE_PRODUCTION_URL;
      case 'give':
        return GIVE_PRODUCTION_URL;
    }
  } else if (branch_url) {
    if (branch_url.includes('staging')) {
      if (app == 'colinks') {
        return COLINKS_STAGING_URL;
      } else {
        return GIVE_STAGING_URL;
      }
    } else {
      return 'https://' + branch_url;
    }
  } else {
    switch (app) {
      case 'colinks':
        return COLINKS_LOCAL_URL;
      case 'cosoul':
        return GIVE_LOCAL_URL;
      case 'give':
        return GIVE_LOCAL_URL;
    }
  }
};
