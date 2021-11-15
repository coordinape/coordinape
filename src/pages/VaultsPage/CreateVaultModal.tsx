import { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { FormModal, FormTextField } from 'components';
import AdminVaultForm from 'forms/AdminVaultForm';

import AssetDisplay from './AssetDisplay';

const useStyles = makeStyles(theme => ({
  modalBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oneColumn: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  ethInput: {
    width: '100%',
    gridColumn: '1 / span 2',
  },
  helperBox: {
    height: 0,
  },
}));

export const CreateVaultModal = ({
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [asset, setAsset] = useState<string>();

  const classes = useStyles();

  const history = useHistory();

  return (
    <AdminVaultForm.FormController
      source={undefined}
      hideFieldErrors
      submit={params => {
        console.warn('todo:', params);
        const path = '/admin/vaults';
        history.push(path);
      }}
    >
      {({ fields, handleSubmit, changedOutput }) => (
        <FormModal
          onClose={onClose}
          open={open}
          title={'Create a New Vault'}
          subtitle={'We need to have some short description here'}
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          size="small"
          submitText="Mint Vault"
        >
          <AssetDisplay setAsset={setAsset} />
          <div className={classes.oneColumn}>
            <FormTextField
              {...fields.custom_asset}
              disabled={asset !== 'other'}
              label="...or use a custom asset"
            />
          </div>
        </FormModal>
      )}
    </AdminVaultForm.FormController>
  );
};

export default CreateVaultModal;
