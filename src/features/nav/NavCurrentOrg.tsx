import { DollarSign } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Box } from '../../ui';

import { NavOrg } from './getNavData';
import { NavItem } from './NavItem';

export const NavCurrentOrg = ({ org }: { org: NavOrg }) => {
  return (
    <Box css={{ mb: '$md' }}>
      <NavItem
        label={'Vaults'}
        to={paths.vaultsForOrg(org.id)}
        icon={<DollarSign />}
      />
    </Box>
  );
};
