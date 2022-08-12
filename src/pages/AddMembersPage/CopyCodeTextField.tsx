import React from 'react';

import copy from 'copy-to-clipboard';

import { useApeSnackbar } from '../../hooks';
import { Copy } from '../../icons/__generated';
import { Button, TextField } from '../../ui';
import { Box } from '../../ui/Box/Box';

const CopyCodeTextField = ({ value }: { value: string }) => {
  const { showInfo } = useApeSnackbar();

  const copyToClip = () => {
    copy(value);
    showInfo('Copied to clipboard');
  };

  return (
    <Box css={{ position: 'relative', flexGrow: 1 }}>
      <TextField
        inPanel
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
        }}
      />
      <Button
        color={'transparent'}
        css={{ ml: '$sm', position: 'absolute', top: 0, right: 0 }}
        onClick={copyToClip}
      >
        <Copy color={'neutral'} size={'md'} />
      </Button>
    </Box>
  );
};

export default CopyCodeTextField;
