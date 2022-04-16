import React from 'react';

import { Avatar, AvatarProps } from '@material-ui/core';

import { getAvatarPathWithFallback } from 'utils/domain';

type HasAvatar = { avatar?: string };

export const ApeAvatar = ({
  user,
  path,
  children,
  profile,
  ...props
}: AvatarProps & {
  user?: HasAvatar & { name: string; profile?: HasAvatar };
  path?: string;
  profile?: HasAvatar;
}) => {
  // TODO: simplify so all: <ApeAvatar path={getAvatarPath(p?.avatar)} />
  const avatarPath = getAvatarPathWithFallback(
    profile?.avatar || user?.profile?.avatar,
    user?.name
  );
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
