import { NavLink } from 'react-router-dom';

import isFeatureEnabled from 'config/features';
import { paths } from 'routes/paths';
import { Flex, Button, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

export const MintPage = () => {
  if (!isFeatureEnabled('cosoul')) {
    return <></>;
  }
  return (
    <SingleColumnLayout>
      <Flex column alignItems="start" css={{ gap: '$md' }}>
        <Text h1 css={{ fontSize: '110px' }}>
          View pGIVE
        </Text>
        <Flex css={{ mt: '$lg', gap: '$md' }}>
          <Button color="secondary" size="large" as={NavLink} to={paths.cosoul}>
            CoSoul Splash Page
          </Button>
          <Button color="secondary" size="large" as={NavLink} to={paths.home}>
            Coordinape
          </Button>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
