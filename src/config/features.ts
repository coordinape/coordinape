// add your own feature names here

export type FeatureName =
  | 'vaults'
  | 'fixed_payments'
  | 'future_feature'
  | 'csv_import'
  | 'link_joining';

// this is a very simple implementation of build-time feature flags that you can
// hardcode or set with environment variables

const staticFeatureFlags: Partial<Record<FeatureName, boolean>> = {
  vaults: !!process.env.REACT_APP_FEATURE_FLAG_VAULTS,
  fixed_payments: !!process.env.REACT_APP_FEATURE_FLAG_FIXED_PAYMENTS,
  csv_import: false,
  link_joining: false,
};

// we make the export a function so that we can implement run-time feature flags
// in the future without having to change calling code

export const isFeatureEnabled = (featureName: FeatureName): boolean =>
  !!staticFeatureFlags[featureName];

export default isFeatureEnabled;
