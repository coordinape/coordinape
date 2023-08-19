import React, { useEffect, useState } from 'react';

import { NavLink } from 'react-router-dom';

import { ChevronRight, EyeOff, PlusCircle } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import {
  Avatar,
  Box,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Flex,
  IconButton,
  Text,
} from 'ui';

import { EpochEndingNotification } from './EpochEndingNotification';
import { NavCircle, NavOrg } from './getNavData';
import { NavCurrentOrg } from './NavCurrentOrg';
import { NavItem } from './NavItem';
import { NavLabel } from './NavLabel';

const AddOrgButton = () => (
  <NavItem
    label="Add Organization"
    to={paths.createCircle}
    css={{ borderTop: '1px dashed $border', pt: '$sm' }}
    icon={<PlusCircle />}
  />
);

const OrgList = ({
  orgs,
  currentCircle,
  currentOrg,
  hiddenOrgs,
  onHideOrg,
}: {
  orgs: NavOrg[];
  currentCircle: NavCircle | undefined;
  currentOrg: NavOrg | undefined;
  hiddenOrgs: number[]; // Array to store hidden org IDs
  onHideOrg: (orgId: number) => void; // Function to handle hiding org
}) => {
  if (!orgs) {
    return <Box>No orgs yet.</Box>;
  }

  return (
    <>
      {orgs.map(o => {
        const isCurrentOrg = currentOrg && currentOrg.id == o.id;
        const isHidden = hiddenOrgs.includes(o.id);
        return (
          <Box key={o.id} hidden={isHidden}>
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
              {o.myCircles.map(c => {
                return (
                  <Flex key={c.id} css={{ position: 'relative' }}>
                    <EpochEndingNotification
                      css={{ mx: '$xs', position: 'absolute', right: 0 }}
                      circleId={c.id}
                      indicatorOnly
                    />
                  </Flex>
                );
              })}
              <IconButton
                css={{ '&:hover': { color: '$cta' } }}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  onHideOrg(o.id);
                }}
              >
                <EyeOff />
              </IconButton>
            </Flex>
            {isCurrentOrg && <NavCurrentOrg org={currentOrg} />}
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
  onHideCurrentOrg,
}: {
  orgs: NavOrg[];
  currentCircle: NavCircle | undefined;
  currentOrg: NavOrg | undefined;
  onHideCurrentOrg: () => void;
}) => {
  const [viewOrgList, setViewOrgList] = useState(false);
  const storedHiddenOrgs = localStorage.getItem('hiddenOrgs');
  const initialHiddenOrgs = storedHiddenOrgs
    ? JSON.parse(storedHiddenOrgs)
    : [];
  const [hiddenOrgs, setHiddenOrgs] = useState<number[]>(initialHiddenOrgs);

  const hideOrgsHandler = (orgId: number) => {
    setHiddenOrgs(prevHiddenOrgs => [...prevHiddenOrgs, orgId]);
  };

  useEffect(() => {
    localStorage.setItem('hiddenOrgs', JSON.stringify(hiddenOrgs));
    if (hiddenOrgs.includes(currentOrg?.id)) onHideCurrentOrg();
  }, [hiddenOrgs]);

  if (!orgs) {
    return <Box>No orgs yet.</Box>;
  }

  return (
    <>
      {hiddenOrgs.length > 0 && (
        <Button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            setHiddenOrgs([]);
          }}
        >
          Show hidden orgs
        </Button>
      )}{' '}
      {currentOrg ? (
        <>
          <Collapsible
            open={orgs.length < 2 || viewOrgList}
            onOpenChange={setViewOrgList}
          >
            <CollapsibleTrigger
              css={{
                justifyContent: 'space-between',
                width: '100%',
                cursor: orgs.length > 1 ? 'pointer' : 'default',
                '&:hover svg': { color: '$cta' },
                '> div': { height: '$lg' },
              }}
            >
              <NavLabel
                label="Organizations"
                icon={
                  orgs.length > 1 && (
                    <IconButton
                      as="span"
                      css={{
                        rotate: viewOrgList ? '90deg' : 0,
                        transition: '0.1s all ease-out',
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  )
                }
              />
            </CollapsibleTrigger>
            <OrgList
              orgs={[currentOrg]}
              currentCircle={currentCircle}
              currentOrg={currentOrg}
              hiddenOrgs={hiddenOrgs}
              onHideOrg={hideOrgsHandler}
            />
            <CollapsibleContent onClick={() => setViewOrgList(false)}>
              <OrgList
                orgs={orgs.filter(o => o.id != currentOrg?.id)}
                currentCircle={currentCircle}
                currentOrg={currentOrg}
                hiddenOrgs={hiddenOrgs}
                onHideOrg={hideOrgsHandler}
              />
              <AddOrgButton />
            </CollapsibleContent>
          </Collapsible>
        </>
      ) : (
        <>
          <Box css={{ '> div': { height: '$lg' } }}>
            <NavLabel label="Organizations" />
          </Box>
          <OrgList
            orgs={orgs}
            currentCircle={currentCircle}
            currentOrg={currentOrg}
            hiddenOrgs={hiddenOrgs}
            onHideOrg={hideOrgsHandler}
          />
        </>
      )}
    </>
  );
};
