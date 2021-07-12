import React, { FC } from 'react';

import { Avatar, AvatarProps } from '@material-ui/core';

import { getAvatarPath, AVATAR_PLACEHOLDER } from 'utils/domain';

import { IUser } from 'types';

interface IProps extends AvatarProps {
  user?: IUser;
  path?: string;
}

export const ApeAvatar: FC<IProps> = ({ user, path, children, ...props }) => {
  const src = user?.avatar
    ? getAvatarPath(user?.avatar)
    : path ?? AVATAR_PLACEHOLDER;
  return (
    <Avatar src={src} alt={user?.name} {...props}>
      {children ? (
        children
      ) : (
        <img
          alt={user?.name}
          src={AVATAR_PLACEHOLDER}
          width="100%"
          height="100%"
        />
      )}
    </Avatar>
  );
};
