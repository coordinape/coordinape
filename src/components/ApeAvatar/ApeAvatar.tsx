import React from 'react';

import { Avatar, AvatarProps } from '@material-ui/core';

import { getAvatarPathWithFallback } from 'utils/domain';

import { IUser, IProfile } from 'types';

export const ApeAvatar = ({
  user,
  path,
  children,
  profile,
  ...props
}: AvatarProps & {
  user?: IUser;
  path?: string;
  profile?: IProfile;
}) => {
  // TODO: simplify so all: <ApeAvatar path={getAvatarPath(p?.avatar)} />
  const p = profile ?? user?.profile;
  let avatar = p?.avatar;
  if (avatar === '') avatar = user?.profile?.avatar;
  const avatarPath = getAvatarPathWithFallback(avatar, user?.name);
  const src = path ?? avatarPath;
  return (
    <Avatar src={src} alt={user?.name} {...props}>
      {children ? (
        children
      ) : (
        <img alt={user?.name} src={src} width="100%" height="100%" />
      )}
    </Avatar>
  );
};
