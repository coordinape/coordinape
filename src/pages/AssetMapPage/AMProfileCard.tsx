import React from 'react';

import { makeStyles } from '@material-ui/core';

import { ApeAvatar, ProfileSocialIcons } from 'components';

import { IFilledProfile, IUser } from 'types';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 120,
    height: 120,
  },
  selectMessage: {},
  socialContainer: {},
  skillContainer: {},
  skillItem: {},
  bioContainer: {},
}));

const AMProfileCard = ({
  profile,
  user,
  expanded,
}: {
  profile: IFilledProfile;
  user: IUser;
  expanded: boolean;
}) => {
  const classes = useStyles();

  if (profile === undefined || user === undefined) {
    return (
      <div className={classes.root}>
        <h2 className={classes.selectMessage}>Select a user.</h2>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <ApeAvatar user={user} className={classes.avatar} />
      {profile?.skills && profile.skills.length > 0 && (
        <div className={classes.skillContainer}>
          {profile.skills.slice(0, 3).map((skill) => (
            <div key={skill} className={classes.skillItem}>
              {skill}
            </div>
          ))}
        </div>
      )}
      {profile && (
        <ProfileSocialIcons
          profile={profile}
          className={classes.socialContainer}
        />
      )}
      <div className={classes.bioContainer}>
        {profile?.bio !== undefined ? <p>{profile?.bio}</p> : undefined}
        {user?.bio !== undefined ? (
          <>
            <h5>This Epoch</h5>
            <p>{user.bio}</p>
          </>
        ) : undefined}
      </div>
    </div>
  );
};

export default AMProfileCard;
