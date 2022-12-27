// add your own feature names here

export type FeatureName =
  | 'vaults'
  | 'fixed_payments'
  | 'theme_switcher'
  | 'discord'
  | 'email_login'
  | 'disable_distribute_evenly';

// this is a very simple implementation of build-time feature flags that you can
// hardcode or set with environment variables

const staticFeatureFlags: Partial<Record<FeatureName, boolean>> = {
  vaults: true,
  fixed_payments: true,
  email_login: !!process.env.REACT_APP_FEATURE_FLAG_EMAIL_LOGIN,
  discord: true,
};

// this code is safe to use in a non-browser environment because of the typeof
// check, but our setup in tsconfig-backend.json still flags the use of `window`
// as an error, so we explicitly ignore it.
const isLocallyOn = (name: FeatureName, circleId?: number) => {
  // This is to explicitly (experimentally) disable distribute evenly for Bankless DAO-WIDE (GP,L1,L2) -g
  if (circleId == 3575 && name == 'disable_distribute_evenly') {
    return true;
  }

  return (
    // @ts-ignore
    typeof window !== 'undefined' &&
    // @ts-ignore
    window.localStorage.getItem('feature:' + name) === 'true'
  );
};

// we make the export a function so that we can implement run-time feature flags
// in the future without having to change calling code

export const isFeatureEnabled = (
  featureName: FeatureName,
  circleId?: number
): boolean =>
  !!staticFeatureFlags[featureName] || isLocallyOn(featureName, circleId);

export default isFeatureEnabled;
