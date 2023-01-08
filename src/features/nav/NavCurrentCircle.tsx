import { Check } from '../../icons/__generated';
import { paths } from '../../routes/paths';

import { NavCircle } from './getNavData';
import { NavItem } from './NavItem';
import { isCircleAdmin } from './permissions';

export const NavCurrentCircle = ({ circle }: { circle: NavCircle }) => {
  const isAdmin = isCircleAdmin(circle);

  return (
    <>
      <NavItem
        label={'Overview'}
        to={paths.history(circle.id)}
        icon={<Check />}
      />
      <NavItem
        label={'Contributions'}
        to={paths.contributions(circle.id)}
        icon={<Check />}
      />
      <NavItem
        label={'Allocation'}
        to={paths.give(circle.id)}
        icon={<Check />}
      />
      <NavItem label={'Map'} to={paths.map(circle.id)} icon={<Check />} />
      <NavItem
        label={'Members'}
        to={paths.members(circle.id)}
        icon={<Check />}
      />

      {isAdmin && (
        <NavItem
          label={'Admin'}
          to={paths.circleAdmin(circle.id)}
          icon={<Check />}
        />
      )}
    </>
  );
};
