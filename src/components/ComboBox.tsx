import { CSS } from '@stitches/react';
import { Command } from 'cmdk';

import { styled } from '../stitches.config';
import { Box } from '../ui';

export const ComboBox = ({
  children,
  fullScreen = false,
  css,
  ...props
}: {
  children: React.ReactNode;
  fullScreen?: boolean;
  css?: CSS;
} & React.ComponentProps<typeof Command>) => {
  const Container = styled(Box, {
    '[cmdk-root]': {
      width: '100%',
      maxWidth: '660px',
      background: '$surface',
      overflow: 'hidden',
      padding: '0',
      zIndex: 299,
      border: '1px solid',
      ...(fullScreen
        ? {
            borderColor: 'transparent',
            // boxShadow: '$heavy',
            borderRadius: 0,
          }
        : { borderColor: '$borderFocus', borderRadius: '$3' }),
    },
    '[cmdk-input]': {
      borderRadius: 0,
      width: '100%',
      background: '$formInputBackground',

      minWidth: '300px',
      fontWeight: '$normal',
      lineHeight: '$base',
      outline: 'none',
      color: '$text',
      caretColor: '$cta',
      margin: '0',
      ...(fullScreen
        ? {
            p: '$md',
            borderBottom: '1px solid $borderDim',
            fontSize: '$h2',
          }
        : { p: 'calc($sm - 1px) $sm', fontSize: '$medium' }),

      '&::placeholder': {
        color: '$formInputPlaceholder',
      },
    },

    '[cmdk-item]': {
      contentVisibility: 'auto',
      cursor: 'pointer',
      fontSize: '$small',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '0 16px',
      color: 'var(--gray12)',
      userSelect: 'none',
      willChange: 'background, color',
      transition: 'all 150ms ease',
      transitionProperty: 'none',
      position: 'relative',
      ...(fullScreen
        ? {
            height: '$xl',
          }
        : { height: '$1xl' }),

      '&::placeholder': {
        color: '$formInputPlaceholder',
      },

      '&[data-selected="true"]': {
        background: '$surfaceNested',
        borderRadius: '$2',
        svg: {
          color: '$text',
        },
      },

      '&[data-disabled="true"]': {
        color: '$surface',
        cursor: 'not-allowed',
      },

      '&:active': {
        transitionProperty: 'background',
        background: '$surface',
      },

      '& + [cmdk-item]': {
        marginTop: '4px',
      },

      svg: {
        width: '16px',
        height: '16px',
        color: '$text',
      },
    },

    '[cmdk-list]': {
      overflow: 'auto',
      overscrollBehavior: 'contain',
      transition: '100ms ease',
      transitionProperty: 'height',
      ...(fullScreen
        ? {
            height: '100%',
            minHeight: '200px',
            maxHeight: '400px',
            p: '$sm $sm $lg',
            '@media screen and (max-height: 650px)': {
              maxHeight: `calc(100vh - ($4xl * 3))`,
            },
          }
        : {
            height: '100%',
            maxHeight: '200px',
          }),
    },

    '[cmdk-group-heading]': {
      userSelect: 'none',
      fontSize: '12px',
      color: '$text',
      display: 'flex',
      alignItems: 'center',
      fontWeight: '$semibold',
      ...(fullScreen
        ? {
            padding: '$sm $md $sm $md',
          }
        : {
            padding: '$sm $md',
          }),
    },

    '[cmdk-empty]': {
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '64px',
      whiteSpace: 'pre-wrap',
      color: '$text',
    },
  });

  return (
    <Container css={{ ...css }}>
      <Command {...props}>{children}</Command>
    </Container>
  );
};
