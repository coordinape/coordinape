/* eslint-disable */

import React from 'react';

import { FieldValues, UseFormRegister } from 'react-hook-form';

import { CloseIcon } from '../../icons/CloseIcon';
import { Box, Flex, Text, TextField } from '../../ui';

// import { NewMember } from './AddMembersPage';

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
      <Box css={{ mr: '$lg' }}>
        <Text variant={'label'}>ETH Address</Text>
        <TextField
          placeholder="ETH Address or ENS"
          inPanel
          autoFocus={false}
          onFocus={() => {
            console.log('addrFocus');
            onFocus();
          }}
          {...register(`address.${index}.value`)}
        />
        <Box>{error?.address && error?.address}</Box>
      </Box>
      <Box css={{ mr: '$md' }}>
        <Text variant={'label'}>Name</Text>
        <TextField
          placeholder="Name"
          inPanel
          autoFocus={false}
          onFocus={() => {
            console.log('nameFocus');
            onFocus();
          }}
          {...register(`name.${index}.value`)}
        />
        <Box>{error?.name && error?.name}</Box>
      </Box>
      {onRemove && (
        <Box>
          <Text variant={'label'}>
            &nbsp;{/*empty for filler to match other elements*/}
          </Text>
          <Box
            onClick={onRemove}
            css={{
              mt: '16px' /*for vertical centering - struggled with other techniques -g*/,
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
