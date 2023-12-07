import { IN_PRODUCTION } from './env';

export const COLINKS_PRODUCTION_URL = 'https://colinks.coordinape.com';
export const COORDINAPE_MARKETING_URL = 'https://coordinape.com';
const GIVE_PRODUCTION_URL = 'https://app.coordinape.com';

export const COLINKS_STAGING_URL = 'https://colinks.costaging.co';
const GIVE_STAGING_URL = 'https://app.costaging.co';

export const GIVE_LOCAL_URL = 'http://app.co.local:3000';
export const COLINKS_LOCAL_URL = 'http://colinks.co.local:3000';

export const webAppURL = (app: 'colinks' | 'give' | 'cosoul') => {
  if (IN_PRODUCTION) {
    switch (app) {
      case 'colinks':
        return COLINKS_PRODUCTION_URL;
      case 'cosoul':
        return GIVE_PRODUCTION_URL;
      case 'give':
        return GIVE_PRODUCTION_URL;
    }
  } else if (process.env.VERCEL_BRANCH_URL) {
    if (process.env.VERCEL_BRANCH_URL.includes('staging')) {
      if (app == 'colinks') {
        return COLINKS_STAGING_URL;
      } else {
        return GIVE_STAGING_URL;
      }
    } else {
      return 'https://' + process.env.VERCEL_BRANCH_URL;
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
