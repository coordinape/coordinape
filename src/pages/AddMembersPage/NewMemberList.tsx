/* eslint-disable */

import React from 'react';

import { Box } from '../../ui';

import { NewMember } from './AddMembersPage';
import EthAndNameEntry from './NewMemberEntry';
import { z } from 'zod';
import { zEthAddressOnly } from '../../forms/formHelpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';

const NewMemberList = ({}: // newMembers,
// setNewMembers,
{
  // newMembers: NewMember[];
  // setNewMembers: React.Dispatch<React.SetStateAction<NewMember[]>>;
}) => {
  const newMemberSchema = z.object({
    newMembers: z.array(
      z.object({
        name: z.string(),
        address: zEthAddressOnly,
      })
    ),
  });

  const formOptions = { resolver: zodResolver(newMemberSchema) };
  const { register, control, handleSubmit, reset, formState, watch } =
    useForm(formOptions);
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    name: 'tickets',
    control,
  });

  const ethNameFocused = (idx: number) => {
    // make sure there is at least idx+1 elements in the namesToAdd Array
    if (fields.length - 1 <= idx) {
      append({ name: '', address: '' });
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
    remove(idx);
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

  const updateNewMember = (idx: number, nameToAdd: NewMember) => {
    setNewMembers(prevState => {
      const copied = [...prevState];
      copied[idx] = nameToAdd;
      return copied;
    });
  };

  // TODO: typing
  const onSubmit = (data: any) => {
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
  };

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
        {fields.map((item, idx) => (
          <EthAndNameEntry
            key={idx}
            onFocus={() => ethNameFocused(idx)}
            onRemove={idx > 0 ? () => removeNewMember(idx) : undefined}
            nameToAdd={nameToAdd}
            setNameToAdd={(nameToAdd: NewMember) =>
              updateNewMember(idx, nameToAdd)
            }
          />
        ))}
      </Box>
      <button type="submit">submitters</button>
    </form>
  );
};

export default NewMemberList;
