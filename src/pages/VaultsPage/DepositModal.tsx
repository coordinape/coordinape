import { useEffect, useMemo, useState } from 'react';

import { BigNumber, ethers, utils } from 'ethers';
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
  onClose: () => void;
  open?: boolean;
  vault: IVault;
}) {
  const classes = useStyles();
  const history = useHistory();
  const [max, setMax] = useState<any>();
  const [decimal, setDecimal] = useState<number>();
  const { depositToken } = useVaultRouter();
  const { balance, getTokenBalance } = useGetAnyTokenValue(vault.tokenAddress);

  const getBalance = () => {
    getTokenBalance(vault.tokenAddress);
    if (vault.type === 'USDC' || vault.type === 'yvUSDC') {
      setMax(parseInt(ethers.utils.formatUnits(balance, 6)));
      setDecimal(6);
    } else {
      setMax(parseInt(ethers.utils.formatUnits(balance, 18)));
      setDecimal(18);
    }
  };

  useEffect(() => {
    getBalance();
  }, [balance]);

  const source = useMemo(
    () => ({
      starting: 0,
      balance: max,
    }),
    [vault]
  );

  const handleSubmit = (amount: number) => {
    const _amount = BigNumber.from(
      utils.parseUnits(amount.toString(), decimal)
    );
    depositToken(vault, _amount).then(receipt => {
      getBalance();
      // eslint-disable-next-line no-console
      console.log(receipt);
      onClose();
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
          onClose={onClose}
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
              max={max}
              symbol={vault.type}
              decimals={vault.decimals}
              label={`Available: ${max} ${vault.type.toUpperCase()}`}
            />
          </div>
        </FormModal>
      )}
    </SingleTokenForm.FormController>
  );
}
