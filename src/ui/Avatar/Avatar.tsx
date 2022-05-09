import React from 'react';

import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { styled } from '../../stitches.config';
import { getAvatarPath, getInitialFromName } from 'utils/domain';

const AvatarRoot = styled(AvatarPrimitive.Root, {
  margin: '$sm',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  borderRadius: '100%',
  backgroundColor: '$black',
  cursor: 'pointer',
  transition: 'border-color .3s ease',
  border: `1px solid $border`,
  '&:hover': {
    border: '1px solid $red',
  },
  variants: {
    size: {
      small: {
        width: '$xl',
        height: '$xl',
      },
      large: {
        width: 60,
        height: 60,
      },
    },
  },
  defaultVariants: {
    size: 'large',
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
  backgroundColor: '$lightBorder',
  lineHeight: 1,
  fontSize: '$6',
  fontWeight: '$medium',
  cursor: 'pointer',
});

export const Avatar = ({
  path,
  name,
  onClick,
  small,
  ...props
}: {
  path?: string;
  /** User's name is used as a fallback in case of failing to load avatar. */
  name?: string;
  onClick?: () => void;
  /** represents avatar with smaller size `32x32` */
  small?: boolean;
  children?: React.ReactNode;
}) => {
  const avatarPath = getAvatarPath(path);

  return (
    <AvatarRoot
      onClick={() => onClick?.()}
      size={small ? 'small' : 'large'}
      {...props}
    >
      <AvatarImage src={avatarPath} alt={name} />
      <AvatarFallback>{name && getInitialFromName(name)}</AvatarFallback>
    </AvatarRoot>
  );
};
