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
  const isCircleMember = 'users' in circle && circle.users.length > 0;

  return (
    <Box css={{ mb: '$md' }}>
      <Flex column css={{ flexDirection: 'column-reverse' }}>
        {isCircleMember && (
          <NavItem
            label={
              <Flex
                css={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexGrow: 1,
                }}
              >
                {'Epochs '}
                <NavCurrentCircleGiveCount
                  css={{ ml: '$sm' }}
                  circleId={circle.id}
                  user={circle.users[0]}
                />
              </Flex>
            }
            to={paths.epochs(circle.id)}
            icon={<Epoch nostroke />}
          />
        )}
        <NavItem
          label="Activity"
          to={paths.circle(circle.id)}
          icon={<Activity />}
        />
      </Flex>
      {isCircleMember && (
        <NavItem
          label="Contributions"
          to={paths.contributions(circle.id)}
          icon={<Edit2 />}
        />
      )}
      {isCircleMember && (
        <NavItem
          label="GIVE"
          to={paths.give(circle.id)}
          icon={<Give nostroke />}
        />
      )}
      <NavItem
        label="Map"
        to={paths.map(circle.id)}
        icon={<Circle2 nostroke />}
      />
      <NavItem
        label="Members"
        to={paths.members(circle.id)}
        icon={<Member nostroke />}
      />

      {isCircleAdmin(circle) && (
        <NavItem
          label="Admin"
          to={paths.circleAdmin(circle.id)}
          icon={<Settings />}
        />
      )}
    </Box>
  );
};
