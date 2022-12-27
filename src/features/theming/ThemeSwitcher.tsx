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
      {({ theme, setTheme }) => (
        <Flex
          css={{
            gap: '$sm',
            justifyContent: 'end',
            mt: '$sm',
            alignItems: 'center',
          }}
        >
          <Button
            size="small"
            color="transparent"
            css={{
              border: 'none',
              '&:hover': {
                color: '$primary',
              },
              color: theme === 'auto' ? '$text !important' : '$secondaryText',
            }}
            onClick={() => {
              // fixme for utilizing OS theme selection
              setTheme('auto');
            }}
          >
            AUTO
          </Button>
          <IconButton
            css={{
              p: 0,
              '&:hover': {
                color: '$primary',
              },
              color: theme == 'legacy' ? '$text !important' : '$secondaryText',
            }}
            onClick={() => {
              setTheme('legacy');
            }}
          >
            <CloudDrizzle />
          </IconButton>
          <IconButton
            css={{
              p: 0,
              '&:hover': {
                color: '$primary',
              },
              color: theme === 'dark' ? '$text !important' : '$secondaryText',
            }}
            onClick={() => {
              setTheme('dark');
            }}
          >
            <Moon />
          </IconButton>
          <IconButton
            css={{
              p: 0,
              '&:hover': {
                color: '$primary',
              },
              color: theme === 'light' ? '$text !important' : '$secondaryText',
            }}
            onClick={() => {
              setTheme('light');
            }}
          >
            <Sun />
          </IconButton>
        </Flex>
      )}
    </ThemeContext.Consumer>
  );
};
