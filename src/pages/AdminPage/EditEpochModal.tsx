import React from 'react';

import { makeStyles } from '@material-ui/core';

import {
  FormModal,
  FormTextField,
  FormDatePicker,
  FormTimePicker,
  FormRadioGroup,
} from 'components';
import EpochForm from 'forms/EpochForm';
import { useAdminApi } from 'hooks';

import { IEpoch } from 'types';

const useStyles = makeStyles((theme) => ({
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
    marginBottom: theme.spacing(4),
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
    marginBottom: theme.spacing(4),
  },
  summary: {
    margin: 0,
  },
}));

export const EditEpochModal = ({
  epoch,
  onClose,
  visible,
}: {
  epoch?: IEpoch;
  visible: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();

  const { createEpoch, updateEpoch } = useAdminApi();

  const { instanceKey, handleSubmit, fields } = EpochForm.useForm({
    source: epoch,
    submit: (params) => {
      return (epoch ? createEpoch(params) : updateEpoch(params)).then(() =>
        onClose()
      );
    },
  });

  const { changed, hasError } = EpochForm.useFormValues(instanceKey);

  if (fields === undefined) {
    return <></>;
  }

  return (
    <FormModal
      onClose={onClose}
      visible={visible}
      title={epoch ? `Edit Epoch ${epoch.number}` : 'Create Epoch'}
      onSubmit={handleSubmit}
      submitDisabled={changed && !hasError}
    >
      <div className={classes.datesAndRepeat}>
        <div className={classes.dates}>
          <h6 className={classes.subTitle}>Dates</h6>
          <div className={classes.quadGrid}>
            <FormDatePicker {...fields.start_date} label="Epoch Start Date" />
            <FormTextField
              {...fields.days}
              label="Epoch Length"
              type="number"
              helperText="(# of days)"
            />
            <FormTimePicker label="Epoch Start Time" {...fields.start_time} />
          </div>
        </div>
        <div className={classes.repeat}>
          <h6 className={classes.subTitle}>Should this epoch repeat?</h6>
          <FormRadioGroup {...fields.repeat} />
        </div>
      </div>
      <div className={classes.summary}>
        This epoch starts on 05/01/21 at 12:00 UTC and will end on 05/16/21 at
        12:00 UTC. The epoch is set to repeat every four weeks, the following
        epoch will start on 05/29/21
      </div>
    </FormModal>
  );
};

export default EditEpochModal;
