import React, { useMemo, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { FormModal, FormTextField } from 'components';
import AdminVaultForm from 'forms/AdminVaultForm';
import { useAdminApi } from 'hooks';
import { useSelectedCircle } from 'recoilState';
// import { useVault } from 'utils/contract-hooks/useVaultFactory';
import { assertDef } from 'utils/tools';

import AssetDisplay from './AssetDisplay';

import { IUser } from 'types';

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
  user,
  onClose,
  open,
}: {
  user?: IUser;
  open: boolean;
  onClose: () => void;
}) => {
  const [asset, setAsset] = useState<string>('');

  const classes = useStyles();

  const selectedCircle = useSelectedCircle();

  const history = useHistory();

  // const { _createApeVault } = useVault();

  const routeChange = async () => {
    // await _createApeVault({ _token: asset, _simpleToken: asset });
    const path = '/admin/vaults';
    history.push(path);
  };

  const { updateUser, createUser } = useAdminApi();

  const source = useMemo(
    () => ({
      user: user,
      circle: assertDef(selectedCircle, 'Missing circle'),
    }),
    [user, selectedCircle]
  );

  return (
    <AdminVaultForm.FormController
      source={source}
      hideFieldErrors
      submit={params =>
        (user ? updateUser(user.address, params) : createUser(params)).then(
          () => onClose()
        )
      }
    >
      {({ fields: { ...fields } }) => (
        <FormModal
          onClose={onClose}
          open={open}
          title={'Create a New Vault'}
          subtitle={'We need to have some short description here'}
          onSubmit={routeChange}
          submitDisabled={false}
          size="small"
          submitText="Mint Vault"
        >
          <AssetDisplay setAsset={setAsset} />
          {asset === 'other' && (
            <div className={classes.oneColumn}>
              <FormTextField
                {...fields.name}
                label="...or use a custom asset"
              />
            </div>
          )}
        </FormModal>
      )}
    </AdminVaultForm.FormController>
  );
};

export default CreateVaultModal;
