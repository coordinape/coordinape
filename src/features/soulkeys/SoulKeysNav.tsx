import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Flex, Link } from '../../ui';

export const SoulKeysNav = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex css={{ justifyContent: 'center' }}>
      <Flex column css={{ maxWidth: '$smallScreen' }}>
        <Flex css={{ gap: '$md', mb: '$lg' }}>
          <Link as={NavLink} to={paths.soulKeys}>
            Your Keys
          </Link>
          <Link as={NavLink} to={paths.soulKeysTrades}>
            All Key Trades
          </Link>
          <Link as={NavLink} to={paths.cosoulExplore}>
            Explore CoSouls
          </Link>
        </Flex>
        {children}
      </Flex>
    </Flex>
  );
};
