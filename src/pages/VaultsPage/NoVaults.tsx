import { Button, makeStyles } from '@material-ui/core';

import AdminUserModal from 'pages/AdminPage/AdminUserModal';

import { IUser } from 'types';

const useStyles = makeStyles(theme => ({
  noVaults: {
    height: 434,
    display: 'grid',
    borderRadius: 8,
    background: theme.colors.ultraLightGray,
    alignItems: 'center',
    gridTemplateColumns: '1fr',
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
  noVaultsTitle: {
    color: theme.colors.mediumGray,
    margin: 0,
    fontSize: 24,
    fontWeight: 600,
  },
  noVaultsSubtitle: {
    color: theme.colors.mediumGray,
    fontSize: 15,
    fontWeight: 300,
  },
}));

interface NoVaultsProps {
  newUser: boolean;
  setNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  editUser: IUser | undefined;
  setEditUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}

export default function NoVaults({
  newUser,
  setNewUser,
  editUser,
  setEditUser,
}: NoVaultsProps) {
  const classes = useStyles();

  return (
    <div className={classes.noVaults}>
      <div className={classes.noVaultsInterior}>
        <h2 className={classes.noVaultsTitle}>You dont have any vaults</h2>
        <h3 className={classes.noVaultsSubtitle}>To get started</h3>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setNewUser(true)}
        >
          Create a Vault
        </Button>
        <AdminUserModal
          onClose={() => (newUser ? setNewUser(false) : setEditUser(undefined))}
          user={editUser}
          open={!!editUser || newUser}
        />
      </div>
    </div>
  );
}
