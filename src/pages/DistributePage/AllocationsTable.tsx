import { useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core';

import { ApeAvatar, StaticTable } from 'components';
import { shortenAddress } from 'utils';

import { IUser, ITableColumn } from 'types';

type AllocationTableProps = {
  users: IUser[];
};

/**
 * Component that displays a list of allocations.
 * @param users IUser[]
 * @returns
 */
const AllocationTable = ({ users }: AllocationTableProps) => {
  const classes = useStyles();
  const [keyword, setKeyword] = useState<string>('');
  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };
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
      <div className={classes.userActionBar}>
        <input
          className={classes.searchInput}
          onChange={onChangeKeyword}
          placeholder="🔍 Search"
          value={keyword}
        />
      </div>
      <StaticTable
        columns={userColumns}
        data={users}
        perPage={15}
        filter={filterUser}
        sortable
        placeholder={
          <>
            <h2>No users have been added.</h2>
          </>
        }
      />
    </>
  );
};

export default AllocationTable;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 8, 4),
    margin: 'auto',
    maxWidth: theme.breakpoints.values.lg,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2, 4),
    },
  },
  withVaults: {
    minHeight: 668,
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignContent: 'space-between',
    justifyItems: 'stretch',
    borderRadius: 8,
    background: theme.colors.ultraLightGray,
    alignItems: 'center',
    columnGap: theme.spacing(3),
    padding: theme.spacing(0, 4),
    margin: theme.spacing(4, 0),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'start',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 30,
    lineHeight: 1.2,
    fontWeight: 700,
    color: theme.colors.text,
    margin: theme.spacing(6, 0),
  },
  actionsAndEpochs: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  actionBar: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionBarInner: {
    display: 'flex',
    flexDirection: 'row',
    '& > *': {
      marginLeft: theme.spacing(1.5),
    },
  },
  epochsTable: {
    flexGrow: 4,
    marginBottom: theme.spacing(8),
  },
  userActionBar: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 70,
  },
  searchInput: {
    margin: theme.spacing(0, 1),
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
  twoLineCell: {
    height: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 11,
    lineHeight: 1.5,
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
    },
  },
  twoLineCellTitle: {
    fontWeight: 600,
  },
  twoLineCellSubtitle: {
    fontWeight: 400,
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
  tableActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  actionSpacer: {
    width: 30,
  },
  errorColor: {
    color: theme.palette.error.main,
  },
  csvLink: {
    color: '#84C7CA',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    '&:hover': {
      color: '#4e7577',
    },
  },
  tablePlaceholderTitle: {
    fontSize: 20,
    lineHeight: 1.2,
    color: theme.colors.text,
    opacity: 0.7,
  },
  infoIcon: {
    fontSize: '0.95rem',
    fontWeight: 300,
    verticalAlign: 'baseline',
    // marginLeft: 3,
    color: theme.colors.white,
    '&:hover': {
      color: theme.colors.text,
    },
  },
}));
