/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from 'react';

import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { FormModal, FormTextField } from 'components';
import AdminVaultForm from 'forms/AdminVaultForm';
// import { useAdminApi } from 'hooks';
import { useVaultRouter } from 'hooks/useVaultRouter';
import { PlusCircleIcon } from 'icons';
import { useSelectedCircle } from 'recoilState';
import { assertDef } from 'utils/tools';

import { IUser, IVault } from 'types';

const useStyles = makeStyles(theme => ({
  modalBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oneColumn: {
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(12),
  },
  ethInput: {
    width: '100%',
    gridColumn: '1 / span 2',
  },
  helperBox: {
    height: 0,
  },
  label: {
    margin: theme.spacing(0, 0, 2),
    fontSize: 16,
    fontWeight: 300,
    lineHeight: 1.2,
    color: theme.colors.text,
    textAlign: 'center',
  },
}));

interface DepositModalProps {
  onClose: any;
  open: boolean;

  user?: IUser;
  vault: IVault;
}

export default function DepositModal({
  open,
  onClose,
  user,
  vault,
}: DepositModalProps) {
  const classes = useStyles();
  const history = useHistory();
  const [tokenBalance] = useState('-');

  const { depositToken } = useVaultRouter();

  const handleClose = () => {
    onClose(false);
  };

  // const source = useMemo(
  //   () => ({
  //     user: user,
  //     circle: assertDef(selectedCircle, 'Missing circle'),
  //   }),
  //   [user, selectedCircle]
  // );

  const routeChange = async () => {
    // TODO: replace with user entered token amount
    const receipt = await depositToken(vault, 10);
    // eslint-disable-next-line no-console
    console.log(receipt);
    const path = '/admin/vaults';
    history.push(path);
  };

  //   TODO: Pull in real data to populate FormTextField label and update value

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
          onClose={handleClose}
          open={open}
          title={`Deposit ${vault.type.toUpperCase()} to the Coordinape Vault`}
          subtitle={''}
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          size="small"
          icon={<PlusCircleIcon />}
          submitText={`Deposit ${vault.type.toUpperCase()}`}
        >
          <div className={classes.oneColumn}>
            <FormTextField
              // {...fields.starting_tokens}
              {...fields}
              onChange={() => null}
              InputProps={{
                startAdornment: 'MAX',
                endAdornment: vault.type.toUpperCase(),
              }}
              label={`Available: ${tokenBalance} ${vault.type.toUpperCase()}`}
              apeVariant="token"
            />
          </div>
        </FormModal>
      )}
    </AdminVaultForm.FormController>
  );
}
