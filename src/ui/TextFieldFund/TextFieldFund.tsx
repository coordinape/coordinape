import React from 'react';

import { Box, TextField } from '../index';

interface TextFieldFundProps {
  token: string;
  fundsAvailable: number;
}

export const TextFieldFund: React.FC<TextFieldFundProps> = (
  props
): JSX.Element => {
  return (
    <Box
      css={{
        display: 'flex',
        backgroundColor: '$lightBackground',
        borderRadius: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '308px',
        height: '56px',
        px: '$md',
      }}
    >
      <Box
        css={{
          fontSize: '$2',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: '#99A2A5',
        }}
        as="button"
      >
        Max
      </Box>

      <TextField variant="fund" />
      <Box
        css={{
          fontSize: 'calc($2 + 1px)',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          color: '#text',
        }}
        as="span"
      >
        {props.token}
      </Box>
    </Box>
  );
};
