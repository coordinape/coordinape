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

const OrgList = ({
  orgs,
  currentCircle,
  currentOrg,
}: {
  orgs: NavOrg[];
  currentCircle: NavCircle | undefined;
  currentOrg: NavOrg | undefined;
}) => {
  // const [viewOrgList, setViewOrgList] = useState(false);
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
              }}
            >
              <NavLabel
                key={'orgLabel'}
                label="Organizations"
                icon={
                  <IconButton>
                    <Shuffle />
                  </IconButton>
                }
              />
            </CollapsibleTrigger>
            <CollapsibleContent onClick={() => setViewOrgList(false)}>
              <OrgList
                orgs={orgs}
                currentCircle={currentCircle}
                currentOrg={currentOrg}
              />
            </CollapsibleContent>
          </Collapsible>
          {!viewOrgList && (
            <>
              <OrgList
                orgs={[currentOrg]}
                currentCircle={currentCircle}
                currentOrg={currentOrg}
              />
              <NavCurrentOrg key={'currentOrg'} org={currentOrg} />
            </>
          )}
        </>
      ) : (
        <>
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
          <OrgList
            orgs={orgs}
            currentCircle={currentCircle}
            currentOrg={currentOrg}
          />
        </>
      )}
    </>
  );
};
