const themeLocalStorageKey = 'theme';
export type ThemePreference = 'auto' | 'dark' | 'light' | 'legacy';
export function isValidThemePreference(
  theme: string | null
): theme is ThemePreference {
  return theme == 'auto' || theme == 'dark' || theme == 'light';
}

export const saveThemePreference = (newTheme: ThemePreference) => {
  try {
    if (typeof newTheme === 'string')
      window.localStorage.setItem(themeLocalStorageKey, newTheme);
  } catch (e) {
    console.warn(e);
  }
};

export const getSavedThemePreference = (): ThemePreference | null => {
  try {
    const savedMode = window.localStorage.getItem(themeLocalStorageKey);
    // If the user has explicitly chosen a colour mode,
    // let's use it. Otherwise, this value will be null.
    return isValidThemePreference(savedMode) ? savedMode : null;
  } catch (e) {
    // When Chrome in incognito, localStorage cannot be accessed
    console.warn(e);
    return null;
  }
  return null;
};
