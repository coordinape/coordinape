// add your own feature names here

export type FeatureName =
  | 'vaults'
  | 'fixed_payments'
  | 'future_feature'
  | 'discord';

// this is a very simple implementation of build-time feature flags that you can
// hardcode or set with environment variables

const staticFeatureFlags: Partial<Record<FeatureName, boolean>> = {
  vaults: true,
  fixed_payments: true,
};

// this code is safe to use in a non-browser environment because of the typeof
// check, but our setup in tsconfig-backend.json still flags the use of `window`
// as an error, so we explicitly ignore it.
const isLocallyOn = (name: FeatureName) =>
  // @ts-ignore
  typeof window !== 'undefined' &&
  // @ts-ignore
  window.localStorage.getItem('feature:' + name) === 'true';

// we make the export a function so that we can implement run-time feature flags
// in the future without having to change calling code

export const isFeatureEnabled = (featureName: FeatureName): boolean =>
  !!staticFeatureFlags[featureName] || isLocallyOn(featureName);

export default isFeatureEnabled;
