import { ThemeContext } from 'features/theming/ThemeProvider';
import { NavLink } from 'react-router-dom';

import { coLinksPaths, givePaths } from '../../routes/paths';
import { CSS } from '../../stitches.config';
import { Box, Flex } from '../../ui';
import { useIsCoLinksSite } from '../colinks/useIsCoLinksSite';

export const NavLogo = ({
  css,
  forceTheme,
  coLinks,
  muted,
  small,
}: {
  css?: CSS;
  forceTheme?: string;
  coLinks?: boolean;
  muted?: boolean;
  small?: boolean;
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
              ...(coLinks && {
                img: {
                  height: '46px',
                  width: 'auto',
                  minWidth: 0,
                },
              }),
              ...(!coLinks &&
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
            {coLinks ? (
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
          </Box>
          {/* TODO: get rid of this nav for now */}

          {/*{isFeatureEnabled('soulkeys') && !suppressAppMenu && (*/}
          {/*  <Flex column css={{ gap: '$md', mt: '$md', ml: '$md' }}>*/}
          {/*    <Text*/}
          {/*      size={'xl'}*/}
          {/*      as={NavLink}*/}
          {/*      to={webAppURL('colinks')}*/}
          {/*      onClick={() => setShowApps(false)}*/}
          {/*      semibold={isCoLinks}*/}
          {/*      css={{*/}
          {/*        textDecoration: 'none',*/}
          {/*        display: isCoLinks || showApps ? 'flex' : 'none',*/}
          {/*      }}*/}
          {/*    >*/}
          {/*      CoLinks*/}
          {/*    </Text>*/}
          {/*    <Text*/}
          {/*      as={NavLink}*/}
          {/*      to={webAppURL('give')}*/}
          {/*      onClick={() => setShowApps(false)}*/}
          {/*      size={'xl'}*/}
          {/*      css={{*/}
          {/*        textDecoration: 'none',*/}
          {/*        display: !isCoLinks || showApps ? 'flex' : 'none',*/}
          {/*      }}*/}
          {/*      semibold={!isCoLinks}*/}
          {/*    >*/}
          {/*      Gift Circle*/}
          {/*    </Text>*/}
          {/*  </Flex>*/}
          {/*)}*/}
        </Flex>
      )}
    </ThemeContext.Consumer>
  );
};
