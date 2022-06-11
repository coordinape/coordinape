import { useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import {
  FormModal,
  FormTextField,
  FormDatePicker,
  FormTimePicker,
} from 'components';
import EpochForm, { summarizeEpoch } from 'forms/AdminEpochForm';
import { useApiAdminCircle } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';

import { IEpoch } from 'types';

const useStyles = makeStyles(theme => ({
  modalDescription: {
    textAlign: 'center',
    fontWeight: 100,
    color: theme.colors.text,
    padding: '0px 100px',
  },
  modalExternalLink: {
    textDecoration: 'underline',
    color: 'inherit',
  },
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
    fontWeight: 600,
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
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 500,
    color: theme.colors.text,
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

  const { circle } = useSelectedCircle();

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
          <div className={classes.modalDescription}>
            An Epoch is a period of time where circle members contribute value &
            allocate {circle.tokenName || 'GIVE'} tokens to one another.{' '}
            <span>
              <a
                className={classes.modalExternalLink}
                href="https://docs.coordinape.com/welcome/how_to_use_coordinape#my-epoch"
                rel="noreferrer"
                target="_blank"
              >
                Learn More
              </a>
            </span>
          </div>

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
                <FormTimePicker {...fields.start_date} />
              </div>
            </div>
            <div className={classes.repeat}>
              <h6 className={classes.subTitle}>Should this epoch repeat?</h6>
            </div>
          </div>
          <div className={classes.summary}>{summarizeEpoch(value)}</div>
        </FormModal>
      )}
    </EpochForm.FormController>
  );
};

export default AdminEpochModal;
