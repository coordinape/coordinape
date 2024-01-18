import React from 'react';

import copy from 'copy-to-clipboard';

import { useToast } from 'hooks';
import { Copy } from 'icons/__generated';
import { Button, Text } from 'ui';
import { Box } from 'ui/Box/Box';

const CopyCodeTextField = ({ value }: { value: string }) => {
  const { showDefault } = useToast();

  const copyToClip = () => {
    copy(value);
    showDefault(`Copied markdown to clipboard`, {
      toastId: 'copyCode',
      updateId: 'copyCode',
    });
  };

  return (
    <Box
      css={{
        position: 'relative',
        width: '100%',
        flexGrow: 1,
      }}
    >
      <Button
        size="small"
        onClick={copyToClip}
        color="dim"
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          fontSize: '$small',
          gap: '$md',
          color: '$default',
          '&:hover': {
            color: '$linkHover',
          },
        }}
      >
        <Text>{value}</Text>
        <Copy size={'md'} />
      </Button>
    </Box>
  );
};

export default CopyCodeTextField;
