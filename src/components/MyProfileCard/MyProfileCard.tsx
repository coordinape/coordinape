import React from 'react';

import {
  Button,
  Tooltip,
  Zoom,
  makeStyles,
  withStyles,
} from '@material-ui/core';

import { ReactComponent as AlertCircleSVG } from 'assets/svgs/button/alert-circle.svg';
import { ReactComponent as EditProfileSVG } from 'assets/svgs/button/edit-profile.svg';
import { ApeAvatar } from 'components';
import { useMe } from 'hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: 270,
    height: 360,
    margin: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    display: 'inline-block',
    alignItems: 'center',
    background: '#DFE7E8',
    borderRadius: 10.75,
    wordBreak: 'break-all',
    textAlign: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    margin: 'auto',
    border: `1.34426px solid ${theme.colors.border}`,
  },
  uploadImageContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    margin: 'auto',
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
    '&:after': {
      content: `" "`,
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      borderRadius: '50%',
      background: 'rgba(0,0,0,0.6)',
      opacity: 0.7,
      transition: 'all 0.5s',
      '-webkit-transition': 'all 0.5s',
    },
    '&:hover': {
      '&:after': {
        opacity: 1,
      },
      '& .upload-image-icon': {
        background: 'rgba(81, 99, 105, 0.9)',
      },
    },
  },
  uploadImageIconWrapper: {
    position: 'absolute',
    left: 'calc(50% - 11px)',
    top: 'calc(50% - 11px)',
    width: 22,
    height: 22,
    borderRadius: 11,
    background: 'none',
    cursor: 'pointer',
    zIndex: 2,
  },
  name: {
    height: 29,
    marginTop: 0,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.text,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  bioContainer: {
    height: 80,
    marginTop: theme.spacing(0.5),
    marginBottom: 0,
  },
  bio: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(81, 99, 105, 0.5)',
    overflow: 'hidden',
    display: '-webkit-box',
    wordBreak: 'break-word',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
  },
  nameInput: {
    width: '100%',
    marginTop: 0,
    marginBottom: 0,
    fontSize: 24,
    fontWeight: 600,
    color: theme.colors.text,
    background: 'none',
    border: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textDecorationLine: 'underline',
    textAlign: 'center',
    '&::placeholder': {
      opacity: 0.3,
    },
  },
  bioTextareaContainer: {
    height: 110,
    marginTop: 6,
    padding: 11,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: 'rgba(81, 99, 105, 0.2)',
    borderRadius: 8,
  },
  bioTextarea: {
    width: '100%',
    height: '100%',
    padding: 0,
    resize: 'none',
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.text,
    background: 'none',
    border: 0,
    borderRadius: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-word',
    '&::placeholder': {
      opacity: 0.3,
      textAlign: 'center',
    },
  },
  bioLengthLabel: {
    marginTop: 6,
    marginBottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.2)',
  },
  optContainer: {
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
  },
  radioInput: {
    height: 18,
    width: 18,
    padding: 0,
  },
  radioLabel: {
    margin: `${theme.spacing(0.5)}px 0`,
    paddingLeft: theme.spacing(1),
    fontSize: 14,
    color: 'rgba(81, 99, 105, 0.5)',
    '&:hover': {
      color: 'rgba(81, 99, 105, 0.85)',
    },
    '&:checked': {
      color: theme.colors.text,
    },
  },
  alertContainer: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  alertLabel: {
    margin: `${theme.spacing(0.5)}px 0`,
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(81, 99, 105, 0.3)',
    textDecoration: 'underline',
  },
  buttonLabel: {
    paddingTop: 2,
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(81, 99, 105, 0.5)',
    '&:hover': {
      background: 'none',
    },
  },
  editButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(81, 99, 105, 0.5)',
    textTransform: 'none',
    '&:hover': {
      background: 'none',
      textDecoration: 'underline',
    },
  },
  saveButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    marginBottom: theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'none',
    color: 'rgba(81, 99, 105, 0.5)',
    '&:hover': {
      background: 'none',
      color: theme.colors.text,
    },
    '&:disabled': {
      color: 'rgba(81, 99, 105, 0.5)',
      opacity: 0.3,
    },
  },
}));

const TextOnlyTooltip = withStyles({
  tooltip: {
    margin: 'auto',
    padding: `4px 8px`,
    maxWidth: 240,
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(81, 99, 105, 0.5)',
    background: '#C3CDCF',
  },
})(Tooltip);

// TODO: merge into Teammate card
// This is currently unused, but could be useful for updating the Teammate card.
// so not deleting.
export const MyProfileCard = () => {
  const classes = useStyles();

  const { selectedCircle: circle, selectedMyUser: me, avatarPath } = useMe();

  if (!me) {
    return <></>;
  }

  return (
    <div className={classes.root}>
      <ApeAvatar path={avatarPath} className={classes.avatar} />
      <p className={classes.name}>{me.name}</p>
      <div className={classes.bioContainer}>
        <p className={classes.bio}>{me.bio}</p>
      </div>
      {me.non_receiver !== 0 && (
        <div className={classes.alertContainer}>
          <TextOnlyTooltip
            TransitionComponent={Zoom}
            placement="top-start"
            title={`You opted out of receiving ${circle?.tokenName}. You are paid through other channels or are not currently active.`}
          >
            <AlertCircleSVG />
          </TextOnlyTooltip>
          <p className={classes.alertLabel}>
            You opted out of receiving {circle?.tokenName}
          </p>
        </div>
      )}
      <Button className={classes.editButton} disableRipple={true}>
        <EditProfileSVG />
        <div className={classes.buttonLabel}>Edit My Profile</div>
      </Button>
    </div>
  );
};
