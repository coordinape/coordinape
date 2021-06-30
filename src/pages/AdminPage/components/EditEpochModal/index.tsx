import React, { useState } from 'react';

import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';

import { Button, Hidden, Modal, makeStyles } from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

import { ReactComponent as DatePickerSVG } from 'assets/svgs/button/date-picker.svg';
import { ReactComponent as DeleteEpochSVG } from 'assets/svgs/button/delete-epoch.svg';
import { ReactComponent as SaveAdminSVG } from 'assets/svgs/button/save-admin.svg';
import { useUserInfo } from 'hooks';

import { IEpoch } from 'types';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing(2.5),
    width: 870,
    height: 550,
    borderRadius: theme.spacing(1),
    outline: 'none',
    background: theme.colors.white,
  },
  title: {
    marginBottom: theme.spacing(5),
    fontSize: 30,
    fontWeight: 700,
    color: theme.colors.text,
    textAlign: 'center',
  },
  subContent: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  container: {
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
  },
  subTitle: {
    margin: 0,
    padding: theme.spacing(1),
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(81, 99, 105, 0.5)',
    textAlign: 'center',
    border: 'solid',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: theme.colors.background,
  },
  datesContainer: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
  dateContainer: {
    width: '47%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.text,
    textAlign: 'center',
  },
  datePicker: {
    margin: theme.spacing(0),
    padding: theme.spacing(1),
    background: theme.colors.background,
    borderRadius: theme.spacing(1),
  },
  dateInput: {
    fontSize: 12,
    fontWeight: 500,
    color: theme.colors.text,
  },
  dateInputUnderline: {
    '&:hover': {
      '&::before': {
        borderBottomColor: theme.colors.transparent,
      },
    },
    '&::after': {
      borderBottomColor: theme.colors.transparent,
    },
  },
  newEpochDescription: {
    padding: theme.spacing(0, 2),
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(81, 99, 105, 0.5)',
    whiteSpace: 'pre-line',
  },
  saveButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(5),
    padding: theme.spacing(1.5, 3),
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.white,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.colors.red,
    borderRadius: theme.spacing(1),
    filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.33))',
    '&:hover': {
      background: theme.colors.red,
      filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.5))',
    },
    '&:disabled': {
      color: theme.colors.lightRed,
      background: theme.colors.mediumRed,
    },
  },
  saveAdminIconWrapper: {
    width: theme.spacing(1.25),
    height: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  scrollableContainer: {
    maxHeight: 150,
    overflow: 'auto',
    overflowY: 'scroll',
  },
  epochPeriod: {
    margin: theme.spacing(0.5, 0),
    padding: theme.spacing(1.5, 5),
    justifyContent: 'start',
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.text,
    textTransform: 'none',
    textAlign: 'center',
  },
  deleteEpochIconWrapper: {
    width: theme.spacing(1.25),
    height: theme.spacing(3),
    marginRight: theme.spacing(1.5),
  },
  epochDeletedContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(0, 2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  epochDeletedDescription: {
    padding: theme.spacing(0, 0.5),
    fontSize: 12,
    fontWeight: 700,
    color: theme.colors.red,
    display: '-webkit-box',
    wordBreak: 'break-word',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
  },
}));

interface IProps {
  visible: boolean;
  onClose: () => void;
}

