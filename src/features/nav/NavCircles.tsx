import { useEffect, useState } from 'react';

import { NavLink } from 'react-router-dom';

import { Eye, EyeOff, PlusCircle } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { IconButton, Text } from '../../ui';

import { NavCircle, NavOrg } from './getNavData';
import { NavCircleItem } from './NavCircleItem';
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
  const isOrgAdmin = org.myCircles.some(isCircleAdmin);

  const [showOtherCircles, setShowOtherCircles] = useState(false);

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
      <NavLabel
        key={'circlesLabel'}
        label="My Circles"
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
