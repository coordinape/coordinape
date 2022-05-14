import React from 'react';

import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { styled } from '../../stitches.config';
import { getAvatarPath, getInitialFromName } from 'utils/domain';

const AvatarRoot = styled(AvatarPrimitive.Root, {
  width: 60,
  height: 60,
  margin: '$sm',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  borderRadius: '100%',
  backgroundColor: '$surface',
  cursor: 'pointer',
  transition: 'border-color .3s ease',
  border: `1px solid $border`,
  '&:hover': {
    border: '1px solid $alert',
  },
  variants: {
    size: {
      large: {
        width: '$3xl',
        height: '$3xl',
      },
      small: {
        width: '$2xl',
        height: '$2xl',
      },
    },
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
  color: '$black',
  backgroundColor: '$surface',
  lineHeight: 1,
  fontSize: '$large',
  fontWeight: '$medium',
  cursor: 'pointer',
});

export const Avatar = ({
  path,
  name,
  onClick,
  orgLogo,
  ...props
}: {
  path?: string;
  /** User's name is used as a fallback in case of failing to load avatar. */
  name?: string;
  onClick?: () => void;
  orgLogo?: boolean;
  children?: React.ReactNode;
}) => {
  let avatarPath = undefined;
  if (orgLogo) {
    avatarPath = path;
  } else {
    avatarPath = getAvatarPath(path);
  }

  return (
    <AvatarRoot
      onClick={() => onClick?.()}
      {...props}
      size={orgLogo ? 'small' : 'large'}
    >
      <AvatarImage src={avatarPath} alt={name} />
      <AvatarFallback>{name && getInitialFromName(name)}</AvatarFallback>
    </AvatarRoot>
  );
};
