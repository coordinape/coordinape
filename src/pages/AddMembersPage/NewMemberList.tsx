/* eslint-disable */

import React, { useEffect, useState } from 'react';

import { Box, Button } from '../../ui';

// import { NewMember } from './AddMembersPage';
import EthAndNameEntry from './NewMemberEntry';
import { boolean, z } from 'zod';
import { zEthAddressOnly } from '../../forms/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { client } from '../../lib/gql/client';
import { normalizeError } from '../../utils/reporting';
import { useApeSnackbar } from '../../hooks';

const NewMemberList = ({
  circleId,
}: // newMembers,
// setNewMembers,
{
  circleId: number;
  // newMembers: NewMember[];
  // setNewMembers: React.Dispatch<React.SetStateAction<NewMember[]>>;
}) => {
  const newMemberSchema = z.object({
    address: z.array(z.object({ value: zEthAddressOnly })),
    name: z.array(z.object({ value: z.string().min(3) })),
  });

  const { showError } = useApeSnackbar();

  const [loading, setLoading] = useState<boolean>();
  const [success, setSuccess] = useState<boolean>();
  const formOptions = {
    resolver: zodResolver(newMemberSchema),
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState,
    watch,
    getValues,
  } = useForm(formOptions);
  const { errors } = formState;

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    name: 'address',
    control,
  });

  const {
    fields: nameFields,
    append: appendName,
    remove: removeName,
  } = useFieldArray({
    name: 'name',
    control,
  });

  const submitNewMembers = async () => {
    let newMembers: { name: string; address: string }[] = [];
    const addrs = getValues('address') as string[];
    const names = getValues('name') as string[];
    for (let i = 0; i < addrs.length; i++) {
      const address = addrs[i];
      const name = names[i];
      if (address != '' && name != '') {
        newMembers.push({ name, address });
      }
    }
    try {
      setLoading(true);
      await client.mutate({
        createUsers: [
          {
            payload: {
              circle_id: circleId,
              users: newMembers.filter(m => m.address != '' && m.name != ''),
            },
          },
          {
            __typename: true,
          },
        ],
      });
      // ok it worked, clear out?
      setSuccess(true);
    } catch (e) {
      showError(normalizeError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('USEFF');
    // make sure there is one empty one in each field array
    appendAddress('', {
      shouldFocus: false,
    });
    appendName('', {
      shouldFocus: false,
    });
  }, []);

  useEffect(() => {
    console.log('errors', formState.errors);
  }, [formState.errors]);

  const ethNameFocused = (idx: number) => {
    console.log('FOCUSPARTY:', addressFields.length, idx);
    // make sure there is at least idx+1 elements in the namesToAdd Array
    if (addressFields.length - 1 <= idx) {
      appendAddress('', {
        shouldFocus: false,
      });
      appendName('', {
        shouldFocus: false,
      });
    }
    // setNewMembers(prevState => {
    //   if (prevState.length - 1 <= idx) {
    //     return [
    //       ...prevState,
    //       {
    //         address: '',
    //         name: '',
    //       },
    //     ];
    //   }
    //   return prevState;
    // });
  };

  const removeNewMember = (idx: number) => {
    removeName(idx);
    removeAddress(idx);
    // setNewMembers(prevState => {
    //   console.log('original, deleitng', idx);
    //   console.log([...prevState]);
    //   const changed = [...prevState].filter((value, index) => {
    //     console.log('checking value', value);
    //     console.log('idx:' + idx + ' index:' + index);
    //     return index != idx;
    //   });
    //   console.log('CHANGED');
    //   console.log(changed);
    //   return changed;
    // });
  };
  //
  // const updateNewMember = (idx: number, nameToAdd: NewMember) => {
  //   setNewMembers(prevState => {
  //     const copied = [...prevState];
  //     copied[idx] = nameToAdd;
  //     return copied;
  //   });
  // };

  // TODO: typing
  const onSubmit = (data: any) => {
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
  };

  const m = errors && errors['address'];
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
        {/*{newMembers.map((nameToAdd, idx) => {*/}
        {/*  return (*/}
        {/*    <EthAndNameEntry*/}
        {/*      key={idx}*/}
        {/*      onFocus={() => ethNameFocused(idx)}*/}
        {/*      onRemove={idx > 0 ? () => removeNewMember(idx) : undefined}*/}
        {/*      nameToAdd={nameToAdd}*/}
        {/*      setNameToAdd={(nameToAdd: NewMember) =>*/}
        {/*        updateNewMember(idx, nameToAdd)*/}
        {/*      }*/}
        {/*    />*/}
        {/*  );*/}
        {/*})}*/}
        {addressFields.map((field, idx) => {
          let err: { name?: string; address?: string } | undefined = undefined;
          if (errors) {
            const addrErrors = errors['address'] as {
              value?: { message?: string };
            }[];
            let addrError: string | undefined;
            let nameError: string | undefined;
            if (addrErrors) {
              addrError = addrErrors[idx]?.value?.message;
            }

            const nameErrors = errors['name'] as {
              value?: { message?: string };
            }[];
            if (nameErrors) {
              nameError = nameErrors[idx]?.value?.message;
            }

            if (nameError || addrError) {
              err = { name: nameError, address: addrError };
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
      {!success && (
        <Box>
          <Button
            type="submit"
            disabled={loading}
            color="primary"
            size="large"
            fullWidth
            // onClick={submitNewMembers}
          >
            Add Members
          </Button>
        </Box>
      )}
    </form>
  );
};

export default NewMemberList;
