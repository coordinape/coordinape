import { Activity, DollarSign, Member } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Box } from '../../ui';

import { NavOrg } from './getNavData';
import { NavItem } from './NavItem';

export const NavCurrentOrg = ({ org }: { org: NavOrg }) => {
  const isInOrg = org.members.length > 0;
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
        to={paths.organization(org.id)}
        icon={<Activity />}
      />
      <NavItem
        label={'Vaults'}
        to={paths.vaultsForOrg(org.id)}
        icon={<DollarSign />}
      />
      {isInOrg && (
        <NavItem
          label={'Members'}
          to={paths.orgMembers(org.id)}
          icon={<Member nostroke />}
        />
      )}
    </Box>
  );
};
