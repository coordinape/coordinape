import { Box, Text } from '../../ui';

import { NavOrg } from './getNavData';
import { NavCurrentOrg } from './NavCurrentOrg';
import { NavLabel } from './NavLabel';

export const NavOrgs = ({
  orgs,
  currentOrg,
}: {
  orgs: NavOrg[];
  currentOrg: NavOrg | undefined;
}) => {
  if (!orgs) {
    return <Box>No orgs yet.</Box>;
  }

  return (
    <>
      <NavLabel label="Organization" />
      {orgs.map(o => (
        <>
          <Box key={o.id}>
            <Text>{o.name}</Text>
          </Box>
          {currentOrg && currentOrg.id == o.id && (
            <NavCurrentOrg org={currentOrg} />
          )}
        </>
      ))}
    </>
  );
};
