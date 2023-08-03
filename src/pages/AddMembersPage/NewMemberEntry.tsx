import React, { useEffect, useState } from 'react';

import { isAddress } from '@ethersproject/address';
import { client } from 'lib/gql/client';
import { zEthAddress, zUsername } from 'lib/zod/formHelpers';
import {
  Control,
  FieldValues,
  useController,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { z } from 'zod';

import { Box, Flex, Text, TextField } from '../../ui';
import { X } from 'icons/__generated';

import NewMemberGridBox from './NewMemberGridBox';

const FormValuesSchema = z.object({
  newMembers: z.array(
    z.object({
      address: zEthAddress.or(z.literal('')),
      name: zUsername.or(z.literal('')),
      entrance: z.string(),
    })
  ),
});
type FormValues = z.infer<typeof FormValuesSchema>;

const NewMemberEntry = ({
  onFocus,
  onRemove,
  register,
  index,
  error,
  control,
  setValue,
}: {
  onFocus(): void;
  onRemove?(): void;
  register: UseFormRegister<FieldValues>;
  index: number;
  error?: { name?: string; address?: string };
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}) => {
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const { field: addressField, fieldState: addressFieldState } = useController({
    control,
    name: `newMembers.${index}.address`,
    defaultValue: '',
  });

  useEffect(() => {
    if (!addressFieldState.error && isAddress(addressField.value)) {
      const getName = async () => {
        const { getUserName } = await client.query(
          {
            getUserName: [
              { payload: { address: addressField.value } },
              { name: true },
            ],
          },
          { operationName: 'NewMemberEntry_getUserName' }
        );
        if (getUserName && getUserName.name.length > 0) {
          setValue(`newMembers.${index}.name`, getUserName.name);
          setIsFetched(true);
        } else {
          // re-enable name input if there is no name stored
          setIsFetched(false);
        }
      };
      getName();
    } else {
      // re-enable name input if address is not valid
      setIsFetched(false);
    }
  }, [addressFieldState.error?.message, addressField.value]);

  return (
    <>
      <NewMemberGridBox>
        <Box>
          <TextField
            placeholder="Name"
            fullWidth
            error={error?.name ? true : undefined}
            autoComplete={'off'}
            disabled={isFetched}
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
        <input type="hidden" {...register(`newMembers.${index}.entrance`)} />
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
                <X color={'neutral'} />
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
