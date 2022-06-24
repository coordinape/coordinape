import React from 'react';

import { CloseIcon } from '../../icons/CloseIcon';
import { Box, Flex, Text, TextField } from '../../ui';

import { NewMember } from './AddMembersPage';

const EthAndNameEntry = ({
  nameToAdd,
  setNameToAdd,
  onFocus,
  onRemove,
}: {
  nameToAdd: NewMember;
  setNameToAdd(nameToAdd: NewMember): void;
  onFocus(): void;
  onRemove?(): void;
}) => {
  // TODO: add zod validation and react form hook stuff??
  return (
    <Flex css={{ mb: '$md', alignItems: 'stretch' }}>
      <Box css={{ mr: '$lg' }}>
        <Text variant={'label'}>ETH Address</Text>
        <TextField
          placeholder="ETH Address or ENS"
          inPanel
          onFocus={onFocus}
          value={nameToAdd.address}
          onChange={evt =>
            setNameToAdd({ ...nameToAdd, address: evt.target.value })
          }
        />
      </Box>
      <Box css={{ mr: '$md' }}>
        <Text variant={'label'}>Name</Text>
        <TextField
          placeholder="Name"
          inPanel
          onFocus={onFocus}
          value={nameToAdd.name}
          onChange={evt =>
            setNameToAdd({ ...nameToAdd, name: evt.target.value })
          }
        />
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
