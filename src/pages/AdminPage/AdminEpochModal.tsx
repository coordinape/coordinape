import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import {
  FormModal,
  FormTextField,
  FormDatePicker,
  FormTimePicker,
  FormRadioGroup,
} from 'components';
import EpochForm, { summarizeEpoch } from 'forms/AdminEpochForm';
import { useApiAdminCircle } from 'hooks';

import { IEpoch } from 'types';

const useStyles = makeStyles(theme => ({
  modalBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datesAndRepeat: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
  dates: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
    maxWidth: 300,
  },
  subTitle: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 3,
    marginBottom: theme.spacing(1),
    color: theme.colors.text + '80',
    textAlign: 'center',
    textTransform: 'uppercase',
    borderBottom: `1px solid ${theme.colors.text}20`,
  },
  quadGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    columnGap: theme.spacing(3),
    rowGap: theme.spacing(1),
  },
  repeat: {
    marginBottom: theme.spacing(2),
  },
  summary: {
    margin: 0,
    minHeight: 65,
  },
}));

export const AdminEpochModal = ({
  epoch,
  circleId,
  epochs,
  onClose,
  open,
}: {
  epoch?: IEpoch;
  circleId: number;
  epochs: IEpoch[];
  open: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();

  const { createEpoch, updateEpoch } = useApiAdminCircle(circleId);

  const source = useMemo(
    () => ({
      epoch: epoch,
      epochs: epochs.filter(e => e.id !== epoch?.id && !e.ended),
    }),
    [epoch, epochs]
  );

  return (
    <EpochForm.FormController
      source={source}
      submit={params =>
        (epoch ? updateEpoch(epoch.id, params) : createEpoch(params))
          .then(() => onClose())
          .catch(console.warn)
      }
    >
      {({ fields, errors, changedOutput, value, handleSubmit }) => (
        <FormModal
          onClose={onClose}
          open={open}
          title={epoch ? `Edit Epoch ${epoch.number}` : 'Create Epoch'}
          onSubmit={handleSubmit}
          submitDisabled={!changedOutput}
          errors={errors}
        >
          <div className={classes.datesAndRepeat}>
            <div className={classes.dates}>
              <h6 className={classes.subTitle}>Dates</h6>
              <div className={classes.quadGrid}>
                <FormDatePicker
                  {...fields.start_date}
                  label="Epoch Start Date"
                />
                <FormTextField
                  {...fields.days}
                  label="Epoch Length"
                  type="number"
                  helperText="(# of days)"
                />
                <FormTimePicker
                  label="Epoch Start Time"
                  {...fields.start_date}
                />
              </div>
            </div>
            <div className={classes.repeat}>
              <h6 className={classes.subTitle}>Should this epoch repeat?</h6>
              <FormRadioGroup {...fields.repeat} />
            </div>
          </div>
          <div className={classes.summary}>{summarizeEpoch(value)}</div>
        </FormModal>
      )}
    </EpochForm.FormController>
  );
};

export default AdminEpochModal;
