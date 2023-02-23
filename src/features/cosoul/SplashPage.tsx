import { NavLink } from 'react-router-dom';

import isFeatureEnabled from 'config/features';
import { paths } from 'routes/paths';
import { Button, Flex, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export const SplashPage = () => {
  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <SingleColumnLayout>
      <Flex column alignItems="start" css={{ gap: '$md' }}>
        <Text h1 color="cta" css={{ fontSize: '110px' }}>
          Welcome to
          <br />
          CoSoul
        </Text>
        <Text h2 color="secondary" css={{ fontSize: '40px', maxWidth: '20em' }}>
          CoSoul is your avatar in the Coordinape universe. Anyone can mint a
          CoSoul to get started in the Coordinape network. It is free to mint
          and synch on Polygon.
        </Text>
        <Flex css={{ mt: '$lg', gap: '$md' }}>
          <Button color="cta" size="large" as={NavLink} to={paths.mint}>
            Mint CoSoul
          </Button>
          <Button color="secondary" size="large" as={NavLink} to={paths.home}>
            Coordinape
          </Button>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
