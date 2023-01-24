import React from 'react';

import { NavLink } from 'react-router-dom';

import { PlusCircle } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Avatar, Box, Flex, IconButton, Text } from '../../ui';

import { NavCircle, NavOrg } from './getNavData';
import { NavCurrentOrg } from './NavCurrentOrg';
import { NavLabel } from './NavLabel';

export const NavOrgs = ({
  orgs,
  currentCircle,
  currentOrg,
}: {
  orgs: NavOrg[];
  currentCircle: NavCircle | undefined;
  currentOrg: NavOrg | undefined;
}) => {
  if (!orgs) {
    return <Box>No orgs yet.</Box>;
  }

  return (
    <>
      <NavLabel
        key={'orgLabel'}
        label="Organizations"
        icon={
          <IconButton
            as={NavLink}
            to={paths.createCircle}
            css={{ '&:hover': { color: '$cta' } }}
          >
            <PlusCircle />
          </IconButton>
        }
      />
      {orgs.map(o => {
        const isCurrentOrg = currentOrg && currentOrg.id == o.id;
        if (currentOrg && !isCurrentOrg) {
          return <></>;
        }
        return (
          <>
            <Flex
              as={NavLink}
              key={o.id}
              to={paths.organization(o.id)}
              css={{
                alignItems: 'center',
                borderRadius: '$3',
                mb: '$md',
                textDecoration: 'none',
              }}
            >
              <Avatar
                name={o.name}
                size="small"
                margin="none"
                css={{
                  mr: '$sm',
                  outline:
                    isCurrentOrg && !currentCircle
                      ? '2px solid $link'
                      : undefined,
                }}
                path={o.logo}
              />
              <Text
                semibold={isCurrentOrg ? true : undefined}
                css={{
                  flexGrow: 1,
                  color: isCurrentOrg ? '$textOnInfo' : '$navLinkText',
                }}
              >
                {o.name}
              </Text>
            </Flex>
            {isCurrentOrg && <NavCurrentOrg key={'currentOrg'} org={o} />}
          </>
        );
      })}
    </>
  );
};
