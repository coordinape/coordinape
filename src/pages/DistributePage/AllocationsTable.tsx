import { useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core';

import { ApeAvatar, StaticTable } from 'components';
import { Box } from 'ui';
import { shortenAddress } from 'utils';

import { IUser, ITableColumn } from 'types';

/**
 * Component that displays a list of allocations.
 * @param users IUser[]
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
  users: IUser[];
  totalAmountInVault: number;
  totalGive: number;
  tokenName: string;
}) => {
  const classes = useStyles();
  const [keyword, setKeyword] = useState('');
  const filterUser = useMemo(
    () => (u: IUser) => {
      const r = new RegExp(keyword, 'i');
      return r.test(u.name) || r.test(u.address);
    },
    [keyword]
  );

  const userColumns = useMemo(
    () =>
      [
        {
          label: 'Name',
          accessor: 'name',
          render: function UserName(u: IUser) {
            return (
              <div className={classes.avatarCell}>
                <ApeAvatar user={u} className={classes.avatar} />
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
          render: (u: IUser) => shortenAddress(u.address),
        },
        {
          label: 'Give Received',
          render: (u: IUser) =>
            u.give_token_received === 0 &&
            (!!u.fixed_non_receiver || !!u.non_receiver)
              ? '-'
              : u.give_token_received,
        },
        {
          label: '# of Contributor Gitfing',
        },
        {
          label: '% of Epoch',
          render: (u: IUser) =>
            !u.non_giver || !u.starting_tokens
              ? `${((u.give_token_received / totalGive) * 100).toFixed(2)}%`
              : '-',
        },
        {
          label: 'Vault Funds Allocated',
          render: (u: IUser) =>
            !u.non_giver || !u.starting_tokens
              ? `${(
                  (u.give_token_received / totalGive) *
                  totalAmountInVault
                ).toFixed(2)} ${tokenName}`
              : '-',
        },
      ] as ITableColumn[],
    [users]
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
