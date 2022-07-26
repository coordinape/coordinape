import React from 'react';

import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { styled } from '../../stitches.config';
import {
  getAvatarPathWithoutPlaceholder,
  getInitialFromName,
} from 'utils/domain';

const AvatarRoot = styled(AvatarPrimitive.Root, {
  margin: '$sm',
  display: 'inline-flex',
  flexShrink: '0',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  borderRadius: '100%',
  backgroundColor: '$surface',
  variants: {
    size: {
      small: {
        width: '$xl !important',
        height: '$xl',
        '> span': {
          fontSize: '$medium',
        },
      },
      large: {
        width: '$xl',
        height: '$xl',
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
  color: '$text',
  backgroundColor: '$border',
  lineHeight: 1,
  fontWeight: '$medium',
  variants: {
    size: {
      small: {
        fontSize: '$medium',
      },
      large: {
        fontSize: '$large',
      },
    },
  },
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
  const avatarPath = getAvatarPathWithoutPlaceholder(path);

  return (
    <AvatarRoot
      onClick={() => onClick?.()}
      size={small ? 'small' : 'large'}
      {...props}
    >
      {avatarPath && <AvatarImage src={avatarPath} alt={name} />}
      <AvatarFallback size={small ? 'small' : 'large'}>
        {name && getInitialFromName(name)}
      </AvatarFallback>
    </AvatarRoot>
  );
};
