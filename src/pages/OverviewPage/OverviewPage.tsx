import { useState } from 'react';

import { makeStyles } from '@material-ui/core';

import NoVaults from '../VaultsPage/NoVaults';
import { OrganizationHeader } from 'components';
import { CreateVaultModal } from 'pages/VaultsPage/CreateVaultModal';

// eslint-disable-next-line import/no-named-as-default
import HasVaults from './HasVaults';

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
  title: {
    textTransform: 'capitalize',
    fontSize: 40,
    lineHeight: 1.2,
    fontWeight: 700,
    color: theme.colors.text,
    margin: theme.spacing(6, 0),
  },
  allocateBtn: {
    padding: '12px',
    height: 'calc(32px * 16) * 1rem',
    marginRight: '2.5em',
  },
  twoLineCell: {
    height: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 11,
    lineHeight: 1.5,
  },
  oneLineCell: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 11,
    lineHeight: 1.5,
  },
  twoLineCellTitle: {
    fontWeight: 600,
  },
  oneLineCellTitle: {
    fontWeight: 600,
    fontSize: 17,
    marginLeft: '1em',
  },
  oneLineCellSubtitle: {
    fontWeight: 400,
    marginLeft: '0.5em',
  },
  twoLineCellSubtitle: {
    fontWeight: 400,
    fontSize: 9,
    color: theme.colors.mediumGray,
  },
  tableActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  errorColor: {
    color: theme.palette.error.main,
  },
  valueBtn: {
    width: '110.3px',
    color: theme.colors.secondary,
    fontWeight: 600,
  },
  smallP: {
    fontSize: 12,
    marginLeft: '0.4em',
    padding: 0,
    margin: 0,
  },
  editTxt: {
    color: theme.colors.lightBlue,
    textDecoration: 'underline',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
  editSpan: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
  },
}));

const OverviewPage = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const classes = useStyles();
  const [hasVaults] = useState<boolean>(true); //Temp boolean pending data input

  return (
    <div className={classes.root}>
      <OrganizationHeader
        buttonText="Create a Vault"
        onButtonClick={() => setCreateOpen(true)}
      />
      {!hasVaults ? (
        <NoVaults onCreateButtonClick={() => setCreateOpen(true)} />
      ) : (
        <HasVaults />
      )}
      {createOpen && <CreateVaultModal onClose={() => setCreateOpen(false)} />}
    </div>
  );
};

export default OverviewPage;
