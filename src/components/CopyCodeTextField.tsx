import React from 'react';

import copy from 'copy-to-clipboard';

import { useToast } from 'hooks';
import { Copy } from 'icons/__generated';
import { Button, TextField } from 'ui';
import { Box } from 'ui/Box/Box';

const CopyCodeTextField = ({ value }: { value: string }) => {
  const { showDefault } = useToast();

  const copyToClip = () => {
    copy(value);
    showDefault('Copied to clipboard');
  };

  return (
    <Box
      css={{
        position: 'relative',
        width: '100%',
        flexGrow: 1,
      }}
    >
      <TextField
        // inPanel
        value={value}
        readOnly={true}
        onClick={copyToClip}
        css={{
          width: '100%',
          cursor: 'pointer',
          height: '$xl',
          fontSize: '$small',
          textAlign: 'left',
          pl: '$sm',
          background: '$dim !important',
          border: 'none', //''1px solid $text !important',
          alignItems: 'center',
          pr: '48px',
        }}
      />
      <Button
        color={'transparent'}
        css={{
          ml: '$sm',
          position: 'absolute',
          top: 4,
          right: 4,
          padding: 4,
          minHeight: 0,
        }}
        onClick={copyToClip}
      >
        <Copy color={'text'} size={'md'} />
      </Button>
    </Box>
  );
};

export default CopyCodeTextField;
