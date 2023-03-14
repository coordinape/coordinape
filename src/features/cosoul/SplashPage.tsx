import { NavLink } from 'react-router-dom';

import useConnectedAddress from '../../hooks/useConnectedAddress';
import isFeatureEnabled from 'config/features';
import { paths } from 'routes/paths';
import { Box, Button, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export const SplashPage = () => {
  const address = useConnectedAddress();
  const hasCoSoul = true;
  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <Box css={{ position: 'relative' }}>
      <Box
        css={{
          position: 'absolute',
          top: '-120px',
          left: 0,
          height: '1300px',
          width: '100%',
          backgroundImage: "url('/imgs/background/cosoul-field.png')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'calc(50% + 135px) center',
          '@md': {
            top: '-230px',
            backgroundPosition: 'calc(50% + 65px) center',
          },
          '@sm': {
            top: '-320px',
            backgroundPosition: 'calc(50% - 55px) center',
          },
          zIndex: '-1',
        }}
      ></Box>
      <SingleColumnLayout
        css={{
          m: 'auto',
          position: 'relative',
        }}
      >
        <Flex column alignItems="start" css={{ gap: '$md' }}>
          <Text h1 display color="cta">
            Welcome to
            <br />
            CoSoul
          </Text>
          <Text h2 display color="secondary" css={{ maxWidth: '20em' }}>
            CoSoul is your avatar in the Coordinape universe. Anyone can mint a
            CoSoul to get started in the Coordinape network. It is free to mint
            and synch on Polygon.
          </Text>
          <Flex css={{ mt: '$lg', gap: '$md' }}>
            {address ? (
              <Button as={NavLink} to={paths.mint} color="cta" size="large">
                {hasCoSoul ? 'View Your CoSoul' : 'Mint CoSoul'}
              </Button>
            ) : (
              <Button as={NavLink} to={paths.mint} color="cta" size="large">
                Connect to Mint CoSoul
              </Button>
            )}
          </Flex>
        </Flex>
      </SingleColumnLayout>
    </Box>
  );
};
