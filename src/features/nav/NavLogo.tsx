import { ThemeContext } from 'features/theming/ThemeProvider';
import { NavLink, useLocation } from 'react-router-dom';

import { isFeatureEnabled } from '../../config/features';
import { paths } from '../../routes/paths';
import { CSS } from '../../stitches.config';
import { Box, Flex, Text } from '../../ui';

export const NavLogo = ({
  css,
  forceTheme,
}: {
  css?: CSS;
  forceTheme?: string;
}) => {
  const location = useLocation();
  const isCoLinks = location.pathname.includes('colinks');

  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
        <Flex column>
          <Box
            as={NavLink}
            to={paths.home}
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
          {isFeatureEnabled('soulkeys') && (
            <Flex css={{ gap: '$md', mt: '$md' }}>
              <Text as={NavLink} to={paths.coLinks} semibold={isCoLinks}>
                CoLinks
              </Text>
              <Text as={NavLink} to={paths.home} semibold={!isCoLinks}>
                Gift Circle
              </Text>
            </Flex>
          )}
        </Flex>
      )}
    </ThemeContext.Consumer>
  );
};
