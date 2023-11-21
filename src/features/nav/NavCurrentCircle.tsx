import { useMyUser } from 'features/auth/useLoginData';

import {
  Activity,
  Circle2,
  Edit2,
  Epoch,
  Give,
  Member,
  Settings,
} from 'icons/__generated';
import { givePaths } from 'routes/paths';
import { Flex } from 'ui';

import { EpochEndingNotification } from './EpochEndingNotification';
import { NavCircle } from './getNavData';
import { NavCurrentCircleGiveCount } from './NavCurrentCircleGiveCount';
import { NavItem } from './NavItem';
import { isCircleAdmin } from './permissions';

export const NavCurrentCircle = ({ circle }: { circle: NavCircle }) => {
  const isCircleMember = 'users' in circle && circle.users.length > 0;
  const me = useMyUser(circle.id);
  const unallocated = (!me?.non_giver && me?.give_token_remaining) || 0;

  return (
    <Flex column css={{ mb: '$md' }}>
      <EpochEndingNotification circleId={circle.id} css={{ mb: '$sm' }} />
      <NavItem
        label="Activity"
        to={givePaths.circle(circle.id)}
        icon={<Activity />}
      />
      {isCircleMember && (
        <>
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
            to={givePaths.epochs(circle.id)}
            icon={<Epoch nostroke />}
          />
          <NavItem
            label={
              <Flex
                css={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexGrow: 1,
                }}
              >
                {'Contributions '}
                <EpochEndingNotification
                  css={{ ml: '$xs', mr: '0' }}
                  circleId={circle.id}
                  indicatorOnly
                />
              </Flex>
            }
            to={givePaths.contributions(circle.id)}
            icon={<Edit2 />}
          />
          <NavItem
            label={
              <Flex
                css={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexGrow: 1,
                }}
              >
                {'GIVE '}
                <EpochEndingNotification
                  css={{ ml: '$xs', mr: '0' }}
                  circleId={circle.id}
                  indicatorOnly
                  suppressNotification={unallocated == 0}
                />
              </Flex>
            }
            to={givePaths.give(circle.id)}
            icon={<Give nostroke />}
          />
        </>
      )}
      <NavItem
        label="Map"
        to={givePaths.map(circle.id)}
        icon={<Circle2 nostroke />}
      />
      <NavItem
        label="Members"
        to={givePaths.members(circle.id)}
        icon={<Member nostroke />}
      />

      {isCircleAdmin(circle) && (
        <NavItem
          label="Admin"
          to={givePaths.circleAdmin(circle.id)}
          icon={<Settings />}
        />
      )}
    </Flex>
  );
};
