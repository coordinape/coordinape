import React from 'react';

import { CSS } from '../../stitches.config';
import { Box, Checkbox, Text, TextFieldFund } from '../../ui';

//#region Interfaces & Types

export interface AllocateFundsCardProps {
  epoch: string;
  period: string;
  fundsAvailable: number;
  recurringLabel: string;
  onFundValue(value: number): void;
  fundValue: number;
  children?: React.ReactNode;
  css?: CSS;
  title?: string;
}

//#endregion Interfaces

//#region Organisms
export const AllocateFundsCard: React.FC<AllocateFundsCardProps> = (
  props
): JSX.Element => {
  const [isRecurringFund, setIsRecurringFund] = React.useState<boolean>(false);

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '$md',
        borderRadius: '$1',
        backgroundColor: 'white',
        alignItems: 'center',
        py: '$xl',
        ...props.css,
      }}
    >
      <Text
        css={{
          fontSize: '$5',
          color: '$text',
          fontWeight: '$light',
        }}
      >
        {props.title}
      </Text>
      <Text
        css={{
          fontSize: 'calc($9 - 2px)',
          color: '$text',
          fontWeight: '$bold',
          '@sm': {
            fontSize: '$8',
            textAlign: 'center',
          },
        }}
      >
        {props.epoch}
      </Text>
      <Text
        css={{
          fontSize: '$8',
          color: '$lightBlue',
          fontWeight: '$normal',
          mt: '$md',
          '@sm': {
            fontSize: '$7',
            textAlign: 'center',
          },
        }}
      >
        {props.period}
      </Text>
      <Text
        css={{
          fontSize: '$4',
          color: '$text',
          fontWeight: '$light',
          '@sm': {
            fontSize: '$3',
            textAlign: 'center',
          },
        }}
      >
        {`(Repeats ${props.recurringLabel})`}
      </Text>
      <Box
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '$sm',
          mt: '$xl',
        }}
      >
        <TextFieldFund
          value={props.fundValue}
          onChange={props.onFundValue}
          fundsAvailable={props.fundsAvailable}
        />
        <Box
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '$full',
          }}
        >
          <Checkbox
            checked={isRecurringFund}
            onCheckedChange={setIsRecurringFund}
            label={`Fund ${props.recurringLabel}`}
          />
        </Box>
      </Box>
      {props.children && (
        <Box
          css={{
            display: 'flex',
            mt: '$2xl',
          }}
        >
          {props.children}
        </Box>
      )}
    </Box>
  );
};
//#endregion

AllocateFundsCard.defaultProps = {
  title: 'Allocate to',
};
