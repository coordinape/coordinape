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
          <Button color="cta" size="large" as={NavLink} to={paths.mint}>
            Mint CoSoul
          </Button>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
