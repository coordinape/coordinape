// add your own feature names here

export const FeatureNames = [
  'debug',
  'vector_search',
  'similarity',
  'share_post',
  'ignore_dnt',
  'test_decent',
  'give_zone',
] as const;

export type FeatureName = (typeof FeatureNames)[number];

// this is a very simple implementation of build-time feature flags that you can
// hardcode or set with environment variables
const staticFeatureFlags: Partial<Record<FeatureName, boolean>> = {};

// this code is safe to use in a non-browser environment because of the typeof
// check, but our setup in tsconfig-backend.json still flags the use of `window`
// as an error, so we explicitly ignore it.
const isLocallyOn = (name: FeatureName) => {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    try {
      // @ts-ignore
      // eslint-disable-next-line no-console
      return window.localStorage.getItem('feature:' + name) === 'true';
    } catch (e) {
      // if we get an error here its likely due to iframe, we can ignore
      return false;
    }
  } else {
    return false;
  }
};

// we make the export a function so that we can implement run-time feature flags
// in the future without having to change calling code

export const isFeatureEnabled = (featureName: FeatureName): boolean =>
  !!staticFeatureFlags[featureName] || isLocallyOn(featureName);

export const enableFeatureLocally = (featureName: FeatureName) => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.localStorage.setItem('feature:' + featureName, 'true');
  }
};

export const disableFeatureLocally = (featureName: FeatureName) => {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.localStorage.removeItem('feature:' + featureName);
  }
};
