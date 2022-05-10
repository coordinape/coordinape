import React from 'react';

import clsx from 'clsx';

import { Popover, makeStyles, Hidden } from '@material-ui/core';

import { Box, Link } from 'ui';

const useStyles = makeStyles(theme => ({
  avatarButton: {
    marginLeft: theme.spacing(1.5),
  },
  popover: {
    width: 237,
    marginTop: theme.spacing(0.5),
    padding: 0,
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const OverviewMenu = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  return (
    <>
      <Link
        css={{
          color: 'white !important',
          cursor: 'pointer',
        }}
        onClick={event => setAnchorEl(event.currentTarget)}
        className={
          !anchorEl
            ? classes.avatarButton
            : clsx(classes.avatarButton, 'selected')
        }
      >
        Overview
      </Link>
      <Hidden smDown>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          classes={{ paper: classes.popover }}
          id="overview-popover"
          onClick={() => setTimeout(() => setAnchorEl(null))}
          onClose={() => setAnchorEl(null)}
          open={!!anchorEl}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Box
            css={{
              display: 'flex',
              flexDirection: 'column',
              pt: '$md',
              '> *': { padding: '$xs $lg' },
              '> a': {
                color: '$text',
                '&:hover': { color: '$black' },
              },
            }}
          >
            <span>Overview</span>
            <Link
              css={{
                backgroundColor: '$secondaryDark',
                mt: '$md',
                py: '$md !important',
                color: 'white !important',
                '&:hover': { opacity: 0.8 },
              }}
              href="https://notionforms.io/forms/give-us-your-feedback-improve-coordinape"
              target="_blank"
            >
              Give Feedback
            </Link>
          </Box>
        </Popover>
      </Hidden>
    </>
  );
};
