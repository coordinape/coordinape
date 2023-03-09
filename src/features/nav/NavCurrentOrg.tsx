import { isFeatureEnabled } from '../../config/features';
import { Activity, DollarSign } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Box } from '../../ui';

import { NavOrg } from './getNavData';
import { NavItem } from './NavItem';

export const NavCurrentOrg = ({ org }: { org: NavOrg }) => {
  return (
    <Box css={{ mb: '$md' }}>
      {isFeatureEnabled('activity') && (
        <NavItem
          label={'Activity'}
          // to={paths.orgActivity(org.id)}
          to={paths.organization(org.id)}
          icon={<Activity />}
        />
      )}
      <NavItem
        label={'Vaults'}
        to={paths.vaultsForOrg(org.id)}
        icon={<DollarSign />}
      />
    </Box>
  );
};
