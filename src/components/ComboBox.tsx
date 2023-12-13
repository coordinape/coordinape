import { CSS } from '@stitches/react';
import { Command } from 'cmdk';

import { styled } from '../stitches.config';
import { Box } from '../ui';

export const ComboBox = ({
  children,
  css,
  ...props
}: { children: React.ReactNode; css?: CSS } & React.ComponentProps<
  typeof Command
>) => {
  const Container = styled(Box, {
    '[cmdk-root]': {
      maxWidth: '640px',
      width: '100%',
      background: '$surface',
      borderRadius: '$3',
      overflow: 'hidden',
      padding: '0',
      zIndex: 299,
      border: '1px solid $borderFocus',
    },
    '[cmdk-input]': {
      borderRadius: 0,
      width: '100%',
      background: '$formInputBackground',
      padding: 'calc($sm - 1px) $sm',
      minWidth: '300px',
      fontWeight: '$normal',
      fontSize: '$medium',
      lineHeight: '$base',
      outline: 'none',
      color: '$text',
      caretColor: '$cta',
      margin: '0',

      '&::placeholder': {
        color: '$formInputPlaceholder',
      },
    },

    '[cmdk-item]': {
      contentVisibility: 'auto',
      cursor: 'pointer',
      height: '$1xl',
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

      '&[data-selected="true"]': {
        background: '$surfaceNested',
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
      height: 'min(300px, var(--cmdk-list-height))',
      maxHeight: '200px',
      overflow: 'auto',
      overscrollBehavior: 'contain',
      transition: '100ms ease',
      transitionProperty: 'height',
    },

    '[cmdk-group-heading]': {
      userSelect: 'none',
      fontSize: '12px',
      color: '$text',
      padding: '$sm $md',
      display: 'flex',
      alignItems: 'center',
      fontWeight: '$semibold',
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
