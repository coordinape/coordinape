import React from 'react';

import { theme as defaultTheme, dark, light } from '../../stitches.config';

import {
  getMediaTheme,
  listenForOSPreferenceChanges,
  MediaTheme,
} from './osPreference';
import {
  getSavedThemePreference,
  isValidThemePreference,
  saveThemePreference,
  ThemePreference,
} from './storage';

const { createContext, useState, useEffect } = React;

const defaultThemeName = 'legacy';

type Theme = 'dark' | 'light' | typeof defaultThemeName;

type ThemeProviderType = {
  theme: ThemePreference;
  setTheme(newTheme: string): void;
};

const initialValues: ThemeProviderType = {
  theme: defaultThemeName,
  setTheme: () => {},
};

export const ThemeContext = createContext<ThemeProviderType>(initialValues);

type AvailableThemes = {
  [x: string]: typeof defaultTheme | typeof dark | typeof light;
};

const available_themes: AvailableThemes = {
  defaultThemeName: defaultTheme, // stitches' default theme
  dark: dark,
  light: light,
};

const useTheme = (): ThemeProviderType => {
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(defaultThemeName);
  const [theme, setTheme] = useState<Theme>(defaultThemeName);
  const [osTheme, setOsTheme] = useState<MediaTheme | null>(getMediaTheme());
  const html = document.documentElement;

  // set the starting theme, preferring saved, then legacy
  // in the future this should prefer auto if no saved
  useEffect(() => {
    const initialTheme = getSavedThemePreference();
    if (isValidThemePreference(initialTheme)) {
      setThemePreference(initialTheme);
    } else {
      setThemePreference(defaultThemeName);
      // TODO: switch to this at release time
      // setThemePreference('auto');
    }
  }, []);

  useEffect(() => {
    if (themePreference == 'auto') {
      setTheme(osTheme ?? defaultThemeName);
    } else {
      setTheme(themePreference);
    }
  }, [themePreference]);

  useEffect(() => {
    // if os theme changes and we are in auto mode, change up
    if (themePreference == 'auto') {
      setTheme(osTheme ?? defaultThemeName);
    }
  }, [osTheme]);

  useEffect(() => {
    for (const k of Object.values(available_themes)) {
      html.classList.remove(k);
    }
    html.classList.add(available_themes[theme]);
  }, [theme]);

  listenForOSPreferenceChanges(osPref => {
    setOsTheme(osPref);
  });

  return {
    theme: themePreference,
    setTheme: (newTheme: ThemePreference) => {
      setThemePreference(newTheme);
      saveThemePreference(newTheme);
    },
  };
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useTheme();
  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        setTheme: setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
