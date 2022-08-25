import React, { useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { z } from 'zod';

import { LoadingModal } from '../../components';
import { zEthAddress, zUsername } from '../../forms/formHelpers';
import { useApeSnackbar, useApiBase } from '../../hooks';
import { Check /* Working */ } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Box, Button, Flex, Panel, Text } from '../../ui';
import { normalizeError } from '../../utils/reporting';

import ConstrainedBox from './ConstrainedBox';
import CopyCodeTextField from './CopyCodeTextField';
import NewMemberEntry from './NewMemberEntry';
import NewMemberGridBox from './NewMemberGridBox';

const NewMemberList = ({
  // TODO: revoke comes later - maybe on admin page
  // revokeWelcome,
  circleId,
  welcomeLink,
}: {
  circleId: number;
  welcomeLink: string;
  revokeWelcome(): void;
}) => {
  const { fetchCircle } = useApiBase();
  const { showError } = useApeSnackbar();

  const [loading, setLoading] = useState<boolean>();
  const [successCount, setSuccessCount] = useState<number>(0);

  const successRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const newMemberSchema = z.object({
    newMembers: z.array(
      z
        .object({
          address: zEthAddress.or(z.literal('')),
          name: zUsername.or(z.literal('')),
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
    ),
  });

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
    formState: { errors, isValid },
    getValues,
    watch,
  } = useForm({
    resolver: zodResolver(newMemberSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
    defaultValues,
  });

  const {
    fields: newMemberFields,
    append: appendNewMember,
    remove: removeNewMember,
  } = useFieldArray({
    name: 'newMembers',
    control,
  });

  const newMembers = watch('newMembers');

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
      successRef.current?.scrollIntoView();
      await queryClient.invalidateQueries(['circleSettings', circleId]);
      await fetchCircle({ circleId });
    } catch (e) {
      showError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  };

  const newMemberFocused = (idx: number) => {
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

  function errorForMemberIndex(idx: number) {
    let err: { name?: string; address?: string } | undefined = undefined;
    if (errors) {
      const addrErrors = errors['newMembers'] as {
        address?: { message?: string };
        name?: { message?: string };
        message?: string;
      }[];
      if (addrErrors) {
        const e = {
          name: addrErrors[idx]?.name?.message,
          address: addrErrors[idx]?.address?.message,
        };
        if (e.name || e.address) {
          // if there is an error pass it along
          err = e;
        }
      }
    }
    return err;
  }

  return (
    <ConstrainedBox>
      <Panel nested>
        <form onSubmit={handleSubmit(submitNewMembers)}>
          {loading && <LoadingModal visible={true} />}
          <Box data-testid="new-members">
            <NewMemberGridBox>
              <Box>
                <Text variant="label">Name</Text>
              </Box>
              <Box>
                <Text variant="label">Wallet Address</Text>
              </Box>
            </NewMemberGridBox>
            {newMemberFields.map((field, idx) => {
              const err = errorForMemberIndex(idx);
              return (
                <NewMemberEntry
                  key={field.id}
                  onFocus={() => newMemberFocused(idx)}
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
              disabled={
                loading ||
                !isValid ||
                newMembers.filter(m => m.address != '' && m.name != '')
                  .length == 0
              }
              color="primary"
              size="large"
              fullWidth
            >
              Add Members
            </Button>
          </Box>
        </form>
      </Panel>

      <div ref={successRef}>
        {successCount > 0 && (
          <>
            <Panel success css={{ mt: '$xl' }}>
              <Flex>
                <Check color="successDark" size="lg" css={{ mr: '$md' }} />
                <Text size="large">
                  You have added {successCount} member
                  {successCount == 1 ? '' : 's'}
                  !&nbsp;
                  <Text bold>Share the link to get them started.</Text>
                </Text>
              </Flex>
            </Panel>

            <Box css={{ mt: '$xl' }}>
              <div>
                <Text variant="label" css={{ mb: '$xs' }}>
                  Shareable Circle Link
                </Text>
                <CopyCodeTextField value={welcomeLink} />
                {/* Revoke is disabled for now until we figure out the UI for it*/}
                {/*<Button color={'transparent'} onClick={revokeWelcome}>*/}
                {/*  <Working />*/}
                {/*</Button>*/}
              </div>
            </Box>
          </>
        )}
      </div>
    </ConstrainedBox>
  );
};

export default NewMemberList;
