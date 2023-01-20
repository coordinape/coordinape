import { DollarSign } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Box } from '../../ui';

import { NavOrg } from './getNavData';
import { NavItem } from './NavItem';
import { isOrgAdmin } from './permissions';

export const NavCurrentOrg = ({ org }: { org: NavOrg }) => {
  const isAdmin = isOrgAdmin(org);

  return (
    <Box css={{ mb: '$md' }}>
      {isAdmin && (
        <NavItem
          label={'Vaults'}
          to={paths.vaultsForOrg(org.id)}
          icon={<DollarSign />}
        />
      )}
    </Box>
  );
};
