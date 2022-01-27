import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { FormModal, FormTextField } from 'components';
import AdminVaultForm from 'forms/AdminVaultForm';
import { MinusCircleIcon } from 'icons';

import { IUser } from 'types';

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
}

export default function WithdrawModal({ onClose }: WithdrawModalProps) {
  const classes = useStyles();
  const history = useHistory();

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
          onClose={onClose}
          title={'Withdraw USDC from the Coordinape Vault'}
          subtitle={''}
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          size="small"
          icon={<MinusCircleIcon />}
          submitText={`Withdraw USDC`}
        >
          <div className={classes.oneColumn}>
            <FormTextField
              {...fields.token}
              InputProps={{ startAdornment: 'MAX', endAdornment: 'USDC' }}
              label="Available: 264,600 USDC"
              apeVariant="token"
            />
          </div>
        </FormModal>
      )}
    </AdminVaultForm.FormController>
  );
}
