import { useState } from 'react';

import { QUERY_KEY_NAV } from 'features/nav';
import { NavQueryData } from 'features/nav/getNavData';
import { client } from 'lib/gql/client';
import sortBy from 'lodash/sortBy';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Transition } from 'react-transition-group';

import { scrollToTop } from '../../components';
import { isUserAdmin } from '../../lib/users';
import { paths } from '../../routes/paths';
import { useToast } from 'hooks';
import { Eye, EyeOff } from 'icons/__generated';
import { AppLink, Avatar, Box, Button, Flex, Text } from 'ui';

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

  const [hiddenInNav, setHiddenInNav] = useState<boolean>(
    org?.members?.[0]?.hidden ?? false
  );
  const { showError } = useToast();
  const queryClient = useQueryClient();
  const setOrgVisibilityInNav = async ({
    memberId,
    hiddenInNav,
  }: {
    memberId: number;
    hiddenInNav: boolean;
  }) => {
    const { update_org_members_by_pk } = await client.mutate(
      {
        update_org_members_by_pk: [
          {
            pk_columns: { id: memberId },
            _set: { hidden: !hiddenInNav },
          },
          { hidden: true },
        ],
      },
      { operationName: 'orgCircles_hideFromSideNav' }
    );
    return update_org_members_by_pk;
  };

  const setOrgVisibilityMutation = useMutation(setOrgVisibilityInNav, {
    onSuccess: res => {
      if (res != undefined) {
        setHiddenInNav(res.hidden);
        queryClient.setQueryData<NavQueryData>(
          [QUERY_KEY_NAV, org.members[0].profile_id],
          oldData => {
            if (oldData) {
              const orgIndex = oldData.organizations.findIndex(
                o => o.id === org.id
              );
              const orgToBeModified = oldData.organizations[orgIndex];
              const modifiedOrg = {
                ...orgToBeModified,
                members: [
                  { ...orgToBeModified.members[0], hidden: res.hidden },
                ],
              };
              const modifiedOrganizations = [
                ...oldData.organizations.slice(0, orgIndex),
                modifiedOrg,
                ...oldData.organizations.slice(orgIndex + 1),
              ];
              return { ...oldData, organizations: modifiedOrganizations };
            }
          }
        );
      }
    },
    onError: error => {
      showError(error);
    },
  });

  return (
    <Box key={org.id} css={{ mb: '$lg' }}>
      <Flex
        row
        css={{
          mb: '$lg',
          alignItems: 'center',
          justifyContent: 'space-between',
          '@sm': {
            flexDirection: 'column',
            gap: '$md',
            alignItems: 'baseline',
          },
        }}
      >
        <Flex alignItems="center" css={{ gap: '$md' }}>
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
        <Flex alignItems="center" css={{ gap: '$sm' }}>
          <Button
            color="textOnly"
            css={{
              fontSize: '$small',
              color: '$neutral',
              '&:hover, &:focus': { color: '$link' },
            }}
            onClick={() => {
              setOrgVisibilityMutation.mutate({
                memberId: org.members[0].id,
                hiddenInNav,
              });
            }}
          >
            {!hiddenInNav ? (
              <>
                <Eye />
                <Text>in Navbar</Text>
              </>
            ) : (
              <>
                <EyeOff />
                <Text>Hidden in Navbar</Text>
              </>
            )}
          </Button>
          {isAdmin(org) && (
            <Button
              as={NavLink}
              to={paths.createCircle + '?org=' + org.id}
              color="secondary"
              css={{ whiteSpace: 'nowrap', ml: '$sm' }}
            >
              Add Circle
            </Button>
          )}
        </Flex>
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
