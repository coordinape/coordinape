/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import { OrganizationHeader } from 'components';
import { useCurrentOrg } from 'hooks/gql/useCurrentOrg';
import { useVaults } from 'recoilState/vaults';

// eslint-disable-next-line import/no-named-as-default
import CreateVaultModal from './CreateVaultModal';
import HasVaults from './HasVaults';
import NoVaults from './NoVaults';

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
}));

const VaultsPage = () => {
  const classes = useStyles();
  const [modal, setModal] = useState<'' | 'create'>('');
  const closeModal = () => setModal('');

  const currentOrg = useCurrentOrg();
  const vaults = useVaults(currentOrg.data?.id);

  return (
    <div className={classes.root}>
      <OrganizationHeader
        buttonText="Create a Vault"
        onButtonClick={() => setModal('create')}
      />
      {vaults && vaults.length ? (
        vaults.map(vault => <HasVaults key={vault.id} vault={vault} />)
      ) : (
        <NoVaults onCreateButtonClick={() => setModal('create')} />
      )}
      {modal === 'create' ? <CreateVaultModal onClose={closeModal} /> : null}
    </div>
  );
};

export default VaultsPage;
