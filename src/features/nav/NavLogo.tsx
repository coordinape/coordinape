import { ThemeContext } from 'features/theming/ThemeProvider';
import { NavLink } from 'react-router-dom';

import { coLinksPaths, givePaths } from '../../routes/paths';
import { CSS } from '../../stitches.config';
import { Box, Flex } from '../../ui';
import { useIsCoLinksSite } from '../colinks/useIsCoLinksSite';

export const NavLogo = ({
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
  const isCoLinks = useIsCoLinksSite();

  // const [showApps, setShowApps] = useState(false);

  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <Flex column>
          <Box
            // onClick={() => setShowApps(prevState => !prevState)}
            as={NavLink}
            to={isCoLinks ? coLinksPaths.home : givePaths.home}
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
              ...(isCoLinks && {
                img: {
                  height: '46px',
                  width: 'auto',
                  minWidth: 0,
                  '@sm': {
                    height: '38px',
                  },
                },
              }),
              ...(mark && {
                img: {
                  height: '46px',
                  width: 'auto',
                  minWidth: 0,
                },
              }),
              ...(!isCoLinks &&
                small && {
                  img: {
                    height: '20px',
                    width: 'auto',
                    minWidth: 0,
                  },
                }),
              ...css,
            }}
          >
            {isCoLinks ? (
              <>
                {mark ? (
                  <img
                    src={
                      muted
                        ? '/imgs/logo/colinks-mark-grey6.png'
                        : theme == 'dark' || forceTheme == 'dark'
                        ? '/imgs/logo/colinks-mark-grey1.png'
                        : '/imgs/logo/colinks-mark-grey7.png'
                    }
                    alt="colinks logo"
                  />
                ) : (
                  <img
                    src={
                      muted
                        ? '/imgs/logo/colinks-logo-grey6.png'
                        : theme == 'dark' || forceTheme == 'dark'
                        ? '/imgs/logo/colinks-logo-grey1.png'
                        : '/imgs/logo/colinks-logo-grey7.png'
                    }
                    alt="colinks logo"
                  />
                )}
              </>
            ) : (
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
            )}
          </Box>
        </Flex>
      )}
    </ThemeContext.Consumer>
  );
};
