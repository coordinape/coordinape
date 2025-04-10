import { BRANCH_URL, IN_PRODUCTION } from './env';

export const COLINKS_PRODUCTION_URL = 'https://coordinape.com';
export const COORDINAPE_MARKETING_URL = 'https://about.coordinape.com';
const GIVE_PRODUCTION_URL = 'https://app.coordinape.com';

export const COLINKS_STAGING_URL = 'https://costaging.co';
const GIVE_STAGING_URL = 'https://app.costaging.co';

export const GIVE_LOCAL_URL = 'http://app.co.local:3000';
export const COLINKS_LOCAL_URL = 'http://co.local:3000';

// set this to force webAppURL to return a specific URL, like when you are using ngrok to do testing
const FORCE_WEB_URL = process.env.FORCE_WEB_URL;

export const webAppURL = (app: 'colinks' | 'give' | 'cosoul') => {
  if (FORCE_WEB_URL) {
    return FORCE_WEB_URL;
  } else if (IN_PRODUCTION) {
    switch (app) {
      case 'colinks':
        return COLINKS_PRODUCTION_URL;
      case 'cosoul':
        return GIVE_PRODUCTION_URL;
      case 'give':
        return GIVE_PRODUCTION_URL;
    }
  } else if (BRANCH_URL) {
    if (BRANCH_URL.includes('staging')) {
      if (app == 'colinks') {
        return COLINKS_STAGING_URL;
      } else {
        return GIVE_STAGING_URL;
      }
    } else {
      return 'https://' + BRANCH_URL;
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
