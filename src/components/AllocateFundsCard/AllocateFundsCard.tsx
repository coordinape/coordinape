import React from 'react';

import { CSS } from '../../stitches.config';
import { Box, Text, TextFieldFund } from '../../ui';

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
          fontSize: '30px',
          color: '$text',
          fontWeight: '$bold',
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
        }}
      >
        {props.period}
      </Text>
      <Text
        css={{
          fontSize: '$4',
          color: '$text',
          fontWeight: '$light',
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
      </Box>
      <Box
        css={{
          display: 'grid',
          gridTemplateColumns: 'auto auto',
          mt: 'calc($2xl * 2)',
          gap: '$sm',
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
};
//#endregion
