import { useNavQuery } from 'features/nav/getNavData';
import { NavLogo } from 'features/nav/NavLogo';
import { NavLink } from 'react-router-dom';
import { dark } from 'stitches.config';

import { GlobalUi } from 'components/GlobalUi';
import HelpButton from 'components/HelpButton';
import { paths } from 'routes/paths';
import { AppLink, Box, Button, Flex } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

const CoSoulLayout = ({ children }: { children: React.ReactNode }) => {
  const { data } = useNavQuery();
  return (
    <Box
      className={dark}
      css={{
        background: '$background',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        '& > main': { flex: 1, flexGrow: 1 },
      }}
    >
      <Flex css={{ height: 'auto' }}>
        <Box css={{ width: '100%' }}>
          <GlobalUi />
          <HelpButton />
          <Box
            as="main"
            css={{
              height: '100vh',
              overflowY: 'auto',
              // '@sm': {
              //   zIndex: 1,
              //   pt: '$3xl',
              // }, // for hamburger menu
            }}
          >
            <SingleColumnLayout>
              <Flex row css={{ justifyContent: 'space-between' }}>
                <NavLogo forceTheme="dark" />
                <Flex row alignItems="center" css={{ gap: '$lg' }}>
                  <AppLink inlineLink to={paths.mint}>
                    Docs
                  </AppLink>
                  {data ? (
                    <Button
                      as={NavLink}
                      to={`/login?next=${location.pathname}`}
                      color="selectedSecondary"
                    >
                      0x2387423874628376
                      {/* <Text size="small" ellipsis>
                        {address && shortenAddressWithFrontLength(address, 4)}
                      </Text> */}
                    </Button>
                  ) : (
                    <Button
                      as={NavLink}
                      to={`/login?next=${location.pathname}`}
                      color="cta"
                    >
                      Connect Wallet
                    </Button>
                  )}
                </Flex>
              </Flex>
            </SingleColumnLayout>
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default CoSoulLayout;
