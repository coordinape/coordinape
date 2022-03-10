import { ReactNode } from 'react';

import { OrganizationHeader } from 'components';
import { Box } from 'ui';

export const OrgLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      css={{
        maxWidth: '$mediumScreen',
        margin: '$xl auto $lg',
        display: 'flex',
        flexDirection: 'column',
        gap: '$md',
      }}
    >
      <OrganizationHeader css={{ mb: '$xl' }} />
      {children}
    </Box>
  );
};
