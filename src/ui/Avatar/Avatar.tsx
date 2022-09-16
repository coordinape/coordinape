import React from 'react';

import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { styled, CSS } from '../../stitches.config';
import {
  getAvatarPathWithoutPlaceholder,
  getInitialFromName,
} from 'utils/domain';

const AvatarRoot = styled(AvatarPrimitive.Root, {
  display: 'inline-flex',
  flexShrink: '0',
  alignItems: 'center',
  justifyContent: 'center',
  verticalAlign: 'middle',
  overflow: 'hidden',
  userSelect: 'none',
  borderRadius: '100%',
  backgroundColor: '$surface',
  position: 'relative',
  zIndex: 1,
  variants: {
    size: {
      xs: {
        width: '$lg !important',
        height: '$lg',
        '> span': {
          fontSize: '$medium',
        },
      },
      small: {
        width: '$xl !important',
        height: '$xl',
        '> span': {
          fontSize: '$medium',
        },
      },
      medium: {
        width: '$1xl !important',
        height: '$1xl',
        '> span': {
          fontSize: '$medium',
        },
      },
      large: {
        width: '$2xl !important',
        height: '$2xl',
        '> span': {
          fontSize: '$medium',
        },
      },
      xl: {
        width: '$4xl !important',
        height: '$4xl',
        '> span': {
          fontSize: '$medium',
        },
      },
    },
    margin: {
      none: {
        margin: '0',
      },
      small: {
        margin: '$sm',
      },
    },
  },
  defaultVariants: {
    size: 'large',
    margin: 'small',
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
      xs: {
        fontSize: '$small',
      },
      small: {
        fontSize: '$medium',
      },
      medium: {
        fontSize: '$medium',
      },
      large: {
        fontSize: '$large',
      },
      xl: {
        fontSize: '$large',
      },
    },
  },
});

export const Avatar = ({
  path,
  name,
  onClick,
  size,
  margin,
  css,
  ...props
}: {
  path?: string;
  /** User's name is used as a fallback in case of failing to load avatar. */
  name?: string;
  onClick?: () => void;
  /** represents avatar with smaller size `32x32` */
  size?: 'xl' | 'large' | 'medium' | 'small' | 'xs';
  margin?: 'none' | 'small'; // can be extended if needed
  children?: React.ReactNode;
  css?: CSS;
}) => {
  const avatarPath = getAvatarPathWithoutPlaceholder(path);

  return (
    <AvatarRoot
      onClick={() => onClick?.()}
      size={size}
      margin={margin}
      {...(css ? { css } : {})}
      {...props}
    >
      {avatarPath && <AvatarImage src={avatarPath} alt={name} />}
      <AvatarFallback size={size}>
        {name && getInitialFromName(name)}
      </AvatarFallback>
    </AvatarRoot>
  );
};
