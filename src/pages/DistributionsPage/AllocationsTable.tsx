import { useCallback } from 'react';

import { NewApeAvatar } from 'components';
import { Flex, Text } from 'ui';
import { shortenAddress } from 'utils';

import type { Gift } from './DistributionsPage';
import { makeTable } from './Table';

export const AllocationsTable = ({
  users,
  totalAmountInVault,
  totalGive,
  tokenName,
}: {
  users: (Gift['recipient'] & { received: number })[];
  totalAmountInVault: number;
  totalGive: number;
  tokenName: string | undefined;
}) => {
  type User = Exclude<typeof users[0], undefined>;

  const givenPercent = useCallback(
    (u: User) => u.received / totalGive,
    [totalGive]
  );

  const UserTable = makeTable<User>('UserTable');

  return (
    <UserTable
      headers={[
        'Name',
        'ETH Wallet',
        'GIVE Received',
        '% of Epoch',
        'Vault Funds Allocated',
      ]}
      data={users}
      startingSortIndex={2}
      startingSortDesc
      sortByIndex={(index: number) => {
        if (index === 0) return (u: User) => u.name;
        if (index === 1) return (u: User) => u.address;
        return (u: User) => u.received;
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
          <td>{user.received}</td>
          <td> {(givenPercent(user) * 100).toFixed(2)}%</td>
          <td>
            {!tokenName
              ? '-'
              : `${(givenPercent(user) * totalAmountInVault).toFixed(
                  2
                )} ${tokenName}`}
          </td>
        </tr>
      )}
    </UserTable>
  );
};
