import React, { FC } from 'react';

import { Box, Button, Text, TextField } from 'ui';
import { getConsoleUrl } from 'utils/apiKeyHelper';

export const ApiKeyDisplay: FC<{ apiKey: string }> = ({ apiKey }) => {
  const consoleUrl = getConsoleUrl(apiKey);

  return (
    <Box
      css={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
    >
      <Text font="source" size="medium">
        Make sure to copy your API key. You won’t be able to see it again!
      </Text>
      <TextField
        ref={input => input && input.select()}
        css={{ width: '100%', mt: '$md' }}
        value={apiKey}
        readOnly
      />
      <Box
        css={{
          pt: '$md',
        }}
      >
        <a
          href={consoleUrl}
          rel="noreferrer"
          target="_blank"
          style={{ textDecoration: 'none' }}
        >
          <Button color="primary" outlined>
            Open API Explorer
          </Button>
        </a>
      </Box>
    </Box>
  );
};
