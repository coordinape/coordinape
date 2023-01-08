import { Check } from '../../icons/__generated';
import { paths } from '../../routes/paths';

import { NavOrg } from './getNavData';
import { NavItem } from './NavItem';
import { isOrgAdmin } from './permissions';

export const NavCurrentOrg = ({ org }: { org: NavOrg }) => {
  const isAdmin = isOrgAdmin(org);

  return (
    <>
      {isAdmin && (
        //   TODO: this should point an org specific vaults page
        <NavItem label={'Vaults'} to={paths.vaults} icon={<Check />} />
      )}
    </>
  );
};
