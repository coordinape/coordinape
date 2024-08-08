import { useCallback } from 'react';

import sumBy from 'lodash-es/sumBy';
import uniqBy from 'lodash-es/uniqBy';

import { makeTable } from 'components';
import { DotsVertical } from 'icons/__generated';
import {
  Avatar,
  Button,
  Flex,
  Link,
  Panel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from 'ui';
import { numberWithCommas, shortenAddress } from 'utils';

import { useGiveCsv } from './mutations';
import type { Gift } from './queries';
import { EpochDataResult } from './queries';

const styles = {
  alignRight: { textAlign: 'right' },
};

export const AllocationsTable = ({
  users,
  totalGive,
  formGiftAmount,
  giveTokenName,
  downloadCSV,
  epoch,
}: {
  users: {
    id: number;
    name: string;
    address: string;
    avatar: string | undefined;
    givers: number;
    received: number;
  }[];
  totalGive: number;
  formGiftAmount: number;
  giveTokenName: string | undefined;
  downloadCSV: (
    epoch: number,
    epochId: number,
    formGiftAmount: number,
    giftTokenSymbol: string
  ) => Promise<any>;
  epoch: EpochDataResult;
}) => {
  type User = Exclude<(typeof users)[0], undefined>;
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

  const { mutateAsync: downloadGiveCsv } = useGiveCsv();

  const UserTable = makeTable<User>('UserTable');
  const headers = [
    { title: 'Name' },
    { title: 'ETH' },
    { title: 'Givers', css: styles.alignRight },
    { title: `${giveTokenName || 'GIVE'} Received`, css: styles.alignRight },
    { title: `% of ${giveTokenName || 'GIVE'}`, css: styles.alignRight },
  ];
  return (
    <>
      <Panel>
        <Flex
          alignItems="center"
          css={{
            justifyContent: 'space-between',
            mb: '$lg',
          }}
        >
          <Text large css={{ fontWeight: '$semibold', color: '$headingText' }}>
            Distributions Table
          </Text>
          <Flex>
            <Button
              type="button"
              color="secondary"
              onClick={async () => {
                // use the authed api to download the CSV
                if (epoch.number) {
                  const csv = await downloadCSV(
                    epoch.number,
                    epoch.id,
                    formGiftAmount,
                    ''
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
            <Popover>
              <PopoverTrigger css={{ cursor: 'pointer', ml: '$md' }}>
                <DotsVertical />
              </PopoverTrigger>
              <PopoverContent
                align="end"
                css={{
                  background: '$dim',
                  mt: '$sm',
                  p: '$sm',
                }}
              >
                <Flex column css={{ gap: '$sm' }}>
                  <Button
                    type="button"
                    color="secondary"
                    onClick={async () => {
                      // use the authed api to download the CSV
                      if (epoch.number) {
                        const csv = await downloadGiveCsv({
                          epoch: epoch.number,
                          epochId: epoch.id,
                          circleId: epoch.circle?.id,
                        });
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
                    Export GIVE Allocations
                  </Button>
                </Flex>
              </PopoverContent>
            </Popover>
          </Flex>
        </Flex>
        <UserTable
          headers={headers}
          data={users}
          startingSortIndex={2}
          startingSortDesc
          perPage={10}
          sortByColumn={(index: number) => {
            if (index === 0) return (u: User) => u.name.toLowerCase();
            if (index === 1) return (u: User) => u.address.toLowerCase();
            return (u: User) => u.received;
          }}
        >
          {user => (
            <tr key={user.id}>
              <td>
                <Flex
                  row
                  alignItems="center"
                  css={{ gap: '$sm', height: '$2xl' }}
                >
                  <Avatar size="small" path={user.avatar} name={user.name} />
                  <Text>{user.name}</Text>
                </Flex>
              </td>
              <td>{shortenAddress(user.address)}</td>
              <td className="alignRight">{user.givers}</td>
              <td className="alignRight">{user.received}</td>
              <td className="alignRight">
                {numberWithCommas(givenPercent(user.received) * 100, 2)}%
              </td>
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
              inlineLink
              target="_blank"
              href="https://docs.coordinape.com/get-started/compensation/paying-your-team"
            >
              Documentation: Paying Your Team
            </Link>
          </Text>
        </Flex>
      </Panel>
    </>
  );
};
