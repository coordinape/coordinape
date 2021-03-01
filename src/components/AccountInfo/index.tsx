import {
  Button,
  Hidden,
  Popover,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { WALLET_ICONS } from 'config/constants';
import React from 'react';
import { shortenAddress } from 'utils';
import { ConnectorNames } from 'utils/enums';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0 22px',
    height: 42,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#EBEBEC',
    borderRadius: 21,
    borderColor: '#EDE9E9',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  iconWrapper: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      width: theme.spacing(2),
      height: theme.spacing(2),
    },
  },
  address: {
    textTransform: 'none',
    color: theme.colors.primary,
    fontSize: 12,
    marginLeft: theme.spacing(1),
  },
  icon: {
    color: theme.colors.third,
  },
  popover: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing(0.5),
  },
  popoverButton: {
    height: theme.spacing(5),
    minWidth: 120,
  },
}));

interface IProps {
  address: string;
  onDisconnect: () => void;
  icon: string;
}

export const AccountInfo = (props: IProps) => {
  const classes = useStyles();
  const { address, icon, onDisconnect } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const Icon = WALLET_ICONS[icon as ConnectorNames];

  const open = Boolean(anchorEl);
  const id = open ? 'account-popover' : undefined;

  return (
    <div>
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
          {shortenAddress(address)}
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
            handleClose();
            onDisconnect();
          }}
          variant="contained"
        >
          Disconnect
        </Button>
      </Popover>
    </div>
  );
};
