import { Button, Popover, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { useUserInfo } from 'contexts';
import moment from 'moment';
import React, { useState } from 'react';
import { getApiService } from 'services/api';
import { ITokenGift } from 'types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: 8,
    alignItems: 'center',
    flex: '1 0 auto',
  },
  receiveButton: {
    padding: '0 15px',
    height: 32,
    fontSize: 12,
    fontWeight: 600,
    color: theme.colors.text,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    borderRadius: 8,
    display: 'flex',
    textTransform: 'none',
    '&.selected': {
      color: theme.colors.selected,
    },
  },
  popover: {
    width: 300,
    maxHeight: 550,
    marginTop: 8,
    padding: '27px 22px',
    overflowY: 'auto',
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
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
    color: theme.colors.selected,
  },
  noteDate: {
    fontSize: 11,
    fontWeight: 400,
    color: 'rgba(94, 111, 116, 0.6)',
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
}));

interface IProps {
  className?: string;
}

export const ReceiveInfo = (props: IProps) => {
  const classes = useStyles();
  const { circle, me, refreshUserInfo, users } = useUserInfo();
  const [tokenGifts, setTokenGifts] = useState<ITokenGift[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const getPendingTokens = async () => {
    if (me?.address) {
      try {
        const tokenGifts = await getApiService().getPendingTokenGifts(
          undefined,
          me.address
        );
        setTokenGifts(tokenGifts);
      } catch (error) {
        error;
      }
    } else {
      setTokenGifts([]);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    getPendingTokens();
    refreshUserInfo();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'note-popover' : undefined;

  return (
    <div className={classes.root}>
      <Button
        aria-describedby={id}
        className={
          !anchorEl
            ? classes.receiveButton
            : clsx(classes.receiveButton, 'selected')
        }
        onClick={handleClick}
      >
        {me?.give_token_received || 0} {circle?.token_name || 'GIVE'} RECEIVED
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
        id={id}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {tokenGifts
          .filter(
            (tokenGift) => tokenGift.tokens > 0 || tokenGift.note.length > 0
          )
          .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
          .map((tokenGift) => (
            <div className={classes.note} key={tokenGift.id}>
              <div className={classes.noteHeader}>
                <div className={classes.noteTitle}>
                  {tokenGift.tokens > 0
                    ? `+${tokenGift.tokens} Received from `
                    : 'From '}
                  {users.find((user) => user.id === tokenGift.sender_id)
                    ?.name || 'Unknown'}
                </div>
                <div className={classes.noteDate}>
                  {moment(tokenGift.updated_at).format('MMM ‘D')}
                </div>
              </div>
              <div
                className={
                  tokenGift.note.length > 0
                    ? classes.noteBody
                    : classes.noteEmptyBody
                }
              >
                {tokenGift.note.length > 0
                  ? `“${tokenGift.note}”`
                  : '-- Empty Note --'}
              </div>
            </div>
          ))}
      </Popover>
    </div>
  );
};
