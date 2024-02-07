import { useState } from 'react';

import { Box, Button } from 'ui';

export const BridgeButton = ({ children }: { children: React.ReactNode }) => {
  const [showComponent, setShowComponent] = useState(false);

  return (
    <>
      {!showComponent ? (
        <Button
          color="secondary"
          size="small"
          rel={'noreferrer'}
          css={{ whiteSpace: 'normal' }}
          onClick={() => setShowComponent(true)}
        >
          Bridge to Optimism
        </Button>
      ) : (
        <Box>{children}</Box>
      )}
    </>
  );
};
