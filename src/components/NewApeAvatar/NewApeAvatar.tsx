/**
 *
 * DEPRECATED -- please use src/ui/Avatar instead.
 *
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
    <Avatar src={src} alt={name} {...props}>
      {children || <img alt={name} src={src} width="100%" height="100%" />}
    </Avatar>
  );
};
