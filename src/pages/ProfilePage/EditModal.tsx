import React from 'react';

import clsx from 'clsx';
import { transparentize } from 'polished';

import {
  makeStyles,
  Box,
  Button,
  Dialog,
  Grid,
  Typography,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';

import { ApeAvatar } from 'components';
import { SKILLS } from 'config/constants';
import { useCircle } from 'hooks';

import { IApiUser } from 'types';

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef<unknown, TransitionProps>(
  (props: any, ref) => <Slide direction="up" ref={ref} {...props} />
);

const useStyles = makeStyles(theme => ({
  modalWrapper: {
    width: '100%',
    maxWidth: 1100,
    textAlign: 'center',
    background: theme.colors.white,
  },
  modalBody: {
    padding: '0px 116px',
    marginBottom: 32,
  },
  modalProfileSection: {
    padding: '12px 0px',
  },
  modalSkillsSection: {
    padding: '12px 0px',
    paddingTop: 65,
  },
  modalBiographySection: {
    padding: '12px 0px',
  },
  modalLinksSection: {
    padding: '12px 0px',
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: transparentize(0.3, theme.colors.text),
    padding: '8px 48px',
    borderBottom: '0.7px solid rgba(24, 24, 24, 0.1)',
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modalSkillsBody: {
    padding: '32px 0px',
  },
  uploadImageContainer: {
    position: 'relative',
    width: 96,
    height: 96,
    margin: 'auto',
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
    marginTop: 16,
    '&:after': {
      content: `" "`,
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      borderRadius: '50%',
      background: transparentize(0.4, theme.colors.black),
      opacity: 0.7,
      transition: 'all 0.5s',
      '-webkit-transition': 'all 0.5s',
    },
    '&:hover': {
      '&:after': {
        opacity: 1,
      },
      '& .upload-image-icon': {
        background: transparentize(0.1, theme.colors.text),
      },
    },
  },
  uploadImageIconWrapper: {
    position: 'absolute',
    marginTop: theme.spacing(1),
    left: 'calc(1% - 40px)',
    width: 178,
    height: 40,
    borderRadius: 8,
    background: transparentize(0.3, theme.colors.text),
    cursor: 'pointer',
    zIndex: 2,
  },
  editAvatar: {
    width: 96,
    height: 96,
    border: '4px solid #FFFFFF',
    borderRadius: '50%',
  },
  skillOption: {
    color: theme.colors.white,
    background: transparentize(0.67, theme.colors.text),
    borderRadius: 4,
    padding: '5px 16px',
    marginBottom: 8,
    marginRight: 8,
    textTransform: 'none',
    boxShadow: 'none',
    '&:hover': {
      background: theme.colors.mediumGray,
      boxShadow: 'none',
    },
    '&.selected': {
      background: theme.colors.lightBlue,
    },
  },
  bioTextarea: {
    height: 143,
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
    minHeight: 143,
    margin: theme.spacing(2, 0, 8),
    padding: theme.spacing(1.5, 2),
    resize: 'vertical',
    fontSize: 15,
    fontWeight: 300,
    color: theme.colors.text,
    border: 0,
    outline: 'none',
    background: theme.colors.lightBackground,
    borderRadius: 8,
    wordBreak: 'break-word',
    '&::placeholder': {
      color: theme.colors.placeholder,
    },
  },
  saveButton: {
    background: theme.colors.red,
    boxShadow: '0px 4px 6px rgba(181, 193, 199, 0.12)',
    borderRadius: 8,
    color: theme.colors.white,
    padding: '8px 16px',
    textTransform: 'none',
    marginTop: 48,
  },
  linksText: {
    padding: theme.spacing(1.5, 2),
    width: '100%',
    maxWidth: theme.breakpoints.values.md,
    resize: 'none',
    fontFamily: 'Space Grotesk', // FIXME should set this for all textfields
    fontSize: 15,
    fontWeight: 300,
    color: theme.colors.text,
    border: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    background: theme.colors.lightBackground,
    borderRadius: 8,
    wordBreak: 'break-word',
    textAlign: 'center',
    alignItems: 'center',
    '&::placeholder': {
      color: '#99A2A5',
    },
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    paddingBottom: 16,
  },
}));

export interface IProfileData {
  avatar: string;
  avatarRaw: File | null;
  background: string;
  backgroundRaw: File | null;
  name: string;
  bio: string;
  telegram_username: string;
  twitter_username: string;
  discord_username: string;
  medium_username: string;
  github_username: string;
  website: string;
  skills: string[];
  users: IApiUser[];
}

type Props = {
  close: () => void;
  save: () => void;
  data: IProfileData;
  setData: (data: IProfileData) => void;
  isOpen: boolean;
};
const EditModal = ({ isOpen, close, save, data, setData }: Props) => {
  const classes = useStyles();

  const { selectedCircle } = useCircle();

  const onChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      setData({
        ...data,
        avatar: URL.createObjectURL(e.target.files[0]),
        avatarRaw: e.target.files[0],
      });
    }
  };

  const onChangeBio = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setData({ ...data, bio: e.target.value });

  const fieldSetter =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setData({ ...data, [name]: e.target.value });

  const selectSkills = (skill: string) => {
    let skills: string[] = [];
    data.skills.forEach(a => skills.push(a));
    if (skills.includes(skill)) skills = skills.filter(item => item !== skill);
    else skills.push(skill);
    const obj = { ...data, skills: [...skills] };
    setData(obj);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      TransitionComponent={Transition}
      classes={{ paper: classes.modalWrapper }}
    >
      <Box
        style={{
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <h2>Edit Profile</h2>
        <IconButton
          onClick={close}
          aria-label="close"
          style={{
            color: 'rgba(81, 99, 105, 0.35)',
            right: 20,
            position: 'absolute',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box className={classes.modalBody}>
        <Box className={classes.modalProfileSection}>
          <Typography className={classes.modalSubTitle}>
            Profile Image
          </Typography>
          <div className={classes.uploadImageContainer}>
            <label htmlFor="upload-avatar-button">
              <ApeAvatar path={data?.avatar} className={classes.editAvatar} />
              <div
                className={clsx(
                  classes.uploadImageIconWrapper,
                  'upload-image-icon'
                )}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CloudUploadIcon style={{ color: '#FFFFFF' }} />
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#FFFFFF',
                      paddingLeft: 8,
                    }}
                  >
                    Upload Profile Image
                  </p>
                </div>
              </div>
            </label>
            <input
              id="upload-avatar-button"
              onChange={onChangeAvatar}
              style={{ display: 'none' }}
              type="file"
              accept="image/gif, image/jpeg, image/png"
            />
          </div>
        </Box>
        <Box className={classes.modalSkillsSection}>
          <Box className={classes.modalSubTitle}>Select Your Skills</Box>
          <Box className={classes.modalSkillsBody}>
            {SKILLS.map(item => (
              <Button
                key={item.name}
                variant="contained"
                className={clsx(
                  classes.skillOption,
                  data.skills.includes(item.name) ? 'selected' : ''
                )}
                onClick={() => selectSkills(item.name)}
              >
                {item.name}
              </Button>
            ))}
          </Box>
        </Box>
        <Box className={classes.modalBiographySection}>
          <Typography className={classes.modalSubTitle}>Biography</Typography>
          <textarea
            className={classes.bioTextarea}
            onChange={onChangeBio}
            value={data.bio}
            placeholder={`Tell us about yourself and why you are a member of the ${selectedCircle?.name} Circle...`}
          />
        </Box>
        <Box className={classes.modalLinksSection}>
          <Typography
            className={classes.modalSubTitle}
            style={{ marginBottom: 32 }}
          >
            Links
          </Typography>
          <Grid container spacing={4}>
            <Grid item sm={3} xs={12}>
              <Typography className={classes.linkTitle}>Twitter</Typography>
              <input
                className={classes.linksText}
                onChange={fieldSetter('twitter_username')}
                value={data.twitter_username}
                placeholder="Enter username"
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <Typography className={classes.linkTitle}>Github</Typography>
              <input
                className={classes.linksText}
                onChange={fieldSetter('github_username')}
                value={data.github_username}
                placeholder="Enter username"
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <Typography className={classes.linkTitle}>Telegram</Typography>
              <input
                className={classes.linksText}
                onChange={fieldSetter('telegram_username')}
                value={data.telegram_username}
                placeholder="Enter username"
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <Typography className={classes.linkTitle}>Discord</Typography>
              <input
                className={classes.linksText}
                onChange={fieldSetter('discord_username')}
                value={data.discord_username}
                placeholder="Username#xxxx"
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <Typography className={classes.linkTitle}>Medium</Typography>
              <input
                className={classes.linksText}
                onChange={fieldSetter('medium_username')}
                value={data.medium_username}
                placeholder="Enter username"
              />
            </Grid>
            <Grid item sm={3} xs={12}>
              <Typography className={classes.linkTitle}>Website</Typography>
              <input
                className={classes.linksText}
                onChange={fieldSetter('website')}
                value={data.website}
                placeholder="Enter link"
              />
            </Grid>
          </Grid>
        </Box>
        <Button
          variant="contained"
          color="default"
          className={classes.saveButton}
          startIcon={<SaveOutlinedIcon />}
          onClick={save}
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditModal;
