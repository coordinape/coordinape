import React from 'react';

import clsx from 'clsx';

import { Popover, makeStyles, Hidden } from '@material-ui/core';

import { ApeAvatar, MenuNavigationLinks } from 'components';
import { useMyProfile } from 'recoilState/app';
import { Link } from 'ui';

const useStyles = makeStyles(theme => ({
  avatarButton: {
    marginLeft: theme.spacing(1.5),
    height: '50px',
    width: '50px',
    cursor: 'pointer',
    border: '3px solid #828F93',
    transition: 'border-color .3s ease',
    '&.selected': {
      border: '3px solid rgba(239, 115, 118, 1)',
    },
    '&:hover': {
      border: '3px solid rgba(239, 115, 118, 1)',
    },
  },
  popover: {
    width: 237,
    marginTop: theme.spacing(0.5),
    padding: theme.spacing(2, 0, 0),
    borderRadius: 8,
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(223, 237, 234, 0.4) 40.1%), linear-gradient(180deg, rgba(237, 253, 254, 0.4) 0%, rgba(207, 231, 233, 0) 100%), #FFFFFF',
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.16)',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const MyAvatarMenu = () => {
  const classes = useStyles();
  const myProfile = useMyProfile();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <ApeAvatar
        profile={myProfile}
        onClick={event => setAnchorEl(event.currentTarget)}
        className={
          !anchorEl
            ? classes.avatarButton
            : clsx(classes.avatarButton, 'selected')
        }
      />
      <Hidden smDown>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          classes={{ paper: classes.popover }}
          id="my-avatar-popover"
          onClose={() => setAnchorEl(null)}
          open={open}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuNavigationLinks />
          <Link
            css={{
              backgroundColor: '$darkTeal',
              color: 'white',
              padding: '12px 40px',
              mt: '12px',
              '&:hover': { opacity: 0.8 },
            }}
            href="https://notionforms.io/forms/give-us-your-feedback-improve-coordinape"
            target="_blank"
          >
            Give Feedback
          </Link>
        </Popover>
      </Hidden>
    </>
  );
};
