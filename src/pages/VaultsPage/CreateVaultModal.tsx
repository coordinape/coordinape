import assert from 'assert';
import { useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';
// import { useSetRecoilState } from 'recoil';

import { makeStyles } from '@material-ui/core';

import { useVaultFactory } from '../../hooks/useVaultFactory';
import { FormModal, FormTextField } from 'components';
import { ZERO_ADDRESS } from 'config/constants';
import { getToken } from 'config/networks';
import AdminVaultForm, { AssetEnum } from 'forms/AdminVaultForm';
// import { useAdminApi } from 'hooks';
// import { useSelectedCircle } from 'recoilState/app';
// import { assertDef } from 'utils/tools';

import AssetDisplay from './AssetDisplay';

import { KnownToken } from 'types';

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
  const [asset, setAsset] = useState<AssetEnum>('DAI');

  const { chainId } = useWeb3React();

  const classes = useStyles();

  // const selectedCircle = useSelectedCircle();
  // const setVaults = useSetRecoilState(rCircleVaults);

  const history = useHistory();

  const { createApeVault } = useVaultFactory();

  const routeChange = async () => {
    // TODO: allow admin to select simpleToken (Ex: ApeToken is a simpleToken)
    assert(chainId);
    const token = getToken(chainId, asset.toLowerCase() as KnownToken);

    // FIXME: this is failing on hardhat
    // const vault = await createApeVault(token.address, ZERO_ADDRESS, asset);
    const vault = await createApeVault(ZERO_ADDRESS, token.address, asset);

    // setVaults(vaults => {
    //   if (vaults && selectedCircle) {
    //     const newVaults = { ...vaults };
    //     newVaults[selectedCircle.id] = [
    //       ...(vaults[selectedCircle.id] || []),
    //       {
    //         id: vault.address,
    //         tokenAddress: token.address,
    //         simpleTokenAddress: token.address,
    //         type: asset,
    //         transactions: [],
    //       },
    //     ];
    //     return newVaults;
    //   }
    //   return vaults;
    // });

    // eslint-disable-next-line no-console
    console.log('created vault:', vault);

    const path = '/admin/vaults';
    history.push(path);
  };

  // const { updateUser, createUser } = useAdminApi();

  // const source = useMemo(
  //   () => ({
  //     user: user,
  //     circle: assertDef(selectedCircle, 'Missing circle'),
  //   }),
  //   [user, selectedCircle]
  // );

  return (
    <AdminVaultForm.FormController
      source={undefined}
      hideFieldErrors
      submit={routeChange}
      // submit={params =>
      //   (user ? updateUser(user.address, params) : createUser(params)).then(
      //     () => onClose()
      //   )
      // }
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
              disabled={asset !== 'OTHER'}
              label="...or use a custom asset"
              onChange={() => alert('TODO')}
            />
          </div>
        </FormModal>
      )}
    </AdminVaultForm.FormController>
  );
};

export default CreateVaultModal;
