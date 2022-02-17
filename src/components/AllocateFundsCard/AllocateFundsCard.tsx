import React from 'react';

import { CSS } from '../../stitches.config';
import { Box, Checkbox, Text, TextFieldFund } from '../../ui';

//#region Interfaces & Types

export interface AllocateFundsCardProps {
  title: string;
  epoch: string;
  period: string;
  css?: CSS;
  children: React.ReactNode;
}

//#endregion Interfaces
// TODO: remove
const getFundsAvailable = () => 20000;

//#region Organisms
export const AllocateFundsCard: React.FC<AllocateFundsCardProps> = (
  props
): JSX.Element => {
  const [, setFund] = React.useState<number>();
  const [recurringFund, setRecurringFund] = React.useState<boolean>(false);
  const fundsAvailable = getFundsAvailable();

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        width: '550px',
        height: '492px',
        gap: '$md',
        borderRadius: '$1',
        backgroundColor: 'white',
        alignItems: 'center',
        py: '$xl',
        '@sm': {
          width: '100%',
        },
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
        (Repeats Monthly)
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
          handleOnFundValue={value => setFund(value)}
          fundsAvailable={fundsAvailable}
        />
        <Box
          css={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: '$full',
          }}
        >
          <Checkbox
            checked={recurringFund}
            onCheckedChange={setRecurringFund}
          />
        </Box>
      </Box>
      <Box
        css={{
          display: 'flex',
          mt: '$2xl',
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};
//#endregion
