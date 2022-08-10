/* eslint-disable */

import React, { useEffect, useState } from 'react';

import { Box, Button, Flex, Panel, Text } from '../../ui';

import EthAndNameEntry from './NewMemberEntry';
import { z } from 'zod';
import { zEthAddressOnly } from '../../forms/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { client } from '../../lib/gql/client';
import { normalizeError } from '../../utils/reporting';
import { useApeSnackbar } from '../../hooks';
import { LoadingModal } from '../../components';
import { Check, Info, Trash } from '../../icons/__generated';
import CopyCodeTextField from './CopyCodeTextField';
import { TrashIcon } from '../../ui/icons/TrashIcon';

const NewMemberList = ({
  // TODO: figure out what to do w/ revoke
  // revokeWelcome,
  circleId,
  welcomeLink,
}: {
  circleId: number;
  welcomeLink: string;
  revokeWelcome(): void;
}) => {
  const newMemberSchema = z.object({
    newMembers: z
      .array(
        z
          .object({
            address: zEthAddressOnly.or(z.literal('')),
            name: z.string().min(3).or(z.literal('')),
          })
          .superRefine((data, ctx) => {
            if (data.name && data.name !== '' && data.address === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['address'],
                message: 'Address is required if name is provided',
              });
            }
            if (data.address && data.address !== '' && data.name === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['name'],
                message: 'Name is required if address is provided',
              });
            }
          })
      )
      .superRefine((data, ctx) => {
        if (data.filter(m => m.address != '' && m.name != '').length == 0) {
          //TODO: I want to use this to prevent form submission of there are no valid entries
          // but it just breaks the more useful errors from rendering
          // ctx.addIssue({
          //   code: z.ZodIssueCode.custom,
          //   message: 'no valid members entered',
          // });
        }
      }),
  });

  const { showError } = useApeSnackbar();

  const [loading, setLoading] = useState<boolean>();
  const [successCount, setSuccessCount] = useState<number>(0);

  const defaultValues = {
    newMembers: [
      { name: '', address: '' },
      { name: '', address: '' },
    ],
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState,
    watch,
    getValues,
  } = useForm({
    resolver: zodResolver(newMemberSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues,
  });
  const { errors } = formState;

  const {
    fields: newMemberFields,
    append: appendNewMember,
    remove: removeNewMember,
  } = useFieldArray({
    name: 'newMembers',
    control,
  });

  const submitNewMembers = async () => {
    const newMembers = getValues('newMembers') as {
      name: string;
      address: string;
    }[];
    try {
      setLoading(true);
      setSuccessCount(0);
      const filteredMembers = newMembers.filter(
        m => m.address != '' && m.name != ''
      );
      await client.mutate({
        createUsers: [
          {
            payload: {
              circle_id: circleId,
              users: filteredMembers,
            },
          },
          {
            __typename: true,
          },
        ],
      });
      // ok it worked, clear out?
      setSuccessCount(filteredMembers.length);
      reset();
    } catch (e) {
      showError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('errors', formState.errors);
  }, [formState.errors]);

  const ethNameFocused = (idx: number) => {
    // make sure there is at least idx+1 elements in the namesToAdd Array
    if (newMemberFields.length - 1 <= idx) {
      appendNewMember(
        {
          name: '',
          address: '',
        },
        {
          shouldFocus: false,
        }
      );
    }
  };

  return (
    <Box>
      <Panel nested>
        <form onSubmit={handleSubmit(submitNewMembers)}>
          {loading && <LoadingModal visible={true} />}
          <Box>
            <Box>
              <Text variant={'label'}>Wallet Address</Text>
            </Box>
            <Box>
              <Text variant={'label'}>Name</Text>
            </Box>
            {newMemberFields.map((field, idx) => {
              let err: { name?: string; address?: string } | undefined =
                undefined;
              if (errors) {
                console.log('eror');
                console.log(errors);
                const addrErrors = errors['newMembers'] as {
                  address?: { message?: string };
                  name?: { message?: string };
                  message?: string;
                }[];
                if (addrErrors) {
                  let e = {
                    name: addrErrors[idx]?.name?.message,
                    address: addrErrors[idx]?.address?.message,
                  };
                  if (e.name || e.address) {
                    // if there is an error pass it along
                    err = e;
                  }
                }
              }
              return (
                <EthAndNameEntry
                  key={field.id}
                  onFocus={() => ethNameFocused(idx)}
                  onRemove={idx > 0 ? () => removeNewMember(idx) : undefined}
                  register={register}
                  index={idx}
                  error={err}
                />
              );
            })}
          </Box>
          <Box>
            <Button
              type="submit"
              disabled={loading || errors?.newMembers !== undefined}
              color="primary"
              size="large"
              fullWidth
            >
              Add Members
            </Button>
          </Box>
        </form>
      </Panel>
      {(successCount > 0 || true) && (
        <Box>
          <Panel success css={{ my: '$xl' }}>
            <Flex>
              <Check color={'successDark'} size={'lg'} css={{ mr: '$md' }} />
              <Text size={'large'}>
                You have added {successCount} member
                {successCount == 1 ? '' : 's'}
                !&nbsp;
                <Text bold>Share the link to get them started.</Text>
              </Text>
            </Flex>
          </Panel>

          <Box>
            <div>
              <Text variant={'label'} css={{ mb: '$xs' }}>
                Shareable Circle Link
                <Info
                  color={'secondaryText'}
                  css={{
                    ml: '$sm',
                    // TODO: need to fix the generated icons to be able to take in css prop and not clobber it
                    // i have to add path here because it gets clobbered otherwise -g
                    '& path': {
                      stroke: 'none',
                    },
                  }}
                />
              </Text>
              <CopyCodeTextField value={welcomeLink} />
              {/* Revoke is disabled for now until we figure out the UI for it
              <Button color={'transparent'} onClick={revokeWelcome}>*/}
              {/*  <Trash />*/}
              {/*</Button>*/}
            </div>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NewMemberList;
