import React from 'react';

import { Avatar, AvatarProps } from '@material-ui/core';

import { getAvatarPath, AVATAR_PLACEHOLDER } from 'utils/domain';

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
  const placeholder = user?.name
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? '')}`
    : AVATAR_PLACEHOLDER;
  const src = p?.avatar ? getAvatarPath(p?.avatar) : path ?? placeholder;
  return (
    <Avatar src={src} alt={user?.name} {...props}>
      {children ? (
        children
      ) : (
        <img alt={user?.name} src={placeholder} width="100%" height="100%" />
      )}
    </Avatar>
  );
};
