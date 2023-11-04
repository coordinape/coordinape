import React from 'react';

import { Box } from 'ui';

export const SoulKeyWizardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Box
      css={{
        background: '$background',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        '& > main': { flex: 1, flexGrow: 1 },
      }}
    >
      {children}
    </Box>
  );
};
