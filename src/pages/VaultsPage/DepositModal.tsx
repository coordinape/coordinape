import { useEffect, useMemo, useState } from 'react';

import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { useGetAnyTokenValue } from '../../hooks/useGetAnyTokenValue';
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
  const [balance, setBalance] = useState<any>();
  const { depositToken } = useVaultRouter();
  const { bal } = useGetAnyTokenValue(vault.tokenAddress);

  useEffect(() => {
    vault.type === 'USDC' || vault.type === 'yvUSDC'
      ? setBalance(parseInt(ethers.utils.formatUnits(bal, 6)))
      : setBalance(parseInt(ethers.utils.formatUnits(bal, 18)));
  }, [bal]);

  const source = useMemo(
    () => ({
      starting: 0,
      balance,
    }),
    [vault]
  );

  const handleSubmit = (amount: number) => {
    // eslint-disable-next-line no-console
    console.log('amount', amount);
    depositToken(vault, amount).then(receipt => {
      // eslint-disable-next-line no-console
      console.log(receipt);
      onClose(false);
      history.push('/admin/vaults');
    });
  };

  return (
    <SingleTokenForm.FormController
      source={source}
      submit={({ amount }) => handleSubmit(amount)}
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
