import React, { useMemo, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { FormModal, FormTextField, FormRadioSelect } from 'components';
import AdminVaultForm from 'forms/AdminVaultForm';
import { useAdminApi } from 'hooks';
import { AlusdIcon } from 'icons/AlusdIcon';
import { DAIIcon } from 'icons/DAIIcon';
import { EthIcon } from 'icons/EthIcon';
import { SushiIcon } from 'icons/SushiIcon';
import { USDCIcon } from 'icons/USDCIcon';
import { USDTIcon } from 'icons/USDTIcon';
import { YFIIcon } from 'icons/YFIIcon';
import { useSelectedCircle } from 'recoilState';
import { assertDef } from 'utils/tools';

import { IUser } from 'types';

const useStyles = makeStyles((theme) => ({
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
  assetBox: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '70%',
  },
  assetBtn: {
    flex: '1 0 21%',
    height: '50px',
    width: '150px',
    margin: theme.spacing(2, 2),
    fontSize: 15,
    fontWeight: 400,
    textDecoration: 'none',
    position: 'relative',
    backgroundColor: theme.colors.ultraLightGray,
    padding: theme.spacing(1, 1),
    borderRadius: '20px',
    color: theme.colors.text,
    alignItems: 'center',
    border: 'none',
    '&.active': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.ultraLightGray,
      },
      '&:hover': {
        '&::after': {
          left: 0,
          right: 0,
          backgroundColor: theme.colors.ultraLightGray,
        },
      },
    },
  },
  btnSpan: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: '0.3em',
  },
}));

export const AdminUserModal = ({
  user,
  onClose,
  open,
}: {
  user?: IUser;
  open: boolean;
  onClose: () => void;
}) => {
  const [asset, setAsset] = useState<string>();

  const classes = useStyles();

  const selectedCircle = useSelectedCircle();

  const history = useHistory();

  const routeChange = () => {
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

  const handleAssetSelect = (asset: string) => {
    setAsset(asset);
  };

  const assetDisplay = () => (
    <div className={classes.assetBox}>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('DAI')}
      >
        <span className={classes.btnSpan}>
          <DAIIcon height={25} width={22} className={classes.icon} />
          DAI
        </span>
      </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('USDC')}
      >
        <span className={classes.btnSpan}>
          <USDCIcon width={25} height={22} className={classes.icon} />
          USDC
        </span>
      </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('YFI')}
      >
        <span className={classes.btnSpan}>
          <YFIIcon width={25} height={22} className={classes.icon} />
          YFI
        </span>
      </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('Sushi')}
      >
        <span className={classes.btnSpan}>
          <SushiIcon width={25} height={25} className={classes.icon} />
          Sushi
        </span>
      </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('alUSD')}
      >
        <span className={classes.btnSpan}>
          <AlusdIcon height={25} width={22} className={classes.icon} />
          alUSD
        </span>
      </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('USDT')}
      >
        <span className={classes.btnSpan}>
          <USDTIcon height={25} width={25} className={classes.icon} />
          USDT
        </span>
      </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('ETH')}
      >
        <span className={classes.btnSpan}>
          <EthIcon height={32} width={32} className={classes.icon} />
          ETH
        </span>
      </button>
      <button
        className={classes.assetBtn}
        onClick={() => handleAssetSelect('other')}
      >
        <span className={classes.btnSpan}>
          <USDTIcon height={25} width={25} className={classes.icon} />
          Other
        </span>
      </button>
    </div>
  );

  return (
    <AdminVaultForm.FormController
      source={source}
      hideFieldErrors
      submit={(params) =>
        (user
          ? updateUser(user.address, params)
          : createUser(params)
        ).then(() => onClose())
      }
    >
      {({
        fields: {
          non_giver: {
            value: nonGiverValue,
            onChange: nonGiverOnChange,
            ...non_giver
          },
          ...fields
        },
        errors,
        changedOutput,
        handleSubmit,
      }) => (
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
          {assetDisplay()}
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

export default AdminUserModal;
