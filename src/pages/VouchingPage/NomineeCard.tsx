import React from 'react';

import { transparentize } from 'polished';
import { NavLink } from 'react-router-dom';

import {
  makeStyles,
  Popover,
  Button,
  Tooltip,
  Zoom,
  withStyles,
} from '@material-ui/core';

import { useApiWithSelectedCircle } from 'hooks';
import { useSelectedCircle } from 'recoilState/app';

import { INominee } from 'types';

const useStyles = makeStyles(theme => ({
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
    margin: theme.spacing(0, 4),
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
    textAlign: 'center',
  },
  vouchedByButton: {
    minWidth: 0,
    margin: 0,
    padding: theme.spacing(0, 0.2),
    fontSize: 14,
    fontWeight: 400,
    color: transparentize(0.3, theme.colors.text),
    borderColor: transparentize(0.3, theme.colors.text),
    borderRadius: 0,
    border: 'solid',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  vouchedByPaper: {
    maxWidth: 180,
    maxHeight: 100,
    padding: theme.spacing(1, 2),
    fontSize: 14,
    fontWeight: 400,
    color: transparentize(0.3, theme.colors.text),
    overflowY: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
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
    color: 'rgba(81, 99, 105, 0.7)',
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
  },
})(Tooltip);

export const NomineeCard = ({ nominee }: { nominee: INominee }) => {
  const classes = useStyles();
  const { vouchUser } = useApiWithSelectedCircle();
  const { circle, myUser } = useSelectedCircle();
  const vouchDisabled =
    myUser && circle
      ? nominee.nominated_by_user_id === myUser.id ||
        nominee.nominations.some(user => user.id === myUser.id) ||
        (circle.only_giver_vouch && myUser.non_giver)
      : true;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const openVouchedBy = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeVouchedBy = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'vouched-by-popover' : undefined;

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
          {nominee.nominations.length > 0 && (
            <>
              {' '}
              and vouched for by{' '}
              <Button
                className={classes.vouchedByButton}
                aria-describedby={id}
                onClick={openVouchedBy}
                disableRipple
              >
                {nominee.nominations.length}
                {nominee.nominations.length > 1 ? ' users' : ' user'}
              </Button>
            </>
          )}
        </span>
      </div>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.vouchedByPaper,
        }}
        id={id}
        onClose={closeVouchedBy}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {nominee.nominations.map((user, index) => (
          <>
            <NavLink
              key={user.id}
              className={classes.info}
              to={`profile/${user.address}`}
            >
              {user.id === myUser?.id ? 'You' : user.name}
            </NavLink>
            {index < nominee.nominations.length - 1 && <>,&nbsp;</>}
          </>
        ))}
      </Popover>
      <TextOnlyTooltip
        TransitionComponent={Zoom}
        placement="top"
        title={nominee.description}
      >
        <span className={classes.description}>{nominee.description}</span>
      </TextOnlyTooltip>
      <span className={classes.confirm}>
        {nominee.vouchesNeeded}{' '}
        {nominee.vouchesNeeded > 1 ? 'vouches' : 'vouch'} needed to confirm
      </span>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        disabled={vouchDisabled}
        onClick={() => vouchUser(nominee.id).catch(console.warn)}
      >
        Vouch for {nominee.name}
      </Button>
      <span className={classes.expire}>
        Expires {nominee.expiryDate.toLocal().toLocaleString()}
      </span>
    </div>
  );
};

export default NomineeCard;
