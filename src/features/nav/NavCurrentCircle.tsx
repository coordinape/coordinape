import { isFeatureEnabled } from '../../config/features';
import {
  Activity,
  Circle2,
  Edit2,
  Epoch,
  Give,
  Member,
  Settings,
} from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Box, Flex } from '../../ui';

import { NavCircle } from './getNavData';
import { NavCurrentCircleGiveCount } from './NavCurrentCircleGiveCount';
import { NavItem } from './NavItem';
import { isCircleAdmin } from './permissions';

export const NavCurrentCircle = ({ circle }: { circle: NavCircle }) => {
  const isAdmin = isCircleAdmin(circle);

  return (
    <Box css={{ mb: '$md' }}>
      <NavItem
        label={
          <Flex
            css={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flexGrow: 1,
            }}
          >
            {'Overview '}
            <NavCurrentCircleGiveCount
              css={{ ml: '$sm' }}
              circleId={circle.id}
              userId={circle.users[0].id}
              role={circle.users[0].role}
            />
          </Flex>
        }
        to={paths.history(circle.id)}
        icon={<Epoch nostroke />}
      />
      {isFeatureEnabled('activity') && (
        <NavItem
          label={'Activity'}
          to={paths.activity(circle.id)}
          icon={<Activity />}
        />
      )}
      <NavItem
        label={'Contributions'}
        to={paths.contributions(circle.id)}
        icon={<Edit2 />}
      />
      <NavItem
        label={'GIVE'}
        to={paths.give(circle.id)}
        icon={<Give nostroke />}
      />
      <NavItem
        label={'Map'}
        to={paths.map(circle.id)}
        icon={<Circle2 nostroke />}
      />
      <NavItem
        label={'Members'}
        to={paths.members(circle.id)}
        icon={<Member nostroke />}
      />

      {isAdmin && (
        <NavItem
          label={'Admin'}
          to={paths.circleAdmin(circle.id)}
          icon={<Settings />}
        />
      )}
    </Box>
  );
};
