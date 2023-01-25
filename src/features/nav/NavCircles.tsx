import React from 'react';

import { NavLink } from 'react-router-dom';

import { ChevronDown, ChevronRight, PlusCircle } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Avatar, Box, Flex, IconButton, Text } from '../../ui';

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
        key={'circlesLabel'}
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
          <Box key={c.id}>
            <Flex
              as={NavLink}
              to={paths.history(c.id)}
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
                  color: isCurrentCircle ? '$textOnInfo' : '$navLinkText',
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
            {(isCurrentCircle || org.circles.length == 1) && (
              <NavCurrentCircle key={'currentCircle'} circle={c} />
            )}
          </Box>
        );
      })}
    </>
  );
};
