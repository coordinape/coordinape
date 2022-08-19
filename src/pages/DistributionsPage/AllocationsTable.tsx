import { useCallback, useMemo, useState } from 'react';

import sumBy from 'lodash/sumBy';
import uniqBy from 'lodash/uniqBy';

import { Paginator } from '../../components/Paginator';
import { DISTRIBUTION_TYPE } from '../../config/constants';
import { NewApeAvatar, makeTable } from 'components';
import { Flex, Text, Panel, Button, Link } from 'ui';
import { numberWithCommas, shortenAddress } from 'utils';

import type { Gift } from './queries';
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
    (received: number) => received / totalGive,
    [totalGive]
  );

  const showDeletedInfo = (token_gifts?: Gift[]) => {
    const deletedGifts = token_gifts?.filter((g: Gift) => !g.recipient);
    const sumGive = sumBy(deletedGifts, 'tokens');
    const num = uniqBy(deletedGifts, 'recipient_id').length;

    if (num < 1) return;
    return (
      <Text p as="p" size="medium" css={{ mt: '$sm' }}>
        Note: This epoch included {num} deleted {num > 1 ? 'users' : 'user'} who
        received {sumGive} GIVE.
      </Text>
    );
  };

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
            <td>{user.received}</td>
            <td>{numberWithCommas(givenPercent(user.received) * 100, 2)}%</td>
            <td>
              {user.circle_claimed
                ? `${numberWithCommas(
                    circleDist &&
                      circleDist.distribution_type ===
                        DISTRIBUTION_TYPE.COMBINED
                      ? user.circle_claimed - user.fixed_payment_amount
                      : user.circle_claimed,
                    2
                  )} ${tokenName || 'GIVE'}`
                : `${numberWithCommas(
                    givenPercent(user.received) * formGiftAmount,
                    2
                  )} ${tokenName || 'GIVE'}`}
            </td>
            <td>
              {!combinedDist && fixedDist
                ? numberWithCommas(user.claimed, 2)
                : numberWithCommas(user.fixed_payment_amount, 2)}{' '}
              {fixedTokenName || ''}
            </td>
            {combinedDist ? (
              <td>
                {(() => {
                  if (circleDist && fixedDist) {
                    return numberWithCommas(user.combined_claimed, 2);
                  }
                  const giftAmt = circleDist
                    ? user.circle_claimed
                    : givenPercent(user.received) * formGiftAmount;
                  return numberWithCommas(
                    giftAmt + user.fixed_payment_amount,
                    2
                  );
                })()}{' '}
                {tokenName}
              </td>
            ) : null}
          </tr>
        )}
      </UserTable>
      {showDeletedInfo(epoch.token_gifts)}
      <Flex
        css={{
          justifyContent: 'space-between',
          mt: '$lg',
        }}
      >
        <Text p as="p" size="medium" css={{ mt: '$sm' }}>
          <Link
            css={{ color: '$primary' }}
            target="_blank"
            href="https://docs.coordinape.com/get-started/compensation/paying-your-team"
          >
            Documentation: Paying Your Team
          </Link>
        </Text>
        <Paginator pages={totalPages} current={page} onSelect={setPage} />
      </Flex>
    </Panel>
  );
};
