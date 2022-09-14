import React, { useMemo, useState } from 'react';

import { vouchUser } from 'lib/gql/mutations';
import { isUserAdmin } from 'lib/users';
import { DateTime } from 'luxon';
import { styled } from 'stitches.config';

import { makeTable } from 'components';
import { Avatar, Button, Flex, Text, Panel } from 'ui';
import { TwoColumnLayout } from 'ui/layouts';
import { shortenAddress } from 'utils';

import { IActiveNominee } from './getActiveNominees';
import { Paginator } from './Paginator';

import { IUser } from 'types';

const TD = styled('td', {});
const TR = styled('tr', {});

const headerStyles = {
  color: '$secondaryText',
  textTransform: 'uppercase',
  fontSize: '$small',
  fontWeight: '$bold',
  lineHeight: '$shorter',
};

const NomineeRow = ({
  nominee,
  myUser,
  isNonGiverVoucher,
  refetchNominees,
  vouchingText,
}: {
  nominee: IActiveNominee[0];
  myUser?: IUser;
  isNonGiverVoucher?: boolean;
  refetchNominees: () => void;
  vouchingText: string;
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
    await vouchUser(nominee.id).then(refetchNominees).catch(console.warn);
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
          {nominee.name}
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
            color="primary"
            outlined
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
        <TR>
          <TD colSpan={isAdmin ? 4 : 3}>
            <Flex column>
              <Text h3 semibold>
                Nomination
              </Text>
              <Text size="medium" css={{ mt: '$sm', color: '$headingText' }}>
                {vouchingText}
              </Text>
              <TwoColumnLayout css={{ mt: '$lg', mb: '$2xl' }}>
                <Flex column>
                  <Text variant="label">Nominated By</Text>
                  <Flex css={{ mt: '$sm', gap: '$sm' }}>
                    <Avatar
                      path={nominee.nominator?.profile?.avatar}
                      name={nominee.nominator?.name}
                      size="small"
                      margin="none"
                    />
                    <Text size="medium">{nominee.nominator?.name}</Text>
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
                          console.log(nominee.nominations.length);
                          return (
                            <Text key={n.voucher?.id}>
                              {(index
                                ? nominee.nominations.length > 2
                                  ? index !== nominee.nominations.length - 1
                                    ? ', '
                                    : ' ,and '
                                  : ' and '
                                : '') + n.voucher?.name}
                            </Text>
                          );
                        })
                      : 'none'}
                    .
                  </Text>
                  <Button
                    color="secondary"
                    outlined
                    size="medium"
                    disabled={vouchDisabled || vouching}
                    onClick={handleVouch}
                    css={{ maxWidth: 'fit-content', mt: '$lg' }}
                  >
                    {vouching ? 'Vouching...' : `Vouch for ${nominee.name}`}
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
  refetchNominees,
  vouchingText,
}: {
  nominees?: IActiveNominee;
  myUser?: IUser;
  isNonGiverVoucher?: boolean;
  refetchNominees: () => void;
  vouchingText: string;
}) => {
  type Nominee = IActiveNominee[0];
  const pageSize = 3;
  const [page, setPage] = useState(1);

  const isAdmin = isUserAdmin(myUser);

  const pagedView = useMemo(
    () =>
      nominees?.slice(
        (page - 1) * pageSize,
        Math.min(page * pageSize, nominees.length)
      ),
    [nominees, page]
  );

  const NomineeTable = makeTable<Nominee>('NomineeTable');
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
    <Panel>
      <Flex
        css={{
          justifyContent: 'space-between',
          mb: '$lg',
          alignItems: 'center',
        }}
      >
        <Text h3 css={{ fontWeight: '$semibold', color: '$headingText' }}>
          Nominees
        </Text>
      </Flex>
      <NomineeTable
        headers={headers}
        data={pagedView}
        startingSortIndex={0}
        startingSortDesc
        sortByColumn={(index: number) => {
          if (index === 0) return (n: Nominee) => n.name;
          if (index === 1) return (n: Nominee) => n.address;
          if (index === 2)
            return (n: Nominee) =>
              n.vouches_required - n.nominations.length + 1;
          return (n: Nominee) => n.name;
        }}
      >
        {nominee => (
          <NomineeRow
            isNonGiverVoucher={isNonGiverVoucher}
            myUser={myUser}
            nominee={nominee}
            refetchNominees={refetchNominees}
            vouchingText={vouchingText}
          />
        )}
      </NomineeTable>
      <Paginator
        totalItems={nominees?.length || 0}
        currentPage={page}
        onPageChange={setPage}
        itemsPerPage={pageSize}
      />
    </Panel>
  );
};
