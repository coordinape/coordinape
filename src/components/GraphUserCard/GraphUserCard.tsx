import React from 'react';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core';

import { ApeAvatar, ProfileSocialIcons } from 'components';

import { IUser } from 'types';

const useStyles = makeStyles((theme) => ({
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
  socialContainer: {},
  skillContainer: {},
  skillItem: {},
  bioContainer: {},
}));

export const GraphUserCard = ({
  className,
  user,
}: {
  className?: string;
  user: IUser;
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, className)}>
      <ApeAvatar user={user} className={classes.avatar} />
      {user?.profile?.skills && user.profile.skills.length > 0 && (
        <div className={classes.skillContainer}>
          {user.profile.skills.slice(0, 3).map((skill) => (
            <div key={skill} className={classes.skillItem}>
              {skill}
            </div>
          ))}
        </div>
      )}
      {user.profile && (
        <ProfileSocialIcons
          profile={user.profile}
          className={classes.socialContainer}
        />
      )}
      <div className={classes.bioContainer}>
        {user.profile?.bio !== undefined ? (
          <p>{user.profile?.bio}</p>
        ) : undefined}
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
