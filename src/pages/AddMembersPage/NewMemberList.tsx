/* eslint-disable */

import React from 'react';

import { Box } from '../../ui';

import { NewMember } from './AddMembersPage';
import EthAndNameEntry from './NewMemberEntry';

const NewMemberList = ({
  newMembers,
  setNewMembers,
}: {
  newMembers: NewMember[];
  setNewMembers: React.Dispatch<React.SetStateAction<NewMember[]>>;
}) => {
  const ethNameFocused = (idx: number) => {
    // make sure there is at least idx+1 elements in the namesToAdd Array
    setNewMembers(prevState => {
      if (prevState.length - 1 <= idx) {
        return [
          ...prevState,
          {
            address: '',
            name: '',
          },
        ];
      }
      return prevState;
    });
  };

  const removeNewMember = (idx: number) => {
    setNewMembers(prevState => {
      console.log('original, deleitng', idx);
      console.log([...prevState]);
      const changed = [...prevState].filter((value, index) => {
        console.log('checking value', value);
        console.log('idx:' + idx + ' index:' + index);
        return index != idx;
      });
      console.log('CHANGED');
      console.log(changed);
      return changed;
    });
  };

  const updateNewMember = (idx: number, nameToAdd: NewMember) => {
    setNewMembers(prevState => {
      const copied = [...prevState];
      copied[idx] = nameToAdd;
      return copied;
    });
  };

  return (
    <Box>
      {newMembers.map((nameToAdd, idx) => {
        return (
          <EthAndNameEntry
            key={idx}
            onFocus={() => ethNameFocused(idx)}
            onRemove={idx > 0 ? () => removeNewMember(idx) : undefined}
            nameToAdd={nameToAdd}
            setNameToAdd={(nameToAdd: NewMember) =>
              updateNewMember(idx, nameToAdd)
            }
          />
        );
      })}
    </Box>
  );
};

export default NewMemberList;
