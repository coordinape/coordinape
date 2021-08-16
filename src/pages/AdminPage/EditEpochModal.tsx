import React from 'react';

import moment from 'moment';
import { z } from 'zod';

import { makeStyles } from '@material-ui/core';

import {
  FormModal,
  ControlledTextField,
  ControlledDatePicker,
  ControlledTimePicker,
  ControlledRadioGroup,
} from 'components';
import { FormProvider, useFormWithController, createField } from 'forms';
import { useAdminApi } from 'hooks';

import { IEpoch, IFormField, UpdateCreateEpochParam } from 'types';

type IEpochRepeatEnum = '' | 'monthly' | 'weekly';

export type TEpochFields = Omit<UpdateCreateEpochParam, 'grant' | 'repeat'> & {
  repeatEnum: IEpochRepeatEnum;
};

const epochRepeatOptions = [
  {
    label: 'This epoch does not repeat',
    value: '',
  },
  {
    label: 'This epoch repeats monthly',
    value: 'monthly',
  },
  {
    label: 'This epoch repeats weekly',
    value: 'weekly',
  },
];

export const repeatEnumToNumber = (repeat: IEpochRepeatEnum) => {
  if (repeat === 'weekly') {
    return 1;
  }
  return repeat === 'monthly' ? 2 : 0;
};

export const epochFieldsTwo = {
  start_date: {
    load: (e: IEpoch) => e.start_date,
    defaultValue: moment().utc().format('MM/DD/YYYY'),
    fieldProps: {
      format: 'MM/dd/yyyy',
    },
  },
  start_time: {
    load: (e: IEpoch) => e.start_time,
    defaultValue: '2000-01-01T00:00:00.000000Z',
  },
  repeat: {
    load: (e: IEpoch) => e.repeat ?? '',
    defaultValue: '',
    options: epochRepeatOptions,
  },
  days: {
    load: (e: IEpoch) => e.days ?? e.calculatedDays,
    defaultValue: 4,
  },
};

const EpochRepeatEnum = z.enum(['', 'monthly', 'weekly']);
type TEpochRepeatEnum = z.infer<typeof EpochRepeatEnum>;

const updateEpochSchema = z.object({
  start_date: z.string(),
  start_time: z.string(),
  repeat: EpochRepeatEnum.transform((v) => {
    if (v === 'weekly') {
      return 1;
    }
    return v === 'monthly' ? 2 : 0;
  }),
  days: z.number().min(0).max(100),
  grant: z.optional(z.number()),
});

type UpdateCreateEpochParam = z.infer<typeof updateEpochSchema>;

const epochFieldList = Object.values(epochFields) as IFormField[];

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

  const submit = ({ repeatEnum, ...rest }: TEpochFields) => {
    const params = { repeat: repeatEnumToNumber(repeatEnum), ...rest };
    return (epoch ? createEpoch(params) : updateEpoch(params)).then(() =>
      onClose()
    );
  };

  const { changed, errors, handleSubmit, formKey } = useFormWithController(
    submit,
    Object.values(epochFields),
    (epoch?: IEpoch) => (epoch ? `epoch-form-${epoch.id}` : `epoch-form-new`),
    epoch
  );

  return (
    <FormProvider formKey={formKey}>
      <FormModal
        onClose={onClose}
        visible={visible}
        title={epoch ? `Edit Epoch ${epoch.number}` : 'Create Epoch'}
        onSubmit={handleSubmit}
        submitDisabled={changed && !errors}
      >
        <div className={classes.datesAndRepeat}>
          <div className={classes.dates}>
            <h6 className={classes.subTitle}>Dates</h6>
            <div className={classes.quadGrid}>
              <ControlledDatePicker
                label="Epoch Start Date"
                field={epochFields.start_date}
              />
              <ControlledTextField
                label="Epoch Length"
                type="number"
                field={epochFields.days}
                helperText="(# of days)"
              />
              <ControlledTimePicker
                label="Epoch Start Time"
                field={epochFields.start_time}
              />
            </div>
          </div>
          <div className={classes.repeat}>
            <h6 className={classes.subTitle}>Should this epoch repeat?</h6>
            <ControlledRadioGroup field={epochFields.repeatEnum} />
          </div>
        </div>
        <div className={classes.summary}>
          This epoch starts on 05/01/21 at 12:00 UTC and will end on 05/16/21 at
          12:00 UTC. The epoch is set to repeat every four weeks, the following
          epoch will start on 05/29/21
        </div>
      </FormModal>
    </FormProvider>
  );
};

export default EditEpochModal;
