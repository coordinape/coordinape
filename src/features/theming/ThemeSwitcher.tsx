import { isFeatureEnabled } from '../../config/features';
import { CloudDrizzle, Moon, Sun } from '../../icons/__generated';
import { Button, Flex, IconButton } from '../../ui';

import { ThemeContext } from './ThemeProvider';

const themeOptionStyles = {
  p: 0,
  zIndex: 1,
  borderRadius: '$pill',
  background: 'transparent',
  '&:hover': {
    color: '$text',
  },
};
const handleHeight = '24px';

export const ThemeSwitcher = () => {
  if (!isFeatureEnabled('theme_switcher')) {
    return <></>;
  }
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
              // border: '1px solid $borderDim',
              background: '$dim',
              borderRadius: '$pill',
              p: '$xxs',
              display: 'inline-flex',
              position: 'relative',
              '&:after': {
                content: '',
                background: '$neutralButtonHover',
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
                    ? '$textOnCta !important'
                    : '$textOnDim',
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
                    ? '$textOnCta !important'
                    : '$textOnDim',
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
                    ? '$textOnCta !important'
                    : '$textOnDim',
              }}
              onClick={() => {
                setTheme('light');
              }}
            >
              <Sun />
            </IconButton>
          </Flex>
          <IconButton
            css={{
              p: 0,
              '&:hover': {
                color: '$primary',
              },
              color:
                themePreference == 'legacy' ? '$text !important' : '$textOnDim',
            }}
            onClick={() => {
              setTheme('legacy');
            }}
          >
            <CloudDrizzle />
          </IconButton>
        </Flex>
      )}
    </ThemeContext.Consumer>
  );
};
