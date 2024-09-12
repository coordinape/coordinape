import React from 'react';

import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { CSS, styled } from '../../stitches.config';
import { getAvatarPath, getInitialFromName } from 'utils/domain';

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
      xxs: {
        width: '16px !important',
        height: '16px',
        // font size for governing the cosoul glow/shadow size
        fontSize: '0.3rem',
        '> span': {
          fontSize: '$small',
        },
      },
      xs: {
        width: '$lg !important',
        height: '$lg',
        // font size for governing the cosoul glow/shadow size
        fontSize: '0.4rem',
        '> span': {
          fontSize: '$small',
        },
      },
      small: {
        width: '$xl !important',
        height: '$xl',
        // font size for governing the cosoul glow/shadow size
        fontSize: '0.5rem',
        '> span': {
          fontSize: '$small',
        },
      },
      medium: {
        width: '$1xl !important',
        height: '$1xl',
        // font size for governing the cosoul glow/shadow size
        fontSize: '0.6rem',
        '> span': {
          fontSize: '$medium',
        },
      },
      large: {
        width: '$2xl !important',
        height: '$2xl',
        // font size for governing the cosoul glow/shadow size
        fontSize: '0.7rem',
        '> span': {
          fontSize: '$large',
        },
      },
      xl: {
        width: '$4xl !important',
        height: '$4xl',
        // font size for governing the cosoul glow/shadow size
        fontSize: '1rem',
        '> span': {
          fontSize: '$large',
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
    margin: 'none',
  },
});

const AvatarImage = styled(AvatarPrimitive.Image, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: 'inherit',
  // for some reason our processed images have a black line at the top.  scaling to hide it for now
  transform: 'scale(1.03)',
  aspectRatio: '1 / 1',
});

// WEIRD: using 'span' instead of AvatarPrimitive.Fallback because of a radix component reuse bug
const AvatarFallback = styled('span', {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$avatarFallbackText',
  backgroundColor: '$avatarFallback',
  lineHeight: 1,
  fontWeight: '$medium',
  variants: {
    size: {
      xxs: {
        fontSize: '$small',
      },
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasCoSoul,
  onClick,
  size,
  margin,
  css,
  ...props
}: {
  path?: string;
  /** User's name is used as a fallback in case of failing to load avatar. */
  name?: string;
  hasCoSoul?: boolean;
  onClick?: () => void;
  size?: 'xl' | 'large' | 'medium' | 'small' | 'xs' | 'xxs';
  margin?: 'none' | 'small'; // can be extended if needed
  children?: React.ReactNode;
  css?: CSS;
}) => {
  const avatarPath = getAvatarPath(path);

  return (
    <AvatarRoot
      onClick={() => onClick?.()}
      size={size}
      margin={margin}
      {...props}
      css={{
        ...css,
        // boxShadow: hasCoSoul ? '$coSoulGlow' : 'none',
      }}
    >
      {avatarPath ? (
        <AvatarImage src={avatarPath} alt={name} />
      ) : (
        <AvatarFallback size={size}>
          {name && getInitialFromName(name)}
        </AvatarFallback>
      )}
    </AvatarRoot>
  );
};
