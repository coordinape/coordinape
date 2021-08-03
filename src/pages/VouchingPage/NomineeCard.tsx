import React from 'react';

import moment from 'moment';
import { transparentize } from 'polished';
import { NavLink } from 'react-router-dom';

import {
  makeStyles,
  Button,
  Tooltip,
  Zoom,
  withStyles,
} from '@material-ui/core';

import { useMe, useVouching } from 'hooks';

import { INominee } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 330,
    padding: theme.spacing(2.5, 3),
    backgroundColor: theme.colors.background,
    borderRadius: 11,
  },
  name: {
    margin: 0,
    fontSize: 17,
    fontWeight: 400,
    color: theme.colors.text,
    textAlign: 'center',
  },
  infoContainer: {
    margin: theme.spacing(0, 2),
    height: 40,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  info: {
    margin: 0,
    fontSize: 14,
    fontWeight: 400,
    color: transparentize(0.3, theme.colors.text),
  },
  description: {
    margin: theme.spacing(2, 1),
    height: 86,
    fontSize: 17,
    fontWeight: 400,
    color: transparentize(0.5, theme.colors.text),
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    display: '-webkit-box',
    wordBreak: 'break-word',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
  },
  confirm: {
    margin: theme.spacing(1),
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.red,
    textAlign: 'center',
  },
  expire: {
    marginTop: theme.spacing(2.5),
    fontSize: 17,
    fontWeight: 400,
    color: transparentize(0.5, theme.colors.text),
    textAlign: 'center',
  },
}));

const TextOnlyTooltip = withStyles({
  tooltip: {
    margin: 'auto',
    padding: '8px',
    maxWidth: 240,
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.5)',
    background: '#C3CDCF',
  },
})(Tooltip);

const NomineeCard = ({ nominee }: { nominee: INominee }) => {
  const classes = useStyles();
  const { vouchUser } = useVouching();
  const { selectedMyUser } = useMe();
  const necessaryVouch = nominee.vouches_required - nominee.nominations.length;
  const vouchDisabled = selectedMyUser
    ? nominee.nominated_by_user_id === selectedMyUser.id ||
      nominee.nominations.some((user) => user.id === selectedMyUser.id)
    : true;

  return (
    <div className={classes.root}>
      <h5 className={classes.name}>{nominee.name}</h5>
      <div className={classes.infoContainer}>
        <span className={classes.info}>
          was nominated by{' '}
          <NavLink
            className={classes.info}
            to={`profile/${nominee.nominator.address}`}
          >
            {nominee.nominator.name}
          </NavLink>
        </span>
      </div>
      <TextOnlyTooltip
        TransitionComponent={Zoom}
        placement="top"
        title={nominee.description}
      >
        <span className={classes.description}>{nominee.description}</span>
      </TextOnlyTooltip>
      <span className={classes.confirm}>
        {necessaryVouch} {necessaryVouch > 1 ? 'vouches' : 'vouch'} needed to
        confirm
      </span>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        disabled={vouchDisabled}
        onClick={() => vouchUser(nominee.id)}
      >
        Vouch for {nominee.name}
      </Button>
      <span className={classes.expire}>
        Expires {moment(nominee.expiryDate).format('MM/DD')}
      </span>
    </div>
  );
};

export default NomineeCard;
