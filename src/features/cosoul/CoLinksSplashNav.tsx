import { CoLinksWalletMenu } from 'features/CoLinksWalletMenu';
import { NavLink } from 'react-router-dom';

import { coLinksPaths } from '../../routes/paths';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { Button, Flex } from 'ui';

export const CoLinksSplashNav = () => {
  const address = useConnectedAddress();
  return (
    <Flex
      row
      alignItems="center"
      css={{
        gap: '$lg',
        position: 'relative',
        justifyContent: 'flex-end',
        width: '100%',
      }}
    >
      {address ? (
        <Flex css={{ gap: '$md' }}>
          <Button as={NavLink} to={coLinksPaths.launch} color="coLinksCta">
            Launch CoLinks
          </Button>
          <CoLinksWalletMenu />
        </Flex>
      ) : null}
    </Flex>
  );
};
