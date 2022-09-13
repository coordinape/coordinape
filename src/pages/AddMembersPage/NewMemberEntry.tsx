import React from 'react';

import { FieldValues, UseFormRegister } from 'react-hook-form';

import { Box, Flex, Text, TextField } from '../../ui';
import { Close } from 'icons/__generated';

import NewMemberGridBox from './NewMemberGridBox';

const NewMemberEntry = ({
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
  return (
    <>
      <NewMemberGridBox>
        <Box>
          <TextField
            placeholder="Name"
            fullWidth
            error={error?.name ? true : undefined}
            autoComplete={'off'}
            onFocus={() => {
              onFocus();
            }}
            {...register(`newMembers.${index}.name`)}
          />
        </Box>
        <Box css={{ mr: '$xs' }}>
          <TextField
            placeholder="ETH Address or ENS"
            fullWidth
            error={error?.address ? true : undefined}
            autoComplete={'off'}
            onFocus={() => {
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
                <Close color={'neutral'} />
              </Flex>
            </>
          )}
        </Box>
      </NewMemberGridBox>
      <NewMemberGridBox css={{ mb: '$sm' }}>
        <Box css={{ mt: '$xs' }}>
          <Text variant={'formError'}>{error?.name && error?.name}</Text>
        </Box>
        <Box css={{ mt: '$xs' }}>
          <Text variant={'formError'}>{error?.address && error?.address}</Text>
        </Box>
      </NewMemberGridBox>
    </>
  );
};

export default NewMemberEntry;
