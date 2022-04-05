import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { styled } from '../../stitches.config';
import { getAvatarPathWithFallback } from 'utils/domain';

import { IUser, IProfile } from 'types';

const AvatarRoot = styled(AvatarPrimitive.Root, {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  width: 45,
  height: 45,
  borderRadius: '100%',
  backgroundColor: 'Black',
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
  color: 'Violet',
  fontSize: 15,
  lineHeight: 1,
  fontWeight: 500,
});

export const Avatar = ({
  user,
  path,
  profile,
}: {
  user?: IUser;
  path?: string;
  profile?: IProfile;
}) => {
  const avatarPath = getAvatarPathWithFallback(
    profile?.avatar || user?.profile?.avatar,
    user?.name
  );
  const src = path ?? avatarPath;

  return (
    <AvatarRoot>
      <AvatarImage src={src} alt={user?.name} />
      <AvatarFallback>avatarPath</AvatarFallback>
    </AvatarRoot>
  );
};
