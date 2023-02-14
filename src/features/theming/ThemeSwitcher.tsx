import { Moon, Sun } from '../../icons/__generated';
import { Button, Flex, IconButton } from '../../ui';

import { ThemeContext } from './ThemeProvider';

const themeOptionStyles = {
  p: 0,
  zIndex: 1,
  borderRadius: '$pill',
  background: 'transparent',
  fontWeight: 'normal',
  '&:hover': {
    color: '$toggleTextHover',
  },
};
const handleHeight = '24px';

export const ThemeSwitcher = () => {
  return (
    <ThemeContext.Consumer>
      {({ themePreference, setTheme }) => (
        <Flex
          css={{
            m: '$sm 0 $md',
            px: '$sm',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Flex
            css={{
              gap: '$xs',
              justifyContent: 'start',
              alignItems: 'center',
              background: '$toggleBackground',
              borderRadius: '$pill',
              p: '$xxs',
              display: 'inline-flex',
              position: 'relative',
              '&:after': {
                content: '',
                background: '$toggleSelectedBackground',
                height: handleHeight,
                width:
                  themePreference === 'auto'
                    ? `calc(${handleHeight} * 2)`
                    : handleHeight,
                position: 'absolute',
                borderRadius: '$pill',
                transition: 'all 0.2s ease-in-out',
                zIndex: 0,
                left:
                  themePreference === 'dark'
                    ? '2px'
                    : themePreference === 'light'
                    ? `calc(100% - ${handleHeight} - 2px)`
                    : themePreference === 'auto'
                    ? `calc(50% - ${handleHeight})`
                    : themePreference === 'legacy'
                    ? '-9999px'
                    : 'auto',
              },
            }}
          >
            <IconButton
              css={{
                ...themeOptionStyles,
                color:
                  themePreference === 'dark'
                    ? '$toggleSelectedText !important'
                    : '$toggleText',
              }}
              onClick={() => {
                setTheme('dark');
              }}
            >
              <Moon />
            </IconButton>
            <Button
              size="small"
              color="transparent"
              css={{
                ...themeOptionStyles,
                border: 'none',
                p: '$xs $sm',
                minHeight: 0,
                borderRadius: '$pill',
                color:
                  themePreference === 'auto'
                    ? '$toggleSelectedText !important'
                    : '$toggleText',
              }}
              onClick={() => {
                setTheme('auto');
              }}
            >
              Auto
            </Button>
            <IconButton
              css={{
                ...themeOptionStyles,
                color:
                  themePreference === 'light'
                    ? '$toggleSelectedText !important'
                    : '$toggleText',
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
