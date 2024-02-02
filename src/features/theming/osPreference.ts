export type MediaTheme = 'dark' | 'light';

export const getMediaTheme = (): MediaTheme | null => {
  if (!window || !window.matchMedia) {
    return null;
  }
  // If they haven't been explicitly set, let's check the media query
  const mqlDark = window.matchMedia('(prefers-color-scheme: dark)');
  const hasMediaQueryPreference = typeof mqlDark.matches === 'boolean';
  if (hasMediaQueryPreference) return mqlDark.matches ? 'dark' : 'light';
  return null;
};

export const listenForOSPreferenceChanges = (
  preferenceChanged: (preference: MediaTheme) => void
) => {
  if (!window || !window.matchMedia) {
    return;
  }
  // Listen out for if a user changes operating system mode,
  // but don't save the change in local storage.
  // The only two options here are dark or light.
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', e => {
      preferenceChanged(e.matches ? 'dark' : 'light');
    });

  window
    .matchMedia('(prefers-color-scheme: light)')
    .addEventListener('change', e => {
      preferenceChanged(e.matches ? 'light' : 'dark');
    });
};
