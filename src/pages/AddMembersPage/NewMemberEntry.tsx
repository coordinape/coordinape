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
    <Flex css={{ mb: '$md', alignItems: 'stretch' }}>
      <Box css={{ mr: '$md' }}>
        <TextField
          placeholder="Name"
          autoFocus={false}
          error={error?.name ? true : undefined}
          onFocus={() => {
            console.log('nameFocus');
            onFocus();
          }}
          {...register(`newMembers.${index}.name`)}
        />
        <Box css={{ mt: '$xs' }}>
          <Text variant={'formError'}>{error?.name && error?.name}</Text>
        </Box>
      </Box>
      <Box css={{ mr: '$lg' }}>
        <TextField
          placeholder="ETH Address or ENS"
          autoFocus={false}
          error={error?.address ? true : undefined}
          onFocus={() => {
            console.log('addrFocus');
            onFocus();
          }}
          {...register(`newMembers.${index}.address`)}
        />
        <Box css={{ mt: '$xs' }}>
          <Text variant={'formError'}>{error?.address && error?.address}</Text>
        </Box>
      </Box>

      {onRemove && (
        <Box>
          <Text variant={'label'}>
            &nbsp;{/*empty for filler to match other elements*/}
          </Text>
          <Box
            onClick={onRemove}
            css={{
              cursor: 'pointer',
            }}
          >
            <CloseIcon color={'neutral'} size={'md'} />
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default EthAndNameEntry;
