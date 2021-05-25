import { Button, Hidden, makeStyles } from '@material-ui/core';
import { ReactComponent as EditAdminSVG } from 'assets/svgs/button/edit-admin.svg';
import { useUserInfo } from 'contexts';
import moment from 'moment';
import React, { useState } from 'react';
import { apiBaseURLofCircle } from 'utils/domain';
import { capitalizedName } from 'utils/string';

import { EditCircleModal } from '../EditCircleModal';
import { EditEpochModal } from '../EditEpochModal';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  circleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  circleTitle: {
    margin: 0,
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  editButton: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(1.5, 3),
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.white,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.colors.lightGray,
    borderRadius: theme.spacing(1),
    filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.33))',
  },
  editAdminIconWrapper: {
    width: theme.spacing(1.25),
    height: theme.spacing(2.5),
    marginRight: theme.spacing(1),
  },
  csvContainer: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
  },
  csv: {
    marginTop: theme.spacing(2),
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(81, 99, 105, 0.35)',
  },
  epochContainer: {
    marginLeft: theme.spacing(10),
    maxWidth: theme.spacing(45),
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginTop: theme.spacing(2),
    marginBottom: 0,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(81, 99, 105, 0.5)',
  },
  description: {
    marginTop: theme.spacing(0.5),
    marginBottom: 0,
    maxHeight: 100,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    wordWrap: 'break-word',
    whiteSpace: 'pre-line',
    '&:last-of-type': {
      overflow: 'auto',
      overflowY: 'scroll',
    },
  },
}));

export const Header = () => {
  const classes = useStyles();
  const { circle, epoch, epochs } = useUserInfo();
  const [isEditCircle, setEditCircle] = useState<boolean>(false);
  const [isEditEpoch, setEditEpoch] = useState<boolean>(false);

  // Return
  return (
    <div className={classes.root}>
      <div className={classes.circleContainer}>
        <p className={classes.circleTitle}>{capitalizedName(circle?.name)}</p>
        <Button
          className={classes.editButton}
          onClick={() => setEditEpoch(true)}
        >
          <Hidden smDown>
            <div className={classes.editAdminIconWrapper}>
              <EditAdminSVG />
            </div>
          </Hidden>
          Edit Epoch Settings
        </Button>
        <Button
          className={classes.editButton}
          onClick={() => {
            setEditCircle(true);
          }}
        >
          <Hidden smDown>
            <div className={classes.editAdminIconWrapper}>
              <EditAdminSVG />
            </div>
          </Hidden>
          Edit Circle Settings
        </Button>
        <div className={classes.csvContainer}>
          {/* <a className={classes.csv} href="/" rel="noreferrer" target="_blank">
            Import Contributors CSV
          </a>
          <a className={classes.csv} href="/" rel="noreferrer" target="_blank">
            Export Contributors CSV
          </a> */}
          <a
            className={classes.csv}
            href={
              circle && epoch
                ? apiBaseURLofCircle(circle) + `/csv?epoch_id=${epoch.id}`
                : '/'
            }
            rel="noreferrer"
            target="_blank"
          >
            Export Epoch CSV
          </a>
        </div>
      </div>
      <div className={classes.epochContainer}>
        <p className={classes.title}>Next Epoch Starts</p>
        <p className={classes.description}>
          {epochs[0]
            ? moment.utc(epochs[0].start_date).local().format('MMMM Do')
            : 'n/a'}
        </p>
        <p className={classes.title}>Progress Epoch</p>
        <p className={classes.description}>
          {epoch && !epoch.ended
            ? `${moment
                .utc(epoch.start_date)
                .local()
                .format('MM/DD/YYYY')} - ${moment
                .utc(epoch.end_date)
                .local()
                .format('MM/DD/YYYY')}`
            : 'n/a'}
        </p>
        {/* <p className={classes.title}>Epoch Length</p>
        <p className={classes.description}>
          {epoch
            ? moment
                .utc(epoch.end_date)
                .diff(moment.utc(epoch.start_date), 'days')
            : 0}{' '}
          Days
        </p> */}
        <p className={classes.title}>Upcoming Epochs</p>
        <p className={classes.description}>
          {epochs.length === 0
            ? 'n/a'
            : epochs.reduce(
                (dateString: string, epoch) =>
                  dateString +
                  (dateString.length === 0 ? '' : '\n') +
                  `${moment
                    .utc(epoch.start_date)
                    .local()
                    .format('MM/DD/YYYY')} - ${moment
                    .utc(epoch.end_date)
                    .local()
                    .format('MM/DD/YYYY')}`,
                ''
              )}
        </p>
      </div>
      <div className={classes.epochContainer}>
        <p className={classes.title}>Teammate selection page text</p>
        <p className={classes.description}>{circle?.team_sel_text}</p>
        <p className={classes.title}>Allocation page text</p>
        <p className={classes.description}>{circle?.alloc_text}</p>
        <p className={classes.title}>Token Name</p>
        <p className={classes.description}>{circle?.token_name}</p>
      </div>
      {isEditCircle && circle && (
        <EditCircleModal
          circle={circle}
          onClose={() => {
            setEditCircle(false);
          }}
          visible={isEditCircle}
        />
      )}
      {isEditEpoch && (
        <EditEpochModal
          onClose={() => {
            setEditEpoch(false);
          }}
          visible={isEditEpoch}
        />
      )}
    </div>
  );
};
