import React, { useState } from 'react';

import { vouchUser } from 'lib/gql/mutations';
import { isUserAdmin } from 'lib/users';
import { DateTime } from 'luxon';
import { styled } from 'stitches.config';

import { makeTable } from 'components';
import { Avatar, Button, Flex, Text, Panel } from 'ui';
import { TwoColumnLayout } from 'ui/layouts';
import { shortenAddress } from 'utils';

import type { QueryUser, QueryNominee } from './getMembersPageData';

const TD = styled('td', {});
const TR = styled('tr', {});

const headerStyles = {
  color: '$secondaryText',
  textTransform: 'uppercase',
  fontSize: '$small',
  fontWeight: '$semibold',
  lineHeight: '$shorter',
};

const NomineeRow = ({
  nominee,
  myUser,
  isNonGiverVoucher,
  refetch,
}: {
  nominee: QueryNominee;
  myUser?: QueryUser;
  isNonGiverVoucher?: boolean;
  refetch: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [vouching, setVouching] = useState(false);
  const vouchDisabled =
    myUser && isNonGiverVoucher != null
      ? nominee.nominated_by_user_id === myUser.id ||
        nominee.nominations.some(n => n.voucher_id === myUser.id) ||
        (isNonGiverVoucher && myUser.non_giver)
      : true;

  const vouchesNeeded = Math.max(
    0,
    nominee.vouches_required - (nominee.nominations ?? []).length - 1
  );

  const isAdmin = isUserAdmin(myUser);

  const handleVouch = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setVouching(true);
    await vouchUser(nominee.id).then(refetch).catch(console.warn);
    setVouching(false);
  };

  return (
    <>
      <TR
        key={nominee.id}
        onClick={() => {
          setOpen(prevState => !prevState);
        }}
        css={{ cursor: 'pointer' }}
      >
        <TD css={{ borderBottomStyle: open ? 'hidden' : 'initial' }}>
          {nominee.profile?.name}
        </TD>
        {isAdmin && (
          <TD css={{ borderBottomStyle: open ? 'hidden' : 'initial' }}>
            {shortenAddress(nominee.address)}
          </TD>
        )}
        <TD
          css={{
            borderBottomStyle: open ? 'hidden' : 'initial',
            textAlign: isAdmin ? 'right !important' : 'center !important',
          }}
        >
          {nominee.nominations.length + 1}/{nominee.vouches_required}
        </TD>
        <TD css={{ borderBottomStyle: open ? 'hidden' : 'initial' }}>
          <Button
            color="secondary"
            size="small"
            disabled={vouchDisabled || vouching}
            onClick={handleVouch}
            css={{ mr: 0, ml: 'auto ' }}
          >
            {vouching ? 'Vouching...' : 'Vouch'}
          </Button>
        </TD>
      </TR>
      {open && (
        <TR key={nominee.address}>
          <TD colSpan={isAdmin ? 4 : 3}>
            <Flex column>
              <TwoColumnLayout css={{ mt: '$lg', mb: '$2xl' }}>
                <Flex column>
                  <Text variant="label">Nominated By</Text>
                  <Flex css={{ mt: '$sm', gap: '$sm' }}>
                    <Avatar
                      path={nominee.nominator?.profile?.avatar}
                      name={nominee.nominator?.profile.name}
                      size="small"
                      margin="none"
                    />
                    <Text size="medium">{nominee.nominator?.profile.name}</Text>
                  </Flex>
                  <Text
                    size="medium"
                    css={{
                      lineHeight: '$short',
                      mt: '$lg',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {nominee.description}
                  </Text>
                </Flex>
                <Flex column>
                  <Text variant="label">Nomination Details</Text>
                  <Flex css={{ gap: '$lg', mt: '12px' }}>
                    <Text css={{ color: '$headingText', lineHeight: '$short' }}>
                      Expires{' '}
                      {DateTime.fromISO(nominee.expiry_date).toLocaleString(
                        DateTime.DATETIME_SHORT
                      )}
                    </Text>
                    <Text css={{ color: '$alert', lineHeight: '$short' }}>
                      {vouchesNeeded}{' '}
                      {vouchesNeeded > 1
                        ? 'more vouches needed'
                        : 'more vouch needed'}
                    </Text>
                  </Flex>
                  <Text
                    size="medium"
                    css={{ mt: '$xl', whiteSpace: 'pre-wrap' }}
                  >
                    vouched for by{' '}
                    {nominee.nominations.length > 0
                      ? nominee.nominations.map((n, index) => {
                          return (
                            <Text key={n.voucher?.id}>
                              {(index
                                ? nominee.nominations.length > 2
                                  ? index !== nominee.nominations.length - 1
                                    ? ', '
                                    : ' ,and '
                                  : ' and '
                                : '') + n.voucher?.profile.name}
                            </Text>
                          );
                        })
                      : 'none'}
                    .
                  </Text>
                  <Button
                    color="secondary"
                    size="medium"
                    disabled={vouchDisabled || vouching}
                    onClick={handleVouch}
                    css={{ maxWidth: 'fit-content', mt: '$lg' }}
                  >
                    {vouching
                      ? 'Vouching...'
                      : `Vouch for ${nominee.profile?.name}`}
                  </Button>
                </Flex>
              </TwoColumnLayout>
            </Flex>
          </TD>
        </TR>
      )}
    </>
  );
};

export const NomineesTable = ({
  nominees,
  myUser,
  isNonGiverVoucher,
  refetch,
}: {
  nominees?: QueryNominee[];
  myUser?: QueryUser;
  isNonGiverVoucher?: boolean;
  refetch: () => void;
}) => {
  const isAdmin = isUserAdmin(myUser);

  const NomineeTable = makeTable<QueryNominee>('NomineeTable');
  const headers = [
    { title: 'Name', css: headerStyles },
    { title: 'ETH WALLET', css: headerStyles, isHidden: !isAdmin },
    {
      title: 'Vouches',
      css: { ...headerStyles, textAlign: isAdmin ? 'right' : 'center' },
    },
    { title: 'Actions', css: { ...headerStyles, textAlign: 'right' } },
  ];

  return (
    <>
      {nominees && nominees?.length > 0 && (
        <Panel>
          <Flex
            alignItems="center"
            css={{
              justifyContent: 'space-between',
              mb: '$lg',
            }}
          >
            <Text
              large
              css={{ fontWeight: '$semibold', color: '$headingText' }}
            >
              Nominees
            </Text>
          </Flex>

          <NomineeTable
            headers={headers}
            data={nominees}
            startingSortIndex={0}
            startingSortDesc
            perPage={3}
            sortByColumn={(index: number) => {
              if (index === 0)
                return (n: QueryNominee) => n.profile?.name.toLowerCase();
              if (index === 1)
                return (n: QueryNominee) => n.address.toLowerCase();
              if (index === 2)
                return (n: QueryNominee) =>
                  n.vouches_required - n.nominations.length + 1;
              return (n: QueryNominee) => n.profile?.name.toLowerCase();
            }}
          >
            {nominee => (
              <NomineeRow
                key={nominee.id}
                isNonGiverVoucher={isNonGiverVoucher}
                myUser={myUser}
                nominee={nominee}
                refetch={refetch}
              />
            )}
          </NomineeTable>
        </Panel>
      )}
    </>
  );
};
