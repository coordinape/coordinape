import { DollarSign, Member } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Box } from '../../ui';
import isFeatureEnabled from 'config/features';

import { NavOrg } from './getNavData';
import { NavItem } from './NavItem';

export const NavCurrentOrg = ({ org }: { org: NavOrg }) => {
  const isInOrg = org.members.length > 0;
  return (
    <Box css={{ mb: '$md' }}>
      <NavItem
        label={'Vaults'}
        to={paths.vaultsForOrg(org.id)}
        icon={<DollarSign />}
      />
      {isFeatureEnabled('org_view') && isInOrg && (
        <NavItem
          label={'Members'}
          to={paths.orgMembers(org.id)}
          icon={<Member nostroke />}
        />
      )}
    </Box>
  );
};
