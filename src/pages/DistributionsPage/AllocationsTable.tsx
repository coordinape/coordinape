import { useCallback } from 'react';

import { NewApeAvatar } from 'components';
import { Flex, Text } from 'ui';
import { shortenAddress } from 'utils';

import { makeTable } from './Table';

import { IAllocateUser } from 'types';

const UserTable = makeTable<IAllocateUser>('UserTable');

export const AllocationsTable = ({
  users,
  totalAmountInVault,
  totalGive,
  tokenName,
}: {
  users: IAllocateUser[];
  totalAmountInVault: number;
  totalGive: number;
  tokenName: string | undefined;
}) => {
  const givenAmount = (u: IAllocateUser) =>
    u.received_gifts.reduce((t, { tokens }) => t + tokens, 0);

  const givenPercent = useCallback(
    (u: IAllocateUser) => givenAmount(u) / totalGive,
    [totalGive]
  );

  return (
    <UserTable
      headers={[
        'Name',
        'ETH Wallet',
        `${tokenName || 'GIVE'} Received`,
        '% of Epoch',
        'Vault Funds Allocated',
      ]}
      data={users}
      startingSortIndex={2}
      startingSortDesc
      sortByIndex={(index: number) => {
        if (index === 0) return (u: IAllocateUser) => u.name;
        if (index === 1) return (u: IAllocateUser) => u.address;
        return (u: IAllocateUser) => givenAmount(u);
      }}
    >
      {user => (
        <tr key={user.id}>
          <td>
            <Flex row css={{ alignItems: 'center', gap: '$sm' }}>
              <NewApeAvatar
                name={user.name}
                style={{ height: '32px', width: '32px' }}
              />
              <Text semibold>{user.name}</Text>
            </Flex>
          </td>
          <td>{shortenAddress(user.address)}</td>
          <td>{user.received_gifts.length > 0 ? givenAmount(user) : '-'}</td>
          <td>
            {user.received_gifts.length > 0
              ? `${(givenPercent(user) * 100).toFixed(2)}%`
              : '-'}
          </td>
          <td>
            {!tokenName
              ? '-'
              : user.received_gifts.length > 0
              ? `${(givenPercent(user) * totalAmountInVault).toFixed(
                  2
                )} ${tokenName}`
              : '-'}
          </td>
        </tr>
      )}
    </UserTable>
  );
};
