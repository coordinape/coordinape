import React, { useState } from 'react';

import { NavLink } from 'react-router-dom';

import { PlusCircle, Shuffle } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import {
  Avatar,
  Box,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  IconButton,
  Text,
} from 'ui';

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
  const [open, setOpen] = useState(false);
  if (!orgs) {
    return <Box>No orgs yet.</Box>;
  }

  return (
    <>
      {currentOrg ? (
        <Collapsible open={open} onOpenChange={setOpen} css={{ mb: '$md' }}>
          <CollapsibleTrigger
            css={{ justifyContent: 'space-between', width: '100%' }}
          >
            <NavLabel
              key={'orgLabel'}
              label="Organizations"
              icon={
                <IconButton
                  to={paths.createCircle}
                  as={NavLink}
                  css={{ '&:hover': { color: '$cta' } }}
                >
                  <Shuffle />
                </IconButton>
              }
            />
          </CollapsibleTrigger>
          <CollapsibleContent>Orgs, orgs, orgs</CollapsibleContent>
        </Collapsible>
      ) : (
        <NavLabel
          key={'orgLabel'}
          label="Organizations"
          icon={
            <IconButton
              to={paths.createCircle}
              as={NavLink}
              css={{ '&:hover': { color: '$cta' } }}
            >
              <PlusCircle />
            </IconButton>
          }
        />
      )}
      {orgs.map(o => {
        const isCurrentOrg = currentOrg && currentOrg.id == o.id;
        if (currentOrg && !isCurrentOrg) {
          return null;
        }
        return (
          <Box key={o.id}>
            <Flex
              as={NavLink}
              to={paths.organization(o.id)}
              css={{
                alignItems: 'center',
                borderRadius: '$3',
                mb: '$md',
                '@lg': {
                  mb: '$sm',
                },
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
                  color: isCurrentOrg ? '$text' : '$navLinkText',
                }}
              >
                {o.name}
              </Text>
            </Flex>
            {isCurrentOrg && <NavCurrentOrg key={'currentOrg'} org={o} />}
          </Box>
        );
      })}
    </>
  );
};
