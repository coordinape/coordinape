import { ThemeContext } from 'features/theming/ThemeProvider';

import { CSS } from '../../stitches.config';
import { Box, Flex, Link } from '../../ui';
import { COORDINAPE_MARKETING_URL } from 'config/webAppURL';

export const CoLogoMark = ({
  css,
  forceTheme,
  muted,
  small,
  mark,
}: {
  css?: CSS;
  forceTheme?: string;
  muted?: boolean;
  small?: boolean;
  mark?: boolean;
}) => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <Flex column>
          <Box
            as={Link}
            href={COORDINAPE_MARKETING_URL}
            target="_blank"
            rel="noreferrer"
            css={{
              'img, svg': {
                width: '200px',
                minWidth: '140px',
                '@lg': {
                  width: '150px',
                },
                '@sm': {
                  width: '140px',
                },
              },
              'svg *': { fill: 'white' },
              cursor: 'pointer',
              ...(mark && {
                img: {
                  height: '46px',
                  width: 'auto',
                  minWidth: 0,
                },
              }),
              ...(small && {
                img: {
                  height: '20px',
                  width: 'auto',
                  minWidth: 0,
                },
              }),
              ...css,
            }}
          >
            <>
              {mark ? (
                <img
                  src={
                    theme == 'dark' || forceTheme == 'dark'
                      ? '/imgs/logo/coordinape-mark-grey6i.png'
                      : '/imgs/logo/coordinape-mark-grey6.png'
                  }
                  alt="coordinape logo"
                />
              ) : (
                <img
                  src={
                    muted
                      ? '/imgs/logo/coordinape-logo-grey6.png'
                      : theme == 'dark' || forceTheme == 'dark'
                      ? '/imgs/logo/coordinape-logo-grey1.png'
                      : '/imgs/logo/coordinape-logo-grey7.png'
                  }
                  alt="coordinape logo"
                />
              )}
            </>
          </Box>
        </Flex>
      )}
    </ThemeContext.Consumer>
  );
};
