import { ThemeContext } from 'features/theming/ThemeProvider';
import { NavLink } from 'react-router-dom';

import { coLinksPaths, givePaths } from '../../routes/paths';
import { CSS } from '../../stitches.config';
import { Box, Flex, Text } from '../../ui';
import { useIsCoLinksSite } from '../colinks/useIsCoLinksSite';

export const NavLogo = ({
  css,
  forceTheme,
  suppressAppMenu,
}: {
  css?: CSS;
  forceTheme?: string;
  suppressAppMenu?: boolean;
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
              ...css,
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
            }}
          >
            <img
              src={
                theme == 'dark' || forceTheme == 'dark'
                  ? '/imgs/logo/coordinape-logo-grey1.png'
                  : '/imgs/logo/coordinape-logo-grey7.png'
              }
              alt="coordinape logo"
            />
            {/* <img src={'/imgs/logo/coordinape-logo.svg'} alt="coordinape logo" /> */}
          </Box>
          {/* TODO: get rid of this nav for now */}

          {isCoLinks && !suppressAppMenu && (
            <Text
              size={'xl'}
              as={NavLink}
              to={coLinksPaths.home}
              semibold={true}
              css={{
                textDecoration: 'none',
                mt: '$md',
                ml: '$md',
              }}
            >
              CoLinks
            </Text>
          )}
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
