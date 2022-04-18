import React, { useState } from 'react';

import { vouchUser } from 'lib/gql/mutations';
import { DateTime } from 'luxon';
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

import { useSelectedCircle } from 'recoilState/app';

import { IActiveNominee } from './getActiveNominees';

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
    display: '-webkit-box',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
    wordBreak: 'break-word',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
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

export const NomineeCard = ({
  nominee,
  refetchNominees,
}: {
  nominee: IActiveNominee;
  refetchNominees: () => void;
}) => {
  const classes = useStyles();
  const { circle, myUser } = useSelectedCircle();
  const [vouching, setVouching] = useState(false);
  const vouchDisabled =
    myUser && circle
      ? nominee.nominated_by_user_id === myUser.id ||
        nominee.nominations.some(n => n.voucher_id === myUser.id) ||
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

  const handleVouch = async () => {
    setVouching(true);
    await vouchUser(nominee.id).then(refetchNominees).catch(console.warn);
    setVouching(false);
  };

  const vouchesNeeded = Math.max(
    0,
    nominee.vouches_required - (nominee.nominations ?? []).length - 1
  );

  return (
    <div className={classes.root}>
      <h5 className={classes.name}>{nominee.name}</h5>
      <div className={classes.infoContainer}>
        <span className={classes.info}>
          was nominated by{' '}
          <NavLink
            className={classes.info}
            to={`/profile/${nominee.nominator?.address}`}
          >
            {nominee.nominator?.name}
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
        {nominee.nominations.map((nomination, index) => (
          <>
            <NavLink
              key={nomination.voucher?.id}
              className={classes.info}
              to={`/profile/${nomination.voucher?.address}`}
            >
              {nomination.voucher?.id === myUser?.id
                ? 'You'
                : nomination.voucher?.name}
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
        {vouchesNeeded} {vouchesNeeded > 1 ? 'vouches' : 'vouch'} needed to
        confirm
      </span>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        disabled={vouchDisabled || vouching}
        onClick={handleVouch}
      >
        {vouching ? 'Vouching...' : `Vouch for ${nominee.name}`}
      </Button>
      <span className={classes.expire}>
        Expires{' '}
        {DateTime.fromISO(nominee.expiry_date).toLocaleString(
          DateTime.DATETIME_SHORT
        )}
      </span>
    </div>
  );
};

export default NomineeCard;
