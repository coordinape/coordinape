import { useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { FormModal, FormTokenField } from 'components';
import SingleTokenForm from 'forms/SingleTokenForm';
import { MinusCircleIcon } from 'icons';

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

interface WithdrawModalProps {
  onClose: () => void;
  user?: IUser;
  vault: IVault;
}

export default function WithdrawModal({ onClose, vault }: WithdrawModalProps) {
  const classes = useStyles();
  const navigate = useNavigate();
  const max = 100; // TODO get the real balance of the vault

  const source = useMemo(
    () => ({
      starting: 0,
      balance: max,
    }),
    [vault]
  );

  return (
    <SingleTokenForm.FormController
      source={source}
      hideFieldErrors
      submit={params => {
        console.warn('todo:', params);
        const path = '/admin/vaults';
        navigate(path);
      }}
    >
      {({ fields, handleSubmit, changedOutput }) => (
        <FormModal
          onClose={onClose}
          title={`Withdraw ${vault.type.toUpperCase()}`}
          subtitle={''}
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          size="small"
          icon={<MinusCircleIcon />}
          submitText="Withdraw"
        >
          <div className={classes.oneColumn}>
            <FormTokenField
              {...fields.amount}
              max={max}
              symbol={vault.type}
              decimals={vault.decimals}
              label={`Max: ${max} ${vault.type.toUpperCase()}`}
            />
          </div>
        </FormModal>
      )}
    </SingleTokenForm.FormController>
  );
}
