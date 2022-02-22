import React from 'react';

import { Avatar, AvatarProps } from '@material-ui/core';

import { getAvatarPathWithFallback } from 'utils/domain';

export const NewApeAvatar = ({
  userImagePath,
  path,
  name,
  children,
  profileImagePath,
  ...props
}: AvatarProps & {
  userImagePath?: string;
  name?: string;
  path?: string;
  profileImagePath?: string;
}) => {
  // TODO: simplify so all: <ApeAvatar path={getAvatarPath(p?.avatar)} />
  const avatarPath = getAvatarPathWithFallback(
    profileImagePath || userImagePath,
    name
  );
  const src = path ?? avatarPath;
  return (
    <Avatar src={src} alt={name} {...props}>
      {children ? (
        children
      ) : (
        <img alt={name} src={src} width="100%" height="100%" />
      )}
    </Avatar>
  );
};
