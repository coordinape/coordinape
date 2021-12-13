import { useMemo } from 'react';

import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { FormModal, FormTokenField } from 'components';
import SingleTokenForm from 'forms/SingleTokenForm';
import { useVaultRouter } from 'hooks/useVaultRouter';
import { PlusCircleIcon } from 'icons';

import { IVault } from 'types';

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
}));
const balance = 5000;

export default function DepositModal({
  open,
  onClose,
  vault,
}: {
  onClose: any;
  open: boolean;
  vault: IVault;
}) {
  const classes = useStyles();
  const history = useHistory();
  const { depositToken } = useVaultRouter();

  // This doesn't need have useMemo, but when we have balance set dynamically
  // it will.
  const source = useMemo(
    () => ({
      starting: 0,
      balance,
    }),
    [vault]
  );

  return (
    <SingleTokenForm.FormController
      source={source}
      submit={({ amount }) =>
        depositToken(vault, amount).then(receipt => {
          // eslint-disable-next-line no-console
          console.log(receipt);
          history.push('/admin/vaults');
        })
      }
    >
      {({ fields, handleSubmit, changedOutput }) => (
        <FormModal
          onClose={() => onClose(false)}
          open={open}
          title={`Deposit ${vault.type.toUpperCase()} to the Coordinape Vault`}
          subtitle=""
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          size="small"
          icon={<PlusCircleIcon />}
          submitText={`Deposit ${vault.type.toUpperCase()}`}
        >
          <div className={classes.oneColumn}>
            <FormTokenField
              {...fields.amount}
              max={balance}
              symbol={vault.type}
              decimals={vault.decimals}
              label={`Available: ${balance} ${vault.type.toUpperCase()}`}
            />
          </div>
        </FormModal>
      )}
    </SingleTokenForm.FormController>
  );
}
