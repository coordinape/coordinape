import { useEffect, useState } from 'react';

import { Eye, EyeOff, ChevronRight } from '../../icons/__generated';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  IconButton,
  Text,
} from 'ui';

import { NavCircle, NavOrg } from './getNavData';
import { NavCircleItem } from './NavCircleItem';
import { NavLabel } from './NavLabel';

export const NavCircles = ({
  org,
  currentCircle,
}: {
  org: NavOrg;
  currentCircle: NavCircle | undefined;
}) => {
  const [showOtherCircles, setShowOtherCircles] = useState(false);
  const [viewCircleList, setViewCircleList] = useState(true);

  const openOrgSwitcher =
    org.myCircles.length < 2 || !currentCircle || viewCircleList;
  const showMyCircles = org.myCircles.length > 1 && currentCircle;

  useEffect(() => {
    if (
      org.myCircles.length == 0 ||
      org.otherCircles.some(c => c.id == currentCircle?.id)
    ) {
      setShowOtherCircles(true);
    }
  }, [currentCircle, org.otherCircles]);

  return (
    <>
      <Collapsible open={openOrgSwitcher} onOpenChange={setViewCircleList}>
        <CollapsibleTrigger
          css={{
            justifyContent: 'space-between',
            width: '100%',
            cursor:
              org.myCircles.length > 1 && currentCircle ? 'pointer' : 'default',
            '&:hover svg': { color: '$cta' },
            '> div': { height: '$lg' },
          }}
        >
          <NavLabel
            label="My Circles"
            icon={
              showMyCircles && (
                <IconButton
                  css={{
                    '&:hover': { color: '$cta' },
                    rotate: viewCircleList ? '90deg' : 0,
                    transition: '0.1s all ease-out',
                  }}
                >
                  <ChevronRight />
                </IconButton>
              )
            }
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {org.myCircles.length == 0 && (
            <Text size="small">You haven&apos;t joined any circles yet.</Text>
          )}
          {org.myCircles.map(c => (
            <NavCircleItem
              currentCircle={currentCircle}
              circle={c}
              org={org}
              key={c.id}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
      {!viewCircleList && showMyCircles && (
        <NavCircleItem
          currentCircle={currentCircle}
          circle={currentCircle}
          org={org}
        />
      )}

      {org.otherCircles.length > 0 && (
        <NavLabel
          label="Other Circles"
          icon={
            <IconButton
              css={{ '&:hover': { color: '$cta' } }}
              onClick={() => setShowOtherCircles(prev => !prev)}
            >
              {showOtherCircles ? <Eye /> : <EyeOff />}
            </IconButton>
          }
        />
      )}
      {showOtherCircles &&
        org.otherCircles.map(c => {
          return (
            <NavCircleItem
              currentCircle={currentCircle}
              circle={c}
              org={org}
              key={c.id}
            />
          );
        })}
    </>
  );
};
