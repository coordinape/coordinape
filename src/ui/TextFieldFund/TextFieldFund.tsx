import React from 'react';

import { Box, TextField, Text } from '../index';

interface TextFieldFundProps {
  fundsAvailable: number;
  onChange(value: number): void;
  value: number;
  coinType?: string;
}

const parseFundToNumber = (value: string) => Number(value.replace(/,/g, ''));
const parseFundToLocale = (value: number) => value.toLocaleString('en-US');

export const TextFieldFund: React.FC<TextFieldFundProps> = ({
  onChange,
  value,
  coinType = 'USDC',
  ...props
}): JSX.Element => {
  const [inputFundValue, setInputFundValue] = React.useState<string>(
    parseFundToLocale(value) || '0'
  );

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;

    if (parseFundToNumber(value) > props.fundsAvailable) {
      setInputFundValue(parseFundToLocale(props.fundsAvailable));
      return;
    }

    setInputFundValue(parseFundToLocale(parseFundToNumber(value)));
  };

  const handleOnMaxFund = () => {
    setInputFundValue(props.fundsAvailable.toLocaleString('en-US'));
  };

  React.useEffect(() => {
    onChange(parseFundToNumber(inputFundValue));
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
        }}
      >{`AVAILABLE: ${props.fundsAvailable.toLocaleString(
        'en-US'
      )} ${coinType}`}</Text>
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
          {coinType}
        </Box>
      </Box>
    </Box>
  );
};
