import React from 'react';

import { RouteComponentProps } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';

import { Img } from 'components';
import { useProfile, useMe } from 'hooks';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: theme.breakpoints.values.md,
    margin: 'auto',
  },
}));

// http://app.localhost:3000/profile/0xb9209ed68a702e25e738ca0e550b4a560bf4d9d8
// http://app.localhost:3000/profile/me
export const ProfilePage = ({
  match: { params },
}: RouteComponentProps<{ profileAddress?: string }>) => {
  const classes = useStyles();

  const seemsAddress = params?.profileAddress?.startsWith('0x');
  const isMe = params?.profileAddress === 'me';
  const { profile, updateProfile, avatarPath, backgroundPath } = useProfile(
    seemsAddress ? params?.profileAddress : undefined
  );
  const { myProfile, updateProfile: updateMyProfile } = useMe();

  const updateSomething = () => {
    if (isMe) {
      updateMyProfile({ bio: 'something' });
    } else {
      updateProfile({ bio: 'not allowed' });
    }
  };

  return (
    <div className={classes.root}>
      <div>
        <h2>My Profile</h2>

        <p>{JSON.stringify(myProfile)}</p>
      </div>
      <div>
        <h2>Other Profile</h2>
        <Img
          alt="avatar"
          placeholderImg="/imgs/avatar/placeholder.jpg"
          src={avatarPath}
        />
        <Img
          alt="avatar"
          placeholderImg="/imgs/avatar/placeholder.jpg"
          src={backgroundPath}
        />
        <p>{JSON.stringify(profile)}</p>
      </div>
      <button onClick={updateSomething}>Update?</button>
    </div>
  );
};

export default ProfilePage;
