import React from 'react';

import {
  Button,
  Hidden,
  Popover,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { WALLET_ICONS } from 'config/constants';
import { useWallet } from 'hooks';
import { shortenAddress } from 'utils';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0 15px',
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.text,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    borderRadius: 8,
  },
  iconWrapper: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    '& svg': {
      width: theme.spacing(2),
      height: theme.spacing(2),
    },
  },
  address: {
    textTransform: 'none',
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 600,
  },
  icon: {
    color: theme.colors.third,
  },
  popover: {
    marginTop: 8,
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 137, 134, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 153, 154, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 93, 99, 0.16)',
  },
  popoverButton: {
    height: theme.spacing(5),
    minWidth: 134,
  },
}));

export const AccountInfo = () => {
  const classes = useStyles();
  const { myAddress, connectorName, deactivate } = useWallet();

  const Icon = connectorName ? WALLET_ICONS[connectorName] : () => <></>;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'account-popover' : undefined;

  if (!myAddress) {
    return <></>;
  }

  return (
    <>
      <Button
        aria-describedby={id}
        className={classes.root}
        onClick={handleClick}
      >
        <Hidden smDown>
          <div className={classes.iconWrapper}>
            <Icon />
          </div>
        </Hidden>
        <Typography className={classes.address} component="span">
          {shortenAddress(myAddress)}
        </Typography>
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
        <Button
          className={classes.popoverButton}
          onClick={() => {
            deactivate();
            handleClose();
          }}
        >
          Disconnect
        </Button>
      </Popover>
    </>
  );
};
