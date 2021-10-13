import React from 'react';

import { IconButton, Button, Popover, makeStyles } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles(theme => ({
  moreButton: {
    // margin: 0,
    // padding: theme.spacing(0, 1),
    // minWidth: 20,
    // fontSize: 17,
    // fontWeight: 800,
    // color: theme.colors.text,
  },
  morePaper: {
    width: 170,
    padding: theme.spacing(1, 0),
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
  },
  button: {
    margin: theme.spacing(0.5, 0),
    fontSize: 16,
    color: theme.colors.text,
  },
}));

interface IAction {
  label: string;
  onClick: () => void;
}

export const ThreeDotMenu = ({ actions }: { actions: IAction[] }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  return (
    <>
      <IconButton
        size="small"
        className={classes.moreButton}
        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
      >
        <MoreHorizIcon />
      </IconButton>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        classes={{
          paper: classes.morePaper,
        }}
        onClose={() => setAnchorEl(null)}
        open={!!anchorEl}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {actions.map(({ label, onClick }, i) => (
          <Button
            key={i}
            onClick={onClick}
            className={classes.button}
            variant="text"
          >
            {label}
          </Button>
        ))}
      </Popover>
    </>
  );
};
