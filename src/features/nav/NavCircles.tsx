import { Box, Text } from '../../ui';

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
      <NavLabel label="Circles" />
      {org.circles.map(c => (
        <>
          <Box key={c.id}>
            <Text>{c.name}</Text>
          </Box>
          {currentCircle && currentCircle.id == c.id && (
            <NavCurrentCircle circle={currentCircle} />
          )}
        </>
      ))}
    </>
  );
};
