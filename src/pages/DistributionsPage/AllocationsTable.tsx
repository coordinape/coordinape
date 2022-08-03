import { useCallback, useMemo, useState } from 'react';

import { Paginator } from '../../components/Paginator';
import { DISTRIBUTION_TYPE } from '../../config/constants';
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
  fixedDist,
  circleDist,
}: {
  users: {
    id: number;
    name: string;
    address: string;
    received: number;
    claimed: number;
    circle_claimed: number;
    combined_claimed: number;
    fixed_payment_amount: number;
    avatar: string | undefined;
    givers: number;
  }[];
  totalGive: number;
  formGiftAmount: number;
  tokenName: string | undefined;
  fixedTokenName: string | undefined;
  giveTokenName: string | undefined;
  downloadCSV: (
    epoch: number,
    epochId: number,
    formGiftAmount: number,
    giftTokenSymbol: string
  ) => Promise<any>;
  epoch: EpochDataResult;
  fixedDist: EpochDataResult['distributions'][0] | undefined;
  circleDist: EpochDataResult['distributions'][0] | undefined;
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
    { title: `% of ${giveTokenName || 'GIVE'}` },
    { title: 'Circle Rewards' },
    { title: 'Fixed Payments' },
  ];
  if (combinedDist) {
    headers.push({ title: 'Funds Allocated' });
  }
  return (
    <Panel>
      <Flex
        css={{
          justifyContent: 'space-between',
          mb: '$lg',
          alignItems: 'center',
        }}
      >
        <Text h3 css={{ fontWeight: '$semibold', color: '$headingText' }}>
          Distributions Table
        </Text>
        <Button
          type="button"
          color="primary"
          outlined
          onClick={async () => {
            // use the authed api to download the CSV
            if (epoch.number) {
              const csv = await downloadCSV(
                epoch.number,
                epoch.id,
                formGiftAmount,
                tokenName || ''
              );
              if (csv?.file) {
                const a = document.createElement('a');
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
                ? `${numberWithCommas(
                    (circleDist &&
                    circleDist.distribution_type === DISTRIBUTION_TYPE.COMBINED
                      ? user.circle_claimed - user.fixed_payment_amount
                      : user.circle_claimed
                    ).toFixed(2)
                  )} ${tokenName || 'GIVE'}`
                : `${numberWithCommas(
                    (givenPercent(user) * formGiftAmount).toFixed(2)
                  )} ${tokenName || 'GIVE'}`}
            </td>
            <td>
              {!combinedDist && fixedDist
                ? numberWithCommas(user.claimed.toFixed(2))
                : numberWithCommas(user.fixed_payment_amount.toFixed(2))}{' '}
              {fixedTokenName || ''}
            </td>
            {combinedDist ? (
              <td>
                {(() => {
                  if (circleDist && fixedDist) {
                    return numberWithCommas(user.combined_claimed.toFixed(2));
                  }
                  const giftAmt = circleDist
                    ? user.circle_claimed
                    : givenPercent(user) * formGiftAmount;
                  return numberWithCommas(
                    (giftAmt + user.fixed_payment_amount).toFixed(2)
                  );
                })()}{' '}
                {tokenName}
              </td>
            ) : null}
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
          Documentation: Paying Your Team
        </Link>
        <Paginator pages={totalPages} current={page} onSelect={setPage} />
      </Flex>
    </Panel>
  );
};
