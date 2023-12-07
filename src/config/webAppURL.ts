import { IN_PRODUCTION } from './env';

export const COLINKS_PRODUCTION_URL = 'https://colinks.coordinape.com';
export const COORDINAPE_MARKETING_URL = 'https://coordinape.com';
const GIVE_PRODUCTION_URL = 'https://app.coordinape.com';
const COLINKS_STAGING_URL = 'https://colinks-staging.coordinape.com';

export const GIVE_LOCAL_URL = 'http://local.host:3000';
export const COLINKS_LOCAL_URL = 'http://colinks.local.host:3000';

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
  } else {
    if (
      process.env.VERCEL_BRANCH_URL &&
      process.env.VERCEL_BRANCH_URL.includes('staging')
    ) {
      if (app == 'colinks') {
        return COLINKS_STAGING_URL;
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
  }
};
