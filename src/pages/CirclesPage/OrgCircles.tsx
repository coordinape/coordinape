import sortBy from 'lodash/sortBy';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import { scrollToTop } from '../../components';
import { isUserAdmin } from '../../lib/users';
import { paths } from '../../routes/paths';
import { AppLink, Avatar, Box, Button, Flex, Text } from '../../ui';

import { CircleRow, OrgWithCircles } from './CirclesPage';

export const OrgCircles = ({
  org,
  showAllCircles,
}: {
  org: OrgWithCircles;
  showAllCircles: boolean;
}) => {
  const navigate = useNavigate();

  const goToCircle = (id: number, path: string) => {
    scrollToTop();
    navigate(path);
  };

  const isAdmin = (org: OrgWithCircles) =>
    org.circles.map(c => c.users[0]).some(u => u && isUserAdmin(u));

  return (
    <Box key={org.id} css={{ mb: '$lg' }}>
      <Flex
        row
        css={{
          mb: '$lg',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          '@sm': { flexDirection: 'column', gap: '$md' },
        }}
      >
        <Flex alignItems="center">
          <AppLink to={paths.organization(org.id)}>
            <Text h2 medium css={{ gap: '$sm', '@sm': { fontSize: '$large' } }}>
              <Avatar path={org?.logo} size="small" name={org.name} />
              {org.name}
            </Text>
          </AppLink>
          {org.sample && (
            <Text tag color="active" css={{ ml: '$md' }}>
              Sample Organization
            </Text>
          )}
        </Flex>
        {isAdmin(org) && (
          <Button
            as={NavLink}
            to={paths.createCircle + '?org=' + org.id}
            color="primary"
            outlined
            css={{ whiteSpace: 'nowrap', ml: '$sm' }}
          >
            Add Circle
          </Button>
        )}
      </Flex>
      <Box
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '$xl',
        }}
      >
        {sortBy(org.circles, c => [-c.users.length, c.name]).map(circle => (
          <Transition
            key={circle.id}
            mountOnEnter
            unmountOnExit
            timeout={300}
            in={
              showAllCircles ||
              circle.users[0]?.role === 0 ||
              circle.users[0]?.role === 1
            }
          >
            {state => (
              <CircleRow
                circle={circle}
                onButtonClick={goToCircle}
                state={state}
              />
            )}
          </Transition>
        ))}
      </Box>
    </Box>
  );
};
