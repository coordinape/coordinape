import { useCallback } from 'react';

import { NewApeAvatar, makeTable } from 'components';
import { Flex, Text } from 'ui';
import { shortenAddress } from 'utils';

export const AllocationsTable = ({
  users,
  totalGive,
  tokenName,
  fixedTokenName,
}: {
  users: {
    id: number;
    name: string;
    address: string;
    received: number;
    claimed: number;
    circle_claimed: number;
    fixed_payment_amount: number;
    givers: number;
  }[];
  totalGive: number;
  tokenName: string | undefined;
  fixedTokenName: string | undefined;
}) => {
  type User = Exclude<typeof users[0], undefined>;

  const givenPercent = useCallback(
    (u: User) => u.received / totalGive,
    [totalGive]
  );
  const combinedDist =
    tokenName && fixedTokenName && tokenName === fixedTokenName;
  const UserTable = makeTable<User>('UserTable');
  const headers = [
    { title: 'Name' },
    { title: 'ETH' },
    { title: 'Givers' },
    { title: `${tokenName || 'GIVE'} Received` },
    { title: '% of Epoch' },
    { title: 'Circle Rewards' },
    { title: 'Fixed Rewards' },
  ];
  if (combinedDist) {
    headers.push({ title: 'Funds Allocated' });
  }
  return (
    <UserTable
      headers={headers}
      data={users}
      startingSortIndex={2}
      startingSortDesc
      sortByColumn={(index: number) => {
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
          <td>{user.givers}</td>
          <td>{user.received}</td>
          <td>{(givenPercent(user) * 100).toFixed(2)}%</td>
          <td>
            {user.circle_claimed
              ? `${user.circle_claimed} ${tokenName || 'GIVE'}`
              : '-'}
          </td>
          <td>
            {!combinedDist && user.claimed
              ? user.claimed
              : user.fixed_payment_amount}{' '}
            {fixedTokenName || ''}
          </td>
          {combinedDist && (
            <td>
              {user.claimed} {tokenName}
            </td>
          )}
        </tr>
      )}
    </UserTable>
  );
};
