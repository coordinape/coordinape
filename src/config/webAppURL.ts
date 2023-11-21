import { IN_PRODUCTION } from './env';

const COLINKS_PRODUCTION_URL = 'https://colinks.coordinape.com';
const GIVE_PRODUCTION_URL = 'https://app.coordinape.com';
const COLINKS_STAGING_URL = 'https://colinks-staging.coordinape.com';

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
          return 'http://colinks.local:3000';
        case 'cosoul':
          return 'http://localhost:3000';
        case 'give':
          return 'http://localhost:3000';
      }
    }
  }
};
