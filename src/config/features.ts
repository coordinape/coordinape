// add your own feature names here

export type FeatureName = 'vaults' | 'future_feature';

// this is a very simple implementation of build-time feature flags that you can
// hardcode or set with environment variables

const staticFeatureFlags: Partial<Record<FeatureName, boolean>> = {
  vaults: !!process.env.REACT_APP_FEATURE_FLAG_VAULTS,
};

// we make the export a function so that we can implement run-time feature flags
// in the future without having to change calling code

export const isFeatureEnabled = (featureName: FeatureName): boolean =>
  !!staticFeatureFlags[featureName];

export default isFeatureEnabled;
