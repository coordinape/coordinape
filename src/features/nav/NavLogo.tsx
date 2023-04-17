import { ThemeContext } from 'features/theming/ThemeProvider';
import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { CSS } from '../../stitches.config';
import { Box } from '../../ui';

export const NavLogo = ({
  css,
  forceTheme,
}: {
  css?: CSS;
  forceTheme?: string;
}) => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => (
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
      )}
    </ThemeContext.Consumer>
  );
};