export const EditEpochModal = (props: IProps) => {
  const classes = useStyles();
  const { onClose, visible } = props;
  const { createEpoch, deleteEpoch, epoch, epochs } = useUserInfo();
  const [epochStartDate, setEpochStartDate] = useState<Date | null>(null);
  const [epochEndDate, setEpochEndDate] = useState<Date | null>(null);
  const [
    epochDeletedDescription,
    setEpochDeletedDescription,
  ] = useState<string>('');

  // onClick EpochStartDate
  const onClickEpochStartDate = (date: Date | null) => {
    setEpochStartDate(date);
  };

  // onClick EpochEndDate
  const onClickEpochEndDate = (date: Date | null) => {
    setEpochEndDate(date);
  };

  // onClick SaveEpoch
  const onClickSaveEpoch = async () => {
    if (epochStartDate && epochEndDate) {
      const newEpoch = await createEpoch(epochStartDate, epochEndDate);
      setEpochDeletedDescription(
        `Epoch for ${moment
          .utc(newEpoch.start_date)
          .local()
          .format('MM/DD/YYYY')} to ${moment
          .utc(newEpoch.end_date)
          .local()
          .format('MM/DD/YYYY')} was created.`
      );
    }
  };

  // onClick DeleteEpoch
  const onClickDeleteEpoch = async (epoch: IEpoch) => {
    await deleteEpoch(epoch.id);
    setEpochDeletedDescription(
      `Epoch for ${moment
        .utc(epoch.start_date)
        .local()
        .format('MM/DD/YYYY')} to ${moment
        .utc(epoch.end_date)
        .local()
        .format('MM/DD/YYYY')} was deleted.`
    );
  };

  return (
    <Modal className={classes.modal} onClose={onClose} open={visible}>
      <div className={classes.content}>
        <p className={classes.title}>Edit Epoch Settings</p>
        <div className={classes.subContent}>
          <div className={classes.container}>
            <p className={classes.subTitle}>ADD AN EPOCH</p>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <div className={classes.datesContainer}>
                <div className={classes.dateContainer}>
                  <p className={classes.dateTitle}>Epoch Start Date</p>
                  <KeyboardDatePicker
                    InputProps={{
                      classes: {
                        input: classes.dateInput,
                      },
                      disableUnderline: true,
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    className={classes.datePicker}
                    disableToolbar
                    format="MM/dd/yyyy"
                    id="date-picker-inline"
                    keyboardIcon={<DatePickerSVG />}
                    label=""
                    margin="normal"
                    onChange={onClickEpochStartDate}
                    value={epochStartDate}
                    variant="inline"
                  />
                </div>
                <div className={classes.dateContainer}>
                  <p className={classes.dateTitle}>Epoch End Date</p>
                  <KeyboardDatePicker
                    InputProps={{
                      classes: {
                        input: classes.dateInput,
                      },
                      disableUnderline: true,
                    }}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    className={classes.datePicker}
                    disableToolbar
                    format="MM/dd/yyyy"
                    id="date-picker-inline"
                    keyboardIcon={<DatePickerSVG />}
                    label=""
                    margin="normal"
                    onChange={onClickEpochEndDate}
                    value={epochEndDate}
                    variant="inline"
                  />
                </div>
              </div>
            </MuiPickersUtilsProvider>
            <p className={classes.newEpochDescription}>
              We’ve found one-week epochs at the end of each month works well,
              but epochs can be any length and can occur at any interval.
              {'\n\n'}
              Epoch start/end times are always 00:00 UTC
            </p>
            <Button
              className={classes.saveButton}
              disabled={!epochStartDate || !epochEndDate}
              onClick={onClickSaveEpoch}
            >
              <Hidden smDown>
                <div className={classes.saveAdminIconWrapper}>
                  <SaveAdminSVG />
                </div>
              </Hidden>
              Save
            </Button>
          </div>
          <div className={classes.container}>
            <div>
              <p className={classes.subTitle}>Progress EPOCH</p>
              <p className={classes.epochPeriod}>
                {epoch &&
                moment.utc().diff(moment.utc(epoch.start_date)) >= 0 &&
                moment.utc(epoch.end_date).diff(moment.utc()) > 0
                  ? `${moment
                      .utc(epoch.start_date)
                      .local()
                      .format('MM/DD/YYYY')} to ${moment
                      .utc(epoch.end_date)
                      .local()
                      .format('MM/DD/YYYY')}`
                  : 'n/a'}
              </p>
            </div>
            <hr />
            <div>
              <p className={classes.subTitle}>UPCOMING EPOCHS</p>
              <div className={classes.scrollableContainer}>
                {epochs.map((epoch) => (
                  <Button
                    className={classes.epochPeriod}
                    key={epoch.id}
                    onClick={() => onClickDeleteEpoch(epoch)}
                  >
                    <Hidden smDown>
                      <div className={classes.deleteEpochIconWrapper}>
                        <DeleteEpochSVG />
                      </div>
                      {moment
                        .utc(epoch.start_date)
                        .local()
                        .format('MM/DD/YYYY')}{' '}
                      to{' '}
                      {moment.utc(epoch.end_date).local().format('MM/DD/YYYY')}
                    </Hidden>
                  </Button>
                ))}
              </div>
              {epochDeletedDescription.length > 0 && (
                <div className={classes.epochDeletedContainer}>
                  <p className={classes.epochDeletedDescription}>✓</p>
                  <p className={classes.epochDeletedDescription}>
                    {epochDeletedDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
