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
  mark,
}: {
  css?: CSS;
  forceTheme?: string;
  muted?: boolean;
  mark?: boolean;
  loggedIn?: boolean;
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
            to={isCoLinks ? coLinksPaths.root : givePaths.home}
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
              ...css,
            }}
          >
            <>
              {mark ? (
                <img
                  src={
                    theme == 'dark' ||
                    forceTheme == 'dark' ||
                    theme == 'party' ||
                    forceTheme == 'party'
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
                      : theme == 'dark' ||
                          forceTheme == 'dark' ||
                          theme == 'party' ||
                          forceTheme == 'party'
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
