import { isFeatureEnabled } from '../../config/features';
import { CloudDrizzle, Moon, Sun } from '../../icons/__generated';
import { Button, Flex, IconButton } from '../../ui';

import { ThemeContext } from './ThemeProvider';

export const ThemeSwitcher = () => {
  if (!isFeatureEnabled('theme_switcher')) {
    return <></>;
  }
  return (
    <ThemeContext.Consumer>
      {({ themePreference, setTheme }) => (
        <Flex column css={{ pl: '$sm', display: 'inline-flex' }}>
          <IconButton
            css={{
              p: 0,
              '&:hover': {
                color: '$primary',
              },
              color:
                themePreference == 'legacy'
                  ? '$text !important'
                  : '$secondaryText',
            }}
            onClick={() => {
              setTheme('legacy');
            }}
          >
            <CloudDrizzle />
          </IconButton>
          <Flex
            css={{
              gap: '$xs',
              justifyContent: 'start',
              mt: '$sm',
              alignItems: 'center',
              border: '1px solid $borderMedium',
              borderRadius: '$pill',
              p: '$xxs $sm',
              display: 'inline-flex',
            }}
          >
            <IconButton
              css={{
                p: 0,
                borderRadius: '$round',
                '&:hover': {
                  color: '$cta',
                  background: '$primaryButtonHover',
                },
                background:
                  themePreference === 'dark'
                    ? '$cta !important'
                    : 'transparent',
                color:
                  themePreference === 'dark'
                    ? '$textOnCta !important'
                    : '$secondaryText',
              }}
              onClick={() => {
                setTheme('dark');
              }}
            >
              <Moon />
            </IconButton>
            <Button
              size="small"
              css={{
                border: 'none',
                p: '$xs $sm',
                minHeight: 0,
                borderRadius: '$pill',
                '&:hover': {
                  color: '$cta',
                  background: '$primaryButtonHover',
                },
                background:
                  themePreference === 'auto'
                    ? '$cta !important'
                    : 'transparent',
                color:
                  themePreference === 'auto'
                    ? '$textOnCta !important'
                    : '$secondaryText',
              }}
              onClick={() => {
                // fixme for utilizing OS theme selection
                setTheme('auto');
              }}
            >
              Auto
            </Button>
            <IconButton
              css={{
                p: 0,
                borderRadius: '$round',
                '&:hover': {
                  color: '$cta',
                  background: '$primaryButtonHover',
                },
                background:
                  themePreference === 'light'
                    ? '$cta !important'
                    : 'transparent',
                color:
                  themePreference === 'light'
                    ? '$textOnCta !important'
                    : '$secondaryText',
              }}
              onClick={() => {
                setTheme('light');
              }}
            >
              <Sun />
            </IconButton>
          </Flex>
        </Flex>
      )}
    </ThemeContext.Consumer>
  );
};
