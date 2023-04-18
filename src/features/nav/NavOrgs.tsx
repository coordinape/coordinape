import React, { useState } from 'react';

import { slideDown } from 'keyframes';
import { NavLink } from 'react-router-dom';

import { Dots, PlusCircle } from '../../icons/__generated';
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
import { NavItem } from './NavItem';
import { NavLabel } from './NavLabel';

const OrgList = ({
  orgs,
  currentCircle,
  currentOrg,
  viewOrgList,
}: {
  orgs: NavOrg[];
  currentCircle: NavCircle | undefined;
  currentOrg: NavOrg | undefined;
  viewOrgList: boolean;
}) => {
  if (!orgs) {
    return <Box>No orgs yet.</Box>;
  }

  return (
    <>
      {orgs.map(o => {
        const isCurrentOrg = currentOrg && currentOrg.id == o.id;
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
                  mb: '$md',
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
            {isCurrentOrg && !viewOrgList && (
              <NavCurrentOrg key={'currentOrg'} org={currentOrg} />
            )}
          </Box>
        );
      })}
    </>
  );
};
export const NavOrgs = ({
  orgs,
  currentCircle,
  currentOrg,
}: {
  orgs: NavOrg[];
  currentCircle: NavCircle | undefined;
  currentOrg: NavOrg | undefined;
}) => {
  const [viewOrgList, setViewOrgList] = useState(false);
  if (!orgs) {
    return <Box>No orgs yet.</Box>;
  }

  return (
    <>
      {currentOrg ? (
        <>
          <Collapsible open={viewOrgList} onOpenChange={setViewOrgList}>
            <CollapsibleTrigger
              css={{
                justifyContent: 'space-between',
                width: '100%',
                cursor: 'pointer',
                '&:hover svg': { color: '$cta' },
                '> div': { height: '$lg' },
              }}
            >
              <NavLabel
                key={'orgLabel'}
                label="Organizations"
                icon={
                  <IconButton
                    css={{
                      rotate: viewOrgList ? '90deg' : 0,
                      transition: '0.1s all ease-out',
                    }}
                  >
                    <Dots nostroke />
                  </IconButton>
                }
              />
            </CollapsibleTrigger>
            <CollapsibleContent
              onClick={() => setViewOrgList(false)}
              css={{
                position: 'relative',
                overflowY: 'clip',
                pt: '3px',
                mt: '-3px',
                "&[data-state='open']": {
                  animation: `${slideDown} 200ms ease-out`,
                },
              }}
            >
              <OrgList
                orgs={orgs}
                currentCircle={currentCircle}
                currentOrg={currentOrg}
                viewOrgList={true}
              />
              <NavItem
                label="Add Organization"
                to={paths.createCircle}
                icon={<PlusCircle />}
              />
            </CollapsibleContent>
          </Collapsible>
          {!viewOrgList && (
            <>
              <OrgList
                orgs={[currentOrg]}
                currentCircle={currentCircle}
                currentOrg={currentOrg}
                viewOrgList={false}
              />
            </>
          )}
        </>
      ) : (
        <>
          <Box css={{ '> div': { height: '$lg' } }}>
            <NavLabel key={'orgLabel'} label="Organizations" />
          </Box>
          <OrgList
            orgs={orgs}
            currentCircle={currentCircle}
            currentOrg={currentOrg}
            viewOrgList={false}
          />
        </>
      )}
    </>
  );
};
