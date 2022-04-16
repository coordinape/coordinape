import { useState } from 'react';

import iti from 'itiriri';
import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';

import { Popover, makeStyles } from '@material-ui/core';

import { ApeAvatar } from 'components';
import { useUserGifts } from 'recoilState/allocation';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import { Button } from 'ui';

const useStyles = makeStyles(theme => ({
  root: {
    marginRight: 8,
  },
  popover: {
    width: 335,
    maxHeight: 550,
    marginTop: 8,
    padding: '27px 22px',
    overflowY: 'auto',
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
  },
  regiftContainer: {
    padding: theme.spacing(2, 3),
    marginBottom: theme.spacing(2),
  },
  regiftTitle: {
    margin: 0,
    padding: 0,
    fontSize: 13,
    fontWeight: 400,
    color: theme.colors.text,
    textAlign: 'center',
    whiteSpace: 'pre-line',
  },
  navLink: {
    fontWeight: 600,
    color: theme.colors.text,
  },
  note: {
    paddingTop: 8,
    border: 'solid',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  noteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  noteTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: theme.colors.red,
  },
  noteDate: {
    fontSize: 11,
    fontWeight: 400,
    color: 'rgba(94, 111, 116, 0.6)',
  },
  noteContainer: {
    margin: theme.spacing(0.5, 0),
    display: 'flex',
  },
  avatar: {
    marginRight: theme.spacing(1),
    width: 34,
    height: 34,
  },
  noteBody: {
    padding: '10px 0',
    fontSize: 13,
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  noteEmptyBody: {
    padding: '10px 0',
    fontSize: 13,
    fontWeight: 400,
    color: 'rgba(0, 0, 0, 0.2)',
  },
  historyContainer: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(0, 3),
  },
}));

export const ReceiveInfo = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | undefined>(
    undefined
  );

  const {
    myUser,
    circle: selectedCircle,
    circleEpochsStatus: { currentEpoch, previousEpoch },
  } = useSelectedCircle();
  const { forUserByEpoch: myReceived } = useUserGifts(myUser.id);

  const noEpoch = !currentEpoch && !previousEpoch;
  const gifts = currentEpoch
    ? myReceived.get(currentEpoch.id) ?? []
    : (previousEpoch && myReceived.get(previousEpoch.id)) ?? [];
  const totalReceived = (gifts && iti(gifts).sum(({ tokens }) => tokens)) || 0;

  return (
    <div className={classes.root}>
      <Button
        color="oldGray"
        size="small"
        onClick={event => setAnchorEl(event.currentTarget)}
      >
        {totalReceived} {selectedCircle?.tokenName}
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.popover,
        }}
        onClose={() => setAnchorEl(undefined)}
        open={!!anchorEl}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className={classes.regiftContainer}>
          <p className={classes.regiftTitle}>
            {noEpoch
              ? 'No Epochs in this Circle'
              : `You have received ${totalReceived ?? 0} ${
                  selectedCircle?.tokenName
                }`}
          </p>
        </div>
        {gifts
          ?.filter(tokenGift => tokenGift.tokens > 0 || tokenGift.note)
          ?.sort((a, b) => +new Date(b.dts_created) - +new Date(a.dts_created))
          ?.map(tokenGift => (
            <div className={classes.note} key={tokenGift.id}>
              <div className={classes.noteHeader}>
                <div className={classes.noteTitle}>
                  {tokenGift.tokens > 0
                    ? `+${tokenGift.tokens} Received from `
                    : 'From '}
                  {tokenGift.sender?.name}
                </div>
                <div className={classes.noteDate}>
                  {DateTime.fromSQL(tokenGift.dts_created).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </div>
              </div>
              <div className={classes.noteContainer}>
                <ApeAvatar user={tokenGift.sender} className={classes.avatar} />
                <div
                  className={
                    tokenGift.note ? classes.noteBody : classes.noteEmptyBody
                  }
                >
                  {tokenGift.note ? `“${tokenGift.note}”` : '-- Empty Note --'}
                </div>
              </div>
            </div>
          ))}
        <div className={classes.historyContainer}>
          <p className={classes.regiftTitle}>
            <NavLink className={classes.navLink} to={paths.history}>
              See Complete History
            </NavLink>
          </p>
        </div>
      </Popover>
    </div>
  );
};
