import { useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core';

import { ApeAvatar, StaticTable } from 'components';
import { Box } from 'ui';
import { shortenAddress } from 'utils';

import { IUser, ITableColumn } from 'types';

/**
 * Component that displays a list of allocations.
 * @param users IUser[]
 * @returns
 */
const AllocationTable = ({ users }: { users: IUser[] }) => {
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
          render: () => '195 GIVE',
        },
        {
          label: '# of Contributor Gitfing',
          render: () => '22',
        },
        {
          label: '% of Epoch',
          render: () => '2.5%',
        },
        {
          label: 'Vault Funds Allocated',
          render: () => '1680 USDC',
        },
      ] as ITableColumn[],
    []
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
