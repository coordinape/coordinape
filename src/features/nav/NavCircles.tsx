import React from 'react';

import { NavLink } from 'react-router-dom';

import { ChevronDown, ChevronRight, PlusCircle } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Avatar, Box, Flex, IconButton, Text } from '../../ui';

import { NavCircle, NavOrg } from './getNavData';
import { NavCurrentCircle } from './NavCurrentCircle';
import { NavLabel } from './NavLabel';
import { isCircleAdmin } from './permissions';

export const NavCircles = ({
  org,
  currentCircle,
}: {
  org: NavOrg;
  currentCircle: NavCircle | undefined;
}) => {
  // this will need to change when we introduce roles on org_members directly
  const isOrgAdmin = org.circles.some(isCircleAdmin);

  return (
    <>
      <NavLabel
        key={'circlesLabel'}
        label="Circles"
        icon={
          isOrgAdmin && (
            <IconButton
              as={NavLink}
              to={paths.createCircle + '?org=' + org.id}
              css={{ '&:hover': { color: '$cta' } }}
            >
              <PlusCircle />
            </IconButton>
          )
        }
      />
      {org.circles.map(c => {
        const isCurrentCircle =
          currentCircle?.id == c.id || org.circles.length === 1;
        const isCircleMember = c.users.length > 0;
        return (
          <Box key={c.id}>
            {(isCircleMember || isCurrentCircle) && (
              <Flex
                as={NavLink}
                to={isCircleMember ? paths.history(c.id) : paths.members(c.id)}
                css={{
                  alignItems: 'center',
                  mb: '$md',
                  textDecoration: 'none',
                  borderRadius: '$3',
                }}
              >
                <Avatar
                  name={c.name}
                  size="small"
                  margin="none"
                  css={{
                    mr: '$sm',
                    outline: isCurrentCircle ? '2px solid $link' : undefined,
                  }}
                  path={c.logo}
                />
                <Text
                  semibold={isCurrentCircle}
                  css={{
                    flexGrow: 1,
                    color: isCurrentCircle ? '$text' : '$navLinkText',
                  }}
                >
                  {c.name}
                </Text>
                <IconButton>
                  {isCurrentCircle || org.circles.length == 1 ? (
                    <ChevronDown />
                  ) : (
                    <ChevronRight />
                  )}
                </IconButton>
              </Flex>
            )}
            {isCurrentCircle && (
              <NavCurrentCircle key={'currentCircle'} circle={c} />
            )}
          </Box>
        );
      })}
    </>
  );
};
