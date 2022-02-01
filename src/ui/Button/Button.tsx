import type * as Stitches from '@stitches/react';

import { styled } from '../../stitches.config';
import { modifyVariantsForStory } from '../type-utils';

export const Button = styled('button', {
  '& img': {
    paddingRight: '$sm',
  },
  px: '$lg',
  py: '$sm',
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
  textAlign: 'center',
  lineHeight: '$shorter',

  color: 'White',
  variants: {
    color: {
      red: {
        backgroundColor: '$red',
        color: 'white',
        '&:hover': {
          backgroundColor: '$redHover',
        },
      },
      gray: {
        backgroundColor: '$gray400',
        color: 'white',
        '&:hover': {
          backgroundColor: '$lightGray',
        },
      },
    },
    size: {
      large: {
        alignItems: 'center',
        lineHeight: '$tall2',
        fontSize: '$8',
        fontWeight: '$bold',
        textTransform: 'none',
        borderRadius: '$4',
        '& > *': {
          my: 0,
          mx: '$sm',
        },
      },
      medium: {
        fontSize: '$3',
        fontWeight: '$bold',
        lineHeight: '$shorter',
        borderRadius: '$4',
      },
      small: {
        fontSize: '$2',
        fontWeight: '$medium',
        lineHeight: '$shorter',
        borderRadius: '$4',
      },
    },
    variant: {
      wallet: {
        fontSize: '15px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '$text',
        border: 'solid',
        margin: '1.6px 0px',
        padding: '12px 17.6px',
        boxShadow: '0px 4px 6px rgb(181 193 199 / 30%)',
        borderWidth: '2px',
        borderRadius: '13px',
        backgroundColor: '#0000',
        minWidth: '64px',
        '& svg': {
          height: '$lg',
          width: '$lg',
        },
        '&:hover': {
          color: '$selected',
          background: '$third',
        },
        '&:disabled': {
          color: '$text',
          opacity: 0.5,
        },
      },
    },
    fullWidth: {
      true: {
        width: '$full',
      },
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

/* Storybook utility for stitches variant props

NOTE: this can't live in the stories file because the storybook navigator will take a story and will crash
      I can't figure out why it can't be defined without being exported.
*/

type ComponentVariants = Stitches.VariantProps<typeof Button>;
type ComponentProps = ComponentVariants;

export const ButtonStory = modifyVariantsForStory<
  ComponentVariants,
  ComponentProps,
  typeof Button
>(Button);
