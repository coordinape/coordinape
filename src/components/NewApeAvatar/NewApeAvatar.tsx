/**
 * Intended to replace ApeAvatar. Work in progress.
 */

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
  const src = getAvatarPathWithFallback(
    path || profileImagePath || userImagePath,
    name
  );
  return (
    <Avatar src={src} alt={name} {...props} data-testid="avatar">
      {children}
    </Avatar>
  );
};
