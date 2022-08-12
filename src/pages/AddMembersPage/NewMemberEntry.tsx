/* eslint-disable */

import React from 'react';

import { FieldValues, UseFormRegister } from 'react-hook-form';

import { CloseIcon } from '../../icons/CloseIcon';
import { Box, Flex, Text, TextField } from '../../ui';

const EthAndNameEntry = ({
  onFocus,
  onRemove,
  register,
  index,
  error,
}: {
  onFocus(): void;
  onRemove?(): void;
  register: UseFormRegister<FieldValues>;
  index: number;
  error?: { name?: string; address?: string };
}) => {
  // TODO: add zod validation and react form hook stuff??
  return (
    <>
      <Box
        css={{
          mb: '$xs',
          alignItems: 'center',
          display: 'grid',
          gridTemplateColumns: '35fr 60fr 5fr',
        }}
      >
        <Box css={{ mr: '$md' }}>
          <TextField
            placeholder="Name"
            autoFocus={false}
            fullWidth
            error={error?.name ? true : undefined}
            autoComplete={'off'}
            onFocus={() => {
              console.log('nameFocus');
              onFocus();
            }}
            {...register(`newMembers.${index}.name`)}
          />
        </Box>
        <Box css={{ mr: '$lg' }}>
          <TextField
            placeholder="ETH Address or ENS"
            autoFocus={false}
            fullWidth
            error={error?.address ? true : undefined}
            autoComplete={'off'}
            onFocus={() => {
              console.log('addrFocus');
              onFocus();
            }}
            {...register(`newMembers.${index}.address`)}
          />
        </Box>
        <Box>
          {onRemove && (
            <>
              <Flex
                onClick={onRemove}
                css={{
                  cursor: 'pointer',
                  padding: 0,
                  margin: 0,
                }}
              >
                <CloseIcon color={'neutral'} size={'md'} />
              </Flex>
            </>
          )}
        </Box>
      </Box>
      <Box
        css={{
          mb: '$md',
          alignItems: 'top',
          display: 'grid',
          gridTemplateColumns: '35fr 60fr 5fr',
        }}
      >
        <Box css={{ mt: '$xs' }}>
          <Text variant={'formError'}>{error?.name && error?.name}&nbsp;</Text>
        </Box>
        <Box css={{ mt: '$xs' }}>
          <Text variant={'formError'}>
            {error?.address && error?.address}&nbsp;
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default EthAndNameEntry;
