import { useState } from 'react';

import { Button, makeStyles } from '@material-ui/core';

import { StaticTableNew } from 'components';
import { InfoIcon, PlusCircleIcon } from 'icons';

// eslint-disable-next-line import/no-named-as-default
import AdminUserModal from './AdminUserModal';
import DepositModal from './DepositModal';
import FundModal from './FundModal';
import WithdrawModal from './WithdrawModal';

import { ITableColumn, IUser } from 'types';

const useStyles = makeStyles(theme => ({
  withVaults: {
    height: 434,
    display: 'grid',
    borderRadius: 8,
    background: theme.colors.ultraLightGray,
    alignItems: 'center',
    columnGap: theme.spacing(3),
    gridTemplateColumns: '1fr 1fr',
    padding: theme.spacing(0, 4),
    margin: theme.spacing(4, 0),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  vaultsTitle: {
    color: theme.colors.mediumGray,
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    padding: 0,
    marginRight: '1em',
  },
  horizontalDisplay: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaultsSecondary: {
    color: theme.colors.lightBlue,
    fontSize: 15,
    fontWeight: 300,
    margin: 0,
    padding: 0,
  },
  vaultsSecondaryh4: {
    color: theme.colors.lightBlue,
    fontSize: 15,
    fontWeight: 300,
    margin: 0,
    padding: theme.spacing(0, 0.5, 0),
  },
  noVaultsSubtitle: {
    color: theme.colors.mediumGray,
    fontSize: 15,
    fontWeight: 300,
  },
  infoIcon: {
    height: 20,
    width: 20,
    marginBottom: 0,
  },
  totalValue: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  number: {
    color: theme.colors.black,
    fontSize: 24,
    margin: 0,
    fontWeight: 600,
    paddingRight: 8,
  },
  noVaultsTitle: {
    color: theme.colors.mediumGray,
    margin: 0,
    fontSize: 24,
    fontWeight: 600,
  },
  epochsTable: {
    flexGrow: 4,
    marginBottom: theme.spacing(8),
  },
  newTable: {
    flexGrow: 4,
    height: 288,
    marginTop: -80,
    paddingTop: 0,
  },
  tablePlaceholderTitle: {
    fontSize: 20,
    lineHeight: 1.2,
    color: theme.colors.text,
    opacity: 0.7,
  },
  noVaultsInterior: {
    height: 288,
    display: 'flex',
    borderRadius: 8,
    background: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: -80,
    gridTemplateColumns: '1fr',
    padding: theme.spacing(0, 1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
}));

interface HasVaultsProps {
  newUser: boolean;
  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  editUser: IUser | undefined;
  setEditUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  setNewEpoch: React.Dispatch<React.SetStateAction<boolean>>;
  epochColumns: ITableColumn[];
  epochs: any;
}

export default function HasVaults({
  newUser,
  setNewUser,
  editUser,
  setEditUser,
  setNewEpoch,
  epochs,
  epochColumns,
}: HasVaultsProps) {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [openwd, setOpenwd] = useState<boolean>(false);
  const [openfn, setOpenfn] = useState<boolean>(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const handleClickwd = () => {
    setOpenwd(!open);
  };
  const handleClickfn = () => {
    setOpenfn(!open);
  };

  return (
    <div className={classes.withVaults}>
      <div>
        <DepositModal open={open} onClose={setOpen} />
        <div className={classes.horizontalDisplay}>
          <h2 className={classes.vaultsTitle}>USDC Vault</h2>
          <Button
            variant="text"
            className={classes.vaultsSecondary}
            onClick={handleClick}
          >
            Deposit
          </Button>
          <h4 className={classes.vaultsSecondaryh4}>|</h4>
          <WithdrawModal openwd={openwd} onClose={setOpenwd} />
          <Button
            variant="text"
            className={classes.vaultsSecondary}
            onClick={handleClickwd}
          >
            Withdraw
          </Button>
        </div>
        <h4 className={classes.noVaultsSubtitle}>
          Upcoming and Recent Epochs <InfoIcon className={classes.infoIcon} />
        </h4>
      </div>
      <div>
        <div className={classes.totalValue}>
          <h2 className={classes.number}>0</h2>
          <h2 className={classes.noVaultsTitle}>USDC ...</h2>
        </div>
        <h4 className={classes.noVaultsSubtitle}>
          Recent Transactions <InfoIcon className={classes.infoIcon} />{' '}
        </h4>
      </div>
      <StaticTableNew
        label="Testing"
        className={classes.newTable}
        columns={epochColumns}
        data={epochs}
        perPage={6}
        placeholder={
          <>
            <h2 className={classes.tablePlaceholderTitle}>
              You don’t have any recent epochs
            </h2>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<PlusCircleIcon />}
              onClick={() => setNewEpoch(true)}
            >
              Add Epoch
            </Button>
          </>
        }
      />
      <div className={classes.noVaultsInterior}>
        <h2 className={classes.noVaultsTitle}>
          There are no transactions to show yet.
        </h2>
        <h3 className={classes.noVaultsSubtitle}>
          To get started, fund your vault with USDC
        </h3>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleClickfn}
        >
          Fund This Vault
        </Button>
        <FundModal openfn={openfn} onClose={setOpenfn} />
        <AdminUserModal
          onClose={() => (newUser ? setNewUser(false) : setEditUser(undefined))}
          user={editUser}
          open={!!editUser || newUser}
        />
      </div>
    </div>
  );
}
