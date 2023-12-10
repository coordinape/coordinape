import { CoLinksWalletMenu, NavProfileWidth } from 'features/CoLinksWalletMenu';
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
      }}
    >
      {address ? (
        <Flex css={{ gap: '$md' }}>
          <Button as={NavLink} to={coLinksPaths.launch} color="coLinksCta">
            Launch CoLinks
          </Button>
          <CoLinksWalletMenu />
        </Flex>
      ) : (
        <Button
          as={NavLink}
          to={`/login?next=${coLinksPaths.launch}`}
          color="coLinksCta"
          size="large"
          css={{
            width: `calc(${NavProfileWidth} * 1.2)`,
            '@sm': {
              width: `${NavProfileWidth}`,
            },
          }}
        >
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
};
