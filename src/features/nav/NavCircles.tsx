import React from 'react';

import { NavLink } from 'react-router-dom';

import { ChevronDown, ChevronRight, PlusCircle } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Avatar, Flex, IconButton, Text } from '../../ui';

import { NavCircle, NavOrg } from './getNavData';
import { NavCurrentCircle } from './NavCurrentCircle';
import { NavLabel } from './NavLabel';

export const NavCircles = ({
  org,
  currentCircle,
}: {
  org: NavOrg;
  currentCircle: NavCircle | undefined;
}) => {
  return (
    <>
      <NavLabel
        label="Circles"
        icon={
          <IconButton
            as={NavLink}
            to={paths.createCircle + '?org=' + org.id}
            css={{ '&:hover': { color: '$cta' } }}
          >
            <PlusCircle />
          </IconButton>
        }
      />
      {org.circles.map(c => {
        const isCurrentCircle = currentCircle && currentCircle.id == c.id;
        return (
          <>
            <Flex
              as={NavLink}
              key={c.id}
              to={paths.history(c.id)}
              css={{ alignItems: 'center', mb: '$md', textDecoration: 'none' }}
            >
              <Avatar
                name={c.name}
                size="small"
                margin="none"
                css={{
                  mr: '$sm',
                  border: isCurrentCircle ? '2px solid $link' : undefined,
                }}
                path={c.logo}
              />
              <Text
                semibold={isCurrentCircle ? true : undefined}
                css={{
                  flexGrow: 1,
                  color: isCurrentCircle ? '$textOnInfo' : '$primary',
                }}
              >
                {c.name}
              </Text>
              <IconButton>
                {isCurrentCircle ? <ChevronDown /> : <ChevronRight />}
              </IconButton>
            </Flex>
            {isCurrentCircle && <NavCurrentCircle circle={c} />}
          </>
        );
      })}
    </>
  );
};
