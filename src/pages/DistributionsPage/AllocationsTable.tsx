import { useCallback, useMemo, useState } from 'react';

import { Paginator } from '../../components/Paginator';
import { NewApeAvatar, makeTable } from 'components';
import { Flex, Text, Panel, Button, Link } from 'ui';
import { numberWithCommas, shortenAddress } from 'utils';

import { EpochDataResult } from './queries';

export const AllocationsTable = ({
  users,
  totalGive,
  formGiftAmount,
  tokenName,
  fixedTokenName,
  giveTokenName,
  downloadCSV,
  epoch,
}: {
  users: {
    id: number;
    name: string;
    address: string;
    received: number;
    claimed: number;
    circle_claimed: number;
    fixed_payment_amount: number;
    avatar: string | undefined;
    givers: number;
  }[];
  totalGive: number;
  formGiftAmount: number;
  tokenName: string | undefined;
  fixedTokenName: string | undefined;
  giveTokenName: string | undefined;
  downloadCSV: (epoch: number) => Promise<any>;
  epoch: EpochDataResult;
}) => {
  type User = Exclude<typeof users[0], undefined>;
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const shownUsers = useMemo(
    () => users.slice(page * pageSize, (page + 1) * pageSize),
    [users, page]
  );
  const givenPercent = useCallback(
    (u: User) => u.received / totalGive,
    [totalGive]
  );
  const combinedDist =
    tokenName && fixedTokenName && tokenName === fixedTokenName;
  const totalPages = Math.ceil(users.length / pageSize);

  const UserTable = makeTable<User>('UserTable');
  const headers = [
    { title: 'Name' },
    { title: 'ETH' },
    { title: 'Givers' },
    { title: `${giveTokenName || 'GIVE'} Received` },
    { title: '% of Epoch' },
    { title: 'Circle Rewards' },
    { title: 'Fixed Rewards' },
  ];
  if (combinedDist) {
    headers.push({ title: 'Funds Allocated' });
  }
  return (
    <Panel>
      <Flex
        css={{
          justifyContent: 'space-between',
        }}
      >
        <Text
          h3
          css={{ fontWeight: '$semibold', color: '$headingText', mb: '$lg' }}
        >
          Distributions Table
        </Text>
        <Button
          type="button"
          color="primary"
          outlined
          onClick={async () => {
            // use the authed api to download the CSV
            if (epoch.number) {
              const csv = await downloadCSV(epoch.number);
              const circle = epoch.circle;
              if (csv?.file) {
                const a = document.createElement('a');
                a.download = `${circle?.organization.name}-${circle?.name}-epoch-${epoch.number}.csv`;
                a.href = csv.file;
                a.click();
                a.href = '';
              }
            }
            return false;
          }}
        >
          Export CSV
        </Button>
      </Flex>
      <UserTable
        headers={headers}
        data={shownUsers}
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
                  profileImagePath={user.avatar}
                />
                <Text semibold>{user.name}</Text>
              </Flex>
            </td>
            <td>{shortenAddress(user.address)}</td>
            <td>{user.givers}</td>
            <td>{numberWithCommas(user.received)}</td>
            <td>{(givenPercent(user) * 100).toFixed(2)}%</td>
            <td>
              {user.circle_claimed
                ? `${numberWithCommas(user.circle_claimed.toFixed(2))} ${
                    tokenName || 'GIVE'
                  }`
                : `${numberWithCommas(
                    (givenPercent(user) * formGiftAmount).toFixed(2)
                  )} ${tokenName || 'GIVE'}`}
            </td>
            <td>
              {!combinedDist && user.claimed
                ? numberWithCommas(user.claimed.toFixed(2))
                : numberWithCommas(user.fixed_payment_amount.toFixed(2))}{' '}
              {fixedTokenName || ''}
            </td>
            {combinedDist && (
              <td>
                {numberWithCommas(user.claimed.toFixed(2))} {tokenName}
              </td>
            )}
          </tr>
        )}
      </UserTable>
      <Flex
        css={{
          justifyContent: 'space-between',
          mt: '$lg',
        }}
      >
        <Link
          css={{ color: '$primary' }}
          target="_blank"
          href="https://docs.coordinape.com/get-started/compensation/paying-your-team"
        >
          Paying Your Team Documentation
        </Link>
        <Paginator pages={totalPages} current={page} onSelect={setPage} />
      </Flex>
    </Panel>
  );
};
