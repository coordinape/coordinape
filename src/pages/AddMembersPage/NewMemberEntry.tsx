import assert from 'assert';
import React, { useEffect, useState } from 'react';

import { isAddress } from '@ethersproject/address';
import { client } from 'lib/gql/client';
import { zEthAddress, zUsername } from 'lib/zod/formHelpers';
import {
  Control,
  FieldValues,
  useController,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form';
import { z } from 'zod';

import { Box, Flex, Text, TextField } from '../../ui';
import { X } from 'icons/__generated';

import { Group, GroupType } from './AddMembersPage';
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
  setError,
  group,
  groupType,
}: {
  onFocus(): void;
  onRemove?(): void;
  register: UseFormRegister<FieldValues>;
  index: number;
  error?: { name?: string; address?: string };
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  setError: UseFormSetError<FormValues>;
  group: Group;
  groupType: GroupType;
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
        try {
          const { profiles } = await client.query(
            {
              profiles: [
                {
                  where: { address: { _ilike: addressField.value } },
                  limit: 1,
                },
                {
                  name: true,
                  ...(groupType === 'circle' && {
                    users: [
                      { where: { circle_id: { _eq: group.id } } },
                      { id: true },
                    ],
                  }),
                  ...(groupType === 'organization' && {
                    org_members: [
                      { where: { org_id: { _eq: group.organization_id } } },
                      { id: true },
                    ],
                  }),
                },
              ],
            },
            { operationName: 'NewMemberEntry_getUserName' }
          );
          assert(profiles, 'failed to fetch user profiles');

          const name = profiles[0]?.name ?? '';
          if (name.length > 0) {
            setValue(`newMembers.${index}.name`, name, {
              shouldValidate: true,
            });
            if (groupType === 'circle' && profiles[0].users?.[0]?.id) {
              setError(`newMembers.${index}.address`, {
                type: 'custom',
                message: 'existing circle member ',
              });
            }
            if (
              groupType === 'organization' &&
              profiles[0].org_members?.[0]?.id
            ) {
              setError(`newMembers.${index}.address`, {
                type: 'custom',
                message: 'existing org member ',
              });
            }
            setIsFetched(true);
          } else {
            // re-enable name input if there is no name stored
            setIsFetched(false);
          }
        } catch (e: any) {
          setIsFetched(false);
          const errorMessage = e.message;
          if (errorMessage)
            console.error(e, `profile address:${addressField.value}`);
        }
      };
      getName();
    } else {
      // re-enable name input when the address be not valid
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
