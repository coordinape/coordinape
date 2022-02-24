import React from 'react';

import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field';

import { styled } from '../../stitches.config';
import { Box, Text, TextField } from '../index';

interface TextFieldFundProps {
  fundsAvailable: number;
  onChange(value: number): void;
  coinType?: string;
}

export const TextFieldFund: React.FC<TextFieldFundProps> = ({
  onChange,
  coinType = 'USDC',
  ...props
}): JSX.Element => {
  const [inputFundValue, setInputFundValue] = React.useState<string | number>();

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleOnValueChange: CurrencyInputProps['onValueChange'] = (
    value,
    _,
    values
  ): void => {
    const float = values?.float || 0;
    if (float > props.fundsAvailable) {
      return;
    }
    setInputFundValue(value);
    onChange(float);
  };

  const handleOnMaxFund = () => {
    setInputFundValue(props.fundsAvailable);
  };

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
      >
        AVAILABLE: {props.fundsAvailable.toLocaleString('en-US')} {coinType}
      </Text>
      <Box
        css={{
          display: 'flex',
          backgroundColor: '$lightBackground',
          borderRadius: '$5',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          px: '$md',
          gap: '$sm',
        }}
      >
        <Box
          css={{
            fontSize: '$2',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            color: '$placeholder',
            '&:hover': {
              color: '$red',
            },
          }}
          onClick={handleOnMaxFund}
        >
          Max
        </Box>
        <FundTextInput
          ref={inputRef}
          decimalsLimit={2}
          value={inputFundValue}
          onValueChange={handleOnValueChange}
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

const FundTextInput = styled(CurrencyInput, TextField);
