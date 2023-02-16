import React from 'react';

import { dark, theme as light } from '../../stitches.config';

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

const defaultThemeName = 'dark';
const defaultTheme = dark;

type Theme = 'dark' | 'light';

type ThemeProviderType = {
  themePreference: ThemePreference;
  theme: Theme;
  stitchesTheme: AvailableThemes[string];
  setTheme(newTheme: string): void;
};

const initialValues: ThemeProviderType = {
  themePreference: defaultThemeName,
  theme: defaultThemeName,
  stitchesTheme: defaultTheme,
  setTheme: () => {},
};

export const ThemeContext = createContext<ThemeProviderType>(initialValues);

type AvailableThemes = {
  [x: string]: typeof light | typeof dark;
};

const available_themes: AvailableThemes = {
  dark: dark,
  light: light,
};
export type StitchesTheme = AvailableThemes[string];
const useTheme = (): ThemeProviderType => {
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(defaultThemeName);
  const [theme, setTheme] = useState<Theme>(defaultThemeName);
  const [stitchesTheme, setStitchesTheme] =
    useState<AvailableThemes[string]>(defaultTheme);
  const [osTheme, setOsTheme] = useState<MediaTheme | null>(getMediaTheme());
  const html = document.documentElement;

  // in the future this should prefer auto if no saved
  useEffect(() => {
    const initialTheme = getSavedThemePreference();
    if (isValidThemePreference(initialTheme)) {
      setThemePreference(initialTheme);
    } else {
      setThemePreference(defaultThemeName);
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
    setStitchesTheme(available_themes[theme]);
  }, [theme]);

  listenForOSPreferenceChanges(osPref => {
    setOsTheme(osPref);
  });

  return {
    themePreference: themePreference,
    theme,
    stitchesTheme,
    setTheme: (newTheme: ThemePreference) => {
      setThemePreference(newTheme);
      saveThemePreference(newTheme);
    },
  };
};

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { themePreference, setTheme, stitchesTheme, theme } = useTheme();
  return (
    <ThemeContext.Provider
      value={{
        theme,
        themePreference: themePreference,
        stitchesTheme,
        setTheme: setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
