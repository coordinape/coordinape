import React from 'react';

import { Box, TextField, Text } from '../index';

interface TextFieldFundProps {
  fundsAvailable: number;
  handleOnFundValue(value: number): void;
  token?: string;
}

export const TextFieldFund: React.FC<TextFieldFundProps> = ({
  handleOnFundValue,
  token = 'USDC',
  ...props
}): JSX.Element => {
  const [inputFundValue, setInputFundValue] = React.useState<string>('0');

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;

    if (Number(value.replace(/,/g, '')) > props.fundsAvailable) {
      setInputFundValue(props.fundsAvailable.toLocaleString('en-US'));
      return;
    }

    setInputFundValue(Number(value.replace(/,/g, '')).toLocaleString('en-US'));
  };

  const handleOnMaxFund = () => {
    setInputFundValue(props.fundsAvailable.toLocaleString('en-US'));
  };

  React.useEffect(() => {
    handleOnFundValue(Number(inputFundValue.replace(/,/g, '')));
  }, [inputFundValue]);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '$sm',
      }}
    >
      <Text
        css={{
          fontSize: '$2',
          color: '$text',
          fontWeight: '$light',
          mr: '$md',
        }}
      >{`AVAILABLE: ${props.fundsAvailable.toLocaleString(
        'en-US'
      )} ${token}`}</Text>
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
            '&:hover': {
              color: '$red',
            },
          }}
          as="button"
          onClick={handleOnMaxFund}
        >
          Max
        </Box>
        <TextField
          ref={inputRef}
          value={inputFundValue}
          onChange={handleChange}
          variant="fund"
        />
        <Box
          css={{
            fontSize: 'calc($2 + 1px)',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: '#text',
          }}
          as="span"
        >
          {token}
        </Box>
      </Box>
    </Box>
  );
};
