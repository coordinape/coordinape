import { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { FormModal, FormRadioSelect, FormTextField } from 'components';
import AdminVaultForm from 'forms/AdminVaultForm';
import { PlusCircleIcon } from 'icons';

const useStyles = makeStyles(theme => ({
  modalBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  oneColumn: {
    marginTop: theme.spacing(6),
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
  subtitle: {
    margin: theme.spacing(0, 0, 2),
    fontSize: 16,
    fontWeight: 300,
    lineHeight: 1.2,
    color: theme.colors.text,
    textAlign: 'center',
  },
  largeText: {
    color: theme.colors.text,
    fontSize: 27,
    fontWeight: 700,
  },
  blueText: {
    color: theme.colors.lightBlue,
    fontSize: 17,
    marginBottom: 0,
  },
  parenText: {
    fontSize: 17,
    marginTop: 0,
  },
  radioDiv: {
    width: '60%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: '0 auto 0 auto',
    color: theme.colors.text,
    fontSize: 16,
  },
  innerWrapper: {
    marginTop: '2em',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

interface EditModalProps {
  onClose: () => void;
}

export default function EditModal({ onClose }: EditModalProps) {
  const classes = useStyles();
  const history = useHistory();
  const [ongoing, setOngoing] = useState<boolean>(false);

  const setOngoingAllocation = () => {
    setOngoing(!ongoing);
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
          onClose={onClose}
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          size="small"
          icon={<PlusCircleIcon />}
          submitText={`Fund This Epoch`}
        >
          <div className={classes.innerWrapper}>
            <div className={classes.subtitle}>Edit allowances for</div>
            <div className={classes.largeText}>Yearn Community: E22</div>
            <p className={classes.blueText}>Aug 15 to Aug 31</p>
            <p className={classes.parenText}>(Repeats Monthly)</p>
            <div className={classes.oneColumn}>
              <FormTextField
                {...fields.token}
                InputProps={{ startAdornment: 'MAX', endAdornment: 'USDC' }}
                label="Available: 264,600 USDC"
                apeVariant="token"
              />
            </div>
            <div className={classes.radioDiv}>
              <FormRadioSelect
                {...fields.token}
                value="Repeat funding monthly"
                // eslint-disable-next-line no-console
                onChange={setOngoingAllocation}
                options={[{ value: 'Repeat funding Monthly', label: '' }]}
                box
              />
              <p>Repeat funding monthly</p>
            </div>
          </div>
        </FormModal>
      )}
    </AdminVaultForm.FormController>
  );
}
