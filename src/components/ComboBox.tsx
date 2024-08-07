import { CSS } from '@stitches/react';
import { Command } from 'cmdk';

import { styled } from '../stitches.config';
import { Box } from '../ui';

export const ComboBox = ({
  children,
  fullScreen = false,
  giveSkillSelector = false,
  css,
  ...props
}: {
  children: React.ReactNode;
  fullScreen?: boolean;
  giveSkillSelector?: boolean;
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
        : giveSkillSelector
          ? {
              borderColor: '$borderFocus',
              borderRadius: '$3',
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
      ...(giveSkillSelector && {
        m: '$md $md 0',
        background: '$formInputBackground',
        padding: '$sm',
        border: '1px solid $formInputBorder',
        '&:focus': {
          borderColor: '$formInputBorderFocus',
        },
        fontWeight: '$normal',
        fontSize: '$medium',
        lineHeight: '1',
        display: 'flex',
        flexDirection: 'row',
        borderRadius: '$3',
        width: 'calc(100% - $md - $md)',
      }),
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
      padding: '4px 16px',
      color: 'var(--gray12)',
      userSelect: 'none',
      willChange: 'background, color',
      transition: 'all 150ms ease',
      transitionProperty: 'none',
      position: 'relative',
      ...(fullScreen
        ? {
            minHeight: '$xl',
          }
        : { height: '$1xl' }),

      '&::placeholder': {
        color: '$formInputPlaceholder',
      },

      '&[data-selected="true"]': {
        background: '$surfaceNested',
        borderRadius: '$2',
        svg: {
          color: 'currentColor',
        },
        '&[data-disabled="true"]': {
          backgroundColor: '$surface',
          cursor: 'not-allowed',
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
        color: 'currentColor',
      },
      ...(giveSkillSelector && {
        p: 0,
        height: 'auto',
        background: 'transparent !important',
        borderRadius: '0 !important',
        '&.firstToAdd': {
          position: 'absolute',
          bottom: '-$xl',
          width: '100%',
        },
      }),
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
            maxHeight: '600px',
            p: '$sm $sm $lg',
            '@media screen and (max-height: 650px)': {
              maxHeight: `calc(100vh - ($4xl * 3))`,
            },
          }
        : {
            height: '100%',
            maxHeight: '200px',
          }),
      ...(giveSkillSelector && {
        pt: '$md',
        px: '$md',
        pb: '$2xl',
      }),
    },

    '[cmdk-list-sizer]': {
      '[cmdk-group]': {
        borderTop: '0.5px solid $border',
        py: '$xs',
        '&:first-child': {
          borderTop: 'none',
          pt: 0,
        },
      },
      ...(giveSkillSelector && {
        position: 'relative',
      }),
    },

    '[cmdk-group]': {
      ...(fullScreen
        ? {
            mb: '$sm',
          }
        : {
            mb: 0,
          }),
    },
    '[cmdk-group-heading]': {
      userSelect: 'none',
      fontSize: '$h3',
      color: '$text',
      display: 'flex',
      alignItems: 'center',
      fontWeight: '$semibold',
      padding: '$sm $md',
      ...(fullScreen ? {} : {}),
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
