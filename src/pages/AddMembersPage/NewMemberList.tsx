import { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ENTRANCE } from 'common-lib/constants';
import { isValidENS } from 'lib/zod/formHelpers';
import partition from 'lodash/partition';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { LoadingModal } from '../../components';
import CopyCodeTextField from '../../components/CopyCodeTextField';
import { useToast } from '../../hooks';
import { zEthAddress, zUsername } from '../../lib/zod/formHelpers';
import { Box, Button, Flex, Panel, Text } from '../../ui';
import { Check } from 'icons/__generated';

import NewMemberEntry from './NewMemberEntry';
import NewMemberGridBox from './NewMemberGridBox';

export type NewMember = {
  name: string;
  address: string;
  entrance: string;
};

export type ChangedUser = {
  oldName?: string;
  newName: string;
  address?: string;
  existing: boolean;
};

const NewMemberList = ({
  // TODO: revoke comes later - maybe on admin page
  // revokeWelcome,
  welcomeLink,
  preloadedMembers,
  save,
}: {
  welcomeLink?: string;
  // revokeWelcome: () => void;
  preloadedMembers: NewMember[];
  save: (members: NewMember[]) => Promise<ChangedUser[]>;
}) => {
  const { showError } = useToast();

  const [loading, setLoading] = useState<boolean>();
  const [successCount, setSuccessCount] = useState<number>(0);
  const [changedUsers, setChangedUsers] = useState<ChangedUser[] | undefined>();

  const [defaultMembers, setDefaultMembers] =
    useState<NewMember[]>(preloadedMembers);

  const successRef = useRef<HTMLDivElement>(null);

  const emptyMember = { name: '', address: '', entrance: '' };

  const newMemberSchema = z.object({
    newMembers: z.array(
      z
        .object({
          address: zEthAddress.or(z.literal('')),
          name: zUsername.or(z.literal('')),
          entrance: z.string(),
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

  type FormSchema = z.infer<typeof newMemberSchema>;

  const defaultValues = {
    newMembers: [...defaultMembers, emptyMember, emptyMember],
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setError,
    watch,
    trigger,
  } = useForm<FormSchema>({
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

  const submitNewMembers: SubmitHandler<FormSchema> = async data => {
    const { newMembers } = data;
    try {
      setLoading(true);
      setSuccessCount(0);
      setChangedUsers(undefined);
      const filteredMembers = newMembers
        .filter(m => m.address != '' && m.name != '')
        .map(m => ({
          ...m,
          entrance:
            m.entrance === ENTRANCE.CSV ? ENTRANCE.CSV : ENTRANCE.MANUAL,
        }));

      const resolveResult = await Promise.all(
        newMembers.map(async (m, index) => {
          if (m.name.endsWith('.eth')) {
            const validENS = await isValidENS(m.name, m.address);
            if (!validENS) {
              setError(
                `newMembers.${index}.name`,
                {
                  message: `The ENS ${m.name} doesn't resolve to the address: ${m.address}.`,
                },
                { shouldFocus: true }
              );
              return true;
            }
          }
        })
      );
      if (resolveResult.find(r => r === true)) {
        return;
      }

      // TODO: check for new org members vs old org members
      const replacedNames = await save(filteredMembers);
      setChangedUsers(replacedNames);

      // ok it worked, clear out?
      setSuccessCount(filteredMembers.length);
      setDefaultMembers([]);
      reset({ newMembers: [emptyMember, emptyMember] });
      successRef.current?.scrollIntoView();
    } catch (e) {
      showError(e);
    } finally {
      setLoading(false);
    }
  };

  const newMemberFocused = (idx: number) => {
    // make sure there is at least idx+1 elements in the namesToAdd Array
    if (newMemberFields.length - 1 <= idx) {
      appendNewMember(emptyMember, { shouldFocus: false });
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

        // if there is an error pass it along
        if (e.name || e.address) {
          err = e;
        }
      }
    }
    return err;
  }

  useEffect(() => {
    // do initial form validation to validate the preloaded values (from csv or other import)
    trigger();
  }, []);

  const [alreadyMembers, differentlyNamed] = changedUsers
    ? partition(changedUsers, 'existing')
    : [[], []];

  const newAddedCount = successCount - alreadyMembers.length;

  return (
    <Box>
      <Panel invertForm css={{ padding: 0 }}>
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
            <Panel
              css={{ mt: '$xl', border: '1px solid $currentEpochDescription' }}
            >
              <Flex>
                <Check
                  color="currentEpochDescription"
                  size="lg"
                  css={{ mr: '$md' }}
                />
                <Box css={{ color: '$currentEpochDescription', flexGrow: 1 }}>
                  <Text size="medium" color="inherit">
                    You have added {newAddedCount} member
                    {newAddedCount == 1 ? '' : 's'}!
                    {welcomeLink && (
                      <>
                        &nbsp;
                        <Text semibold color="inherit">
                          Share this link to get them started.
                        </Text>
                      </>
                    )}
                  </Text>
                  {welcomeLink && (
                    <Box css={{ mt: '$md' }}>
                      <CopyCodeTextField value={welcomeLink} />
                    </Box>
                  )}
                </Box>
              </Flex>
            </Panel>

            {(differentlyNamed.length > 0 || alreadyMembers.length > 0) && (
              <Panel info>
                <Flex column css={{ gap: '$sm' }}>
                  {differentlyNamed.length > 0 && (
                    <>
                      <Text color="inherit" size="medium">
                        Some addresses match accounts that are already in our
                        system, so their names will be used:
                      </Text>
                      {differentlyNamed.map(user => (
                        <Text color="inherit" key={user.newName}>
                          {user.address}: &ldquo;{user.newName}&rdquo; will be
                          used instead of &ldquo;{user.oldName}&rdquo;
                        </Text>
                      ))}
                    </>
                  )}

                  {alreadyMembers.length > 0 && (
                    <>
                      <Text color="inherit" size="medium">
                        Some addresses belong to existing members:
                      </Text>
                      {alreadyMembers.map(user => (
                        <Text color="inherit" key={user.address}>
                          {user.address}: &ldquo;{user.newName}&rdquo;
                        </Text>
                      ))}
                    </>
                  )}
                </Flex>
              </Panel>
            )}

            {/*<Box css={{ mt: '$xl' }}>*/}
            {/*  <div>*/}
            {/*    <Text variant="label" css={{ mb: '$xs' }}>*/}
            {/*      Shareable Circle Link*/}
            {/*    </Text>*/}

            {/*    /!* Revoke is disabled for now until we figure out the UI for it*!/*/}
            {/*    /!*<Button color={'transparent'} onClick={revokeWelcome}>*!/*/}
            {/*    /!*  <Working />*!/*/}
            {/*    /!*</Button>*!/*/}
            {/*  </div>*/}
            {/*</Box>*/}
          </>
        )}
      </div>
    </Box>
  );
};

export default NewMemberList;
