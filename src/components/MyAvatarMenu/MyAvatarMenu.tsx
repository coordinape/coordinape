import React, { Suspense } from 'react';

import clsx from 'clsx';
import { useRecoilValueLoadable } from 'recoil';

import {
  Popover,
  makeStyles,
  Divider,
  Hidden,
  Button,
} from '@material-ui/core';

import {
  CirclesHeaderSection,
  ApeAvatar,
  MenuNavigationLinks,
} from 'components';
import { useSelectedCircle } from 'recoilState';
import { useMyProfile, rSelectedCircle } from 'recoilState/app';
import { useSetCircleSelectorOpen } from 'recoilState/ui';

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
  divider: {
    alignSelf: 'stretch',
    background: theme.colors.text,
    opacity: 0.25,
    margin: theme.spacing(2, 1),
  },
  subHeader: {
    margin: theme.spacing(0.5, 0, 0.5, 5),
    fontSize: 13,
    lineHeight: 1.5,
    fontWeight: 600,
    [theme.breakpoints.down('sm')]: {
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '30px',
      color: theme.colors.text,
      margin: 0,
    },
  },
  link: {
    position: 'relative',
    margin: theme.spacing(0, 0, 0, 5),
    padding: 0,
    textAlign: 'left',
    fontSize: 18,
    lineHeight: 1.6,
    color: theme.colors.text,
    fontWeight: 300,
    textDecoration: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: theme.typography.fontFamily,
    '&:hover': {
      color: theme.colors.black,
    },
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      padding: '6px 0',
      fontSize: 20,
      color: theme.colors.text,
      fontWeight: 'normal',
    },
  },
  selectedLink: {
    '&::before': {
      content: '" "',
      position: 'absolute',
      top: '11px',
      left: '-16px',
      width: '8px',
      height: '8px',
      backgroundColor: theme.colors.red,
      borderRadius: '50%',
    },
  },
  feedbackButton: {
    backgroundColor: '#2a849b',
    margin: theme.spacing(1.5, 0, 0),
    padding: theme.spacing(1.5, 0, 1.5, 5),
    borderRadius: 0,
    justifyContent: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    opacity: 1.0,
    '&:hover': {
      background: '#2a8499',
      opacity: 0.9,
    },
  },
}));

export const MyAvatarMenu = () => {
  const classes = useStyles();
  const myProfile = useMyProfile();

  const { circle: selectedCircle } = useSelectedCircle();

  const { hasAdminView } = myProfile;

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hidePaths = React.useMemo(() => {
    const paths = [];
    /*  rule to hide /team path, if in the future
        there are other rules we can add them
    */
    if (!selectedCircle.team_selection) {
      paths.push('/team');
    }

    return paths;
  }, [selectedCircle]);

  return (
    <>
      <ApeAvatar
        profile={myProfile}
        onClick={handleClick}
        className={
          !anchorEl
            ? classes.avatarButton
            : clsx(classes.avatarButton, 'selected')
        }
      />
      <Hidden smDown>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          classes={{
            paper: classes.popover,
          }}
          id="my-avatar-popover"
          onClose={handleClose}
          open={open}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuNavigationLinks hidePaths={hidePaths} />
          <Divider variant="middle" className={classes.divider} />
          <span className={classes.subHeader}>Switch Circles</span>
          <Suspense fallback={null}>
            <CirclesHeaderSection handleOnClick={() => setAnchorEl(null)} />
          </Suspense>
          {hasAdminView && (
            <>
              <Divider variant="middle" className={classes.divider} />
              <CirclesSelectorSection handleOnClick={() => setAnchorEl(null)} />
            </>
          )}
            <Button
              className={classes.feedbackButton}
              disableElevation
              fullWidth
              variant="contained"
              color="primary"
              href={
                'https://notionforms.io/forms/give-us-your-feedback-improve-coordinape'
              }
              target="_blank"
              onClick={() => {}}
            >
              Give Feedback
            </Button>
        </Popover>
      </Hidden>
    </>
  );
};

export const CirclesSelectorSection = (props: { handleOnClick?(): void }) => {
  const classes = useStyles();

  const setCircleSelectorOpen = useSetCircleSelectorOpen();
  const selectedCircle = useRecoilValueLoadable(rSelectedCircle).valueMaybe();

  const handleOnClick = () => {
    if (props.handleOnClick) {
      props.handleOnClick();
    }
    setCircleSelectorOpen(true);
  };

  return (
    <Suspense fallback={null}>
      <span className={classes.subHeader}>Admin View</span>
      {selectedCircle && selectedCircle.impersonate ? (
        <>
          <button
            className={clsx(classes.link, classes.selectedLink)}
            onClick={props.handleOnClick}
          >
            {selectedCircle.circle.name}
          </button>
          <button className={classes.link} onClick={handleOnClick}>
            Circle Selector
          </button>
        </>
      ) : (
        <button className={classes.link} onClick={handleOnClick}>
          Circle Selector
        </button>
      )}
    </Suspense>
  );
};
