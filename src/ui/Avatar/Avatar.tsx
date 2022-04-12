import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { styled } from '../../stitches.config';
import { getAvatarPathWithFallback } from 'utils/domain';

import { IUser, IProfile } from 'types';

const AvatarRoot = styled(AvatarPrimitive.Root, {
  width: 32,
  height: 32,
  margin: '$sm',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  borderRadius: '100%',
  backgroundColor: 'Black',
  cursor: 'pointer',
  transition: 'border-color .3s ease',
  border: `1px solid $border`,
  '&:hover': {
    border: '1px solid $red',
  },
});

const AvatarImage = styled(AvatarPrimitive.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
});

const AvatarFallback = styled(AvatarPrimitive.Fallback, {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'white',
  lineHeight: 1,
  fontWeight: 400,
  cursor: 'pointer',
});

export const Avatar = ({
  user,
  path,
  profile,
  onClick,
}: {
  user?: IUser;
  path?: string;
  profile?: IProfile;
  onClick?: () => void;
}) => {
  const avatarPath = getAvatarPathWithFallback(
    profile?.avatar || user?.profile?.avatar,
    user?.name
  );
  const src = path ?? avatarPath;

  return (
    <AvatarRoot onClick={() => onClick?.()}>
      <AvatarImage src={src} alt={user?.name} />
      <AvatarFallback>avatarPath</AvatarFallback>
    </AvatarRoot>
  );
};
