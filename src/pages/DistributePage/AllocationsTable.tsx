import { useCallback, useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core';

import { NewApeAvatar, StaticTable } from 'components';
import { Box } from 'ui';
import { shortenAddress } from 'utils';

import { IAllocateUser, ITableColumn } from 'types';

/**
 * Component that displays a list of allocations.
 * @param users IAllocateUser[]
 * @param totalAmountInVault number
 * @param totalGive number
 * @param tokenName string
 * @returns
 */
const AllocationTable = ({
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
  const classes = useStyles();
  const [keyword, setKeyword] = useState('');
  const filterUser = useMemo(
    () => (u: IAllocateUser) => {
      const r = new RegExp(keyword, 'i');
      return r.test(u.name) || r.test(u.address);
    },
    [keyword]
  );

  const givenPercent = useCallback(
    (u: IAllocateUser) =>
      u.received_gifts.reduce((t, { tokens }) => t + tokens, 0) / totalGive,
    [totalGive]
  );

  const userColumns = useMemo(
    () =>
      [
        {
          label: 'Name',
          accessor: 'name',
          render: function UserName(u: IAllocateUser) {
            return (
              <div className={classes.avatarCell}>
                <NewApeAvatar name={u.name} className={classes.avatar} />
                <span>{u.name}</span>
              </div>
            );
          },
          wide: true,
          leftAlign: true,
        },
        {
          label: 'ETH Wallet',
          accessor: 'address',
          render: (u: IAllocateUser) => shortenAddress(u.address),
        },
        {
          label: 'Give Received',
          render: (u: IAllocateUser) =>
            u.received_gifts.length > 0
              ? u.received_gifts.reduce((t, g) => t + g.tokens, 0)
              : '-',
        },
        {
          label: '# of Contributor Gifting',
          render: (u: IAllocateUser) =>
            u.received_gifts_aggregate?.aggregate?.count && '-',
        },
        {
          label: '% of Epoch',
          render: (u: IAllocateUser) =>
            u.received_gifts.length > 0
              ? `${(givenPercent(u) * 100).toFixed(2)}%`
              : '-',
        },
        {
          label: 'Vault Funds Allocated',
          render: (u: IAllocateUser) => {
            if (!tokenName) return '-';
            return u.received_gifts.length > 0
              ? `${(givenPercent(u) * totalAmountInVault).toFixed(
                  2
                )} ${tokenName}`
              : '-';
          },
        },
      ] as ITableColumn[],
    [users, totalAmountInVault, tokenName]
  );

  return (
    <>
      <Box>
        <input
          className={classes.searchInput}
          onChange={({ target: { value } }) => setKeyword(value)}
          placeholder="🔍 Search"
          value={keyword}
        />
      </Box>
      <StaticTable
        columns={userColumns}
        data={users}
        perPage={15}
        filter={filterUser}
        sortable
        placeholder={<h2>No users have been added.</h2>}
        initialSortOrder={{ field: 2, ascending: -1 }}
      />
    </>
  );
};

export default AllocationTable;

const useStyles = makeStyles(theme => ({
  searchInput: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    color: theme.colors.text,
    background: '#fff',
    border: 'none',
    borderRadius: 8,
    outline: 'none',
    '&::placeholder': {
      color: theme.colors.text,
    },
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(1),
    border: `1px solid ${theme.colors.border}`,
    cursor: 'pointer',
    transition: 'border-color .3s ease',
    '&:hover': {
      border: '1px solid rgba(239, 115, 118, 1)',
    },
  },
  avatarCell: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 600,
  },
}));
