import { useEffect, useState } from 'react';

import { Eye, EyeOff, Dots } from '../../icons/__generated';
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
      <Collapsible
        open={
          org.myCircles.length < 2
            ? true
            : !currentCircle
            ? true
            : viewCircleList
        }
        onOpenChange={setViewCircleList}
      >
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
            key={'circlesLabel'}
            label="My Circles"
            icon={
              org.myCircles.length > 1 &&
              currentCircle && (
                <IconButton
                  css={{
                    '&:hover': { color: '$cta' },
                    rotate: viewCircleList ? '90deg' : 0,
                    transition: '0.1s all ease-out',
                  }}
                >
                  <Dots nostroke />
                </IconButton>
              )
            }
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          {org.myCircles.length == 0 && (
            <Text size="small">You haven&apos;t joined any circles yet.</Text>
          )}
          {org.myCircles.map(c => {
            return (
              <NavCircleItem
                currentCircle={currentCircle}
                circle={c}
                org={org}
                key={c.id}
              />
            );
          })}
        </CollapsibleContent>
      </Collapsible>
      {!viewCircleList && currentCircle && (
        <NavCircleItem
          currentCircle={currentCircle}
          circle={currentCircle}
          org={org}
        />
      )}

      {org.otherCircles.length > 0 && (
        <NavLabel
          key={'othercirclesLabel'}
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
