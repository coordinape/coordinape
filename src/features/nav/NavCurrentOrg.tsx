import { Activity, DollarSign, Member } from '../../icons/__generated';
import { givePaths } from '../../routes/paths';
import { Box } from '../../ui';

import { NavOrg } from './getNavData';
import { NavItem } from './NavItem';

export const NavCurrentOrg = ({ org }: { org: NavOrg }) => {
  return (
    <Box
      css={{
        mb: '$md',
        '@lg': {
          mb: '$sm',
        },
      }}
    >
      <NavItem
        label={'Activity'}
        // to={paths.orgActivity(org.id)}
        to={givePaths.organization(org.id)}
        icon={<Activity />}
      />
      <NavItem
        label={'Vaults'}
        to={givePaths.vaultsForOrg(org.id)}
        icon={<DollarSign />}
      />
      <NavItem
        label={'Members'}
        to={givePaths.orgMembers(org.id)}
        icon={<Member nostroke />}
      />
    </Box>
  );
};
